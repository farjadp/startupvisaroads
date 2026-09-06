// ============================================================================
// lib/social/write-insight.ts
// The thought that goes out on X, written rather than extracted.
//
// The first version took the sentence around a <strong> mark and posted it.
// It was deterministic and cost nothing, and it read exactly like what it was:
// a line lifted out of the middle of a page. "Chairperson of the Canadian
// Energy Regulator (Deadline: August 4, 2026)" is a valid sentence from a
// valid article and a worthless post.
//
// A standalone post is a different piece of writing from a sentence inside an
// article: it carries its own context, makes one point, and is useful to
// somebody who will never open the article. That is a writing job, so the
// writer does it.
//
// The article stays the only source of fact. The model is asked to choose and
// phrase a point, never to add one — the same rule the article pipeline runs
// under, for the same reason.
// ============================================================================
import * as cheerio from 'cheerio';
import { chatText } from '@/lib/autopilot/pipeline';
import { toPersianDigits } from '@/lib/fa/format';

export type InsightSource = {
  title: string;
  locale: 'en' | 'fa';
  content?: string | null;
  keyTakeaway?: string | null;
};

/** How much of the article the writer reads. Enough for the whole argument. */
const SOURCE_CHARS = 9000;

/**
 * Character budgets. The Persian account has Premium, so the limit is
 * editorial rather than technical: past this a post stops being read on a
 * phone. The English budget leaves room for two hashtags inside 280.
 */
const BUDGET = { fa: 600, en: 240 } as const;

/** Article HTML to the prose a reader would see. */
function articleText(html: string): string {
  try {
    const $ = cheerio.load(html);
    $('script, style, figure, figcaption').remove();
    return $.text().replace(/\s+/g, ' ').trim().slice(0, SOURCE_CHARS);
  } catch {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, SOURCE_CHARS);
  }
}

const RULES = `Rules, all of them:
- ONE idea. Not a summary of the article, not a list of its sections.
- It must stand alone. A reader who never opens the article gets the whole point, including whatever context the point needs.
- It must be worth the reader's time on its own: something specific they did not know, or a distinction that changes what they do next. A generic encouragement is a failed post.
- Every fact, number, date, programme and authority in it must already appear in the article below. Add nothing. If the article does not give a figure, describe the shape without inventing one.
- No hashtags, no links, no emoji, no @mentions — those are added afterwards.
- No title, no label, no quotation marks around the post, no "Thread", no "1/".
- Do not open with a question, and do not open with the article's title.
- Never first-person singular. Never salesy. No call to action, no "DM me", no "learn more".
- Output the post text and nothing else.`;

const VOICE = {
  en: `Voice: a senior immigration strategist telling a founder something useful, directly. Short paragraphs, plain words, Canadian spelling, no exclamation marks. Banned outright: "In today's fast-paced world", "It's important to note", "delve", "navigate the complexities", "unlock", "seamless", "robust", "leverage", "game-changer", "landscape", "journey".`,
  fa: `لحن: یک مشاور ارشد که مستقیم با یک بنیان‌گذار حرف می‌زند. فارسیِ نوشتاری، نه گفتاری (می‌رسد نه می‌رسه، است نه ـه، را نه رو). نیم‌فاصله رعایت شود. اعداد داخل متن فارسی، فارسی. نام برنامه‌ها، نهادها و سرواژه‌ها لاتین بماند (IRCC, SUV, EB-2 NIW, USCIS). این عبارت‌ها ممنوع‌اند: «در دنیای امروز»، «قابل توجه است که»، «به طور کلی»، «در نهایت»، «بدون شک»، «شایان ذکر است»، «نقش مهمی ایفا می‌کند».`,
} as const;

function prompt(a: InsightSource, max: number): string {
  const shape =
    a.locale === 'fa'
      ? `یک تا سه پاراگراف کوتاه، حداکثر ${max} کاراکتر.`
      : `One or two short paragraphs, at most ${max} characters.`;

  return `Write one standalone post for X, in ${a.locale === 'fa' ? 'Persian' : 'English'}, drawn from the article below.

${VOICE[a.locale]}

Shape: ${shape}

${RULES}

ARTICLE TITLE: ${a.title}

ARTICLE:
${articleText(a.content ?? '')}`;
}

/** Persian digits in prose; programme codes and acronyms stay Latin. */
const digits = (t: string, locale: 'en' | 'fa') =>
  locale === 'fa' ? t.replace(/(?<![A-Za-z0-9-])\d+(?![A-Za-z0-9-])/g, (d) => toPersianDigits(d)) : t;

function tidy(text: string, locale: 'en' | 'fa'): string {
  const stripped = text
    .replace(/^```[a-z]*\s*/i, '')
    .replace(/\s*```$/, '')
    .replace(/^["“«]|["”»]$/g, '')
    .replace(/^\s*(post|tweet|پست|توییت)\s*:\s*/i, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return digits(stripped, locale);
}

/**
 * Why a draft was rejected, or null when it passes.
 *
 * A draft that breaks these is not trimmed into shape: a post cut mid-thought
 * is the failure mode this module exists to remove, so it is rewritten or
 * dropped instead.
 */
export function rejectReason(text: string, locale: 'en' | 'fa', max: number): string | null {
  if (!text) return 'empty';
  if (text.length > max) return `too long (${text.length} > ${max})`;
  if (text.length < 60) return 'too short to carry a point';
  if (/https?:\/\//.test(text)) return 'contains a link';
  if (/(^|\s)[#@]\S/.test(text)) return 'contains a hashtag or mention';
  if (/\p{Extended_Pictographic}/u.test(text)) return 'contains an emoji';
  if (locale === 'fa' && /[0-9]/.test(text.replace(/[A-Za-z0-9-]*[A-Za-z][A-Za-z0-9-]*/g, ''))) {
    return 'Latin digits in Persian prose';
  }
  return null;
}

/**
 * One post's worth of thought from an article, or null.
 *
 * Null is a real answer: the caller falls back to the extracted sentence, and
 * an account that says nothing today is better than one that says something
 * empty. Nothing here throws — the publish path must survive a model outage.
 */
export async function writeInsight(a: InsightSource, opts: { maxChars?: number } = {}): Promise<string | null> {
  const max = opts.maxChars ?? BUDGET[a.locale];
  const body = (a.content ?? '').trim() || (a.keyTakeaway ?? '').trim();
  if (!body) return null;

  // Two attempts, the second colder and told what was wrong with the first.
  // Length is the usual failure and the one a model fixes reliably when it is
  // named.
  let last = '';
  for (const [i, temperature] of [0.75, 0.3].entries()) {
    try {
      const ask = i === 0 ? prompt(a, max) : `${prompt(a, max)}\n\nA previous attempt was rejected: ${last}. Fix that and write it again.`;
      const draft = tidy(await chatText(ask, temperature), a.locale);
      const bad = rejectReason(draft, a.locale, max);
      if (!bad) return draft;
      last = bad;
      console.warn(`social/insight: draft rejected — ${bad}`);
    } catch (e) {
      console.error(`social/insight: model call failed — ${e instanceof Error ? e.message : String(e)}`);
      return null;
    }
  }
  return null;
}
