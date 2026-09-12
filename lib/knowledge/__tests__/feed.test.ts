import { describe, it, expect } from 'vitest';
import { parseFeed } from '../feed';

const RSS = `<?xml version="1.0"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>X</title>
<item><title>Draw one</title><link>https://ex.com/a</link><pubDate>Fri, 04 Sep 2026 13:53:47 +0000</pubDate><description><![CDATA[<p>short</p>]]></description><content:encoded><![CDATA[<p>Full <a href="https://ex.com/t">text</a> here.</p>]]></content:encoded></item>
<item><title></title><link>https://ex.com/b</link></item>
</channel></rss>`;

const ATOM = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>IRCC</title>
<entry><title>Notice</title><id>https://ex.gc.ca/n</id><summary type="html">Sum</summary><updated>2026-09-04T16:57:00-04:00</updated><link href="https://ex.gc.ca/n.html"/></entry>
</feed>`;

describe('parseFeed', () => {
  it('reads RSS items with content:encoded and skips untitled ones', () => {
    const items = parseFeed(RSS);
    expect(items).toHaveLength(1);
    expect(items[0].url).toBe('https://ex.com/a');
    expect(items[0].inlineHtml).toContain('Full');
    expect(items[0].publishedAt?.toISOString()).toBe('2026-09-04T13:53:47.000Z');
  });
  it('reads Atom entries using link[href]', () => {
    const items = parseFeed(ATOM);
    expect(items).toHaveLength(1);
    expect(items[0].url).toBe('https://ex.gc.ca/n.html');
    expect(items[0].inlineHtml).toBe('Sum');
  });
});
