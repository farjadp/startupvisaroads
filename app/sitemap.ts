import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo';
import { FA_PATHS, FA_PAIRED, EN_TO_FA, type FaPath } from '@/lib/fa/paths';
import { EN_INDEXABLE_PATHS } from '@/lib/pageMeta';

export const revalidate = 600;

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
      where: { status: 'PUBLISHED' },
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
      where: { articles: { some: { status: 'PUBLISHED' } } },
      select: {
        slug: true,
        articles: {
          where: { status: 'PUBLISHED' },
          select: { locale: true, updatedAt: true },
        },
      },
    });
    for (const category of categories) {
      const locales = [...new Set(category.articles.map((article) => article.locale === 'fa' ? 'fa' : 'en'))];
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

  return entries;
}
