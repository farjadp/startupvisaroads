// The pool is the queue. These tests hold the two properties that make it one:
// a keyword is spent for good, and consecutive runs do not see the same head
// of the list.
import { describe, it, expect } from 'vitest';
import { EN_KEYWORDS, FA_KEYWORDS, keywordsForToday, unusedKeywords } from '../keywords';

describe('the pool', () => {
  it('carries enough distinct subjects to stop the lane circling', () => {
    expect(EN_KEYWORDS.length).toBeGreaterThan(60);
    expect(FA_KEYWORDS.length).toBeGreaterThan(20);
    expect(new Set(EN_KEYWORDS).size).toBe(EN_KEYWORDS.length);
  });

  it('leaves out what belongs on a landing page rather than in the magazine', () => {
    for (const k of ['visa consultant near me', 'visaroads success rate', 'free immigration consultation', 'immigration help emergency']) {
      expect(EN_KEYWORDS).not.toContain(k);
    }
    // …and keeps the ones that are a real article.
    expect(EN_KEYWORDS).toContain('canadian startup visa requirements');
    expect(EN_KEYWORDS).toContain('why visa application gets rejected');
  });
});

describe('unusedKeywords', () => {
  it('spends a keyword for good, whatever case it was written in', () => {
    const left = unusedKeywords('en', ['Canadian Startup Visa Requirements ']);
    expect(left).not.toContain('canadian startup visa requirements');
    expect(left.length).toBe(EN_KEYWORDS.length - 1);
  });
});

describe('keywordsForToday', () => {
  it('shows a different slice on consecutive days', () => {
    const day1 = keywordsForToday('en', [], 3, new Date('2026-09-09T07:00:00Z'));
    const day2 = keywordsForToday('en', [], 3, new Date('2026-09-10T07:00:00Z'));
    expect(day1).not.toEqual(day2);
    expect(day1).toHaveLength(3);
  });

  it('hands back what is left when the pool runs low, and nothing when it is empty', () => {
    expect(keywordsForToday('en', EN_KEYWORDS, 3)).toEqual([]);
    const nearlySpent = EN_KEYWORDS.slice(0, EN_KEYWORDS.length - 2);
    expect(keywordsForToday('en', nearlySpent, 3)).toHaveLength(2);
  });
});
