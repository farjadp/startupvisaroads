// ============================================================================
// Page: /fa/which-path — the Persian assessment lead magnet. Persian-only;
// the English site has its own assessments and this is not a port of them.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import { faImageUrl, faServiceJsonLd } from '@/lib/fa/content';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo';
import PathQuiz from '@/components/fa/PathQuiz';
import RouteCompare from '@/components/fa/RouteCompare';
import Eligibility from '@/components/fa/Eligibility';
import { meta } from '@/content/fa/which-path';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata({ locale, path: meta.path, title: meta.title, description: meta.description, image: faImageUrl('which-path') });
}

export default async function WhichPathFa({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') notFound();
  setRequestLocale(locale);

  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] font-vazir">
      <JsonLd
        data={[
          faServiceJsonLd(),
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            '@id': `${SITE_URL}/fa${meta.path}`,
            name: meta.title,
            description: meta.description,
            url: `${SITE_URL}/fa${meta.path}`,
            inLanguage: 'fa-IR',
            applicationCategory: 'BusinessApplication',
            browserRequirements: 'JavaScript',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
            provider: { '@type': 'ProfessionalService', '@id': `${SITE_URL}/fa#service` },
          },
        ]}
      />
      <div className="min-h-[70vh] py-16 md:py-24">
        <PathQuiz />
      </div>
      {/* The quiz answers "which route"; these two answer "and can I clear
          it". Kept below the quiz so the lead magnet stays the first thing
          on the page. */}
      <div className="pb-20 md:pb-28">
        <RouteCompare />
        <Eligibility />
      </div>
    </div>
  );
}
