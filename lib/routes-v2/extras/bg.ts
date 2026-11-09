// Bulgaria: route depth and country profile (spec 2026-10-27). Figures read on
// official pages on 9 Nov 2026: MIG (startup visa service, Ordinance, NIMS
// guidelines), the Foreigners Act consolidated to SG 79/2024 (MFA copy), the
// Bulgarian Citizenship Act (iisda.government.bg copy, to SG 55/2026), the
// Employment Agency (Blue Card), the ECB (euro). No Gemini notebook exists for
// Bulgaria, so `media` is empty. Research: docs/research/app-v3/bg.md.
// Leva are converted at the fixed rate BGN 1.95583 = EUR 1.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const MIG_SERVICE = 'https://www.mig.government.bg/3263-issuance-of-a-sertificate-for-a-high-tech-and-or-innovative-project-startup-visa/?lang=en';
const MIG_NEWS = 'https://www.mig.government.bg/upcoming-events/the-ministry-of-innovation-and-growth-will-issue-startup-visa-for-high-tech-and-innovative-projects/?lang=en';
const ORDINANCE = 'https://www.mig.government.bg/wp-content/uploads/2022/11/ordinance-on-the-terms-and-conditions-for-issuing.docx';
const NIMS_GUIDE = 'https://www.mig.government.bg/wp-content/uploads/2022/11/guidelines-on-how-to-complete-the-online-application-form-2.docx';
const NIMS = 'https://enims.egov.bg/en';
const ACT =
  'https://www.mfa.bg/upload/138160/%D0%97%D0%B0%D0%BA%D0%BE%D0%BD%20%D0%B7%D0%B0%20%D1%87%D1%83%D0%B6%D0%B4%D0%B5%D0%BD%D1%86%D0%B8%D1%82%D0%B5%20%D0%B2%20%D0%A0%D0%B5%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D0%BA%D0%B0%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F.pdf';
const VISA = 'https://www.mfa.bg/en/services-travel/consular-services/travel-bulgaria/visa-bulgaria';
const VISA_D = 'https://www.mfa.bg/upload/716/VISA_TYPE_D.pdf';
const BLUE = 'https://www.az.government.bg/pages/visokokvalificirana-zaetost-sinia-karta/';
const CIT = 'https://iisda.government.bg/adm_services/service_regulatory_file/20082_213644';
const MIN_WAGE = 'https://www.strategy.bg/bg/public-consultations/11485/export';
const INVESTBG = 'https://investbg.government.bg/';

const CITIZENSHIP_NOTE = {
  en: 'Citizenship by naturalisation: at least five years after receiving a permanent (or EU long-term) residence permit, an income or occupation to live on, Bulgarian language (tested under a Ministry of Education ordinance), no conviction for an intentional crime, and release from your current citizenship. Spouses of Bulgarians, EU/EEA/Swiss citizens and nationals of treaty countries keep theirs.',
  fa: 'تابعیت از راه تابعیت‌پذیری: دست‌کم پنج سال پس از گرفتن اقامت دائم (یا اقامت طولانی‌مدت اتحادیه‌ی اروپا)، درآمد یا شغلی برای گذران زندگی، زبان بلغاری (با آزمونی که آیین‌نامه‌ی وزارت آموزش تعیین می‌کند)، نداشتن محکومیت برای جرم عمدی، و ترک تابعیت فعلی. همسران شهروندان بلغار، شهروندان اتحادیه‌ی اروپا و فضای اقتصادی اروپا و سوئیس، و اتباع کشورهای طرف معاهده تابعیت خود را نگه می‌دارند.',
};

const LANGUAGE = {
  en: 'None for the permits. Bulgarian for citizenship.',
  fa: 'برای اقامت لازم نیست. برای تابعیت، زبان بلغاری.',
};

const TIMELINE: Timeline = {
  prAfterYears: 5,
  citizenshipAfterYears: 10,
  dualCitizenship: 'restricted',
  language: LANGUAGE,
  note: CITIZENSHIP_NOTE,
  source: CIT,
};

const VISA_D_DOCS = [
  { key: 'passport', label: { en: 'Passport issued within the last 10 years, valid at least three months beyond your stay, with two blank pages', fa: 'گذرنامه‌ی صادرشده در ۱۰ سال اخیر، با دست‌کم سه ماه اعتبار پس از اقامت و دو صفحه‌ی خالی' }, stage: 'visa' as const },
  { key: 'housing', label: { en: 'Proof of housing in Bulgaria', fa: 'مدرک محل سکونت در بلغارستان' }, stage: 'visa' as const },
  { key: 'insurance', label: { en: 'Compulsory health insurance', fa: 'بیمه‌ی درمانی اجباری' }, stage: 'visa' as const },
  { key: 'means', label: { en: 'Means of at least the minimum monthly wage for the period of stay', fa: 'منابع مالی دست‌کم به اندازه‌ی حداقل دستمزد ماهانه برای مدت اقامت' }, stage: 'visa' as const },
  { key: 'record', label: { en: 'Criminal record certificate (over 18, first application)', fa: 'گواهی عدم سوءپیشینه (بالای ۱۸ سال، درخواست اول)' }, stage: 'visa' as const },
];

export const EXTRAS_BG: Record<string, RouteExtras> = {
  'bg-startup-visa': {
    founders: { min: 1, max: 3 },
    funds: [
      { key: 'funds', label: { en: 'Three minimum wages held 30 days (applicant)', fa: 'سه برابر حداقل دستمزد، ۳۰ روز در حساب (متقاضی)' }, amount: 1_860.6, currency: 'EUR', basis: 'once', per: 'person', kind: 'show', source: MIN_WAGE },
      { key: 'certificate', label: { en: 'Certificate fee', fa: 'هزینه‌ی گواهی' }, amount: 0, currency: 'EUR', basis: 'once', per: 'household', kind: 'spend', source: ORDINANCE },
    ],
    steps: [
      {
        key: 'prepare',
        title: { en: 'Prepare the file and the signature', fa: 'پرونده و امضا را آماده کنید' },
        detail: {
          en: 'Business plan and presentation, a monthly three-year forecast, a bank document for 30 days of funds, legalised Bulgarian translations, and a qualified electronic signature.',
          fa: 'بیزینس‌پلن و ارائه، پیش‌بینی مالی ماهانه‌ی سه‌ساله، مدرک بانکی ۳۰ روزه‌ی تمکن، ترجمه‌ی رسمی و قانونی‌شده به بلغاری، و امضای الکترونیکی واجد شرایط.',
        },
        link: ORDINANCE,
      },
      {
        key: 'nims',
        title: { en: 'Fill in the form in NIMS', fa: 'فرم را در سامانه‌ی NIMS پر کنید' },
        detail: {
          en: 'Register, choose MIG’s procedure BG-177549112-2023-01, set the period to 12 months and the budget to exactly 0.00, add the team and upload the attachments.',
          fa: 'ثبت‌نام کنید، رویه‌ی BG-177549112-2023-01 وزارت نوآوری و رشد را انتخاب کنید، مدت را ۱۲ ماه و بودجه را دقیقاً ۰٫۰۰ بزنید، تیم را وارد و پیوست‌ها را بارگذاری کنید.',
        },
        link: NIMS,
      },
      {
        key: 'sign',
        title: { en: 'Sign and submit', fa: 'امضا کنید و ثبت نهایی کنید' },
        detail: {
          en: 'Download the .suni file, sign it with a detached signature (.p7s), upload the signature and submit.',
          fa: 'فایل ‎.suni را دانلود کنید، با امضای جدا (‎.p7s) امضا کنید، امضا را بارگذاری و درخواست را ثبت کنید.',
        },
        link: NIMS_GUIDE,
      },
      {
        key: 'council',
        title: { en: 'Expert council and the minister’s decision', fa: 'بررسی شورای کارشناسان و تصمیم وزیر' },
        detail: {
          en: 'The council scores the file; at least 8 of 14 points are needed. You get 14 days to fix gaps. The decision is notified within 7 days and can be appealed.',
          fa: 'شورا پرونده را امتیاز می‌دهد و دست‌کم ۸ از ۱۴ لازم است. برای رفع نقص ۱۴ روز وقت دارید. تصمیم ظرف ۷ روز ابلاغ می‌شود و قابل اعتراض است.',
        },
        takes: { en: '30 days', fa: '۳۰ روز' },
        link: MIG_SERVICE,
      },
      {
        key: 'visa-d',
        title: { en: 'Apply for a type D visa', fa: 'برای ویزای D اقدام کنید' },
        detail: {
          en: 'At the Bulgarian mission where you permanently reside, in person, with the certificate and the D-visa documents.',
          fa: 'در نمایندگی بلغارستان در کشور محل اقامت دائم‌تان، حضوری، با گواهی و مدارک ویزای D.',
        },
        link: VISA,
      },
      {
        key: 'company',
        title: { en: 'Take at least 50% of a Bulgarian company', fa: 'دست‌کم ۵۰ درصد یک شرکت بلغاری را بگیرید' },
        detail: {
          en: 'After the D visa, become a partner or shareholder owning at least 50% of a company whose business is the one in the certificate.',
          fa: 'پس از ویزای D، شریک یا سهام‌دار شرکتی شوید که دست‌کم ۵۰ درصدش مال شماست و فعالیتش همان حوزه‌ی گواهی است.',
        },
        link: ACT,
      },
      {
        key: 'residence',
        title: { en: 'Apply for the residence permit, then extend', fa: 'اجازه‌ی اقامت بگیرید و بعد تمدید کنید' },
        detail: {
          en: 'Apply to the Migration Directorate. In the certificate’s last month, report progress to MIG with proof of the 50% stake to extend it by two years.',
          fa: 'درخواست را به اداره‌ی مهاجرت بدهید. در ماه آخر اعتبار گواهی، گزارش پیشرفت را با مدرک سهم ۵۰ درصدی به MIG بدهید تا دو سال تمدید شود.',
        },
        link: ORDINANCE,
      },
    ],
    documents: [
      { key: 'id', label: { en: 'Copy of your identity document with photo (mandatory)', fa: 'کپی مدرک هویتی با عکس (اجباری)' }, stage: 'apply' },
      { key: 'plan', label: { en: 'Business plan and project presentation (mandatory)', fa: 'بیزینس‌پلن و ارائه‌ی پروژه (اجباری)' }, stage: 'apply' },
      { key: 'bank', label: { en: 'Bank document: three minimum wages for 30 consecutive days (mandatory)', fa: 'مدرک بانکی: سه برابر حداقل دستمزد برای ۳۰ روز پیاپی (اجباری)' }, stage: 'apply' },
      { key: 'patent', label: { en: 'Valid patent or utility model for the EU, US or an OECD country, if any', fa: 'پتنت یا مدل کاربردی معتبر در اتحادیه‌ی اروپا، آمریکا یا کشورهای OECD، در صورت وجود' }, stage: 'apply' },
      { key: 'fund', label: { en: 'Investment contract or letter of intent from a venture fund (BGN 100,000), with the fund’s recommendation for an international fund, if any', fa: 'قرارداد یا نامه‌ی قصد سرمایه‌گذاری از صندوق خطرپذیر (۱۰۰٬۰۰۰ لِو)، و برای صندوق بین‌المللی توصیه‌نامه‌ی صندوق، در صورت وجود' }, stage: 'apply' },
      { key: 'awards', label: { en: 'Seal of Excellence, an EC or ESA innovation award, or two Q1/Q2 papers, if any', fa: 'نشان Seal of Excellence، جایزه‌ی نوآوری کمیسیون اروپا یا ESA، یا دو مقاله‌ی Q1/Q2، در صورت وجود' }, stage: 'apply' },
      { key: 'sales', label: { en: 'Proof of sales of BGN 100,000 over two years, if any', fa: 'مدرک فروش ۱۰۰٬۰۰۰ لِو در دو سال، در صورت وجود' }, stage: 'apply' },
      { key: 'partners', label: { en: 'Degree certificate and letters from Bulgarian partners, if any', fa: 'مدرک تحصیلی و نامه‌ی همکاری با شرکای بلغاری، در صورت وجود' }, stage: 'apply' },
      { key: 'translation', label: { en: 'Legalised Bulgarian translations of English documents', fa: 'ترجمه‌ی رسمی و قانونی‌شده‌ی مدارک انگلیسی به بلغاری' }, stage: 'apply' },
      ...VISA_D_DOCS,
      { key: 'stake', label: { en: 'Proof of at least 50% of a Bulgarian company', fa: 'مدرک مالکیت دست‌کم ۵۰ درصد شرکت بلغاری' }, stage: 'renewal' },
    ],
    realities: [
      {
        key: 'not-a-visa',
        kind: 'myth',
        title: { en: '“The startup visa lets me move”', fa: '«ویزای استارتاپ یعنی اجازه‌ی مهاجرت»' },
        detail: { en: 'MIG says the certificate alone does not allow relocation; it is one condition for a residence permit, next to the D visa and the company stake.', fa: 'خود MIG می‌گوید گواهی به‌تنهایی اجازه‌ی جابه‌جایی نمی‌دهد؛ یکی از شرط‌های اجازه‌ی اقامت است، کنار ویزای D و سهم شرکت.' },
        source: MIG_NEWS,
      },
      {
        key: 'no-investment',
        kind: 'myth',
        title: { en: '“You need €51,000”', fa: '«باید ۵۱ هزار یورو داشته باشید»' },
        detail: { en: 'BGN 100,000 of sales or of venture investment each earns one optional point. The only required money is three minimum wages for 30 days.', fa: 'فروش یا سرمایه‌گذاری خطرپذیر ۱۰۰٬۰۰۰ لِویی هر کدام فقط یک امتیاز اختیاری دارد. تنها پول الزامی، سه حداقل دستمزد برای ۳۰ روز است.' },
        source: ORDINANCE,
      },
      {
        key: 'signature',
        kind: 'challenge',
        title: { en: 'The qualified e-signature comes first', fa: 'امضای الکترونیکی واجد شرایط، قدم اول' },
        detail: { en: 'NIMS accepts the application only with a qualified electronic signature as a detached .p7s file.', fa: 'سامانه‌ی NIMS درخواست را فقط با امضای الکترونیکی واجد شرایط به‌صورت فایل جدای ‎.p7s می‌پذیرد.' },
        source: NIMS_GUIDE,
      },
      {
        key: 'order',
        kind: 'tip',
        title: { en: 'Company after the visa', fa: 'شرکت پس از ویزا' },
        detail: { en: 'Article 24p gives the permit to someone who became a partner or shareholder after the long-stay visa was issued.', fa: 'ماده‌ی ۲۴p اجازه‌ی اقامت را به کسی می‌دهد که پس از صدور ویزای اقامت طولانی شریک یا سهام‌دار شده باشد.' },
        source: ACT,
      },
      {
        key: 'fifty',
        kind: 'challenge',
        title: { en: 'The 50% line limits fundraising', fa: 'خط ۵۰ درصد، جذب سرمایه را محدود می‌کند' },
        detail: { en: 'Changes must be reported within 7 days; a change that breaks the 50% condition is grounds to revoke the certificate and the residence.', fa: 'هر تغییر باید ظرف ۷ روز گزارش شود؛ تغییری که شرط ۵۰ درصد را از بین ببرد، دلیل ابطال گواهی و اقامت است.' },
        source: ORDINANCE,
      },
    ],
    timeline: TIMELINE,
    quiz: [
      {
        key: 'pass',
        q: { en: 'How many points do you need to pass?', fa: 'برای قبولی چند امتیاز لازم است؟' },
        options: [{ en: '6 of 14', fa: '۶ از ۱۴' }, { en: '8 of 14', fa: '۸ از ۱۴' }, { en: '10 of 14', fa: '۱۰ از ۱۴' }],
        answer: 1,
        why: { en: 'The Ordinance sets a minimum of 8 out of a maximum of 14.', fa: 'آیین‌نامه حداقل ۸ از حداکثر ۱۴ را تعیین کرده است.' },
      },
      {
        key: 'funds',
        q: { en: 'What is the only money you must show for the certificate?', fa: 'تنها پولی که برای گواهی باید نشان دهید چیست؟' },
        options: [{ en: 'Three minimum wages for 30 days', fa: 'سه حداقل دستمزد برای ۳۰ روز' }, { en: '€51,129 of investment', fa: '۵۱٬۱۲۹ یورو سرمایه‌گذاری' }, { en: '€25,000 of capital', fa: '۲۵٬۰۰۰ یورو سرمایه' }],
        answer: 0,
        why: { en: '€1,860.60 in 2026, held at least 30 consecutive days before filing.', fa: '۱٬۸۶۰٫۶۰ یورو در ۲۰۲۶، دست‌کم ۳۰ روز پیاپی پیش از ثبت.' },
      },
      {
        key: 'fee',
        q: { en: 'How much does the certificate cost?', fa: 'هزینه‌ی گواهی چقدر است؟' },
        options: [{ en: 'Nothing', fa: 'رایگان' }, { en: '€100', fa: '۱۰۰ یورو' }, { en: '€500', fa: '۵۰۰ یورو' }],
        answer: 0,
        why: { en: 'Issuing and extending it are free (art. 14).', fa: 'صدور و تمدید رایگان است (ماده‌ی ۱۴).' },
      },
      {
        key: 'stake',
        q: { en: 'What share of the Bulgarian company must you own?', fa: 'چند درصد شرکت بلغاری باید مال شما باشد؟' },
        options: [{ en: '25%', fa: '۲۵ درصد' }, { en: 'At least 50%', fa: 'دست‌کم ۵۰ درصد' }, { en: '100%', fa: '۱۰۰ درصد' }],
        answer: 1,
        why: { en: 'Article 24p requires at least 50% of the capital.', fa: 'ماده‌ی ۲۴p دست‌کم ۵۰ درصد سرمایه را می‌خواهد.' },
      },
      {
        key: 'validity',
        q: { en: 'How long is the first certificate valid?', fa: 'گواهی اول چه مدت اعتبار دارد؟' },
        options: [{ en: '1 year', fa: '۱ سال' }, { en: '2 years', fa: '۲ سال' }, { en: '3 years', fa: '۳ سال' }],
        answer: 0,
        why: { en: 'One year, then two more on a progress report.', fa: 'یک سال، سپس با گزارش پیشرفت دو سال دیگر.' },
      },
    ],
    media: [],
  },

  'bg-trade-10-jobs': {
    steps: [
      {
        key: 'company',
        title: { en: 'Set up the business under Bulgarian law', fa: 'کسب‌وکار را طبق قانون بلغارستان راه بیندازید' },
        detail: { en: 'The residence ground is commercial activity carried out by the statutory procedure.', fa: 'مبنای اقامت، فعالیت تجاری طبق روال قانونی است.' },
        link: ACT,
      },
      {
        key: 'jobs',
        title: { en: 'Create ten full-time jobs for Bulgarian citizens', fa: 'ده شغل تمام‌وقت برای شهروندان بلغار بسازید' },
        detail: { en: 'Ten per foreign partner and per manager, kept for as long as you stay.', fa: 'ده شغل برای هر شریک و هر مدیر خارجی، در تمام مدت اقامت.' },
        link: ACT,
      },
      {
        key: 'visa-d',
        title: { en: 'Apply for a type D visa', fa: 'برای ویزای D اقدام کنید' },
        detail: { en: 'In person at the Bulgarian mission where you permanently reside.', fa: 'حضوری در نمایندگی بلغارستان در کشور محل اقامت دائم‌تان.' },
        link: VISA,
      },
      {
        key: 'permit',
        title: { en: 'Apply to the Migration Directorate', fa: 'به اداره‌ی مهاجرت درخواست بدهید' },
        detail: { en: 'For the long-term residence permit under art. 24(1)(2), and renew it while the jobs are kept.', fa: 'برای اجازه‌ی اقامت طولانی‌مدت بر پایه‌ی ماده‌ی ۲۴ بند ۱ فقره‌ی ۲، و تمدید آن تا وقتی شغل‌ها حفظ شوند.' },
        link: ACT,
      },
    ],
    documents: [...VISA_D_DOCS],
    realities: [
      {
        key: 'per-partner',
        kind: 'challenge',
        title: { en: 'Ten jobs each, not ten in total', fa: 'ده شغل برای هر نفر، نه روی هم' },
        detail: { en: 'The requirement applies to each partner and each manager separately.', fa: 'این شرط برای هر شریک و هر مدیر جداگانه است.' },
        source: ACT,
      },
      {
        key: 'kept',
        kind: 'challenge',
        title: { en: 'Jobs must last as long as you stay', fa: 'شغل‌ها باید تا آخر اقامت بمانند' },
        detail: { en: 'The jobs must be maintained for the whole period of residence, not only at the start.', fa: 'شغل‌ها باید در تمام دوره‌ی اقامت حفظ شوند، نه فقط در شروع.' },
        source: ACT,
      },
      {
        key: 'startup-cheaper',
        kind: 'tip',
        title: { en: 'Innovative project? Compare the startup visa', fa: 'طرح نوآورانه دارید؟ ویزای استارتاپ را مقایسه کنید' },
        detail: { en: 'The startup route has no job quota, only a 50% stake and three minimum wages of funds.', fa: 'مسیر استارتاپ سهمیه‌ی شغلی ندارد؛ فقط سهم ۵۰ درصدی و تمکنی برابر سه حداقل دستمزد.' },
        source: ORDINANCE,
      },
    ],
    timeline: TIMELINE,
    quiz: [
      {
        key: 'jobs',
        q: { en: 'How many full-time jobs for Bulgarian citizens?', fa: 'چند شغل تمام‌وقت برای شهروندان بلغار؟' },
        options: [{ en: '5', fa: '۵' }, { en: '10', fa: '۱۰' }, { en: '20', fa: '۲۰' }],
        answer: 1,
        why: { en: 'At least ten, kept during the stay.', fa: 'دست‌کم ده، در تمام مدت اقامت.' },
      },
      {
        key: 'partners',
        q: { en: 'Two foreign partners: how many jobs in total?', fa: 'دو شریک خارجی: روی هم چند شغل؟' },
        options: [{ en: '10', fa: '۱۰' }, { en: '20', fa: '۲۰' }],
        answer: 1,
        why: { en: 'The condition applies to each partner separately.', fa: 'شرط برای هر شریک جداگانه است.' },
      },
      {
        key: 'investment',
        q: { en: 'Is there a minimum investment on this route?', fa: 'این مسیر حداقل سرمایه‌گذاری دارد؟' },
        options: [{ en: 'Yes, BGN 500,000', fa: 'بله، ۵۰۰٬۰۰۰ لِو' }, { en: 'No, the test is jobs', fa: 'نه، معیار شغل است' }],
        answer: 1,
        why: { en: 'Article 24(1)(2) sets jobs, not an amount.', fa: 'ماده‌ی ۲۴ بند ۱ فقره‌ی ۲ شغل را شرط کرده، نه مبلغ.' },
      },
      {
        key: 'visa',
        q: { en: 'Which visa comes before the permit?', fa: 'پیش از اجازه‌ی اقامت کدام ویزا لازم است؟' },
        options: [{ en: 'Schengen C visa', fa: 'ویزای شنگن C' }, { en: 'Type D visa', fa: 'ویزای D' }],
        answer: 1,
        why: { en: 'Long-term permits need a visa under art. 15(1), the type D.', fa: 'اقامت طولانی‌مدت ویزای ماده‌ی ۱۵ بند ۱، یعنی ویزای D، می‌خواهد.' },
      },
      {
        key: 'pr',
        q: { en: 'When can you apply for permanent residence?', fa: 'کی می‌توانید اقامت دائم بخواهید؟' },
        options: [{ en: 'After 3 years', fa: 'پس از ۳ سال' }, { en: 'After 5 years', fa: 'پس از ۵ سال' }, { en: 'After 10 years', fa: 'پس از ۱۰ سال' }],
        answer: 1,
        why: { en: 'Five years of lawful, continuous residence with at most 30 months away.', fa: 'پنج سال اقامت قانونی و پیوسته با حداکثر ۳۰ ماه غیبت.' },
      },
    ],
    media: [],
  },

  'bg-investor-pr': {
    funds: [
      { key: 'investment', label: { en: 'Capital contribution (BGN 500,000)', fa: 'آورده‌ی سرمایه (۵۰۰٬۰۰۰ لِو)' }, amount: 255_645.94, currency: 'EUR', basis: 'once', per: 'person', kind: 'invest', source: ACT },
    ],
    steps: [
      {
        key: 'invest',
        title: { en: 'Invest in the company’s capital', fa: 'در سرمایه‌ی شرکت سرمایه‌گذاری کنید' },
        detail: { en: 'At least BGN 500,000 into a Bulgarian company you own at least 50% of, as a partner or registered shareholder.', fa: 'دست‌کم ۵۰۰٬۰۰۰ لِو در شرکتی بلغاری که دست‌کم ۵۰ درصدش مال شماست، به‌عنوان شریک یا سهام‌دار با نام.' },
        link: ACT,
      },
      {
        key: 'assets-jobs',
        title: { en: 'Buy the assets and create the jobs', fa: 'دارایی را بخرید و شغل‌ها را بسازید' },
        detail: { en: 'New fixed assets of at least BGN 500,000 and at least ten jobs for Bulgarian citizens.', fa: 'دارایی ثابت تازه دست‌کم ۵۰۰٬۰۰۰ لِو و دست‌کم ده شغل برای شهروندان بلغار.' },
        link: ACT,
      },
      {
        key: 'mig',
        title: { en: 'Get MIG’s certificate', fa: 'گواهی MIG را بگیرید' },
        detail: { en: 'Issued on the company’s reasoned opinion that your residence is needed for the investment.', fa: 'بر پایه‌ی توضیح مستدل شرکت درباره‌ی لزوم اقامت شما برای سرمایه‌گذاری صادر می‌شود.' },
        link: ACT,
      },
      {
        key: 'apply',
        title: { en: 'Apply in person for permanent residence', fa: 'حضوری اقامت دائم بخواهید' },
        detail: { en: 'At the Migration Directorate or its regional office.', fa: 'در اداره‌ی مهاجرت یا شعبه‌ی استانی آن.' },
        takes: { en: 'Two months; longer in complex cases', fa: 'دو ماه؛ در پرونده‌های پیچیده بیشتر' },
        link: ACT,
      },
    ],
    documents: [
      { key: 'mig', label: { en: 'MIG certificate of the investment, jobs and need for your residence', fa: 'گواهی MIG درباره‌ی سرمایه‌گذاری، شغل‌ها و لزوم اقامت شما' }, stage: 'permit' },
      ...VISA_D_DOCS,
    ],
    realities: [
      {
        key: 'pr-direct',
        kind: 'tip',
        title: { en: 'Permanent from day one', fa: 'دائم از روز اول' },
        detail: { en: 'Article 25(1)(16) grants permanent residence, not a renewable one-year permit.', fa: 'ماده‌ی ۲۵ بند ۱ فقره‌ی ۱۶ اقامت دائم می‌دهد، نه اقامت یک‌ساله‌ی قابل تمدید.' },
        source: ACT,
      },
      {
        key: 'jobs',
        kind: 'challenge',
        title: { en: 'Money is not enough', fa: 'پول به‌تنهایی کافی نیست' },
        detail: { en: 'Ten jobs for Bulgarian citizens must be kept for the duration of residence.', fa: 'ده شغل برای شهروندان بلغار باید در تمام مدت اقامت حفظ شود.' },
        source: ACT,
      },
      {
        key: 'region',
        kind: 'tip',
        title: { en: 'A smaller amount in poorer regions', fa: 'مبلغ کمتر در مناطق کم‌برخوردار' },
        detail: { en: 'BGN 250,000 (€127,822.97) with five jobs in an economically disadvantaged region gives long-term (not permanent) residence.', fa: '۲۵۰٬۰۰۰ لِو (۱۲۷٬۸۲۲٫۹۷ یورو) با پنج شغل در منطقه‌ی کم‌برخوردار، اقامت طولانی‌مدت می‌دهد (نه دائم).' },
        source: ACT,
      },
    ],
    timeline: { ...TIMELINE, prAfterYears: 0, citizenshipAfterYears: 5 },
    quiz: [
      {
        key: 'amount',
        q: { en: 'Minimum capital contribution?', fa: 'حداقل آورده‌ی سرمایه؟' },
        options: [{ en: 'BGN 250,000', fa: '۲۵۰٬۰۰۰ لِو' }, { en: 'BGN 500,000', fa: '۵۰۰٬۰۰۰ لِو' }, { en: 'BGN 1,000,000', fa: '۱٬۰۰۰٬۰۰۰ لِو' }],
        answer: 1,
        why: { en: 'BGN 500,000, about €255,646.', fa: '۵۰۰٬۰۰۰ لِو، حدود ۲۵۵٬۶۴۶ یورو.' },
      },
      {
        key: 'jobs',
        q: { en: 'How many jobs for Bulgarian citizens?', fa: 'چند شغل برای شهروندان بلغار؟' },
        options: [{ en: '5', fa: '۵' }, { en: '10', fa: '۱۰' }, { en: 'None', fa: 'هیچ' }],
        answer: 1,
        why: { en: 'At least ten, kept during residence.', fa: 'دست‌کم ده، در تمام مدت اقامت.' },
      },
      {
        key: 'stake',
        q: { en: 'Minimum ownership of the company?', fa: 'حداقل سهم مالکیت شرکت؟' },
        options: [{ en: '10%', fa: '۱۰ درصد' }, { en: '50%', fa: '۵۰ درصد' }, { en: '100%', fa: '۱۰۰ درصد' }],
        answer: 1,
        why: { en: 'At least 50% of the capital.', fa: 'دست‌کم ۵۰ درصد سرمایه.' },
      },
      {
        key: 'who',
        q: { en: 'Who certifies the investment?', fa: 'سرمایه‌گذاری را چه نهادی گواهی می‌کند؟' },
        options: [{ en: 'Ministry of Innovation and Growth', fa: 'وزارت نوآوری و رشد' }, { en: 'Ministry of Foreign Affairs', fa: 'وزارت امور خارجه' }],
        answer: 0,
        why: { en: 'MIG certifies it on the company’s reasoned opinion.', fa: 'MIG بر پایه‌ی توضیح مستدل شرکت گواهی می‌کند.' },
      },
      {
        key: 'decision',
        q: { en: 'Usual decision time for permanent residence?', fa: 'زمان معمول تصمیم برای اقامت دائم؟' },
        options: [{ en: '2 weeks', fa: '۲ هفته' }, { en: '2 months', fa: '۲ ماه' }, { en: '1 year', fa: '۱ سال' }],
        answer: 1,
        why: { en: 'Within two months, longer for complex cases.', fa: 'ظرف دو ماه، در پرونده‌های پیچیده بیشتر.' },
      },
    ],
    media: [],
  },

  'bg-blue-card': {
    steps: [
      {
        key: 'offer',
        title: { en: 'Get a contract of at least six months', fa: 'قرارداد دست‌کم شش‌ماهه بگیرید' },
        detail: { en: 'For highly qualified work, at a salary of at least 1.5 times the national average.', fa: 'برای کار بسیار تخصصی با حقوق دست‌کم ۱٫۵ برابر میانگین کشور.' },
        link: BLUE,
      },
      {
        key: 'diploma',
        title: { en: 'Legalise and translate your qualifications', fa: 'مدارک تحصیلی و حرفه‌ای را قانونی و ترجمه کنید' },
        detail: { en: 'Legalised and with a Bulgarian translation certified by a notary or the MFA Consular Relations Directorate.', fa: 'قانونی‌شده و با ترجمه‌ی بلغاری تأییدشده نزد دفترخانه یا اداره‌ی امور کنسولی وزارت خارجه.' },
        link: ACT,
      },
      {
        key: 'apply',
        title: { en: 'The employer or you apply', fa: 'کارفرما یا خودتان درخواست بدهید' },
        detail: { en: 'At the Migration Directorate; the Employment Agency gives its opinion within 10 days.', fa: 'در اداره‌ی مهاجرت؛ آژانس کاریابی ظرف ۱۰ روز نظر می‌دهد.' },
        takes: { en: 'Up to three months in all', fa: 'روی هم حداکثر سه ماه' },
        link: BLUE,
      },
      {
        key: 'visa-d',
        title: { en: 'Enter on a type D visa and collect the card', fa: 'با ویزای D وارد شوید و کارت را بگیرید' },
        detail: { en: 'The card is issued for 24 months to 5 years, or the contract term plus three months.', fa: 'کارت برای ۲۴ ماه تا ۵ سال یا مدت قرارداد به‌علاوه‌ی سه ماه صادر می‌شود.' },
        link: VISA,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport copy (photo and data pages)', fa: 'کپی گذرنامه (صفحه‌ی عکس و مشخصات)' }, stage: 'permit' },
      { key: 'record', label: { en: 'Criminal record certificate (first application)', fa: 'گواهی عدم سوءپیشینه (درخواست اول)' }, stage: 'permit' },
      { key: 'housing', label: { en: 'Proof of housing', fa: 'مدرک محل سکونت' }, stage: 'permit' },
      { key: 'justification', label: { en: 'Employer’s reasoned statement on hiring a foreign worker', fa: 'توضیح مستدل کارفرما برای استخدام نیروی خارجی' }, stage: 'permit' },
      { key: 'qualifications', label: { en: 'Legalised, translated proof of education and experience', fa: 'مدارک قانونی‌شده و ترجمه‌شده‌ی تحصیل و تجربه' }, stage: 'permit' },
      { key: 'contract', label: { en: 'Signed employment contract and job description', fa: 'قرارداد کار امضاشده و شرح شغل' }, stage: 'permit' },
      { key: 'declaration', label: { en: 'Employer’s declaration on equal pay and conditions', fa: 'اظهارنامه‌ی کارفرما درباره‌ی برابری حقوق و شرایط' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'no-figure',
        kind: 'tip',
        title: { en: 'Check the salary floor with your employer', fa: 'کف حقوق را با کارفرما چک کنید' },
        detail: { en: 'The floor is 1.5 times the average gross salary of the latest 12 months, so it moves; the Employment Agency page gives no euro figure.', fa: 'کف حقوق ۱٫۵ برابر میانگین حقوق ناخالص ۱۲ ماه اخیر است و تغییر می‌کند؛ صفحه‌ی آژانس کاریابی رقم یورویی نمی‌دهد.' },
        source: BLUE,
      },
      {
        key: 'experience',
        kind: 'myth',
        title: { en: '“No degree, no Blue Card”', fa: '«بدون مدرک دانشگاهی، کارت آبی نمی‌شود»' },
        detail: { en: 'Five years of experience at a level comparable to a degree also qualifies; for some ICT roles, three years in the last seven.', fa: 'پنج سال تجربه در سطحی هم‌تراز مدرک دانشگاهی هم کافی است؛ برای برخی نقش‌های فناوری اطلاعات، سه سال در هفت سال اخیر.' },
        source: BLUE,
      },
      {
        key: 'translations',
        kind: 'challenge',
        title: { en: 'Legalised translations take time', fa: 'ترجمه‌ی قانونی‌شده زمان می‌برد' },
        detail: { en: 'Education and experience documents must be legalised and translated into Bulgarian with a certified translation.', fa: 'مدارک تحصیل و تجربه باید قانونی و با ترجمه‌ی رسمی به بلغاری ارائه شوند.' },
        source: ACT,
      },
    ],
    timeline: TIMELINE,
    quiz: [
      {
        key: 'salary',
        q: { en: 'What is the salary floor?', fa: 'کف حقوق چقدر است؟' },
        options: [{ en: 'The minimum wage', fa: 'حداقل دستمزد' }, { en: '1.5 × the average gross salary', fa: '۱٫۵ برابر میانگین حقوق ناخالص' }, { en: '3 × the average', fa: '۳ برابر میانگین' }],
        answer: 1,
        why: { en: 'At least 1.5 times the average gross salary in Bulgaria.', fa: 'دست‌کم ۱٫۵ برابر میانگین حقوق ناخالص بلغارستان.' },
      },
      {
        key: 'contract',
        q: { en: 'Minimum contract length?', fa: 'حداقل مدت قرارداد؟' },
        options: [{ en: '3 months', fa: '۳ ماه' }, { en: '6 months', fa: '۶ ماه' }, { en: '12 months', fa: '۱۲ ماه' }],
        answer: 1,
        why: { en: 'At least six months.', fa: 'دست‌کم شش ماه.' },
      },
      {
        key: 'experience',
        q: { en: 'Without a degree, how much experience usually counts?', fa: 'بدون مدرک دانشگاهی معمولاً چند سال تجربه لازم است؟' },
        options: [{ en: '2 years', fa: '۲ سال' }, { en: '5 years', fa: '۵ سال' }, { en: '10 years', fa: '۱۰ سال' }],
        answer: 1,
        why: { en: 'Five years at a level comparable to higher education.', fa: 'پنج سال در سطح هم‌تراز آموزش عالی.' },
      },
      {
        key: 'validity',
        q: { en: 'How long can the card be issued for?', fa: 'کارت حداکثر برای چه مدت صادر می‌شود؟' },
        options: [{ en: 'Up to 2 years', fa: 'تا ۲ سال' }, { en: 'Up to 5 years', fa: 'تا ۵ سال' }],
        answer: 1,
        why: { en: '24 months to 5 years.', fa: 'از ۲۴ ماه تا ۵ سال.' },
      },
      {
        key: 'time',
        q: { en: 'Maximum length of the whole procedure?', fa: 'حداکثر مدت کل روند؟' },
        options: [{ en: '1 month', fa: '۱ ماه' }, { en: '3 months', fa: '۳ ماه' }, { en: '6 months', fa: '۶ ماه' }],
        answer: 1,
        why: { en: 'Three months, plus 15 days in complex cases.', fa: 'سه ماه، و در پرونده‌های پیچیده ۱۵ روز بیشتر.' },
      },
    ],
    media: [],
  },

  'bg-study': {
    funds: [
      { key: 'month', label: { en: 'Means per month of stay (minimum wage, 2026)', fa: 'منابع مالی برای هر ماه اقامت (حداقل دستمزد ۲۰۲۶)' }, amount: 620.2, currency: 'EUR', basis: 'month', per: 'person', kind: 'show', source: ACT },
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get admitted and obtain the ministry’s certificate', fa: 'پذیرش بگیرید و گواهی وزارتخانه را دریافت کنید' },
        detail: { en: 'Full-time admission to a Bulgarian higher education institution, with a Ministry of Education and Science certificate of admission.', fa: 'پذیرش تمام‌وقت در دانشگاه بلغاری، همراه با گواهی پذیرش وزارت آموزش و علوم.' },
        link: ACT,
      },
      {
        key: 'visa-d',
        title: { en: 'Apply for a type D visa', fa: 'برای ویزای D اقدام کنید' },
        detail: { en: 'Students can get a D visa valid up to one year with a right to stay up to 360 days.', fa: 'دانشجو می‌تواند ویزای D تا یک سال با حق اقامت تا ۳۶۰ روز بگیرد.' },
        link: VISA_D,
      },
      {
        key: 'permit',
        title: { en: 'Apply for the residence permit after arrival', fa: 'پس از ورود برای اجازه‌ی اقامت درخواست بدهید' },
        detail: { en: 'At the Migration Directorate, with housing, insurance, means and proof of the enrolment fee paid.', fa: 'در اداره‌ی مهاجرت، با مدرک سکونت، بیمه، منابع مالی و رسید پرداخت شهریه‌ی ثبت‌نام.' },
        link: ACT,
      },
      {
        key: 'renew',
        title: { en: 'Renew each year', fa: 'هر سال تمدید کنید' },
        detail: { en: 'Apply within the 14 days before expiry; extensions are decided within 14 days.', fa: 'در ۱۴ روز پیش از پایان اعتبار درخواست بدهید؛ تمدید ظرف ۱۴ روز تصمیم گرفته می‌شود.' },
        link: ACT,
      },
      {
        key: 'after',
        title: { en: 'Stay up to nine months to look for work', fa: 'تا نه ماه برای کاریابی بمانید' },
        detail: { en: 'Apply at least 30 days before your permit ends and register with the Employment Agency within 7 working days of finishing.', fa: 'دست‌کم ۳۰ روز پیش از پایان اقامت درخواست بدهید و ظرف ۷ روز کاری پس از پایان تحصیل در آژانس کاریابی ثبت‌نام کنید.' },
        link: ACT,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport with the D visa and last entry stamp', fa: 'گذرنامه با ویزای D و مهر آخرین ورود' }, stage: 'permit' },
      { key: 'housing', label: { en: 'Proof of housing', fa: 'مدرک محل سکونت' }, stage: 'permit' },
      { key: 'insurance', label: { en: 'Compulsory health insurance', fa: 'بیمه‌ی درمانی اجباری' }, stage: 'permit' },
      { key: 'means', label: { en: 'Means of at least the minimum monthly wage for the stay', fa: 'منابع مالی دست‌کم به اندازه‌ی حداقل دستمزد ماهانه برای مدت اقامت' }, stage: 'permit' },
      { key: 'record', label: { en: 'Criminal record certificate (first application)', fa: 'گواهی عدم سوءپیشینه (درخواست اول)' }, stage: 'permit' },
      { key: 'admission', label: { en: 'Ministry of Education and Science admission certificate and the university’s enrolment certificate', fa: 'گواهی پذیرش وزارت آموزش و علوم و گواهی ثبت‌نام دانشگاه' }, stage: 'permit' },
      { key: 'fee', label: { en: 'Proof the enrolment fee is paid', fa: 'رسید پرداخت شهریه‌ی ثبت‌نام' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'half',
        kind: 'challenge',
        title: { en: 'Study years count half', fa: 'سال‌های تحصیل نصف حساب می‌شوند' },
        detail: { en: 'Only half of the time on a student permit counts toward the five years for permanent residence.', fa: 'فقط نیمی از دوران اقامت دانشجویی در پنج سال لازم برای اقامت دائم حساب می‌شود.' },
        source: ACT,
      },
      {
        key: 'low-funds',
        kind: 'tip',
        title: { en: 'Low proof of means', fa: 'تمکن مالی پایین' },
        detail: { en: 'The yardstick is the minimum monthly wage, €620.20 in 2026, for each month of stay.', fa: 'معیار، حداقل دستمزد ماهانه است: ۶۲۰٫۲۰ یورو در ۲۰۲۶ برای هر ماه اقامت.' },
        source: ACT,
      },
      {
        key: 'nine-months',
        kind: 'tip',
        title: { en: 'Nine months after graduation', fa: 'نه ماه پس از فارغ‌التحصیلی' },
        detail: { en: 'Graduates can get a permit for up to nine months to look for work, if they register with the Employment Agency in time.', fa: 'فارغ‌التحصیل می‌تواند تا نه ماه اقامت کاریابی بگیرد، به شرطی که به‌موقع در آژانس کاریابی ثبت‌نام کند.' },
        source: ACT,
      },
    ],
    timeline: {
      ...TIMELINE,
      note: {
        en: 'Student years count at half toward the five years for permanent residence. ' + CITIZENSHIP_NOTE.en,
        fa: 'سال‌های دانشجویی با نصف وزن در پنج سال لازم برای اقامت دائم حساب می‌شوند. ' + CITIZENSHIP_NOTE.fa,
      },
      source: ACT,
    },
    quiz: [
      {
        key: 'funds',
        q: { en: 'Monthly means a student must show (2026)?', fa: 'تمکن ماهانه‌ی دانشجو (۲۰۲۶)؟' },
        options: [{ en: '€620.20', fa: '۶۲۰٫۲۰ یورو' }, { en: '€1,000', fa: '۱٬۰۰۰ یورو' }, { en: '€1,860.60', fa: '۱٬۸۶۰٫۶۰ یورو' }],
        answer: 0,
        why: { en: 'At least the minimum monthly wage for each month.', fa: 'دست‌کم حداقل دستمزد ماهانه برای هر ماه.' },
      },
      {
        key: 'length',
        q: { en: 'How long is each student permit?', fa: 'هر اقامت دانشجویی چه مدت است؟' },
        options: [{ en: 'Up to 1 year', fa: 'تا ۱ سال' }, { en: 'The whole degree', fa: 'کل دوره' }],
        answer: 0,
        why: { en: 'Up to one year, then renewed.', fa: 'تا یک سال و سپس تمدید.' },
      },
      {
        key: 'after',
        q: { en: 'How long can you stay to look for work after graduating?', fa: 'پس از فارغ‌التحصیلی چه مدت می‌توانید برای کاریابی بمانید؟' },
        options: [{ en: '3 months', fa: '۳ ماه' }, { en: '9 months', fa: '۹ ماه' }, { en: '18 months', fa: '۱۸ ماه' }],
        answer: 1,
        why: { en: 'Up to nine months.', fa: 'تا نه ماه.' },
      },
      {
        key: 'pr',
        q: { en: 'How do study years count for permanent residence?', fa: 'سال‌های تحصیل برای اقامت دائم چطور حساب می‌شوند؟' },
        options: [{ en: 'In full', fa: 'کامل' }, { en: 'At half', fa: 'نصف' }, { en: 'Not at all', fa: 'اصلاً حساب نمی‌شود' }],
        answer: 1,
        why: { en: 'Only half of the student residence is counted.', fa: 'فقط نیمی از اقامت دانشجویی حساب می‌شود.' },
      },
      {
        key: 'who',
        q: { en: 'Who certifies your admission?', fa: 'پذیرش شما را چه نهادی گواهی می‌کند؟' },
        options: [{ en: 'Ministry of Education and Science', fa: 'وزارت آموزش و علوم' }, { en: 'Ministry of Innovation and Growth', fa: 'وزارت نوآوری و رشد' }],
        answer: 0,
        why: { en: 'The Ministry of Education and Science issues the admission certificate.', fa: 'گواهی پذیرش را وزارت آموزش و علوم صادر می‌کند.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_BG: CountryProfile = {
  strengths: [
    { en: 'The startup certificate is free, scored on published criteria and needs only three minimum wages of funds (€1,860.60 in 2026).', fa: 'گواهی استارتاپ رایگان است، با معیارهای منتشرشده امتیاز می‌گیرد و فقط سه حداقل دستمزد تمکن می‌خواهد (۱٬۸۶۰٫۶۰ یورو در ۲۰۲۶).' },
    { en: 'In the euro area since 1 January 2026 and fully in Schengen since 1 January 2025.', fa: 'از اول ژانویه‌ی ۲۰۲۶ عضو منطقه‌ی یورو و از اول ژانویه‌ی ۲۰۲۵ کاملاً در شنگن.' },
    { en: 'A flat 10% corporate and personal income tax.', fa: 'مالیات ثابت ۱۰ درصدی بر درآمد شرکت و شخص.' },
    { en: 'Low unemployment (3.5% in 2025).', fa: 'بیکاری پایین (۳٫۵ درصد در ۲۰۲۵).' },
  ],
  weaknesses: [
    { en: 'Citizenship usually means giving up your current one, and takes about ten years.', fa: 'تابعیت معمولاً با ترک تابعیت فعلی همراه است و حدود ده سال طول می‌کشد.' },
    { en: 'Business routes outside the startup visa need ten jobs for Bulgarian citizens per foreign partner.', fa: 'مسیرهای کسب‌وکار جز ویزای استارتاپ، برای هر شریک خارجی ده شغل برای شهروندان بلغار می‌خواهند.' },
    { en: 'Paperwork is in Bulgarian: legalised translations and a qualified e-signature are needed.', fa: 'کاغذبازی به زبان بلغاری است: ترجمه‌ی قانونی‌شده و امضای الکترونیکی واجد شرایط لازم است.' },
    { en: 'Modest incomes (GDP per head US$20,328 in 2025) and a small home market of about 6.4 million people.', fa: 'درآمد متوسط (تولید سرانه‌ی ۲۰٬۳۲۸ دلار در ۲۰۲۵) و بازار داخلی کوچک با حدود ۶٫۴ میلیون نفر.' },
  ],
  indicators: [
    { key: 'hdi', rank: 55, of: 193, value: 0.845, year: 2023, source: { url: 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Table.xlsx', checked: '2026-11-09', label: 'UNDP HDR 2025 (2023 data)' } },
    { key: 'gdp-per-capita', value: 20_328, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/BGR/indicator/NY.GDP.PCAP.CD?format=json', checked: '2026-11-09', label: 'World Bank' } },
    { key: 'unemployment', value: 3.5, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/BGR/indicator/SL.UEM.TOTL.ZS?format=json', checked: '2026-11-09', label: 'World Bank (ILO estimate)' } },
    { key: 'english', rank: 18, of: 123, year: 2025, source: { url: 'https://www.ef.com/wwen/epi/', checked: '2026-11-09', label: 'EF EPI 2025' } },
    { key: 'tax-top-rate', value: 10, unit: '%', year: 2026, source: { url: INVESTBG, checked: '2026-11-09', label: 'InvestBulgaria Agency: flat corporate and personal income tax' } },
  ],
};
