// Run: npm test
// Guards the v2 route data (lib/routes-v2): every route sourced and dated,
// keys unique and stable, scoreable criteria actually testable, money with
// its currency, English and Persian everywhere.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROUTES_CANADA_US } from '../../../lib/routes-v2/canada-us.ts';
import { ROUTES_EUROPE } from '../../../lib/routes-v2/europe.ts';
import { ROUTES_TR_IL_AE } from '../../../lib/routes-v2/tr-il-ae.ts';
import type { L10n, RouteV2 } from '../../../lib/routes-v2/types.ts';

const ALL: RouteV2[] = [...ROUTES_CANADA_US, ...ROUTES_EUROPE, ...ROUTES_TR_IL_AE];
const MONEY = new Set(['liquid', 'netWorth', 'investment', 'income', 'revenue']);
const ISO = /^\d{4}-\d{2}-\d{2}$/;

// v1 routes the app already links to; their v2 keys must not move.
const STABLE = ['ca-pnp-nova-scotia', 'ca-pnp-new-brunswick', 'us-eb2-niw', 'dk-startup', 'fi-startup', 'ee-startup', 'nl-startup', 'it-startup', 'tr-tech-visa'];

const both = (t: L10n | undefined, where: string) => {
  assert.ok(t?.en?.trim(), `${where}: English missing`);
  assert.ok(t?.fa?.trim(), `${where}: Persian missing`);
};

test('keys are unique and the v1-linked keys exist', () => {
  const keys = ALL.map((r) => r.key);
  assert.equal(new Set(keys).size, keys.length, 'duplicate route key');
  for (const k of STABLE) assert.ok(keys.includes(k), `missing ${k}`);
});

test('every route is sourced, dated and written in English and Persian', () => {
  for (const r of ALL) {
    assert.ok(r.sources.length > 0, `${r.key}: no source`);
    for (const s of r.sources) {
      assert.match(s.url, /^https:\/\//, `${r.key}: source not https`);
      assert.match(s.checked, ISO, `${r.key}: source date`);
    }
    both(r.name, `${r.key}.name`);
    both(r.agency, `${r.key}.agency`);
    both(r.fact, `${r.key}.fact`);
    both(r.pr, `${r.key}.pr`);
    assert.ok(r.criteria.length > 0, `${r.key}: no criteria`);
  }
});

test('criteria: weights 1–3, scoreable ones are testable, money has a currency', () => {
  for (const r of ALL) {
    for (const c of r.criteria) {
      const where = `${r.key}.${c.key}`;
      assert.ok([1, 2, 3].includes(c.weight), `${where}: weight`);
      both(c.label, `${where}.label`);
      if (c.scoreable) assert.ok(c.test || c.anyOf?.length, `${where}: scoreable without a test`);
      for (const t of [c.test, ...(c.anyOf ?? [])]) {
        if (t && (t.op === 'gte' || t.op === 'lte') && MONEY.has(t.field)) assert.ok(t.currency, `${where}: money test without currency`);
      }
    }
    for (const m of r.money) {
      assert.ok(m.amount > 0, `${r.key}.${m.key}: amount`);
      both(m.label, `${r.key}.${m.key}.label`);
    }
  }
});
