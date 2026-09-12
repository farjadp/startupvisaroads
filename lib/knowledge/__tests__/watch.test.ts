import { describe, it, expect } from 'vitest';
import { advertisedFeed, listingLinks, sitemapEntries, DEFAULT_WATCH_SOURCES, FRESH_DAYS } from '../watch';
import { WRITE_THRESHOLD, AUTO_WRITE_THRESHOLD } from '../triage';

describe('advertisedFeed', () => {
  it('finds the feed a page advertises and makes it absolute', () => {
    const html = '<head><link rel="alternate" type="application/rss+xml" href="/feed/"></head>';
    expect(advertisedFeed(html, 'https://example.test/news')).toBe('https://example.test/feed/');
  });
  it('accepts atom and absolute hrefs', () => {
    const html = '<link rel="alternate" type="application/atom+xml" href="https://cdn.example.test/atom.xml">';
    expect(advertisedFeed(html, 'https://example.test/')).toBe('https://cdn.example.test/atom.xml');
  });
  it('ignores an alternate that is not a feed', () => {
    const html = '<link rel="alternate" type="text/html" hreflang="fr" href="/fr/">';
    expect(advertisedFeed(html, 'https://example.test/')).toBeNull();
  });
  it('returns null when there is nothing to find', () => {
    expect(advertisedFeed('<p>hello</p>', 'https://example.test/')).toBeNull();
  });
});

describe('listingLinks', () => {
  const page = `
    <a href="/">Home page of the site</a>
    <a href="/news/ircc-raises-the-settlement-funds">IRCC raises the settlement funds for 2027</a>
    <a href="https://example.test/news/express-entry-draw-results">Express Entry draw results for September</a>
    <a href="/tag/canada/">Everything tagged Canada here</a>
    <a href="/brochure.pdf">Download the full programme brochure</a>
    <a href="https://other.test/news/elsewhere">A story on somebody else's site</a>
    <a href="/news/short">Read more</a>
    <a href="mailto:x@example.test">Email us about anything at all</a>
  `;
  const links = listingLinks(page, 'https://example.test/news');

  it('takes same-host article links', () => {
    expect(links.map((l) => l.url)).toEqual([
      'https://example.test/news/ircc-raises-the-settlement-funds',
      'https://example.test/news/express-entry-draw-results',
    ]);
  });

  it('drops the home page, tag indexes, assets, other hosts and non-http schemes', () => {
    const urls = links.map((l) => l.url).join(' ');
    expect(urls).not.toContain('other.test');
    expect(urls).not.toContain('/tag/');
    expect(urls).not.toContain('.pdf');
    expect(urls).not.toContain('mailto');
    expect(urls).not.toMatch(/example\.test\/$/);
  });

  it('drops a link whose text tells us nothing', () => {
    // "Read more" is a link to an article, but with no title we cannot
    // triage it and the fetch would be a guess.
    expect(links.map((l) => l.title)).not.toContain('Read more');
  });

  it('treats www and the bare host as the same site', () => {
    const out = listingLinks('<a href="https://www.example.test/news/a-long-enough-slug-here">A headline long enough to keep</a>', 'https://example.test/news');
    expect(out).toHaveLength(1);
  });

  it('deduplicates the same URL linked twice', () => {
    const twice = '<a href="/news/one-story-here">The first headline on the page</a><a href="/news/one-story-here">The first headline again</a>';
    expect(listingLinks(twice, 'https://example.test/news')).toHaveLength(1);
  });
});

describe('sitemapEntries', () => {
  const xml = `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>https://example.test/a</loc><lastmod>2026-01-01</lastmod></url>
    <url><loc>https://example.test/b</loc><lastmod>2026-09-01</lastmod></url>
    <url><loc>https://example.test/c</loc></url>
    <url><lastmod>2026-09-02</lastmod></url>
  </urlset>`;

  it('reads locs, newest lastmod first, and skips an entry with no loc', () => {
    const out = sitemapEntries(xml);
    expect(out.map((e) => e.url)).toEqual(['https://example.test/b', 'https://example.test/a', 'https://example.test/c']);
    expect(out[0].publishedAt?.toISOString().slice(0, 10)).toBe('2026-09-01');
    expect(out[2].publishedAt).toBeNull();
  });
});

describe('the watch sources we install', () => {
  it('installs three feeds with a trust level and topics each', () => {
    expect(DEFAULT_WATCH_SOURCES).toHaveLength(3);
    for (const s of DEFAULT_WATCH_SOURCES) {
      expect(s.url).toMatch(/^https:\/\//);
      expect(['official', 'press', 'commentary']).toContain(s.trust);
      expect(s.topics.length).toBeGreaterThan(0);
      expect(s.watchEvery).toBeGreaterThan(0);
    }
  });

  it('marks only IRCC official, because only IRCC is the authority', () => {
    const official = DEFAULT_WATCH_SOURCES.filter((s) => s.trust === 'official');
    expect(official).toHaveLength(1);
    expect(official[0].url).toContain('canada.ca');
  });

  it('leaves out the two sources that do not work', () => {
    const urls = DEFAULT_WATCH_SOURCES.map((s) => s.url).join(' ');
    // immigration.ca sits behind Cloudflare bot protection; the USCIS feed
    // has been stale since 2015. Both were tried and both failed.
    expect(urls).not.toContain('immigration.ca');
    expect(urls).not.toContain('uscis');
  });
});

describe('the thresholds', () => {
  it('keeps the auto-write bar above the write bar', () => {
    // Decided 12 Sep 2026: an official source at the top score writes
    // unasked; everything else waits for a click. If these were equal the
    // approval step would not exist.
    expect(AUTO_WRITE_THRESHOLD).toBeGreaterThan(WRITE_THRESHOLD);
    expect(WRITE_THRESHOLD).toBeGreaterThan(0);
    expect(AUTO_WRITE_THRESHOLD).toBeLessThanOrEqual(5);
  });

  it('keeps the freshness window long enough for a weekly source', () => {
    expect(FRESH_DAYS).toBeGreaterThanOrEqual(14);
  });
});
