// ============================================================================
// lib/knowledge/watch.ts
// Phase 3: sources that keep publishing. IRCC puts out two or three items a
// day; we want the ones that touch our keywords and nothing else.
//
// HOW A WATCH SOURCE TURNS INTO DOCUMENTS
// Discovery lists the item URLs a source is offering right now, by whichever
// of three modes fits it:
//   feed     — an RSS/Atom document, either the source URL itself or one it
//              advertises with <link rel="alternate">. Cheapest and most
//              accurate; autodetected when the source is created.
//   listing  — no feed, so read the page and take the same-host links that
//              look like articles. Noisier, and the triage step is what
//              makes it survivable.
//   sitemap  — sitemap.xml, for sites that publish one and no feed.
//
// A newly discovered URL becomes a SourceDocument with EMPTY TEXT. That is a
// deliberate state, not a bug: the row is the ledger entry saying "we have
// seen this URL", which is what makes "n new items" mean something across
// runs, and the unique index on url gives us deduplication for free. The
// ingest job's fetch step fills the text in. It is the same two-phase shape
// SourceArticle had, with one table instead of two.
// ============================================================================
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';
import { parseFeed } from './feed';
import { fetchUrl, htmlToStructuredText, MAX_HTML_CHARS } from './adapters/html';
import { normaliseUrl } from './sources';

export type WatchMode = 'feed' | 'listing' | 'sitemap';
export type Discovered = { url: string; title: string; publishedAt: Date | null };

/** How many items one pass will take from a single source. */
const MAX_ITEMS_PER_SOURCE = 25;
/** Items older than this are ledgered but never written from. */
export const FRESH_DAYS = 21;

// ---------------------------------------------------------------------------
// Mode detection
// ---------------------------------------------------------------------------
const looksLikeFeed = (body: string) => /<(rss|feed)[\s>]/i.test(body.slice(0, 2000));

/** A feed the page advertises for itself. Returns an absolute URL. */
export function advertisedFeed(html: string, baseUrl: string): string | null {
  const $ = cheerio.load(html.slice(0, MAX_HTML_CHARS));
  const href = $('link[rel="alternate"]')
    .filter((_, el) => /rss|atom|xml/i.test($(el).attr('type') ?? ''))
    .first()
    .attr('href');
  if (!href) return null;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

export type ModeDetection = { mode: WatchMode; feedUrl: string | null };

/**
 * Work out how to watch a URL, once, when the source is created. Run again
 * only if the site changes shape; `watchMode` is stored on the row.
 */
export async function detectWatchMode(url: string): Promise<ModeDetection> {
  const res = await fetchUrl(url, 'application/rss+xml, application/atom+xml, application/xml, text/html;q=0.9');
  if (!res.ok) return { mode: 'listing', feedUrl: null }; // decide again at the first pass
  const body = res.body.toString('utf8');
  if (looksLikeFeed(body)) return { mode: 'feed', feedUrl: url };
  const advertised = advertisedFeed(body, res.finalUrl);
  if (advertised) return { mode: 'feed', feedUrl: advertised };
  if (/\/sitemap[\w.-]*\.xml$/i.test(url)) return { mode: 'sitemap', feedUrl: null };
  return { mode: 'listing', feedUrl: null };
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------
/**
 * Same-host links from a listing page that plausibly point at an article.
 *
 * Exported because this is the part most likely to need tuning per site, and
 * tuning something you cannot test on a fixture is guesswork.
 */
export function listingLinks(html: string, baseUrl: string): Discovered[] {
  const $ = cheerio.load(html.slice(0, MAX_HTML_CHARS));
  const base = new URL(baseUrl);
  const out = new Map<string, Discovered>();
  $('a[href]').each((_, el) => {
    const raw = $(el).attr('href') ?? '';
    let u: URL;
    try {
      u = new URL(raw, baseUrl);
    } catch {
      return;
    }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return;
    if (u.hostname.replace(/^www\./, '') !== base.hostname.replace(/^www\./, '')) return;
    u.hash = '';
    const path = u.pathname;
    // Chrome, not content: a bare host, a language switch, a tag index, an
    // asset. A path with at least two segments or a long slug is the shape a
    // news item takes on every site we watch.
    if (path === '/' || path === base.pathname) return;
    if (/\.(pdf|jpg|jpeg|png|gif|svg|zip|css|js)$/i.test(path)) return;
    if (/\/(tag|tags|category|categories|author|page|search|login|feed)\//i.test(path)) return;
    const segments = path.split('/').filter(Boolean);
    const slug = segments[segments.length - 1] ?? '';
    if (segments.length < 2 && slug.length < 12) return;
    const title = $(el).text().replace(/\s+/g, ' ').trim();
    if (title.length < 15) return; // a link labelled "read more" tells us nothing
    const url = u.toString();
    if (!out.has(url)) out.set(url, { url, title: title.slice(0, 400), publishedAt: null });
  });
  return [...out.values()];
}

/** URLs from a sitemap, newest `lastmod` first. */
export function sitemapEntries(xml: string): Discovered[] {
  const $ = cheerio.load(xml, { xml: true });
  const out: Discovered[] = [];
  $('url').each((_, el) => {
    const loc = $(el).find('loc').first().text().trim();
    if (!loc) return;
    const mod = $(el).find('lastmod').first().text().trim();
    const d = mod ? new Date(mod) : null;
    out.push({ url: loc, title: '', publishedAt: d && !Number.isNaN(d.getTime()) ? d : null });
  });
  out.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
  return out;
}

type WatchSource = { id: string; url: string | null; watchMode: string | null; title: string | null };

/** What this source is offering right now. Never throws; returns [] and a note. */
export async function discover(source: WatchSource): Promise<{ items: Discovered[]; note: string }> {
  if (!source.url) return { items: [], note: 'no URL to watch' };
  const mode = (source.watchMode ?? 'listing') as WatchMode;

  if (mode === 'feed') {
    const res = await fetchUrl(source.url, 'application/rss+xml, application/atom+xml, application/xml');
    if (!res.ok) return { items: [], note: `feed unavailable: ${res.error}` };
    const body = res.body.toString('utf8');
    // A feed URL that has quietly become an HTML page: say so rather than
    // reporting zero items for weeks.
    if (!looksLikeFeed(body)) return { items: [], note: 'the feed URL no longer returns a feed; re-detect the watch mode' };
    const items = parseFeed(body).map((i) => ({ url: i.url, title: i.title.slice(0, 400), publishedAt: i.publishedAt }));
    return { items, note: `${items.length} in feed` };
  }

  const res = await fetchUrl(source.url);
  if (!res.ok) return { items: [], note: `unavailable: ${res.error}` };
  const body = res.body.toString('utf8');

  if (mode === 'sitemap') {
    const items = sitemapEntries(body);
    return { items, note: `${items.length} in sitemap` };
  }
  const items = listingLinks(body, res.finalUrl);
  return { items, note: `${items.length} links on the page` };
}

// ---------------------------------------------------------------------------
// Ledger
// ---------------------------------------------------------------------------
/**
 * Insert what we have not seen. Existing rows are never touched: a re-run
 * must not reset a `used` document to `new`, which is the bug that made the
 * old ledger re-write the same article four times.
 */
export async function ledgerNewItems(sourceId: string, items: Discovered[]): Promise<{ added: number; jobs: number }> {
  let added = 0;
  let jobs = 0;
  const fresh = new Date(Date.now() - FRESH_DAYS * 864e5);
  for (const item of items.slice(0, MAX_ITEMS_PER_SOURCE)) {
    let url: string;
    try {
      url = normaliseUrl(item.url);
    } catch {
      continue;
    }
    try {
      const doc = await prisma.sourceDocument.create({
        data: {
          sourceId,
          url,
          title: item.title || url,
          publishedAt: item.publishedAt,
          // Empty until the fetch step reads it. See the header.
          text: '',
          charCount: 0,
          contentHash: '',
          status: 'new',
        },
      });
      added++;
      // Only fresh items are worth three model calls. Older ones stay in the
      // ledger so they are never discovered twice, and are never read.
      const dated = item.publishedAt ?? new Date();
      if (dated >= fresh) {
        await prisma.ingestJob.create({ data: { sourceId, documentId: doc.id, step: 'fetch' } });
        jobs++;
      } else {
        await prisma.sourceDocument.update({ where: { id: doc.id }, data: { status: 'ignored', reason: `older than ${FRESH_DAYS} days` } });
      }
    } catch {
      /* unique(url): already in the ledger, by this source or another */
    }
  }
  return { added, jobs };
}

// ---------------------------------------------------------------------------
// The pass
// ---------------------------------------------------------------------------
export type WatchSummary = { checked: number; added: number; jobs: number; notes: string[] };

/** Watch sources whose interval has elapsed. */
export async function dueWatchSources(now = new Date()) {
  const rows = await prisma.source.findMany({
    where: { cadence: 'watch', enabled: true, status: { not: 'blocked' } },
    select: { id: true, url: true, title: true, watchMode: true, watchEvery: true, lastCheckedAt: true },
  });
  return rows.filter((s) => {
    if (!s.lastCheckedAt) return true;
    const hours = s.watchEvery ?? 24;
    return now.getTime() - s.lastCheckedAt.getTime() >= hours * 3600_000;
  });
}

export async function runWatch(opts: { limit?: number; sourceId?: string } = {}): Promise<WatchSummary> {
  const out: WatchSummary = { checked: 0, added: 0, jobs: 0, notes: [] };
  const due = opts.sourceId
    ? await prisma.source.findMany({ where: { id: opts.sourceId }, select: { id: true, url: true, title: true, watchMode: true, watchEvery: true, lastCheckedAt: true } })
    : await dueWatchSources();

  for (const source of due.slice(0, opts.limit ?? 10)) {
    out.checked++;
    const label = source.title ?? source.url ?? source.id;
    try {
      // A source created before mode detection ran, or one whose site changed.
      if (!source.watchMode && source.url) {
        const detected = await detectWatchMode(source.url);
        await prisma.source.update({ where: { id: source.id }, data: { watchMode: detected.mode, url: detected.feedUrl ?? source.url } });
        source.watchMode = detected.mode;
        if (detected.feedUrl && detected.feedUrl !== source.url) {
          out.notes.push(`${label}: found a feed at ${detected.feedUrl}`);
          source.url = detected.feedUrl;
        }
      }
      const { items, note } = await discover(source);
      const { added, jobs } = await ledgerNewItems(source.id, items);
      out.added += added;
      out.jobs += jobs;
      out.notes.push(`${label}: ${note}, ${added} new, ${jobs} queued`);
      await prisma.source.update({
        where: { id: source.id },
        data: { lastCheckedAt: new Date(), lastError: items.length ? null : note, status: items.length ? 'ready' : 'error' },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      out.notes.push(`${label}: ${msg}`);
      await prisma.source.update({ where: { id: source.id }, data: { lastCheckedAt: new Date(), lastError: msg.slice(0, 500), status: 'error' } }).catch(() => {});
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// The three feeds that used to be a constant in the code
// ---------------------------------------------------------------------------
/**
 * Installed rather than documented, because this project has a history of
 * building something and never switching it on. Called at the top of the
 * watch cron, idempotent on the unique url.
 *
 * Probed 5 Sep 2026: CIC News carries full text in the feed, IRCC's Atom
 * needs a page fetch, Moving2Canada's feed carries titles only.
 * Immigration.ca sits behind Cloudflare bot protection and the USCIS feed has
 * been stale since 2015; both stay out.
 */
export const DEFAULT_WATCH_SOURCES = [
  {
    url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&sort=publishedDate&orderBy=desc&pick=30&format=atom&atomtitle=IRCC',
    title: 'Immigration, Refugees and Citizenship Canada — newsroom',
    trust: 'official',
    topics: ['canada', 'ircc', 'express entry', 'start-up visa', 'pnp'],
    watchEvery: 12,
  },
  {
    url: 'https://www.cicnews.com/feed',
    title: 'CIC News',
    trust: 'press',
    topics: ['canada', 'express entry', 'pnp', 'work permit'],
    watchEvery: 12,
  },
  {
    url: 'https://moving2canada.com/feed/',
    title: 'Moving2Canada',
    trust: 'commentary',
    topics: ['canada', 'work permit', 'settlement'],
    watchEvery: 24,
  },
] as const;

export async function ensureDefaultWatchSources(): Promise<string[]> {
  const created: string[] = [];
  for (const s of DEFAULT_WATCH_SOURCES) {
    const exists = await prisma.source.findUnique({ where: { url: s.url }, select: { id: true } });
    if (exists) continue;
    await prisma.source.create({
      data: {
        kind: 'html',
        cadence: 'watch',
        url: s.url,
        title: s.title,
        trust: s.trust,
        topics: JSON.stringify([...s.topics]),
        watchEvery: s.watchEvery,
        watchMode: 'feed',
        locale: 'en',
        status: 'pending',
        notes: 'installed automatically — the three feeds the autopilot read before sources were admin-managed',
      },
    });
    created.push(s.title);
  }
  return created;
}
