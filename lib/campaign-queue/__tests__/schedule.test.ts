import { describe, it, expect } from 'vitest';
import {
  computeAllowance,
  estimateFinishDay,
  nextSendTime,
  parseSendDays,
  torontoDayStart,
  torontoParts,
  torontoToUtc,
  validateQueueSettings,
  type QueueSchedule,
} from '@/lib/campaign-queue/schedule';

// 18 Nov 2026 is a Wednesday; Toronto is UTC-5 then.
const WED_0900 = new Date('2026-11-18T14:00:00Z');

const schedule = (over: Partial<QueueSchedule> = {}): QueueSchedule => ({
  dailyLimit: 20,
  sendDays: [1, 2, 3, 4],
  windowStart: 9 * 60,
  windowEnd: 17 * 60,
  startAt: new Date('2026-11-01T00:00:00Z'),
  queuedAt: new Date('2026-11-01T00:00:00Z'),
  ...over,
});

describe('Toronto time', () => {
  it('reads the local day, weekday and minute', () => {
    expect(torontoParts(WED_0900)).toMatchObject({ dayKey: '2026-11-18', isoWeekday: 3, minuteOfDay: 540 });
  });

  it('puts 04:59 UTC on the previous Toronto day', () => {
    expect(torontoParts(new Date('2026-11-19T04:59:00Z')).dayKey).toBe('2026-11-18');
    expect(torontoParts(new Date('2026-11-19T05:00:00Z')).dayKey).toBe('2026-11-19');
  });

  it('finds local midnight on both sides of a clock change', () => {
    expect(torontoToUtc(2026, 3, 8, 0).toISOString()).toBe('2026-03-08T05:00:00.000Z');
    expect(torontoToUtc(2026, 3, 9, 0).toISOString()).toBe('2026-03-09T04:00:00.000Z');
    expect(torontoDayStart(new Date('2026-03-09T12:00:00Z')).toISOString()).toBe('2026-03-09T04:00:00.000Z');
  });
});

describe('computeAllowance', () => {
  it('is zero outside the window, on off days and before the start', () => {
    expect(computeAllowance(schedule(), new Date('2026-11-18T13:45:00Z'), 0)).toBe(0);
    expect(computeAllowance(schedule(), new Date('2026-11-18T22:00:00Z'), 0)).toBe(0);
    expect(computeAllowance(schedule(), new Date('2026-11-20T15:00:00Z'), 0)).toBe(0); // Friday
    expect(computeAllowance(schedule({ startAt: new Date('2026-11-19T00:00:00Z') }), WED_0900, 0)).toBe(0);
  });

  it('spreads the day over the window and reaches the limit exactly', () => {
    let sent = 0;
    let biggest = 0;
    for (let i = 0; i < 32; i++) {
      const n = computeAllowance(schedule(), new Date(WED_0900.getTime() + i * 15 * 60_000), sent);
      biggest = Math.max(biggest, n);
      sent += n;
    }
    expect(sent).toBe(20);
    expect(biggest).toBeLessThanOrEqual(2);
  });

  it('does not burst when queued in the middle of the window', () => {
    const queuedAt = new Date('2026-11-18T19:00:00Z'); // 14:00 Toronto
    expect(computeAllowance(schedule({ queuedAt }), queuedAt, 0)).toBeLessThanOrEqual(2);
  });

  it('caps a catch-up after missed ticks', () => {
    expect(computeAllowance(schedule(), new Date('2026-11-18T21:00:00Z'), 0)).toBeLessThanOrEqual(2);
  });

  it('never exceeds what is left of the limit', () => {
    expect(computeAllowance(schedule(), new Date('2026-11-18T21:45:00Z'), 20)).toBe(0);
    expect(computeAllowance(schedule(), new Date('2026-11-18T21:45:00Z'), 19)).toBe(1);
  });
});

describe('planning', () => {
  it('finds the next send, skipping off days', () => {
    // Thursday 17:00 Toronto: window closed, Fri-Sun off, so Monday 09:00.
    const next = nextSendTime(schedule(), new Date('2026-11-19T22:00:00Z'), 0);
    expect(next?.toISOString()).toBe('2026-11-23T14:00:00.000Z');
  });

  it('estimates the finish day from the send days', () => {
    // 45 at 20 a day from Wed morning: Wed 20, Thu 20, Mon 5.
    expect(estimateFinishDay(schedule(), 45, WED_0900, 0)).toBe('2026-11-23');
    expect(estimateFinishDay(schedule(), 0, WED_0900, 0)).toBeNull();
  });

  it('counts what was already sent today', () => {
    expect(estimateFinishDay(schedule(), 20, WED_0900, 15)).toBe('2026-11-19');
  });

  it('parses stored send days and rejects junk', () => {
    expect(parseSendDays('1,2,3,4')).toEqual([1, 2, 3, 4]);
    expect(parseSendDays('0,9,x')).toEqual([]);
    expect(parseSendDays(null)).toEqual([]);
  });
});

describe('validateQueueSettings', () => {
  const base = { dailyLimit: 20, sendDays: [1, 2, 3, 4], windowStart: '09:00', windowEnd: '17:00' };
  const check = (input: unknown) => validateQueueSettings(input, { now: WED_0900, ceiling: 1000 });

  it('requires a daily limit: there is no default', () => {
    expect(check({ ...base, dailyLimit: undefined }).ok).toBe(false);
    expect(check({ ...base, dailyLimit: 0 }).ok).toBe(false);
    expect(check({ ...base, dailyLimit: 2.5 }).ok).toBe(false);
  });

  it('refuses a limit over the global ceiling', () => {
    expect(validateQueueSettings(base, { now: WED_0900, ceiling: 10 }).ok).toBe(false);
  });

  it('warns above 50 a day', () => {
    const quiet = check(base);
    const loud = check({ ...base, dailyLimit: 51 });
    expect(quiet.ok && quiet.highVolume).toBe(false);
    expect(loud.ok && loud.highVolume).toBe(true);
  });

  it('rejects empty days and a backwards or half-set window', () => {
    expect(check({ ...base, sendDays: [] }).ok).toBe(false);
    expect(check({ ...base, sendDays: [8] }).ok).toBe(false);
    expect(check({ ...base, windowStart: '17:00', windowEnd: '09:00' }).ok).toBe(false);
    expect(check({ ...base, windowEnd: null }).ok).toBe(false);
  });

  it('reads the start date in Toronto, whatever the server zone', () => {
    const r = check({ ...base, startDate: '2026-11-23', startTime: '10:30' });
    expect(r.ok && r.settings.startAt.toISOString()).toBe('2026-11-23T15:30:00.000Z');
  });

  it('starts now when no start date is given', () => {
    const r = check(base);
    expect(r.ok && r.settings.startAt.getTime()).toBe(WED_0900.getTime());
  });
});
