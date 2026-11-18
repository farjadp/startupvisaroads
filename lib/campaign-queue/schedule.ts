// ============================================================================
// lib/campaign-queue/schedule.ts
// When a queued campaign may send, and how much. Pure functions, all in
// America/Toronto, so the same day boundary and clock changes apply whatever
// zone the server runs in.
//
// The worker runs on the 15-minute /api/cron/sources tick. The day's quota is
// released gradually across the send window, so 20 a day means roughly one
// every tick rather than 20 at 09:00.
// ============================================================================

export const QUEUE_TIME_ZONE = 'America/Toronto';
export const TICK_MINUTES = 15;
export const MAX_SENDS_PER_TICK = 25;
export const MAX_DAILY_LIMIT = 500;
export const HIGH_VOLUME_THRESHOLD = 50;
export const DEFAULT_SEND_DAYS = [1, 2, 3, 4];

const MINUTES_PER_DAY = 1440;
const MIN_WINDOW_MINUTES = 30;
const TICK_MS = TICK_MINUTES * 60_000;

export interface QueueSchedule {
  dailyLimit: number;
  sendDays: number[]; // ISO weekdays, Monday = 1
  windowStart: number | null; // minutes after local midnight
  windowEnd: number | null;
  startAt: Date;
  queuedAt: Date;
}

export interface TorontoParts {
  year: number;
  month: number;
  day: number;
  dayKey: string; // YYYY-MM-DD
  isoWeekday: number;
  minuteOfDay: number;
}

const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: QUEUE_TIME_ZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  weekday: 'short',
});

const WEEKDAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

function rawParts(date: Date) {
  const out: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) out[part.type] = part.value;
  return out;
}

export function torontoParts(date: Date): TorontoParts {
  const p = rawParts(date);
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    dayKey: `${p.year}-${p.month}-${p.day}`,
    isoWeekday: WEEKDAYS[p.weekday],
    minuteOfDay: Number(p.hour) * 60 + Number(p.minute),
  };
}

/** How far Toronto's wall clock is from UTC at this instant, in ms. */
function offsetAt(ms: number): number {
  const p = rawParts(new Date(ms));
  const wall = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
  return wall - Math.floor(ms / 1000) * 1000;
}

/** The instant of a Toronto wall-clock time. Day values may overflow the month. */
export function torontoToUtc(year: number, month: number, day: number, minuteOfDay: number): Date {
  const guess = Date.UTC(year, month - 1, day, 0, minuteOfDay);
  const first = guess - offsetAt(guess);
  return new Date(guess - offsetAt(first));
}

export function torontoDayStart(date: Date): Date {
  const p = torontoParts(date);
  return torontoToUtc(p.year, p.month, p.day, 0);
}

export function parseSendDays(value: string | null | undefined): number[] {
  if (!value) return [];
  const days = value.split(',').map(Number).filter((d) => Number.isInteger(d) && d >= 1 && d <= 7);
  return [...new Set(days)].sort((a, b) => a - b);
}

/**
 * How many sends this tick may make. `attemptedToday` is every attempt this
 * Toronto day, including failed and unconfirmed ones.
 */
export function computeAllowance(s: QueueSchedule, now: Date, attemptedToday: number): number {
  if (now < s.startAt) return 0;
  const p = torontoParts(now);
  if (!s.sendDays.includes(p.isoWeekday)) return 0;

  const windowStart = s.windowStart ?? 0;
  const windowEnd = s.windowEnd ?? MINUTES_PER_DAY;
  if (p.minuteOfDay < windowStart || p.minuteOfDay >= windowEnd) return 0;

  // Queued or resumed part-way through the window: spread over what is left,
  // rather than releasing everything the morning would have sent.
  let from = windowStart;
  for (const moment of [s.startAt, s.queuedAt]) {
    const m = torontoParts(moment);
    if (m.dayKey === p.dayKey) from = Math.max(from, m.minuteOfDay);
  }
  from = Math.min(from, p.minuteOfDay);

  const span = Math.max(1, windowEnd - from);
  const fraction = Math.min(1, (p.minuteOfDay - from + TICK_MINUTES) / span);
  const target = Math.min(s.dailyLimit, Math.ceil(s.dailyLimit * fraction));
  const due = target - attemptedToday;
  if (due <= 0) return 0;

  // After an outage the target runs ahead; catch up gently, not in one burst.
  const ticks = Math.max(1, Math.ceil(span / TICK_MINUTES));
  const perTick = Math.min(MAX_SENDS_PER_TICK, Math.max(2, 2 * Math.ceil(s.dailyLimit / ticks)));
  return Math.min(due, perTick);
}

/** The next quarter-hour tick that would send something. */
export function nextSendTime(s: QueueSchedule, now: Date, attemptedToday: number): Date | null {
  const today = torontoParts(now).dayKey;
  let t = Math.ceil(Math.max(now.getTime(), s.startAt.getTime()) / TICK_MS) * TICK_MS;
  for (let i = 0; i < 96 * 15; i++, t += TICK_MS) {
    const at = new Date(t);
    const attempted = torontoParts(at).dayKey === today ? attemptedToday : 0;
    if (computeAllowance(s, at, attempted) > 0) return at;
  }
  return null;
}

/** The Toronto day (YYYY-MM-DD) the last send should happen on. */
export function estimateFinishDay(s: QueueSchedule, remaining: number, now: Date, attemptedToday: number): string | null {
  if (remaining <= 0 || s.dailyLimit < 1 || s.sendDays.length === 0) return null;
  const from = new Date(Math.max(now.getTime(), s.startAt.getTime()));
  const base = torontoParts(from);
  const today = torontoParts(now).dayKey;
  const windowEnd = s.windowEnd ?? MINUTES_PER_DAY;
  let left = remaining;

  for (let i = 0; i < 3660; i++) {
    const day = torontoParts(torontoToUtc(base.year, base.month, base.day + i, 720));
    if (!s.sendDays.includes(day.isoWeekday)) continue;
    if (i === 0 && base.minuteOfDay >= windowEnd) continue;
    left -= Math.max(0, s.dailyLimit - (day.dayKey === today ? attemptedToday : 0));
    if (left <= 0) return day.dayKey;
  }
  return null;
}

export function minutesToClock(minutes: number | null | undefined): string | null {
  if (minutes === null || minutes === undefined) return null;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function clockToMinutes(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

const isBlank = (v: unknown) => v === null || v === undefined || v === '';

export interface QueueSettings {
  dailyLimit: number;
  sendDays: number[];
  windowStart: number | null;
  windowEnd: number | null;
  startAt: Date;
}

export type QueueSettingsResult =
  | { ok: true; settings: QueueSettings; highVolume: boolean }
  | { ok: false; error: string };

/** Checks what the admin form sent. There is deliberately no default limit. */
export function validateQueueSettings(input: unknown, opts: { now: Date; ceiling: number }): QueueSettingsResult {
  const v = (input ?? {}) as Record<string, unknown>;
  const fail = (error: string): QueueSettingsResult => ({ ok: false, error });

  const dailyLimit = v.dailyLimit;
  if (typeof dailyLimit !== 'number' || !Number.isInteger(dailyLimit) || dailyLimit < 1) {
    return fail('Set a daily limit: a whole number of at least 1.');
  }
  if (dailyLimit > MAX_DAILY_LIMIT) return fail(`The daily limit cannot be above ${MAX_DAILY_LIMIT}.`);
  if (dailyLimit > opts.ceiling) return fail(`The daily limit is above the global ceiling of ${opts.ceiling} a day.`);

  if (!Array.isArray(v.sendDays) || v.sendDays.length === 0) return fail('Choose at least one send day.');
  if (!v.sendDays.every((d) => Number.isInteger(d) && d >= 1 && d <= 7)) return fail('Send days are not valid.');
  const sendDays = [...new Set(v.sendDays as number[])].sort((a, b) => a - b);

  let windowStart: number | null = null;
  let windowEnd: number | null = null;
  if (!isBlank(v.windowStart) || !isBlank(v.windowEnd)) {
    windowStart = clockToMinutes(v.windowStart);
    windowEnd = clockToMinutes(v.windowEnd);
    if (windowStart === null || windowEnd === null) return fail('Give both ends of the send window as HH:MM.');
    if (windowEnd - windowStart < MIN_WINDOW_MINUTES) {
      return fail(`The send window must run forward and last at least ${MIN_WINDOW_MINUTES} minutes.`);
    }
  }

  let startAt = opts.now;
  if (!isBlank(v.startDate)) {
    const m = typeof v.startDate === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.startDate) : null;
    const minute = isBlank(v.startTime) ? 0 : clockToMinutes(v.startTime);
    if (!m || minute === null) return fail('The start date or time is not valid.');
    const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const check = new Date(Date.UTC(year, month - 1, day));
    if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return fail('The start date is not valid.');
    const chosen = torontoToUtc(year, month, day, minute);
    if (chosen > opts.now) startAt = chosen;
  }

  return {
    ok: true,
    settings: { dailyLimit, sendDays, windowStart, windowEnd, startAt },
    highVolume: dailyLimit > HIGH_VOLUME_THRESHOLD,
  };
}
