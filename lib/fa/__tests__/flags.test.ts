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

  // The maple leaf is not geometry anyone should draw from memory, so it is
  // the official Pantone artwork rather than an approximation — and rather
  // than an omission that would leave the comparison table half-flagged.
  it('flags every Canadian route from the official artwork', () => {
    expect(flagFor('/pnp')).toBe('ca');
    expect(flagFor('/pnp/new-brunswick')).toBe('ca');
    expect(flagFor('/pnp/nova-scotia')).toBe('ca');
    expect(flagFor('/canada-startup-visa')).toBe('ca');
  });

  // Not an oversight: the fifty-star canton is not worth inlining for one
  // page, so that hero keeps the acid rule.
  it('leaves the US guide unflagged', () => {
    expect(flagFor('/usa-eb2-niw')).toBeNull();
  });

  // Australia earns one because the official artwork was available. The
  // Union Jack canton, the seven-pointed Commonwealth Star and the Southern
  // Cross are none of them drawable by eye, so the alternative was nothing.
  it('flags Australia at the 2:1 of the Flags Act', () => {
    expect(flagFor('/australia')).toBe('au');
    expect(FLAG_RATIO.au).toEqual({ w: 2, h: 1 });
    expect(FLAG_NAME.au).toBe('استرالیا');
  });

  // Israel is the case where the artwork could NOT be had: the legislated
  // spec fixes the field and the two bands but not the Star of David between
  // them. Nearly right is worse than absent for a symbol like that one.
  it('leaves the Israel guide unflagged, deliberately', () => {
    expect(flagFor('/israel')).toBeNull();
  });

  it('says nothing for a path that is not a country guide', () => {
    expect(flagFor('/mentorship')).toBeNull();
    expect(flagFor('/faq')).toBeNull();
  });

  it('only claims paths that are real guides', () => {
    const hrefs = new Set(RULES.map((r) => r.href));
    for (const p of ['/europe/denmark', '/europe/finland', '/europe/netherlands', '/europe/estonia']) {
      expect(hrefs.has(p), p).toBe(true);
    }
  });

  // The comparison table shows one row per rule. A row without a flag next to
  // rows with one reads as a mistake, so every rule must resolve to a flag.
  it('leaves no row of the comparison table unflagged', () => {
    for (const r of RULES) expect(flagFor(r.href), r.key).not.toBeNull();
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
    expect(FLAG_RATIO.ca).toEqual({ w: 2, h: 1 });
  });

  it('names every flag in Persian, so none is a decorative rectangle', () => {
    for (const code of ['dk', 'fi', 'nl', 'ee', 'ca'] as const) {
      expect(FLAG_NAME[code]).toMatch(/[؀-ۿ]/);
    }
  });
});
