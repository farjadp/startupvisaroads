import { describe, it, expect } from 'vitest';
import { unprefixedTarget } from '../legacy-redirects';

describe('unprefixedTarget', () => {
  it('sends a legacy unprefixed path to English permanently', () => {
    expect(unprefixedTarget('/blog/comprehensive-guide-to-starting-your-business-in-denmark')).toBe(
      '/en/blog/comprehensive-guide-to-starting-your-business-in-denmark',
    );
    expect(unprefixedTarget('/pnp/pei')).toBe('/en/pnp/pei');
    expect(unprefixedTarget('/country/finland')).toBe('/en/country/finland');
    expect(unprefixedTarget('/blog')).toBe('/en/blog');
  });

  it('leaves the root to locale detection', () => {
    expect(unprefixedTarget('/')).toBeNull();
    expect(unprefixedTarget('')).toBeNull();
  });

  it('never touches a path that already has a locale', () => {
    expect(unprefixedTarget('/en')).toBeNull();
    expect(unprefixedTarget('/en/blog/x')).toBeNull();
    expect(unprefixedTarget('/fa')).toBeNull();
    expect(unprefixedTarget('/fa/pnp/nova-scotia')).toBeNull();
  });

  it('does not mistake a path that merely starts with en or fa for a locale', () => {
    expect(unprefixedTarget('/entrepreneur')).toBe('/en/entrepreneur');
    expect(unprefixedTarget('/faq')).toBe('/en/faq');
  });

  it('leaves admin and the root-level metadata routes alone', () => {
    expect(unprefixedTarget('/admin')).toBeNull();
    expect(unprefixedTarget('/admin/login')).toBeNull();
    expect(unprefixedTarget('/icon')).toBeNull();
    expect(unprefixedTarget('/apple-icon')).toBeNull();
  });
});
