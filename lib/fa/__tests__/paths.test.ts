import { describe, it, expect } from 'vitest';
import { FA_PATHS, FA_PAIRED, isFaPath } from '../paths';

describe('FA_PATHS', () => {
  it('contains the pillar page and the home path', () => {
    expect(FA_PATHS).toContain('');
    expect(FA_PATHS).toContain('/canada-startup-visa');
  });

  it('includes the Phase 3 destinations', () => {
    for (const p of ['/europe/finland', '/europe/denmark', '/europe/estonia', '/pnp/new-brunswick', '/pnp/nova-scotia']) {
      expect(FA_PATHS).toContain(p);
    }
  });

  it('excludes retired mirror paths', () => {
    expect(FA_PATHS).not.toContain('/pnp/ontario');
    expect(FA_PATHS).not.toContain('/country/denmark');
    expect(FA_PATHS).not.toContain('/usa/eb5');
  });

  it('has no duplicates and every entry is normalised', () => {
    expect(new Set(FA_PATHS).size).toBe(FA_PATHS.length);
    for (const p of FA_PATHS) {
      expect(p === '' || p.startsWith('/')).toBe(true);
      expect(p.endsWith('/')).toBe(false);
    }
  });
});

describe('isFaPath', () => {
  it('accepts listed paths and rejects unlisted ones', () => {
    expect(isFaPath('/faq')).toBe(true);
    expect(isFaPath('/pnp/ontario')).toBe(false);
  });

  it('ignores a trailing slash', () => {
    expect(isFaPath('/faq/')).toBe(true);
  });
});

describe('FA_PAIRED', () => {
  it('covers every FA path exactly', () => {
    expect(Object.keys(FA_PAIRED).sort()).toEqual([...FA_PATHS].sort());
  });

  it('pairs shared paths with their English twin', () => {
    expect(FA_PAIRED['']).toBe('');
    expect(FA_PAIRED['/mentorship']).toBe('/mentorship');
    expect(FA_PAIRED['/blog']).toBe('/blog');
  });

  it('pairs Denmark with the English country page, and leaves Estonia unpaired', () => {
    expect(FA_PAIRED['/europe/denmark']).toBe('/country/denmark');
    expect(FA_PAIRED['/europe/estonia']).toBeNull();
  });

  it('leaves Persian-only pages unpaired', () => {
    expect(FA_PAIRED['/canada-startup-visa/cost']).toBeNull();
    expect(FA_PAIRED['/which-path']).toBeNull();
  });
});
