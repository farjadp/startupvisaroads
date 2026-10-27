// Route and country depth for the app's v3 content (spec 2026-10-27). Kept
// apart from RouteV2 so each country's file can be written on its own and the
// match engine never sees it. Same rules as types.ts: every figure and every
// ranking cites an official or institutional page with the date it was read.
// Farjad's Gemini notebooks are leads, never sources.
import type { L10n, MoneyBasis, Source, V2Currency } from './types';

/** Who a money line is counted for. Team routes add one line per founder. */
export type MoneyPer = 'person' | 'founder' | 'team' | 'spouse' | 'child' | 'family';

export type FundLine = {
  key: string;
  label: L10n;
  amount: number;
  currency: V2Currency;
  basis: MoneyBasis;
  per: MoneyPer;
  /** Kept in the account (proof of funds) vs paid out (a fee, a deposit, an investment). */
  kind: 'show' | 'spend' | 'invest';
  approx?: boolean;
  source: string;
};

export type Step = {
  key: string;
  title: L10n;
  detail: L10n;
  /** How long this step usually takes, as the authority states it. */
  takes?: L10n;
  /** Official page where the step is done (portal, form, booking). */
  link?: string;
};

export type DocItem = { key: string; label: L10n; note?: L10n; stage?: 'apply' | 'visa' | 'permit' | 'renewal' };

export type Reality = {
  key: string;
  kind: 'challenge' | 'tip' | 'myth';
  title: L10n;
  detail: L10n;
  source?: string;
};

/** Residence → permanent residence → citizenship, in years from arrival. */
export type Timeline = {
  prAfterYears?: number;
  citizenshipAfterYears?: number;
  dualCitizenship: 'allowed' | 'not-allowed' | 'restricted';
  language?: L10n;
  note?: L10n;
  source: string;
};

/** Studio outputs in Farjad's notebooks that can become app media once exported. */
export type MediaLead = { notebookId: string; kind: 'video' | 'infographic' | 'slides' | 'mindmap' | 'quiz' | 'flashcards'; title: string };

/** A five-question check per route ("Do you know this road?"), answers from the route data. */
export type QuizItem = { key: string; q: L10n; options: L10n[]; answer: number; why: L10n };

export type RouteExtras = {
  funds?: FundLine[];
  steps?: Step[];
  documents?: DocItem[];
  realities?: Reality[];
  timeline?: Timeline;
  quiz?: QuizItem[];
  media?: MediaLead[];
};

export type IndicatorKey =
  | 'hdi' // UNDP Human Development Index
  | 'happiness' // World Happiness Report
  | 'peace' // Global Peace Index
  | 'gdp-per-capita' // World Bank, current US$
  | 'unemployment' // World Bank / ILO
  | 'innovation' // WIPO Global Innovation Index
  | 'english' // EF English Proficiency Index
  | 'passport' // Henley Passport Index
  | 'tax-top-rate'; // OECD / national tax authority

export type Indicator = {
  key: IndicatorKey;
  /** Rank and field size when the index ranks countries; value otherwise. */
  rank?: number;
  of?: number;
  value?: number;
  unit?: string;
  year: number;
  source: Source;
};

export type CountryProfile = {
  strengths: L10n[];
  weaknesses: L10n[];
  indicators: Indicator[];
};
