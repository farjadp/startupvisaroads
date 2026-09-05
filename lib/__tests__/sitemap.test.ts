import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  articleFindMany: vi.fn(),
  categoryFindMany: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    article: { findMany: mocks.articleFindMany },
    category: { findMany: mocks.categoryFindMany },
  },
}));

import sitemap from '@/app/sitemap';
import { SITE_URL } from '@/lib/seo';

describe('sitemap', () => {
  beforeEach(() => {
    mocks.articleFindMany.mockReset();
    mocks.categoryFindMany.mockReset();
    mocks.articleFindMany.mockResolvedValue([]);
    mocks.categoryFindMany.mockResolvedValue([]);
  });

  it('includes only the intended locale-specific static routes', async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${SITE_URL}/en/country`);
    expect(urls).toContain(`${SITE_URL}/en/tools`);
    expect(urls).toContain(`${SITE_URL}/en/tools/express-entry`);
    expect(urls).toContain(`${SITE_URL}/en/book-meeting`);
    expect(urls).toContain(`${SITE_URL}/en/webinar`);
    expect(urls).toContain(`${SITE_URL}/fa/webinar`);
    expect(urls).not.toContain(`${SITE_URL}/fa/tools`);
    expect(urls).not.toContain(`${SITE_URL}/en/europe/denmark`);
    expect(urls.some((url) => url.includes('/landing'))).toBe(false);
    expect(urls.some((url) => url.endsWith('/unsubscribe'))).toBe(false);
  });

  it('does not churn lastModified dates for static routes', async () => {
    const entries = await sitemap();
    const staticEntry = entries.find((entry) => entry.url === `${SITE_URL}/en/about`);

    expect(staticEntry).not.toHaveProperty('lastModified');
  });

  it('publishes category archives only for locales with published articles', async () => {
    const enUpdated = new Date('2026-01-03T00:00:00.000Z');
    const faUpdated = new Date('2026-01-04T00:00:00.000Z');
    mocks.categoryFindMany.mockResolvedValue([
      {
        slug: 'startup-guides',
        articles: [
          { locale: 'en', updatedAt: enUpdated },
          { locale: 'fa', updatedAt: faUpdated },
        ],
      },
      {
        slug: 'canada-news',
        articles: [{ locale: 'en', updatedAt: enUpdated }],
      },
    ]);

    const entries = await sitemap();
    const categories = entries.filter((entry) => entry.url.includes('/blog/category/'));

    expect(categories.map((entry) => entry.url)).toEqual([
      `${SITE_URL}/en/blog/category/startup-guides`,
      `${SITE_URL}/fa/blog/category/startup-guides`,
      `${SITE_URL}/en/blog/category/canada-news`,
    ]);
    expect(categories[0].lastModified).toEqual(enUpdated);
    expect(categories[1].lastModified).toEqual(faUpdated);
    expect(categories[0].alternates?.languages).toEqual({
      en: `${SITE_URL}/en/blog/category/startup-guides`,
      fa: `${SITE_URL}/fa/blog/category/startup-guides`,
    });
    expect(categories[2].alternates?.languages).toEqual({
      en: `${SITE_URL}/en/blog/category/canada-news`,
    });
  });
});
