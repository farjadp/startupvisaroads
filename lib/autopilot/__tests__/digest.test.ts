import { describe, it, expect } from 'vitest';
import { summarise, buildDigest, summariseSocial, type RunRow, type SocialRow } from '../digest';

const NOW = new Date('2026-09-06T18:00:00Z');
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3_600_000);

const run = (over: Partial<RunRow> = {}): RunRow => ({
  locale: 'en',
  mode: 'planned',
  startedAt: hoursAgo(3),
  finishedAt: hoursAgo(3),
  created: 1,
  errors: null,
  skipped: null,
  notes: null,
  ...over,
});

const lane = (out: ReturnType<typeof summarise>, locale: string) => out.find((l) => l.locale === locale)!;

describe('summarise', () => {
  it('calls a lane with no runs in the window silent', () => {
    expect(lane(summarise([], NOW), 'en').state).toBe('silent');
    expect(lane(summarise([], NOW), 'fa').state).toBe('silent');
  });

  it('ignores runs from outside the window when deciding silence', () => {
    const old = run({ startedAt: hoursAgo(40), finishedAt: hoursAgo(40) });
    expect(lane(summarise([old], NOW), 'en').state).toBe('silent');
  });

  it('calls a lane that ran but created nothing degraded, and says why', () => {
    const runs = [
      run({ created: 0, notes: 'Publication downgraded to DRAFT: no allowlisted official citation survived link enforcement.' }),
      run({ created: 0, notes: 'Publication downgraded to DRAFT: no allowlisted official citation survived link enforcement.' }),
    ];
    const en = lane(summarise(runs, NOW), 'en');
    expect(en.state).toBe('degraded');
    // The same note twice is one reason, not two.
    expect(en.reasons).toHaveLength(1);
    expect(en.reasons[0]).toContain('DRAFT');
  });

  // This is the exact shape of the bug that went unnoticed for six weeks:
  // English kept publishing while Persian was silent, so any check that asks
  // "is the pipeline working" answers yes and misses it.
  it('reports a silent locale even while another locale is healthy', () => {
    const out = summarise([run({ locale: 'en', created: 2 })], NOW);
    expect(lane(out, 'en').state).toBe('healthy');
    expect(lane(out, 'fa').state).toBe('silent');
  });

  it('treats an unfinished run older than the stuck threshold as stuck, not healthy', () => {
    const out = summarise([run({ startedAt: hoursAgo(5), finishedAt: null, created: 0 })], NOW);
    expect(lane(out, 'en').state).toBe('stuck');
  });

  it('does not call a run that is still going stuck', () => {
    const out = summarise([run({ startedAt: new Date(NOW.getTime() - 60_000), finishedAt: null, created: 0 })], NOW);
    expect(lane(out, 'en').state).not.toBe('stuck');
  });

  it('surfaces run errors as reasons', () => {
    const out = summarise([run({ created: 0, errors: JSON.stringify([{ title: 'x', error: 'fal 402 no credit' }]) })], NOW);
    expect(lane(out, 'en').reasons.join(' ')).toContain('fal 402');
  });

  it('survives malformed JSON in errors rather than throwing', () => {
    expect(() => summarise([run({ created: 0, errors: 'not json' })], NOW)).not.toThrow();
  });

  it('totals what each lane actually created', () => {
    const out = summarise([run({ created: 2 }), run({ created: 3 }), run({ locale: 'fa', created: 1 })], NOW);
    expect(lane(out, 'en').created).toBe(5);
    expect(lane(out, 'fa').created).toBe(1);
  });

  it('says "1 hour", not "1 hours"', () => {
    const out = summarise([], NOW, { windowHours: 1 });
    expect(out[0].reasons.join(' ')).toContain('last 1 hour.');
  });

  it('reports every expected locale even when the table is empty', () => {
    expect(summarise([], NOW).map((l) => l.locale).sort()).toEqual(['en', 'fa']);
  });
});

describe('buildDigest', () => {
  it('names the locale that is silent, not just "the pipeline"', () => {
    const msg = buildDigest(summarise([run({ locale: 'en', created: 2 })], NOW), NOW);
    expect(msg).toContain('fa');
    expect(msg.toLowerCase()).toContain('silent');
  });

  it('stays short when everything is healthy, because a daily wall goes unread', () => {
    const runs = [run({ locale: 'en', created: 2 }), run({ locale: 'fa', created: 1 })];
    const msg = buildDigest(summarise(runs, NOW), NOW);
    expect(msg.split('\n').length).toBeLessThanOrEqual(6);
    expect(msg).toContain('3');
  });

  it('spells out the reasons when a lane is degraded', () => {
    const runs = [run({ created: 0, notes: 'no allowlisted official citation survived' })];
    const msg = buildDigest(summarise(runs, NOW), NOW);
    expect(msg).toContain('official citation');
  });

  // Reasons carry model and feed output. The sender uses no parse_mode, so
  // markup cannot execute, but a single run must never be able to push the
  // message past Telegram's limit and lose every other lane.
  it('stays inside the Telegram message limit however long the reasons are', () => {
    const long = 'x'.repeat(9000);
    const msg = buildDigest(summarise([run({ created: 0, notes: long })], NOW), NOW);
    expect(msg.length).toBeLessThanOrEqual(4096);
  });

  it('uses Latin digits — this is an ops alert, not Persian prose', () => {
    const msg = buildDigest(summarise([run({ locale: 'fa', created: 12 })], NOW), NOW);
    expect(msg).toContain('12');
    expect(msg).not.toMatch(/[۰-۹]/);
  });
});

const post = (over: Partial<SocialRow> = {}): SocialRow => ({
  destination: 'telegram-channel',
  status: 'posted',
  createdAt: hoursAgo(2),
  error: null,
  ...over,
});

describe('dry runs', () => {
  // A dry run writes an AutopilotRun row with a created count and inserts
  // nothing. Counting it as a publication is how the digest came to report
  // "fa: healthy — 1 published" on a production database that held zero
  // Persian articles — the exact false confidence this digest exists to
  // prevent.
  it('does not count a dry run as a publication', () => {
    const out = summarise([run({ locale: 'fa', created: 1, notes: 'dry-run' })], NOW);
    const fa = lane(out, 'fa');
    expect(fa.created).toBe(0);
    expect(fa.state).not.toBe('healthy');
  });

  it('still counts a real run alongside a dry one', () => {
    const out = summarise([run({ locale: 'en', created: 1, notes: 'dry-run' }), run({ locale: 'en', created: 2 })], NOW);
    expect(lane(out, 'en').created).toBe(2);
    expect(lane(out, 'en').state).toBe('healthy');
  });

  it('says why a lane looks quiet when every run was a dry run', () => {
    const out = summarise([run({ locale: 'fa', created: 3, notes: 'dry-run' })], NOW);
    expect(lane(out, 'fa').reasons.join(' ')).toMatch(/dry/i);
  });
});

describe('summariseSocial', () => {
  it('says nothing about a destination that posted cleanly', () => {
    const out = summariseSocial([post(), post()], NOW);
    expect(out.filter((d) => d.state !== 'healthy')).toHaveLength(0);
  });

  it('flags a destination whose every attempt failed, and carries the error', () => {
    const out = summariseSocial([post({ status: 'failed', error: 'telegram 401' })], NOW);
    const d = out.find((x) => x.destination === 'telegram-channel')!;
    expect(d.state).toBe('failing');
    expect(d.reasons.join(' ')).toContain('401');
  });

  // A destination nobody configured is not broken, and calling it broken every
  // day is how a digest teaches you to ignore it.
  it('separates never-configured from failing', () => {
    const out = summariseSocial([post({ status: 'skipped', error: 'not configured' })], NOW);
    expect(out.find((x) => x.destination === 'telegram-channel')!.state).toBe('unconfigured');
  });

  it('ignores attempts from outside the window', () => {
    expect(summariseSocial([post({ status: 'failed', createdAt: hoursAgo(400) })], NOW)).toHaveLength(0);
  });
});

describe('buildDigest with social', () => {
  it('keeps a fully healthy day short even with social attached', () => {
    const lanes = summarise([run({ locale: 'en', created: 2 }), run({ locale: 'fa', created: 1 })], NOW);
    const msg = buildDigest(lanes, NOW, summariseSocial([post()], NOW));
    expect(msg.split('\n').length).toBeLessThanOrEqual(7);
  });

  it('names a failing destination in the message', () => {
    const lanes = summarise([run({ locale: 'en', created: 1 }), run({ locale: 'fa', created: 1 })], NOW);
    const msg = buildDigest(lanes, NOW, summariseSocial([post({ status: 'failed', error: 'telegram 401' })], NOW));
    expect(msg).toContain('telegram-channel');
    expect(msg).toContain('401');
  });

  it('still works when no social rows are passed at all', () => {
    expect(() => buildDigest(summarise([], NOW), NOW)).not.toThrow();
  });
});
