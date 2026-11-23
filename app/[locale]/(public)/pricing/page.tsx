// ============================================================================
// Page: /[locale]/pricing (en + fa)
// The only page on the site that shows VisaRoads prices (Farjad, 23 Nov 2026,
// reversing the 8 Sep "no price on any public page" rule for this page only).
// Every amount and most copy come from the admin-edited document
// (lib/pricing/store.ts, edited at /en/admin/pricing); resolve.ts decides
// what may be shown. Saving in admin revalidates this path; the 5-minute
// revalidate is a fallback.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { metaFor } from '@/lib/pageMeta';
import JsonLd from '@/components/JsonLd';
import PricingPage from '@/components/pricing/PricingPage';
import { loadPricing } from '@/lib/pricing/store';
import { resolveCopy, resolveGroups, showDraftsByDefault } from '@/lib/pricing/resolve';
import { pricingJsonLd } from '@/lib/pricing/json-ld';
import { PRICING_LOCALES, type PricingLocale } from '@/lib/pricing/types';

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

function asLocale(locale: string): PricingLocale | null {
  return (PRICING_LOCALES as readonly string[]).includes(locale) ? (locale as PricingLocale) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/pricing', locale);
}

export default async function Pricing({ params }: Props) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  if (!locale) notFound();
  setRequestLocale(locale);

  const { doc } = await loadPricing();
  const opts = { showDrafts: showDraftsByDefault() };
  const meta = metaFor('/pricing', locale);
  const title = typeof meta.title === 'object' && meta.title && 'absolute' in meta.title ? String(meta.title.absolute) : String(meta.title ?? '');

  return (
    <>
      <JsonLd data={pricingJsonLd(doc, locale, { title, description: String(meta.description ?? '') })} />
      <PricingPage locale={locale} groups={resolveGroups(doc, locale, opts)} copy={resolveCopy(doc.copy[locale], locale, opts)} showDrafts={opts.showDrafts} />
    </>
  );
}
