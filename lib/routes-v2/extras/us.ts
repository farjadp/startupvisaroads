// United States: route depth (v3) and country profile. Research 2026-10-27,
// see docs/research/app-v3/us.md. Every figure was read on the official page
// cited next to it on 2026-10-27. The International Entrepreneur Rule
// notebook (4a145981-…) was used for leads only. travel.state.gov (Visa
// Bulletin, DS-160, dual nationality) sits behind a Cloudflare challenge:
// links to it are given as the place a step is done, never as a figure source.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const CHECKED = '2026-10-27';

const G1055 = 'https://www.uscis.gov/g-1055'; // edition 10/16/26, PDF read in full
const DOS_FEES = 'https://www.ecfr.gov/current/title-22/chapter-I/subchapter-C/part-22/section-22.1'; // 22 CFR 22.1, eCFR current to 2026-10-23
const PREMIUM = 'https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing'; // last updated 03/23/2026
const EB2 = 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2';
const EB1 = 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-first-preference-eb-1';
const IER = 'https://www.uscis.gov/working-in-the-united-states/international-entrepreneur-rule';
const IER_CFR = 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-212/section-212.19';
const P10998 = 'https://www.federalregister.gov/documents/2025/12/19/2025-23570/restricting-and-limiting-the-entry-of-foreign-nationals-to-protect-the-security-of-the-united-states';
const HOLD_ORDER = 'https://www.uscis.gov/newsroom/alerts/recent-court-order-on-hold-policies';
const NATZ = 'https://www.uscis.gov/citizenship/learn-about-citizenship/citizenship-and-naturalization/i-am-a-lawful-permanent-resident-of-5-years';
const DUAL = 'https://www.usa.gov/dual-citizenship';
const PERM_TIMES = 'https://flag.dol.gov/processingtimes';
const PERM_PAY = 'https://www.ecfr.gov/current/title-20/chapter-V/part-656/subpart-A/section-656.12';
const IER_NOTEBOOK = '4a145981-e27d-4313-b504-5c64700236c2';

/** Green card routes: citizenship five years after the green card, not after arrival. */
const GREEN_CARD_TIMELINE: Timeline = {
  citizenshipAfterYears: 5,
  dualCitizenship: 'allowed',
  language: {
    en: 'Basic English (read, write, speak) and a civics test at naturalization.',
    fa: 'هنگام درخواست تابعیت: انگلیسی پایه (خواندن، نوشتن، صحبت) و آزمون مدنی.',
  },
  note: {
    en: 'The route itself ends in a green card; the wait is the Visa Bulletin queue, not a residence period. Citizenship: 5 years as a permanent resident, 30 months physically present. US law does not make you choose one nationality; whether you keep the other one depends on that country.',
    fa: 'خود این مسیر به گرین کارت می‌رسد؛ انتظار، صف بولتن ویزاست نه دورهٔ اقامت. تابعیت: پنج سال اقامت دائم با دست‌کم ۳۰ ماه حضور فیزیکی. قانون آمریکا شما را به انتخاب یک تابعیت وادار نمی‌کند؛ ماندن تابعیت دیگر به قانون همان کشور بستگی دارد.',
  },
  source: NATZ,
};

const TEMP_TIMELINE = (en: string, fa: string): Timeline => ({
  dualCitizenship: 'allowed',
  language: {
    en: 'Basic English and a civics test at naturalization, once you hold a green card.',
    fa: 'انگلیسی پایه و آزمون مدنی هنگام درخواست تابعیت، پس از گرفتن گرین کارت.',
  },
  note: { en, fa },
  source: NATZ,
});

/** Proclamation 10998, stated from the text (sections 2, 6 and 10). */
const BAN_REALITY = {
  key: 'proclamation-10998',
  kind: 'challenge' as const,
  title: { en: 'Proclamation 10998: entry suspended for Iranian nationals', fa: 'اعلامیهٔ ۱۰۹۹۸: توقف ورود اتباع ایران' },
  detail: {
    en: 'Since 1 January 2026 entry of Iranian nationals as immigrants and non-immigrants is fully suspended. It applies to people who were outside the US on that date and held no valid visa. Exceptions in the text: green-card holders, dual nationals travelling on a non-listed passport, certain diplomatic visas, athletes at major events, and immigrant visas for persecuted ethnic and religious minorities from Iran.',
    fa: 'از ۱ ژانویهٔ ۲۰۲۶ ورود اتباع ایران با ویزای مهاجرتی و غیرمهاجرتی به‌طور کامل متوقف است. این توقف شامل کسانی است که در آن تاریخ بیرون از آمریکا بودند و ویزای معتبر نداشتند. استثناهای متن: دارندگان گرین کارت، دوتابعیتی‌هایی که با گذرنامهٔ کشوری غیرمشمول سفر می‌کنند، برخی ویزاهای دیپلماتیک، ورزشکاران رویدادهای بزرگ، و ویزای مهاجرتی اقلیت‌های قومی و مذهبی تحت آزار در ایران.',
  },
  source: P10998,
};

const INSIDE_US_REALITY = {
  key: 'inside-us',
  kind: 'tip' as const,
  title: { en: 'Already in the US? The entry ban is not the whole story', fa: 'اگر در آمریکا هستید، ممنوعیت ورود همهٔ ماجرا نیست' },
  detail: {
    en: 'The proclamation restricts entry, not filings made inside the US. USCIS memos that put those filings on hold were enjoined by a federal court on 24 August 2026 and USCIS says it is deciding them in the normal course while litigation continues. Check the USCIS alert before you file.',
    fa: 'اعلامیه ورود را محدود می‌کند، نه درخواست‌هایی را که از داخل آمریکا ثبت می‌شوند. دادگاه فدرال در ۲۴ اوت ۲۰۲۶ بخشنامه‌های USCIS را که این پرونده‌ها را متوقف کرده بود از اجرا بازداشت و USCIS می‌گوید فعلاً آن‌ها را به روال عادی بررسی می‌کند، اما دعوا ادامه دارد. پیش از ثبت، اطلاعیهٔ USCIS را ببینید.',
  },
  source: HOLD_ORDER,
};

// Fees shared by the self-petitioned green card routes (G-1055, edition 10/16/26).
const SELF_PETITION_FUNDS = [
  { key: 'i140', label: { en: 'Form I-140 (paper; 665 online)', fa: 'فرم I-140 (کاغذی؛ آنلاین ۶۶۵)' }, amount: 715, currency: 'USD' as const, basis: 'once' as const, per: 'person' as const, kind: 'spend' as const, source: G1055 },
  { key: 'asylum-fee', label: { en: 'Asylum Program Fee (self-petitioner)', fa: 'هزینهٔ برنامهٔ پناهندگی (خوددرخواست‌دهنده)' }, amount: 300, currency: 'USD' as const, basis: 'once' as const, per: 'person' as const, kind: 'spend' as const, source: G1055 },
  { key: 'premium', label: { en: 'I-907 premium processing (optional)', fa: 'رسیدگی ویژه با فرم I-907 (اختیاری)' }, amount: 2_965, currency: 'USD' as const, basis: 'once' as const, per: 'person' as const, kind: 'spend' as const, source: G1055 },
];

const GREEN_CARD_STAGE_FUNDS = [
  { key: 'i485', label: { en: 'In the US: I-485, age 14+ (paper; 1,390 online)', fa: 'داخل آمریکا: فرم I-485، ۱۴ سال به بالا (کاغذی؛ آنلاین ۱٬۳۹۰)' }, amount: 1_440, currency: 'USD' as const, basis: 'once' as const, per: 'person' as const, kind: 'spend' as const, source: G1055 },
  { key: 'i485-spouse', label: { en: 'In the US: I-485 for the spouse', fa: 'داخل آمریکا: فرم I-485 برای همسر' }, amount: 1_440, currency: 'USD' as const, basis: 'once' as const, per: 'spouse' as const, kind: 'spend' as const, source: G1055 },
  { key: 'i485-child', label: { en: 'In the US: I-485, child under 14 filing with a parent (paper; 900 online)', fa: 'داخل آمریکا: فرم I-485، فرزند زیر ۱۴ سال همراه والد (کاغذی؛ آنلاین ۹۰۰)' }, amount: 950, currency: 'USD' as const, basis: 'once' as const, per: 'child' as const, kind: 'spend' as const, source: G1055 },
  { key: 'iv-fee', label: { en: 'Abroad: immigrant visa fee, employment-based', fa: 'خارج از آمریکا: هزینهٔ ویزای مهاجرتی شغلی' }, amount: 345, currency: 'USD' as const, basis: 'once' as const, per: 'person' as const, kind: 'spend' as const, source: DOS_FEES },
  { key: 'uscis-immigrant-fee', label: { en: 'Abroad: USCIS Immigrant Fee before travel', fa: 'خارج از آمریکا: هزینهٔ مهاجرتی USCIS پیش از سفر' }, amount: 235, currency: 'USD' as const, basis: 'once' as const, per: 'person' as const, kind: 'spend' as const, source: G1055 },
  { key: 'iv-fee-spouse', label: { en: 'Abroad: immigrant visa fee, employment-based, spouse', fa: 'خارج از آمریکا: هزینهٔ ویزای مهاجرتی شغلی، همسر' }, amount: 345, currency: 'USD' as const, basis: 'once' as const, per: 'spouse' as const, kind: 'spend' as const, source: DOS_FEES },
  { key: 'uscis-immigrant-fee-spouse', label: { en: 'Abroad: USCIS Immigrant Fee before travel, spouse', fa: 'خارج از آمریکا: هزینهٔ مهاجرتی USCIS پیش از سفر، همسر' }, amount: 235, currency: 'USD' as const, basis: 'once' as const, per: 'spouse' as const, kind: 'spend' as const, source: G1055 },
  { key: 'iv-fee-child', label: { en: 'Abroad: immigrant visa fee, employment-based, each child', fa: 'خارج از آمریکا: هزینهٔ ویزای مهاجرتی شغلی، هر فرزند' }, amount: 345, currency: 'USD' as const, basis: 'once' as const, per: 'child' as const, kind: 'spend' as const, source: DOS_FEES },
  { key: 'uscis-immigrant-fee-child', label: { en: 'Abroad: USCIS Immigrant Fee before travel, each child', fa: 'خارج از آمریکا: هزینهٔ مهاجرتی USCIS پیش از سفر، هر فرزند' }, amount: 235, currency: 'USD' as const, basis: 'once' as const, per: 'child' as const, kind: 'spend' as const, source: G1055 },
];

const GREEN_CARD_STEPS_TAIL = [
  {
    key: 'visa-bulletin',
    title: { en: 'Wait for your priority date', fa: 'منتظر جاری شدن تاریخ اولویت بمانید' },
    detail: {
      en: 'Your priority date is the I-140 filing date (or the PERM filing date). Each month the Visa Bulletin shows which dates can move forward for your category and country of birth.',
      fa: 'تاریخ اولویت شما تاریخ ثبت I-140 (یا تاریخ ثبت PERM) است. بولتن ویزا هر ماه نشان می‌دهد کدام تاریخ‌ها در رده و کشور تولد شما جلو می‌روند.',
    },
    link: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html',
  },
  {
    key: 'adjust-or-consular',
    title: { en: 'File for the green card: I-485 in the US, or the immigrant visa abroad', fa: 'درخواست گرین کارت: I-485 در آمریکا یا ویزای مهاجرتی در خارج' },
    detail: {
      en: 'Inside the US in a valid status you file Form I-485 with USCIS. Outside, the case moves to the National Visa Center and an interview at a US consulate.',
      fa: 'اگر با وضعیت معتبر در آمریکا هستید، فرم I-485 را نزد USCIS ثبت می‌کنید. اگر بیرون هستید، پرونده به مرکز ملی ویزا (NVC) و مصاحبه در کنسولگری آمریکا می‌رود.',
    },
    link: 'https://www.uscis.gov/i-485',
  },
  {
    key: 'biometrics',
    title: { en: 'Biometrics, medical exam, interview', fa: 'انگشت‌نگاری، معاینهٔ پزشکی و مصاحبه' },
    detail: {
      en: 'Every family member gives biometrics and a medical exam (Form I-693 in the US, a panel physician abroad).',
      fa: 'همهٔ اعضای خانواده انگشت‌نگاری و معاینهٔ پزشکی می‌دهند (در آمریکا فرم I-693، در خارج پزشک معتمد سفارت).',
    },
    link: 'https://www.uscis.gov/i-693',
  },
];

const BASE_GC_DOCS = [
  { key: 'passport', label: { en: 'Passport and birth certificate (each family member)', fa: 'گذرنامه و شناسنامه (همهٔ اعضای خانواده)' }, stage: 'visa' as const },
  { key: 'marriage', label: { en: 'Marriage certificate, if your spouse is included', fa: 'سند ازدواج، اگر همسر همراه است' }, stage: 'visa' as const },
  { key: 'translations', label: { en: 'Certified English translations of every foreign-language document', fa: 'ترجمهٔ رسمی انگلیسی همهٔ مدارک غیرانگلیسی' }, stage: 'apply' as const },
];

export const EXTRAS_US: Record<string, RouteExtras> = {
  // ---------------------------------------------------------------- EB-2 NIW
  'us-eb2-niw': {
    funds: [...SELF_PETITION_FUNDS, ...GREEN_CARD_STAGE_FUNDS],
    steps: [
      {
        key: 'degree',
        title: { en: 'Check the degree gate', fa: 'شرط مدرک را بسنجید' },
        detail: {
          en: 'A US master’s or higher (or foreign equivalent), or a bachelor’s plus 5 years of progressive experience in the specialty, or exceptional ability (3 of 6 criteria).',
          fa: 'کارشناسی ارشد آمریکایی یا بالاتر (یا معادل خارجی آن)، یا کارشناسی همراه با پنج سال سابقهٔ پیشرفته در همان تخصص، یا توانایی استثنایی (سه معیار از شش).',
        },
        link: EB2,
      },
      {
        key: 'three-prongs',
        title: { en: 'Build the case on the three prongs', fa: 'پرونده را بر سه شرط بنا کنید' },
        detail: {
          en: 'Show that the endeavor has substantial merit and national importance, that you are well positioned to advance it, and that on balance waiving the job offer and labor certification benefits the US.',
          fa: 'نشان دهید که فعالیت شما ارزش چشمگیر و اهمیت ملی دارد، شما جایگاه مناسبی برای پیشبردش دارید، و در مجموع چشم‌پوشی از پیشنهاد کار و گواهی کار به سود آمریکاست.',
        },
        link: 'https://www.uscis.gov/policy-manual/volume-6-part-f-chapter-5',
      },
      {
        key: 'i140',
        title: { en: 'File Form I-140 yourself', fa: 'فرم I-140 را خودتان ثبت کنید' },
        detail: {
          en: 'Self-petition with the evidence. Premium processing (Form I-907) gives a decision clock of 45 business days for NIW; it buys speed, not approval.',
          fa: 'خوددرخواستی همراه با مدارک. رسیدگی ویژه (فرم I-907) برای NIW مهلت تصمیم ۴۵ روز کاری دارد؛ سرعت می‌خرد، نه تأیید.',
        },
        takes: { en: 'Premium: 45 business days', fa: 'رسیدگی ویژه: ۴۵ روز کاری' },
        link: 'https://www.uscis.gov/i-140',
      },
      ...GREEN_CARD_STEPS_TAIL,
    ],
    documents: [
      { key: 'i140', label: { en: 'Form I-140, signed', fa: 'فرم I-140 امضاشده' }, stage: 'apply' },
      { key: 'eta9089', label: { en: 'Form ETA-9089 with Appendix A (national interest waiver)', fa: 'فرم ETA-9089 همراه با پیوست A (معافیت منافع ملی)' }, note: { en: 'Listed on the USCIS EB-2 page for NIW petitions.', fa: 'در صفحهٔ EB-2 سایت USCIS برای درخواست‌های NIW آمده است.' }, stage: 'apply' },
      { key: 'degree', label: { en: 'Degree certificates and transcripts (and an evaluation for foreign degrees)', fa: 'مدارک تحصیلی و ریز نمرات (و ارزیابی مدرک خارجی)' }, stage: 'apply' },
      { key: 'experience', label: { en: 'Employer letters for the 5 years of experience, if you rely on bachelor’s plus 5', fa: 'نامه‌های کارفرما برای پنج سال سابقه، اگر به کارشناسی به‌علاوهٔ پنج سال تکیه می‌کنید' }, stage: 'apply' },
      { key: 'endeavor', label: { en: 'Description of the proposed endeavor and plan', fa: 'شرح فعالیت پیشنهادی و برنامهٔ آن' }, stage: 'apply' },
      { key: 'prong-evidence', label: { en: 'Evidence for each prong: letters, publications, citations, contracts, investor or customer interest', fa: 'شواهد هر شرط: توصیه‌نامه، مقاله، استناد، قرارداد، علاقهٔ سرمایه‌گذار یا مشتری' }, stage: 'apply' },
      ...BASE_GC_DOCS,
    ],
    realities: [
      BAN_REALITY,
      INSIDE_US_REALITY,
      {
        key: 'no-employer',
        kind: 'tip',
        title: { en: 'No job offer, no employer, no PERM', fa: 'بدون پیشنهاد کار، کارفرما یا PERM' },
        detail: {
          en: 'NIW is the one EB-2 path you can file on your own behalf. Founders can use it when the endeavor is their own company.',
          fa: 'NIW تنها مسیر EB-2 است که خودتان می‌توانید ثبت کنید. بنیان‌گذاران وقتی فعالیتشان شرکت خودشان است از آن استفاده می‌کنند.',
        },
        source: EB2,
      },
      {
        key: 'approval-not-card',
        kind: 'myth',
        title: { en: 'Myth: an approved I-140 is the green card', fa: 'باور نادرست: I-140 تأییدشده همان گرین کارت است' },
        detail: {
          en: 'Approval only gives you a place in the queue. The green card comes when your priority date is current in the Visa Bulletin for your country of birth, which can take years.',
          fa: 'تأیید فقط جای شما را در صف ثبت می‌کند. گرین کارت وقتی صادر می‌شود که تاریخ اولویت شما در بولتن ویزا برای کشور تولدتان جاری شود و این ممکن است سال‌ها طول بکشد.',
        },
        source: EB2,
      },
      {
        key: 'premium-clock',
        kind: 'tip',
        title: { en: 'NIW premium is 45 business days, not 15', fa: 'رسیدگی ویژهٔ NIW ۴۵ روز کاری است، نه ۱۵' },
        detail: {
          en: 'USCIS gives EB-1 and non-NIW EB-2 petitions 15 business days, but NIW petitions 45.',
          fa: 'USCIS برای EB-1 و EB-2 بدون NIW پانزده روز کاری می‌دهد، اما برای NIW چهل‌وپنج روز.',
        },
        source: PREMIUM,
      },
    ],
    timeline: GREEN_CARD_TIMELINE,
    quiz: [
      {
        key: 'job-offer',
        q: { en: 'Does EB-2 NIW need a US job offer?', fa: 'آیا EB-2 NIW به پیشنهاد کار آمریکایی نیاز دارد؟' },
        options: [
          { en: 'Yes, always', fa: 'بله، همیشه' },
          { en: 'No, the job offer and labor certification are waived', fa: 'نه، پیشنهاد کار و گواهی کار معاف می‌شوند' },
          { en: 'Only for founders', fa: 'فقط برای بنیان‌گذاران' },
        ],
        answer: 1,
        why: { en: 'The waiver is exactly of the job offer and labor certification; you file I-140 yourself.', fa: 'معافیت دقیقاً از پیشنهاد کار و گواهی کار است و I-140 را خودتان ثبت می‌کنید.' },
      },
      {
        key: 'degree',
        q: { en: 'Which of these meets the degree requirement?', fa: 'کدام‌یک شرط مدرک را برآورده می‌کند؟' },
        options: [
          { en: 'A bachelor’s with 2 years of experience', fa: 'کارشناسی با دو سال سابقه' },
          { en: 'A bachelor’s plus 5 years of progressive experience', fa: 'کارشناسی به‌علاوهٔ پنج سال سابقهٔ پیشرفته' },
          { en: 'A high-school diploma and a business plan', fa: 'دیپلم دبیرستان و یک طرح کسب‌وکار' },
        ],
        answer: 1,
        why: { en: 'USCIS treats a bachelor’s plus 5 years of progressive post-bachelor’s experience as equal to a master’s.', fa: 'USCIS کارشناسی همراه با پنج سال سابقهٔ پیشرفته پس از آن را هم‌ارز کارشناسی ارشد می‌داند.' },
      },
      {
        key: 'prongs',
        q: { en: 'How many prongs must the NIW case meet?', fa: 'پروندهٔ NIW باید چند شرط را برآورده کند؟' },
        options: [{ en: 'One', fa: 'یک' }, { en: 'Two', fa: 'دو' }, { en: 'Three', fa: 'سه' }, { en: 'Six', fa: 'شش' }],
        answer: 2,
        why: { en: 'Merit and national importance, well positioned, and on balance beneficial to waive.', fa: 'ارزش و اهمیت ملی، جایگاه مناسب، و سودمندی معافیت در مجموع.' },
      },
      {
        key: 'premium',
        q: { en: 'What is the premium processing clock for an NIW I-140?', fa: 'مهلت رسیدگی ویژه برای I-140 از نوع NIW چقدر است؟' },
        options: [{ en: '15 business days', fa: '۱۵ روز کاری' }, { en: '30 business days', fa: '۳۰ روز کاری' }, { en: '45 business days', fa: '۴۵ روز کاری' }],
        answer: 2,
        why: { en: 'USCIS lists 45 business days for E21 national interest waiver petitions.', fa: 'USCIS برای درخواست‌های معافیت منافع ملی ۴۵ روز کاری اعلام کرده است.' },
      },
      {
        key: 'green-card-when',
        q: { en: 'When can you get the green card after I-140 approval?', fa: 'پس از تأیید I-140 چه زمانی گرین کارت می‌گیرید؟' },
        options: [
          { en: 'Immediately', fa: 'بلافاصله' },
          { en: 'When the priority date is current in the Visa Bulletin', fa: 'وقتی تاریخ اولویت در بولتن ویزا جاری شود' },
          { en: 'After 5 years in the US', fa: 'پس از پنج سال در آمریکا' },
        ],
        answer: 1,
        why: { en: 'Immigrant visa numbers are limited per category and country, so the queue decides the timing.', fa: 'شمار ویزاهای مهاجرتی برای هر رده و کشور محدود است، پس صف زمان را تعیین می‌کند.' },
      },
    ],
  },

  // ---------------------------------------------------------------- EB-1A
  'us-eb1a': {
    funds: [...SELF_PETITION_FUNDS, ...GREEN_CARD_STAGE_FUNDS],
    steps: [
      {
        key: 'criteria',
        title: { en: 'Map your record to the 10 criteria', fa: 'سوابق خود را با ده معیار تطبیق دهید' },
        detail: {
          en: 'You need at least 3 of the 10, or one major internationally recognised award. Comparable evidence is allowed where a criterion does not readily apply.',
          fa: 'دست‌کم سه معیار از ده معیار، یا یک جایزهٔ بزرگ بین‌المللی لازم است. اگر معیاری مستقیماً صدق نکند، شواهد هم‌ارز پذیرفته می‌شود.',
        },
        link: EB1,
      },
      {
        key: 'final-merits',
        title: { en: 'Prepare for the final merits review', fa: 'برای ارزیابی نهایی آماده شوید' },
        detail: {
          en: 'The officer then asks whether, taken together, the evidence shows sustained national or international acclaim and that you are among the small percentage at the top of the field.',
          fa: 'سپس افسر می‌سنجد که آیا مجموع شواهد شهرت پایدار ملی یا بین‌المللی و قرار گرفتن شما در درصد کوچک برتر رشته را نشان می‌دهد.',
        },
        link: 'https://www.uscis.gov/policy-manual/volume-6-part-f-chapter-2',
      },
      {
        key: 'i140',
        title: { en: 'File Form I-140 yourself', fa: 'فرم I-140 را خودتان ثبت کنید' },
        detail: {
          en: 'No job offer or labor certification. Include evidence that you will continue to work in your field. Premium processing: 15 business days.',
          fa: 'پیشنهاد کار و گواهی کار لازم نیست. شواهد ادامهٔ کار در همان رشته را هم بگذارید. رسیدگی ویژه: ۱۵ روز کاری.',
        },
        takes: { en: 'Premium: 15 business days', fa: 'رسیدگی ویژه: ۱۵ روز کاری' },
        link: 'https://www.uscis.gov/i-140',
      },
      ...GREEN_CARD_STEPS_TAIL,
    ],
    documents: [
      { key: 'i140', label: { en: 'Form I-140, signed', fa: 'فرم I-140 امضاشده' }, stage: 'apply' },
      { key: 'criteria-evidence', label: { en: 'Evidence for each criterion claimed (awards, memberships, press, judging, contributions, articles, role, salary)', fa: 'شواهد هر معیار ادعاشده (جایزه، عضویت، رسانه، داوری، نوآوری، مقاله، نقش، درآمد)' }, stage: 'apply' },
      { key: 'continue', label: { en: 'Evidence you will continue working in the field (contracts, letters, a statement of plans)', fa: 'شواهد ادامهٔ کار در رشته (قرارداد، نامه، شرح برنامه‌ها)' }, stage: 'apply' },
      { key: 'letters', label: { en: 'Expert letters from independent people in the field', fa: 'توصیه‌نامه از کارشناسان مستقل همان رشته' }, stage: 'apply' },
      ...BASE_GC_DOCS,
    ],
    realities: [
      BAN_REALITY,
      INSIDE_US_REALITY,
      {
        key: 'three-not-enough',
        kind: 'myth',
        title: { en: 'Myth: three criteria and you are in', fa: 'باور نادرست: سه معیار داشته باشید، کار تمام است' },
        detail: {
          en: 'Meeting 3 criteria only opens the final merits review, where the evidence as a whole must show sustained acclaim at the very top of the field.',
          fa: 'داشتن سه معیار فقط راه ارزیابی نهایی را باز می‌کند؛ آنجا مجموع شواهد باید شهرت پایدار در بالاترین سطح رشته را نشان دهد.',
        },
        source: EB1,
      },
      {
        key: 'one-time',
        kind: 'tip',
        title: { en: 'A single major award can replace the criteria', fa: 'یک جایزهٔ بزرگ می‌تواند جای معیارها را بگیرد' },
        detail: {
          en: 'USCIS gives a Pulitzer, an Oscar or an Olympic medal as examples of a one-time achievement that qualifies on its own.',
          fa: 'USCIS پولیتزر، اسکار یا مدال المپیک را نمونهٔ دستاورد یک‌باره‌ای می‌داند که به‌تنهایی کافی است.',
        },
        source: EB1,
      },
      {
        key: 'family',
        kind: 'tip',
        title: { en: 'Spouse and children come with you', fa: 'همسر و فرزندان همراه شما می‌آیند' },
        detail: {
          en: 'After approval your spouse and unmarried children under 21 can apply in E-14 and E-15 status.',
          fa: 'پس از تأیید، همسر و فرزندان مجرد زیر ۲۱ سال می‌توانند در وضعیت E-14 و E-15 درخواست دهند.',
        },
        source: EB1,
      },
    ],
    timeline: GREEN_CARD_TIMELINE,
    quiz: [
      {
        key: 'min-criteria',
        q: { en: 'How many of the 10 criteria do you need at minimum?', fa: 'دست‌کم چند معیار از ده معیار لازم است؟' },
        options: [{ en: '2', fa: '۲' }, { en: '3', fa: '۳' }, { en: '5', fa: '۵' }, { en: 'All 10', fa: 'هر ده' }],
        answer: 1,
        why: { en: 'At least 3 of 10, unless you have a one-time major award.', fa: 'دست‌کم سه از ده، مگر اینکه یک جایزهٔ بزرگ یک‌باره داشته باشید.' },
      },
      {
        key: 'self-petition',
        q: { en: 'Can you file EB-1A without an employer?', fa: 'آیا می‌توان EB-1A را بدون کارفرما ثبت کرد؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No, a US employer must file', fa: 'نه، کارفرمای آمریکایی باید ثبت کند' }, { en: 'Only through an agent', fa: 'فقط از طریق نماینده' }],
        answer: 0,
        why: { en: 'USCIS states no offer of employment or labor certification is required and you may file for yourself.', fa: 'USCIS می‌گوید پیشنهاد کار یا گواهی کار لازم نیست و خودتان می‌توانید ثبت کنید.' },
      },
      {
        key: 'one-time',
        q: { en: 'Which counts as a one-time achievement on its own?', fa: 'کدام‌یک به‌تنهایی دستاورد یک‌باره به شمار می‌آید؟' },
        options: [{ en: 'A national hackathon prize', fa: 'جایزهٔ یک هکاتون ملی' }, { en: 'An Olympic medal', fa: 'مدال المپیک' }, { en: 'A published book', fa: 'یک کتاب چاپ‌شده' }],
        answer: 1,
        why: { en: 'USCIS gives the Pulitzer, Oscar and Olympic medal as examples.', fa: 'USCIS پولیتزر، اسکار و مدال المپیک را مثال می‌زند.' },
      },
      {
        key: 'premium',
        q: { en: 'Premium processing for an EB-1A I-140 takes…', fa: 'رسیدگی ویژه برای I-140 از نوع EB-1A چقدر طول می‌کشد؟' },
        options: [{ en: '15 business days', fa: '۱۵ روز کاری' }, { en: '45 business days', fa: '۴۵ روز کاری' }, { en: '6 months', fa: '۶ ماه' }],
        answer: 0,
        why: { en: 'USCIS lists 15 business days for E11 petitions.', fa: 'USCIS برای درخواست‌های E11 پانزده روز کاری اعلام کرده است.' },
      },
      {
        key: 'final-merits',
        q: { en: 'What happens after you show 3 criteria?', fa: 'پس از نشان دادن سه معیار چه می‌شود؟' },
        options: [
          { en: 'Automatic approval', fa: 'تأیید خودکار' },
          { en: 'A final merits review of all the evidence together', fa: 'ارزیابی نهایی همهٔ شواهد با هم' },
          { en: 'A labor market test', fa: 'آزمون بازار کار' },
        ],
        answer: 1,
        why: { en: 'Criteria are the threshold; the final merits decide sustained acclaim.', fa: 'معیارها آستانه‌اند و ارزیابی نهایی دربارهٔ شهرت پایدار تصمیم می‌گیرد.' },
      },
    ],
  },

  // ---------------------------------------------------------------- EB-2 with a job offer
  'us-eb2-advanced-degree': {
    funds: [
      { key: 'i140-employer', label: { en: 'Form I-140 (paper; 665 online), paid by the employer', fa: 'فرم I-140 (کاغذی؛ آنلاین ۶۶۵)، پرداخت توسط کارفرما' }, amount: 715, currency: 'USD', basis: 'once', per: 'person', kind: 'spend', source: G1055 },
      { key: 'asylum-fee', label: { en: 'Asylum Program Fee, regular employer (300 small employer, 0 nonprofit)', fa: 'هزینهٔ برنامهٔ پناهندگی، کارفرمای عادی (کارفرمای کوچک ۳۰۰، غیرانتفاعی صفر)' }, amount: 600, currency: 'USD', basis: 'once', per: 'person', kind: 'spend', source: G1055 },
      { key: 'premium', label: { en: 'I-907 premium processing (optional)', fa: 'رسیدگی ویژه با فرم I-907 (اختیاری)' }, amount: 2_965, currency: 'USD', basis: 'once', per: 'person', kind: 'spend', source: G1055 },
      ...GREEN_CARD_STAGE_FUNDS,
    ],
    steps: [
      {
        key: 'offer',
        title: { en: 'Get a permanent job offer', fa: 'پیشنهاد کار دائم بگیرید' },
        detail: {
          en: 'The employer sponsors you for a permanent role that requires an advanced degree (or bachelor’s plus 5 years).',
          fa: 'کارفرما برای شغلی دائم که مدرک پیشرفته (یا کارشناسی همراه با پنج سال سابقه) لازم دارد از شما حمایت می‌کند.',
        },
        link: EB2,
      },
      {
        key: 'pwd',
        title: { en: 'Employer requests a prevailing wage determination', fa: 'کارفرما تعیین دستمزد رایج را درخواست می‌کند' },
        detail: {
          en: 'DOL sets the minimum wage for the job. As of 30 Sep 2026 DOL was issuing determinations on requests received in June 2026.',
          fa: 'وزارت کار حداقل دستمزد این شغل را تعیین می‌کند. تا ۳۰ سپتامبر ۲۰۲۶ وزارت کار به درخواست‌های دریافتی در ژوئن ۲۰۲۶ رسیدگی می‌کرد.',
        },
        link: 'https://flag.dol.gov/',
      },
      {
        key: 'perm',
        title: { en: 'Employer runs recruitment and files PERM', fa: 'کارفرما آزمون بازار کار را انجام می‌دهد و PERM را ثبت می‌کند' },
        detail: {
          en: 'The employer tests the US labor market and files Form ETA-9089. Average analyst review was 336 days for cases decided in August 2026.',
          fa: 'کارفرما بازار کار آمریکا را می‌آزماید و فرم ETA-9089 را ثبت می‌کند. میانگین بررسی پرونده‌هایی که در اوت ۲۰۲۶ تصمیم گرفته شد ۳۳۶ روز بود.',
        },
        takes: { en: 'About 336 days (analyst review, Aug 2026 average)', fa: 'حدود ۳۳۶ روز (میانگین بررسی، اوت ۲۰۲۶)' },
        link: PERM_TIMES,
      },
      {
        key: 'i140',
        title: { en: 'Employer files Form I-140', fa: 'کارفرما فرم I-140 را ثبت می‌کند' },
        detail: {
          en: 'With the certified labor certification and proof the employer can pay the wage. Premium processing: 15 business days.',
          fa: 'همراه با گواهی کار تأییدشده و مدرک توان پرداخت دستمزد. رسیدگی ویژه: ۱۵ روز کاری.',
        },
        takes: { en: 'Premium: 15 business days', fa: 'رسیدگی ویژه: ۱۵ روز کاری' },
        link: 'https://www.uscis.gov/i-140',
      },
      ...GREEN_CARD_STEPS_TAIL,
    ],
    documents: [
      { key: 'offer', label: { en: 'Permanent job offer letter', fa: 'نامهٔ پیشنهاد کار دائم' }, stage: 'apply' },
      { key: 'eta9089', label: { en: 'Certified Form ETA-9089 / signed Final Determination from DOL', fa: 'فرم ETA-9089 تأییدشده یا تصمیم نهایی امضاشدهٔ وزارت کار' }, stage: 'apply' },
      { key: 'i140', label: { en: 'Form I-140 signed by the employer', fa: 'فرم I-140 با امضای کارفرما' }, stage: 'apply' },
      { key: 'degree', label: { en: 'Degree certificates, transcripts and a foreign degree evaluation', fa: 'مدارک تحصیلی، ریز نمرات و ارزیابی مدرک خارجی' }, stage: 'apply' },
      { key: 'experience', label: { en: 'Employer letters proving required experience as of the priority date', fa: 'نامه‌های کارفرما که سابقهٔ لازم تا تاریخ اولویت را نشان دهد' }, stage: 'apply' },
      { key: 'ability-to-pay', label: { en: 'Employer’s ability to pay: annual reports, tax returns or audited statements', fa: 'توان پرداخت کارفرما: گزارش سالانه، اظهارنامهٔ مالیاتی یا صورت‌های مالی حسابرسی‌شده' }, stage: 'apply' },
      ...BASE_GC_DOCS,
    ],
    realities: [
      BAN_REALITY,
      {
        key: 'perm-time',
        kind: 'challenge',
        title: { en: 'PERM alone takes about a year', fa: 'PERM به‌تنهایی حدود یک سال طول می‌کشد' },
        detail: {
          en: 'Before PERM comes the wage determination queue; PERM analyst review averaged 336 days in August 2026. The I-140 and the visa queue come after that.',
          fa: 'پیش از PERM صف تعیین دستمزد است؛ میانگین بررسی PERM در اوت ۲۰۲۶ برابر ۳۳۶ روز بود. I-140 و صف ویزا پس از آن می‌آیند.',
        },
        source: PERM_TIMES,
      },
      {
        key: 'who-pays',
        kind: 'tip',
        title: { en: 'The employer may not charge you for PERM', fa: 'کارفرما نمی‌تواند هزینهٔ PERM را از شما بگیرد' },
        detail: {
          en: 'DOL rules bar the employer from seeking or receiving any payment for the labor certification, including its attorney’s fees. You may pay your own lawyer.',
          fa: 'طبق مقررات وزارت کار، کارفرما نباید برای گواهی کار، از جمله هزینهٔ وکیل خودش، هیچ پرداختی از شما بخواهد یا بگیرد. هزینهٔ وکیل خودتان را می‌توانید بپردازید.',
        },
        source: PERM_PAY,
      },
      {
        key: 'niw-alternative',
        kind: 'tip',
        title: { en: 'The same degree can carry an NIW instead', fa: 'همین مدرک می‌تواند به‌جای آن پایهٔ NIW باشد' },
        detail: {
          en: 'If no employer will sponsor you, EB-2 NIW uses the same degree test without a job offer or PERM.',
          fa: 'اگر کارفرمایی حامی شما نشود، EB-2 NIW با همان شرط مدرک و بدون پیشنهاد کار و PERM پیش می‌رود.',
        },
        source: EB2,
      },
    ],
    timeline: GREEN_CARD_TIMELINE,
    quiz: [
      {
        key: 'who-files',
        q: { en: 'Who files the I-140 on this route?', fa: 'در این مسیر چه کسی I-140 را ثبت می‌کند؟' },
        options: [{ en: 'You', fa: 'خودتان' }, { en: 'The US employer', fa: 'کارفرمای آمریکایی' }, { en: 'A consulate', fa: 'کنسولگری' }],
        answer: 1,
        why: { en: 'Outside NIW, a US employer files the I-140 for you.', fa: 'بیرون از NIW، کارفرمای آمریکایی I-140 را برای شما ثبت می‌کند.' },
      },
      {
        key: 'perm',
        q: { en: 'What does PERM certify?', fa: 'PERM چه چیزی را گواهی می‌کند؟' },
        options: [
          { en: 'Your English level', fa: 'سطح انگلیسی شما' },
          { en: 'That no able, qualified US worker is available and the wage is right', fa: 'اینکه کارگر آمریکایی توانا و واجد شرایط در دسترس نیست و دستمزد درست است' },
          { en: 'Your degree equivalence', fa: 'هم‌ارزی مدرک شما' },
        ],
        answer: 1,
        why: { en: 'Labor certification is DOL’s test of the US labor market for the job.', fa: 'گواهی کار آزمون وزارت کار از بازار کار آمریکا برای آن شغل است.' },
      },
      {
        key: 'pay',
        q: { en: 'Can the employer make you reimburse its PERM costs?', fa: 'آیا کارفرما می‌تواند هزینه‌های PERM را از شما پس بگیرد؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No', fa: 'نه' }, { en: 'Only half', fa: 'فقط نیمی از آن' }],
        answer: 1,
        why: { en: '20 CFR 656.12(b) bars the employer from seeking or receiving payment for labor certification.', fa: 'بند 20 CFR 656.12(b) گرفتن هر پرداختی برای گواهی کار را برای کارفرما ممنوع می‌کند.' },
      },
      {
        key: 'premium',
        q: { en: 'Premium processing for a non-NIW EB-2 I-140?', fa: 'رسیدگی ویژه برای I-140 از نوع EB-2 بدون NIW؟' },
        options: [{ en: '15 business days', fa: '۱۵ روز کاری' }, { en: '45 business days', fa: '۴۵ روز کاری' }, { en: 'Not available', fa: 'وجود ندارد' }],
        answer: 0,
        why: { en: 'USCIS lists 15 business days for E21 petitions that do not seek a waiver.', fa: 'USCIS برای درخواست‌های E21 بدون معافیت ۱۵ روز کاری اعلام کرده است.' },
      },
      {
        key: 'exceptional',
        q: { en: 'Exceptional ability needs how many of the 6 criteria?', fa: 'توانایی استثنایی چند معیار از شش معیار لازم دارد؟' },
        options: [{ en: '2', fa: '۲' }, { en: '3', fa: '۳' }, { en: '4', fa: '۴' }],
        answer: 1,
        why: { en: 'USCIS requires at least 3 of the 6 listed criteria.', fa: 'USCIS دست‌کم سه معیار از شش معیار فهرست‌شده را می‌خواهد.' },
      },
    ],
  },

  // ---------------------------------------------------------------- O-1A
  'us-o1a': {
    funds: [
      { key: 'i129', label: { en: 'Form I-129, O petition (paper; 1,005 online; 530 small employer or nonprofit), paid by the petitioner', fa: 'فرم I-129، طبقهٔ O (کاغذی؛ آنلاین ۱٬۰۰۵؛ کارفرمای کوچک یا غیرانتفاعی ۵۳۰)، پرداخت توسط درخواست‌دهنده' }, amount: 1_055, currency: 'USD', basis: 'once', per: 'person', kind: 'spend', source: G1055 },
      { key: 'asylum-fee', label: { en: 'Asylum Program Fee, regular petitioner (300 small employer, 0 nonprofit)', fa: 'هزینهٔ برنامهٔ پناهندگی، درخواست‌دهندهٔ عادی (کارفرمای کوچک ۳۰۰، غیرانتفاعی صفر)' }, amount: 600, currency: 'USD', basis: 'once', per: 'person', kind: 'spend', source: G1055 },
      { key: 'premium', label: { en: 'I-907 premium processing (optional)', fa: 'رسیدگی ویژه با فرم I-907 (اختیاری)' }, amount: 2_965, currency: 'USD', basis: 'once', per: 'person', kind: 'spend', source: G1055 },
      { key: 'visa-fee', label: { en: 'O-1 visa application fee at the consulate', fa: 'هزینهٔ درخواست ویزای O-1 در کنسولگری' }, amount: 205, currency: 'USD', basis: 'once', per: 'person', kind: 'spend', source: DOS_FEES },
      { key: 'visa-fee-spouse', label: { en: 'O-3 visa fee for the spouse', fa: 'هزینهٔ ویزای O-3 برای همسر' }, amount: 205, currency: 'USD', basis: 'once', per: 'spouse', kind: 'spend', source: DOS_FEES },
      { key: 'visa-fee-child', label: { en: 'O-3 visa fee for each child', fa: 'هزینهٔ ویزای O-3 برای هر فرزند' }, amount: 205, currency: 'USD', basis: 'once', per: 'child', kind: 'spend', source: DOS_FEES },
    ],
    steps: [
      {
        key: 'petitioner',
        title: { en: 'Find a petitioner', fa: 'درخواست‌دهنده پیدا کنید' },
        detail: {
          en: 'A US employer, a US agent, or a foreign employer acting through a US agent. You cannot petition for yourself, but your own US company can be the employer.',
          fa: 'کارفرمای آمریکایی، نمایندهٔ آمریکایی، یا کارفرمای خارجی از طریق نمایندهٔ آمریکایی. خودتان نمی‌توانید درخواست دهید، اما شرکت آمریکایی خودتان می‌تواند کارفرما باشد.',
        },
        link: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement',
      },
      {
        key: 'evidence',
        title: { en: 'Document 3 of the 8 criteria and get the advisory opinion', fa: 'سه معیار از هشت معیار را مستند کنید و نظر مشورتی بگیرید' },
        detail: {
          en: 'Plus a written advisory opinion from a peer group, labor organisation or expert, and the contract or summary of the work terms.',
          fa: 'به‌علاوهٔ نظر مشورتی کتبی از گروه همتا، سازمان صنفی یا کارشناس، و قرارداد یا خلاصهٔ شرایط کار.',
        },
        link: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.2',
      },
      {
        key: 'i129',
        title: { en: 'Petitioner files Form I-129', fa: 'درخواست‌دهنده فرم I-129 را ثبت می‌کند' },
        detail: { en: 'Premium processing gives a 15-business-day decision clock.', fa: 'رسیدگی ویژه مهلت تصمیم ۱۵ روز کاری دارد.' },
        takes: { en: 'Premium: 15 business days', fa: 'رسیدگی ویژه: ۱۵ روز کاری' },
        link: 'https://www.uscis.gov/i-129',
      },
      {
        key: 'visa',
        title: { en: 'Apply for the O-1 visa at a consulate', fa: 'ویزای O-1 را در کنسولگری بگیرید' },
        detail: {
          en: 'Form DS-160, the 205 USD fee and an interview. A change of status inside the US is possible if you are already there in another status.',
          fa: 'فرم DS-160، هزینهٔ ۲۰۵ دلار و مصاحبه. اگر با وضعیت دیگری در آمریکا هستید، تغییر وضعیت از داخل ممکن است.',
        },
        link: 'https://travel.state.gov/content/travel/en/us-visas/employment/temporary-worker-visas.html',
      },
      {
        key: 'extend',
        title: { en: 'Extend or move to a green card', fa: 'تمدید یا رفتن به سوی گرین کارت' },
        detail: {
          en: 'Initial stay up to 3 years, then extensions of up to 1 year at a time. The same evidence often supports an EB-1A petition.',
          fa: 'اقامت اولیه حداکثر سه سال، سپس تمدیدهای حداکثر یک‌ساله. همین شواهد اغلب پایهٔ درخواست EB-1A هم می‌شود.',
        },
        link: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement',
      },
    ],
    documents: [
      { key: 'i129', label: { en: 'Form I-129 with the O and P supplement', fa: 'فرم I-129 همراه با ضمیمهٔ O و P' }, stage: 'apply' },
      { key: 'consultation', label: { en: 'Written advisory opinion (consultation)', fa: 'نظر مشورتی کتبی (consultation)' }, stage: 'apply' },
      { key: 'contract', label: { en: 'Contract, or a summary of the oral agreement, with the work terms', fa: 'قرارداد یا خلاصهٔ توافق شفاهی با شرایط کار' }, stage: 'apply' },
      { key: 'itinerary', label: { en: 'Itinerary of events or activities', fa: 'برنامهٔ رویدادها یا فعالیت‌ها' }, stage: 'apply' },
      { key: 'criteria-evidence', label: { en: 'Evidence for at least 3 of the 8 criteria', fa: 'شواهد دست‌کم سه معیار از هشت معیار' }, stage: 'apply' },
      { key: 'ds160', label: { en: 'DS-160 confirmation, passport and photo', fa: 'تأییدیهٔ DS-160، گذرنامه و عکس' }, stage: 'visa' },
    ],
    realities: [
      BAN_REALITY,
      {
        key: 'no-self',
        kind: 'myth',
        title: { en: 'Myth: you can file an O-1 for yourself', fa: 'باور نادرست: O-1 را خودتان می‌توانید ثبت کنید' },
        detail: {
          en: 'Only a US employer or agent can file. Founders usually file through their own US company or an agent.',
          fa: 'فقط کارفرما یا نمایندهٔ آمریکایی می‌تواند ثبت کند. بنیان‌گذاران معمولاً از طریق شرکت آمریکایی خود یا یک نماینده اقدام می‌کنند.',
        },
        source: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement',
      },
      {
        key: 'no-pr',
        kind: 'challenge',
        title: { en: 'Temporary only', fa: 'فقط موقت' },
        detail: {
          en: 'O-1 has no built-in path to a green card; you need a separate immigrant petition such as EB-1A or EB-2 NIW.',
          fa: 'O-1 مسیر داخلی به گرین کارت ندارد و برای آن درخواست مهاجرتی جداگانه‌ای مانند EB-1A یا EB-2 NIW لازم است.',
        },
        source: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement',
      },
      {
        key: 'premium',
        kind: 'tip',
        title: { en: 'Fast decision with premium processing', fa: 'تصمیم سریع با رسیدگی ویژه' },
        detail: {
          en: 'O petitions can be premium-processed with a 15-business-day clock.',
          fa: 'درخواست‌های O با رسیدگی ویژه در مهلت ۱۵ روز کاری بررسی می‌شوند.',
        },
        source: PREMIUM,
      },
    ],
    timeline: TEMP_TIMELINE(
      'No residence clock: O-1 time does not count toward a green card. Citizenship is 5 years after a green card obtained another way (often EB-1A).',
      'ساعت اقامتی ندارد: زمان O-1 برای گرین کارت حساب نمی‌شود. تابعیت پنج سال پس از گرین کارتی است که از راه دیگری (اغلب EB-1A) گرفته شود.',
    ),
    quiz: [
      {
        key: 'criteria',
        q: { en: 'How many O-1A criteria must you meet?', fa: 'چند معیار O-1A را باید برآورده کنید؟' },
        options: [{ en: '3 of 8', fa: '۳ از ۸' }, { en: '3 of 10', fa: '۳ از ۱۰' }, { en: '5 of 8', fa: '۵ از ۸' }],
        answer: 0,
        why: { en: '8 CFR 214.2(o) lists 8 criteria for O-1A; 3 are required.', fa: 'بند 8 CFR 214.2(o) هشت معیار برای O-1A دارد و سه تا لازم است.' },
      },
      {
        key: 'self',
        q: { en: 'Can you petition for yourself?', fa: 'آیا خودتان می‌توانید درخواست دهید؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No, a US employer or agent files', fa: 'نه، کارفرما یا نمایندهٔ آمریکایی ثبت می‌کند' }],
        answer: 1,
        why: { en: 'O-1 requires a US employer, US agent, or foreign employer through a US agent.', fa: 'O-1 به کارفرمای آمریکایی، نمایندهٔ آمریکایی یا کارفرمای خارجی از طریق نماینده نیاز دارد.' },
      },
      {
        key: 'initial',
        q: { en: 'How long is the initial O-1 stay?', fa: 'اقامت اولیهٔ O-1 چقدر است؟' },
        options: [{ en: 'Up to 1 year', fa: 'حداکثر یک سال' }, { en: 'Up to 3 years', fa: 'حداکثر سه سال' }, { en: 'Up to 6 years', fa: 'حداکثر شش سال' }],
        answer: 1,
        why: { en: 'Up to 3 years, then extensions of up to 1 year.', fa: 'حداکثر سه سال، سپس تمدیدهای حداکثر یک‌ساله.' },
      },
      {
        key: 'visa-fee',
        q: { en: 'What is the consular fee for an O visa?', fa: 'هزینهٔ کنسولی ویزای O چقدر است؟' },
        options: [{ en: '185 USD', fa: '۱۸۵ دلار' }, { en: '205 USD', fa: '۲۰۵ دلار' }, { en: '315 USD', fa: '۳۱۵ دلار' }],
        answer: 1,
        why: { en: '22 CFR 22.1 sets 205 USD for H, L, O, P, Q and R visas.', fa: 'بند 22 CFR 22.1 هزینهٔ ویزاهای H، L، O، P، Q و R را ۲۰۵ دلار تعیین کرده است.' },
      },
      {
        key: 'pr',
        q: { en: 'Does O-1 lead directly to a green card?', fa: 'آیا O-1 مستقیماً به گرین کارت می‌رسد؟' },
        options: [{ en: 'Yes, after 3 years', fa: 'بله، پس از سه سال' }, { en: 'No, you need a separate immigrant petition', fa: 'نه، درخواست مهاجرتی جداگانه لازم است' }],
        answer: 1,
        why: { en: 'O-1 is a non-immigrant classification; EB-1A or NIW is a separate filing.', fa: 'O-1 وضعیت غیرمهاجرتی است و EB-1A یا NIW درخواستی جداست.' },
      },
    ],
  },

  // ---------------------------------------------------------------- F-1
  'us-f1': {
    funds: [
      { key: 'sevis', label: { en: 'SEVIS I-901 fee', fa: 'هزینهٔ SEVIS (فرم I-901)' }, amount: 350, currency: 'USD', basis: 'once', per: 'person', kind: 'spend', source: 'https://www.ice.gov/sevis/i901' },
      { key: 'visa-fee', label: { en: 'F-1 visa application fee', fa: 'هزینهٔ درخواست ویزای F-1' }, amount: 185, currency: 'USD', basis: 'once', per: 'person', kind: 'spend', source: DOS_FEES },
      { key: 'visa-fee-spouse', label: { en: 'F-2 visa fee for the spouse', fa: 'هزینهٔ ویزای F-2 برای همسر' }, amount: 185, currency: 'USD', basis: 'once', per: 'spouse', kind: 'spend', source: DOS_FEES },
      { key: 'visa-fee-child', label: { en: 'F-2 visa fee for each child', fa: 'هزینهٔ ویزای F-2 برای هر فرزند' }, amount: 185, currency: 'USD', basis: 'once', per: 'child', kind: 'spend', source: DOS_FEES },
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get admitted to a SEVP-certified school', fa: 'از مدرسه یا دانشگاه دارای تأیید SEVP پذیرش بگیرید' },
        detail: {
          en: 'Only SEVP-certified schools can issue the Form I-20.',
          fa: 'فقط مؤسسه‌های دارای تأیید SEVP می‌توانند فرم I-20 صادر کنند.',
        },
        link: 'https://studyinthestates.dhs.gov/school-search',
      },
      {
        key: 'i20',
        title: { en: 'Show funds and receive the I-20', fa: 'تمکن مالی را نشان دهید و I-20 بگیرید' },
        detail: {
          en: 'The school sets the amount for tuition and living costs and prints it on the I-20. There is no federal dollar figure.',
          fa: 'مدرسه مبلغ شهریه و هزینهٔ زندگی را تعیین و روی I-20 درج می‌کند. رقم فدرالی ثابتی وجود ندارد.',
        },
        link: 'https://studyinthestates.dhs.gov/students/prepare/financial-ability',
      },
      {
        key: 'sevis',
        title: { en: 'Pay the SEVIS I-901 fee', fa: 'هزینهٔ SEVIS (فرم I-901) را بپردازید' },
        detail: { en: '350 USD for F students.', fa: '۳۵۰ دلار برای دانشجویان F.' },
        link: 'https://www.fmjfee.com/',
      },
      {
        key: 'visa',
        title: { en: 'Apply for the F-1 visa', fa: 'برای ویزای F-1 اقدام کنید' },
        detail: {
          en: 'Form DS-160, the 185 USD fee and an interview, where the officer weighs whether you will return home (INA 214(b)).',
          fa: 'فرم DS-160، هزینهٔ ۱۸۵ دلار و مصاحبه؛ افسر می‌سنجد که آیا به کشورتان برمی‌گردید (بند 214(b) قانون مهاجرت).',
        },
        link: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html',
      },
      {
        key: 'enter',
        title: { en: 'Enter for a fixed period', fa: 'برای دوره‌ای مشخص وارد شوید' },
        detail: {
          en: 'Under the DHS rule effective 15 Sep 2026, F-1 students are admitted up to the programme length, at most 4 years; longer study needs an extension of stay.',
          fa: 'طبق مقررات DHS که از ۱۵ سپتامبر ۲۰۲۶ اجرا می‌شود، دانشجوی F-1 تا پایان دورهٔ تحصیل و حداکثر چهار سال پذیرفته می‌شود؛ تحصیل طولانی‌تر به تمدید اقامت نیاز دارد.',
        },
        link: 'https://www.federalregister.gov/documents/2026/07/17/2026-14439/establishing-a-fixed-time-period-of-admission-and-an-extension-of-stay-procedure-for-nonimmigrant',
      },
      {
        key: 'opt',
        title: { en: 'Work after graduation on OPT', fa: 'پس از فارغ‌التحصیلی با OPT کار کنید' },
        detail: {
          en: 'Up to 12 months, plus 24 months for STEM degrees with an E-Verify employer. Apply from 90 days before to 60 days after programme end.',
          fa: 'حداکثر ۱۲ ماه، به‌علاوهٔ ۲۴ ماه برای رشته‌های STEM نزد کارفرمای عضو E-Verify. از ۹۰ روز پیش تا ۶۰ روز پس از پایان دوره درخواست دهید.',
        },
        link: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students',
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport valid for travel', fa: 'گذرنامهٔ معتبر' }, stage: 'visa' },
      { key: 'i20', label: { en: 'Form I-20 signed by you and the school', fa: 'فرم I-20 با امضای شما و مدرسه' }, stage: 'visa' },
      { key: 'sevis-receipt', label: { en: 'SEVIS I-901 payment receipt', fa: 'رسید پرداخت SEVIS (فرم I-901)' }, stage: 'visa' },
      { key: 'ds160', label: { en: 'DS-160 confirmation page and photo', fa: 'صفحهٔ تأیید DS-160 و عکس' }, stage: 'visa' },
      { key: 'funds', label: { en: 'Proof of funds: bank statements, sponsor documents, scholarship or financial aid letters', fa: 'مدرک تمکن مالی: صورت‌حساب بانکی، مدارک حامی مالی، نامهٔ بورسیه یا کمک‌هزینه' }, stage: 'visa' },
      { key: 'academics', label: { en: 'Transcripts, diplomas and test scores the school used', fa: 'ریز نمرات، مدارک تحصیلی و نمرهٔ آزمون‌هایی که مدرسه استفاده کرده است' }, stage: 'visa' },
    ],
    realities: [
      {
        ...BAN_REALITY,
        detail: {
          en: 'Since 1 January 2026 entry of Iranian nationals as non-immigrants, students included, is fully suspended for those outside the US without a valid visa on that date. Dual nationals travelling on a non-listed passport are excepted.',
          fa: 'از ۱ ژانویهٔ ۲۰۲۶ ورود اتباع ایران با ویزای غیرمهاجرتی، از جمله دانشجویی، برای کسانی که در آن تاریخ بیرون از آمریکا بودند و ویزای معتبر نداشتند کاملاً متوقف است. دوتابعیتی‌هایی که با گذرنامهٔ کشوری غیرمشمول سفر می‌کنند مستثنا هستند.',
        },
      },
      {
        key: 'opt-fee',
        kind: 'challenge',
        title: { en: 'Proposed OPT fees could change the maths', fa: 'هزینه‌های پیشنهادی OPT ممکن است حساب‌ها را عوض کند' },
        detail: {
          en: 'A DHS proposed rule of 8 Oct 2026 would charge 70,000 USD for initial OPT and 30,000 USD for each later OPT period. It is a proposal (comments close 9 Nov 2026), not law yet.',
          fa: 'پیش‌نویس مقررات DHS در ۸ اکتبر ۲۰۲۶ برای OPT اولیه ۷۰٬۰۰۰ دلار و برای هر دورهٔ بعدی ۳۰٬۰۰۰ دلار هزینه پیشنهاد کرده است. این فقط پیشنهاد است (مهلت نظر ۹ نوامبر ۲۰۲۶) و هنوز قانون نشده است.',
        },
        source: 'https://www.federalregister.gov/documents/2026/10/08/2026-20660/optional-practical-training-fees',
      },
      {
        key: 'no-federal-amount',
        kind: 'myth',
        title: { en: 'Myth: there is a fixed federal amount to show', fa: 'باور نادرست: مبلغ فدرال ثابتی برای تمکن وجود دارد' },
        detail: {
          en: 'DHS asks for enough to cover tuition and living costs for the intended study; the figure is the one on your I-20.',
          fa: 'DHS پولی می‌خواهد که شهریه و هزینهٔ زندگی دورهٔ تحصیل را پوشش دهد؛ رقم همان است که روی I-20 شما آمده است.',
        },
        source: 'https://studyinthestates.dhs.gov/students/prepare/financial-ability',
      },
      {
        key: 'fixed-period',
        kind: 'tip',
        title: { en: 'Admission is now for a fixed period', fa: 'پذیرش اکنون برای دوره‌ای مشخص است' },
        detail: {
          en: '“Duration of status” ended with the rule effective 15 Sep 2026: watch your admit-until date and file an extension in time if your programme runs longer.',
          fa: 'با مقرراتی که از ۱۵ سپتامبر ۲۰۲۶ اجرا شد، «مدت وضعیت» کنار رفت: تاریخ پایان اقامت خود را زیر نظر داشته باشید و اگر دوره طولانی‌تر است، به‌موقع تمدید بخواهید.',
        },
        source: 'https://www.federalregister.gov/documents/2026/07/17/2026-14439/establishing-a-fixed-time-period-of-admission-and-an-extension-of-stay-procedure-for-nonimmigrant',
      },
      {
        key: 'intent',
        kind: 'challenge',
        title: { en: 'You must show you plan to leave', fa: 'باید نشان دهید قصد بازگشت دارید' },
        detail: {
          en: 'F-1 is a non-immigrant visa: the officer must be satisfied that you have not abandoned your residence abroad.',
          fa: 'F-1 ویزای غیرمهاجرتی است و افسر باید قانع شود که اقامتگاه خود در خارج را رها نکرده‌اید.',
        },
        source: 'https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.2',
      },
    ],
    timeline: TEMP_TIMELINE(
      'F-1 time does not count toward a green card. Graduates usually move to OPT, then H-1B, O-1 or an EB-2 petition.',
      'زمان F-1 برای گرین کارت حساب نمی‌شود. فارغ‌التحصیلان معمولاً به OPT و سپس H-1B، O-1 یا درخواست EB-2 می‌روند.',
    ),
    quiz: [
      {
        key: 'sevis',
        q: { en: 'How much is the SEVIS I-901 fee for F students?', fa: 'هزینهٔ SEVIS برای دانشجویان F چقدر است؟' },
        options: [{ en: '185 USD', fa: '۱۸۵ دلار' }, { en: '220 USD', fa: '۲۲۰ دلار' }, { en: '350 USD', fa: '۳۵۰ دلار' }],
        answer: 2,
        why: { en: 'ICE lists 350 USD for F and M applicants (220 for J).', fa: 'ICE برای متقاضیان F و M مبلغ ۳۵۰ دلار (و برای J مبلغ ۲۲۰) اعلام کرده است.' },
      },
      {
        key: 'funds',
        q: { en: 'Who sets the amount of money you must show?', fa: 'مبلغ تمکن مالی را چه کسی تعیین می‌کند؟' },
        options: [{ en: 'Congress', fa: 'کنگره' }, { en: 'The school, on the I-20', fa: 'مدرسه، روی I-20' }, { en: 'The consulate', fa: 'کنسولگری' }],
        answer: 1,
        why: { en: 'There is no federal figure; the I-20 carries the school’s estimate.', fa: 'رقم فدرالی وجود ندارد و I-20 برآورد مدرسه را دارد.' },
      },
      {
        key: 'opt',
        q: { en: 'How long is standard OPT?', fa: 'OPT عادی چقدر است؟' },
        options: [{ en: '6 months', fa: '۶ ماه' }, { en: '12 months', fa: '۱۲ ماه' }, { en: '36 months', fa: '۳۶ ماه' }],
        answer: 1,
        why: { en: 'Up to 12 months; STEM graduates can add 24 months.', fa: 'حداکثر ۱۲ ماه؛ فارغ‌التحصیلان STEM می‌توانند ۲۴ ماه اضافه کنند.' },
      },
      {
        key: 'admission',
        q: { en: 'Since 15 Sep 2026, F-1 students are admitted for…', fa: 'از ۱۵ سپتامبر ۲۰۲۶ دانشجوی F-1 برای چه مدتی پذیرفته می‌شود؟' },
        options: [
          { en: 'Duration of status', fa: 'مدت وضعیت' },
          { en: 'The programme length, at most 4 years', fa: 'طول دوره، حداکثر چهار سال' },
          { en: 'Exactly 1 year', fa: 'دقیقاً یک سال' },
        ],
        answer: 1,
        why: { en: 'The DHS final rule replaced duration of status with a fixed period up to 4 years.', fa: 'مقررات نهایی DHS «مدت وضعیت» را با دوره‌ای مشخص تا چهار سال جایگزین کرد.' },
      },
      {
        key: 'intent',
        q: { en: 'What does the consular officer test under INA 214(b)?', fa: 'افسر کنسولی بر پایهٔ بند 214(b) چه چیزی را می‌سنجد؟' },
        options: [{ en: 'Your GPA', fa: 'معدل شما' }, { en: 'Your intent to return home', fa: 'قصد بازگشت شما' }, { en: 'Your job offer', fa: 'پیشنهاد کار شما' }],
        answer: 1,
        why: { en: 'Non-immigrant applicants must overcome the presumption of immigrant intent.', fa: 'متقاضی ویزای غیرمهاجرتی باید فرض قصد مهاجرت را رد کند.' },
      },
    ],
  },

  // ---------------------------------------------------------------- International Entrepreneur Rule
  'us-international-entrepreneur-rule': {
    funds: [
      { key: 'qualified-investment', label: { en: 'Qualified US investment raised by the company (not your own money) within 18 months before filing', fa: 'سرمایهٔ واجد شرایط آمریکایی که شرکت ظرف ۱۸ ماه پیش از درخواست جذب کرده (نه پول خودتان)' }, amount: 311_071, currency: 'USD', basis: 'once', per: 'team', kind: 'invest', source: IER },
      { key: 'or-grants', label: { en: 'Or: US government grants or awards to the company', fa: 'یا: کمک‌هزینه یا جایزهٔ دولتی آمریکا به شرکت' }, amount: 124_429, currency: 'USD', basis: 'once', per: 'team', kind: 'invest', source: IER },
      { key: 'i941', label: { en: 'Form I-941 filing fee (each entrepreneur)', fa: 'هزینهٔ ثبت فرم I-941 (برای هر کارآفرین)' }, amount: 1_200, currency: 'USD', basis: 'once', per: 'founder', kind: 'spend', source: G1055 },
      { key: 'parole-fee', label: { en: 'Immigration Parole Fee if approved (online figure; each entrepreneur)', fa: 'هزینهٔ پارول در صورت تأیید (رقم ثبت آنلاین؛ برای هر کارآفرین)' }, amount: 1_050, currency: 'USD', basis: 'once', per: 'founder', kind: 'spend', source: G1055 },
      { key: 'spouse-ead', label: { en: 'Spouse work permit: I-765 (c)(34), paper', fa: 'مجوز کار همسر: فرم I-765 در ردهٔ (c)(34)، کاغذی' }, amount: 520, currency: 'USD', basis: 'once', per: 'spouse', kind: 'spend', source: G1055 },
      { key: 'spouse-ead-hr1', label: { en: 'Spouse work permit: H.R. 1 fee on top', fa: 'مجوز کار همسر: هزینهٔ اضافی قانون H.R. 1' }, amount: 570, currency: 'USD', basis: 'once', per: 'spouse', kind: 'spend', source: G1055 },
    ],
    steps: [
      {
        key: 'company',
        title: { en: 'Form the US startup and keep at least 10%', fa: 'استارتاپ آمریکایی را تأسیس کنید و دست‌کم ۱۰٪ آن را نگه دارید' },
        detail: {
          en: 'The entity must be formed within the 5 years before filing, and you need a central and active role. Up to 3 entrepreneurs per startup.',
          fa: 'شرکت باید در پنج سال پیش از درخواست تأسیس شده باشد و شما نقش محوری و فعال داشته باشید. حداکثر سه کارآفرین برای هر استارتاپ.',
        },
        link: IER,
      },
      {
        key: 'raise',
        title: { en: 'Raise from qualified US investors (or win grants)', fa: 'از سرمایه‌گذاران واجد شرایط آمریکایی سرمایه بگیرید (یا کمک‌هزینه ببرید)' },
        detail: {
          en: 'At least 311,071 USD from qualified investors, or 124,429 USD in federal, state or local grants, within 18 months before filing. A qualified investor is a US citizen or green-card holder, or a US-organised fund majority owned by them, with a track record.',
          fa: 'دست‌کم ۳۱۱٬۰۷۱ دلار از سرمایه‌گذاران واجد شرایط، یا ۱۲۴٬۴۲۹ دلار کمک‌هزینهٔ فدرال، ایالتی یا محلی، ظرف ۱۸ ماه پیش از درخواست. سرمایه‌گذار واجد شرایط شهروند یا دارندهٔ گرین کارت آمریکاست، یا صندوقی ثبت‌شده در آمریکا که اکثریت آن در مالکیت چنین افرادی است و سابقهٔ سرمایه‌گذاری دارد.',
        },
        link: IER_CFR,
      },
      {
        key: 'i941',
        title: { en: 'File Form I-941', fa: 'فرم I-941 را ثبت کنید' },
        detail: {
          en: 'Use the 01/20/25 edition, signed, with the evidence, mailed to the USCIS Dallas lockbox. Family members file Form I-131.',
          fa: 'نسخهٔ ۰۱/۲۰/۲۵ فرم، امضاشده و همراه مدارک، به صندوق پستی USCIS در دالاس فرستاده می‌شود. اعضای خانواده فرم I-131 ثبت می‌کنند.',
        },
        link: 'https://www.uscis.gov/i-941',
      },
      {
        key: 'biometrics',
        title: { en: 'Biometrics and the conditional approval', fa: 'انگشت‌نگاری و تأیید مشروط' },
        detail: {
          en: 'Everyone seeking parole gives biometrics. If USCIS conditionally approves, the Immigration Parole Fee is due before parole is granted.',
          fa: 'همهٔ متقاضیان پارول انگشت‌نگاری می‌دهند. اگر USCIS تأیید مشروط بدهد، هزینهٔ پارول پیش از صدور پارول پرداخت می‌شود.',
        },
        link: G1055,
      },
      {
        key: 'port',
        title: { en: 'Be paroled in at a port of entry', fa: 'در مبادی ورودی پارول بگیرید' },
        detail: {
          en: 'CBP decides at the border. The initial parole is up to 30 months; you may work only for the startup.',
          fa: 'تصمیم نهایی با CBP در مرز است. پارول اولیه حداکثر ۳۰ ماه است و فقط برای همان استارتاپ می‌توانید کار کنید.',
        },
        link: IER_CFR,
      },
      {
        key: 're-parole',
        title: { en: 'Apply for re-parole before the end', fa: 'پیش از پایان، برای تمدید پارول اقدام کنید' },
        detail: {
          en: 'One more period of up to 30 months (5 years in total): keep at least 5% and show 622,142 USD in investment or grants, or 5 qualified jobs, or 622,142 USD in US revenue with 20% average annual growth.',
          fa: 'یک دورهٔ دیگر تا ۳۰ ماه (در مجموع پنج سال): دست‌کم ۵٪ مالکیت را نگه دارید و ۶۲۲٬۱۴۲ دلار سرمایه یا کمک‌هزینه، یا پنج شغل واجد شرایط، یا ۶۲۲٬۱۴۲ دلار درآمد در آمریکا با رشد سالانهٔ میانگین ۲۰٪ نشان دهید.',
        },
        link: IER,
      },
    ],
    documents: [
      { key: 'i941', label: { en: 'Form I-941, 01/20/25 edition, signed, all pages from the same edition', fa: 'فرم I-941 نسخهٔ ۰۱/۲۰/۲۵، امضاشده و همهٔ صفحه‌ها از همان نسخه' }, stage: 'apply' },
      { key: 'formation', label: { en: 'Formation documents showing the entity was created within 5 years', fa: 'اسناد تأسیس که نشان دهد شرکت در پنج سال اخیر ایجاد شده است' }, stage: 'apply' },
      { key: 'ownership', label: { en: 'Cap table or ownership records showing at least 10%', fa: 'جدول سهام یا سوابق مالکیت که دست‌کم ۱۰٪ را نشان دهد' }, stage: 'apply' },
      { key: 'role', label: { en: 'Evidence of your central and active role (position, duties, knowledge)', fa: 'شواهد نقش محوری و فعال شما (سمت، وظایف، دانش)' }, stage: 'apply' },
      { key: 'investment', label: { en: 'Proof of qualified investments or grants received in the last 18 months', fa: 'مدرک سرمایه‌گذاری یا کمک‌هزینهٔ دریافتی در ۱۸ ماه اخیر' }, stage: 'apply' },
      { key: 'investor-record', label: { en: 'Evidence each investor is a qualified investor (5-year track record)', fa: 'مدرک واجد شرایط بودن هر سرمایه‌گذار (سابقهٔ پنج‌ساله)' }, stage: 'apply' },
      { key: 'alternative', label: { en: 'Alternative evidence of growth potential, if funding is only partial', fa: 'شواهد جایگزین پتانسیل رشد، اگر سرمایه فقط بخشی از حد نصاب است' }, stage: 'apply' },
      { key: 'i131-family', label: { en: 'Form I-131 for each spouse and child', fa: 'فرم I-131 برای همسر و هر فرزند' }, stage: 'permit' },
    ],
    realities: [
      BAN_REALITY,
      {
        key: 'own-money',
        kind: 'myth',
        title: { en: 'Myth: the founders can put in the 311,071 themselves', fa: 'باور نادرست: بنیان‌گذاران خودشان می‌توانند ۳۱۱٬۰۷۱ دلار را بگذارند' },
        detail: {
          en: 'Money from you, your parents, spouse, siblings or children, or entities you own, does not count. It must come from qualified US investors.',
          fa: 'پول شما، والدین، همسر، خواهر و برادر یا فرزندانتان، یا شرکت‌هایی که مالکشان هستید، حساب نمی‌شود. سرمایه باید از سرمایه‌گذاران واجد شرایط آمریکایی بیاید.',
        },
        source: IER_CFR,
      },
      {
        key: 'not-admission',
        kind: 'challenge',
        title: { en: 'Parole is not admission', fa: 'پارول پذیرش رسمی نیست' },
        detail: {
          en: 'USCIS says a parolee is generally ineligible to adjust or change status inside the US. A later green card or visa usually means leaving and going through a consulate.',
          fa: 'به گفتهٔ USCIS، پارول‌شده معمولاً نمی‌تواند از داخل آمریکا وضعیت خود را تغییر دهد یا اصلاح کند. گرین کارت یا ویزای بعدی معمولاً یعنی خروج و رفتن به کنسولگری.',
        },
        source: IER,
      },
      {
        key: 'family-work',
        kind: 'tip',
        title: { en: 'Your spouse can work; your children cannot', fa: 'همسرتان می‌تواند کار کند؛ فرزندانتان نه' },
        detail: {
          en: 'A paroled spouse may file Form I-765 and work once the card is issued. Children are not eligible for work authorization under this rule.',
          fa: 'همسر پارول‌شده می‌تواند فرم I-765 ثبت کند و پس از صدور کارت کار کند. فرزندان طبق این مقررات مجوز کار نمی‌گیرند.',
        },
        source: IER,
      },
      {
        key: 'income-condition',
        kind: 'challenge',
        title: { en: 'Household income above 400% of the poverty line', fa: 'درآمد خانوار بالاتر از ۴۰۰٪ خط فقر' },
        detail: {
          en: 'It is a condition of parole, checked at any time: the founder’s household must keep income above 400% of the HHS federal poverty line for its size.',
          fa: 'این شرط پارول است و هر زمان ممکن است بررسی شود: درآمد خانوار کارآفرین باید از ۴۰۰٪ خط فقر فدرال HHS برای همان تعداد نفر بیشتر بماند.',
        },
        source: IER_CFR,
      },
      {
        key: 'renewal-paths',
        kind: 'myth',
        title: { en: 'Myth: re-parole needs 5 jobs', fa: 'باور نادرست: تمدید پارول حتماً پنج شغل می‌خواهد' },
        detail: {
          en: 'Five qualified jobs is one of three options. 622,142 USD in further investment or grants, or 622,142 USD in US revenue growing 20% a year, also qualifies.',
          fa: 'پنج شغل واجد شرایط یکی از سه گزینه است. ۶۲۲٬۱۴۲ دلار سرمایه یا کمک‌هزینهٔ بیشتر، یا ۶۲۲٬۱۴۲ دلار درآمد در آمریکا با رشد سالانهٔ ۲۰٪ نیز کافی است.',
        },
        source: IER,
      },
    ],
    timeline: TEMP_TIMELINE(
      'Up to 5 years of parole (30 + 30 months). Parole is not a status and does not count toward a green card; founders usually file EB-2 NIW, EB-1A or O-1 meanwhile and complete it through a consulate.',
      'حداکثر پنج سال پارول (۳۰ به‌علاوهٔ ۳۰ ماه). پارول وضعیت اقامتی نیست و برای گرین کارت حساب نمی‌شود؛ بنیان‌گذاران معمولاً در همین مدت EB-2 NIW، EB-1A یا O-1 ثبت می‌کنند و آن را از کنسولگری تمام می‌کنند.',
    ),
    quiz: [
      {
        key: 'threshold',
        q: { en: 'What is the minimum qualified investment for initial parole?', fa: 'حداقل سرمایهٔ واجد شرایط برای پارول اولیه چقدر است؟' },
        options: [{ en: '124,429 USD', fa: '۱۲۴٬۴۲۹ دلار' }, { en: '311,071 USD', fa: '۳۱۱٬۰۷۱ دلار' }, { en: '746,571 USD', fa: '۷۴۶٬۵۷۱ دلار' }, { en: '800,000 USD', fa: '۸۰۰٬۰۰۰ دلار' }],
        answer: 1,
        why: { en: 'USCIS set 311,071 USD for filings on or after 1 Oct 2024.', fa: 'USCIS برای درخواست‌های از ۱ اکتبر ۲۰۲۴ به بعد مبلغ ۳۱۱٬۰۷۱ دلار تعیین کرده است.' },
      },
      {
        key: 'own-money',
        q: { en: 'Does your own money count toward the threshold?', fa: 'آیا پول خودتان در حد نصاب حساب می‌شود؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No', fa: 'نه' }, { en: 'Up to half', fa: 'تا نیمی از آن' }],
        answer: 1,
        why: { en: 'Only qualified investors count; you, close relatives and your own entities are excluded.', fa: 'فقط سرمایه‌گذار واجد شرایط حساب می‌شود و خودتان، بستگان نزدیک و شرکت‌هایتان کنار گذاشته می‌شوند.' },
      },
      {
        key: 'ownership',
        q: { en: 'What ownership do you need at the initial grant?', fa: 'در زمان پارول اولیه چند درصد مالکیت لازم است؟' },
        options: [{ en: '5%', fa: '۵٪' }, { en: '10%', fa: '۱۰٪' }, { en: '50%', fa: '۵۰٪' }],
        answer: 1,
        why: { en: 'At least 10% initially and at least 5% at re-parole.', fa: 'دست‌کم ۱۰٪ در آغاز و دست‌کم ۵٪ هنگام تمدید.' },
      },
      {
        key: 'max',
        q: { en: 'What is the maximum total parole?', fa: 'حداکثر کل مدت پارول چقدر است؟' },
        options: [{ en: '30 months', fa: '۳۰ ماه' }, { en: '5 years', fa: 'پنج سال' }, { en: 'No limit', fa: 'بدون محدودیت' }],
        answer: 1,
        why: { en: 'One initial and one re-parole period of up to 30 months each.', fa: 'یک دورهٔ اولیه و یک دورهٔ تمدید، هر کدام حداکثر ۳۰ ماه.' },
      },
      {
        key: 'founders',
        q: { en: 'How many entrepreneurs can be paroled on one startup?', fa: 'برای یک استارتاپ چند کارآفرین می‌توانند پارول بگیرند؟' },
        options: [{ en: '1', fa: '۱' }, { en: '2', fa: '۲' }, { en: '3', fa: '۳' }, { en: '5', fa: '۵' }],
        answer: 2,
        why: { en: '8 CFR 212.19(f) caps it at three per start-up entity.', fa: 'بند 8 CFR 212.19(f) سقف را سه نفر برای هر استارتاپ گذاشته است.' },
      },
    ],
    media: [
      { notebookId: IER_NOTEBOOK, kind: 'slides', title: 'IER Strategic Roadmap' },
      { notebookId: IER_NOTEBOOK, kind: 'slides', title: 'FY2025 IER Strategic Blueprint' },
      { notebookId: IER_NOTEBOOK, kind: 'infographic', title: 'راهنمای قانون کارآفرینی بین‌المللی IER (7 sources)' },
      { notebookId: IER_NOTEBOOK, kind: 'infographic', title: 'راهنمای قانون کارآفرینی بین‌المللی IER (1 source)' },
    ],
  },
};

export const PROFILE_US: CountryProfile = {
  strengths: [
    {
      en: 'Two green-card routes you can file yourself, without an employer: EB-2 NIW and EB-1A.',
      fa: 'دو مسیر گرین کارت که بدون کارفرما خودتان می‌توانید ثبت کنید: EB-2 NIW و EB-1A.',
    },
    {
      en: 'Third in the WIPO Global Innovation Index 2026: deep venture capital, research universities and customers.',
      fa: 'رتبهٔ سوم در شاخص جهانی نوآوری WIPO در ۲۰۲۶: سرمایهٔ خطرپذیر فراوان، دانشگاه‌های پژوهشی و بازار بزرگ.',
    },
    {
      en: 'High incomes: GDP per capita about 90,000 USD (World Bank, 2025).',
      fa: 'درآمد بالا: تولید ناخالص سرانه حدود ۹۰٬۰۰۰ دلار (بانک جهانی، ۲۰۲۵).',
    },
    {
      en: 'Citizenship five years after the green card, and US law does not make you give up another nationality.',
      fa: 'تابعیت پنج سال پس از گرین کارت، و قانون آمریکا شما را به کنار گذاشتن تابعیت دیگر وادار نمی‌کند.',
    },
  ],
  weaknesses: [
    {
      en: 'Proclamation 10998 suspends entry for nationals of 39 countries, fully for Iran, since 1 January 2026.',
      fa: 'اعلامیهٔ ۱۰۹۹۸ از ۱ ژانویهٔ ۲۰۲۶ ورود اتباع ۳۹ کشور را محدود کرده و برای ایران کاملاً متوقف کرده است.',
    },
    {
      en: 'No startup visa: the International Entrepreneur Rule is a discretionary parole that needs 311,071 USD from US investors and gives no green card.',
      fa: 'ویزای استارتاپ ندارد: قانون کارآفرین بین‌المللی پارولی اختیاری است که ۳۱۱٬۰۷۱ دلار سرمایهٔ آمریکایی می‌خواهد و به گرین کارت نمی‌رسد.',
    },
    {
      en: 'Green-card queues by country of birth: approval can be followed by years of waiting.',
      fa: 'صف گرین کارت بر پایهٔ کشور تولد: پس از تأیید ممکن است سال‌ها انتظار باشد.',
    },
    {
      en: 'Rules move fast: new H.R. 1 fees, fixed admission periods for students since 15 Sep 2026, and a proposed OPT fee.',
      fa: 'قوانین زود تغییر می‌کنند: هزینه‌های تازهٔ H.R. 1، دورهٔ اقامت مشخص برای دانشجویان از ۱۵ سپتامبر ۲۰۲۶، و هزینهٔ پیشنهادی OPT.',
    },
    {
      en: '134th of 163 in the Global Peace Index 2026.',
      fa: 'رتبهٔ ۱۳۴ از ۱۶۳ در شاخص جهانی صلح ۲۰۲۶.',
    },
  ],
  indicators: [
    { key: 'hdi', rank: 17, of: 193, value: 0.938, year: 2023, source: { url: 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Table.xlsx', checked: CHECKED, label: 'UNDP HDR 2025, Table 1 (2023 data)' } },
    { key: 'happiness', rank: 23, of: 147, year: 2026, source: { url: 'https://files.worldhappiness.report/WHR26_Data_Figure_2.1.xlsx', checked: CHECKED, label: 'World Happiness Report 2026, Figure 2.1 data (2023–2025 average)' } },
    { key: 'peace', rank: 134, of: 163, value: 2.535, year: 2026, source: { url: 'https://www.visionofhumanity.org/wp-content/uploads/2026/06/Global-Peace-Index-2026-Report.pdf', checked: CHECKED, label: 'IEP Global Peace Index 2026' } },
    { key: 'gdp-per-capita', value: 90_027, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/USA/indicator/NY.GDP.PCAP.CD?format=json&mrv=3', checked: CHECKED, label: 'World Bank NY.GDP.PCAP.CD' } },
    { key: 'unemployment', value: 4.2, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/USA/indicator/SL.UEM.TOTL.ZS?format=json&mrv=3', checked: CHECKED, label: 'World Bank SL.UEM.TOTL.ZS (ILO modelled)' } },
    { key: 'innovation', rank: 3, of: 139, year: 2026, source: { url: 'https://www.wipo.int/en/web/global-innovation-index/2026/index', checked: CHECKED, label: 'WIPO Global Innovation Index 2026' } },
    { key: 'passport', rank: 10, value: 180, unit: 'destinations', year: 2026, source: { url: 'https://www.henleyglobal.com/passport-index/ranking', checked: CHECKED, label: 'Henley Passport Index 2026' } },
    { key: 'tax-top-rate', value: 37, unit: '% federal (plus state)', year: 2026, source: { url: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill', checked: CHECKED, label: 'IRS tax year 2026 adjustments (above 640,600 USD, single)' } },
  ],
};
