// ============================================================================
// lib/cover-art/countries.ts
// Which country an article is about, and how that country looks on a cover.
//
// Farjad picked the "country colour" cover on 10 Nov 2026: the whole frame in
// the country's colour, its real flag kept small, the headline on a paper
// card. The colours are the ones the country guides already use
// (components/fa/faThemes.ts) so a reader who has seen the Italy guide
// recognises an Italy article in the blog list. Countries the guides do not
// cover take a colour from their own flag.
//
// Pure data and string matching: no imports, so tests and scripts can load it.
// ============================================================================

export type CoverCountry = {
  /** ISO 3166-1 alpha-2, lower case: the flag file is assets/covers/flags/<code>.svg. */
  code: string;
  en: string;
  fa: string;
  /** Full-bleed background. Must hold paper (#F2F0E9) text at 4.5:1 — enforced by a test. */
  bg: string;
  /** English and Persian names, cities and route words that identify the country. */
  match: RegExp;
};

// Order matters only when two patterns hit at the same position, which the
// patterns are written to avoid. Canada lists its route names (Express Entry,
// PNP, PGWP) because many Canada headlines never say "Canada".
export const COUNTRIES: CoverCountry[] = [
  { code: 'ca', en: 'Canada', fa: 'کانادا', bg: '#C8001F', match: /canada|canadian|ontario|alberta|british columbia|quebec|manitoba|saskatchewan|nova scotia|new brunswick|prince edward|toronto|vancouver|ircc|express entry|\bpnp\b|pgwp|\bcrs\b|کانادا|انتاریو|آلبرتا|بریتیش|کبک|منیتوبا|ساسکاچوان|نوااسکوشیا|نیوبرانزویک|تورنتو|ونکوور|اکسپرس انتری/i },
  { code: 'it', en: 'Italy', fa: 'ایتالیا', bg: '#00753A', match: /italy|italian|italia|milan|turin|florence|bologna|ایتالیا|میلان|تورین|فلورانس/i },
  { code: 'dk', en: 'Denmark', fa: 'دانمارک', bg: '#C8102E', match: /denmark|danish|copenhagen|دانمارک|کپنهاگ/i },
  { code: 'nl', en: 'Netherlands', fa: 'هلند', bg: '#21468B', match: /netherlands|dutch|holland|amsterdam|rotterdam|هلند|آمستردام|روتردام/i },
  { code: 'fi', en: 'Finland', fa: 'فنلاند', bg: '#002F6C', match: /finland|finnish|helsinki|فنلاند|هلسینکی/i },
  { code: 'ee', en: 'Estonia', fa: 'استونی', bg: '#005EA8', match: /estonia|tallinn|استونی|تالین/i },
  { code: 'es', en: 'Spain', fa: 'اسپانیا', bg: '#A30F1F', match: /spain|spanish|madrid|barcelona|اسپانیا|مادرید|بارسلونا/i },
  { code: 'bg', en: 'Bulgaria', fa: 'بلغارستان', bg: '#00704F', match: /bulgaria|sofia|بلغارستان|صوفیه/i },
  { code: 'tr', en: 'Türkiye', fa: 'ترکیه', bg: '#B5000F', match: /turkey|türkiye|turkiye|istanbul|ankara|ترکیه|استانبول|آنکارا/i },
  { code: 'au', en: 'Australia', fa: 'استرالیا', bg: '#006B31', match: /australia|sydney|melbourne|استرالیا|سیدنی|ملبورن/i },
  { code: 'us', en: 'United States', fa: 'آمریکا', bg: '#0A3161', match: /\busa\b|\bu\.s\.|united states|america|\bniw\b|eb-?[12]\b|uscis|o-1|آمریکا|ایالات متحده/i },
  { code: 'gb', en: 'United Kingdom', fa: 'بریتانیا', bg: '#012169', match: /\buk\b|united kingdom|britain|british(?! columbia)|england|london|innovator founder|بریتانیا|انگلستان|لندن/i },
  { code: 'de', en: 'Germany', fa: 'آلمان', bg: '#B00000', match: /germany|german|berlin|munich|آلمان|برلین|مونیخ/i },
  { code: 'fr', en: 'France', fa: 'فرانسه', bg: '#002395', match: /france|french tech|paris|فرانسه|پاریس/i },
  { code: 'pt', en: 'Portugal', fa: 'پرتغال', bg: '#006600', match: /portugal|lisbon|پرتغال|لیسبون/i },
  { code: 'ie', en: 'Ireland', fa: 'ایرلند', bg: '#0B6E44', match: /ireland|irish|dublin|ایرلند|دوبلین/i },
  { code: 'be', en: 'Belgium', fa: 'بلژیک', bg: '#1A1A1A', match: /belgium|belgian|flanders|flemish|brussels|wallonia|بلژیک|بروکسل|فلاندر/i },
  { code: 'ae', en: 'UAE', fa: 'امارات', bg: '#00732F', match: /\buae\b|emirates|dubai|abu dhabi|امارات|دبی|ابوظبی/i },
  { code: 'nz', en: 'New Zealand', fa: 'نیوزیلند', bg: '#012169', match: /new zealand|auckland|نیوزیلند|اوکلند/i },
  { code: 'se', en: 'Sweden', fa: 'سوئد', bg: '#005B96', match: /sweden|swedish|stockholm|سوئد|استکهلم/i },
  { code: 'no', en: 'Norway', fa: 'نروژ', bg: '#A50B26', match: /norway|norwegian|oslo|نروژ|اسلو/i },
  { code: 'at', en: 'Austria', fa: 'اتریش', bg: '#B5102A', match: /austria|vienna|اتریش/i },
  { code: 'ch', en: 'Switzerland', fa: 'سوئیس', bg: '#B8241A', match: /switzerland|swiss|zurich|geneva|سوئیس|زوریخ|ژنو/i },
  { code: 'lt', en: 'Lithuania', fa: 'لیتوانی', bg: '#006A44', match: /lithuania|vilnius|لیتوانی|ویلنیوس/i },
  { code: 'lv', en: 'Latvia', fa: 'لتونی', bg: '#9E3039', match: /latvia|riga|لتونی|ریگا/i },
  { code: 'pl', en: 'Poland', fa: 'لهستان', bg: '#B5102F', match: /poland|polish|warsaw|لهستان|ورشو/i },
  { code: 'cz', en: 'Czechia', fa: 'چک', bg: '#11457E', match: /czech|prague|جمهوری چک|پراگ/i },
  { code: 'gr', en: 'Greece', fa: 'یونان', bg: '#0D5EAF', match: /greece|greek|athens|یونان|آتن/i },
  { code: 'il', en: 'Israel', fa: 'اسرائیل', bg: '#0038B8', match: /israel|tel aviv|اسرائیل|تل‌?آویو/i },
  { code: 'sg', en: 'Singapore', fa: 'سنگاپور', bg: '#C8102E', match: /singapore|سنگاپور/i },
];

/** The autopilot's destination tags (lib/autopilot/diversity.ts) mapped to a cover country. */
const DESTINATION_CODES: Record<string, string> = {
  canada: 'ca', italy: 'it', denmark: 'dk', netherlands: 'nl', finland: 'fi',
  estonia: 'ee', usa: 'us', australia: 'au', turkiye: 'tr',
};

export function countryByCode(code: string): CoverCountry | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

/** The country whose name appears earliest in `text`, so "Canada vs Australia" is Canada. */
function earliest(text: string): CoverCountry | null {
  let best: { c: CoverCountry; at: number } | null = null;
  for (const c of COUNTRIES) {
    const m = c.match.exec(text);
    if (m && (!best || m.index < best.at)) best = { c, at: m.index };
  }
  return best?.c ?? null;
}

export type CountrySignals = {
  title: string;
  /** `[dest:x]` written by the autopilot; the most reliable signal when present. */
  topicSeed?: string | null;
  category?: string | null;
  tags?: string[];
};

/**
 * The one country a cover is about, or null for a general article
 * (a cover with no country gets the brand's own night canvas, never a guess).
 * The title decides first: it is what the reader sees next to the cover.
 */
export function detectCountry(s: CountrySignals): CoverCountry | null {
  const fromTitle = earliest(s.title);
  if (fromTitle) return fromTitle;
  const dest = /\[dest:([a-z]+)\]/.exec(s.topicSeed ?? '')?.[1];
  if (dest && DESTINATION_CODES[dest]) return countryByCode(DESTINATION_CODES[dest]) ?? null;
  return earliest([s.category ?? '', ...(s.tags ?? [])].join(' · '));
}
