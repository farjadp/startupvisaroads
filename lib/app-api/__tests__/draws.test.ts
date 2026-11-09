import { describe, it, expect } from 'vitest';
import { parseIrccNumber, parseIrccRounds, IRCC_ROUNDS_URL } from '@/lib/app-api/draws';

const round = (over: Record<string, unknown> = {}) => ({
  drawNumber: '453',
  drawDate: '2026-10-28',
  drawName: 'Transport Occupations, 2026-Version 2',
  drawSize: '150',
  drawCRS: '477',
  drawText2: 'Federal Skilled Worker Program, Canadian Experience Class and Federal Skilled Trades Program',
  ...over,
});

describe('parseIrccNumber', () => {
  it('reads plain and thousands-separated strings', () => {
    expect(parseIrccNumber('489')).toBe(489);
    expect(parseIrccNumber('1,000')).toBe(1000);
    expect(parseIrccNumber(' 20,535 ')).toBe(20535);
    expect(parseIrccNumber(5000)).toBe(5000);
  });

  it('returns null for anything that is not a number', () => {
    expect(parseIrccNumber('')).toBeNull();
    expect(parseIrccNumber('n/a')).toBeNull();
    expect(parseIrccNumber(undefined)).toBeNull();
    expect(parseIrccNumber(null)).toBeNull();
  });
});

describe('parseIrccRounds', () => {
  it('maps the IRCC fields to the app shape', () => {
    const [r] = parseIrccRounds({ rounds: [round()] });
    expect(r).toEqual({
      drawNumber: 453,
      date: '2026-10-28',
      roundType: 'Transport Occupations, 2026-Version 2',
      program: 'Federal Skilled Worker Program, Canadian Experience Class and Federal Skilled Trades Program',
      crsCutoff: 477,
      invitations: 150,
    });
  });

  it('returns the newest 10 by date, newest first', () => {
    const rounds = Array.from({ length: 14 }, (_, i) =>
      round({ drawNumber: String(400 + i), drawDate: `2026-01-${String(i + 1).padStart(2, '0')}` }),
    );
    const out = parseIrccRounds({ rounds });
    expect(out).toHaveLength(10);
    expect(out[0].date).toBe('2026-01-14');
    expect(out[9].date).toBe('2026-01-05');
  });

  it('drops rounds with an unparseable date, cut-off or size instead of inventing values', () => {
    const out = parseIrccRounds({
      rounds: [round(), round({ drawNumber: '1', drawDate: 'soon' }), round({ drawNumber: '2', drawCRS: '' }), round({ drawNumber: '3', drawSize: 'tbd' })],
    });
    expect(out.map((r) => r.drawNumber)).toEqual([453]);
  });

  it('throws on a payload without a rounds array', () => {
    expect(() => parseIrccRounds({})).toThrow();
    expect(() => parseIrccRounds(null)).toThrow();
    expect(() => parseIrccRounds({ rounds: 'x' })).toThrow();
  });

  it('points at the IRCC JSON', () => {
    expect(IRCC_ROUNDS_URL).toBe('https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json');
  });
});
