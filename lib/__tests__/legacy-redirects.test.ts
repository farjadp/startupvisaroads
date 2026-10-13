import { describe, it, expect } from 'vitest';
import { RETIRED_ARTICLE_PATHS, retiredArticleTarget, unprefixedTarget } from '../legacy-redirects';

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

describe('retiredArticleTarget', () => {
  it('takes both versions of the withdrawn settlement-funds article off the site', () => {
    const next = '/fa/europe/finland';
    expect(retiredArticleTarget('/fa/blog/startup-visa-settlement-funds-proof-from-iranian-account')).toBe(next);
    expect(retiredArticleTarget('/fa/blog/startup-visa-settlement-funds-iranian-bank-account-1')).toBe(next);
  });

  it('tolerates a trailing slash and ignores every other path', () => {
    expect(retiredArticleTarget('/fa/blog/startup-visa-settlement-funds-iranian-bank-account-1/')).toBe('/fa/europe/finland');
    expect(retiredArticleTarget('/fa/blog/startup-visa-proof-of-funds-denmark-finland-official')).toBeNull();
    expect(retiredArticleTarget('/en/blog/startup-visa-settlement-funds-iranian-bank-account-1')).toBeNull();
  });
});

describe('RETIRED_ARTICLE_PATHS', () => {
  it('lists exactly the withdrawn articles, so the sitemap can skip them', () => {
    expect(RETIRED_ARTICLE_PATHS.has('/fa/blog/startup-visa-settlement-funds-iranian-bank-account-1')).toBe(true);
    expect(RETIRED_ARTICLE_PATHS.has('/fa/blog/startup-visa-settlement-funds-proof-from-iranian-account')).toBe(true);
    expect(RETIRED_ARTICLE_PATHS.has('/fa/blog/startup-visa-settlement-funds-iranian-bank-account')).toBe(true);
    expect(RETIRED_ARTICLE_PATHS.has('/fa/blog/startup-visa-settlement-funds-proof-iranian-bank-account')).toBe(true);
    expect(RETIRED_ARTICLE_PATHS.has('/fa/blog/startup-visa-proof-of-funds-denmark-finland-official')).toBe(false);
  });
});

describe('retired Start-Up Visa guide', () => {
  it('sends the pre-pause June guide to the status page', () => {
    expect(retiredArticleTarget('/en/blog/comprehensive-guide-to-the-canada-startup-visa-requirements-processes-and-insights')).toBe('/en/startup-visa-canada');
  });
});
