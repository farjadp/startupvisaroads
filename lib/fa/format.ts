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
