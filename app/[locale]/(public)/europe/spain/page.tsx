// ============================================================================
// Page: /europe/spain — the Spanish entrepreneur residence guide, Persian only.
// No English twin yet, so outside /fa this path 404s rather than redirecting
// to a /country/spain that does not exist.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/europe-spain';
import { faMeta } from '@/lib/fa/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata(faMeta(page, locale));
}

export default async function SpainEurope({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') notFound();
  setRequestLocale(locale);
  return <FaPageLayout page={page} trail={[{ name: 'اسپانیا', path: page.path }]} />;
}
