// /uk/innovator-founder — English guide; /fa/uk/... is outside FA_PATHS and
// 301s here until a Persian guide exists.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import EnGuideLayout from '@/components/guide/EnGuideLayout';
import { page } from '@/content/en/uk-innovator-founder';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'en') return {};
  return buildMetadata({ locale, path: page.path, title: page.title, description: page.description, modifiedTime: page.updated });
}

export default async function UkInnovatorFounderPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  setRequestLocale(locale);
  return <EnGuideLayout page={page} trail={[{ name: 'Destinations', path: '/country' }, { name: 'UK Innovator Founder', path: page.path }]} />;
}
