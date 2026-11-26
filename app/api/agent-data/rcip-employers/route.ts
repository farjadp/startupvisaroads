// POST /api/agent-data/rcip-employers {edition, rows: ImportRow[]}
// Loads or updates designated-employer listings for the finder, up to 500
// rows a call, matched on community + name + address. Bearer
// AGENT_REPORTS_TOKEN (the local agents' token) or anything authorisedCron
// accepts. scripts/import-rcip-employers.mjs sends the batches.
import { NextResponse, type NextRequest } from 'next/server';
import { safeCompare } from '@/lib/auth';
import { authorisedCron } from '@/lib/cron-auth';
import { parseImportRow, upsertEmployers, type ImportRow } from '@/lib/rcip-finder/service';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

async function authorised(req: NextRequest) {
  const token = process.env.AGENT_REPORTS_TOKEN;
  const header = req.headers.get('authorization') ?? '';
  if (token && header.startsWith('Bearer ') && safeCompare(header.slice(7), token)) return true;
  return authorisedCron(req);
}

export async function POST(req: NextRequest) {
  if (!(await authorised(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const raw = await req.text();
  if (raw.length > 2_000_000) return NextResponse.json({ error: 'body too large' }, { status: 413 });
  let body: { edition?: unknown; rows?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'body is not JSON' }, { status: 400 });
  }
  const edition = typeof body.edition === 'string' && /^\d{4}-\d{2}$/.test(body.edition) ? body.edition : null;
  if (!edition || !Array.isArray(body.rows) || body.rows.length === 0 || body.rows.length > 500) {
    return NextResponse.json({ error: 'edition (YYYY-MM) and 1 to 500 rows are required' }, { status: 400 });
  }
  const rows: ImportRow[] = [];
  const rejected: { index: number; error: string }[] = [];
  body.rows.forEach((r, index) => {
    const p = parseImportRow(r);
    if (p.ok) rows.push(p.row);
    else rejected.push({ index, error: p.error });
  });
  const result = await upsertEmployers(rows, edition);
  return NextResponse.json({ ...result, rejected });
}
