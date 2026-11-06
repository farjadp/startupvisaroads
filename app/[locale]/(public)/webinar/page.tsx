// ============================================================================
// Page: /webinar — server wrapper that branches by locale. The English page
// is the original client component (WebinarEn.tsx); /fa/webinar is a
// Persian rewrite driven by WEBINAR_DATE.
// ============================================================================
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata, SITE_URL, ORGANIZATION_ID, FOUNDER_ID } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import { metaFor } from '@/lib/pageMeta';
import { faImageUrl } from '@/lib/fa/content';
import WebinarEn from './WebinarEn';
import FaWebinar from '@/components/fa/FaWebinar';
import { webinar, WEBINAR_DATE, WEBINAR_MINUTES, PLAYLIST_URL } from '@/content/fa/webinar';

/** schema.org Event for the next Persian meetup, so search and AI answers can list it. */
function meetupJsonLd() {
  if (!WEBINAR_DATE) return null;
  const start = new Date(WEBINAR_DATE);
  const end = new Date(start.getTime() + WEBINAR_MINUTES * 60_000);
  const url = `${SITE_URL}/fa${webinar.meta.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: webinar.meta.title,
    description: webinar.meta.description,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: { '@type': 'VirtualLocation', url },
    inLanguage: 'fa',
    isAccessibleForFree: true,
    image: faImageUrl('webinar'),
    url,
    organizer: { '@id': ORGANIZATION_ID },
    performer: { '@id': FOUNDER_ID },
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'CAD', availability: 'https://schema.org/InStock', url, validFrom: '2026-11-06' },
    subjectOf: { '@type': 'CreativeWorkSeries', name: 'رویداد آنلاین استارتاپ و استارتاپ ویزا', url: PLAYLIST_URL },
  };
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return metaFor('/webinar', locale);
  return buildMetadata({ locale, path: webinar.meta.path, title: webinar.meta.title, description: webinar.meta.description, image: faImageUrl('webinar') });
}

export default async function WebinarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (locale !== 'fa') return <WebinarEn />;
  return (
    <>
      <JsonLd data={[meetupJsonLd()]} />
      <FaWebinar />
    </>
  );
}
