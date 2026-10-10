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
