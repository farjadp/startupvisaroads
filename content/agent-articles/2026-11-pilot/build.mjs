// Build the series: node build.mjs
//   writes ./out/<file>.json for scripts/post-agent-article.mjs, and fails if
//   any article contains a number that is not in FACTS.md (ALLOWED below),
//   or a banned phrase. Persian digits are normalised before the check.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from './articles.mjs';
import { extras } from './extras.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });

// Every figure FACTS.md carries, as digits with separators removed.
const ALLOWED = new Set([
  '1', '2', '3', '4', '5', '6', '10', '12', '30', '31', '50', '55', '500',
  '1425', '2000', '5605', '75000', '200000',
  '20', '27', '2015', '2024', '2025', '2026', '2027',
]);
const BANNED = [/\bsuccess rate\b/i, /\bguarantee[sd]?\b/i, /\$\s?\d/, /applying from/i, /ما تضمین/, /نرخ موفقیت/];
const FA = '۰۱۲۳۴۵۶۷۸۹';
const normalise = (t) => t.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).replace(/[٬,]/g, '');

let bad = 0;
const slugs = new Set();
for (const art of articles) {
  const { file, ...payload } = art;
  const extra = extras[file];
  if (!extra) { console.error(`${file}: no extra section`); bad++; }
  else {
    // Insert before the closing link paragraph (the last <p> of the body).
    const cut = payload.content.lastIndexOf('\n<p>');
    payload.content = `${payload.content.slice(0, cut)}\n${extra.trim()}\n${payload.content.slice(cut)}`;
  }
  if (slugs.has(payload.slug)) { console.error(`duplicate slug ${payload.slug}`); bad++; }
  slugs.add(payload.slug);

  const text = [payload.title, payload.excerpt, payload.keyTakeaway, payload.summaryEn, payload.content, ...(payload.faq ?? []).flatMap((f) => [f.q, f.a])]
    .join(' ')
    .replace(/<[^>]+>/g, ' ');
  const nums = new Set((normalise(text).match(/\d+/g) ?? []));
  const stray = [...nums].filter((n) => !ALLOWED.has(n));
  if (stray.length) { console.error(`${file}: numbers not in FACTS.md: ${stray.join(', ')}`); bad++; }
  for (const re of BANNED) if (re.test(text)) { console.error(`${file}: banned pattern ${re}`); bad++; }
  if (!/^[a-z0-9-]+$/.test(payload.slug)) { console.error(`${file}: bad slug`); bad++; }
  if (payload.excerpt.length > 600) { console.error(`${file}: excerpt too long`); bad++; }
  if (!payload.internalLinks?.length) { console.error(`${file}: no internal links`); bad++; }

  writeFileSync(join(out, `${file}.json`), `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`${file}: ${payload.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length} words, ${payload.publishAt.slice(0, 10)}`);
}
console.log(bad ? `\n${bad} problem(s)` : `\n${articles.length} articles written to ${out}`);
process.exit(bad ? 1 : 0);
