// Run: npm test
// Guards the v1 → v2 stored-state migration: every v1 road lands on a real v2
// route in the same country, nothing the user stored is dropped.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROUTES_CANADA_US } from '../../../lib/routes-v2/canada-us.ts';
import { ROUTES_EUROPE } from '../../../lib/routes-v2/europe.ts';
import { ROUTES_TR_IL_AE } from '../../../lib/routes-v2/tr-il-ae.ts';
import { V1_TO_V2, migrate, toV2Keys } from './migrate.ts';

const ALL = [...ROUTES_CANADA_US, ...ROUTES_EUROPE, ...ROUTES_TR_IL_AE];
// The v1 roads' countries (src/content/routes.ts), so a key never moves country.
const V1_COUNTRY: Record<string, string> = {
  'nova-scotia': 'CA',
  'new-brunswick': 'CA',
  denmark: 'DK',
  finland: 'FI',
  estonia: 'EE',
  netherlands: 'NL',
  italy: 'IT',
  turkey: 'TR',
  eb2niw: 'US',
};

test('every v1 road maps to an existing v2 route in the same country', () => {
  assert.deepEqual(Object.keys(V1_TO_V2).sort(), Object.keys(V1_COUNTRY).sort());
  for (const [v1, v2] of Object.entries(V1_TO_V2)) {
    const r = ALL.find((x) => x.key === v2);
    assert.ok(r, `${v1} → ${v2}: no such v2 route`);
    assert.equal(r.country, V1_COUNTRY[v1], `${v1} → ${v2}: country moved`);
  }
});

test('keys map in order, v2 keys pass through, duplicates collapse', () => {
  assert.deepEqual(toV2Keys(['nova-scotia', 'eb2niw', 'ca-express-entry', 'us-eb2-niw']), ['ca-pnp-nova-scotia', 'us-eb2-niw', 'ca-express-entry']);
  assert.deepEqual(toV2Keys(undefined), []);
  assert.deepEqual(toV2Keys(['denmark', 3, null]), ['dk-startup']);
});

test('a v1 blob becomes v2 and keeps every other field', () => {
  const v1 = { v: 1, following: ['turkey', 'finland'], sourcesOpened: ['italy'], outcome: 'finland', answers: { goal: 'residency' }, done: { finland: ['language-test'] }, assessAt: null };
  const out = migrate<{ v: 1 | 2; following: string[]; sourcesOpened: string[] } & Record<string, unknown>>(v1)!;
  assert.equal(out.v, 2);
  assert.deepEqual(out.following, ['tr-tech-visa', 'fi-startup']);
  assert.deepEqual(out.sourcesOpened, ['it-startup']);
  assert.equal(out.outcome, 'finland');
  assert.deepEqual(out.answers, { goal: 'residency' });
  assert.deepEqual(out.done, { finland: ['language-test'] });
});

test('v2 passes unchanged; unknown or broken blobs are refused', () => {
  const v2 = { v: 2, following: ['dk-startup'], sourcesOpened: [] };
  assert.equal(migrate(v2), v2);
  assert.equal(migrate({ v: 9 }), null);
  assert.equal(migrate(null), null);
  assert.equal(migrate('x'), null);
});
