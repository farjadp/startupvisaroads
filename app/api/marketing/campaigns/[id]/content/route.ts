// PUT /api/marketing/campaigns/:id/content
// Saves the campaign's name and content. See lib/campaign-queue/content.ts.
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { updateCampaignContent } from '@/lib/campaign-queue/content';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session?.username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // A cross-site form cannot send application/json without a preflight.
  if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return NextResponse.json({ error: 'Send JSON' }, { status: 415 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  try {
    const { id } = await params;
    const result = await updateCampaignContent(id, body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    console.info(`[campaign-queue] ${id} content saved as version ${result.contentVersion} by ${session.username}`);
    return NextResponse.json(result);
  } catch (e) {
    console.error('[campaign-queue] content save failed', e);
    return NextResponse.json({ error: 'Could not save. Nothing was changed.' }, { status: 500 });
  }
}
