// ============================================================================
// content/keywords.ts
// The keyword pool the planner must draw from, per locale.
//
// WHY THIS EXISTS
// `prisma/keywords.json` — 98 keywords Farjad supplied — was wired to the old
// one-shot writer (`/api/cron/generate`) and to nothing else. The autopilot
// that replaced it planned topics from the site's own pages instead, which is
// why the English lane kept circling Canadian study permits: the pages it
// reads are mostly about Canada, and the feeds it reads repeat one story for
// days. The list was sitting in the repo unused.
//
// So the pool is now the planner's input. A keyword is spent once an article
// records it, and the planner is handed only what is left — which is what
// turns "write something about immigration" into a queue with 80-odd distinct
// subjects in it.
//
// Since 26 Oct 2026 the English pool is content/en/keywords.ts, grouped by
// pillar and taken from real Autocomplete queries; the planner is handed the
// slice for today's pillar first. prisma/keywords.json stays for the old
// one-shot writer only.
// ============================================================================
import { EN_KEYWORDS_BY_PILLAR } from '@/content/en/keywords';
import { FA_TOPICS } from '@/content/fa/topics';
import { classifyPillar, type Pillar } from '@/lib/autopilot/pillars';
import type { Locale } from '@/lib/seo';
import { classify, pickDiverse, type Tagged } from '@/lib/autopilot/diversity';

/**
 * Keywords that belong on a landing page, not in the magazine.
 *
 * "visa consultant near me", "visaroads success rate", "free immigration
 * consultation" are navigational or commercial intent: someone typing them
 * wants a company, not an article, and an article written to them is either
 * an advert or filler. They stay in the file — they are legitimate targets for
 * /mentorship and /contact — and out of the writing queue.
 */
const NOT_AN_ARTICLE =
  /(visaroads|near me|booking|consultation|consultant cost|emergency|urgent|package|success rate|review|help$|services$|assessment free|test online|eligibility checker)/i;

export const EN_KEYWORDS: string[] = [...new Set(Object.values(EN_KEYWORDS_BY_PILLAR).flat())].filter((k) => !NOT_AN_ARTICLE.test(k));

/**
 * Persian draws from the backlog's own keywords — the ones Farjad named per
 * topic — so that when the 14 hand-written briefs run out the lane keeps
 * writing to the same search intent instead of to whatever the model invents.
 */
export const FA_KEYWORDS: string[] = [
  ...new Set(FA_TOPICS.flatMap((t) => [t.primaryKeyword, ...t.secondaryKeywords])),
].filter(Boolean);

/** The pillar a keyword was filed under, or read off its words when it was not filed. */
export function keywordPillar(locale: Locale, keyword: string): Pillar {
  if (locale === 'en') {
    for (const [p, list] of Object.entries(EN_KEYWORDS_BY_PILLAR)) if (list.includes(keyword)) return p as Pillar;
  } else {
    const topic = FA_TOPICS.find((t) => t.primaryKeyword === keyword || t.secondaryKeywords.includes(keyword));
    if (topic?.pillar) return topic.pillar;
  }
  return classifyPillar(keyword);
}

export function poolFor(locale: Locale): string[] {
  return locale === 'fa' ? FA_KEYWORDS : EN_KEYWORDS;
}

/** Normalised, so "Visa Processing Time" and "visa processing time" are one keyword. */
const norm = (k: string) => k.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * What is left of the pool, oldest-unused first.
 *
 * Returns everything unused rather than a slice: the caller decides how many
 * to show the model, and a caller that asks for two must not be handed the
 * same two every morning.
 */
export function unusedKeywords(locale: Locale, used: string[]): string[] {
  const spent = new Set(used.map(norm));
  return poolFor(locale).filter((k) => !spent.has(norm(k)));
}

/**
 * `count` keywords from the unused pool, rotated by the day so consecutive
 * runs do not see the same head of the list. When the pool is exhausted the
 * planner is handed nothing and invents, as it did before — the lane never
 * stops for want of a keyword.
 */
export function keywordsForToday(locale: Locale, used: string[], count: number, at: Date = new Date()): string[] {
  const left = unusedKeywords(locale, used);
  if (left.length <= count) return left;
  const day = Math.floor(at.getTime() / 86_400_000);
  const start = (day * count) % left.length;
  return Array.from({ length: count }, (_, i) => left[(start + i) % left.length]);
}

/**
 * `count` keywords chosen for spread rather than position.
 *
 * `keywordsForToday` rotates by the day, which stops the same head of the list
 * appearing every morning but does nothing when most of the list is one
 * subject — and the Persian pool is built from a backlog whose titles were
 * mostly "startup visa + something". So each unused keyword is classified by
 * subject family and destination, and the slice handed to the planner is the
 * most varied one available given what was just published. The day rotation
 * still breaks ties, so two runs with the same history do not see the same
 * slice.
 */
export function diverseKeywordsForToday(
  locale: Locale,
  used: string[],
  count: number,
  recent: Tagged[],
  at: Date = new Date(),
  pillar?: Pillar,
): string[] {
  const all = unusedKeywords(locale, used);
  // Today's pillar first. When it has run dry, the whole pool, rather than an
  // empty queue: the planner is still told the pillar and keeps to it.
  const inPillar = pillar ? all.filter((k) => keywordPillar(locale, k) === pillar) : all;
  const left = inPillar.length ? inPillar : all;
  if (left.length <= count) return left;
  const day = Math.floor(at.getTime() / 86_400_000);
  const start = (day * count) % left.length;
  const rotated = left.map((_, i) => left[(start + i) % left.length]);
  const tagged = rotated.map((keyword) => ({ keyword, ...classify(keyword) }));
  return pickDiverse(tagged, recent, count).map((t) => t.keyword);
}
