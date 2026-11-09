// ============================================================================
// Which of the 17 app countries a news item is about, from its title and
// excerpt. Shared by the site (GET /api/app/news) and the mobile app (through
// `@shared/news-countries`), so the keyword table lives in exactly one place.
// Pure: no imports, no dependencies.
// ============================================================================

export type Country17 =
  | 'CA' | 'US' | 'AU' | 'DK' | 'FI' | 'EE' | 'NL' | 'IT' | 'ES'
  | 'AT' | 'IE' | 'NO' | 'SE' | 'BG' | 'TR' | 'IL' | 'AE';

/** Fixed order; `countriesIn` returns codes in this order. */
export const NEWS_COUNTRIES: readonly Country17[] = [
  'CA', 'US', 'AU', 'DK', 'FI', 'EE', 'NL', 'IT', 'ES', 'AT', 'IE', 'NO', 'SE', 'BG', 'TR', 'IL', 'AE',
] as const;

export const NEWS_COUNTRY_KEYWORDS: Record<Country17, RegExp> = {
  CA: /canad|ontario|nova scotia|new brunswick|manitoba|alberta|prince edward|\bpei\b|ircc|express entry|\bpnp\b|کانادا|نوا ?اسکوشیا|نیوبرانزویک|انتاریو|آلبرتا|مانیتوبا/i,
  US: /\busa?\b|united states|\bu\.s\.|eb-?[125]|\bniw\b|o-1|uscis|آمریکا/i,
  AU: /australia|sydney|melbourne|استرالیا/i,
  DK: /denmark|danish|copenhagen|دانمارک/i,
  FI: /finland|finnish|helsinki|فنلاند/i,
  EE: /estonia|tallinn|استونی/i,
  NL: /netherlands|dutch|amsterdam|هلند/i,
  IT: /\bital(y|ian)|milan|ایتالیا/i,
  ES: /\bspain\b|madrid|barcelona|\benisa\b|اسپانیا|مادرید|بارسلون/i,
  AT: /austria|vienna|red-white-red|اتریش|وین/i,
  IE: /ireland|irish|dublin|ایرلند/i,
  NO: /norw(ay|egian)|oslo|\budi\b|نروژ/i,
  SE: /swed(en|ish)|stockholm|migrationsverket|سوئد/i,
  BG: /bulgaria|بلغارستان/i,
  TR: /t(ü|u)rkiye|turkey|turkish|istanbul|ترکیه/i,
  IL: /israel|tel aviv|jerusalem|اسرائیل/i,
  AE: /\buae\b|emirates|dubai|abu dhabi|golden visa|امارات|دبی|ابوظبی/i,
};

/**
 * Countries mentioned in a title (and, when given, the excerpt). The regexes
 * are stateless (no `g` flag), so `.test` is safe to call repeatedly.
 */
export function countriesIn(title: string, excerpt?: string | null): Country17[] {
  const text = excerpt ? `${title}\n${excerpt}` : title;
  if (!text) return [];
  return NEWS_COUNTRIES.filter((c) => NEWS_COUNTRY_KEYWORDS[c].test(text));
}
