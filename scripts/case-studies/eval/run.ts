// Case Studies eval harness.
//   npx tsx scripts/case-studies/eval/run.ts            (= --offline: deterministic, no key, CI-safe)
//   npx tsx scripts/case-studies/eval/run.ts --live     (runs extract + ground gate on the fc-real cases; needs ANTHROPIC_API_KEY and the private cache)
// Exit code 1 when any pass bar fails, so CI can block a prompt or model change.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fcRealCases, offlineReport, type Bar } from './score';
import { caseDir } from '../lib/paths';
import { requireApiKey } from '../lib/anthropic';
import type { CaseA } from '../../../lib/case-studies/claims';

function printTable(bars: Bar[]): void {
  const w = Math.max(...bars.map((b) => b.metric.length));
  const v = Math.max(...bars.map((b) => b.value.length));
  console.log(`\n${'metric'.padEnd(w)}  ${'value'.padEnd(v)}  ${'bar'.padEnd(22)}  result`);
  console.log(`${'-'.repeat(w)}  ${'-'.repeat(v)}  ${'-'.repeat(22)}  ------`);
  for (const b of bars) console.log(`${b.metric.padEnd(w)}  ${b.value.padEnd(v)}  ${b.bar.padEnd(22)}  ${b.pass === null ? 'SKIP' : b.pass ? 'PASS' : 'FAIL'}`);
}

function offline(): boolean {
  const { bars, results } = offlineReport();
  const byCat = results.reduce<Record<string, { n: number; ok: number; skip: number }>>((acc, r) => {
    const c = (acc[r.category] ??= { n: 0, ok: 0, skip: 0 });
    c.n++;
    if (r.skipped) c.skip++;
    else if (r.ok) c.ok++;
    return acc;
  }, {});
  console.log('Case Studies eval (offline)');
  for (const [cat, c] of Object.entries(byCat)) console.log(`  ${cat.padEnd(12)} ${c.ok}/${c.n - c.skip} pass${c.skip ? `, ${c.skip} skipped` : ''}`);
  console.log(`  total cases  ${results.length} (spec target 60: 40 type A + 10 adversarial + 10 type B)`);
  for (const r of results) {
    if (r.skipped) console.log(`  SKIP ${r.id}: ${r.skipped}`);
    else if (!r.ok) console.log(`  FAIL ${r.id}: ${r.detail}`);
  }
  printTable(bars);
  return bars.every((b) => b.pass !== false);
}

function live(): boolean {
  requireApiKey();
  const bars: Bar[] = [];
  const tally = { disposition: [0, 0], holding: [0, 0], stopped: 0 };
  for (const c of fcRealCases()) {
    const dir = caseDir(c.citation);
    if (!existsSync(join(dir, 'parsed.json'))) {
      console.log(`SKIP ${c.id}: no private cache`);
      continue;
    }
    const run = (stage: string) => execFileSync('npx', ['tsx', 'scripts/case-studies/pipeline.ts', stage, c.citation], { stdio: 'inherit' });
    try {
      run('extract');
      run('ground');
    } catch {
      tally.stopped++;
    }
    const ex = JSON.parse(readFileSync(join(dir, 'extract.json'), 'utf8')) as CaseA;
    tally.disposition[1]++;
    if (ex.disposition === c.labels.disposition) tally.disposition[0]++;
    tally.holding[1]++;
    if (ex.holdings.some((h) => h.paras.includes(c.labels.holding.para))) tally.holding[0]++;
  }
  const pct = ([a, b]: number[]) => `${b ? ((100 * a) / b).toFixed(1) : 'n/a'}% (${a}/${b})`;
  bars.push({ metric: 'model disposition (live)', value: pct(tally.disposition), bar: '100%', pass: tally.disposition[0] === tally.disposition[1] });
  bars.push({ metric: 'model holding cites labelled para (live)', value: pct(tally.holding), bar: '>= 95%', pass: tally.holding[1] === 0 || tally.holding[0] / tally.holding[1] >= 0.95 });
  bars.push({ metric: 'cases stopped by gate (live)', value: String(tally.stopped), bar: 'review each', pass: null });
  printTable(bars);
  return bars.every((b) => b.pass !== false);
}

try {
  const ok = process.argv.includes('--live') ? live() : offline();
  process.exit(ok ? 0 : 1);
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}
