// ============================================================================
// POST /api/agent-case-studies — the case-study-writer agent posts one case
// GET  /api/agent-case-studies — list cases still in DRAFT / IN_REVIEW
//
// Body: CaseStudyPayload (lib/case-studies/payload.ts). The case lands in
// IN_REVIEW and never publishes from here: no Article row, no socials. A
// repost of the same (locale, slug) replaces the case only while it is DRAFT
// or IN_REVIEW, and resets every claim to unchecked; otherwise 409.
//
// Auth: Bearer AGENT_REPORTS_TOKEN, or anything authorisedCron accepts.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { safeCompare } from '@/lib/auth';
import { authorisedCron } from '@/lib/cron-auth';
import { parseCaseStudyPayload } from '@/lib/case-studies/payload';
import { claimCounts, ingestCaseStudy, parseJsonArray } from '@/lib/case-studies/workflow';

export const dynamic = 'force-dynamic';

const MAX_BODY = 400_000;

async function authorised(req: NextRequest): Promise<boolean> {
  const token = process.env.AGENT_REPORTS_TOKEN;
  const header = req.headers.get('authorization') ?? '';
  if (token && header.startsWith('Bearer ') && safeCompare(header.slice(7), token)) return true;
  return authorisedCron(req);
}

export async function POST(req: NextRequest) {
  if (!(await authorised(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const raw = await req.text();
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY) {
    return NextResponse.json({ error: `body over ${MAX_BODY} bytes` }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'body is not JSON' }, { status: 400 });
  }
  const parsed = parseCaseStudyPayload(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const result = await ingestCaseStudy(parsed.payload);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    const { row, created, redLines } = result;
    return NextResponse.json({
      ok: true,
      id: row.id,
      locale: row.locale,
      slug: row.slug,
      status: row.status,
      created,
      ...claimCounts(row.claims),
      redLines,
    });
  } catch (e) {
    console.error('[agent-case-studies] ingest failed', parsed.payload.locale, parsed.payload.slug, e);
    return NextResponse.json({ error: 'Could not save the case' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!(await authorised(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const rows = await prisma.caseStudy.findMany({
      where: { status: { in: ['DRAFT', 'IN_REVIEW'] } },
      orderBy: { updatedAt: 'desc' },
      take: 200,
      select: { id: true, groupKey: true, locale: true, slug: true, type: true, status: true, title: true, updatedAt: true, claims: true, redLines: true },
    });
    return NextResponse.json({
      ok: true,
      items: rows.map(({ claims, redLines, ...r }) => ({
        ...r,
        ...claimCounts(claims),
        redLineCount: parseJsonArray(redLines)?.length ?? 0,
      })),
    });
  } catch (e) {
    console.error('[agent-case-studies] list failed', e);
    return NextResponse.json({ error: 'Could not list cases' }, { status: 500 });
  }
}
