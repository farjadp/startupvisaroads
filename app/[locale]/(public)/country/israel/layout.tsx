// Structured data for the English page; see components/GuideJsonLd.tsx.
// Keep dateModified in step with UPDATED in page.tsx: the date the facts were
// last verified, not the date the page was edited.
import type { ReactNode } from 'react';
import GuideJsonLd from '@/components/GuideJsonLd';
import { FOUNDER_ID } from '@/lib/seo';

const FACTS = {
  dateModified: '2026-09-09',
  author: { '@id': FOUNDER_ID },
  citation: [
    'https://innovationisrael.org.il/en/programs/tech-innovation-visa/',
    'https://innovationisrael.org.il/',
    'https://www.gov.il/',
  ],
};

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {locale === 'en' && <GuideJsonLd path="/country/israel" facts={FACTS} />}
      {children}
    </>
  );
}
