// ============================================================================
// lib/autopilot/sources.ts
// Harvest what immigration publications reported today, so the writer knows
// what happened this morning and not only what the site already says.
//
// What this does and does not do — the distinction is the editorial and
// legal basis of the feature:
//   · It reads public RSS/Atom feeds and keeps a LEDGER (SourceArticle) of
//     URLs we have seen. The ledger is what makes "n NEW ones" mean
//     something across daily runs.
//   · It extracts plain text so the writer can be handed FACTS. The text is
//     a working input, never stored as a post and never shipped to a reader.
//   · It does not translate, spin or paraphrase. The article we publish is
//     written from a fact sheet against our own brief, and cites the
//     original at the foot.
//
// Sources probed on 5 Sep 2026: CIC News (full text in the feed), IRCC via
// the Canada.ca news API (Atom; page fetch for text), Moving2Canada (feed
// only carries titles; page fetch). Immigration.ca sits behind Cloudflare
// bot protection and the USCIS feed is stale from 2015 — both left out.
// ============================================================================
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';

const UA = 'VisaRoadsBot/1.0 (+https://visaroads.com/about; topic discovery)';
const FETCH_TIMEOUT_MS = 15_000;
const MAX_TEXT = 9_000;
const MIN_TEXT = 350;

export type FeedSource = {
  slug: string;
  name: string;
  feedUrl: string;
  /** Days inside which an item counts as fresh. Older items are still ledgered but not written from. */
  freshDays: number;
  enabled: boolean;
};

export const SOURCES: FeedSource[] = [
  { slug: 'ircc', name: 'Immigration, Refugees and Citizenship Canada', feedUrl: 'https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&sort=publishedDate&orderBy=desc&pick=30&format=atom&atomtitle=IRCC', freshDays: 14, enabled: true },
  { slug: 'cicnews', name: 'CIC News', feedUrl: 'https://www.cicnews.com/feed', freshDays: 7, enabled: true },
  { slug: 'moving2canada', name: 'Moving2Canada', feedUrl: 'https://moving2canada.com/feed/', freshDays: 7, enabled: true },
];

/** One harvested article, reduced to what the writer needs. */
export type SourceArticle = {
  ledgerId: string;
  sourceSlug: string;
  sourceName: string;
  url: string;
  title: string;
  publishedAt: Date | null;
  /** Plain text of the original, capped. A working input — never published. */
  text: string;
};

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------
async function getText(url: string, accept: string): Promise<string | null> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: accept }, signal: ctl.signal, cache: 'no-store' });
    if (!res.ok) {
      console.error('autopilot/sources: HTTP', res.status, url);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.error('autopilot/sources: fetch failed', url, e instanceof Error ? e.message : e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Feed parsing (RSS 2.0 and Atom) — exported so it can be tested on fixtures
// ---------------------------------------------------------------------------
export type FeedItem = { url: string; title: string; publishedAt: Date | null; inlineHtml: string };

export function parseFeed(xml: string): FeedItem[] {
  const $ = cheerio.load(xml, { xml: true });
  const items: FeedItem[] = [];
  const date = (s: string | undefined) => {
    const d = s ? new Date(s) : null;
    return d && !Number.isNaN(d.getTime()) ? d : null;
  };

  $('item').each((_, el) => {
    const $i = $(el);
    const url = $i.find('link').first().text().trim();
    const title = $i.find('title').first().text().trim();
    if (!url || !title) return;
    const inlineHtml = $i.find('content\\:encoded').first().text() || $i.find('description').first().text() || '';
    items.push({ url, title, publishedAt: date($i.find('pubDate').first().text()), inlineHtml });
  });
  $('entry').each((_, el) => {
    const $e = $(el);
    const url = ($e.find('link').first().attr('href') ?? $e.find('id').first().text()).trim();
    const title = $e.find('title').first().text().trim();
    if (!url || !title) return;
    const inlineHtml = $e.find('content').first().text() || $e.find('summary').first().text() || '';
    items.push({ url, title, publishedAt: date($e.find('updated').first().text() || $e.find('published').first().text()), inlineHtml });
  });
  return items;
}

// ---------------------------------------------------------------------------
// Text extraction — exported for tests
// ---------------------------------------------------------------------------
/**
 * HTML → plain text. Everything structural is dropped on purpose: scripts,
 * embeds, figures, share widgets and related-post boxes are not facts, and
 * anchors are flattened so a link to someone else's site can never travel
 * from here into our article.
 */
export function htmlToText(html: string): string {
  const $ = cheerio.load(html);
  $('script, style, iframe, figure, figcaption, noscript, nav, footer, header, aside, form, .sharedaddy, .related, .wp-block-embed').remove();
  $('a').each((_, el) => {
    $(el).replaceWith($(el).text());
  });
  // Candidate containers, best first by how much prose they hold. Sites put
  // the body in <article>, in <main>, or (Moving2Canada) in plain divs with
  // an empty <article> card elsewhere on the page — so "first <article>" is
  // not a safe rule; "the container with the most paragraphs" is.
  const extract = (root: ReturnType<typeof $>): string => {
    const parts: string[] = [];
    root.find('p, li, h2, h3, h4, td').each((_, el) => {
      const t = $(el).text().replace(/\s+/g, ' ').trim();
      if (t.length > 1) parts.push(t);
    });
    return parts.join('\n');
  };
  const candidates = [...$('article').toArray().map((el) => $(el)), ...$('main').toArray().map((el) => $(el)), $.root()];
  let best = '';
  for (const c of candidates) {
    const t = extract(c);
    if (t.length > best.length) best = t;
  }
  const text = (best || $.root().text()).replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return text.slice(0, MAX_TEXT);
}

// ---------------------------------------------------------------------------
// Ledger
// ---------------------------------------------------------------------------
/** Insert anything we have not seen. Existing rows are left untouched: a re-run must never reset a `used` row to `new`. */
async function recordSeen(src: FeedSource, items: FeedItem[]): Promise<number> {
  let added = 0;
  for (const it of items) {
    try {
      await prisma.sourceArticle.create({
        data: { sourceSlug: src.slug, url: it.url, title: it.title.slice(0, 400), publishedAt: it.publishedAt },
      });
      added++;
    } catch {
      /* unique(url) — already seen */
    }
  }
  return added;
}

export async function markLedger(id: string, status: 'used' | 'skipped' | 'failed', reason?: string, articleId?: string) {
  await prisma.sourceArticle.update({
    where: { id },
    data: { status, reason: reason?.slice(0, 500) ?? null, articleId: articleId ?? null },
  });
}

/** Fetch and cache the plain text for a ledger row. Null when there is nothing worth reading. */
async function hydrate(src: FeedSource, row: { id: string; url: string; title: string; publishedAt: Date | null; text: string | null }, inline: Map<string, string>): Promise<SourceArticle | null> {
  let text = row.text ?? '';
  if (!text) {
    const fromFeed = inline.get(row.url);
    text = fromFeed ? htmlToText(fromFeed) : '';
    if (text.length < 600) {
      const html = await getText(row.url, 'text/html');
      const fromPage = html ? htmlToText(html) : '';
      if (fromPage.length > text.length) text = fromPage;
    }
    if (text.length < MIN_TEXT) {
      await markLedger(row.id, 'skipped', `too short to carry facts (${text.length} chars)`);
      return null;
    }
    await prisma.sourceArticle.update({ where: { id: row.id }, data: { text } });
    await new Promise((r) => setTimeout(r, 250)); // polite
  }
  return { ledgerId: row.id, sourceSlug: src.slug, sourceName: src.name, url: row.url, title: row.title, publishedAt: row.publishedAt, text };
}

// ---------------------------------------------------------------------------
// Harvest
// ---------------------------------------------------------------------------
/**
 * Return up to `n` fresh articles nobody has written from yet, round-robin
 * across sources so one busy feed does not crowd out the official one.
 */
export async function harvest(n: number): Promise<{ articles: SourceArticle[]; notes: string[] }> {
  const notes: string[] = [];
  const perSource = new Map<string, SourceArticle[]>();

  for (const src of SOURCES.filter((s) => s.enabled)) {
    const xml = await getText(src.feedUrl, 'application/rss+xml, application/atom+xml, application/xml, text/xml');
    if (!xml) {
      notes.push(`${src.slug}: feed unavailable`);
      continue;
    }
    const items = parseFeed(xml);
    const added = await recordSeen(src, items);
    const inline = new Map(items.map((i) => [i.url, i.inlineHtml]));

    const since = new Date(Date.now() - src.freshDays * 864e5);
    const rows = await prisma.sourceArticle.findMany({
      where: { sourceSlug: src.slug, status: 'new', OR: [{ publishedAt: { gte: since } }, { publishedAt: null, harvestedAt: { gte: since } }] },
      orderBy: { publishedAt: 'desc' },
      take: n + 2,
    });
    const picked: SourceArticle[] = [];
    for (const row of rows) {
      if (picked.length >= n) break;
      const a = await hydrate(src, row, inline);
      if (a) picked.push(a);
    }
    perSource.set(src.slug, picked);
    notes.push(`${src.slug}: ${items.length} in feed, ${added} new, ${picked.length} usable`);
  }

  // Round-robin so the day's mix is not all one publication.
  const out: SourceArticle[] = [];
  const queues = [...perSource.values()];
  for (let i = 0; out.length < n && queues.some((q) => q.length); i++) {
    const q = queues[i % queues.length];
    const a = q.shift();
    if (a) out.push(a);
  }
  return { articles: out, notes };
}
