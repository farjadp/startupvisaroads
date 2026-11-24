// ============================================================================
// lib/pricing/store.ts
// Reads and writes the pricing document (PricingContent, row "main").
// Server-only. A read never throws: a missing row, a database that is down
// or a row that fails to parse all render the defaults, where every unknown
// is TBD — the failure mode shows fewer numbers, never wrong ones.
// ============================================================================
import prisma from '@/lib/prisma';
import { DEFAULT_PRICING } from './defaults';
import { normalizePricing } from './validate';
import type { PricingDoc } from './types';

export const PRICING_ROW_ID = 'main';

export interface StoredPricing {
  doc: PricingDoc;
  /** false = no admin save yet, the page shows the defaults. */
  saved: boolean;
  updatedAt: Date | null;
  updatedBy: string | null;
}

export async function loadPricing(): Promise<StoredPricing> {
  try {
    const row = await prisma.pricingContent.findUnique({ where: { id: PRICING_ROW_ID } });
    if (!row) return { doc: DEFAULT_PRICING, saved: false, updatedAt: null, updatedBy: null };
    return { doc: normalizePricing(JSON.parse(row.data)), saved: true, updatedAt: row.updatedAt, updatedBy: row.updatedBy };
  } catch (error) {
    console.error('[pricing] could not read PricingContent, rendering defaults:', error);
    return { doc: DEFAULT_PRICING, saved: false, updatedAt: null, updatedBy: null };
  }
}

export async function savePricingDoc(doc: PricingDoc, username: string): Promise<void> {
  const data = JSON.stringify(doc);
  await prisma.pricingContent.upsert({
    where: { id: PRICING_ROW_ID },
    update: { data, updatedBy: username },
    create: { id: PRICING_ROW_ID, data, updatedBy: username },
  });
}
