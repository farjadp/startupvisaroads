// ============================================================================
// Case study ingest payload (POST /api/agent-case-studies, spec §4 and §7).
//
// Hand-written validation: the repo has no schema library. Strict on purpose:
// unknown keys are rejected so a pipeline that invents a field fails loudly.
// Every claim's `verified` is forced to false here; only Farjad's tick in
// admin can set it.
// ============================================================================
import * as cheerio from 'cheerio';
import { sanitizeHtml } from '@/lib/sanitize';
import { CLAIM_A_KINDS, CLAIM_B_KINDS, type StoredClaim } from '@/lib/case-studies/claims';

export const CASE_TYPES = ['FC_DECISION', 'CLIENT_CASE'] as const;
export type CaseType = (typeof CASE_TYPES)[number];
export const CASE_LOCALES = ['en', 'fa'] as const;
export type CaseLocale = (typeof CASE_LOCALES)[number];
export const OUTCOMES = ['allowed', 'dismissed'] as const;
export type Outcome = (typeof OUTCOMES)[number];

export const FC_SLUG_RE = /^[a-z0-9-]+-(\d{4})-fc-(\d+)$/;
export const CLIENT_SLUG_RE = /^[a-z0-9-]+$/;
export const CITATION_RE = /^(\d{4}) FC (\d+)$/;
export const OFFICIAL_HOST = 'decisions.fct-cf.gc.ca';

export type FaqItem = { q: string; a: string };

export type CaseStudyPayload = {
  groupKey: string;
  locale: CaseLocale;
  slug: string;
  type: CaseType;
  title: string;
  excerpt: string | null;
  content: string; // sanitised
  keyTakeaway: string | null;
  summaryEn: string | null;
  court: string | null;
  citation: string | null;
  decisionDate: Date | null;
  judge: string | null;
  route: string;
  country: string;
  outcome: Outcome | null;
  officialUrl: string | null;
  issues: unknown[];
  lessons: unknown[];
  claims: StoredClaim[];
  faq: FaqItem[];
  sourceSha256: string | null;
  fetchedAt: Date | null;
  certifiedQuestion: string | null;
  consentRecordId: string | null;
  aiModel: string | null;
};

export type ParsedPayload = { ok: true; payload: CaseStudyPayload } | { ok: false; error: string };

const ALLOWED_KEYS = new Set([
  'groupKey', 'locale', 'slug', 'type', 'title', 'excerpt', 'content', 'keyTakeaway', 'summaryEn',
  'court', 'citation', 'decisionDate', 'judge', 'route', 'country', 'outcome', 'officialUrl',
  'issues', 'lessons', 'claims', 'faq', 'sourceSha256', 'fetchedAt', 'certifiedQuestion',
  'consentRecordId', 'aiModel',
]);
const CLAIM_KEYS = new Set(['id', 'kind', 'text', 'paras', 'quote', 'verified']);
const CLAIM_KINDS = new Set<string>([...CLAIM_A_KINDS, ...CLAIM_B_KINDS]);
const KEY_RE = /^[a-z0-9][a-z0-9-]{0,199}$/;

class PayloadError extends Error {}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function reqString(body: Record<string, unknown>, key: string, max: number): string {
  const v = body[key];
  if (typeof v !== 'string' || !v.trim()) throw new PayloadError(`${key} is required`);
  if (v.length > max) throw new PayloadError(`${key} is over ${max} characters`);
  return v.trim();
}

function optString(body: Record<string, unknown>, key: string, max: number): string | null {
  const v = body[key];
  if (v === undefined || v === null) return null;
  if (typeof v !== 'string') throw new PayloadError(`${key} must be a string`);
  if (v.length > max) throw new PayloadError(`${key} is over ${max} characters`);
  return v.trim() || null;
}

function optDate(body: Record<string, unknown>, key: string): Date | null {
  const v = optString(body, key, 40);
  if (v === null) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw new PayloadError(`${key} is not an ISO date`);
  return d;
}

function optArray(body: Record<string, unknown>, key: string): unknown[] {
  const v = body[key];
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) throw new PayloadError(`${key} must be an array`);
  return v;
}

function parseClaims(raw: unknown, type: CaseType): StoredClaim[] {
  if (raw === undefined || raw === null) raw = [];
  if (!Array.isArray(raw)) throw new PayloadError('claims must be an array');
  const seen = new Set<string>();
  return raw.map((c, i): StoredClaim => {
    const at = `claims[${i}]`;
    if (!isRecord(c)) throw new PayloadError(`${at} must be an object`);
    for (const k of Object.keys(c)) if (!CLAIM_KEYS.has(k)) throw new PayloadError(`${at} has unknown key ${k}`);
    if (typeof c.id !== 'string' || !c.id.trim() || c.id.length > 100) throw new PayloadError(`${at}.id is required`);
    if (seen.has(c.id)) throw new PayloadError(`${at}.id ${c.id} is a duplicate`);
    seen.add(c.id);
    if (typeof c.kind !== 'string' || !CLAIM_KINDS.has(c.kind)) throw new PayloadError(`${at}.kind is not a known kind`);
    if (typeof c.text !== 'string' || !c.text.trim() || c.text.length > 5000) throw new PayloadError(`${at}.text is required`);
    const paras = c.paras ?? [];
    if (!Array.isArray(paras) || !paras.every((p) => Number.isInteger(p) && (p as number) > 0)) {
      throw new PayloadError(`${at}.paras must be positive integers`);
    }
    const quote = c.quote ?? '';
    if (typeof quote !== 'string' || quote.length > 5000) throw new PayloadError(`${at}.quote must be a string`);
    if (type === 'FC_DECISION') {
      if (paras.length === 0) throw new PayloadError(`${at} needs at least one paragraph reference`);
      if (!quote.trim()) throw new PayloadError(`${at} needs a quote`);
    }
    return {
      id: c.id,
      kind: c.kind as StoredClaim['kind'],
      text: c.text.trim(),
      paras: paras as number[],
      quote: quote.trim(),
      verified: false, // never trusted from the poster
    };
  });
}

function parseFaq(raw: unknown[]): FaqItem[] {
  return raw.map((f, i) => {
    if (!isRecord(f) || typeof f.q !== 'string' || typeof f.a !== 'string' || !f.q.trim() || !f.a.trim()) {
      throw new PayloadError(`faq[${i}] must be { q, a } with both non-empty`);
    }
    return { q: f.q.trim(), a: f.a.trim() };
  });
}

/** sanitizeHtml (lib/sanitize.ts) plus: no style attributes and no inline SVG on case pages. */
export function sanitiseCaseHtml(html: string): string {
  const $ = cheerio.load(sanitizeHtml(html), null, false);
  $('svg').remove();
  $('[style]').removeAttr('style');
  return $.html().trim();
}

function parseOfficialUrl(v: string | null): string | null {
  if (v === null) return null;
  let u: URL;
  try {
    u = new URL(v);
  } catch {
    throw new PayloadError('officialUrl is not a URL');
  }
  if (u.protocol !== 'https:' || u.hostname !== OFFICIAL_HOST) {
    throw new PayloadError(`officialUrl must be https://${OFFICIAL_HOST}/...`);
  }
  return u.toString();
}

export function parseCaseStudyPayload(body: unknown): ParsedPayload {
  try {
    if (!isRecord(body)) throw new PayloadError('body must be a JSON object');
    for (const k of Object.keys(body)) if (!ALLOWED_KEYS.has(k)) throw new PayloadError(`unknown key ${k}`);

    const type = body.type;
    if (typeof type !== 'string' || !(CASE_TYPES as readonly string[]).includes(type)) {
      throw new PayloadError(`type must be one of ${CASE_TYPES.join(', ')}`);
    }
    const caseType = type as CaseType;
    const locale = body.locale;
    if (typeof locale !== 'string' || !(CASE_LOCALES as readonly string[]).includes(locale)) {
      throw new PayloadError('locale must be en or fa');
    }

    const groupKey = reqString(body, 'groupKey', 200);
    if (!KEY_RE.test(groupKey)) throw new PayloadError('groupKey must be lowercase letters, digits and hyphens');
    const slug = reqString(body, 'slug', 200);
    const route = reqString(body, 'route', 100);
    if (!KEY_RE.test(route)) throw new PayloadError('route must be lowercase letters, digits and hyphens');
    const country = optString(body, 'country', 50) ?? 'canada';
    if (!KEY_RE.test(country)) throw new PayloadError('country must be lowercase letters, digits and hyphens');

    const outcomeRaw = optString(body, 'outcome', 20);
    if (outcomeRaw !== null && !(OUTCOMES as readonly string[]).includes(outcomeRaw)) {
      throw new PayloadError('outcome must be allowed or dismissed');
    }
    const outcome = outcomeRaw as Outcome | null;
    const citation = optString(body, 'citation', 50);
    const officialUrl = parseOfficialUrl(optString(body, 'officialUrl', 500));

    if (caseType === 'FC_DECISION') {
      const s = FC_SLUG_RE.exec(slug);
      if (!s) throw new PayloadError('slug must look like <route>-<year>-fc-<number>');
      const c = citation ? CITATION_RE.exec(citation) : null;
      if (!c) throw new PayloadError('citation must look like "2025 FC 12"');
      if (s[1] !== c[1] || s[2] !== c[2]) throw new PayloadError('slug year/number do not match the citation');
      if (!officialUrl) throw new PayloadError('officialUrl is required for FC_DECISION');
      if (!outcome) throw new PayloadError('outcome is required for FC_DECISION');
    } else {
      if (!CLIENT_SLUG_RE.test(slug)) throw new PayloadError('slug must be lowercase letters, digits and hyphens');
      if (outcome) throw new PayloadError('outcome is only for FC_DECISION');
    }

    const claims = parseClaims(body.claims, caseType);
    if (caseType === 'FC_DECISION' && claims.length === 0) throw new PayloadError('at least one claim is required');

    const contentRaw = reqString(body, 'content', 390_000);
    const content = sanitiseCaseHtml(contentRaw);
    if (!content) throw new PayloadError('content is empty after sanitising');

    const sha = optString(body, 'sourceSha256', 64);
    if (sha !== null && !/^[a-f0-9]{64}$/.test(sha)) throw new PayloadError('sourceSha256 must be 64 hex characters');

    const certifiedQuestion = body.certifiedQuestion;
    if (certifiedQuestion !== undefined && certifiedQuestion !== null && typeof certifiedQuestion !== 'string') {
      throw new PayloadError('certifiedQuestion must be a string or null');
    }

    return {
      ok: true,
      payload: {
        groupKey,
        locale: locale as CaseLocale,
        slug,
        type: caseType,
        title: reqString(body, 'title', 300),
        excerpt: optString(body, 'excerpt', 1000),
        content,
        keyTakeaway: optString(body, 'keyTakeaway', 2000),
        summaryEn: optString(body, 'summaryEn', 5000),
        court: optString(body, 'court', 200),
        citation,
        decisionDate: optDate(body, 'decisionDate'),
        judge: optString(body, 'judge', 200),
        route,
        country,
        outcome,
        officialUrl,
        issues: optArray(body, 'issues'),
        lessons: optArray(body, 'lessons'),
        claims,
        faq: parseFaq(optArray(body, 'faq')),
        sourceSha256: sha,
        fetchedAt: optDate(body, 'fetchedAt'),
        certifiedQuestion: typeof certifiedQuestion === 'string' ? certifiedQuestion.trim() || null : null,
        consentRecordId: optString(body, 'consentRecordId', 100),
        aiModel: optString(body, 'aiModel', 100),
      },
    };
  } catch (e) {
    if (e instanceof PayloadError) return { ok: false, error: e.message };
    throw e;
  }
}
