import { describe, it, expect } from 'vitest';
import { parseFeed, htmlToText } from '../sources';
import { originality, tooClose, shingles } from '../originality';
import { seasonalHooks } from '../planner';

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

describe('htmlToText', () => {
  it('drops chrome and flattens links', () => {
    const t = htmlToText('<nav>menu</nav><article><h2>Heading</h2><p>See <a href="https://x">this</a> now.</p><figure>cap</figure><script>x()</script></article><footer>f</footer>');
    expect(t).toBe('Heading\nSee this now.');
  });
});

describe('seasonalHooks', () => {
  it('uses neutral verification hooks rather than claiming cadence or intake state', () => {
    const hooks = seasonalHooks(new Date('2026-03-15T12:00:00Z')).join(' ');
    expect(hooks).toContain('verify');
    expect(hooks).not.toMatch(/roughly every two weeks|opens? in|intake|slow down|exhaust|spend remaining/i);
  });
});

describe('originality', () => {
  const source = 'Immigration, Refugees and Citizenship Canada issued 3,500 invitations to apply in a healthcare draw on September 4, 2026 with a minimum score of 470 points for candidates.';
  it('flags a copied sentence', () => {
    const o = originality(`<p>Yesterday ${source}</p>`, source);
    expect(o.shared).toBeGreaterThan(6);
    expect(tooClose(o)).toBe(true);
    expect(o.sample).toContain('immigration refugees and citizenship canada');
  });
  it('passes an honest retelling', () => {
    const mine = '<p>IRCC ran a healthcare-targeted round on 4 September 2026. It sent 3,500 invitations; the cut-off sat at 470. For founders this matters less than for nurses.</p>';
    const o = originality(mine, source);
    expect(o.shared).toBe(0);
    expect(tooClose(o)).toBe(false);
  });
  it('ignores case, punctuation, tags and نیم‌فاصله', () => {
    const a = shingles('<b>Hello,</b> World! برنامه‌های استانی', 2);
    const b = shingles('hello world برنامه های استانی', 2);
    expect([...a]).toEqual([...b]);
  });
});
