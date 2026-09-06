// ============================================================================
// lib/social/pick-article.ts
// Which article, if any, the channel should talk about on a quiet day.
//
// The channel posts an article when one publishes. On the days nothing
// publishes it posts one idea from an older piece instead, so the channel
// stays alive without ever posting twice about the same article in a row.
//
// Pure: the caller supplies the articles, the prior posts and the clock.
// ============================================================================

export type Candidate = {
  id: string;
  slug: string;
  title: string;
  locale: 'en' | 'fa';
  keyTakeaway?: string | null;
  excerpt?: string | null;
  createdAt: Date;
};

export type PriorPost = { articleId: string; createdAt: Date };

/** How long before an article may be used for a short post again. */
export const REUSE_DAYS = 45;

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Whether today is a quiet day.
 *
 * Compares calendar days rather than a rolling 24 hours on purpose: an
 * article published at 23:50 would otherwise suppress the short post for the
 * whole of the following day too.
 */
export function shouldPostShort(articles: Candidate[], now: Date): boolean {
  const today = dayKey(now);
  return !articles.some((a) => dayKey(a.createdAt) === today);
}

/**
 * The article that has gone longest without attention and still has something
 * quotable in it, or null when everything has been used recently.
 *
 * Preferring the oldest is deliberate. A channel that keeps resurfacing last
 * week's piece reads as automated, and an older article is the one a reader is
 * least likely to have seen.
 */
export function pickForShortPost(
  articles: Candidate[],
  priorPosts: PriorPost[],
  now: Date,
  reuseDays: number = REUSE_DAYS,
): Candidate | null {
  const cutoff = new Date(now.getTime() - reuseDays * 86_400_000);
  const recentlyUsed = new Set(
    priorPosts.filter((p) => p.createdAt >= cutoff).map((p) => p.articleId),
  );

  const eligible = articles
    // A post with no takeaway and no excerpt would be a bare title and a link,
    // which is the feed-shaped post the short form exists to avoid.
    .filter((a) => Boolean((a.keyTakeaway ?? a.excerpt ?? '').trim()))
    .filter((a) => !recentlyUsed.has(a.id))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return eligible[0] ?? null;
}
