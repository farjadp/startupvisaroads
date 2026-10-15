// VisaRoads v2 route data model (spec 2026-10-15, §8). One shape for every
// route in every country, read by the app (and later the site). Rules:
// - Official government or programme sources only; each route lists them
//   with the date they were checked.
// - A figure that could not be read on its official page stays in the data
//   but the route is `verified: false`, and the app shows the source instead.
// - Criteria say whether they can be scored against a user profile. Only
//   scoreable criteria count in "% match with the published criteria";
//   the rest are always listed. Weights are 1 (minor) to 3 (deciding).
// - Text is English plus Persian; fr/zh/ar readers see English, labelled.

export type V2Country = 'CA' | 'US' | 'DK' | 'FI' | 'EE' | 'NL' | 'IT' | 'TR' | 'IL' | 'AE';
export type V2Family = 'startup' | 'entrepreneur' | 'study' | 'talent' | 'express';
export type V2Currency = 'CAD' | 'USD' | 'EUR' | 'DKK' | 'TRY' | 'ILS' | 'AED';

/** English is required; Persian should be given; other languages fall back to English. */
export type L10n = { en: string; fa?: string };

/**
 * Profile fields the v2 assessment collects (spec §4). Money is compared in
 * USD at the app's FX rate of the day, so thresholds keep their own currency.
 */
export type ProfileField =
  | 'age' // years
  | 'degree' // 'none' | 'secondary' | 'bachelor' | 'master' | 'phd'
  | 'englishClb' // CLB band 0–12 (IELTS mapped)
  | 'frenchClb'
  | 'workYears'
  | 'managerial' // boolean
  | 'liquid' // cash and investments (money)
  | 'netWorth' // all assets minus debts (money)
  | 'investment' // money the user can put into the business (money)
  | 'income' // yearly personal income (money)
  | 'businessStage' // 'none' | 'idea' | 'mvp' | 'revenue' | 'established'
  | 'revenue' // yearly business revenue (money)
  | 'talentSignals' // count of: publications, citations, patents, awards, press, judging, high salary, memberships
  | 'admission' // boolean: has an admission / acceptance letter
  | 'jobOffer' // boolean
  | 'endorsement'; // boolean: has an endorsement / support letter from a designated body

export type Test =
  | { field: ProfileField; op: 'gte' | 'lte'; value: number; currency?: V2Currency }
  | { field: ProfileField; op: 'between'; value: [number, number] }
  | { field: ProfileField; op: 'in'; value: string[] }
  | { field: ProfileField; op: 'true' };

export type Criterion = {
  key: string;
  label: L10n;
  weight: 1 | 2 | 3;
  /** True only when `test` can decide met / close / not yet from the profile. */
  scoreable: boolean;
  test?: Test;
  /** Either-or conditions (any one is enough), e.g. UAE: revenue OR a sold business OR an incubator. Used instead of `test`. */
  anyOf?: Test[];
  /**
   * Other ways to meet this condition exist that no profile field can check
   * (UAE: property, a past sale). Then a met alternative still counts as met,
   * but a failing one is unscored rather than "not yet".
   */
  openEnded?: boolean;
  /** "Close" band for numeric tests, as a fraction of the threshold (default 0.8). */
  closeAt?: number;
  note?: L10n;
};

/** 'year' = one lump sum covering the first year (Denmark); 'perYear' = every year (revenue, tax, yearly living costs). */
export type MoneyBasis = 'year' | 'perYear' | 'month' | 'once' | 'prevYearIncome';

export type MoneyLine = {
  key: string;
  label: L10n;
  amount: number;
  currency: V2Currency;
  basis: MoneyBasis;
  approx?: boolean;
  /** What the money must show (bank statement, net-worth verifier, …). */
  shows?: L10n;
};

export type Fee = { label: L10n; amount: number; currency: V2Currency };

export type Source = { url: string; checked: string; label?: string };

export type RouteStatus = 'open' | 'paused' | 'limited' | 'closed';

export type RouteV2 = {
  /** Stable, kebab-case, unique across countries, e.g. 'ca-express-entry'. */
  key: string;
  country: V2Country;
  family: V2Family;
  name: L10n;
  /** The authority that decides. */
  agency: string;
  status: RouteStatus;
  /** The one fact that changes a decision; leads the route page. */
  fact: L10n;
  criteria: Criterion[];
  money: MoneyLine[];
  processing?: { text: L10n; source: string };
  fees?: Fee[];
  /** Path to permanent residence, one line. */
  pr: L10n;
  sources: Source[];
  /** False when a key figure could not be read on its official page. */
  verified: boolean;
  /** Internal: conflicts and things to re-check, never shown. */
  review?: string;
};
