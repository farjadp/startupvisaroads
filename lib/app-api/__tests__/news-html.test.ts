import { describe, it, expect } from 'vitest';
import { sanitizeForApp } from '@/lib/sanitize';
import { newsEtag, parseSince } from '@/lib/app-api/news';

describe('sanitizeForApp', () => {
  it('keeps the app tag set and drops attributes', () => {
    const html = '<h2 class="x" id="y">Title</h2><p style="color:red">Body <strong>bold</strong> <em>em</em> <b>b</b> <i>i</i></p><ul><li>a</li></ul><ol><li>b</li></ol><blockquote>q</blockquote><hr><br>';
    expect(sanitizeForApp(html)).toBe('<h2>Title</h2><p>Body <strong>bold</strong> <em>em</em> <b>b</b> <i>i</i></p><ul><li>a</li></ul><ol><li>b</li></ol><blockquote>q</blockquote><hr><br>');
  });

  it('unwraps unknown tags but keeps their text', () => {
    expect(sanitizeForApp('<div><section><p>Hi <span class="k">there</span></p></section></div>')).toBe('<p>Hi there</p>');
    expect(sanitizeForApp('<figure><img src="https://x/y.png" alt="a"><figcaption>cap</figcaption></figure>')).toBe('<img src="https://x/y.png" alt="a">cap');
  });

  it('removes script, style, iframe, svg and comments with their content', () => {
    const html = '<p>ok</p><script>alert(1)</script><style>p{}</style><iframe src="https://e"></iframe><svg><text>garbage</text></svg><!-- c --><noscript>n</noscript>';
    expect(sanitizeForApp(html)).toBe('<p>ok</p>');
  });

  it('keeps only http(s) hrefs and unwraps other links', () => {
    expect(sanitizeForApp('<a href="https://visaroads.com/en" target="_blank" rel="x">site</a>')).toBe('<a href="https://visaroads.com/en">site</a>');
    expect(sanitizeForApp('<a href="javascript:alert(1)">x</a>')).toBe('x');
    expect(sanitizeForApp('<a href="/en/blog/x">rel</a>')).toBe('rel');
    expect(sanitizeForApp('<a onclick="x()">no href</a>')).toBe('no href');
  });

  it('keeps img src/alt for http(s) only and drops the rest', () => {
    expect(sanitizeForApp('<img src="https://cdn/a.jpg" alt="A" width="10" onerror="x()">')).toBe('<img src="https://cdn/a.jpg" alt="A">');
    expect(sanitizeForApp('<img src="data:image/png;base64,AAAA">')).toBe('');
    expect(sanitizeForApp('<img alt="no src">')).toBe('');
  });

  it('keeps tables', () => {
    const t = '<table class="t"><thead><tr><th>a</th></tr></thead><tbody><tr><td colspan="2">b</td></tr></tbody></table>';
    expect(sanitizeForApp(t)).toBe('<table><thead><tr><th>a</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>');
  });

  it('maps h1 to h2 and h5/h6 to h4', () => {
    expect(sanitizeForApp('<h1>a</h1><h5>b</h5><h6>c</h6>')).toBe('<h2>a</h2><h4>b</h4><h4>c</h4>');
  });

  it('handles empty input', () => {
    expect(sanitizeForApp('')).toBe('');
  });
});

describe('newsEtag', () => {
  it('is stable for the same content and changes with it', () => {
    const a = newsEtag({ locale: 'en', count: 3, newestUpdatedAt: '2026-11-01T00:00:00.000Z' });
    expect(a).toMatch(/^"[a-f0-9]{16,}"$/);
    expect(newsEtag({ locale: 'en', count: 3, newestUpdatedAt: '2026-11-01T00:00:00.000Z' })).toBe(a);
    expect(newsEtag({ locale: 'fa', count: 3, newestUpdatedAt: '2026-11-01T00:00:00.000Z' })).not.toBe(a);
    expect(newsEtag({ locale: 'en', count: 4, newestUpdatedAt: '2026-11-01T00:00:00.000Z' })).not.toBe(a);
  });
});

describe('parseSince', () => {
  it('accepts an ISO date, rejects garbage, allows absence', () => {
    expect(parseSince(null)).toEqual({ ok: true, since: null });
    expect(parseSince('2026-11-01T10:00:00.000Z')).toEqual({ ok: true, since: new Date('2026-11-01T10:00:00.000Z') });
    expect(parseSince('yesterday')).toEqual({ ok: false });
  });
});
