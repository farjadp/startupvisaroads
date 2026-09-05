import { describe, it, expect } from 'vitest';
import { toPersianDigits, faDate, isoDate } from '../format';

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
