// Sweden: route depth and country profile (spec 2026-10-27). Figures read on
// migrationsverket.se on 27 Oct 2026. Notebook 7503e5d4 (Sweden
// self-employment) was a lead only. Research: docs/research/app-v3/se.md.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const NB = '7503e5d4-4e4b-4349-a787-8cf49e01efc4';

const SELF = 'https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/self-employed-people.html';
const SELF_EXT = 'https://www.migrationsverket.se/en/you-want-to-extend/work/employee-or-self-employed/self-employed-people/flikar/important-to-know.html';
const BLUE = 'https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/eu-blue-cards.html';
const BLUE_EXT = 'https://www.migrationsverket.se/en/you-want-to-extend/work/employee-or-self-employed/eu-blue-cards.html';
const CHANGES = 'https://www.migrationsverket.se/en/about-the-swedish-migration-agency/the-swedish-migration-agency-answers/2026/2026-10-19-work-permits---what-are-the-latest-developments.html';
const STUDY = 'https://www.migrationsverket.se/en/you-want-to-apply/study/higher-education.html';
const POST_STUDY = 'https://www.migrationsverket.se/en/you-want-to-extend/study/look-for-work-after-completing-your-studies-in-sweden.html';
const CIT = 'https://www.migrationsverket.se/en/you-want-to-apply/swedish-citizenship/citizenship-for-adults/citizenship-for-adults.html';
const DUAL = 'https://www.migrationsverket.se/en/you-want-to-apply/swedish-citizenship/what-swedish-citizenship-means.html';
const APPLY = 'https://www.migrationsverket.se/en/you-want-to-apply.html';
const BOLAGSVERKET = 'https://bolagsverket.se/en';

const CITIZENSHIP_NOTE = {
  en: 'Citizenship: at least eight years of residence since 6 June 2026 (it was five), Swedish at B1 reading and listening / A2 speaking and writing plus a society test (the language test may be postponed), income of at least SEK 250,200 a year (2026) and good conduct. Sweden allows dual citizenship.',
  fa: 'تابعیت: از ۶ ژوئن ۲۰۲۶ دست‌کم هشت سال اقامت (پیش‌تر پنج سال)، سوئدی در سطح B1 برای خواندن و شنیدن و A2 برای گفتار و نوشتار به‌علاوه‌ی آزمون جامعه‌شناسی (آزمون زبان ممکن است به تعویق بیفتد)، درآمد دست‌کم ۲۵۰٬۲۰۰ کرون در سال (۲۰۲۶) و حسن رفتار. سوئد تابعیت دوگانه را می‌پذیرد.',
};

const LANGUAGE = {
  en: 'None for the permit. Citizenship: Swedish B1 (reading, listening) and A2 (speaking, writing), plus a society test.',
  fa: 'برای اقامت لازم نیست. برای تابعیت: سوئدی B1 (خواندن و شنیدن) و A2 (گفتار و نوشتار) به‌علاوه‌ی آزمون جامعه‌شناسی.',
};

const SHARED_DOCS = [
  { key: 'passport', label: { en: 'Passport copies (details page clearly readable)', fa: 'کپی گذرنامه (صفحه‌ی مشخصات کاملاً خوانا)' }, stage: 'apply' as const },
  { key: 'translations', label: { en: 'Certified translations into Swedish or English, with a copy of the original', fa: 'ترجمه‌ی رسمی به سوئدی یا انگلیسی همراه با کپی اصل' }, stage: 'apply' as const },
  { key: 'family', label: { en: 'For family: passports, marriage or cohabitation proof, children’s birth records and custody papers', fa: 'برای خانواده: گذرنامه، مدرک ازدواج یا هم‌خانگی، شناسنامه و مدارک حضانت فرزندان' }, stage: 'apply' as const },
  { key: 'poa', label: { en: 'Power of attorney (form 107011) if someone applies for you', fa: 'وکالت‌نامه (فرم ۱۰۷۰۱۱) اگر کسی به جای شما درخواست می‌دهد' }, stage: 'apply' as const },
];

export const EXTRAS_SE: Record<string, RouteExtras> = {
  'se-self-employed': {
    funds: [
      { key: 'applicant', label: { en: 'Your living costs for two years', fa: 'هزینه‌ی زندگی خودتان برای دو سال' }, amount: 200_000, currency: 'SEK', basis: 'once', per: 'person', kind: 'show', source: SELF },
      { key: 'spouse', label: { en: 'Accompanying spouse or partner', fa: 'همسر یا شریک زندگی همراه' }, amount: 100_000, currency: 'SEK', basis: 'once', per: 'spouse', kind: 'show', source: SELF },
      { key: 'child', label: { en: 'Each accompanying child', fa: 'هر فرزند همراه' }, amount: 50_000, currency: 'SEK', basis: 'once', per: 'child', kind: 'show', source: SELF },
      { key: 'fee', label: { en: 'Application fee, applicant', fa: 'هزینه‌ی درخواست، متقاضی' }, amount: 2_000, currency: 'SEK', basis: 'once', per: 'person', kind: 'spend', source: SELF },
      { key: 'fee-spouse', label: { en: 'Application fee, adult family member', fa: 'هزینه‌ی درخواست، عضو بزرگسال خانواده' }, amount: 1_500, currency: 'SEK', basis: 'once', per: 'spouse', kind: 'spend', source: SELF },
      { key: 'fee-child', label: { en: 'Application fee, child', fa: 'هزینه‌ی درخواست، فرزند' }, amount: 750, currency: 'SEK', basis: 'once', per: 'child', kind: 'spend', source: SELF },
    ],
    steps: [
      {
        key: 'network',
        title: { en: 'Build customers and suppliers in Sweden', fa: 'در سوئد مشتری و تأمین‌کننده پیدا کنید' },
        detail: { en: 'You need established customer contacts or networks, shown by contracts.', fa: 'ارتباط تثبیت‌شده با مشتری یا شبکه‌ی کاری لازم است و با قرارداد نشان داده می‌شود.' },
        link: SELF,
      },
      {
        key: 'company',
        title: { en: 'Set up or buy the business', fa: 'کسب‌وکار را ثبت کنید یا بخرید' },
        detail: { en: 'Register it with the Swedish Companies Registration Office and keep at least 51% ownership.', fa: 'آن را در اداره‌ی ثبت شرکت‌های سوئد (Bolagsverket) ثبت کنید و دست‌کم ۵۱ درصد مالکیت را نگه دارید.' },
        link: BOLAGSVERKET,
      },
      {
        key: 'money',
        title: { en: 'Prove your money', fa: 'پول‌تان را ثابت کنید' },
        detail: { en: 'SEK 200,000 for yourself (plus family amounts) and enough of your own money for the business costs, with a bank certificate and three months of statements.', fa: '۲۰۰٬۰۰۰ کرون برای خودتان (به‌علاوه‌ی سهم خانواده) و پول شخصی کافی برای هزینه‌های کسب‌وکار، با گواهی بانکی و صورت‌حساب سه ماه اخیر.' },
        link: SELF,
      },
      {
        key: 'apply',
        title: { en: 'Apply online and pay SEK 2,000', fa: 'آنلاین درخواست بدهید و ۲٬۰۰۰ کرون بپردازید' },
        detail: { en: 'Through the e-service (Visa or Mastercard); or on paper (form 125011) at the Swedish embassy where you live. Family can be added to your application.', fa: 'از طریق سامانه‌ی آنلاین (با کارت ویزا یا مسترکارت)؛ یا کاغذی (فرم ۱۲۵۰۱۱) در سفارت سوئد در کشور محل اقامت. خانواده را می‌توان به همان درخواست اضافه کرد.' },
        link: APPLY,
      },
      {
        key: 'wait',
        title: { en: 'Wait for the decision', fa: 'منتظر تصمیم بمانید' },
        detail: { en: 'You must have the permit before you travel. Answer requests for more documents quickly.', fa: 'پیش از سفر باید اقامت را گرفته باشید. به درخواست مدارک تکمیلی سریع پاسخ دهید.' },
        takes: { en: '75% of incomplete files within 11 months', fa: '۷۵ درصد پرونده‌های ناقص ظرف ۱۱ ماه' },
        link: SELF,
      },
      {
        key: 'extend',
        title: { en: 'Extend, then apply for permanent residence', fa: 'تمدید کنید و سپس اقامت دائم بخواهید' },
        detail: { en: 'Apply no more than two months before expiry. After two years the business must support you from taxed profit for permanent residence.', fa: 'حداکثر دو ماه پیش از پایان اعتبار درخواست بدهید. پس از دو سال، برای اقامت دائم کسب‌وکار باید از سود مشمول مالیات خرج‌تان را بدهد.' },
        link: SELF_EXT,
      },
    ],
    documents: [
      ...SHARED_DOCS,
      { key: 'bank', label: { en: 'Bank certificate for two years’ support and the business money, plus three months of statements', fa: 'گواهی بانکی برای هزینه‌ی دو سال و پول کسب‌وکار، به‌علاوه‌ی صورت‌حساب سه ماه اخیر' }, stage: 'apply' },
      { key: 'incorporation', label: { en: 'Certificate of incorporation in Sweden', fa: 'گواهی ثبت شرکت در سوئد' }, stage: 'apply' },
      { key: 'ownership', label: { en: 'Partnership agreement or share register', fa: 'قرارداد شراکت یا دفتر سهام' }, stage: 'apply' },
      { key: 'contracts', label: { en: 'Contracts with customers, suppliers and for premises', fa: 'قرارداد با مشتریان، تأمین‌کنندگان و محل کار' }, stage: 'apply' },
      { key: 'accounts', label: { en: 'Balance sheet and profit and loss statement up to last month; annual accounts if the business ran before', fa: 'ترازنامه و صورت سود و زیان تا ماه گذشته؛ صورت‌های مالی سالانه اگر کسب‌وکار قبلاً فعال بوده' }, stage: 'apply' },
      { key: 'purchase', label: { en: 'Purchase contract and proof of payment (if buying a business)', fa: 'قرارداد خرید و مدرک پرداخت (اگر کسب‌وکار می‌خرید)' }, stage: 'apply' },
      { key: 'abroad', label: { en: 'Certificates for companies you own or owned abroad', fa: 'مدارک شرکت‌هایی که در خارج دارید یا داشته‌اید' }, stage: 'apply' },
      { key: 'language', label: { en: 'Swedish or English language certificate', fa: 'مدرک زبان سوئدی یا انگلیسی' }, stage: 'apply' },
      { key: 'qualifications', label: { en: 'Degrees and employer certificates', fa: 'مدارک تحصیلی و گواهی‌های کارفرمایان قبلی' }, stage: 'apply' },
      { key: 'tax-returns', label: { en: 'Annual reports, tax returns and tax account statement', fa: 'گزارش سالانه، اظهارنامه‌ی مالیاتی و صورت‌حساب حساب مالیاتی' }, stage: 'renewal' },
    ],
    realities: [
      {
        key: 'own-money',
        kind: 'challenge',
        title: { en: 'Borrowed money does not work', fa: 'پول قرضی کار نمی‌کند' },
        detail: { en: 'The money must be your own; loans are not normally accepted. Statements cover three months, so a sudden deposit stands out.', fa: 'پول باید مال خودتان باشد و وام معمولاً پذیرفته نمی‌شود. صورت‌حساب سه ماه بررسی می‌شود و واریز ناگهانی به چشم می‌آید.' },
        source: SELF,
      },
      {
        key: 'wait',
        kind: 'challenge',
        title: { en: 'Long processing', fa: 'رسیدگی طولانی' },
        detail: { en: 'For incomplete first applications, 75% were decided within 11 months; extensions within 17 months. Send everything at once.', fa: 'از درخواست‌های اول ناقص ۷۵ درصد ظرف ۱۱ ماه و از تمدیدها ظرف ۱۷ ماه تصمیم گرفته شده‌اند. همه‌ی مدارک را یک‌جا بفرستید.' },
        source: SELF_EXT,
      },
      {
        key: 'pr-two-years',
        kind: 'myth',
        title: { en: '“Permanent residence takes five years”', fa: '«اقامت دائم پنج سال طول می‌کشد»' },
        detail: { en: 'For the self-employed, at least two years of running the business on this permit can be enough, if the business supports you from taxed profit.', fa: 'برای خوداشتغال‌ها، دست‌کم دو سال اداره‌ی کسب‌وکار با این اقامت می‌تواند کافی باشد، به شرطی که کسب‌وکار از سود مشمول مالیات خرج‌تان را بدهد.' },
        source: SELF_EXT,
      },
      {
        key: 'passport',
        kind: 'tip',
        title: { en: 'Renew your passport first', fa: 'اول گذرنامه را تمدید کنید' },
        detail: { en: 'The permit never runs longer than your passport, so a passport with less than two years left shortens it.', fa: 'اقامت هرگز از اعتبار گذرنامه طولانی‌تر نمی‌شود؛ گذرنامه‌ای که کمتر از دو سال اعتبار دارد مدت اقامت را کوتاه می‌کند.' },
        source: SELF,
      },
      {
        key: 'family-work',
        kind: 'tip',
        title: { en: 'Your family can work', fa: 'خانواده‌ی شما اجازه‌ی کار دارند' },
        detail: { en: 'Adult family members and children who turn 16 this year may work in Sweden.', fa: 'اعضای بزرگسال خانواده و فرزندانی که امسال ۱۶ ساله می‌شوند می‌توانند در سوئد کار کنند.' },
        source: SELF,
      },
      {
        key: 'conduct',
        kind: 'challenge',
        title: { en: 'Stricter conduct rules since July 2026', fa: 'شرایط سخت‌گیرانه‌تر حسن رفتار از ژوئیه‌ی ۲۰۲۶' },
        detail: { en: 'Stricter good-conduct requirements apply to residence permit applicants from 13 July 2026; unpaid debts with the Enforcement Authority block an extension.', fa: 'از ۱۳ ژوئیه‌ی ۲۰۲۶ شرایط سخت‌گیرانه‌تر حسن رفتار برای متقاضیان اقامت اعمال می‌شود؛ بدهی پرداخت‌نشده نزد اداره‌ی اجرای احکام مانع تمدید است.' },
        source: SELF_EXT,
      },
    ],
    timeline: {
      prAfterYears: 2,
      citizenshipAfterYears: 8,
      dualCitizenship: 'allowed',
      language: LANGUAGE,
      note: CITIZENSHIP_NOTE,
      source: SELF_EXT,
    },
    quiz: [
      {
        key: 'ownership',
        q: { en: 'What share of the business must you own?', fa: 'چند درصد کسب‌وکار باید مال شما باشد؟' },
        options: [{ en: '25%', fa: '۲۵ درصد' }, { en: '51%', fa: '۵۱ درصد' }, { en: '100%', fa: '۱۰۰ درصد' }],
        answer: 1,
        why: { en: 'At least 51%, and you must run it.', fa: 'دست‌کم ۵۱ درصد، و خودتان باید آن را اداره کنید.' },
      },
      {
        key: 'funds',
        q: { en: 'How much must the applicant show for living costs?', fa: 'متقاضی برای هزینه‌ی زندگی چه مبلغی باید نشان دهد؟' },
        options: [{ en: 'SEK 100,000', fa: '۱۰۰٬۰۰۰ کرون' }, { en: 'SEK 200,000', fa: '۲۰۰٬۰۰۰ کرون' }, { en: 'SEK 350,000', fa: '۳۵۰٬۰۰۰ کرون' }],
        answer: 1,
        why: { en: 'SEK 200,000 for two years, plus 100,000 for a spouse and 50,000 per child.', fa: '۲۰۰٬۰۰۰ کرون برای دو سال، به‌علاوه‌ی ۱۰۰٬۰۰۰ برای همسر و ۵۰٬۰۰۰ برای هر فرزند.' },
      },
      {
        key: 'loans',
        q: { en: 'Can the business money be a bank loan?', fa: 'آیا پول کسب‌وکار می‌تواند وام بانکی باشد؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'Not normally', fa: 'معمولاً نه' }],
        answer: 1,
        why: { en: 'It must be your own money; loans are not normally accepted.', fa: 'باید پول خودتان باشد؛ وام معمولاً پذیرفته نمی‌شود.' },
      },
      {
        key: 'length',
        q: { en: 'How long can the first permit last?', fa: 'اقامت اول حداکثر چه مدت است؟' },
        options: [{ en: '1 year', fa: '۱ سال' }, { en: '2 years', fa: '۲ سال' }, { en: '4 years', fa: '۴ سال' }],
        answer: 1,
        why: { en: 'A maximum of two years, never longer than the passport.', fa: 'حداکثر دو سال و هرگز بیشتر از اعتبار گذرنامه.' },
      },
      {
        key: 'citizenship',
        q: { en: 'How many years of residence does citizenship need since June 2026?', fa: 'از ژوئن ۲۰۲۶ تابعیت چند سال اقامت لازم دارد؟' },
        options: [{ en: '5', fa: '۵' }, { en: '8', fa: '۸' }, { en: '10', fa: '۱۰' }],
        answer: 1,
        why: { en: 'The rule rose from five to eight years on 6 June 2026.', fa: 'این شرط در ۶ ژوئن ۲۰۲۶ از پنج به هشت سال رسید.' },
      },
    ],
    media: [
      { notebookId: NB, kind: 'video', title: 'The Migration Matrix: Which Swedish Business Visa is Actually Yours?' },
      { notebookId: NB, kind: 'slides', title: 'Swedish Business Blueprint' },
      { notebookId: NB, kind: 'slides', title: 'The Sweden Blueprint' },
      { notebookId: NB, kind: 'infographic', title: 'راهنمای اقامت خوداشتغالی در سوئد' },
      { notebookId: NB, kind: 'infographic', title: 'راهنمای دریافت اقامت کاری سوئد' },
    ],
  },

  'se-blue-card': {
    funds: [
      { key: 'fee', label: { en: 'Application fee, applicant', fa: 'هزینه‌ی درخواست، متقاضی' }, amount: 2_000, currency: 'SEK', basis: 'once', per: 'person', kind: 'spend', source: BLUE },
      { key: 'fee-spouse', label: { en: 'Application fee, adult family member', fa: 'هزینه‌ی درخواست، عضو بزرگسال خانواده' }, amount: 1_500, currency: 'SEK', basis: 'once', per: 'spouse', kind: 'spend', source: BLUE },
      { key: 'fee-child', label: { en: 'Application fee, child', fa: 'هزینه‌ی درخواست، فرزند' }, amount: 750, currency: 'SEK', basis: 'once', per: 'child', kind: 'spend', source: BLUE },
    ],
    steps: [
      {
        key: 'offer',
        title: { en: 'Get a highly qualified job offer', fa: 'پیشنهاد کار تخصصی بگیرید' },
        detail: { en: 'At least six months, at least SEK 53,625 a month, contract signed by both sides.', fa: 'دست‌کم شش ماه، حقوق دست‌کم ۵۳٬۶۲۵ کرون در ماه و قرارداد امضاشده‌ی دو طرف.' },
        link: BLUE,
      },
      {
        key: 'employer',
        title: { en: 'Employer starts the application', fa: 'کارفرما درخواست را آغاز می‌کند' },
        detail: { en: 'The employer enters your details in the e-service; you get an email link.', fa: 'کارفرما مشخصات شما را در سامانه وارد می‌کند و لینکی برایتان ایمیل می‌شود.' },
        link: BLUE,
      },
      {
        key: 'complete',
        title: { en: 'Complete your part and pay', fa: 'بخش خود را تکمیل کنید و هزینه را بپردازید' },
        detail: { en: 'Check the terms, upload documents and pay SEK 2,000 by card.', fa: 'شرایط را بررسی کنید، مدارک را بارگذاری کنید و ۲٬۰۰۰ کرون با کارت بپردازید.' },
        link: BLUE,
      },
      {
        key: 'embassy',
        title: { en: 'Show your passport at the embassy', fa: 'گذرنامه را در سفارت نشان دهید' },
        detail: { en: 'At the Swedish embassy or consulate-general where you live.', fa: 'در سفارت یا سرکنسولگری سوئد در کشور محل اقامت.' },
        takes: { en: '75% of complete files within 1 month', fa: '۷۵ درصد پرونده‌های کامل ظرف ۱ ماه' },
        link: BLUE,
      },
      {
        key: 'pr',
        title: { en: 'Permanent residence after 36 months', fa: 'اقامت دائم پس از ۳۶ ماه' },
        detail: { en: '36 months on a Swedish Blue Card, or 48 combined with a work permit in the last seven years.', fa: '۳۶ ماه با کارت آبی سوئد، یا ۴۸ ماه همراه با اجازه‌ی کار در هفت سال گذشته.' },
        link: BLUE_EXT,
      },
    ],
    documents: [
      ...SHARED_DOCS,
      { key: 'contract', label: { en: 'Signed employment contract', fa: 'قرارداد کار امضاشده' }, stage: 'apply' },
      { key: 'degree', label: { en: 'Degree certificate or employer certificates (five years)', fa: 'مدرک تحصیلی یا گواهی کارفرمایان (پنج سال)' }, stage: 'apply' },
      { key: 'insurance', label: { en: 'Comprehensive health insurance, or proof you applied for it', fa: 'بیمه‌ی درمانی جامع یا مدرک درخواست آن' }, stage: 'apply' },
      { key: 'old-card', label: { en: 'Copy of any current EU Blue Card', fa: 'کپی کارت آبی فعلی، اگر دارید' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'fast',
        kind: 'tip',
        title: { en: 'One of the fastest Swedish permits', fa: 'یکی از سریع‌ترین اقامت‌های سوئد' },
        detail: { en: '75% of complete applications were decided within one month.', fa: '۷۵ درصد درخواست‌های کامل ظرف یک ماه تصمیم گرفته شده‌اند.' },
        source: BLUE,
      },
      {
        key: 'experience',
        kind: 'myth',
        title: { en: '“A degree is mandatory”', fa: '«مدرک دانشگاهی الزامی است»' },
        detail: { en: 'Five years of relevant professional experience can replace the 180-credit degree.', fa: 'پنج سال سابقه‌ی حرفه‌ای مرتبط می‌تواند جای مدرک ۱۸۰ واحدی را بگیرد.' },
        source: BLUE,
      },
      {
        key: 'work-permit',
        kind: 'tip',
        title: { en: 'Lower salary? The ordinary work permit', fa: 'حقوق کمتر؟ اجازه‌ی کار معمولی' },
        detail: { en: 'Since 1 June 2026 an ordinary work permit needs 90% of the median salary (SEK 34,470 a month) and health insurance; permanent residence after four years of work in seven.', fa: 'از ۱ ژوئن ۲۰۲۶ اجازه‌ی کار معمولی به ۹۰ درصد میانه‌ی حقوق (ماهانه ۳۴٬۴۷۰ کرون) و بیمه‌ی درمانی نیاز دارد؛ اقامت دائم پس از چهار سال کار در هفت سال.' },
        source: CHANGES,
      },
      {
        key: 'dual',
        kind: 'tip',
        title: { en: 'You can keep your passport', fa: 'گذرنامه‌ی قبلی‌تان می‌ماند' },
        detail: { en: 'Sweden allows dual citizenship; check whether your home country does too.', fa: 'سوئد تابعیت دوگانه را می‌پذیرد؛ بررسی کنید کشور خودتان هم می‌پذیرد یا نه.' },
        source: DUAL,
      },
      {
        key: 'other-eu',
        kind: 'challenge',
        title: { en: 'Time in other EU countries does not count', fa: 'مدت اقامت در دیگر کشورهای اروپایی حساب نمی‌شود' },
        detail: { en: 'For Swedish permanent residence, a Blue Card held in another EU country does not count.', fa: 'برای اقامت دائم سوئد، کارت آبی کشور اروپایی دیگر حساب نمی‌شود.' },
        source: BLUE_EXT,
      },
    ],
    timeline: {
      prAfterYears: 3,
      citizenshipAfterYears: 8,
      dualCitizenship: 'allowed',
      language: LANGUAGE,
      note: CITIZENSHIP_NOTE,
      source: BLUE_EXT,
    },
    quiz: [
      {
        key: 'salary',
        q: { en: 'What monthly salary does the Blue Card need?', fa: 'کارت آبی چه حقوق ماهانه‌ای لازم دارد؟' },
        options: [{ en: 'SEK 34,470', fa: '۳۴٬۴۷۰ کرون' }, { en: 'SEK 53,625', fa: '۵۳٬۶۲۵ کرون' }, { en: 'SEK 70,000', fa: '۷۰٬۰۰۰ کرون' }],
        answer: 1,
        why: { en: 'SEK 53,625, 1.25 times the average salary.', fa: '۵۳٬۶۲۵ کرون، یعنی ۱٫۲۵ برابر متوسط حقوق.' },
      },
      {
        key: 'duration',
        q: { en: 'Minimum length of the job?', fa: 'حداقل مدت قرارداد کار؟' },
        options: [{ en: '3 months', fa: '۳ ماه' }, { en: '6 months', fa: '۶ ماه' }, { en: '12 months', fa: '۱۲ ماه' }],
        answer: 1,
        why: { en: 'At least six months.', fa: 'دست‌کم شش ماه.' },
      },
      {
        key: 'credits',
        q: { en: 'How many higher-education credits?', fa: 'چند واحد آموزش عالی لازم است؟' },
        options: [{ en: '120', fa: '۱۲۰' }, { en: '180', fa: '۱۸۰' }, { en: '240', fa: '۲۴۰' }],
        answer: 1,
        why: { en: '180 credits, or five years of relevant experience.', fa: '۱۸۰ واحد، یا پنج سال سابقه‌ی مرتبط.' },
      },
      {
        key: 'validity',
        q: { en: 'Maximum length of the first card?', fa: 'حداکثر اعتبار کارت اول؟' },
        options: [{ en: '2 years', fa: '۲ سال' }, { en: '4 years', fa: '۴ سال' }, { en: '5 years', fa: '۵ سال' }],
        answer: 1,
        why: { en: 'At least nine months and at most four years.', fa: 'دست‌کم نه ماه و حداکثر چهار سال.' },
      },
      {
        key: 'pr',
        q: { en: 'Months on a Swedish Blue Card before permanent residence?', fa: 'چند ماه کارت آبی سوئد تا اقامت دائم؟' },
        options: [{ en: '24', fa: '۲۴' }, { en: '36', fa: '۳۶' }, { en: '60', fa: '۶۰' }],
        answer: 1,
        why: { en: '36 months on the Blue Card alone.', fa: '۳۶ ماه فقط با کارت آبی.' },
      },
    ],
    media: [],
  },

  'se-study': {
    funds: [
      { key: 'month', label: { en: 'Living costs per month (2026)', fa: 'هزینه‌ی زندگی ماهانه (۲۰۲۶)' }, amount: 10_656, currency: 'SEK', basis: 'month', per: 'person', kind: 'show', source: STUDY },
      { key: 'spouse', label: { en: 'Spouse or partner, per month', fa: 'همسر یا شریک زندگی، ماهانه' }, amount: 4_440, currency: 'SEK', basis: 'month', per: 'spouse', kind: 'show', source: STUDY },
      { key: 'child', label: { en: 'Each child, per month', fa: 'هر فرزند، ماهانه' }, amount: 2_664, currency: 'SEK', basis: 'month', per: 'child', kind: 'show', source: STUDY },
      { key: 'fee', label: { en: 'Application fee, adult', fa: 'هزینه‌ی درخواست، بزرگسال' }, amount: 1_500, currency: 'SEK', basis: 'once', per: 'person', kind: 'spend', source: STUDY },
      { key: 'fee-child', label: { en: 'Application fee, child under 18', fa: 'هزینه‌ی درخواست، فرزند زیر ۱۸ سال' }, amount: 750, currency: 'SEK', basis: 'once', per: 'child', kind: 'spend', source: STUDY },
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get final admission and pay tuition', fa: 'پذیرش قطعی بگیرید و شهریه را بپردازید' },
        detail: { en: 'Full-time, on-site studies (30 credits a semester); the university tells the Agency once tuition is paid.', fa: 'تحصیل تمام‌وقت و حضوری (۳۰ واحد در ترم)؛ دانشگاه پس از پرداخت شهریه به اداره‌ی مهاجرت اطلاع می‌دهد.' },
        link: STUDY,
      },
      {
        key: 'funds',
        title: { en: 'Prepare proof of funds', fa: 'مدرک تمکن را آماده کنید' },
        detail: { en: 'SEK 10,656 a month for the whole permit; the bank statement may be at most four months old at the permit start.', fa: 'ماهانه ۱۰٬۶۵۶ کرون برای تمام مدت اقامت؛ صورت‌حساب بانکی در زمان شروع اقامت حداکثر چهار ماه سابقه داشته باشد.' },
        link: STUDY,
      },
      {
        key: 'apply',
        title: { en: 'Apply online and pay SEK 1,500', fa: 'آنلاین درخواست بدهید و ۱٬۵۰۰ کرون بپردازید' },
        detail: { en: 'Through the e-service, or on paper (form 113011) at the Swedish embassy.', fa: 'از طریق سامانه‌ی آنلاین یا کاغذی (فرم ۱۱۳۰۱۱) در سفارت سوئد.' },
        takes: { en: '75% within 3 months', fa: '۷۵ درصد ظرف ۳ ماه' },
        link: APPLY,
      },
      {
        key: 'after',
        title: { en: 'After graduating: up to 12 months to find work', fa: 'پس از فارغ‌التحصیلی: تا ۱۲ ماه برای کاریابی' },
        detail: { en: 'Apply for a permit to look for work or start a business, then switch to a work permit or Blue Card.', fa: 'برای اقامت جست‌وجوی کار یا راه‌اندازی کسب‌وکار درخواست بدهید و سپس به اجازه‌ی کار یا کارت آبی تغییر وضعیت دهید.' },
        link: POST_STUDY,
      },
    ],
    documents: [
      ...SHARED_DOCS,
      { key: 'admission', label: { en: 'Admission decision: final admission to full-time, on-site studies', fa: 'نامه‌ی پذیرش قطعی برای تحصیل تمام‌وقت و حضوری' }, stage: 'apply' },
      { key: 'funds', label: { en: 'Bank statement (max four months old), scholarship or sponsor letter', fa: 'صورت‌حساب بانکی (حداکثر چهار ماه)، نامه‌ی بورسیه یا حامی مالی' }, stage: 'apply' },
      { key: 'insurance', label: { en: 'Health insurance (studies under one year)', fa: 'بیمه‌ی درمانی (تحصیل کمتر از یک سال)' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'work-cap',
        kind: 'challenge',
        title: { en: 'Work capped at 15 hours a week', fa: 'سقف کار ۱۵ ساعت در هفته' },
        detail: { en: 'For permits granted from 11 June 2026, bachelor’s and master’s students may work at most 15 hours a week, except June to August and internships.', fa: 'برای اقامت‌های صادرشده از ۱۱ ژوئن ۲۰۲۶، دانشجوی کارشناسی و ارشد حداکثر ۱۵ ساعت در هفته کار می‌کند، به جز ژوئن تا اوت و کارآموزی.' },
        source: STUDY,
      },
      {
        key: 'no-distance',
        kind: 'myth',
        title: { en: '“Online programmes count”', fa: '«دوره‌ی آنلاین هم قبول است»' },
        detail: { en: 'Distance learning is not accepted; studies must be full-time and on site.', fa: 'تحصیل از راه دور پذیرفته نمی‌شود؛ تحصیل باید تمام‌وقت و حضوری باشد.' },
        source: STUDY,
      },
      {
        key: 'post-study',
        kind: 'tip',
        title: { en: 'Twelve months to stay and look for work', fa: 'دوازده ماه برای ماندن و کاریابی' },
        detail: { en: 'Once the whole programme is passed, you can get up to 12 months to look for work or start a business.', fa: 'پس از قبولی در کل دوره، تا ۱۲ ماه برای کاریابی یا راه‌اندازی کسب‌وکار فرصت دارید.' },
        source: POST_STUDY,
      },
    ],
    timeline: {
      citizenshipAfterYears: 8,
      dualCitizenship: 'allowed',
      language: LANGUAGE,
      note: {
        en: 'Bachelor’s and master’s study does not lead to permanent residence by itself; the clock starts on a work permit or Blue Card.',
        fa: 'تحصیل کارشناسی و ارشد به‌تنهایی به اقامت دائم نمی‌رسد؛ شمارش از زمان اجازه‌ی کار یا کارت آبی شروع می‌شود.',
      },
      source: CIT,
    },
    quiz: [
      {
        key: 'funds',
        q: { en: 'Monthly funds for a 2026 application?', fa: 'تمکن ماهانه برای درخواست ۲۰۲۶؟' },
        options: [{ en: 'SEK 8,568', fa: '۸٬۵۶۸ کرون' }, { en: 'SEK 10,656', fa: '۱۰٬۶۵۶ کرون' }, { en: 'SEK 15,000', fa: '۱۵٬۰۰۰ کرون' }],
        answer: 1,
        why: { en: 'At least SEK 10,656 a month in 2026.', fa: 'در ۲۰۲۶ دست‌کم ۱۰٬۶۵۶ کرون در ماه.' },
      },
      {
        key: 'hours',
        q: { en: 'Weekly work cap for permits granted from 11 June 2026?', fa: 'سقف کار هفتگی برای اقامت‌های صادرشده از ۱۱ ژوئن ۲۰۲۶؟' },
        options: [{ en: '15 hours', fa: '۱۵ ساعت' }, { en: '20 hours', fa: '۲۰ ساعت' }, { en: 'No limit', fa: 'بدون محدودیت' }],
        answer: 0,
        why: { en: '15 hours a week for bachelor’s and master’s students.', fa: '۱۵ ساعت در هفته برای دانشجوی کارشناسی و ارشد.' },
      },
      {
        key: 'distance',
        q: { en: 'Is distance learning accepted?', fa: 'تحصیل از راه دور پذیرفته می‌شود؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No', fa: 'نه' }],
        answer: 1,
        why: { en: 'Studies must be full-time and on site.', fa: 'تحصیل باید تمام‌وقت و حضوری باشد.' },
      },
      {
        key: 'after',
        q: { en: 'How long can you look for work after a master’s?', fa: 'پس از ارشد چه مدت برای کاریابی فرصت دارید؟' },
        options: [{ en: '6 months', fa: '۶ ماه' }, { en: '12 months', fa: '۱۲ ماه' }, { en: '24 months', fa: '۲۴ ماه' }],
        answer: 1,
        why: { en: 'Up to 12 months after a bachelor’s or master’s.', fa: 'پس از کارشناسی یا ارشد تا ۱۲ ماه.' },
      },
      {
        key: 'fee',
        q: { en: 'Application fee for an adult student?', fa: 'هزینه‌ی درخواست برای دانشجوی بزرگسال؟' },
        options: [{ en: 'SEK 750', fa: '۷۵۰ کرون' }, { en: 'SEK 1,500', fa: '۱٬۵۰۰ کرون' }, { en: 'SEK 2,000', fa: '۲٬۰۰۰ کرون' }],
        answer: 1,
        why: { en: 'SEK 1,500 for adults.', fa: '۱٬۵۰۰ کرون برای بزرگسالان.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_SE: CountryProfile = {
  strengths: [
    { en: 'Self-employed founders can reach permanent residence after two years if the business pays them.', fa: 'بنیان‌گذار خوداشتغال اگر کسب‌وکار خرجش را بدهد، پس از دو سال می‌تواند اقامت دائم بگیرد.' },
    { en: 'Family members of permit holders may work.', fa: 'اعضای خانواده‌ی دارنده‌ی اقامت اجازه‌ی کار دارند.' },
    { en: 'Dual citizenship is allowed.', fa: 'تابعیت دوگانه مجاز است.' },
    { en: 'Second in the WIPO Global Innovation Index 2026 and very high English proficiency.', fa: 'رتبه‌ی دوم شاخص جهانی نوآوری WIPO در ۲۰۲۶ و سطح بسیار بالای انگلیسی.' },
  ],
  weaknesses: [
    { en: 'Self-employed decisions are slow: up to 11 months for most incomplete first applications.', fa: 'تصمیم درباره‌ی خوداشتغالی کند است: برای بیشتر درخواست‌های اول ناقص تا ۱۱ ماه.' },
    { en: 'Citizenship now takes eight years, with new language and society tests.', fa: 'تابعیت اکنون هشت سال طول می‌کشد و آزمون‌های تازه‌ی زبان و جامعه دارد.' },
    { en: 'Work permits got stricter in June 2026 (90% of median salary, health insurance); students can work only 15 hours a week.', fa: 'اجازه‌ی کار از ژوئن ۲۰۲۶ سخت‌تر شده (۹۰ درصد میانه‌ی حقوق، بیمه‌ی درمانی)؛ دانشجو فقط ۱۵ ساعت در هفته کار می‌کند.' },
    { en: 'Unemployment is high for the region (8.7% in 2025).', fa: 'نرخ بیکاری برای این منطقه بالاست (۸٫۷ درصد در ۲۰۲۵).' },
  ],
  indicators: [
    { key: 'hdi', rank: 5, of: 193, value: 0.959, year: 2023, source: { url: 'https://hdr.undp.org/data-center/specific-country-data#/countries/SWE', checked: '2026-10-27', label: 'UNDP HDR 2025 (2023 data)' } },
    { key: 'happiness', rank: 5, year: 2026, source: { url: 'https://data.worldhappiness.report/table', checked: '2026-10-27', label: 'World Happiness Report 2026' } },
    { key: 'gdp-per-capita', value: 63_133, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/SWE/indicator/NY.GDP.PCAP.CD?format=json', checked: '2026-10-27', label: 'World Bank' } },
    { key: 'unemployment', value: 8.7, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/SWE/indicator/SL.UEM.TOTL.ZS?format=json', checked: '2026-10-27', label: 'World Bank (ILO estimate)' } },
    { key: 'innovation', rank: 2, of: 139, year: 2026, source: { url: 'https://www.wipo.int/web-publications/global-innovation-index-2026/en/gii-2026-results.html', checked: '2026-10-27', label: 'WIPO GII 2026' } },
    { key: 'english', rank: 8, of: 123, year: 2025, source: { url: 'https://www.ef.com/wwen/epi/', checked: '2026-10-27', label: 'EF EPI 2025' } },
  ],
};
