// Route content for the app. Thresholds, sources and checked dates are NOT
// copied here: they are read from lib/fa/programmes.ts, the same module the
// website's calculator and comparison table use, so the app and the site
// cannot disagree on a figure.
import type { ImageSourcePropType } from 'react-native';
import { RULES, type Rule } from '@shared/fa/programmes';
import type { Text } from './text';

export type RouteKey =
  | 'denmark'
  | 'finland'
  | 'estonia'
  | 'netherlands'
  | 'italy'
  | 'turkey'
  | 'new-brunswick'
  | 'nova-scotia'
  | 'eb2niw';

export type Country = 'CA' | 'DK' | 'FI' | 'EE' | 'NL' | 'IT' | 'TR' | 'US';

export type Photo = { source: ImageSourcePropType; alt: Text; credit: string; page: string };

export type RouteContent = {
  key: RouteKey;
  country: Country;
  name: Text;
  /** The fact that changes the decision. Leads every guide (Brand Book, voice). */
  fact: Text;
  /** English versions of the rule's `unscored` list; fa comes from RULES itself. */
  unscoredEn: string[];
  /** Pages on visaroads.com, per site locale. */
  guide: { en: string; fa?: string };
  photo: Photo;
  /** Official source and checked date for routes with no entry in RULES. */
  sourceOverride?: { url: string; updated: string };
};

const P = {
  denmark: require('../../assets/photos/denmark.webp'),
  finland: require('../../assets/photos/finland.webp'),
  estonia: require('../../assets/photos/estonia.webp'),
  netherlands: require('../../assets/photos/netherlands.webp'),
  italy: require('../../assets/photos/italy.webp'),
  turkey: require('../../assets/photos/turkey.webp'),
  newBrunswick: require('../../assets/photos/new-brunswick.webp'),
  novaScotia: require('../../assets/photos/nova-scotia.webp'),
  path: require('../../assets/photos/which-path.webp'),
};

export const PATH_PHOTO = P.path;

/** A decorative place photo per country, for news rows (hidden from screen readers). */
export const COUNTRY_PHOTO: Partial<Record<'CA' | 'DK' | 'FI' | 'EE' | 'NL' | 'IT' | 'TR', ImageSourcePropType>> = {
  CA: P.novaScotia,
  DK: P.denmark,
  FI: P.finland,
  EE: P.estonia,
  NL: P.netherlands,
  IT: P.italy,
  TR: P.turkey,
};

export const ROUTES: Record<RouteKey, RouteContent> = {
  denmark: {
    key: 'denmark',
    country: 'DK',
    name: { en: 'Start-up Denmark', fa: 'استارتاپ ویزای دانمارک', fr: 'Start-up Denmark', zh: '丹麦创业签证', ar: 'تأشيرة الشركات الناشئة في الدنمارك' },
    fact: {
      en: 'Permanent residence takes 8 years, not the 5 often quoted — and the expert panel assesses your business again when you renew.',
      fa: 'اقامت دائم ۸ سال طول می‌کشد، نه ۵ سالی که دست‌به‌دست می‌شود — و در تمدید، پنل کارشناسان کسب‌وکار شما را دوباره ارزیابی می‌کند.',
    },
    unscoredEn: ['Approval by the Start-up Denmark expert panel', 'Annual quota of 75 places, counted per person, not per team'],
    guide: { en: '/country/denmark', fa: '/fa/europe/denmark' },
    photo: { source: P.denmark, alt: { en: 'Nyhavn harbour, Copenhagen', fa: 'بندر نیهاون، کپنهاگ' }, credit: 'Ejov Igor / Pexels', page: 'https://www.pexels.com/photo/nyhavn-harbor-in-copenhagen-20375778/' },
  },
  finland: {
    key: 'finland',
    country: 'FI',
    name: { en: 'Finland startup permit', fa: 'استارتاپ ویزای فنلاند', fr: 'Permis start-up en Finlande', zh: '芬兰创业许可', ar: 'تصريح الشركات الناشئة في فنلندا' },
    fact: {
      en: 'You need at least two founders and a Business Finland eligibility statement no more than four months old.',
      fa: 'دست‌کم دو بنیان‌گذار لازم است، و گواهی واجد شرایط بودن Business Finland نباید بیش از چهار ماه از صدورش گذشته باشد.',
    },
    unscoredEn: ['Eligibility statement from Business Finland'],
    guide: { en: '/country/finland', fa: '/fa/europe/finland' },
    photo: { source: P.finland, alt: { en: 'Helsinki Cathedral', fa: 'کلیسای جامع هلسینکی' }, credit: 'Sylwia Bartyzel / Pexels', page: 'https://www.pexels.com/photo/helsinki-cathedral-in-helsinki-finland-17408748/' },
  },
  estonia: {
    key: 'estonia',
    country: 'EE',
    name: { en: 'Estonia startup visa', fa: 'استارتاپ ویزای استونی', fr: 'Visa start-up en Estonie', zh: '爱沙尼亚创业签证', ar: 'تأشيرة الشركات الناشئة في إستونيا' },
    fact: {
      en: 'Estonia does not allow dual citizenship. If you cannot give up your current one, this road ends at permanent residence.',
      fa: 'استونی تابعیت دوگانه را نمی‌پذیرد. اگر نمی‌توانید از تابعیت فعلی‌تان بگذرید، این مسیر در اقامت دائم تمام می‌شود.',
    },
    unscoredEn: ['Approval by the Ministry of the Interior expert committee, within 10 working days'],
    guide: { en: '/europe/estonia', fa: '/fa/europe/estonia' },
    photo: { source: P.estonia, alt: { en: 'A medieval street in Tallinn Old Town', fa: 'خیابانی قدیمی در شهر قدیم تالین' }, credit: 'Argo Allvee / Pexels', page: 'https://www.pexels.com/photo/charming-medieval-street-in-tallinn-old-town-39117789/' },
  },
  netherlands: {
    key: 'netherlands',
    country: 'NL',
    name: { en: 'Netherlands startup visa', fa: 'استارتاپ ویزای هلند', fr: 'Visa start-up aux Pays-Bas', zh: '荷兰创业签证', ar: 'تأشيرة الشركات الناشئة في هولندا' },
    fact: {
      en: 'The startup permit lasts 12 months and cannot be extended. After it, you apply again as self-employed under RVO’s points system.',
      fa: 'مجوز استارتاپ ۱۲ ماه است و تمدید نمی‌شود. پس از آن باید دوباره، این بار به‌عنوان خوداشتغال، با نظام امتیازی RVO درخواست بدهید.',
    },
    unscoredEn: [
      'A signed agreement with an RVO-approved facilitator',
      'A full year of funds — about €21,200 for one person and €29,700 for a family, but it changes every six months',
      'The first permit is one year at most and cannot be extended',
      'The product must be genuinely new to the Dutch market',
    ],
    guide: { en: '/europe/netherlands', fa: '/fa/europe/netherlands' },
    photo: { source: P.netherlands, alt: { en: 'Canal houses in Amsterdam', fa: 'خانه‌های کنار کانال در آمستردام' }, credit: 'Adrien Olichon / Pexels', page: 'https://www.pexels.com/photo/old-amsterdam-city-houses-on-canal-4237160/' },
  },
  italy: {
    key: 'italy',
    country: 'IT',
    name: { en: 'Italia Startup Visa', fa: 'استارتاپ ویزای ایتالیا', fr: 'Italia Startup Visa', zh: '意大利创业签证', ar: 'تأشيرة الشركات الناشئة في إيطاليا' },
    fact: {
      en: 'At most five founders per startup — and joining an existing startup instead needs €100,000 of your own money.',
      fa: 'حداکثر پنج بنیان‌گذار برای هر استارتاپ — و پیوستن به استارتاپ موجود ۱۰۰٬۰۰۰ یورو از منابع خودتان می‌خواهد.',
    },
    unscoredEn: [
      'Prior-year income of each applicant above about €8,400 — an income test, not savings',
      'Approval by the MIMIT technical committee by simple majority',
      'Meeting at least one of the three innovation tests in article 25 of Law 179/2012',
      'A prior link with Italy and its innovation ecosystem — its absence is named as a weakness',
      'Education and experience that match the field of the plan',
      'Mainly consulting or brokerage activity is not accepted since December 2024 (Law 193/2024)',
      'Joining an existing startup: €100,000 of the applicant’s own funds, into a company at least three years old',
    ],
    guide: { en: '/country/italy', fa: '/fa/europe/italy' },
    photo: { source: P.italy, alt: { en: 'Panorama of Florence', fa: 'نمای فلورانس' }, credit: 'Efrem Efre / Pexels', page: 'https://www.pexels.com/photo/panorama-of-city-of-florence-in-italy-26180562/' },
  },
  turkey: {
    key: 'turkey',
    country: 'TR',
    name: { en: 'Türkiye Tech Visa', fa: 'تک‌ویزای ترکیه', fr: 'Tech Visa Türkiye', zh: '土耳其科技签证', ar: 'تأشيرة التقنية في تركيا' },
    fact: {
      en: 'Open but narrow: 22 foreign startups were admitted between 16 Sep 2024 and 3 Mar 2026. It does not lead to an EU passport.',
      fa: 'باز است اما باریک: بین ۱۶ سپتامبر ۲۰۲۴ و ۳ مارس ۲۰۲۶، ۲۲ استارتاپ خارجی پذیرفته شدند. و به پاسپورت اروپایی نمی‌رسد.',
    },
    unscoredEn: [
      'Approval by the technopark review committee',
      'At least 20% of the shares for each foreign partner',
      'Product stage: no published bar; the committee judges it. An idea alone is refused, but unlike Estonia an MVP is not a formal requirement',
      'The rule of five Turkish employees per foreigner from month seven — a full exemption is not confirmed',
    ],
    guide: { en: '/country/turkey', fa: '/fa/turkey-tech-visa' },
    photo: { source: P.turkey, alt: { en: 'The Istanbul skyline', fa: 'خط افق استانبول' }, credit: 'Zülfü Demir / Pexels', page: 'https://www.pexels.com/photo/skyline-of-istanbul-with-modern-and-historic-architecture-39367019/' },
  },
  'new-brunswick': {
    key: 'new-brunswick',
    country: 'CA',
    name: { en: 'New Brunswick entrepreneur stream', fa: 'کارآفرینی نیوبرانزویک', fr: 'Volet entrepreneur du Nouveau-Brunswick', zh: '新不伦瑞克省企业家类别', ar: 'مسار رواد الأعمال في نيو برونزويك' },
    fact: {
      en: 'The language bar is CLB 4, and you need at least 65 of 100 points in the expression of interest before you are invited.',
      fa: 'حداقل زبان CLB 4 است، و پیش از دعوت باید دست‌کم ۶۵ امتیاز از ۱۰۰ در EOI بگیرید.',
    },
    unscoredEn: ['At least 65 of 100 points in the EOI system', 'Create at least one full-time job', '2 years of ownership or senior management in the last 5'],
    guide: { en: '/pnp/new-brunswick', fa: '/fa/pnp/new-brunswick' },
    photo: { source: P.newBrunswick, alt: { en: 'The Hopewell Rocks, New Brunswick', fa: 'صخره‌های هوپ‌ول، نیوبرانزویک' }, credit: 'Laura Stanley / Pexels', page: 'https://www.pexels.com/photo/green-trees-on-top-of-brown-rock-formations-11150624/' },
  },
  'nova-scotia': {
    key: 'nova-scotia',
    country: 'CA',
    name: { en: 'Nova Scotia entrepreneur stream', fa: 'کارآفرینی نوا اسکوشیا', fr: 'Volet entrepreneur de la Nouvelle-Écosse', zh: '新斯科舍省企业家类别', ar: 'مسار رواد الأعمال في نوفا سكوشا' },
    fact: {
      en: 'You run the business yourself for a year on a work permit before the province nominates you.',
      fa: 'پیش از نامزدی استان، یک سال کامل کسب‌وکار را با مجوز کار خودتان اداره می‌کنید.',
    },
    unscoredEn: ['Outside Halifax: net worth CAD 400,000 and investment CAD 100,000', 'At least one-third ownership', 'One year actively running the business on a work permit, before nomination'],
    guide: { en: '/pnp/nova-scotia', fa: '/fa/pnp/nova-scotia' },
    photo: { source: P.novaScotia, alt: { en: "Peggy's Cove lighthouse, Nova Scotia", fa: 'فانوس دریایی پگیز کوو، نوا اسکوشیا' }, credit: 'Lori LaBo / Pexels', page: 'https://www.pexels.com/photo/a-white-lighthouse-on-the-hill-near-the-sea-7623719/' },
  },
  eb2niw: {
    key: 'eb2niw',
    country: 'US',
    name: { en: 'EB-2 NIW (United States)', fa: 'EB-2 NIW آمریکا', fr: 'EB-2 NIW (États-Unis)', zh: '美国 EB-2 NIW', ar: 'EB-2 NIW (الولايات المتحدة)' },
    fact: {
      en: 'No employer and no investment are required — but check the current US entry restrictions for your nationality with a lawyer before anything else.',
      fa: 'به کارفرما و سرمایه‌گذاری نیاز ندارد — اما پیش از هر کاری، محدودیت‌های فعلی ورود به آمریکا را برای تابعیت خود با وکیل بررسی کنید.',
    },
    unscoredEn: ['The three Dhanasar criteria, judged by USCIS on your evidence', 'US entry restrictions that apply to some nationalities'],
    guide: { en: '/usa/eb2-niw', fa: '/fa/usa-eb2-niw' },
    photo: { source: P.path, alt: { en: 'A gravel path between stone walls', fa: 'راهی شنی میان دیوارهای سنگی' }, credit: 'VisaRoads', page: 'https://visaroads.com' },
    // Same source and checked date as the website's Persian NIW guide (content/fa/usa-eb2-niw.ts).
    sourceOverride: { url: 'https://www.uscis.gov/', updated: '2026-09-05' },
  },
};

/** Kind of road (4A icons). Picked by how the route works, never by country. */
export type RouteType = 'startup' | 'pnp' | 'tech' | 'niw';

export const ROUTE_TYPE: Record<RouteKey, RouteType> = {
  denmark: 'startup',
  finland: 'startup',
  estonia: 'startup',
  netherlands: 'startup',
  italy: 'startup',
  turkey: 'tech',
  'new-brunswick': 'pnp',
  'nova-scotia': 'pnp',
  eb2niw: 'niw',
};

export const COUNTRY_ORDER: Country[] = ['CA', 'DK', 'FI', 'EE', 'NL', 'IT', 'TR', 'US'];

export const ROUTE_ORDER: RouteKey[] = ['nova-scotia', 'new-brunswick', 'denmark', 'finland', 'estonia', 'netherlands', 'italy', 'turkey', 'eb2niw'];

export function ruleFor(key: RouteKey): Rule | undefined {
  return RULES.find((r) => r.key === key);
}

export function sourceFor(key: RouteKey): { url: string; updated: string } {
  const rule = ruleFor(key);
  if (rule) return { url: rule.source, updated: rule.updated };
  return ROUTES[key].sourceOverride!;
}

export const COUNTRY_NAMES: Record<Country, Text> = {
  CA: { en: 'Canada', fa: 'کانادا', fr: 'Canada', zh: '加拿大', ar: 'كندا' },
  DK: { en: 'Denmark', fa: 'دانمارک', fr: 'Danemark', zh: '丹麦', ar: 'الدنمارك' },
  FI: { en: 'Finland', fa: 'فنلاند', fr: 'Finlande', zh: '芬兰', ar: 'فنلندا' },
  EE: { en: 'Estonia', fa: 'استونی', fr: 'Estonie', zh: '爱沙尼亚', ar: 'إستونيا' },
  NL: { en: 'Netherlands', fa: 'هلند', fr: 'Pays-Bas', zh: '荷兰', ar: 'هولندا' },
  IT: { en: 'Italy', fa: 'ایتالیا', fr: 'Italie', zh: '意大利', ar: 'إيطاليا' },
  TR: { en: 'Türkiye', fa: 'ترکیه', fr: 'Türkiye', zh: '土耳其', ar: 'تركيا' },
  US: { en: 'United States', fa: 'آمریکا', fr: 'États-Unis', zh: '美国', ar: 'الولايات المتحدة' },
};
