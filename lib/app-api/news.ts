// ============================================================================
// Pure helpers for GET /api/app/news: locale and `since` parsing, the ETag,
// and the mapping from an Article row to the item the app stores.
// ============================================================================

import { createHash } from 'crypto';
import { sanitizeForApp } from '@/lib/sanitize';
import { stripHtml } from '@/lib/seo';
import { countriesIn, type Country17 } from '@/lib/news-countries';

export type NewsLocale = 'en' | 'fa';

export const NEWS_LIMIT = 50;

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  coverImage: string | null;
  category: string | null;
  countries: Country17[];
  publishedAt: string;
  updatedAt: string;
  url: string;
};

export type NewsResponse = {
  generatedAt: string;
  locale: NewsLocale;
  items: NewsItem[];
};

export function parseNewsLocale(value: string | null): NewsLocale {
  return value === 'fa' ? 'fa' : 'en';
}

export function parseSince(value: string | null): { ok: true; since: Date | null } | { ok: false } {
  if (value === null || value === '') return { ok: true, since: null };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { ok: false };
  return { ok: true, since: d };
}

/**
 * Strong ETag independent of `generatedAt`: the same set of articles yields
 * the same tag across requests, so `If-None-Match` can answer 304.
 */
export function newsEtag(input: { locale: NewsLocale; count: number; newestUpdatedAt: string | null; since?: string | null }): string {
  const hash = createHash('sha1')
    .update([input.locale, String(input.count), input.newestUpdatedAt ?? '', input.since ?? ''].join('|'))
    .digest('hex');
  return `"${hash}"`;
}

export type NewsArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: { name: string } | null;
};

export function toNewsItem(a: NewsArticleRow, locale: NewsLocale, siteUrl: string): NewsItem {
  const excerpt = stripHtml(a.excerpt ?? '');
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt,
    html: sanitizeForApp(a.content),
    coverImage: a.coverImage || null,
    category: a.category?.name ?? null,
    countries: countriesIn(a.title, excerpt),
    publishedAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    url: `${siteUrl}/${locale}/blog/${a.slug}`,
  };
}
