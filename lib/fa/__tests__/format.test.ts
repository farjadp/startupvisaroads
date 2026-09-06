import { describe, it, expect } from 'vitest';
import { toPersianDigits, faDate, isoDate, splitNumerals, formatNumeral, toLatinDigits } from '../format';

describe('toPersianDigits', () => {
  it('converts Latin digits', () => {
    expect(toPersianDigits('1405')).toBe('۱۴۰۵');
    expect(toPersianDigits(42)).toBe('۴۲');
  });

  it('leaves non-digit characters untouched', () => {
    expect(toPersianDigits('EB-2 NIW')).toBe('EB-۲ NIW');
    expect(toPersianDigits('سلام')).toBe('سلام');
  });
});

describe('faDate', () => {
  it('renders a Jalali date with Persian digits and a Persian month name', () => {
    const out = faDate('2026-09-05T00:00:00Z');
    expect(out).toContain('شهریور');
    expect(out).toMatch(/^[۰-۹]/);
    expect(out).not.toMatch(/[0-9]/);
  });

  it('accepts a Date as well as a string', () => {
    expect(faDate(new Date('2026-09-05T00:00:00Z'))).toBe(faDate('2026-09-05T00:00:00Z'));
  });
});

describe('isoDate', () => {
  it('returns a machine-readable Gregorian date', () => {
    expect(isoDate('2026-09-05T12:34:56Z')).toBe('2026-09-05');
  });
});

describe('splitNumerals', () => {
  it('leaves the words alone and marks only the numerals', () => {
    expect(splitNumerals('۳ تا ۵ ماه')).toEqual([
      { text: '۳', value: 3, group: undefined },
      { text: ' تا ' },
      { text: '۵', value: 5, group: undefined },
      { text: ' ماه' },
    ]);
  });

  it('keeps a grouped amount as one number and remembers the separator', () => {
    const [first] = splitNumerals('حدود ۱۵۳٬۷۰۰ کرون دانمارک').filter((t) => t.value !== undefined);
    expect(first.value).toBe(153700);
    expect(first.group).toBe('٬');
  });

  it('returns a single literal token when there is nothing to count', () => {
    expect(splitNumerals('ندارد')).toEqual([{ text: 'ندارد' }]);
  });

  it('handles Latin digits, which programme codes use', () => {
    const t = splitNumerals('EB-2 NIW');
    expect(t.filter((x) => x.value !== undefined).map((x) => x.value)).toEqual([2]);
  });
});

describe('formatNumeral', () => {
  it('regroups with the author\'s separator and Persian digits', () => {
    expect(formatNumeral(153700, '٬')).toBe('۱۵۳٬۷۰۰');
  });

  it('omits grouping when the author did not group', () => {
    expect(formatNumeral(5)).toBe('۵');
  });

  it('rounds, so a mid-animation value never shows a fraction', () => {
    expect(formatNumeral(4.7)).toBe('۵');
  });
});

describe('toLatinDigits', () => {
  it('is the inverse of toPersianDigits', () => {
    expect(toLatinDigits('۱۴۰۵')).toBe('1405');
  });
});
