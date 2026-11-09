// ============================================================================
// The two Case Studies publishing switches, stored in the Setting table.
// Both default OFF: an absent row, or any value other than 'true', is off.
//   caseStudies.courtPagesClearedByCounsel — FC_DECISION pages may publish
//   caseStudies.clientCasesEnabled         — CLIENT_CASE pages may publish
// (spec §12a: counsel review is still open; no client case publishes yet.)
// ============================================================================
import prisma from '@/lib/prisma';

export const COURT_PAGES_KEY = 'caseStudies.courtPagesClearedByCounsel';
export const CLIENT_CASES_KEY = 'caseStudies.clientCasesEnabled';

export type CaseStudySettings = {
  courtPagesClearedByCounsel: boolean;
  clientCasesEnabled: boolean;
};

export async function getCaseStudySettings(): Promise<CaseStudySettings> {
  const rows = await prisma.setting.findMany({ where: { key: { in: [COURT_PAGES_KEY, CLIENT_CASES_KEY] } } });
  const on = (key: string) => rows.find((r) => r.key === key)?.value === 'true';
  return { courtPagesClearedByCounsel: on(COURT_PAGES_KEY), clientCasesEnabled: on(CLIENT_CASES_KEY) };
}

export async function setCaseStudySettings(patch: Partial<CaseStudySettings>): Promise<CaseStudySettings> {
  const writes: [string, boolean][] = [];
  if (patch.courtPagesClearedByCounsel !== undefined) writes.push([COURT_PAGES_KEY, patch.courtPagesClearedByCounsel]);
  if (patch.clientCasesEnabled !== undefined) writes.push([CLIENT_CASES_KEY, patch.clientCasesEnabled]);
  for (const [key, on] of writes) {
    const value = on ? 'true' : 'false';
    await prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
  }
  return getCaseStudySettings();
}
