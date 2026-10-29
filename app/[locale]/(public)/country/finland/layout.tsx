// Structured data for the English page; see components/GuideJsonLd.tsx.
// Keep dateModified in step with UPDATED in page.tsx.
import type { ReactNode } from 'react';
import GuideJsonLd from '@/components/GuideJsonLd';
import { FOUNDER_ID } from '@/lib/seo';

const FACTS = {
  dateModified: '2026-10-27',
  author: { '@id': FOUNDER_ID },
  citation: [
    'https://migri.fi/en/start-up-entrepreneur',
    'https://migri.fi/en/working-in-finland/income-requirement',
    'https://migri.fi/en/permanent-residence-permit',
    'https://www.businessfinland.fi/en/do-business-with-finland/startup-in-finland/startup-permit',
  ],
};

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {locale === 'en' && <GuideJsonLd path="/country/finland" facts={FACTS} />}
      {children}
    </>
  );
}
