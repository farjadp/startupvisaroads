// ============================================================================
// app/[locale]/(public)/data-reports/page.tsx
// Data reports index, en and fa. Lists the articles tagged `data-report`
// (lib/data-reports), grouped by the month their data covers. Independent of
// the Case Studies pipeline: the only thing read from it is whether its index
// has anything to link to.
// ============================================================================
import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/JsonLd';
import ReportIndex from '@/components/data-reports/ReportIndex';
import { COPY } from '@/components/data-reports/copy';
import { SITE_URL, breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { countPublished } from '@/lib/case-studies/public';
import {
  DATA_REPORTS_PATH,
  countDataReports,
  dataReportsIndexJsonLd,
  dataReportsUrl,
  groupByEdition,
  indexAlternates,
  listDataReports,
  rcipJobMarketDatasetJsonLd,
  type ReportLocale,
} from '@/lib/data-reports';

// Publishing an article does not revalidate this path, so it renders per
// request; the query is one indexed read.
export const dynamic = 'force-dynamic';

type Args = { params: Promise<{ locale: string }> };

const asLocale = (l: string): ReportLocale => (l === 'fa' ? 'fa' : 'en');

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = COPY[locale];
  const counts = await countDataReports();
  const withReports = (['en', 'fa'] as const).filter((l) => counts[l].count > 0);
  const base = buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: DATA_REPORTS_PATH,
    locale,
    // An index with nothing on it yet stays out of search results.
    noindex: counts[locale].count === 0,
    nofollow: false,
  });
  return { ...base, alternates: indexAlternates(locale, withReports) };
}

export default async function DataReportsPage({ params }: Args) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  setRequestLocale(raw);
  const t = COPY[locale];

  const [reports, cases] = await Promise.all([listDataReports(locale), countPublished(locale)]);
  const editions = groupByEdition(reports);
  const rcip = groupByEdition(reports.filter((r) => r.slug.startsWith('rcip-job-market-')));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t.home, url: `${SITE_URL}/${locale}` },
            { name: t.title, url: dataReportsUrl(locale) },
          ]),
          dataReportsIndexJsonLd({ locale, name: t.metaTitle, description: t.metaDescription, reports }),
          rcipJobMarketDatasetJsonLd({ locale, name: t.metaTitle, description: t.metaDescription, editions: rcip }),
        ]}
      />
      <ReportIndex lang={locale} editions={editions} showCaseStudies={cases > 0} />
    </>
  );
}
