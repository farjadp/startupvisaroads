// ============================================================================
// Page: /europe/italy — in English this path is a redirect to the canonical
// /country/italy; in Persian it is the Italia Startup Visa guide (paired with
// /en/country/italy in FA_PAIRED), the same arrangement Denmark uses.
// ============================================================================
import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/europe-italy';
import { faMeta } from '@/lib/fa/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata(faMeta(page, locale));
}

export default async function ItalyEurope({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') permanentRedirect(`/${locale}/country/italy`);
  setRequestLocale(locale);
  return <FaPageLayout page={page} trail={[{ name: 'ایتالیا', path: page.path }]} />;
}
