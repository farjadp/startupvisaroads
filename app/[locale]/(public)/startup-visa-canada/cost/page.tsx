// ============================================================================
// Page: /en/startup-visa-canada/cost — English only.
// The Persian page on the same subject lives at
// /fa/canada-startup-visa/cost and is unchanged; this route calls
// notFound() for every locale but English. The body is CostEn.tsx.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import CostEn, { META } from './CostEn';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return {};
  return buildMetadata({ ...META, locale });
}

export default async function CanadaSuvCostPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  setRequestLocale(locale);
  return <CostEn />;
}
