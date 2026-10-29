// Austria: route depth and country profile (spec 2026-10-27). Every figure
// was read on the official page cited on 27 Oct 2026. Notebook ae2c4048
// (Austria start-up) was used as a lead only. Research: docs/research/app-v3/at.md.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const NB = 'ae2c4048-880c-4c8e-8787-81a56479e3b9';

const STARTUP = 'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/start-up-founders/';
const SELF = 'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employed-key-workers/';
const VHQ = 'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/very-highly-qualified-workers/';
const TEMP = 'https://www.migration.gv.at/en/types-of-immigration/temporary-residence/';
const PR = 'https://www.oesterreich.gv.at/de/themen/menschen_aus_anderen_staaten/aufenthalt/3/2/Seite.120402';
const CIT = 'https://www.migration.gv.at/en/living-and-working-in-austria/integration-and-citizenship/citizenship/';
const FORMS = 'https://www.bmi.gv.at/312_EN/60a/start.aspx';
const POINTS = 'https://www.migration.gv.at/en/service-and-links/points-calculator/';

const TIMELINE: Timeline = {
  prAfterYears: 5,
  citizenshipAfterYears: 10,
  dualCitizenship: 'not-allowed',
  language: {
    en: 'German A2 (Module 1) within two years of the first card; B1 (Module 2) for long-term residence and citizenship; B2 can shorten citizenship to six years.',
    fa: 'آلمانی A2 (ماژول ۱) ظرف دو سال از صدور کارت اول؛ B1 (ماژول ۲) برای اقامت دائم و تابعیت؛ با B2 تابعیت ممکن است به شش سال کاهش یابد.',
  },
  note: {
    en: 'Citizenship: generally 10 years of lawful, continuous residence (at least 5 with a residence permit), own regular income, and in principle giving up your previous nationality. Six years is possible with B2 German or proof of sustained integration.',
    fa: 'تابعیت: معمولاً ۱۰ سال اقامت قانونی و پیوسته (دست‌کم ۵ سال با اجازه‌ی اقامت)، درآمد منظم شخصی و در اصل کنار گذاشتن تابعیت قبلی. با آلمانی B2 یا اثبات ادغام پایدار، شش سال هم ممکن است.',
  },
  source: CIT,
};

const STUDY_TIMELINE: Timeline = {
  ...TIMELINE,
  note: {
    en: 'Student years count only half toward the five years for long-term residence, and only once you hold a settlement permit (for example a Red-White-Red Card).',
    fa: 'سال‌های تحصیل فقط نصف در پنج سال لازم برای اقامت دائم حساب می‌شوند و آن هم وقتی اجازه‌ی اقامت دائمی‌پذیر (مثلاً کارت قرمز-سفید-قرمز) داشته باشید.',
  },
  source: PR,
};

const COMMON_DOCS = [
  { key: 'passport', label: { en: 'Valid passport (original and copy)', fa: 'گذرنامه‌ی معتبر (اصل و کپی)' }, stage: 'apply' as const },
  { key: 'photo', label: { en: 'Photo 45×35 mm, no older than six months', fa: 'عکس ۴۵×۳۵ میلی‌متر، حداکثر شش ماه پیش' }, stage: 'apply' as const },
  { key: 'insurance', label: { en: 'Health insurance covering all risks', fa: 'بیمه‌ی درمانی با پوشش همه‌ی خطرها' }, stage: 'apply' as const },
  {
    key: 'police',
    label: { en: 'Criminal record extract from your home country', fa: 'گواهی عدم سوءپیشینه از کشور خودتان' },
    note: { en: 'Ideally no older than three months; also from any country you lived in for more than six months before.', fa: 'بهتر است بیش از سه ماه از صدورش نگذشته باشد؛ از هر کشوری که پیش‌تر بیش از شش ماه در آن زندگی کرده‌اید هم لازم است.' },
    stage: 'apply' as const,
  },
  {
    key: 'translations',
    label: { en: 'Translations into German or English of every other document', fa: 'ترجمه‌ی آلمانی یا انگلیسی همه‌ی مدارک دیگر' },
    note: { en: 'The authority may ask for legalised documents.', fa: 'اداره ممکن است تأیید رسمی (لگالایز) مدارک را بخواهد.' },
    stage: 'apply' as const,
  },
];

export const EXTRAS_AT: Record<string, RouteExtras> = {
  'at-startup': {
    funds: [
      { key: 'capital', label: { en: 'Company capital (per company; each founder must hold at least 50%)', fa: 'سرمایه‌ی شرکت (برای کل شرکت؛ هر بنیان‌گذار باید دست‌کم ۵۰ درصد سهم داشته باشد)' }, amount: 30_000, currency: 'EUR', basis: 'once', per: 'team', kind: 'invest', source: STARTUP },
      { key: 'bonus-capital', label: { en: 'Extra investment capital for 10 bonus points (optional)', fa: 'سرمایه‌ی اضافه برای ۱۰ امتیاز تشویقی (اختیاری)' }, amount: 50_000, currency: 'EUR', basis: 'once', per: 'team', kind: 'invest', source: STARTUP },
      { key: 'fee', label: { en: 'Application fee', fa: 'هزینه‌ی درخواست' }, amount: 218, currency: 'EUR', basis: 'once', per: 'founder', kind: 'spend', source: STARTUP },
    ],
    steps: [
      {
        key: 'points',
        title: { en: 'Check your points', fa: 'امتیازتان را بسنجید' },
        detail: { en: 'Use the official points calculator. You need 50 of 85; age up to 35, an Austrian incubator and €50,000 extra capital each add 10.', fa: 'با ماشین‌حساب رسمی امتیاز بسنجید. ۵۰ امتیاز از ۸۵ لازم است؛ سن تا ۳۵، مرکز رشد اتریشی و ۵۰٬۰۰۰ یورو سرمایه‌ی اضافه هر کدام ۱۰ امتیاز دارند.' },
        link: POINTS,
      },
      {
        key: 'plan',
        title: { en: 'Write the business plan and secure the capital', fa: 'طرح کسب‌وکار را بنویسید و سرمایه را آماده کنید' },
        detail: { en: 'Show the innovation, how you will set up and run the company, and €30,000 of capital with at least 50% equity in your hands.', fa: 'نوآوری، برنامه‌ی تأسیس و اداره‌ی شرکت، و ۳۰٬۰۰۰ یورو سرمایه با دست‌کم ۵۰ درصد سهم برای خودتان را نشان دهید.' },
        link: 'https://www.gruenderservice.at/',
      },
      {
        key: 'documents',
        title: { en: 'Collect, translate and legalise documents', fa: 'مدارک را جمع، ترجمه و تأیید رسمی کنید' },
        detail: { en: 'Everything not in German or English is translated; bring originals and copies. Fill in the application form from the Interior Ministry.', fa: 'هر مدرکی که آلمانی یا انگلیسی نیست ترجمه می‌شود؛ اصل و کپی همراه داشته باشید. فرم درخواست وزارت کشور را پر کنید.' },
        link: FORMS,
      },
      {
        key: 'apply',
        title: { en: 'Apply in person and pay €218', fa: 'حضوری درخواست بدهید و ۲۱۸ یورو بپردازید' },
        detail: { en: 'From abroad at the Austrian embassy or consulate where you live; during a legal stay in Austria at the district or city authority (MA 35 in Vienna).', fa: 'از خارج در سفارت یا کنسولگری اتریش در کشور محل اقامت؛ در زمان اقامت قانونی در اتریش در اداره‌ی ناحیه یا شهر (MA 35 در وین).' },
        link: STARTUP,
      },
      {
        key: 'ams',
        title: { en: 'AMS assesses the macroeconomic benefit', fa: 'AMS سود اقتصادی طرح را ارزیابی می‌کند' },
        detail: { en: 'The residence authority forwards your file; the AMS gives its opinion.', fa: 'اداره‌ی اقامت پرونده را می‌فرستد و AMS نظر می‌دهد.' },
        takes: { en: 'Within three weeks', fa: 'ظرف سه هفته' },
        link: STARTUP,
      },
      {
        key: 'visa-d',
        title: { en: 'Enter on a visa D and collect the card', fa: 'با ویزای D وارد شوید و کارت را تحویل بگیرید' },
        detail: { en: 'If approved and you need a visa, apply for a visa D, travel, and collect the card in person. It is valid for up to 24 months.', fa: 'در صورت موافقت و اگر ویزا لازم دارید، ویزای D بگیرید، سفر کنید و کارت را حضوری تحویل بگیرید. اعتبار کارت تا ۲۴ ماه است.' },
        link: STARTUP,
      },
    ],
    documents: [
      ...COMMON_DOCS,
      { key: 'business-plan', label: { en: 'Business plan and evidence of innovation', fa: 'طرح کسب‌وکار و مدارک نوآوری' }, stage: 'apply' },
      { key: 'capital', label: { en: 'Proof of investment capital, including your equity', fa: 'مدرک سرمایه، از جمله سرمایه‌ی شخصی' }, stage: 'apply' },
      { key: 'qualification', label: { en: 'Diploma or vocational certificate, with proof of the institution’s status', fa: 'مدرک تحصیلی یا فنی‌وحرفه‌ای همراه با مدرک رسمیت مؤسسه' }, stage: 'apply' },
      { key: 'work', label: { en: 'Work certificates and testimonials', fa: 'گواهی‌ها و توصیه‌نامه‌های کاری' }, stage: 'apply' },
      { key: 'language', label: { en: 'Language certificate no older than five years', fa: 'مدرک زبان با حداکثر پنج سال سابقه' }, stage: 'apply' },
      { key: 'incubator', label: { en: 'Contract with an incubator or funding agency (if any)', fa: 'قرارداد با مرکز رشد یا نهاد حمایت مالی (در صورت وجود)' }, stage: 'apply' },
      { key: 'articles', label: { en: 'Articles of association (not for one-person companies)', fa: 'اساسنامه‌ی شرکت (برای شرکت تک‌نفره لازم نیست)' }, stage: 'apply' },
      { key: 'licences', label: { en: 'Trade licences (Gewerbeberechtigungen) where needed', fa: 'مجوز صنفی (Gewerbeberechtigung) در صورت نیاز' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'age-bonus',
        kind: 'tip',
        title: { en: 'Under 36 is worth 10 points', fa: 'زیر ۳۶ سال یعنی ۱۰ امتیاز' },
        detail: { en: 'Age up to 35 is a bonus of 10 points, as much as English at B2. Founders over 35 need to make it up elsewhere.', fa: 'سن تا ۳۵ سال ۱۰ امتیاز تشویقی دارد، هم‌اندازه‌ی انگلیسی B2. بنیان‌گذار بالای ۳۵ سال باید این کمبود را از جای دیگری جبران کند.' },
        source: STARTUP,
      },
      {
        key: 'two-founders',
        kind: 'challenge',
        title: { en: 'Each founder needs at least 50%', fa: 'هر بنیان‌گذار دست‌کم ۵۰ درصد سهم لازم دارد' },
        detail: { en: 'The page sets no team size, but every applicant must hold at least 50% of the equity, so in practice no more than two founders can use it for one company.', fa: 'تعداد اعضای تیم محدود نشده، اما هر متقاضی باید دست‌کم ۵۰ درصد سهام را داشته باشد؛ پس در عمل بیش از دو بنیان‌گذار نمی‌توانند برای یک شرکت از این مسیر استفاده کنند.' },
        source: STARTUP,
      },
      {
        key: 'old-certs',
        kind: 'challenge',
        title: { en: 'Old language certificates do not count', fa: 'مدرک زبان قدیمی پذیرفته نمی‌شود' },
        detail: { en: 'Language certificates must be no older than five years when you apply.', fa: 'مدرک زبان در زمان درخواست نباید بیش از پنج سال سابقه داشته باشد.' },
        source: STARTUP,
      },
      {
        key: 'plus',
        kind: 'tip',
        title: { en: 'After two years: an open labour market', fa: 'پس از دو سال: بازار کار آزاد' },
        detail: { en: 'The first card allows only your own company. After two years the Red-White-Red Card plus lets you also work for any employer.', fa: 'کارت اول فقط کار در شرکت خودتان را مجاز می‌کند. پس از دو سال، کارت پلاس اجازه‌ی کار برای هر کارفرمایی را هم می‌دهد.' },
        source: STARTUP,
      },
      {
        key: 'dual',
        kind: 'myth',
        title: { en: '“You keep your passport when you become Austrian”', fa: '«با گرفتن تابعیت اتریش، گذرنامه‌ی قبلی می‌ماند»' },
        detail: { en: 'Not as a rule: naturalisation in principle requires losing your previous citizenship.', fa: 'نه به‌عنوان قاعده: تابعیت اتریش در اصل با از دست دادن تابعیت قبلی همراه است.' },
        source: CIT,
      },
    ],
    timeline: TIMELINE,
    quiz: [
      {
        key: 'min-points',
        q: { en: 'How many points does a start-up founder need?', fa: 'بنیان‌گذار استارتاپ دست‌کم چند امتیاز لازم دارد؟' },
        options: [{ en: '50 of 85', fa: '۵۰ از ۸۵' }, { en: '70 of 100', fa: '۷۰ از ۱۰۰' }, { en: '55 of 90', fa: '۵۵ از ۹۰' }],
        answer: 0,
        why: { en: 'The start-up founder card needs at least 50 of 85 points.', fa: 'کارت بنیان‌گذار استارتاپ دست‌کم ۵۰ امتیاز از ۸۵ لازم دارد.' },
      },
      {
        key: 'capital',
        q: { en: 'What company capital must you prove?', fa: 'چه مقدار سرمایه برای شرکت باید ثابت کنید؟' },
        options: [{ en: '€10,000', fa: '۱۰٬۰۰۰ یورو' }, { en: '€30,000', fa: '۳۰٬۰۰۰ یورو' }, { en: '€100,000', fa: '۱۰۰٬۰۰۰ یورو' }],
        answer: 1,
        why: { en: 'At least €30,000, with an equity share of at least 50%.', fa: 'دست‌کم ۳۰٬۰۰۰ یورو، با سهم مالکیت دست‌کم ۵۰ درصد.' },
      },
      {
        key: 'ams',
        q: { en: 'Who judges the macroeconomic benefit?', fa: 'سود اقتصادی طرح را چه نهادی می‌سنجد؟' },
        options: [{ en: 'The Austrian embassy', fa: 'سفارت اتریش' }, { en: 'The Chamber of Commerce', fa: 'اتاق بازرگانی' }, { en: 'The Public Employment Service (AMS)', fa: 'اداره‌ی کار اتریش (AMS)' }],
        answer: 2,
        why: { en: 'The AMS gives an expert opinion within three weeks.', fa: 'AMS ظرف سه هفته نظر کارشناسی می‌دهد.' },
      },
      {
        key: 'validity',
        q: { en: 'How long is the first card valid?', fa: 'کارت اول حداکثر چه مدت اعتبار دارد؟' },
        options: [{ en: '12 months', fa: '۱۲ ماه' }, { en: '24 months', fa: '۲۴ ماه' }, { en: '36 months', fa: '۳۶ ماه' }],
        answer: 1,
        why: { en: 'Up to 24 months, then the Red-White-Red Card plus.', fa: 'حداکثر ۲۴ ماه و پس از آن کارت پلاس.' },
      },
      {
        key: 'english',
        q: { en: 'How many points does English at B2 give?', fa: 'انگلیسی B2 چند امتیاز دارد؟' },
        options: [{ en: '5', fa: '۵' }, { en: '10', fa: '۱۰' }, { en: '15', fa: '۱۵' }],
        answer: 1,
        why: { en: 'English B2 gives 10; only German C1–C2 gives 15.', fa: 'انگلیسی B2 ده امتیاز دارد؛ ۱۵ امتیاز فقط برای آلمانی C1 تا C2 است.' },
      },
    ],
    media: [
      { notebookId: NB, kind: 'slides', title: 'Austrian Startup Founder Guide' },
      { notebookId: NB, kind: 'slides', title: 'Austria Startup Visa Blueprint' },
      { notebookId: NB, kind: 'infographic', title: 'راهنمای دریافت کارت اقامت اتریش' },
      { notebookId: NB, kind: 'infographic', title: 'راهنمای ویزای استارتاپ اتریش' },
    ],
  },

  'at-self-employed': {
    funds: [
      { key: 'investment', label: { en: 'Investment capital transferred to Austria (one of four ways to show benefit)', fa: 'سرمایه‌ی منتقل‌شده به اتریش (یکی از چهار راه اثبات سود اقتصادی)' }, amount: 100_000, currency: 'EUR', basis: 'once', per: 'person', kind: 'invest', source: SELF },
      { key: 'fee', label: { en: 'Application fee', fa: 'هزینه‌ی درخواست' }, amount: 218, currency: 'EUR', basis: 'once', per: 'person', kind: 'spend', source: SELF },
    ],
    steps: [
      {
        key: 'benefit',
        title: { en: 'Decide how you show the benefit', fa: 'روش اثبات سود اقتصادی را انتخاب کنید' },
        detail: { en: 'One is enough: €100,000 of capital transferred, jobs created or kept, know-how or new technology, or importance for the region.', fa: 'یکی کافی است: انتقال ۱۰۰٬۰۰۰ یورو سرمایه، ایجاد یا حفظ شغل، انتقال دانش یا فناوری تازه، یا اهمیت برای منطقه.' },
        link: SELF,
      },
      {
        key: 'plan',
        title: { en: 'Write the business plan', fa: 'طرح کسب‌وکار را بنویسید' },
        detail: { en: 'Market, competition, headquarters location and objectives, with evidence of the capital and planned jobs.', fa: 'بازار، رقابت، محل دفتر مرکزی و اهداف، همراه با مدرک سرمایه و برنامه‌ی ایجاد شغل.' },
        link: SELF,
      },
      {
        key: 'apply',
        title: { en: 'Apply in person and pay €218', fa: 'حضوری درخواست بدهید و ۲۱۸ یورو بپردازید' },
        detail: { en: 'At the Austrian embassy abroad, or at the residence authority during a legal stay in Austria.', fa: 'در سفارت اتریش در خارج، یا در اداره‌ی اقامت در زمان اقامت قانونی در اتریش.' },
        link: FORMS,
      },
      {
        key: 'ams',
        title: { en: 'AMS opinion', fa: 'نظر AMS' },
        detail: { en: 'The AMS checks the macroeconomic benefit.', fa: 'AMS سود اقتصادی کلان را بررسی می‌کند.' },
        takes: { en: 'Within three weeks', fa: 'ظرف سه هفته' },
        link: SELF,
      },
      {
        key: 'collect',
        title: { en: 'Visa D and card collection', fa: 'ویزای D و تحویل کارت' },
        detail: { en: 'Enter on a visa D if you need one and collect the 24-month card.', fa: 'در صورت نیاز با ویزای D وارد شوید و کارت ۲۴ ماهه را تحویل بگیرید.' },
        link: SELF,
      },
    ],
    documents: [
      ...COMMON_DOCS,
      { key: 'business-plan', label: { en: 'Business plan: market, competition, location, objectives', fa: 'طرح کسب‌وکار: بازار، رقابت، محل، اهداف' }, stage: 'apply' },
      { key: 'capital', label: { en: 'Evidence of the capital transfer and planned jobs', fa: 'مدرک انتقال سرمایه و برنامه‌ی ایجاد شغل' }, stage: 'apply' },
      { key: 'qualification', label: { en: 'Evidence of the qualifications the activity needs', fa: 'مدرک صلاحیت لازم برای فعالیت' }, stage: 'apply' },
      { key: 'agreements', label: { en: 'Company agreements, if any', fa: 'قراردادهای شرکت، در صورت وجود' }, stage: 'apply' },
      { key: 'licences', label: { en: 'Trade licences where needed', fa: 'مجوز صنفی در صورت نیاز' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'no-points',
        kind: 'tip',
        title: { en: 'No points, no age bar', fa: 'بدون امتیاز و بدون محدودیت سنی' },
        detail: { en: 'Unlike the start-up card, there is no points test: what counts is the benefit to Austria’s economy.', fa: 'برخلاف کارت استارتاپ، آزمون امتیازی ندارد؛ آنچه مهم است سود کسب‌وکار برای اقتصاد اتریش است.' },
        source: SELF,
      },
      {
        key: 'not-only-money',
        kind: 'myth',
        title: { en: '“It needs €100,000”', fa: '«حتماً ۱۰۰٬۰۰۰ یورو لازم است»' },
        detail: { en: 'Capital is one of four ways. Creating or keeping jobs, transferring know-how or regional importance can also qualify.', fa: 'سرمایه فقط یکی از چهار راه است. ایجاد یا حفظ شغل، انتقال دانش یا اهمیت منطقه‌ای هم می‌تواند کافی باشد.' },
        source: SELF,
      },
      {
        key: 'no-job',
        kind: 'challenge',
        title: { en: 'No employment on this card', fa: 'با این کارت نمی‌توانید کارمند شوید' },
        detail: { en: 'To take a job you must switch to another Red-White-Red Card category and meet its points and job-offer rules.', fa: 'برای استخدام شدن باید به دسته‌ی دیگری از کارت قرمز-سفید-قرمز تغییر وضعیت دهید و شرایط امتیاز و پیشنهاد کاری آن را داشته باشید.' },
        source: SELF,
      },
    ],
    timeline: TIMELINE,
    quiz: [
      {
        key: 'points',
        q: { en: 'Does this card have a points test?', fa: 'این کارت آزمون امتیازی دارد؟' },
        options: [{ en: 'Yes, 50 points', fa: 'بله، ۵۰ امتیاز' }, { en: 'Yes, 70 points', fa: 'بله، ۷۰ امتیاز' }, { en: 'No', fa: 'نه' }],
        answer: 2,
        why: { en: 'There is no points system for self-employed key workers.', fa: 'برای نیروی کلیدی خوداشتغال نظام امتیازی وجود ندارد.' },
      },
      {
        key: 'capital',
        q: { en: 'Which capital transfer counts as a macroeconomic benefit?', fa: 'انتقال چه مقدار سرمایه سود اقتصادی کلان به حساب می‌آید؟' },
        options: [{ en: '€30,000', fa: '۳۰٬۰۰۰ یورو' }, { en: '€100,000', fa: '۱۰۰٬۰۰۰ یورو' }, { en: '€500,000', fa: '۵۰۰٬۰۰۰ یورو' }],
        answer: 1,
        why: { en: 'A lasting transfer of at least €100,000 is one of the four ways.', fa: 'انتقال پایدار دست‌کم ۱۰۰٬۰۰۰ یورو یکی از چهار راه است.' },
      },
      {
        key: 'only-way',
        q: { en: 'Is capital the only way to qualify?', fa: 'آیا سرمایه تنها راه است؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No, jobs, know-how or regional importance also count', fa: 'نه، شغل، دانش فنی یا اهمیت منطقه‌ای هم حساب می‌شود' }],
        answer: 1,
        why: { en: 'Any one of the four conditions is enough.', fa: 'یکی از چهار شرط کافی است.' },
      },
      {
        key: 'validity',
        q: { en: 'How long is the card valid?', fa: 'کارت چه مدت اعتبار دارد؟' },
        options: [{ en: '12 months', fa: '۱۲ ماه' }, { en: '24 months', fa: '۲۴ ماه' }, { en: '5 years', fa: '۵ سال' }],
        answer: 1,
        why: { en: '24 months, then a settlement permit.', fa: '۲۴ ماه و سپس اجازه‌ی اقامت (Niederlassungsbewilligung).' },
      },
      {
        key: 'fee',
        q: { en: 'What is the application fee?', fa: 'هزینه‌ی درخواست چقدر است؟' },
        options: [{ en: '€120', fa: '۱۲۰ یورو' }, { en: '€218', fa: '۲۱۸ یورو' }, { en: '€275', fa: '۲۷۵ یورو' }],
        answer: 1,
        why: { en: 'The page lists €218.', fa: 'صفحه‌ی رسمی ۲۱۸ یورو اعلام کرده است.' },
      },
    ],
    media: [],
  },

  'at-very-highly-qualified': {
    funds: [
      { key: 'visa-fee', label: { en: 'Job-seeker visa fee', fa: 'هزینه‌ی ویزای جست‌وجوی کار' }, amount: 195, currency: 'EUR', basis: 'once', per: 'person', kind: 'spend', source: VHQ },
      { key: 'card-fee', label: { en: 'Card application fee', fa: 'هزینه‌ی درخواست کارت' }, amount: 218, currency: 'EUR', basis: 'once', per: 'person', kind: 'spend', source: VHQ },
    ],
    steps: [
      {
        key: 'points',
        title: { en: 'Reach 70 points', fa: 'به ۷۰ امتیاز برسید' },
        detail: { en: 'Degree, work experience, German or English, age and studies in Austria add up; 70 of 100 is the bar.', fa: 'تحصیلات، سابقه‌ی کار، آلمانی یا انگلیسی، سن و تحصیل در اتریش جمع می‌شوند؛ حد نصاب ۷۰ از ۱۰۰ است.' },
        link: POINTS,
      },
      {
        key: 'visa',
        title: { en: 'Apply for the job-seeker visa (or skip it if visa-free)', fa: 'ویزای جست‌وجوی کار بگیرید (اگر بدون ویزا وارد می‌شوید لازم نیست)' },
        detail: { en: 'In person at the Austrian embassy. Issued once the AMS confirms your points. Valid six months.', fa: 'حضوری در سفارت اتریش. پس از تأیید امتیازها از سوی AMS صادر می‌شود و شش ماه اعتبار دارد.' },
        link: VHQ,
      },
      {
        key: 'job',
        title: { en: 'Find a job that matches your qualifications', fa: 'شغلی متناسب با تخصص‌تان پیدا کنید' },
        detail: { en: 'The offer must match your qualifications and pay adequately.', fa: 'پیشنهاد کاری باید با تخصص شما جور باشد و حقوق مناسب داشته باشد.' },
        link: 'https://www.ams.at/',
      },
      {
        key: 'card',
        title: { en: 'Apply for the card', fa: 'برای کارت درخواست بدهید' },
        detail: { en: 'At the embassy, or your employer applies at the residence authority in Austria. The AMS checks the offer.', fa: 'در سفارت، یا کارفرما در اداره‌ی اقامت در اتریش درخواست می‌دهد. AMS پیشنهاد کاری را بررسی می‌کند.' },
        link: VHQ,
      },
      {
        key: 'plus',
        title: { en: 'Move to the Red-White-Red Card plus', fa: 'به کارت پلاس تغییر وضعیت بدهید' },
        detail: { en: 'After 21 months of qualifying work within 24 months.', fa: 'پس از ۲۱ ماه کار واجد شرایط در ۲۴ ماه.' },
        link: VHQ,
      },
    ],
    documents: [
      ...COMMON_DOCS,
      { key: 'accommodation', label: { en: 'Proof of local accommodation (job-seeker visa)', fa: 'مدرک محل سکونت (برای ویزای جست‌وجوی کار)' }, stage: 'visa' },
      { key: 'means', label: { en: 'Proof of adequate means of subsistence (job-seeker visa)', fa: 'مدرک تمکن مالی کافی (برای ویزای جست‌وجوی کار)' }, stage: 'visa' },
      { key: 'degree', label: { en: 'Proof of a 4-year degree, MINT subject or habilitation', fa: 'مدرک دوره‌ی چهارساله، رشته‌ی MINT یا هابیلیتاسیون' }, stage: 'apply' },
      { key: 'salary', label: { en: 'Tax notice or pay certificate (senior-manager salary points)', fa: 'برگه‌ی مالیاتی یا گواهی حقوق (برای امتیاز حقوق مدیریتی)' }, stage: 'apply' },
      { key: 'research', label: { en: 'Publication list and patent extracts (research points)', fa: 'فهرست مقاله‌ها و گواهی ثبت اختراع (برای امتیاز پژوهش)' }, stage: 'apply' },
      { key: 'language', label: { en: 'A1 or A2 certificate (ÖSD, Goethe, telc, ÖIF, IELTS, TOEFL…), under five years old', fa: 'مدرک A1 یا A2 (ÖSD، گوته، telc، ÖIF، IELTS، TOEFL و…) با حداکثر پنج سال سابقه' }, stage: 'apply' },
      { key: 'offer', label: { en: 'Job offer (for the card)', fa: 'پیشنهاد کاری (برای کارت)' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'no-offer',
        kind: 'tip',
        title: { en: 'You can come without a job offer', fa: 'بدون پیشنهاد کاری هم می‌توانید بیایید' },
        detail: { en: 'With 70 points the six-month job-seeker visa lets you look for work inside Austria.', fa: 'با ۷۰ امتیاز، ویزای شش‌ماهه‌ی جست‌وجوی کار اجازه می‌دهد در خود اتریش دنبال کار بگردید.' },
        source: VHQ,
      },
      {
        key: 'age',
        kind: 'challenge',
        title: { en: 'Age weighs heavily', fa: 'سن وزن زیادی دارد' },
        detail: { en: 'Under 35 gives 20 points, under 45 only 10, and 45 or older nothing.', fa: 'زیر ۳۵ سال ۲۰ امتیاز، زیر ۴۵ فقط ۱۰ امتیاز و ۴۵ سال به بالا هیچ امتیازی ندارد.' },
        source: VHQ,
      },
      {
        key: 'recognition',
        kind: 'myth',
        title: { en: '“You must have your degree recognised first”', fa: '«اول باید مدرک را ارزش‌گذاری کنید»' },
        detail: { en: 'Formal recognition is needed only for regulated professions such as health, teaching and law.', fa: 'ارزش‌گذاری رسمی فقط برای مشاغل تنظیم‌شده مثل پزشکی، تدریس و حقوق لازم است.' },
        source: VHQ,
      },
      {
        key: 'employer',
        kind: 'challenge',
        title: { en: 'Tied to one employer at first', fa: 'در ابتدا وابسته به یک کارفرما' },
        detail: { en: 'The card covers the named employer. A change needs a new application and a 45-day wait once the file is complete.', fa: 'کارت فقط برای کارفرمای نام‌برده معتبر است. تغییر کارفرما درخواست تازه و ۴۵ روز انتظار پس از کامل شدن پرونده لازم دارد.' },
        source: VHQ,
      },
    ],
    timeline: TIMELINE,
    quiz: [
      {
        key: 'min',
        q: { en: 'How many points do you need?', fa: 'دست‌کم چند امتیاز لازم است؟' },
        options: [{ en: '50 of 85', fa: '۵۰ از ۸۵' }, { en: '70 of 100', fa: '۷۰ از ۱۰۰' }, { en: '67 of 100', fa: '۶۷ از ۱۰۰' }],
        answer: 1,
        why: { en: 'Very highly qualified workers need at least 70 of 100.', fa: 'نیروی بسیار متخصص دست‌کم ۷۰ از ۱۰۰ امتیاز لازم دارد.' },
      },
      {
        key: 'visa',
        q: { en: 'How long is the job-seeker visa valid?', fa: 'ویزای جست‌وجوی کار چه مدت اعتبار دارد؟' },
        options: [{ en: '3 months', fa: '۳ ماه' }, { en: '6 months', fa: '۶ ماه' }, { en: '12 months', fa: '۱۲ ماه' }],
        answer: 1,
        why: { en: 'Six months.', fa: 'شش ماه.' },
      },
      {
        key: 'phd',
        q: { en: 'How many points does a PhD give?', fa: 'مدرک دکتری چند امتیاز دارد؟' },
        options: [{ en: '20', fa: '۲۰' }, { en: '30', fa: '۳۰' }, { en: '40', fa: '۴۰' }],
        answer: 2,
        why: { en: 'Habilitation or PhD: 40 points.', fa: 'هابیلیتاسیون یا دکتری: ۴۰ امتیاز.' },
      },
      {
        key: 'age',
        q: { en: 'How many points for age under 35?', fa: 'سن زیر ۳۵ سال چند امتیاز دارد؟' },
        options: [{ en: '10', fa: '۱۰' }, { en: '15', fa: '۱۵' }, { en: '20', fa: '۲۰' }],
        answer: 2,
        why: { en: 'Under 35 gives 20 points.', fa: 'زیر ۳۵ سال ۲۰ امتیاز دارد.' },
      },
      {
        key: 'plus',
        q: { en: 'When can you get the Red-White-Red Card plus?', fa: 'کارت پلاس را کی می‌توان گرفت؟' },
        options: [{ en: 'After 12 months', fa: 'پس از ۱۲ ماه' }, { en: 'After 21 months of work in 24', fa: 'پس از ۲۱ ماه کار در ۲۴ ماه' }, { en: 'After 5 years', fa: 'پس از ۵ سال' }],
        answer: 1,
        why: { en: 'At least 21 months of qualifying work in the preceding 24.', fa: 'دست‌کم ۲۱ ماه کار واجد شرایط در ۲۴ ماه گذشته.' },
      },
    ],
    media: [],
  },

  'at-study': {
    funds: [
      { key: 'under-24', label: { en: 'Living costs per month, under 24', fa: 'هزینه‌ی زندگی ماهانه، زیر ۲۴ سال' }, amount: 777.58, currency: 'EUR', basis: 'month', per: 'person', kind: 'show', source: TEMP },
      { key: 'from-24', label: { en: 'Living costs per month, 24 and over', fa: 'هزینه‌ی زندگی ماهانه، ۲۴ سال به بالا' }, amount: 1_308.39, currency: 'EUR', basis: 'month', per: 'person', kind: 'show', source: TEMP },
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get admitted', fa: 'پذیرش بگیرید' },
        detail: { en: 'From a university, university of applied sciences or private university; university courses need at least 40 ECTS.', fa: 'از دانشگاه، دانشگاه علوم کاربردی یا دانشگاه خصوصی؛ دوره‌های دانشگاهی باید دست‌کم ۴۰ واحد ECTS داشته باشند.' },
        link: 'https://studyinaustria.at/',
      },
      {
        key: 'funds',
        title: { en: 'Prepare proof of funds and insurance', fa: 'مدرک تمکن و بیمه را آماده کنید' },
        detail: { en: '€777.58 a month under 24 or €1,308.39 from 24, and health insurance valid in Austria. A liability declaration is allowed.', fa: 'ماهانه ۷۷۷٫۵۸ یورو زیر ۲۴ سال یا ۱٬۳۰۸٫۳۹ یورو از ۲۴ سالگی، و بیمه‌ی درمانی معتبر در اتریش. تعهدنامه‌ی حمایت مالی هم پذیرفته می‌شود.' },
        link: TEMP,
      },
      {
        key: 'apply',
        title: { en: 'Apply at the Austrian embassy', fa: 'در سفارت اتریش درخواست بدهید' },
        detail: { en: 'First applications are made abroad; after a legal entry you can also apply in Austria.', fa: 'درخواست اول از خارج داده می‌شود؛ پس از ورود قانونی می‌توان در اتریش هم درخواست داد.' },
        link: FORMS,
      },
      {
        key: 'extend',
        title: { en: 'Extend with study progress', fa: 'با پیشرفت تحصیلی تمدید کنید' },
        detail: { en: 'Each extension needs proof of successful study.', fa: 'هر تمدید به مدرک موفقیت تحصیلی نیاز دارد.' },
        link: TEMP,
      },
      {
        key: 'after',
        title: { en: 'After graduation: 12 months to find work', fa: 'پس از فارغ‌التحصیلی: ۱۲ ماه برای پیدا کردن کار' },
        detail: { en: 'A one-time 12-month extension to look for work or start a business, then a switch to a Red-White-Red Card.', fa: 'یک بار تمدید ۱۲ ماهه برای کاریابی یا راه‌اندازی کسب‌وکار و سپس تغییر به کارت قرمز-سفید-قرمز.' },
        link: TEMP,
      },
    ],
    documents: [
      ...COMMON_DOCS,
      { key: 'admission', label: { en: 'Admission letter', fa: 'نامه‌ی پذیرش' }, stage: 'apply' },
      { key: 'funds', label: { en: 'Proof of means of subsistence', fa: 'مدرک تمکن مالی' }, stage: 'apply' },
      { key: 'progress', label: { en: 'Proof of study success', fa: 'مدرک موفقیت تحصیلی' }, stage: 'renewal' },
    ],
    realities: [
      {
        key: 'work',
        kind: 'challenge',
        title: { en: 'Work needs a permit', fa: 'کار کردن مجوز لازم دارد' },
        detail: { en: 'Even small jobs need an employment permit from the AMS, available for up to 20 hours a week without a labour-market test.', fa: 'حتی کار کم‌ساعت هم مجوز اشتغال از AMS لازم دارد که تا ۲۰ ساعت در هفته بدون آزمون بازار کار صادر می‌شود.' },
        source: TEMP,
      },
      {
        key: 'half',
        kind: 'challenge',
        title: { en: 'Study years count half', fa: 'سال‌های تحصیل نصف حساب می‌شوند' },
        detail: { en: 'Toward long-term residence, student years count half, and only once you hold a settlement permit.', fa: 'در محاسبه‌ی اقامت دائم، سال‌های تحصیل نصف حساب می‌شوند و فقط وقتی اجازه‌ی اقامت دائمی‌پذیر داشته باشید.' },
        source: PR,
      },
      {
        key: 'no-lease',
        kind: 'myth',
        title: { en: '“You need a lease before you apply”', fa: '«پیش از درخواست حتماً قرارداد اجاره لازم است»' },
        detail: { en: 'Accommodation is not a requirement for the student permit, though rent counts against your funds.', fa: 'محل سکونت شرط اقامت تحصیلی نیست، هرچند اجاره از تمکن شما کم می‌شود.' },
        source: TEMP,
      },
    ],
    timeline: STUDY_TIMELINE,
    quiz: [
      {
        key: 'funds',
        q: { en: 'Monthly funds for a student under 24?', fa: 'تمکن ماهانه برای دانشجوی زیر ۲۴ سال؟' },
        options: [{ en: '€577.58', fa: '۵۷۷٫۵۸ یورو' }, { en: '€777.58', fa: '۷۷۷٫۵۸ یورو' }, { en: '€1,308.39', fa: '۱٬۳۰۸٫۳۹ یورو' }],
        answer: 1,
        why: { en: 'The page lists €777.58 under 24.', fa: 'صفحه‌ی رسمی برای زیر ۲۴ سال ۷۷۷٫۵۸ یورو اعلام کرده است.' },
      },
      {
        key: 'hours',
        q: { en: 'How many hours a week can students get a work permit for without a labour-market test?', fa: 'دانشجو بدون آزمون بازار کار برای چند ساعت در هفته مجوز کار می‌گیرد؟' },
        options: [{ en: '10', fa: '۱۰' }, { en: '20', fa: '۲۰' }, { en: '30', fa: '۳۰' }],
        answer: 1,
        why: { en: 'Up to 20 hours a week.', fa: 'تا ۲۰ ساعت در هفته.' },
      },
      {
        key: 'after',
        q: { en: 'How long can you stay after graduating to look for work?', fa: 'پس از فارغ‌التحصیلی چه مدت برای کاریابی می‌توانید بمانید؟' },
        options: [{ en: '6 months', fa: '۶ ماه' }, { en: '12 months', fa: '۱۲ ماه' }, { en: '24 months', fa: '۲۴ ماه' }],
        answer: 1,
        why: { en: 'A one-time 12-month extension.', fa: 'یک بار تمدید ۱۲ ماهه.' },
      },
      {
        key: 'pr',
        q: { en: 'How do study years count toward long-term residence?', fa: 'سال‌های تحصیل چگونه در اقامت دائم حساب می‌شوند؟' },
        options: [{ en: 'In full', fa: 'کامل' }, { en: 'Half', fa: 'نصف' }, { en: 'Not at all', fa: 'اصلاً' }],
        answer: 1,
        why: { en: 'They count half once you hold a settlement permit.', fa: 'با داشتن اجازه‌ی اقامت دائمی‌پذیر نصف حساب می‌شوند.' },
      },
      {
        key: 'ects',
        q: { en: 'A university course must have at least how many ECTS?', fa: 'دوره‌ی دانشگاهی دست‌کم چند واحد ECTS باید داشته باشد؟' },
        options: [{ en: '30', fa: '۳۰' }, { en: '40', fa: '۴۰' }, { en: '60', fa: '۶۰' }],
        answer: 1,
        why: { en: 'At least 40 ECTS.', fa: 'دست‌کم ۴۰ واحد ECTS.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_AT: CountryProfile = {
  strengths: [
    { en: 'A published points table: you can check the start-up and very-highly-qualified bars before you apply.', fa: 'جدول امتیاز منتشرشده: پیش از درخواست می‌توانید حد نصاب کارت استارتاپ و نیروی بسیار متخصص را بسنجید.' },
    { en: 'English at B2 earns points; German is not needed to qualify.', fa: 'انگلیسی B2 امتیاز دارد و برای واجد شرایط شدن آلمانی لازم نیست.' },
    { en: 'The AMS opinion on a business comes within three weeks.', fa: 'نظر AMS درباره‌ی کسب‌وکار ظرف سه هفته می‌آید.' },
    { en: 'Very high English proficiency and one of the most peaceful countries in the world.', fa: 'سطح بسیار بالای انگلیسی مردم و یکی از امن‌ترین کشورهای جهان.' },
  ],
  weaknesses: [
    { en: 'Dual citizenship is in principle not allowed: Austrians by naturalisation give up their previous nationality.', fa: 'تابعیت دوگانه در اصل مجاز نیست و هنگام گرفتن تابعیت باید تابعیت قبلی را کنار گذاشت.' },
    { en: 'Citizenship generally takes 10 years; six only with B2 German or proven integration.', fa: 'تابعیت معمولاً ۱۰ سال طول می‌کشد؛ شش سال فقط با آلمانی B2 یا اثبات ادغام.' },
    { en: 'German is required for long-term residence (B1) even if you work in English.', fa: 'برای اقامت دائم آلمانی B1 لازم است، حتی اگر به انگلیسی کار کنید.' },
    { en: 'Age matters: founders over 35 lose 10 points, workers over 45 lose all age points.', fa: 'سن مهم است: بنیان‌گذار بالای ۳۵ سال ۱۰ امتیاز و نیروی کار بالای ۴۵ سال همه‌ی امتیاز سن را از دست می‌دهد.' },
  ],
  indicators: [
    { key: 'hdi', rank: 22, of: 193, value: 0.93, year: 2023, source: { url: 'https://hdr.undp.org/data-center/specific-country-data#/countries/AUT', checked: '2026-10-27', label: 'UNDP HDR 2025 (2023 data)' } },
    { key: 'happiness', rank: 19, year: 2026, source: { url: 'https://data.worldhappiness.report/table', checked: '2026-10-27', label: 'World Happiness Report 2026' } },
    { key: 'peace', rank: 6, of: 163, year: 2026, source: { url: 'https://www.visionofhumanity.org/why-iceland-stretched-its-lead-among-the-worlds-10-most-peaceful-countries-in-2026/', checked: '2026-10-27', label: 'Global Peace Index 2026' } },
    { key: 'gdp-per-capita', value: 62_930, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/AUT/indicator/NY.GDP.PCAP.CD?format=json', checked: '2026-10-27', label: 'World Bank' } },
    { key: 'unemployment', value: 5.6, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/AUT/indicator/SL.UEM.TOTL.ZS?format=json', checked: '2026-10-27', label: 'World Bank (ILO estimate)' } },
    { key: 'innovation', rank: 18, of: 139, year: 2026, source: { url: 'https://www.wipo.int/web-publications/global-innovation-index-2026/en/gii-2026-results.html', checked: '2026-10-27', label: 'WIPO GII 2026' } },
    { key: 'english', rank: 3, of: 123, year: 2025, source: { url: 'https://www.ef.com/wwen/epi/', checked: '2026-10-27', label: 'EF EPI 2025' } },
  ],
};
