// ============================================================================
// lib/campaign-queue/admin.ts
// What the admin screen can do to the queue. Queueing is the only way into
// status QUEUED, and it needs explicit settings and a confirmed recipient
// count, so an interrupted campaign stays still until someone resumes it.
// Callers check the admin session first.
// ============================================================================
import type { Campaign } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getMarketingSettings } from '@/lib/marketing';
import { channelsFor, loadAudience, pendingRecipients, type Channel } from './recipients';
import { senderFrom } from './render';
import {
  estimateFinishDay,
  minutesToClock,
  nextSendTime,
  parseSendDays,
  validateQueueSettings,
  type QueueSchedule,
  type QueueSettings,
} from './schedule';
import {
  channelConfigProblem,
  countAttemptsToday,
  dailyCeiling,
  scheduleFromCampaign,
  STATUS_PAUSED,
  STATUS_QUEUED,
} from './worker';

export type ActionResult<T = unknown> = ({ ok: true } & T) | { ok: false; status: number; error: string };

const QUEUEABLE = ['DRAFT', 'SCHEDULED', STATUS_PAUSED, 'SENDING'];
/** While these hold, the campaign's content and groups cannot be edited or deleted. */
export const LOCKED_STATUSES = [STATUS_QUEUED, STATUS_PAUSED, 'SENDING'];

const refuse = (status: number, error: string) => ({ ok: false as const, status, error });

async function remainingFor(c: Campaign): Promise<{ total: number; largestChannel: number }> {
  const audience = await loadAudience(c.id);
  const counts = channelsFor(c.type).map((ch) => pendingRecipients(c.id, ch, audience).length);
  return { total: counts.reduce((a, b) => a + b, 0), largestChannel: Math.max(0, ...counts) };
}

async function attemptedToday(c: Campaign, now: Date): Promise<number> {
  const counts = await Promise.all(
    channelsFor(c.type).map((channel: Channel) => countAttemptsToday(now, { campaignId: c.id, channel })),
  );
  return Math.max(0, ...counts);
}

function ceilingFor(c: Campaign, settings: Record<string, string | undefined>): number {
  return Math.min(...channelsFor(c.type).map((ch) => dailyCeiling(settings, ch)));
}

const toSchedule = (s: QueueSettings, now: Date): QueueSchedule => ({ ...s, queuedAt: now });

export async function previewCampaignQueue(id: string, input: unknown, now = new Date()) {
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return refuse(404, 'Campaign not found');

  const settings = await getMarketingSettings();
  const checked = validateQueueSettings(input, { now, ceiling: ceilingFor(campaign, settings) });
  if (!checked.ok) return refuse(400, checked.error);

  const [{ total, largestChannel }, attempted] = await Promise.all([
    remainingFor(campaign),
    attemptedToday(campaign, now),
  ]);
  const schedule = toSchedule(checked.settings, now);
  const sender = senderFrom(settings);

  return {
    ok: true as const,
    preview: {
      remaining: total,
      dailyLimit: checked.settings.dailyLimit,
      sendDays: checked.settings.sendDays,
      windowStart: minutesToClock(checked.settings.windowStart),
      windowEnd: minutesToClock(checked.settings.windowEnd),
      firstSendAt: total > 0 ? nextSendTime(schedule, now, attempted) : null,
      estimatedFinish: estimateFinishDay(schedule, largestChannel, now, attempted),
      sender: `${sender.name} <${sender.email}>`,
      senderIsFallback: sender.isFallback,
      highVolume: checked.highVolume,
    },
  };
}

export async function queueCampaign(id: string, input: unknown, now = new Date()): Promise<ActionResult<{ status: string }>> {
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return refuse(404, 'Campaign not found');
  if (!QUEUEABLE.includes(campaign.status)) return refuse(409, `A ${campaign.status} campaign cannot be queued.`);

  const channels = channelsFor(campaign.type);
  if (channels.length === 0) return refuse(422, 'This campaign has no valid type.');

  const settings = await getMarketingSettings();
  const checked = validateQueueSettings(input, { now, ceiling: ceilingFor(campaign, settings) });
  if (!checked.ok) return refuse(400, checked.error);

  const v = (input ?? {}) as Record<string, unknown>;
  if (v.confirm !== true) return refuse(400, 'Confirm the send first.');
  if (checked.highVolume && v.acknowledgeHighVolume !== true) {
    return refuse(400, 'More than 50 a day on an unwarmed domain needs an explicit confirmation.');
  }

  for (const channel of channels) {
    const problem = channelConfigProblem(channel, settings);
    if (problem) return refuse(422, problem);
  }

  const { total } = await remainingFor(campaign);
  if (v.expectedRemaining !== total) {
    return refuse(409, `The recipient count changed to ${total}. Review it and confirm again.`);
  }

  // Compare-and-set on the status we read, so two clicks cannot both land.
  const where = { id, status: campaign.status };
  if (total === 0) {
    const closed = await prisma.campaign.updateMany({
      where,
      data: { status: 'DONE', sentAt: campaign.sentAt ?? now, pausedReason: null, leaseId: null, leaseUntil: null },
    });
    return closed.count === 1 ? { ok: true, status: 'DONE' } : refuse(409, 'The campaign just changed. Reload the page.');
  }

  const s = checked.settings;
  const queued = await prisma.campaign.updateMany({
    where,
    data: {
      status: STATUS_QUEUED,
      dailyLimit: s.dailyLimit,
      sendStartAt: s.startAt,
      sendDays: s.sendDays.join(','),
      sendWindowStart: s.windowStart,
      sendWindowEnd: s.windowEnd,
      queuedAt: now,
      pausedReason: null,
      leaseId: null,
      leaseUntil: null,
    },
  });
  return queued.count === 1 ? { ok: true, status: STATUS_QUEUED } : refuse(409, 'The campaign just changed. Reload the page.');
}

export async function pauseCampaign(id: string): Promise<ActionResult<{ status: string }>> {
  const paused = await prisma.campaign.updateMany({
    where: { id, status: STATUS_QUEUED },
    data: { status: STATUS_PAUSED, pausedReason: null },
  });
  return paused.count === 1 ? { ok: true, status: STATUS_PAUSED } : refuse(409, 'Only a queued campaign can be paused.');
}

export type QueueState = 'DRAFT' | 'SCHEDULED' | 'QUEUED' | 'PAUSED' | 'INTERRUPTED' | 'DONE' | 'FAILED';

export interface CampaignQueueSummary {
  state: QueueState;
  sent: number;
  failed: number;
  unconfirmed: number;
  remaining: number;
  opened: number;
  clicked: number;
  attemptedToday: number;
  nextSendAt: Date | null;
  estimatedFinish: string | null;
  pausedReason: string | null;
  sender: string;
  senderIsFallback: boolean;
  settings: {
    dailyLimit: number | null;
    sendDays: number[];
    windowStart: string | null;
    windowEnd: string | null;
  };
}

/** True counts from the database. Nothing here is derived from a capped list. */
export async function getCampaignQueueSummary(id: string, now = new Date()): Promise<CampaignQueueSummary | null> {
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return null;

  const count = (where: Record<string, unknown>) => prisma.campaignLog.count({ where: { campaignId: id, ...where } });
  const [sent, failed, unconfirmed, opened, clicked, remaining, attempted, settings] = await Promise.all([
    count({ status: 'SENT' }),
    count({ status: 'FAILED' }),
    count({ status: 'CLAIMED' }),
    count({ openCount: { gt: 0 } }),
    count({ clickCount: { gt: 0 } }),
    remainingFor(campaign),
    attemptedToday(campaign, now),
    getMarketingSettings(),
  ]);

  const state = (campaign.status === 'SENDING' ? 'INTERRUPTED' : campaign.status) as QueueState;
  const schedule = state === 'QUEUED' ? scheduleFromCampaign(campaign) : null;
  const sender = senderFrom(settings);

  return {
    state,
    sent,
    failed,
    unconfirmed,
    remaining: remaining.total,
    opened,
    clicked,
    attemptedToday: attempted,
    nextSendAt: schedule && remaining.total > 0 ? nextSendTime(schedule, now, attempted) : null,
    estimatedFinish: schedule ? estimateFinishDay(schedule, remaining.largestChannel, now, attempted) : null,
    pausedReason: campaign.pausedReason,
    sender: `${sender.name} <${sender.email}>`,
    senderIsFallback: sender.isFallback,
    settings: {
      dailyLimit: campaign.dailyLimit,
      sendDays: parseSendDays(campaign.sendDays),
      windowStart: minutesToClock(campaign.sendWindowStart),
      windowEnd: minutesToClock(campaign.sendWindowEnd),
    },
  };
}
