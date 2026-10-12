// ============================================================================
// components/usa/usaRoute.tsx
// One factory for every page of the US cluster, so each route file is three
// lines: it picks the Persian or English module by locale, renders the right
// layout, and appends the cluster link grid (plus the form on the assessment).
// A locale with no module is a 404 — the hub is /fa/usa and /en/country/usa.
// ============================================================================
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import { faMeta, type FaPage } from '@/lib/fa/content';
import FaPageLayout from '@/components/fa/FaPageLayout';
import EnGuideLayout from '@/components/guide/EnGuideLayout';
import UsaCluster from './UsaCluster';
import UsaAssessment from './UsaAssessment';

type Props = { params: Promise<{ locale: string }> };

const HUB = {
  fa: { name: 'آمریکا', path: '/usa' },
  en: { name: 'United States', path: '/country/usa' },
} as const;

export function usaRoute(opts: {
  fa?: FaPage;
  en?: FaPage;
  /** Breadcrumb label for this page, per locale. */
  name: { fa: string; en: string };
  withAssessment?: boolean;
}) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const page = locale === 'fa' ? opts.fa : locale === 'en' ? opts.en : undefined;
    if (!page) return {};
    return buildMetadata(locale === 'fa' ? faMeta(page, locale) : {
      locale,
      path: page.path,
      title: page.title,
      description: page.description,
      modifiedTime: page.updated,
    });
  }

  async function Page({ params }: Props) {
    const { locale } = await params;
    const page = locale === 'fa' ? opts.fa : locale === 'en' ? opts.en : undefined;
    if (!page) notFound();
    setRequestLocale(locale);

    const lang = locale as 'fa' | 'en';
    const hub = HUB[lang];
    const trail = page.path === hub.path ? [hub] : [hub, { name: opts.name[lang], path: page.path }];
    const extra = (
      <>
        {opts.withAssessment && <UsaAssessment locale={lang} />}
        <UsaCluster locale={lang} current={page.path} />
      </>
    );

    return lang === 'fa' ? (
      <FaPageLayout page={page} trail={trail} extra={extra} />
    ) : (
      <EnGuideLayout page={page} trail={trail} extra={extra} />
    );
  }

  return { generateMetadata, Page };
}
