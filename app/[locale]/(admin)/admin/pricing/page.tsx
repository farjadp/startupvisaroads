// ============================================================================
// Admin: /[locale]/admin/pricing
// Edit the public /pricing page: per route group the price, currency,
// status, lists, milestones, duration, legal-review flag and CTA; plus the
// page copy in English and Persian. Middleware guards /admin; the save action
// checks the session again (app/actions/pricingActions.ts).
// ============================================================================
import React from 'react';
import { loadPricing } from '@/lib/pricing/store';
import PricingEditor from '@/components/admin/pricing/PricingEditor';

export const dynamic = 'force-dynamic';

export default async function AdminPricingPage() {
  const { doc, saved, updatedAt, updatedBy } = await loadPricing();
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 font-serif text-4xl text-[#1a1a1a]">Pricing page</h1>
        <p className="max-w-3xl font-sans text-[#1a1a1a]/60">
          Starting prices and copy for /en/pricing and /fa/pricing. Prices are shared by both languages; text is written per language. Saving publishes immediately.
        </p>
      </div>
      <PricingEditor initial={doc} saved={saved} updatedAt={updatedAt ? updatedAt.toISOString() : null} updatedBy={updatedBy} />
    </div>
  );
}
