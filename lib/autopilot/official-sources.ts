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
  | 'italy-mimit-isv'
  | 'italy-registro-imprese'
  | 'spain-uge'
  | 'spain-enisa'
  | 'spain-boe-ley-14-2013'
  | 'bulgaria-mig-startup-visa'
  | 'bulgaria-nims'
  | 'turkiye-tech-visa'
  | 'israel-innovation-authority'
  | 'israel-piba'
  | 'australia-home-affairs'
  | 'uae-government'
  | 'canada-quebec'
  | 'netherlands-government'
  | 'netherlands-study-in-nl'
  | 'finland-infofinland'
  | 'finland-kela'
  | 'finland-study-in-finland'
  | 'denmark-life-in-denmark'
  | 'denmark-study-in-denmark'
  | 'italy-universitaly'
  | 'italy-visa-mfa'
  | 'uk-gov'
  | 'australia-study-australia'
  | 'australia-ato'
  | 'usa-state-dept'
  | 'usa-study-in-the-states'
  | 'turkiye-migration'
  | 'turkiye-study-in-turkiye'
  | 'estonia-study-in-estonia'
  | 'estonia-work-in-estonia'
  | 'estonia-police';

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
  { id: 'canada-british-columbia', authority: 'WelcomeBC, Government of British Columbia', url: 'https://www.welcomebc.ca/', programmePaths: ['/pnp/bc'], keywords: ['british columbia', 'bc pnp'], citationHosts: ['gov.bc.ca'] },
  { id: 'canada-alberta', authority: 'Government of Alberta', url: 'https://www.alberta.ca/', programmePaths: ['/pnp/alberta'], keywords: ['alberta', 'aaip'] },
  { id: 'canada-saskatchewan', authority: 'Government of Saskatchewan', url: 'https://www.saskatchewan.ca/', programmePaths: ['/pnp/saskatchewan'], keywords: ['saskatchewan', 'sinp'] },
  { id: 'canada-manitoba', authority: 'Manitoba Immigration', url: 'https://immigratemanitoba.com/', programmePaths: ['/pnp/manitoba'], keywords: ['manitoba', 'mpnp'], citationHosts: ['gov.mb.ca'] },
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
  { id: 'italy-mimit-isv', authority: 'Italia Startup Visa, Ministry of Enterprises and Made in Italy (MIMIT)', url: 'https://italiastartupvisa.mise.gov.it/', programmePaths: ['/europe/italy', '/country/italy'], keywords: ['italy', 'italia', 'startup visa', 'nulla osta', 'mimit'] },
  { id: 'italy-registro-imprese', authority: 'Registro delle Imprese — special section for innovative startups', url: 'https://startup.registroimprese.it/', programmePaths: ['/europe/italy', '/country/italy'], keywords: ['italy', 'italia', 'registro imprese', 'innovative startup', 'certified incubator'] },
  { id: 'spain-uge', authority: 'Unidad de Grandes Empresas y Colectivos Estratégicos (UGE), Ministerio de Inclusión, Seguridad Social y Migraciones', url: 'https://www.inclusion.gob.es/web/unidadgrandesempresas/emprendedores', programmePaths: ['/europe/spain'], keywords: ['spain', 'españa', 'emprendedor', 'uge', 'ley 14/2013'] },
  { id: 'spain-enisa', authority: 'Empresa Nacional de Innovación (ENISA)', url: 'https://www.enisa.es/', programmePaths: ['/europe/spain'], keywords: ['spain', 'enisa', 'emprendedor', 'empresa emergente'] },
  { id: 'spain-boe-ley-14-2013', authority: 'Boletín Oficial del Estado — Ley 14/2013, consolidated text', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074', programmePaths: ['/europe/spain'], keywords: ['spain', 'ley 14/2013', 'boe', 'emprendedores'] },
  { id: 'bulgaria-mig-startup-visa', authority: 'Ministry of Innovation and Growth of the Republic of Bulgaria — service 3263, Startup Visa certificate', url: 'https://www.mig.government.bg/3263-issuance-of-a-sertificate-for-a-high-tech-and-or-innovative-project-startup-visa/?lang=en', programmePaths: ['/europe/bulgaria'], keywords: ['bulgaria', 'startup visa', 'mig', 'ministry of innovation and growth', 'art. 24p'] },
  { id: 'bulgaria-nims', authority: 'National Investments Management System (NIMS / ISUN 2020) — Startup Visa application portal', url: 'https://enims.egov.bg/en', programmePaths: ['/europe/bulgaria'], keywords: ['bulgaria', 'nims', 'isun', 'startup visa application'] },
  { id: 'turkiye-tech-visa', authority: 'Türkiye Tech Visa, Ministry of Industry and Technology', url: 'https://turkiyetechvisa.gov.tr/', programmePaths: ['/turkey-tech-visa', '/country/turkey'], keywords: ['turkey', 'türkiye', 'tech visa', 'technopark'] },
  { id: 'israel-innovation-authority', authority: 'Israel Innovation Authority', url: 'https://innovationisrael.org.il/', programmePaths: ['/country/israel', '/israel'], keywords: ['israel', 'innovation authority', 'innovation visa', 'tnufa'] },
  { id: 'israel-piba', authority: 'Population and Immigration Authority (PIBA), Israel', url: 'https://www.gov.il/', programmePaths: ['/country/israel', '/israel'], keywords: ['israel', 'piba', 'population and immigration'] },
  { id: 'australia-home-affairs', authority: 'Australian Department of Home Affairs', url: 'https://immi.homeaffairs.gov.au/', programmePaths: ['/australia/', '/australia', '/country/australia'], keywords: ['australia', 'home affairs', 'national innovation visa', '858'] },
  { id: 'uae-government', authority: 'Official Portal of the UAE Government', url: 'https://u.ae/', programmePaths: ['/uae/', '/country/uae'], keywords: ['uae', 'united arab emirates', 'golden visa'] },

  // ── Study, life and work authorities (30 Oct 2026) ─────────────────────
  // The list above is immigration authorities only. Once the planner wrote
  // for students, families and workers (lib/autopilot/pillars.ts), five of
  // six life articles were held as DRAFT: schools, health cover, banking and
  // cost of living are set by education, health and tax bodies, and a cited
  // link to one was stripped as unofficial. Each entry is the government body
  // or its own official portal, never an agency or a guide site. CRA lives on
  // canada.ca and provincial health ministries on the provinces' own hosts,
  // which are already allowed above.
  { id: 'canada-quebec', authority: 'Gouvernement du Québec', url: 'https://www.quebec.ca/', programmePaths: [], keywords: ['quebec', 'québec', 'peq', 'csq'] },
  { id: 'netherlands-government', authority: 'Government of the Netherlands (Rijksoverheid)', url: 'https://www.government.nl/', programmePaths: ['/europe/netherlands'], keywords: ['netherlands', 'dutch', 'amsterdam', 'rotterdam'], citationHosts: ['rijksoverheid.nl', 'belastingdienst.nl', 'duo.nl'] },
  { id: 'netherlands-study-in-nl', authority: 'Study in NL (Nuffic, Dutch organisation for internationalisation in education)', url: 'https://www.studyinnl.org/', programmePaths: [], keywords: ['study in netherlands', 'dutch university', 'netherlands student', 'تحصیل در هلند'], citationHosts: ['nuffic.nl'] },
  { id: 'finland-infofinland', authority: 'InfoFinland (City of Helsinki and Finnish ministries)', url: 'https://www.infofinland.fi/', programmePaths: ['/europe/finland', '/country/finland'], keywords: ['finland', 'helsinki', 'finnish', 'فنلاند', 'هلسینکی'] },
  { id: 'finland-kela', authority: 'Kela, Social Insurance Institution of Finland', url: 'https://www.kela.fi/', programmePaths: [], keywords: ['kela', 'finland health', 'finland family benefit', 'finnish social security'] },
  { id: 'finland-study-in-finland', authority: 'Study in Finland (Finnish National Agency for Education)', url: 'https://www.studyinfinland.fi/', programmePaths: [], keywords: ['study in finland', 'finnish university', 'تحصیل در فنلاند'], citationHosts: ['oph.fi', 'opintopolku.fi'] },
  { id: 'denmark-life-in-denmark', authority: 'Life in Denmark (Danish Agency for Digital Government, borger.dk)', url: 'https://lifeindenmark.borger.dk/', programmePaths: ['/europe/denmark', '/country/denmark'], keywords: ['denmark', 'danish', 'copenhagen', 'دانمارک', 'کپنهاگ'], citationHosts: ['borger.dk', 'skat.dk'] },
  { id: 'denmark-study-in-denmark', authority: 'Study in Denmark (Danish Ministry of Higher Education and Science)', url: 'https://studyindenmark.dk/', programmePaths: [], keywords: ['study in denmark', 'danish university', 'denmark student'] },
  { id: 'italy-universitaly', authority: 'Universitaly (Italian Ministry of University and Research)', url: 'https://www.universitaly.it/', programmePaths: [], keywords: ['study in italy', 'italian university', 'universitaly', 'تحصیل در ایتالیا'] },
  { id: 'italy-visa-mfa', authority: 'Visto per l\'Italia, Italian Ministry of Foreign Affairs', url: 'https://vistoperitalia.esteri.it/', programmePaths: [], keywords: ['italy visa', 'italian visa', 'italy study visa', 'ویزای تحصیلی ایتالیا'], citationHosts: ['esteri.it'] },
  { id: 'uk-gov', authority: 'GOV.UK (UK Visas and Immigration and other UK government departments)', url: 'https://www.gov.uk/', programmePaths: ['/uk/'], keywords: ['uk', 'united kingdom', 'britain', 'england', 'skilled worker visa', 'graduate visa', 'innovator founder', 'انگلیس', 'بریتانیا'] },
  { id: 'australia-study-australia', authority: 'Study Australia (Australian Government)', url: 'https://www.studyaustralia.gov.au/', programmePaths: [], keywords: ['study in australia', 'australia student', 'تحصیلی استرالیا'] },
  { id: 'australia-ato', authority: 'Australian Taxation Office', url: 'https://www.ato.gov.au/', programmePaths: [], keywords: ['australia tax', 'australian tax'] },
  { id: 'usa-state-dept', authority: 'U.S. Department of State, Bureau of Consular Affairs', url: 'https://travel.state.gov/', programmePaths: [], keywords: ['us visa', 'f-1', 'f1 visa', 'j-1', 'visa interview', 'consulate'], citationHosts: ['state.gov'] },
  { id: 'usa-study-in-the-states', authority: 'Study in the States (U.S. Department of Homeland Security)', url: 'https://studyinthestates.dhs.gov/', programmePaths: [], keywords: ['f-1', 'f1', 'opt', 'stem opt', 'sevis', 'study in the us'], citationHosts: ['dhs.gov', 'ice.gov'] },
  { id: 'turkiye-migration', authority: 'Presidency of Migration Management, Republic of Türkiye', url: 'https://www.goc.gov.tr/', programmePaths: ['/turkey-tech-visa', '/country/turkey'], keywords: ['turkey', 'türkiye', 'turkiye', 'istanbul', 'residence permit turkey', 'ترکیه', 'استانبول'] },
  { id: 'turkiye-study-in-turkiye', authority: 'Study in Türkiye (Council of Higher Education)', url: 'https://www.studyinturkiye.gov.tr/', programmePaths: [], keywords: ['study in turkey', 'study in türkiye', 'turkish university'], citationHosts: ['yok.gov.tr'] },
  { id: 'estonia-study-in-estonia', authority: 'Study in Estonia (Education and Youth Board of Estonia)', url: 'https://www.studyinestonia.ee/', programmePaths: [], keywords: ['study in estonia', 'estonian university'] },
  { id: 'estonia-work-in-estonia', authority: 'Work in Estonia (Enterprise and Innovation Foundation, Estonian government)', url: 'https://www.workinestonia.com/', programmePaths: ['/europe/estonia'], keywords: ['estonia', 'tallinn', 'استونی', 'تالین'] },
  { id: 'estonia-police', authority: 'Police and Border Guard Board of Estonia', url: 'https://www.politsei.ee/', programmePaths: ['/europe/estonia'], keywords: ['estonia', 'estonian residence permit', 'd-visa'] },
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
