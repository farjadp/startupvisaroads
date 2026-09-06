// ============================================================================
// lib/social/insights.ts
// The interesting points inside an article, for the daily tweets.
//
// The insight tweet was repeating the article's keyTakeaway, which is the
// same paragraph the article post already carried — so a follower saw one
// thought twice and the account read like a bot.
//
// The house style already solves this. It instructs the writer to "bold the
// decisive phrase in each section with <strong>, once, never whole
// sentences", so every article arrives with its own points already marked by
// whoever wrote it. Taking the sentence around each mark needs no model call,
// is deterministic, and picks what the article itself considered decisive.
// ============================================================================
import * as cheerio from 'cheerio';
import { toPersianDigits } from '@/lib/fa/format';

const MIN_CHARS = 41;
const MAX_CHARS = 400;

/** Persian digits in prose; programme codes and acronyms stay Latin. */
const digits = (t: string, locale: 'en' | 'fa') =>
  locale === 'fa' ? t.replace(/(?<![A-Za-z0-9-])\d+(?![A-Za-z0-9-])/g, (d) => toPersianDigits(d)) : t;

/** Sentence boundaries that work for both scripts. */
const SPLIT = /(?<=[.!?؟])\s+|(?<=\.)\s*$/u;

export function extractInsights(html: string, locale: 'en' | 'fa'): string[] {
  if (!html?.trim()) return [];

  let $: cheerio.CheerioAPI;
  try {
    $ = cheerio.load(html);
  } catch {
    return [];
  }
  $('script, style').remove();

  const out: string[] = [];
  const seen = new Set<string>();

  $('strong').each((_, el) => {
    const mark = $(el).text().trim();
    if (!mark) return;

    // The sentence containing the mark, from its own paragraph.
    const paragraph = $(el).closest('p, li').text().replace(/\s+/g, ' ').trim();
    if (!paragraph) return;

    const sentence = paragraph.split(SPLIT).find((s) => s.includes(mark)) ?? paragraph;
    const text = digits(sentence.trim(), locale);

    if (text.length < MIN_CHARS || text.length > MAX_CHARS) return;
    if (seen.has(text)) return;
    seen.add(text);
    out.push(text);
  });

  return out;
}
