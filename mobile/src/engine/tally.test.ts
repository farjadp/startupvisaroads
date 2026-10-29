// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statusByKey, tally } from './tally.ts';

test('counts the four states; skipped and authority-decided both count as not checked here', () => {
  const states = ['met', 'met', 'close', 'not-yet', 'unscored', 'unscored'] as const;
  assert.deepEqual(tally(states.map((state) => ({ state }))), { met: 2, close: 1, notYet: 1, unchecked: 2 });
});

test('the counts always add up to every condition (coverage stays honest)', () => {
  const t = tally([{ state: 'unscored' }, { state: 'met' }]);
  assert.equal(t.met + t.close + t.notYet + t.unchecked, 2);
});

test('an empty route counts nothing', () => {
  assert.deepEqual(tally([]), { met: 0, close: 0, notYet: 0, unchecked: 0 });
});

test('statuses are looked up by condition key', () => {
  const m = statusByKey([{ key: 'funds', state: 'close', weight: 2 }]);
  assert.equal(m.get('funds'), 'close');
  assert.equal(m.get('age'), undefined);
});
