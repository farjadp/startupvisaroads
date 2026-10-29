// ============================================================================
// Page: /faq — the FAQ, in both locales.
// /fa renders the Persian AEO surface through FaPageLayout, unchanged. /en
// renders the English FAQ (./FaqEn.tsx): every question of
// content/fa/faq.ts, written for an international audience, with the
// Iran-specific advice kept as labelled notes. Data: ./en-faqs.ts.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/faq';
import { faImageUrl, faMeta } from '@/lib/fa/content';
import FaqEn from './FaqEn';
import { FAQ_META, FAQ_PATH } from './en-faqs';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'en') {
    return buildMetadata({ locale, path: FAQ_PATH, title: FAQ_META.title, description: FAQ_META.description, image: faImageUrl('which-path') });
  }
  if (locale !== 'fa') return {};
  return buildMetadata(faMeta(page, locale));
}

export default async function FaqFa({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') notFound();
  setRequestLocale(locale);
  if (locale === 'en') return <FaqEn />;

  return <FaPageLayout page={page} trail={[{ name: 'سؤالات متداول', path: page.path }]} />;
}
