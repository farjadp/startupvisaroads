// ============================================================================
// Page: /app — introduces the VisaRoads mobile app (en + fa).
// Counts come from lib/routes-v2 and the funds figure from lib/funds.ts, so
// the page says what the app says. Store links come from lib/app-links.ts.
// ============================================================================
import type { Metadata } from 'next';
import { APP_STORE_ID, APP_STORE_LINKS } from '@/lib/app-links';
import { setRequestLocale } from 'next-intl/server';
import { metaFor, pageCopy } from '@/lib/pageMeta';
import { SITE_URL, schemaLanguage } from '@/lib/seo';
import { ROUTES_V2 } from '@/lib/routes-v2';
import { FUNDS } from '@/lib/funds';
import { convert } from '@/lib/fx';
import JsonLd from '@/components/JsonLd';
import AppShowcase, { type ShowcaseFacts } from '@/components/app-page/AppShowcase';

type Props = { params: Promise<{ locale: string }> };

const PATH = '/app';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // Safari's own install banner, on this page only: the visitor came for the
  // app, and the site's phone prompt (components/AppPrompt) never runs here.
  return { ...metaFor(PATH, locale), itunes: { appId: APP_STORE_ID } };
}

function facts(locale: string): ShowcaseFacts {
  const single = FUNDS.DK.lines?.find((l) => l.key === 'single');
  if (!single || single.currency !== 'DKK') throw new Error('/app: Denmark single-applicant funds line is missing');
  const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
  const checked = new Date(`${FUNDS.DK.checked ?? '2026-10-15'}T12:00:00Z`).toLocaleDateString(
    locale === 'fa' ? 'fa-IR-u-ca-persian' : 'en-GB',
    { year: 'numeric', month: 'short' },
  );
  return {
    routes: ROUTES_V2.length,
    countries: new Set(ROUTES_V2.map((r) => r.country)).size,
    families: new Set(ROUTES_V2.map((r) => r.family)).size,
    funds: {
      amount: fmt(single.amount),
      usd: `≈ $${fmt(convert(single.amount, 'DKK', 'USD'))}`,
      eur: `≈ €${fmt(convert(single.amount, 'DKK', 'EUR'))}`,
      checked,
    },
  };
}

export default async function AppPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = pageCopy(PATH, locale);
  const url = `${SITE_URL}/${locale}${PATH}`;
  const listings = [APP_STORE_LINKS.appStore, APP_STORE_LINKS.googlePlay].filter((l): l is string => Boolean(l));

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'MobileApplication',
          '@id': `${url}#app`,
          name: 'VisaRoads',
          url,
          description: copy?.description,
          inLanguage: schemaLanguage(locale),
          // Only the platforms with a live listing (lib/app-links.ts).
          operatingSystem: APP_STORE_LINKS.appStore ? 'iOS, Android' : 'Android',
          applicationCategory: 'ReferenceApplication',
          installUrl: listings,
          downloadUrl: listings,
          sameAs: listings,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: { '@type': 'Organization', name: 'Ashavid Inc.' },
        }}
      />
      <AppShowcase locale={locale} facts={facts(locale)} />
    </>
  );
}
