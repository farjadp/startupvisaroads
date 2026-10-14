// Run: node --test --experimental-strip-types src/i18n/jalali.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toJalali, toPersianDigits } from './jalali.ts';

test('12 Oct 2026 is 20 Mehr 1405 (the date the Persian site prints)', () => {
  assert.deepEqual(toJalali(new Date(2026, 9, 12)), { jy: 1405, jm: 7, jd: 20 });
});

test('14 Oct 2026 is 22 Mehr 1405', () => {
  assert.deepEqual(toJalali(new Date(2026, 9, 14)), { jy: 1405, jm: 7, jd: 22 });
});

test('Nowruz 1405 falls on 21 March 2026', () => {
  assert.deepEqual(toJalali(new Date(2026, 2, 21)), { jy: 1405, jm: 1, jd: 1 });
});

test('20 March 2026 is the last day of Esfand 1404', () => {
  assert.deepEqual(toJalali(new Date(2026, 2, 20)), { jy: 1404, jm: 12, jd: 29 });
});

test('Persian digits and separator', () => {
  assert.equal(toPersianDigits('600,000'), '۶۰۰٬۰۰۰');
});
