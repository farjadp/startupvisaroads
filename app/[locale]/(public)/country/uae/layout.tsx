// Structured data for the English page; see components/GuideJsonLd.tsx.
// Keep dateModified in step with UPDATED in page.tsx: the date the Golden and
// Green figures were checked (lib/routes-v2/tr-il-ae.ts, 15 Oct 2026); the
// u.ae tax rates were checked 29 Oct 2026.
import type { ReactNode } from 'react';
import GuideJsonLd from '@/components/GuideJsonLd';
import { FOUNDER_ID } from '@/lib/seo';

const FACTS = {
  dateModified: '2026-10-29',
  author: { '@id': FOUNDER_ID },
  citation: [
    'https://icp.gov.ae/en/services/uae-golden-residency/',
    'https://icp.gov.ae/en/services/uae-green-residency/',
    'https://www.gdrfad.gov.ae/en/services/8ea80da4-f43e-11eb-0320-0050569629e8',
    'https://www.gdrfad.gov.ae/en/services/8ea80da7-f43e-11eb-0320-0050569629e8',
    'https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa',
    'https://u.ae/en/information-and-services/finance-and-investment/taxation/corporate-tax',
    'https://u.ae/en/information-and-services/finance-and-investment/taxation',
  ],
};

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {locale === 'en' && <GuideJsonLd path="/country/uae" facts={FACTS} />}
      {children}
    </>
  );
}
