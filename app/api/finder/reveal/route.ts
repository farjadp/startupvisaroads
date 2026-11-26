// POST /api/finder/reveal {employerId} — spends one of this month's reveals
// (nothing for a row already revealed) and returns its contact.
import type { NextRequest } from 'next/server';
import { getMe, reveal } from '@/lib/rcip-finder/service';
import { sessionUserId } from '@/lib/rcip-finder/session';
import { json, limited, readJson } from '@/lib/rcip-finder/http';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const userId = await sessionUserId(req);
  if (!userId) return json({ error: 'signed_out' }, 401);
  const block = limited(req, 'reveal', 20, 60 * 60_000, userId);
  if (block) return block;
  const body = await readJson(req, 500);
  const id = typeof body?.employerId === 'string' && body.employerId.length <= 40 ? body.employerId : null;
  if (!id) return json({ error: 'employerId' }, 400);
  try {
    const r = await reveal(userId, id);
    if (!r.ok) return json({ error: r.error, me: await getMe(userId) }, r.error === 'quota' ? 403 : 404);
    return json({ contact: r.contact, me: await getMe(userId) });
  } catch (e) {
    console.error('[finder] reveal', e);
    return json({ error: 'unavailable' }, 503);
  }
}
