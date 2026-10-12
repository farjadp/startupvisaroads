// ============================================================================
// Page: /fa/usa-eb2-niw — Persian-only; paired with /en/usa/eb2-niw in
// FA_PAIRED, so /en/usa-eb2-niw is a 404.
// ============================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import FaPageLayout from '@/components/fa/FaPageLayout';
import { page } from '@/content/fa/usa-eb2-niw';
import { faMeta } from '@/lib/fa/content';
import UsaCluster from '@/components/usa/UsaCluster';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata(faMeta(page, locale));
}

export default async function UsaEb2NiwFa({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'fa') notFound();
  setRequestLocale(locale);

  return (
    <FaPageLayout
      page={page}
      trail={[{ name: 'آمریکا', path: '/usa' }, { name: 'EB-2 NIW آمریکا', path: page.path }]}
      extra={<UsaCluster locale="fa" current={page.path} />}
    />
  );
}
