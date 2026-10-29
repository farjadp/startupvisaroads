// ============================================================================
// Page: /en/startup-visa-canada/designated-organizations — English only.
// The Persian page on the same subject lives at
// /fa/canada-startup-visa/designated-organizations and is unchanged; this route calls
// notFound() for every locale but English. The body is DesignatedOrganizationsEn.tsx.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import DesignatedOrganizationsEn, { META } from './DesignatedOrganizationsEn';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return {};
  return buildMetadata({ ...META, locale });
}

export default async function CanadaSuvDesignatedOrganizationsPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  setRequestLocale(locale);
  return <DesignatedOrganizationsEn />;
}
