// Read/write the per-case working files under ~/VisaRoads-private/case-studies/<slug>/.
// Nothing here ever writes inside the repository.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { assertOutsideRepo, caseDir, citationSlug, ensureDir } from './paths';
import { parseDecisionHtml, parseDecisionPdf, type ParsedDecision } from '../../../lib/case-studies/fc-parser';

export type DecisionEntry = { citation: string; route: string; url: string | null; reserve: boolean };

export type FetchMeta = {
  citation: string;
  url: string;
  status: number;
  contentType: string;
  sha256: string;
  fetchedAt: string;
  userAgent?: string;
  method?: string;
  file: string;
};

export type PublicParsed = Omit<ParsedDecision, 'private'>;

export function loadDecisions(): DecisionEntry[] {
  const raw = JSON.parse(readFileSync(join(process.cwd(), 'scripts/case-studies/decisions.json'), 'utf8')) as { decisions: DecisionEntry[] };
  return raw.decisions;
}

export function findDecision(citation: string): DecisionEntry {
  const want = citationSlug(citation);
  const hit = loadDecisions().find((d) => citationSlug(d.citation) === want);
  if (!hit) throw new Error(`${citation} is not in scripts/case-studies/decisions.json`);
  return hit;
}

/** `<route>-<year>-fc-<n>`, e.g. start-up-visa-2025-fc-12. */
export function pageSlug(d: Pick<DecisionEntry, 'route' | 'citation'>): string {
  return `${d.route}-${citationSlug(d.citation)}`;
}

export function hasCache(citation: string): boolean {
  const dir = caseDir(citation);
  return existsSync(join(dir, 'raw.pdf')) || existsSync(join(dir, 'raw.html'));
}

export function workDir(citation: string): string {
  const dir = caseDir(citation);
  assertOutsideRepo(dir);
  return ensureDir(dir);
}

export function readJson<T>(citation: string, name: string): T {
  const file = join(workDir(citation), name);
  if (!existsSync(file)) throw new Error(`Missing ${file}. Run the earlier stage first.`);
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

export function writeJson(citation: string, name: string, value: unknown): string {
  const file = join(workDir(citation), name);
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return file;
}

export function readMeta(citation: string): FetchMeta {
  return readJson<FetchMeta>(citation, 'meta.json');
}

/** Parse the cached raw.html / raw.pdf (fetched, or saved by hand by Farjad). */
export async function parseCached(citation: string): Promise<ParsedDecision> {
  const dir = workDir(citation);
  const html = join(dir, 'raw.html');
  const pdf = join(dir, 'raw.pdf');
  if (existsSync(html)) return parseDecisionHtml(readFileSync(html, 'utf8'));
  if (existsSync(pdf)) return parseDecisionPdf(new Uint8Array(readFileSync(pdf)));
  throw new Error(`No raw.html or raw.pdf in ${dir}. Run fetch.ts, or save the official copy there by hand (docs/engineering/case-studies-pipeline.md).`);
}

export function cliCitations(argv: string[], usage: string): string[] {
  const arg = argv[2];
  if (!arg) throw new Error(`Usage: ${usage}`);
  return arg === '--all' ? loadDecisions().filter((d) => !d.reserve).map((d) => d.citation) : [arg];
}

export function runMain(main: () => Promise<void>): void {
  main().catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
