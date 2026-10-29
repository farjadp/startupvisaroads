// VisaRoads v2 routes, Ireland. Checked 27 Oct 2026 on irishimmigration.ie
// (read in a browser), the STEP Guidelines (Sep 2023 PDF) and enterprise.gov.ie.
// Research notes: docs/research/app-v3/ie.md. Follow the rules in ./types.ts.
import type { RouteV2 } from './types';

const CHECKED = '2026-10-27';

const STEP = 'https://www.irishimmigration.ie/coming-to-work-in-ireland/what-are-my-options-for-working-in-ireland/coming-to-work-for-more-than-90-days/start-up-entrepreneur-programme-step/';
const STEP_GUIDE = 'https://www.irishimmigration.ie/wp-content/uploads/2023/09/STEP-Guidelines-Sep-2023.pdf';
const CSEP = 'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/';
const STAMPS = 'https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/';
const STUDY = 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/planning-to-study-in-ireland/';
const STUDY_FUNDS = 'https://www.irishimmigration.ie/reminder-on-student-finance-requirements-from-30-june-2025/';
const GRAD = 'https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/';
const IIP = 'https://www.irishimmigration.ie/minister-harris-announces-closure-of-the-immigrant-investor-programme/';
const CITIZEN = 'https://www.irishimmigration.ie/how-to-become-an-irish-citizen-guide/';

export const ROUTES_IE: RouteV2[] = [
  // ───────────────────────────── STEP ─────────────────────────────
  {
    key: 'ie-step',
    country: 'IE',
    family: 'startup',
    name: { en: 'Start-up Entrepreneur Programme (STEP)', fa: 'برنامهٔ کارآفرینی استارتاپ ایرلند (STEP)' },
    agency: {
      en: 'Immigration Service Delivery, Department of Justice, Home Affairs and Migration (evaluation committee)',
      fa: 'ادارهٔ خدمات مهاجرت (ISD) در وزارت دادگستری، امور داخلی و مهاجرت ایرلند، با کمیتهٔ ارزیابی',
    },
    status: 'open',
    fact: {
      en: 'EUR 50,000 is necessary but not enough: the committee must judge the plan a high-potential start-up, able to create 10 jobs in Ireland and reach EUR 1 million in sales within 3 years. Refusals cannot be appealed.',
      fa: '۵۰٬۰۰۰ یورو لازم است اما کافی نیست: کمیته باید طرح را یک استارتاپ با پتانسیل بالا (HPSU) بداند که بتواند ظرف ۳ سال ۱۰ شغل در ایرلند بسازد و به یک میلیون یورو فروش برسد. ردِ درخواست قابل اعتراض نیست.',
    },
    criteria: [
      {
        key: 'funding',
        label: { en: 'EUR 50,000 secured for the business (EUR 30,000 for each further founder)', fa: '۵۰٬۰۰۰ یورو سرمایهٔ تأمین‌شده برای کسب‌وکار (برای هر هم‌بنیان‌گذار بعدی ۳۰٬۰۰۰ یورو)' },
        weight: 3,
        scoreable: true,
        anyOf: [
          { field: 'liquid', op: 'gte', value: 50_000, currency: 'EUR' },
          { field: 'investment', op: 'gte', value: 50_000, currency: 'EUR' },
        ],
        openEnded: true,
        note: {
          en: 'Own money, a business loan, business angel or venture capital funding, or an Irish state agency grant, alone or combined. Own money: three full months of bank statements, the latest no older than one month.',
          fa: 'پول شخصی، وام تجاری، سرمایهٔ فرشته یا خطرپذیر، یا کمک‌هزینهٔ یکی از نهادهای دولتی ایرلند، به‌تنهایی یا با هم. برای پول شخصی: صورت‌حساب بانکی سه ماه کامل که آخرینش بیش از یک ماه از تاریخ درخواست قدیمی‌تر نباشد.',
        },
      },
      {
        key: 'hpsu',
        label: {
          en: 'High-potential start-up: new product or service for international markets, manufacturing or internationally traded services, 10 jobs and EUR 1m sales within 3 years',
          fa: 'استارتاپ با پتانسیل بالا: محصول یا خدمت نو برای بازارهای بین‌المللی، در تولید یا خدمات قابل‌صادرات، با ۱۰ شغل و یک میلیون یورو فروش در ۳ سال',
        },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Headquartered and controlled in Ireland, led by an experienced team, and less than five years old. Retail, personal services, catering and similar local businesses are excluded.',
          fa: 'دفتر مرکزی و کنترل شرکت در ایرلند باشد، تیم مدیریتی باتجربه داشته باشد و کمتر از پنج سال از ثبتش گذشته باشد. خرده‌فروشی، خدمات شخصی، پذیرایی و کسب‌وکارهای محلی مشابه پذیرفته نمی‌شوند.',
        },
      },
      {
        key: 'business-stage',
        label: { en: 'An innovative business proposal (an idea with a full business plan is enough to apply)', fa: 'طرح کسب‌وکار نوآورانه (برای درخواست، ایده با طرح کسب‌وکار کامل کافی است)' },
        weight: 2,
        scoreable: true,
        test: { field: 'businessStage', op: 'in', value: ['idea', 'mvp', 'revenue', 'established'] },
        note: {
          en: 'No job-creation target is set at the start. An existing business that relocates must add its latest audited accounts.',
          fa: 'در ابتدا هدف اشتغال‌زایی تعیین نمی‌شود. اگر کسب‌وکار موجودی را منتقل می‌کنید، آخرین صورت‌های مالی حسابرسی‌شده‌اش را هم ضمیمه کنید.',
        },
      },
      {
        key: 'character',
        label: {
          en: 'Good character: police certificates from every country lived in for more than 6 months in the last 10 years',
          fa: 'حسن سابقه: گواهی عدم سوءپیشینه از هر کشوری که در ۱۰ سال اخیر بیش از ۶ ماه در آن زندگی کرده‌اید',
        },
        weight: 2,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'first-founder',
        label: { en: 'Funding, first founder', fa: 'سرمایه، بنیان‌گذار اول' },
        amount: 50_000,
        currency: 'EUR',
        basis: 'once',
        shows: {
          en: 'Funds in your name, with a bank letter that they can be transferred to Ireland and converted to euro. Before the permission issues, they must be moved to an Irish business account.',
          fa: 'پولی به نام خودتان، همراه با نامهٔ بانک که انتقال آن به ایرلند و تبدیلش به یورو ممکن است. پیش از صدور اقامت باید این پول به حساب تجاری در ایرلند منتقل شود.',
        },
      },
      { key: 'each-further-founder', label: { en: 'Funding, each further founder', fa: 'سرمایه، هر هم‌بنیان‌گذار بعدی' }, amount: 30_000, currency: 'EUR', basis: 'once' },
    ],
    fees: [{ label: { en: 'Application fee (covers the family, non-refundable)', fa: 'هزینهٔ درخواست (برای کل خانواده، غیرقابل استرداد)' }, amount: 350, currency: 'EUR' }],
    processing: {
      text: {
        en: 'Applications can be sent at any time; the evaluation committee considers proposals quarterly.',
        fa: 'درخواست را هر زمان می‌توان فرستاد؛ کمیتهٔ ارزیابی طرح‌ها را هر سه ماه یک‌بار بررسی می‌کند.',
      },
      source: STEP,
    },
    pr: {
      en: 'Permission for 2 years, renewable for 3 if the business is viable, then in 5-year steps. Long-term residence after 5 years. Citizenship on the normal 5-year reckonable-residence rule; STEP gives no shortcut.',
      fa: 'اقامت ۲ ساله که اگر کسب‌وکار پایدار باشد ۳ سال تمدید می‌شود و پس از آن ۵ سال‌به‌۵ سال. اقامت بلندمدت پس از ۵ سال. شهروندی طبق قاعدهٔ عادی ۵ سال اقامت قابل‌احتساب؛ STEP میان‌بُری ندارد.',
    },
    sources: [
      { url: STEP, checked: CHECKED, label: 'ISD, STEP page (updated 14 Oct 2025)' },
      { url: STEP_GUIDE, checked: CHECKED, label: 'STEP Guidelines, Sep 2023' },
      { url: CITIZEN, checked: CHECKED, label: 'ISD, citizenship guide' },
    ],
    verified: true,
    blockedCitizenships: {
      codes: ['RU', 'BY'],
      reason: {
        en: 'The Minister for Justice has instructed that no further STEP applications from Russian or Belarusian citizens be accepted.',
        fa: 'وزیر دادگستری ایرلند دستور داده است که دیگر درخواست STEP از شهروندان روسیه و بلاروس پذیرفته نشود.',
      },
    },
    review:
      'Guidelines are dated Sep 2023 and the page says the "2019 Guidelines" are linked: the linked PDF is Sep 2023. Applications go by email to startup@justice.ie despite the page calling it an "online application". The permission stamp is not named in the guidelines (commonly called Stamp 4): not stated in the app. Private medical insurance is a condition. Investment criterion uses anyOf liquid/investment with openEnded, since VC or grant funding cannot be profiled.',
  },

  // ───────────────────────────── CRITICAL SKILLS ─────────────────────────────
  {
    key: 'ie-critical-skills',
    country: 'IE',
    family: 'talent',
    name: { en: 'Critical Skills Employment Permit', fa: 'مجوز کار مهارت‌های حیاتی ایرلند (Critical Skills Employment Permit)' },
    agency: {
      en: 'Department of Enterprise, Employment Permits section (permit); Immigration Service Delivery (residence)',
      fa: 'بخش مجوزهای کار در وزارت شرکت‌ها و تجارت ایرلند (Department of Enterprise) برای مجوز کار؛ ادارهٔ خدمات مهاجرت ISD برای اقامت',
    },
    status: 'open',
    fact: {
      en: 'After 2 years on the permit you can apply for Stamp 4, which lets you work without a permit. The job offer must be for at least 2 years and pay at least EUR 40,904 (listed occupations, with a degree) or EUR 68,911 (most other occupations).',
      fa: 'پس از ۲ سال کار با این مجوز می‌توانید برای Stamp 4 درخواست دهید که کار بدون مجوز را ممکن می‌کند. پیشنهاد کار باید دست‌کم ۲ ساله باشد و حقوقش دست‌کم ۴۰٬۹۰۴ یورو (مشاغل فهرست، با مدرک دانشگاهی) یا ۶۸٬۹۱۱ یورو (بیشتر مشاغل دیگر) باشد.',
    },
    criteria: [
      {
        key: 'job-offer',
        label: { en: 'Job offer from an Irish employer for at least 2 years', fa: 'پیشنهاد کار از کارفرمای ایرلندی برای دست‌کم ۲ سال' },
        weight: 3,
        scoreable: true,
        test: { field: 'jobOffer', op: 'true' },
      },
      {
        key: 'salary',
        label: { en: 'Salary at least EUR 40,904 (occupation on the Critical Skills Occupations List)', fa: 'حقوق دست‌کم ۴۰٬۹۰۴ یورو (شغل در فهرست مشاغل مهارت‌های حیاتی)' },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 40_904, currency: 'EUR' },
        note: {
          en: 'EUR 36,848 if you received the qualification in the last 12 months. EUR 68,911 for other occupations not on the ineligible list (no degree needed if you have the experience). Basic salary and qualifying health insurance count.',
          fa: '۳۶٬۸۴۸ یورو اگر مدرک را در ۱۲ ماه اخیر گرفته باشید. ۶۸٬۹۱۱ یورو برای سایر مشاغلی که در فهرست غیرمجاز نیستند (اگر سابقهٔ لازم را داشته باشید مدرک دانشگاهی لازم نیست). حقوق پایه و بیمهٔ درمانی واجد شرایط حساب می‌شوند.',
        },
      },
      {
        key: 'degree',
        label: { en: 'Relevant degree or higher (for the EUR 40,904 band)', fa: 'مدرک دانشگاهی مرتبط یا بالاتر (برای ردهٔ ۴۰٬۹۰۴ یورو)' },
        weight: 2,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
      },
      {
        key: 'occupation',
        label: { en: 'Occupation on the Critical Skills Occupations List (or the EUR 68,911 band)', fa: 'شغل در فهرست مشاغل مهارت‌های حیاتی (یا ردهٔ ۶۸٬۹۱۱ یورو)' },
        weight: 2,
        scoreable: false,
      },
    ],
    money: [],
    fees: [{ label: { en: 'Permit fee (90% refunded if refused)', fa: 'هزینهٔ مجوز (در صورت رد، ۹۰٪ بازگردانده می‌شود)' }, amount: 1_000, currency: 'EUR' }],
    processing: {
      text: {
        en: 'Apply at least 12 weeks before the start date; processed in date order by employer type (Trusted Partner or Standard).',
        fa: 'دست‌کم ۱۲ هفته پیش از شروع کار درخواست دهید؛ پرونده‌ها به ترتیب تاریخ و بر اساس نوع کارفرما (Trusted Partner یا Standard) بررسی می‌شوند.',
      },
      source: CSEP,
    },
    pr: {
      en: 'Stamp 4 after 2 years on the permit (no permit needed after that), long-term residence after 60 months. Citizenship after 5 years of reckonable residence; Stamp 1 and Stamp 4 both count.',
      fa: 'پس از ۲ سال کار با مجوز، Stamp 4 (از آن پس مجوز کار لازم نیست) و پس از ۶۰ ماه اقامت بلندمدت. شهروندی پس از ۵ سال اقامت قابل‌احتساب؛ Stamp 1 و Stamp 4 هر دو حساب می‌شوند.',
    },
    sources: [
      { url: CSEP, checked: CHECKED, label: 'enterprise.gov.ie, Critical Skills Employment Permit' },
      { url: STAMPS, checked: CHECKED, label: 'ISD, immigration stamps' },
      { url: CITIZEN, checked: CHECKED, label: 'ISD, citizenship guide' },
    ],
    verified: true,
    review:
      'Thresholds read on an undated enterprise.gov.ie page: confirm the effective date. The `income` field is current income; what counts is the offered salary. Stay with the first employer at least 9 months. Spouses/partners can work once resident (Stamp 1G per the ISD stamps page).',
  },

  // ───────────────────────────── STUDY (STAMP 2) ─────────────────────────────
  {
    key: 'ie-study',
    country: 'IE',
    family: 'study',
    name: { en: 'Study permission (Stamp 2) and Graduate Programme (Stamp 1G)', fa: 'اقامت تحصیلی ایرلند (Stamp 2) و برنامهٔ فارغ‌التحصیلان (Stamp 1G)' },
    agency: { en: 'Immigration Service Delivery', fa: 'ادارهٔ خدمات مهاجرت ایرلند (ISD)' },
    status: 'open',
    fact: {
      en: 'Show EUR 10,000 for each year of study. After a level 8 degree you get 12 months on Stamp 1G to find work; after a master’s or higher, up to 24 months. Study years do not count toward citizenship.',
      fa: 'برای هر سال تحصیل باید ۱۰٬۰۰۰ یورو نشان دهید. پس از مدرک سطح ۸ (لیسانس) ۱۲ ماه و پس از ارشد یا بالاتر تا ۲۴ ماه با Stamp 1G برای یافتن کار فرصت دارید. سال‌های تحصیل در شهروندی حساب نمی‌شوند.',
    },
    criteria: [
      {
        key: 'ilep',
        label: { en: 'Enrolled on a full-time course on the Interim List of Eligible Programmes (ILEP)', fa: 'ثبت‌نام در یک دورهٔ تمام‌وقت از فهرست برنامه‌های مجاز (ILEP)' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'funds',
        label: { en: 'Immediate access to EUR 10,000 for a one-year course, and the same for each later year', fa: 'دسترسی فوری به ۱۰٬۰۰۰ یورو برای دورهٔ یک‌ساله و همین مبلغ برای هر سال بعد' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 10_000, currency: 'EUR' },
        note: {
          en: 'Stays of 6 to 8 months: EUR 833 a month (EUR 4,998 for 6 months, EUR 6,665 for 8).',
          fa: 'برای اقامت ۶ تا ۸ ماهه: ماهی ۸۳۳ یورو (۴٬۹۹۸ یورو برای ۶ ماه و ۶٬۶۶۵ یورو برای ۸ ماه).',
        },
      },
      {
        key: 'english',
        label: { en: 'English level set by the college', fa: 'سطح زبان انگلیسی را دانشگاه تعیین می‌کند' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'progression',
        label: { en: 'Progress to a higher NFQ level; 7 years maximum on student permission', fa: 'پیشرفت به سطح بالاتر NFQ؛ حداکثر ۷ سال اقامت دانشجویی' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'living',
        label: { en: 'Living costs, each year of study', fa: 'هزینهٔ زندگی برای هر سال تحصیل' },
        amount: 10_000,
        currency: 'EUR',
        basis: 'perYear',
        shows: {
          en: 'Checked during the visa application for visa-required nationals, at registration for others.',
          fa: 'برای اتباع نیازمند ویزا در مرحلهٔ ویزا و برای بقیه هنگام ثبت اقامت بررسی می‌شود.',
        },
      },
    ],
    fees: [{ label: { en: 'Registration (IRP) fee, per person', fa: 'هزینهٔ ثبت اقامت (IRP) برای هر نفر' }, amount: 300, currency: 'EUR' }],
    pr: {
      en: 'No direct path. Stamp 2 is not reckonable for citizenship. Graduates move to Stamp 1G, then an employment permit (often Critical Skills) and Stamp 4.',
      fa: 'مسیر مستقیمی ندارد. Stamp 2 در شهروندی حساب نمی‌شود. فارغ‌التحصیلان به Stamp 1G و سپس مجوز کار (اغلب Critical Skills) و Stamp 4 می‌روند.',
    },
    sources: [
      { url: STUDY, checked: CHECKED, label: 'ISD, planning to study (work rules)' },
      { url: STUDY_FUNDS, checked: CHECKED, label: 'ISD, student finance from 30 June 2025' },
      { url: GRAD, checked: CHECKED, label: 'ISD, Third Level Graduate Programme' },
      { url: STAMPS, checked: CHECKED, label: 'ISD, immigration stamps' },
    ],
    verified: true,
    review:
      'Work: 20 h/week in term, 40 h/week in June–September and 15 Dec–15 Jan. IRP fee EUR 300 read on the graduate programme page; the long-stay D visa fee was not read. English-language (25-week) students are a separate track, not modelled.',
  },

  // ───────────────────────────── IIP (CLOSED) ─────────────────────────────
  {
    key: 'ie-iip',
    country: 'IE',
    family: 'entrepreneur',
    name: { en: 'Immigrant Investor Programme (IIP)', fa: 'برنامهٔ سرمایه‌گذاری مهاجران ایرلند (IIP)' },
    agency: { en: 'Department of Justice, Home Affairs and Migration', fa: 'وزارت دادگستری، امور داخلی و مهاجرت ایرلند' },
    status: 'closed',
    fact: {
      en: 'Closed to new applications at close of business on 15 February 2023. STEP was not affected and remains open.',
      fa: 'از پایان وقت اداری ۱۵ فوریهٔ ۲۰۲۳ درخواست تازه پذیرفته نمی‌شود. برنامهٔ STEP تحت تأثیر نبود و همچنان باز است.',
    },
    criteria: [
      {
        key: 'closed',
        label: { en: 'No new applications since 15 February 2023', fa: 'از ۱۵ فوریهٔ ۲۰۲۳ درخواست تازه پذیرفته نمی‌شود' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [],
    pr: {
      en: 'Closed. People already approved keep their status, subject to the programme’s monitoring.',
      fa: 'بسته است. کسانی که پیش‌تر تأیید شده‌اند وضعیت خود را حفظ می‌کنند و همچنان پایش می‌شوند.',
    },
    sources: [{ url: IIP, checked: CHECKED, label: 'ISD, closure announcement' }],
    verified: true,
    review:
      'Closure date read on the ISD announcement (opened in a browser). Applications on hand at closure continue to be considered (the ISD FAQ, not opened, puts them at about 1,500).',
  },
];
