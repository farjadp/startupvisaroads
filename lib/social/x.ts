// ============================================================================
// lib/social/x.ts
// One article to both X accounts, each in its own language and shape.
//
// Same two rules as the channel and LinkedIn: nothing throws into the publish
// path, and every attempt leaves a SocialPost row including the skips — a skip
// that leaves no trace is indistinguishable from a system nobody asked to run.
// ============================================================================
import { TwitterApi } from 'twitter-api-v2';
import prisma from '@/lib/prisma';
import { DESTINATIONS, configured, type Destination } from './destinations';
import { xMessage, type XArticle, type XKind } from './x-message';

export type XResult = { destination: string; status: 'posted' | 'failed' | 'skipped'; error?: string; remoteUrl?: string };

async function credential(key: string): Promise<string | undefined> {
  const fromEnv = process.env[key];
  if (fromEnv?.trim()) return fromEnv;
  try {
    return (await prisma.setting.findUnique({ where: { key } }))?.value ?? undefined;
  } catch {
    return undefined;
  }
}

/** The four keys this destination posts with, in the order the client wants. */
function keysFor(d: Destination) {
  const find = (part: string) => d.credentials.find((k) => k.startsWith(part))!;
  return { appKey: find('X_KEY_'), appSecret: find('X_KEYSECRET_'), token: find('X_TOKEN_'), secret: find('X_SECRET_') };
}

async function record(articleId: string, destination: string, kind: XKind, r: XResult) {
  try {
    await prisma.socialPost.create({
      data: {
        articleId,
        destination,
        kind,
        status: r.status,
        error: r.error ?? null,
        remoteUrl: r.remoteUrl ?? null,
        postedAt: r.status === 'posted' ? new Date() : null,
      },
    });
  } catch {
    // The unique constraint firing means this attempt is already recorded.
  }
}

/**
 * Post one article to every X destination that carries its language.
 *
 * The message is built per destination, not once and reused: the two accounts
 * differ in language, in character limit, and in whether they carry a
 * signature, so a shared string would be wrong for at least one of them.
 */
export async function shareToX(article: XArticle & { id: string }, kind: XKind = 'article'): Promise<XResult[]> {
  const targets = DESTINATIONS.filter((d) => d.platform === 'x' && d.locales.includes(article.locale));
  const out: XResult[] = [];

  for (const d of targets) {
    const already = await prisma.socialPost
      .findFirst({ where: { articleId: article.id, destination: d.id, kind, status: 'posted' } })
      .catch(() => null);
    if (already) {
      out.push({ destination: d.id, status: 'skipped', error: 'already posted' });
      continue;
    }

    const values: Record<string, string | undefined> = {};
    for (const k of d.credentials) values[k] = await credential(k);

    if (!configured(d, values)) {
      console.warn(`social/x: ${d.id} is not configured — set ${d.credentials.join(', ')}`);
      const r: XResult = { destination: d.id, status: 'skipped', error: 'not configured' };
      await record(article.id, d.id, kind, r);
      out.push(r);
      continue;
    }

    const k = keysFor(d);
    const text = xMessage(article, d, kind);

    let r: XResult;
    try {
      const client = new TwitterApi({
        appKey: values[k.appKey]!,
        appSecret: values[k.appSecret]!,
        accessToken: values[k.token]!,
        accessSecret: values[k.secret]!,
      });
      const posted = await client.v2.tweet(text);
      r = { destination: d.id, status: 'posted', remoteUrl: posted.data?.id };
    } catch (e) {
      // 403 here is almost always the app still being Read-only, which is
      // worth saying rather than leaving as a bare status code.
      const msg = e instanceof Error ? e.message : String(e);
      const hint = /403/.test(msg) ? ' — check the app has Read and Write permission and the token was minted after that change' : '';
      r = { destination: d.id, status: 'failed', error: `${msg}${hint}`.slice(0, 400) };
      console.error(`social/x: ${d.id} ${kind} failed — ${r.error}`);
    }

    await record(article.id, d.id, kind, r);
    out.push(r);
  }

  return out;
}
