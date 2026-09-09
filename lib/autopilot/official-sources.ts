export type OfficialSourceId =
  | 'canada-ircc'
  | 'canada-ontario'
  | 'canada-british-columbia'
  | 'canada-alberta'
  | 'canada-saskatchewan'
  | 'canada-manitoba'
  | 'canada-new-brunswick'
  | 'canada-newfoundland-labrador'
  | 'canada-nova-scotia'
  | 'canada-prince-edward-island'
  | 'usa-uscis'
  | 'finland-migri'
  | 'finland-business-finland'
  | 'denmark-nyidanmark'
  | 'denmark-business-authority'
  | 'estonia-startup-estonia'
  | 'netherlands-ind'
  | 'israel-innovation-authority'
  | 'israel-piba'
  | 'australia-home-affairs'
  | 'uae-government';

export type OfficialSource = {
  id: OfficialSourceId;
  authority: string;
  url: `https://${string}`;
  programmePaths: readonly string[];
  keywords: readonly string[];
  /**
   * Extra hosts that are the same authority, for cases where the canonical
   * URL above is not the host a writer would naturally cite. Only ever the
   * authority's own domains.
   */
  citationHosts?: readonly string[];
};

export const OFFICIAL_SOURCES: readonly OfficialSource[] = [
  { id: 'canada-ircc', authority: 'Immigration, Refugees and Citizenship Canada (IRCC)', url: 'https://www.canada.ca/', programmePaths: ['/startup-visa-canada', '/canada-startup-visa', '/pnp', '/tools/express-entry', '/country/canada'], keywords: ['canada', 'ircc', 'express entry', 'start-up visa', 'startup visa', 'pnp'] },
  { id: 'canada-ontario', authority: 'Government of Ontario', url: 'https://www.ontario.ca/', programmePaths: ['/pnp/ontario'], keywords: ['ontario', 'oinp'] },
  { id: 'canada-british-columbia', authority: 'WelcomeBC, Government of British Columbia', url: 'https://www.welcomebc.ca/', programmePaths: ['/pnp/bc'], keywords: ['british columbia', 'bc pnp'] },
  { id: 'canada-alberta', authority: 'Government of Alberta', url: 'https://www.alberta.ca/', programmePaths: ['/pnp/alberta'], keywords: ['alberta', 'aaip'] },
  { id: 'canada-saskatchewan', authority: 'Government of Saskatchewan', url: 'https://www.saskatchewan.ca/', programmePaths: ['/pnp/saskatchewan'], keywords: ['saskatchewan', 'sinp'] },
  { id: 'canada-manitoba', authority: 'Manitoba Immigration', url: 'https://immigratemanitoba.com/', programmePaths: ['/pnp/manitoba'], keywords: ['manitoba', 'mpnp'] },
  { id: 'canada-new-brunswick', authority: 'Government of New Brunswick', url: 'https://www2.gnb.ca/', programmePaths: ['/pnp/new-brunswick'], keywords: ['new brunswick', 'nbpnp', 'nbbis'], citationHosts: ['gnb.ca'] },
  { id: 'canada-newfoundland-labrador', authority: 'Government of Newfoundland and Labrador', url: 'https://www.gov.nl.ca/', programmePaths: ['/pnp/newfoundland'], keywords: ['newfoundland', 'labrador', 'nlpnp'] },
  { id: 'canada-nova-scotia', authority: 'Government of Nova Scotia', url: 'https://novascotia.ca/', programmePaths: ['/pnp/nova-scotia'], keywords: ['nova scotia', 'nsnp'] },
  { id: 'canada-prince-edward-island', authority: 'Government of Prince Edward Island', url: 'https://www.princeedwardisland.ca/', programmePaths: ['/pnp/pei'], keywords: ['prince edward island', 'pei pnp'] },
  { id: 'usa-uscis', authority: 'U.S. Citizenship and Immigration Services (USCIS)', url: 'https://www.uscis.gov/', programmePaths: ['/usa/', '/usa-eb2-niw', '/country/usa'], keywords: ['united states', 'usa', 'uscis', 'eb-1', 'eb-2', 'niw', 'eb-5'] },
  { id: 'finland-migri', authority: 'Finnish Immigration Service (Migri)', url: 'https://migri.fi/', programmePaths: ['/europe/finland', '/country/finland'], keywords: ['finland', 'migri'] },
  { id: 'finland-business-finland', authority: 'Business Finland', url: 'https://www.businessfinland.fi/', programmePaths: ['/europe/finland', '/country/finland'], keywords: ['finland', 'business finland'] },
  { id: 'denmark-nyidanmark', authority: 'New to Denmark (SIRI)', url: 'https://www.nyidanmark.dk/', programmePaths: ['/europe/denmark', '/country/denmark'], keywords: ['denmark', 'nyidanmark', 'siri'] },
  { id: 'denmark-business-authority', authority: 'Danish Business Authority', url: 'https://danishbusinessauthority.dk/', programmePaths: ['/europe/denmark', '/country/denmark'], keywords: ['denmark', 'danish business authority'] },
  { id: 'estonia-startup-estonia', authority: 'Startup Estonia', url: 'https://startupestonia.ee/', programmePaths: ['/europe/estonia'], keywords: ['estonia', 'startup estonia'] },
  { id: 'netherlands-ind', authority: 'Immigration and Naturalisation Service (IND)', url: 'https://ind.nl/', programmePaths: ['/europe/netherlands'], keywords: ['netherlands', 'dutch', 'ind'] },
  { id: 'israel-innovation-authority', authority: 'Israel Innovation Authority', url: 'https://innovationisrael.org.il/', programmePaths: ['/country/israel', '/israel'], keywords: ['israel', 'innovation authority', 'innovation visa', 'tnufa'] },
  { id: 'israel-piba', authority: 'Population and Immigration Authority (PIBA), Israel', url: 'https://www.gov.il/', programmePaths: ['/country/israel', '/israel'], keywords: ['israel', 'piba', 'population and immigration'] },
  { id: 'australia-home-affairs', authority: 'Australian Department of Home Affairs', url: 'https://immi.homeaffairs.gov.au/', programmePaths: ['/australia/', '/australia', '/country/australia'], keywords: ['australia', 'home affairs', 'national innovation visa', '858'] },
  { id: 'uae-government', authority: 'Official Portal of the UAE Government', url: 'https://u.ae/', programmePaths: ['/uae/', '/country/uae'], keywords: ['uae', 'united arab emirates', 'golden visa'] },
];

export type OfficialSourceBrief = {
  workingTitle: string;
  angle: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  mustLink: string[];
};

function containsKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, 'i').test(text);
}

export function officialSourcesForBrief(brief: OfficialSourceBrief): OfficialSource[] {
  const text = [brief.workingTitle, brief.angle, brief.primaryKeyword, ...brief.secondaryKeywords].join(' ');
  return OFFICIAL_SOURCES.filter((source) =>
    source.programmePaths.some((prefix) => brief.mustLink.some((path) => path === prefix || path.startsWith(prefix)))
    || source.keywords.some((keyword) => containsKeyword(text, keyword)),
  );
}

export function officialSourcePromptForBrief(brief: OfficialSourceBrief): string {
  const sources = officialSourcesForBrief(brief);
  const list = sources.length
    ? sources.map((source) => `- ${source.authority}: ${source.url}`).join('\n')
    : '- No relevant authority matched this brief. Do not make mutable programme claims.';
  return `OFFICIAL SOURCES FOR THIS BRIEF:\n${list}\nUse only these official sources for external links. Every mutable programme claim must have an inline citation to the relevant official source. If the supplied source does not support a mutable claim, omit the claim and direct the reader to verify it with the authority.`;
}

/**
 * `www.` carries no meaning here: canada.ca and www.canada.ca are one
 * authority, and which of the two a writer produces is chance. Matching the
 * raw hostname made that chance decide whether an article published, because
 * a rejected citation leaves officialCitationCount at zero and
 * decidePlannedPublication silently downgrades the piece to DRAFT. The
 * registry itself mixes the two forms — `migri.fi` beside
 * `www.businessfinland.fi` — so the exact match was rejecting citations to
 * authorities we had deliberately allowlisted.
 */
const stripWww = (host: string) => host.toLowerCase().replace(/^www\./, '');

const OFFICIAL_HOSTS = new Set(
  OFFICIAL_SOURCES.flatMap((source) => [
    stripWww(new URL(source.url).hostname),
    ...(source.citationHosts ?? []).map(stripWww),
  ]),
);

/**
 * A subdomain of an allowlisted host is the same authority — ircc.canada.ca
 * is IRCC. It can never be a third party: the suffix check requires a dot
 * boundary, so `notcanada.ca` and `canada.ca.example.com` do not match.
 */
function isOfficialHost(hostname: string): boolean {
  const host = stripWww(hostname);
  if (OFFICIAL_HOSTS.has(host)) return true;
  for (const allowed of OFFICIAL_HOSTS) if (host.endsWith(`.${allowed}`)) return true;
  return false;
}

export function officialCitationUrl(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.protocol !== 'https:' || url.port || url.username || url.password) return null;
    if (!isOfficialHost(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}
