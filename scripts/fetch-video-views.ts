// ============================================================================
// scripts/fetch-video-views.ts
// Read the public view count of every video in content/fa/videos.ts and print
// the `views` lines to paste back in.
//
// WHY A FLOOR, NOT A FIGURE. View counts only ever go up, so a number checked
// today is still *true* months later — it just understates. That is the safe
// direction to be wrong in, and it is why the UI renders «بیش از ۱۳ هزار
// بازدید» rounded DOWN rather than an exact count that quietly rots.
//
// WHY SCRAPING AND NOT THE DATA API. The YouTube Data API needs a key and a
// quota for one integer per video. The watch page carries `viewCount` in its
// initial payload. It is polite about it: one request at a time, with a pause,
// because firing two dozen at once gets you a consent interstitial instead.
//
//   npx tsx scripts/fetch-video-views.ts
//   npx tsx scripts/fetch-video-views.ts --json     # machine-readable
// ============================================================================
import { VIDEOS } from '../content/fa/videos';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function viewsFor(id: string, attempt = 1): Promise<number | null> {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
  });
  if (!res.ok) return attempt < 3 ? (await sleep(3000 * attempt), viewsFor(id, attempt + 1)) : null;
  const html = await res.text();
  const m = html.match(/"viewCount":"(\d+)"/);
  if (!m) return attempt < 3 ? (await sleep(3000 * attempt), viewsFor(id, attempt + 1)) : null;
  return Number(m[1]);
}

async function main() {
  const json = process.argv.includes('--json');
  const out: Record<string, number> = {};
  for (const v of VIDEOS) {
    const n = await viewsFor(v.id);
    if (n === null) {
      console.error(`FAILED ${v.id}`);
    } else {
      out[v.id] = n;
      if (!json) console.log(`${v.id.padEnd(13)} ${String(n).padStart(8)}  ${v.title.slice(0, 50)}`);
    }
    await sleep(1200);
  }
  if (json) console.log(JSON.stringify(out, null, 2));
  console.error(`\n${Object.keys(out).length}/${VIDEOS.length} read. Update VIEWS_CHECKED when you paste these in.`);
}
main();
