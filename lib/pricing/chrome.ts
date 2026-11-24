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

export const CANADA_KEY = 'ca-business-readiness';

export const CHROME = {
  en: {
    startingFrom: 'Starting from',
    priceLater: 'Price set after the free readiness assessment',
    /** Mandatory under every price (brief §2). */
    exactPriceNote: 'The exact price is set after the team’s readiness assessment.',
    feeOnly: 'Our fee only. Government fees and third-party costs are separate.',
    /** Mandatory on the Canada card (brief §5). */
    canadaLawyer: 'A licensed lawyer handles the immigration part of the file. The lawyer’s fee is separate.',
    canadaMilestones: 'Each payment is tied to business work we deliver, never to an IRCC decision.',
    included: 'Included',
    excluded: 'Billed separately',
    milestones: 'Payment milestones',
    duration: 'Approximate duration',
    showMilestones: 'Show payment milestones',
    hideMilestones: 'Hide payment milestones',
    soon: 'Soon',
    soonNote: 'No price published yet',
    contact: 'Contact us',
    guide: 'Read the route guide',
    seeRoutes: 'See the routes',
    layers: { title: 'Three separate costs', ours: 'Our fee', gov: 'Government fees', third: 'Lawyer, translation, registration' },
    tbdBanner: 'Dev only: [[TBD]] text and the unreviewed Canada card are hidden in production.',
    awaitingReview: 'Not live: hidden in production until a licensed lawyer approves this text.',
    partnerArrow: '→',
  },
  fa: {
    startingFrom: 'شروع از',
    priceLater: 'قیمت بعد از ارزیابی آمادگی رایگان',
    exactPriceNote: 'قیمت دقیق بعد از ارزیابی آمادگی تیم مشخص می‌شود.',
    feeOnly: 'فقط هزینه‌ی ما. هزینه‌های دولتی و هزینه‌ی دیگران جداست.',
    canadaLawyer: 'بخش مهاجرتی پرونده را وکیل دارای مجوز انجام می‌دهد. هزینه‌ی وکیل جداست.',
    canadaMilestones: 'هر پرداخت به کار بیزنسی‌ای که تحویل می‌دهیم بسته است، نه به تصمیم IRCC.',
    included: 'شامل',
    excluded: 'جدا پرداخت می‌شود',
    milestones: 'مراحل پرداخت',
    duration: 'مدت تقریبی',
    showMilestones: 'دیدن مراحل پرداخت',
    hideMilestones: 'بستن مراحل پرداخت',
    soon: 'به‌زودی',
    soonNote: 'هنوز قیمتی منتشر نشده',
    contact: 'با ما تماس بگیرید',
    guide: 'راهنمای این مسیر',
    seeRoutes: 'دیدن مسیرها',
    layers: { title: 'سه هزینه‌ی جدا', ours: 'هزینه‌ی ما', gov: 'هزینه‌های دولتی', third: 'وکیل، ترجمه، ثبت شرکت' },
    tbdBanner: 'فقط در محیط توسعه: متن‌های [[TBD]] و کارت کانادای بررسی‌نشده در سایت اصلی نمایش داده نمی‌شوند.',
    awaitingReview: 'منتشر نشده: تا تأیید وکیل دارای مجوز در سایت اصلی پنهان است.',
    partnerArrow: '←',
  },
} satisfies Record<PricingLocale, Record<string, unknown>>;

export type Chrome = (typeof CHROME)['en'];
/** What a card needs; the dev banner stays on the server. */
export type CardChrome = Omit<Chrome, 'tbdBanner'>;

interface GroupMeta {
  theme: RouteTheme;
  guide: Partial<Record<PricingLocale, string>>;
}

const META: Record<string, GroupMeta> = {
  'eu-finland': { theme: themeFor('/europe/finland'), guide: { en: '/country/finland', fa: '/europe/finland' } },
  'eu-denmark': { theme: themeFor('/europe/denmark'), guide: { en: '/country/denmark', fa: '/europe/denmark' } },
  [CANADA_KEY]: { theme: themeFor('/pnp'), guide: { en: '/pnp', fa: '/pnp' } },
  'eu-other': { theme: themeFor('/europe/netherlands'), guide: {} },
  'us-founder': { theme: themeFor('/usa'), guide: { en: '/country/usa', fa: '/usa' } },
};

export function groupMeta(key: string): GroupMeta {
  return META[key] ?? { theme: themeFor(''), guide: {} };
}
