// GET  /api/admin/sources — every registered source with counts, for the admin table.
// POST /api/admin/sources — register one (multipart: fields + optional PDF file).
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { createSource, SourceError, type Kind, type Trust, type Cadence } from '@/lib/knowledge/sources';
import { listSources } from '@/lib/knowledge/admin';

export const dynamic = 'force-dynamic';

async function checkAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req).catch(() => null);
  return !!session?.username;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sources = await listSources();
  return NextResponse.json({ sources });
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const form = await req.formData();
    const str = (k: string) => {
      const v = form.get(k);
      return typeof v === 'string' ? v : '';
    };
    const file = form.get('file');
    const topics = str('topics')
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean);
    const { source, job } = await createSource({
      kind: str('kind') as Kind,
      cadence: (str('cadence') || 'once') as Cadence,
      url: str('url') || null,
      title: str('title') || null,
      trust: (str('trust') || null) as Trust | null,
      locale: (str('locale') || null) as 'en' | 'fa' | null,
      pinned: str('pinned') === '1',
      topics,
      watchEvery: Number(str('watchEvery')) || null,
      notes: str('notes') || null,
      text: str('text') || null,
      file: file instanceof File && file.size > 0 ? { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()), contentType: file.type } : null,
    });
    return NextResponse.json({ ok: true, id: source.id, jobId: job.id });
  } catch (e) {
    if (e instanceof SourceError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error('admin/sources POST', e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
  }
}
