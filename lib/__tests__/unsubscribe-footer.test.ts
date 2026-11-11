import { describe, it, expect } from 'vitest';
import { applyUnsubscribe } from '../unsubscribe-footer';

const URL_ = 'https://visaroads.com/unsubscribe?email=a%40b.com&token=abc';

describe('applyUnsubscribe', () => {
  it('fills every placeholder and adds no second footer', () => {
    const html = '<body><a href="{{unsubscribe_url}}">Unsubscribe</a> <a href="{{ unsubscribe_url }}">x</a></body>';
    const out = applyUnsubscribe(html, URL_);
    expect(out).not.toContain('{{');
    expect(out.match(/unsubscribe\?email=/g)).toHaveLength(2);
    expect(out).toContain('&amp;token=abc');
    expect(out).not.toContain('لغو عضویت');
  });

  it('inserts the plain footer before </body> when there is no placeholder', () => {
    const out = applyUnsubscribe('<html><body><p>Hi</p></body></html>', URL_);
    expect(out.indexOf('Unsubscribe')).toBeLessThan(out.indexOf('</body>'));
    expect(out.endsWith('</body></html>')).toBe(true);
  });

  it('appends to a fragment with no body tag', () => {
    expect(applyUnsubscribe('<p>Hi</p>', URL_)).toMatch(/^<p>Hi<\/p><div/);
  });

  it('leaves the html alone without a url', () => {
    expect(applyUnsubscribe('<p>{{unsubscribe_url}}</p>', '')).toBe('<p>{{unsubscribe_url}}</p>');
  });

  it('works on consecutive calls (no stale regex state)', () => {
    const html = '<a href="{{unsubscribe_url}}">u</a>';
    expect(applyUnsubscribe(html, URL_)).toContain('token=abc');
    expect(applyUnsubscribe(html, URL_)).toContain('token=abc');
  });
});
