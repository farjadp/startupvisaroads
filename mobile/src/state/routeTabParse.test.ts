// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStored, parseTab, pickTab } from './routeTabParse.ts';

test('parseTab accepts the four ids, arrays from search params, and case/space noise', () => {
  assert.equal(parseTab('rules'), 'rules');
  assert.equal(parseTab(' Money '), 'money');
  assert.equal(parseTab(['after', 'do']), 'after');
  assert.equal(parseTab('chapters'), null);
  assert.equal(parseTab(undefined), null);
  assert.equal(parseTab(3), null);
  assert.equal(parseTab([]), null);
});

test('parseStored keeps valid entries and survives bad JSON', () => {
  assert.deepEqual(parseStored(null), {});
  assert.deepEqual(parseStored('not json'), {});
  assert.deepEqual(parseStored('[1,2]'), {});
  assert.deepEqual(parseStored('"rules"'), {});
  assert.deepEqual(parseStored(JSON.stringify({ 'es-entrepreneur': 'money', 'bg-startup-visa': 'x', ok: 3 })), { 'es-entrepreneur': 'money' });
});

test('pickTab: deep link, then stored, then the first available', () => {
  const all = ['do', 'rules', 'money', 'after'] as const;
  assert.equal(pickTab({ link: 'rules', stored: 'money', available: all }), 'rules');
  assert.equal(pickTab({ link: null, stored: 'money', available: all }), 'money');
  assert.equal(pickTab({ link: null, stored: undefined, available: all }), 'do');
  // A closed route has no Do: a link or a stored Do falls through.
  const closed = ['rules', 'money', 'after'] as const;
  assert.equal(pickTab({ link: 'do', stored: 'do', available: closed }), 'rules');
  assert.equal(pickTab({ link: 'do', stored: 'after', available: closed }), 'after');
  assert.equal(pickTab({ link: null, stored: null, available: [] }), 'rules');
});
