import { describe, expect, it } from 'vitest';
import { checkCaseA, checkQuote, normaliseForQuote } from '../quotes';
import type { CaseA, ClaimA } from '../claims';

// Synthetic paragraphs only: no real decision text in the repo.
const P: Record<number, string> = {
  3: 'The applicant applied for a work permit under the start-up business stream.',
  12: 'The Officer stated that the language test results were not found in the application.',
  20: 'The duty of procedural fairness is on the lower end of the spectrum for work permit applications.',
  25: 'It is agreed that the Officer erred in stating that the test results were not included in the application. They were – and they met the benchmark.',
  26: 'I find that the Officer’s treatment of the funds, together with the test error, renders the decision unreasonable in its totality.',
};

describe('checkQuote', () => {
  it('passes an exact quote in the cited paragraph', () => {
    expect(checkQuote(P, [26], 'renders the decision unreasonable in its totality')).toEqual({ ok: true, para: 26 });
  });

  it('returns the cited paragraph that matched when several are cited', () => {
    expect(checkQuote(P, [25, 26], 'renders the decision unreasonable')).toEqual({ ok: true, para: 26 });
  });

  it('fails when one character changes', () => {
    const r = checkQuote(P, [26], 'renders the decision unreasonable in its entirety');
    expect(r.ok).toBe(false);
    expect(checkQuote(P, [26], 'renders the decision unreasonabIe in its totality').ok).toBe(false);
  });

  it('is case-sensitive (no fuzzy matching)', () => {
    expect(checkQuote(P, [26], 'Renders the decision unreasonable').ok).toBe(false);
  });

  it('fails on the wrong paragraph and says where the quote really is', () => {
    const r = checkQuote(P, [25], 'renders the decision unreasonable');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/appears in 26/);
  });

  it('fails on an empty or whitespace quote', () => {
    expect(checkQuote(P, [26], '')).toEqual({ ok: false, reason: 'empty quote' });
    expect(checkQuote(P, [26], '   \n ')).toEqual({ ok: false, reason: 'empty quote' });
  });

  it('fails when no paragraph is cited or a cited paragraph does not exist', () => {
    expect(checkQuote(P, [], 'renders the decision unreasonable').ok).toBe(false);
    const r = checkQuote(P, [99], 'renders the decision unreasonable');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/do not exist: 99/);
  });

  it('normalises whitespace runs on both sides', () => {
    expect(checkQuote(P, [20], 'on the   lower\n end of\tthe spectrum').ok).toBe(true);
    expect(checkQuote({ 1: 'one   two\n\nthree four' }, [1], 'one two three four').ok).toBe(true);
  });

  it('maps typographic quotes, apostrophes and dashes on both sides', () => {
    expect(checkQuote(P, [26], "the Officer's treatment of the funds").ok).toBe(true);
    expect(checkQuote(P, [25], 'They were - and they met the benchmark').ok).toBe(true);
    expect(checkQuote({ 1: 'he said "no file" was found' }, [1], 'he said “no file” was found').ok).toBe(true);
  });

  it('does not accept paraphrase, reordering or dropped words', () => {
    expect(checkQuote(P, [26], 'renders the whole decision unreasonable').ok).toBe(false);
    expect(checkQuote(P, [26], 'the decision unreasonable renders').ok).toBe(false);
    expect(checkQuote(P, [26], 'renders decision unreasonable in its totality').ok).toBe(false);
  });

  it('fails a quote that spans two paragraphs (no adjacent-paragraph rule)', () => {
    const r = checkQuote(P, [25, 26], 'they met the benchmark. I find that the Officer');
    expect(r.ok).toBe(false);
  });

  it('enforces the short-quote bounds', () => {
    expect(checkQuote(P, [26], 'unreasonable').ok).toBe(false);
    const long = Array.from({ length: 70 }, (_, i) => `w${i}`).join(' ');
    const r = checkQuote({ 1: long }, [1], long);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/too long/);
  });

  it('normaliseForQuote is deterministic and documented', () => {
    expect(normaliseForQuote('  a b — “c”… ')).toBe('a b - "c"...');
    expect(normaliseForQuote('soft­hyphen')).toBe('softhyphen');
  });
});

const claim = (over: Partial<ClaimA> & Pick<ClaimA, 'id' | 'kind'>): ClaimA => ({
  text: 'x',
  paras: [26],
  quote: 'renders the decision unreasonable in its totality',
  speaker: 'court',
  ...over,
});

function baseCase(over: Partial<CaseA> = {}): CaseA {
  return {
    citation: '2099 FC 1', courtFile: 'IMM-1-99', url: 'https://decisions.fct-cf.gc.ca/x', decisionDate: '2099-01-01', sha256: 'abc',
    programme: 'suv', disposition: 'allowed', dispositionQuote: 'this application is granted', remitted: true, certifiedQuestion: null,
    standardOfReview: [], facts: [claim({ id: 'f1', kind: 'fact', paras: [3], quote: 'applied for a work permit', speaker: 'court' })],
    issues: [],
    holdings: [claim({ id: 'h1', kind: 'holding' })],
    officerErred: [claim({ id: 'e1', kind: 'error_found', paras: [25], quote: 'the Officer erred in stating' })],
    lessons: [claim({ id: 'l1', kind: 'lesson', paras: [25], quote: 'they met the benchmark', basedOn: ['e1'] })],
    ...over,
  };
}

const JUDGMENT = "THIS COURT'S JUDGMENT is that this application is granted; the decision is set aside and is to be considered by a different officer; and no question is certified.";

describe('checkCaseA', () => {
  it('keeps a clean case and does not stop', () => {
    const r = checkCaseA(baseCase(), P, { judgmentText: JUDGMENT, analysisStartPara: 20 });
    expect(r.stopReasons).toEqual([]);
    expect(r.stop).toBe(false);
    expect(r.dropped).toEqual([]);
    expect(r.regexDisposition).toBe('allowed');
  });

  it('drops a failed fact without repairing it, and does not stop', () => {
    const c = baseCase({ facts: [claim({ id: 'f1', kind: 'fact', paras: [3], quote: 'applied for a study permit' })] });
    const r = checkCaseA(c, P, { judgmentText: JUDGMENT, analysisStartPara: 20 });
    expect(r.stop).toBe(false);
    expect(r.kept.facts).toEqual([]);
    expect(r.dropped.map((d) => d.id)).toEqual(['f1']);
  });

  it('stops when a holding fails', () => {
    const c = baseCase({ holdings: [claim({ id: 'h1', kind: 'holding', quote: 'renders the decision reasonable' })] });
    const r = checkCaseA(c, P, { judgmentText: JUDGMENT, analysisStartPara: 20 });
    expect(r.stop).toBe(true);
    expect(r.stopReasons.join(' ')).toMatch(/holding h1 failed/);
  });

  it('rejects a holding not spoken by the Court', () => {
    const c = baseCase({ holdings: [claim({ id: 'h1', kind: 'holding', speaker: 'officer' })] });
    const r = checkCaseA(c, P, { judgmentText: JUDGMENT });
    expect(r.stop).toBe(true);
  });

  it('rejects a holding that cites only paragraphs before the analysis', () => {
    const c = baseCase({ holdings: [claim({ id: 'h1', kind: 'holding', paras: [12], quote: 'the language test results were not found' })] });
    const r = checkCaseA(c, P, { judgmentText: JUDGMENT, analysisStartPara: 20 });
    expect(r.stop).toBe(true);
  });

  it('drops a lesson whose basis was dropped', () => {
    const c = baseCase({ officerErred: [claim({ id: 'e1', kind: 'error_found', paras: [25], quote: 'the Officer was wrong' })] });
    const r = checkCaseA(c, P, { judgmentText: JUDGMENT, analysisStartPara: 20 });
    expect(r.kept.lessons).toEqual([]);
    expect(r.dropped.find((d) => d.id === 'l1')?.reason).toMatch(/dropped or unknown/);
  });

  it('drops external claims in phase 0', () => {
    const c = baseCase({ facts: [claim({ id: 'f9', kind: 'fact', external: true })] });
    expect(checkCaseA(c, P, { judgmentText: JUDGMENT }).dropped.map((d) => d.id)).toContain('f9');
  });

  it('stops on disposition disagreement between model and JUDGMENT block', () => {
    const r = checkCaseA(baseCase({ disposition: 'dismissed' }), P, { judgmentText: JUDGMENT });
    expect(r.stop).toBe(true);
    expect(r.stopReasons.join(' ')).toMatch(/disposition mismatch/);
  });

  it('stops on consent and allowed-in-part judgments', () => {
    expect(checkCaseA(baseCase(), P, { judgmentText: 'On consent, the application for judicial review is allowed and the matter is remitted.' }).stopReasons.join(' ')).toMatch(/consent/);
    expect(checkCaseA(baseCase(), P, { judgmentText: 'The application is allowed in part and remitted. No question is certified.' }).stopReasons.join(' ')).toMatch(/in part/);
  });

  it('stops when remitted or certified question disagree', () => {
    expect(checkCaseA(baseCase({ remitted: false }), P, { judgmentText: JUDGMENT }).stopReasons.join(' ')).toMatch(/remitted mismatch/);
    expect(checkCaseA(baseCase({ certifiedQuestion: 'Is X Y?' }), P, { judgmentText: JUDGMENT }).stopReasons.join(' ')).toMatch(/certifies none/);
  });

  it('stops when the disposition quote is not verbatim', () => {
    const r = checkCaseA(baseCase({ dispositionQuote: 'the application is granted' }), P, { judgmentText: JUDGMENT });
    expect(r.stopReasons.join(' ')).toMatch(/disposition quote/);
  });

  it('stops without a JUDGMENT block', () => {
    expect(checkCaseA(baseCase(), P, {}).stop).toBe(true);
  });
});
