// GET  /api/admin/case-studies/consents — every consent record, newest first,
//      with the number of linked cases.
// POST /api/admin/case-studies/consents {clientRef, scope, signedAt, documentUri?}
//      — record one; recordedBy is the admin's username. Rules: lib/case-studies/consent.ts.
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminUser, readJsonObject, unauthorized } from '@/lib/case-studies/admin-http';
import { parseConsentInput } from '@/lib/case-studies/consent';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!(await adminUser(req))) return unauthorized();
  try {
    const rows = await prisma.consentRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
      include: { _count: { select: { caseStudies: true } } },
    });
    return NextResponse.json({
      items: rows.map(({ _count, ...r }) => ({ ...r, caseCount: _count.caseStudies })),
    });
  } catch (e) {
    console.error('[admin/case-studies] consent list failed', e);
    return NextResponse.json({ error: 'Could not list consents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const username = await adminUser(req);
  if (!username) return unauthorized();
  const parsedBody = await readJsonObject(req);
  if (!parsedBody.ok) return parsedBody.response;
  const body = parsedBody.body;
  if (!body) return NextResponse.json({ error: 'Body must be a JSON object' }, { status: 400 });
  const parsed = parseConsentInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const item = await prisma.consentRecord.create({ data: { ...parsed.input, recordedBy: username } });
    console.info(`[case-studies] consent ${item.id} recorded by ${username}`);
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    console.error('[admin/case-studies] consent create failed', e);
    return NextResponse.json({ error: 'Could not save the consent' }, { status: 500 });
  }
}
