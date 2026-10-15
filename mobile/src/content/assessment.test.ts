// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toUsdExact } from '../../../lib/fx.ts';
import { ROUTES_CANADA_US } from '../../../lib/routes-v2/canada-us.ts';
import { ROUTES_EUROPE } from '../../../lib/routes-v2/europe.ts';
import { rank } from '../../../lib/routes-v2/match.ts';
import { ROUTES_TR_IL_AE } from '../../../lib/routes-v2/tr-il-ae.ts';
import { toProfile } from './assessment.ts';

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
