// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toUsdExact } from '../../../lib/fx.ts';
import { ROUTES_CANADA_US } from '../../../lib/routes-v2/canada-us.ts';
import { ROUTES_EUROPE } from '../../../lib/routes-v2/europe.ts';
import { rank } from '../../../lib/routes-v2/match.ts';
import { ROUTES_TR_IL_AE } from '../../../lib/routes-v2/tr-il-ae.ts';
import { ASSESS_ORDER, ASSESS_SCREENS, allAnswered, answeredCount, missingFields, nextEmptyField, screenFields, toProfile, type AssessAnswers } from './assessment.ts';

const ALL = [...ROUTES_CANADA_US, ...ROUTES_EUROPE, ...ROUTES_TR_IL_AE];

test('skipped and unanswered questions leave their fields out', () => {
  const p = toProfile({ age: '30', degree: 'skip', english: 'good', liquid: 'skip', admission: 'skip' });
  assert.deepEqual(p, { age: [30, 34], englishClb: 7 });
});

test('money bands are USD ranges; the top band is open-ended', () => {
  assert.deepEqual(toProfile({ liquid: '4' }).liquid, [150_000, 300_000]);
  assert.deepEqual(toProfile({ liquid: '7' }).liquid, [2_000_000, Infinity]);
});

test('yes / no / prefer not to say: only yes and no are answers', () => {
  assert.deepEqual(toProfile({ admission: 'yes', jobOffer: 'no', endorsement: 'skip' }), { admission: true, jobOffer: false });
});

test('revenue is 0 for an early-stage business, a band otherwise', () => {
  assert.equal(toProfile({ businessStage: 'idea' }).revenue, 0);
  assert.deepEqual(toProfile({ businessStage: 'revenue', revenue: '2' }).revenue, [150_000, 300_000]);
});

test('a full profile ranks real routes, never a paused one, all within 0–100', () => {
  const p = toProfile({ age: '30', degree: 'master', work: '5', english: 'veryGood', liquid: '5', netWorth: '5', income: '4', investment: '4', businessStage: 'mvp', admission: 'no', jobOffer: 'no', endorsement: 'no' });
  const ranked = rank(ALL, p, toUsdExact, 'startup');
  assert.ok(ranked.length > 10);
  for (const m of ranked) {
    assert.ok(m.pct !== null && m.pct >= 0 && m.pct <= 100);
    assert.ok(m.runnable);
  }
  assert.ok(!ranked.some((m) => m.route === 'ca-start-up-visa'), 'the paused Start-up Visa must not be ranked');
});

test('an Iranian passport closes the US routes: no %, no rank, marked blocked', () => {
  const p = toProfile({ citizenship: 'IR', degree: 'phd', english: 'veryGood', work: '10' });
  const ranked = rank(ALL, p, toUsdExact, 'talent');
  assert.ok(!ranked.some((m) => m.route.startsWith('us-')));
  const niw = ALL.find((r) => r.key === 'us-eb2-niw')!;
  assert.ok(niw.blockedCitizenships?.codes.includes('IR'));
});

// Two-screen flow (spec 2026-11-09 §2): row order follows ASSESS_ORDER, the next empty row is
// found without wrapping or crossing screens, and "N of M answered" moves with the revenue question.
test('the two screens cover ASSESS_ORDER once, in order', () => {
  assert.deepEqual(ASSESS_SCREENS.flat(), ASSESS_ORDER);
  assert.deepEqual(screenFields(0, {}), ['goal', 'residence', 'citizenship', 'age', 'degree', 'work', 'english', 'french']);
  assert.deepEqual(screenFields(1, {}), ['liquid', 'netWorth', 'income', 'investment', 'businessStage', 'admission', 'jobOffer', 'endorsement']);
  assert.deepEqual(screenFields(1, { businessStage: 'revenue' }), ['liquid', 'netWorth', 'income', 'investment', 'businessStage', 'revenue', 'admission', 'jobOffer', 'endorsement']);
  assert.deepEqual(screenFields(2, {}), []);
});

test('next empty field: skips answered rows, never wraps, never crosses screens', () => {
  const a: AssessAnswers = { goal: 'startup', residence: 'IR', age: '30' };
  assert.equal(nextEmptyField(0, a, 'goal'), 'citizenship');
  assert.equal(nextEmptyField(0, a, 'citizenship'), 'degree');
  assert.equal(nextEmptyField(0, { ...a, french: 'skip' }, 'english'), null);
  // The last row of screen 0 never opens screen 1's first row.
  assert.equal(nextEmptyField(0, a, 'french'), null);
  assert.equal(nextEmptyField(1, a, 'goal'), null);
  // 'skip' counts as a value.
  assert.equal(nextEmptyField(0, { goal: 'skip', residence: 'skip', citizenship: 'skip' }, 'goal'), 'age');
});

test('answered count and completeness follow the answers, revenue included only when asked', () => {
  assert.deepEqual(answeredCount({}), { n: 0, total: 16 });
  assert.deepEqual(answeredCount({ goal: 'study', age: 'skip', businessStage: 'idea' }), { n: 3, total: 16 });
  assert.deepEqual(answeredCount({ businessStage: 'established' }), { n: 1, total: 17 });
  const full: AssessAnswers = Object.fromEntries(screenFields(0, {}).concat(screenFields(1, {})).map((f) => [f, 'skip'])) as AssessAnswers;
  assert.equal(allAnswered(full), true);
  assert.deepEqual(missingFields(1, full), []);
  assert.equal(allAnswered({ ...full, businessStage: 'revenue' }), false);
  assert.deepEqual(missingFields(1, { ...full, businessStage: 'revenue' }), ['revenue']);
});
