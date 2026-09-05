// ============================================================================
// Page: /fa/europe/estonia — Persian-only; no English page exists.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/europe-estonia';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata({ locale, path: page.path, title: page.title, description: page.description, modifiedTime: page.updated });
}

export default async function EstoniaFa({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') notFound();
  setRequestLocale(locale);
  return <FaPageLayout page={page} trail={[{ name: 'استونی', path: page.path }]} />;
}
