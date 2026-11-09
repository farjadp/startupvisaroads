// VisaRoads v2 routes, Bulgaria. Checked 9 Nov 2026 on official pages: the
// Ministry of Innovation and Growth (MIG) startup-visa service and Ordinance,
// the Foreigners in the Republic of Bulgaria Act (consolidated to SG 79/2024,
// as published by the Ministry of Foreign Affairs), the Employment Agency's
// Blue Card page, and the ECB's euro changeover page.
// Research: docs/research/app-v3/bg.md. No Gemini notebook for Bulgaria.
// Bulgaria uses the euro since 1 Jan 2026. Laws still written in leva are
// converted at the fixed rate BGN 1.95583 = EUR 1.
import type { RouteV2 } from './types';

const CHECKED = '2026-11-09';

const URL_MIG_SERVICE = 'https://www.mig.government.bg/3263-issuance-of-a-sertificate-for-a-high-tech-and-or-innovative-project-startup-visa/?lang=en';
const URL_MIG_NEWS = 'https://www.mig.government.bg/upcoming-events/the-ministry-of-innovation-and-growth-will-issue-startup-visa-for-high-tech-and-innovative-projects/?lang=en';
const URL_ORDINANCE = 'https://www.mig.government.bg/wp-content/uploads/2022/11/ordinance-on-the-terms-and-conditions-for-issuing.docx';
const URL_NIMS_GUIDE = 'https://www.mig.government.bg/wp-content/uploads/2022/11/guidelines-on-how-to-complete-the-online-application-form-2.docx';
const URL_ACT =
  'https://www.mfa.bg/upload/138160/%D0%97%D0%B0%D0%BA%D0%BE%D0%BD%20%D0%B7%D0%B0%20%D1%87%D1%83%D0%B6%D0%B4%D0%B5%D0%BD%D1%86%D0%B8%D1%82%D0%B5%20%D0%B2%20%D0%A0%D0%B5%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D0%BA%D0%B0%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F.pdf';
const URL_ACT_EN = 'https://www.mig.government.bg/wp-content/uploads/2022/11/foreigners_in_the_republic_of_bulgaria_act.pdf';
const URL_BLUE = 'https://www.az.government.bg/pages/visokokvalificirana-zaetost-sinia-karta/';
const URL_VISA_D = 'https://www.mfa.bg/upload/716/VISA_TYPE_D.pdf';
const URL_EURO = 'https://www.ecb.europa.eu/euro/changeover/bulgaria/html/index.en.html';
const URL_MIN_WAGE = 'https://www.strategy.bg/bg/public-consultations/11485/export';

export const ROUTES_BG: RouteV2[] = [
  {
    key: 'bg-startup-visa',
    country: 'BG',
    family: 'startup',
    name: { en: 'Startup Visa certificate, then a D visa and a residence permit', fa: 'گواهی ویزای استارتاپ بلغارستان، سپس ویزای D و اجازه‌ی اقامت' },
    agency: {
      en: 'Ministry of Innovation and Growth (certificate); Ministry of Interior, Migration Directorate (residence)',
      fa: 'وزارت نوآوری و رشد بلغارستان (MIG) برای گواهی؛ اداره‌ی مهاجرت وزارت کشور برای اقامت',
    },
    status: 'open',
    fact: {
      en: 'An expert council scores your project on six criteria; you need 8 of 14 points. The certificate is free, decided within 30 days and valid one year. The only money required is three Bulgarian minimum wages held for 30 days: €1,860.60 in 2026. After the D visa you must own at least 50% of a Bulgarian company.',
      fa: 'شورای کارشناسان طرح شما را با شش معیار می‌سنجد و از ۱۴ امتیاز دست‌کم ۸ لازم است. گواهی رایگان است، ظرف ۳۰ روز بررسی می‌شود و یک سال اعتبار دارد. تنها پول الزامی، سه برابر حداقل دستمزد بلغارستان است که ۳۰ روز در حساب مانده باشد: ۱٬۸۶۰٫۶۰ یورو در ۲۰۲۶. پس از ویزای D باید دست‌کم ۵۰ درصد یک شرکت بلغاری مال شما باشد.',
    },
    criteria: [
      {
        key: 'points',
        label: { en: 'At least 8 of 14 points from the expert council', fa: 'دست‌کم ۸ امتیاز از ۱۴ امتیاز شورای کارشناسان' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Funds up to 3, three-year monthly forecast up to 3, sales of BGN 100,000 (€51,129.19) over two years 1, a venture fund contract or letter of intent of BGN 100,000 1, patent or utility model 1, business plan and presentation up to 5.',
          fa: 'تمکن تا ۳، پیش‌بینی مالی ماهانه‌ی سه‌ساله تا ۳، فروش ۱۰۰٬۰۰۰ لِو (۵۱٬۱۲۹٫۱۹ یورو) در دو سال ۱، قرارداد یا نامه‌ی قصد سرمایه‌گذاری ۱۰۰٬۰۰۰ لِویی از صندوق خطرپذیر ۱، پتنت یا مدل کاربردی ۱، بیزینس‌پلن و ارائه تا ۵.',
        },
      },
      {
        key: 'innovative',
        label: { en: 'A high-tech or innovative project (patent, utility model, or new to the world or European market)', fa: 'پروژه‌ی فناورانه یا نوآورانه (پتنت، مدل کاربردی، یا نوآوری تازه در بازار جهانی یا اروپا)' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'funds',
        label: { en: 'Three Bulgarian minimum wages in your own account for 30 consecutive days: €1,860.60 (2026)', fa: 'سه برابر حداقل دستمزد بلغارستان، ۳۰ روز پیاپی در حساب شخصی: ۱٬۸۶۰٫۶۰ یورو (۲۰۲۶)' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 1_860.6, currency: 'EUR' },
        note: {
          en: 'A mandatory attachment and the first scoring criterion. 3 × €620.20, the 2026 monthly minimum wage; the wage in force on the filing day counts.',
          fa: 'هم پیوست اجباری است و هم معیار اول امتیاز. ۳ × ۶۲۰٫۲۰ یورو، حداقل دستمزد ماهانه‌ی ۲۰۲۶؛ ملاک، حداقل دستمزدِ روز ثبت درخواست است.',
        },
      },
      {
        key: 'company',
        label: { en: 'After the D visa, own at least 50% of a Bulgarian company in the certified field', fa: 'پس از ویزای D، مالکیت دست‌کم ۵۰ درصد یک شرکت بلغاری در همان حوزه‌ی گواهی' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'signature',
        label: { en: 'A qualified electronic signature to sign the application in NIMS', fa: 'امضای الکترونیکی واجد شرایط برای امضای درخواست در سامانه‌ی NIMS' },
        weight: 1,
        scoreable: false,
        note: {
          en: 'English attachments and an English business plan also need a legalised Bulgarian translation (Ordinance art. 6(5)).',
          fa: 'پیوست‌ها و بیزینس‌پلن انگلیسی هم ترجمه‌ی رسمی و قانونی‌شده به بلغاری می‌خواهند (ماده‌ی ۶ بند ۵ آیین‌نامه).',
        },
      },
    ],
    money: [
      {
        key: 'funds',
        label: { en: 'Personal funds, three minimum wages (2026)', fa: 'تمکن شخصی، سه برابر حداقل دستمزد (۲۰۲۶)' },
        amount: 1_860.6,
        currency: 'EUR',
        basis: 'once',
        shows: {
          en: 'A bank or equivalent document showing the balance for at least 30 consecutive days before the application.',
          fa: 'مدرک بانکی یا معادل آن که موجودی را دست‌کم ۳۰ روز پیاپی پیش از درخواست نشان دهد.',
        },
      },
    ],
    processing: {
      text: {
        en: 'Certificate: the expert council reviews within 30 days; 14 days to fix gaps; the minister’s decision is notified within 7 days. The D visa and residence permit take their own time.',
        fa: 'گواهی: بررسی شورا ظرف ۳۰ روز؛ ۱۴ روز برای رفع نقص؛ ابلاغ تصمیم وزیر ظرف ۷ روز. ویزای D و اجازه‌ی اقامت زمان جداگانه دارند.',
      },
      source: URL_ORDINANCE,
    },
    fees: [{ label: { en: 'Certificate, issue and extension', fa: 'گواهی، صدور و تمدید' }, amount: 0, currency: 'EUR' }],
    pr: {
      en: 'Certificate one year, extended by two on a progress report. Permanent residence after five years of lawful, continuous residence with no more than 30 months away (Foreigners Act art. 25(1)(5)).',
      fa: 'گواهی یک‌ساله است و با گزارش پیشرفت دو سال تمدید می‌شود. اقامت دائم پس از پنج سال اقامت قانونی و پیوسته، با حداکثر ۳۰ ماه غیبت (ماده‌ی ۲۵ بند ۱ فقره‌ی ۵ قانون اتباع خارجی).',
    },
    sources: [
      { url: URL_MIG_SERVICE, checked: CHECKED, label: 'MIG, service 3263 (Startup Visa certificate)' },
      { url: URL_MIG_NEWS, checked: CHECKED, label: 'MIG, Startup Visa criteria and points' },
      { url: URL_ORDINANCE, checked: CHECKED, label: 'Ordinance (Decree No. 318 of 7 Oct 2022), English text' },
      { url: URL_NIMS_GUIDE, checked: CHECKED, label: 'MIG, NIMS application guidelines' },
      { url: URL_ACT, checked: CHECKED, label: 'Foreigners Act, consolidated to SG 79/2024 (arts. 24p, 25), MFA' },
      { url: URL_MIN_WAGE, checked: CHECKED, label: 'Council of Ministers draft decree: minimum wage BGN 1,213 (€620.20) from 1 Jan 2026' },
      { url: URL_EURO, checked: CHECKED, label: 'ECB, Bulgaria joined the euro on 1 Jan 2026 at BGN 1.95583' },
    ],
    verified: true,
    review:
      'Minimum wage: the official page read is the strategy.bg draft (BGN 1,213 = €620.20); adoption confirmed only by BTA (state news agency) and a search summary citing Decree 243 of 13 Nov 2025, SG 98/2025, not opened. Re-check every January (a €660 draft for 2027 is reported but was not read). lex.bg (Cloudflare) blocked; Act text read on the MFA-hosted consolidation to SG 79/2024, so amendments from 2025–2026 are not covered. Residence permit length under art. 24p: MIG news says up to 1 year; not stated in the Act. D-visa fee and processing not found on an official page (MFA visa D sheet dates from 2012).',
  },
  {
    key: 'bg-trade-10-jobs',
    country: 'BG',
    family: 'entrepreneur',
    name: { en: 'Long-term residence for commercial activity (10 jobs for Bulgarian citizens)', fa: 'اقامت طولانی‌مدت برای فعالیت تجاری (۱۰ شغل برای شهروندان بلغار)' },
    agency: { en: 'Ministry of Interior, Migration Directorate', fa: 'اداره‌ی مهاجرت وزارت کشور بلغارستان' },
    status: 'open',
    fact: {
      en: 'There is no minimum investment, but your business must create at least ten full-time jobs for Bulgarian citizens and keep them for as long as you live there. The condition applies to each partner and each manager separately.',
      fa: 'حداقل سرمایه‌گذاری ندارد، اما کسب‌وکارتان باید دست‌کم ده شغل تمام‌وقت برای شهروندان بلغار بسازد و تا وقتی آنجا اقامت دارید نگهشان دارد. این شرط برای هر شریک و هر مدیر جداگانه است.',
    },
    criteria: [
      {
        key: 'jobs',
        label: { en: 'At least 10 full-time jobs for Bulgarian citizens, kept for the whole stay', fa: 'دست‌کم ۱۰ شغل تمام‌وقت برای شهروندان بلغار، در تمام مدت اقامت' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Counted per partner and per manager: two foreign partners need 20 jobs, unless a ratified treaty says otherwise.',
          fa: 'برای هر شریک و هر مدیر جدا حساب می‌شود: دو شریک خارجی یعنی ۲۰ شغل، مگر معاهده‌ی بین‌المللی چیز دیگری گفته باشد.',
        },
      },
      {
        key: 'company',
        label: { en: 'Commercial activity carried out under Bulgarian law', fa: 'فعالیت تجاری طبق قانون بلغارستان' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'visa-d',
        label: { en: 'A type D visa, housing, health insurance and means of at least the minimum wage', fa: 'ویزای D، محل سکونت، بیمه‌ی درمانی و منابع مالی دست‌کم به اندازه‌ی حداقل دستمزد' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [],
    pr: {
      en: 'Permanent residence after five years of lawful, continuous residence with no more than 30 months away.',
      fa: 'اقامت دائم پس از پنج سال اقامت قانونی و پیوسته، با حداکثر ۳۰ ماه غیبت.',
    },
    sources: [
      { url: URL_ACT, checked: CHECKED, label: 'Foreigners Act art. 24(1)(2), consolidated to SG 79/2024, MFA' },
      { url: URL_ACT_EN, checked: CHECKED, label: 'Foreigners Act, English text published by MIG' },
      { url: URL_VISA_D, checked: CHECKED, label: 'MFA, long-stay visa (type D)' },
    ],
    verified: true,
    review:
      'Only the statute was read; no Migration Directorate page listing documents, fees or processing for art. 24(1)(2) could be opened (mvr.bg not reached). Permit length not stated in the article. Act consolidated to SG 79/2024 only.',
  },
  {
    key: 'bg-investor-pr',
    country: 'BG',
    family: 'entrepreneur',
    name: { en: 'Permanent residence for investing €255,645.94 in a Bulgarian company', fa: 'اقامت دائم با سرمایه‌گذاری ۲۵۵٬۶۴۵٫۹۴ یورو در شرکت بلغاری' },
    agency: {
      en: 'Ministry of Innovation and Growth (certificate); Ministry of Interior, Migration Directorate (permit)',
      fa: 'وزارت نوآوری و رشد (MIG) برای گواهی؛ اداره‌ی مهاجرت وزارت کشور برای اقامت',
    },
    status: 'open',
    fact: {
      en: 'Put at least BGN 500,000 (€255,645.94) into the capital of a Bulgarian company you own at least 50% of; the company must buy new fixed assets of the same value and create at least ten jobs for Bulgarian citizens. MIG certifies it, and the permit is permanent from the start.',
      fa: 'دست‌کم ۵۰۰٬۰۰۰ لِو (۲۵۵٬۶۴۵٫۹۴ یورو) به سرمایه‌ی شرکتی بلغاری بیاورید که دست‌کم ۵۰ درصدش مال شماست؛ شرکت باید دارایی ثابت تازه به همین ارزش بخرد و دست‌کم ده شغل برای شهروندان بلغار بسازد. MIG این را گواهی می‌کند و اقامت از همان اول دائم است.',
    },
    criteria: [
      {
        key: 'investment',
        label: { en: 'At least BGN 500,000 (€255,645.94) paid into the company’s capital', fa: 'دست‌کم ۵۰۰٬۰۰۰ لِو (۲۵۵٬۶۴۵٫۹۴ یورو) واریز به سرمایه‌ی شرکت' },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 255_645.94, currency: 'EUR' },
        note: { en: 'Converted from leva at the fixed rate 1.95583.', fa: 'با نرخ ثابت ۱٫۹۵۵۸۳ از لِو تبدیل شده است.' },
      },
      {
        key: 'ownership',
        label: { en: 'Own at least 50% of the company as a partner or registered shareholder', fa: 'مالکیت دست‌کم ۵۰ درصد شرکت به‌عنوان شریک یا سهام‌دار با نام' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'assets-jobs',
        label: { en: 'New fixed assets of at least €255,645.94 and at least 10 jobs for Bulgarian citizens, kept during residence', fa: 'دارایی ثابت تازه دست‌کم ۲۵۵٬۶۴۵٫۹۴ یورو و دست‌کم ۱۰ شغل برای شهروندان بلغار، در تمام مدت اقامت' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'investment',
        label: { en: 'Capital contribution (BGN 500,000)', fa: 'آورده‌ی سرمایه (۵۰۰٬۰۰۰ لِو)' },
        amount: 255_645.94,
        currency: 'EUR',
        basis: 'once',
        shows: { en: 'A MIG certificate issued on the company’s reasoned opinion that your residence is needed for the investment.', fa: 'گواهی MIG که بر پایه‌ی توضیح مستدل شرکت درباره‌ی لزوم اقامت شما برای اجرای سرمایه‌گذاری صادر می‌شود.' },
      },
    ],
    processing: {
      text: { en: 'The Migration Directorate decides a permanent residence application within two months; longer in complex cases.', fa: 'اداره‌ی مهاجرت درخواست اقامت دائم را ظرف دو ماه تصمیم می‌گیرد؛ در پرونده‌های پیچیده بیشتر.' },
      source: URL_ACT,
    },
    pr: { en: 'The permit is permanent residence from the start (Foreigners Act art. 25(1)(16)).', fa: 'این اجازه از ابتدا اقامت دائم است (ماده‌ی ۲۵ بند ۱ فقره‌ی ۱۶ قانون اتباع خارجی).' },
    sources: [
      { url: URL_ACT, checked: CHECKED, label: 'Foreigners Act art. 25(1)(16) and 25(3), consolidated to SG 79/2024, MFA' },
      { url: URL_ACT_EN, checked: CHECKED, label: 'Foreigners Act, English text published by MIG' },
      { url: URL_EURO, checked: CHECKED, label: 'ECB, fixed conversion rate' },
    ],
    verified: true,
    review:
      'Statute only; MIG certification procedure for art. 25(1)(16) not opened. Related: art. 24(1)(20), BGN 250,000 (€127,822.97) + 5 jobs in an economically disadvantaged region gives long-term residence; art. 25(1)(6)–(8) set larger investor thresholds (BGN 1–6 million). Not split into routes. Act consolidated to SG 79/2024 only.',
  },
  {
    key: 'bg-blue-card',
    country: 'BG',
    family: 'talent',
    name: { en: 'EU Blue Card (highly qualified employment)', fa: 'کارت آبی اتحادیه‌ی اروپا در بلغارستان (EU Blue Card)' },
    agency: { en: 'Ministry of Interior, Migration Directorate, with the Employment Agency', fa: 'اداره‌ی مهاجرت وزارت کشور، با نظر آژانس کاریابی بلغارستان' },
    status: 'open',
    fact: {
      en: 'Gross salary of at least 1.5 times Bulgaria’s average gross salary (last 12 months of data), a contract of at least six months, and a degree of at least three years or, for most jobs, five years of comparable experience. The card lasts 24 months to 5 years.',
      fa: 'حقوق ناخالص دست‌کم ۱٫۵ برابر میانگین حقوق ناخالص بلغارستان (داده‌ی ۱۲ ماه اخیر)، قرارداد دست‌کم شش‌ماهه و مدرک دانشگاهی دست‌کم سه‌ساله یا برای بیشتر مشاغل پنج سال تجربه‌ی هم‌سطح. کارت از ۲۴ ماه تا ۵ سال اعتبار دارد.',
    },
    criteria: [
      {
        key: 'job-offer',
        label: { en: 'An employment contract for highly qualified work of at least six months', fa: 'قرارداد کار بسیار تخصصی با مدت دست‌کم شش ماه' },
        weight: 3,
        scoreable: true,
        test: { field: 'jobOffer', op: 'true' },
      },
      {
        key: 'qualification',
        label: { en: 'Higher education of at least three years, or five years of comparable experience', fa: 'تحصیلات عالی دست‌کم سه‌ساله، یا پنج سال تجربه‌ی هم‌سطح' },
        weight: 3,
        scoreable: true,
        anyOf: [
          { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
          { field: 'workYears', op: 'gte', value: 5 },
        ],
        note: { en: 'Some ICT managers and specialists need only three years of experience in the last seven.', fa: 'برای برخی مدیران و متخصصان فناوری اطلاعات، سه سال تجربه در هفت سال اخیر کافی است.' },
      },
      {
        key: 'salary',
        label: { en: 'Gross salary of at least 1.5 × the average gross salary in Bulgaria', fa: 'حقوق ناخالص دست‌کم ۱٫۵ برابر میانگین حقوق ناخالص بلغارستان' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'The Employment Agency states the multiplier, not a euro amount; the average comes from the latest 12 months of data.',
          fa: 'آژانس کاریابی ضریب را اعلام می‌کند، نه مبلغ یورویی؛ میانگین از داده‌ی ۱۲ ماه اخیر گرفته می‌شود.',
        },
      },
      {
        key: 'employer',
        label: { en: 'The employer explains why it hires you rather than an EU candidate', fa: 'کارفرما توضیح دهد چرا شما را به‌جای متقاضی اروپایی استخدام می‌کند' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [],
    processing: {
      text: { en: 'The whole procedure may not exceed three months, plus 15 days in complex cases.', fa: 'کل روند نباید از سه ماه بیشتر شود؛ در پرونده‌های پیچیده ۱۵ روز بیشتر.' },
      source: URL_BLUE,
    },
    pr: {
      en: 'Card valid 24 months to 5 years. Permanent residence after five years of lawful, continuous residence with no more than 30 months away.',
      fa: 'کارت از ۲۴ ماه تا ۵ سال اعتبار دارد. اقامت دائم پس از پنج سال اقامت قانونی و پیوسته، با حداکثر ۳۰ ماه غیبت.',
    },
    sources: [
      { url: URL_BLUE, checked: CHECKED, label: 'Employment Agency, EU Blue Card' },
      { url: URL_ACT, checked: CHECKED, label: 'Foreigners Act art. 33k and art. 25, consolidated to SG 79/2024, MFA' },
    ],
    verified: false,
    review:
      'Key figure missing: no official euro amount for the salary floor (1.5 × average gross salary). A third-party guide gives about €2,054/month; not used. NSI average not looked up. Fees not on the Employment Agency page. Blue-Card-specific EU long-term residence rules not checked; PR line uses the general art. 25(1)(5).',
  },
  {
    key: 'bg-study',
    country: 'BG',
    family: 'study',
    name: { en: 'Residence permit for full-time university study', fa: 'اقامت تحصیلی برای دانشجوی تمام‌وقت در بلغارستان' },
    agency: { en: 'Ministry of Education and Science (admission); Ministry of Interior, Migration Directorate (permit)', fa: 'وزارت آموزش و علوم (پذیرش)؛ اداره‌ی مهاجرت وزارت کشور (اقامت)' },
    status: 'open',
    fact: {
      en: 'A permit of up to one year at a time for full-time students admitted through the Ministry of Education and Science. You must show at least the minimum monthly wage for each month of stay (€620.20 in 2026). After graduating you can stay up to nine months to look for work.',
      fa: 'اقامت حداکثر یک‌ساله (قابل تمدید) برای دانشجوی تمام‌وقتی که با گواهی وزارت آموزش و علوم پذیرفته شده است. باید برای هر ماه اقامت دست‌کم حداقل دستمزد ماهانه را نشان دهید (۶۲۰٫۲۰ یورو در ۲۰۲۶). پس از فارغ‌التحصیلی می‌توانید تا نه ماه برای کاریابی بمانید.',
    },
    criteria: [
      {
        key: 'admission',
        label: { en: 'Admission certificate from the Ministry of Education and Science, and enrolment as a full-time student', fa: 'گواهی پذیرش وزارت آموزش و علوم و ثبت‌نام به‌عنوان دانشجوی تمام‌وقت' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'funds',
        label: { en: 'At least the minimum monthly wage for each month: €7,442.40 for twelve months (2026)', fa: 'دست‌کم حداقل دستمزد ماهانه برای هر ماه: ۷٬۴۴۲٫۴۰ یورو برای دوازده ماه (۲۰۲۶)' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 7_442.4, currency: 'EUR' },
        note: {
          en: 'The Act allows the minimum wage, the minimum scholarship or the minimum pension as the yardstick; the minimum wage is used here.',
          fa: 'قانون حداقل دستمزد، حداقل کمک‌هزینه‌ی تحصیلی یا حداقل مستمری را معیار گذاشته است؛ اینجا حداقل دستمزد حساب شده.',
        },
      },
      {
        key: 'insurance-housing',
        label: { en: 'Housing, health insurance and a criminal record certificate', fa: 'محل سکونت، بیمه‌ی درمانی و گواهی عدم سوءپیشینه' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'month',
        label: { en: 'Means per month (minimum wage, 2026)', fa: 'منابع مالی ماهانه (حداقل دستمزد ۲۰۲۶)' },
        amount: 620.2,
        currency: 'EUR',
        basis: 'month',
        shows: { en: 'Stable, regular and sufficient means for the whole stay.', fa: 'منابع پایدار، منظم و کافی برای تمام مدت اقامت.' },
      },
    ],
    processing: {
      text: { en: 'Extensions are decided within 14 days. First-permit times were not found on an official page.', fa: 'تمدید ظرف ۱۴ روز تصمیم گرفته می‌شود. زمان اقامت اول در صفحه‌ی رسمی پیدا نشد.' },
      source: URL_ACT,
    },
    pr: {
      en: 'Only half of the time as a student counts toward the five years needed for permanent residence.',
      fa: 'فقط نیمی از دوران دانشجویی در پنج سال لازم برای اقامت دائم حساب می‌شود.',
    },
    sources: [
      { url: URL_ACT, checked: CHECKED, label: 'Foreigners Act art. 24c and art. 25(1)(5), consolidated to SG 79/2024, MFA' },
      { url: URL_VISA_D, checked: CHECKED, label: 'MFA, long-stay visa (type D)' },
      { url: URL_MIN_WAGE, checked: CHECKED, label: 'Minimum wage 2026' },
    ],
    verified: true,
    review:
      'mon.bg (Cloudflare) blocked: the MES admission procedure, tuition and the Ordinance No. 20 (2022) on D-visa certificates for students were not read. Permit fee not found. The 9-month post-study permit (art. 24c) requires registering with the Employment Agency within 7 working days of finishing.',
  },
];
