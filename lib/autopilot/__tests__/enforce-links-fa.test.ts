import { describe, it, expect } from 'vitest';
import { enforceLinks } from '../text';
import { FA_SITE_PAGES } from '../inventory';
import type { Inventory } from '../inventory';

const faInv: Inventory = {
  locale: 'fa',
  targets: FA_SITE_PAGES.map((p) => ({ path: p.path, label: p.label, kind: p.kind })),
  recentTitles: [],
  recentTopicSlugs: [],
  recentCategories: [],
  categories: [],
};

describe('enforceLinks with the Persian inventory', () => {
  it('demotes a retired mirror link to plain text, keeping the words', () => {
    const html = '<p>درباره <a href="/fa/pnp/ontario">برنامه استانی انتاریو</a> بخوانید.</p>';
    const { html: out, links } = enforceLinks(html, faInv);
    expect(out).not.toContain('<a');
    expect(out).toContain('برنامه استانی انتاریو');
    expect(links).not.toContain('/pnp/ontario');
  });

  it('keeps a link to a real Persian page', () => {
    const html = '<p><a href="/fa/canada-startup-visa">ویزای استارتاپ کانادا</a></p>';
    const { html: out, links } = enforceLinks(html, faInv);
    expect(out).toContain('href="/fa/canada-startup-visa"');
    expect(links).toContain('/canada-startup-visa');
  });
});
