// Structured data for the English page: WebPage + BreadcrumbList.
// Built here rather than through components/GuideJsonLd.tsx because that
// helper reads lib/pageMeta.ts, which has no English entry for this path yet,
// and only knows the /pnp and /country hubs. The /country hub is the middle
// crumb, matching the visible breadcrumb in BulgariaEn.tsx. The Persian page
// gets its own from FaPageLayout, so nothing is emitted for /fa here.
import type { ReactNode } from 'react';
import JsonLd from '@/components/JsonLd';
import { FOUNDER_ID, SITE_URL, breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo';
import { EN_META, FACTS, PATH } from './meta';

function bulgariaJsonLd() {
  const url = `${SITE_URL}/en${PATH}`;
  return [
    {
      ...webPageJsonLd({ title: EN_META.title, description: EN_META.description, url, locale: 'en' }),
      dateModified: FACTS.dateModified,
      author: { '@id': FOUNDER_ID },
      citation: FACTS.citation,
    },
    breadcrumbJsonLd([
      { name: 'Home', url: `${SITE_URL}/en` },
      { name: 'Destination Countries', url: `${SITE_URL}/en/country` },
      { name: EN_META.title, url },
    ]),
  ];
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      {locale === 'en' && <JsonLd data={bulgariaJsonLd()} />}
      {children}
    </>
  );
}
