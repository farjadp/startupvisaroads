// ============================================================================
// lib/social/linkedin.ts
// One article, three LinkedIn destinations.
//
// The poster in lib/socials.ts does the whole UGC flow correctly — register
// the upload, PUT the binary, create the post — but assumed a single author.
// This owns the part that differs per destination: which URN, whether the
// destination carries this article's language, and recording the attempt.
//
// Same two rules as the channel: nothing throws into the publish path, and
// every attempt leaves a row, including the skips.
// ============================================================================
import prisma from '@/lib/prisma';
import { shareToLinkedin } from '@/lib/socials';
import { DESTINATIONS, configured, type Destination } from './destinations';

export type LinkedinArticle = {
  id: string;
  title: string;
  slug: string;
  locale: 'en' | 'fa';
};

export type DestinationResult = { destination: string; status: 'posted' | 'failed' | 'skipped'; error?: string };

async function credential(key: string): Promise<string | undefined> {
  const fromEnv = process.env[key];
  if (fromEnv?.trim()) return fromEnv;
  try {
    return (await prisma.setting.findUnique({ where: { key } }))?.value ?? undefined;
  } catch {
    return undefined;
  }
}

/** The URN a destination posts as — a person for the profile, an organization for a page. */
function urnKey(d: Destination): string {
  return d.credentials.find((k) => k.includes('URN')) ?? 'LINKEDIN_AUTHOR_URN';
}

async function record(articleId: string, destination: string, status: DestinationResult['status'], error?: string) {
  try {
    await prisma.socialPost.create({
      data: {
        articleId,
        destination,
        kind: 'article',
        status,
        error: error ?? null,
        postedAt: status === 'posted' ? new Date() : null,
      },
    });
  } catch {
    // The unique constraint firing means the attempt is already recorded.
  }
}

/**
 * Post one article to every LinkedIn destination that carries its language.
 *
 * The caption and image are built once by the caller and reused: three
 * destinations are the same article, and regenerating the caption per
 * destination would spend three times the tokens to produce three slightly
 * different posts from the same brand on the same day.
 */
export async function shareToLinkedinDestinations(
  article: LinkedinArticle,
  caption: string,
  url: string,
  imageInfo: { buffer: Buffer; mimeType: string } | null,
): Promise<DestinationResult[]> {
  const targets = DESTINATIONS.filter((d) => d.platform === 'linkedin' && d.locales.includes(article.locale));
  const results: DestinationResult[] = [];

  for (const d of targets) {
    const already = await prisma.socialPost
      .findFirst({ where: { articleId: article.id, destination: d.id, kind: 'article', status: 'posted' } })
      .catch(() => null);
    if (already) {
      results.push({ destination: d.id, status: 'skipped', error: 'already posted' });
      continue;
    }

    const values: Record<string, string | undefined> = {};
    for (const k of d.credentials) values[k] = await credential(k);

    if (!configured(d, values)) {
      console.warn(`social/linkedin: ${d.id} is not configured — set ${d.credentials.join(' and ')}`);
      await record(article.id, d.id, 'skipped', 'not configured');
      results.push({ destination: d.id, status: 'skipped', error: 'not configured' });
      continue;
    }

    let ok = false;
    let error: string | undefined;
    try {
      ok = await shareToLinkedin(article.title, caption, url, imageInfo, {
        token: values.LINKEDIN_ACCESS_TOKEN,
        authorUrn: values[urnKey(d)],
      });
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    if (!ok && !error) error = 'linkedin rejected the post';
    if (!ok) console.error(`social/linkedin: ${d.id} failed — ${error}`);

    await record(article.id, d.id, ok ? 'posted' : 'failed', error);
    results.push({ destination: d.id, status: ok ? 'posted' : 'failed', error });
  }

  return results;
}
