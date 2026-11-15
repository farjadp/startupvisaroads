// Shared pieces of the RCIP job-market series: the stats file, number
// formatting for each language, names, links and the chart helpers.
// Every figure an article prints is formatted from stats.json through `fmt`.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { barChart, pairedBarChart, scrollTable } from '../../../lib/data-reports/charts.ts';

const here = dirname(fileURLToPath(import.meta.url));
export const EDITION = '2026-10';
export const S = JSON.parse(readFileSync(join(here, '..', '..', 'data-reports', EDITION, 'stats.json'), 'utf8'));

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const faDigits = (s) => String(s).replace(/[0-9]/g, (d) => FA_DIGITS[d]);

/** Formatters for one language. Persian: Persian digits, ٬ for thousands, ٫ for decimals. */
export function fmt(locale) {
  const fa = locale === 'fa';
  const group = (x, dp) => Number(x).toLocaleString('en-CA', { minimumFractionDigits: dp, maximumFractionDigits: dp });
  const loc = (s) => (fa ? faDigits(s).replace(/,/g, '٬').replace(/\./g, '٫') : s);
  return {
    /** Whole number: 1,469 / ۱٬۴۶۹ */
    n: (x) => loc(group(x, 0)),
    /** One decimal when the value has one: 51.6 / ۵۱٫۶ */
    d: (x) => loc(group(x, Number.isInteger(x) ? 0 : 1)),
    /** Ratio kept at two decimals: 1.63 */
    r: (x) => loc(group(x, 2)),
    /** Share: 48.8% / ۴۸٫۸٪ */
    pc: (x) => (fa ? `${loc(group(x, Number.isInteger(x) ? 0 : 1))}٪` : `${group(x, Number.isInteger(x) ? 0 : 1)}%`),
    /** Hourly wage: $23.00 / ۲۳٫۰۰ دلار */
    w: (x) => {
      if (x == null) return fa ? 'ندارد' : 'n/a';
      const v = group(x, 2).replace(/\.00$/, ''); // $23, but $23.07
      return fa ? `${loc(v)} دلار` : `$${v}`;
    },
    /** Year or code that must not get a thousands separator. */
    plain: (x) => (fa ? faDigits(x) : String(x)),
  };
}

/** Figures computed in an article from stats values (a sum, a difference). The build lists them on the review page. */
export const derived = new Map();
export const dv = (x, how = '') => (derived.set(String(x), how), x);

export const a = (href, text) => (href.startsWith('/')
  ? `<a href="${href}">${text}</a>`
  : `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`);

export const SRC = {
  jobBank: S.meta.source_url,
  ogl: 'https://open.canada.ca/en/open-government-licence-canada',
  irccPilot: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/rural-franco-pilots/rural-immigration.html',
  irccProgram: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/rural-franco-pilots/rural-immigration-program.html',
  irccJobOffer: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/rural-franco-pilots/rural-immigration-program/job-offer.html',
  irccEligibility: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/rural-franco-pilots/rural-immigration-program/eligibility.html',
  irccDesignation: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/rural-franco-pilots/hire/designation.html',
  irccCandidate: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/rural-franco-pilots/hire/candidate.html',
  noc: 'https://noc.esdc.gc.ca/',
  naics: 'https://www.statcan.gc.ca/en/subjects/standard/naics/2022/v1/index',
};

export const SLUG = {
  en: { 1: 'rcip-job-market-october-2026-communities', 2: 'rcip-job-market-october-2026-occupations', 3: 'rcip-job-market-october-2026-industries' },
  fa: { 1: 'rcip-job-market-october-2026-communities-fa', 2: 'rcip-job-market-october-2026-occupations-fa', 3: 'rcip-job-market-october-2026-industries-fa' },
};
export const path = (locale, part) => `/${locale}/blog/${SLUG[locale][part]}`;
export const INDEX = { en: '/en/data-reports', fa: '/fa/data-reports' };
/** Earlier RCIP guides on the site (series of 11-13 Nov 2026). */
export const GUIDE = {
  en: { rules: '/en/blog/rcip-job-offer-rules-designated-employer', permanent: '/en/blog/rural-community-immigration-program-permanent-2027' },
  fa: { rules: '/fa/blog/rcip-job-offer-rules-designated-employer-fa', permanent: '/fa/blog/rural-community-immigration-program-permanent-2027-fa' },
};

/** Community names. The Latin name is the one a reader searches for; Persian is how it is said. */
export const COMMUNITY_FA = {
  'Thunder Bay': 'تاندر بی',
  Sudbury: 'سادبری',
  'North Bay': 'نورث بی',
  Timmins: 'تیمینز',
  'Sault Ste. Marie': 'سو سنت ماری',
  'Moose Jaw': 'موس جا',
  Brandon: 'برندون',
  Steinbach: 'استاینباک',
  'Altona/Rhineland': 'آلتونا/راینلند',
  Claresholm: 'کلرزهولم',
  'Pictou County': 'پیکتو کانتی',
  'North Okanagan-Shuswap': 'اوکاناگان شمالی-شوسواپ',
  'West Kootenay': 'کوتنی غربی',
  'Northeast BC (Peace Liard)': 'پیس لیارد، شمال‌شرق بی‌سی',
};
export const PROVINCE = {
  en: { ON: 'Ontario', BC: 'British Columbia', SK: 'Saskatchewan', MB: 'Manitoba', NS: 'Nova Scotia', AB: 'Alberta' },
  fa: { ON: 'انتاریو', BC: 'بریتیش کلمبیا', SK: 'ساسکاچوان', MB: 'منیتوبا', NS: 'نوا اسکوشیا', AB: 'آلبرتا' },
};
export const cname = (locale, name) => (locale === 'fa' ? COMMUNITY_FA[name] : name);

export const SECTOR_FA = {
  '11': 'کشاورزی، جنگل‌داری و شیلات',
  '21': 'معدن، نفت و گاز',
  '22': 'آب، برق و گاز',
  '23': 'ساخت‌وساز',
  '31-33': 'تولید صنعتی',
  '41': 'عمده‌فروشی',
  '44-45': 'خرده‌فروشی',
  '48-49': 'حمل‌ونقل و انبارداری',
  '51': 'اطلاعات و فرهنگ',
  '52': 'مالی و بیمه',
  '53': 'املاک و اجاره',
  '54': 'خدمات تخصصی، علمی و فنی',
  '55': 'مدیریت شرکت‌ها',
  '56': 'خدمات اداری و پشتیبانی، مدیریت پسماند',
  '61': 'آموزش',
  '62': 'سلامت و خدمات اجتماعی',
  '71': 'هنر، سرگرمی و تفریح',
  '72': 'اقامت و غذا',
  '81': 'خدمات دیگر',
  '91': 'اداره‌ی عمومی (دولت و شهرداری)',
};
const SECTOR_SHORT_EN = {
  '21': 'Mining, oil and gas',
  '54': 'Professional and technical services',
  '56': 'Administrative support and waste',
  '81': 'Other services',
  '91': 'Public administration',
  '11': 'Agriculture and forestry',
  '72': 'Accommodation and food',
  '62': 'Health care and social assistance',
};
export const sname = (locale, s, short = false) => (locale === 'fa' ? SECTOR_FA[s.code] : (short && SECTOR_SHORT_EN[s.code]) || s.name);

export const OCC_FA = {
  '85101': 'کارگر برداشت محصول',
  '73300': 'راننده‌ی کامیون',
  '62020': 'سرپرست خدمات غذایی',
  '63200': 'آشپز',
  '64100': 'فروشنده‌ی خرده‌فروشی',
  '65201': 'کمک‌آشپز و کارکن پیشخوان غذا',
  '72401': 'مکانیک ماشین‌آلات سنگین',
  '72410': 'مکانیک خودرو، کامیون و اتوبوس',
  '64410': 'نگهبان',
  '83100': 'معدن‌کار زیرزمینی',
  '65310': 'نظافتچی',
  '75110': 'کارگر و کمک‌کار ساختمانی',
  '60030': 'مدیر رستوران و خدمات غذایی',
  '72310': 'نجار',
  '65100': 'صندوق‌دار',
  '42201': 'مددکار خدمات اجتماعی',
  '84120': 'کارگر دامداری و اپراتور ماشین کشاورزی',
  '74205': 'اپراتور ماشین‌آلات راهداری و خدمات شهری',
  '60020': 'مدیر فروشگاه',
  '72106': 'جوشکار',
  '75201': 'راننده‌ی تحویل کالا',
  '32101': 'پرستار عملی (LPN)',
  '62010': 'سرپرست فروش',
  '13110': 'دستیار اداری',
  '64409': 'کارمند خدمات مشتریان',
};
const OCC_SHORT_EN = {
  '65201': 'Food counter attendants and kitchen helpers',
  '72410': 'Automotive, truck and bus mechanics',
  '64410': 'Security guards',
  '83100': 'Underground miners',
  '84120': 'Livestock workers and farm machinery operators',
  '74205': 'Public works equipment operators',
  '75201': 'Delivery drivers',
  '64409': 'Other customer service representatives',
  '64100': 'Retail salespersons',
};
export const oname = (locale, o) => (locale === 'fa' ? OCC_FA[o.noc] : OCC_SHORT_EN[o.noc] || o.name);

const MONTH = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  fa: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
};
/** `2026-11-06` -> 6 November 2026; `2026-08` -> August 2026; '' -> not dated. Any note after the date is dropped. */
export function listDate(locale, raw) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(raw || '');
  const f = fmt(locale);
  if (!m) return locale === 'fa' ? 'بدون تاریخ' : 'not dated';
  const month = MONTH[locale][Number(m[2]) - 1];
  const year = f.plain(m[1]);
  if (!m[3]) return locale === 'fa' ? `${month} ${year}` : `${month} ${year}`;
  return locale === 'fa' ? `${f.plain(Number(m[3]))} ${month} ${year}` : `${Number(m[3])} ${month} ${year}`;
}

/** The public page a list was read from. One list is served from a data endpoint, not a page; link its site instead. */
export function listLink(c) {
  const u = new URL(c.list_source_url);
  return u.pathname.includes('admin-ajax') ? `${u.origin}/` : c.list_source_url;
}

export const by = (key, dir = -1) => (x, y) => dir * (x[key] - y[key]);
export const community = (name) => S.communities.find((c) => c.name === name);
export const sector = (code) => S.sectors.find((s) => s.code === code);
export const occ = (noc) => S.occupations.find((o) => o.noc === noc);

export const CHART_SOURCE = {
  en: 'Job Bank open data (ESDC), October 2026; community designated-employer lists. VisaRoads calculation.',
  fa: 'داده‌ی باز Job Bank (اکتبر ۲۰۲۶) و فهرست کارفرمایان تأییدشده‌ی جامعه‌ها؛ محاسبه‌ی VisaRoads.',
};
export const EYEBROW = { en: 'RCIP job market · October 2026', fa: 'بازار کار RCIP · اکتبر ۲۰۲۶' };
export { barChart, pairedBarChart, scrollTable };
