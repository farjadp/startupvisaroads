// ============================================================================
// Page: /europe/denmark — in English this path is a redirect to the
// canonical /country/denmark; in Persian it is the Start-up Denmark guide
// (paired with /en/country/denmark in FA_PAIRED).
// ============================================================================
import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/europe-denmark';
import { faMeta } from '@/lib/fa/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata(faMeta(page, locale));
}

export default async function DenmarkEurope({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') permanentRedirect(`/${locale}/country/denmark`);
  setRequestLocale(locale);
  return <FaPageLayout page={page} trail={[{ name: 'دانمارک', path: page.path }]} />;
}
