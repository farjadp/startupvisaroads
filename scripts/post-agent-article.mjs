#!/usr/bin/env node
// Publish or schedule hand-written articles on the site.
//
//   node scripts/post-agent-article.mjs content/agent-articles/2026-11-levels/*.json
//   node scripts/post-agent-article.mjs --held          # list what is still waiting
//
// Each JSON file is an AgentArticlePayload (lib/agent-articles.ts); a future
// publishAt holds it until the 15-minute ingest cron releases it.
// Token and base URL as for post-agent-report.mjs: AGENT_REPORTS_TOKEN and
// AGENT_REPORTS_URL (default https://visaroads.com), from the environment,
// then .env.local, then .env.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function fromDotenv(key) {
  for (const f of ['.env.local', '.env']) {
    const p = resolve(process.cwd(), f);
    if (!existsSync(p)) continue;
    const line = readFileSync(p, 'utf8').split('\n').find((l) => l.startsWith(`${key}=`));
    if (line) return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, '');
  }
  return undefined;
}

const args = process.argv.slice(2);
const token = process.env.AGENT_REPORTS_TOKEN || fromDotenv('AGENT_REPORTS_TOKEN');
const base = (process.env.AGENT_REPORTS_URL || fromDotenv('AGENT_REPORTS_URL') || 'https://visaroads.com').replace(/\/$/, '');
if (!token) {
  console.error('AGENT_REPORTS_TOKEN is not set (environment or .env.local)');
  process.exit(2);
}
const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

if (args.includes('--held')) {
  const res = await fetch(`${base}/api/agent-articles`, { headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) { console.error(`failed: ${res.status} ${json.error ?? ''}`); process.exit(1); }
  for (const h of json.held) console.log(`${h.publishAt}  ${h.locale}  ${h.slug}`);
  console.log(`${json.held.length} held`);
  process.exit(0);
}

const files = args.filter((a) => !a.startsWith('--'));
if (!files.length) {
  console.error('usage: node scripts/post-agent-article.mjs <article.json>... | --held');
  process.exit(2);
}
let failed = 0;
for (const file of files) {
  let body;
  try {
    body = readFileSync(resolve(file), 'utf8');
    JSON.parse(body);
  } catch (e) {
    console.error(`${file}: cannot read as JSON: ${e.message}`);
    failed++;
    continue;
  }
  const res = await fetch(`${base}/api/agent-articles`, { method: 'POST', headers, body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`${file}: failed ${res.status} ${json.error ?? ''}`);
    failed++;
    continue;
  }
  console.log(`${json.status.padEnd(9)} ${json.publishAt}  ${json.url}`);
}
process.exit(failed ? 1 : 0);
