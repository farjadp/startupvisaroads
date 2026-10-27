// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { FundLine } from '../../../lib/routes-v2/extras-types.ts';
import { linesFor } from './household.ts';

const line = (key: string, per: FundLine['per'], extra: Partial<FundLine> = {}): FundLine => ({ key, label: { en: key }, amount: 100, currency: 'EUR', basis: 'once', per, kind: 'show', source: 'https://example.gov', ...extra });
const keys = (ls: { f: FundLine; times: number }[]) => ls.map((l) => `${l.f.key}×${l.times}`);
const solo = { founders: 1, spouse: false, children: 0 };

test('a fee for the whole household shows for one person too (IE)', () => {
  assert.deepEqual(keys(linesFor([line('fee', 'household')], solo)), ['fee×1']);
});

test('a flat child add-on needs at least one child, never a spouse alone (DK)', () => {
  const f = [line('kids', 'children')];
  assert.deepEqual(keys(linesFor(f, { ...solo, spouse: true })), []);
  assert.deepEqual(keys(linesFor(f, { ...solo, children: 3 })), ['kids×1']);
});

test('a size table shows only the household row, never multiplied by founders (CA)', () => {
  const table = [1, 2, 3, 4].map((n) => line(`s${n}`, 'household', { householdSize: n })).concat(line('s7', 'household', { householdSize: 7, openEnded: true }));
  assert.deepEqual(keys(linesFor(table, { founders: 3, spouse: false, children: 0 })), ['s1×1']);
  assert.deepEqual(keys(linesFor(table, { founders: 1, spouse: true, children: 1 })), ['s3×1']);
  assert.deepEqual(keys(linesFor(table, { founders: 1, spouse: true, children: 7 })), ['s7×1']);
  // Sizes the data skips (5, 6) fall back to the whole table rather than a wrong row.
  assert.equal(linesFor(table, { founders: 1, spouse: true, children: 3 }).length, 5);
});

test('founder, spouse and child lines multiply as published', () => {
  const f = [line('a', 'founder'), line('b', 'spouse'), line('c', 'child')];
  assert.deepEqual(keys(linesFor(f, { founders: 2, spouse: true, children: 2 })), ['a×2', 'b×1', 'c×2']);
});
