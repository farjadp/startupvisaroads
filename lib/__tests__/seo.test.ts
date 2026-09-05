import { describe, it, expect } from 'vitest';
import { buildAlternates, SITE_URL } from '../seo';

describe('buildAlternates', () => {
  it('emits both languages for a paired path', () => {
    const a = buildAlternates('/mentorship', 'en') as any;
    expect(a.canonical).toBe(`${SITE_URL}/en/mentorship`);
    expect(a.languages.en).toBe(`${SITE_URL}/en/mentorship`);
    expect(a.languages.fa).toBe(`${SITE_URL}/fa/mentorship`);
    expect(a.languages['x-default']).toBe(`${SITE_URL}/en/mentorship`);
  });

  it('maps a paired path whose slugs differ per locale', () => {
    const a = buildAlternates('/startup-visa-canada', 'en') as any;
    expect(a.languages.fa).toBe(`${SITE_URL}/fa/canada-startup-visa`);
  });

  it('omits fa for an English-only path', () => {
    const a = buildAlternates('/usa/eb5', 'en') as any;
    expect(a.languages.fa).toBeUndefined();
    expect(a.languages.en).toBe(`${SITE_URL}/en/usa/eb5`);
    expect(a.languages['x-default']).toBe(`${SITE_URL}/en/usa/eb5`);
  });

  it('omits en for a Persian-only path and self-references x-default', () => {
    const a = buildAlternates('/which-path', 'fa') as any;
    expect(a.canonical).toBe(`${SITE_URL}/fa/which-path`);
    expect(a.languages.en).toBeUndefined();
    expect(a.languages.fa).toBe(`${SITE_URL}/fa/which-path`);
    expect(a.languages['x-default']).toBe(`${SITE_URL}/fa/which-path`);
  });

  it('strips an incoming locale prefix before pairing', () => {
    const a = buildAlternates('/fa/canada-startup-visa', 'fa') as any;
    expect(a.canonical).toBe(`${SITE_URL}/fa/canada-startup-visa`);
    expect(a.languages.en).toBe(`${SITE_URL}/en/startup-visa-canada`);
  });
});
