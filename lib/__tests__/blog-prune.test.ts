import { describe, it, expect } from 'vitest';
import { PRUNE_GONE, PRUNE_MERGED } from '../blog-prune';
import { NOT_WITHDRAWN, RETIRED_ARTICLE_PATHS, isGoneArticle, retiredArticleTarget } from '../legacy-redirects';
import { EN_INDEXABLE_PATHS } from '../pageMeta';

describe('the October 2026 blog prune', () => {
  it('never both redirects and removes the same post', () => {
    for (const p of Object.keys(PRUNE_MERGED)) expect(PRUNE_GONE.has(p), p).toBe(false);
  });

  it('only touches English blog posts', () => {
    for (const p of [...Object.keys(PRUNE_MERGED), ...PRUNE_GONE]) expect(p).toMatch(/^\/en\/blog\/[a-z0-9-]+$/);
  });

  it('redirects merged posts to an indexable English page', () => {
    for (const [from, to] of Object.entries(PRUNE_MERGED)) {
      expect(retiredArticleTarget(from)).toBe(to);
      expect(EN_INDEXABLE_PATHS as readonly string[], `${from} -> ${to}`).toContain(to.replace(/^\/en/, ''));
    }
  });

  it('answers gone posts with 410, not a redirect', () => {
    const gone = [...PRUNE_GONE][0];
    expect(isGoneArticle(gone)).toBe(true);
    expect(isGoneArticle(`${gone}/`)).toBe(true);
    expect(retiredArticleTarget(gone)).toBeNull();
    expect(isGoneArticle('/en/blog/finland-start-up-permit-process-2026-step-by-step')).toBe(false);
  });

  it('keeps every withdrawn post out of public queries', () => {
    // + the 5 articles withdrawn for being wrong (four settlement-funds
    // versions, one pre-pause SUV guide) in lib/legacy-redirects.ts.
    expect(RETIRED_ARTICLE_PATHS.size).toBe(Object.keys(PRUNE_MERGED).length + PRUNE_GONE.size + 5);
    const or = (NOT_WITHDRAWN.NOT as { OR: { locale: string; slug: { in: string[] } }[] }).OR;
    const en = or.find((c) => c.locale === 'en')!.slug.in;
    const fa = or.find((c) => c.locale === 'fa')!.slug.in;
    expect(en).toContain('mastering-global-hiring-with-g-p-eor-a-comprehensive-guide');
    expect(en).toContain('navigating-the-dutch-startup-visa-process-a-comprehensive-guide');
    expect(fa).toContain('startup-visa-settlement-funds-iranian-bank-account-1');
    expect(en.length + fa.length).toBe(RETIRED_ARTICLE_PATHS.size);
  });
});
