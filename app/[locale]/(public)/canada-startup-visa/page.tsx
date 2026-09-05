// ============================================================================
// Page: /fa/canada-startup-visa — the Persian pillar page for the Canada
// Start-up Visa. Persian-only: the English twin is /en/startup-visa-canada
// (paired in FA_PAIRED), so a request for /en/canada-startup-visa is a 404.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/canada-startup-visa';
import { faMeta } from '@/lib/fa/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata(faMeta(page, locale));
}

export default async function CanadaStartupVisaFa({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') notFound();
  setRequestLocale(locale);

  return <FaPageLayout page={page} trail={[{ name: 'ویزای استارتاپ کانادا', path: page.path }]} />;
}
