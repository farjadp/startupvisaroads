import { describe, it, expect } from 'vitest';
import { flagFor, FLAG_RATIO, FLAG_NAME } from '../flags';
import { RULES } from '../programmes';

describe('flagFor', () => {
  it('gives each European guide its own flag', () => {
    expect(flagFor('/europe/denmark')).toBe('dk');
    expect(flagFor('/europe/finland')).toBe('fi');
    expect(flagFor('/europe/netherlands')).toBe('nl');
    expect(flagFor('/europe/estonia')).toBe('ee');
  });

  // A flag drawn from memory that is nearly right is worse than none, so the
  // Canadian guides carry no flag rather than an approximated maple leaf.
  it('gives the Canadian guides no flag rather than a wrong one', () => {
    expect(flagFor('/pnp/new-brunswick')).toBeNull();
    expect(flagFor('/pnp/nova-scotia')).toBeNull();
    expect(flagFor('/pnp')).toBeNull();
  });

  it('only claims paths that are real guides', () => {
    const hrefs = new Set(RULES.map((r) => r.href));
    for (const p of ['/europe/denmark', '/europe/finland', '/europe/netherlands', '/europe/estonia']) {
      expect(hrefs.has(p), p).toBe(true);
    }
  });
});

describe('flag proportions', () => {
  // Each country legislates its own ratio; drawing them all at 3:2 would be
  // wrong for three of the four.
  it('uses the legislated ratio, not a house default', () => {
    expect(FLAG_RATIO.dk).toEqual({ w: 37, h: 28 });
    expect(FLAG_RATIO.fi).toEqual({ w: 18, h: 11 });
    expect(FLAG_RATIO.nl).toEqual({ w: 3, h: 2 });
    expect(FLAG_RATIO.ee).toEqual({ w: 11, h: 7 });
  });

  it('names every flag in Persian, so none is a decorative rectangle', () => {
    for (const code of ['dk', 'fi', 'nl', 'ee'] as const) {
      expect(FLAG_NAME[code]).toMatch(/[؀-ۿ]/);
    }
  });
});
