import { describe, it, expect } from 'vitest';
import { MAX_SAMENESS, closestOwnArticle, isTemplateTitle, lengthFloor, qualityVerdict } from '../quality';

describe('isTemplateTitle', () => {
  it('catches the openers the June 2026 batch was built from', () => {
    expect(isTemplateTitle('Navigating the Dutch Startup Visa: A Comprehensive Guide for Entrepreneurs')).toBe(true);
    expect(isTemplateTitle('The Ultimate Guide to the Netherlands Residence Permit for Foreign Startups')).toBe(true);
    expect(isTemplateTitle('Comprehensive Guide to Finland\'s Startup Visa')).toBe(true);
    expect(isTemplateTitle('Mastering Global Hiring with G-P EOR')).toBe(true);
    expect(isTemplateTitle('Unlocking Your Business Potential: The Estonian Startup Visa')).toBe(true);
  });

  it('leaves the titles the autopilot writes now alone', () => {
    expect(isTemplateTitle('Finland Start-up Permit Process 2026, Step by Step')).toBe(false);
    expect(isTemplateTitle('How Facilitators Shape Success with the Netherlands Startup Visa')).toBe(false);
    expect(isTemplateTitle('Proof of Funds for the Netherlands Startup Visa')).toBe(false);
    expect(isTemplateTitle('A complete list of Danish documents')).toBe(false);
    expect(isTemplateTitle('Ultimately, which route fits a solo founder?')).toBe(false);
  });
});

describe('closestOwnArticle', () => {
  // Deterministic prose: each seed draws its own word order from one
  // vocabulary, as two articles on the same programme would.
  const VOCAB = 'founder permit residence business plan evaluation committee innovation market funding team product revenue customer office application interview document approval'.split(' ');
  const para = (seed: string) => {
    let x = [...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
    return Array.from({ length: 600 }, () => {
      x = (x * 1103515245 + 12345) >>> 0;
      return VOCAB[x % VOCAB.length];
    }).join(' ');
  };

  it('finds a rewrite of an article we already published', () => {
    const existing = para('alpha');
    const c = closestOwnArticle(existing, [{ title: 'Alpha', content: existing }, { title: 'Beta', content: para('beta') }]);
    expect(c?.title).toBe('Alpha');
    expect(c!.ratio).toBeGreaterThan(0.9);
  });

  it('scores different articles on the same programme low', () => {
    const c = closestOwnArticle(para('gamma'), [{ title: 'Delta', content: para('delta') }]);
    expect(c!.ratio).toBeLessThan(MAX_SAMENESS);
  });

  it('returns null with nothing to compare', () => {
    expect(closestOwnArticle('', [{ title: 'x', content: 'y' }])).toBeNull();
  });
});

describe('qualityVerdict', () => {
  it('skips a repeat before anything else', () => {
    const v = qualityVerdict({ title: 'Ultimate Guide', words: 100, min: 1000, closest: { title: 'Old', ratio: 0.5 } });
    expect(v.skip).toMatch(/repeats "Old"/);
  });

  it('holds a thin body and a template title as a draft', () => {
    const v = qualityVerdict({ title: 'Navigating Denmark', words: lengthFloor(1000) - 1, min: 1000, closest: { title: 'Old', ratio: 0.03 } });
    expect(v.skip).toBeUndefined();
    expect(v.draft).toHaveLength(2);
  });

  it('passes a full-length article with its own title', () => {
    const v = qualityVerdict({ title: 'Proof of Funds for the Netherlands Startup Visa', words: 1200, min: 1000, closest: null });
    expect(v).toEqual({ draft: [] });
  });
});
