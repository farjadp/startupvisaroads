// ============================================================================
// The two Case Studies publishing switches, stored in the Setting table.
// Both default OFF: an absent row, or any value other than 'true', is off.
//   caseStudies.courtPagesClearedByCounsel — FC_DECISION pages may publish
//   caseStudies.clientCasesEnabled         — CLIENT_CASE pages may publish
// (spec §12a: counsel review is still open; no client case publishes yet.)
// ============================================================================
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const COURT_PAGES_KEY = 'caseStudies.courtPagesClearedByCounsel';
export const CLIENT_CASES_KEY = 'caseStudies.clientCasesEnabled';

export type CaseStudySettings = {
  courtPagesClearedByCounsel: boolean;
  clientCasesEnabled: boolean;
};

/** The prisma client or an interactive-transaction client; only `setting` is used. */
type SettingsReader = { setting: Pick<Prisma.TransactionClient['setting'], 'findMany'> };

/** Pass the `tx` of an interactive transaction to read the switches inside it. */
export async function getCaseStudySettings(db: SettingsReader = prisma): Promise<CaseStudySettings> {
  const rows = await db.setting.findMany({ where: { key: { in: [COURT_PAGES_KEY, CLIENT_CASES_KEY] } } });
  const on = (key: string) => rows.find((r) => r.key === key)?.value === 'true';
  return { courtPagesClearedByCounsel: on(COURT_PAGES_KEY), clientCasesEnabled: on(CLIENT_CASES_KEY) };
}

/** The case types whose switch is currently ON. Public reads show only these. */
export function enabledCaseTypes(s: CaseStudySettings): ('FC_DECISION' | 'CLIENT_CASE')[] {
  const out: ('FC_DECISION' | 'CLIENT_CASE')[] = [];
  if (s.courtPagesClearedByCounsel) out.push('FC_DECISION');
  if (s.clientCasesEnabled) out.push('CLIENT_CASE');
  return out;
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
