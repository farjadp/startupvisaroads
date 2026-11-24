// ============================================================================
// lib/pricing/chrome.ts
// The fixed parts of the pricing page: interface labels and the lines the
// brief makes mandatory. These are deliberately NOT editable from admin, so
// the exact-price line and the Canada lawyer line cannot be deleted by an
// edit. Plus each route group's colours (the guides' palettes) and guide link.
// ============================================================================
import { themeFor } from '@/components/fa/faThemes';
import type { RouteTheme } from '@/components/route/RouteProgress';
import type { PricingLocale } from './types';

/** Canada's cards carry the lawyer line and the deliverable-only milestones note. */
export const CANADA_KEYS: readonly string[] = ['ca-pnp', 'ca-high-impact'];
export const US_KEY = 'us-founder';

export const CHROME = {
  en: {
    priceLater: 'Price set after the free readiness assessment',
    /** Under every price: the assessment comes before any payment. */
    assessmentFirst: 'The free readiness assessment comes first. You pay only once the route fits your team.',
    feeOnly: 'Our fee only. Government fees and third-party costs are separate.',
    /** Mandatory on the Canada card (brief §5). */
    canadaLawyer: 'A licensed lawyer handles the immigration part of the file. The lawyer’s fee is separate.',
    canadaMilestones: 'Each payment is tied to business work we deliver, never to an IRCC decision.',
    usAttorney: 'A licensed US immigration attorney prepares and files the petition. The attorney’s fee is separate.',
    included: 'Included',
    excluded: 'Billed separately',
    milestones: 'Payment milestones',
    duration: 'Approximate duration',
    showMilestones: 'Show payment milestones',
    hideMilestones: 'Hide payment milestones',
    soon: 'Soon',
    soonNote: 'No price published yet',
    contact: 'Contact us',
    guide: 'Route guide',
    seeRoutes: 'See the routes',
    layers: { title: 'Three separate costs', ours: 'Our fee', gov: 'Government fees', third: 'Lawyer, translation, registration' },
    tbdBanner: 'Dev only: [[TBD]] text is marked here and hidden in production.',
    awaitingReview: 'Not live: hidden in production until a licensed lawyer approves this text.',
    partnerArrow: '→',
  },
  fa: {
    priceLater: 'قیمت بعد از ارزیابی آمادگی رایگان',
    assessmentFirst: 'اول ارزیابی آمادگی رایگان است. فقط وقتی پرداخت می‌کنید که مسیر به تیم شما بخورد.',
    feeOnly: 'فقط هزینه‌ی ما. هزینه‌های دولتی و هزینه‌ی دیگران جداست.',
    canadaLawyer: 'بخش مهاجرتی پرونده را وکیل دارای مجوز انجام می‌دهد. هزینه‌ی وکیل جداست.',
    canadaMilestones: 'هر پرداخت به کار بیزنسی‌ای که تحویل می‌دهیم بسته است، نه به تصمیم IRCC.',
    usAttorney: 'پتیشن را وکیل مهاجرت دارای مجوز در آمریکا آماده و ثبت می‌کند. هزینه‌ی وکیل جداست.',
    included: 'شامل',
    excluded: 'جدا پرداخت می‌شود',
    milestones: 'مراحل پرداخت',
    duration: 'مدت تقریبی',
    showMilestones: 'دیدن مراحل پرداخت',
    hideMilestones: 'بستن مراحل پرداخت',
    soon: 'به‌زودی',
    soonNote: 'هنوز قیمتی منتشر نشده',
    contact: 'با ما تماس بگیرید',
    guide: 'راهنما',
    seeRoutes: 'دیدن مسیرها',
    layers: { title: 'سه هزینه‌ی جدا', ours: 'هزینه‌ی ما', gov: 'هزینه‌های دولتی', third: 'وکیل، ترجمه، ثبت شرکت' },
    tbdBanner: 'فقط در محیط توسعه: متن‌های [[TBD]] اینجا علامت خورده‌اند و در سایت اصلی نمایش داده نمی‌شوند.',
    awaitingReview: 'منتشر نشده: تا تأیید وکیل دارای مجوز در سایت اصلی پنهان است.',
    partnerArrow: '←',
  },
} satisfies Record<PricingLocale, Record<string, unknown>>;

export type Chrome = (typeof CHROME)['en'];
/** What a card needs; the dev banner stays on the server. */
export type CardChrome = Omit<Chrome, 'tbdBanner'>;

type Guide = { label: string; href: string };

const META: Record<string, { theme: RouteTheme; guides: Record<PricingLocale, Guide[]> }> = {
  'eu-nordic': {
    theme: themeFor('/europe/finland'),
    guides: {
      en: [{ label: 'Finland', href: '/country/finland' }, { label: 'Denmark', href: '/country/denmark' }, { label: 'Netherlands', href: '/europe/netherlands' }],
      fa: [{ label: 'فنلاند', href: '/europe/finland' }, { label: 'دانمارک', href: '/europe/denmark' }, { label: 'هلند', href: '/europe/netherlands' }],
    },
  },
  'eu-spain-italy': {
    theme: themeFor('/europe/spain'),
    guides: {
      en: [{ label: 'Spain', href: '/europe/spain' }, { label: 'Italy', href: '/country/italy' }],
      fa: [{ label: 'اسپانیا', href: '/europe/spain' }, { label: 'ایتالیا', href: '/europe/italy' }],
    },
  },
  'eu-belgium-bulgaria': {
    theme: themeFor('/europe/belgium'),
    guides: {
      en: [{ label: 'Belgium', href: '/europe/belgium' }, { label: 'Bulgaria', href: '/europe/bulgaria' }],
      fa: [{ label: 'بلژیک', href: '/europe/belgium' }, { label: 'بلغارستان', href: '/europe/bulgaria' }],
    },
  },
  'tr-tech-visa': { theme: themeFor('/turkey-tech-visa'), guides: { en: [{ label: 'Türkiye', href: '/country/turkey' }], fa: [{ label: 'ترکیه', href: '/turkey-tech-visa' }] } },
  'ca-pnp': { theme: themeFor('/pnp'), guides: { en: [{ label: 'PNP', href: '/pnp' }], fa: [{ label: 'PNP', href: '/pnp' }] } },
  'ca-high-impact': {
    theme: themeFor('/canada-startup-visa'),
    guides: { en: [{ label: 'The pilot', href: '/high-impact-startup-pilot' }], fa: [{ label: 'پایلوت', href: '/high-impact-startup-pilot' }] },
  },
  'us-founder': { theme: themeFor('/usa'), guides: { en: [{ label: 'USA', href: '/country/usa' }], fa: [{ label: 'آمریکا', href: '/usa' }] } },
  'other-routes': { theme: themeFor('/europe/estonia'), guides: { en: [{ label: 'Which route fits me?', href: '/which-path' }], fa: [{ label: 'کدام مسیر برای من؟', href: '/which-path' }] } },
};

export function groupMeta(key: string, locale: PricingLocale): { theme: RouteTheme; guides: Guide[] } {
  const m = META[key];
  return m ? { theme: m.theme, guides: m.guides[locale] } : { theme: themeFor(''), guides: [] };
}

/** The fixed legal line a card must carry, if any. */
export function legalLine(key: string, c: { canadaLawyer: string; usAttorney: string }): string | null {
  if (CANADA_KEYS.includes(key)) return c.canadaLawyer;
  if (key === US_KEY) return c.usAttorney;
  return null;
}
