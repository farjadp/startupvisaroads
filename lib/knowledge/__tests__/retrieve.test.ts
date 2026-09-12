import { describe, it, expect } from 'vitest';
import { queryTerms, keywordOverlap, recencyScore, scoreChunk, render, WEIGHTS } from '../retrieve';

describe('retrieve scoring', () => {
  it('drops stop words and short tokens, keeps Persian', () => {
    expect(queryTerms('How to apply for the Start-up Visa in Canada')).toEqual(['apply', 'start-up', 'visa', 'canada']);
    expect(queryTerms('ویزای استارتاپ کانادا')).toEqual(['ویزای', 'استارتاپ', 'کانادا']);
  });
  it('keyword overlap is the fraction of terms present', () => {
    expect(keywordOverlap(['visa', 'canada', 'fee'], 'The Canada visa costs money')).toBeCloseTo(2 / 3);
    expect(keywordOverlap([], 'x')).toBe(0);
  });
  it('recency decays over 18 months for news and is neutral for guides', () => {
    const now = Date.parse('2026-09-12');
    expect(recencyScore(new Date('2026-09-11'), false, now)).toBeCloseTo(1, 1);
    expect(recencyScore(new Date('2024-01-01'), false, now)).toBe(0);
    expect(recencyScore(new Date('2024-01-01'), true, now)).toBe(0.5);
    expect(recencyScore(null, false, now)).toBe(0.5);
  });
  it('weights sum to one and official beats press at equal similarity', () => {
    expect(Object.values(WEIGHTS).reduce((a, b) => a + b, 0)).toBeCloseTo(1);
    const base = { cosine: 0.8, keyword: 0.5, recency: 0.5 };
    expect(scoreChunk({ ...base, trust: 1 })).toBeGreaterThan(scoreChunk({ ...base, trust: 0.5 }));
  });
  it('renders an explicit "none" line when there is no evidence', () => {
    expect(render([], [])).toContain('none on file');
  });
  it('renders refs with provenance and quotes the chunk', () => {
    const r = render(
      [{ ref: 'S1', chunkId: 'c', documentId: 'd', sourceId: 's', title: 'SUV guide', url: 'https://canada.ca/x', trust: 'official', kind: 'html', locator: 'Eligibility', publishedAt: '2026-09-01T00:00:00.000Z', fetchedAt: '2026-09-02T00:00:00.000Z', text: 'Two years.', score: 0.9, parts: { cosine: 1, keyword: 1, trust: 1, recency: 1 } }],
      [{ sourceId: 'p', title: 'Pinned', url: null, digest: '- fact [IRCC]' }],
    );
    expect(r).toContain('[S1] SUV guide (official, https://canada.ca/x; Eligibility, published 2026-09-01)');
    expect(r).toContain('«Two years.»');
    expect(r).toContain('PINNED SOURCES');
  });
});
