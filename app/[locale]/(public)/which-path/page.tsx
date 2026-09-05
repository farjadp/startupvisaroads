// ============================================================================
// Page: /fa/which-path — the Persian assessment lead magnet. Persian-only;
// the English site has its own assessments and this is not a port of them.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import PathQuiz from '@/components/fa/PathQuiz';
import { meta } from '@/content/fa/which-path';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata({ locale, path: meta.path, title: meta.title, description: meta.description });
}

export default async function WhichPathFa({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') notFound();
  setRequestLocale(locale);

  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] font-vazir">
      <div className="min-h-[70vh] py-16 md:py-24">
        <PathQuiz />
      </div>
    </div>
  );
}
