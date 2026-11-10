import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo';
import { FA_PATHS, FA_PAIRED, EN_TO_FA, type FaPath } from '@/lib/fa/paths';
import { EN_INDEXABLE_PATHS } from '@/lib/pageMeta';
import { NOT_WITHDRAWN } from '@/lib/legacy-redirects';
import { MIN_INDEXABLE_CATEGORY_ARTICLES } from '@/lib/blog';
import { listForSitemap } from '@/lib/case-studies/public';

// Rendered per request. With ISR the build-time version (no database in the
// Docker build, so no articles) was served to the first visitor after every
// deploy; if that visitor was Googlebot, it saw a sitemap with no blog.
export const dynamic = 'force-dynamic';

/**
 * hreflang alternates for one sitemap entry. /fa is not a mirror of /en, so
 * a language is listed only when that page genuinely exists in it.
 */
function pairFor(locale: 'en' | 'fa', path: string) {
  const fa = locale === 'fa' ? path : EN_TO_FA.get(path);
  const en = locale === 'fa' ? FA_PAIRED[path as FaPath] : path;
  const languages: Record<string, string> = {};
  if (en != null) languages.en = `${SITE_URL}/en${en}`;
  if (fa != null) languages.fa = `${SITE_URL}/fa${fa}`;
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static marketing pages, per locale. The two lists are different sites.
  for (const [locale, paths] of [['en', EN_INDEXABLE_PATHS], ['fa', FA_PATHS]] as const) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: path === '' || path === '/blog' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.7,
        alternates: pairFor(locale, path),
      });
    }
  }

  // Published blog articles (each in its own locale)
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED', AND: [NOT_WITHDRAWN] },
      select: { slug: true, updatedAt: true, locale: true },
      orderBy: { updatedAt: 'desc' },
    });
    for (const a of articles) {
      const locale = a.locale === 'fa' ? 'fa' : 'en';
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // Category archives
    const categories = await prisma.category.findMany({
      where: { articles: { some: { status: 'PUBLISHED', AND: [NOT_WITHDRAWN] } } },
      select: {
        slug: true,
        articles: {
          where: { status: 'PUBLISHED', AND: [NOT_WITHDRAWN] },
          select: { locale: true, updatedAt: true },
        },
      },
    });
    for (const category of categories) {
      // Only locales where the archive is substantial enough to index.
      const countIn = (l: string) => category.articles.filter((a) => (a.locale === 'fa' ? 'fa' : 'en') === l).length;
      const locales = (['en', 'fa'] as const).filter((l) => countIn(l) >= MIN_INDEXABLE_CATEGORY_ARTICLES);
      const languages = Object.fromEntries(
        locales.map((locale) => [locale, `${SITE_URL}/${locale}/blog/category/${category.slug}`]),
      );
      for (const locale of locales) {
        const lastModified = category.articles
          .filter((article) => (article.locale === 'fa' ? 'fa' : 'en') === locale)
          .reduce((latest, article) => article.updatedAt > latest ? article.updatedAt : latest, new Date(0));
        entries.push({
          url: `${SITE_URL}/${locale}/blog/category/${category.slug}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.6,
          alternates: { languages },
        });
      }
    }
  } catch (e) {
    console.error('Sitemap DB error:', e);
  }

  // Case studies. listForSitemap() only returns published rows (never samples
  // in production) and returns [] on a DB error. hreflang only for a complete
  // en/fa pair; the index is listed per locale that has at least one case.
  const cases = await listForSitemap();
  const byGroup = new Map<string, Partial<Record<'en' | 'fa', string>>>();
  for (const c of cases) {
    const g = byGroup.get(c.groupKey) ?? {};
    g[c.locale] = `${SITE_URL}/${c.locale}/case-studies/${c.slug}`;
    byGroup.set(c.groupKey, g);
  }
  for (const locale of ['en', 'fa'] as const) {
    const mine = cases.filter((c) => c.locale === locale);
    if (mine.length === 0) continue;
    const bothIndexes = cases.some((c) => c.locale === 'en') && cases.some((c) => c.locale === 'fa');
    entries.push({
      url: `${SITE_URL}/${locale}/case-studies`,
      lastModified: mine[0].updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
      ...(bothIndexes
        ? { alternates: { languages: { en: `${SITE_URL}/en/case-studies`, fa: `${SITE_URL}/fa/case-studies` } } }
        : {}),
    });
  }
  for (const c of cases) {
    const g = byGroup.get(c.groupKey) ?? {};
    entries.push({
      url: `${SITE_URL}/${c.locale}/case-studies/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
      ...(g.en && g.fa ? { alternates: { languages: { en: g.en, fa: g.fa } } } : {}),
    });
  }

  return entries;
}
