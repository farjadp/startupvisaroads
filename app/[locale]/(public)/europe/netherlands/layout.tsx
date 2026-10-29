// Structured data for the English page: WebPage + BreadcrumbList.
// Built here rather than through components/GuideJsonLd.tsx because that
// helper only knows the /pnp and /country hubs by path prefix, and this guide
// lives under /europe, which has no hub page (/en/europe returns 404). The
// /country hub links to this guide, so it is the middle crumb, matching the
// visible breadcrumb in page.tsx. Title and description come from
// lib/pageMeta.ts so the structured data says what the <title> says.
// Keep dateModified in step with UPDATED in page.tsx, and citation in step
// with its sources list. The Persian page gets its own from FaPageLayout.
import type { ReactNode } from 'react';
import JsonLd from '@/components/JsonLd';
import { pageCopy } from '@/lib/pageMeta';
import { FOUNDER_ID, SITE_URL, breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo';

const PATH = '/europe/netherlands';

// dateModified is the date the figures were last checked against official
// sources (IND fee table, IND required amounts, RVO, RDW: 29 Oct 2026), not
// merely the date the page was edited.
const FACTS = {
  dateModified: '2026-10-29',
  author: { '@id': FOUNDER_ID },
  citation: [
    'https://ind.nl/en/residence-permits/work/start-up',
    'https://ind.nl/en/fees-costs-of-an-application',
    'https://ind.nl/en/required-amounts-income-requirements',
    'https://ind.nl/en/residence-permits/work/residence-permit-self-employed-person',
    'https://ind.nl/en/replace-extend-renew-and-change/permanent-residency/permanent-residence-permit',
    'https://english.rvo.nl/topics/residence-permit-foreign-startups',
    'https://english.rvo.nl/topics/residence-permit-foreign-startups/requirements',
    'https://business.gov.nl/coming-to-the-netherlands/permits-and-visa/residence-permit-for-foreign-startups/',
    'https://www.rdw.nl/en/driving-licence/foreign-driving-licence/driving-with-a-foreign-driving-licence',
  ],
};

function netherlandsJsonLd() {
  const copy = pageCopy(PATH, 'en');
  const hub = pageCopy('/country', 'en');
  if (!copy) return null;
  const url = `${SITE_URL}/en${PATH}`;
  return [
    { ...webPageJsonLd({ title: copy.title, description: copy.description, url, locale: 'en' }), ...FACTS },
    breadcrumbJsonLd([
      { name: 'Home', url: `${SITE_URL}/en` },
      ...(hub ? [{ name: hub.title, url: `${SITE_URL}/en/country` }] : []),
      { name: copy.title, url },
    ]),
  ];
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = locale === 'en' ? netherlandsJsonLd() : null;
  return (
    <>
      {data && <JsonLd data={data} />}
      {children}
    </>
  );
}
