// ============================================================================
// lib/campaign-queue/worker.ts
// Sends a small, bounded batch for each queued campaign. Called from the
// 15-minute /api/cron/sources tick, so it survives deploys: all progress is in
// the database and nothing runs between ticks.
//
// It only touches status = QUEUED, which only an admin action sets. A campaign
// left in SENDING by the old in-process sender is never picked up.
//
// One recipient, in order:
//   1. confirm the campaign is still QUEUED and this tick still holds it
//   2. re-read the contact (unsubscribed or deleted means skip)
//   3. write a CLAIMED log; the unique keys make this the point of no return
//   4. call the provider
//   5. mark the log SENT or FAILED
// A crash between 3 and 5 leaves CLAIMED, which is never retried: at worst one
// person misses this email, and nobody gets it twice.
// ============================================================================
import { randomUUID } from 'crypto';
import type { Campaign } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getMarketingSettings, isUnsubscribed, sendEmail, sendSms } from '@/lib/marketing';
import { assertLinkSigningConfigured } from '@/lib/signed-links';
import { SITE_URL } from '@/lib/seo';
import { suppressionKey } from './address';
import { classifyFailure, type SendFailure } from './failures';
import {
  addressKeyFor,
  channelsFor,
  loadAudience,
  pendingRecipients,
  sendKeyFor,
  type Audience,
  type Channel,
  type PendingRecipient,
} from './recipients';
import { renderCampaignEmail, senderFrom } from './render';
import { computeAllowance, parseSendDays, torontoDayStart, type QueueSchedule } from './schedule';

export const STATUS_QUEUED = 'QUEUED';
export const STATUS_PAUSED = 'PAUSED';
export const LOG_CLAIMED = 'CLAIMED';
/** Every log that may have reached the provider counts against the limits. */
export const ATTEMPT_STATUSES = [LOG_CLAIMED, 'SENT', 'FAILED', 'BOUNCED'];

const DEFAULT_BUDGET_MS = 25_000;
const DEFAULT_SEND_GAP_MS = 600; // stays under Resend's per-second rate limit
const SEND_TIMEOUT_MS = 15_000;
const LEASE_MS = 120_000; // longer than the budget plus one send timeout
const MAX_CONSECUTIVE_FAILURES = 3;

type Settings = Record<string, string | undefined>;

export interface QueueRunResult {
  campaigns: number;
  sent: number;
  failed: number;
  skipped: number;
  paused: string[];
  completed: string[];
}

interface RunContext {
  now: () => Date;
  deadline: number;
  sendGapMs: number;
  settings: Settings;
  result: QueueRunResult;
}

export function scheduleFromCampaign(c: Campaign): QueueSchedule | null {
  const sendDays = parseSendDays(c.sendDays);
  if (!c.dailyLimit || c.dailyLimit < 1 || !c.queuedAt || sendDays.length === 0) return null;
  const hasWindow = c.sendWindowStart !== null && c.sendWindowEnd !== null;
  if (!hasWindow && (c.sendWindowStart !== null || c.sendWindowEnd !== null)) return null;
  return {
    dailyLimit: c.dailyLimit,
    sendDays,
    windowStart: c.sendWindowStart,
    windowEnd: c.sendWindowEnd,
    startAt: c.sendStartAt ?? c.queuedAt,
    queuedAt: c.queuedAt,
  };
}

export function dailyCeiling(settings: Settings, channel: Channel): number {
  const raw = channel === 'EMAIL' ? settings.marketing_max_emails_per_day : settings.marketing_max_sms_per_day;
  const parsed = Number.parseInt(raw ?? '', 10);
  if (Number.isNaN(parsed)) return channel === 'EMAIL' ? 20_000 : 1_000;
  return Math.max(0, parsed);
}

export function countAttemptsToday(now: Date, where: { campaignId?: string; channel: Channel }) {
  return prisma.campaignLog.count({
    where: { ...where, status: { in: ATTEMPT_STATUSES }, sentAt: { gte: torontoDayStart(now) } },
  });
}

/** Why this channel cannot send at all, or null when it can. */
export function channelConfigProblem(channel: Channel, settings: Settings): string | null {
  if (channel === 'EMAIL') {
    if (!settings.marketing_resend_api_key) return 'Resend API key is not configured.';
    try {
      assertLinkSigningConfigured();
    } catch {
      return 'The link signing secret is not configured, so unsubscribe links cannot be built.';
    }
    return null;
  }
  if (!settings.marketing_twilio_sid || !settings.marketing_twilio_token || !settings.marketing_twilio_from) {
    return 'Twilio is not configured.';
  }
  return null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Timed out waiting for the provider; delivery unknown')), ms);
  });
  try {
    return await Promise.race([work, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

async function pause(c: Campaign, reason: string, ctx: RunContext) {
  await prisma.campaign.updateMany({
    where: { id: c.id, status: STATUS_QUEUED },
    data: { status: STATUS_PAUSED, pausedReason: reason.slice(0, 500), leaseId: null, leaseUntil: null },
  });
  ctx.result.paused.push(c.id);
  console.warn(`[campaign-queue] paused ${c.id}: ${reason.slice(0, 200)}`);
}

async function stillOurs(id: string, leaseId: string): Promise<boolean> {
  const row = await prisma.campaign.findUnique({ where: { id }, select: { status: true, leaseId: true } });
  return row?.status === STATUS_QUEUED && row.leaseId === leaseId;
}

/** Fresh read just before sending: the audience list may be seconds old. */
async function mayStillReceive(channel: Channel, r: PendingRecipient): Promise<boolean> {
  const suppressed = await prisma.marketingSuppression.findUnique({
    where: { key: suppressionKey(channel, r.address) },
    select: { key: true },
  });
  if (suppressed) return false;

  const emails = r.rawEmail ? [...new Set([r.rawEmail, r.rawEmail.trim().toLowerCase()])] : [];
  const phones = r.rawPhone ? [...new Set([r.rawPhone, r.address])] : [];
  const rows = await prisma.marketingContact.findMany({
    where: {
      OR: [
        { id: r.contactId },
        ...(emails.length ? [{ email: { in: emails } }] : []),
        ...(channel === 'SMS' && phones.length ? [{ phone: { in: phones } }] : []),
      ],
    },
    select: { id: true, tags: true },
  });
  return rows.some((row) => row.id === r.contactId) && !rows.some((row) => isUnsubscribed(row.tags));
}

async function claim(c: Campaign, channel: Channel, r: PendingRecipient, now: Date): Promise<string | null> {
  try {
    const log = await prisma.campaignLog.create({
      data: {
        campaignId: c.id,
        contactId: r.contactId,
        channel,
        status: LOG_CLAIMED,
        sentAt: now,
        sendKey: sendKeyFor(c.id, channel, r.contactId),
        addressKey: addressKeyFor(c.id, channel, r.address),
      },
    });
    return log.id;
  } catch (e) {
    if ((e as { code?: string }).code === 'P2002') return null;
    throw e;
  }
}

/** Null when the provider accepted the message, otherwise what went wrong. */
async function deliver(c: Campaign, channel: Channel, r: PendingRecipient, logId: string, settings: Settings): Promise<SendFailure | null> {
  try {
    if (channel === 'EMAIL') {
      const sender = senderFrom(settings);
      const result = await withTimeout(
        sendEmail({
          to: r.address,
          subject: c.subject ?? c.name,
          html: renderCampaignEmail({ body: c.body, to: r.address, logId, siteUrl: SITE_URL, settings }),
          fromName: sender.name,
          fromEmail: sender.email,
          apiKey: settings.marketing_resend_api_key as string,
        }),
        SEND_TIMEOUT_MS,
      );
      return result?.error ? classifyFailure(result.error) : null;
    }
    await withTimeout(
      sendSms({
        to: r.address,
        body: c.smsBody ?? '',
        accountSid: settings.marketing_twilio_sid as string,
        authToken: settings.marketing_twilio_token as string,
        from: settings.marketing_twilio_from as string,
      }),
      SEND_TIMEOUT_MS,
    );
    return null;
  } catch (e) {
    return classifyFailure(e);
  }
}

async function tooManyFailuresInARow(campaignId: string, channel: Channel): Promise<boolean> {
  const recent = await prisma.campaignLog.findMany({
    where: { campaignId, channel, status: { in: ['SENT', 'FAILED'] } },
    orderBy: { sentAt: 'desc' },
    take: MAX_CONSECUTIVE_FAILURES,
    select: { status: true },
  });
  return recent.length === MAX_CONSECUTIVE_FAILURES && recent.every((l) => l.status === 'FAILED');
}

/** Returns how many recipients are finished with, and whether to stop the campaign. */
async function sendBatch(
  c: Campaign,
  channel: Channel,
  pending: PendingRecipient[],
  allowance: number,
  leaseId: string,
  ctx: RunContext,
): Promise<{ handled: number; stop: boolean }> {
  let handled = 0;
  let attempts = 0;

  for (const recipient of pending) {
    if (attempts >= allowance || Date.now() >= ctx.deadline) break;
    // Wait before the checks, so nothing goes stale between claim and send.
    if (attempts > 0 && ctx.sendGapMs > 0) await sleep(ctx.sendGapMs);
    if (!(await stillOurs(c.id, leaseId))) return { handled, stop: true };

    if (!(await mayStillReceive(channel, recipient))) {
      handled++;
      ctx.result.skipped++;
      continue;
    }

    const logId = await claim(c, channel, recipient, ctx.now());
    if (!logId) {
      handled++;
      ctx.result.skipped++;
      continue;
    }

    attempts++;
    const failure = await deliver(c, channel, recipient, logId, ctx.settings);

    if (!failure) {
      await prisma.campaignLog.update({ where: { id: logId }, data: { status: 'SENT' } });
      handled++;
      ctx.result.sent++;
      continue;
    }

    if (failure.definitelyNotSent) {
      // The provider refused it, so this person stays in the queue for the resume.
      await prisma.campaignLog.delete({ where: { id: logId } });
    } else {
      await prisma.campaignLog.update({ where: { id: logId }, data: { status: 'FAILED', error: failure.message } });
      handled++;
      ctx.result.failed++;
    }

    if (failure.systemic) {
      await pause(c, failure.message, ctx);
      return { handled, stop: true };
    }
    if (await tooManyFailuresInARow(c.id, channel)) {
      await pause(c, `${MAX_CONSECUTIVE_FAILURES} sends failed in a row. Last error: ${failure.message}`, ctx);
      return { handled, stop: true };
    }
  }
  return { handled, stop: false };
}

async function processHeldCampaign(c: Campaign, schedule: QueueSchedule, leaseId: string, ctx: RunContext) {
  const now = ctx.now();
  const channels = channelsFor(c.type);
  const allowances = new Map<Channel, number>();

  for (const channel of channels) {
    const [own, everyone] = await Promise.all([
      countAttemptsToday(now, { campaignId: c.id, channel }),
      countAttemptsToday(now, { channel }),
    ]);
    const globalLeft = dailyCeiling(ctx.settings, channel) - everyone;
    allowances.set(channel, Math.max(0, Math.min(computeAllowance(schedule, now, own), globalLeft)));
  }
  if (![...allowances.values()].some((n) => n > 0)) return;

  const audience: Audience = await loadAudience(c.id);
  let left = 0;

  for (const channel of channels) {
    const pending = pendingRecipients(c.id, channel, audience);
    const allowance = allowances.get(channel) ?? 0;
    if (pending.length === 0) continue;
    if (allowance === 0) {
      left += pending.length;
      continue;
    }
    const problem = channelConfigProblem(channel, ctx.settings);
    if (problem) {
      await pause(c, problem, ctx);
      return;
    }
    const { handled, stop } = await sendBatch(c, channel, pending, allowance, leaseId, ctx);
    if (stop) return;
    left += pending.length - handled;
  }

  if (left === 0) {
    const done = await prisma.campaign.updateMany({
      where: { id: c.id, status: STATUS_QUEUED, leaseId },
      data: { status: 'DONE', sentAt: ctx.now(), leaseId: null, leaseUntil: null },
    });
    if (done.count === 1) ctx.result.completed.push(c.id);
  }
}

async function processCampaign(c: Campaign, ctx: RunContext) {
  const schedule = scheduleFromCampaign(c);
  if (!schedule) return;

  // The atomic claim: of any overlapping ticks, exactly one gets this row.
  const now = ctx.now();
  const leaseId = randomUUID();
  const held = await prisma.campaign.updateMany({
    where: { id: c.id, status: STATUS_QUEUED, OR: [{ leaseUntil: null }, { leaseUntil: { lt: now } }] },
    data: { leaseId, leaseUntil: new Date(now.getTime() + LEASE_MS) },
  });
  if (held.count !== 1) return;

  ctx.result.campaigns++;
  try {
    await processHeldCampaign(c, schedule, leaseId, ctx);
  } finally {
    await prisma.campaign.updateMany({ where: { id: c.id, leaseId }, data: { leaseId: null, leaseUntil: null } });
  }
}

export async function runCampaignQueue(
  opts: { now?: () => Date; budgetMs?: number; sendGapMs?: number } = {},
): Promise<QueueRunResult> {
  const result: QueueRunResult = { campaigns: 0, sent: 0, failed: 0, skipped: 0, paused: [], completed: [] };
  const deadline = Date.now() + (opts.budgetMs ?? DEFAULT_BUDGET_MS);

  const campaigns = await prisma.campaign.findMany({
    where: { status: STATUS_QUEUED, dailyLimit: { not: null }, queuedAt: { not: null } },
    orderBy: { queuedAt: 'asc' },
  });
  if (campaigns.length === 0) return result;

  const ctx: RunContext = {
    now: opts.now ?? (() => new Date()),
    deadline,
    sendGapMs: opts.sendGapMs ?? DEFAULT_SEND_GAP_MS,
    settings: await getMarketingSettings(),
    result,
  };

  for (const campaign of campaigns) {
    if (Date.now() >= deadline) break;
    try {
      await processCampaign(campaign, ctx);
    } catch (e) {
      console.error(`[campaign-queue] ${campaign.id} failed this tick`, e);
    }
  }
  return result;
}
