// ============================================================================
// WebPage + BreadcrumbList for the English route guides (country, PNP,
// Netherlands, legacy US/UAE pages). Their Persian counterparts get this from
// FaPageLayout; the English ones carried only the sitewide Organization and
// WebSite graph. Title and description come from lib/pageMeta.ts so the
// structured data says what the <title> and meta description say.
// ============================================================================
import JsonLd from '@/components/JsonLd';
import { pageCopy } from '@/lib/pageMeta';
import { SITE_URL, breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo';

/** Extra WebPage fields a guide can state about itself: when its figures were last checked, who wrote it, what it cites. */
export interface GuideFacts {
  dateModified?: string;
  author?: { '@id': string };
  citation?: string[];
}

/** Section hubs a guide sits under, for the middle breadcrumb. */
const HUBS = ['/pnp', '/country'] as const;

export function guideJsonLd(path: string, facts: GuideFacts = {}) {
  const copy = pageCopy(path, 'en');
  if (!copy) return null;
  const url = `${SITE_URL}/en${path}`;
  const hub = HUBS.find((h) => path.startsWith(`${h}/`));
  const hubCopy = hub ? pageCopy(hub, 'en') : null;
  const crumbs = [
    { name: 'Home', url: `${SITE_URL}/en` },
    ...(hub && hubCopy ? [{ name: hubCopy.title, url: `${SITE_URL}/en${hub}` }] : []),
    { name: copy.title, url },
  ];
  return [
    { ...webPageJsonLd({ title: copy.title, description: copy.description, url, locale: 'en' }), ...facts },
    breadcrumbJsonLd(crumbs),
  ];
}

export default function GuideJsonLd({ path, facts }: { path: string; facts?: GuideFacts }) {
  const data = guideJsonLd(path, facts);
  return data ? <JsonLd data={data} /> : null;
}
