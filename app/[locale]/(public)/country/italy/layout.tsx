// Structured data for the English page; see components/GuideJsonLd.tsx.
// Keep dateModified in step with UPDATED in page.tsx.
import type { ReactNode } from 'react';
import GuideJsonLd from '@/components/GuideJsonLd';
import { FOUNDER_ID } from '@/lib/seo';

const FACTS = {
  dateModified: '2026-09-24',
  author: { '@id': FOUNDER_ID },
  citation: [
    'https://italiastartupvisa.mise.gov.it/',
    'https://italiastartupvisa.mise.gov.it/media/documents/Guidelines%20ISV%20ENG%2020_03_2018%20def.pdf',
    'https://startup.registroimprese.it/',
    'https://prefettura.interno.gov.it/it/prefetture/macerata/comunicazioni/dpcm-2-ottobre-2025-programmazione-dei-flussi-dingresso-2026-2028',
  ],
};

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {locale === 'en' && <GuideJsonLd path="/country/italy" facts={FACTS} />}
      {children}
    </>
  );
}
