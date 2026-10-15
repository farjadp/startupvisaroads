// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FX, toUsd } from '../../../lib/fx.ts';

test('USD stays USD (to the nearest 10)', () => {
  assert.equal(toUsd(1000, 'USD'), 1000);
  assert.equal(toUsd(1004, 'USD'), 1000);
});

test('EUR converts at the ECB rate and rounds to 10', () => {
  // 880 × 1.1208 = 986.3 → 990
  assert.equal(toUsd(880, 'EUR'), 990);
});

test('cross rates go through the euro', () => {
  // DKK 153,240 / 7.475 × 1.1208 = 22,976.9 → 22,980
  assert.equal(toUsd(153_240, 'DKK'), 22_980);
});

test('the rate date is an ISO date', () => {
  assert.match(FX.date, /^\d{4}-\d{2}-\d{2}$/);
});
