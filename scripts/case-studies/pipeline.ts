// Case Studies pipeline, stages 3-10 (spec §6). Stage 1 is fetch.ts, stage 2 parse.ts.
// Every stage reads and writes JSON in ~/VisaRoads-private/case-studies/<slug>/
// (outside git) so each step can be re-run and inspected on its own.
//
// Usage:
//   npx tsx scripts/case-studies/pipeline.ts <stage> "<citation>"
//   stages: extract | ground | anonymise | write-en | write-fa | trace | payload | post | all
//   npx tsx scripts/case-studies/pipeline.ts redact-b <client-case-id>   (stage 0, type B)
//
// Env: CASE_STUDIES_PROVIDER (gemini default | claude), GEMINI_API_KEY or ANTHROPIC_API_KEY (model stages only), CASE_STUDIES_MODEL_EXTRACT / _WRITE / _VERIFY,
//      CASE_STUDIES_DIR, CLIENT_CASES_DIR, CASE_STUDIES_POST_URL, AGENT_REPORTS_TOKEN.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MODELS, callJson, fence, loadPrompt, type Usage } from './lib/anthropic';
import { findDecision, pageSlug, readJson, readMeta, runMain, writeJson, type PublicParsed } from './lib/case-files';
import { gateCase, renderHtml, traceCheck, type Draft } from './lib/rules';
import { deadlineOrderFromJudgment } from '../../lib/case-studies/fc-parser';
import { clientCasesDir, assertOutsideRepo } from './lib/paths';
import { CASE_A_SECTIONS, CLAIM_A_KINDS, PROGRAMMES, SPEAKERS, allClaims, toStoredClaim, validateCaseA, type CaseA, type StoredClaim } from '../../lib/case-studies/claims';
import { findPii, redact } from '../../lib/case-studies/anonymise';
import { courtOutcome, type CaseOutcome } from '../../lib/case-studies/outcomes';
import { DISCLAIMERS } from '../../lib/case-studies/redlines';
import type { PrivateParties } from '../../lib/case-studies/fc-parser';

// ------------------------------------------------------------------ schemas

const claimSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'kind', 'text', 'paras', 'quote', 'speaker', 'external', 'basedOn'],
  properties: {
    id: { type: 'string' },
    kind: { type: 'string', enum: [...CLAIM_A_KINDS] },
    text: { type: 'string' },
    paras: { type: 'array', items: { type: 'integer' } },
    quote: { type: 'string' },
    speaker: { type: 'string', enum: [...SPEAKERS] },
    external: { type: 'boolean' },
    basedOn: { type: 'array', items: { type: 'string' } },
  },
};
const claimList = { type: 'array', items: claimSchema };
const EXTRACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['programme', 'disposition', 'dispositionQuote', 'remitted', 'certifiedQuestion', ...CASE_A_SECTIONS],
  properties: {
    programme: { type: 'string', enum: [...PROGRAMMES] },
    disposition: { type: 'string', enum: ['allowed', 'dismissed'] },
    dispositionQuote: { type: 'string' },
    remitted: { type: 'boolean' },
    certifiedQuestion: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    ...Object.fromEntries(CASE_A_SECTIONS.map((s) => [s, claimList])),
  },
};
const VERIFY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: { type: 'object', additionalProperties: false, required: ['id', 'entailed', 'reason'], properties: { id: { type: 'string' }, entailed: { type: 'boolean' }, reason: { type: 'string' } } },
    },
  },
};
const sentence = { type: 'object', additionalProperties: false, required: ['text', 'claimIds'], properties: { text: { type: 'string' }, claimIds: { type: 'array', items: { type: 'string' } } } };
const DRAFT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'excerpt', 'keyTakeaway', 'sections', 'faq'],
  properties: {
    title: { type: 'string' },
    excerpt: { type: 'string' },
    keyTakeaway: { type: 'string' },
    sections: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['heading', 'sentences'], properties: { heading: { type: 'string' }, sentences: { type: 'array', items: sentence } } } },
    faq: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['q', 'a', 'claimIds'], properties: { q: { type: 'string' }, a: { type: 'string' }, claimIds: { type: 'array', items: { type: 'string' } } } } },
  },
};

// ------------------------------------------------------------------ helpers

type RunLog = { stage: string; model: string; prompt: string; usage: Usage; at: string };
function logRun(citation: string, entry: RunLog): void {
  let runs: RunLog[] = [];
  try {
    runs = readJson<RunLog[]>(citation, 'runs.json');
  } catch {
    /* first run */
  }
  runs.push(entry);
  writeJson(citation, 'runs.json', runs);
}

function numbered(paragraphs: Record<number, string>, only?: Set<number>): string {
  return Object.entries(paragraphs)
    .filter(([n]) => !only || only.has(Number(n)))
    .map(([n, t]) => `[${n}] ${t}`)
    .join('\n\n');
}

function partyNames(citation: string): string[] {
  const p = readJson<PrivateParties>(citation, 'parties.private.json');
  return p.partyNames ?? [];
}

function stop(citation: string, reasons: string[]): never {
  writeJson(citation, 'STOPPED.json', { at: new Date().toISOString(), reasons });
  throw new Error(`${citation}: case STOPPED (no repair, no publish):\n - ${reasons.join('\n - ')}`);
}

// ------------------------------------------------------------------ stages

async function extract(citation: string): Promise<void> {
  const parsed = readJson<PublicParsed>(citation, 'parsed.json');
  const meta = readMeta(citation);
  const prompt = loadPrompt('extract.v1');
  const user = [
    `Citation: ${parsed.citation ?? citation}. Analysis section starts at paragraph ${parsed.analysisStartPara ?? 'unknown'}.`,
    fence('judgment', parsed.judgmentText ?? '(no JUDGMENT block parsed)'),
    fence('decision', numbered(parsed.paragraphs)),
  ].join('\n\n');
  const res = await callJson<Omit<CaseA, 'citation' | 'courtFile' | 'url' | 'decisionDate' | 'sha256'>>({
    model: MODELS.extract(),
    system: prompt.text,
    user,
    schema: EXTRACT_SCHEMA,
    maxTokens: 16000,
    effort: 'high',
  });
  const caseA = {
    citation: parsed.citation ?? citation,
    courtFile: parsed.courtFile ?? '',
    url: meta.url,
    decisionDate: parsed.decisionDate ?? '',
    sha256: meta.sha256,
    ...res.value,
  };
  const v = validateCaseA(caseA);
  if (!v.ok) stop(citation, [`extraction failed schema validation: ${v.errors.slice(0, 5).join('; ')}`]);
  writeJson(citation, 'extract.json', caseA);
  logRun(citation, { stage: 'extract', model: res.model, prompt: prompt.id, usage: res.usage, at: new Date().toISOString() });
  console.log(`${citation}: extracted ${allClaims(caseA).length} claims with ${res.model}`);
}

async function ground(citation: string): Promise<void> {
  const parsed = readJson<PublicParsed>(citation, 'parsed.json');
  const c = readJson<CaseA>(citation, 'extract.json');
  const gate = gateCase(c, parsed.paragraphs, parsed.judgmentText, parsed.analysisStartPara);
  if (gate.stop) stop(citation, gate.reasons);
  const kept = gate.check.kept;

  // Entailment (Haiku): one call for all surviving claims.
  const claims = allClaims(kept);
  const cited = new Set(claims.flatMap((x) => x.paras));
  const prompt = loadPrompt('verify.v1');
  const res = await callJson<{ verdicts: { id: string; entailed: boolean; reason: string }[] }>({
    model: MODELS.verify(),
    system: prompt.text,
    user: [fence('paragraphs', numbered(parsed.paragraphs, cited)), fence('claims', JSON.stringify(claims.map(({ id, text, paras, quote, speaker }) => ({ id, text, paras, quote, speaker }))))].join('\n\n'),
    schema: VERIFY_SCHEMA,
    maxTokens: 4000,
  });
  logRun(citation, { stage: 'ground', model: res.model, prompt: prompt.id, usage: res.usage, at: new Date().toISOString() });
  const verdict = new Map(res.value.verdicts.map((v) => [v.id, v]));
  const failed = claims.filter((x) => verdict.get(x.id)?.entailed !== true);
  const failedIds = new Set(failed.map((x) => x.id));
  const reasons = failed.filter((x) => x.kind === 'holding').map((x) => `holding ${x.id} not entailed: ${verdict.get(x.id)?.reason ?? 'no verdict'}`);
  if (reasons.length) stop(citation, reasons);
  const grounded: CaseA = { ...kept };
  for (const s of CASE_A_SECTIONS) grounded[s] = kept[s].filter((x) => !failedIds.has(x.id) && !(x.basedOn ?? []).some((b) => failedIds.has(b)));
  writeJson(citation, 'grounded.json', grounded);
  writeJson(citation, 'ground-report.json', { dropped: [...gate.check.dropped, ...failed.map((x) => ({ id: x.id, reason: `not entailed: ${verdict.get(x.id)?.reason ?? 'no verdict'}` }))] });
  console.log(`${citation}: ${allClaims(grounded).length} claims grounded, ${gate.check.dropped.length + failed.length} dropped`);
}

async function anonymise(citation: string): Promise<void> {
  const c = readJson<CaseA>(citation, 'grounded.json');
  const parsed = readJson<PublicParsed>(citation, 'parsed.json');
  const names = partyNames(citation);
  const allow = parsed.judge ? [`Justice ${parsed.judge}`, parsed.judge] : [];
  const drop = new Set<string>();
  const notes: string[] = [];
  for (const x of allClaims(c)) {
    const hits = findPii(`${x.text}\n${x.quote}`, { mode: 'A', names, allow }).filter((f) => f.severity === 'block');
    if (hits.length) {
      drop.add(x.id);
      notes.push(`${x.id}: ${[...new Set(hits.map((h) => h.kind))].join(', ')}`);
    }
  }
  const holdingsLost = c.holdings.filter((h) => drop.has(h.id));
  if (holdingsLost.length && holdingsLost.length === c.holdings.length) stop(citation, [`every holding carries identifying data (${notes.join('; ')}); re-extract with a different quote`]);
  const out: CaseA = { ...c };
  for (const s of CASE_A_SECTIONS) out[s] = c[s].filter((x) => !drop.has(x.id));
  // The Court's order (e.g. a mandamus deadline) lives in the JUDGMENT block,
  // which has no paragraph number; add it as a deterministic, verbatim claim.
  const order = deadlineOrderFromJudgment(parsed.judgmentText);
  if (order && !out.holdings.some((h) => h.source === 'judgment')) {
    out.holdings = [...out.holdings, {
      id: 'o1', kind: 'holding', speaker: 'court', paras: [], source: 'judgment', external: false, basedOn: [],
      text: `The Court ordered that a decision be made on the application within ${order.days} days of the judgment.`,
      quote: order.quote,
    }];
  }
  writeJson(citation, 'claims.json', out);
  console.log(`${citation}: anonymised; ${drop.size} claim(s) dropped for identifying data${notes.length ? ` (${notes.join('; ')})` : ''}`);
}

function caseHeader(citation: string, c: CaseA): string {
  const d = findDecision(citation);
  const parsed = readJson<PublicParsed>(citation, 'parsed.json');
  return JSON.stringify({ citation: c.citation, court: 'Federal Court of Canada', decisionDate: c.decisionDate, route: d.route, outcome: courtOutcome(c.disposition, parsed.judgmentText), remitted: c.remitted, certifiedQuestion: c.certifiedQuestion });
}

async function write(citation: string, locale: 'en' | 'fa'): Promise<void> {
  const c = readJson<CaseA>(citation, 'claims.json');
  const claims = allClaims(c).map(({ id, kind, text, paras }) => ({ id, kind, text, paras }));
  // Stage 7 is fed the same claims as stage 6 and never the English draft.
  const prompt = loadPrompt(locale === 'en' ? 'write-en.v2' : 'write-fa.v2');
  const res = await callJson<Draft>({
    model: MODELS.write(),
    system: prompt.text,
    user: [fence('case', caseHeader(citation, c)), fence('claims', JSON.stringify(claims))].join('\n\n'),
    schema: DRAFT_SCHEMA,
    maxTokens: 12000,
    effort: 'medium',
  });
  writeJson(citation, `draft.${locale}.json`, { ...res.value, aiModel: res.model, prompt: prompt.id });
  logRun(citation, { stage: `write-${locale}`, model: res.model, prompt: prompt.id, usage: res.usage, at: new Date().toISOString() });
  console.log(`${citation}: ${locale} draft written with ${res.model}`);
}

function storedClaims(c: CaseA): StoredClaim[] {
  return allClaims(c).map((x) => ({ ...toStoredClaim(x), verified: false }));
}

async function trace(citation: string): Promise<void> {
  const c = readJson<CaseA>(citation, 'claims.json');
  const parsed = readJson<PublicParsed>(citation, 'parsed.json');
  const en = readJson<Draft>(citation, 'draft.en.json');
  const fa = readJson<Draft>(citation, 'draft.fa.json');
  const r = traceCheck({ en, fa, claims: storedClaims(c), partyNames: partyNames(citation), judge: parsed.judge });
  writeJson(citation, 'trace.json', r);
  if (!r.ok) stop(citation, r.problems.map((p) => JSON.stringify(p)));
  console.log(`${citation}: trace and rules passed (parity, inventedNumbers=[], red lines 0, fa lint 0, no party names)`);
}

export type CaseStudyBody = {
  groupKey: string;
  locale: 'en' | 'fa';
  slug: string;
  type: 'FC_DECISION' | 'CLIENT_CASE';
  title: string;
  excerpt?: string;
  content: string;
  keyTakeaway?: string;
  summaryEn?: string;
  court?: string;
  citation?: string;
  decisionDate?: string;
  judge?: string;
  route: string;
  country?: string;
  outcome?: CaseOutcome;
  officialUrl?: string;
  issues?: unknown[];
  lessons?: unknown[];
  claims: StoredClaim[];
  faq?: { q: string; a: string }[];
  sourceSha256?: string;
  fetchedAt?: string;
  certifiedQuestion?: string | null;
  consentRecordId?: string;
  aiModel?: string;
};

async function payload(citation: string): Promise<void> {
  const trace = readJson<{ ok: boolean }>(citation, 'trace.json');
  if (!trace.ok) stop(citation, ['trace.json is not ok; run trace first']);
  const c = readJson<CaseA>(citation, 'claims.json');
  const parsed = readJson<PublicParsed>(citation, 'parsed.json');
  const meta = readMeta(citation);
  const d = findDecision(citation);
  const slug = pageSlug(d);
  const claims = storedClaims(c);
  const bodies: CaseStudyBody[] = (['en', 'fa'] as const).map((locale) => {
    const draft = readJson<Draft & { aiModel?: string }>(citation, `draft.${locale}.json`);
    const disclaimer = locale === 'en' ? DISCLAIMERS.courtEn : DISCLAIMERS.courtFa;
    return {
      groupKey: slug,
      locale,
      slug,
      type: 'FC_DECISION',
      title: draft.title,
      excerpt: draft.excerpt,
      content: renderHtml(draft, locale, claims, disclaimer),
      keyTakeaway: draft.keyTakeaway,
      ...(locale === 'fa' ? { summaryEn: readJson<Draft>(citation, 'draft.en.json').excerpt } : {}),
      court: 'Federal Court of Canada',
      citation: c.citation,
      decisionDate: c.decisionDate ? new Date(`${c.decisionDate}T00:00:00Z`).toISOString() : undefined,
      judge: parsed.judge ?? undefined,
      route: d.route,
      country: 'canada',
      outcome: courtOutcome(c.disposition, parsed.judgmentText),
      officialUrl: meta.url,
      issues: c.issues.map((x) => x.id),
      lessons: c.lessons.map((x) => x.id),
      claims,
      faq: draft.faq.map(({ q, a }) => ({ q, a })),
      sourceSha256: meta.sha256,
      fetchedAt: meta.fetchedAt,
      certifiedQuestion: c.certifiedQuestion,
      aiModel: draft.aiModel,
    };
  });
  writeJson(citation, 'payload.json', bodies);
  console.log(`${citation}: payload built for ${slug} (en + fa, ${claims.length} claims, all verified=false)`);
}

async function post(citation: string): Promise<void> {
  const token = process.env.AGENT_REPORTS_TOKEN?.trim();
  if (!token) throw new Error('AGENT_REPORTS_TOKEN is not set.');
  const base = process.env.CASE_STUDIES_POST_URL?.trim() || 'http://localhost:3000';
  const bodies = readJson<CaseStudyBody[]>(citation, 'payload.json');
  for (const body of bodies) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30_000);
    try {
      const res = await fetch(`${base}/api/agent-case-studies`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`POST ${body.locale} ${body.slug} -> ${res.status}: ${text.slice(0, 300)}`);
      console.log(`${citation}: posted ${body.locale} ${body.slug} -> ${res.status} (IN_REVIEW; Farjad approves in admin)`);
    } finally {
      clearTimeout(timer);
    }
  }
}

/** Stage 0 (type B): pre-redact raw notes on this Mac. Never prints the notes. */
function redactB(id: string): void {
  if (!/^[a-z0-9-]+$/i.test(id)) throw new Error('client case id must be [a-z0-9-]');
  const dir = join(clientCasesDir(), id);
  assertOutsideRepo(dir);
  const raw = join(dir, 'raw.md');
  if (!existsSync(raw)) throw new Error(`No ${raw}. Type B notes are only read from ~/VisaRoads-private/cases/<id>/raw.md.`);
  const cfgFile = join(dir, 'names.json');
  const cfg = existsSync(cfgFile) ? (JSON.parse(readFileSync(cfgFile, 'utf8')) as { names?: string[]; terms?: string[] }) : {};
  const r = redact(readFileSync(raw, 'utf8'), { mode: 'B', names: cfg.names ?? [], terms: cfg.terms ?? [] });
  writeFileSync(join(dir, 'redacted.md'), r.text, 'utf8');
  const left = findPii(r.text, { mode: 'B', names: cfg.names ?? [], terms: cfg.terms ?? [] });
  const kinds = r.findings.reduce<Record<string, number>>((acc, f) => ((acc[f.kind] = (acc[f.kind] ?? 0) + 1), acc), {});
  console.log(`${id}: redacted ${r.findings.length} item(s) ${JSON.stringify(kinds)}; second pass found ${left.length}. Wrote redacted.md (contents not printed).`);
  if (left.length) process.exit(2);
}

const STAGES: Record<string, (c: string) => Promise<void>> = {
  extract,
  ground,
  anonymise,
  'write-en': (c) => write(c, 'en'),
  'write-fa': (c) => write(c, 'fa'),
  trace,
  payload,
  post,
};

runMain(async () => {
  const [stage, arg] = process.argv.slice(2);
  if (stage === 'redact-b') return redactB(arg ?? '');
  if (!stage || !arg) throw new Error('Usage: pipeline.ts <extract|ground|anonymise|write-en|write-fa|trace|payload|post|all> "<citation>" | redact-b <id>');
  if (stage === 'all') {
    for (const s of ['extract', 'ground', 'anonymise', 'write-en', 'write-fa', 'trace', 'payload']) await STAGES[s](arg);
    console.log('Stopped before post: run the post stage after reading payload.json.');
    return;
  }
  const fn = STAGES[stage];
  if (!fn) throw new Error(`Unknown stage "${stage}"`);
  await fn(arg);
});
