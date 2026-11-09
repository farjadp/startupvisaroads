// News in the app (spec v4 §5): synced from GET /api/app/news, read in the app.
// The phone keeps the newest 50 articles per locale; a sync sends the last
// `generatedAt` as `since` and the stored ETag, and a 304 keeps the cache;
// the first sync of a day fetches the whole list and replaces it.
// fr/zh/ar read the English feed (the screen passes meta.siteLocale).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NEWS_COUNTRIES } from '@shared/news-countries';
import { applyResponse, readStored, type ApiNewsResponse, type Feed, type NewsItem, type NewsLang } from './news-sync';

export type { Feed, NewsItem, NewsLang } from './news-sync';
export { articleRef } from './news-sync';

const ENDPOINT = 'https://visaroads.com/api/app/news';
const key = (lang: NewsLang) => `vr.news.v2.${lang}`;
const today = () => new Date().toISOString().slice(0, 10);

/** Last feed read or written this session, so the reader finds an article without waiting on storage. */
const memory: Partial<Record<NewsLang, Feed>> = {};

export async function cachedFeed(lang: NewsLang): Promise<Feed | null> {
  if (memory[lang]) return memory[lang];
  try {
    const feed = readStored(await AsyncStorage.getItem(key(lang)), lang);
    if (feed) memory[lang] = feed;
    return feed;
  } catch {
    return null;
  }
}

/** The cached article with this slug, looked up in `lang` first, then the other feed. */
export async function cachedArticle(slug: string, lang?: NewsLang): Promise<NewsItem | null> {
  const order: NewsLang[] = lang === 'fa' ? ['fa', 'en'] : ['en', 'fa'];
  for (const l of order) {
    const hit = (await cachedFeed(l))?.items.find((i) => i.slug === slug);
    if (hit) return hit;
  }
  return null;
}

const inFlight: Partial<Record<NewsLang, Promise<Feed>>> = {};

/** Syncs one locale and returns the merged feed. Throws when offline or the server fails. */
export function fetchFeed(lang: NewsLang): Promise<Feed> {
  // Home and News may ask at the same moment; one request serves both.
  const running = inFlight[lang];
  if (running) return running;
  const next = sync(lang).finally(() => {
    delete inFlight[lang];
  });
  inFlight[lang] = next;
  return next;
}

async function sync(lang: NewsLang): Promise<Feed> {
  const prev = await cachedFeed(lang);
  // The first sync of each day is a full one, so articles withdrawn on the site leave the phone.
  const full = !prev?.generatedAt || prev.savedAt !== today();
  const url = `${ENDPOINT}?locale=${lang}${full ? '' : `&since=${encodeURIComponent(prev?.generatedAt ?? '')}`}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (prev?.etag && !full) headers['If-None-Match'] = prev.etag;
    const res = await fetch(url, { signal: ctrl.signal, headers });
    let feed: Feed;
    if (res.status === 304 && prev) {
      feed = { ...prev, savedAt: today() };
    } else if (res.ok) {
      const body = (await res.json()) as ApiNewsResponse;
      feed = applyResponse(prev, body, { locale: lang, etag: res.headers.get('etag'), today: today(), full, known: NEWS_COUNTRIES });
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
    memory[lang] = feed;
    await AsyncStorage.setItem(key(lang), JSON.stringify(feed)).catch(() => {});
    return feed;
  } finally {
    clearTimeout(timer);
  }
}
