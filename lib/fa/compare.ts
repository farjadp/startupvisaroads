// ============================================================================
// lib/fa/compare.ts
// Ordering for the route comparison table.
//
// Lives here rather than inside the component for the same reason path-quiz
// and programmes do: it is a rule about the subject, it is worth testing, and
// a test should not have to boot the router to reach it.
// ============================================================================
import { RATES_TO_CAD, type Rule } from './programmes';

export type ColKey = 'name' | 'founders' | 'netWorth' | 'investment' | 'funds' | 'clb';

export const toCad = (v: { amount: number; currency: keyof typeof RATES_TO_CAD } | undefined): number | null =>
  v ? Math.round(v.amount * RATES_TO_CAD[v.currency]) : null;

/**
 * One number per column, for sorting.
 *
 * Every sortable column is a barrier, so a programme that sets no threshold
 * at all is the *lowest* value, not a missing one. Sorting ascending by net
 * worth has to surface the routes that ask for nothing first — putting them
 * last would tell a reader with no capital that the cheapest routes are the
 * ones out of reach.
 */
export function valueOf(r: Rule, k: ColKey): number {
  switch (k) {
    case 'founders': return r.founders?.min ?? 1;
    case 'netWorth': return toCad(r.netWorth) ?? 0;
    case 'investment': return toCad(r.investment) ?? 0;
    case 'funds': return toCad(r.yearlyFunds) ?? 0;
    case 'clb': return r.clb ?? 0;
    default: return 0;
  }
}

export function sortRules(rules: Rule[], key: ColKey, dir: 1 | -1): Rule[] {
  return [...rules].sort((a, b) => (valueOf(a, key) - valueOf(b, key)) * dir);
}
