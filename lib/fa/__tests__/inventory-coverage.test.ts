// ============================================================================
// Every Persian route must be linkable from a Persian article.
//
// FA_SITE_PAGES in lib/autopilot/inventory.ts is the only list the article
// writer draws internal links from. A route that exists in FA_PATHS but not
// there is invisible to the autopilot: the page ships, the nav links to it,
// and no article ever points at it. That is what happened to Türkiye — it
// went live on 8 Sep and was still missing from the inventory a day later,
// found only because Israel was being added to the same file.
//
// This test is the tripwire, so the next route cannot ship without its link
// entry. Anything deliberately left out has to be named below, which turns a
// silent omission into a visible decision.
// ============================================================================
import { describe, it, expect } from 'vitest';
import { FA_PATHS } from '../paths';
import { FA_SITE_PAGES } from '@/lib/autopilot/inventory';

/**
 * Paths that are deliberately not link targets for the writer.
 *
 * The home page is not a destination an article links out to. The three
 * Canada sub-guides are real pages and arguably should be here — they are
 * excluded because that would change what the autopilot links to, which is a
 * separate decision from this test.
 */
const NOT_LINK_TARGETS: readonly string[] = [
  '',
  '/canada-startup-visa/requirements',
  '/canada-startup-visa/cost',
  '/canada-startup-visa/designated-organizations',
];

describe('the Persian link inventory', () => {
  const inInventory = new Set(FA_SITE_PAGES.map((p) => p.path));

  it('covers every Persian route the writer may link to', () => {
    const missing = FA_PATHS.filter(
      (p) => !NOT_LINK_TARGETS.includes(p) && !inInventory.has(p),
    );
    expect(missing).toEqual([]);
  });

  it('never advertises a path that does not exist in Persian', () => {
    const orphans = FA_SITE_PAGES.map((p) => p.path).filter(
      (p) => !(FA_PATHS as readonly string[]).includes(p),
    );
    expect(orphans).toEqual([]);
  });

  it('keeps Türkiye in it, which is the case that produced this test', () => {
    expect(inInventory.has('/turkey-tech-visa')).toBe(true);
  });
});
