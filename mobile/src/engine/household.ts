// Which money lines count for a household, and how many times (auditor P1,
// 27 Oct 2026). Pure, so node:test runs it. Lines are never summed with each
// other: fee lines are often alternatives (in the country / abroad).
import type { FundLine } from '../../../lib/routes-v2/extras-types.ts';

export type Who = { founders: number; spouse: boolean; children: number };

/** How many times a line counts; 0 hides it. Size-table rows count once. */
export function timesFor(l: FundLine, who: Who): number {
  if (l.householdSize != null) return 1;
  if (l.per === 'founder') return who.founders;
  if (l.per === 'further-founder') return Math.max(0, who.founders - 1);
  if (l.per === 'spouse') return who.spouse ? 1 : 0;
  if (l.per === 'child') return who.children;
  if (l.per === 'children') return who.children > 0 ? 1 : 0;
  return 1;
}

const sizeOf = (who: Who) => 1 + (who.spouse ? 1 : 0) + who.children;

/** Size-table rows grouped by table (a route can have several: Canada's settlement funds and biometrics). */
function tables(funds: FundLine[]): FundLine[][] {
  const by = new Map<string, FundLine[]>();
  for (const f of funds) if (f.householdSize != null) by.set(f.table ?? '', [...(by.get(f.table ?? '') ?? []), f]);
  return [...by.values()];
}

const rowFor = (table: FundLine[], size: number) => table.find((f) => f.householdSize === size) ?? table.find((f) => f.openEnded && size >= f.householdSize!);

/** Of each size table, only the row for this household; the whole table when no row fits. */
export function tableRows(funds: FundLine[], size: number): Set<string> {
  return new Set(tables(funds).flatMap((t) => (rowFor(t, size) ? [rowFor(t, size)!] : t)).map((f) => f.key));
}

/** The household size when a size table has no row for it (the page must say so, not leave the user to guess). */
export function sizeMissing(funds: FundLine[], who: Who): number | null {
  const size = sizeOf(who);
  return tables(funds).some((t) => !rowFor(t, size)) ? size : null;
}

/** The lines to show, each with its multiplier. */
export function linesFor(funds: FundLine[], who: Who): { f: FundLine; times: number }[] {
  const rows = tableRows(funds, sizeOf(who));
  return funds
    .filter((f) => f.householdSize == null || rows.has(f.key))
    .map((f) => ({ f, times: timesFor(f, who) }))
    .filter((l) => l.times > 0);
}
