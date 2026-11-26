#!/usr/bin/env node
// Load the RCIP designated-employer listings into the finder.
//
//   node scripts/import-rcip-employers.mjs <rcip_all_classified.csv> --edition 2026-11 [--dry-run]
//
// Reads the data project's CSV (it stays outside this repo: it holds contact
// details), maps each row to the finder's import shape and posts it in
// batches of 400 to /api/agent-data/rcip-employers. Token and base URL as for
// post-agent-article.mjs: AGENT_REPORTS_TOKEN and AGENT_REPORTS_URL (default
// https://visaroads.com), from the environment, then .env.local, then .env.
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

/** RFC 4180 CSV: quoted fields, doubled quotes, newlines inside quotes. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.length > 1 || r[0]);
  const keys = head.map((h) => h.replace(/^﻿/, ''));
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i] ?? ''])));
}

const sectorOf = (naics) => {
  const two = (naics || '').trim().slice(0, 2);
  if (!two) return null;
  if (['31', '32', '33'].includes(two)) return '31-33';
  if (['44', '45'].includes(two)) return '44-45';
  if (['48', '49'].includes(two)) return '48-49';
  return two;
};
const SOURCE = { 'from source list': 'source_list', 'gemini - verify': 'ai_verify', 'gemini - low, check': 'ai_low' };
const closedOf = (note) => (/excluded from/i.test(note) ? 'excluded' : /not accepted/i.test(note) ? 'not_accepting' : null);
const emailsOf = (s) => s.split(/[;,\s]+/).map((e) => e.trim()).filter((e) => e.includes('@'));

export function toImportRow(r) {
  const hasContact = !!(r.website || r.phone || r.emails);
  return {
    community: r.community,
    province: r.province,
    name: r.employer_name || r.found_name,
    address: r.address || r.found_address || '',
    businessType: r.business_type || 'unknown',
    sector: sectorOf(r.naics),
    listedSector: r.listed_rcip_sector || null,
    listAsOf: r.list_as_of || null,
    sourceUrl: r.source_url,
    closedNote: closedOf(r.excluded_note || ''),
    website: r.website || null,
    phone: r.phone || null,
    emails: emailsOf(r.emails || ''),
    contactSource: hasContact ? SOURCE[r.match_confidence] ?? 'ai_verify' : 'none',
  };
}

async function main() {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith('--'));
  const edition = args[args.indexOf('--edition') + 1];
  if (!file || !/^\d{4}-\d{2}$/.test(edition ?? '')) {
    console.error('usage: node scripts/import-rcip-employers.mjs <csv> --edition YYYY-MM [--dry-run]');
    process.exit(2);
  }
  const rows = parseCsv(readFileSync(resolve(file), 'utf8')).map(toImportRow);
  const bySource = rows.reduce((m, r) => ({ ...m, [r.contactSource]: (m[r.contactSource] ?? 0) + 1 }), {});
  console.log(`${rows.length} rows; contact source: ${JSON.stringify(bySource)}`);
  if (args.includes('--dry-run')) return;

  const token = process.env.AGENT_REPORTS_TOKEN || fromDotenv('AGENT_REPORTS_TOKEN');
  const base = (process.env.AGENT_REPORTS_URL || fromDotenv('AGENT_REPORTS_URL') || 'https://visaroads.com').replace(/\/$/, '');
  if (!token) { console.error('AGENT_REPORTS_TOKEN is not set'); process.exit(2); }
  let created = 0, updated = 0, rejected = 0;
  for (let i = 0; i < rows.length; i += 400) {
    const res = await fetch(`${base}/api/agent-data/rcip-employers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ edition, rows: rows.slice(i, i + 400) }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { console.error(`batch ${i / 400 + 1}: ${res.status} ${json.error ?? ''}`); process.exit(1); }
    created += json.created; updated += json.updated; rejected += json.rejected.length;
    for (const r of json.rejected) console.error(`  row ${i + r.index}: ${r.error}`);
  }
  console.log(`created ${created}, updated ${updated}, rejected ${rejected} -> ${base}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
