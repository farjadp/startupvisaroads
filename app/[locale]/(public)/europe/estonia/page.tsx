// ============================================================================
// Page: /europe/estonia — serves both locales.
// /fa renders the Persian-first page from content/fa/europe-estonia.ts through
// FaPageLayout, unchanged. /en renders EstoniaEn, a guided route built from
// the same module (see the header of EstoniaEn.tsx for what was checked).
// ============================================================================
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/europe-estonia';
import { faMeta } from '@/lib/fa/content';
import EstoniaEn, { EN_META } from './EstoniaEn';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'fa') return buildMetadata(faMeta(page, locale));
  return buildMetadata({ ...EN_META, path: '/europe/estonia', locale: 'en' });
}

export default async function EstoniaPage({ params }: Props) {
  const { locale } = await params;
  // Before either branch renders a <Link>, so the route stays static.
  setRequestLocale(locale);
  if (locale === 'fa') {
    return <FaPageLayout page={page} trail={[{ name: 'استونی', path: page.path }]} />;
  }
  return <EstoniaEn />;
}
