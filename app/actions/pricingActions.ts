'use server';

// ============================================================================
// app/actions/pricingActions.ts
// Saves the /pricing page content from /en/admin/pricing. Admin-only (the
// first statement is requireAdmin, see lib/admin-guard.ts). The posted
// document is normalised against the defaults before it is stored, so a bad
// post cannot add a route group, unlock the Canada lawyer gate or store a
// non-https CTA. Both locale pages are revalidated so the change is live on
// the next request.
// ============================================================================
import { revalidatePath } from 'next/cache';
import { requireAdmin, UnauthorizedError } from '@/lib/admin-guard';
import { normalizePricing } from '@/lib/pricing/validate';
import { savePricingDoc } from '@/lib/pricing/store';
import { DEFAULT_PRICING } from '@/lib/pricing/defaults';
import type { PricingDoc } from '@/lib/pricing/types';

export type SavePricingResult = { success: true; doc: PricingDoc } | { success: false; error: string };

const MAX_BODY = 200_000;

function revalidate() {
  for (const l of ['en', 'fa']) {
    revalidatePath(`/${l}/pricing`);
    revalidatePath(`/${l}/admin/pricing`);
  }
}

export async function savePricing(payload: string): Promise<SavePricingResult> {
  try {
    const session = await requireAdmin();
    if (typeof payload !== 'string' || payload.length > MAX_BODY) return { success: false, error: 'The content is too large.' };
    const doc = normalizePricing(JSON.parse(payload));
    await savePricingDoc(doc, session.username);
    revalidate();
    return { success: true, doc };
  } catch (error) {
    if (error instanceof UnauthorizedError) return { success: false, error: 'Unauthorized' };
    if (error instanceof SyntaxError) return { success: false, error: 'The form sent invalid data.' };
    console.error('[pricing] save failed:', error);
    return { success: false, error: 'Could not save. Nothing was changed.' };
  }
}

/** Puts the stored document back to the defaults (every unknown TBD again). */
export async function resetPricing(): Promise<SavePricingResult> {
  try {
    const session = await requireAdmin();
    await savePricingDoc(DEFAULT_PRICING, session.username);
    revalidate();
    return { success: true, doc: DEFAULT_PRICING };
  } catch (error) {
    if (error instanceof UnauthorizedError) return { success: false, error: 'Unauthorized' };
    console.error('[pricing] reset failed:', error);
    return { success: false, error: 'Could not reset. Nothing was changed.' };
  }
}
