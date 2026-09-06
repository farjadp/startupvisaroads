// ============================================================================
// lib/social/telegram.ts
// Sending to the channel, and recording that it happened.
//
// Two rules this file exists to hold:
//
// 1. A misconfigured channel must never stop an article publishing. Every
//    failure path returns a result; nothing throws into the publish path.
// 2. Every attempt leaves a row, including the ones that did nothing. A skip
//    that leaves no trace is indistinguishable from a system that was never
//    asked to run, which is how three separate integrations in this repo sat
//    silently inert for months.
// ============================================================================
import prisma from '@/lib/prisma';
import { DESTINATIONS, configured, type Destination } from './destinations';
import { articleMessage, shortMessage, insightMessage, type PostableArticle } from './telegram-message';

export type SendKind = 'article' | 'short' | 'insight';
export type SendResult = { status: 'posted' | 'failed' | 'skipped'; error?: string; remoteUrl?: string };

const TELEGRAM = 'https://api.telegram.org';

async function credentials(d: Destination): Promise<Record<string, string | undefined>> {
  const out: Record<string, string | undefined> = {};
  for (const key of d.credentials) {
    let value = process.env[key];
    if (!value) {
      try {
        value = (await prisma.setting.findUnique({ where: { key } }))?.value ?? undefined;
      } catch {
        // A database that cannot answer is not a reason to throw into publish.
      }
    }
    out[key] = value;
  }
  return out;
}

/** Post to the channel. Never throws. */
async function post(token: string, chatId: string, text: string, photo?: string | null): Promise<SendResult> {
  const endpoint = photo ? 'sendPhoto' : 'sendMessage';
  // No parse_mode anywhere: the text is built from model output and article
  // bodies, and markup that cannot execute cannot be injected.
  const body = photo
    ? { chat_id: chatId, photo, caption: text }
    : { chat_id: chatId, text, disable_web_page_preview: false };
  try {
    const res = await fetch(`${TELEGRAM}/bot${token}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => null)) as { ok?: boolean; description?: string; result?: { message_id?: number } } | null;
    if (!res.ok || !json?.ok) return { status: 'failed', error: `telegram ${res.status}${json?.description ? `: ${json.description}` : ''}` };
    return { status: 'posted', remoteUrl: json.result?.message_id ? String(json.result.message_id) : undefined };
  } catch (e) {
    return { status: 'failed', error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Send one article to the channel in one of its two shapes, and record the
 * attempt. The unique constraint on SocialPost is the duplicate guard; this
 * checks first only so the common case does not rely on catching an error.
 */
export async function sendToChannel(
  article: PostableArticle & { id: string; coverImage?: string | null; insight?: string | null },
  kind: SendKind,
  photoUrl?: string | null,
): Promise<SendResult> {
  const d = DESTINATIONS.find((x) => x.platform === 'telegram');
  if (!d) return { status: 'skipped', error: 'no telegram destination' };
  if (!d.locales.includes(article.locale)) {
    return { status: 'skipped', error: `channel does not carry ${article.locale}` };
  }

  const record = async (r: SendResult) => {
    try {
      await prisma.socialPost.create({
        data: {
          articleId: article.id,
          destination: d.id,
          kind,
          status: r.status,
          error: r.error ?? null,
          remoteUrl: r.remoteUrl ?? null,
          postedAt: r.status === 'posted' ? new Date() : null,
        },
      });
    } catch {
      // Either the unique constraint fired — which means it was already sent
      // and the row we wanted exists — or the database is unreachable. Neither
      // is worth failing a publish over.
    }
    return r;
  };

  const already = await prisma.socialPost
    .findFirst({ where: { articleId: article.id, destination: d.id, kind, status: 'posted' } })
    .catch(() => null);
  if (already) return { status: 'skipped', error: 'already posted' };

  const creds = await credentials(d);
  if (!configured(d, creds)) {
    console.warn(`social/telegram: ${d.id} is not configured — set ${d.credentials.join(' and ')}`);
    return record({ status: 'skipped', error: 'not configured' });
  }

  const text =
    kind === 'article'
      ? articleMessage(article)
      : kind === 'insight'
        ? insightMessage(article.insight ?? '', article.locale)
        : shortMessage(article);
  if (!text.trim()) return record({ status: 'skipped', error: 'nothing to say' });

  const result = await post(
    creds.TELEGRAM_CHANNEL_BOT_TOKEN!,
    creds.TELEGRAM_CHANNEL_ID!,
    text,
    kind === 'article' ? article.coverImage : (photoUrl ?? null),
  );
  if (result.status === 'failed') console.error(`social/telegram: ${d.id} ${kind} failed — ${result.error}`);
  return record(result);
}
