// VisaRoads v2 routes, Spain. Checked 9 Nov 2026 on boe.es (consolidated
// texts), the UGE pages and PDFs on inclusion.gob.es (read in a browser: the
// site refuses curl), the Ministry of Inclusion's study sheet, one.gob.es and
// the Spanish Consulate in London. Research: docs/research/app-v3/es.md.
// No Gemini notebook for Spain. Fee amounts for tasa 790-038 are left out on
// purpose: the form prints them and they change every year.
import type { RouteV2 } from './types';

const CHECKED = '2026-11-09';

const BOE_14 = 'https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074';
const UGE_EMP = 'https://www.inclusion.gob.es/web/unidadgrandesempresas/emprendedores';
const UGE_INST =
  'https://www.inclusion.gob.es/documents/1823432/1826098/Instrucciones+solicitud+emprendedores.pdf/3a4d0b60-71bf-1c53-9f9d-fff7f94cbf5d?t=1682675484705';
const ONE_EMP = 'https://one.gob.es/en/procedures/application-entrepreneur-visa';
const LONDON = 'https://www.exteriores.gob.es/Consulados/londres/en/ServiciosConsulares/Paginas/Consular/Visado-para-emprendedor.aspx';
const UGE_TT = 'https://www.inclusion.gob.es/web/unidadgrandesempresas/teletrabajadores';
const UGE_TT_DOC = 'https://www.inclusion.gob.es/documents/d/unidadgrandesempresas/informacion-documentacion-pagina-web-titular-v2';
const SMI_2026 = 'https://www.boe.es/buscar/doc.php?id=BOE-A-2026-3815';
const UGE_PAC = 'https://www.inclusion.gob.es/web/unidadgrandesempresas/profesionales-altamente-cualificados';
const UGE_UMBRAL = 'https://www.inclusion.gob.es/documents/d/unidadgrandesempresas/umbral-salarial.pdf';
const STUDY = 'https://www.inclusion.gob.es/web/migraciones/w/estancia-por-estudios';
const RD_1155 = 'https://www.boe.es/buscar/act.php?id=BOE-A-2024-24099';
const PGE_2023 = 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-22128';

export const ROUTES_ES: RouteV2[] = [
  {
    key: 'es-entrepreneur',
    country: 'ES',
    family: 'startup',
    name: { en: 'Residence permit for entrepreneurs (Ley 14/2013)', fa: 'اقامت کارآفرینی اسپانیا (قانون ۱۴/۲۰۱۳)' },
    agency: {
      en: 'Large Companies and Strategic Groups Unit (UGE), Ministry of Inclusion; report by ENISA',
      fa: 'واحد شرکت‌های بزرگ و گروه‌های راهبردی (UGE) در وزارت ادغام اجتماعی، تأمین اجتماعی و مهاجرت؛ با گزارش ENISA',
    },
    status: 'open',
    fact: {
      en: 'No minimum investment and no job-creation quota: the permit turns on a favourable ENISA report that your activity is innovative and/or of special economic interest for Spain. The UGE must decide within 20 days of electronic filing, or the permit counts as granted.',
      fa: 'حداقل سرمایه‌گذاری و سهمیه‌ی اشتغال‌زایی ندارد. همه‌چیز به گزارش موافق ENISA بستگی دارد که فعالیت شما نوآورانه است و/یا برای اسپانیا منفعت اقتصادی ویژه دارد. UGE باید ظرف ۲۰ روز از ثبت الکترونیکی تصمیم بگیرد، وگرنه اقامت پذیرفته‌شده به شمار می‌آید.',
    },
    criteria: [
      {
        key: 'enisa',
        label: { en: 'Favourable ENISA report on the activity (innovative and/or of special economic interest)', fa: 'گزارش موافق ENISA درباره‌ی فعالیت (نوآورانه و/یا دارای منفعت اقتصادی ویژه)' },
        weight: 3,
        scoreable: true,
        test: { field: 'endorsement', op: 'true' },
        note: {
          en: 'The UGE asks ENISA for the report itself; you file the project questionnaire on the ENISA portal first.',
          fa: 'UGE خودش گزارش را از ENISA می‌خواهد؛ شما پیش از آن پرسش‌نامه‌ی طرح را در پورتال ENISA پر می‌کنید.',
        },
      },
      {
        key: 'plan',
        label: { en: 'Business plan: project, product or service, financing and its sources', fa: 'طرح کسب‌وکار: پروژه، محصول یا خدمت، تأمین مالی و منابع آن' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'profile',
        label: { en: 'Your professional profile and involvement; each partner is assessed', fa: 'سابقه‌ی حرفه‌ای و نقش شما در طرح؛ سهم هر شریک جدا سنجیده می‌شود' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'funds',
        label: { en: 'Sufficient means for you and your family for the stay', fa: 'منابع مالی کافی برای خود و خانواده در دوره‌ی اقامت' },
        weight: 2,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 21_600, currency: 'EUR' },
        closeAt: 0.33,
        note: {
          en: 'The law names no amount. One.gob.es and Spanish consulates use 100% of the IPREM a month (EUR 600 in 2026) plus 50% per family member. EUR 21,600 is that figure over the three-year permit, our multiplication; one year (EUR 7,200) counts as close.',
          fa: 'قانون رقمی نمی‌گذارد. one.gob.es و کنسولگری‌های اسپانیا ۱۰۰ درصد IPREM در ماه (۶۰۰ یورو در ۲۰۲۶) و برای هر عضو خانواده ۵۰ درصد بیشتر را ملاک می‌گیرند. ۲۱٬۶۰۰ یورو همین رقم برای سه سال اقامت است و ضرب آن کار ماست؛ یک سال (۷٬۲۰۰ یورو) «نزدیک» حساب می‌شود.',
        },
      },
      { key: 'age', label: { en: 'At least 18 years old', fa: 'دست‌کم ۱۸ سال سن' }, weight: 1, scoreable: true, test: { field: 'age', op: 'gte', value: 18 } },
      {
        key: 'record',
        label: { en: 'No criminal record in the countries of residence of the last two years, plus a declaration for five', fa: 'نداشتن سوءپیشینه در کشورهای محل اقامت دو سال اخیر، به‌علاوه‌ی اظهارنامه برای پنج سال' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'insurance',
        label: { en: 'Public or private health insurance with an insurer authorised in Spain', fa: 'بیمه‌ی درمانی دولتی یا خصوصی از بیمه‌گری که مجوز فعالیت در اسپانیا دارد' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'applicant',
        label: { en: 'Means, applicant (100% of IPREM)', fa: 'تمکن مالی، متقاضی (۱۰۰ درصد IPREM)' },
        amount: 600,
        currency: 'EUR',
        basis: 'month',
        shows: {
          en: 'Your own funds, for the period of residence; guarantor letters are not counted at consulates.',
          fa: 'پول خودتان برای دوره‌ی اقامت؛ کنسولگری‌ها نامه‌ی ضامن را حساب نمی‌کنند.',
        },
      },
      { key: 'family', label: { en: 'Each family member (50% of IPREM)', fa: 'هر عضو خانواده (۵۰ درصد IPREM)' }, amount: 300, currency: 'EUR', basis: 'month' },
    ],
    processing: {
      text: {
        en: 'ENISA report within 10 working days; UGE decision within 20 days of electronic filing, silence means granted; consular visa within 10 working days, except applicants subject to Visa Code art. 22 consultation.',
        fa: 'گزارش ENISA ظرف ۱۰ روز کاری؛ تصمیم UGE ظرف ۲۰ روز از ثبت الکترونیکی و سکوت یعنی پذیرش؛ ویزای کنسولی ظرف ۱۰ روز کاری، مگر برای متقاضیان مشمول رایزنی ماده‌ی ۲۲ کد ویزا.',
      },
      source: BOE_14,
    },
    pr: {
      en: 'Permit of three years, then two-year renewals while the business stays active; permanent residence possible after five years (art. 69).',
      fa: 'اقامت سه‌ساله، سپس تمدید دوساله تا وقتی کسب‌وکار فعال است؛ اقامت دائم پس از پنج سال (ماده‌ی ۶۹).',
    },
    sources: [
      { url: BOE_14, checked: CHECKED, label: 'BOE, Ley 14/2013 consolidated (arts. 62, 69, 70, 75, 76)' },
      { url: UGE_EMP, checked: CHECKED, label: 'UGE, Entrepreneurs' },
      { url: UGE_INST, checked: CHECKED, label: 'UGE, instructions for the entrepreneur application (PDF)' },
      { url: ONE_EMP, checked: CHECKED, label: 'one.gob.es, application for the entrepreneur visa (IPREM criterion)' },
      { url: LONDON, checked: CHECKED, label: 'Consulate General of Spain in London, entrepreneur visa' },
      { url: PGE_2023, checked: CHECKED, label: 'BOE, Ley 31/2022, DA 90: IPREM EUR 600 a month' },
    ],
    verified: true,
    review:
      'IPREM criterion (100% + 50% per member) is on one.gob.es and consulate pages, not on any UGE page; Ley 14/2013 DA 20.3 (since 2023) says means thresholds shall be referenced to the SMI, so the IPREM figure may be superseded by instructions we have not seen. IPREM EUR 600 is the 2023 budget figure; prorogation into 2026 taken from secondary sources, no 2026 budget act found. Funds test (21,600 = 36 months) is our multiplication.',
  },
  {
    key: 'es-digital-nomad',
    country: 'ES',
    family: 'talent',
    name: { en: 'International teleworker (digital nomad) visa and permit', fa: 'ویزا و اقامت دورکاری بین‌المللی (دیجیتال نومد) اسپانیا' },
    agency: { en: 'UGE (permit in Spain) or a Spanish consulate (visa)', fa: 'UGE (اقامت از داخل اسپانیا) یا کنسولگری اسپانیا (ویزا)' },
    status: 'open',
    fact: {
      en: 'For remote work for companies outside Spain: you need a degree or three years of experience, a remote job or clients of at least three months with a company active for at least a year, and income of 200% of the minimum wage, EUR 34,188 a year in 2026.',
      fa: 'برای دورکاری برای شرکت‌های خارج از اسپانیا: مدرک دانشگاهی یا سه سال سابقه، رابطه‌ی کاری دست‌کم سه‌ماهه با شرکتی که دست‌کم یک سال فعال بوده، و درآمد ۲۰۰ درصد حداقل دستمزد، یعنی ۳۴٬۱۸۸ یورو در سال ۲۰۲۶.',
    },
    criteria: [
      {
        key: 'qualification',
        label: { en: 'Graduate of a reputed university, VET or business school, or three years of experience', fa: 'فارغ‌التحصیل دانشگاه، آموزش فنی یا مدرسه‌ی کسب‌وکار معتبر، یا سه سال سابقه' },
        weight: 3,
        scoreable: true,
        anyOf: [
          { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
          { field: 'workYears', op: 'gte', value: 3 },
        ],
      },
      {
        key: 'income',
        label: { en: 'Income of 200% of the SMI: EUR 34,188 a year in 2026', fa: 'درآمد ۲۰۰ درصد حداقل دستمزد (SMI): ۳۴٬۱۸۸ یورو در سال ۲۰۲۶' },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 34_188, currency: 'EUR' },
        note: {
          en: 'SMI 2026 is EUR 1,221 a month in 14 payments. Add 75% of the SMI for a household of two and 25% for each further member. Savings can cover a shortfall for the whole permit.',
          fa: 'حداقل دستمزد ۲۰۲۶ ماهانه ۱٬۲۲۱ یورو در ۱۴ قسط است. برای خانوار دونفره ۷۵ درصد و برای هر نفر بیشتر ۲۵ درصد SMI اضافه کنید. کسری درآمد را می‌شود با پس‌انداز برای کل مدت اقامت پوشاند.',
        },
      },
      {
        key: 'employer',
        label: { en: 'Remote job or clients outside Spain for at least three months; the company active for at least a year', fa: 'کار یا مشتری خارج از اسپانیا دست‌کم از سه ماه پیش؛ شرکت دست‌کم یک سال فعال' },
        weight: 3,
        scoreable: false,
        note: { en: 'Freelancers may take Spanish clients for up to 20% of their work; employees may not.', fa: 'فریلنسر تا ۲۰ درصد کارش می‌تواند مشتری اسپانیایی داشته باشد؛ کارمند نه.' },
      },
      {
        key: 'insurance',
        label: { en: 'Health insurance without co-payments, unless you join Spanish Social Security', fa: 'بیمه‌ی درمانی بدون مشارکت در هزینه، مگر اینکه عضو تأمین اجتماعی اسپانیا شوید' },
        weight: 1,
        scoreable: false,
      },
      { key: 'record', label: { en: 'Clean criminal record (two years of certificates, five-year declaration)', fa: 'نداشتن سوءپیشینه (گواهی دو سال و اظهارنامه‌ی پنج سال)' }, weight: 1, scoreable: false },
    ],
    money: [
      { key: 'income', label: { en: 'Applicant, 200% of SMI', fa: 'متقاضی، ۲۰۰ درصد SMI' }, amount: 34_188, currency: 'EUR', basis: 'perYear', shows: { en: 'Three months of payslips or invoices and matching bank statements.', fa: 'فیش حقوقی یا فاکتور سه ماه اخیر و صورت‌حساب بانکی منطبق با آن.' } },
      { key: 'second', label: { en: 'Household of two, added (75% of SMI)', fa: 'خانوار دونفره، اضافه (۷۵ درصد SMI)' }, amount: 12_820, currency: 'EUR', basis: 'perYear', approx: true },
      { key: 'further', label: { en: 'Each further member (25% of SMI)', fa: 'هر نفر بیشتر (۲۵ درصد SMI)' }, amount: 4_273, currency: 'EUR', basis: 'perYear', approx: true },
    ],
    processing: {
      text: {
        en: 'Permit filed in Spain: UGE decides within 20 days, silence means granted. Visa from abroad: 10 working days, with the Visa Code art. 22 exception.',
        fa: 'اقامت از داخل اسپانیا: تصمیم UGE ظرف ۲۰ روز و سکوت یعنی پذیرش. ویزا از خارج: ۱۰ روز کاری، با استثنای ماده‌ی ۲۲ کد ویزا.',
      },
      source: BOE_14,
    },
    pr: {
      en: 'Visa up to one year, permit up to three years, renewals of two; long-term residence after five years of legal, continuous residence.',
      fa: 'ویزا حداکثر یک سال، اقامت حداکثر سه سال، تمدید دوساله؛ اقامت بلندمدت پس از پنج سال اقامت قانونی و پیوسته.',
    },
    sources: [
      { url: BOE_14, checked: CHECKED, label: 'BOE, Ley 14/2013, arts. 74 bis to 74 quinquies' },
      { url: UGE_TT, checked: CHECKED, label: 'UGE, international teleworkers' },
      { url: UGE_TT_DOC, checked: CHECKED, label: 'UGE, documentation for teleworkers (means, insurance)' },
      { url: SMI_2026, checked: CHECKED, label: 'BOE, Real Decreto 126/2026: SMI 2026' },
    ],
    verified: true,
    review:
      'Family = talent for want of a remote-work family. Annual figure assumes the SMI on a 14-payment basis (1,221 x 14 x 2); the UGE sheet says "monthly 200% of the SMI", which on 12 payments would be EUR 2,442 a month (29,304 a year): consulates and the site use 34,188. Five-year long-term residence rule is LO 4/2000 art. 32, not reopened today.',
  },
  {
    key: 'es-blue-card',
    country: 'ES',
    family: 'talent',
    name: { en: 'EU Blue Card / highly qualified professional', fa: 'کارت آبی اتحادیه‌ی اروپا و اقامت متخصص بسیار ماهر اسپانیا' },
    agency: { en: 'Large Companies and Strategic Groups Unit (UGE)', fa: 'واحد شرکت‌های بزرگ و گروه‌های راهبردی (UGE)' },
    status: 'open',
    fact: {
      en: 'A job offer of at least six months paying EUR 41,356.36 a year (June 2026 threshold), or EUR 33,085.09 for shortage occupations and recent graduates. The UGE decides within 20 days, silence means granted.',
      fa: 'پیشنهاد کار دست‌کم شش‌ماهه با حقوق سالانه‌ی ۴۱٬۳۵۶٫۳۶ یورو (آستانه‌ی ژوئن ۲۰۲۶)، یا ۳۳٬۰۸۵٫۰۹ یورو برای مشاغل کمبود و فارغ‌التحصیلان سه سال اخیر. UGE ظرف ۲۰ روز تصمیم می‌گیرد و سکوت یعنی پذیرش.',
    },
    criteria: [
      { key: 'job-offer', label: { en: 'Contract or firm offer for highly qualified work of at least six months', fa: 'قرارداد یا پیشنهاد قطعی کار بسیار تخصصی با مدت دست‌کم شش ماه' }, weight: 3, scoreable: true, test: { field: 'jobOffer', op: 'true' } },
      {
        key: 'qualification',
        label: { en: 'Degree of at least three years (EQF 6), or five years of relevant experience (three in IT)', fa: 'مدرک دست‌کم سه‌ساله (سطح ۶ چارچوب اروپایی) یا پنج سال سابقه‌ی مرتبط (در فناوری اطلاعات سه سال)' },
        weight: 3,
        scoreable: true,
        anyOf: [
          { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
          { field: 'workYears', op: 'gte', value: 5 },
        ],
      },
      {
        key: 'salary',
        label: { en: 'Gross salary of at least EUR 41,356.36 a year', fa: 'حقوق ناخالص دست‌کم ۴۱٬۳۵۶٫۳۶ یورو در سال' },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 41_356, currency: 'EUR' },
        note: {
          en: 'The reduced threshold, EUR 33,085.09, applies to shortage occupations in CNO groups 1 and 2 and to qualifications obtained in the last three years. The national highly qualified permit uses EUR 41,356.36 with no reduction.',
          fa: 'آستانه‌ی کاهش‌یافته (۳۳٬۰۸۵٫۰۹ یورو) برای مشاغل کمبود گروه‌های ۱ و ۲ و مدرک‌های سه سال اخیر است. اقامت ملی متخصص بسیار ماهر همان ۴۱٬۳۵۶٫۳۶ یورو را بدون کاهش می‌خواهد.',
        },
      },
      { key: 'insurance', label: { en: 'Health insurance or Social Security cover', fa: 'بیمه‌ی درمانی یا پوشش تأمین اجتماعی' }, weight: 1, scoreable: false },
    ],
    money: [
      { key: 'salary', label: { en: 'Minimum gross salary, general threshold', fa: 'حداقل حقوق ناخالص، آستانه‌ی عمومی' }, amount: 41_356, currency: 'EUR', basis: 'perYear', shows: { en: 'The employment contract or firm offer.', fa: 'قرارداد کار یا پیشنهاد قطعی.' } },
      { key: 'salary-reduced', label: { en: 'Reduced threshold (shortage occupations, recent graduates)', fa: 'آستانه‌ی کاهش‌یافته (مشاغل کمبود، فارغ‌التحصیلان اخیر)' }, amount: 33_085, currency: 'EUR', basis: 'perYear' },
    ],
    processing: {
      text: { en: 'UGE decision within 20 days of electronic filing; silence means granted.', fa: 'تصمیم UGE ظرف ۲۰ روز از ثبت الکترونیکی؛ سکوت یعنی پذیرش.' },
      source: BOE_14,
    },
    pr: {
      en: 'Permit of three years (or the contract plus three months), renewals of two; long-term residence after five years (art. 71.3).',
      fa: 'اقامت سه‌ساله (یا مدت قرارداد به‌علاوه‌ی سه ماه)، تمدید دوساله؛ اقامت بلندمدت پس از پنج سال (بند ۳ ماده‌ی ۷۱).',
    },
    sources: [
      { url: BOE_14, checked: CHECKED, label: 'BOE, Ley 14/2013, arts. 71 and 71 bis' },
      { url: UGE_PAC, checked: CHECKED, label: 'UGE, highly qualified professionals' },
      { url: UGE_UMBRAL, checked: CHECKED, label: 'UGE, Blue Card salary threshold update (June 2026)' },
    ],
    verified: true,
    review: 'Threshold = 1.4 x INE average salary 2024 (EUR 29,540.26) under Orden PJC/44/2026; updates when INE publishes a new average. Order text itself not extracted (PDF font encoding).',
  },
  {
    key: 'es-study',
    country: 'ES',
    family: 'study',
    name: { en: 'Long-term stay for higher education studies', fa: 'اقامت تحصیلی آموزش عالی اسپانیا' },
    agency: { en: 'Spanish consulate (from abroad) or the provincial Immigration Office (from Spain)', fa: 'کنسولگری اسپانیا (از خارج) یا اداره‌ی اتباع خارجی استان (از داخل اسپانیا)' },
    status: 'open',
    fact: {
      en: 'Since the 2025 regulation, higher-education students may work up to 30 hours a week without a separate permit. After a degree at EQF level 6 or above you can stay up to 24 months to look for work or start a business.',
      fa: 'از آیین‌نامه‌ی ۲۰۲۵، دانشجوی آموزش عالی بدون مجوز جداگانه می‌تواند تا ۳۰ ساعت در هفته کار کند. پس از مدرک سطح ۶ چارچوب اروپایی یا بالاتر تا ۲۴ ماه برای کاریابی یا راه‌اندازی کسب‌وکار فرصت دارید.',
    },
    criteria: [
      { key: 'admission', label: { en: 'Admission to a full-time higher education programme, fees paid', fa: 'پذیرش در دوره‌ی تمام‌وقت آموزش عالی، با شهریه‌ی ثبت‌نام پرداخت‌شده' }, weight: 3, scoreable: true, test: { field: 'admission', op: 'true' } },
      {
        key: 'funds',
        label: { en: '100% of the IPREM a month (EUR 600 in 2026) for the stay', fa: '۱۰۰ درصد IPREM در ماه (۶۰۰ یورو در ۲۰۲۶) برای دوره‌ی اقامت' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 7_200, currency: 'EUR' },
        note: {
          en: 'Twelve months shown. Accommodation paid in advance for the whole stay can replace it; tuition money does not count. Family: 75% of IPREM for the first member, 50% for each further one.',
          fa: 'اینجا دوازده ماه حساب شده است. اجاره‌ی پیش‌پرداخت برای کل دوره می‌تواند جای آن را بگیرد؛ پول شهریه حساب نمی‌شود. خانواده: ۷۵ درصد IPREM برای نفر اول و ۵۰ درصد برای هر نفر بعدی.',
        },
      },
      { key: 'insurance', label: { en: 'Health insurance with an insurer authorised in Spain', fa: 'بیمه‌ی درمانی از بیمه‌گر مجاز در اسپانیا' }, weight: 1, scoreable: false },
      { key: 'record', label: { en: 'No criminal record for the last five years (stays over six months)', fa: 'نداشتن سوءپیشینه در پنج سال اخیر (برای اقامت بیش از شش ماه)' }, weight: 1, scoreable: false },
    ],
    money: [
      { key: 'month', label: { en: 'Student, per month (100% of IPREM)', fa: 'دانشجو، ماهانه (۱۰۰ درصد IPREM)' }, amount: 600, currency: 'EUR', basis: 'month', shows: { en: 'Own or family funds, grants or scholarships.', fa: 'پول خودتان یا خانواده، کمک‌هزینه یا بورسیه.' } },
      { key: 'first-family', label: { en: 'First family member, per month (75%)', fa: 'نخستین عضو خانواده، ماهانه (۷۵ درصد)' }, amount: 450, currency: 'EUR', basis: 'month' },
      { key: 'further-family', label: { en: 'Each further member, per month (50%)', fa: 'هر عضو بعدی، ماهانه (۵۰ درصد)' }, amount: 300, currency: 'EUR', basis: 'month' },
    ],
    processing: {
      text: {
        en: 'Consulate: decision within one month of a complete application, filed at least two months before studies start. From Spain: two months; no answer means refused.',
        fa: 'کنسولگری: تصمیم ظرف یک ماه از درخواست کامل، که باید دست‌کم دو ماه پیش از شروع تحصیل ثبت شود. از داخل اسپانیا: دو ماه؛ بی‌پاسخی یعنی رد.',
      },
      source: STUDY,
    },
    pr: {
      en: 'Study years count at 50% towards EU long-term residence. Graduates switch to a work or Ley 14/2013 permit, or take the 24-month job-search permit first.',
      fa: 'سال‌های تحصیل با ضریب ۵۰ درصد برای اقامت بلندمدت اتحادیه‌ی اروپا حساب می‌شود. فارغ‌التحصیل به اقامت کاری یا اقامت‌های قانون ۱۴/۲۰۱۳ تغییر وضعیت می‌دهد، یا اول اقامت ۲۴ ماهه‌ی کاریابی را می‌گیرد.',
    },
    sources: [
      { url: STUDY, checked: CHECKED, label: 'Ministry of Inclusion, sheet 1: long-term stay for studies (updated Nov 2025)' },
      { url: RD_1155, checked: CHECKED, label: 'BOE, Real Decreto 1155/2024 (art. 57: 30 hours a week)' },
      { url: BOE_14, checked: CHECKED, label: 'BOE, Ley 14/2013, DA 17 (24-month job search)' },
      { url: PGE_2023, checked: CHECKED, label: 'BOE, Ley 31/2022, DA 90: IPREM' },
    ],
    verified: true,
    review: 'Family members of students may not work. National (non-EU) long-term residence treatment of study years not checked.',
  },
];
