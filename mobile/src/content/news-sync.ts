// Pure part of the news cache (spec v4 §5): normalise what GET /api/app/news
// sends, merge it into what the phone already holds, keep the newest 50.
// No React Native imports and no value imports, so `node --test` can run it;
// the country table (`@shared/news-countries`) is passed in by `news.ts`.
import type { Country17 } from '../../../lib/news-countries.ts';

export type NewsLang = 'en' | 'fa';

/** One article as the endpoint sends it. */
export type ApiNewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  html?: string | null;
  coverImage?: string | null;
  category?: string | null;
  countries?: string[] | null;
  publishedAt: string;
  updatedAt?: string | null;
  url: string;
};

export type ApiNewsResponse = { generatedAt?: string; locale?: string; items?: ApiNewsItem[] };

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  coverImage: string | null;
  category: string | null;
  countries: Country17[];
  /** Publication day, YYYY-MM-DD. */
  date: string;
  publishedAt: string;
  updatedAt: string;
  /** The article on visaroads.com (same as `url`; kept for older readers of the feed). */
  link: string;
  url: string;
  /** The article's own language; its text direction follows it, not the UI's. */
  locale: NewsLang;
};

export type Feed = {
  locale: NewsLang;
  items: NewsItem[];
  /** The day the phone last reached the server (YYYY-MM-DD), for the offline banner. */
  savedAt: string;
  /** The server's `generatedAt` of the last sync; sent back as `since`. */
  generatedAt: string | null;
  etag: string | null;
};

export const NEWS_KEEP = 50;

const ARTICLE = /^https:\/\/(?:www\.)?visaroads\.com\/(en|fa)\/blog\/([^/?#]+)\/?(?:[?#].*)?$/;

/** `{ locale, slug }` when the URL is a visaroads.com article, else null. */
export function articleRef(url: string): { locale: NewsLang; slug: string } | null {
  const m = ARTICLE.exec(url);
  return m ? { locale: m[1] as NewsLang, slug: decodeURIComponent(m[2]) } : null;
}

const time = (iso: string) => {
  const n = Date.parse(iso);
  return Number.isNaN(n) ? 0 : n;
};

/** Drops anything malformed; keeps only the 17 known country codes. */
export function normalise(raw: ApiNewsItem, locale: NewsLang, known: readonly string[]): NewsItem | null {
  if (!raw || typeof raw.id !== 'string' || typeof raw.slug !== 'string' || typeof raw.title !== 'string') return null;
  if (typeof raw.url !== 'string' || !raw.url.startsWith('https://')) return null;
  const published = time(raw.publishedAt);
  if (!published) return null;
  const countries = (raw.countries ?? []).filter((c): c is Country17 => known.includes(c));
  const cover = typeof raw.coverImage === 'string' && raw.coverImage.startsWith('https://') ? raw.coverImage : null;
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? '',
    html: raw.html ?? '',
    coverImage: cover,
    category: raw.category ?? null,
    countries,
    date: new Date(published).toISOString().slice(0, 10),
    publishedAt: raw.publishedAt,
    updatedAt: raw.updatedAt && time(raw.updatedAt) ? raw.updatedAt : raw.publishedAt,
    link: raw.url,
    url: raw.url,
    locale,
  };
}

/**
 * Merges by `id`: an incoming item replaces the held one unless the held one is
 * newer by `updatedAt`. Newest published first; only the newest `keep` survive.
 */
export function mergeItems(held: NewsItem[], incoming: NewsItem[], keep = NEWS_KEEP): NewsItem[] {
  const byId = new Map<string, NewsItem>();
  for (const item of held) byId.set(item.id, item);
  for (const item of incoming) {
    const prev = byId.get(item.id);
    if (!prev || time(item.updatedAt) >= time(prev.updatedAt)) byId.set(item.id, item);
  }
  return [...byId.values()].sort((a, b) => time(b.publishedAt) - time(a.publishedAt) || a.id.localeCompare(b.id)).slice(0, keep);
}

/**
 * The next cached feed after a 200. A full sync (no `since` sent) replaces the
 * list, so withdrawn articles leave the phone; a `since` sync merges.
 */
export function applyResponse(prev: Feed | null, body: ApiNewsResponse, opts: { locale: NewsLang; etag: string | null; today: string; full: boolean; known: readonly string[] }): Feed {
  const incoming = (body.items ?? []).map((r) => normalise(r, opts.locale, opts.known)).filter((i): i is NewsItem => i !== null);
  const base = opts.full || !prev ? [] : prev.items;
  return {
    locale: opts.locale,
    items: mergeItems(base, incoming),
    savedAt: opts.today,
    generatedAt: body.generatedAt ?? prev?.generatedAt ?? null,
    etag: opts.etag ?? prev?.etag ?? null,
  };
}

/** Reads a stored feed, rejecting anything from an older shape. */
export function readStored(raw: string | null, locale: NewsLang): Feed | null {
  if (!raw) return null;
  try {
    const f = JSON.parse(raw) as Feed;
    if (!f || !Array.isArray(f.items) || f.locale !== locale) return null;
    return f;
  } catch {
    return null;
  }
}
