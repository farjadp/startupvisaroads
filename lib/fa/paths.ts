// ============================================================================
// lib/fa/paths.ts
// The Persian site's path allowlist — the one place that answers
// "does this page exist in Persian?".
//
// /fa is NOT a mirror of /en. Sitemap, hreflang pairing, the middleware
// redirect layer and the autopilot link inventory all read this list, so a
// page cannot be advertised in one place and 404 (or bounce to English) in
// another. Adding a Persian page means adding it here first.
// ============================================================================

/** Persian paths, locale-agnostic (no `/fa` prefix). `''` is the home page. */
export const FA_PATHS = [
  '',
  '/canada-startup-visa',
  '/canada-startup-visa/requirements',
  '/canada-startup-visa/cost',
  '/canada-startup-visa/designated-organizations',
  '/pnp',
  '/usa-eb2-niw',
  '/which-path',
  '/mentorship',
  '/faq',
  '/blog',
  '/about',
  '/contact',
  '/webinar',
] as const;

export type FaPath = (typeof FA_PATHS)[number];

const FA_SET: ReadonlySet<string> = new Set(FA_PATHS);

/** Strip one trailing slash so `/faq/` and `/faq` are the same path. */
function normalise(path: string): string {
  if (!path || path === '/') return '';
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

/** Does this locale-agnostic path exist on the Persian site? */
export function isFaPath(path: string): boolean {
  return FA_SET.has(normalise(path));
}

/**
 * Persian path → the English path it forms an hreflang pair with, or null
 * when the page is Persian-only. Only paired paths may emit hreflang
 * alternates; an unpaired Persian page that advertises an English twin sends
 * Google to a page that does not exist.
 */
export const FA_PAIRED: Record<FaPath, string | null> = {
  '': '',
  '/canada-startup-visa': '/startup-visa-canada',
  '/canada-startup-visa/requirements': null,
  '/canada-startup-visa/cost': null,
  '/canada-startup-visa/designated-organizations': null,
  '/pnp': '/pnp',
  '/usa-eb2-niw': '/usa/eb2-niw',
  '/which-path': null,
  '/mentorship': '/mentorship',
  '/faq': null,
  '/blog': '/blog',
  '/about': '/about',
  '/contact': '/contact',
  '/webinar': '/webinar',
};
