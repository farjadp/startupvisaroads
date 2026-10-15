// Run: npm test
// lib/fa/programmes.ts repeats two funds figures for the site's calculator;
// lib/funds.ts is where they are kept. These fail the moment the two disagree.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FUNDS, fundsLine } from '../../../lib/funds.ts';
import { RULES } from '../../../lib/fa/programmes.ts';

const rule = (k: string) => RULES.find((r) => r.key === k)!;

test('Denmark yearly funds match lib/funds.ts', () => {
  assert.equal(rule('denmark').yearlyFunds?.amount, fundsLine('DK', 'single').amount);
});

test('Estonia yearly funds are 12 × the monthly figure in lib/funds.ts', () => {
  assert.equal(rule('estonia').yearlyFunds?.amount, fundsLine('EE', 'perPerson').amount * 12);
});

test('every figure but Canada has a source and a checked date', () => {
  for (const [country, entry] of Object.entries(FUNDS)) {
    if (entry.kind === 'canadaTable') continue;
    assert.ok(entry.sources.length > 0, `${country} has no source`);
    assert.match(entry.checked ?? '', /^\d{4}-\d{2}-\d{2}$/, `${country} has no checked date`);
    for (const url of entry.sources) assert.match(url, /^https:\/\//);
  }
});
