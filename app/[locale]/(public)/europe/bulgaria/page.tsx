// ============================================================================
// Page: /europe/bulgaria — the Bulgarian Startup Visa guide, both locales.
// /fa renders the Persian-first page from content/fa/europe-bulgaria.ts
// through FaPageLayout, unchanged. /en renders BulgariaEn, a guided route in
// the shape of /country/finland built from the same verified module.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/europe-bulgaria';
import { faMeta } from '@/lib/fa/content';
import BulgariaEn from './BulgariaEn';
import { EN_META, PATH } from './meta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'fa') return buildMetadata(faMeta(page, locale));
  if (locale === 'en') return buildMetadata({ title: EN_META.title, description: EN_META.description, path: PATH, locale, image: EN_META.image });
  return {};
}

export default async function BulgariaEurope({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') notFound();
  // Before the first <Link>, so the route stays static in both locales.
  setRequestLocale(locale);
  if (locale === 'fa') return <FaPageLayout page={page} trail={[{ name: 'بلغارستان', path: page.path }]} />;
  return <BulgariaEn />;
}
