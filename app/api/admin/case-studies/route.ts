// GET /api/admin/case-studies?status=&type= — the admin list. Admin session only.
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminUser, unauthorized } from '@/lib/case-studies/admin-http';
import { CASE_TYPES } from '@/lib/case-studies/payload';
import { CASE_STATUSES, claimCounts, parseJsonArray } from '@/lib/case-studies/workflow';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!(await adminUser(req))) return unauthorized();
  const q = req.nextUrl.searchParams;
  const status = q.get('status') || undefined;
  const type = q.get('type') || undefined;
  if (status && !(CASE_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: `status must be one of ${CASE_STATUSES.join(', ')}` }, { status: 400 });
  }
  if (type && !(CASE_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ error: `type must be one of ${CASE_TYPES.join(', ')}` }, { status: 400 });
  }
  try {
    const rows = await prisma.caseStudy.findMany({
      where: { ...(status ? { status } : {}), ...(type ? { type } : {}) },
      orderBy: { updatedAt: 'desc' },
      take: 500,
      select: {
        id: true, groupKey: true, locale: true, slug: true, type: true, status: true, title: true,
        citation: true, route: true, outcome: true, decisionDate: true, updatedAt: true,
        claims: true, redLines: true, sample: true,
      },
    });
    return NextResponse.json({
      items: rows.map(({ claims, redLines, ...r }) => ({
        ...r,
        ...claimCounts(claims),
        redLineCount: parseJsonArray(redLines)?.length ?? 0,
      })),
    });
  } catch (e) {
    console.error('[admin/case-studies] list failed', e);
    return NextResponse.json({ error: 'Could not list cases' }, { status: 500 });
  }
}
