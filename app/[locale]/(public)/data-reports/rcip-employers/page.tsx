// ============================================================================
// app/[locale]/(public)/data-reports/rcip-employers/page.tsx
// The RCIP employer finder, en and fa. The page itself is a static shell with
// the explanation (indexable, one canonical per locale); every row is loaded
// page by page from /api/finder/*, so no listing is in the HTML. Any query
// string is a non-canonical view.
// ============================================================================
import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/JsonLd';
import Finder from '@/components/rcip-finder/Finder';
import { COPY } from '@/components/rcip-finder/copy';
import { SITE_URL, breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

const PATH = '/data-reports/rcip-employers';
type Args = { params: Promise<{ locale: string }> };
const asLocale = (l: string): 'en' | 'fa' => (l === 'fa' ? 'fa' : 'en');

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = COPY[locale];
  const base = buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: PATH, locale });
  return {
    ...base,
    alternates: {
      canonical: `${SITE_URL}/${locale}${PATH}`,
      languages: { en: `${SITE_URL}/en${PATH}`, fa: `${SITE_URL}/fa${PATH}`, 'x-default': `${SITE_URL}/en${PATH}` },
    },
  };
}

export default async function RcipEmployersPage({ params }: Args) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  setRequestLocale(raw);
  const t = COPY[locale];
  const url = `${SITE_URL}/${locale}${PATH}`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: locale === 'fa' ? 'خانه' : 'Home', url: `${SITE_URL}/${locale}` },
            { name: locale === 'fa' ? 'گزارش‌های آماری' : 'Data reports', url: `${SITE_URL}/${locale}/data-reports` },
            { name: t.h1, url },
          ]),
          { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.metaTitle, description: t.metaDescription, url, applicationCategory: 'ReferenceApplication', operatingSystem: 'Web', isAccessibleForFree: true, inLanguage: locale === 'fa' ? 'fa-IR' : 'en-CA' },
        ]}
      />
      <Finder lang={locale} />
    </>
  );
}
