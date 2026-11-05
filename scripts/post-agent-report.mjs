#!/usr/bin/env node
// Post an agent report to the site: stored in /admin/reports, sent to Telegram.
//
//   node scripts/post-agent-report.mjs docs/agent-reports/2026-11-05-market-intel.json [--no-telegram]
//
// Reads AGENT_REPORTS_TOKEN (required) and AGENT_REPORTS_URL (default
// https://visaroads.com) from the environment, then .env.local, then .env.
// The JSON shape is AgentReportPayload in lib/agent-reports/report.ts.
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
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('usage: node scripts/post-agent-report.mjs <report.json> [--no-telegram]');
  process.exit(2);
}
const token = process.env.AGENT_REPORTS_TOKEN || fromDotenv('AGENT_REPORTS_TOKEN');
const base = (process.env.AGENT_REPORTS_URL || fromDotenv('AGENT_REPORTS_URL') || 'https://visaroads.com').replace(/\/$/, '');
if (!token) {
  console.error('AGENT_REPORTS_TOKEN is not set (environment or .env.local)');
  process.exit(2);
}

let body;
try {
  body = readFileSync(resolve(file), 'utf8');
  JSON.parse(body);
} catch (e) {
  console.error(`cannot read ${file} as JSON: ${e.message}`);
  process.exit(2);
}

const url = `${base}/api/agent-reports${args.includes('--no-telegram') ? '?telegram=0' : ''}`;
const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body,
});
const json = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`failed: ${res.status} ${json.error ?? ''}`);
  process.exit(1);
}
console.log(`stored: ${json.url}`);
console.log(`telegram: ${json.telegram}${json.error ? ` (${json.error})` : ''}`);
