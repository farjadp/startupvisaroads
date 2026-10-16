// ============================================================================
// lib/legacy-redirects.ts
// Paths with no locale prefix — /blog/<slug>, /pnp/pei, /country/finland —
// are what the site used before it had /en and /fa. next-intl answers them
// with a 307, which tells Google the move is temporary, so the old URL keeps
// its place in the index and the /en page never inherits its signals. Search
// Console (Jul–Oct 2026) showed the unprefixed Denmark guide as the site's
// most-seen page. These go to English with a 301 instead.
//
// The root is left to next-intl: "/" is a real entry point, and choosing
// between /en and /fa there is locale detection, not a legacy redirect.
// ============================================================================
import type { Prisma } from '@prisma/client';
import { PRUNE_GONE, PRUNE_MERGED } from './blog-prune';

/** Root-level routes that are not pages under a locale. */
const LEAVE_ALONE = ['/admin', '/icon', '/apple-icon'];

/** `/blog/x` -> `/en/blog/x`; null when the request should proceed. */
export function unprefixedTarget(pathname: string): string | null {
  if (pathname === '' || pathname === '/') return null;
  if (/^\/(en|fa)(\/|$)/.test(pathname)) return null;
  if (LEAVE_ALONE.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return `/en${pathname}`;
}

/**
 * Articles withdrawn for being wrong, and the article that replaces each.
 * Both settlement-funds pieces (autopilot, Sep 2026) invented a six-month
 * statement rule and a three-to-six-month holding period for Denmark and
 * Finland; neither appears on nyidanmark.dk or migri.fi. Until the corrected
 * article is published they go to the verified Finland guide, whose funds
 * section is written against Migri; point them at the new article then.
 */
const RETIRED_ARTICLES: Record<string, string> = {
  '/fa/blog/startup-visa-settlement-funds-proof-from-iranian-account': '/fa/europe/finland',
  '/fa/blog/startup-visa-settlement-funds-iranian-bank-account-1': '/fa/europe/finland',
  // The other two versions of the same article (6 and 9 Sep 2026), withdrawn
  // on 13 Oct 2026 for the same reason: both present "three to six months of
  // statements" and a holding period as the rule ("officers' practice is at
  // least three months"), and both share one title, so they also competed
  // for the same query.
  '/fa/blog/startup-visa-settlement-funds-iranian-bank-account': '/fa/europe/finland',
  '/fa/blog/startup-visa-settlement-funds-proof-iranian-bank-account': '/fa/europe/finland',
  // A June 2026 guide that describes the Start-Up Visa as open, with an
  // application walkthrough. The programme was paused on 30 June 2026; the
  // status page owns the query now.
  '/en/blog/comprehensive-guide-to-the-canada-startup-visa-requirements-processes-and-insights': '/en/startup-visa-canada',
};

/** Withdrawn for being wrong, plus the October 2026 blog prune (lib/blog-prune.ts). */
const REDIRECTED_ARTICLES: Record<string, string> = { ...RETIRED_ARTICLES, ...PRUNE_MERGED };

/**
 * Locale-prefixed paths of every article that no longer renders: redirected
 * or gone. Nothing may link to or list these — the sitemap, the blog index,
 * categories, RSS, related posts and the writer's link inventory all skip them.
 */
export const RETIRED_ARTICLE_PATHS: ReadonlySet<string> = new Set([...Object.keys(REDIRECTED_ARTICLES), ...PRUNE_GONE]);

/** A withdrawn article's URL -> its replacement; null otherwise. */
export function retiredArticleTarget(pathname: string): string | null {
  return REDIRECTED_ARTICLES[pathname.replace(/\/+$/, '')] ?? null;
}

/** True for an off-topic article taken down with no replacement (answers 410). */
export function isGoneArticle(pathname: string): boolean {
  return PRUNE_GONE.has(pathname.replace(/\/+$/, ''));
}

function slugsFor(locale: 'en' | 'fa'): string[] {
  const prefix = `/${locale}/blog/`;
  return [...RETIRED_ARTICLE_PATHS].filter((p) => p.startsWith(prefix)).map((p) => p.slice(prefix.length));
}

/**
 * A Prisma `where` fragment that excludes withdrawn articles. The rows stay
 * PUBLISHED in the database (restoring one is a one-line change), so every
 * public query combines this with its own filter: `AND: [NOT_WITHDRAWN]`.
 */
export const NOT_WITHDRAWN: Prisma.ArticleWhereInput = {
  NOT: {
    OR: [
      { locale: 'en', slug: { in: slugsFor('en') } },
      { locale: 'fa', slug: { in: slugsFor('fa') } },
    ],
  },
};
