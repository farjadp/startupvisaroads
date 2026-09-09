// ============================================================================
// Page: /fa/australia — the National Innovation Visa (subclass 858).
//
// This directory already holds the English /australia/entrepreneur-stream
// page, so the route is Persian-only and guards on the locale. The English
// twin is /country/australia.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/australia';
import { faMeta } from '@/lib/fa/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata(faMeta(page, locale));
}

export default async function AustraliaFa({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') notFound();
  setRequestLocale(locale);
  return <FaPageLayout page={page} trail={[{ name: 'استرالیا', path: page.path }]} />;
}
