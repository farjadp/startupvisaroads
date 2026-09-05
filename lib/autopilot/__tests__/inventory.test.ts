import { describe, it, expect } from 'vitest';
import { SITE_PAGES, FA_SITE_PAGES } from '../inventory';
import { isFaPath } from '@/lib/fa/paths';

describe('FA_SITE_PAGES', () => {
  it('only offers paths that exist on the Persian site', () => {
    for (const p of FA_SITE_PAGES) {
      expect(isFaPath(p.path), `${p.path} is not a Persian path`).toBe(true);
    }
  });

  it('offers no retired mirror path', () => {
    const paths = FA_SITE_PAGES.map((p) => p.path);
    expect(paths).not.toContain('/pnp/ontario');
    expect(paths).not.toContain('/country/denmark');
    expect(paths).not.toContain('/usa/eb5');
  });

  it('includes the Persian pillar and the assessment lead magnet', () => {
    const paths = FA_SITE_PAGES.map((p) => p.path);
    expect(paths).toContain('/canada-startup-visa');
    expect(paths).toContain('/which-path');
  });

  it('has a non-empty Persian label for every entry', () => {
    for (const p of FA_SITE_PAGES) expect(p.label.trim().length).toBeGreaterThan(0);
  });
});

describe('SITE_PAGES', () => {
  it('is the English list and keeps the province pages', () => {
    const paths = SITE_PAGES.map((p) => p.path);
    expect(paths).toContain('/pnp/ontario');
    expect(paths).toContain('/usa/eb5');
  });
});
