// The v2 assessment (spec 2026-10-15 §4): eleven short questions, each
// skippable, kept on the phone. Answers are stored as band ids; toProfile()
// turns them into the profile the match engine reads (lib/routes-v2/match.ts).
// Money bands are defined in US dollars, shown in the home currency, and
// stored at the band's lower edge, so a % never overstates where someone is.
import type { FxCurrency } from '@shared/fx';
import type { MatchResult, Profile } from '@shared/routes-v2/match';
import type { V2Family } from '@shared/routes-v2/types';

// Ten screens (spec §4: 8–10). Family moved to the funds tool: it is not scored.
export type AssessKey = 'goal' | 'where' | 'age' | 'degree' | 'work' | 'language' | 'money' | 'earning' | 'business' | 'extras';
export const ASSESS_ORDER: AssessKey[] = ['goal', 'where', 'age', 'degree', 'work', 'language', 'money', 'earning', 'business', 'extras'];

/** Every answer is a band id, a list, a boolean, or 'skip'. Absent = not reached yet. */
export type AssessAnswers = Partial<{
  goal: V2Family | 'unsure' | 'skip';
  residence: Residence | 'skip';
  citizenship: Residence | 'skip';
  age: string;
  degree: string;
  work: string;
  english: string;
  french: string;
  liquid: string;
  netWorth: string;
  income: string;
  investment: string;
  businessStage: string;
  revenue: string;
  /** yes / no / skip: a toggle would count a skip as "no". */
  admission: 'yes' | 'no' | 'skip';
  jobOffer: 'yes' | 'no' | 'skip';
  endorsement: 'yes' | 'no' | 'skip';
  talent: string[];
}>;

export type Residence = 'IR' | 'AE' | 'TR' | 'CN' | 'IN' | 'CA' | 'US' | 'GB' | 'EU' | 'other';
export const RESIDENCES: Residence[] = ['IR', 'AE', 'TR', 'CN', 'IN', 'CA', 'US', 'GB', 'EU', 'other'];

/** Home currency for showing money bands. Iran has no rate source yet (Gheymat pending): USD. */
export const HOME_CURRENCY: Record<Residence, FxCurrency> = {
  IR: 'USD',
  AE: 'AED',
  TR: 'TRY',
  CN: 'CNY',
  IN: 'INR',
  CA: 'CAD',
  US: 'USD',
  GB: 'GBP',
  EU: 'EUR',
  other: 'USD',
};

export const GOALS: (V2Family | 'unsure')[] = ['startup', 'entrepreneur', 'study', 'talent', 'express', 'unsure'];

/** Bands are kept as ranges: a threshold inside one reads "close", never "met". */
export const AGE_BANDS: { id: string; range: [number, number] }[] = [
  { id: 'u25', range: [18, 24] },
  { id: '25', range: [25, 29] },
  { id: '30', range: [30, 34] },
  { id: '35', range: [35, 39] },
  { id: '40', range: [40, 44] },
  { id: '45', range: [45, 49] },
  { id: '50', range: [50, 80] },
];

export const DEGREES = ['none', 'secondary', 'bachelor', 'master', 'phd'] as const;

export const WORK_BANDS: { id: string; range: [number, number] }[] = [
  { id: '0', range: [0, 0] },
  { id: '1', range: [1, 2] },
  { id: '3', range: [3, 4] },
  { id: '5', range: [5, 9] },
  { id: '10', range: [10, 50] },
];

/** Language self-assessment → Canadian Language Benchmark (what most route tests use). */
export const LANGUAGE_BANDS: { id: string; clb: number }[] = [
  { id: 'none', clb: 0 },
  { id: 'basic', clb: 4 },
  { id: 'intermediate', clb: 5 },
  { id: 'good', clb: 7 },
  { id: 'veryGood', clb: 9 },
];

/** USD band edges; band i is [edge i, edge i+1). */
export const MONEY_EDGES = {
  liquid: [0, 10_000, 30_000, 75_000, 150_000, 300_000, 750_000, 2_000_000],
  netWorth: [0, 25_000, 75_000, 150_000, 300_000, 600_000, 1_000_000, 3_000_000],
  income: [0, 15_000, 30_000, 50_000, 80_000, 120_000, 200_000, 400_000],
  investment: [0, 10_000, 30_000, 75_000, 150_000, 300_000, 750_000, 2_000_000],
  revenue: [0, 50_000, 150_000, 300_000, 1_000_000, 3_000_000],
} as const;
export type MoneyKey = keyof typeof MONEY_EDGES;

export const STAGES = ['none', 'idea', 'mvp', 'revenue', 'established'] as const;

export const TALENT_SIGNALS = ['publications', 'citations', 'patents', 'awards', 'press', 'judging', 'salary', 'memberships'] as const;

const band = (bands: { id: string; range: [number, number] }[], id?: string) => bands.find((b) => b.id === id)?.range;
const clb = (id?: string) => LANGUAGE_BANDS.find((b) => b.id === id)?.clb;
const money = (key: MoneyKey, id?: string): [number, number] | undefined => {
  if (!id || id === 'skip') return undefined;
  const i = Number(id);
  const edges = MONEY_EDGES[key];
  if (!Number.isInteger(i) || i < 0 || i >= edges.length) return undefined;
  return [edges[i], i + 1 < edges.length ? edges[i + 1] : Infinity];
};
const asked = (v?: string) => (v && v !== 'skip' ? v : undefined);
const yesNo = (v?: 'yes' | 'no' | 'skip') => (v === 'yes' ? true : v === 'no' ? false : undefined);

/** The engine's profile. Skipped or unanswered questions leave their fields out (unscored). */
export function toProfile(a: AssessAnswers): Profile {
  const early = a.businessStage === 'none' || a.businessStage === 'idea' || a.businessStage === 'mvp';
  const p: Profile = {
    age: band(AGE_BANDS, a.age),
    degree: asked(a.degree),
    workYears: band(WORK_BANDS, a.work),
    englishClb: clb(a.english),
    frenchClb: clb(a.french),
    liquid: money('liquid', a.liquid),
    netWorth: money('netWorth', a.netWorth),
    income: money('income', a.income),
    investment: money('investment', a.investment),
    businessStage: asked(a.businessStage),
    revenue: early ? 0 : money('revenue', a.revenue),
    admission: yesNo(a.admission),
    jobOffer: yesNo(a.jobOffer),
    endorsement: yesNo(a.endorsement),
    talentSignals: a.talent ? a.talent.length : undefined,
    citizenship: asked(a.citizenship),
  };
  // Drop unanswered fields so they read as skipped, not as zero.
  return Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) as Profile;
}

/** The family to prefer when two routes tie (the goal question). */
export const preferredFamily = (a: AssessAnswers): V2Family | undefined => (a.goal && a.goal !== 'unsure' && a.goal !== 'skip' ? a.goal : undefined);

/** The highest-weight conditions not met yet (not-yet before close). */
export function topGaps(m: MatchResult, n = 2): string[] {
  const order = { 'not-yet': 0, close: 1 } as const;
  return m.results
    .filter((r) => r.state === 'not-yet' || r.state === 'close')
    .sort((a, b) => b.weight - a.weight || order[a.state as 'not-yet' | 'close'] - order[b.state as 'not-yet' | 'close'])
    .slice(0, n)
    .map((r) => r.key);
}

/**
 * Conditions met among those the answers could score. When a result is thin
 * (under half its weight can be checked in advance) this count is shown
 * instead of a %: "100%" on one checkable condition of six reads as "you
 * qualify", which the trust rules forbid (auditor, 15 Oct 2026).
 */
export const metCount = (m: MatchResult): number => m.results.filter((r) => r.state === 'met').length;
