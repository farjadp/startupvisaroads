// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allPoints, routeBadges, routePoints, type ExtrasLookup } from './points.ts';

const q = { q: { en: 'q' }, options: [{ en: 'a' }, { en: 'b' }], answer: 0, why: { en: 'w' } };
const extras: ExtrasLookup = (k) =>
  k === 'r'
    ? {
        steps: [1, 2, 3].map((i) => ({ key: `s${i}`, title: { en: 's' }, detail: { en: 'd' } })),
        documents: [1, 2].map((i) => ({ key: `d${i}`, label: { en: 'd' } })),
        quiz: [1, 2, 3, 4, 5].map((i) => ({ ...q, key: `q${i}` })),
      }
    : undefined;

test('preparing outweighs quizzing (Farjad, 27 Oct 2026)', () => {
  const stepsOnly = routePoints('r', { journey: { r: ['s1', 's2', 's3'] }, docs: {}, quizBest: {} }, extras);
  const quizOnly = routePoints('r', { journey: {}, docs: {}, quizBest: { r: { right: 5, of: 5 } } }, extras);
  assert.equal(stepsOnly, 30);
  assert.equal(quizOnly, 25);
});

test('unknown or renamed keys earn nothing', () => {
  assert.equal(routePoints('r', { journey: { r: ['gone'] }, docs: { r: ['d9'] }, quizBest: {} }, extras), 0);
  assert.equal(routePoints('nope', { journey: { nope: ['s1'] }, docs: {}, quizBest: {} }, extras), 0);
});

test('badges only for complete milestones', () => {
  const p = { journey: { r: ['s1', 's2'] }, docs: { r: ['d1', 'd2'] }, quizBest: { r: { right: 5, of: 5 } } };
  assert.deepEqual(routeBadges('r', p, extras), ['knows', 'papers']);
  assert.equal(allPoints(p, extras).total, 20 + 10 + 25);
});
