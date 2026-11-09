// Express Entry in the app (spec 2026-11-09 §4 and amendment 4). The app asks
// in picker bands; this turns them into the site engine's CandidateProfile and
// scores it with lib/express-entry/crs-engine.ts on config/crs-points.json, so
// no figure is copied into the app. Pure (no React Native): node:test runs it.
import { calculateCRS } from '@shared/express-entry/crs-engine';
import type { CandidateProfile, CrsResult, EducationLevel, LanguageAbilityScores, WageMultiple } from '@shared/express-entry/types';
import categoriesConfig from '../../../config/categories.json';
import crsPoints from '../../../config/crs-points.json';
import nocConfig from '../../../config/noc-codes.json';

// ---------------------------------------------------------------------------
// Inputs: one picker id per row
// ---------------------------------------------------------------------------

/** CLB bands the pickers offer: below 4, 4 to 9, and 10 or more. */
export const CLB_BANDS = ['lt4', '4', '5', '6', '7', '8', '9', '10'] as const;
export type ClbBand = (typeof CLB_BANDS)[number];

export const AGES = Array.from({ length: 29 }, (_, i) => String(17 + i)); // '17' = 17 or under … '45' = 45 or over
export const EDUCATION = ['0', '1', '2', '3', '4', '5', '6', '7'] as const;
export const FOREIGN_WORK = ['0', '1', '2', '3'] as const;
export const CANADIAN_WORK = ['0', '1', '2', '3', '4', '5'] as const;
export const WAGE = ['none', '1.3x', '1.5x', '2x'] as const;
export const CANADIAN_EDUCATION = ['none', 'oneTwo', 'threeOrMore'] as const;
export const MARITAL = ['single', 'married', 'commonLaw'] as const;
export const YES_NO = ['yes', 'no'] as const;
export const FIRST_LANGUAGE = ['english', 'french'] as const;
/** The second official language: none, or one band for all four abilities. */
export const SECOND_LANGUAGE = ['none', ...CLB_BANDS] as const;

export const ABILITIES = ['speaking', 'listening', 'reading', 'writing'] as const;
export type Ability = (typeof ABILITIES)[number];

export type CrsInputs = {
  age: string;
  marital: (typeof MARITAL)[number];
  spouseComing: 'yes' | 'no';
  firstLanguage: (typeof FIRST_LANGUAGE)[number];
  speaking: ClbBand;
  listening: ClbBand;
  reading: ClbBand;
  writing: ClbBand;
  secondLanguage: (typeof SECOND_LANGUAGE)[number];
  education: (typeof EDUCATION)[number];
  foreignWork: (typeof FOREIGN_WORK)[number];
  canadianWork: (typeof CANADIAN_WORK)[number];
  highWage: WageMultiple;
  certificate: 'yes' | 'no';
  canadianEducation: (typeof CANADIAN_EDUCATION)[number];
  jobOffer: WageMultiple;
  nomination: 'yes' | 'no';
  sibling: 'yes' | 'no';
  spouseEducation: (typeof EDUCATION)[number];
  spouseLanguage: ClbBand;
  spouseCanadianWork: (typeof CANADIAN_WORK)[number];
  /** NOC 2021 code; only for the category block, never scored. */
  noc: string;
};
export type CrsField = keyof CrsInputs;

/** The options each picker offers, in order (the "next option" of a row is the next id here). */
export const OPTIONS: Record<Exclude<CrsField, 'noc'>, readonly string[]> = {
  age: AGES,
  marital: MARITAL,
  spouseComing: YES_NO,
  firstLanguage: FIRST_LANGUAGE,
  speaking: CLB_BANDS,
  listening: CLB_BANDS,
  reading: CLB_BANDS,
  writing: CLB_BANDS,
  secondLanguage: SECOND_LANGUAGE,
  education: EDUCATION,
  foreignWork: FOREIGN_WORK,
  canadianWork: CANADIAN_WORK,
  highWage: WAGE,
  certificate: YES_NO,
  canadianEducation: CANADIAN_EDUCATION,
  jobOffer: WAGE,
  nomination: YES_NO,
  sibling: YES_NO,
  spouseEducation: EDUCATION,
  spouseLanguage: CLB_BANDS,
  spouseCanadianWork: CANADIAN_WORK,
};

/** Keeps only known fields with known values (stored answers may come from an older build). */
export function cleanInputs(raw: unknown): Partial<CrsInputs> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v !== 'string') continue;
    if (k === 'noc') {
      if (/^\d{5}$/.test(v)) out.noc = v;
    } else if (k in OPTIONS && OPTIONS[k as keyof typeof OPTIONS].includes(v)) out[k] = v;
  }
  return out as Partial<CrsInputs>;
}

// ---------------------------------------------------------------------------
// Adapter to the site engine
// ---------------------------------------------------------------------------

const clb = (band: string | undefined): number => (band === undefined || band === 'lt4' || band === 'none' ? 0 : Number(band));
const all = (n: number): LanguageAbilityScores => ({ speaking: n, listening: n, reading: n, writing: n });

/** True when the spouse or partner is coming, so the spouse tables and the Spouse group apply. */
export const spouseCounts = (i: Partial<CrsInputs>) => (i.marital === 'married' || i.marital === 'commonLaw') && i.spouseComing === 'yes';

/** An empty row scores nothing: it is read as the lowest option. */
export function toProfile(i: Partial<CrsInputs>): CandidateProfile {
  const first = i.firstLanguage ?? 'english';
  const firstScores: LanguageAbilityScores = { speaking: clb(i.speaking), listening: clb(i.listening), reading: clb(i.reading), writing: clb(i.writing) };
  const second = i.secondLanguage && i.secondLanguage !== 'none' ? all(clb(i.secondLanguage)) : null;
  const secondLang = first === 'english' ? 'french' : 'english';
  const french = first === 'french' ? firstScores : second ? second : all(0);
  const withSpouse = spouseCounts(i);
  return {
    maritalStatus: i.marital ?? 'single',
    spouseComingToCanada: withSpouse,
    age: i.age ? Number(i.age) : 17,
    nocCode: i.noc ?? '',
    education: Number(i.education ?? 0) as EducationLevel,
    firstLanguage: { language: first, scores: firstScores },
    secondLanguage: second ? { language: secondLang, scores: second } : undefined,
    canadianWorkExperienceYears: Number(i.canadianWork ?? 0) as CandidateProfile['canadianWorkExperienceYears'],
    foreignWorkExperienceYears: Number(i.foreignWork ?? 0) as CandidateProfile['foreignWorkExperienceYears'],
    highWageCanadianExperience: i.highWage ?? 'none',
    spouseEducation: withSpouse ? (Number(i.spouseEducation ?? 0) as EducationLevel) : undefined,
    spouseFirstLanguage: withSpouse ? all(clb(i.spouseLanguage)) : undefined,
    spouseCanadianWorkExperienceYears: withSpouse ? (Number(i.spouseCanadianWork ?? 0) as CandidateProfile['spouseCanadianWorkExperienceYears']) : undefined,
    certificateOfQualification: i.certificate === 'yes',
    provincialNomination: i.nomination === 'yes',
    jobOfferWage: i.jobOffer ?? 'none',
    canadianEducation: i.canadianEducation ?? 'none',
    siblingInCanada: i.sibling === 'yes',
    frenchSkills: french,
  };
}

export const resultOf = (i: Partial<CrsInputs>): CrsResult => calculateCRS(toProfile(i));
export const scoreOf = (i: Partial<CrsInputs>): number => resultOf(i).total;

// ---------------------------------------------------------------------------
// What adds the most points on this grid
// ---------------------------------------------------------------------------

/** Only language, education and work are tried (amendment 4): never age, marital status, spouse, sibling, offers. */
export const GAIN_FIELDS = ['speaking', 'listening', 'reading', 'writing', 'secondLanguage', 'education', 'foreignWork', 'canadianWork', 'highWage', 'certificate', 'canadianEducation'] as const;
export type GainField = (typeof GAIN_FIELDS)[number] | 'allFour';

export type Gain = { field: GainField; to: string; gain: number; total: number };

const nextOf = (field: Exclude<CrsField, 'noc'>, value: string): string | undefined => {
  // From no second language, the first band that scores on IRCC's grid.
  if (field === 'secondLanguage' && (value === 'none' || value === 'lt4')) return '5';
  const list = field === 'certificate' ? ['no', 'yes'] : OPTIONS[field];
  const at = list.indexOf(value);
  return at >= 0 && at < list.length - 1 ? list[at + 1] : undefined;
};

/**
 * The single change that adds the most points: each answered row's next
 * option, and the four abilities raised together to one band above the lowest.
 * Null when nothing tried adds a point. Ties keep the earlier row.
 */
export function bestGain(i: Partial<CrsInputs>): Gain | null {
  const base = scoreOf(i);
  let best: Gain | null = null;
  const consider = (field: GainField, to: string, patch: Partial<CrsInputs>) => {
    const total = scoreOf({ ...i, ...patch });
    const gain = total - base;
    if (gain > 0 && (!best || gain > best.gain)) best = { field, to, gain, total };
  };
  const bands = ABILITIES.map((a) => i[a]);
  if (bands.every((b): b is ClbBand => b !== undefined)) {
    const low = Math.min(...bands.map((b) => CLB_BANDS.indexOf(b)));
    const to = CLB_BANDS[low + 1];
    // Only when more than one ability moves; a single one is tried below.
    if (to && bands.filter((b) => CLB_BANDS.indexOf(b) <= low).length > 1) {
      const patch: Partial<CrsInputs> = {};
      for (const a of ABILITIES) if (CLB_BANDS.indexOf(i[a] as ClbBand) < CLB_BANDS.indexOf(to)) patch[a] = to;
      consider('allFour', to, patch);
    }
  }
  for (const field of GAIN_FIELDS) {
    const v = i[field];
    if (v === undefined) continue;
    const to = nextOf(field, v);
    if (to !== undefined) consider(field, to, { [field]: to });
  }
  return best;
}

// ---------------------------------------------------------------------------
// The grid's own facts (read from config, never literals)
// ---------------------------------------------------------------------------

export const GRID = {
  rulesVersion: crsPoints.rulesVersion,
  lastVerified: crsPoints.lastVerified,
  source: crsPoints.source,
  maxTotal: crsPoints.maxTotal,
  /** The day IRCC began scoring experience or a job offer together (Labour Market Integration). */
  lmiEffective: crsPoints.coreHumanCapital.labourMarketIntegration.effective,
};

// ---------------------------------------------------------------------------
// Category draws that list a NOC
// ---------------------------------------------------------------------------

export type Noc = { code: string; title: string; titleFa: string };

export const NOCS: Noc[] = nocConfig.codes.map((n) => ({ code: n.code, title: n.title, titleFa: n.titleFa }));
export const NOC_META = { lastVerified: nocConfig.lastVerified, source: nocConfig.source };
export const CATEGORY_META = { lastVerified: categoriesConfig.lastVerified, source: categoriesConfig.source };

/** Matches by code prefix or by words in the English or Persian title. */
export function searchNoc(query: string, limit = 40): Noc[] {
  const q = query.trim().toLowerCase();
  if (!q) return NOCS.slice(0, limit);
  const words = q.split(/\s+/);
  return NOCS.filter((n) => n.code.startsWith(q) || words.every((w) => n.title.toLowerCase().includes(w) || n.titleFa.includes(w))).slice(0, limit);
}

export type NocCategory = { id: string; name: string; nameFa: string; canadianExperience: boolean };

/** The category-based draws whose published occupation list includes this NOC. Other conditions are not checked here. */
export function categoriesForNoc(code: string | undefined): NocCategory[] {
  if (!code) return [];
  return categoriesConfig.categories
    .filter((c) => (c.nocCodes as Array<{ code: string }>).some((n) => n.code === code))
    .map((c) => ({ id: c.id, name: c.name, nameFa: c.nameFa, canadianExperience: c.eligibilityCriteria.type === 'nocBasedWithCanadianExp' }));
}

// ---------------------------------------------------------------------------
// Rounds of invitations (GET https://visaroads.com/api/app/draws)
// ---------------------------------------------------------------------------

export type Round = { drawNumber: number; date: string; roundType: string; program: string; crsCutoff: number; invitations: number };
export type DrawsFeed = { source: string; fetchedAt: string; rounds: Round[] };
/** The feed as cached on the phone, with the day it was saved. */
export type SavedDraws = DrawsFeed & { savedAt: string };

const isRound = (r: unknown): r is Round => {
  if (!r || typeof r !== 'object') return false;
  const o = r as Record<string, unknown>;
  return typeof o.date === 'string' && typeof o.roundType === 'string' && typeof o.crsCutoff === 'number' && typeof o.invitations === 'number';
};

/** The endpoint's body, checked; null when it is not the expected shape. Rounds newest first. */
export function parseDraws(body: unknown): DrawsFeed | null {
  if (!body || typeof body !== 'object') return null;
  const o = body as Record<string, unknown>;
  if (typeof o.source !== 'string' || !Array.isArray(o.rounds)) return null;
  const rounds = o.rounds.filter(isRound).map((r) => ({ ...r, program: typeof r.program === 'string' ? r.program : '', drawNumber: typeof r.drawNumber === 'number' ? r.drawNumber : 0 }));
  rounds.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.drawNumber - a.drawNumber));
  return { source: o.source, fetchedAt: typeof o.fetchedAt === 'string' ? o.fetchedAt : '', rounds };
}

/** A general round: IRCC names it "General" or "No Program Specified" (all programmes, no category). */
export const isGeneralRound = (r: Round) => /^(general|no program specified)\b/i.test(r.roundType.trim()) || /^no program specified$/i.test(r.program.trim());

/** The newest general round, or null when none is in the feed (never a category or programme round instead). */
export const latestGeneral = (rounds: Round[]): Round | null => rounds.find(isGeneralRound) ?? null;

/** Whole days from the saved day to today (both calendar dates). */
export function daysSince(savedAt: string, now: Date): number {
  const [y, m, d] = savedAt.slice(0, 10).split('-').map(Number);
  const saved = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((today - saved) / 86_400_000));
}

/** Rounds older than this many days on the phone are shown with their saved-on line (spec §4). */
export const DRAWS_MAX_AGE_DAYS = 7;
