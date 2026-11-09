// The Money tab's large figure (option A, 9 Nov 2026). Pure, so node:test runs
// it. Lines are summed only when the data is a plain household: one applicant
// line plus at most one spouse line and one child line, all "to show", in one
// currency and on one basis. Anything else (alternatives such as "in Halifax /
// outside", two child lines, size tables) leads with one line as published.
import type { FundLine } from '../../../lib/routes-v2/extras-types.ts';

export type Counted = { f: FundLine; times: number };
export type Part = { who: 'you' | 'founders' | 'spouse' | 'child' | 'children'; amount: number; n?: number; key: string };
export type Figure = {
  amount: number;
  currency: FundLine['currency'];
  basis: FundLine['basis'];
  approx: boolean;
  kind: FundLine['kind'];
  /** The household split, when the figure is a sum (one part per child). */
  parts: Part[] | null;
  /** The line the figure is when it is not a sum (its label says what it covers). */
  line: FundLine | null;
  /** Lines the figure already shows, so the list below can leave them out. */
  used: Set<string>;
};

const APPLICANT: FundLine['per'][] = ['person', 'founder'];
const CHILD: FundLine['per'][] = ['child', 'children'];

function household(lines: Counted[]): Figure | null {
  const shows = lines.filter((l) => l.f.kind === 'show' && l.f.householdSize == null);
  const lead = shows.find((l) => APPLICANT.includes(l.f.per));
  if (!lead) return null;
  const same = shows.filter((l) => l.f.currency === lead.f.currency && l.f.basis === lead.f.basis);
  const applicant = same.filter((l) => APPLICANT.includes(l.f.per));
  const spouse = same.filter((l) => l.f.per === 'spouse');
  const child = same.filter((l) => CHILD.includes(l.f.per));
  const other = same.length - applicant.length - spouse.length - child.length;
  if (applicant.length !== 1 || spouse.length > 1 || child.length > 1 || other > 0) return null;
  if (!spouse.length && !child.length) return null;
  const a = applicant[0];
  const parts: Part[] = [
    a.times > 1 ? { who: 'founders', amount: a.f.amount * a.times, n: a.times, key: a.f.key } : { who: 'you', amount: a.f.amount, key: a.f.key },
    ...spouse.map((s): Part => ({ who: 'spouse', amount: s.f.amount, key: s.f.key })),
    ...child.flatMap((c): Part[] =>
      c.f.per === 'children' ? [{ who: 'children', amount: c.f.amount, key: c.f.key }] : Array.from({ length: c.times }, (_, i): Part => ({ who: 'child', amount: c.f.amount, n: i + 1, key: `${c.f.key}-${i + 1}` })),
    ),
  ];
  const used = [a, ...spouse, ...child];
  return {
    amount: parts.reduce((s, p) => s + p.amount, 0),
    currency: a.f.currency,
    basis: a.f.basis,
    approx: used.some((l) => !!l.f.approx),
    kind: 'show',
    parts,
    line: null,
    used: new Set(used.map((l) => l.f.key)),
  };
}

/** The figure to lead the Money tab with, or null when there is no line to show, invest or spend. */
export function keyFigure(lines: Counted[]): Figure | null {
  const sum = household(lines);
  if (sum) return sum;
  const lead = lines.find((l) => l.f.kind === 'show') ?? lines.find((l) => l.f.kind === 'invest');
  if (!lead) return null;
  return { amount: lead.f.amount * lead.times, currency: lead.f.currency, basis: lead.f.basis, approx: !!lead.f.approx, kind: lead.f.kind, parts: null, line: lead.f, used: new Set([lead.f.key]) };
}
