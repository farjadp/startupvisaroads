// ============================================================================
// lib/fa/flags.ts
// Which national flag belongs to which Persian guide.
//
// Matched on the guide's own path, so no content module has to declare it —
// the same way the eligibility calculator finds its rule.
//
// Only flags that are exact, simple geometry are here. A flag drawn from
// memory that is nearly right is worse than no flag: it is a national symbol
// rendered wrong on a page asking people to trust us with their emigration.
// That rules out Canada — the maple leaf is an eleven-pointed curve, not
// something to approximate — so the Canadian guides carry no flag rather
// than a bad one.
// ============================================================================

export type FlagCode = 'dk' | 'fi' | 'nl' | 'ee';

const BY_PATH: Record<string, FlagCode> = {
  '/europe/denmark': 'dk',
  '/europe/finland': 'fi',
  '/europe/netherlands': 'nl',
  '/europe/estonia': 'ee',
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
};
