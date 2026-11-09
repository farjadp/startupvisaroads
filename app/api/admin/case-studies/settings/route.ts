// GET/PUT /api/admin/case-studies/settings
//   { courtPagesClearedByCounsel?: boolean, clientCasesEnabled?: boolean }
// Both default off. Every change is logged with the admin's username.
import { NextRequest, NextResponse } from 'next/server';
import { adminUser, readJsonObject, unauthorized } from '@/lib/case-studies/admin-http';
import { getCaseStudySettings, setCaseStudySettings, type CaseStudySettings } from '@/lib/case-studies/settings';

export const dynamic = 'force-dynamic';

const KEYS = ['courtPagesClearedByCounsel', 'clientCasesEnabled'] as const;

export async function GET(req: NextRequest) {
  if (!(await adminUser(req))) return unauthorized();
  try {
    return NextResponse.json(await getCaseStudySettings());
  } catch (e) {
    console.error('[admin/case-studies] settings read failed', e);
    return NextResponse.json({ error: 'Could not read settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const username = await adminUser(req);
  if (!username) return unauthorized();
  const body = await readJsonObject(req);
  if (!body) return NextResponse.json({ error: 'Body must be a JSON object' }, { status: 400 });
  const patch: Partial<CaseStudySettings> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!(KEYS as readonly string[]).includes(k)) return NextResponse.json({ error: `unknown key ${k}` }, { status: 400 });
    if (typeof v !== 'boolean') return NextResponse.json({ error: `${k} must be a boolean` }, { status: 400 });
    patch[k as (typeof KEYS)[number]] = v;
  }
  if (!Object.keys(patch).length) return NextResponse.json({ error: 'Nothing to change' }, { status: 400 });
  try {
    const before = await getCaseStudySettings();
    const settings = await setCaseStudySettings(patch);
    console.info(`[case-studies] settings changed by ${username}`, { before, after: settings });
    return NextResponse.json(settings);
  } catch (e) {
    console.error('[admin/case-studies] settings write failed', e);
    return NextResponse.json({ error: 'Could not save settings' }, { status: 500 });
  }
}
