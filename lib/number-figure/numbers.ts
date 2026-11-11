// ============================================================================
// Quantities in English and Persian prose.
// ----------------------------------------------------------------------------
// A quantity keeps the exact characters the article used (`raw`), so a figure
// can only ever show what the article already says. `value` is used for the
// geometry of the chart and nowhere else: it is never printed.
//
// Persian digits, the Arabic thousands separator ٬ and the decimal separator ٫
// are mapped one character to one character before matching, so an index in
// the normalised text is the same index in the original.
// ============================================================================

export type Locale = 'en' | 'fa';

export type UnitGroup = 'count' | 'percent' | 'month' | 'week' | 'day' | 'year' | `money:${string}`;

export type Quantity = {
  /** Exact text from the article, prefix ("up to") included. */
  raw: string;
  /** The number without its prefix, exactly as written. */
  rawNumber: string;
  value: number;
  unit: UnitGroup;
  /** Start and end in the sentence. */
  start: number;
  end: number;
  upTo: boolean;
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** One character in, one character out: indices survive. */
export function normaliseDigits(text: string): string {
  let out = '';
  for (const ch of text) {
    const fa = FA_DIGITS.indexOf(ch);
    const ar = AR_DIGITS.indexOf(ch);
    if (fa >= 0) out += String(fa);
    else if (ar >= 0) out += String(ar);
    else if (ch === '٬') out += ',';
    else if (ch === '٫') out += '.';
    else out += ch;
  }
  return out;
}

export function toPersianDigits(text: string): string {
  return text.replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

const EN_MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';
const FA_MONTHS = 'ژانویه|فوریه|مارس|آوریل|مه|می|ژوئن|ژوئیه|ژوئیهٔ|اوت|سپتامبر|اکتبر|نوامبر|دسامبر|فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند';

const MULTIPLIER: Record<string, number> = { thousand: 1e3, million: 1e6, billion: 1e9, 'هزار': 1e3, 'میلیون': 1e6, 'میلیارد': 1e9 };

const UNIT_GROUP: Record<string, UnitGroup> = {
  '%': 'percent', percent: 'percent', 'per cent': 'percent', 'درصد': 'percent',
  month: 'month', months: 'month', 'ماه': 'month',
  week: 'week', weeks: 'week', 'هفته': 'week',
  day: 'day', days: 'day', 'روز': 'day',
  year: 'year', years: 'year', 'سال': 'year',
  people: 'count', person: 'count', persons: 'count', applicants: 'count', applicant: 'count', admissions: 'count',
  invitations: 'count', candidates: 'count', spaces: 'count', places: 'count', workers: 'count', 'نفر': 'count',
  euro: 'money:EUR', euros: 'money:EUR', 'یورو': 'money:EUR', dollar: 'money:USD', dollars: 'money:USD', 'دلار': 'money:USD',
};

const CURRENCY: Record<string, UnitGroup> = { $: 'money:USD', 'C$': 'money:CAD', CAD: 'money:CAD', '€': 'money:EUR', '£': 'money:GBP' };

const WORD_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
};

// Not a lookbehind-free \b: Persian letters are not \w, so the guards are spelled out.
const LETTER = 'A-Za-z\\u0600-\\u06FF';
const QUANTITY = new RegExp(
  `(?<![${LETTER}\\d.,])` +
    `(?<prefix>up to\\s+|تا\\s+)?` +
    `(?<cur>C\\$|CAD\\s?\\$?|[$€£])?\\s?` +
    `(?<num>\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?|\\d+(?:\\.\\d+)?)` +
    `(?<mult>\\s?(?:thousand|million|billion|هزار|میلیون|میلیارد))?` +
    `(?<unit>\\s?(?:%|per cent|percent|درصد|months?|weeks?|days?|years?|ماه|هفته|روز|سال|people|persons?|applicants?|admissions|invitations|candidates|spaces|places|workers|نفر|euros?|dollars?|یورو|دلار))?` +
    `(?![${LETTER}\\d])`,
  'gi',
);

const WORD_QUANTITY = new RegExp(
  `(?<![${LETTER}])(?<prefix>up to\\s+)?(?<num>${Object.keys(WORD_NUMBERS).join('|')})\\s(?<unit>months?|weeks?|days?|years?)(?![${LETTER}])`,
  'gi',
);

const MONTH_BEFORE = new RegExp(`(?:${EN_MONTHS}|${FA_MONTHS})\\.?\\s*$`, 'i');
const MONTH_AFTER = new RegExp(`^\\s*(?:${EN_MONTHS}|${FA_MONTHS})(?![${LETTER}])`, 'i');

function isYear(num: string): boolean {
  return /^\d{4}$/.test(num) && Number(num) >= 1900 && Number(num) <= 2100;
}

/**
 * Every quantity that makes a factual claim in one sentence. Dates, years,
 * citation numbers and small bare numbers ("Bill C-3", "CLB 5") are not.
 */
export function findQuantities(sentence: string): Quantity[] {
  const norm = normaliseDigits(sentence);
  const found: Quantity[] = [];

  for (const m of norm.matchAll(QUANTITY)) {
    const g = m.groups!;
    const start = m.index!;
    const end = start + m[0].length;
    const hasMult = Boolean(g.mult);
    const unitKey = g.unit?.trim().toLowerCase();
    const cur = g.cur?.replace(/\s/g, '').replace(/\$$/, '$');
    const numStart = start + m[0].indexOf(g.num);
    const before = norm.slice(Math.max(0, numStart - 14), numStart);
    const after = norm.slice(numStart + g.num.length);

    // Dates: "5 November 2026", "November 5", "۵ نوامبر".
    if (!hasMult && !unitKey && MONTH_AFTER.test(after)) continue;
    if (MONTH_BEFORE.test(before) && !hasMult && !unitKey && !cur) continue;
    // A bare year, a citation marker or a range like 2027-28.
    if (!cur && !hasMult && !unitKey && isYear(g.num)) continue;
    if (norm[start - 1] === '[' || norm[start - 1] === '-' || norm[start - 1] === '–') continue;
    if (!cur && !hasMult && !unitKey && !g.num.includes(',') && Number(g.num) < 1000) continue;
    // Persian "تا" is "until" as often as "up to": only with a size behind it.
    const upTo = Boolean(g.prefix) && (/up to/i.test(g.prefix!) || hasMult || Boolean(unitKey));
    const prefixLen = g.prefix && !upTo ? g.prefix.length : 0;

    let unit: UnitGroup = 'count';
    if (cur) unit = CURRENCY[cur] ?? CURRENCY[cur.replace('$', '')] ?? 'money:USD';
    else if (unitKey) unit = UNIT_GROUP[unitKey] ?? 'count';

    const value = Number(g.num.replace(/,/g, '')) * (hasMult ? MULTIPLIER[g.mult!.trim().toLowerCase()] ?? 1 : 1);
    const s = start + prefixLen;
    const raw = sentence.slice(s, end).trim();
    found.push({
      raw,
      rawNumber: sentence.slice(numStart, numStart + g.num.length + (hasMult ? g.mult!.length : 0)).trim(),
      value,
      unit,
      start: s,
      end,
      upTo,
    });
  }

  for (const m of norm.matchAll(WORD_QUANTITY)) {
    const g = m.groups!;
    const start = m.index!;
    const end = start + m[0].length;
    if (found.some((q) => start < q.end && end > q.start)) continue;
    const unit = UNIT_GROUP[g.unit.toLowerCase()] ?? 'count';
    const numStart = start + m[0].indexOf(g.num);
    found.push({
      raw: sentence.slice(start, end),
      rawNumber: sentence.slice(numStart, numStart + g.num.length),
      value: WORD_NUMBERS[g.num.toLowerCase()],
      unit,
      start,
      end,
      upTo: Boolean(g.prefix),
    });
  }

  return found.sort((a, b) => a.start - b.start);
}

/** "October 2026", "May 2026", "2023", "۵ نوامبر ۲۰۲۶" — exact text, or null. */
export function findDate(text: string): string | null {
  const norm = normaliseDigits(text);
  const re = new RegExp(
    `(?:(?:\\d{1,2}\\s+)?(?:${EN_MONTHS}|${FA_MONTHS})\\.?\\s+(?:\\d{1,2},?\\s+)?)?(?<![\\d,])(?:19|20)\\d{2}(?![\\d%]|,\\d)`,
    'i',
  );
  const m = re.exec(norm);
  return m ? text.slice(m.index, m.index + m[0].length).trim() : null;
}

export const MONTH_PATTERN = { en: EN_MONTHS, fa: FA_MONTHS };
