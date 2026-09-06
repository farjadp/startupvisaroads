// ============================================================================
// lib/fa/format.ts
// Persian presentation of numbers and dates.
//
// Persian digits are for prose. Programme codes (EB-2), currency amounts and
// phone numbers stay Latin — callers decide, this module only converts what
// it is handed. Machine-readable dates stay Gregorian ISO: Jalali belongs in
// the visible text, never in <time datetime> or JSON-LD.
// ============================================================================

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** `1405` -> `۱۴۰۵`. Non-digit characters pass through unchanged. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

const JALALI = new Intl.DateTimeFormat('fa-IR', {
  calendar: 'persian',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** `2026-09-05` -> `۱۵ شهریور ۱۴۰۵`. For display only. */
export function faDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return JALALI.format(d);
}

/** `2026-09-05` — for <time datetime> and JSON-LD, never for display in fa. */
export function isoDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

/**
 * One piece of a string as far as a counter is concerned: either literal text
 * or a number to animate. Facts are written as Persian prose — «حدود ۱۵۳٬۷۰۰
 * کرون دانمارک», «۳ تا ۵ ماه» — so a counter cannot treat the value as a
 * number. It has to find the numerals inside the sentence and leave the words
 * alone.
 */
export type NumeralToken = {
  text: string;
  /** Present only for numeric tokens. */
  value?: number;
  /** The grouping separator the author used, so the count-up reads the same. */
  group?: string;
};

const NUMERAL_RUN = /[۰-۹0-9]+(?:[٬,،][۰-۹0-9]{3})*/g;

/** `۳ تا ۵ ماه` -> [{۳,3}, {' تا '}, {۵,5}, {' ماه'}] */
export function splitNumerals(input: string): NumeralToken[] {
  const out: NumeralToken[] = [];
  let last = 0;
  for (const m of input.matchAll(NUMERAL_RUN)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: input.slice(last, at) });
    const group = /[٬,،]/.exec(m[0])?.[0];
    out.push({ text: m[0], value: Number(toLatinDigits(m[0]).replace(/[٬,،]/g, '')), group });
    last = at + m[0].length;
  }
  if (last < input.length) out.push({ text: input.slice(last) });
  return out;
}

/** `۱۴۰۵` -> `1405`. The inverse of toPersianDigits, for parsing. */
export function toLatinDigits(input: string): string {
  return input.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
}

/** Render a number the way the author grouped it, in Persian digits. */
export function formatNumeral(value: number, group?: string): string {
  const s = String(Math.round(value));
  return toPersianDigits(group ? s.replace(/\B(?=(\d{3})+(?!\d))/g, group) : s);
}
