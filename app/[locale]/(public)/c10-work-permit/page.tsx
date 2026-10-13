// /c10-work-permit — English only (the demand is English; see the content
// module). /fa/c10-work-permit is outside FA_PATHS and 301s here.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import EnGuideLayout from '@/components/guide/EnGuideLayout';
import { page } from '@/content/en/c10-work-permit';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return {};
  return buildMetadata({ locale, path: page.path, title: page.title, description: page.description, modifiedTime: page.updated });
}

export default async function C10Page({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  setRequestLocale(locale);
  return <EnGuideLayout page={page} trail={[{ name: 'Canada', path: '/country/canada' }, { name: 'C10 work permit', path: page.path }]} />;
}
