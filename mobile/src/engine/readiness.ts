// Readiness, per the spec's gamification rules. Pure: no React, no storage,
// no strings. Imports are type-only or relative, so node --test can run it.
//
//   score = thresholds (≤50) + checklist (≤40) + engagement (≤10)
//
// Readiness measures preparation, not chances. Nothing here reads a draw,
// a quota or anything else outside the founder's control.
import type { Rule } from '../../../lib/fa/programmes.ts';
import type { QuizAnswers } from '../../../lib/fa/path-quiz.ts';

export type QuizKey = keyof QuizAnswers;
export const QUIZ_KEYS: QuizKey[] = ['goal', 'team', 'business', 'language', 'capital', 'background', 'horizon'];

/** Answers as stored: a value, or 'skip' ("I'd rather not say"). */
export type StoredAnswers = { [K in QuizKey]?: QuizAnswers[K] | 'skip' };

/** Skipped answers are scored as the most cautious value, and the screen says so. */
const CAUTIOUS: QuizAnswers = {
  goal: 'residency',
  team: 'solo',
  business: 'none',
  language: 'low',
  capital: 'under50',
  background: 'none',
  horizon: 'long',
};

export function completeAnswers(a: StoredAnswers): { answers: QuizAnswers; skipped: QuizKey[] } {
  const skipped: QuizKey[] = [];
  const out = { ...CAUTIOUS } as Record<QuizKey, string>;
  for (const k of QUIZ_KEYS) {
    const v = a[k];
    if (v === undefined || v === 'skip') skipped.push(k);
    else out[k] = v;
  }
  return { answers: out as QuizAnswers, skipped };
}

export type Status = 'met' | 'close' | 'not-yet';

export type CheckKey = 'founders-min' | 'founders-max' | 'investment' | 'yearly-funds' | 'clb' | 'venture';

export type Check = {
  key: CheckKey;
  status: Status;
  /** What the rule asks, as data for the screen to phrase. */
  need: { amount?: number; currency?: string; amountCad?: number; count?: number; clb?: number; venture?: 'idea' | 'mvp' | 'revenue' };
};

/** Conditions the pathfinder does not ask about, so it never scores them. */
export type PathfinderGap = 'net-worth' | 'age';

const CAPITAL: Record<QuizAnswers['capital'], [number, number]> = {
  under50: [0, 49_999],
  '50to200': [50_000, 199_999],
  '200to500': [200_000, 499_999],
  over500: [500_000, Number.POSITIVE_INFINITY],
};
const CLB: Record<QuizAnswers['language'], [number, number]> = { low: [0, 4], mid: [5, 7], high: [8, 12] };
const VENTURE_RANK = { none: 0, idea: 1, mvp: 2, revenue: 3 } as const;

/** A band against a floor: met if the whole band clears it; close within 20 % or overlapping; else not yet. */
function bandAgainst([lo, hi]: [number, number], need: number): Status {
  if (lo >= need) return 'met';
  if (hi >= need * 0.8) return 'close';
  return 'not-yet';
}

export function toCad(amount: number, currency: string, rates: Record<string, number>): number {
  return Math.round(amount * (rates[currency] ?? 1));
}

export function checksFor(rule: Rule, a: QuizAnswers, rates: Record<string, number>): { checks: Check[]; gaps: PathfinderGap[] } {
  const checks: Check[] = [];
  const gaps: PathfinderGap[] = [];
  const founders = a.team === 'solo' ? 1 : 2;
  const capital = CAPITAL[a.capital];

  if (rule.founders?.min !== undefined) {
    checks.push({ key: 'founders-min', status: founders >= rule.founders.min ? 'met' : 'not-yet', need: { count: rule.founders.min } });
  }
  if (rule.founders?.max !== undefined) {
    checks.push({ key: 'founders-max', status: founders <= rule.founders.max ? 'met' : 'not-yet', need: { count: rule.founders.max } });
  }
  if (rule.netWorth) gaps.push('net-worth');
  if (rule.investment) {
    const cad = toCad(rule.investment.amount, rule.investment.currency, rates);
    checks.push({ key: 'investment', status: bandAgainst(capital, cad), need: { amount: rule.investment.amount, currency: rule.investment.currency, amountCad: cad } });
  }
  if (rule.yearlyFunds) {
    const per = rule.yearlyFunds.perFounder ? founders : 1;
    const cad = toCad(rule.yearlyFunds.amount, rule.yearlyFunds.currency, rates) * per;
    checks.push({ key: 'yearly-funds', status: bandAgainst(capital, cad), need: { amount: rule.yearlyFunds.amount * per, currency: rule.yearlyFunds.currency, amountCad: cad } });
  }
  if (rule.age) gaps.push('age');
  if (rule.clb !== undefined) {
    const [lo, hi] = CLB[a.language];
    const status: Status = lo >= rule.clb ? 'met' : hi >= rule.clb - 1 ? 'close' : 'not-yet';
    checks.push({ key: 'clb', status, need: { clb: rule.clb } });
  }
  if (rule.venture) {
    const have = VENTURE_RANK[a.business];
    const need = VENTURE_RANK[rule.venture];
    const status: Status = have >= need ? 'met' : have === need - 1 ? 'close' : 'not-yet';
    checks.push({ key: 'venture', status, need: { venture: rule.venture } });
  }
  return { checks, gaps };
}

export const THRESHOLD_MAX = 50;
export const CHECKLIST_MAX = 40;
export const ENGAGEMENT_MAX = 10;

export type Engagement = { sourceOpened: boolean; newsRead: boolean };

export type Readiness = {
  score: number;
  thresholds: number;
  checklist: number;
  engagement: number;
  /** True when the route publishes no threshold the pathfinder can score. */
  noThresholds: boolean;
};

export function readiness(checks: Check[], stepsDone: number, stepsTotal: number, e: Engagement): Readiness {
  const weight = { met: 1, close: 0.5, 'not-yet': 0 } as const;
  const thresholds = checks.length ? (THRESHOLD_MAX * checks.reduce((s, c) => s + weight[c.status], 0)) / checks.length : 0;
  const checklist = stepsTotal ? (CHECKLIST_MAX * Math.min(stepsDone, stepsTotal)) / stepsTotal : 0;
  const engagement = Math.min(ENGAGEMENT_MAX, (e.sourceOpened ? 5 : 0) + (e.newsRead ? 5 : 0));
  const score = Math.round(thresholds + checklist + engagement);
  return { score, thresholds, checklist, engagement, noThresholds: checks.length === 0 };
}

export type Level = 'explorer' | 'planner' | 'ready' | 'applicant';
const BANDS: { level: Level; from: number }[] = [
  { level: 'explorer', from: 0 },
  { level: 'planner', from: 25 },
  { level: 'ready', from: 50 },
  { level: 'applicant', from: 80 },
];

export function levelOf(score: number): { level: Level; next?: Level; pointsToNext?: number } {
  let i = 0;
  for (let j = 0; j < BANDS.length; j++) if (score >= BANDS[j].from) i = j;
  const next = BANDS[i + 1];
  return next ? { level: BANDS[i].level, next: next.level, pointsToNext: next.from - score } : { level: BANDS[i].level };
}

/** Rule 8: the mentor CTA is the primary button from Planner, a text link below. */
export function mentorIsPrimary(score: number): boolean {
  return score >= 25;
}

export function gapOf(checks: Check[]): { notYet: number; close: number } {
  return { notYet: checks.filter((c) => c.status === 'not-yet').length, close: checks.filter((c) => c.status === 'close').length };
}
