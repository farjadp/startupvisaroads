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
export type PickOptions = {
  reuseDays?: number;
  /**
   * 'oldest' resurfaces what a reader is least likely to have seen — right for
   * the quiet-day channel post. 'newest' is right for a daily tweet, which
   * should reflect what the site is publishing now; oldest-first on this
   * database surfaced legacy articles about another company's product, which
   * is the worst possible thing to lead an account with.
   */
  prefer?: 'oldest' | 'newest';
  /** Only consider articles in this locale, so one language cannot starve another. */
  locale?: 'en' | 'fa';
};

export function pickForShortPost(
  articles: Candidate[],
  priorPosts: PriorPost[],
  now: Date,
  optionsOrReuseDays: PickOptions | number = {},
): Candidate | null {
  const options: PickOptions =
    typeof optionsOrReuseDays === 'number' ? { reuseDays: optionsOrReuseDays } : optionsOrReuseDays;
  const reuseDays = options.reuseDays ?? REUSE_DAYS;
  const cutoff = new Date(now.getTime() - reuseDays * 86_400_000);
  const recentlyUsed = new Set(
    priorPosts.filter((p) => p.createdAt >= cutoff).map((p) => p.articleId),
  );

  const eligible = articles
    .filter((a) => (options.locale ? a.locale === options.locale : true))
    // A post with no takeaway and no excerpt would be a bare title and a link,
    // which is the feed-shaped post the short form exists to avoid.
    .filter((a) => Boolean((a.keyTakeaway ?? a.excerpt ?? '').trim()))
    .filter((a) => !recentlyUsed.has(a.id))
    .sort((a, b) =>
      options.prefer === 'newest'
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : a.createdAt.getTime() - b.createdAt.getTime(),
    );

  return eligible[0] ?? null;
}

/**
 * Why `pickForShortPost` came back empty, in words.
 *
 * Production reported "every article was used within 45 days" against a
 * database that had no prior posts and no Persian articles at all. A
 * diagnostic naming the wrong cause is worse than no diagnostic: it sends the
 * next person looking in the wrong place, which is a whole afternoon.
 */
export function explainNoPick(
  articles: Candidate[],
  priorPosts: PriorPost[],
  now: Date,
  reuseDays: number = REUSE_DAYS,
): string {
  if (!articles.length) return 'no published article in this locale yet';

  const quotable = articles.filter((a) => Boolean((a.keyTakeaway ?? a.excerpt ?? '').trim()));
  if (!quotable.length) return 'no article has a quotable takeaway or excerpt';

  const cutoff = new Date(now.getTime() - reuseDays * 86_400_000);
  const used = new Set(priorPosts.filter((p) => p.createdAt >= cutoff).map((p) => p.articleId));
  if (quotable.every((a) => used.has(a.id))) return `every article was used within ${reuseDays} days`;

  return 'nothing eligible, for a reason this function does not know about';
}
