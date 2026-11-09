// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { MatchResult } from '../../../lib/routes-v2/match.ts';
import { nextStep, type NextStepInput } from './next-step.ts';

type R = ReturnType<NextStepInput['routeOf']> & {};
const routes: Record<string, R> = {
  open: { key: 'open', status: 'open' },
  limited: { key: 'limited', status: 'limited' },
  paused: { key: 'paused', status: 'paused' },
  shut: { key: 'shut', status: 'open', blockedCitizenships: { codes: ['IR'], reason: { en: 'r' } } },
};
const steps = [1, 2, 3].map((i) => ({ key: `s${i}`, title: { en: `step ${i}` }, detail: { en: 'd' } }));

const base: NextStepInput = {
  following: [],
  journey: {},
  passport: 'IR',
  ranked: null,
  routeOf: (k) => routes[k],
  stepsOf: () => steps,
};

const m = (route: string, states: MatchResult['results'][number]['state'][], extra: Partial<MatchResult> = {}): MatchResult => ({
  route,
  pct: 50,
  coverage: { scored: states.length, of: states.length },
  weight: { scored: 1, of: 1 },
  thin: false,
  results: states.map((state, i) => ({ key: `c${i}`, state, weight: 1 })),
  runnable: true,
  blocked: false,
  ...extra,
});

test('first runnable followed route, first unticked step (following order)', () => {
  const r = nextStep({ ...base, following: ['paused', 'limited', 'open'], journey: { limited: ['s1', 's3'] } });
  assert.deepEqual(r, { kind: 'step', routeKey: 'limited', stepIndex: 1, stepCount: 3, step: steps[1] });
});

test('a route blocked for the passport is never chosen, even when followed first', () => {
  const r = nextStep({ ...base, following: ['shut', 'open'] });
  assert.equal(r.kind, 'step');
  assert.equal(r.kind === 'step' && r.routeKey, 'open');
});

test('a finished route is skipped for the next one', () => {
  const r = nextStep({ ...base, following: ['open', 'limited'], journey: { open: ['s1', 's2', 's3'] } });
  assert.equal(r.kind === 'step' && r.routeKey, 'limited');
});

test('every runnable followed route finished: all-done', () => {
  const r = nextStep({ ...base, following: ['open'], journey: { open: ['s1', 's2', 's3'] } });
  assert.deepEqual(r, { kind: 'all-done', routeKey: 'open' });
});

test('every followed route shut: all-blocked, no offer even when assessed', () => {
  const r = nextStep({ ...base, following: ['shut', 'paused'], ranked: [m('open', ['close'])] });
  assert.deepEqual(r, { kind: 'all-blocked' });
});

test('no passport given: a passport block does not apply', () => {
  const r = nextStep({ ...base, passport: null, following: ['shut'] });
  assert.equal(r.kind === 'step' && r.routeKey, 'shut');
});

test('following nothing, assessed: best runnable match with its close count', () => {
  const r = nextStep({ ...base, ranked: [m('open', ['met', 'close', 'close', 'not-yet', 'unscored'])] });
  assert.deepEqual(r, { kind: 'best-match', routeKey: 'open', close: 2 });
});

test('best match never offers a blocked route', () => {
  const r = nextStep({ ...base, ranked: [m('shut', ['close']), m('limited', ['met'])] });
  assert.deepEqual(r, { kind: 'best-match', routeKey: 'limited', close: 0 });
  const flagged = nextStep({ ...base, passport: null, ranked: [m('open', ['close'], { blocked: true }), m('limited', ['met'])] });
  assert.equal(flagged.kind === 'best-match' && flagged.routeKey, 'limited');
});

test('nothing followed, not assessed (or nothing runnable): fresh', () => {
  assert.deepEqual(nextStep(base), { kind: 'fresh' });
  assert.deepEqual(nextStep({ ...base, ranked: [m('shut', ['met'])] }), { kind: 'fresh' });
});
