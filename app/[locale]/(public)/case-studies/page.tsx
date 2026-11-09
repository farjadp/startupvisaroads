// ============================================================================
// app/[locale]/(public)/case-studies/page.tsx
// Case studies hub (spec §3, §7, §9). Filters are query parameters; a filtered
// view is noindex with its canonical on the unfiltered index. The Persian
// index 301s to English while no Persian case is published.
// ============================================================================
import React from 'react';
import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/JsonLd';
import CaseIndex from '@/components/case-studies/CaseIndex';
import { COPY } from '@/components/case-studies/copy';
import { buildMetadata } from '@/lib/seo';
import { countPublished, listPublished, readFilters, type CaseLocale } from '@/lib/case-studies/public';
import { caseBreadcrumbJsonLd, caseIndexUrl, indexAlternates } from '@/lib/case-studies/seo';

// Publishing and withdrawing do not call revalidatePath, so this page renders
// per request (it reads searchParams anyway); the DB query is one indexed read.
export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;
type Args = { params: Promise<{ locale: string }>; searchParams: Promise<SP> };

const asLocale = (l: string): CaseLocale => (l === 'fa' ? 'fa' : 'en');

function isFiltered(sp: SP): boolean {
  return ['route', 'outcome'].some((k) => sp[k] !== undefined && sp[k] !== '');
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  // Any filter parameter (even an unknown value) is a non-canonical view.
  const filtered = isFiltered(await searchParams);
  const t = COPY[locale];

  const [en, fa] = await Promise.all([countPublished('en'), countPublished('fa')]);
  const published: CaseLocale[] = [];
  if (en > 0) published.push('en');
  if (fa > 0) published.push('fa');

  const base = buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: '/case-studies',
    locale,
    noindex: filtered,
    nofollow: false,
  });
  return {
    ...base,
    alternates: filtered ? { canonical: caseIndexUrl(locale) } : indexAlternates(locale, published),
  };
}

export default async function CaseStudiesIndexPage({ params, searchParams }: Args) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  setRequestLocale(raw);

  const all = await listPublished({ locale });
  if (locale === 'fa' && all.length === 0) permanentRedirect('/en/case-studies');

  const filters = readFilters(await searchParams, Array.from(new Set(all.map((i) => i.route))));

  return (
    <>
      <JsonLd data={caseBreadcrumbJsonLd(locale, null, null)} />
      <CaseIndex lang={locale} all={all} filters={filters} />
    </>
  );
}
