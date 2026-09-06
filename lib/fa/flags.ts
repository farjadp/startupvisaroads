// ============================================================================
// lib/fa/flags.ts
// Which national flag belongs to which Persian guide.
//
// Matched on the guide's own path, so no content module has to declare it —
// the same way the eligibility calculator finds its rule.
//
// No flag here is drawn from memory. A national symbol rendered nearly
// right, on a page asking people to trust us with their emigration, is worse
// than no symbol at all. The four European flags are plain geometry at their
// legislated band ratios; the Canadian maple leaf is not, so its path is the
// official Pantone artwork from Wikimedia Commons (public domain), inlined so
// the component stays the single place a flag is defined.
//
// The United States has no entry: the fifty-star canton is not worth ten
// kilobytes inlined for one page, so /fa/usa-eb2-niw keeps the acid rule.
// ============================================================================

export type FlagCode = 'dk' | 'fi' | 'nl' | 'ee' | 'ca';

const BY_PATH: Record<string, FlagCode> = {
  '/europe/denmark': 'dk',
  '/europe/finland': 'fi',
  '/europe/netherlands': 'nl',
  '/europe/estonia': 'ee',
  '/pnp': 'ca',
  '/pnp/new-brunswick': 'ca',
  '/pnp/nova-scotia': 'ca',
  '/canada-startup-visa': 'ca',
};

export function flagFor(path: string): FlagCode | null {
  return BY_PATH[path] ?? null;
}

/** Persian name of the country, for the flag's accessible label. */
export const FLAG_NAME: Record<FlagCode, string> = {
  dk: 'دانمارک',
  fi: 'فنلاند',
  nl: 'هلند',
  ee: 'استونی',
  ca: 'کانادا',
};

/**
 * Official proportions, as each country legislates them. Kept as data so the
 * component cannot quietly draw them all at 3:2.
 */
export const FLAG_RATIO: Record<FlagCode, { w: number; h: number }> = {
  dk: { w: 37, h: 28 }, // Dannebrog
  fi: { w: 18, h: 11 },
  nl: { w: 3, h: 2 },
  ee: { w: 11, h: 7 },
  ca: { w: 2, h: 1 },
};
