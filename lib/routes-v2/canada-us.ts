// VisaRoads v2 routes: Canada and the United States.
// Data from the research notes of 15 Oct 2026 (PNP figures verified against
// the provincial sites on 12 Oct 2026). Official sources only; see types.ts.

import type { Criterion, L10n, MoneyBasis, MoneyLine, RouteV2, Source } from './types';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const faNum = (n: number): string =>
  n
    .toLocaleString('en-US')
    .replace(/,/g, '٬')
    .replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

/** One money line per family size (1…n), then one for each extra member. */
function familyLines(
  keyPrefix: string,
  label: L10n,
  amounts: number[],
  extra: number,
  basis: MoneyBasis,
  shows: L10n,
): MoneyLine[] {
  const lines: MoneyLine[] = amounts.map((amount, i) => ({
    key: `${keyPrefix}-${i + 1}`,
    label: {
      en: `${label.en}, family of ${i + 1}`,
      fa: `${label.fa ?? label.en}، خانوادهٔ ${faNum(i + 1)} نفره`,
    },
    amount,
    currency: 'CAD',
    basis,
    shows,
  }));
  lines.push({
    key: `${keyPrefix}-extra`,
    label: {
      en: `${label.en}, each additional family member above ${amounts.length}`,
      fa: `${label.fa ?? label.en}، به‌ازای هر عضو بیشتر از ${faNum(amounts.length)} نفر`,
    },
    amount: extra,
    currency: 'CAD',
    basis,
    shows,
  });
  return lines;
}

// ---------------------------------------------------------------- shared

const EE_SETTLEMENT_SHOWS: L10n = {
  en: 'Available at application and at visa issuance; bank letter on letterhead with each account number, opening date, balance and 6-month average; debts listed; legally accessible; no home equity; not borrowed. A joint account counts.',
  fa: 'هنگام درخواست و هنگام صدور ویزا در دسترس باشد؛ نامهٔ بانک روی سربرگ با شمارهٔ هر حساب، تاریخ افتتاح، موجودی و میانگین شش ماه؛ بدهی‌ها فهرست شود؛ از نظر قانونی در دسترس باشد؛ ارزش ملک مسکونی حساب نمی‌شود؛ قرضی نباشد. حساب مشترک پذیرفته می‌شود.',
};

const EE_SETTLEMENT = (keyPrefix: string): MoneyLine[] =>
  familyLines(
    keyPrefix,
    { en: 'Settlement funds', fa: 'هزینهٔ استقرار' },
    [15_263, 19_001, 23_360, 28_362, 32_168, 36_280, 40_392],
    4_112,
    'once',
    EE_SETTLEMENT_SHOWS,
  );

const IRCC_PR_FEES = [
  { label: { en: 'PR: principal applicant (990 processing + 600 RPRF)', fa: 'اقامت دائم: متقاضی اصلی (۹۹۰ رسیدگی + ۶۰۰ حق اقامت دائم)' }, amount: 1_590, currency: 'CAD' as const },
  { label: { en: 'PR: spouse or partner', fa: 'اقامت دائم: همسر یا شریک زندگی' }, amount: 1_590, currency: 'CAD' as const },
  { label: { en: 'PR: dependent child', fa: 'اقامت دائم: فرزند وابسته' }, amount: 270, currency: 'CAD' as const },
  { label: { en: 'Biometrics (per person; family maximum 170)', fa: 'انگشت‌نگاری (هر نفر؛ سقف خانواده ۱۷۰)' }, amount: 85, currency: 'CAD' as const },
];

const IRCC_FEE_SOURCE: Source = {
  url: 'https://ircc.canada.ca/english/information/fees/fees.asp',
  checked: '2026-10-15',
  label: 'IRCC fee list (page date 2026-09-21)',
};

const PNP_PAPER_PROCESSING: L10n = {
  en: 'IRCC service standard for paper PNP applications is 11 months (67% met in FY 2024–25; 14 months actual at 30 Sep 2025), excluding the province’s own processing.',
  fa: 'استاندارد خدمات IRCC برای پرونده‌های کاغذی PNP یازده ماه است (۶۷٪ در سال مالی ۲۰۲۴–۲۵ رعایت شد؛ زمان واقعی در ۳۰ سپتامبر ۲۰۲۵ چهارده ماه)، بدون احتساب زمان رسیدگی استان.',
};

const PNP_PR: L10n = {
  en: 'Work permit → operate the business → provincial nomination → IRCC paper PR application.',
  fa: 'مجوز کار ← ادارهٔ کسب‌وکار ← نامزدی استانی ← درخواست کاغذی اقامت دائم در IRCC.',
};

const PNP_UNSCOREABLE: Criterion[] = [
  {
    key: 'ownership',
    label: { en: 'Ownership share', fa: 'سهم مالکیت' },
    weight: 2,
    scoreable: false,
  },
  {
    key: 'business-plan',
    label: { en: 'Business plan quality, interview and economic-benefit judgement', fa: 'کیفیت طرح کسب‌وکار، مصاحبه و ارزیابی منفعت اقتصادی' },
    weight: 3,
    scoreable: false,
    note: {
      en: 'Excluded business types, allocation limits and draw selection are also outside the profile.',
      fa: 'نوع کسب‌وکارهای مستثنا، سقف سهمیه و انتخاب در قرعه نیز از روی پروفایل قابل سنجش نیست.',
    },
  },
];

const US_TRAVEL_BAN: Criterion = {
  key: 'travel-ban',
  label: { en: 'Nationality not covered by Proclamation 10998', fa: 'تابعیت مشمول اعلامیهٔ ۱۰۹۹۸ نباشد' },
  weight: 3,
  scoreable: false,
  note: {
    en: 'From 1 Jan 2026 immigrant and non-immigrant visas are suspended for Iranian nationals; narrow exceptions only (e.g. dual nationals on a non-listed passport). Evaluate this first.',
    fa: 'از ۱ ژانویهٔ ۲۰۲۶ صدور ویزای مهاجرتی و غیرمهاجرتی برای اتباع ایران متوقف است؛ تنها استثناهای محدود (مثلاً دوتابعیتی‌ها با گذرنامهٔ کشور غیرمشمول). این مورد را پیش از همه بررسی کنید.',
  },
};

const USCIS_FEES_SOURCE: Source = {
  url: 'https://www.uscis.gov/g-1055',
  checked: '2026-10-15',
  label: 'USCIS Form G-1055 (edition 10/07/26)',
};

const USCIS_PREMIUM_SOURCE = 'https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing';

const USCIS_FEE_REVIEW =
  'USCIS fees change 16 Oct 2026 (FY 2027 inflation adjustment to H.R. 1 fees): re-read G-1055 after that date. USCIS normal processing times not captured (Cloudflare); only premium clocks are official.';

const I140_SELF_FEES = [
  { label: { en: 'I-140 (paper; 665 online)', fa: 'فرم I-140 (کاغذی؛ آنلاین ۶۶۵)' }, amount: 715, currency: 'USD' as const },
  { label: { en: 'Asylum Program Fee (self-petitioner)', fa: 'هزینهٔ برنامهٔ پناهندگی (خوددرخواست‌دهنده)' }, amount: 300, currency: 'USD' as const },
  { label: { en: 'I-907 premium processing (optional)', fa: 'رسیدگی ویژهٔ I-907 (اختیاری)' }, amount: 2_965, currency: 'USD' as const },
  { label: { en: 'I-485, age 14+ (paper; 1,390 online)', fa: 'فرم I-485، ۱۴ سال به بالا (کاغذی؛ آنلاین ۱٬۳۹۰)' }, amount: 1_440, currency: 'USD' as const },
];

const HIGHER_DEGREES = ['master', 'phd'];
const SECONDARY_PLUS = ['secondary', 'bachelor', 'master', 'phd'];

// ---------------------------------------------------------------- routes

export const ROUTES_CANADA_US: RouteV2[] = [
  // CA-1 ------------------------------------------------------------------
  {
    key: 'ca-start-up-visa',
    country: 'CA',
    family: 'startup',
    name: { en: 'Start-up Visa Program', fa: 'برنامهٔ ویزای استارتاپ' },
    agency: {
      en: 'IRCC',
      fa: 'اداره‌ی مهاجرت کانادا (IRCC)',
    },
    status: 'paused',
    fact: {
      en: 'Closed to new applicants since 30 June 2026; canada.ca names no successor programme. Files accepted before the pause are still processed.',
      fa: 'از ۳۰ ژوئن ۲۰۲۶ درخواست تازه پذیرفته نمی‌شود و canada.ca هیچ برنامهٔ جایگزینی معرفی نکرده است. پرونده‌هایی که پیش از توقف پذیرفته شده‌اند همچنان بررسی می‌شوند.',
    },
    criteria: [
      {
        key: 'commitment-certificate',
        label: { en: 'Commitment certificate from a designated organisation', fa: 'گواهی تعهد از سازمان تعیین‌شده' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Only a 2025 certificate, filed within 6 months and by 30 Jun 2026. No longer obtainable.',
          fa: 'فقط گواهی سال ۲۰۲۵ که ظرف شش ماه و تا ۳۰ ژوئن ۲۰۲۶ ثبت شده باشد. دیگر قابل دریافت نیست.',
        },
      },
      {
        key: 'language',
        label: { en: 'Language: CLB 5 in all four abilities', fa: 'زبان: CLB ۵ در هر چهار مهارت' },
        weight: 3,
        scoreable: false,
        note: { en: 'Programme paused: not scored.', fa: 'برنامه متوقف است و امتیازدهی نمی‌شود.' },
      },
      {
        key: 'ownership',
        label: {
          en: 'Ownership: each applicant ≥10% of voting rights; applicants and DO together >50%; at most 5 owners',
          fa: 'مالکیت: هر متقاضی دست‌کم ۱۰٪ حق رأی؛ متقاضیان و سازمان تعیین‌شده روی هم بیش از ۵۰٪؛ حداکثر پنج مالک',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'designated-support',
        label: {
          en: 'Support: VC ≥ CAD 200,000, angel group ≥ CAD 75,000, or acceptance into an incubator',
          fa: 'حمایت: سرمایه‌گذار خطرپذیر دست‌کم ۲۰۰٬۰۰۰ دلار کانادا، گروه فرشته دست‌کم ۷۵٬۰۰۰ دلار کانادا، یا پذیرش در شتاب‌دهنده',
        },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'settlement-funds',
        label: { en: 'Settlement funds by family size', fa: 'هزینهٔ استقرار بر اساس تعداد اعضای خانواده' },
        weight: 3,
        scoreable: false,
        note: { en: 'Same table as Express Entry.', fa: 'همان جدول اکسپرس انتری.' },
      },
      {
        key: 'due-diligence',
        label: {
          en: 'DO due diligence, peer review, cap of 10 group applications per DO per year, officer judgement',
          fa: 'بررسی دقیق سازمان تعیین‌شده، داوری همتا، سقف ۱۰ درخواست گروهی برای هر سازمان در سال، و تشخیص افسر',
        },
        weight: 2,
        scoreable: false,
      },
    ],
    money: EE_SETTLEMENT('settlement'),
    fees: IRCC_PR_FEES,
    pr: {
      en: 'Direct permanent residence; the work permit was optional.',
      fa: 'اقامت دائم مستقیم؛ مجوز کار اختیاری بود.',
    },
    sources: [
      {
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html',
        checked: '2026-10-15',
        label: 'Start-up Visa (page date 2026-07-21)',
      },
      {
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/about.html',
        checked: '2026-10-15',
        label: 'About the Start-up Visa (page date 2026-07-21)',
      },
      IRCC_FEE_SOURCE,
    ],
    verified: true,
    review:
      'Processing time not published (IRCC widget fails). Settlement-funds table dated 7 Jul 2025 by IRCC (repo says 2025-07-29); 2026 LICO update overdue, re-check monthly. A "high impact Start-Up Visa pilot" appears only in trade press citing the 2026–27 Departmental Plan; verify on canada.ca. Backlog figures (43,200 vs "6,700 applications") are unofficial.',
  },

  // CA-2 ------------------------------------------------------------------
  {
    key: 'ca-express-entry',
    country: 'CA',
    family: 'express',
    name: {
      en: 'Express Entry (Federal Skilled Worker, Canadian Experience Class, Federal Skilled Trades)',
      fa: 'اکسپرس انتری (کارگران ماهر فدرال، تجربهٔ کانادایی، مشاغل فنی فدرال)',
    },
    agency: {
      en: 'IRCC',
      fa: 'اداره‌ی مهاجرت کانادا (IRCC)',
    },
    status: 'open',
    fact: {
      en: 'Your CRS score against the cut-off of the round you are eligible for. The latest CEC round (15 Oct 2026) needed 519; a provincial nomination adds 600.',
      fa: 'امتیاز CRS شما در برابر حد نصاب قرعه‌ای که واجد شرایط آن هستید. آخرین قرعهٔ CEC (۱۵ اکتبر ۲۰۲۶) به ۵۱۹ امتیاز نیاز داشت؛ نامزدی استانی ۶۰۰ امتیاز اضافه می‌کند.',
    },
    criteria: [
      {
        key: 'work-experience',
        label: { en: 'Skilled work experience: at least 1 year', fa: 'سابقهٔ کار ماهر: دست‌کم یک سال' },
        weight: 3,
        scoreable: true,
        test: { field: 'workYears', op: 'gte', value: 1 },
        note: {
          en: 'FSW: 1 yr continuous full-time (1,560 h) in one TEER 0–3 occupation in the last 10 yrs. CEC: 1 yr Canadian TEER 0–3 in the last 3 yrs. FST: 2 yrs full-time in a skilled trade in the last 5 yrs.',
          fa: 'FSW: یک سال تمام‌وقت پیوسته (۱٬۵۶۰ ساعت) در یک شغل TEER ۰ تا ۳ در ده سال اخیر. CEC: یک سال تجربهٔ کانادایی TEER ۰ تا ۳ در سه سال اخیر. FST: دو سال تمام‌وقت در یک حرفهٔ فنی در پنج سال اخیر.',
        },
      },
      {
        key: 'language',
        label: { en: 'Language: CLB 7 in all four abilities (FSW)', fa: 'زبان: CLB ۷ در هر چهار مهارت (FSW)' },
        weight: 3,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 7 },
        note: {
          en: 'CEC: CLB 7 for TEER 0/1, CLB 5 for TEER 2/3. FST: CLB 5 speaking and listening, CLB 4 reading and writing.',
          fa: 'CEC: برای TEER ۰ و ۱ سطح CLB ۷ و برای TEER ۲ و ۳ سطح CLB ۵. FST: CLB ۵ در گفتار و شنیدار و CLB ۴ در خواندن و نوشتن.',
        },
      },
      {
        key: 'education',
        label: { en: 'Education credential (FSW)', fa: 'مدرک تحصیلی (FSW)' },
        weight: 3,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: SECONDARY_PLUS },
        note: {
          en: 'A Canadian credential, or a foreign credential with an ECA. Not required for CEC or FST.',
          fa: 'مدرک کانادایی، یا مدرک خارجی همراه با ارزیابی ECA. برای CEC و FST لازم نیست.',
        },
      },
      {
        key: 'fsw-grid',
        label: { en: 'FSW 100-point grid: at least 67', fa: 'جدول ۱۰۰ امتیازی FSW: دست‌کم ۶۷' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Language 24, second language 4, education 25, experience 15, age 12 (18–35 = 12), arranged employment 10, adaptability 10.',
          fa: 'زبان اول ۲۴، زبان دوم ۴، تحصیلات ۲۵، سابقهٔ کار ۱۵، سن ۱۲ (۱۸ تا ۳۵ سال = ۱۲)، پیشنهاد کار ۱۰، سازگاری ۱۰.',
        },
      },
      {
        key: 'trade-offer',
        label: {
          en: 'FST only: full-time job offer of at least 1 year, or a Canadian certificate of qualification',
          fa: 'فقط FST: پیشنهاد کار تمام‌وقت دست‌کم یک‌ساله، یا گواهی صلاحیت حرفه‌ای کانادا',
        },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Not required for FSW or CEC. Job-offer CRS points were removed on 25 Mar 2025.',
          fa: 'برای FSW و CEC لازم نیست. امتیاز CRS پیشنهاد کار از ۲۵ مارس ۲۰۲۵ حذف شده است.',
        },
      },
      {
        key: 'proof-of-funds',
        label: { en: 'Proof of settlement funds (FSW, FST)', fa: 'اثبات هزینهٔ استقرار (FSW و FST)' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 15_263, currency: 'CAD' },
        note: {
          en: 'CAD 15,263 for one person; more for a family. CEC is exempt, as is anyone authorised to work in Canada with a valid job offer.',
          fa: '۱۵٬۲۶۳ دلار کانادا برای یک نفر و بیشتر برای خانواده. متقاضیان CEC و کسانی که اجازهٔ کار در کانادا و پیشنهاد کار معتبر دارند معاف‌اند.',
        },
      },
      {
        key: 'crs-age',
        label: { en: 'CRS age points: maximum at 20–29', fa: 'امتیاز سنی CRS: بیشترین امتیاز در ۲۰ تا ۲۹ سالگی' },
        weight: 2,
        scoreable: true,
        test: { field: 'age', op: 'between', value: [20, 29] },
        note: {
          en: 'Single: 110 points at 20–29, falling each year from 30 to 6 at 44, 0 from 45. A ranking factor, not a gate.',
          fa: 'برای فرد مجرد: ۱۱۰ امتیاز در ۲۰ تا ۲۹ سالگی، کاهش سالانه از ۳۰ سالگی تا ۶ امتیاز در ۴۴ سالگی و صفر از ۴۵ سالگی. عامل رتبه‌بندی است، نه شرط ورود.',
        },
      },
      {
        key: 'crs-french',
        label: { en: 'French NCLC 7+ (CRS +50 with CLB 5+ English)', fa: 'فرانسه NCLC ۷ یا بالاتر (۵۰+ امتیاز CRS با انگلیسی CLB ۵ یا بالاتر)' },
        weight: 2,
        scoreable: true,
        test: { field: 'frenchClb', op: 'gte', value: 7 },
        note: {
          en: '+25 if English is CLB 4 or lower, or none.',
          fa: 'اگر انگلیسی CLB ۴ یا کمتر باشد یا آزمون انگلیسی نداشته باشید، ۲۵+ امتیاز.',
        },
      },
      {
        key: 'nomination',
        label: { en: 'Provincial nomination (CRS +600)', fa: 'نامزدی استانی (۶۰۰+ امتیاز CRS)' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'draw-cutoff',
        label: { en: 'CRS at or above the cut-off of an eligible round', fa: 'امتیاز CRS برابر یا بالاتر از حد نصاب قرعهٔ مربوط' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Latest rounds (IRCC feed, read 15 Oct 2026): CEC 15 Oct 2026, 2,500 invited, lowest CRS 519; PNP 13 Oct 2026, 752, CRS 772; Trades 1 Oct 2026, 3,500, CRS 476; Senior managers 16 Sep 2026, 250, CRS 389. No general or FSW-only round in the last 12: an FSW-only profile has no recent round to compare against.',
          fa: 'آخرین قرعه‌ها (دادهٔ IRCC، خوانده‌شده در ۱۵ اکتبر ۲۰۲۶): CEC در ۱۵ اکتبر ۲۰۲۶ با ۲٬۵۰۰ دعوت و حداقل CRS ۵۱۹؛ PNP در ۱۳ اکتبر ۲۰۲۶ با ۷۵۲ دعوت و CRS ۷۷۲؛ مشاغل فنی در ۱ اکتبر ۲۰۲۶ با ۳٬۵۰۰ دعوت و CRS ۴۷۶؛ مدیران ارشد در ۱۶ سپتامبر ۲۰۲۶ با ۲۵۰ دعوت و CRS ۳۸۹. در ۱۲ قرعهٔ اخیر هیچ قرعهٔ عمومی یا ویژهٔ FSW برگزار نشده است؛ پروفایلی که فقط FSW است قرعهٔ اخیری برای مقایسه ندارد.',
        },
      },
      {
        key: 'outside-quebec',
        label: { en: 'Plan to live outside Quebec', fa: 'قصد سکونت در خارج از کبک' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: EE_SETTLEMENT('settlement'),
    processing: {
      text: {
        en: 'Service standard: 180 days for 80% of complete files (CEC, FSW, FST, PNP-EE). Actual at 30 Sep 2025: CEC 5.1 months, FSW 5.1 months, PNP-EE 9.0 months. FST met 0% in FY 2024–25; live data shows "Not enough data".',
        fa: 'استاندارد خدمات: ۱۸۰ روز برای ۸۰٪ پرونده‌های کامل (CEC، FSW، FST و PNP-EE). زمان واقعی در ۳۰ سپتامبر ۲۰۲۵: CEC و FSW هر کدام ۵٫۱ ماه، PNP-EE ۹ ماه. FST در سال مالی ۲۰۲۴–۲۵ صفر درصد رعایت شد و دادهٔ زنده «دادهٔ کافی نیست» نشان می‌دهد.',
      },
      source: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/service-declaration/service-standards.html',
    },
    fees: IRCC_PR_FEES,
    pr: { en: 'Direct permanent residence.', fa: 'اقامت دائم مستقیم.' },
    sources: [
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/federal-skilled-workers.html', checked: '2026-10-15', label: 'FSW eligibility (page date 2026-09-24)' },
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/canadian-experience-class.html', checked: '2026-10-15', label: 'CEC eligibility (page date 2026-09-24)' },
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/skilled-trades.html', checked: '2026-10-15', label: 'FST eligibility (page date 2026-06-22)' },
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-requirements.html', checked: '2026-10-15', label: 'Language requirements (page date 2026-06-22)' },
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html', checked: '2026-10-15', label: 'CRS criteria (page date 2026-06-22)' },
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/proof-funds.html', checked: '2026-10-15', label: 'Proof of funds (page date 2026-06-22)' },
      { url: 'https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json', checked: '2026-10-15', label: 'Express Entry rounds feed' },
      IRCC_FEE_SOURCE,
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/service-declaration/service-standards.html', checked: '2026-10-15', label: 'Service standards (page date 2026-07-16)' },
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/committees/cimm-nov-18-2025/processing-times-and-service-delivery.html', checked: '2026-10-15', label: 'CIMM 18 Nov 2025 processing note' },
    ],
    verified: true,
    review:
      'Draw cut-offs move every round: refresh from ee_rounds_123_en.json (cache server-side; ~690 KB, flaky HTTP/2). Label FSW-only profiles "no recent round", never compare them to the CEC cut-off. Settlement-funds table dated 7 Jul 2025; 2026 LICO update overdue, re-check monthly. Scoreable tests use FSW thresholds; CEC/FST variants are in notes only.',
  },

  // CA-3: PNP entrepreneur streams -----------------------------------------
  {
    key: 'ca-pnp-nova-scotia',
    country: 'CA',
    family: 'entrepreneur',
    name: { en: 'Nova Scotia Entrepreneur', fa: 'کارآفرینی نوا اسکوشیا' },
    agency: {
      en: 'Nova Scotia Nominee Program (NSNP), then IRCC',
      fa: 'برنامه‌ی معرفی استانی نوا اسکوشیا (NSNP)، سپس IRCC',
    },
    status: 'open',
    fact: {
      en: 'Choosing a location outside Halifax (HRM) lowers both money thresholds and adds 10 points. 2026 draws: 9 Apr (18 invited, lowest 88), 19 May (9, 100), 24 Jun (8, 99), 23 Jul (9, 101); none listed after July as of 12 Oct.',
      fa: 'انتخاب محلی خارج از هالیفاکس (HRM) هر دو حد مالی را پایین می‌آورد و ۱۰ امتیاز اضافه می‌کند. قرعه‌های ۲۰۲۶: ۹ آوریل (۱۸ دعوت، حداقل ۸۸)، ۱۹ مه (۹، ۱۰۰)، ۲۴ ژوئن (۸، ۹۹)، ۲۳ ژوئیه (۹، ۱۰۱)؛ تا ۱۲ اکتبر پس از ژوئیه قرعه‌ای ثبت نشده است.',
    },
    criteria: [
      {
        key: 'net-worth',
        label: { en: 'Net worth: CAD 600,000', fa: 'دارایی خالص: ۶۰۰٬۰۰۰ دلار کانادا' },
        weight: 3,
        scoreable: true,
        test: { field: 'netWorth', op: 'gte', value: 600_000, currency: 'CAD' },
        note: { en: 'CAD 400,000 outside HRM.', fa: 'خارج از HRM: ۴۰۰٬۰۰۰ دلار کانادا.' },
      },
      {
        key: 'investment',
        label: { en: 'Investment: CAD 150,000', fa: 'سرمایه‌گذاری: ۱۵۰٬۰۰۰ دلار کانادا' },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 150_000, currency: 'CAD' },
        note: { en: 'CAD 100,000 outside HRM.', fa: 'خارج از HRM: ۱۰۰٬۰۰۰ دلار کانادا.' },
      },
      {
        key: 'language',
        label: { en: 'Language: CLB 5 in all four abilities', fa: 'زبان: CLB ۵ در هر چهار مهارت' },
        weight: 3,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 5 },
      },
      {
        key: 'age',
        label: { en: 'Age: 21 or older', fa: 'سن: ۲۱ سال یا بیشتر' },
        weight: 3,
        scoreable: true,
        test: { field: 'age', op: 'gte', value: 21 },
      },
      {
        key: 'education',
        label: { en: 'Education: Canadian high-school equivalent', fa: 'تحصیلات: معادل دیپلم دبیرستان کانادا' },
        weight: 1,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: SECONDARY_PLUS },
      },
      {
        key: 'business-experience',
        label: { en: 'Business experience in the last 10 years', fa: 'سابقهٔ کسب‌وکار در ده سال اخیر' },
        weight: 3,
        scoreable: true,
        test: { field: 'workYears', op: 'gte', value: 3 },
        note: {
          en: '3 years as an owner of at least one third, or more than 5 years as a senior manager.',
          fa: 'سه سال مالکیت دست‌کم یک‌سوم کسب‌وکار، یا بیش از پنج سال مدیریت ارشد.',
        },
      },
      ...PNP_UNSCOREABLE.map((c) =>
        c.key === 'ownership'
          ? { ...c, label: { en: 'Ownership: at least one third', fa: 'مالکیت: دست‌کم یک‌سوم' } }
          : c,
      ),
      {
        key: 'points',
        label: { en: 'EOI ranking: recent cut-offs 88–101', fa: 'رتبه‌بندی EOI: حد نصاب‌های اخیر ۸۸ تا ۱۰۱' },
        weight: 2,
        scoreable: false,
        note: { en: 'Job creation earns points.', fa: 'ایجاد شغل امتیاز دارد.' },
      },
      {
        key: 'operation',
        label: { en: 'Operate the business 12 months before nomination', fa: 'ادارهٔ کسب‌وکار به مدت ۱۲ ماه پیش از نامزدی' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'net-worth',
        label: { en: 'Net worth (CAD 400,000 outside HRM)', fa: 'دارایی خالص (خارج از HRM: ۴۰۰٬۰۰۰)' },
        amount: 600_000,
        currency: 'CAD',
        basis: 'once',
        shows: { en: 'Verified by a designated third-party verifier.', fa: 'با تأیید ارزیاب ثالث تعیین‌شده.' },
      },
      {
        key: 'investment',
        label: { en: 'Investment in your own business (CAD 100,000 outside HRM)', fa: 'سرمایه‌گذاری در کسب‌وکار خودتان (خارج از HRM: ۱۰۰٬۰۰۰)' },
        amount: 150_000,
        currency: 'CAD',
        basis: 'once',
        shows: { en: 'Capital into your business, not a fee.', fa: 'سرمایه‌ای که وارد کسب‌وکار شما می‌شود، نه هزینه.' },
      },
    ],
    processing: { text: PNP_PAPER_PROCESSING, source: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/service-declaration/service-standards.html' },
    fees: [
      { label: { en: 'NSNP application (non-refundable, from 1 Sep 2026; EOI free)', fa: 'درخواست NSNP (غیرقابل‌استرداد، از ۱ سپتامبر ۲۰۲۶؛ EOI رایگان)' }, amount: 2_000, currency: 'CAD' },
      { label: { en: 'IRCC work permit', fa: 'مجوز کار IRCC' }, amount: 155, currency: 'CAD' },
      { label: { en: 'IRCC PR, principal applicant', fa: 'اقامت دائم IRCC، متقاضی اصلی' }, amount: 1_590, currency: 'CAD' },
    ],
    pr: {
      en: 'Work permit → operate the business → nomination → IRCC paper PR application (apply within 12 months of nomination).',
      fa: 'مجوز کار ← ادارهٔ کسب‌وکار ← نامزدی ← درخواست کاغذی اقامت دائم در IRCC (ظرف ۱۲ ماه پس از نامزدی).',
    },
    sources: [
      { url: 'https://liveinnovascotia.com/entrepreneur', checked: '2026-10-12', label: 'NSNP Entrepreneur' },
      { url: 'https://liveinnovascotia.com/sites/default/files/2026-02/Guide-NSNP-ENT-English.pdf', checked: '2026-10-12', label: 'NSNP Entrepreneur guide' },
      { url: 'https://liveinnovascotia.com/sites/default/files/2024-08/Entrepreneur_ITA_Draw_History.pdf', checked: '2026-10-12', label: 'Entrepreneur draw history' },
      { url: 'https://liveinnovascotia.com/resources/nsnp-update-application-fees-effective-september-1-2026', checked: '2026-10-12', label: 'NSNP fees from 1 Sep 2026' },
    ],
    verified: true,
    review: 'Draws and allocations move monthly: re-check. No draw listed after 23 Jul 2026 as of 12 Oct. Tests use HRM thresholds; lower non-HRM thresholds are in notes only.',
  },
  {
    key: 'ca-pnp-new-brunswick',
    country: 'CA',
    family: 'entrepreneur',
    name: { en: 'New Brunswick Business Immigration Stream', fa: 'مسیر مهاجرت تجاری نیوبرانزویک' },
    agency: {
      en: 'New Brunswick Provincial Nominee Program, then IRCC',
      fa: 'برنامه‌ی معرفی استانی نیوبرانزویک (New Brunswick Provincial Nominee Program)، سپس IRCC',
    },
    status: 'open',
    fact: {
      en: 'Assessed outside a draw system: the 65/100 points grid is the gate. No business draws are published.',
      fa: 'ارزیابی خارج از سیستم قرعه انجام می‌شود و جدول امتیاز ۶۵ از ۱۰۰ شرط ورود است. قرعهٔ تجاری منتشر نمی‌شود.',
    },
    criteria: [
      {
        key: 'net-worth',
        label: { en: 'Net worth: CAD 500,000', fa: 'دارایی خالص: ۵۰۰٬۰۰۰ دلار کانادا' },
        weight: 3,
        scoreable: true,
        test: { field: 'netWorth', op: 'gte', value: 500_000, currency: 'CAD' },
        note: {
          en: 'CAD 300,000 for agriculture. Gifts or inheritances received within 6 months before applying do not count.',
          fa: 'برای کشاورزی ۳۰۰٬۰۰۰ دلار کانادا. هدیه یا ارثی که در شش ماه پیش از درخواست دریافت شده حساب نمی‌شود.',
        },
      },
      {
        key: 'investment',
        label: { en: 'Investment: CAD 150,000', fa: 'سرمایه‌گذاری: ۱۵۰٬۰۰۰ دلار کانادا' },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 150_000, currency: 'CAD' },
      },
      {
        key: 'language',
        label: { en: 'Language: CLB 4 in all four abilities', fa: 'زبان: CLB ۴ در هر چهار مهارت' },
        weight: 3,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 4 },
      },
      {
        key: 'age',
        label: { en: 'Age: 19 to 59', fa: 'سن: ۱۹ تا ۵۹ سال' },
        weight: 3,
        scoreable: true,
        test: { field: 'age', op: 'between', value: [19, 59] },
      },
      {
        key: 'education',
        label: { en: 'Education: Canadian high-school equivalent', fa: 'تحصیلات: معادل دیپلم دبیرستان کانادا' },
        weight: 1,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: SECONDARY_PLUS },
      },
      {
        key: 'business-experience',
        label: { en: 'Business experience: 2 years in the last 5', fa: 'سابقهٔ کسب‌وکار: دو سال در پنج سال اخیر' },
        weight: 3,
        scoreable: true,
        test: { field: 'workYears', op: 'gte', value: 2 },
        note: {
          en: 'As an owner of at least 51%, or a senior manager supervising at least 2 people.',
          fa: 'به‌عنوان مالک دست‌کم ۵۱٪ یا مدیر ارشدی که دست‌کم دو نفر را سرپرستی می‌کند.',
        },
      },
      ...PNP_UNSCOREABLE.map((c) =>
        c.key === 'ownership'
          ? { ...c, label: { en: 'Ownership: at least 33.3%', fa: 'مالکیت: دست‌کم ۳۳٫۳٪' } }
          : c,
      ),
      {
        key: 'jobs',
        label: { en: 'Create at least 1 full-time job for a citizen or PR', fa: 'ایجاد دست‌کم یک شغل تمام‌وقت برای شهروند یا مقیم دائم' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'points',
        label: { en: 'Points grid: at least 65 of 100', fa: 'جدول امتیاز: دست‌کم ۶۵ از ۱۰۰' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'operation',
        label: {
          en: 'Operate the business at least 6 consecutive months (and 1 year within 2 years of arrival)',
          fa: 'ادارهٔ کسب‌وکار دست‌کم شش ماه پیوسته (و یک سال در دو سال نخست پس از ورود)',
        },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'net-worth',
        label: { en: 'Net worth (CAD 300,000 for agriculture)', fa: 'دارایی خالص (کشاورزی: ۳۰۰٬۰۰۰)' },
        amount: 500_000,
        currency: 'CAD',
        basis: 'once',
        shows: {
          en: 'Third-party verification within 90 days; gifts or inheritances from the last 6 months do not count.',
          fa: 'تأیید ارزیاب ثالث ظرف ۹۰ روز؛ هدیه یا ارث شش ماه اخیر حساب نمی‌شود.',
        },
      },
      {
        key: 'investment',
        label: { en: 'Investment in your own business', fa: 'سرمایه‌گذاری در کسب‌وکار خودتان' },
        amount: 150_000,
        currency: 'CAD',
        basis: 'once',
        shows: { en: 'Capital into your business, not a fee.', fa: 'سرمایه‌ای که وارد کسب‌وکار شما می‌شود، نه هزینه.' },
      },
    ],
    processing: { text: PNP_PAPER_PROCESSING, source: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/service-declaration/service-standards.html' },
    fees: [
      { label: { en: 'NB application (EOI free; no deposit)', fa: 'درخواست نیوبرانزویک (EOI رایگان؛ بدون سپرده)' }, amount: 2_000, currency: 'CAD' },
      { label: { en: 'IRCC work permit', fa: 'مجوز کار IRCC' }, amount: 155, currency: 'CAD' },
      { label: { en: 'IRCC PR, principal applicant', fa: 'اقامت دائم IRCC، متقاضی اصلی' }, amount: 1_590, currency: 'CAD' },
    ],
    pr: PNP_PR,
    sources: [
      { url: 'https://www.gnb.ca/en/topic/family-home-community/immigration/provincial-nominee-program/business-immigration-stream.html', checked: '2026-10-12', label: 'NB Business Immigration Stream' },
      { url: 'https://www.gnb.ca/content/dam/GNB3/t/fhc-fmc/immigration/docs/nb-business-immigration-stream-guide.pdf', checked: '2026-10-12', label: 'NB Business Immigration Stream guide (Mar 2025)' },
    ],
    verified: true,
    review: 'Long list of excluded business types not encoded. Provincial processing time not published.',
  },
  {
    key: 'ca-pnp-alberta',
    country: 'CA',
    family: 'entrepreneur',
    name: { en: 'Alberta Rural Entrepreneur Stream', fa: 'مسیر کارآفرینی روستایی آلبرتا' },
    agency: {
      en: 'Alberta Advantage Immigration Program (AAIP), then IRCC',
      fa: 'برنامه‌ی مهاجرتی آلبرتا (AAIP)، سپس IRCC',
    },
    status: 'open',
    fact: {
      en: 'You need a rural community endorsement before you can enter the pool. The 2026 entrepreneur allocation is 60 nominations; 36 were issued by 7 Oct.',
      fa: 'پیش از ورود به استخر باید تأییدیهٔ یک جامعهٔ روستایی را بگیرید. سهمیهٔ کارآفرینی ۲۰۲۶ شصت نامزدی است که تا ۷ اکتبر ۳۶ مورد آن صادر شده است.',
    },
    criteria: [
      {
        key: 'community-endorsement',
        label: { en: 'Rural community endorsement', fa: 'تأییدیهٔ جامعهٔ روستایی' },
        weight: 3,
        scoreable: true,
        test: { field: 'endorsement', op: 'true' },
      },
      {
        key: 'net-worth',
        label: { en: 'Net worth: CAD 300,000', fa: 'دارایی خالص: ۳۰۰٬۰۰۰ دلار کانادا' },
        weight: 3,
        scoreable: true,
        test: { field: 'netWorth', op: 'gte', value: 300_000, currency: 'CAD' },
      },
      {
        key: 'investment',
        label: { en: 'Investment: CAD 100,000', fa: 'سرمایه‌گذاری: ۱۰۰٬۰۰۰ دلار کانادا' },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 100_000, currency: 'CAD' },
      },
      {
        key: 'language',
        label: { en: 'Language: CLB 4', fa: 'زبان: CLB ۴' },
        weight: 3,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 4 },
      },
      {
        key: 'education',
        label: { en: 'Education: high school, with an ECA', fa: 'تحصیلات: دیپلم دبیرستان همراه با ارزیابی ECA' },
        weight: 1,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: SECONDARY_PLUS },
      },
      {
        key: 'business-experience',
        label: { en: 'Business experience in the last 10 years', fa: 'سابقهٔ کسب‌وکار در ده سال اخیر' },
        weight: 3,
        scoreable: true,
        test: { field: 'workYears', op: 'gte', value: 3 },
        note: {
          en: '3 years as an owner-manager, or 4 years as a senior manager.',
          fa: 'سه سال به‌عنوان مالک و مدیر، یا چهار سال به‌عنوان مدیر ارشد.',
        },
      },
      ...PNP_UNSCOREABLE.map((c) =>
        c.key === 'ownership'
          ? { ...c, label: { en: 'Ownership: at least 51% (100% for a succession)', fa: 'مالکیت: دست‌کم ۵۱٪ (برای جانشینی ۱۰۰٪)' } }
          : c,
      ),
      {
        key: 'jobs',
        label: { en: 'Create at least 1 full-time job (not required for a succession)', fa: 'ایجاد دست‌کم یک شغل تمام‌وقت (برای جانشینی لازم نیست)' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'points',
        label: { en: 'Ranked pool; endorsed candidates first', fa: 'استخر رتبه‌بندی‌شده؛ اولویت با متقاضیان تأییدشده' },
        weight: 2,
        scoreable: false,
        note: {
          en: 'No entrepreneur draws or scores are published. Allocation: 60 nominations in 2026, 36 issued by 7 Oct.',
          fa: 'قرعه یا امتیاز کارآفرینی منتشر نمی‌شود. سهمیه: ۶۰ نامزدی در ۲۰۲۶ که ۳۶ مورد تا ۷ اکتبر صادر شده است.',
        },
      },
      {
        key: 'operation',
        label: { en: 'Operate the business at least 12 months before nomination', fa: 'ادارهٔ کسب‌وکار دست‌کم ۱۲ ماه پیش از نامزدی' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'net-worth',
        label: { en: 'Net worth', fa: 'دارایی خالص' },
        amount: 300_000,
        currency: 'CAD',
        basis: 'once',
        shows: { en: 'Verified by a designated third party.', fa: 'با تأیید ارزیاب ثالث تعیین‌شده.' },
      },
      {
        key: 'investment',
        label: { en: 'Investment in your own business', fa: 'سرمایه‌گذاری در کسب‌وکار خودتان' },
        amount: 100_000,
        currency: 'CAD',
        basis: 'once',
        shows: { en: 'Capital into your business, not a fee.', fa: 'سرمایه‌ای که وارد کسب‌وکار شما می‌شود، نه هزینه.' },
      },
    ],
    processing: { text: PNP_PAPER_PROCESSING, source: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/service-declaration/service-standards.html' },
    fees: [
      { label: { en: 'AAIP EOI', fa: 'EOI برنامهٔ AAIP' }, amount: 200, currency: 'CAD' },
      { label: { en: 'AAIP application', fa: 'درخواست AAIP' }, amount: 3_500, currency: 'CAD' },
      { label: { en: 'IRCC work permit', fa: 'مجوز کار IRCC' }, amount: 155, currency: 'CAD' },
      { label: { en: 'IRCC PR, principal applicant', fa: 'اقامت دائم IRCC، متقاضی اصلی' }, amount: 1_590, currency: 'CAD' },
    ],
    pr: {
      en: 'Work permit → operate the business → nomination → IRCC paper PR application (apply within 6 months of nomination).',
      fa: 'مجوز کار ← ادارهٔ کسب‌وکار ← نامزدی ← درخواست کاغذی اقامت دائم در IRCC (ظرف شش ماه پس از نامزدی).',
    },
    sources: [
      { url: 'https://www.alberta.ca/aaip-rural-entrepreneur-stream-eligibility', checked: '2026-10-12', label: 'AAIP Rural Entrepreneur eligibility' },
      { url: 'https://www.alberta.ca/aaip-processing-information', checked: '2026-10-12', label: 'AAIP processing information' },
    ],
    verified: true,
    review:
      'Allocation count (36 of 60 by 7 Oct) moves monthly. No age rule published. Notes suggest separate v2 rows for Alberta Graduate Entrepreneur and Foreign Graduate Entrepreneur (not encoded here).',
  },
  {
    key: 'ca-pnp-manitoba',
    country: 'CA',
    family: 'entrepreneur',
    name: { en: 'Manitoba Business Investor Stream: Entrepreneur Pathway', fa: 'مسیر کارآفرینی جریان سرمایه‌گذار تجاری مانیتوبا' },
    agency: {
      en: 'Manitoba Provincial Nominee Program (MPNP), then IRCC',
      fa: 'برنامه‌ی معرفی استانی منیتوبا (MPNP)، سپس IRCC',
    },
    status: 'open',
    fact: {
      en: 'There are no BIS draws: a paper EOI is emailed and reviewed within 4 weeks. Investment is CAD 250,000 in Winnipeg Metro and CAD 150,000 outside it.',
      fa: 'قرعه‌ای برای BIS برگزار نمی‌شود: EOI کاغذی با ایمیل فرستاده و ظرف چهار هفته بررسی می‌شود. سرمایه‌گذاری در منطقهٔ وینیپگ ۲۵۰٬۰۰۰ و خارج از آن ۱۵۰٬۰۰۰ دلار کانادا است.',
    },
    criteria: [
      {
        key: 'net-worth',
        label: { en: 'Net worth: CAD 500,000', fa: 'دارایی خالص: ۵۰۰٬۰۰۰ دلار کانادا' },
        weight: 3,
        scoreable: true,
        test: { field: 'netWorth', op: 'gte', value: 500_000, currency: 'CAD' },
      },
      {
        key: 'investment',
        label: { en: 'Investment: CAD 250,000 in Winnipeg Metro', fa: 'سرمایه‌گذاری: ۲۵۰٬۰۰۰ دلار کانادا در منطقهٔ وینیپگ' },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 250_000, currency: 'CAD' },
        note: { en: 'CAD 150,000 outside Winnipeg Metro.', fa: 'خارج از منطقهٔ وینیپگ: ۱۵۰٬۰۰۰ دلار کانادا.' },
      },
      {
        key: 'language',
        label: { en: 'Language: CLB 5', fa: 'زبان: CLB ۵' },
        weight: 3,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 5 },
      },
      {
        key: 'education',
        label: { en: 'Education: Canadian high-school equivalent', fa: 'تحصیلات: معادل دیپلم دبیرستان کانادا' },
        weight: 1,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: SECONDARY_PLUS },
      },
      {
        key: 'business-experience',
        label: { en: 'Business experience: 3 years full-time in the last 5', fa: 'سابقهٔ کسب‌وکار: سه سال تمام‌وقت در پنج سال اخیر' },
        weight: 3,
        scoreable: true,
        test: { field: 'workYears', op: 'gte', value: 3 },
        note: { en: 'As an owner or a senior manager.', fa: 'به‌عنوان مالک یا مدیر ارشد.' },
      },
      ...PNP_UNSCOREABLE.map((c) =>
        c.key === 'ownership'
          ? { ...c, label: { en: 'Ownership: at least 33⅓%', fa: 'مالکیت: دست‌کم یک‌سوم (۳۳⅓٪)' } }
          : c,
      ),
      {
        key: 'jobs',
        label: { en: 'Create at least 1 job for a citizen or PR', fa: 'ایجاد دست‌کم یک شغل برای شهروند یا مقیم دائم' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'points',
        label: { en: '150-point assessment grid', fa: 'جدول ارزیابی ۱۵۰ امتیازی' },
        weight: 2,
        scoreable: false,
        note: { en: 'No age limit; age points for 25–49.', fa: 'محدودیت سنی ندارد؛ برای ۲۵ تا ۴۹ سالگی امتیاز سنی داده می‌شود.' },
      },
      {
        key: 'operation',
        label: {
          en: 'Operate the business at least 6 months just before the final report, within 20 months of arrival',
          fa: 'ادارهٔ کسب‌وکار دست‌کم شش ماه درست پیش از گزارش نهایی، حداکثر ۲۰ ماه پس از ورود',
        },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'net-worth',
        label: { en: 'Net worth', fa: 'دارایی خالص' },
        amount: 500_000,
        currency: 'CAD',
        basis: 'once',
        shows: { en: 'Verified by KPMG or MNP.', fa: 'با تأیید KPMG یا MNP.' },
      },
      {
        key: 'investment',
        label: { en: 'Investment in your own business (CAD 150,000 outside Winnipeg Metro)', fa: 'سرمایه‌گذاری در کسب‌وکار خودتان (خارج از وینیپگ: ۱۵۰٬۰۰۰)' },
        amount: 250_000,
        currency: 'CAD',
        basis: 'once',
        shows: { en: 'Capital into your business, not a fee.', fa: 'سرمایه‌ای که وارد کسب‌وکار شما می‌شود، نه هزینه.' },
      },
    ],
    processing: {
      text: {
        en: 'MPNP targets 6 months or less after a complete application. Then IRCC: paper PNP service standard 11 months.',
        fa: 'هدف MPNP رسیدگی در شش ماه یا کمتر پس از تکمیل پرونده است. سپس IRCC: استاندارد پرونده‌های کاغذی PNP یازده ماه.',
      },
      source: 'https://immigratemanitoba.com/mpnp/bis/ep/eligibility/',
    },
    fees: [
      { label: { en: 'MPNP processing (no deposit)', fa: 'رسیدگی MPNP (بدون سپرده)' }, amount: 2_500, currency: 'CAD' },
      { label: { en: 'IRCC work permit', fa: 'مجوز کار IRCC' }, amount: 155, currency: 'CAD' },
      { label: { en: 'IRCC PR, principal applicant', fa: 'اقامت دائم IRCC، متقاضی اصلی' }, amount: 1_590, currency: 'CAD' },
    ],
    pr: PNP_PR,
    sources: [
      { url: 'https://immigratemanitoba.com/mpnp/bis/ep/eligibility/', checked: '2026-10-12', label: 'MPNP BIS Entrepreneur Pathway eligibility' },
      { url: 'https://immigratemanitoba.com/wp-content/uploads/2024/07/BIS-Entrepreneur-Stream-Guidelines-final-July-2024.pdf', checked: '2026-10-12', label: 'BIS Entrepreneur guidelines (Jul 2024)' },
    ],
    verified: true,
    review: 'Investment test uses the Winnipeg Metro threshold; the lower outside-Winnipeg threshold is in a note only.',
  },
  {
    key: 'ca-pnp-pei',
    country: 'CA',
    family: 'entrepreneur',
    name: { en: 'Prince Edward Island Work Permit Stream (Entrepreneur)', fa: 'مسیر مجوز کار جزیرهٔ پرنس ادوارد (کارآفرینی)' },
    agency: {
      en: 'PEI Office of Immigration, then IRCC',
      fa: 'دفتر مهاجرت جزیره‌ی پرنس ادوارد (PEI Office of Immigration)، سپس IRCC',
    },
    status: 'limited',
    fact: {
      en: 'Zero entrepreneur invitations in all ten 2026 draws (15 Jan to 7 Oct), against 1,319 worker invitations. Treat it as closed.',
      fa: 'در هر ده قرعهٔ ۲۰۲۶ (۱۵ ژانویه تا ۷ اکتبر) هیچ دعوت‌نامهٔ کارآفرینی صادر نشد، در برابر ۱٬۳۱۹ دعوت‌نامه برای نیروی کار. آن را بسته در نظر بگیرید.',
    },
    criteria: [
      {
        key: 'net-worth',
        label: { en: 'Net worth: CAD 600,000', fa: 'دارایی خالص: ۶۰۰٬۰۰۰ دلار کانادا' },
        weight: 3,
        scoreable: true,
        test: { field: 'netWorth', op: 'gte', value: 600_000, currency: 'CAD' },
        note: {
          en: 'Business equity counts only at 70% ownership or more, up to CAD 180,000.',
          fa: 'ارزش سهم کسب‌وکار فقط با مالکیت ۷۰٪ یا بیشتر و حداکثر تا ۱۸۰٬۰۰۰ دلار کانادا حساب می‌شود.',
        },
      },
      {
        key: 'investment',
        label: { en: 'Investment: CAD 150,000 within 12 months of landing', fa: 'سرمایه‌گذاری: ۱۵۰٬۰۰۰ دلار کانادا ظرف ۱۲ ماه پس از ورود' },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 150_000, currency: 'CAD' },
        note: {
          en: 'Plus at least CAD 75,000 of eligible operating expenses.',
          fa: 'به‌علاوهٔ دست‌کم ۷۵٬۰۰۰ دلار کانادا هزینهٔ عملیاتی واجد شرایط.',
        },
      },
      {
        key: 'language',
        label: { en: 'Language: CLB 4', fa: 'زبان: CLB ۴' },
        weight: 3,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 4 },
      },
      {
        key: 'age',
        label: { en: 'Age: 21 to 59', fa: 'سن: ۲۱ تا ۵۹ سال' },
        weight: 3,
        scoreable: true,
        test: { field: 'age', op: 'between', value: [21, 59] },
      },
      {
        key: 'education',
        label: { en: 'Education: secondary', fa: 'تحصیلات: متوسطه' },
        weight: 1,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: SECONDARY_PLUS },
      },
      {
        key: 'business-experience',
        label: { en: 'Transferable management skills', fa: 'مهارت‌های مدیریتی قابل انتقال' },
        weight: 3,
        scoreable: false,
        note: { en: 'Not quantified by the province.', fa: 'استان معیار کمّی برای آن تعیین نکرده است.' },
      },
      ...PNP_UNSCOREABLE.map((c) =>
        c.key === 'ownership'
          ? { ...c, label: { en: 'Ownership: at least 70% for business equity to count', fa: 'مالکیت: دست‌کم ۷۰٪ تا ارزش سهم کسب‌وکار حساب شود' } }
          : c,
      ),
      {
        key: 'points',
        label: { en: 'Points out of 200 (+10 if bilingual)', fa: 'امتیاز از ۲۰۰ (۱۰+ برای دوزبانه‌ها)' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'operation',
        label: { en: 'Operate the business at least 12 consecutive months', fa: 'ادارهٔ کسب‌وکار دست‌کم ۱۲ ماه پیوسته' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'net-worth',
        label: { en: 'Net worth', fa: 'دارایی خالص' },
        amount: 600_000,
        currency: 'CAD',
        basis: 'once',
        shows: { en: 'Verified by Grant Thornton or MNP.', fa: 'با تأیید Grant Thornton یا MNP.' },
      },
      {
        key: 'investment',
        label: { en: 'Investment within 12 months of landing', fa: 'سرمایه‌گذاری ظرف ۱۲ ماه پس از ورود' },
        amount: 150_000,
        currency: 'CAD',
        basis: 'once',
        shows: { en: 'Capital into your business, not a fee.', fa: 'سرمایه‌ای که وارد کسب‌وکار شما می‌شود، نه هزینه.' },
      },
      {
        key: 'operating-expenses',
        label: { en: 'Eligible operating expenses (minimum)', fa: 'هزینهٔ عملیاتی واجد شرایط (حداقل)' },
        amount: 75_000,
        currency: 'CAD',
        basis: 'once',
      },
    ],
    processing: { text: PNP_PAPER_PROCESSING, source: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/service-declaration/service-standards.html' },
    fees: [
      {
        label: {
          en: 'PEI application (fully refunded if not accepted; 7,500 refunded if declined or withdrawn before the interview)',
          fa: 'درخواست PEI (در صورت نپذیرفتن پرونده کامل بازگردانده می‌شود؛ در صورت رد یا انصراف پیش از مصاحبه ۷٬۵۰۰ بازگردانده می‌شود)',
        },
        amount: 10_000,
        currency: 'CAD',
      },
      { label: { en: 'IRCC work permit', fa: 'مجوز کار IRCC' }, amount: 155, currency: 'CAD' },
      { label: { en: 'IRCC PR, principal applicant', fa: 'اقامت دائم IRCC، متقاضی اصلی' }, amount: 1_590, currency: 'CAD' },
    ],
    pr: PNP_PR,
    sources: [
      { url: 'https://www.princeedwardisland.ca/en/information/office-of-immigration/expression-of-interest-draws', checked: '2026-10-12', label: 'PEI EOI draws' },
      { url: 'https://www.princeedwardisland.ca/en/information/office-of-immigration/work-permit-stream', checked: '2026-10-12', label: 'PEI Work Permit Stream' },
    ],
    verified: true,
    review:
      'Notes say "treat it as closed" (0 entrepreneur invitations in 2026) but the stream is not officially closed; status set to "limited". Decide whether to show it as closed. Re-check draws monthly.',
  },

  // CA-4 ------------------------------------------------------------------
  {
    key: 'ca-study-permit',
    country: 'CA',
    family: 'study',
    name: { en: 'Study permit (with PGWP as the bridge to PR)', fa: 'مجوز تحصیل (با PGWP به‌عنوان پل اقامت دائم)' },
    agency: {
      en: 'IRCC (Quebec: MIFI issues the CAQ)',
      fa: 'اداره‌ی مهاجرت کانادا (IRCC)؛ در کبک، گواهی CAQ را وزارت مهاجرت کبک (MIFI) صادر می‌کند',
    },
    status: 'open',
    fact: {
      en: 'Whether you need a provincial attestation letter (PAL) and can get one. A master’s or PhD student at a public DLI skips the PAL and the cap entirely.',
      fa: 'اینکه به نامهٔ تأیید استانی (PAL) نیاز دارید و می‌توانید آن را بگیرید یا نه. دانشجوی کارشناسی ارشد یا دکتری در یک DLI دولتی کلاً از PAL و سقف سهمیه معاف است.',
    },
    criteria: [
      {
        key: 'acceptance',
        label: { en: 'Letter of acceptance from a DLI', fa: 'نامهٔ پذیرش از یک مؤسسهٔ آموزشی تعیین‌شده (DLI)' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'pal',
        label: { en: 'Provincial or territorial attestation letter (PAL/TAL)', fa: 'نامهٔ تأیید استانی یا قلمرویی (PAL/TAL)' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Exempt: K-12; master’s and doctoral students at a public DLI (from 1 Jan 2026); exchange students paying no tuition; Global Affairs Canada scholars; some in-Canada extensions. Quebec uses the CAQ instead.',
          fa: 'معاف‌ها: دانش‌آموزان مدرسه؛ دانشجویان کارشناسی ارشد و دکتری در DLI دولتی (از ۱ ژانویهٔ ۲۰۲۶)؛ دانشجویان تبادلی بدون شهریه؛ بورسیه‌های Global Affairs Canada؛ برخی تمدیدهای داخل کانادا. کبک به‌جای آن CAQ می‌خواهد.',
        },
      },
      {
        key: 'funds',
        label: { en: 'Living costs: CAD 23,448 a year for one person', fa: 'هزینهٔ زندگی: ۲۳٬۴۴۸ دلار کانادا در سال برای یک نفر' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 23_448, currency: 'CAD' },
        note: {
          en: 'For applications on or after 1 Sep 2026, outside Quebec. First-year tuition and transport come on top; family members add more.',
          fa: 'برای درخواست‌های از ۱ سپتامبر ۲۰۲۶ به بعد، خارج از کبک. شهریهٔ سال اول و هزینهٔ سفر جداگانه اضافه می‌شود و هر عضو خانواده مبلغ را بالا می‌برد.',
        },
      },
      {
        key: 'language',
        label: { en: 'Language: no IRCC minimum for the permit (the school sets one)', fa: 'زبان: IRCC حداقلی برای مجوز تعیین نکرده است (دانشگاه تعیین می‌کند)' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'pgwp-language',
        label: { en: 'PGWP language: CLB 7 for a degree programme', fa: 'زبان PGWP: CLB ۷ برای دورهٔ دانشگاهی' },
        weight: 2,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 7 },
        note: { en: 'CLB 5 for college or non-university programmes.', fa: 'برای دوره‌های کالج یا غیردانشگاهی CLB ۵.' },
      },
      {
        key: 'pgwp-field',
        label: { en: 'PGWP field of study (non-degree programmes)', fa: 'رشتهٔ تحصیلی مورد قبول PGWP (دوره‌های غیرمدرک دانشگاهی)' },
        weight: 2,
        scoreable: false,
        note: {
          en: 'Required for non-degree programmes if the study permit was applied for on or after 1 Nov 2024. Bachelor’s, master’s and PhD are exempt.',
          fa: 'برای دوره‌های غیرمدرک دانشگاهی، اگر درخواست مجوز تحصیل از ۱ نوامبر ۲۰۲۴ به بعد ثبت شده باشد، لازم است. کارشناسی، کارشناسی ارشد و دکتری معاف‌اند.',
        },
      },
      {
        key: 'pgwp-length',
        label: { en: 'PGWP: programme of at least 8 months at a PGWP-eligible DLI', fa: 'PGWP: دورهٔ دست‌کم هشت‌ماهه در DLI واجد شرایط PGWP' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'cap',
        label: { en: 'National cap on study-permit applications', fa: 'سقف کشوری درخواست‌های مجوز تحصیل' },
        weight: 2,
        scoreable: false,
        note: {
          en: '2026: at most 309,670 applications from PAL/TAL-required students, allocated by province. PAL/TALs issued in 2026 are valid to 31 Dec 2026.',
          fa: 'سال ۲۰۲۶: حداکثر ۳۰۹٬۶۷۰ درخواست از دانشجویانی که به PAL/TAL نیاز دارند، به تفکیک استان. PAL/TALهای صادرشده در ۲۰۲۶ تا ۳۱ دسامبر ۲۰۲۶ اعتبار دارند.',
        },
      },
      {
        key: 'genuine-student',
        label: { en: 'Genuine-student assessment, ties to home country, officer discretion', fa: 'ارزیابی واقعی بودن قصد تحصیل، پیوند با کشور مبدأ و تشخیص افسر' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: familyLines(
      'living',
      { en: 'Living costs (excluding tuition and travel)', fa: 'هزینهٔ زندگی (بدون شهریه و سفر)' },
      [23_448, 29_192, 35_888, 43_572, 49_419, 55_736, 62_054],
      6_318,
      'year',
      {
        en: 'That you can pay for the first year without working in Canada, and how you will cover the rest of a longer programme. Applies outside Quebec.',
        fa: 'اینکه می‌توانید هزینهٔ سال اول را بدون کار در کانادا بپردازید و بقیهٔ دوره‌های طولانی‌تر را چگونه تأمین می‌کنید. برای خارج از کبک.',
      },
    ),
    processing: {
      text: {
        en: 'Service standard 60 days from outside Canada (81% met; 63 days actual at 30 Sep 2025). Live tool on 14 Oct 2026: Iran 16 weeks, India 7 weeks, Nigeria 10 weeks.',
        fa: 'استاندارد خدمات برای درخواست از خارج کانادا ۶۰ روز است (۸۱٪ رعایت شد؛ زمان واقعی در ۳۰ سپتامبر ۲۰۲۵: ۶۳ روز). ابزار زندهٔ IRCC در ۱۴ اکتبر ۲۰۲۶: ایران ۱۶ هفته، هند ۷ هفته، نیجریه ۱۰ هفته.',
      },
      source: 'https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-en.json',
    },
    fees: [
      { label: { en: 'Study permit', fa: 'مجوز تحصیل' }, amount: 150, currency: 'CAD' },
      { label: { en: 'Biometrics', fa: 'انگشت‌نگاری' }, amount: 85, currency: 'CAD' },
      { label: { en: 'PGWP (work permit)', fa: 'PGWP (مجوز کار)' }, amount: 155, currency: 'CAD' },
      { label: { en: 'Open work permit holder fee (PGWP)', fa: 'هزینهٔ دارندهٔ مجوز کار باز (PGWP)' }, amount: 100, currency: 'CAD' },
    ],
    pr: {
      en: 'Study → PGWP → 1 year of skilled Canadian work → Canadian Experience Class (or a PNP graduate stream).',
      fa: 'تحصیل ← PGWP ← یک سال کار ماهر در کانادا ← طبقهٔ تجربهٔ کانادایی (یا مسیر فارغ‌التحصیلان PNP).',
    },
    sources: [
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html', checked: '2026-10-15', label: 'Financial support (page date 2026-08-28)' },
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html', checked: '2026-10-15', label: 'Provincial attestation letter (page date 2026-09-02)' },
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/2026-provincial-territorial-allocations-under-international-student-cap.html', checked: '2026-10-15', label: '2026 cap allocations notice' },
      { url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html', checked: '2026-10-15', label: 'PGWP eligibility' },
      { url: 'https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-en.json', checked: '2026-10-15', label: 'IRCC processing-time data (updated 14 Oct 2026)' },
      IRCC_FEE_SOURCE,
    ],
    verified: true,
    review:
      'The 408,000 total permits target (155,000 new, 253,000 extensions) came from secondary sites quoting IRCC; not encoded, verify on canada.ca. 309,670 is confirmed. First-year tuition and transport have no fixed figure, so no money line. Quebec defers to MIFI; no figure encoded. Previous living-cost table (1 Jan 2025 to 31 Aug 2026) started at 22,895.',
  },

  // US-1 ------------------------------------------------------------------
  {
    key: 'us-eb2-niw',
    country: 'US',
    family: 'talent',
    name: { en: 'EB-2 National Interest Waiver (NIW)', fa: 'EB-2 NIW (معافیت منافع ملی)' },
    agency: {
      en: 'USCIS (I-140), then DOS or USCIS',
      fa: 'اداره‌ی خدمات شهروندی و مهاجرت آمریکا (USCIS) با فرم I-140، سپس وزارت خارجه (DOS) یا USCIS',
    },
    status: 'open',
    fact: {
      en: 'Degree gate first (a master’s, or a bachelor’s plus 5 years), then whether the national importance of your work can be shown beyond one employer. No job offer needed. For Iranian nationals, the visa ban decides it before any of this.',
      fa: 'نخست شرط مدرک (کارشناسی ارشد، یا کارشناسی همراه با پنج سال سابقه)، سپس اینکه بتوان اهمیت ملی کار شما را فراتر از سود یک کارفرما نشان داد. پیشنهاد کار لازم نیست. برای اتباع ایران، ممنوعیت ویزا پیش از همهٔ این‌ها تعیین‌کننده است.',
    },
    criteria: [
      US_TRAVEL_BAN,
      {
        key: 'advanced-degree',
        label: { en: 'Advanced degree (master’s or higher)', fa: 'مدرک پیشرفته (کارشناسی ارشد یا بالاتر)' },
        weight: 3,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: HIGHER_DEGREES },
        note: {
          en: 'Also met by a bachelor’s plus at least 5 years of progressive post-bachelor’s experience in the specialty, or by exceptional ability (3 of 6 criteria).',
          fa: 'با کارشناسی به‌علاوهٔ دست‌کم پنج سال سابقهٔ پیشرفتهٔ پس از کارشناسی در همان تخصص، یا با توانایی استثنایی (سه معیار از شش) نیز برآورده می‌شود.',
        },
      },
      {
        key: 'prong-1',
        label: { en: 'Endeavor has substantial merit and national importance', fa: 'فعالیت شما ارزش چشمگیر و اهمیت ملی دارد' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Broader implications, not one employer’s benefit. Officer judgement (Matter of Dhanasar).',
          fa: 'پیامدهای گسترده، نه فقط سود یک کارفرما. به تشخیص افسر (پروندهٔ Dhanasar).',
        },
      },
      {
        key: 'prong-2',
        label: { en: 'Well positioned to advance the endeavor', fa: 'جایگاه مناسب برای پیشبرد آن فعالیت' },
        weight: 2,
        scoreable: false,
        note: {
          en: 'Education, skills, record of success, a plan, interest from customers, users or investors.',
          fa: 'تحصیلات، مهارت‌ها، سابقهٔ موفقیت، برنامه، و علاقهٔ مشتریان، کاربران یا سرمایه‌گذاران.',
        },
      },
      {
        key: 'prong-3',
        label: { en: 'On balance, beneficial to waive the job offer and labor certification', fa: 'در مجموع، چشم‌پوشی از پیشنهاد کار و گواهی کار به سود آمریکا باشد' },
        weight: 2,
        scoreable: false,
      },
    ],
    money: [],
    processing: {
      text: {
        en: 'Premium processing: 45 business days for the I-140. Normal times not captured. After approval the case waits on the Visa Bulletin: EB-2 Rest of World final action date 1 Jan 2025 (October 2026, unverified).',
        fa: 'رسیدگی ویژه: ۴۵ روز کاری برای I-140. زمان عادی در دسترس نبود. پس از تأیید، پرونده منتظر بولتن ویزا می‌ماند: تاریخ اقدام نهایی EB-2 برای سایر کشورها ۱ ژانویهٔ ۲۰۲۵ (اکتبر ۲۰۲۶، تأییدنشده).',
      },
      source: USCIS_PREMIUM_SOURCE,
    },
    fees: I140_SELF_FEES,
    pr: {
      en: 'An approved I-140 plus a current priority date gives a green card (I-485 in the US, or an immigrant visa abroad).',
      fa: 'I-140 تأییدشده به‌همراه تاریخ اولویت جاری به گرین کارت می‌رسد (I-485 در آمریکا یا ویزای مهاجرتی در خارج).',
    },
    sources: [
      { url: 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2', checked: '2026-10-15', label: 'USCIS EB-2 (last updated 01/15/2025)' },
      { url: 'https://www.uscis.gov/policy-manual/volume-6-part-f-chapter-5', checked: '2026-10-15', label: 'USCIS Policy Manual Vol. 6, Part F, Ch. 5' },
      USCIS_FEES_SOURCE,
      { url: USCIS_PREMIUM_SOURCE, checked: '2026-10-15', label: 'USCIS premium processing' },
      { url: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-october-2026.html', checked: '2026-10-15', label: 'Visa Bulletin October 2026 (returned 403; figures from secondary sources)' },
    ],
    verified: false,
    blockedCitizenships: { codes: ['IR'], reason: US_TRAVEL_BAN.note! },
    review:
      `Visa Bulletin (EB-2 ROW FAD retrogressed from Current to 1 Jan 2025; DFF 15 Mar 2026) is secondary: travel.state.gov returned 403, read in a browser. ${USCIS_FEE_REVIEW} Degree test covers master/PhD only; bachelor + 5 years and exceptional ability are notes.`,
  },

  // US-2 ------------------------------------------------------------------
  {
    key: 'us-eb1a',
    country: 'US',
    family: 'talent',
    name: { en: 'EB-1A Extraordinary Ability', fa: 'EB-1A (توانایی فوق‌العاده)' },
    agency: {
      en: 'USCIS (I-140)',
      fa: 'اداره‌ی خدمات شهروندی و مهاجرت آمریکا (USCIS) با فرم I-140',
    },
    status: 'open',
    fact: {
      en: 'How many of the 10 criteria you can document (at least 3), then the final-merits test. Self-petition; no job offer or labor certification.',
      fa: 'تعداد معیارهایی از ده معیار که می‌توانید مستند کنید (دست‌کم سه)، سپس آزمون ارزیابی نهایی. خوددرخواستی است و پیشنهاد کار یا گواهی کار لازم ندارد.',
    },
    criteria: [
      US_TRAVEL_BAN,
      {
        key: 'criteria-count',
        label: { en: 'At least 3 of the 10 criteria', fa: 'دست‌کم سه معیار از ده معیار' },
        weight: 3,
        scoreable: true,
        test: { field: 'talentSignals', op: 'gte', value: 3 },
        note: {
          en: 'Prizes; selective memberships; published material about you; judging; original contributions of major significance; scholarly articles; artistic exhibitions; leading or critical role; high salary; commercial success in the performing arts. High salary is the weakest third criterion.',
          fa: 'جوایز؛ عضویت در انجمن‌های گزینشی؛ مطالب منتشرشده دربارهٔ شما؛ داوری کار دیگران؛ نوآوری‌های بسیار مهم؛ مقالات علمی؛ نمایش در نمایشگاه‌های هنری؛ نقش رهبری یا کلیدی؛ درآمد بالا؛ موفقیت تجاری در هنرهای نمایشی. درآمد بالا ضعیف‌ترین گزینه برای معیار سوم است.',
        },
      },
      {
        key: 'major-award',
        label: { en: 'Or: a major internationally recognised award (e.g. Pulitzer, Oscar, Olympic medal)', fa: 'یا: یک جایزهٔ بزرگ بین‌المللی (مانند پولیتزر، اسکار یا مدال المپیک)' },
        weight: 3,
        scoreable: false,
        note: { en: 'Qualifies on its own.', fa: 'به‌تنهایی کافی است.' },
      },
      {
        key: 'final-merits',
        label: { en: 'Final merits: sustained acclaim, small percentage at the top of the field', fa: 'ارزیابی نهایی: شهرت پایدار و قرار گرفتن در درصد کوچک برتر رشته' },
        weight: 3,
        scoreable: false,
        note: { en: 'Meeting 3 criteria is necessary, not sufficient.', fa: 'داشتن سه معیار لازم است، اما کافی نیست.' },
      },
      {
        key: 'continue-in-field',
        label: { en: 'Evidence you will continue working in the field', fa: 'شواهد ادامهٔ کار در همان رشته' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [],
    processing: {
      text: {
        en: 'Premium processing: 15 business days for the I-140. Normal times not captured. EB-1 Rest of World is current or near current (unverified); India and China are backlogged.',
        fa: 'رسیدگی ویژه: ۱۵ روز کاری برای I-140. زمان عادی در دسترس نبود. EB-1 برای سایر کشورها جاری یا نزدیک به جاری است (تأییدنشده)؛ هند و چین صف دارند.',
      },
      source: USCIS_PREMIUM_SOURCE,
    },
    fees: I140_SELF_FEES,
    pr: { en: 'Direct green card.', fa: 'گرین کارت مستقیم.' },
    sources: [
      { url: 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-first-preference-eb-1', checked: '2026-10-15', label: 'USCIS EB-1 (last updated 01/24/2025)' },
      USCIS_FEES_SOURCE,
      { url: USCIS_PREMIUM_SOURCE, checked: '2026-10-15', label: 'USCIS premium processing' },
    ],
    verified: false,
    blockedCitizenships: { codes: ['IR'], reason: US_TRAVEL_BAN.note! },
    review: `Visa Bulletin EB-1 (ROW current or near; India 1 Feb 2023, China 1 Jul 2023) is secondary: travel.state.gov returned 403. ${USCIS_FEE_REVIEW}`,
  },

  // US-3 ------------------------------------------------------------------
  {
    key: 'us-eb2-advanced-degree',
    country: 'US',
    family: 'talent',
    name: { en: 'EB-2 Advanced Degree or Exceptional Ability (with a job offer)', fa: 'EB-2 مدرک پیشرفته یا توانایی استثنایی (با پیشنهاد کار)' },
    agency: {
      en: 'DOL (PERM), then USCIS (I-140), then DOS or USCIS',
      fa: 'وزارت کار آمریکا (DOL) برای PERM، سپس USCIS با فرم I-140، سپس وزارت خارجه (DOS) یا USCIS',
    },
    status: 'open',
    fact: {
      en: 'You need a US employer willing to sponsor you through PERM labor certification.',
      fa: 'به کارفرمای آمریکایی نیاز دارید که حاضر باشد از طریق گواهی کار PERM حامی شما شود.',
    },
    criteria: [
      US_TRAVEL_BAN,
      {
        key: 'advanced-degree',
        label: { en: 'Advanced degree (master’s or higher), required by the job', fa: 'مدرک پیشرفته (کارشناسی ارشد یا بالاتر) که شغل آن را لازم بداند' },
        weight: 3,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: HIGHER_DEGREES },
        note: {
          en: 'Also met by a bachelor’s plus 5 years of progressive experience.',
          fa: 'با کارشناسی به‌علاوهٔ پنج سال سابقهٔ پیشرفته نیز برآورده می‌شود.',
        },
      },
      {
        key: 'exceptional-ability',
        label: { en: 'Or: exceptional ability, 3 of 6 criteria', fa: 'یا: توانایی استثنایی، سه معیار از شش' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Degree or diploma in the field; at least 10 years full-time experience (employer letters); licence or certification; salary showing expertise; professional memberships; recognition by peers, government or organisations.',
          fa: 'مدرک یا دیپلم در همان رشته؛ دست‌کم ده سال سابقهٔ تمام‌وقت (نامهٔ کارفرما)؛ پروانه یا گواهی حرفه‌ای؛ درآمدی که نشان‌دهندهٔ تخصص باشد؛ عضویت حرفه‌ای؛ شناخته شدن از سوی همتایان، دولت یا سازمان‌ها.',
        },
      },
      {
        key: 'job-offer',
        label: { en: 'Permanent US job offer from a sponsoring employer', fa: 'پیشنهاد کار دائم از کارفرمای آمریکایی حامی' },
        weight: 3,
        scoreable: true,
        test: { field: 'jobOffer', op: 'true' },
      },
      {
        key: 'labor-certification',
        label: { en: 'Approved PERM labor certification (unless Schedule A)', fa: 'گواهی کار PERM تأییدشده (مگر در فهرست Schedule A)' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'DOL labor-market test, prevailing wage and the employer’s ability to pay are outside the profile.',
          fa: 'آزمون بازار کار وزارت کار، دستمزد رایج و توان پرداخت کارفرما از روی پروفایل قابل سنجش نیست.',
        },
      },
      {
        key: 'priority-date',
        label: { en: 'All job requirements met as of the priority date', fa: 'همهٔ شرایط شغل تا تاریخ اولویت برآورده شده باشد' },
        weight: 2,
        scoreable: false,
      },
    ],
    money: [],
    processing: {
      text: {
        en: 'Premium processing: 15 business days for the I-140. DOL PERM times (flag.dol.gov) not captured. Then the Visa Bulletin: EB-2 Rest of World final action date 1 Jan 2025 (unverified).',
        fa: 'رسیدگی ویژه: ۱۵ روز کاری برای I-140. زمان PERM وزارت کار (flag.dol.gov) در دسترس نبود. سپس بولتن ویزا: تاریخ اقدام نهایی EB-2 برای سایر کشورها ۱ ژانویهٔ ۲۰۲۵ (تأییدنشده).',
      },
      source: USCIS_PREMIUM_SOURCE,
    },
    fees: [
      { label: { en: 'I-140 (paper; 665 online), paid by the employer', fa: 'فرم I-140 (کاغذی؛ آنلاین ۶۶۵)، پرداخت توسط کارفرما' }, amount: 715, currency: 'USD' },
      { label: { en: 'Asylum Program Fee (regular employer; 300 small employer, 0 nonprofit)', fa: 'هزینهٔ برنامهٔ پناهندگی (کارفرمای عادی؛ کارفرمای کوچک ۳۰۰، غیرانتفاعی صفر)' }, amount: 600, currency: 'USD' },
      { label: { en: 'I-907 premium processing (optional)', fa: 'رسیدگی ویژهٔ I-907 (اختیاری)' }, amount: 2_965, currency: 'USD' },
      { label: { en: 'I-485, age 14+ (paper; 1,390 online)', fa: 'فرم I-485، ۱۴ سال به بالا (کاغذی؛ آنلاین ۱٬۳۹۰)' }, amount: 1_440, currency: 'USD' },
    ],
    pr: {
      en: 'PERM → I-140 → green card when the priority date is current.',
      fa: 'PERM ← I-140 ← گرین کارت پس از جاری شدن تاریخ اولویت.',
    },
    sources: [
      { url: 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2', checked: '2026-10-15', label: 'USCIS EB-2 (last updated 01/15/2025)' },
      USCIS_FEES_SOURCE,
      { url: USCIS_PREMIUM_SOURCE, checked: '2026-10-15', label: 'USCIS premium processing' },
    ],
    verified: false,
    blockedCitizenships: { codes: ['IR'], reason: US_TRAVEL_BAN.note! },
    review: `Visa Bulletin EB-2 ROW figure is secondary (travel.state.gov 403). PERM times not captured. The rule that the worker may not pay PERM costs is a DOL rule not on the cited page. ${USCIS_FEE_REVIEW}`,
  },

  // US-4 ------------------------------------------------------------------
  {
    key: 'us-o1a',
    country: 'US',
    family: 'talent',
    name: { en: 'O-1A Extraordinary Ability (temporary)', fa: 'O-1A (توانایی فوق‌العاده، موقت)' },
    agency: {
      en: 'USCIS (I-129), visa at a US consulate',
      fa: 'اداره‌ی خدمات شهروندی و مهاجرت آمریکا (USCIS) با فرم I-129؛ ویزا در کنسولگری آمریکا',
    },
    status: 'open',
    fact: {
      en: 'At least 3 of 8 criteria and a US petitioner or agent. You cannot self-petition.',
      fa: 'دست‌کم سه معیار از هشت معیار و یک درخواست‌دهنده یا نمایندهٔ آمریکایی. خوددرخواستی ممکن نیست.',
    },
    criteria: [
      US_TRAVEL_BAN,
      {
        key: 'criteria-count',
        label: { en: 'At least 3 of the 8 criteria', fa: 'دست‌کم سه معیار از هشت معیار' },
        weight: 3,
        scoreable: true,
        test: { field: 'talentSignals', op: 'gte', value: 3 },
        note: {
          en: '8 CFR 214.2(o)(3)(iii)(B): prizes; selective memberships; published material about you; judging; original contributions of major significance; scholarly authorship; critical or essential role; high salary.',
          fa: 'بند 8 CFR 214.2(o)(3)(iii)(B): جوایز؛ عضویت گزینشی؛ مطالب منتشرشده دربارهٔ شما؛ داوری؛ نوآوری‌های بسیار مهم؛ تألیف علمی؛ نقش کلیدی یا اساسی؛ درآمد بالا.',
        },
      },
      {
        key: 'major-award',
        label: { en: 'Or: a major internationally recognised award (e.g. Nobel)', fa: 'یا: یک جایزهٔ بزرگ بین‌المللی (مانند نوبل)' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'petitioner',
        label: { en: 'US employer, US agent, or foreign employer through a US agent', fa: 'کارفرمای آمریکایی، نمایندهٔ آمریکایی، یا کارفرمای خارجی از طریق نمایندهٔ آمریکایی' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'consultation',
        label: { en: 'Written advisory opinion from a peer group or expert', fa: 'نظر مشورتی کتبی از گروه همتا یا کارشناس' },
        weight: 2,
        scoreable: false,
        note: { en: 'Can be waived if none exists.', fa: 'اگر چنین گروهی وجود نداشته باشد، قابل چشم‌پوشی است.' },
      },
      {
        key: 'comparable-evidence',
        label: { en: 'Comparable evidence, if the criteria do not readily apply', fa: 'شواهد هم‌ارز، اگر معیارها مستقیماً صدق نکنند' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'top-of-field',
        label: { en: 'Small percentage at the very top of the field, sustained acclaim', fa: 'درصد کوچک برتر رشته و شهرت پایدار' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [],
    processing: {
      text: {
        en: 'Premium processing: 15 business days. Initial stay up to 3 years; extensions in steps of up to 1 year, with no total cap.',
        fa: 'رسیدگی ویژه: ۱۵ روز کاری. اقامت اولیه حداکثر سه سال؛ تمدید در دوره‌های حداکثر یک‌ساله، بدون سقف کلی.',
      },
      source: USCIS_PREMIUM_SOURCE,
    },
    fees: [
      { label: { en: 'I-129, O classification (paper; 1,005 online; 530 small employer or nonprofit)', fa: 'فرم I-129، طبقهٔ O (کاغذی؛ آنلاین ۱٬۰۰۵؛ کارفرمای کوچک یا غیرانتفاعی ۵۳۰)' }, amount: 1_055, currency: 'USD' },
      { label: { en: 'Asylum Program Fee (regular; 300 small employer, 0 nonprofit)', fa: 'هزینهٔ برنامهٔ پناهندگی (عادی؛ کارفرمای کوچک ۳۰۰، غیرانتفاعی صفر)' }, amount: 600, currency: 'USD' },
      { label: { en: 'I-907 premium processing (optional)', fa: 'رسیدگی ویژهٔ I-907 (اختیاری)' }, amount: 2_965, currency: 'USD' },
    ],
    pr: {
      en: 'No built-in path. The common next step is EB-1A, since the same evidence maps onto it.',
      fa: 'مسیر مستقیمی به اقامت دائم ندارد. گام رایج بعدی EB-1A است، چون همان مدارک برای آن هم به کار می‌آید.',
    },
    sources: [
      { url: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement', checked: '2026-10-15', label: 'USCIS O-1 (last updated 03/03/2023)' },
      { url: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.2', checked: '2026-10-15', label: 'eCFR 8 CFR 214.2(o)' },
      USCIS_FEES_SOURCE,
      { url: USCIS_PREMIUM_SOURCE, checked: '2026-10-15', label: 'USCIS premium processing' },
    ],
    verified: true,
    blockedCitizenships: { codes: ['IR'], reason: US_TRAVEL_BAN.note! },
    review: `DOS visa (MRV) fee not captured (travel.state.gov 403), so not listed. ${USCIS_FEE_REVIEW}`,
  },

  // US-5 ------------------------------------------------------------------
  {
    key: 'us-f1',
    country: 'US',
    family: 'study',
    name: { en: 'F-1 student visa', fa: 'ویزای دانشجویی F-1' },
    agency: {
      en: 'SEVP/ICE, the school (I-20), DOS (visa), CBP (admission)',
      fa: 'SEVP/ICE؛ دانشگاه یا مدرسه (فرم I-20)؛ وزارت خارجه (DOS) برای ویزا؛ گمرک و حفاظت مرزی (CBP) برای ورود',
    },
    status: 'open',
    fact: {
      en: 'Funds covering the full amount on your I-20, plus a credible intent to return home. For Iranian nationals, the visa ban applies.',
      fa: 'تمکن مالی برابر کل مبلغ مندرج در I-20 و قصد قابل‌قبول بازگشت به کشور. برای اتباع ایران، ممنوعیت ویزا اعمال می‌شود.',
    },
    criteria: [
      US_TRAVEL_BAN,
      {
        key: 'admission-i20',
        label: { en: 'Admission and an I-20 from a SEVP-certified school', fa: 'پذیرش و فرم I-20 از مدرسه یا دانشگاه دارای تأیید SEVP' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'funds',
        label: { en: 'Funds equal to the amount on the I-20', fa: 'تمکن مالی برابر مبلغ مندرج در I-20' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'The school sets the figure (tuition, living, books, travel), normally for the first academic year. There is no federal dollar amount: ask for the I-20 amount rather than estimate one.',
          fa: 'مبلغ را دانشگاه تعیین می‌کند (شهریه، زندگی، کتاب، سفر)، معمولاً برای سال تحصیلی اول. رقم فدرالی وجود ندارد؛ مبلغ I-20 را از کاربر بپرسید و تخمین نزنید.',
        },
      },
      {
        key: 'full-course',
        label: { en: 'Full course of study', fa: 'تحصیل تمام‌وقت' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'nonimmigrant-intent',
        label: { en: 'Non-immigrant intent: residence abroad not abandoned', fa: 'قصد غیرمهاجرتی: اقامتگاه در خارج از آمریکا رها نشده باشد' },
        weight: 3,
        scoreable: false,
        note: { en: 'Decided at the consular interview (INA 214(b)).', fa: 'در مصاحبهٔ کنسولی تعیین می‌شود (بند 214(b) قانون مهاجرت).' },
      },
      {
        key: 'language',
        label: { en: 'Language: set by the school; no federal minimum', fa: 'زبان: دانشگاه تعیین می‌کند؛ حداقل فدرالی ندارد' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [],
    processing: {
      text: {
        en: 'Visa wait times vary by consulate (not captured). OPT premium processing: 30 business days.',
        fa: 'زمان انتظار ویزا به سفارت بستگی دارد (در دسترس نبود). رسیدگی ویژهٔ OPT: ۳۰ روز کاری.',
      },
      source: USCIS_PREMIUM_SOURCE,
    },
    fees: [{ label: { en: 'SEVIS I-901', fa: 'هزینهٔ SEVIS (فرم I-901)' }, amount: 350, currency: 'USD' }],
    pr: {
      en: 'No direct path. OPT (12 months, plus a 24-month STEM extension) leads to H-1B, O-1 or EB-2/NIW.',
      fa: 'مسیر مستقیمی ندارد. OPT (دوازده ماه، به‌علاوهٔ تمدید ۲۴ ماههٔ STEM) به H-1B، O-1 یا EB-2/NIW می‌رسد.',
    },
    sources: [
      { url: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.2', checked: '2026-10-15', label: 'eCFR 8 CFR 214.2(f)' },
      { url: 'https://studyinthestates.dhs.gov/students/prepare/financial-ability', checked: '2026-10-15', label: 'Study in the States: financial ability (updated 25 May 2023)' },
      { url: 'https://www.ice.gov/sevis/i901', checked: '2026-10-15', label: 'ICE SEVIS I-901 fee (updated 12/10/2024)' },
    ],
    verified: true,
    blockedCitizenships: { codes: ['IR'], reason: US_TRAVEL_BAN.note! },
    review:
      'No money line: the amount is whatever the I-20 says (no fixed figure). DOS MRV fee (185) and the H.R. 1 USD 250 Visa Integrity Fee could not be read on travel.state.gov (403); not listed. eCFR now says F-1 students are "admitted for a fixed period" (up to the I-20 programme, 4-year maximum, plus 30 days): confirm the Federal Register effective date before publishing.',
  },

  // US-6 ------------------------------------------------------------------
  {
    key: 'us-international-entrepreneur-rule',
    country: 'US',
    family: 'startup',
    name: { en: 'International Entrepreneur Parole (International Entrepreneur Rule)', fa: 'پارول کارآفرین بین‌المللی (قانون کارآفرین بین‌المللی)' },
    agency: {
      en: 'USCIS (I-941); CBP grants parole at the port of entry',
      fa: 'USCIS با فرم I-941؛ گمرک و حفاظت مرزی (CBP) پارول را در محل ورود می‌دهد',
    },
    status: 'limited',
    fact: {
      en: 'The US has no startup visa. This parole needs USD 311,071 from qualified US investors within 18 months (or USD 124,429 in government grants). Without it the route does not exist. Approvals are discretionary and few.',
      fa: 'آمریکا ویزای استارتاپ ندارد. این پارول به ۳۱۱٬۰۷۱ دلار سرمایه از سرمایه‌گذاران واجد شرایط آمریکایی ظرف ۱۸ ماه (یا ۱۲۴٬۴۲۹ دلار کمک‌هزینهٔ دولتی) نیاز دارد. بدون آن، این مسیر وجود ندارد. تأییدها اختیاری و انگشت‌شمارند.',
    },
    criteria: [
      US_TRAVEL_BAN,
      {
        key: 'funding',
        label: {
          en: 'Qualified US investment ≥ USD 311,071, or government grants ≥ USD 124,429, within 18 months',
          fa: 'سرمایه‌گذاری واجد شرایط آمریکایی دست‌کم ۳۱۱٬۰۷۱ دلار، یا کمک‌هزینهٔ دولتی دست‌کم ۱۲۴٬۴۲۹ دلار، ظرف ۱۸ ماه',
        },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Raised by the company, not personal funds. Partial funding plus "reliable and compelling" alternative evidence may also qualify.',
          fa: 'این مبلغ را شرکت جذب می‌کند، نه از دارایی شخصی. تأمین بخشی از آن همراه با شواهد جایگزین «قابل اتکا و قانع‌کننده» نیز ممکن است پذیرفته شود.',
        },
      },
      {
        key: 'ownership',
        label: { en: 'Ownership: at least 10% at the initial grant', fa: 'مالکیت: دست‌کم ۱۰٪ در زمان صدور اولیه' },
        weight: 3,
        scoreable: false,
        note: { en: 'At least 5% at re-parole.', fa: 'هنگام تمدید پارول دست‌کم ۵٪.' },
      },
      {
        key: 'role',
        label: { en: 'Central and active role in the startup', fa: 'نقش محوری و فعال در استارتاپ' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'company-age',
        label: { en: 'US entity formed within 5 years before filing', fa: 'شرکت آمریکایی که در پنج سال پیش از درخواست تأسیس شده باشد' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'founders',
        label: { en: 'At most 3 entrepreneurs per startup', fa: 'حداکثر سه کارآفرین برای هر استارتاپ' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'household-income',
        label: { en: 'Household income above 400% of the federal poverty line', fa: 'درآمد خانوار بیش از ۴۰۰٪ خط فقر فدرال' },
        weight: 1,
        scoreable: false,
        note: { en: 'From the regulation; not on the USCIS summary page.', fa: 'برگرفته از متن مقررات؛ در صفحهٔ خلاصهٔ USCIS نیامده است.' },
      },
      {
        key: 'public-benefit',
        label: { en: 'Significant public benefit (USCIS discretion)', fa: 'منفعت عمومی قابل‌توجه (به تشخیص USCIS)' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'qualified-investment',
        label: { en: 'Qualified US investor investment in the company', fa: 'سرمایه‌گذاری سرمایه‌گذاران واجد شرایط آمریکایی در شرکت' },
        amount: 311_071,
        currency: 'USD',
        basis: 'once',
        shows: { en: 'Raised by the company within 18 months before filing; not personal funds.', fa: 'ظرف ۱۸ ماه پیش از درخواست توسط شرکت جذب شده باشد؛ نه دارایی شخصی.' },
      },
      {
        key: 'government-grants',
        label: { en: 'Or: government grants or awards to the company', fa: 'یا: کمک‌هزینه یا جایزهٔ دولتی به شرکت' },
        amount: 124_429,
        currency: 'USD',
        basis: 'once',
        shows: { en: 'Received by the company within 18 months before filing.', fa: 'ظرف ۱۸ ماه پیش از درخواست به شرکت رسیده باشد.' },
      },
      {
        key: 're-parole',
        label: {
          en: 'Re-parole (another 2.5 years, 5 maximum): investment or grants, or US revenue with ≥20% annual growth; or ≥5 qualified jobs instead',
          fa: 'تمدید پارول (۲٫۵ سال دیگر، حداکثر ۵ سال): سرمایه یا کمک‌هزینه، یا درآمد در آمریکا با رشد سالانهٔ دست‌کم ۲۰٪؛ یا به‌جای آن دست‌کم پنج شغل واجد شرایط',
        },
        amount: 622_142,
        currency: 'USD',
        basis: 'once',
      },
    ],
    processing: {
      text: { en: 'Not published.', fa: 'منتشر نشده است.' },
      source: 'https://www.uscis.gov/working-in-the-united-states/international-entrepreneur-rule',
    },
    fees: [
      { label: { en: 'I-941 (plus the H.R. 1 Immigration Parole Fee if approved)', fa: 'فرم I-941 (به‌علاوهٔ هزینهٔ پارول قانون H.R. 1 در صورت تأیید)' }, amount: 1_200, currency: 'USD' },
    ],
    pr: {
      en: 'None: parole is not a status. Usual exits are EB-1A, EB-2 NIW, O-1 or EB-5.',
      fa: 'ندارد: پارول وضعیت اقامتی نیست. راه‌های معمول ادامه EB-1A، EB-2 NIW، O-1 یا EB-5 است.',
    },
    sources: [
      { url: 'https://www.uscis.gov/working-in-the-united-states/international-entrepreneur-rule', checked: '2026-10-15', label: 'USCIS International Entrepreneur Rule (last updated 01/25/2025)' },
      { url: 'https://www.uscis.gov/i-941', checked: '2026-10-15', label: 'USCIS I-941 (last updated 06/01/2026)' },
      USCIS_FEES_SOURCE,
    ],
    verified: false,
    blockedCitizenships: { codes: ['IR'], reason: US_TRAVEL_BAN.note! },
    review:
      `Household income >400% FPL is marked [verify in 8 CFR 212.19]. I-941 Immigration Parole Fee amount is ambiguous in the G-1055 extract ("Online: $1,020, if USCIS notifies you of conditional approval"): verify on the fee calculator; not listed. Company-age rule (5 years) is from the regulation, not the summary page. ${USCIS_FEE_REVIEW} No criterion is scoreable: no profile field covers company-raised investment or ownership share.`,
  },
];
