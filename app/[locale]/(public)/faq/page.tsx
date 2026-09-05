// ============================================================================
// Page: /fa/faq — the Persian AEO surface. Persian-only, no English twin.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/faq';
import { faMeta } from '@/lib/fa/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata(faMeta(page, locale));
}

export default async function FaqFa({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') notFound();
  setRequestLocale(locale);

  return <FaPageLayout page={page} trail={[{ name: 'سؤالات متداول', path: page.path }]} />;
}
