// Offline scoring for the Case Studies eval (spec §6 "Eval before the first 5
// publish"). Deterministic: no API key, no network. Imported by run.ts and by
// lib/case-studies/__tests__/eval-offline.test.ts.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkQuote, normaliseForQuote } from '../../../lib/case-studies/quotes';
import { certifiedQuestionFrom, dispositionFromJudgment, remittedFromJudgment } from '../../../lib/case-studies/fc-parser';
import { redact } from '../../../lib/case-studies/anonymise';
import { normaliseFaForMatching } from '../../../lib/case-studies/persian-lint';
import { CASE_A_SECTIONS, type CaseA, type StoredClaim } from '../../../lib/case-studies/claims';
import { gateCase, traceCheck, type Draft } from '../lib/rules';
import { caseDir } from '../lib/paths';

const CASES_DIR = join(process.cwd(), 'scripts/case-studies/eval/cases');
const load = <T>(f: string): T => JSON.parse(readFileSync(join(CASES_DIR, f), 'utf8')) as T;

export type CaseResult = { id: string; category: string; ok: boolean; skipped?: string; detail?: string };

// ------------------------------------------------------------ fc-real

type FcReal = { id: string; category: string; citation: string; labels: { disposition: string; remitted: boolean; certified: string; decisionDate: string; holding: { para: number; quote: string } } };
type Parsed = { paragraphs: Record<number, string>; judgmentText: string | null; analysisStartPara: number | null; decisionDate: string | null };

export function fcRealCases(): FcReal[] {
  return load<{ cases: FcReal[] }>('fc-real.json').cases;
}

export function scoreFcReal(): { results: CaseResult[]; fields: { disposition: number[]; remitted: number[]; certified: number[]; holding: number[] } } {
  const fields = { disposition: [0, 0], remitted: [0, 0], certified: [0, 0], holding: [0, 0] };
  const results: CaseResult[] = [];
  for (const c of fcRealCases()) {
    const file = join(caseDir(c.citation), 'parsed.json');
    if (!existsSync(file)) {
      results.push({ id: c.id, category: c.category, ok: true, skipped: `no private cache at ${file} (run fetch.ts + parse.ts on Farjad's Mac)` });
      continue;
    }
    const p = JSON.parse(readFileSync(file, 'utf8')) as Parsed;
    const j = p.judgmentText ?? '';
    const errs: string[] = [];
    const tally = (k: keyof typeof fields, ok: boolean, msg: string) => {
      fields[k][1]++;
      if (ok) fields[k][0]++;
      else errs.push(msg);
    };
    const disp = dispositionFromJudgment(j);
    tally('disposition', disp === c.labels.disposition, `disposition ${disp} != ${c.labels.disposition}`);
    tally('remitted', remittedFromJudgment(j) === c.labels.remitted, 'remitted mismatch');
    tally('certified', certifiedQuestionFrom(j).status === c.labels.certified, 'certified mismatch');
    const q = checkQuote(p.paragraphs, [c.labels.holding.para], c.labels.holding.quote);
    const inAnalysis = p.analysisStartPara == null || c.labels.holding.para >= p.analysisStartPara;
    tally('holding', q.ok && inAnalysis, q.ok ? 'holding para before analysis section' : `holding quote: ${q.reason}`);
    if (p.decisionDate !== c.labels.decisionDate) errs.push(`decisionDate ${p.decisionDate} != ${c.labels.decisionDate}`);
    results.push({ id: c.id, category: c.category, ok: errs.length === 0, detail: errs.join('; ') || undefined });
  }
  return { results, fields: fields as { disposition: number[]; remitted: number[]; certified: number[]; holding: number[] } };
}

// ------------------------------------------------------------ adversarial

type Adv = {
  id: string;
  category: string;
  judgment: string;
  paragraphs: Record<string, string>;
  analysisStartPara: number | null;
  extracted: Partial<CaseA>;
  expect: { stop: boolean; reasonIncludes?: string; kept?: string[]; dropped?: string[] };
};

export function adversarialCases(): Adv[] {
  return load<{ cases: Adv[] }>('adversarial.json').cases;
}

function toCaseA(e: Partial<CaseA>): CaseA {
  const base: CaseA = {
    citation: '2099 FC 1', courtFile: 'IMM-0000-99', url: 'https://decisions.fct-cf.gc.ca/', decisionDate: '2099-01-01', sha256: '0'.repeat(64), programme: 'other',
    disposition: 'dismissed', dispositionQuote: '', remitted: false, certifiedQuestion: null,
    standardOfReview: [], facts: [], issues: [], holdings: [], officerErred: [], lessons: [],
  };
  return { ...base, ...e } as CaseA;
}

/** unsupported = claims that would reach the page although the case should stop or the claim should drop. */
export function scoreAdversarial(): { results: CaseResult[]; unsupportedPublished: number } {
  const results: CaseResult[] = [];
  let unsupported = 0;
  for (const a of adversarialCases()) {
    const paragraphs = Object.fromEntries(Object.entries(a.paragraphs).map(([k, v]) => [Number(k), v])) as Record<number, string>;
    const g = gateCase(toCaseA(a.extracted), paragraphs, a.judgment, a.analysisStartPara);
    const kept = new Set(CASE_A_SECTIONS.flatMap((s) => g.check.kept[s].map((x) => x.id)));
    const errs: string[] = [];
    if (g.stop !== a.expect.stop) errs.push(`stop=${g.stop}, expected ${a.expect.stop} (${g.reasons.join(' | ') || 'no reasons'})`);
    if (a.expect.reasonIncludes && !g.reasons.some((r) => r.toLowerCase().includes(a.expect.reasonIncludes!.toLowerCase()))) errs.push(`no reason mentions "${a.expect.reasonIncludes}": ${g.reasons.join(' | ')}`);
    for (const id of a.expect.kept ?? []) if (!kept.has(id)) errs.push(`${id} should survive`);
    for (const id of a.expect.dropped ?? []) if (kept.has(id)) errs.push(`${id} should be dropped`);
    if (a.expect.stop && !g.stop) unsupported += kept.size;
    else if (!g.stop) unsupported += (a.expect.dropped ?? []).filter((id) => kept.has(id)).length;
    results.push({ id: a.id, category: a.category, ok: errs.length === 0, detail: errs.join('; ') || undefined });
  }
  return { results, unsupportedPublished: unsupported };
}

// ------------------------------------------------------------ trace

type Mutation = { locale: 'en' | 'fa'; section: number; sentence: number; text: string; claimIds: string[] };
type TraceFile = { partyNames: string[]; claims: StoredClaim[]; base: { en: Draft; fa: Draft }; cases: { id: string; category: string; mutate: Mutation[]; expect: string[] }[] };

export function traceFile(): TraceFile {
  return load<TraceFile>('trace.json');
}

export function scoreTrace(): { results: CaseResult[]; parity: number[] } {
  const t = traceFile();
  const results: CaseResult[] = [];
  const parity = [0, 0];
  for (const c of t.cases) {
    const drafts = JSON.parse(JSON.stringify(t.base)) as { en: Draft; fa: Draft };
    for (const m of c.mutate) drafts[m.locale].sections[m.section].sentences[m.sentence] = { text: m.text, claimIds: m.claimIds };
    const r = traceCheck({ en: drafts.en, fa: drafts.fa, claims: t.claims, partyNames: t.partyNames });
    const got = new Set<string>(r.problems.map((p) => p.kind));
    const want = new Set(c.expect);
    const ok = got.size === want.size && [...want].every((k) => got.has(k));
    // Parity metric: the parity check fires exactly when claim sets differ.
    parity[1]++;
    if (got.has('parity') === want.has('parity')) parity[0]++;
    results.push({ id: c.id, category: c.category, ok, detail: ok ? undefined : `expected [${[...want].join(', ')}], got [${[...got].join(', ')}] ${JSON.stringify(r.problems).slice(0, 300)}` });
  }
  return { results, parity };
}

// ------------------------------------------------------------ type B

type TypeB = { id: string; category: string; names: string[]; terms: string[]; raw: string; planted: string[] };

export function typeBCases(): TypeB[] {
  return load<{ cases: TypeB[] }>('type-b.json').cases;
}

export function scoreTypeB(): { results: CaseResult[]; leaked: number; planted: number } {
  const results: CaseResult[] = [];
  let leaked = 0;
  let planted = 0;
  const fold = (s: string) => normaliseForQuote(normaliseFaForMatching(s)).toLowerCase();
  for (const b of typeBCases()) {
    const out = fold(redact(b.raw, { mode: 'B', names: b.names, terms: b.terms }).text);
    const left = b.planted.filter((p) => out.includes(fold(p)));
    planted += b.planted.length;
    leaked += left.length;
    results.push({ id: b.id, category: b.category, ok: left.length === 0, detail: left.length ? `leaked: ${left.length} item(s) [kinds withheld]` : undefined });
  }
  return { results, leaked, planted };
}

// ------------------------------------------------------------ table

export type Bar = { metric: string; value: string; bar: string; pass: boolean | null };

export function offlineReport(): { bars: Bar[]; results: CaseResult[] } {
  const fc = scoreFcReal();
  const adv = scoreAdversarial();
  const tr = scoreTrace();
  const tb = scoreTypeB();
  const pct = ([a, b]: number[]) => (b === 0 ? 'n/a' : `${((100 * a) / b).toFixed(1)}% (${a}/${b})`);
  const rate = ([a, b]: number[]) => (b === 0 ? null : a / b);
  const advGate = [adv.results.filter((r) => r.ok).length, adv.results.length];
  const dr = rate(fc.fields.disposition);
  const rr = rate(fc.fields.remitted);
  const cr = rate(fc.fields.certified);
  const hr = rate(fc.fields.holding);
  const bars: Bar[] = [
    { metric: 'disposition (fc-real, regex vs label)', value: pct(fc.fields.disposition), bar: '100%', pass: dr === null ? null : dr === 1 },
    { metric: 'remitted (fc-real)', value: pct(fc.fields.remitted), bar: '100%', pass: rr === null ? null : rr === 1 },
    { metric: 'certified question (fc-real)', value: pct(fc.fields.certified), bar: '100%', pass: cr === null ? null : cr === 1 },
    { metric: 'holding label grounded (fc-real)', value: pct(fc.fields.holding), bar: '>= 95%', pass: hr === null ? null : hr >= 0.95 },
    { metric: 'hard-rule gate (adversarial)', value: pct(advGate), bar: '100%', pass: advGate[0] === advGate[1] },
    { metric: 'unsupported claims published', value: String(adv.unsupportedPublished), bar: '0', pass: adv.unsupportedPublished === 0 },
    { metric: 'planted personal data leaked (type B)', value: `${tb.leaked} of ${tb.planted}`, bar: '0', pass: tb.leaked === 0 },
    { metric: 'en/fa claim parity check', value: pct(tr.parity), bar: '100%', pass: tr.parity[0] === tr.parity[1] },
    { metric: 'trace rules detection (stage 8)', value: pct([tr.results.filter((r) => r.ok).length, tr.results.length]), bar: '100%', pass: tr.results.every((r) => r.ok) },
    { metric: 'Persian rubric (live only)', value: 'not run offline', bar: 'mean >= 4/5, none < 3', pass: null },
  ];
  return { bars, results: [...fc.results, ...adv.results, ...tr.results, ...tb.results] };
}
