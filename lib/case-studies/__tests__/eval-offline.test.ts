// Runs the synthetic subset of the Case Studies eval in CI (no API key, no
// private cache). The fc-real cases need ~/VisaRoads-private and are covered
// by `npx tsx scripts/case-studies/eval/run.ts --offline` on Farjad's Mac.
import { describe, expect, it } from 'vitest';
import { adversarialCases, scoreAdversarial, scoreTrace, scoreTypeB, traceFile, typeBCases } from '../../../scripts/case-studies/eval/score';

describe('case-studies eval: synthetic offline subset', () => {
  it('has the expected labelled cases', () => {
    expect(adversarialCases().length).toBeGreaterThanOrEqual(10);
    expect(typeBCases().length).toBeGreaterThanOrEqual(10);
    expect(traceFile().cases.length).toBeGreaterThanOrEqual(8);
  });

  it('hard-rule gate: every adversarial case behaves as labelled; 0 unsupported claims published', () => {
    const r = scoreAdversarial();
    expect(r.results.filter((x) => !x.ok)).toEqual([]);
    expect(r.unsupportedPublished).toBe(0);
  });

  it('stage 8 trace: parity, invented numbers, red lines, party names, fa lint all detected', () => {
    const r = scoreTrace();
    expect(r.results.filter((x) => !x.ok)).toEqual([]);
    expect(r.parity[0]).toBe(r.parity[1]);
  });

  it('type B: 0 planted personal data items leak through redaction', () => {
    const r = scoreTypeB();
    expect(r.leaked).toBe(0);
    expect(r.planted).toBeGreaterThanOrEqual(40);
  });
});
