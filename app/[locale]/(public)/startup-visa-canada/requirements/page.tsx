// ============================================================================
// Page: /en/startup-visa-canada/requirements — English only.
// The Persian page on the same subject lives at
// /fa/canada-startup-visa/requirements and is unchanged; this route calls
// notFound() for every locale but English. The body is RequirementsEn.tsx.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import RequirementsEn, { META } from './RequirementsEn';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return {};
  return buildMetadata({ ...META, locale });
}

export default async function CanadaSuvRequirementsPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  setRequestLocale(locale);
  return <RequirementsEn />;
}
