// Structured data for the English page; see components/GuideJsonLd.tsx.
// Keep dateModified in step with UPDATED in page.tsx: it is the date the
// figures were last verified (2026-09-09), not the date of the redesign.
import type { ReactNode } from 'react';
import GuideJsonLd from '@/components/GuideJsonLd';
import { FOUNDER_ID } from '@/lib/seo';

const FACTS = {
  dateModified: '2026-09-09',
  author: { '@id': FOUNDER_ID },
  // Home Affairs blocks automated reads and no deep URL is recorded in the
  // repo, so the Department's home page is the one citation we can stand on.
  citation: ['https://immi.homeaffairs.gov.au/'],
};

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {locale === 'en' && <GuideJsonLd path="/country/australia" facts={FACTS} />}
      {children}
    </>
  );
}
