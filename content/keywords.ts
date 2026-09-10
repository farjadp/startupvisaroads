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
// ============================================================================
import RAW_EN from '@/prisma/keywords.json';
import { FA_TOPICS } from '@/content/fa/topics';
import type { Locale } from '@/lib/seo';

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

export const EN_KEYWORDS: string[] = (RAW_EN as string[]).filter((k) => !NOT_AN_ARTICLE.test(k));

/**
 * Persian draws from the backlog's own keywords — the ones Farjad named per
 * topic — so that when the 14 hand-written briefs run out the lane keeps
 * writing to the same search intent instead of to whatever the model invents.
 */
export const FA_KEYWORDS: string[] = [
  ...new Set(FA_TOPICS.flatMap((t) => [t.primaryKeyword, ...t.secondaryKeywords])),
].filter(Boolean);

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
