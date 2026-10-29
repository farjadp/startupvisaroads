// Structured data for the English page; see components/GuideJsonLd.tsx.
// Keep dateModified in step with UPDATED in page.tsx.
import type { ReactNode } from 'react';
import GuideJsonLd from '@/components/GuideJsonLd';
import { FOUNDER_ID } from '@/lib/seo';
import { SUV_SOURCES } from '@/lib/canada-suv';

const FACTS = {
  dateModified: '2026-10-15',
  author: { '@id': FOUNDER_ID },
  citation: [
    SUV_SOURCES.program,
    SUV_SOURCES.about,
    'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/exemption-codes/entrepreneurs-self-employed-seeking-only-temp-residence-r205-c11.html',
    'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/temporary-residents/foreign-workers/exemption-codes/canadian-interests-significant-benefit-entrepreneurs-self-employed-candidates-seeking-operate-business-r205-c11.html',
    'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html',
  ],
};

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {locale === 'en' && <GuideJsonLd path="/country/canada" facts={FACTS} />}
      {children}
    </>
  );
}
