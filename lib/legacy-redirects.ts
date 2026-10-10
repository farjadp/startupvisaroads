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
};

/** A withdrawn article's URL -> its replacement; null otherwise. */
export function retiredArticleTarget(pathname: string): string | null {
  return RETIRED_ARTICLES[pathname.replace(/\/+$/, '')] ?? null;
}
