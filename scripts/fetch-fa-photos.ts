// ============================================================================
// scripts/fetch-fa-photos.ts
// Real photographs of the four European destinations, from Pexels.
//
// The rest of the Persian imagery is generated (see gen-fa-assets.ts), whose
// art direction is deliberately anonymous: "objects, thresholds, materials —
// never flags or landmarks". Farjad overruled that for the destination
// guides: a reader looking for Denmark should see Denmark.
//
// WHY PEXELS. Its licence allows commercial use with no attribution and no
// share-alike. Wikimedia Commons needs no key, but every usable candidate for
// these four cities is CC BY-SA, which would put a visible credit under each
// photograph and a ShareAlike obligation on our cropped derivatives.
//
// The script does NOT download anything by default. It prints candidates with
// their photographer and page URL so a human can look at them first; only
// --write, with an explicit pick per slot, fetches and converts.
//
//   npx tsx scripts/fetch-fa-photos.ts                    # list candidates
//   npx tsx scripts/fetch-fa-photos.ts denmark finland    # a subset
//   npx tsx scripts/fetch-fa-photos.ts --write            # take the top pick
//   npx tsx scripts/fetch-fa-photos.ts --write --pick denmark=31533        #
//
// Credits are recorded in public/fa/img/credits.json even though the licence
// does not demand them: we should always be able to say where a photograph on
// a trust-first page came from.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

for (const f of ['.env.local', '.env']) {
  if (!fs.existsSync(f)) continue;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const KEY = process.env.PEXELS_API_KEY;
if (!KEY) {
  console.error('PEXELS_API_KEY missing. Get one at https://www.pexels.com/api/ and add it to .env.local:');
  console.error("  echo 'PEXELS_API_KEY=…' >> .env.local");
  process.exit(1);
}

/** One search per image slot. The hero is the identifying shot of the city. */
const SLOTS: Record<string, string> = {
  denmark: 'Nyhavn Copenhagen colorful houses',
  'denmark-2': 'Copenhagen harbour architecture',
  'denmark-3': 'Copenhagen bicycles street',

  finland: 'Helsinki cathedral city',
  'finland-2': 'Helsinki street winter',
  // Was 'Finland lake forest'. Nothing that search returned could be shown to
  // be in Finland — the titles say only "a lake and forests" — and calling a
  // generic lake Finnish in the alt text would be a claim we cannot support,
  // on a site that tells readers unevidenced claims are a warning sign.
  'finland-3': 'Helsinki harbour Finland',

  netherlands: 'Amsterdam canal houses',
  'netherlands-2': 'Amsterdam bicycles bridge canal',
  'netherlands-3': 'Rotterdam modern architecture Netherlands',

  estonia: 'Tallinn old town Estonia',
  'estonia-2': 'Tallinn Estonia street',
  'estonia-3': 'Tallinn rooftops Estonia',

  // Türkiye. The page is about technoparks and a three-year work permit, not
  // tourism, so the second and third slots lean to the working city rather
  // than to minarets at sunset.
  turkey: 'Istanbul Bosphorus city Turkey',
  'turkey-2': 'Istanbul Levent business district skyscrapers',
  'turkey-3': 'Istanbul Turkey ferry Bosphorus commuters',

  // Israel. The guide is about the Innovation Visa, the twelve landing pads
  // and the Israel Innovation Authority — a working-city subject, not a
  // religious or a conflict one. Tel Aviv is where every approved landing pad
  // that has a public address actually sits, so all three slots stay there.
  israel: 'Tel Aviv Israel skyline beach',
  'israel-2': 'Tel Aviv business district towers Israel',
  'israel-3': 'Tel Aviv Israel street cafe',

  // Australia. The guide is about the National Innovation Visa — researchers
  // and critical-technology founders, not tourism — so only the hero is the
  // identifying harbour shot; the other two are the working city.
  australia: 'Sydney Opera House harbour Australia',
  'australia-2': 'Sydney central business district skyscrapers Australia',
  'australia-3': 'Melbourne Australia city street tram',
};

type Photo = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt: string | null;
  src: { original: string; large2x: string };
};

async function search(query: string): Promise<Photo[]> {
  const u = new URL('https://api.pexels.com/v1/search');
  u.searchParams.set('query', query);
  u.searchParams.set('orientation', 'landscape');
  u.searchParams.set('per_page', '5');
  const res = await fetch(u, { headers: { Authorization: KEY! } });
  if (!res.ok) throw new Error(`pexels ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return ((await res.json()) as { photos: Photo[] }).photos;
}

async function download(photo: Photo, name: string, outDir: string): Promise<number> {
  const res = await fetch(photo.src.original);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`not an image: ${type}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(outDir, `${name}.webp`);
  // 1600px wide matches what the generated assets ship at, so page weight
  // does not change when a photograph replaces a generated scene.
  await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);
  return fs.statSync(out).size;
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const picks = new Map<string, number>();
  for (const a of args) {
    const m = a.match(/^--pick=?(.+)=(\d+)$/) || a.match(/^(.+)=(\d+)$/);
    if (m) picks.set(m[1].replace(/^--pick/, ''), Number(m[2]));
  }
  const only = args.filter((a) => !a.startsWith('--') && !a.includes('='));
  const outDir = path.join('public', 'fa', 'img');
  fs.mkdirSync(outDir, { recursive: true });

  const creditsPath = path.join(outDir, 'credits.json');
  const credits: Record<string, unknown> = fs.existsSync(creditsPath)
    ? JSON.parse(fs.readFileSync(creditsPath, 'utf8'))
    : {};

  for (const [name, query] of Object.entries(SLOTS)) {
    if (only.length && !only.some((o) => name === o || name.startsWith(`${o}-`))) continue;
    let photos: Photo[];
    try {
      photos = await search(query);
    } catch (e) {
      console.log(`FAILED ${name}: ${(e as Error).message}`);
      continue;
    }
    if (!photos.length) { console.log(`none   ${name} — no result for "${query}"`); continue; }

    if (!write) {
      console.log(`\n${name}  ← "${query}"`);
      for (const p of photos) {
        console.log(`  ${String(p.id).padEnd(9)} ${String(p.width).padStart(5)}x${String(p.height).padEnd(5)} ${p.photographer.slice(0, 22).padEnd(24)} ${p.url}`);
      }
      continue;
    }

    const chosen = picks.has(name) ? photos.find((p) => p.id === picks.get(name)) : photos[0];
    if (!chosen) { console.log(`FAILED ${name}: picked id not in the first five results`); continue; }
    process.stdout.write(`write  ${name} ← ${chosen.id} … `);
    try {
      const size = await download(chosen, name, outDir);
      credits[name] = {
        source: 'Pexels',
        id: chosen.id,
        page: chosen.url,
        photographer: chosen.photographer,
        photographerUrl: chosen.photographer_url,
        description: chosen.alt,
        fetched: new Date().toISOString().slice(0, 10),
      };
      console.log(`${(size / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.log(`FAILED ${(e as Error).message}`);
    }
  }

  if (write) {
    fs.writeFileSync(creditsPath, `${JSON.stringify(credits, null, 2)}\n`);
    console.log(`\ncredits → ${creditsPath}`);
    console.log('NEXT: the alt text in content/fa/europe-*.ts still describes the generated scenes.');
    console.log('      It must be rewritten to describe these photographs before this ships.');
  }
}
main();
