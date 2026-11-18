// ============================================================================
// GET  /api/marketing/campaigns/:id/queue   true counts and queue state
// POST /api/marketing/campaigns/:id/queue   { action: preview | queue | pause }
//
// Admin session required on every action. "queue" also covers Resume; it only
// changes database state, and the 15-minute worker does the sending.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import {
  getCampaignQueueSummary,
  pauseCampaign,
  previewCampaignQueue,
  queueCampaign,
} from '@/lib/campaign-queue/admin';

type Ctx = { params: Promise<{ id: string }> };

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const serverError = (e: unknown) => {
  console.error('[campaign-queue] admin action failed', e);
  return NextResponse.json({ error: 'Something went wrong. Nothing was sent.' }, { status: 500 });
};

function respond(result: { ok: true } | { ok: false; status: number; error: string }) {
  return result.ok
    ? NextResponse.json(result)
    : NextResponse.json({ error: result.error }, { status: result.status });
}

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await getSessionFromRequest(req);
  if (!session?.username) return unauthorized();
  try {
    const { id } = await params;
    const summary = await getCampaignQueueSummary(id);
    if (!summary) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ summary });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await getSessionFromRequest(req);
  if (!session?.username) return unauthorized();

  // A cross-site form cannot send application/json without a preflight.
  if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return NextResponse.json({ error: 'Send JSON' }, { status: 415 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  try {
    const { id } = await params;
    switch ((body as { action?: unknown }).action) {
      case 'preview':
        return respond(await previewCampaignQueue(id, body));
      case 'queue': {
        const result = await queueCampaign(id, body);
        if (result.ok) console.info(`[campaign-queue] ${id} set to ${result.status} by ${session.username}`);
        return respond(result);
      }
      case 'pause': {
        const result = await pauseCampaign(id);
        if (result.ok) console.info(`[campaign-queue] ${id} paused by ${session.username}`);
        return respond(result);
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (e) {
    return serverError(e);
  }
}
