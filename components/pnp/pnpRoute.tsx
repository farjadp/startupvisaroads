// ============================================================================
// components/pnp/pnpRoute.tsx
// One factory for the Entrepreneur PNP province pages, so each route file is
// three lines: it picks the Persian or English module by locale and renders
// the matching layout under the /pnp hub. A locale with no module is a 404;
// /fa paths outside FA_PATHS never reach here (middleware sends them to /en).
// ============================================================================
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import { faMeta, type FaPage } from '@/lib/fa/content';
import FaPageLayout from '@/components/fa/FaPageLayout';
import EnGuideLayout from '@/components/guide/EnGuideLayout';

type Props = { params: Promise<{ locale: string }> };

const HUB = {
  fa: { name: 'برنامه‌های استانی', path: '/pnp' },
  en: { name: 'Provincial Nominee Programs', path: '/pnp' },
} as const;

export function pnpRoute(opts: {
  fa?: FaPage;
  en?: FaPage;
  /** Breadcrumb label for this province, per locale. */
  name: { fa: string; en: string };
}) {
  const pick = (locale: string) => (locale === 'fa' ? opts.fa : locale === 'en' ? opts.en : undefined);

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const page = pick(locale);
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
    const page = pick(locale);
    if (!page) notFound();
    setRequestLocale(locale);
    const lang = locale as 'fa' | 'en';
    const trail = [HUB[lang], { name: opts.name[lang], path: page.path }];
    return lang === 'fa'
      ? <FaPageLayout page={page} trail={trail} />
      : <EnGuideLayout page={page} trail={trail} />;
  }

  return { generateMetadata, Page };
}
