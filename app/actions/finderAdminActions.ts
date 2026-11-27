'use server';

// ============================================================================
// app/actions/finderAdminActions.ts
// Admin actions for /admin/finder: switch the RCIP finder contact policy and
// close a contact report. Admin-only: requireAdmin is the first statement of
// each action (see lib/admin-guard.ts). The policy default 'all' is the
// owner's decision of 26 Nov 2026; this only lets him change it without a deploy.
// ============================================================================
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { requireAdmin, UnauthorizedError } from '@/lib/admin-guard';
import { CONTACT_POLICY_KEY, type ContactPolicy } from '@/lib/rcip-finder/core';

export type FinderActionResult = { success: true } | { success: false; error: string };

const POLICIES: readonly ContactPolicy[] = ['all', 'safe', 'off'];

function revalidate() {
  for (const l of ['en', 'fa']) {
    revalidatePath(`/${l}/admin/finder`);
    revalidatePath(`/${l}/data-reports/rcip-employers`);
  }
}

function fail(error: unknown, where: string): FinderActionResult {
  if (error instanceof UnauthorizedError) return { success: false, error: 'Unauthorized' };
  console.error(`finderAdminActions.${where}`, error);
  return { success: false, error: 'The database did not answer. Try again.' };
}

export async function setContactPolicy(policy: string): Promise<FinderActionResult> {
  try {
    await requireAdmin();
    if (!POLICIES.includes(policy as ContactPolicy)) return { success: false, error: 'Unknown policy.' };
    await prisma.setting.upsert({ where: { key: CONTACT_POLICY_KEY }, update: { value: policy }, create: { key: CONTACT_POLICY_KEY, value: policy } });
    revalidate();
    return { success: true };
  } catch (error) {
    return fail(error, 'setContactPolicy');
  }
}

export async function resolveContactReport(id: string): Promise<FinderActionResult> {
  try {
    await requireAdmin();
    if (typeof id !== 'string' || id.length > 64) return { success: false, error: 'Unknown report.' };
    await prisma.contactReport.updateMany({ where: { id, resolvedAt: null }, data: { resolvedAt: new Date() } });
    revalidate();
    return { success: true };
  } catch (error) {
    return fail(error, 'resolveContactReport');
  }
}
