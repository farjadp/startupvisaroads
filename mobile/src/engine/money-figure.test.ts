// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { FundLine } from '../../../lib/routes-v2/extras-types.ts';
import { linesFor } from './household.ts';
import { keyFigure } from './money-figure.ts';

const line = (key: string, per: FundLine['per'], amount: number, extra: Partial<FundLine> = {}): FundLine => ({ key, label: { en: key }, amount, currency: 'EUR', basis: 'month', per, kind: 'show', source: 'https://example.gov', ...extra });
const ES = [line('applicant', 'founder', 600), line('family', 'spouse', 300), line('child', 'child', 300)];

test('a plain household sums applicant, spouse and each child (ES)', () => {
  const fig = keyFigure(linesFor(ES, { founders: 1, spouse: true, children: 2 }))!;
  assert.equal(fig.amount, 1500);
  assert.deepEqual(fig.parts!.map((p) => `${p.who}${p.n ?? ''}:${p.amount}`), ['you:600', 'spouse:300', 'child1:300', 'child2:300']);
  assert.deepEqual([...fig.used], ['applicant', 'family', 'child']);
});

test('alone, the figure is the applicant line with no split', () => {
  const fig = keyFigure(linesFor(ES, { founders: 1, spouse: false, children: 0 }))!;
  assert.equal(fig.amount, 600);
  assert.equal(fig.parts, null);
  assert.equal(fig.line!.key, 'applicant');
});

test('two founders are one part, counted twice', () => {
  const fig = keyFigure(linesFor(ES, { founders: 2, spouse: true, children: 0 }))!;
  assert.deepEqual(fig.parts!.map((p) => `${p.who}${p.n ?? ''}:${p.amount}`), ['founders2:1200', 'spouse:300']);
});

test('alternatives are never summed (NS: in Halifax or outside)', () => {
  const f = [line('nw', 'person', 600_000, { basis: 'once' }), line('nw-out', 'person', 400_000, { basis: 'once' }), line('sp', 'spouse', 1, { basis: 'once' })];
  const fig = keyFigure(linesFor(f, { founders: 1, spouse: true, children: 0 }))!;
  assert.equal(fig.parts, null);
  assert.equal(fig.amount, 600_000);
});

test('two child lines are never summed (AU: living costs and schooling)', () => {
  const f = [line('living', 'person', 10, { basis: 'perYear' }), line('child', 'child', 2, { basis: 'perYear' }), line('school', 'child', 5, { basis: 'perYear' })];
  assert.equal(keyFigure(linesFor(f, { founders: 1, spouse: false, children: 1 }))!.parts, null);
});

test('an investment leads when nothing is to be shown', () => {
  const fig = keyFigure(linesFor([line('fee', 'household', 50, { kind: 'spend' }), line('cap', 'team', 30_000, { kind: 'invest' })], { founders: 1, spouse: false, children: 0 }))!;
  assert.equal(fig.line!.key, 'cap');
});

test('fees alone give no figure', () => {
  assert.equal(keyFigure(linesFor([line('fee', 'household', 50, { kind: 'spend' })], { founders: 1, spouse: false, children: 0 })), null);
});
