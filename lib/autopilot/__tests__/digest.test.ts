import { describe, it, expect } from 'vitest';
import { summarise, type RunRow } from '../digest';

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

  it('reports every expected locale even when the table is empty', () => {
    expect(summarise([], NOW).map((l) => l.locale).sort()).toEqual(['en', 'fa']);
  });
});
