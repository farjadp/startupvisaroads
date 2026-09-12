// GET    /api/admin/sources/:id — the source with its documents and open job.
// PATCH  /api/admin/sources/:id — edit trust / pinned / topics / enabled / title / notes; {refetch:true} queues a re-read.
// DELETE /api/admin/sources/:id — remove it and everything read from it.
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { cleanTopics, enqueueRefetch, TRUSTS, type Trust } from '@/lib/knowledge/sources';
import { sourceDetail } from '@/lib/knowledge/admin';

export const dynamic = 'force-dynamic';

async function checkAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req).catch(() => null);
  return !!session?.username;
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const source = await sourceDetail(id);
  if (!source) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ source });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  if (typeof body.title === 'string') data.title = body.title.trim().slice(0, 400) || null;
  if (typeof body.notes === 'string') data.notes = body.notes.trim() || null;
  if (typeof body.pinned === 'boolean') data.pinned = body.pinned;
  if (typeof body.enabled === 'boolean') data.enabled = body.enabled;
  if (typeof body.trust === 'string' && TRUSTS.includes(body.trust as Trust)) data.trust = body.trust;
  if (body.locale === 'en' || body.locale === 'fa' || body.locale === null) data.locale = body.locale;
  if (Array.isArray(body.topics)) data.topics = JSON.stringify(cleanTopics(body.topics));
  try {
    if (Object.keys(data).length) await prisma.source.update({ where: { id }, data });
    if (body.refetch === true) await enqueueRefetch(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.source.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
