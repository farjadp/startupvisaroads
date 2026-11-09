// GET /api/admin/case-studies/[id] — one case for the review screen, with its
// consent record, the two switches and what the gate says right now.
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminUser, unauthorized } from '@/lib/case-studies/admin-http';
import { getCaseStudySettings } from '@/lib/case-studies/settings';
import { approvalBlockers, publishBlockers, serialiseCaseStudy } from '@/lib/case-studies/workflow';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  if (!(await adminUser(req))) return unauthorized();
  const { id } = await params;
  try {
    const row = await prisma.caseStudy.findUnique({ where: { id } });
    if (!row) return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    const consent = row.consentRecordId
      ? await prisma.consentRecord.findUnique({ where: { id: row.consentRecordId } })
      : null;
    const settings = await getCaseStudySettings();
    const approval = approvalBlockers(row, consent);
    const publish = publishBlockers(row, settings, consent, row.status === 'SCHEDULED' ? 'release' : 'now');
    return NextResponse.json({
      item: serialiseCaseStudy(row),
      consent,
      settings,
      approval: { ok: approval.length === 0, reasons: approval },
      publish: { ok: publish.length === 0, reasons: publish },
    });
  } catch (e) {
    console.error('[admin/case-studies] get failed', id, e);
    return NextResponse.json({ error: 'Could not load the case' }, { status: 500 });
  }
}
