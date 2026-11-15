// RCIP job-market series, October 2026 data: three reports, en + fa.
//   node content/agent-articles/2026-11-rcip-jobbank/build.mjs [--start 2026-11-16]
//   node scripts/post-agent-article.mjs content/agent-articles/2026-11-rcip-jobbank/out/*.json
//
// --start is the day part 1 is posted. Part 1 carries no publishAt (it goes
// live when posted); parts 2 and 3 are held for the next two days.
//
// The build fails if an article prints a number that is not in
// content/data-reports/2026-10/stats.json (or in EXTRA below, each with its
// reason), names an employer, or contains a banned phrase. It also writes
// review.html: the six drafts and a table of every figure and where it
// comes from.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { S, derived, EDITION } from './lib.mjs';
import { articles as en } from './en.mjs';
import { articles as fa } from './fa.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });

const startArg = process.argv.indexOf('--start');
const start = new Date(`${startArg > 0 ? process.argv[startArg + 1] : '2026-11-16'}T00:00:00Z`);
if (Number.isNaN(start.getTime())) { console.error('--start must be YYYY-MM-DD'); process.exit(2); }
const at = (days, hourUtc) => new Date(start.getTime() + days * 86_400_000 + hourUtc * 3_600_000).toISOString().replace('.000Z', 'Z');
/** English at 14:00 UTC, Persian at 18:00 UTC, as in the earlier series. */
const publishAt = (part, locale) => (part === 1 ? undefined : at(part - 1, locale === 'en' ? 14 : 18));

// ── Where every figure comes from ───────────────────────────────────────────
const FA = '۰۱۲۳۴۵۶۷۸۹';
const normalise = (t) => t.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).replace(/[٬,]/g, '').replace(/٫/g, '.');
const canon = (tok) => String(Number(tok));

const origin = new Map(); // canonical number -> stats.json paths
const note = (value, where) => {
  const k = canon(value);
  if (k === 'NaN') return;
  if (!origin.has(k)) origin.set(k, new Set());
  origin.get(k).add(where);
};
(function walk(v, where) {
  if (typeof v === 'number') note(v, where);
  else if (typeof v === 'string') for (const m of v.match(/\d+(?:\.\d+)?/g) ?? []) note(m, where);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where}[${x && typeof x === 'object' && (x.name || x.noc || x.code || x.title || x.teer != null) ? (x.name ?? x.noc ?? x.code ?? x.title ?? `teer ${x.teer}`) : i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, where ? `${where}.${k}` : k);
})(S, '');
for (const [value, how] of derived) note(value, `computed in the article: ${how}`);

// Numbers that are not statistics. Each has a reason.
const EXTRA = new Map([
  ['2026', 'the year of the data'], ['2027', 'IRCC: permanent program opens 1 January 2027'], ['2025', 'date on the Claresholm list'], ['2022', 'NAICS Canada 2022'], ['2021', 'NOC 2021'],
  ['1', 'part number / 1 January'], ['2', 'part number / TEER'], ['3', 'part number / TEER'], ['0', 'TEER 0'], ['4', 'TEER 4 / CLB 4'], ['5', 'TEER 5 / CLB 5'], ['6', 'CLB 6'],
  ['14', 'the 14 RCIP communities (IRCC)'], ['30', 'IRCC: full time means at least 30 paid hours a week'], ['100', 'per 100 listings'], ['15', 'rows shown in the occupations table'],
]);

const BANNED = [/\bsuccess rate\b/i, /\bguarantee[sd]?\b/i, /applying from/i, /\bfrom (Iran|Canada|Turkey|the UAE)\b/i, /ما تضمین/, /نرخ موفقیت/, /—/, /\bdelve\b/i, /می‌باشد/];
const employerNames = new Set();
{
  // Read only to make sure no employer name leaks; the file stays outside the repo.
  const csv = process.env.RCIP_EMPLOYERS_CSV || '/Users/farjad/Downloads/Work-Studio/webscraper/rcip_all_classified.csv';
  try {
    const rows = readFileSync(csv, 'utf8').split('\n').slice(1);
    for (const r of rows) {
      const m = /^[^,]*,[^,]*,("(?:[^"]|"")*"|[^,]*)/.exec(r);
      const name = m?.[1]?.replace(/^"|"$/g, '').replace(/""/g, '"').trim().toLowerCase();
      // Names that are also common words or town names would match ordinary prose.
      if (name && name.length >= 12 && name.split(/\s+/).length >= 2) employerNames.add(name);
    }
  } catch { console.warn('employer list not found: the name-leak check is skipped'); }
}

let bad = 0;
const fail = (file, msg) => { console.error(`${file}: ${msg}`); bad++; };
const slugs = new Set();
const figures = []; // review table rows
const built = [];

for (const art of [...en, ...fa]) {
  const { file, part, ...payload } = art;
  const when = publishAt(part, payload.locale);
  if (when) payload.publishAt = when;
  payload.topicSeed = `data-report rcip-job-market ${EDITION} part ${part}; sources: Job Bank open data (ESDC), community designated-employer lists, IRCC RCIP pages`;

  if (slugs.has(payload.slug)) fail(file, `duplicate slug ${payload.slug}`);
  slugs.add(payload.slug);
  if (!/^[a-z0-9-]+$/.test(payload.slug)) fail(file, 'bad slug');
  if (!payload.tags.includes('data-report')) fail(file, 'missing the data-report tag');
  if (payload.excerpt.length > 600) fail(file, 'excerpt too long');
  if (payload.title.length > 200) fail(file, 'title too long');
  if ((payload.keyTakeaway ?? '').length > 1200) fail(file, 'keyTakeaway too long');

  const text = [payload.title, payload.excerpt, payload.keyTakeaway, payload.content, ...(payload.faq ?? []).flatMap((q) => [q.q, q.a])]
    .join(' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, (svg) => (svg.match(/aria-label="[^"]*"/) ?? [''])[0]) // chart geometry is not prose; its labels are
    .replace(/<a [^>]+>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const plain = normalise(text);
  for (const tok of new Set(plain.match(/\d+(?:\.\d+)?/g) ?? [])) {
    const k = canon(tok);
    if (origin.has(k)) figures.push({ file, value: tok, from: [...origin.get(k)].slice(0, 3).join(' | '), more: Math.max(0, origin.get(k).size - 3) });
    else if (EXTRA.has(k)) figures.push({ file, value: tok, from: `not a statistic: ${EXTRA.get(k)}`, more: 0 });
    else fail(file, `number not in stats.json: ${tok}`);
  }
  for (const re of BANNED) if (re.test(text)) fail(file, `banned pattern ${re}`);
  if (payload.locale === 'fa' && /[يك]/.test(text)) fail(file, 'Arabic ي/ك in Persian text');
  if (payload.locale === 'fa' && /(?<![A-Za-z$\d.])\d/.test(text.replace(/[A-Za-z][A-Za-z0-9 .\-/()]*\d[\d-]*/g, ' ').replace(/\b\d{5}\b/g, ' ') /* NOC codes stay Latin */)) fail(file, 'Latin digit in Persian prose');
  const lower = text.toLowerCase();
  for (const name of employerNames) if (lower.includes(name)) fail(file, `employer name in text: ${name}`);
  if (/@[a-z0-9-]+\.[a-z]{2,}/i.test(text)) fail(file, 'email address in text');

  writeFileSync(join(out, `${file}.json`), `${JSON.stringify(payload, null, 2)}\n`);
  built.push({ file, part, payload });
  console.log(`${file}: ${text.split(/\s+/).filter(Boolean).length} words, ${payload.publishAt ?? 'publishes when posted'}`);
}

// ── Review page ─────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rows = new Map();
for (const fg of figures) {
  const k = canon(fg.value);
  const r = rows.get(k) ?? { value: fg.value, from: fg.from, more: fg.more, files: new Set() };
  r.files.add(fg.file);
  rows.set(k, r);
}
const O = S.overall, X = S.original;
const review = `<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>بازبینی: گزارش‌های آماری RCIP، اکتبر ۲۰۲۶</title>
<style>
body{font-family:Vazirmatn,Tahoma,sans-serif;line-height:1.9;margin:0;background:#f2f0e9;color:#1a1a1a}
main{max-width:920px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:1.6rem}h2{font-size:1.25rem;margin-top:2.2em;border-top:2px solid #1a1a1a;padding-top:.6em}
table{border-collapse:collapse;width:100%;font-size:.85rem;margin:1em 0;background:#fff}
th,td{border:1px solid #c9c6bd;padding:6px 8px;text-align:start;vertical-align:top}
th{background:#1a1a1a;color:#f2f0e9}
.ltr{direction:ltr;text-align:left;unicode-bidi:plaintext}
details{background:#fff;border:1px solid #c9c6bd;margin:12px 0;padding:8px 16px}
summary{cursor:pointer;font-weight:700}
.draft figure{margin:1.5em 0}.draft figure>div{background:#121417;color:#f2f0e9;padding:20px;display:flex;flex-direction:column;gap:12px}
.draft svg{width:100%;height:auto;overflow:visible}.draft table{font-size:.8rem}
.meta{font-size:.85rem;color:#555}
</style></head><body><main>
<h1>بازبینی: مجموعه‌ی «بازار کار RCIP»، داده‌ی اکتبر ۲۰۲۶</h1>
<p>شش پیش‌نویس (سه انگلیسی، سه فارسی) از <span class="ltr">content/data-reports/${EDITION}/stats.json</span> ساخته شده‌اند. هیچ‌کدام هنوز روی سایت منتشر نشده است. این صفحه را <span class="ltr">build.mjs</span> می‌سازد؛ دستی ویرایشش نکنید.</p>

<h2>عددهای اصلی، پیش و پس از پاک‌سازی</h2>
<table><thead><tr><th>شاخص</th><th>داشبورد اولیه</th><th>پس از پاک‌سازی</th></tr></thead><tbody>
<tr><td>آگهی</td><td>${X.postings}</td><td>${O.postings}</td></tr>
<tr><td>جای خالی</td><td>${X.vacancies}</td><td>${O.vacancies}</td></tr>
<tr><td>میانه‌ی دستمزد (دلار در ساعت)</td><td>${X.median_wage_hr}</td><td>${O.median_wage_hr}</td></tr>
<tr><td>سهم تمام‌وقت</td><td>${X.full_time_share_pct}٪</td><td>${O.full_time_share_pct}٪</td></tr>
<tr><td>آگهی در ۱۰۰ ردیف فهرست</td><td>${X.postings_per_100_listings}</td><td>${O.postings_per_100_listings}</td></tr>
<tr><td>آگهی بدون صنعت</td><td>${X.unknown_industry_postings} (${X.unknown_industry_share_pct}٪)</td><td>${O.unknown_industry_postings} (${O.unknown_industry_share_pct}٪)</td></tr>
<tr><td>شغل اول</td><td class="ltr">NOC ${X.top_occupation.noc}, ${X.top_occupation.postings} postings, median $${X.top_occupation.median_wage_hr}</td><td class="ltr">NOC ${S.occupations[0].noc} (seasonal), then NOC ${S.occupations[1].noc}</td></tr>
<tr><td>آگهی سراسری حذف‌شده</td><td>۰</td><td>${S.templates.postings} در ${S.templates.communities} جامعه</td></tr>
<tr><td>ردیف فهرست کارفرمایان / نام متمایز</td><td>${S.listings.total} («کارفرما»)</td><td>${S.listings.total} ردیف / ${S.listings.unique_employer_names} نام</td></tr>
</tbody></table>

<h2>آگهی‌های سراسری که حذف شدند</h2>
<table class="ltr"><thead><tr><th>Title</th><th>Salary</th><th>In the 14 communities</th><th>National: postings / provinces / cities</th><th>Original ad titles</th></tr></thead><tbody>
${S.templates.signatures.map((t) => `<tr><td>${esc(t.title)}</td><td>${esc(t.salary)}</td><td>${t.postings} postings, ${t.communities} communities</td><td>${t.national_postings} / ${t.national_provinces} / ${t.national_cities}</td><td>${t.original_ad_titles.map(esc).join('<br>')}</td></tr>`).join('\n')}
</tbody></table>
<h2>تکرارهایی که نگه داشته شدند</h2>
<table class="ltr"><thead><tr><th>Title</th><th>Wage</th><th>Postings / communities</th><th>Why kept</th></tr></thead><tbody>
${S.kept_after_review.map((t) => `<tr><td>${esc(t.title)}</td><td>$${t.wage_hr}</td><td>${t.postings} / ${t.communities}</td><td>${esc(t.reason)}</td></tr>`).join('\n')}
</tbody></table>

<h2>زمان‌بندی انتشار</h2>
<table><thead><tr><th>فایل</th><th>نشانی</th><th>انتشار</th></tr></thead><tbody>
${built.map((b) => `<tr><td class="ltr">${b.file}.json</td><td class="ltr">/${b.payload.locale}/blog/${b.payload.slug}</td><td class="ltr">${b.payload.publishAt ?? 'when posted'}</td></tr>`).join('\n')}
</tbody></table>

<h2>شش پیش‌نویس</h2>
${built.map((b) => `<details><summary>${esc(b.payload.title)}</summary>
<p class="meta">${esc(b.payload.excerpt)}</p>
<p class="meta"><strong>${b.payload.locale === 'fa' ? 'پاسخ کوتاه' : 'Key takeaway'}:</strong> ${esc(b.payload.keyTakeaway)}</p>
<div class="draft" dir="${b.payload.locale === 'fa' ? 'rtl' : 'ltr'}" lang="${b.payload.locale}">${b.payload.content}
<h2>${b.payload.locale === 'fa' ? 'پرسش‌های متداول' : 'FAQ'}</h2>${b.payload.faq.map((q) => `<p><strong>${esc(q.q)}</strong><br>${esc(q.a)}</p>`).join('')}</div></details>`).join('\n')}

<h2>هر عدد از کجا آمده است</h2>
<p>هر عددی که در شش متن چاپ شده، با مسیرش در <span class="ltr">stats.json</span>. اگر عددی در آن فایل نباشد، ساخت متوقف می‌شود.</p>
<table class="ltr"><thead><tr><th>Figure</th><th>Where it comes from (stats.json path)</th><th>Used in</th></tr></thead><tbody>
${[...rows.values()].sort((x, y) => Number(canon(normalise(y.value))) - Number(canon(normalise(x.value)))).map((r) => `<tr><td>${esc(canon(r.value))}</td><td>${esc(r.from)}${r.more ? ` (+${r.more} more)` : ''}</td><td>${[...r.files].map((x) => x.replace(/-.*/, '') + x.match(/-(\d)/)[0]).join(', ')}</td></tr>`).join('\n')}
</tbody></table>
</main></body></html>
`;
writeFileSync(join(here, 'review.html'), review);

console.log(bad ? `\n${bad} problem(s)` : `\n${built.length} articles written to ${out}; review page: ${join(here, 'review.html')}`);
process.exit(bad ? 1 : 0);
