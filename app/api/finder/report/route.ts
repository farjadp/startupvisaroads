// POST /api/finder/report {employerId, reason: wrong|removal|other, note?}
// A wrong contact, or an employer asking to be removed. Reviewed in the admin.
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { sessionUserId } from '@/lib/rcip-finder/session';
import { json, limited, readJson } from '@/lib/rcip-finder/http';

export const dynamic = 'force-dynamic';
const REASONS = new Set(['wrong', 'removal', 'other']);

export async function POST(req: NextRequest) {
  const block = limited(req, 'report', 10, 60 * 60_000);
  if (block) return block;
  const body = await readJson(req, 3000);
  const employerId = typeof body?.employerId === 'string' && body.employerId.length <= 40 ? body.employerId : null;
  const reason = typeof body?.reason === 'string' && REASONS.has(body.reason) ? body.reason : null;
  if (!employerId || !reason) return json({ error: 'input' }, 400);
  const note = typeof body?.note === 'string' ? body.note.trim().slice(0, 1000) || null : null;
  const exists = await prisma.rcipEmployer.findUnique({ where: { id: employerId }, select: { id: true } });
  if (!exists) return json({ error: 'not_found' }, 404);
  await prisma.contactReport.create({ data: { employerId, reason, note, userId: await sessionUserId(req) } });
  return json({ ok: true });
}
