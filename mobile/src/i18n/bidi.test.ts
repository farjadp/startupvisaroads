// Run: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isolateLatin } from './bidi.ts';

const LRI = '⁦';
const PDI = '⁩';
const NBSP = ' ';
const WJ = '⁠';
const iso = (s: string) => `${LRI}${s}${PDI}`;

test('a parenthesised Latin name is one isolate with its parentheses', () => {
  assert.equal(isolateLatin('استارتاپ دانمارک (Start-up Denmark)'), `استارتاپ دانمارک ${iso('(Start-up Denmark)')}`);
});

test('a run that fits on one line is made unbreakable', () => {
  assert.equal(isolateLatin('استارتاپ دانمارک (Start-up Denmark)', 24), `استارتاپ دانمارک ${iso(`(Start-${WJ}up${NBSP}Denmark)`)}`);
  assert.equal(isolateLatin('ویزای دانشجویی (B/2)', 24), `ویزای دانشجویی ${iso(`(B/${WJ}2)`)}`);
});

test('a run longer than a line keeps its spaces', () => {
  assert.equal(isolateLatin('اداره (Police and Border Guard Board)', 10), `اداره ${iso('(Police and Border Guard Board)')}`);
});

test('a name followed by a bracketed term stays one isolate', () => {
  assert.equal(
    isolateLatin('پس از نظر مثبت Business Finland (Eligibility Statement) درخواست دهید'),
    `پس از نظر مثبت ${iso('Business Finland (Eligibility Statement)')} درخواست دهید`,
  );
  assert.equal(isolateLatin('با USCIS (I-140)، سپس'), `با ${iso('USCIS (I-140)')}، سپس`);
});

test('Persian parentheses around Latin stay Persian', () => {
  assert.equal(isolateLatin('(مثلاً از Business Finland)'), `(مثلاً از ${iso('Business Finland')})`);
});

test('codes and URLs stay whole', () => {
  assert.equal(isolateLatin('مسیر EB-2 NIW'), `مسیر ${iso('EB-2 NIW')}`);
  assert.equal(isolateLatin('ببینید https://a.gov/x_y?q=1 را'), `ببینید ${iso('https://a.gov/x_y?q=1')} را`);
});

test('accented Latin is Latin', () => {
  assert.equal(isolateLatin('اجازه‌ی اقامت تحصیلی (Öğrenci İkamet İzni)'), `اجازه‌ی اقامت تحصیلی ${iso('(Öğrenci İkamet İzni)')}`);
});

test('the sentence keeps its own punctuation', () => {
  assert.equal(isolateLatin('تأییدیه از Business Finland.'), `تأییدیه از ${iso('Business Finland')}.`);
  assert.equal(isolateLatin('به SIRI بدهید'), `به ${iso('SIRI')} بدهید`);
});

test('numbers alone, Persian digits, Latin-only and already isolated text are left alone', () => {
  assert.equal(isolateLatin('سال 2026'), 'سال 2026');
  assert.equal(isolateLatin('سال ۲۰۲۶'), 'سال ۲۰۲۶');
  assert.equal(isolateLatin('Start-up Denmark (DK)'), 'Start-up Denmark (DK)');
  const once = isolateLatin('از Business Finland');
  assert.equal(isolateLatin(once), once);
});

test('an acronym before a Persian aside leaves the "(" to the Persian', () => {
  assert.equal(isolateLatin('فرم I-140 (کاغذی؛ آنلاین ۶۶۵)'), `فرم ${iso('I-140')} (کاغذی؛ آنلاین ۶۶۵)`);
  assert.equal(isolateLatin('مرکز ELY (تصمیم جزئی)؛ Migri (اجازه‌ی اقامت)'), `مرکز ${iso('ELY')} (تصمیم جزئی)؛ ${iso('Migri')} (اجازه‌ی اقامت)`);
  assert.equal(isolateLatin('RVO «منفعت اساسی» را'), `${iso('RVO')} «منفعت اساسی» را`);
});

test('a closing parenthesis of the Persian sentence stays outside', () => {
  assert.equal(
    isolateLatin('ریاست مدیریت مهاجرت (قانون ۶۴۵۸ ماده‌ی ۳۱(۱)(c))؛ وزارت کار'),
    `ریاست مدیریت مهاجرت (قانون ۶۴۵۸ ماده‌ی ۳۱(۱)${iso('(c)')})؛ وزارت کار`,
  );
});
