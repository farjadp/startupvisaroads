// ============================================================================
// scripts/render-cover-samples.ts
// Render sample covers to a folder, to look at them before anything ships.
// No database, no storage, no network.
//
// Faces only come out right where Pango reads fontconfig (Linux, i.e. the
// production image). On a Mac, render inside the production base image:
//   docker run --rm -v "$PWD":/repo -v /tmp/covers:/out node:20-alpine sh -c \
//     'cd /tmp && npm i --silent sharp slugify tsx >/dev/null && cd /repo && \
//      NODE_PATH=/tmp/node_modules /tmp/node_modules/.bin/tsx scripts/render-cover-samples.ts /out'
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { coverSpec, type CoverSubject } from '../lib/cover-art';
import { renderCover } from '../lib/cover-art/render';

const SAMPLES: (CoverSubject & { file: string })[] = [
  { file: 'en-hisp', locale: 'en', category: 'Canada Startup Visa', date: new Date('2026-11-09'), title: 'High Impact Start-up Pilot: What IRCC Has Actually Said So Far' },
  { file: 'en-ee-pnp', locale: 'en', category: 'Work & Skilled Immigration', date: new Date('2026-11-06'), title: 'Express Entry 100,000, provinces 95,000: the 2027 split' },
  { file: 'fa-italy', locale: 'fa', category: 'European Visas', date: new Date('2026-11-08'), title: 'سقف تعداد بنیان‌گذار و تمکن مالی در استارتاپ ویزای ایتالیا' },
  { file: 'en-dutch-banks', locale: 'en', category: 'European Visas', date: new Date('2026-11-07'), title: 'How Iranian Founders Can Overcome Dutch Bank and Sanctions Barriers' },
  { file: 'en-australia', locale: 'en', category: 'Australia Entrepreneurship', date: new Date('2026-11-05'), title: 'How to Build a Scalable Business for Australia’s National Innovation Visa' },
  { file: 'fa-turkey', locale: 'fa', category: 'Life & Family Abroad', date: new Date('2026-11-04'), title: 'ساختار هزینه زندگی در ترکیه برای خانواده مهاجر' },
  { file: 'fa-levels', locale: 'fa', category: 'Work & Skilled Immigration', date: new Date('2026-11-05'), title: 'برنامه سطح مهاجرت کانادا ۲۰۲۷ تا ۲۰۲۹: همه هدف‌ها و تغییرها' },
  { file: 'en-general', locale: 'en', category: 'Mentorship & Business Planning', date: new Date('2026-11-03'), title: 'How to Read a Startup Visa Rejection Letter Before You Reapply' },
];

async function main() {
  const out = process.argv[2] ?? path.join(process.cwd(), 'tmp-cover-samples');
  fs.mkdirSync(out, { recursive: true });
  for (const s of SAMPLES) {
    const spec = coverSpec(s);
    const png = await renderCover(spec);
    fs.writeFileSync(path.join(out, `${s.file}.png`), png);
    console.log(`${s.file}: ${spec.country?.code ?? '—'} · ${spec.label} · ${spec.date} · ${png.length} bytes`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
