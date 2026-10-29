// VisaRoads v2 routes, Austria. Checked 27 Oct 2026 on migration.gv.at and
// oesterreich.gv.at (research: docs/research/app-v3/at.md). Notebook
// ae2c4048 was used as a lead only. Follow the rules in ./types.ts.
import type { RouteV2 } from './types';

const CHECKED = '2026-10-27';

const URL_STARTUP = 'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/start-up-founders/';
const URL_SELF = 'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employed-key-workers/';
const URL_VHQ = 'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/very-highly-qualified-workers/';
const URL_TEMP = 'https://www.migration.gv.at/en/types-of-immigration/temporary-residence/';
const URL_PR = 'https://www.oesterreich.gv.at/de/themen/menschen_aus_anderen_staaten/aufenthalt/3/2/Seite.120402';
const URL_IV = 'https://www.migration.gv.at/en/living-and-working-in-austria/integration-and-citizenship/integration-agreement/';

export const ROUTES_AT: RouteV2[] = [
  {
    key: 'at-startup',
    country: 'AT',
    family: 'startup',
    name: { en: 'Red-White-Red Card for start-up founders', fa: 'کارت قرمز-سفید-قرمز برای بنیان‌گذاران استارتاپ (Red-White-Red Card)' },
    agency: {
      en: 'Residence authority (Austrian embassy abroad, or the district/city authority in Austria); AMS gives the expert opinion',
      fa: 'اداره‌ی اقامت (سفارت اتریش در خارج، یا اداره‌ی ناحیه/شهر در اتریش)؛ نظر کارشناسی را AMS (اداره‌ی کار اتریش) می‌دهد',
    },
    status: 'open',
    fact: {
      en: 'You need at least 50 of 85 points, company capital of at least €30,000 and an equity share of at least 50%. The AMS judges the macroeconomic benefit within three weeks.',
      fa: 'دست‌کم ۵۰ امتیاز از ۸۵، سرمایه‌ی دست‌کم ۳۰٬۰۰۰ یورویی برای شرکت و سهم مالکیت دست‌کم ۵۰ درصد لازم است. AMS ظرف سه هفته درباره‌ی سود اقتصادی طرح نظر می‌دهد.',
    },
    criteria: [
      {
        key: 'innovation',
        label: { en: 'An innovative product, service, process or technology, with a consistent business plan', fa: 'محصول، خدمت، روش یا فناوری نوآورانه با طرح کسب‌وکار منسجم' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'capital',
        label: { en: 'Company capital of at least €30,000', fa: 'سرمایه‌ی شرکت دست‌کم ۳۰٬۰۰۰ یورو' },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 30_000, currency: 'EUR' },
        note: {
          en: 'Another €50,000 of investment capital earns 10 bonus points.',
          fa: '۵۰٬۰۰۰ یورو سرمایه‌ی اضافه ۱۰ امتیاز تشویقی دارد.',
        },
      },
      {
        key: 'equity',
        label: { en: 'Equity share of at least 50% and controlling influence over management', fa: 'سهم مالکیت دست‌کم ۵۰ درصد و نفوذ تعیین‌کننده در مدیریت شرکت' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'The page sets no team size; the 50% share per applicant is what limits it.',
          fa: 'سقفی برای تعداد اعضای تیم تعیین نشده؛ آنچه آن را محدود می‌کند همین سهم ۵۰ درصدی هر متقاضی است.',
        },
      },
      {
        key: 'points',
        label: { en: 'At least 50 of 85 points (qualification, experience, language, bonus)', fa: 'دست‌کم ۵۰ امتیاز از ۸۵ (تحصیلات، سابقه‌ی کار، زبان، امتیاز تشویقی)' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Qualification up to 30 (3-year degree: 20; degree completed in Austria: 30); 1 point per half-year of relevant work, up to 10; German A2 5, B1–B2 10, C1–C2 15, English B2 10; bonus 10 each for €50,000 extra capital, an Austrian incubator or funding agency, and age up to 35. Language certificates must be under five years old.',
          fa: 'تحصیلات تا ۳۰ (مدرک دانشگاهی دست‌کم سه‌ساله: ۲۰؛ مدرک گرفته‌شده در اتریش: ۳۰)؛ هر شش ماه سابقه‌ی کار مرتبط ۱ امتیاز تا سقف ۱۰؛ آلمانی A2 پنج، B1 تا B2 ده، C1 تا C2 پانزده، انگلیسی B2 ده؛ امتیاز تشویقی ۱۰ برای هر یک از این‌ها: ۵۰٬۰۰۰ یورو سرمایه‌ی اضافه، پذیرش در مرکز رشد یا حمایت مالی نهاد استارتاپی اتریش، و سن تا ۳۵ سال. مدرک زبان نباید بیش از پنج سال سابقه داشته باشد.',
        },
      },
      {
        key: 'degree',
        label: { en: 'A degree from a programme of at least three years (20 points)', fa: 'مدرک دانشگاهی از دوره‌ی دست‌کم سه‌ساله (۲۰ امتیاز)' },
        weight: 1,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
        note: {
          en: 'Vocational training or special skills in the occupation also give 20 points.',
          fa: 'آموزش فنی‌وحرفه‌ای یا مهارت ویژه در همان شغل هم ۲۰ امتیاز دارد.',
        },
      },
      {
        key: 'english',
        label: { en: 'English at B2 (10 points), or German', fa: 'انگلیسی در سطح B2 (۱۰ امتیاز) یا زبان آلمانی' },
        weight: 1,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 7 },
      },
      {
        key: 'insurance',
        label: { en: 'Health insurance covering all risks', fa: 'بیمه‌ی درمانی با پوشش همه‌ی خطرها' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'capital',
        label: { en: 'Company capital', fa: 'سرمایه‌ی شرکت' },
        amount: 30_000,
        currency: 'EUR',
        basis: 'once',
        shows: {
          en: 'Proof of investment capital including the equity available; you must hold at least 50% of the company.',
          fa: 'مدرک سرمایه‌ی سرمایه‌گذاری، از جمله سرمایه‌ی شخصی موجود؛ دست‌کم ۵۰ درصد شرکت باید متعلق به خودتان باشد.',
        },
      },
      { key: 'bonus-capital', label: { en: 'Extra investment capital for 10 bonus points (optional)', fa: 'سرمایه‌ی اضافه برای ۱۰ امتیاز تشویقی (اختیاری)' }, amount: 50_000, currency: 'EUR', basis: 'once' },
    ],
    processing: {
      text: { en: 'The AMS gives its opinion within three weeks of receiving the file; the page gives no total time.', fa: 'AMS ظرف سه هفته پس از دریافت پرونده نظر می‌دهد؛ کل زمان رسیدگی در صفحه ذکر نشده است.' },
      source: URL_STARTUP,
    },
    fees: [{ label: { en: 'Application fee', fa: 'هزینه‌ی درخواست' }, amount: 218, currency: 'EUR' }],
    pr: {
      en: 'Card valid up to 24 months, then a Red-White-Red Card plus (open labour market). Long-term residence (Daueraufenthalt – EU) after five uninterrupted years with German at B1 (Module 2).',
      fa: 'کارت حداکثر ۲۴ ماه اعتبار دارد و پس از آن کارت قرمز-سفید-قرمز پلاس (دسترسی آزاد به بازار کار) صادر می‌شود. اقامت دائم (Daueraufenthalt – EU) پس از پنج سال اقامت بی‌وقفه و آلمانی B1 (ماژول ۲).',
    },
    sources: [
      { url: URL_STARTUP, checked: CHECKED, label: 'migration.gv.at, start-up founders' },
      { url: URL_PR, checked: CHECKED, label: 'oesterreich.gv.at, Daueraufenthalt – EU, updated 07.08.2026' },
      { url: URL_IV, checked: CHECKED, label: 'migration.gv.at, integration agreement' },
    ],
    verified: true,
    review:
      'Points total 85: the page lists maxima 30+10+15+30. Points are scored here only through degree and English as hints; the 50-point bar itself is left unscored (no profile field for Austrian incubator, German level). Notebook says "max 2 founders" — an inference from the 50% rule, not stated officially. No living-funds figure on the page; general settlement rules may ask for subsistence: re-check with MA 35.',
  },
  {
    key: 'at-self-employed',
    country: 'AT',
    family: 'entrepreneur',
    name: { en: 'Red-White-Red Card for self-employed key workers', fa: 'کارت قرمز-سفید-قرمز برای نیروی کلیدی خوداشتغال' },
    agency: {
      en: 'Residence authority (Austrian embassy abroad, or the district/city authority in Austria); AMS gives the expert opinion',
      fa: 'اداره‌ی اقامت (سفارت اتریش در خارج، یا اداره‌ی ناحیه/شهر در اتریش)؛ نظر کارشناسی را AMS می‌دهد',
    },
    status: 'open',
    fact: {
      en: 'There is no points test. The business must bring a macroeconomic benefit, for example a lasting transfer of at least €100,000 of investment capital to Austria, or new jobs.',
      fa: 'آزمون امتیازی ندارد. کسب‌وکار باید سود اقتصادی کلان داشته باشد؛ برای نمونه انتقال پایدار دست‌کم ۱۰۰٬۰۰۰ یورو سرمایه به اتریش یا ایجاد شغل.',
    },
    criteria: [
      {
        key: 'macro-benefit',
        label: { en: 'Macroeconomic benefit: €100,000 invested, jobs created or kept, know-how or new technology, or regional significance', fa: 'سود اقتصادی کلان: ۱۰۰٬۰۰۰ یورو سرمایه‌گذاری، ایجاد یا حفظ شغل، انتقال دانش یا فناوری تازه، یا اهمیت برای منطقه' },
        weight: 3,
        scoreable: true,
        anyOf: [{ field: 'investment', op: 'gte', value: 100_000, currency: 'EUR' }],
        openEnded: true,
        note: {
          en: 'Any one of the four is enough. Only the investment can be checked from your profile.',
          fa: 'یکی از این چهار مورد کافی است. فقط سرمایه‌گذاری را می‌توان از روی پروفایل شما سنجید.',
        },
      },
      {
        key: 'business-plan',
        label: { en: 'Business plan: market, competition, location and objectives', fa: 'طرح کسب‌وکار: بازار، رقابت، محل استقرار و اهداف' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'qualifications',
        label: { en: 'Qualifications needed for the activity, and trade licences where required', fa: 'صلاحیت لازم برای فعالیت و مجوز صنفی (Gewerbeberechtigung) در صورت نیاز' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'insurance',
        label: { en: 'Health insurance covering all risks', fa: 'بیمه‌ی درمانی با پوشش همه‌ی خطرها' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'investment',
        label: { en: 'Investment capital transferred to Austria (one of four ways to show benefit)', fa: 'سرمایه‌ی منتقل‌شده به اتریش (یکی از چهار راه اثبات سود اقتصادی)' },
        amount: 100_000,
        currency: 'EUR',
        basis: 'once',
        shows: { en: 'Evidence of the capital transfer and of planned jobs.', fa: 'مدرک انتقال سرمایه و برنامه‌ی ایجاد شغل.' },
      },
    ],
    processing: {
      text: { en: 'The AMS gives its opinion within three weeks; the page gives no total time.', fa: 'AMS ظرف سه هفته نظر می‌دهد؛ کل زمان رسیدگی در صفحه ذکر نشده است.' },
      source: URL_SELF,
    },
    fees: [{ label: { en: 'Application fee', fa: 'هزینه‌ی درخواست' }, amount: 218, currency: 'EUR' }],
    pr: {
      en: 'Card valid 24 months, then a settlement permit (Niederlassungsbewilligung), later for three years. Long-term residence after five uninterrupted years with German at B1 (Module 2).',
      fa: 'کارت ۲۴ ماه اعتبار دارد و سپس اجازه‌ی اقامت (Niederlassungsbewilligung) و بعد از آن سه‌ساله صادر می‌شود. اقامت دائم پس از پنج سال اقامت بی‌وقفه و آلمانی B1 (ماژول ۲).',
    },
    sources: [
      { url: URL_SELF, checked: CHECKED, label: 'migration.gv.at, self-employed key workers' },
      { url: URL_PR, checked: CHECKED, label: 'oesterreich.gv.at, Daueraufenthalt – EU' },
    ],
    verified: true,
    review: 'Not covered by the notebook (it only lists a third-party "residence permits for self-employed" source). To take a job you must switch to another Red-White-Red Card category.',
  },
  {
    key: 'at-very-highly-qualified',
    country: 'AT',
    family: 'express',
    name: { en: 'Red-White-Red Card for very highly qualified workers', fa: 'کارت قرمز-سفید-قرمز برای نیروی کار بسیار متخصص' },
    agency: {
      en: 'Austrian embassy (job-seeker visa); AMS checks the points; residence authority issues the card',
      fa: 'سفارت اتریش (ویزای جست‌وجوی کار)؛ AMS امتیازها را بررسی می‌کند؛ اداره‌ی اقامت کارت را صادر می‌کند',
    },
    status: 'open',
    fact: {
      en: 'At least 70 of 100 points lets you come for six months on a job-seeker visa. The card itself needs a job offer that matches your qualifications.',
      fa: 'با دست‌کم ۷۰ امتیاز از ۱۰۰ می‌توانید با ویزای شش‌ماهه‌ی جست‌وجوی کار به اتریش بیایید. خودِ کارت به پیشنهاد کاری متناسب با تخصص‌تان نیاز دارد.',
    },
    criteria: [
      {
        key: 'points',
        label: { en: 'At least 70 of 100 points', fa: 'دست‌کم ۷۰ امتیاز از ۱۰۰' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Qualifications up to 40 (4-year degree 20, MINT degree 30, PhD 40, senior-manager salary 20–30, research 20, awards 20); work experience 1 per half-year (+10 for six months in Austria), up to 20; German or English A1 5, A2 10, up to 10; age under 35 20, under 40 15, under 45 10; studies in Austria up to 10.',
          fa: 'تحصیلات و صلاحیت تا ۴۰ (مدرک چهارساله ۲۰، مدرک رشته‌های MINT سی، دکتری ۴۰، حقوق مدیر ارشد ۲۰ تا ۳۰، پژوهش ۲۰، جایزه ۲۰)؛ سابقه‌ی کار هر شش ماه ۱ امتیاز (شش ماه کار در اتریش ۱۰) تا سقف ۲۰؛ آلمانی یا انگلیسی A1 پنج و A2 ده؛ سن زیر ۳۵ بیست، زیر ۴۰ پانزده، زیر ۴۵ ده؛ تحصیل در اتریش تا ۱۰.',
        },
      },
      {
        key: 'degree',
        label: { en: 'Higher-education degree (programme of at least four years)', fa: 'مدرک آموزش عالی (دوره‌ی دست‌کم چهارساله)' },
        weight: 2,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
        note: { en: 'Three-year bachelor degrees may not reach the four-year bar.', fa: 'مدرک کارشناسی سه‌ساله ممکن است شرط چهارساله را پوشش ندهد.' },
      },
      {
        key: 'age',
        label: { en: 'Age under 45 for age points', fa: 'سن زیر ۴۵ سال برای امتیاز سن' },
        weight: 1,
        scoreable: true,
        test: { field: 'age', op: 'lte', value: 44 },
      },
      {
        key: 'language',
        label: { en: 'German or English at A2 (10 points)', fa: 'آلمانی یا انگلیسی در سطح A2 (۱۰ امتیاز)' },
        weight: 1,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 4 },
      },
      {
        key: 'job-offer',
        label: { en: 'Job offer matching your qualifications, with adequate pay (for the card)', fa: 'پیشنهاد کاری متناسب با تخصص و با حقوق مناسب (برای صدور کارت)' },
        weight: 3,
        scoreable: true,
        test: { field: 'jobOffer', op: 'true' },
        note: { en: 'Not needed for the job-seeker visa.', fa: 'برای ویزای جست‌وجوی کار لازم نیست.' },
      },
    ],
    money: [],
    fees: [
      { label: { en: 'Job-seeker visa', fa: 'ویزای جست‌وجوی کار' }, amount: 195, currency: 'EUR' },
      { label: { en: 'Card application fee', fa: 'هزینه‌ی درخواست کارت' }, amount: 218, currency: 'EUR' },
    ],
    pr: {
      en: 'Card generally 24 months; Red-White-Red Card plus after 21 months of qualifying work in 24. Long-term residence after five uninterrupted years with German at B1 (Module 2).',
      fa: 'کارت معمولاً ۲۴ ماهه است؛ پس از ۲۱ ماه کار واجد شرایط در ۲۴ ماه، کارت پلاس صادر می‌شود. اقامت دائم پس از پنج سال اقامت بی‌وقفه و آلمانی B1 (ماژول ۲).',
    },
    sources: [
      { url: URL_VHQ, checked: CHECKED, label: 'migration.gv.at, very highly qualified workers' },
      { url: URL_PR, checked: CHECKED, label: 'oesterreich.gv.at, Daueraufenthalt – EU' },
    ],
    verified: true,
    review:
      'Family set to `express` (points). The job-seeker visa needs "adequate means of subsistence" but the page gives no figure. englishClb 4 used as an A2 proxy. Processing time not stated on the page.',
  },
  {
    key: 'at-study',
    country: 'AT',
    family: 'study',
    name: { en: 'Residence permit – Students', fa: 'اجازه‌ی اقامت تحصیلی اتریش (Aufenthaltsbewilligung Studierende)' },
    agency: {
      en: 'Austrian embassy for the first application; district/city authority (MA 35 in Vienna) in Austria',
      fa: 'سفارت اتریش برای درخواست اول؛ اداره‌ی ناحیه/شهر (MA 35 در وین) در داخل اتریش',
    },
    status: 'open',
    fact: {
      en: 'After graduating you can get a one-time 12-month extension to look for work or start a business. Study time counts only half toward long-term residence.',
      fa: 'پس از فارغ‌التحصیلی یک بار می‌توانید ۱۲ ماه تمدید بگیرید تا کار پیدا کنید یا کسب‌وکار راه بیندازید. سال‌های تحصیل فقط نصف در اقامت دائم حساب می‌شوند.',
    },
    criteria: [
      {
        key: 'admission',
        label: { en: 'Admission to a university, university of applied sciences or private university', fa: 'پذیرش از دانشگاه، دانشگاه علوم کاربردی یا دانشگاه خصوصی' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'funds',
        label: { en: 'Means of subsistence: €777.58 a month under 24 (€1,308.39 from 24)', fa: 'تمکن مالی: ماهانه ۷۷۷٫۵۸ یورو زیر ۲۴ سال (از ۲۴ سالگی ۱٬۳۰۸٫۳۹ یورو)' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 9_331, currency: 'EUR' },
        note: {
          en: 'Twelve months at the under-24 rate; from 24 it is about €15,701. A liability declaration is allowed.',
          fa: 'دوازده ماه با نرخ زیر ۲۴ سال؛ از ۲۴ سالگی حدود ۱۵٬۷۰۱ یورو. تعهدنامه‌ی حمایت مالی (Haftungserklärung) هم پذیرفته می‌شود.',
        },
      },
      {
        key: 'insurance',
        label: { en: 'Health insurance covering all risks in Austria', fa: 'بیمه‌ی درمانی با پوشش همه‌ی خطرها در اتریش' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'progress',
        label: { en: 'Study progress for each extension', fa: 'پیشرفت تحصیلی برای هر تمدید' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'under-24',
        label: { en: 'Living costs per month, under 24', fa: 'هزینه‌ی زندگی ماهانه، زیر ۲۴ سال' },
        amount: 777.58,
        currency: 'EUR',
        basis: 'month',
        shows: { en: 'Regular monthly income or savings, a scholarship, or a liability declaration.', fa: 'درآمد منظم ماهانه یا پس‌انداز، بورسیه، یا تعهدنامه‌ی حمایت مالی.' },
      },
      { key: 'from-24', label: { en: 'Living costs per month, 24 and over', fa: 'هزینه‌ی زندگی ماهانه، ۲۴ سال به بالا' }, amount: 1_308.39, currency: 'EUR', basis: 'month' },
    ],
    pr: {
      en: 'Switch to a Red-White-Red Card after graduating. Student years count half toward the five years for long-term residence, if you then hold a settlement permit.',
      fa: 'پس از فارغ‌التحصیلی به کارت قرمز-سفید-قرمز تغییر وضعیت بدهید. سال‌های تحصیل به شرط داشتن اجازه‌ی اقامت دائمی‌پذیر، نصف در پنج سال لازم برای اقامت دائم حساب می‌شوند.',
    },
    sources: [
      { url: URL_TEMP, checked: CHECKED, label: 'migration.gv.at, temporary residence (students)' },
      { url: URL_PR, checked: CHECKED, label: 'oesterreich.gv.at, Daueraufenthalt – EU (students count half)' },
    ],
    verified: false,
    review:
      'The migration.gv.at page shows €777.58 / €1,308.39 without a year; its linked brochure is named 2025. Secondary sites give €722.58 for under-24 in 2026. €1,308.39 matches the 2026 single-person reference in oesterreich.gv.at. Application fee not on the page. Work: up to 20 h/week with an employment permit (Beschäftigungsbewilligung). Not covered by the notebook.',
  },
];
