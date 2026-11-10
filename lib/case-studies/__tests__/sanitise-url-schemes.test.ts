// Regression: case HTML is rendered with dangerouslySetInnerHTML in the admin
// review preview. lib/sanitize.ts only checks startsWith('javascript:') after
// trim(), so a tab/newline inside the scheme or a leading C0 control survived,
// and browsers strip those before reading the scheme (docs/security/case-studies.md, H1).
import { describe, expect, it } from 'vitest';
import { isSafeCaseUrl, sanitiseCaseHtml } from '@/lib/case-studies/payload';

const hrefOf = (html: string) => /href="([^"]*)"/.exec(sanitiseCaseHtml(html))?.[1] ?? null;

describe('sanitiseCaseHtml URL schemes', () => {
  it.each([
    '<a href="java&#x09;script:alert(1)">x</a>',
    '<a href="java&#x0A;script:alert(1)">x</a>',
    '<a href="java\nscript:alert(1)">x</a>',
    '<a href="&#x01;javascript:alert(1)">x</a>',
    '<a href="&#x1F; JaVaScRiPt:alert(1)">x</a>',
    '<a href="vb&#x09;script:x">x</a>',
    '<a href="data:text/html,<script>alert(1)</script>">x</a>',
    '<a href="file:///etc/passwd">x</a>',
  ])('drops a dangerous href: %s', (html) => {
    expect(hrefOf(html)).toBeNull();
  });

  it('drops srcset and a non-image data: src', () => {
    expect(sanitiseCaseHtml('<img src="x.png" srcset="java&#x09;script:x 1x">')).not.toContain('srcset');
    expect(sanitiseCaseHtml('<iframe src="data:text/html,x"></iframe><img src="data:text/html,x">')).not.toContain('data:text');
  });

  it('keeps safe links', () => {
    expect(hrefOf('<a href="https://decisions.fct-cf.gc.ca/x">x</a>')).toBe('https://decisions.fct-cf.gc.ca/x');
    expect(hrefOf('<a href="/en/guides/start-up-visa">x</a>')).toBe('/en/guides/start-up-visa');
    expect(hrefOf('<a href="#para-26">x</a>')).toBe('#para-26');
    expect(hrefOf('<a href="mailto:hello@visaroads.com">x</a>')).toBe('mailto:hello@visaroads.com');
    expect(isSafeCaseUrl('data:image/png;base64,AAAA', 'src', 'img')).toBe(true);
    expect(isSafeCaseUrl('data:image/png;base64,AAAA', 'href', 'a')).toBe(false);
  });
});
