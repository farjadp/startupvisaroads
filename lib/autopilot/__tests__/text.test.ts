import { describe, it, expect } from 'vitest';
import { numberTokens, inventedNumbers, wordCountHtml, enforceLinks, normalisePath } from '../text';
import type { Inventory } from '../inventory';

const inv: Inventory = {
  locale: 'en',
  targets: [
    { path: '/pnp/ontario', label: 'Ontario PNP', kind: 'page' },
    { path: '/tools/express-entry', label: 'Express Entry diagnostic', kind: 'tool' },
    { path: '/blog/old-post', label: 'An older post', kind: 'article' },
  ],
  recentTitles: [],
  recentCategories: [],
  categories: [],
};

describe('numberTokens', () => {
  it('folds Persian and Arabic-Indic digits to Latin', () => {
    expect([...numberTokens('۴۲ و ٣٥')]).toEqual(['42', '35']);
  });
  it('ignores long ids', () => {
    expect(numberTokens('id 12345678').size).toBe(0);
  });
});

describe('inventedNumbers', () => {
  it('returns digits present in after but not before', () => {
    expect(inventedNumbers('costs 800', 'costs 800 and 15 percent')).toEqual(['15']);
  });
  it('is empty when only decimal punctuation changed', () => {
    expect(inventedNumbers('۴۲٫۵ درصد', '۴۲.۵ درصد')).toEqual([]);
  });
});

describe('wordCountHtml', () => {
  it('counts words, not tags or svg', () => {
    expect(wordCountHtml('<h2>Hello world</h2><svg><text>x y z</text></svg><p>three more words</p>')).toBe(5);
  });
});

describe('normalisePath', () => {
  it('strips locale prefix, query and trailing slash', () => {
    expect(normalisePath('/en/pnp/ontario/?x=1', 'en')).toBe('/pnp/ontario');
    expect(normalisePath('/fa/pnp/ontario#top', 'fa')).toBe('/pnp/ontario');
    expect(normalisePath('pnp/ontario', 'en')).toBe('/pnp/ontario');
  });
});

describe('enforceLinks', () => {
  it('keeps known internal links and prefixes the locale', () => {
    const { html, links } = enforceLinks('<p>See <a href="/pnp/ontario">Ontario</a>.</p>', inv);
    expect(html).toContain('<a href="/en/pnp/ontario">Ontario</a>');
    expect(links).toEqual(['/pnp/ontario']);
  });
  it('accepts an already locale-prefixed href without double prefixing', () => {
    const { html } = enforceLinks('<a href="/en/tools/express-entry">tool</a>', inv);
    expect(html).toContain('href="/en/tools/express-entry"');
    expect(html).not.toContain('/en/en/');
  });
  it('demotes unknown internal paths to plain text', () => {
    const { html, links } = enforceLinks('<p>Read <a href="/pnp/quebec">Quebec</a> now.</p>', inv);
    expect(html).toBe('<p>Read Quebec now.</p>');
    expect(links).toEqual([]);
  });
  it('keeps allowlisted official HTTPS citations with safe external-link attributes', () => {
    const { html, links, officialLinks, officialCitationCount } = enforceLinks(
      '<a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" rel="nofollow">IRCC</a>',
      inv,
    );
    expect(html).toContain('href="https://www.canada.ca/en/immigration-refugees-citizenship.html"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(links).toEqual([]);
    expect(officialLinks).toEqual(['https://www.canada.ca/en/immigration-refugees-citizenship.html']);
    expect(officialCitationCount).toBe(1);
  });
  it('strips arbitrary, insecure, and lookalike outbound links to plain text', () => {
    const { html, officialCitationCount } = enforceLinks(
      '<a href="https://example.com/x">other</a> <a href="http://www.canada.ca/x">insecure</a> <a href="https://canada.ca.evil.test/x">lookalike</a> <a href="https://www.canada.ca:444/x">wrong port</a>',
      inv,
    );
    expect(html).toBe('other insecure lookalike wrong port');
    expect(officialCitationCount).toBe(0);
  });
  it('treats absolute URLs on our own domain as internal', () => {
    const { html, links } = enforceLinks('<a href="https://visaroads.com/fa/pnp/ontario">x</a>', inv);
    expect(html).toContain('href="/en/pnp/ontario"');
    expect(links).toEqual(['/pnp/ontario']);
  });
  it('replaces a path used as anchor text with the inventory label', () => {
    const { html } = enforceLinks('<a href="/pnp/ontario">/pnp/ontario</a>', inv);
    expect(html).toContain('>Ontario PNP</a>');
  });
  it('leaves images alone', () => {
    const { html } = enforceLinks('<img src="https://cdn/x.jpg" alt="a">', inv);
    expect(html).toContain('<img src="https://cdn/x.jpg"');
  });
});

describe('structureDrift', () => {
  it('accepts a rewrite that keeps the skeleton', async () => {
    const { structureDrift } = await import('../pipeline');
    const a = '<h2>A</h2><p>x <a href="/pnp">y</a></p>[VISUAL_1]<h2>B</h2>';
    const b = '<h2>A?</h2><p>xx <a href="/pnp">yy</a></p>[VISUAL_1]<h2>B!</h2>';
    expect(structureDrift(a, b)).toBeNull();
  });
  it('rejects lost markers, links and headings', async () => {
    const { structureDrift } = await import('../pipeline');
    const a = '<h2>A</h2><p><a href="/pnp">y</a></p>[VISUAL_1]<h2>B</h2>';
    expect(structureDrift(a, '<h2>A</h2><p><a href="/pnp">y</a></p><h2>B</h2>')).toBe('[VISUAL_1] lost');
    expect(structureDrift(a, '<h2>A</h2><p>y</p>[VISUAL_1]<h2>B</h2>')).toBe('links lost');
    expect(structureDrift(a, '<h2>A</h2><p><a href="/pnp">y</a></p>[VISUAL_1]')).toBe('h2 count changed');
  });
});

describe('structureDrift with allowNewSections', () => {
  it('lets expand add a section but not drop one', async () => {
    const { structureDrift } = await import('../pipeline');
    const a = '<h2>A</h2><h2>B</h2>';
    expect(structureDrift(a, '<h2>A</h2><h2>B</h2><h2>C</h2>', { allowNewSections: true })).toBeNull();
    expect(structureDrift(a, '<h2>A</h2>', { allowNewSections: true })).toBe('h2 count changed');
    expect(structureDrift(a, '<h2>A</h2><h2>B</h2><h2>C</h2>')).toBe('h2 count changed');
  });
});
