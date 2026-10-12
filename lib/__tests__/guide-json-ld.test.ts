import { describe, it, expect } from 'vitest';
import { guideJsonLd } from '@/components/GuideJsonLd';

describe('guideJsonLd', () => {
  it('builds WebPage + a three-step breadcrumb for a province under the PNP hub', () => {
    const data = guideJsonLd('/pnp/alberta');
    expect(data).not.toBeNull();
    const [page, crumbs] = data as unknown as [Record<string, unknown>, { itemListElement: { name: string; item: string }[] }];
    expect(page['@type']).toBe('WebPage');
    expect(page.name).toBe('Alberta PNP (AAIP)');
    expect(page.url).toMatch(/\/en\/pnp\/alberta$/);
    expect(crumbs.itemListElement.map((c) => c.item.replace(/^https?:\/\/[^/]+/, ''))).toEqual(['/en', '/en/pnp', '/en/pnp/alberta']);
  });

  it('skips the middle crumb for pages outside a hub', () => {
    const [, crumbs] = guideJsonLd('/startup-visa-canada') as [unknown, { itemListElement: unknown[] }];
    expect(crumbs.itemListElement).toHaveLength(2);
  });

  it('returns null for a path with no published copy', () => {
    expect(guideJsonLd('/no-such-page')).toBeNull();
  });
});
