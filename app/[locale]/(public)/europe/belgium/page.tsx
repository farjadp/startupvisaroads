// ============================================================================
// Page: /europe/belgium — the Flemish Innovation & Startup Permit guide.
// /fa renders content/fa/europe-belgium.ts through FaPageLayout; /en renders
// its English twin, content/en/europe-belgium.ts, through EnGuideLayout.
// Same figures, same blocks, written in the same pass; paired for hreflang.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import EnGuideLayout from '@/components/guide/EnGuideLayout';
import { page as fa } from '@/content/fa/europe-belgium';
import { page as en } from '@/content/en/europe-belgium';
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

export default async function BelgiumEurope({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') notFound();
  setRequestLocale(locale);
  if (locale === 'fa') return <FaPageLayout page={fa} trail={[{ name: 'بلژیک', path: fa.path }]} />;
  return <EnGuideLayout page={en} trail={[{ name: 'Belgium', path: en.path }]} />;
}
