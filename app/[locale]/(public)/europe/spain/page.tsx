// ============================================================================
// Page: /europe/spain — serves both locales.
// /fa renders the Persian-first guide from content/fa/europe-spain.ts through
// FaPageLayout, unchanged. /en renders SpainEn, the English guided route built
// from the same verified module. Any other locale 404s.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/europe-spain';
import { faMeta } from '@/lib/fa/content';
import SpainEn from './SpainEn';
import { SPAIN_EN } from './meta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'fa') return buildMetadata(faMeta(page, locale));
  if (locale === 'en') {
    return buildMetadata({ title: SPAIN_EN.title, description: SPAIN_EN.description, path: SPAIN_EN.path, locale, image: SPAIN_EN.image });
  }
  return {};
}

export default async function SpainEurope({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') notFound();
  // Before the first <Link>, so the route stays static.
  setRequestLocale(locale);
  if (locale === 'fa') return <FaPageLayout page={page} trail={[{ name: 'اسپانیا', path: page.path }]} />;
  return <SpainEn />;
}
