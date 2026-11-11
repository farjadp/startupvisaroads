import { describe, expect, it } from 'vitest';
import * as cheerio from 'cheerio';
import { extractFigures, isOfficialInlineCitation } from '../extract';
import { findQuantities, normaliseDigits } from '../numbers';
import { EN_COHORTS, EN_JOBS, EN_LEVELS, EN_UNCITED, FA_LEVELS, autopilotBody } from './fixtures';

const OFFICIAL = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html';
const PRESS = 'https://www.cicnews.com/2026/10/canada-is-updating-its-immigration-system.html';

describe('no figure without an official citation', () => {
  it('draws nothing from figures that cite nothing', () => {
    expect(extractFigures(EN_UNCITED, 'en')).toEqual([]);
  });

  it('draws nothing once the citation is taken away', () => {
    const uncited = FA_LEVELS.replace(/\s*\(بودجه[^)]*\)/, '');
    expect(uncited).not.toContain('بودجه ۲۰۲۶،');
    expect(extractFigures(uncited, 'fa')).toEqual([]);
  });

  it('draws nothing when the inline citation is press, not an authority', () => {
    const press = EN_LEVELS.replace('(Budget 2026, Chart 3.1, IRCC data to 31 August 2026)', '(CIC News, 6 Nov 2026)');
    expect(extractFigures(press, 'en')).toEqual([]);
  });

  it('draws nothing when the Sources entry links to a news site', () => {
    expect(extractFigures(autopilotBody(PRESS), 'en')).toEqual([]);
  });

  it('draws nothing from a [n] marker that names no Sources entry', () => {
    const orphan = autopilotBody(OFFICIAL).replace(/<li id="src-1">.*?<\/li>/, '');
    expect(extractFigures(orphan, 'en')).toEqual([]);
  });

  it('accepts authorities by name and the federal budget by year, refuses the rest', () => {
    expect(isOfficialInlineCitation('IRCC, measures page, 5 Nov 2026')).toBe(true);
    expect(isOfficialInlineCitation('IRCC، اطلاعات تکمیلی، ۵ نوامبر ۲۰۲۶')).toBe(true);
    expect(isOfficialInlineCitation('Department of Finance, Budget 2026, 5 Nov 2026')).toBe(true);
    expect(isOfficialInlineCitation('بودجه ۲۰۲۶، فصل ۳')).toBe(true);
    expect(isOfficialInlineCitation('CIC News, 4 Nov 2026')).toBe(false);
    expect(isOfficialInlineCitation('Reuters, 5 Nov 2026')).toBe(false);
    expect(isOfficialInlineCitation('IRCC')).toBe(false); // no date: not a citation
    expect(isOfficialInlineCitation('IRCCwatch blog, 5 Nov 2026')).toBe(false);
  });
});

describe('extraction from real articles', () => {
  it('fa levels plan: temporary arrivals by year against the new target, Persian digits as written', () => {
    const [first, second] = extractFigures(FA_LEVELS, 'fa');
    expect(first).toMatchObject({
      kind: 'bars',
      headline: '۳۷۰ هزار',
      source: 'بودجه ۲۰۲۶، نمودار ۳٫۱، داده IRCC تا ۳۱ اوت ۲۰۲۶',
      paragraphIndex: 0,
      caption: 'ورود موقت جدید در ۲۰۲۳ برابر ۹۷۱٬۸۱۵ و در ۲۰۲۴ برابر ۶۸۶٬۰۱۰ نفر بود؛ هدف سالانه جدید ۳۷۰ هزار است.',
    });
    expect(first.points.map((p) => [p.label, p.value, p.highlight])).toEqual([
      ['۲۰۲۳', '۹۷۱٬۸۱۵', false],
      ['۲۰۲۴', '۶۸۶٬۰۱۰ نفر', false],
      ['هدف سالانه جدید', '۳۷۰ هزار', true],
    ]);
    // The uncited sentence before the citation is covered by it, and so is the cited one.
    expect(second.headline).toBe('۳۸۰ هزار');
  });

  it('en twin gives the same figure in English', () => {
    const [first] = extractFigures(EN_LEVELS, 'en');
    expect(first.headline).toBe('370,000');
    expect(first.points.map((p) => p.label)).toEqual(['2023', '2024', 'New annual target']);
    expect(first.points.map((p) => p.magnitude)).toEqual([971815, 686010, 370000]);
  });

  it('autopilot markup: "up from" puts the earlier value first and highlights the new one', () => {
    const [plan] = extractFigures(autopilotBody(OFFICIAL), 'en');
    expect(plan).toMatchObject({ kind: 'bars', headline: '34 months', paragraphIndex: 0, source: 'Proof of citizenship: processing times, 2026-10-19' });
    expect(plan.caption).toBe('The wait for new files reached 34 months by October 2026, up from only five months before the new law.');
    expect(plan.points.map((p) => [p.label, p.value, p.highlight])).toEqual([
      ['Before the new law', 'five months', false],
      ['October 2026', '34 months', true],
    ]);
  });

  it('never puts two different measures side by side', () => {
    expect(extractFigures(EN_JOBS, 'en')).toEqual([]); // job openings vs trades workers
    expect(extractFigures(EN_COHORTS, 'en')).toEqual([]); // protected persons vs work-permit holders
  });

  it('every printed number is the article’s own text, never rounded or reformatted', () => {
    for (const [html, locale] of [[FA_LEVELS, 'fa'], [EN_LEVELS, 'en'], [autopilotBody(OFFICIAL), 'en']] as const) {
      const prose = cheerio.load(html, null, false)('p').text();
      for (const plan of extractFigures(html, locale)) {
        for (const s of [plan.headline, ...plan.points.map((p) => p.value)]) expect(prose).toContain(s);
        // Labels may only gain a capital first letter.
        for (const p of plan.points) expect(prose.toLowerCase()).toContain(p.label.toLowerCase());
      }
    }
  });

  it('skips paragraphs inside figures, tables, quotes and the Sources block', () => {
    expect(extractFigures(`<blockquote>${EN_LEVELS}</blockquote>`, 'en')).toEqual([]);
    expect(extractFigures(`<section>${EN_LEVELS}</section>`, 'en')).toEqual([]);
  });
});

describe('what counts as a quantity', () => {
  it('ignores dates, years, year ranges, bill numbers and citation markers', () => {
    expect(findQuantities('On 5 November 2026, for 2027–2029 and 2027-28, Bill C-3 [8] took effect on November 4, 2026.')).toEqual([]);
    expect(findQuantities('روز ۵ نوامبر ۲۰۲۶ (۱۴ آبان ۱۴۰۵) برنامه ۲۰۲۷ تا ۲۰۲۹ منتشر شد.')).toEqual([]);
  });

  it('keeps the exact characters, including "up to", multipliers and units', () => {
    const qs = findQuantities('Up to 200,000 people, $302.3 million, 64.4% and ۳۷۰ هزار نفر.');
    expect(qs.map((q) => q.raw)).toEqual(['Up to 200,000 people', '$302.3 million', '64.4%', '۳۷۰ هزار نفر']);
    expect(qs.map((q) => q.value)).toEqual([200000, 302300000, 64.4, 370000]);
  });

  it('maps Persian digits one character to one, so positions line up', () => {
    const s = '۹۷۱٬۸۱۵ نفر';
    expect(normaliseDigits(s)).toHaveLength(s.length);
    expect(normaliseDigits(s)).toBe('971,815 نفر');
  });
});
