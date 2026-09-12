// ============================================================================
// lib/knowledge/feed.ts
// RSS 2.0 and Atom, reduced to what discovery needs.
//
// This is all that survived lib/autopilot/sources.ts. That module held the
// three watched feeds as a constant, its own ledger writer and its own text
// extractor, all of which now live in the database and in lib/knowledge. A
// second harvester nobody called is how a codebase ends up with two sources
// of truth that disagree, which is the exact bug the Start-up Visa content
// had. So the dead half is gone and the parser moved here.
//
// Both feed dialects are handled in one pass because plenty of feeds are
// neither strictly: <item> for RSS, <entry> for Atom, and a document that
// carries both gets both read.
// ============================================================================
import * as cheerio from 'cheerio';

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
