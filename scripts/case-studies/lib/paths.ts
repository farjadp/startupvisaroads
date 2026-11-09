// Where case material lives on Farjad's Mac. Everything here is OUTSIDE the
// git tree: the repo is public, and full decision texts and client notes must
// never be committed (spec §5 Reproduction, §2 type B).
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

export function caseStudiesDir(): string {
  const fromEnv = process.env.CASE_STUDIES_DIR?.trim();
  return resolve(fromEnv && fromEnv.length > 0 ? fromEnv : join(homedir(), 'VisaRoads-private', 'case-studies'));
}

/** Type B raw notes: ~/VisaRoads-private/cases/<id>/raw.md (spec §6 stage 0). */
export function clientCasesDir(): string {
  const fromEnv = process.env.CLIENT_CASES_DIR?.trim();
  return resolve(fromEnv && fromEnv.length > 0 ? fromEnv : join(homedir(), 'VisaRoads-private', 'cases'));
}

/** "2025 FC 12" -> "2025-fc-12". Throws on anything that is not a neutral FC citation. */
export function citationSlug(citation: string): string {
  const m = /^\s*(\d{4})\s+(FC|CF)\s+(\d{1,5})\s*$/i.exec(citation);
  if (!m) throw new Error(`Not a Federal Court neutral citation: "${citation}" (expected e.g. "2025 FC 12")`);
  return `${m[1]}-fc-${Number(m[3])}`;
}

export function caseDir(citation: string): string {
  return join(caseStudiesDir(), citationSlug(citation));
}

export function ensureDir(dir: string): string {
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** The repo must never be the case folder: refuse a CASE_STUDIES_DIR inside the working tree. */
export function assertOutsideRepo(dir: string): void {
  const repo = resolve(process.cwd());
  const target = resolve(dir);
  if (target === repo || target.startsWith(`${repo}/`)) {
    throw new Error(`Refusing to use ${target}: it is inside the repository (${repo}). Full decision texts and client notes must stay outside git.`);
  }
}
