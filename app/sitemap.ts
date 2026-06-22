import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { SITE_URL, LOCALES } from '@/lib/seo';

// Rendered per-request so the runtime SITE_URL (Cloud Run env) and freshly
// published articles are always reflected without a rebuild.
export const dynamic = 'force-dynamic';

// Locale-agnostic static routes that exist for both en and fa.
const STATIC_PATHS = [
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

function alternates(path: string) {
  return {
    languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static marketing pages
  for (const path of STATIC_PATHS) {
    entries.push({
      url: `${SITE_URL}/${LOCALES[0]}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' || path === '/blog' ? 'daily' : 'weekly',
      priority: path === '' ? 1 : 0.7,
      alternates: alternates(path),
    });
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
        alternates: alternates(`/blog/category/${c.slug}`),
      });
    }
  } catch (e) {
    console.error('Sitemap DB error:', e);
  }

  return entries;
}
