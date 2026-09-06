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
  '/pnp/new-brunswick',
  '/pnp/nova-scotia',
  '/europe/finland',
  '/europe/denmark',
  '/europe/netherlands',
  '/europe/estonia',
  '/usa-eb2-niw',
  '/which-path',
  '/mentorship',
  '/faq',
  '/blog',
  '/about',
  '/contact',
  '/team',
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
  '/pnp/new-brunswick': '/pnp/new-brunswick',
  '/pnp/nova-scotia': '/pnp/nova-scotia',
  '/europe/finland': '/europe/finland',
  '/europe/denmark': '/country/denmark',
  '/europe/netherlands': '/europe/netherlands',
  '/europe/estonia': null,
  '/usa-eb2-niw': '/usa/eb2-niw',
  '/which-path': null,
  '/mentorship': '/mentorship',
  '/faq': null,
  '/blog': '/blog',
  '/about': '/about',
  '/contact': '/contact',
  '/team': '/team',
  '/webinar': '/webinar',
};

/** English path -> Persian path, derived from FA_PAIRED so there is one table. */
export const EN_TO_FA: ReadonlyMap<string, string> = new Map(
  (Object.entries(FA_PAIRED) as [FaPath, string | null][])
    .filter((e): e is [FaPath, string] => e[1] !== null)
    .map(([fa, en]) => [en, fa]),
);

/**
 * Where the language switcher should send the reader.
 *
 * The two sites do not mirror each other, so "same path, other locale" is
 * wrong more often than it is right: it would 301 straight back (the reader
 * clicks FA and nothing happens) or 404. Paired pages switch to their twin;
 * everything else lands on the other site's home. Blog articles are
 * single-locale, so they go to the other site's blog index.
 */
export function localeSwitchTarget(path: string, to: 'en' | 'fa'): string {
  const clean = normalise(path);
  if (clean.startsWith('/blog/')) return '/blog';
  if (to === 'fa') return EN_TO_FA.get(clean) ?? (isFaPath(clean) ? clean : '');
  return FA_PAIRED[clean as FaPath] ?? '';
}
