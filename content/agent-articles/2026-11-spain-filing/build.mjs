// Build the series: node build.mjs
//   writes ./out/<file>.json for scripts/post-agent-article.mjs, and fails if
//   any article contains a number that is not in FACTS.md (ALLOWED below),
//   or a banned phrase. Persian digits are normalised before the check.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from './articles.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });

// Every figure FACTS.md carries, as digits with separators removed.
const ALLOWED = new Set([
  // small counts, ages, years-of-permit, days, article paragraph numbers
  '0', '1', '2', '3', '4', '5', '6', '7', '9', '10', '12', '17', '18', '20', '21', '24', '31',
  // Ley 14/2013 and 28/2022, BOE dates, the reading date
  '14', '28', '2013', '2022', '2021', '2023', '2026', '22', '8',
  // articles of Ley 14/2013 cited
  '61', '62', '63', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76',
  // sede and fee
  '202099', '790', '038', '1238',
  // FNMT offices, staff share
  '2400', '60',
]);
const BANNED = [/\bsuccess rate\b/i, /\bguarantee[sd]?\b/i, /[$€]\s?\d/, /applying from/i, /\bfrom (Iran|Canada|Turkey|the UAE)\b/i, /ما تضمین/, /نرخ موفقیت/, /—/];
const FA = '۰۱۲۳۴۵۶۷۸۹';
const normalise = (t) => t.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).replace(/[٬,]/g, '');

let bad = 0;
const slugs = new Set();
for (const art of articles) {
  const { file, ...payload } = art;
  if (slugs.has(payload.slug)) { console.error(`duplicate slug ${payload.slug}`); bad++; }
  slugs.add(payload.slug);

  const text = [payload.title, payload.excerpt, payload.keyTakeaway, payload.summaryEn, payload.content, ...(payload.faq ?? []).flatMap((f) => [f.q, f.a])]
    .join(' ')
    .replace(/<a [^>]+>/g, ' ') // link targets carry BOE ids and law numbers
    .replace(/<[^>]+>/g, ' ');
  // Version "1.9.0", "MI-T", "790-038" style tokens: split on non-digits.
  const nums = new Set((normalise(text).match(/\d+/g) ?? []));
  const stray = [...nums].filter((n) => !ALLOWED.has(n));
  if (stray.length) { console.error(`${file}: numbers not in FACTS.md: ${stray.join(', ')}`); bad++; }
  for (const re of BANNED) if (re.test(text)) { console.error(`${file}: banned pattern ${re}`); bad++; }
  if (!/^[a-z0-9-]+$/.test(payload.slug)) { console.error(`${file}: bad slug`); bad++; }
  if (payload.excerpt.length > 600) { console.error(`${file}: excerpt too long`); bad++; }
  if (!payload.internalLinks?.length) { console.error(`${file}: no internal links`); bad++; }
  if (payload.locale === 'fa' && /[يك]/.test(text)) { console.error(`${file}: Arabic ي/ك in Persian text`); bad++; }

  writeFileSync(join(out, `${file}.json`), `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`${file}: ${payload.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length} words, ${payload.publishAt.slice(0, 10)}`);
}
console.log(bad ? `\n${bad} problem(s)` : `\n${articles.length} articles written to ${out}`);
process.exit(bad ? 1 : 0);
