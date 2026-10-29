// VisaRoads v2 routes, Sweden. Checked 27 Oct 2026 on migrationsverket.se.
// Research: docs/research/app-v3/se.md. Notebook 7503e5d4 was a lead only.
// Sweden has no start-up visa; running your own business is the business route.
import type { RouteV2 } from './types';

const CHECKED = '2026-10-27';

const URL_SELF = 'https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/self-employed-people.html';
const URL_SELF_EXT = 'https://www.migrationsverket.se/en/you-want-to-extend/work/employee-or-self-employed/self-employed-people/flikar/important-to-know.html';
const URL_BLUE = 'https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/eu-blue-cards.html';
const URL_BLUE_EXT = 'https://www.migrationsverket.se/en/you-want-to-extend/work/employee-or-self-employed/eu-blue-cards.html';
const URL_CHANGES = 'https://www.migrationsverket.se/en/about-the-swedish-migration-agency/the-swedish-migration-agency-answers/2026/2026-10-19-work-permits---what-are-the-latest-developments.html';
const URL_STUDY = 'https://www.migrationsverket.se/en/you-want-to-apply/study/higher-education.html';
const URL_POST_STUDY = 'https://www.migrationsverket.se/en/you-want-to-extend/study/look-for-work-after-completing-your-studies-in-sweden.html';

export const ROUTES_SE: RouteV2[] = [
  {
    key: 'se-self-employed',
    country: 'SE',
    family: 'entrepreneur',
    name: { en: 'Residence permit to run your own business', fa: 'اقامت خوداشتغالی سوئد (اداره‌ی کسب‌وکار خودتان)' },
    agency: { en: 'Swedish Migration Agency (Migrationsverket)', fa: 'اداره‌ی مهاجرت سوئد (Migrationsverket)' },
    status: 'open',
    fact: {
      en: 'You must own at least 51% of the business, run it yourself and show SEK 200,000 of your own money for two years of living costs, on top of the money the business needs. Expect a long wait: 75% of recent incomplete files took up to 11 months.',
      fa: 'باید دست‌کم ۵۱ درصد کسب‌وکار مال شما باشد، خودتان آن را اداره کنید و افزون بر پول لازم برای کسب‌وکار، ۲۰۰٬۰۰۰ کرون پول شخصی برای هزینه‌ی زندگی دو سال نشان دهید. انتظار طولانی است: ۷۵ درصد پرونده‌های ناقص اخیر تا ۱۱ ماه طول کشیده‌اند.',
    },
    criteria: [
      {
        key: 'ownership',
        label: { en: 'Own at least 51% and carry the main responsibility for running the business', fa: 'مالکیت دست‌کم ۵۱ درصد و مسئولیت اصلی اداره‌ی کسب‌وکار' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'funds',
        label: { en: 'SEK 200,000 for your living costs over two years, in an account in your name', fa: '۲۰۰٬۰۰۰ کرون برای هزینه‌ی زندگی دو سال، در حسابی به نام خودتان' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 200_000, currency: 'SEK' },
        note: {
          en: 'Add SEK 100,000 for a spouse and SEK 50,000 per child. The business money comes on top; loans are not normally accepted.',
          fa: 'برای همسر ۱۰۰٬۰۰۰ و برای هر فرزند ۵۰٬۰۰۰ کرون اضافه کنید. پول کسب‌وکار جدا از این مبلغ است و وام معمولاً پذیرفته نمی‌شود.',
        },
      },
      {
        key: 'experience',
        label: { en: 'Good experience in the industry and in running your own business', fa: 'تجربه‌ی خوب در همان صنعت و در اداره‌ی کسب‌وکار شخصی' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'customers',
        label: { en: 'Established customer contacts or networks, and a credible budget', fa: 'ارتباط تثبیت‌شده با مشتری یا شبکه‌ی کاری، و بودجه‌ی قابل‌اتکا' },
        weight: 2,
        scoreable: false,
        note: { en: 'Contracts with customers, suppliers and for premises are on the document list.', fa: 'قرارداد با مشتریان، تأمین‌کنندگان و محل کار در فهرست مدارک آمده است.' },
      },
      {
        key: 'language',
        label: { en: 'Relevant Swedish or English', fa: 'تسلط مرتبط به سوئدی یا انگلیسی' },
        weight: 1,
        scoreable: false,
        note: { en: 'Many Swedish customers or suppliers mean you need very good Swedish.', fa: 'اگر مشتری یا تأمین‌کننده‌ی سوئدی زیادی دارید، سوئدی خیلی خوب لازم است.' },
      },
    ],
    money: [
      {
        key: 'applicant',
        label: { en: 'Applicant, two years of living costs', fa: 'متقاضی، هزینه‌ی زندگی دو سال' },
        amount: 200_000,
        currency: 'SEK',
        basis: 'once',
        shows: {
          en: 'A bank certificate plus three months of statements; the account can be abroad if the money can be moved to Sweden.',
          fa: 'گواهی بانکی و صورت‌حساب سه ماه اخیر؛ حساب می‌تواند خارج از سوئد باشد به شرط اینکه پول قابل انتقال به سوئد باشد.',
        },
      },
      { key: 'spouse', label: { en: 'Accompanying spouse or partner', fa: 'همسر یا شریک زندگی همراه' }, amount: 100_000, currency: 'SEK', basis: 'once' },
      { key: 'child', label: { en: 'Each accompanying child', fa: 'هر فرزند همراه' }, amount: 50_000, currency: 'SEK', basis: 'once' },
    ],
    processing: {
      text: {
        en: 'Too few complete files to show a time; 75% of incomplete files were decided within 11 months.',
        fa: 'پرونده‌ی کامل برای اعلام زمان کافی نبوده است؛ ۷۵ درصد پرونده‌های ناقص ظرف ۱۱ ماه تصمیم گرفته شده‌اند.',
      },
      source: URL_SELF,
    },
    fees: [
      { label: { en: 'Applicant', fa: 'متقاضی' }, amount: 2_000, currency: 'SEK' },
      { label: { en: 'Adult family member', fa: 'عضو بزرگسال خانواده' }, amount: 1_500, currency: 'SEK' },
      { label: { en: 'Child', fa: 'فرزند' }, amount: 750, currency: 'SEK' },
    ],
    pr: {
      en: 'Permit up to two years. Permanent residence after at least two years of running the business in Sweden, if it supports you from taxed profit (at least SEK 6,243 a month left after housing in 2026). Family members need three years.',
      fa: 'اقامت حداکثر دوساله. اقامت دائم پس از دست‌کم دو سال اداره‌ی کسب‌وکار در سوئد، به شرطی که از سود مشمول مالیات خرج‌تان را بدهد (در ۲۰۲۶ پس از کسر هزینه‌ی مسکن دست‌کم ۶٬۲۴۳ کرون در ماه بماند). اعضای خانواده به سه سال نیاز دارند.',
    },
    sources: [
      { url: URL_SELF, checked: CHECKED, label: 'Migrationsverket, self-employed people' },
      { url: URL_SELF_EXT, checked: CHECKED, label: 'Migrationsverket, extension and permanent residence' },
      { url: URL_CHANGES, checked: CHECKED, label: 'Migrationsverket, work permits, latest developments (19 Oct 2026)' },
    ],
    verified: true,
    review:
      'Brief asked for 2024–2025 rule changes: none found that target self-employed people on migrationsverket.se. Changes that do touch this route: requirements for PR must be met at decision as well as at application (2023 practice); stricter good-conduct rules from 13 Jul 2026; work-permit salary floor and health insurance from 1 Jun 2026 apply to employees, not stated for self-employed. Extension processing: 75% of incomplete files within 17 months. Notebook figures (200k/100k/50k, fees) match; notebook processing (11/14 months) and PR (5 years) are out of date.',
  },
  {
    key: 'se-blue-card',
    country: 'SE',
    family: 'talent',
    name: { en: 'EU Blue Card (highly qualified employment)', fa: 'کارت آبی اتحادیه‌ی اروپا در سوئد (EU Blue Card)' },
    agency: { en: 'Swedish Migration Agency (Migrationsverket)', fa: 'اداره‌ی مهاجرت سوئد (Migrationsverket)' },
    status: 'open',
    fact: {
      en: 'Salary of at least SEK 53,625 a month since 15 July 2026, a job of at least six months, and a degree of 180 credits or five years of relevant experience. Complete files: 75% decided within one month.',
      fa: 'حقوق دست‌کم ۵۳٬۶۲۵ کرون در ماه (از ۱۵ ژوئیه‌ی ۲۰۲۶)، قرارداد دست‌کم شش‌ماهه و مدرک ۱۸۰ واحدی یا پنج سال سابقه‌ی مرتبط. ۷۵ درصد پرونده‌های کامل ظرف یک ماه تصمیم گرفته شده‌اند.',
    },
    criteria: [
      {
        key: 'job-offer',
        label: { en: 'Signed contract for highly qualified work of at least six months', fa: 'قرارداد امضاشده برای کار بسیار تخصصی با مدت دست‌کم شش ماه' },
        weight: 3,
        scoreable: true,
        test: { field: 'jobOffer', op: 'true' },
      },
      {
        key: 'qualification',
        label: { en: 'Higher education of at least 180 credits, or five years of relevant experience', fa: 'تحصیلات عالی دست‌کم ۱۸۰ واحد (معادل کارشناسی)، یا پنج سال سابقه‌ی مرتبط' },
        weight: 3,
        scoreable: true,
        anyOf: [
          { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
          { field: 'workYears', op: 'gte', value: 5 },
        ],
      },
      {
        key: 'salary',
        label: { en: 'Salary of at least SEK 53,625 a month (1.25 × average salary)', fa: 'حقوق دست‌کم ۵۳٬۶۲۵ کرون در ماه (۱٫۲۵ برابر متوسط حقوق)' },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 643_500, currency: 'SEK' },
        note: {
          en: 'Twelve times the monthly floor. An ordinary work permit needs 90% of the median salary instead (SEK 34,470 a month since 16 June 2026).',
          fa: 'دوازده برابر حداقل ماهانه. برای اجازه‌ی کار معمولی، ۹۰ درصد میانه‌ی حقوق کافی است (از ۱۶ ژوئن ۲۰۲۶ ماهانه ۳۴٬۴۷۰ کرون).',
        },
      },
      {
        key: 'insurance',
        label: { en: 'Comprehensive health insurance, or an application for it', fa: 'بیمه‌ی درمانی جامع یا درخواست آن' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      { key: 'salary', label: { en: 'Minimum gross salary', fa: 'حداقل حقوق ناخالص' }, amount: 53_625, currency: 'SEK', basis: 'month', shows: { en: 'The signed employment contract.', fa: 'قرارداد کار امضاشده.' } },
    ],
    processing: {
      text: { en: '75% of complete files within 1 month; incomplete within 2 months.', fa: '۷۵ درصد پرونده‌های کامل ظرف ۱ ماه و پرونده‌های ناقص ظرف ۲ ماه.' },
      source: URL_BLUE,
    },
    fees: [
      { label: { en: 'Applicant', fa: 'متقاضی' }, amount: 2_000, currency: 'SEK' },
      { label: { en: 'Adult family member', fa: 'عضو بزرگسال خانواده' }, amount: 1_500, currency: 'SEK' },
      { label: { en: 'Child', fa: 'فرزند' }, amount: 750, currency: 'SEK' },
    ],
    pr: {
      en: 'First card 9 months to 4 years. Permanent residence after 36 months on a Swedish Blue Card (48 if combined with a work permit), with taxed income that supports you.',
      fa: 'کارت اول از ۹ ماه تا ۴ سال اعتبار دارد. اقامت دائم پس از ۳۶ ماه با کارت آبی سوئد (۴۸ ماه اگر با اجازه‌ی کار معمولی ترکیب شود) و درآمد مشمول مالیاتی که خرج‌تان را بدهد.',
    },
    sources: [
      { url: URL_BLUE, checked: CHECKED, label: 'Migrationsverket, EU Blue Card' },
      { url: URL_BLUE_EXT, checked: CHECKED, label: 'Migrationsverket, Blue Card extension and permanent residence' },
      { url: URL_CHANGES, checked: CHECKED, label: 'Migrationsverket, work permits, latest developments' },
    ],
    verified: true,
    review:
      'Covers "EU Blue Card or work permit". Ordinary work permit (90% of median, SEK 34,470; PR after 4 of 7 years) is only in notes; split into its own route if the app needs it. One Migrationsverket page dates the 53,625 threshold to 15 Jul 2025, the Blue Card page to 15 Jul 2026: confirm. Not covered by the notebook.',
  },
  {
    key: 'se-study',
    country: 'SE',
    family: 'study',
    name: { en: 'Residence permit for higher education studies', fa: 'اقامت تحصیلی آموزش عالی سوئد' },
    agency: { en: 'Swedish Migration Agency (Migrationsverket)', fa: 'اداره‌ی مهاجرت سوئد (Migrationsverket)' },
    status: 'open',
    fact: {
      en: 'For permits granted from 11 June 2026, bachelor’s and master’s students may work at most 15 hours a week in term time. After graduating you can get up to 12 months to look for work or start a business.',
      fa: 'برای اقامت‌هایی که از ۱۱ ژوئن ۲۰۲۶ صادر می‌شوند، دانشجوی کارشناسی و ارشد در طول ترم حداکثر ۱۵ ساعت در هفته کار می‌کند. پس از فارغ‌التحصیلی تا ۱۲ ماه برای پیدا کردن کار یا راه‌اندازی کسب‌وکار فرصت دارید.',
    },
    criteria: [
      {
        key: 'admission',
        label: { en: 'Final admission to full-time, on-site studies; tuition paid', fa: 'پذیرش قطعی در تحصیل تمام‌وقت و حضوری؛ شهریه پرداخت‌شده' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'funds',
        label: { en: 'SEK 10,656 a month for the whole permit period', fa: 'ماهانه ۱۰٬۶۵۶ کرون برای تمام مدت اقامت' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 127_872, currency: 'SEK' },
        note: {
          en: 'Twelve months shown here. Add SEK 4,440 a month for a spouse and SEK 2,664 per child.',
          fa: 'اینجا دوازده ماه حساب شده است. برای همسر ماهانه ۴٬۴۴۰ و برای هر فرزند ۲٬۶۶۴ کرون اضافه کنید.',
        },
      },
      {
        key: 'insurance',
        label: { en: 'Health insurance if studies last under one year', fa: 'بیمه‌ی درمانی اگر تحصیل کمتر از یک سال باشد' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'month',
        label: { en: 'Living costs per month (2026)', fa: 'هزینه‌ی زندگی ماهانه (۲۰۲۶)' },
        amount: 10_656,
        currency: 'SEK',
        basis: 'month',
        shows: { en: 'A bank statement issued no more than four months before the permit starts, or a scholarship or sponsor letter.', fa: 'صورت‌حساب بانکی که حداکثر چهار ماه پیش از شروع اقامت صادر شده باشد، یا نامه‌ی بورسیه یا حامی مالی.' },
      },
      { key: 'spouse', label: { en: 'Spouse or partner, per month', fa: 'همسر یا شریک زندگی، ماهانه' }, amount: 4_440, currency: 'SEK', basis: 'month' },
      { key: 'child', label: { en: 'Each child, per month', fa: 'هر فرزند، ماهانه' }, amount: 2_664, currency: 'SEK', basis: 'month' },
    ],
    processing: {
      text: { en: '75% of recent cases decided within 3 months.', fa: '۷۵ درصد پرونده‌های اخیر ظرف ۳ ماه تصمیم گرفته شده‌اند.' },
      source: URL_STUDY,
    },
    fees: [
      { label: { en: 'Adult', fa: 'بزرگسال' }, amount: 1_500, currency: 'SEK' },
      { label: { en: 'Child under 18', fa: 'فرزند زیر ۱۸ سال' }, amount: 750, currency: 'SEK' },
    ],
    pr: {
      en: 'Bachelor’s and master’s study does not lead to permanent residence by itself. Switch to a work permit or Blue Card after graduating.',
      fa: 'تحصیل کارشناسی و ارشد به‌تنهایی به اقامت دائم نمی‌رسد. پس از فارغ‌التحصیلی به اجازه‌ی کار یا کارت آبی تغییر وضعیت بدهید.',
    },
    sources: [
      { url: URL_STUDY, checked: CHECKED, label: 'Migrationsverket, higher education studies' },
      { url: URL_POST_STUDY, checked: CHECKED, label: 'Migrationsverket, looking for work after studies' },
    ],
    verified: true,
    review: 'PR line is our reading: the study page lists no PR route except for doctoral students. Not covered by the notebook.',
  },
];
