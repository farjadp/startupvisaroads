// These are the actual titles the Persian lane published on 6–8 Sep 2026: the
// same topic four times, because the coverage test was substring matching and
// the writer renames every piece.
import { describe, it, expect } from 'vitest';
import { sameSubject } from '../text';
import { FA_TOPICS, pickTopics } from '@/content/fa/topics';

const PUBLISHED = [
  'اثبات تمکن مالی ویزای استارتاپ با حساب بانکی ایرانی',
  'اثبات تمکن مالی ویزای استارتاپ با حساب ایرانی: راهنمای عملی',
  'اثبات تمکن مالی ویزای استارتاپ با حساب بانکی ایرانی',
];
const BACKLOG = FA_TOPICS[0].workingTitle; // 'اثبات تمکن مالی برای ویزای استارتاپ وقتی حساب ایرانی دارید'

describe('sameSubject', () => {
  it('sees the four repeats for what they are', () => {
    for (const t of PUBLISHED) expect(sameSubject(t, BACKLOG)).toBe(true);
    expect(sameSubject(PUBLISHED[0], PUBLISHED[1])).toBe(true);
  });

  it('keeps two genuinely different topics apart', () => {
    expect(sameSubject(BACKLOG, 'کجا باید بیومتریک و مدارک ویزای استارتاپ را ارائه کنید؟')).toBe(false);
    expect(sameSubject(BACKLOG, 'ویزای استارتاپ دانمارک یا فنلاند؟ مقایسه برای تیم ایرانی')).toBe(false);
  });

  it('does not call two English titles the same just for sharing the boilerplate', () => {
    expect(sameSubject(
      'A complete guide to the Canada startup visa for founders',
      'A complete guide to Canadian study permits and the PGWP',
    )).toBe(false);
  });
});

describe('pickTopics', () => {
  it('moves on once a topic has been written under a rewritten title', () => {
    const next = pickTopics(1, PUBLISHED);
    expect(next[0]?.slug).not.toBe(FA_TOPICS[0].slug);
  });

  it('trusts the recorded topic id even when the title looks unrelated', () => {
    const next = pickTopics(1, [], [FA_TOPICS[0].slug]);
    expect(next[0]?.slug).not.toBe(FA_TOPICS[0].slug);
  });

  it('still returns the first topic on an empty site', () => {
    expect(pickTopics(1, [])[0]?.slug).toBe(FA_TOPICS[0].slug);
  });
});

// The English lane has no human backlog to deduplicate against: its topics are
// whatever the feeds carried, and feeds repeat a story for days. These are two
// real titles it published a day apart.
describe('the English lane repeats too', () => {
  it('recognises two pieces about the same programme change', () => {
    expect(sameSubject(
      'Manage your Canada study permit and PGWP for Fall 2026 success',
      'Study permit and PGWP eligibility for the Fall 2026 intake in Canada',
    )).toBe(true);
  });

  it('leaves a different subject alone', () => {
    expect(sameSubject(
      'Manage your Canada study permit and PGWP for Fall 2026 success',
      'What the Netherlands asks of a startup facilitator agreement',
    )).toBe(false);
  });
});
