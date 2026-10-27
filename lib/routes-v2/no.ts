// VisaRoads v2 routes, Norway. Checked 27 Oct 2026 on udi.no (pages
// personalised for Iranian citizens, ?c=irn). Research:
// docs/research/app-v3/no.md. Notebook 729a206e was a lead only.
// Norway has no start-up visa: a sole proprietorship (self-employed) or an
// AS that employs you as a skilled worker are the business routes.
import type { RouteV2 } from './types';

const CHECKED = '2026-10-27';

const URL_SKILLED = 'https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/?c=irn';
const URL_SELF_CHECK = 'https://www.udi.no/en/checklists-container/work/checklist-for-self-employed-with-company-in-norway/';
const URL_FEES = 'https://www.udi.no/en/word-definitions/fees/';
const URL_PR = 'https://www.udi.no/en/want-to-apply/permanent-residence/permanent-residence-permit/adult/';
const URL_STUDY = 'https://www.udi.no/en/want-to-apply/studies/studietillatelse/?c=irn';

export const ROUTES_NO: RouteV2[] = [
  {
    key: 'no-self-employed',
    country: 'NO',
    family: 'entrepreneur',
    name: { en: 'Self-employed with a company in Norway', fa: 'اقامت خوداشتغالی با شرکت در نروژ' },
    agency: { en: 'UDI (Norwegian Directorate of Immigration)', fa: 'اداره‌ی مهاجرت نروژ (UDI)' },
    status: 'open',
    fact: {
      en: 'The business must normally be your own sole proprietorship and be likely to earn a profit of at least NOK 341,373 a year before tax. You may work only in it.',
      fa: 'کسب‌وکار معمولاً باید شرکت انفرادی (sole proprietorship) خودتان باشد و احتمالاً سالانه دست‌کم ۳۴۱٬۳۷۳ کرون سود پیش از مالیات بدهد. فقط در همین کسب‌وکار اجازه‌ی کار دارید.',
    },
    criteria: [
      {
        key: 'skilled',
        label: { en: 'Skilled worker: a degree, 3-year upper-secondary vocational training, or special qualifications (usually 6+ years of work)', fa: 'نیروی ماهر: مدرک دانشگاهی، آموزش فنی‌وحرفه‌ای سه‌ساله در سطح دبیرستان، یا صلاحیت ویژه (معمولاً بیش از ۶ سال سابقه‌ی کار)' },
        weight: 3,
        scoreable: true,
        anyOf: [
          { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
          { field: 'workYears', op: 'gte', value: 6 },
        ],
        openEnded: true,
        note: {
          en: 'UDI says many applications on special qualifications are rejected, and documents from Iran for trades such as chef, car mechanic, carpenter and hairdresser get extra scrutiny.',
          fa: 'به گفته‌ی UDI بسیاری از درخواست‌های مبتنی بر صلاحیت ویژه رد می‌شوند و مدارک ایرانی برای مشاغلی مثل آشپزی، مکانیکی خودرو، نجاری و آرایشگری با دقت بیشتری بررسی می‌شود.',
        },
      },
      {
        key: 'profit',
        label: { en: 'Expected profit of at least NOK 341,373 a year before tax', fa: 'سود پیش‌بینی‌شده‌ی دست‌کم ۳۴۱٬۳۷۳ کرون در سال پیش از مالیات' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Shown with a first-year budget (new business) or 12 months of accounts and bank statements (existing business).',
          fa: 'با بودجه‌ی سال اول (کسب‌وکار تازه) یا حساب‌ها و صورت‌حساب بانکی ۱۲ ماه گذشته (کسب‌وکار فعال) نشان داده می‌شود.',
        },
      },
      {
        key: 'sole-proprietorship',
        label: { en: 'Your own sole proprietorship (not an AS); you take no other work, remote work included', fa: 'شرکت انفرادی خودتان (نه AS)؛ هیچ کار دیگری، از جمله دورکاری، نمی‌کنید' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'presence',
        label: { en: 'Living in Norway and taking active part is necessary to run the business', fa: 'زندگی در نروژ و مشارکت فعال شما برای اداره‌ی کسب‌وکار ضروری باشد' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'housing',
        label: { en: 'Proof of housing in Norway', fa: 'مدرک محل سکونت در نروژ' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'licences',
        label: { en: 'Any public permit the business needs, or written confirmation it will be granted', fa: 'هر مجوز دولتی که کسب‌وکار لازم دارد، یا تأیید کتبی صدور آن' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'profit',
        label: { en: 'Expected yearly profit before tax', fa: 'سود سالانه‌ی پیش‌بینی‌شده پیش از مالیات' },
        amount: 341_373,
        currency: 'NOK',
        basis: 'perYear',
        shows: { en: 'A budget for the first year, or accounts and bank statements for the last 12 months.', fa: 'بودجه‌ی سال اول، یا حساب‌ها و صورت‌حساب بانکی ۱۲ ماه گذشته.' },
      },
    ],
    fees: [{ label: { en: 'Application fee (work permits, over 18)', fa: 'هزینه‌ی درخواست (اقامت کاری، بالای ۱۸ سال)' }, amount: 6_300, currency: 'NOK' }],
    pr: {
      en: 'Permit one year at a time. Permanent residence after three years, with an oral Norwegian test at A2, a social studies test and own income of at least NOK 341,373 in the past year.',
      fa: 'اقامت هر بار یک‌ساله صادر می‌شود. اقامت دائم پس از سه سال، با قبولی در آزمون شفاهی نروژی سطح A2، آزمون مطالعات اجتماعی و درآمد شخصی دست‌کم ۳۴۱٬۳۷۳ کرون در سال گذشته.',
    },
    sources: [
      { url: URL_SKILLED, checked: CHECKED, label: 'UDI, skilled workers: self-employed with a company in Norway' },
      { url: URL_SELF_CHECK, checked: CHECKED, label: 'UDI checklist, self-employed' },
      { url: URL_FEES, checked: CHECKED, label: 'UDI fees' },
      { url: URL_PR, checked: CHECKED, label: 'UDI, permanent residence (adult)' },
    ],
    verified: true,
    review:
      'Fee: UDI fees page has no self-employed line; NOK 6,300 is the "residence permits for work" fee, assumed to apply. Processing time not readable (interactive waiting-time tool). Notebook gives NOK 265,998 in one answer (older figure) and talks of a "Norway startup visa" with Innovation Norway: no such permit on udi.no. Grants counting toward income: notebook only, unverified.',
  },
  {
    key: 'no-skilled-worker',
    country: 'NO',
    family: 'talent',
    name: { en: 'Skilled worker with a Norwegian employer', fa: 'اقامت نیروی کار ماهر با کارفرمای نروژی' },
    agency: { en: 'UDI', fa: 'اداره‌ی مهاجرت نروژ (UDI)' },
    status: 'open',
    fact: {
      en: 'You need a concrete offer from one employer in Norway, normally full-time (80% accepted), with pay and conditions no poorer than normal in Norway. A founder who sets up an AS uses this route, employed by the company.',
      fa: 'به پیشنهاد کاری مشخص از یک کارفرمای نروژی نیاز دارید، معمولاً تمام‌وقت (۸۰ درصد هم پذیرفته می‌شود)، با حقوق و شرایطی نه کمتر از عرف نروژ. بنیان‌گذاری که شرکت AS ثبت کند، از همین مسیر و به‌عنوان کارمند شرکت خودش اقدام می‌کند.',
    },
    criteria: [
      {
        key: 'job-offer',
        label: { en: 'Concrete job offer from a Norwegian employer', fa: 'پیشنهاد کاری مشخص از کارفرمای نروژی' },
        weight: 3,
        scoreable: true,
        test: { field: 'jobOffer', op: 'true' },
      },
      {
        key: 'skilled',
        label: { en: 'Skilled worker: a degree, 3-year vocational training, or special qualifications (usually 6+ years of work)', fa: 'نیروی ماهر: مدرک دانشگاهی، آموزش فنی‌وحرفه‌ای سه‌ساله، یا صلاحیت ویژه (معمولاً بیش از ۶ سال سابقه‌ی کار)' },
        weight: 3,
        scoreable: true,
        anyOf: [
          { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
          { field: 'workYears', op: 'gte', value: 6 },
        ],
        openEnded: true,
      },
      {
        key: 'job-needs-skills',
        label: { en: 'The job itself requires skilled-worker qualifications', fa: 'خودِ شغل به صلاحیت نیروی ماهر نیاز داشته باشد' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'pay',
        label: { en: 'Full-time (at least 80%), pay and conditions normal for Norway', fa: 'تمام‌وقت (دست‌کم ۸۰ درصد) و حقوق و شرایط مطابق عرف نروژ' },
        weight: 2,
        scoreable: false,
        note: { en: 'No fixed NOK minimum for ordinary employees.', fa: 'برای کارمند عادی حداقل حقوق ثابتی به کرون تعیین نشده است.' },
      },
    ],
    money: [],
    fees: [{ label: { en: 'Application fee (work permits, over 18)', fa: 'هزینه‌ی درخواست (اقامت کاری، بالای ۱۸ سال)' }, amount: 6_300, currency: 'NOK' }],
    pr: {
      en: 'University-level jobs: permit normally up to three years; vocational level up to one year at a time. Permanent residence after three years, with Norwegian A2 (oral) and a social studies test.',
      fa: 'شغل در سطح دانشگاهی: اقامت معمولاً تا سه سال؛ سطح فنی‌وحرفه‌ای: هر بار تا یک سال. اقامت دائم پس از سه سال، با آزمون شفاهی نروژی A2 و آزمون مطالعات اجتماعی.',
    },
    sources: [
      { url: URL_SKILLED, checked: CHECKED, label: 'UDI, skilled workers (message 19.02.2026)' },
      { url: 'https://www.udi.no/en/checklists-container/work/checklist-for-skilled-worker-with-an-employer-in-norway/?c=irn', checked: CHECKED, label: 'UDI checklist, skilled worker' },
      { url: URL_FEES, checked: CHECKED, label: 'UDI fees' },
      { url: URL_PR, checked: CHECKED, label: 'UDI, permanent residence (adult)' },
    ],
    verified: true,
    review:
      'Family `talent` (employer-sponsored, no points). Notebook describes a one-year "job seeker visa" that works like an open work permit: not found on udi.no pages read; the skilled-worker page only mentions six months to look for a new job after losing one. Processing times not readable.',
  },
  {
    key: 'no-study',
    country: 'NO',
    family: 'study',
    name: { en: 'Study permit (university or university college)', fa: 'اقامت تحصیلی نروژ (دانشگاه یا کالج دانشگاهی)' },
    agency: { en: 'UDI', fa: 'اداره‌ی مهاجرت نروژ (UDI)' },
    status: 'open',
    fact: {
      en: 'You must show NOK 170,368 for the academic year. Time on a study permit does not count toward permanent residence.',
      fa: 'باید برای سال تحصیلی ۱۷۰٬۳۶۸ کرون تمکن نشان بدهید. مدت اقامت تحصیلی در اقامت دائم حساب نمی‌شود.',
    },
    criteria: [
      {
        key: 'admission',
        label: { en: 'Full-time admission to an institution on NOKUT’s approved list', fa: 'پذیرش تمام‌وقت از مؤسسه‌ای در فهرست مؤسسات تأییدشده‌ی NOKUT' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'funds',
        label: { en: 'NOK 170,368 for the academic year (NOK 15,488 a month), plus tuition', fa: '۱۷۰٬۳۶۸ کرون برای سال تحصیلی (ماهانه ۱۵٬۴۸۸ کرون) به‌علاوه‌ی شهریه' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 170_368, currency: 'NOK' },
      },
      {
        key: 'housing',
        label: { en: 'Somewhere to live in Norway', fa: 'محل سکونت در نروژ' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'return',
        label: { en: 'Circumstances that make a return after studies likely', fa: 'شرایطی که بازگشت پس از تحصیل را محتمل نشان دهد' },
        weight: 2,
        scoreable: false,
        note: {
          en: 'For Iranian citizens UDI notes that permits for study below master level may be hard to get. Your diploma must be legalised by Iran’s Ministry of Foreign Affairs.',
          fa: 'UDI برای شهروندان ایران می‌گوید گرفتن اقامت برای مقاطع پایین‌تر از کارشناسی ارشد ممکن است دشوار باشد. مدرک تحصیلی باید به تأیید وزارت امور خارجه‌ی ایران برسد.',
        },
      },
    ],
    money: [
      {
        key: 'year',
        label: { en: 'Living costs for the academic year', fa: 'هزینه‌ی زندگی برای سال تحصیلی' },
        amount: 170_368,
        currency: 'NOK',
        basis: 'year',
        shows: {
          en: 'A Norwegian bank account, the institution’s deposit account, a Lånekassen statement, a grant, or a part-time job contract.',
          fa: 'حساب بانکی نروژی، حساب سپرده‌ی دانشگاه، گواهی Lånekassen، بورسیه یا قرارداد کار پاره‌وقت.',
        },
      },
      { key: 'month', label: { en: 'Per month', fa: 'ماهانه' }, amount: 15_488, currency: 'NOK', basis: 'month' },
    ],
    fees: [{ label: { en: 'Application fee (over 18)', fa: 'هزینه‌ی درخواست (بالای ۱۸ سال)' }, amount: 5_400, currency: 'NOK' }],
    pr: {
      en: 'Study time does not count toward permanent residence. After graduating you need a work permit (for example as a skilled worker) and then three years on it.',
      fa: 'مدت تحصیل در اقامت دائم حساب نمی‌شود. پس از فارغ‌التحصیلی باید اقامت کاری بگیرید (مثلاً نیروی ماهر) و سه سال با آن بمانید.',
    },
    sources: [
      { url: URL_STUDY, checked: CHECKED, label: 'UDI, study permit (higher education)' },
      { url: 'https://www.udi.no/en/checklists-container/studies-au-pair/checklist-student/?c=irn', checked: CHECKED, label: 'UDI checklist, student' },
      { url: URL_FEES, checked: CHECKED, label: 'UDI fees' },
    ],
    verified: true,
    review:
      'Work: 20 h/week during studies, full-time in holidays; no self-employment. Family members cannot currently be processed together with the student. Post-study job-seeking permit not on the page read. Not covered by the notebook.',
  },
];
