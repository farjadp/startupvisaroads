// Claim shapes for Case Studies (spec §6 "Schema (core)" and §7 `claims`).
// The extraction model returns these; deterministic checks decide which
// survive; the ingest endpoint stores StoredClaim with verified = false until
// Farjad ticks each one in admin.
//
// The repo has no schema library (no zod), so validation is hand-written
// type guards below. They are strict: unknown keys are rejected, so a model
// that invents a field fails loudly instead of slipping it through.

export const CLAIM_A_KINDS = ['fact', 'issue', 'standard', 'holding', 'error_found', 'no_error', 'lesson'] as const;
export type ClaimAKind = (typeof CLAIM_A_KINDS)[number];

export const SPEAKERS = ['court', 'officer', 'applicant', 'respondent', 'quoted_authority'] as const;
export type Speaker = (typeof SPEAKERS)[number];

export const PROGRAMMES = ['study', 'work', 'suv', 'pnp_related', 'other'] as const;
export type Programme = (typeof PROGRAMMES)[number];

export interface ClaimA {
  id: string;
  kind: ClaimAKind;
  text: string;
  paras: number[];
  quote: string;
  speaker: Speaker;
  external?: boolean;
  basedOn?: string[];
}

export interface CaseA {
  citation: string;
  courtFile: string;
  url: string;
  decisionDate: string;
  sha256: string;
  programme: Programme;
  disposition: 'allowed' | 'dismissed';
  dispositionQuote: string;
  remitted: boolean;
  certifiedQuestion: string | null;
  standardOfReview: ClaimA[];
  facts: ClaimA[];
  issues: ClaimA[];
  holdings: ClaimA[];
  officerErred: ClaimA[];
  lessons: ClaimA[];
}

export const CLAIM_B_KINDS = ['fact', 'problem', 'action', 'outcome', 'lesson'] as const;
export type ClaimBKind = (typeof CLAIM_B_KINDS)[number];

export interface ClaimB {
  id: string;
  kind: ClaimBKind;
  text: string;
  sourceSpan: { start: number; end: number };
  quote: string;
}

/** What the DB stores per claim and the admin ticks (spec §7). */
export type StoredClaim = {
  id: string;
  kind: ClaimAKind | ClaimBKind;
  text: string;
  paras: number[];
  quote: string;
  verified: boolean;
};

export const CASE_A_SECTIONS = ['standardOfReview', 'facts', 'issues', 'holdings', 'officerErred', 'lessons'] as const;
export type CaseASection = (typeof CASE_A_SECTIONS)[number];

/** Kinds that must be the Court speaking (spec §6 hard rules). */
export const COURT_ONLY_KINDS: readonly ClaimAKind[] = ['holding', 'error_found', 'standard'];

export function allClaims(c: Pick<CaseA, CaseASection>): ClaimA[] {
  return CASE_A_SECTIONS.flatMap((s) => c[s]);
}

export function toStoredClaim(c: ClaimA | ClaimB, paras?: number[]): StoredClaim {
  return {
    id: c.id,
    kind: c.kind,
    text: c.text,
    paras: 'paras' in c ? [...c.paras] : [...(paras ?? [])],
    quote: c.quote,
    verified: false,
  };
}

// ── validation ──────────────────────────────────────────────────────────

export type Validation<T> = { ok: true; value: T } | { ok: false; errors: string[] };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isIntArr = (v: unknown): v is number[] => Array.isArray(v) && v.every((n) => Number.isInteger(n) && n > 0);

function onlyKeys(o: Obj, allowed: readonly string[], path: string, errors: string[]): void {
  for (const k of Object.keys(o)) if (!allowed.includes(k)) errors.push(`${path}: unexpected key "${k}"`);
}

const CLAIM_A_KEYS = ['id', 'kind', 'text', 'paras', 'quote', 'speaker', 'external', 'basedOn'] as const;

export function validateClaimA(v: unknown, path = 'claim'): string[] {
  const errors: string[] = [];
  if (!isObj(v)) return [`${path}: not an object`];
  onlyKeys(v, CLAIM_A_KEYS, path, errors);
  if (!isStr(v.id) || !v.id.trim()) errors.push(`${path}.id: required string`);
  if (!CLAIM_A_KINDS.includes(v.kind as ClaimAKind)) errors.push(`${path}.kind: one of ${CLAIM_A_KINDS.join('|')}`);
  if (!isStr(v.text) || !v.text.trim()) errors.push(`${path}.text: required string`);
  if (!isIntArr(v.paras)) errors.push(`${path}.paras: array of positive integers`);
  if (!isStr(v.quote)) errors.push(`${path}.quote: string`);
  if (!SPEAKERS.includes(v.speaker as Speaker)) errors.push(`${path}.speaker: one of ${SPEAKERS.join('|')}`);
  if (v.external !== undefined && typeof v.external !== 'boolean') errors.push(`${path}.external: boolean`);
  if (v.basedOn !== undefined && !(Array.isArray(v.basedOn) && v.basedOn.every(isStr))) errors.push(`${path}.basedOn: string[]`);
  return errors;
}

const CASE_A_KEYS = ['citation', 'courtFile', 'url', 'decisionDate', 'sha256', 'programme', 'disposition', 'dispositionQuote', 'remitted', 'certifiedQuestion', ...CASE_A_SECTIONS] as const;

export function validateCaseA(v: unknown): Validation<CaseA> {
  const errors: string[] = [];
  if (!isObj(v)) return { ok: false, errors: ['case: not an object'] };
  onlyKeys(v, CASE_A_KEYS, 'case', errors);
  for (const k of ['citation', 'courtFile', 'url', 'decisionDate', 'sha256', 'dispositionQuote'] as const) {
    if (!isStr(v[k])) errors.push(`case.${k}: string`);
  }
  if (!PROGRAMMES.includes(v.programme as Programme)) errors.push(`case.programme: one of ${PROGRAMMES.join('|')}`);
  if (v.disposition !== 'allowed' && v.disposition !== 'dismissed') errors.push('case.disposition: allowed|dismissed');
  if (typeof v.remitted !== 'boolean') errors.push('case.remitted: boolean');
  if (!(v.certifiedQuestion === null || isStr(v.certifiedQuestion))) errors.push('case.certifiedQuestion: string|null');
  const ids = new Set<string>();
  for (const s of CASE_A_SECTIONS) {
    const arr = v[s];
    if (!Array.isArray(arr)) { errors.push(`case.${s}: array`); continue; }
    arr.forEach((c, i) => {
      errors.push(...validateClaimA(c, `case.${s}[${i}]`));
      if (isObj(c) && isStr(c.id)) {
        if (ids.has(c.id)) errors.push(`case.${s}[${i}].id: duplicate "${c.id}"`);
        ids.add(c.id);
      }
    });
  }
  return errors.length ? { ok: false, errors } : { ok: true, value: v as unknown as CaseA };
}

export function validateClaimB(v: unknown, path = 'claim'): string[] {
  const errors: string[] = [];
  if (!isObj(v)) return [`${path}: not an object`];
  onlyKeys(v, ['id', 'kind', 'text', 'sourceSpan', 'quote'], path, errors);
  if (!isStr(v.id) || !v.id.trim()) errors.push(`${path}.id: required string`);
  if (!CLAIM_B_KINDS.includes(v.kind as ClaimBKind)) errors.push(`${path}.kind: one of ${CLAIM_B_KINDS.join('|')}`);
  if (!isStr(v.text) || !v.text.trim()) errors.push(`${path}.text: required string`);
  if (!isStr(v.quote)) errors.push(`${path}.quote: string`);
  const span = v.sourceSpan;
  if (!isObj(span) || !Number.isInteger(span.start) || !Number.isInteger(span.end) || (span.start as number) < 0 || (span.end as number) <= (span.start as number)) {
    errors.push(`${path}.sourceSpan: {start, end} integers, end > start >= 0`);
  }
  return errors;
}
