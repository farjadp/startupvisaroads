// ============================================================================
// Page: /europe/finland — in English this path is a 176-word stub that
// competed with the 1,020-word /country/finland for the same query, so it
// permanently redirects there (matching how /europe/denmark already behaves).
// In Persian it is the Startup Permit guide, paired with /en/country/finland.
// ============================================================================
import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page as faPage } from '@/content/fa/europe-finland';
import { faMeta } from '@/lib/fa/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata(faMeta(faPage, locale));
}

export default async function FinlandPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') permanentRedirect(`/${locale}/country/finland`);
  setRequestLocale(locale);
  return <FaPageLayout page={faPage} trail={[{ name: 'فنلاند', path: faPage.path }]} />;
}
