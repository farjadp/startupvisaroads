// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeEntities, htmlToBlocks, linksOf, normaliseHref } from './html-parse.ts';

test('paragraphs, inline bold/italic and whitespace collapse', () => {
  const b = htmlToBlocks('<p>On  5 <strong>November</strong>\n <em>2026</em>, IRCC.</p>');
  assert.deepEqual(b, [{ kind: 'p', inlines: [{ text: 'On 5 ' }, { text: 'November', bold: true }, { text: ' ' }, { text: '2026', italic: true }, { text: ', IRCC.' }] }]);
});

test('headings h2–h4 keep their level; h1 becomes h2', () => {
  const b = htmlToBlocks('<h1>A</h1><h2>B</h2><h3>C</h3><h4>D</h4>');
  assert.deepEqual(b.map((x) => (x.kind === 'h' ? x.level : 0)), [2, 2, 3, 4]);
});

test('lists, nested lists and ordered lists', () => {
  const b = htmlToBlocks('<ul><li>One</li><li>Two<ul><li>Two a</li></ul></li></ul><ol><li><p>First</p></li></ol>');
  assert.equal(b.length, 2);
  const ul = b[0];
  assert.ok(ul.kind === 'list' && !ul.ordered);
  if (ul.kind !== 'list') return;
  assert.equal(ul.items.length, 2);
  assert.equal(ul.items[1][1].kind, 'list');
  assert.ok(b[1].kind === 'list' && b[1].ordered);
});

test('links: https kept, relative resolved to visaroads.com, others dropped to text', () => {
  const b = htmlToBlocks('<p><a href="https://www.canada.ca/x">IRCC</a> <a href="/en/blog/y">guide</a> <a href="javascript:alert(1)">bad</a> <a href="http://insecure.example">old</a></p>');
  assert.ok(b[0].kind === 'p');
  if (b[0].kind !== 'p') return;
  const hrefs = b[0].inlines.map((i) => ('href' in i ? i.href : undefined));
  assert.deepEqual(hrefs, ['https://www.canada.ca/x', undefined, 'https://visaroads.com/en/blog/y', undefined]);
  assert.deepEqual(linksOf(b), [
    { href: 'https://www.canada.ca/x', text: 'IRCC' },
    { href: 'https://visaroads.com/en/blog/y', text: 'guide' },
  ]);
  assert.equal(normaliseHref('mailto:a@b.c'), undefined);
});

test('links list is unique and keeps the first text', () => {
  const b = htmlToBlocks('<p><a href="https://a.ca">A <strong>bold</strong></a></p><ul><li><a href="https://a.ca">again</a></li><li><a href="https://b.ca">B</a></li></ul>');
  assert.deepEqual(linksOf(b), [
    { href: 'https://a.ca', text: 'A bold' },
    { href: 'https://b.ca', text: 'B' },
  ]);
});

test('images: src https, alt kept, empty alt is decorative, image inside a paragraph splits it', () => {
  const b = htmlToBlocks('<p>Before<img src="https://x.io/a.jpg" alt="A building">after</p><img src="https://x.io/b.jpg" alt=""><img src="data:abc" alt="x">');
  assert.deepEqual(
    b.map((x) => x.kind),
    ['p', 'img', 'p', 'img'],
  );
  assert.ok(b[1].kind === 'img' && b[1].alt === 'A building');
  assert.ok(b[3].kind === 'img' && b[3].alt === '');
});

test('tables: header row from th, body rows as header/value cells, empty rows dropped', () => {
  const b = htmlToBlocks('<table><thead><tr><th>Route</th><th>2027</th></tr></thead><tbody><tr><td>Express Entry</td><td><strong>100,000</strong></td></tr><tr><td> </td><td></td></tr><tr><td>PNP</td><td>95,000</td></tr></tbody></table>');
  assert.equal(b.length, 1);
  const t = b[0];
  assert.ok(t.kind === 'table');
  if (t.kind !== 'table') return;
  assert.equal(t.rows.length, 2);
  assert.deepEqual(t.rows[0], [
    { header: 'Route', inlines: [{ text: 'Express Entry' }] },
    { header: '2027', inlines: [{ text: '100,000', bold: true }] },
  ]);
});

test('tables without a th row have no headers', () => {
  const b = htmlToBlocks('<table><tr><td>a</td><td>b</td></tr></table>');
  assert.ok(b[0].kind === 'table' && b[0].rows[0][0].header === null);
});

test('blockquote, hr, br', () => {
  const b = htmlToBlocks('<blockquote><p>Quoted</p></blockquote><hr><p>a<br>b<br></p>');
  assert.equal(b[0].kind, 'quote');
  assert.equal(b[1].kind, 'hr');
  assert.ok(b[2].kind === 'p');
  if (b[2].kind === 'p') assert.deepEqual(b[2].inlines, [{ text: 'a' }, { br: true }, { text: 'b' }]);
});

test('unknown tags give their text; script and style are dropped; stray closers ignored', () => {
  const b = htmlToBlocks('<div><span class="x">Hi</span> <u>there</u></div><script>alert(1)</script><style>p{}</style></span><p>End</p>');
  assert.deepEqual(b, [
    { kind: 'p', inlines: [{ text: 'Hi there' }] },
    { kind: 'p', inlines: [{ text: 'End' }] },
  ]);
});

test('unclosed p and li close at the next one', () => {
  const b = htmlToBlocks('<p>One<p>Two<ul><li>a<li>b</ul>');
  assert.deepEqual(b.map((x) => x.kind), ['p', 'p', 'list']);
  assert.ok(b[2].kind === 'list' && b[2].items.length === 2);
});

test('entities decode, including numeric and Persian text with ZWNJ', () => {
  assert.equal(decodeEntities('A &amp; B &gt; C &#8212; &#x2014; &nbsp;'), 'A & B > C — —  ');
  const b = htmlToBlocks('<p>می&zwnj;خواهید</p>');
  assert.ok(b[0].kind === 'p' && 'text' in b[0].inlines[0] && b[0].inlines[0].text === 'می‌خواهید');
});
