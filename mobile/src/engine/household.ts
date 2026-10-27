// Which money lines count for a household, and how many times (auditor P1,
// 27 Oct 2026). Pure, so node:test runs it. Lines are never summed with each
// other: fee lines are often alternatives (in the country / abroad).
import type { FundLine } from '../../../lib/routes-v2/extras-types.ts';

export type Who = { founders: number; spouse: boolean; children: number };

/** How many times a line counts; 0 hides it. Size-table rows count once. */
export function timesFor(l: FundLine, who: Who): number {
  if (l.householdSize != null) return 1;
  if (l.per === 'founder') return who.founders;
  if (l.per === 'spouse') return who.spouse ? 1 : 0;
  if (l.per === 'child') return who.children;
  if (l.per === 'children') return who.children > 0 ? 1 : 0;
  return 1;
}

/** Of a size table, only the row for this household; the whole table when no row fits (the data skips some sizes). */
export function tableRows(funds: FundLine[], size: number): Set<string> {
  const table = funds.filter((f) => f.householdSize != null);
  const hit = table.find((f) => f.householdSize === size) ?? table.find((f) => f.openEnded && size >= f.householdSize!);
  return new Set((hit ? [hit] : table).map((f) => f.key));
}

/** The lines to show, each with its multiplier. */
export function linesFor(funds: FundLine[], who: Who): { f: FundLine; times: number }[] {
  const rows = tableRows(funds, 1 + (who.spouse ? 1 : 0) + who.children);
  return funds
    .filter((f) => f.householdSize == null || rows.has(f.key))
    .map((f) => ({ f, times: timesFor(f, who) }))
    .filter((l) => l.times > 0);
}
