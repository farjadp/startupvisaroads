import { describe, it, expect } from 'vitest';
import { ATLAS, NEARBY, atlasFlag, atlasByKey, countryCount } from '../route-atlas';
import { isFaPath } from '../paths';
import { RULES } from '../programmes';

/** Every Persian guide that is an immigration route rather than a hub, tool or page about us. */
const ROUTE_GUIDES = [
  '/high-impact-startup-pilot',
  '/canada-startup-visa',
  '/pnp/bc',
  '/pnp/alberta',
  '/pnp/manitoba',
  '/pnp/new-brunswick',
  '/pnp/nova-scotia',
  '/pnp/pei',
  '/europe/finland',
  '/europe/denmark',
  '/europe/netherlands',
  '/europe/estonia',
  '/europe/italy',
  '/europe/spain',
  '/europe/bulgaria',
  '/europe/belgium',
  '/turkey-tech-visa',
  '/israel',
  '/australia',
  '/uk/innovator-founder',
  '/usa',
];

describe('route atlas', () => {
  it('links only to pages that exist in Persian', () => {
    for (const r of ATLAS) expect(isFaPath(r.href), r.href).toBe(true);
  });

  it('covers every route guide, once', () => {
    const hrefs = ATLAS.map((r) => r.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect([...hrefs].sort()).toEqual([...ROUTE_GUIDES].sort());
  });

  it('cites an official https source and a date for every figure', () => {
    for (const r of ATLAS) {
      expect(r.source, r.key).toMatch(/^https:\/\//);
      expect(r.updated, r.key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  // The figure repeats a number from lib/fa/programmes.ts where one exists;
  // both must name the same official page.
  it('uses the same source as the comparison table where both cover a route', () => {
    for (const rule of RULES) {
      const a = ATLAS.find((r) => r.href === rule.href);
      if (a) expect(a.source, rule.key).toBe(rule.source);
    }
  });

  it('writes figures in Persian digits', () => {
    // Level names such as B2 or CLB 4 are names, not quantities, and stay Latin.
    for (const r of ATLAS) expect(`${r.figure} ${r.figureLabel}`.replace(/\b[A-Z]+ ?\d\b/g, ''), r.key).not.toMatch(/[0-9]/);
  });

  it('never quotes a VisaRoads price', () => {
    for (const r of ATLAS) expect(`${r.figure} ${r.line}`, r.key).not.toMatch(/ویزارودز|VisaRoads|هزینه‌ی خدمات/);
  });

  it('flags every country except Israel, which is left blank on purpose', () => {
    for (const r of ATLAS) {
      if (r.key === 'israel') expect(atlasFlag(r)).toBeNull();
      else expect(atlasFlag(r), r.key).not.toBeNull();
    }
  });

  it('counts fourteen countries', () => {
    expect(countryCount).toBe(14);
  });

  it('only suggests nearby routes that exist and are open or limited', () => {
    for (const [path, keys] of Object.entries(NEARBY)) {
      for (const k of keys) {
        const r = atlasByKey(k);
        expect(r, `${path} → ${k}`).toBeDefined();
        expect(['open', 'limited'], `${path} → ${k}`).toContain(r!.status);
      }
    }
  });
});
