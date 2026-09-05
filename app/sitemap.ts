import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { SITE_URL, LOCALES } from '@/lib/seo';
import { FA_PATHS, FA_PAIRED, EN_TO_FA, type FaPath } from '@/lib/fa/paths';

// Rendered per-request so the runtime SITE_URL (Cloud Run env) and freshly
// published articles are always reflected without a rebuild.
export const dynamic = 'force-dynamic';

// English pages. This list is the English site and nothing else.
const EN_PATHS = [
  '',
  '/about',
  '/services',
  '/mentorship',
  '/contact',
  '/blog',
  '/startup-visa-canada',
  '/startupworkpermit',
  '/pnp',
  '/pnp/ontario',
  '/pnp/bc',
  '/pnp/alberta',
  '/pnp/saskatchewan',
  '/pnp/manitoba',
  '/pnp/new-brunswick',
  '/pnp/newfoundland',
  '/pnp/nova-scotia',
  '/pnp/pei',
  '/usa/eb1',
  '/usa/eb2-niw',
  '/usa/eb5',
  '/europe/netherlands',
  '/europe/finland',
  '/australia/entrepreneur-stream',
  '/uae/golden-visa',
  '/country/canada',
  '/country/usa',
  '/country/australia',
  '/country/uae',
  '/country/denmark',
  '/country/finland',
  '/privacy',
  '/terms',
];

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
  for (const [locale, paths] of [['en', EN_PATHS], ['fa', [...FA_PATHS]]] as const) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
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
      select: { slug: true },
    });
    for (const c of categories) {
      entries.push({
        url: `${SITE_URL}/${LOCALES[0]}/blog/category/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: pairFor('en', `/blog/category/${c.slug}`),
      });
    }
  } catch (e) {
    console.error('Sitemap DB error:', e);
  }

  return entries;
}
