// ============================================================================
// Which sentence of an article earns a "The number" figure.
// ----------------------------------------------------------------------------
// Rules (Farjad, 10 Nov 2026):
//  - A figure is drawn only from a sentence that an OFFICIAL source supports.
//    Two citation forms exist on the site:
//      1. the autopilot's  <sup><a href="#src-n">[n]</a></sup>  pointing at
//         <li id="src-n"> in the Sources block, official when that item links
//         to an allowlisted authority (lib/autopilot/official-sources.ts);
//      2. the agent articles' inline "(IRCC, measures page, 5 Nov 2026)",
//         official when it opens with an authority's name.
//    A citation supports its own sentence and the uncited sentences just
//    before it in the same paragraph ("…; … (source).").
//  - Nothing is invented or rounded: the big number, every chart label and
//    the caption are the article's own characters.
//  - A sentence qualifies only when a chart can be drawn from it alone and
//    the chart compares like with like: 2–4 quantities of ONE measure (same
//    unit, same noun after each number), each tied to a point in time — a
//    date, a target, or the two sides of "up from" / "before …". Numbers of
//    different things in one sentence (7 million job openings, 1.4 million
//    trades workers) are never put side by side. Or a single small count.
// ============================================================================

import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { OFFICIAL_SOURCES, officialCitationUrl } from '@/lib/autopilot/official-sources';
import { findDate, findQuantities, normaliseDigits, toPersianDigits, type Locale, type Quantity } from './numbers';

export type ChartKind = 'bars' | 'timeline' | 'count';

export type FigurePoint = { label: string; value: string; magnitude: number; highlight: boolean };

export type FigurePlan = {
  kind: ChartKind;
  /** The big number, as written (with "up to" when the article says so). */
  headline: string;
  /** The supporting sentence, citations removed. */
  caption: string;
  /** Points in reading order; exactly one is highlighted. */
  points: FigurePoint[];
  /** "IRCC, measures page, 5 Nov 2026" or the Sources-list entry. */
  source: string;
  /** Index of the paragraph (among the article's <p>) the figure follows. */
  paragraphIndex: number;
};

// ─── Official authorities named in inline citations ──────────────────────────

/** "IRCC", "Migri", "USCIS" … taken from the registry's own "(…)" acronyms. */
const REGISTRY_NAMES = OFFICIAL_SOURCES.flatMap((s) => {
  const names = [s.authority.split(/[,—(]/)[0].trim()];
  for (const m of s.authority.matchAll(/\(([^)]+)\)/g)) names.push(m[1].split(/\s*\/\s*/)[0].trim());
  return names;
});

/** Authorities the registry has no URL entry for but that publish the figures we cite. */
const EXTRA_NAMES = [
  'IRCC', 'Immigration, Refugees and Citizenship Canada', 'Government of Canada', 'Department of Finance',
  'Finance Canada', 'Canada Gazette', 'ESDC', 'Employment and Social Development Canada', 'Statistics Canada',
  'Prime Minister of Canada', 'Manitoba Immigration', 'Immigrate Manitoba', 'WelcomeBC', 'OINP', 'Ontario',
  'Government of Ontario', 'USCIS', 'U.S. Department of State', 'Department of State', 'Home Affairs',
  'Migri', 'IND', 'SIRI', 'Business Finland', 'Startup Estonia', 'Police and Border Guard Board', 'MIMIT', 'BOE',
  // Persian forms used by the /fa articles.
  'اداره مهاجرت کانادا', 'دولت کانادا', 'وزارت دارایی کانادا', 'اداره مهاجرت فنلاند', 'اداره مهاجرت هلند',
];

const AUTHORITY_NAMES = [...new Set([...REGISTRY_NAMES, ...EXTRA_NAMES].filter((n) => n.length >= 2))]
  .sort((a, b) => b.length - a.length)
  .map((n) => n.toLowerCase());

/** "Budget 2026" / «بودجه ۲۰۲۶» — the federal budget document, cited by year. */
const BUDGET = /^(?:budget|بودجه(?:‌ی|ی)?)\s+(?:19|20)\d\d\b/i;

export function isOfficialInlineCitation(inner: string): boolean {
  const norm = normaliseDigits(inner).trim();
  if (!/(?:19|20)\d\d/.test(norm)) return false; // a citation names when
  const lead = norm.split(/[,،]/)[0].trim().toLowerCase();
  if (BUDGET.test(lead)) return true;
  return AUTHORITY_NAMES.some((name) => lead === name || lead.startsWith(`${name} `) || lead.startsWith(`${name}'`));
}

/** An inline "(…)" that reads as a citation at all, official or not. */
function isInlineCitation(inner: string): boolean {
  const norm = normaliseDigits(inner);
  return /(?:19|20)\d\d/.test(norm) && /[,،]/.test(norm) && inner.length <= 200;
}

// ─── Sentences ────────────────────────────────────────────────────────────────

type Sentence = { text: string; citations: { official: boolean; source: string }[] };

// Brackets no article uses, so a citation survives .text() as a marker. Not
// control characters: cheerio parses the replacement as HTML and drops them.
const MARK = (n: string) => `\u27E6${n}\u27E7`;
const MARK_RE = /\s*\u27E6(\d+)\u27E7/g;

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?؟])\s+(?=["“«(]?[A-Z؀-ۿ\d\u27E6])/u)
    .map((s) => s.trim())
    .filter(Boolean);
}

type SourceItem = { official: boolean; label: string };

function sourcesList($: cheerio.CheerioAPI, locale: Locale): Map<string, SourceItem> {
  const out = new Map<string, SourceItem>();
  $('li[id^="src-"]').each((_, li) => {
    const n = ($(li).attr('id') ?? '').slice(4);
    const link = $(li).find('a[href]').first();
    const href = link.attr('href') ?? '';
    const title = (link.text() || $(li).text()).replace(/\s+/g, ' ').trim();
    const iso = /\b(\d{4}-\d{2}-\d{2})\b/.exec($(li).text())?.[1];
    const label = iso ? `${title}, ${locale === 'fa' ? toPersianDigits(iso) : iso}` : title;
    out.set(n, { official: Boolean(officialCitationUrl(href)), label });
  });
  return out;
}

/** The paragraph's text with citations pulled out of it and kept beside each sentence. */
function readParagraph($: cheerio.CheerioAPI, p: Element, sources: Map<string, SourceItem>): Sentence[] {
  const clone = $(p).clone();
  clone.find('sup').each((_, sup) => {
    const refs = $(sup)
      .find('a[href^="#src-"]')
      .map((__, a) => ($(a).attr('href') ?? '').slice(5))
      .get();
    $(sup).replaceWith(refs.map(MARK).join(''));
  });
  const text = clone.text().replace(/\s+/g, ' ').trim();

  return splitSentences(text).map((raw) => {
    const citations: Sentence['citations'] = [];
    let clean = raw.replace(MARK_RE, (_w, n: string) => {
      const item = sources.get(n);
      if (item) citations.push({ official: item.official, source: item.label });
      return '';
    });
    clean = clean.replace(/\s*\(([^()]{3,200})\)/g, (whole, inner: string) => {
      if (!isInlineCitation(inner)) return whole;
      citations.push({ official: isOfficialInlineCitation(inner), source: inner.trim() });
      return '';
    });
    clean = clean.replace(/\s+([.,;:؛،!?؟])/g, '$1').replace(/\s+/g, ' ').trim();
    return { text: clean, citations };
  });
}

// ─── Labels ───────────────────────────────────────────────────────────────────

const STOP_AFTER = new Set(['is', 'are', 'was', 'were', 'in', 'by', 'for', 'of', 'from', 'to', 'and', 'up', 'with', 'at', 'on', 'as',
  'before', 'after', 'since', 'until', 'under', 'each', 'a', 'per',
  'است', 'بود', 'بودند', 'هستند', 'شد', 'در', 'به', 'از', 'و', 'را', 'تا', 'با', 'برای', 'قبل', 'پیش', 'بعد', 'پس', 'هر']);
const STOP_BEFORE = new Set(['of', 'to', 'at', 'reached', 'was', 'is', 'were', 'are', 'by', 'about', 'only', 'set', 'sets', 'has', 'have', 'the',
  'برابر', 'به', 'از', 'تا', 'را', 'حدود', 'فقط', 'و']);

/** The clause (between , ; ، ؛ and "and"/"و") that holds a quantity. */
function clauseOf(sentence: string, q: Quantity): { text: string; offset: number } {
  const cuts = [0];
  // ", " not ",": the comma inside 200,000 is not a clause boundary.
  for (const m of sentence.matchAll(/,\s|[;،؛]|\s(?:and|و)\s/g)) cuts.push(m.index! + m[0].length);
  cuts.push(sentence.length);
  let from = 0;
  let to = sentence.length;
  for (const c of cuts) {
    if (c <= q.start) from = c;
    else if (c >= q.end) {
      to = c;
      break;
    }
  }
  return { text: sentence.slice(from, to), offset: from };
}

function words(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

type Label = { label: string; kind: 'date' | 'target' | 'change' };

const TARGET = /^(?:target|targets|goal|plan|planned|levels plan|هدف|برنامه)$/i;

/**
 * What point in time a quantity belongs to, from its own clause only:
 * a date ("October 2026", «۲۰۲۴»), a target ("new annual target", «هدف
 * جدید»), or a change ("before the new law", the "from" side of "up from").
 * Anything else is no label, and the sentence gets no comparison chart.
 */
function labelFor(sentence: string, q: Quantity): Label | null {
  const clause = clauseOf(sentence, q);
  const local = { start: q.start - clause.offset, end: q.end - clause.offset };
  const outside = clause.text.slice(0, local.start) + ' ' + clause.text.slice(local.end);
  const date = findDate(outside);
  if (date) return { label: date, kind: 'date' };

  const after = clause.text.slice(local.end).replace(/[.!?؟]+$/, '');
  const prep = /^\s+((?:before|after|since|until|قبل از|پیش از|بعد از|پس از)\s+[^\s,;.]+(?:\s+[^\s,;.]+){0,3})/i.exec(after);
  if (prep) return { label: prep[1].trim(), kind: 'change' };

  const head = words(clause.text.slice(0, local.start));
  while (head.length && STOP_BEFORE.has(head[head.length - 1].toLowerCase())) head.pop();
  const lead = head.slice(-3);
  while (lead.length && STOP_BEFORE.has(lead[0].toLowerCase())) lead.shift();
  if (lead.some((w) => TARGET.test(w))) return { label: lead.join(' '), kind: 'target' };
  return null;
}

/** The thing a quantity counts, when the prose names it after the number: "protected persons". */
function nounAfter(sentence: string, q: Quantity): string {
  const out: string[] = [];
  for (const w of words(sentence.slice(q.end).replace(/[.,;:!?؟،؛)][\s\S]*$/, ''))) {
    if (STOP_AFTER.has(w.toLowerCase()) || out.length === 3) break;
    out.push(w.toLowerCase());
  }
  return out.join(' ');
}

const capitalise = (s: string, locale: Locale) => (locale === 'en' ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// ─── Plan ─────────────────────────────────────────────────────────────────────

/** The earlier side of "up from X", "down from X", «از X». */
function isEarlier(sentence: string, q: Quantity): boolean {
  const before = sentence.slice(Math.max(0, q.start - 24), q.start);
  return /(?:\bfrom|\bfrom only|از)\s*$/i.test(before);
}

function planSentence(sentence: string, locale: Locale): Omit<FigurePlan, 'source' | 'paragraphIndex'> | null {
  const qs = findQuantities(sentence);
  if (qs.length === 0) return null;

  const oneMeasure = qs.every((q) => q.unit === qs[0].unit) && new Set(qs.map((q) => nounAfter(sentence, q))).size === 1;
  if (qs.length >= 2 && qs.length <= 4 && oneMeasure) {
    const labelled = qs.map((q) => ({ q, l: labelFor(sentence, q) ?? (isEarlier(sentence, q) ? null : undefined) }));
    if (labelled.every((x) => x.l)) {
      const labels = labelled.map((x) => x.l!.label);
      if (new Set(labels).size === labels.length && labelled.every((x) => !qs.some((o) => x.l!.label.includes(o.raw)))) {
        const ordered = [...labelled.filter((x) => isEarlier(sentence, x.q)), ...labelled.filter((x) => !isEarlier(sentence, x.q))];
        const top = ordered[ordered.length - 1].q;
        return {
          kind: labelled.every((x) => x.l!.kind === 'date') ? 'timeline' : 'bars',
          headline: top.raw,
          caption: sentence,
          points: ordered.map((x) => ({
            label: capitalise(x.l!.label, locale),
            value: x.q.raw,
            magnitude: x.q.value,
            highlight: x.q === top,
          })),
        };
      }
    }
  }

  if (qs.length === 1 && qs[0].unit === 'count' && Number.isInteger(qs[0].value) && qs[0].value >= 2 && qs[0].value <= 40) {
    const q = qs[0];
    return { kind: 'count', headline: q.raw, caption: sentence, points: [{ label: '', value: q.raw, magnitude: q.value, highlight: true }] };
  }
  return null;
}

const MAX_CAPTION = 240;

/**
 * Every figure the article supports, best first: bars and timelines before
 * counts, then in reading order. Pure: the same HTML gives the same plans.
 */
export function extractFigures(html: string, locale: Locale): FigurePlan[] {
  if (!html) return [];
  const $ = cheerio.load(html, null, false);
  const sources = sourcesList($, locale);
  const paragraphs = $('p').toArray();
  const plans: FigurePlan[] = [];

  paragraphs.forEach((p, paragraphIndex) => {
    // Not inside an existing figure, table, quote, aside or the Sources block.
    if ($(p).parents('figure, table, blockquote, aside, section, li').length) return;
    const original = normaliseDigits($(p).text().replace(/\s+/g, ' '));
    const sentences = readParagraph($, p, sources);

    // The citation that covers each sentence: its own, else the next cited one.
    for (let i = 0; i < sentences.length; i++) {
      let j = i;
      while (j < sentences.length && sentences[j].citations.length === 0) j++;
      const cover = sentences[j]?.citations.find((c) => c.official);
      if (!cover) continue;
      const plan = planSentence(sentences[i].text, locale);
      if (!plan) continue;
      // Belt and braces: every printed number is the article's own text.
      const printed = [plan.headline, ...plan.points.map((pt) => pt.value)];
      if (!printed.every((s) => original.includes(normaliseDigits(s)))) continue;
      if (plan.caption.length > MAX_CAPTION) continue;
      plans.push({ ...plan, source: cover.source, paragraphIndex });
    }
  });

  const rank = (k: ChartKind) => (k === 'count' ? 1 : 0);
  return plans.sort((a, b) => rank(a.kind) - rank(b.kind) || a.paragraphIndex - b.paragraphIndex);
}
