import { describe, it, expect } from 'vitest';
import { shouldPostShort, pickForShortPost, explainNoPick, REUSE_DAYS, type Candidate, type PriorPost } from '../pick-article';

const NOW = new Date('2026-09-20T18:00:00Z');
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000);

const art = (id: string, publishedDaysAgo: number): Candidate => ({
  id,
  slug: id,
  title: `عنوان ${id}`,
  locale: 'fa',
  keyTakeaway: `نکته‌ی ${id}`,
  excerpt: null,
  createdAt: daysAgo(publishedDaysAgo),
});
const prior = (articleId: string, daysAgoPosted: number): PriorPost => ({ articleId, createdAt: daysAgo(daysAgoPosted) });

describe('shouldPostShort', () => {
  it('stays quiet on a day something was already published', () => {
    expect(shouldPostShort([art('a', 0)], NOW)).toBe(false);
  });

  it('posts on a day nothing was published', () => {
    expect(shouldPostShort([art('a', 3), art('b', 9)], NOW)).toBe(true);
  });

  // "Today" has to mean the same calendar day, not the last 24 hours, or an
  // article published at 23:50 suppresses the short post for the whole of the
  // next day as well.
  it('compares calendar days, not a rolling 24 hours', () => {
    const lateYesterday = new Date('2026-09-19T23:50:00Z');
    expect(shouldPostShort([{ ...art('a', 0), createdAt: lateYesterday }], NOW)).toBe(true);
  });

  it('has nothing to say when there are no articles at all', () => {
    expect(shouldPostShort([], NOW)).toBe(true);
  });
});

describe('pickForShortPost', () => {
  it('picks an article that has never had a short post', () => {
    const picked = pickForShortPost([art('a', 30), art('b', 20)], [prior('a', 3)], NOW);
    expect(picked?.id).toBe('b');
  });

  it('will reuse an article once the reuse window has passed', () => {
    const picked = pickForShortPost([art('a', 60)], [prior('a', REUSE_DAYS + 1)], NOW);
    expect(picked?.id).toBe('a');
  });

  it('returns nothing rather than repeating itself while everything is recent', () => {
    const picked = pickForShortPost([art('a', 30), art('b', 20)], [prior('a', 1), prior('b', 2)], NOW);
    expect(picked).toBeNull();
  });

  // A channel that keeps surfacing last week's piece looks automated. Older
  // articles are the ones a reader is least likely to have seen.
  it('prefers the article that has gone longest without attention', () => {
    const picked = pickForShortPost([art('new', 2), art('old', 200)], [], NOW);
    expect(picked?.id).toBe('old');
  });

  it('never picks an article with nothing quotable in it', () => {
    const empty = { ...art('empty', 100), keyTakeaway: null, excerpt: null };
    const picked = pickForShortPost([empty, art('ok', 10)], [], NOW);
    expect(picked?.id).toBe('ok');
  });

  it('returns nothing when there are no candidates', () => {
    expect(pickForShortPost([], [], NOW)).toBeNull();
  });
});

// Production said "every article was used within 45 days" on a database with
// no prior posts at all and no Persian articles. A diagnostic that names the
// wrong cause is worse than none: it sends the next person looking in the
// wrong place.
describe('explainNoPick', () => {
  it('says there are no articles when there are none', () => {
    expect(explainNoPick([], [], NOW)).toMatch(/no published article/i);
  });

  it('says none is quotable when the articles have nothing to quote', () => {
    const bare = { ...art('a', 10), keyTakeaway: null, excerpt: null };
    expect(explainNoPick([bare], [], NOW)).toMatch(/quotable/i);
  });

  it('only blames the reuse window when that is genuinely the cause', () => {
    expect(explainNoPick([art('a', 30)], [prior('a', 1)], NOW)).toMatch(/45 days|reuse/i);
  });
});
