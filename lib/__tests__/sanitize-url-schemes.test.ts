import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import { isSafeUrl, sanitizeHtml } from '../sanitize';

/** Value of `attr` on the first `selector` match after sanitizing, or undefined if dropped. */
function attrAfter(html: string, selector: string, attr: string): string | undefined {
  const $ = cheerio.load(sanitizeHtml(html), null, false);
  const el = $(selector).first();
  expect(el.length, `element ${selector} should survive sanitizing`).toBe(1);
  return el.attr(attr);
}

const href = (value: string) => attrAfter(`<a href="${value}">x</a>`, 'a', 'href');

describe('sanitizeHtml URL scheme allowlist: dropped', () => {
  it.each([
    ['tab entity inside the scheme', 'java&#x09;script:alert(1)'],
    ['newline entity inside the scheme', 'java&#x0A;script:alert(1)'],
    ['literal newline inside the scheme', 'java\nscript:alert(1)'],
    ['CR entity inside the scheme', 'java&#x0D;script:alert(1)'],
    ['leading spaces', '   javascript:alert(1)'],
    ['leading C0 control', '&#x01;javascript:alert(1)'],
    // Literal C1: the HTML parser maps the *entity* &#x85; to U+2026 (windows-1252
    // table), which makes the value relative and harmless; the raw char survives.
    ['leading DEL / literal C1', '&#x7f;\u0085javascript:alert(1)'],
    ['mixed case', 'JaVaScRiPt:alert(1)'],
    ['mixed case with literal newline', 'JaVa\nScRiPt:alert(1)'],
    ['entity-encoded scheme letter', '&#106;avascript:alert(1)'],
    ['fully entity-encoded scheme', '&#x6a;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3a;alert(1)'],
    ['vbscript', 'vbscript:msgbox(1)'],
    ['data:text/html on href', 'data:text/html,&lt;script&gt;alert(1)&lt;/script&gt;'],
    ['data:image on href (data only for img src)', 'data:image/png;base64,AAAA'],
    ['file scheme', 'file:///etc/passwd'],
    ['unknown scheme', 'chrome-extension://abc/x'],
  ])('%s', (_label, value) => {
    expect(href(value)).toBeUndefined();
  });

  it('NUL: the parser turns it into U+FFFD, and the value is still dropped', () => {
    for (const html of ['<a href="java&#x00;script:alert(1)">x</a>', '<a href="java\u0000script:alert(1)">x</a>']) {
      // Real parser behaviour, pinned so the test breaks if cheerio changes it.
      expect(cheerio.load(html, null, false)('a').attr('href')).toBe('java�script:alert(1)');
      expect(attrAfter(html, 'a', 'href')).toBeUndefined();
    }
    expect(href('&#x00;javascript:alert(1)')).toBeUndefined();
  });

  it('data:text/html on img src', () => {
    expect(attrAfter('<img src="data:text/html,x" alt="a">', 'img', 'src')).toBeUndefined();
  });

  it('data:image on a src outside img/source', () => {
    expect(attrAfter('<video src="data:image/png;base64,AAAA"></video>', 'video', 'src')).toBeUndefined();
  });

  it('srcset with one bad candidate among good ones is dropped whole', () => {
    const html = '<img src="/a.png" srcset="/a-1x.png 1x, &#x01;JavaScript:alert(1) 2x, https://cdn.example/a-3x.png 3x">';
    expect(attrAfter(html, 'img', 'srcset')).toBeUndefined();
    expect(attrAfter(html, 'img', 'src')).toBe('/a.png');
  });

  it('srcset with data:text/html candidate is dropped', () => {
    expect(attrAfter('<source srcset="data:text/html,x 1x">', 'source', 'srcset')).toBeUndefined();
  });

  it.each([
    ['poster', '<video poster="javascript:alert(1)"></video>', 'video'],
    ['background', '<table background="javascript:alert(1)"></table>', 'table'],
    ['cite', '<blockquote cite="javascript:alert(1)"></blockquote>', 'blockquote'],
    ['ping', '<a ping="javascript:alert(1)" href="/x">x</a>', 'a'],
    ['data', '<div data="javascript:alert(1)"></div>', 'div'],
  ])('expanded URL attribute set: %s', (attr, html, selector) => {
    expect(attrAfter(html, selector, attr)).toBeUndefined();
  });

  it('svg <a> href and xlink:href', () => {
    const out = sanitizeHtml('<svg><a href="java&#x09;script:alert(1)" xlink:href=" javascript:alert(1)"><text>x</text></a></svg>');
    expect(out).not.toMatch(/script:/i);
  });

  it('svg <use> is removed regardless of href', () => {
    expect(sanitizeHtml('<svg><use href="&#x01;https://evil.example/s.svg#x"></use></svg>')).not.toContain('<use');
  });
});

describe('sanitizeHtml URL scheme allowlist: kept', () => {
  it.each([
    ['https link', 'https://www.canada.ca/en/immigration.html'],
    ['http link', 'http://example.com/'],
    ['relative path', '/en/blog/start-up-visa'],
    ['relative path with colon after slash', 'guides/a:b'],
    ['anchor', '#eligibility'],
    ['query only', '?page=2'],
    ['mailto', 'mailto:hello@visaroads.com'],
    ['tel', 'tel:+15555550100'],
    // By design: protocol-relative is an off-site https link, not script execution.
    ['protocol-relative', '//evil.example/x'],
  ])('%s', (_label, value) => {
    expect(href(value)).toBe(value);
  });

  it('data:image/png on img src', () => {
    const src = 'data:image/png;base64,iVBORw0KGgo=';
    expect(attrAfter(`<img src="${src}" alt="a">`, 'img', 'src')).toBe(src);
  });

  it('data:image/svg+xml on img src (SVG in <img> runs no script)', () => {
    const src = 'data:image/svg+xml;base64,PHN2Zy8+';
    expect(attrAfter(`<img src="${src}">`, 'img', 'src')).toBe(src);
  });

  it('a good srcset', () => {
    const srcset = '/a-1x.png 1x, https://cdn.example/a-2x.png 2x, /a-480.png 480w';
    expect(attrAfter(`<img src="/a.png" srcset="${srcset}">`, 'img', 'srcset')).toBe(srcset);
  });

  it('does not touch non-URL attributes', () => {
    expect(attrAfter('<p title="javascript:alert(1)">x</p>', 'p', 'title')).toBe('javascript:alert(1)');
  });
});

describe('isSafeUrl', () => {
  it('strips controls before reading the scheme', () => {
    expect(isSafeUrl('\u0001java\tscript:x', 'href')).toBe(false);
    expect(isSafeUrl('java script:x', 'href')).toBe(true); // NBSP is not stripped by browsers: relative URL
    expect(isSafeUrl('HTTPS://x', 'href')).toBe(true);
  });

  it('data:image only for src/srcset on img/source', () => {
    expect(isSafeUrl('data:image/png;base64,AA', 'src', 'img')).toBe(true);
    expect(isSafeUrl('data:image/png;base64,AA', 'srcset', 'source')).toBe(true);
    expect(isSafeUrl('data:image/png;base64,AA', 'src')).toBe(false);
    expect(isSafeUrl('data:image/png;base64,AA', 'href', 'img')).toBe(false);
  });
});

describe('sanitizeHtml SVG children', () => {
  it('removes camelCase SVG children (foreignObject, animateMotion, animateTransform)', () => {
    const out = sanitizeHtml(
      '<svg><foreignObject><p>x</p></foreignObject><animateMotion dur="1s"/><animateTransform type="rotate"/><circle r="1"/></svg>',
    ).toLowerCase();
    expect(out).not.toContain('foreignobject');
    expect(out).not.toContain('animatemotion');
    expect(out).not.toContain('animatetransform');
    expect(out).toContain('<circle');
  });
});
