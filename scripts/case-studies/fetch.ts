// Stage 1: fetch a Federal Court decision from decisions.fct-cf.gc.ca.
//
//   npx tsx scripts/case-studies/fetch.ts --citation "2025 FC 12" --url https://decisions.fct-cf.gc.ca/fc-cf/decisions/en/527166/1/document.do
//   npx tsx scripts/case-studies/fetch.ts --spec10          # the five decisions in spec §10
//   npx tsx scripts/case-studies/fetch.ts --robots-only
//
// Rules (spec §5 Fetching), all enforced here:
// - one host only (hard allowlist), https only;
// - robots.txt is fetched and honoured before any decision URL;
// - an identifying User-Agent, never a browser UA, no spoofed headers;
// - at most one request per CASE_STUDIES_FETCH_INTERVAL_MS (floor 5000 ms), across runs;
// - a 403 or 429 stops the run and prints the manual-download steps. No retry with other headers.
// Output goes to CASE_STUDIES_DIR/<citation-slug>/ (outside git): raw.html|raw.pdf + meta.json.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { assertOutsideRepo, caseDir, caseStudiesDir, citationSlug, ensureDir } from './lib/paths';
import { robotsAllows } from './lib/robots';

export const ALLOWED_HOST = 'decisions.fct-cf.gc.ca';
export const USER_AGENT_TOKEN = 'VisaRoadsCaseStudies';
const USER_AGENT = process.env.CASE_STUDIES_USER_AGENT?.trim() || `${USER_AGENT_TOKEN}/0.1 (+https://visaroads.com/contact)`;
const MIN_INTERVAL_MS = 5000;
const INTERVAL_MS = Math.max(MIN_INTERVAL_MS, Number(process.env.CASE_STUDIES_FETCH_INTERVAL_MS) || MIN_INTERVAL_MS);
const TIMEOUT_MS = 30_000;

if (!USER_AGENT.startsWith(USER_AGENT_TOKEN) || /mozilla|chrome|safari|applewebkit|gecko/i.test(USER_AGENT)) {
  throw new Error('CASE_STUDIES_USER_AGENT must identify VisaRoadsCaseStudies and must not imitate a browser.');
}

export class FetchStop extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

export function assertAllowedUrl(raw: string): URL {
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error(`Not a URL: ${raw}`); }
  if (url.protocol !== 'https:') throw new Error(`Only https is allowed: ${raw}`);
  if (url.hostname !== ALLOWED_HOST || url.port || url.username || url.password) {
    throw new Error(`Host not allowed: ${url.hostname}. The pipeline fetches from ${ALLOWED_HOST} only (never CanLII).`);
  }
  return url;
}

async function waitForSlot(): Promise<void> {
  const root = ensureDir(caseStudiesDir());
  const stamp = join(root, '.last-request');
  const last = existsSync(stamp) ? Number(readFileSync(stamp, 'utf8')) : 0;
  const wait = last + INTERVAL_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  writeFileSync(stamp, String(Date.now()));
}

type Got = { status: number; contentType: string; body: Buffer };

async function politeGet(url: URL): Promise<Got> {
  await waitForSlot();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'manual',
      signal: controller.signal,
    });
    const body = Buffer.from(await res.arrayBuffer());
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location') ?? '';
      // Follow only same-host redirects, and only through the same checks.
      const next = assertAllowedUrl(new URL(loc, url).toString());
      return politeGet(next);
    }
    return { status: res.status, contentType: res.headers.get('content-type') ?? '', body };
  } catch (err) {
    if (err instanceof FetchStop) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Network error fetching ${url}: ${msg}`);
  } finally {
    clearTimeout(timer);
  }
}

export function manualDownloadSteps(citation: string, url: string): string {
  const dir = (() => { try { return caseDir(citation); } catch { return join(caseStudiesDir(), '<citation-slug>'); } })();
  return [
    `Manual download for ${citation}:`,
    `  1. Open ${url} in your normal browser.`,
    `  2. Save the page as "Web Page, HTML Only" to ${join(dir, 'raw.html')}`,
    `     (or use the Court's PDF link and save it as ${join(dir, 'raw.pdf')}).`,
    `  3. Run: npx tsx scripts/case-studies/pipeline.ts parse --citation "${citation}" --url "${url}" --manual`,
    '  The parser records sha256 and the file time as fetchedAt (method: manual).',
  ].join('\n');
}

export type RobotsCache = { text: string; status: number; fetchedAt: string };

export async function loadRobots(force = false): Promise<RobotsCache> {
  const root = ensureDir(caseStudiesDir());
  const file = join(root, '_robots.json');
  if (!force && existsSync(file)) {
    const cached = JSON.parse(readFileSync(file, 'utf8')) as RobotsCache;
    if (Date.now() - Date.parse(cached.fetchedAt) < 24 * 3600 * 1000) return cached;
  }
  const got = await politeGet(assertAllowedUrl(`https://${ALLOWED_HOST}/robots.txt`));
  console.log(`robots.txt -> HTTP ${got.status} (UA: ${USER_AGENT})`);
  if (got.status === 403 || got.status === 429) {
    throw new FetchStop(`robots.txt returned ${got.status}. The identified client is refused; use the manual path.`, got.status);
  }
  // RFC 9309: 4xx (other than 429) means no restrictions; 5xx means assume full disallow.
  if (got.status >= 500) throw new FetchStop(`robots.txt returned ${got.status}; treating the site as disallowed for now.`, got.status);
  const cache: RobotsCache = { text: got.status === 200 ? got.body.toString('utf8') : '', status: got.status, fetchedAt: new Date().toISOString() };
  writeFileSync(file, JSON.stringify(cache, null, 2));
  return cache;
}

export type FetchMeta = {
  citation: string; url: string; status: number; contentType: string; sha256: string;
  fetchedAt: string; userAgent: string; method: 'fetch' | 'manual'; file: string;
};

export async function fetchDecision(citation: string, rawUrl: string): Promise<FetchMeta> {
  const url = assertAllowedUrl(rawUrl);
  citationSlug(citation);
  const robots = await loadRobots();
  const verdict = robotsAllows(robots.text, USER_AGENT_TOKEN, url.pathname + url.search);
  if (!verdict.allowed) throw new Error(`robots.txt disallows ${url.pathname} (${verdict.matchedRule}). Pick another decision; we never fetch blocked items.`);
  const dir = ensureDir(caseDir(citation));
  assertOutsideRepo(dir);
  const got = await politeGet(url);
  console.log(`${citation} -> HTTP ${got.status} ${got.contentType} (UA: ${USER_AGENT})`);
  if (got.status === 403 || got.status === 429) {
    throw new FetchStop(`${citation}: HTTP ${got.status}. Stopping; not retrying with other headers.\n${manualDownloadSteps(citation, rawUrl)}`, got.status);
  }
  if (got.status !== 200) throw new Error(`${citation}: HTTP ${got.status} from ${rawUrl}`);
  const isPdf = /pdf/i.test(got.contentType) || got.body.subarray(0, 5).toString() === '%PDF-';
  const file = join(dir, isPdf ? 'raw.pdf' : 'raw.html');
  writeFileSync(file, got.body);
  const meta: FetchMeta = {
    citation, url: rawUrl, status: got.status, contentType: got.contentType,
    sha256: createHash('sha256').update(got.body).digest('hex'),
    fetchedAt: new Date().toISOString(), userAgent: USER_AGENT, method: 'fetch', file,
  };
  writeFileSync(join(dir, 'meta.json'), JSON.stringify(meta, null, 2));
  return meta;
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  if (process.argv.includes('--robots-only')) {
    const r = await loadRobots(true);
    console.log(`robots.txt status ${r.status}, ${r.text.length} bytes, cached at ${r.fetchedAt}`);
    console.log(r.text.slice(0, 2000));
    return;
  }
  const items: { citation: string; url: string }[] = [];
  if (process.argv.includes('--spec10')) {
    const list = JSON.parse(readFileSync(join(process.cwd(), 'scripts/case-studies/decisions.json'), 'utf8')) as {
      decisions: { citation: string; url: string | null; reserve: boolean }[];
    };
    for (const d of list.decisions) if (d.url && !d.reserve) items.push({ citation: d.citation, url: d.url });
  } else {
    const citation = arg('citation');
    const url = arg('url');
    if (!citation || !url) throw new Error('Usage: fetch.ts --citation "2025 FC 12" --url <official decision URL> | --spec10 | --robots-only');
    items.push({ citation, url });
  }
  for (const item of items) {
    const meta = await fetchDecision(item.citation, item.url);
    console.log(`saved ${meta.file} sha256=${meta.sha256}`);
  }
}

const isMain = process.argv[1] && /fetch\.ts$/.test(process.argv[1]);
if (isMain) {
  main().catch((err: unknown) => {
    if (err instanceof FetchStop) {
      console.error(err.message);
      process.exit(3);
    }
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
