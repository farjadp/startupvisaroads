// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RULES, RATES_TO_CAD } from '../../../lib/fa/programmes.ts';
import { checksFor, completeAnswers, levelOf, mentorIsPrimary, readiness } from './readiness.ts';

const rule = (k: string) => RULES.find((r) => r.key === k)!;
const base = completeAnswers({ goal: 'residency', team: 'solo', business: 'revenue', language: 'mid', capital: '200to500', background: 'professional', horizon: 'medium' }).answers;

test('levels come from the bands, never by hand', () => {
  assert.deepEqual(levelOf(0), { level: 'explorer', next: 'planner', pointsToNext: 25 });
  assert.deepEqual(levelOf(42), { level: 'planner', next: 'ready', pointsToNext: 8 });
  assert.deepEqual(levelOf(80), { level: 'applicant' });
  assert.equal(mentorIsPrimary(24), false);
  assert.equal(mentorIsPrimary(25), true);
});

test('engagement cannot outweigh doing', () => {
  const r = readiness([], 0, 6, { sourceOpened: true, newsRead: true });
  assert.equal(r.engagement, 10);
  assert.equal(r.score, 10);
  assert.equal(r.noThresholds, true);
});

test('Nova Scotia: net worth is never scored from the pathfinder; it is named as a gap', () => {
  const { checks, gaps } = checksFor(rule('nova-scotia'), base, RATES_TO_CAD);
  assert.ok(gaps.includes('net-worth'));
  assert.ok(!checks.some((c) => (c.key as string) === 'net-worth'));
  assert.equal(checks.find((c) => c.key === 'investment')!.status, 'met');
  assert.equal(checks.find((c) => c.key === 'clb')!.status, 'met');
});

test('a band below the bar but within 20 % reads close, not met', () => {
  const a = { ...base, capital: '50to200' as const };
  const { checks } = checksFor(rule('nova-scotia'), a, RATES_TO_CAD);
  assert.equal(checks.find((c) => c.key === 'investment')!.status, 'close');
});

test('Finland needs two founders: a solo founder is not yet', () => {
  const { checks } = checksFor(rule('finland'), base, RATES_TO_CAD);
  assert.equal(checks.find((c) => c.key === 'founders-min')!.status, 'not-yet');
});

test('skipped answers are scored cautiously and reported', () => {
  const { answers, skipped } = completeAnswers({ goal: 'growth', capital: 'skip' });
  assert.equal(answers.capital, 'under50');
  assert.deepEqual(skipped.sort(), ['background', 'business', 'capital', 'horizon', 'language', 'team'].sort());
});

test('the score is bounded and whole', () => {
  const { checks } = checksFor(rule('nova-scotia'), base, RATES_TO_CAD);
  const r = readiness(checks, 6, 6, { sourceOpened: true, newsRead: true });
  assert.ok(r.score <= 100 && Number.isInteger(r.score));
});
