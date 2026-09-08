// ============================================================================
// lib/fa/programmes.ts
// Machine-readable thresholds for the routes the Persian site covers, and a
// pure function that measures one reader against one route.
//
// WHY THIS EXISTS SEPARATELY FROM `facts`
// Each page already states its numbers, but as Persian prose — «۱٬۰۳۰ تا
// ۱٬۲۱۰ یورو در ماه», «۵۰۰٬۰۰۰ دلار کانادا». Prose is right for a reader and
// useless to a calculator. So the same numbers exist twice, which is a real
// drift risk: **when a threshold changes, change it here and in the page's
// `facts`.** Every rule therefore carries `updated` and `source`, and a test
// asserts both are present, so a stale rule is at least visibly stale.
//
// This is triage, not advice. It tells a reader which thresholds they clear
// today; it does not tell them they will be accepted.
// ============================================================================

export type Currency = 'CAD' | 'DKK' | 'EUR' | 'TRY';

/**
 * Indicative rates, only for showing a reader roughly where they stand
 * against a threshold quoted in another currency. Reviewed 2026-09-08.
 * Never used for anything that has to be exact, and always shown as
 * approximate in the UI.
 *
 * The lira is the one to distrust: Turkish inflation moves it fast enough
 * that this number is stale between reviews, so the Türkiye guide publishes
 * no lira amounts in prose and this rate exists only to place a reader
 * roughly against the 500,000 TRY capital condition.
 */
export const RATES_TO_CAD: Record<Currency, number> = {
  CAD: 1,
  DKK: 0.2,
  EUR: 1.5,
  TRY: 0.033,
};

export type Rule = {
  key: string;
  /** Persian name, as it appears on the page this links to. */
  name: string;
  /** Locale-agnostic path of the guide. */
  href: string;
  founders?: { min?: number; max?: number };
  /** Minimum personal net worth. */
  netWorth?: { amount: number; currency: Currency };
  /** Minimum investment into the business. */
  investment?: { amount: number; currency: Currency };
  /** Settlement funds the applicant must show, expressed for a full year. */
  yearlyFunds?: { amount: number; currency: Currency; perFounder?: boolean; note?: string };
  age?: { min: number; max: number };
  /** Minimum CLB band, when the programme sets one. */
  clb?: number;
  /** The furthest the venture must have got. */
  venture?: 'idea' | 'mvp' | 'revenue';
  /** A condition this calculator cannot measure — surfaced, never scored. */
  unscored?: string[];
  updated: string;
  source: string;
};

export const RULES: Rule[] = [
  {
    key: 'denmark',
    name: 'ویزای استارتاپ دانمارک',
    href: '/europe/denmark',
    founders: { max: 3 },
    yearlyFunds: { amount: 153240, currency: 'DKK', perFounder: true, note: 'مجرد؛ ۳۰۶٬۴۸۰ با همسر و ۳۵۶٬۹۰۴ با همسر و فرزند' },
    unscored: ['تأیید پنل کارشناسان Start-up Denmark', 'سهمیه‌ی سالانه ۷۵ نفر، بر اساس نفر نه تیم'],
    updated: '2026-09-08',
    source: 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark',
  },
  {
    key: 'finland',
    name: 'ویزای استارتاپ فنلاند',
    href: '/europe/finland',
    founders: { min: 2 },
    yearlyFunds: { amount: 12360, currency: 'EUR', perFounder: true, note: '۱٬۰۳۰ تا ۱٬۲۱۰ یورو در ماه، بسته به شهر' },
    unscored: ['گواهی واجد شرایط بودن از Business Finland'],
    updated: '2026-09-06',
    source: 'https://www.businessfinland.fi/en/for-finnish-customers/services/startup-permit',
  },
  {
    key: 'estonia',
    name: 'ویزای استارتاپ استونی',
    href: '/europe/estonia',
    founders: { min: 1 },
    yearlyFunds: { amount: 10560, currency: 'EUR', perFounder: true, note: '۸۸۰ یورو در ماه — چهار برابر سطح معیشت ۲۲۰ یورو' },
    venture: 'mvp',
    unscored: ['تأیید کمیته‌ی کارشناسی وزارت کشور، ظرف ۱۰ روز کاری'],
    updated: '2026-09-08',
    source: 'https://www.politsei.ee/en/instructions/residence-permit-for-start-up-business',
  },
  {
    key: 'netherlands',
    name: 'ویزای استارتاپ هلند',
    href: '/europe/netherlands',
    founders: { min: 1 },
    unscored: [
      'قرارداد امضاشده با فسیلیتیتور مورد تأیید RVO',
      // Deliberately unscored: the Dutch amount tracks the statutory minimum
      // wage and changes on 1 January AND 1 July, so a figure in this
      // quarterly-reviewed table would be wrong half the year.
      'تمکن مالی یک سال کامل — حدود ۲۱٬۲۰۰ یورو برای یک نفر و ۲۹٬۷۰۰ برای خانواده، اما هر شش ماه تغییر می‌کند',
      'اقامت اولیه حداکثر یک سال است و تمدید نمی‌شود',
      'محصول باید برای بازار هلند واقعاً جدید باشد',
    ],
    updated: '2026-09-08',
    source: 'https://ind.nl/en/residence-permits/work/start-up',
  },
  {
    key: 'turkey',
    name: 'تک‌ویزای ترکیه',
    href: '/turkey-tech-visa',
    founders: { min: 1 },
    // Contributed share capital per foreign partner under the general Turkish
    // work-permit rules, not a programme-specific threshold — which is exactly
    // why founders meet it late. Waived when the partner's capital share is
    // USD 100,000 or more.
    investment: { amount: 500000, currency: 'TRY' },
    unscored: [
      'تأیید کمیته‌ی داوران تکنوپارک',
      'حداقل ۲۰ درصد سهم برای هر شریک خارجی',
      'قاعده‌ی پنج کارمند ترک به ازای هر خارجی از ماه هفتم — معافیت کامل تأیید نشده است',
    ],
    updated: '2026-09-08',
    source: 'https://turkiyetechvisa.gov.tr/',
  },
  {
    key: 'new-brunswick',
    name: 'کارآفرینی نیوبرانزویک',
    href: '/pnp/new-brunswick',
    netWorth: { amount: 500000, currency: 'CAD' },
    investment: { amount: 150000, currency: 'CAD' },
    age: { min: 22, max: 55 },
    clb: 5,
    unscored: ['دست‌کم ۶۵ امتیاز از ۱۰۰ در سیستم EOI', 'ایجاد دست‌کم یک شغل تمام‌وقت'],
    updated: '2026-09-06',
    source: 'https://www.welcomenb.ca/',
  },
  {
    key: 'nova-scotia',
    name: 'کارآفرینی نوااسکوشیا',
    href: '/pnp/nova-scotia',
    netWorth: { amount: 600000, currency: 'CAD' },
    investment: { amount: 150000, currency: 'CAD' },
    clb: 5,
    unscored: ['حداقل ۳۳٫۳ درصد مالکیت', '۱۲ ماه اداره‌ی فعال با مجوز کار، پیش از نامزدی'],
    updated: '2026-09-06',
    source: 'https://novascotiaimmigration.com/move-here/entrepreneur/',
  },
];

export type Applicant = {
  /** Total net worth, in Canadian dollars. */
  netWorthCad: number;
  /** What the reader can actually move and invest, in Canadian dollars. */
  investableCad: number;
  founders: number;
  age: number;
  /** Best CLB band across the four skills. */
  clb: number;
  venture: 'idea' | 'mvp' | 'revenue';
};

export type CheckStatus = 'pass' | 'fail';
export type Check = { label: string; status: CheckStatus; detail?: string };
export type Verdict = 'clears' | 'close' | 'not-yet';
export type Assessment = {
  rule: Rule;
  verdict: Verdict;
  checks: Check[];
  /** Conditions the calculator deliberately does not score. */
  unscored: string[];
};

const toCad = (amount: number, currency: Currency) => Math.round(amount * RATES_TO_CAD[currency]);
const VENTURE_ORDER = { idea: 0, mvp: 1, revenue: 2 } as const;

/** Measure one applicant against one route. Pure — no formatting, no I/O. */
export function assess(rule: Rule, a: Applicant): Assessment {
  const checks: Check[] = [];

  if (rule.founders?.min !== undefined) {
    checks.push({
      label: 'تعداد بنیان‌گذاران',
      status: a.founders >= rule.founders.min ? 'pass' : 'fail',
      detail: `دست‌کم ${rule.founders.min} نفر`,
    });
  }
  if (rule.founders?.max !== undefined) {
    checks.push({
      label: 'سقف بنیان‌گذاران',
      status: a.founders <= rule.founders.max ? 'pass' : 'fail',
      detail: `حداکثر ${rule.founders.max} نفر`,
    });
  }
  if (rule.netWorth) {
    const need = toCad(rule.netWorth.amount, rule.netWorth.currency);
    checks.push({
      label: 'دارایی خالص',
      status: a.netWorthCad >= need ? 'pass' : 'fail',
      detail: `دست‌کم ${need.toLocaleString('en-US')} دلار کانادا`,
    });
  }
  if (rule.investment) {
    const need = toCad(rule.investment.amount, rule.investment.currency);
    checks.push({
      label: 'سرمایه‌گذاری',
      status: a.investableCad >= need ? 'pass' : 'fail',
      detail: `دست‌کم ${need.toLocaleString('en-US')} دلار کانادا`,
    });
  }
  if (rule.yearlyFunds) {
    const per = rule.yearlyFunds.perFounder ? Math.max(1, a.founders) : 1;
    const need = toCad(rule.yearlyFunds.amount, rule.yearlyFunds.currency) * per;
    checks.push({
      label: 'تمکن مالی یک سال',
      status: a.investableCad >= need ? 'pass' : 'fail',
      detail: `حدود ${need.toLocaleString('en-US')} دلار کانادا${rule.yearlyFunds.note ? ` — ${rule.yearlyFunds.note}` : ''}`,
    });
  }
  if (rule.age) {
    checks.push({
      label: 'سن',
      status: a.age >= rule.age.min && a.age <= rule.age.max ? 'pass' : 'fail',
      detail: `${rule.age.min} تا ${rule.age.max} سال`,
    });
  }
  if (rule.clb !== undefined) {
    checks.push({ label: 'زبان', status: a.clb >= rule.clb ? 'pass' : 'fail', detail: `حداقل CLB ${rule.clb}` });
  }
  if (rule.venture) {
    checks.push({
      label: 'مرحله‌ی محصول',
      status: VENTURE_ORDER[a.venture] >= VENTURE_ORDER[rule.venture] ? 'pass' : 'fail',
      detail: rule.venture === 'mvp' ? 'MVP الزامی است' : 'درآمد لازم است',
    });
  }

  const failed = checks.filter((c) => c.status === 'fail').length;
  const verdict: Verdict = failed === 0 ? 'clears' : failed === 1 ? 'close' : 'not-yet';
  return { rule, verdict, checks, unscored: rule.unscored ?? [] };
}

/** Every route, best first, so a reader sees where they actually stand. */
export function assessAll(a: Applicant): Assessment[] {
  const rank = { clears: 0, close: 1, 'not-yet': 2 } as const;
  return RULES.map((r) => assess(r, a)).sort((x, y) => rank[x.verdict] - rank[y.verdict]);
}
