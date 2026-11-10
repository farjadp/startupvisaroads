// ============================================================================
// components/case-studies/copy.ts
// Every fixed string on the Case Studies pages, en and fa.
//
// The disclaimers and the hub's direct answer are spec §3 / §5 wording,
// pasted verbatim; do not edit them here without changing the spec. The
// Persian strings are written for Persian readers, not translated: «ریجکتی»
// in the titles, the glossary terms (بازبینی قضایی، افسر مهاجرت) in the body.
// ============================================================================
import { toPersianDigits } from '@/lib/fa/format';

export type Lang = 'en' | 'fa';

export const DISCLAIMER_A: Record<Lang, string> = {
  en: "An educational summary of a public Federal Court of Canada decision, not legal or immigration advice and not the official version. The official text is on the Court's website (linked). Every case turns on its own facts. VisaRoads Inc. is not affiliated with or endorsed by the Government of Canada or the Court. For your own case, consult a lawyer or a licensed consultant (RCIC).",
  fa: 'این صفحه خلاصه‌ای آموزشی از یک رأی عمومی دادگاه فدرال کاناداست؛ نه مشاوره حقوقی یا مهاجرتی است و نه نسخه رسمی رأی. متن معتبر را در سایت دادگاه بخوانید (لینک بالا). هر پرونده با شرایط خودش سنجیده می‌شود. ویزا رودز هیچ وابستگی‌ای به دولت کانادا یا دادگاه ندارد. برای پرونده خودتان با وکیل یا مشاور مهاجرت دارای مجوز (RCIC) صحبت کنید.',
};

export const DISCLAIMER_B: Record<Lang, string> = {
  en: "A real VisaRoads client's experience, shared with their written consent; identifying details are removed or generalised. VisaRoads Inc. provides mentorship and business-plan services. It is not an immigration representative and gives no immigration advice. Results depend on each person's circumstances and on government decisions. This story is not a typical result or a promise of any outcome.",
  fa: 'این تجربه واقعی یکی از مراجعان ویزا رودز است که با رضایت کتبی خودش و بدون جزئیات شناسایی‌کننده منتشر شده. ویزا رودز خدمات منتورینگ و نگارش طرح کسب‌وکار ارائه می‌دهد و نماینده یا مشاور مهاجرتی نیست. نتیجه هر پرونده به شرایط خود فرد و تصمیم مقام دولتی بستگی دارد؛ این تجربه نه نتیجه معمول است و نه تضمینی برای شما.',
};

export const COPY = {
  en: {
    metaTitle: 'Federal Court visa refusal cases, explained',
    metaDescription:
      'Federal Court of Canada judicial reviews of visa refusals, summarised with a paragraph cite for every claim and a link to the official decision. Applicants are never named.',
    kicker: 'Case studies · Canada',
    h1: 'Refused? Read how the Court looked at cases like yours.',
    directAnswer:
      'The Federal Court does not hear an appeal of a visa refusal; it hears a judicial review. If the Court agrees, the decision goes back to a different officer. It does not grant the visa.',
    hubNote: 'Each case links the official decision. Applicants are never named.',
    filterLabel: 'Filter cases',
    route: 'Route',
    outcome: 'Outcome',
    country: 'Country',
    all: 'All',
    canada: 'Canada',
    moreCountries: 'More countries later',
    count: (n: number) => (n === 1 ? '1 case · newest first' : `${n} cases · newest first`),
    filteredEmpty: 'No case matches these filters yet.',
    clearFilters: 'Show all cases',
    empty: 'No case is published yet. The first ones are in review.',
    colCitation: 'Citation',
    colRoute: 'Route',
    colCase: 'What happened',
    colOutcome: 'Outcome',
    colDate: 'Decided',
    allowed: 'Allowed',
    dismissed: 'Dismissed',
    noCourtOutcome: 'No court outcome',
    courtBadge: 'Court decision',
    clientBadge: 'Client case',
    caseSheet: 'Case sheet',
    citation: 'Citation',
    decided: 'Decided',
    outcomeAllowedLine: 'Allowed: sent back for a new decision by a different officer',
    outcomeDismissedLine: 'Dismissed: the refusal stands',
    notGranted: 'The visa was not granted. The application will be decided again, from the start.',
    readOfficial: 'Read the official decision',
    inOneLine: 'In one line',
    sections: {
      facts: 'Facts',
      issue: 'The issue',
      held: 'What the Court held',
      erred: 'Why the officer erred',
      noError: 'Why the officer did not err',
      lessons: 'Lessons for your file',
      problem: 'The problem',
      action: 'What we worked on',
      result: 'Where it stands',
    },
    certifiedQuestion: 'Certified question',
    certifiedNote: 'The Court certified a question, so the decision can be appealed to the Federal Court of Appeal.',
    guideLink: (label: string) => `${label} guide →`,
    checklistLink: 'Matching checklist →',
    source: 'Source',
    court: 'Court',
    date: 'Date',
    officialOnSite: 'Read the official decision on decisions.fct-cf.gc.ca',
    attribution: 'Source: Federal Court of Canada decisions database (decisions.fct-cf.gc.ca).',
    noEndorsement: 'This summary is not produced in affiliation with, or with the endorsement of, the Government of Canada.',
    clientSource: 'VisaRoads client, anonymised, shared with written consent',
    faq: 'Questions',
    back: '← All case studies',
    sampleTitle: 'Sample data',
    sampleBody: 'Invented for layout testing. The citation, facts and quotes are not real and refer to no decision.',
    paraLabel: (paras: number[]) => `¶ ${paras.join(', ')}`,
    paraAria: (paras: number[]) => `${paras.length > 1 ? 'Paragraphs' : 'Paragraph'} ${paras.join(', ')}: show the quote`,
    quoteHeading: (paras: number[], citation: string | null) =>
      `${paras.length > 1 ? 'Paragraphs' : 'Paragraph'} ${paras.join(', ')}${citation ? ` · ${citation}` : ''}`,
    quoteLang: '',
    externalArrow: '↗',
  },
  fa: {
    metaTitle: 'رفع ریجکتی در دادگاه فدرال کانادا: پرونده‌ها',
    metaDescription:
      'خلاصه آرای دادگاه فدرال کانادا درباره ریجکتی ویزا؛ هر ادعا با شماره بند رأی و لینک متن رسمی. نام متقاضی هیچ‌جا نمی‌آید.',
    kicker: 'پرونده‌ها · کانادا',
    h1: 'ریجکت شده‌اید؟ ببینید دادگاه با پرونده‌های شبیه شما چه کرد.',
    directAnswer:
      'دادگاه فدرال به ریجکتی ویزا به‌صورت تجدیدنظر رسیدگی نمی‌کند؛ کار آن بازبینی قضایی است. اگر دادگاه با متقاضی هم‌نظر باشد، پرونده برای تصمیم تازه به افسر دیگری برمی‌گردد. دادگاه ویزا صادر نمی‌کند.',
    hubNote: 'هر پرونده به متن رسمی رأی لینک دارد. نام متقاضی هیچ‌جا نمی‌آید.',
    filterLabel: 'فیلتر پرونده‌ها',
    route: 'مسیر',
    outcome: 'نتیجه',
    country: 'کشور',
    all: 'همه',
    canada: 'کانادا',
    moreCountries: 'کشورهای دیگر در آینده',
    count: (n: number) => `${toPersianDigits(n)} پرونده · تازه‌ترین اول`,
    filteredEmpty: 'هنوز پرونده‌ای با این فیلترها نداریم.',
    clearFilters: 'نمایش همه پرونده‌ها',
    empty: 'هنوز پرونده‌ای منتشر نشده است.',
    colCitation: 'شماره رأی',
    colRoute: 'مسیر',
    colCase: 'چه شد',
    colOutcome: 'نتیجه',
    colDate: 'تاریخ رأی',
    allowed: 'پذیرفته شد',
    dismissed: 'رد شد',
    noCourtOutcome: 'بدون رأی دادگاه',
    courtBadge: 'رأی دادگاه',
    clientBadge: 'تجربه مراجع',
    caseSheet: 'خلاصه پرونده',
    citation: 'شماره رأی',
    decided: 'تاریخ رأی',
    outcomeAllowedLine: 'پذیرفته شد: پرونده برای تصمیم تازه به افسر دیگری برگشت',
    outcomeDismissedLine: 'رد شد: ریجکتی پابرجا ماند',
    notGranted: 'ویزا صادر نشد؛ درخواست از نو و از ابتدا بررسی می‌شود.',
    readOfficial: 'متن رسمی رأی (انگلیسی)',
    inOneLine: 'در یک جمله',
    sections: {
      facts: 'ماجرا',
      issue: 'پرسش اصلی',
      held: 'حکم دادگاه',
      erred: 'اشتباه افسر کجا بود',
      noError: 'چرا دادگاه اشتباهی در کار افسر ندید',
      lessons: 'درس‌هایی برای پرونده شما',
      problem: 'مشکل',
      action: 'روی چه کار کردیم',
      result: 'به کجا رسید',
    },
    certifiedQuestion: 'پرسش تأییدشده',
    certifiedNote: 'دادگاه پرسشی را تأیید کرده است؛ پس می‌شود از این رأی در دادگاه تجدیدنظر فدرال درخواست تجدیدنظر کرد.',
    guideLink: (label: string) => `راهنمای ${label} ←`,
    checklistLink: 'چک‌لیست مربوط ←',
    source: 'منبع',
    court: 'دادگاه',
    date: 'تاریخ',
    officialOnSite: 'متن رسمی رأی در',
    attribution: 'منبع: پایگاه آرای دادگاه فدرال کانادا.',
    noEndorsement: 'این خلاصه با همکاری یا تأیید دولت کانادا تهیه نشده است.',
    clientSource: 'مراجع ویزا رودز، بدون نام و جزئیات شناسایی‌کننده، با رضایت کتبی',
    faq: 'پرسش‌ها',
    back: 'همه پرونده‌ها →',
    sampleTitle: 'داده نمونه',
    sampleBody: 'این صفحه برای آزمایش چیدمان ساخته شده است. شماره رأی، ماجرا و نقل‌قول‌ها واقعی نیستند و به هیچ رأیی اشاره ندارند.',
    paraLabel: (paras: number[]) => `بند ${paras.map((p) => toPersianDigits(p)).join('، ')}`,
    paraAria: (paras: number[]) => `بند ${paras.map((p) => toPersianDigits(p)).join('، ')}، نمایش متن`,
    quoteHeading: (paras: number[], _citation: string | null) => `بند ${paras.map((p) => toPersianDigits(p)).join('، ')}`,
    quoteLang: 'متن اصلی رأی به انگلیسی',
    externalArrow: '↖',
  },
} as const;

export type CaseCopy = (typeof COPY)[Lang];

/** Route labels and the guide each route links to, per locale. Unknown routes fall back to a readable slug. */
export const ROUTES: Record<string, { en: string; fa: string; guide: { en?: string; fa?: string } }> = {
  'start-up-visa': {
    en: 'Start-up visa',
    fa: 'استارتاپ ویزا',
    guide: { en: '/startup-visa-canada', fa: '/canada-startup-visa' },
  },
  'start-up-visa-work-permit': {
    en: 'Start-up visa work permit',
    fa: 'ورک‌پرمیت استارتاپ ویزا',
    guide: { en: '/startup-visa-canada', fa: '/canada-startup-visa' },
  },
  'work-permit-c11': { en: 'C11 entrepreneur work permit', fa: 'ورک‌پرمیت کارآفرینی C11', guide: { en: '/c10-work-permit' } },
  'study-permit': { en: 'Study permit', fa: 'ویزای تحصیلی', guide: {} },
  'work-permit': { en: 'Work permit', fa: 'ورک‌پرمیت', guide: {} },
  pnp: { en: 'PNP', fa: 'PNP', guide: { en: '/pnp', fa: '/pnp' } },
};

export function routeLabel(route: string, lang: Lang): string {
  const r = ROUTES[route];
  if (r) return r[lang];
  const words = route.replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function routeGuide(route: string, lang: Lang): string | null {
  return ROUTES[route]?.guide[lang] ?? null;
}

const EN_DATE = new Intl.DateTimeFormat('en-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const EN_SHORT = new Intl.DateTimeFormat('en-CA', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
// A court date is a Gregorian fact: Persian digits and month names, Gregorian calendar.
const FA_DATE = new Intl.DateTimeFormat('fa-IR-u-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function courtDate(d: Date, lang: Lang, short = false): string {
  if (lang === 'fa') return FA_DATE.format(d);
  return (short ? EN_SHORT : EN_DATE).format(d);
}
