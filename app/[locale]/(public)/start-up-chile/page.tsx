// ============================================================================
// Page: /start-up-chile — CORFO's Start-Up Chile accelerator (BIG 13 call).
// /fa renders content/fa/start-up-chile.ts through FaPageLayout (which hands
// a programme guide to FaGuideLayout); /en renders its English twin,
// content/en/start-up-chile.ts, through EnGuideLayout. Same figures, checked
// against the same official documents; paired for hreflang.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import EnGuideLayout from '@/components/guide/EnGuideLayout';
import { page as fa } from '@/content/fa/start-up-chile';
import { page as en } from '@/content/en/start-up-chile';
import { faMeta } from '@/lib/fa/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'fa') return buildMetadata(faMeta(fa, locale));
  if (locale === 'en') {
    return buildMetadata({
      locale,
      path: en.path,
      title: en.title,
      description: en.description,
      modifiedTime: en.updated,
      image: en.image ? `/fa/img/${en.image}.webp` : undefined,
    });
  }
  return {};
}

export default async function StartUpChile({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') notFound();
  setRequestLocale(locale);
  if (locale === 'fa') return <FaPageLayout page={fa} trail={[{ name: 'استارتاپ شیلی', path: fa.path }]} />;
  return <EnGuideLayout page={en} trail={[{ name: 'Start-Up Chile', path: en.path }]} />;
}
