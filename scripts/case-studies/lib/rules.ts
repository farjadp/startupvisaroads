// Deterministic gates for the Case Studies pipeline (spec §6 hard rules,
// stage 4 gate and stage 8 trace/rules). No model calls here: the eval
// harness and vitest import this file and run without an API key.
import { checkCaseA, type CaseCheck } from '../../../lib/case-studies/quotes';
import { dispositionFromJudgment, remittedFromJudgment, certifiedQuestionFrom, type Disposition } from '../../../lib/case-studies/fc-parser';
import { scanRedLines, type RedLineHit } from '../../../lib/case-studies/redlines';
import { lintFa, type FaLintIssue, faParaRef, enParaRef } from '../../../lib/case-studies/persian-lint';
import { findPii, type PiiFinding } from '../../../lib/case-studies/anonymise';
import type { CaseA, StoredClaim } from '../../../lib/case-studies/claims';

export type Sentence = { text: string; claimIds: string[] };
export type Draft = {
  title: string;
  excerpt: string;
  keyTakeaway: string;
  sections: { heading: string; sentences: Sentence[] }[];
  faq: { q: string; a: string; claimIds: string[] }[];
};

// ---------------------------------------------------------------- stage 4 gate

export type CaseGate = { stop: boolean; reasons: string[]; regexDisposition: Disposition; check: CaseCheck };

/**
 * Hard rules on an extracted case before any writing:
 * - consent judgments and "allowed in part" block;
 * - the regex disposition must equal the model's;
 * - remitted and certified question must agree with the JUDGMENT block;
 * - failed claims are dropped (never repaired); a failed holding stops the case.
 */
export function gateCase(c: CaseA, paragraphs: Record<number, string>, judgmentText: string | null, analysisStartPara: number | null): CaseGate {
  const j = judgmentText ?? '';
  const regex = dispositionFromJudgment(j);
  const reasons: string[] = [];
  if (!j.trim()) reasons.push('no JUDGMENT block parsed; disposition cannot be verified');
  if (regex === 'consent') reasons.push('consent judgment: blocked (spec §6)');
  if (regex === 'allowed_in_part') reasons.push('allowed in part: blocked (spec §6)');
  if (regex === 'unknown') reasons.push('disposition regex is ambiguous (unknown): blocked');
  if ((regex === 'allowed' || regex === 'dismissed') && regex !== c.disposition) reasons.push(`disposition mismatch: regex=${regex}, model=${c.disposition}`);
  if (j.trim() && remittedFromJudgment(j) !== c.remitted) reasons.push(`remitted mismatch: regex=${remittedFromJudgment(j)}, model=${c.remitted}`);
  const cq = certifiedQuestionFrom(j);
  if (cq.status === 'unknown') reasons.push('certified question status unknown: blocked for review');
  if (cq.status === 'none' && c.certifiedQuestion) reasons.push('model reports a certified question; JUDGMENT says none');
  if (cq.status === 'certified' && !c.certifiedQuestion) reasons.push('JUDGMENT certifies a question; model reports none');

  const check = checkCaseA(c, paragraphs, { judgmentText, analysisStartPara });
  reasons.push(...check.stopReasons);
  if (check.kept.holdings.length === 0) reasons.push('no holding survived grounding');
  return { stop: reasons.length > 0, reasons: [...new Set(reasons)], regexDisposition: regex, check };
}

// ---------------------------------------------------------------- stage 8

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export function asciiDigits(s: string): string {
  return s.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d))).replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));
}

/** Numbers in a string, digits folded to ASCII, separators removed ("36,023.72" -> "36023.72"). */
export function numbersIn(s: string): string[] {
  const t = asciiDigits(s).replace(/(\d)[,٬](?=\d{3}\b)/g, '$1').replace(/٫/g, '.');
  return [...t.matchAll(/\d+(?:\.\d+)?/g)].map((m) => m[0]);
}

const CITATION = /\b\d{4}\s+(?:FC|CF|FCA|CAF|SCC|CSC)\s+\d+\b/g;
const COURT_FILE = /\bIMM-\d+-\d+\b/g;

/**
 * Numbers a sentence states that its claims do not support. Neutral citations
 * and court file numbers are ignored; paragraph numbers count as supported
 * when they are among the claims' cited paras. A framing sentence (no
 * claimIds) may contain no number at all.
 */
export function inventedNumbers(s: Sentence, claims: Map<string, StoredClaim>): string[] {
  const text = asciiDigits(s.text).replace(CITATION, ' ').replace(COURT_FILE, ' ');
  const found = numbersIn(text);
  if (found.length === 0) return [];
  const support = new Set<string>();
  for (const id of s.claimIds) {
    const c = claims.get(id);
    if (!c) continue;
    for (const n of numbersIn(`${c.text} ${c.quote}`.replace(CITATION, ' '))) support.add(n);
    for (const p of c.paras) support.add(String(p));
  }
  return found.filter((n) => !support.has(n));
}

export type TraceProblem =
  | { kind: 'unknown_claim'; locale: 'en' | 'fa'; id: string }
  | { kind: 'parity'; onlyEn: string[]; onlyFa: string[] }
  | { kind: 'invented_number'; locale: 'en' | 'fa'; sentence: string; numbers: string[] }
  | { kind: 'red_line'; locale: 'en' | 'fa'; hit: RedLineHit }
  | { kind: 'fa_lint'; issue: FaLintIssue }
  | { kind: 'party_name'; locale: 'en' | 'fa'; finding: PiiFinding }
  | { kind: 'empty'; locale: 'en' | 'fa' };

export function usedClaimIds(d: Draft): Set<string> {
  const ids = new Set<string>();
  for (const sec of d.sections) for (const s of sec.sentences) s.claimIds.forEach((i) => ids.add(i));
  for (const f of d.faq) f.claimIds.forEach((i) => ids.add(i));
  return ids;
}

export function draftPlainText(d: Draft): string {
  return [d.title, d.excerpt, d.keyTakeaway, ...d.sections.flatMap((s) => [s.heading, ...s.sentences.map((x) => x.text)]), ...d.faq.flatMap((f) => [f.q, f.a])].join('\n');
}

function sentencesOf(d: Draft): Sentence[] {
  return [
    ...d.sections.flatMap((s) => s.sentences),
    ...d.faq.map((f) => ({ text: f.a, claimIds: f.claimIds })),
    // Title/excerpt/takeaway carry no claimIds, so they may hold no number.
    { text: d.title, claimIds: [] },
    { text: d.excerpt, claimIds: [] },
    { text: d.keyTakeaway, claimIds: [] },
  ];
}

export type TraceInput = { en: Draft; fa: Draft; claims: StoredClaim[]; partyNames: string[]; judge?: string | null };

export function traceCheck(input: TraceInput): { ok: boolean; problems: TraceProblem[] } {
  const problems: TraceProblem[] = [];
  const byId = new Map(input.claims.map((c) => [c.id, c]));
  const drafts = { en: input.en, fa: input.fa } as const;
  for (const locale of ['en', 'fa'] as const) {
    const d = drafts[locale];
    const ids = usedClaimIds(d);
    if (ids.size === 0) problems.push({ kind: 'empty', locale });
    for (const id of ids) if (!byId.has(id)) problems.push({ kind: 'unknown_claim', locale, id });
    const units: Sentence[] = [...sentencesOf(d), ...d.sections.map((s) => ({ text: s.heading, claimIds: [] })), ...d.faq.map((f) => ({ text: f.q, claimIds: [] }))];
    for (const s of units) {
      const inv = inventedNumbers(s, byId);
      if (inv.length) problems.push({ kind: 'invented_number', locale, sentence: s.text, numbers: inv });
      for (const hit of scanRedLines(s.text, locale)) {
        // Rule 11 is about company prices. An amount the decision states
        // (e.g. the applicant's funds), backed by the sentence's claims, is a
        // cited figure, not a price. Every other red line has no exemption.
        if (hit.rule === 11 && s.claimIds.length > 0 && inv.length === 0) continue;
        problems.push({ kind: 'red_line', locale, hit });
      }
    }
    const text = draftPlainText(d);
    const allow = input.judge ? [`Justice ${input.judge}`, `Judge ${input.judge}`, input.judge] : [];
    for (const f of findPii(text, { mode: 'A', names: input.partyNames, allow })) {
      if (f.kind === 'name' || f.kind === 'initials') problems.push({ kind: 'party_name', locale, finding: f });
    }
  }
  const enIds = usedClaimIds(input.en);
  const faIds = usedClaimIds(input.fa);
  const onlyEn = [...enIds].filter((i) => !faIds.has(i));
  const onlyFa = [...faIds].filter((i) => !enIds.has(i));
  if (onlyEn.length || onlyFa.length) problems.push({ kind: 'parity', onlyEn, onlyFa });
  for (const issue of lintFa(draftPlainText(input.fa))) problems.push({ kind: 'fa_lint', issue });
  return { ok: problems.length === 0, problems };
}

// ---------------------------------------------------------------- render

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** HTML body for the ingest endpoint. Each sentence keeps its claimIds as data attributes for the admin review. */
export function renderHtml(d: Draft, locale: 'en' | 'fa', claims: StoredClaim[], disclaimer: string): string {
  const byId = new Map(claims.map((c) => [c.id, c]));
  const ref = (ids: string[]) => {
    const paras = [...new Set(ids.flatMap((i) => byId.get(i)?.paras ?? []))].sort((a, b) => a - b);
    if (!paras.length) return '';
    return ` <span class="para-ref">[${esc(locale === 'fa' ? faParaRef(paras) : enParaRef(paras))}]</span>`;
  };
  const parts: string[] = [];
  for (const sec of d.sections) {
    parts.push(`<h2>${esc(sec.heading)}</h2>`);
    parts.push(`<p>${sec.sentences.map((s) => `<span data-claims="${esc(s.claimIds.join(' '))}">${esc(s.text)}${ref(s.claimIds)}</span>`).join(' ')}</p>`);
  }
  parts.push(`<p class="disclaimer">${esc(disclaimer)}</p>`);
  return parts.join('\n');
}
