// ============================================================================
// lib/fa/route-atlas.ts
// Every route the Persian site has a guide for, as one list, for the route
// atlas on /fa/which-path. The quiz answers "which one for me"; the atlas
// answers "what is out there at all", so a reader whose answer is not the
// quiz's still finds their country.
//
// RULES FOR THIS FILE
// - One entry per Persian guide in lib/fa/paths.ts that is a route (a test
//   checks every href is a real Persian path, and every route guide is here).
// - `figure` and `line` repeat a number the linked guide already states, and
//   `source` is the official page that number comes from. When a guide's
//   number changes, change it here too; `updated` is the guide's own date.
// - `status` is written for the reader this site serves: a holder of an
//   Iranian passport. «بسته» means closed to that reader, which is not always
//   closed to everyone — the line says which.
// - No VisaRoads prices, ever.
// ============================================================================
import { flagFor, type FlagCode } from './flags';
import type { PathId } from './path-quiz';

export type AtlasRegion = 'europe' | 'canada' | 'beyond';
export type AtlasStatus = 'open' | 'limited' | 'announced' | 'closed';

export type AtlasRoute = {
  key: string;
  /** Country or province, as the reader would say it. */
  name: string;
  /** The programme, short. */
  programme: string;
  /** Locale-agnostic path of the Persian guide. */
  href: string;
  region: AtlasRegion;
  status: AtlasStatus;
  /** The one number (or fact) that most decides this route. Persian digits. */
  figure: string;
  figureLabel: string;
  /** One sentence: what makes this route different. */
  line: string;
  /** Flag, when the guide's path has none in lib/fa/flags.ts. */
  flag?: FlagCode;
  /** Band colour, when the guide has no palette of its own in faThemes. */
  accent?: string;
  /** Hero photo under /public/fa/img, without extension. */
  image?: string;
  /** Official page the figure comes from. */
  source: string;
  /** The date the linked guide was last checked. */
  updated: string;
};

export const REGION_LABEL: Record<AtlasRegion, string> = {
  europe: 'اروپا',
  canada: 'کانادا',
  beyond: 'فراتر از این دو',
};

export const STATUS_LABEL: Record<AtlasStatus, string> = {
  open: 'باز',
  limited: 'باز، با مانع',
  announced: 'اعلام‌شده',
  closed: 'بسته',
};

export const ATLAS: AtlasRoute[] = [
  // ---------------------------------------------------------------- Europe
  {
    key: 'finland',
    name: 'فنلاند',
    programme: 'مجوز استارتاپ',
    href: '/europe/finland',
    region: 'europe',
    status: 'open',
    figure: '۲ نفر',
    figureLabel: 'حداقل تیم',
    line: 'بدون سرمایه‌گذاری الزامی؛ ارزیابی Business Finland رایگان است، اما تیم دست‌کم دو بنیان‌گذار می‌خواهد.',
    image: 'finland',
    source: 'https://migri.fi/en/start-up-entrepreneur',
    updated: '2026-09-08',
  },
  {
    key: 'denmark',
    name: 'دانمارک',
    programme: 'Start-up Denmark',
    href: '/europe/denmark',
    region: 'europe',
    status: 'open',
    figure: '۷۵ نفر',
    figureLabel: 'سهمیه‌ی سالانه',
    line: 'بنیان‌گذار تنها را هم می‌پذیرد، تا سه نفر در هر تیم؛ پنل کارشناسان بیزینس‌پلن را می‌سنجد.',
    image: 'denmark',
    source: 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark',
    updated: '2026-10-27',
  },
  {
    key: 'netherlands',
    name: 'هلند',
    programme: 'اقامت استارتاپ',
    href: '/europe/netherlands',
    region: 'europe',
    status: 'open',
    figure: '۱ سال',
    figureLabel: 'اقامت اولیه، بدون تمدید',
    line: 'یک سال کنار فسیلیتیتور مورد تأیید RVO، و بعد سنجش دوباره با نظام امتیازی.',
    image: 'netherlands',
    source: 'https://ind.nl/en/residence-permits/work/start-up',
    updated: '2026-10-29',
  },
  {
    key: 'estonia',
    name: 'استونی',
    programme: 'ویزای استارتاپ',
    href: '/europe/estonia',
    region: 'europe',
    status: 'open',
    figure: '۸۸۰ یورو',
    figureLabel: 'تمکن ماهانه‌ی هر نفر',
    line: 'کمیته‌ی استارتاپ ظرف حدود ده روز کاری تصمیم می‌گیرد؛ محصول اولیه شرط است.',
    image: 'estonia',
    source: 'https://www.politsei.ee/en/instructions/residence-permit-for-business/for-start-up-entrepreneurs',
    updated: '2026-10-27',
  },
  {
    key: 'italy',
    name: 'ایتالیا',
    programme: 'Italia Startup Visa',
    href: '/europe/italy',
    region: 'europe',
    status: 'open',
    figure: '۵۰٬۰۰۰ یورو',
    figureLabel: 'برای کل تیم، نه هر نفر',
    line: 'تا پنج بنیان‌گذار؛ کمیته‌ی MIMIT فقط از روی اسناد و بدون مصاحبه تصمیم می‌گیرد.',
    image: 'italy',
    source: 'https://italiastartupvisa.mise.gov.it/',
    updated: '2026-09-24',
  },
  {
    key: 'spain',
    name: 'اسپانیا',
    programme: 'اقامت کارآفرینی',
    href: '/europe/spain',
    region: 'europe',
    status: 'open',
    figure: '۶۰۰ یورو',
    figureLabel: 'تمکن ماهانه (۱۰۰٪ IPREM)',
    line: 'گزارش موافق ENISA لازم است؛ حداقل سرمایه‌گذاری ندارد و پاسخ دیرکرد، پذیرش حساب می‌شود.',
    image: 'spain',
    source: 'https://www.inclusion.gob.es/web/unidadgrandesempresas/emprendedores',
    updated: '2026-10-29',
  },
  {
    key: 'bulgaria',
    name: 'بلغارستان',
    programme: 'ویزای استارتاپ',
    href: '/europe/bulgaria',
    region: 'europe',
    status: 'open',
    figure: '۱٬۸۶۰ یورو',
    figureLabel: 'موجودی یک‌باره، ۳۰ روز پیاپی',
    line: 'دست‌کم ۸ امتیاز از ۱۴ لازم است؛ تا سه نفر از تیم در یک گواهی می‌آیند.',
    image: 'bulgaria',
    source: 'https://www.mig.government.bg/3263-issuance-of-a-sertificate-for-a-high-tech-and-or-innovative-project-startup-visa/?lang=en',
    updated: '2026-11-09',
  },
  {
    key: 'belgium',
    name: 'بلژیک (فلاندرز)',
    programme: 'مجوز نوآوری و استارتاپ',
    accent: '#FDDA24',
    href: '/europe/belgium',
    region: 'europe',
    status: 'open',
    figure: '۳۰ روز',
    figureLabel: 'سقف تصمیم در مسیر سریع',
    line: 'سرمایه‌ی ثابت در دسته‌ی نوآورانه ندارد؛ هر بنیان‌گذار کارت و پرونده‌ی خودش را دارد.',
    image: 'belgium',
    source: 'https://www.vlaanderen.be/en/working-enterprise-and-investment/working/professional-card-for-foreign-entrepreneurs/requirements-for-a-professional-card',
    updated: '2026-11-05',
  },

  // ---------------------------------------------------------------- Canada
  {
    key: 'high-impact',
    name: 'کانادا',
    programme: 'پایلوت High Impact',
    accent: '#D80027',
    href: '/high-impact-startup-pilot',
    region: 'canada',
    status: 'announced',
    figure: 'بدون تاریخ',
    figureLabel: 'شرایط هنوز منتشر نشده',
    line: 'جایگزین اعلام‌شده‌ی ویزای استارتاپ کانادا؛ تا اعلام رسمی، هر «ثبت‌نام» در آن ادعاست.',
    image: 'high-impact',
    source: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/immigration-measures-entrepreneurs.html',
    updated: '2026-11-05',
  },
  {
    key: 'suv',
    name: 'کانادا',
    programme: 'ویزای استارتاپ (SUV)',
    href: '/canada-startup-visa',
    region: 'canada',
    status: 'closed',
    figure: '۳۰ ژوئن ۲۰۲۶',
    figureLabel: 'آخرین روز ثبت پرونده',
    line: 'برای همه بسته است، نه فقط ایرانی‌ها؛ پرونده‌های ثبت‌شده همچنان بررسی می‌شوند.',
    image: 'canada-startup-visa',
    source: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/immigration-measures-entrepreneurs.html',
    updated: '2026-11-05',
  },
  {
    key: 'bc',
    name: 'بریتیش کلمبیا',
    programme: 'کارآفرینی BC PNP',
    href: '/pnp/bc',
    region: 'canada',
    status: 'open',
    figure: '۶۰۰ هزار دلار',
    figureLabel: 'دارایی خالص (مسیر پایه)',
    line: 'سرمایه‌گذاری ۲۰۰ هزار دلار؛ مسیر منطقه‌ای بیرون از ونکوور آستانه را نصف می‌کند.',
    image: 'bc',
    source: 'https://www.welcomebc.ca/immigrate-to-b-c/for-entrepreneurs-and-businesses',
    updated: '2026-11-01',
  },
  {
    key: 'alberta',
    name: 'آلبرتا',
    programme: 'کارآفرینی روستایی AAIP',
    href: '/pnp/alberta',
    region: 'canada',
    status: 'open',
    figure: '۳۰۰ هزار دلار',
    figureLabel: 'دارایی خالص',
    line: 'کمترین آستانه‌ی مالی میان استان‌ها، اما اول یک شهر کوچک باید از طرح شما حمایت کند.',
    image: 'alberta',
    source: 'https://www.alberta.ca/aaip-rural-entrepreneur-stream-eligibility',
    updated: '2026-10-12',
  },
  {
    key: 'manitoba',
    name: 'منیتوبا',
    programme: 'کارآفرینی MPNP',
    href: '/pnp/manitoba',
    region: 'canada',
    status: 'open',
    figure: '۴ هفته',
    figureLabel: 'بررسی EOI، بدون صف دعوت',
    line: 'دارایی ۵۰۰ هزار و سرمایه‌گذاری ۲۵۰ هزار دلار؛ بیرون از وینیپگ ۱۵۰ هزار.',
    image: 'manitoba',
    source: 'https://immigratemanitoba.com/mpnp/bis/ep/eligibility/',
    updated: '2026-10-12',
  },
  {
    key: 'new-brunswick',
    name: 'نیوبرانزویک',
    programme: 'کارآفرینی NBPNP',
    href: '/pnp/new-brunswick',
    region: 'canada',
    status: 'open',
    figure: '۵۰۰ هزار دلار',
    figureLabel: 'دارایی خالص',
    line: 'سرمایه‌گذاری ۱۵۰ هزار دلار و دست‌کم ۶۵ امتیاز از ۱۰۰ در سیستم EOI.',
    image: 'new-brunswick',
    source: 'https://www.gnb.ca/en/topic/family-home-community/immigration/provincial-nominee-program/business-immigration-stream.html',
    updated: '2026-10-12',
  },
  {
    key: 'nova-scotia',
    name: 'نوااسکوشیا',
    programme: 'کارآفرینی NSNP',
    href: '/pnp/nova-scotia',
    region: 'canada',
    status: 'open',
    figure: '۶۰۰ هزار دلار',
    figureLabel: 'دارایی خالص در هلیفکس',
    line: 'بیرون از هلیفکس دارایی ۴۰۰ هزار و سرمایه‌گذاری ۱۰۰ هزار دلار کافی است.',
    image: 'nova-scotia',
    source: 'https://liveinnovascotia.com/entrepreneur',
    updated: '2026-10-12',
  },
  {
    key: 'pei',
    name: 'پرنس ادوارد',
    programme: 'کارآفرینی PEI PNP',
    href: '/pnp/pei',
    region: 'canada',
    status: 'limited',
    figure: 'صفر',
    figureLabel: 'دعوت کارآفرین در ۲۰۲۶',
    line: 'روی کاغذ باز است، اما در یازده دور امسال هیچ کارآفرینی دعوت نشده.',
    image: 'pei',
    source: 'https://www.princeedwardisland.ca/en/information/office-of-immigration/expression-of-interest-draws',
    updated: '2026-11-03',
  },

  // ---------------------------------------------------------------- Beyond
  {
    key: 'turkey',
    name: 'ترکیه',
    programme: 'تک‌ویزا',
    href: '/turkey-tech-visa',
    region: 'beyond',
    status: 'open',
    figure: '۳ سال',
    figureLabel: 'مجوز کار اول',
    line: 'بلندترین مجوز اول و کم‌هزینه‌ترین استقرار، اما به پاسپورت اروپایی نمی‌رسد.',
    image: 'turkey',
    source: 'https://turkiyetechvisa.gov.tr/',
    updated: '2026-09-08',
  },
  {
    key: 'uk',
    name: 'انگلیس',
    programme: 'Innovator Founder',
    flag: 'gb',
    href: '/uk/innovator-founder',
    region: 'beyond',
    status: 'open',
    figure: 'B2',
    figureLabel: 'سطح زبان لازم',
    line: 'حداقل سرمایه‌گذاری ندارد؛ تأیید یک نهاد تأییدکننده شرط است و اقامت دائم پس از سه سال.',
    source: 'https://www.gov.uk/innovator-founder-visa',
    updated: '2026-10-13',
  },
  {
    key: 'australia',
    name: 'استرالیا',
    programme: 'ویزای نوآوری ملی (۸۵۸)',
    href: '/australia',
    region: 'beyond',
    status: 'limited',
    figure: '۶۰ روز',
    figureLabel: 'مهلت درخواست پس از دعوت‌نامه',
    line: 'اقامت دائم از روز اول، اما فقط با دعوت‌نامه و برای دستاورد برجسته‌ی بین‌المللی.',
    image: 'australia',
    source: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/national-innovation-visa-858',
    updated: '2026-09-09',
  },
  {
    key: 'usa',
    name: 'آمریکا',
    programme: 'ویزاهای فاندر',
    flag: 'us',
    href: '/usa',
    region: 'beyond',
    status: 'closed',
    figure: '۱ ژانویه‌ی ۲۰۲۶',
    figureLabel: 'توقف صدور ویزا برای اتباع ایران',
    line: 'فرمان ۱۰۹۹۸ صدور ویزا را متوقف کرده؛ برای دوتابعیتی‌ها وضعیت فرق می‌کند.',
    image: 'usa-eb2-niw',
    source: 'https://www.govinfo.gov/content/pkg/FR-2025-12-19/html/2025-23570.htm',
    updated: '2026-10-12',
  },
  {
    key: 'israel',
    name: 'اسرائیل',
    programme: 'ویزای نوآوری',
    href: '/israel',
    region: 'beyond',
    status: 'closed',
    figure: 'باز نیست',
    figureLabel: 'برای دارنده‌ی پاسپورت ایرانی',
    line: 'برنامه برای دیگران باز است؛ این صفحه می‌گوید چرا برای ایرانی‌ها نه.',
    image: 'israel',
    source: 'https://innovationisrael.org.il/en/',
    updated: '2026-09-09',
  },
];

/** Routes a reader can act on today, in the atlas's order. */
export const openCount = ATLAS.filter((r) => r.status === 'open').length;

/** Count of distinct countries (Canadian provinces count once). */
export const countryCount = new Set(ATLAS.map((r) => (r.region === 'canada' ? 'canada' : r.key))).size;

/** The flag to show for a route. Israel has none, deliberately (lib/fa/flags.ts). */
export function atlasFlag(r: AtlasRoute): FlagCode | null {
  return r.flag ?? flagFor(r.href);
}

/**
 * Other routes worth a look next to each quiz result. Not a second
 * recommendation — the scorer's answer stays the answer — but the reader's
 * situation rarely fits one country only, and the atlas has grown past the
 * nine outcomes the scorer knows. Each list is the same kind of route:
 *   team in Europe → other Europe routes that take a team;
 *   solo in Europe → other solo-friendly, low-means Europe routes;
 *   Atlantic Canada → the other provincial entrepreneur streams;
 *   NIW → the other talent-led routes that need no employer.
 */
export const NEARBY: Record<PathId, string[]> = {
  finland: ['italy', 'spain', 'belgium'],
  italy: ['finland', 'spain', 'uk'],
  denmark: ['estonia', 'spain', 'belgium'],
  netherlands: ['belgium', 'uk', 'spain'],
  estonia: ['bulgaria', 'spain', 'denmark'],
  turkey: ['bulgaria', 'estonia', 'spain'],
  atlantic: ['nova-scotia', 'manitoba', 'alberta'],
  eb2niw: ['australia', 'uk'],
  'too-early': [],
};

export function atlasByKey(key: string): AtlasRoute | undefined {
  return ATLAS.find((r) => r.key === key);
}
