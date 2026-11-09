// Stage 4 (spec §6): exact-quote grounding. NO fuzzy matching.
//
// The only normalisation, applied identically to the quote and to the
// paragraph before a plain substring test:
//   1. Unicode NFC.
//   2. Typographic quotes, apostrophes and dashes to ASCII:
//        ‘ ’ ‚ ‛ ′  -> '        “ ” „ ‟ ″  -> "
//        ‐ ‑ ‒ – — ― −  -> -    …  -> ...
//   3. Soft hyphen (U+00AD), zero-width space (U+200B) and BOM (U+FEFF)
//      deleted: PDF text extraction inserts them invisibly. ZWNJ (U+200C) is
//      NOT touched; it carries meaning in Persian.
//   4. Every run of whitespace (incl. NBSP and other Unicode spaces) -> one
//      ASCII space; leading/trailing whitespace trimmed.
// Nothing else: case, punctuation, spelling and word order must match.
//
// A quote must sit wholly inside ONE of the cited paragraphs. There is no
// adjacent-paragraph rule: a quote that spans two paragraphs fails, and the
// extractor must split it into two claims. That is deliberate; a joined quote
// cannot be shown under one ¶ chip without misattributing half of it.
//
// Length bounds (reproduction rule, spec §5: short quotes only):
//   at least MIN_QUOTE_WORDS words, at most MAX_QUOTE_WORDS words.

import { allClaims, CASE_A_SECTIONS, COURT_ONLY_KINDS, type CaseA, type CaseASection, type ClaimA } from './claims';
import { certifiedQuestionFrom, dispositionFromJudgment, remittedFromJudgment, type Disposition } from './fc-parser';

export const MIN_QUOTE_WORDS = 3;
export const MAX_QUOTE_WORDS = 60;

export function normaliseForQuote(s: string): string {
  return s
    .normalize('NFC')
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u00AB\u00BB]/g, '"')
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[\u00AD\u200B\uFEFF]/g, '')
    .replace(/[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g, ' ')
    .trim();
}

export function quoteWordCount(quote: string): number {
  const n = normaliseForQuote(quote);
  return n ? n.split(' ').length : 0;
}

export function checkQuote(
  paragraphs: Record<number, string>,
  paras: number[],
  quote: string,
): { ok: true; para: number } | { ok: false; reason: string } {
  const q = normaliseForQuote(quote ?? '');
  if (!q) return { ok: false, reason: 'empty quote' };
  if (!Array.isArray(paras) || paras.length === 0) return { ok: false, reason: 'no paragraph cited' };
  const missing = paras.filter((p) => typeof paragraphs[p] !== 'string');
  if (missing.length) return { ok: false, reason: `cited paragraph(s) do not exist: ${missing.join(', ')}` };
  const words = q.split(' ').length;
  if (words < MIN_QUOTE_WORDS) return { ok: false, reason: `quote too short (${words} words; minimum ${MIN_QUOTE_WORDS})` };
  if (words > MAX_QUOTE_WORDS) return { ok: false, reason: `quote too long (${words} words; maximum ${MAX_QUOTE_WORDS})` };
  for (const p of paras) {
    if (normaliseForQuote(paragraphs[p]).includes(q)) return { ok: true, para: p };
  }
  // Diagnostic only: say where it is, but never accept it there.
  const elsewhere = Object.keys(paragraphs)
    .map(Number)
    .filter((p) => !paras.includes(p) && normaliseForQuote(paragraphs[p]).includes(q));
  return {
    ok: false,
    reason: elsewhere.length
      ? `quote not in cited paragraph(s) ${paras.join(', ')}; it appears in ${elsewhere.join(', ')}`
      : `quote not found verbatim in cited paragraph(s) ${paras.join(', ')}`,
  };
}

export type ClaimCheck = {
  id: string;
  section: CaseASection;
  kind: ClaimA['kind'];
  ok: boolean;
  para?: number;
  reason?: string;
};

export type CaseCheck = {
  results: ClaimCheck[];
  /** The case with failed claims removed (never repaired). */
  kept: CaseA;
  dropped: ClaimCheck[];
  /** True when the whole case must stop: failed holding, disposition, remitted or certified-question check. */
  stop: boolean;
  stopReasons: string[];
  regexDisposition: Disposition | null;
};

export type CaseCheckOptions = {
  /** The JUDGMENT block from the parser. Required for the disposition checks. */
  judgmentText?: string | null;
  /** From the parser: holdings and error_found claims must cite paragraphs at or after this one. */
  analysisStartPara?: number | null;
};

/**
 * Check every claim of an extracted case. Failed claims are dropped, never
 * repaired. A failed holding, a failed disposition quote, or any disagreement
 * between the model and the deterministic judgment parse stops the case.
 */
export function checkCaseA(c: CaseA, paragraphs: Record<number, string>, opts: CaseCheckOptions = {}): CaseCheck {
  const results: ClaimCheck[] = [];
  const stopReasons: string[] = [];

  for (const section of CASE_A_SECTIONS) {
    for (const claim of c[section]) {
      const base = { id: claim.id, section, kind: claim.kind };
      if (claim.external) {
        results.push({ ...base, ok: false, reason: 'external claim: needs fact-checker (stage 9); not published from phase 0' });
        continue;
      }
      if (COURT_ONLY_KINDS.includes(claim.kind) && claim.speaker !== 'court') {
        results.push({ ...base, ok: false, reason: `${claim.kind} claims must have speaker "court" (got "${claim.speaker}")` });
        continue;
      }
      if ((claim.kind === 'holding' || claim.kind === 'error_found') && opts.analysisStartPara && claim.paras.every((p) => p < opts.analysisStartPara!)) {
        results.push({ ...base, ok: false, reason: `${claim.kind} must cite the analysis section (para ${opts.analysisStartPara} onward)` });
        continue;
      }
      const q = checkQuote(paragraphs, claim.paras, claim.quote);
      results.push(q.ok ? { ...base, ok: true, para: q.para } : { ...base, ok: false, reason: q.reason });
    }
  }

  // Lessons stand on other claims: a lesson whose basis was dropped goes too.
  const okIds = new Set(results.filter((r) => r.ok).map((r) => r.id));
  for (const r of results) {
    if (!r.ok || r.kind !== 'lesson') continue;
    const claim = allClaims(c).find((x) => x.id === r.id);
    const basis = claim?.basedOn ?? [];
    if (basis.length === 0) { r.ok = false; r.reason = 'lesson has no basedOn claims'; continue; }
    const bad = basis.filter((id) => !okIds.has(id));
    if (bad.length) { r.ok = false; r.reason = `lesson based on dropped or unknown claim(s): ${bad.join(', ')}`; }
  }

  for (const r of results) {
    if (!r.ok && r.kind === 'holding') stopReasons.push(`holding ${r.id} failed: ${r.reason}`);
  }

  let regexDisposition: Disposition | null = null;
  const judgment = opts.judgmentText ?? null;
  if (!judgment) {
    stopReasons.push('no JUDGMENT block: disposition cannot be confirmed deterministically');
  } else {
    regexDisposition = dispositionFromJudgment(judgment);
    if (regexDisposition === 'consent') stopReasons.push('consent judgment: blocked by policy');
    else if (regexDisposition === 'allowed_in_part') stopReasons.push('allowed in part: blocked by policy');
    else if (regexDisposition === 'unknown') stopReasons.push('disposition regex could not classify the JUDGMENT block');
    else if (regexDisposition !== c.disposition) stopReasons.push(`disposition mismatch: model "${c.disposition}", JUDGMENT block "${regexDisposition}"`);

    const remitted = remittedFromJudgment(judgment);
    if (remitted !== c.remitted) stopReasons.push(`remitted mismatch: model ${c.remitted}, JUDGMENT block ${remitted}`);

    const cq = certifiedQuestionFrom(judgment);
    if (cq.status === 'certified' && !c.certifiedQuestion) stopReasons.push('JUDGMENT certifies a question but the model returned none');
    if (cq.status === 'none' && c.certifiedQuestion) stopReasons.push('model returned a certified question but the JUDGMENT certifies none');
    if (cq.status === 'unknown') stopReasons.push('certified question status could not be read from the JUDGMENT block');

    const dq = normaliseForQuote(c.dispositionQuote ?? '');
    const inJudgment = dq.length > 0 && normaliseForQuote(judgment).includes(dq);
    const inParas = dq.length > 0 && Object.values(paragraphs).some((p) => normaliseForQuote(p).includes(dq));
    if (!dq) stopReasons.push('disposition quote is empty');
    else if (!inJudgment && !inParas) stopReasons.push('disposition quote not found verbatim in the JUDGMENT block or any paragraph');
  }

  const keptIds = new Set(results.filter((r) => r.ok).map((r) => r.id));
  const kept: CaseA = { ...c };
  for (const s of CASE_A_SECTIONS) kept[s] = c[s].filter((x) => keptIds.has(x.id));
  if (kept.holdings.length === 0) stopReasons.push('no holding survived the checks');

  return {
    results,
    kept,
    dropped: results.filter((r) => !r.ok),
    stop: stopReasons.length > 0,
    stopReasons,
    regexDisposition,
  };
}
