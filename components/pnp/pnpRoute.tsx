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
import ProvinceRail from '@/components/fa/pnp/ProvinceRail';
import ProvinceCards from '@/components/fa/pnp/ProvinceCards';

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
      ? (
        <FaPageLayout
          page={page}
          trail={trail}
          afterHero={<ProvinceRail current={page.path} />}
          beforeClosing={
            <section aria-labelledby="other-provinces" className="px-4 md:px-8 max-w-[1400px] mx-auto py-20 md:py-28 border-t border-[#1a1a1a]/10">
              <h2 id="other-provinces" className="font-estedad font-black text-3xl md:text-5xl leading-tight mb-4">استان‌های دیگر را هم ببینید</h2>
              <p className="text-lg leading-[1.9] text-[#1a1a1a]/70 max-w-[60ch] mb-10">آستانه‌ها، وضعیت دعوت و دوره‌ی پیش از نامزدی در هر استان فرق دارد. پیش از انتخاب، دست‌کم دو استان را کنار هم بگذارید.</p>
              <ProvinceCards exclude={page.path} compact />
            </section>
          }
        />
      )
      : <EnGuideLayout page={page} trail={trail} />;
  }

  return { generateMetadata, Page };
}
