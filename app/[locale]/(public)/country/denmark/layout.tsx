// Structured data for the English page; see components/GuideJsonLd.tsx.
// Keep dateModified in step with UPDATED in page.tsx.
import type { ReactNode } from 'react';
import GuideJsonLd from '@/components/GuideJsonLd';
import { FOUNDER_ID } from '@/lib/seo';

const FACTS = {
  dateModified: '2026-10-27',
  author: { '@id': FOUNDER_ID },
  citation: [
    'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark',
    'https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Self-support---SIRI/',
    'https://nyidanmark.dk/en-GB/Applying/Permanent%20residence%20permit/Permanent%20residence',
    'https://startupdenmarkprogramme.dk/application-guide-startups',
  ],
};

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {locale === 'en' && <GuideJsonLd path="/country/denmark" facts={FACTS} />}
      {children}
    </>
  );
}
