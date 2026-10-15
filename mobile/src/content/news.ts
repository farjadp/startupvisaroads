// News comes from the website's own RSS feeds (en and fa) until the
// app/v1/news endpoint exists. Country is matched from the title, which is
// how the site's own diversity picker recognises destinations.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Country } from './routes';

export type NewsItem = { title: string; link: string; description: string; date: string; countries: Country[] };
export type Feed = { items: NewsItem[]; savedAt: string };

const FEEDS = { en: 'https://visaroads.com/rss.xml', fa: 'https://visaroads.com/fa/rss.xml' } as const;

const KEYWORDS: Record<Country, RegExp> = {
  CA: /canad|ontario|nova scotia|new brunswick|manitoba|alberta|prince edward|\bpei\b|ircc|express entry|\bpnp\b|کانادا|نوا ?اسکوشیا|نیوبرانزویک|انتاریو|آلبرتا|مانیتوبا/i,
  DK: /denmark|danish|copenhagen|دانمارک/i,
  FI: /finland|finnish|helsinki|فنلاند/i,
  EE: /estonia|tallinn|استونی/i,
  NL: /netherlands|dutch|amsterdam|هلند/i,
  IT: /\bital(y|ian)|milan|ایتالیا/i,
  TR: /t(ü|u)rkiye|turkey|turkish|istanbul|ترکیه/i,
  US: /\busa?\b|united states|\bu\.s\.|eb-?[125]|\bniw\b|o-1|uscis|آمریکا/i,
};

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();

const tag = (block: string, name: string) => decode(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`).exec(block)?.[1] ?? '');

export function parseRss(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = m[1];
    const title = tag(block, 'title');
    const link = tag(block, 'link');
    if (!title || !link.startsWith('https://visaroads.com/')) continue;
    const description = tag(block, 'description');
    const pub = new Date(tag(block, 'pubDate'));
    const date = Number.isNaN(pub.getTime()) ? '' : pub.toISOString().slice(0, 10);
    const countries = (Object.keys(KEYWORDS) as Country[]).filter((c) => KEYWORDS[c].test(title));
    items.push({ title, link, description, date, countries });
  }
  return items;
}

const key = (lang: 'en' | 'fa') => `vr.news.${lang}`;

export async function cachedFeed(lang: 'en' | 'fa'): Promise<Feed | null> {
  try {
    const raw = await AsyncStorage.getItem(key(lang));
    return raw ? (JSON.parse(raw) as Feed) : null;
  } catch {
    return null;
  }
}

export async function fetchFeed(lang: 'en' | 'fa'): Promise<Feed> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const res = await fetch(FEEDS[lang], { signal: ctrl.signal, headers: { Accept: 'application/rss+xml' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const feed: Feed = { items: parseRss(await res.text()), savedAt: new Date().toISOString().slice(0, 10) };
    await AsyncStorage.setItem(key(lang), JSON.stringify(feed)).catch(() => {});
    return feed;
  } finally {
    clearTimeout(timer);
  }
}
