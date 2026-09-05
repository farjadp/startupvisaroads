// ============================================================================
// Page: /webinar — server wrapper that branches by locale. The English page
// is the original client component (WebinarEn.tsx); /fa/webinar is a
// Persian rewrite driven by WEBINAR_DATE.
// ============================================================================
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import WebinarEn from './WebinarEn';
import FaWebinar from '@/components/fa/FaWebinar';
import { webinar } from '@/content/fa/webinar';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata({ locale, path: webinar.meta.path, title: webinar.meta.title, description: webinar.meta.description });
}

export default async function WebinarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === 'fa' ? <FaWebinar /> : <WebinarEn />;
}
