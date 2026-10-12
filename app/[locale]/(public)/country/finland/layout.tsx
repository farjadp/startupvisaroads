// Structured data for the English page; see components/GuideJsonLd.tsx.
import type { ReactNode } from 'react';
import GuideJsonLd from '@/components/GuideJsonLd';

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {locale === 'en' && <GuideJsonLd path="/country/finland" />}
      {children}
    </>
  );
}
