// ============================================================================
// Page: /[locale]/partners
// B2B partner programme for RCICs, immigration lawyers and agencies, with the
// partner booking calendar. The destination for the RCIC partner email.
// ============================================================================
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { metaFor } from '@/lib/pageMeta';
import { partnerCopy } from '@/content/partners';
import { partnersJsonLd } from '@/lib/partners-json-ld';
import JsonLd from '@/components/JsonLd';
import PartnersPage from '@/components/partners/PartnersPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/partners', locale);
}

export default async function Partners({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const meta = metaFor('/partners', locale);
  const title = typeof meta.title === 'object' && meta.title && 'absolute' in meta.title ? String(meta.title.absolute) : String(meta.title ?? '');
  return (
    <>
      <JsonLd data={partnersJsonLd(locale, { title, description: String(meta.description ?? '') })} />
      <PartnersPage copy={partnerCopy(locale)} locale={locale} />
    </>
  );
}
