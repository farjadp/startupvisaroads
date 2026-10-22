import { describe, it, expect } from 'vitest';
import { quotaCount, type GenerateResult } from '../pipeline';

const result = (...statuses: ('DRAFT' | 'PUBLISHED')[]): GenerateResult => ({
  created: statuses.map((status, i) => ({ id: String(i), slug: `s${i}`, title: `t${i}`, status })),
  errors: [],
  skipped: [],
  warnings: [],
});

describe('quotaCount', () => {
  // The planned lane drafted every morning for two weeks and stopped there,
  // because the draft filled its quota of one and the spare never ran.
  it('does not count a DRAFT toward a publishing run', () => {
    expect(quotaCount(result('DRAFT'), true)).toBe(0);
    expect(quotaCount(result('DRAFT', 'PUBLISHED'), true)).toBe(1);
  });

  it('counts everything on a run that was never meant to publish', () => {
    expect(quotaCount(result('DRAFT', 'DRAFT'), false)).toBe(2);
  });
});
