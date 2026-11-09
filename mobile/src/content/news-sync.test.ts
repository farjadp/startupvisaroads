// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NEWS_COUNTRIES } from '../../../lib/news-countries.ts';
import { applyResponse, articleRef, mergeItems, normalise, readStored, type ApiNewsItem, type NewsItem } from './news-sync.ts';

const raw = (id: string, published: string, updated = published, extra: Partial<ApiNewsItem> = {}): ApiNewsItem => ({
  id,
  slug: `slug-${id}`,
  title: `Title ${id}`,
  excerpt: 'x',
  html: '<p>x</p>',
  coverImage: null,
  category: null,
  countries: ['CA'],
  publishedAt: published,
  updatedAt: updated,
  url: `https://visaroads.com/en/blog/slug-${id}`,
  ...extra,
});
const item = (id: string, published: string, updated = published) => normalise(raw(id, published, updated), 'en', NEWS_COUNTRIES)!;

test('normalise keeps the old fields (title, link, countries, date) and drops unknown countries', () => {
  const n = normalise(raw('a', '2026-11-09T14:00:00.000Z', undefined, { countries: ['CA', 'XX', 'FI'], coverImage: 'http://insecure/x.jpg' }), 'en', NEWS_COUNTRIES)!;
  assert.equal(n.link, n.url);
  assert.equal(n.date, '2026-11-09');
  assert.deepEqual(n.countries, ['CA', 'FI']);
  assert.equal(n.coverImage, null);
  assert.equal(n.locale, 'en');
});

test('normalise rejects malformed items', () => {
  assert.equal(normalise(raw('a', 'not a date'), 'en', NEWS_COUNTRIES), null);
  assert.equal(normalise(raw('a', '2026-11-09T00:00:00Z', undefined, { url: 'http://visaroads.com/x' }), 'en', NEWS_COUNTRIES), null);
  assert.equal(normalise({} as ApiNewsItem, 'en', NEWS_COUNTRIES), null);
});

test('merge by id: newer updatedAt wins, older incoming loses', () => {
  const held = [item('a', '2026-11-01T00:00:00Z', '2026-11-05T00:00:00Z')];
  const newer = { ...item('a', '2026-11-01T00:00:00Z', '2026-11-06T00:00:00Z'), title: 'new' };
  const older = { ...item('a', '2026-11-01T00:00:00Z', '2026-11-04T00:00:00Z'), title: 'old' };
  assert.equal(mergeItems(held, [newer])[0].title, 'new');
  assert.equal(mergeItems(held, [older])[0].title, 'Title a');
  assert.equal(mergeItems(held, [newer]).length, 1);
});

test('merge sorts newest published first and keeps only the newest N', () => {
  const held: NewsItem[] = Array.from({ length: 50 }, (_, k) => item(`h${k}`, new Date(Date.UTC(2026, 8, 1 + k)).toISOString()));
  const incoming = [item('n1', '2026-11-08T00:00:00Z'), item('n2', '2026-11-09T00:00:00Z')];
  const out = mergeItems(held, incoming);
  assert.equal(out.length, 50);
  assert.deepEqual(out.slice(0, 2).map((i) => i.id), ['n2', 'n1']);
  assert.ok(!out.some((i) => i.id === 'h0' || i.id === 'h1'));
  assert.equal(mergeItems(held, incoming, 3).length, 3);
});

test('applyResponse: since-sync merges, full sync replaces, generatedAt and etag stored', () => {
  const prev = { locale: 'en' as const, items: [item('a', '2026-11-01T00:00:00Z')], savedAt: '2026-11-08', generatedAt: '2026-11-08T10:00:00Z', etag: '"e1"' };
  const body = { generatedAt: '2026-11-09T10:00:00Z', items: [raw('b', '2026-11-09T00:00:00Z')] };
  const merged = applyResponse(prev, body, { locale: 'en', etag: '"e2"', today: '2026-11-09', full: false, known: NEWS_COUNTRIES });
  assert.deepEqual(merged.items.map((i) => i.id), ['b', 'a']);
  assert.equal(merged.generatedAt, '2026-11-09T10:00:00Z');
  assert.equal(merged.etag, '"e2"');
  assert.equal(merged.savedAt, '2026-11-09');
  const replaced = applyResponse(prev, body, { locale: 'en', etag: null, today: '2026-11-09', full: true, known: NEWS_COUNTRIES });
  assert.deepEqual(replaced.items.map((i) => i.id), ['b']);
  assert.equal(replaced.etag, '"e1"');
});

test('readStored rejects the old RSS shape and other locales', () => {
  assert.equal(readStored(JSON.stringify({ items: [], savedAt: '2026-11-01' }), 'en'), null);
  assert.equal(readStored('not json', 'en'), null);
  assert.equal(readStored(JSON.stringify({ locale: 'fa', items: [], savedAt: 'x', generatedAt: null, etag: null }), 'en'), null);
  assert.ok(readStored(JSON.stringify({ locale: 'en', items: [], savedAt: 'x', generatedAt: null, etag: null }), 'en'));
});

test('articleRef recognises visaroads.com article links only', () => {
  assert.deepEqual(articleRef('https://visaroads.com/fa/blog/founder-limit'), { locale: 'fa', slug: 'founder-limit' });
  assert.deepEqual(articleRef('https://www.visaroads.com/en/blog/a-b/?x=1#h'), { locale: 'en', slug: 'a-b' });
  assert.equal(articleRef('https://visaroads.com/en/guides/canada'), null);
  assert.equal(articleRef('https://evil.com/en/blog/x'), null);
});
