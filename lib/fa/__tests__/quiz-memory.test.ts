import { describe, it, expect } from 'vitest';
import { isFresh, echoFor, MAX_AGE_DAYS, type Remembered } from '../quiz-memory';

const NOW = new Date('2026-09-06T12:00:00Z');
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();
const rec = (over: Partial<Remembered> = {}): Remembered => ({
  href: '/europe/finland',
  title: 'ویزای استارتاپ فنلاند',
  at: daysAgo(1),
  ...over,
});

describe('isFresh', () => {
  it('accepts a recommendation from inside the window', () => {
    expect(isFresh(rec({ at: daysAgo(MAX_AGE_DAYS - 1) }), NOW)).toBe(true);
  });

  it('drops one from outside it', () => {
    expect(isFresh(rec({ at: daysAgo(MAX_AGE_DAYS + 1) }), NOW)).toBe(false);
  });

  it('drops a timestamp it cannot parse rather than trusting it', () => {
    expect(isFresh(rec({ at: 'yesterday' }), NOW)).toBe(false);
  });

  it('drops a timestamp from the future, which means a wrong clock', () => {
    expect(isFresh(rec({ at: new Date(NOW.getTime() + 86_400_000).toISOString() }), NOW)).toBe(false);
  });
});

describe('echoFor', () => {
  it('says nothing when nothing was remembered', () => {
    expect(echoFor(null, '/europe/finland', NOW)).toBeNull();
  });

  it('says nothing when what was remembered has gone stale', () => {
    expect(echoFor(rec({ at: daysAgo(MAX_AGE_DAYS + 5) }), '/europe/finland', NOW)).toBeNull();
  });

  it('recognises the guide the reader was pointed at', () => {
    expect(echoFor(rec(), '/europe/finland', NOW)).toEqual({
      kind: 'match',
      title: 'ویزای استارتاپ فنلاند',
      href: '/europe/finland',
    });
  });

  it('offers the way back when the reader is somewhere else', () => {
    const e = echoFor(rec(), '/europe/denmark', NOW);
    expect(e?.kind).toBe('other');
    expect(e?.href).toBe('/europe/finland');
  });
});
