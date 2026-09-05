import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  articleCount: vi.fn(),
  articleFindFirst: vi.fn(),
  articleFindMany: vi.fn(),
  articleFindUnique: vi.fn(),
  categoryFindMany: vi.fn(),
  categoryFindUnique: vi.fn(),
  queryRaw: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    article: {
      count: mocks.articleCount,
      findFirst: mocks.articleFindFirst,
      findMany: mocks.articleFindMany,
      findUnique: mocks.articleFindUnique,
    },
    category: {
      findMany: mocks.categoryFindMany,
      findUnique: mocks.categoryFindUnique,
    },
    $queryRaw: mocks.queryRaw,
  },
}));

import {
  buildBlogPageHref,
  buildRelatedArticleBox,
  computeReadingTime,
  getArticleBySlug,
  getBlogIndexData,
  getCategoryArchiveData,
  getRelatedArticle,
  getRecommendedService,
  getSafeQuickFacts,
} from '../blog';

beforeEach(() => {
  for (const mock of Object.values(mocks)) mock.mockReset();
});

describe('locale-safe article queries', () => {

  it('loads an article by both slug and requested locale', async () => {
    mocks.articleFindFirst.mockResolvedValue(null);

    await getArticleBySlug('same-slug', 'fa');

    expect(mocks.articleFindFirst).toHaveBeenCalledWith({
      where: { slug: 'same-slug', locale: 'fa' },
      include: { category: true, tags: true },
    });
    expect(mocks.articleFindUnique).not.toHaveBeenCalled();
  });

  it('keeps both related-article searches in the source article locale', async () => {
    mocks.articleFindFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'related' });

    await getRelatedArticle({ id: 'source', categoryId: 'category', locale: 'fa' });

    expect(mocks.articleFindFirst).toHaveBeenNthCalledWith(1, {
      where: {
        NOT: { id: 'source' },
        status: 'PUBLISHED',
        locale: 'fa',
        categoryId: 'category',
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(mocks.articleFindFirst).toHaveBeenNthCalledWith(2, {
      where: {
        NOT: { id: 'source' },
        status: 'PUBLISHED',
        locale: 'fa',
      },
      orderBy: { createdAt: 'desc' },
    });
  });
});

describe('honest article facts', () => {
  it('computes reading time from article text instead of generated quick facts', () => {
    const content = `<script type="application/json" id="quick-facts-data">{"readingTime":"1 min read"}</script><p>${'word '.repeat(401)}</p>`;
    expect(computeReadingTime(content, 'en')).toBe('3 min read');
  });

  it('suppresses percentages, compliance, official, validation, and standalone year claims', () => {
    expect(getSafeQuickFacts({
      level: 'Deep dive',
      suitableFor: 'Tech founders',
      compliance: '95% (Official Guidelines)',
      status: 'Validated for 2026 regulations',
      keyBenefit: 'Officially approved pathway',
      actionability: '2026',
      requirements: '۱۴۰۵',
      legacyClaim: 'حداقل ۹۵٪ تطابق رسمی',
    })).toEqual({
      level: 'Deep dive',
      suitableFor: 'Tech founders',
    });
  });
});

describe('blog archives and search', () => {
  it('matches search text case-insensitively and paginates the filtered count', async () => {
    mocks.categoryFindMany.mockResolvedValue([]);
    mocks.articleFindMany.mockResolvedValue([
      { id: '1', title: 'Founder Guide', excerpt: null },
      { id: '2', title: 'Other', excerpt: 'For founders' },
      { id: '3', title: 'Unrelated', excerpt: null },
    ]);

    const result = await getBlogIndexData({
      locale: 'en',
      searchQuery: 'FOUNDER',
      page: 2,
      pageSize: 1,
    });

    expect(result.totalCount).toBe(2);
    expect(result.gridArticles).toEqual([{ id: '2', title: 'Other', excerpt: 'For founders' }]);
    expect(mocks.articleCount).not.toHaveBeenCalled();
  });

  it('preserves encoded search and category parameters in pagination links', () => {
    expect(buildBlogPageHref(3, { category: 'startup-news', q: 'work permit' }))
      .toBe('/blog?category=startup-news&q=work+permit&page=3');
  });

  it('reports only locales with published articles for a category', async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 'category', slug: 'news', name: 'News' });
    mocks.articleFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ locale: 'en' }, { locale: 'fa' }]);

    const result = await getCategoryArchiveData('en', 'news');

    expect(result?.availableLocales).toEqual(['en', 'fa']);
  });

  it('does not expose locale-less legacy index rows under Persian', async () => {
    mocks.categoryFindMany.mockRejectedValue(new Error('no such column: Article.locale'));

    const result = await getBlogIndexData({ locale: 'fa', page: 1, pageSize: 6 });

    expect(result).toEqual({ categories: [], totalCount: 0, featuredArticle: null, gridArticles: [] });
    expect(mocks.queryRaw).not.toHaveBeenCalled();
  });

  it('does not expose locale-less legacy category rows under Persian', async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 'category', slug: 'news', name: 'News' });
    mocks.articleFindMany.mockRejectedValue(new Error('no such column: Article.locale'));

    const result = await getCategoryArchiveData('fa', 'news');

    expect(result).toEqual({
      category: { id: 'category', slug: 'news', name: 'News' },
      articles: [],
      availableLocales: [],
    });
    expect(mocks.queryRaw).not.toHaveBeenCalled();
  });
});

describe('related article markup', () => {
  it('escapes interpolated article text and URL segments', () => {
    const html = buildRelatedArticleBox({
      locale: 'en',
      isRtl: false,
      article: {
        slug: 'bad\" onclick=\"alert(1)',
        title: '<img src=x onerror=alert(1)>',
        excerpt: '<script>alert(1)</script>',
      },
    });

    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('onclick=');
    expect(html).toContain('&lt;img');
  });
});

describe('locale-safe recommendations', () => {
  it('uses an existing Persian guide for Canada SUV content', () => {
    expect(getRecommendedService('ویزای استارتاپ کانادا', '', 'fa')).toMatchObject({
      path: '/canada-startup-visa',
      title: 'راهنمای وضعیت ویزای استارتاپ کانادا',
    });
  });

  it('uses the Persian route allowlist for every recommendation', () => {
    const inputs = [
      ['Canada SUV', ''],
      ['startup work permit', ''],
      ['Netherlands startup', ''],
      ['Finland startup', ''],
      ['Denmark startup', ''],
      ['Australia entrepreneur', ''],
      ['EB-1 ability', ''],
      ['EB-2 NIW', ''],
      ['EB-5 investor', ''],
      ['Ontario PNP', ''],
      ['unmatched subject', ''],
    ];
    const allowed = new Set([
      '/canada-startup-visa',
      '/europe/finland',
      '/europe/denmark',
      '/usa-eb2-niw',
      '/pnp',
      '/which-path',
      '/mentorship',
    ]);

    for (const [title, category] of inputs) {
      expect(allowed.has(getRecommendedService(title, category, 'fa').path)).toBe(true);
    }
  });
});
