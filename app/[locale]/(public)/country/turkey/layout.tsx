// Structured data for the English page; see components/GuideJsonLd.tsx.
// Keep dateModified in step with UPDATED in page.tsx.
import type { ReactNode } from 'react';
import GuideJsonLd from '@/components/GuideJsonLd';
import { FOUNDER_ID } from '@/lib/seo';

const FACTS = {
  dateModified: '2026-09-08',
  author: { '@id': FOUNDER_ID },
  citation: [
    'https://turkiyetechvisa.gov.tr/',
    'https://calismaizni.csgb.gov.tr/calisma-izni/-calisma-izni-degerlendirme-kriterleri/',
  ],
};

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {locale === 'en' && <GuideJsonLd path="/country/turkey" facts={FACTS} />}
      {children}
    </>
  );
}
