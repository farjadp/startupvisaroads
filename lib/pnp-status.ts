// ============================================================================
// lib/pnp-status.ts
// Where every Canadian province and territory stands for entrepreneurs, and
// the minimums of the streams that are open — one source for the /pnp status
// board and the net-worth check, in English and Persian.
//
// Checked against each jurisdiction's own pages on CHECKED (see `source`).
// Figures repeat the province guides (content/{en,fa}/pnp-*.ts) and
// components/pnp/EntrepreneurComparison.tsx; change them together.
// Manitoba's site refuses automated reads, so its line keeps the wording
// verified on 2026-10-12.
// ============================================================================

export const PNP_CHECKED = '2026-11-02';

export type PnpTone = 'open' | 'limited' | 'closed' | 'none';

export type Jurisdiction = {
  code: string;
  name: { en: string; fa: string };
  tone: PnpTone;
  note: { en: string; fa: string };
  /** Our guide, if we have one (locale-agnostic path). */
  href?: string;
  /** Persian guide exists for this jurisdiction. */
  faGuide?: boolean;
  source: string;
};

export const JURISDICTIONS: Jurisdiction[] = [
  {
    code: 'BC', name: { en: 'British Columbia', fa: 'بریتیش کلمبیا' }, tone: 'open', href: '/pnp/bc', faGuide: true,
    note: { en: 'Monthly invitations; 20 Oct 2026 round: lowest score 118', fa: 'دعوت ماهانه؛ دور ۲۰ اکتبر ۲۰۲۶: کمترین امتیاز ۱۱۸' },
    source: 'https://www.welcomebc.ca/immigrate-to-b-c/about-the-bc-provincial-nominee-program/invitations-to-apply',
  },
  {
    code: 'AB', name: { en: 'Alberta', fa: 'آلبرتا' }, tone: 'open', href: '/pnp/alberta', faGuide: true,
    note: { en: '23 of 60 entrepreneur nominations left for 2026, 213 files in process', fa: '۲۳ نامزدی از ۶۰ سهمیه‌ی کارآفرینی ۲۰۲۶ مانده؛ ۲۱۳ پرونده در جریان' },
    source: 'https://www.alberta.ca/aaip-processing-information',
  },
  {
    code: 'NB', name: { en: 'New Brunswick', fa: 'نیوبرانزویک' }, tone: 'open', href: '/pnp/new-brunswick', faGuide: true,
    note: { en: 'Business Immigration Stream; nomination after 6 months of operation', fa: 'مسیر مهاجرت کسب‌وکار؛ نامزدی پس از ۶ ماه اداره‌ی کسب‌وکار' },
    source: 'https://www.gnb.ca/en/topic/family-home-community/immigration/provincial-nominee-program/business-immigration-stream.html',
  },
  {
    code: 'NS', name: { en: 'Nova Scotia', fa: 'نوااسکوشیا' }, tone: 'open', href: '/pnp/nova-scotia', faGuide: true,
    note: { en: 'By invitation; 4 draws in 2026, lowest scores 88 to 101', fa: 'با دعوت؛ ۴ دور در ۲۰۲۶، کمترین امتیاز ۸۸ تا ۱۰۱' },
    source: 'https://liveinnovascotia.com/entrepreneur',
  },
  {
    code: 'NL', name: { en: 'Newfoundland and Labrador', fa: 'نیوفاندلند و لابرادور' }, tone: 'open', href: '/pnp/newfoundland',
    note: { en: 'Expression of Interest system open', fa: 'سامانه‌ی EOI باز است' },
    source: 'https://www.gov.nl.ca/immigration/immigrating-to-newfoundland-and-labrador/provincial-nominee-program/entrepreneurs/international-entrepreneur/overview/',
  },
  {
    code: 'NT', name: { en: 'Northwest Territories', fa: 'سرزمین‌های شمال غربی' }, tone: 'open',
    note: { en: 'Business Stream; no wait-list, exploratory visit and interview', fa: 'مسیر کسب‌وکار؛ بدون صف انتظار، با سفر اکتشافی و مصاحبه' },
    source: 'https://www.immigratenwt.ca/business-stream',
  },
  {
    code: 'QC', name: { en: 'Quebec', fa: 'کبک' }, tone: 'open',
    note: { en: 'Not a PNP: own selection; spoken French at level 7 required', fa: 'PNP نیست و خودش انتخاب می‌کند؛ فرانسه‌ی گفتاری سطح ۷ لازم است' },
    source: 'https://www.quebec.ca/en/immigration/permanent/immigrate-business/entrepreneurs/start-acquire-business/conditions',
  },
  {
    code: 'MB', name: { en: 'Manitoba', fa: 'منیتوبا' }, tone: 'limited', href: '/pnp/manitoba', faGuide: true,
    note: { en: 'No Business Investor Stream draws; EOIs by email under an interim process', fa: 'دور دعوت کسب‌وکار برگزار نمی‌شود؛ EOI با ایمیل در روند موقت' },
    source: 'https://immigratemanitoba.com/draws/',
  },
  {
    code: 'PE', name: { en: 'Prince Edward Island', fa: 'جزیره‌ی پرنس ادوارد' }, tone: 'limited', href: '/pnp/pei', faGuide: true,
    note: { en: 'Stream listed, but no entrepreneur invited in any 2026 draw', fa: 'مسیر در فهرست هست، اما در هیچ دور ۲۰۲۶ کارآفرینی دعوت نشده' },
    source: 'https://www.princeedwardisland.ca/en/information/office-of-immigration/expression-of-interest-draws',
  },
  {
    code: 'YT', name: { en: 'Yukon', fa: 'یوکان' }, tone: 'limited',
    note: { en: 'Business Nominee pages live, but the 2026 operational guidance lists no business stream', fa: 'صفحه‌ی برنامه‌ی کسب‌وکار هست، اما راهنمای عملیاتی ۲۰۲۶ مسیر کسب‌وکاری ندارد' },
    source: 'https://yukon.ca/en/immigration/yukon-business-nominee-program-0',
  },
  {
    code: 'SK', name: { en: 'Saskatchewan', fa: 'ساسکاچوان' }, tone: 'closed', href: '/pnp/saskatchewan',
    note: { en: 'Entrepreneur and Farm closed permanently on 27 March 2025', fa: 'مسیر کارآفرینی و مزرعه از ۲۷ مارس ۲۰۲۵ برای همیشه بسته شد' },
    source: 'https://www.saskatchewan.ca/government/news-and-media/2025/march/27/government-announces-end-to-temporary-sinp-pause',
  },
  {
    code: 'ON', name: { en: 'Ontario', fa: 'انتاریو' }, tone: 'closed', href: '/pnp/ontario',
    note: { en: 'Entrepreneur closed; only the job-offer Workforce Priority stream is open', fa: 'مسیر کارآفرینی بسته است؛ فقط مسیر Workforce Priority با پیشنهاد کار باز است' },
    source: 'https://www.ontario.ca/page/ontario-immigrant-nominee-program-oinp',
  },
  {
    code: 'NU', name: { en: 'Nunavut', fa: 'نوناووت' }, tone: 'none',
    note: { en: 'Has no nominee program', fa: 'برنامه‌ی نامزدی ندارد' },
    source: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees/non-express-entry/eligibility.html',
  },
];

/** IRCC levels plan 2026–2028. */
export const FEDERAL = {
  pnpTarget2026: 91500,
  businessPerYear: 500,
  source: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/corporate-initiatives/levels/supplementary-immigration-levels-2026-2028.html',
};

/**
 * The open entrepreneur streams' money and language floors, for the
 * net-worth check. CAD minimums; `clb` is the minimum CLB/NCLC, `french7`
 * marks Quebec's level-7 French rule instead of a CLB.
 */
export type StreamFloor = {
  code: string;
  stream: { en: string; fa: string };
  netWorth: number;
  investment: number;
  clb?: number;
  french7?: boolean;
  href?: string;
};

export const OPEN_FLOORS: StreamFloor[] = [
  { code: 'NT', stream: { en: 'NWT Business, outside Yellowknife', fa: 'شمال غربی، بیرون از یلونایف' }, netWorth: 250000, investment: 100000, clb: 4 },
  { code: 'AB', stream: { en: 'Alberta Rural Entrepreneur', fa: 'کارآفرینی روستایی آلبرتا' }, netWorth: 300000, investment: 100000, clb: 4, href: '/pnp/alberta' },
  { code: 'BC', stream: { en: 'BC Entrepreneur Regional', fa: 'بریتیش کلمبیا، منطقه‌ای' }, netWorth: 300000, investment: 100000, clb: 4, href: '/pnp/bc' },
  { code: 'NS', stream: { en: 'Nova Scotia, outside Halifax', fa: 'نوااسکوشیا، بیرون از هالیفکس' }, netWorth: 400000, investment: 100000, clb: 5, href: '/pnp/nova-scotia' },
  { code: 'NT', stream: { en: 'NWT Business, Yellowknife', fa: 'شمال غربی، یلونایف' }, netWorth: 500000, investment: 200000, clb: 4 },
  { code: 'NB', stream: { en: 'New Brunswick Business Immigration', fa: 'مهاجرت کسب‌وکار نیوبرانزویک' }, netWorth: 500000, investment: 150000, clb: 4, href: '/pnp/new-brunswick' },
  { code: 'BC', stream: { en: 'BC Entrepreneur Base', fa: 'بریتیش کلمبیا، پایه' }, netWorth: 600000, investment: 200000, clb: 4, href: '/pnp/bc' },
  { code: 'NS', stream: { en: 'Nova Scotia, Halifax', fa: 'نوااسکوشیا، هالیفکس' }, netWorth: 600000, investment: 150000, clb: 5, href: '/pnp/nova-scotia' },
  { code: 'NL', stream: { en: 'Newfoundland and Labrador International Entrepreneur', fa: 'کارآفرین بین‌المللی نیوفاندلند' }, netWorth: 600000, investment: 200000, clb: 5, href: '/pnp/newfoundland' },
  { code: 'QC', stream: { en: 'Quebec Entrepreneur, start-up', fa: 'کارآفرین کبک، راه‌اندازی' }, netWorth: 600000, investment: 150000, french7: true },
];
