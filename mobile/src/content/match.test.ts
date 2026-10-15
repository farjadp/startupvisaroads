// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toUsdExact } from '../../../lib/fx.ts';
import { match, rank, type Profile } from '../../../lib/routes-v2/match.ts';
import type { RouteV2 } from '../../../lib/routes-v2/types.ts';

const base = { country: 'CA', family: 'entrepreneur', name: { en: 'Test' }, agency: 'Test', fact: { en: '' }, money: [], pr: { en: '' }, sources: [{ url: 'https://example.gov', checked: '2026-10-15' }], verified: true } as const;

const route = (key: string, status: RouteV2['status'] = 'open'): RouteV2 => ({
  ...base,
  key,
  status,
  criteria: [
    { key: 'net-worth', label: { en: 'Net worth' }, weight: 3, scoreable: true, test: { field: 'netWorth', op: 'gte', value: 600_000, currency: 'CAD' } },
    { key: 'english', label: { en: 'English' }, weight: 2, scoreable: true, test: { field: 'englishClb', op: 'gte', value: 5 } },
    { key: 'age', label: { en: 'Age' }, weight: 1, scoreable: true, test: { field: 'age', op: 'lte', value: 50 } },
    { key: 'panel', label: { en: 'Panel approval' }, weight: 3, scoreable: false },
  ],
});

const cadToUsd = (cad: number) => toUsdExact(cad, 'CAD');

test('all scoreable criteria met → 100%, unscoreable never counted', () => {
  const p: Profile = { netWorth: cadToUsd(700_000), englishClb: 7, age: 40 };
  const m = match(route('a'), p, toUsdExact);
  assert.equal(m.pct, 100);
  assert.deepEqual(m.coverage, { scored: 3, of: 3 });
  assert.equal(m.results.find((r) => r.key === 'panel')?.state, 'unscored');
});

test('close counts half, not yet counts nothing, weights apply', () => {
  // net worth 85% of the bar → close (3 × 0.5), English not yet (2 × 0), age met (1 × 1): 2.5 / 6
  const p: Profile = { netWorth: cadToUsd(510_000), englishClb: 3, age: 30 };
  assert.equal(match(route('a'), p, toUsdExact).pct, 42);
});

test('skipped answers are unscored, not "not yet", and coverage says so', () => {
  const m = match(route('a'), { englishClb: 7 }, toUsdExact);
  assert.equal(m.pct, 100);
  assert.deepEqual(m.coverage, { scored: 1, of: 3 });
});

test('money compares across currencies through USD', () => {
  // CAD 600,000 ≈ USD 422,333: just above is met, 80% of it is close
  assert.equal(match(route('a'), { netWorth: 423_000 }, toUsdExact).results[0].state, 'met');
  assert.equal(match(route('a'), { netWorth: 340_000 }, toUsdExact).results[0].state, 'close');
});

test('paused routes get no % and are never ranked', () => {
  const p: Profile = { netWorth: cadToUsd(700_000), englishClb: 7, age: 40 };
  assert.equal(match(route('p', 'paused'), p, toUsdExact).pct, null);
  assert.deepEqual(
    rank([route('p', 'paused'), route('a')], p, toUsdExact).map((m) => m.route),
    ['a'],
  );
});

test('a route scored on few criteria ranks after well-covered ones', () => {
  const extra = (k: string, field: 'jobOffer' | 'admission' | 'endorsement') => ({ key: k, label: { en: k }, weight: 1 as const, scoreable: true, test: { field, op: 'true' as const } });
  // 'thin' has 6 scoreable criteria; the profile answers 2 of them (under half). 'a' has 3; 2 answered.
  const thin: RouteV2 = { ...route('thin'), criteria: [...route('thin').criteria, extra('x', 'jobOffer'), extra('y', 'admission'), extra('z', 'endorsement')] };
  const p: Profile = { englishClb: 7, age: 30 };
  assert.deepEqual(rank([thin, route('a')], p, toUsdExact).map((m) => m.route), ['a', 'thin']);
});

test('anyOf: the best alternative decides', () => {
  const r: RouteV2 = {
    ...route('ae'),
    criteria: [
      {
        key: 'either',
        label: { en: 'Revenue or endorsement' },
        weight: 3,
        scoreable: true,
        anyOf: [
          { field: 'revenue', op: 'gte', value: 1_000_000, currency: 'AED' },
          { field: 'endorsement', op: 'true' },
        ],
      },
    ],
  };
  assert.equal(match(r, { endorsement: true }, toUsdExact).pct, 100);
  assert.equal(match(r, { revenue: 10_000, endorsement: false }, toUsdExact).pct, 0);
  assert.equal(match(r, {}, toUsdExact).pct, null);
});

test('openEnded: a met alternative counts, a failing one is unscored', () => {
  const r: RouteV2 = {
    ...route('ae2'),
    criteria: [{ key: 'inv', label: { en: 'Investment or property' }, weight: 3, scoreable: true, openEnded: true, anyOf: [{ field: 'investment', op: 'gte', value: 2_000_000, currency: 'AED' }] }],
  };
  assert.equal(match(r, { investment: 600_000 }, toUsdExact).pct, 100);
  assert.equal(match(r, { investment: 1_000 }, toUsdExact).pct, null);
});

test('anyOf: a failing answer next to a skipped alternative is unscored, not "not yet"', () => {
  const r: RouteV2 = {
    ...route('ae3'),
    criteria: [{ key: 'either', label: { en: 'Revenue or endorsement' }, weight: 3, scoreable: true, anyOf: [{ field: 'revenue', op: 'gte', value: 1_000_000, currency: 'AED' }, { field: 'endorsement', op: 'true' }] }],
  };
  assert.equal(match(r, { revenue: 10_000 }, toUsdExact).results[0].state, 'unscored');
});

test('coverage is weighed against every criterion, unscoreable included', () => {
  const heavy: RouteV2 = {
    ...route('heavy'),
    criteria: [
      { key: 'funds', label: { en: 'Funds' }, weight: 3, scoreable: true, test: { field: 'liquid', op: 'gte', value: 10_000 } },
      { key: 'panel', label: { en: 'Panel' }, weight: 3, scoreable: false },
      { key: 'plan', label: { en: 'Plan' }, weight: 3, scoreable: false },
    ],
  };
  const p: Profile = { liquid: 50_000, netWorth: cadToUsd(500_000), englishClb: 7, age: 30 };
  const m = match(heavy, p, toUsdExact);
  assert.equal(m.pct, 100);
  assert.equal(m.thin, true);
  // 'a' scores 6 of 9 weight at 75%: it still ranks above the thin 100%.
  assert.deepEqual(rank([heavy, route('a')], p, toUsdExact).map((x) => x.route), ['a', 'heavy']);
});
