// ============================================================================
// POST /api/agent-articles   — publish or schedule one hand-written article
// GET  /api/agent-articles   — list the articles still held for later
//
// Body: AgentArticlePayload (lib/agent-articles.ts). With a future publishAt
// the article is held as SCHEDULED and released by the 15-minute ingest cron;
// without one it is published now, given a cover and shared to the socials.
// Posting the same slug again replaces the article (corrections).
//
// Auth: Bearer AGENT_REPORTS_TOKEN — the token the local agents already hold —
// or anything authorisedCron accepts.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { safeCompare } from '@/lib/auth';
import { authorisedCron } from '@/lib/cron-auth';
import { SITE_URL } from '@/lib/seo';
import { parseAgentArticle, upsertAgentArticle, SCHEDULED } from '@/lib/agent-articles';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

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
  if (raw.length > MAX_BODY) return NextResponse.json({ error: `body over ${MAX_BODY} bytes` }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'body is not JSON' }, { status: 400 });
  }
  const parsed = parseAgentArticle(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const { row, status, firstPublish } = await upsertAgentArticle(parsed.article, parsed.publishAt);
    return NextResponse.json({
      ok: true,
      id: row.id,
      slug: row.slug,
      status,
      publishAt: row.createdAt.toISOString(),
      firstPublish,
      url: `${SITE_URL}/${row.locale}/blog/${row.slug}`,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 409 });
  }
}

export async function GET(req: NextRequest) {
  if (!(await authorised(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const held = await prisma.article.findMany({
    where: { status: SCHEDULED },
    orderBy: { createdAt: 'asc' },
    select: { slug: true, locale: true, title: true, createdAt: true },
  });
  return NextResponse.json({ ok: true, held: held.map((h) => ({ ...h, publishAt: h.createdAt.toISOString() })) });
}
