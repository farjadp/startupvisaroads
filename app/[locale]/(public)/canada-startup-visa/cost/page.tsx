// ============================================================================
// Page: /fa/canada-startup-visa/cost — Persian-only, no English twin.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/canada-startup-visa-cost';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata({ locale, path: page.path, title: page.title, description: page.description, modifiedTime: page.updated });
}

export default async function CanadaSuvCostFa({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') notFound();
  setRequestLocale(locale);

  return (
    <FaPageLayout
      page={page}
      trail={[
        { name: 'ویزای استارتاپ کانادا', path: '/canada-startup-visa' },
        { name: 'هزینه‌ها', path: page.path },
      ]}
    />
  );
}
