import { describe, it, expect } from 'vitest';
import { FA_TOPICS, topicToBrief, pickTopics } from '@/content/fa/topics';
import { FA_SITE_PAGES } from '@/lib/autopilot/inventory';
import { DEFAULT_CATEGORIES } from '@/lib/categories';

const PATHS = new Set(FA_SITE_PAGES.map((p) => p.path));

describe('the Persian topic backlog', () => {
  it('only links to Persian pages that exist', () => {
    for (const t of FA_TOPICS) {
      for (const path of t.mustLink) expect(PATHS.has(path), `${t.slug} → ${path}`).toBe(true);
    }
  });

  // The planner's own rule, which the backlog has to honour too: a brief with
  // one link is a dead end, and one with no programme page is an essay.
  it('gives every topic at least two links, one of them a programme page', () => {
    for (const t of FA_TOPICS) {
      expect(t.mustLink.length, t.slug).toBeGreaterThanOrEqual(2);
      const programme = t.mustLink.some((p) => p.startsWith('/europe/') || p.startsWith('/pnp') || p === '/canada-startup-visa' || p === '/usa-eb2-niw');
      expect(programme, `${t.slug} has no programme page`).toBe(true);
    }
  });

  it('uses categories that actually exist in the database', () => {
    for (const t of FA_TOPICS) expect(DEFAULT_CATEGORIES, t.slug).toContain(t.category);
  });

  it('has a unique slug per topic', () => {
    expect(new Set(FA_TOPICS.map((t) => t.slug)).size).toBe(FA_TOPICS.length);
  });

  // The point of the backlog is that a human chose the query. A topic without
  // one is the planner inventing a headline again.
  it('states the Persian query and the audience for every topic', () => {
    for (const t of FA_TOPICS) {
      expect(t.primaryKeyword, t.slug).toMatch(/[؀-ۿ]/);
      expect(t.audience.length, t.slug).toBeGreaterThan(10);
    }
  });

  it('keeps working titles inside the planner\'s 70-character limit', () => {
    for (const t of FA_TOPICS) expect(t.workingTitle.length, `${t.slug}: ${t.workingTitle}`).toBeLessThanOrEqual(70);
  });

  it('writes titles in Persian, not English', () => {
    for (const t of FA_TOPICS) expect(t.workingTitle, t.slug).toMatch(/[؀-ۿ]/);
  });

  // The art direction forbids flags, faces and legible text in the picture.
  // A scene is allowed to *say* "no signage legible" — that is the instruction
  // working, not a violation — so the check strips negated mentions first and
  // only then looks for the subject being depicted.
  it('describes image scenes with no flag, no face and no legible text', () => {
    const affirmative = (scene: string) =>
      scene.toLowerCase().replace(/\bno [a-z' ]+?(?=,|$)/g, ' ');
    for (const t of FA_TOPICS) {
      expect(t.imageScenes).toHaveLength(2);
      for (const s of t.imageScenes) {
        expect(affirmative(s), `${t.slug}: ${s}`).not.toMatch(/\b(flags?|faces?|people|persons?|signage)\b/);
      }
    }
  });
});

describe('topicToBrief', () => {
  it('produces a brief the writer can consume unchanged', () => {
    const b = topicToBrief(FA_TOPICS[0]);
    expect(b.workingTitle).toBe(FA_TOPICS[0].workingTitle);
    expect(b.mustLink).toEqual(FA_TOPICS[0].mustLink);
    expect(['standard', 'deep']).toContain(b.depth);
  });
});

describe('pickTopics', () => {
  it('skips topics whose title has already been written', () => {
    const done = [FA_TOPICS[0].workingTitle];
    const picked = pickTopics(2, done);
    expect(picked.map((t) => t.slug)).not.toContain(FA_TOPICS[0].slug);
    expect(picked).toHaveLength(2);
  });

  it('never returns more than asked for, or more than it has', () => {
    expect(pickTopics(2, [])).toHaveLength(2);
    expect(pickTopics(99, []).length).toBe(FA_TOPICS.length);
  });

  it('allows at most one deep guide in a single run, like the planner', () => {
    const deep = pickTopics(99, []).filter((t) => t.depth === 'deep');
    expect(deep.length).toBeLessThanOrEqual(1);
  });
});
