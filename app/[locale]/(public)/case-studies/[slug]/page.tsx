// ============================================================================
// app/[locale]/(public)/case-studies/[slug]/page.tsx
// One case study (spec §3, §7, §9). Published here -> CaseView. Published only
// in the other locale (or replaced after a withdrawal) -> 301 there. Else 404.
// hreflang is emitted only when both rows of the en/fa group are published.
// ============================================================================
import React from 'react';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/JsonLd';
import CaseView from '@/components/case-studies/CaseView';
import { buildMetadata, clampDescription, faqJsonLd } from '@/lib/seo';
import { findRedirectTarget, getPair, getPublished, type CaseLocale } from '@/lib/case-studies/public';
import { caseAlternates, caseArticleJsonLd, caseBreadcrumbJsonLd, caseReviewedPageJsonLd } from '@/lib/case-studies/seo';

// Publishing and withdrawing do not call revalidatePath; render per request so
// a withdrawal disappears on the next hit rather than after an ISR window.
export const dynamic = 'force-dynamic';

type Args = { params: Promise<{ locale: string; slug: string }> };
const asLocale = (l: string): CaseLocale => (l === 'fa' ? 'fa' : 'en');

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const c = await getPublished(locale, slug);
  if (!c) return { title: 'Not Found', robots: { index: false, follow: false } };

  const pair = await getPair(c.groupKey);
  const base = buildMetadata({
    title: c.title,
    description: clampDescription(c.excerpt || c.keyTakeaway || c.title),
    path: `/case-studies/${c.slug}`,
    locale,
    type: 'article',
    publishedTime: c.publishedAt.toISOString(),
    modifiedTime: c.updatedAt.toISOString(),
    // Sample rows exist only outside production; never let them be indexed.
    noindex: c.sample,
  });
  return { ...base, alternates: caseAlternates(locale, c.slug, pair) };
}

export default async function CaseStudyPage({ params }: Args) {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  setRequestLocale(raw);

  const c = await getPublished(locale, slug);
  if (!c) {
    const target = await findRedirectTarget(locale, slug);
    if (target) permanentRedirect(target);
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          caseArticleJsonLd({
            locale,
            slug: c.slug,
            title: c.title,
            description: c.excerpt || c.keyTakeaway || c.title,
            citation: c.citation,
            officialUrl: c.officialUrl,
            decisionDate: c.decisionDate,
            court: c.court,
            publishedAt: c.publishedAt,
            updatedAt: c.updatedAt,
          }),
          caseReviewedPageJsonLd(locale, c.slug, c.publishedAt),
          caseBreadcrumbJsonLd(locale, c.slug, c.title),
          faqJsonLd(c.faq, locale),
        ]}
      />
      <CaseView c={c} />
    </>
  );
}
