// /uk/innovator-founder — English and Persian guides, written in the same
// pass from the same gov.uk facts (content/en and content/fa).
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import EnGuideLayout from '@/components/guide/EnGuideLayout';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { faMeta } from '@/lib/fa/content';
import { page } from '@/content/en/uk-innovator-founder';
import { page as faPage } from '@/content/fa/uk-innovator-founder';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'fa') return buildMetadata(faMeta(faPage, locale));
  if (locale !== 'en') return {};
  return buildMetadata({ locale, path: page.path, title: page.title, description: page.description, modifiedTime: page.updated });
}

export default async function UkInnovatorFounderPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'fa') notFound();
  setRequestLocale(locale);
  if (locale === 'fa') {
    return <FaPageLayout page={faPage} trail={[{ name: 'ویزای استارتاپ انگلیس', path: faPage.path }]} />;
  }
  return <EnGuideLayout page={page} trail={[{ name: 'Destinations', path: '/country' }, { name: 'UK Innovator Founder', path: page.path }]} />;
}
