// POST /api/admin/sources/retrieve {query, topics?, k?} — the evidence pack
// the writer would be handed for that query. The admin's debugging window
// into retrieval; nothing is written.
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { retrieveEvidence } from '@/lib/knowledge/retrieve';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req).catch(() => null);
  if (!session?.username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { query?: string; topics?: string[]; k?: number };
  const query = (body.query ?? '').trim();
  if (query.length < 3) return NextResponse.json({ error: 'Type a question or keyword.' }, { status: 400 });
  try {
    const pack = await retrieveEvidence(query, { k: Math.min(20, Math.max(1, body.k ?? 8)), topics: Array.isArray(body.topics) ? body.topics : [] });
    return NextResponse.json(pack);
  } catch (e) {
    console.error('admin/sources/retrieve', e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
  }
}
