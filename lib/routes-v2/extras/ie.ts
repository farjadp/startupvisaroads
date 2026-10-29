// Ireland: route depth and country profile for the app's v3 content
// (spec 2026-10-27). Every figure was read on its official or institutional
// page on 27 Oct 2026; notebook claims are leads only. Research and conflicts:
// docs/research/app-v3/ie.md.
import type { CountryProfile, RouteExtras } from '../extras-types';

const NB = 'be4208ac-88f5-4407-8cc3-0f1219d3c475';

const STEP = 'https://www.irishimmigration.ie/coming-to-work-in-ireland/what-are-my-options-for-working-in-ireland/coming-to-work-for-more-than-90-days/start-up-entrepreneur-programme-step/';
const STEP_GUIDE = 'https://www.irishimmigration.ie/wp-content/uploads/2023/09/STEP-Guidelines-Sep-2023.pdf';
const STEP_FORM = 'https://www.irishimmigration.ie/wp-content/uploads/2023/03/STEP-Application-Form-Mar-2023.pdf';
const CSEP = 'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/';
const STAMPS = 'https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/';
const STUDY = 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/planning-to-study-in-ireland/';
const ILEP = 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-third-level-course-or-a-language-course/';
const STUDY_FUNDS = 'https://www.irishimmigration.ie/reminder-on-student-finance-requirements-from-30-june-2025/';
const GRAD = 'https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/';
const IIP = 'https://www.irishimmigration.ie/minister-harris-announces-closure-of-the-immigrant-investor-programme/';
const CITIZEN = 'https://www.irishimmigration.ie/how-to-become-an-irish-citizen-guide/';
const DUAL = 'https://www.irishimmigration.ie/how-to-become-a-citizen/dual-citizenship/';
const RECKONABLE = 'https://www.citizensinformation.ie/en/moving-country/irish-citizenship/becoming-an-irish-citizen-through-naturalisation/';

const CITIZENSHIP_NOTE = {
  en: 'Citizenship by naturalisation needs 5 years of reckonable residence in the last 9, including the 12 months before applying. It is discretionary. Application fee EUR 175, and up to EUR 950 on approval. Ireland does not ask you to give up another citizenship.',
  fa: 'شهروندی از راه اقامت (Naturalisation) به ۵ سال اقامت قابل‌احتساب در ۹ سال اخیر نیاز دارد که ۱۲ ماه پیش از درخواست را هم شامل شود. تصمیم با وزیر است. هزینهٔ درخواست ۱۷۵ یورو و در صورت تأیید تا ۹۵۰ یورو. ایرلند از شما نمی‌خواهد تابعیت دیگرتان را کنار بگذارید.',
};

export const EXTRAS_IE: Record<string, RouteExtras> = {
  // ───────────────────────────── STEP ─────────────────────────────
  'ie-step': {
    funds: [
      {
        key: 'first-founder',
        label: { en: 'Funding for the business, first founder', fa: 'سرمایهٔ کسب‌وکار، بنیان‌گذار اول' },
        amount: 50_000,
        currency: 'EUR',
        basis: 'once',
        per: 'team',
        kind: 'invest',
        source: STEP_GUIDE,
      },
      {
        key: 'further-founder',
        label: { en: 'Funding, each further founder (not family members)', fa: 'سرمایه، هر هم‌بنیان‌گذار بعدی (غیر از اعضای خانواده)' },
        amount: 30_000,
        currency: 'EUR',
        basis: 'once',
        per: 'further-founder',
        kind: 'invest',
        source: STEP_GUIDE,
      },
      {
        key: 'fee',
        label: { en: 'Application fee, covers the whole family, non-refundable', fa: 'هزینهٔ درخواست برای کل خانواده، غیرقابل استرداد' },
        amount: 350,
        currency: 'EUR',
        basis: 'once',
        per: 'household',
        kind: 'spend',
        source: STEP,
      },
    ],
    steps: [
      {
        key: 'plan',
        title: { en: 'Write the business plan on the official template', fa: 'طرح کسب‌وکار را روی قالب رسمی بنویسید' },
        detail: {
          en: 'Show it is a high-potential start-up: international market, 10 jobs and EUR 1 million in sales within 3 years, all locations and staff per country.',
          fa: 'نشان دهید استارتاپ با پتانسیل بالاست: بازار بین‌المللی، ۱۰ شغل و یک میلیون یورو فروش ظرف ۳ سال، همهٔ محل‌های فعالیت و تعداد کارکنان در هر کشور.',
        },
        link: STEP_GUIDE,
      },
      {
        key: 'funds',
        title: { en: 'Document the EUR 50,000', fa: 'مدارک ۵۰٬۰۰۰ یورو را آماده کنید' },
        detail: {
          en: 'Three full months of bank statements (or a bank letter), proof of where the money came from, and a bank letter that it can be moved to Ireland and converted to euro.',
          fa: 'صورت‌حساب بانکی سه ماه کامل (یا نامهٔ بانک)، مدرک منشأ پول، و نامهٔ بانک که انتقال آن به ایرلند و تبدیلش به یورو ممکن است.',
        },
        link: STEP_GUIDE,
      },
      {
        key: 'police',
        title: { en: 'Collect police certificates', fa: 'گواهی‌های عدم سوءپیشینه را بگیرید' },
        detail: {
          en: 'From every country where you lived more than six months in the last 10 years.',
          fa: 'از هر کشوری که در ۱۰ سال اخیر بیش از شش ماه در آن زندگی کرده‌اید.',
        },
      },
      {
        key: 'send',
        title: { en: 'Email the application and pay EUR 350', fa: 'درخواست را ایمیل کنید و ۳۵۰ یورو بپردازید' },
        detail: {
          en: 'Form, plan and evidence to startup@justice.ie; pay by bank transfer with “STEP – passport number” as the reference. Incomplete applications are returned.',
          fa: 'فرم، طرح و مدارک را به startup@justice.ie بفرستید؛ هزینه را با انتقال بانکی و با مرجع «STEP – شمارهٔ گذرنامه» بپردازید. درخواست ناقص برگردانده می‌شود.',
        },
        link: STEP_FORM,
      },
      {
        key: 'committee',
        title: { en: 'Evaluation committee decides', fa: 'کمیتهٔ ارزیابی تصمیم می‌گیرد' },
        detail: {
          en: 'Senior public servants assess proposals quarterly and advise the Minister for Justice. The decision is final; you may apply again later.',
          fa: 'مدیران ارشد دولتی هر سه ماه طرح‌ها را بررسی می‌کنند و به وزیر دادگستری توصیه می‌دهند. تصمیم نهایی است؛ بعداً می‌توانید دوباره درخواست دهید.',
        },
        takes: { en: 'Quarterly rounds', fa: 'دورهای سه‌ماهه' },
        link: STEP,
      },
      {
        key: 'transfer',
        title: { en: 'After approval: move the funds and swear an affidavit', fa: 'پس از تأیید: پول را منتقل کنید و سوگندنامه بدهید' },
        detail: {
          en: 'Transfer the funds to an Irish business bank account and file an affidavit of good character made by a solicitor in Ireland (also for family members 16 and over).',
          fa: 'پول را به حساب تجاری در ایرلند منتقل کنید و سوگندنامهٔ حسن سابقه را که یک وکیل دارای مجوز در ایرلند تنظیم می‌کند ارائه دهید (برای اعضای ۱۶ سال به بالای خانواده هم).',
        },
      },
      {
        key: 'permission',
        title: { en: 'Get the 2-year permission and register', fa: 'اقامت ۲ ساله را بگیرید و ثبت کنید' },
        detail: {
          en: 'A multiple-entry visa is issued for the same period if you need one. Keep private medical insurance and do not use public funds.',
          fa: 'اگر به ویزا نیاز داشته باشید، ویزای چندبارهٔ هم‌مدت صادر می‌شود. بیمهٔ درمانی خصوصی داشته باشید و از منابع عمومی استفاده نکنید.',
        },
      },
    ],
    documents: [
      { key: 'form', label: { en: 'Completed STEP application form', fa: 'فرم تکمیل‌شدهٔ درخواست STEP' }, stage: 'apply' },
      { key: 'plan', label: { en: 'Business plan on the sample template', fa: 'طرح کسب‌وکار روی قالب نمونه' }, stage: 'apply' },
      { key: 'funding', label: { en: 'Evidence of EUR 50,000 and its source', fa: 'مدرک ۵۰٬۰۰۰ یورو و منشأ آن' }, note: { en: 'Original statements on bank stationery covering three full months; the latest no older than one month.', fa: 'صورت‌حساب‌های اصل روی سربرگ بانک برای سه ماه کامل؛ آخرینش بیش از یک ماه قدیمی نباشد.' }, stage: 'apply' },
      { key: 'transfer-letter', label: { en: 'Bank letter confirming the funds can be transferred to Ireland', fa: 'نامهٔ بانک دربارهٔ امکان انتقال پول به ایرلند' }, stage: 'apply' },
      { key: 'investor-letters', label: { en: 'Letters from lenders, angels, VCs or state agencies (if used)', fa: 'نامهٔ وام‌دهنده، سرمایه‌گذار فرشته یا خطرپذیر، یا نهاد دولتی (در صورت استفاده)' }, stage: 'apply' },
      { key: 'audited', label: { en: 'Latest audited accounts, if relocating an existing business', fa: 'آخرین صورت‌های مالی حسابرسی‌شده، اگر کسب‌وکار موجودی را منتقل می‌کنید' }, stage: 'apply' },
      { key: 'police', label: { en: 'Police certificates (6+ months in the last 10 years)', fa: 'گواهی عدم سوءپیشینه (بیش از ۶ ماه اقامت در ۱۰ سال اخیر)' }, stage: 'apply' },
      { key: 'affidavit', label: { en: 'Affidavit of good character by an Irish solicitor', fa: 'سوگندنامهٔ حسن سابقه نزد وکیل ایرلندی' }, stage: 'permit' },
      { key: 'family', label: { en: 'Marriage certificate or 2 years’ cohabitation proof; children’s birth certificates', fa: 'سند ازدواج یا مدرک دو سال زندگی مشترک؛ شناسنامهٔ فرزندان' }, stage: 'permit' },
      { key: 'insurance', label: { en: 'Private medical insurance', fa: 'بیمهٔ درمانی خصوصی' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'money-not-enough',
        kind: 'myth',
        title: { en: 'Myth: EUR 50,000 buys the permit', fa: 'باور نادرست: ۵۰٬۰۰۰ یورو اقامت را تضمین می‌کند' },
        detail: {
          en: 'The guidelines say meeting the financial condition does not guarantee approval; the plan must be genuinely innovative with significant export potential.',
          fa: 'راهنمای رسمی می‌گوید تأمین شرط مالی به معنای تأیید نیست؛ طرح باید واقعاً نوآورانه و با ظرفیت صادراتی قابل‌توجه باشد.',
        },
        source: STEP_GUIDE,
      },
      {
        key: 'no-appeal',
        kind: 'challenge',
        title: { en: 'No appeal', fa: 'امکان اعتراض ندارد' },
        detail: {
          en: 'A refusal is final; you receive the reasons in writing and may submit a new application later.',
          fa: 'رد درخواست نهایی است؛ دلایل را کتبی دریافت می‌کنید و بعداً می‌توانید درخواست تازه بدهید.',
        },
        source: STEP,
      },
      {
        key: 'no-retail',
        kind: 'challenge',
        title: { en: 'Not for shops, cafés or local services', fa: 'برای فروشگاه، کافه یا خدمات محلی نیست' },
        detail: {
          en: 'Retail, personal services, catering and other domestic businesses are outside the scheme.',
          fa: 'خرده‌فروشی، خدمات شخصی، پذیرایی و دیگر کسب‌وکارهای داخلی خارج از این برنامه‌اند.',
        },
        source: STEP_GUIDE,
      },
      {
        key: 'no-ielts',
        kind: 'tip',
        title: { en: 'No English test is listed', fa: 'آزمون زبانی در شرایط نیامده است' },
        detail: {
          en: 'Neither the STEP page nor the guidelines set a language requirement; the plan and the committee’s questions are in English in practice.',
          fa: 'نه صفحهٔ STEP و نه راهنمای رسمی شرط زبانی تعیین نکرده‌اند؛ در عمل طرح و پرسش‌های کمیته به انگلیسی است.',
        },
        source: STEP_GUIDE,
      },
      {
        key: 'failure',
        kind: 'tip',
        title: { en: 'If the start-up fails', fa: 'اگر استارتاپ شکست بخورد' },
        detail: {
          en: 'Your status is reviewed and you apply on another basis: a new STEP proposal or an employment permit, under the rules in force then.',
          fa: 'وضعیت اقامت شما بازبینی می‌شود و باید از راه دیگری درخواست دهید: طرح STEP تازه یا مجوز کار، طبق قوانین همان زمان.',
        },
        source: STEP_GUIDE,
      },
      {
        key: 'full-time',
        kind: 'challenge',
        title: { en: 'Full-time on the business, no other job', fa: 'تمام‌وقت روی کسب‌وکار، بدون شغل دیگر' },
        detail: {
          en: 'You must work on the business full time, may not be employed elsewhere and must not become a financial burden on the State.',
          fa: 'باید تمام‌وقت روی کسب‌وکار کار کنید، اجازهٔ استخدام در جای دیگر را ندارید و نباید سربار مالی دولت شوید.',
        },
        source: STEP,
      },
    ],
    timeline: {
      prAfterYears: 5,
      citizenshipAfterYears: 5,
      dualCitizenship: 'allowed',
      language: { en: 'STEP sets no language requirement.', fa: 'برنامهٔ STEP شرط زبانی تعیین نکرده است.' },
      note: {
        en: `Permission 2 years, then 3, then 5-year renewals; long-term residence after 5 years. ${CITIZENSHIP_NOTE.en}`,
        fa: `اقامت ۲ ساله، سپس ۳ ساله و پس از آن تمدیدهای ۵ ساله؛ اقامت بلندمدت پس از ۵ سال. ${CITIZENSHIP_NOTE.fa}`,
      },
      source: STEP_GUIDE,
    },
    quiz: [
      {
        key: 'funding',
        q: { en: 'How much must the first founder secure?', fa: 'بنیان‌گذار اول چقدر سرمایه باید تأمین کند؟' },
        options: [{ en: 'EUR 30,000', fa: '۳۰٬۰۰۰ یورو' }, { en: 'EUR 50,000', fa: '۵۰٬۰۰۰ یورو' }, { en: 'EUR 500,000', fa: '۵۰۰٬۰۰۰ یورو' }],
        answer: 1,
        why: { en: 'The first principal shows EUR 50,000; each further principal EUR 30,000.', fa: 'بنیان‌گذار اول ۵۰٬۰۰۰ یورو و هر بنیان‌گذار بعدی ۳۰٬۰۰۰ یورو نشان می‌دهد.' },
      },
      {
        key: 'hpsu',
        q: { en: 'What must a high-potential start-up be capable of within 3 years?', fa: 'استارتاپ با پتانسیل بالا ظرف ۳ سال باید توان چه چیزی را داشته باشد؟' },
        options: [
          { en: '3 jobs and EUR 100,000 sales', fa: '۳ شغل و ۱۰۰ هزار یورو فروش' },
          { en: '10 jobs and EUR 1 million sales', fa: '۱۰ شغل و یک میلیون یورو فروش' },
          { en: '50 jobs and EUR 10 million sales', fa: '۵۰ شغل و ۱۰ میلیون یورو فروش' },
        ],
        answer: 1,
        why: { en: 'The HPSU definition is 10 jobs in Ireland and EUR 1 million in sales within 3 years.', fa: 'تعریف HPSU یعنی ۱۰ شغل در ایرلند و یک میلیون یورو فروش ظرف ۳ سال.' },
      },
      {
        key: 'appeal',
        q: { en: 'Can you appeal a refusal?', fa: 'آیا می‌توان به ردِ درخواست اعتراض کرد؟' },
        options: [{ en: 'Yes, within 28 days', fa: 'بله، ظرف ۲۸ روز' }, { en: 'No, but you can reapply later', fa: 'خیر، اما بعداً می‌توان دوباره درخواست داد' }, { en: 'Only in court', fa: 'فقط در دادگاه' }],
        answer: 1,
        why: { en: 'The decision is final and not subject to review or appeal; a new application later is allowed.', fa: 'تصمیم نهایی است و بازبینی یا اعتراض ندارد؛ اما درخواست تازه در آینده مجاز است.' },
      },
      {
        key: 'first-permit',
        q: { en: 'How long is the first permission?', fa: 'اقامت اول چند ساله است؟' },
        options: [{ en: '1 year', fa: '۱ سال' }, { en: '2 years', fa: '۲ سال' }, { en: '5 years', fa: '۵ سال' }],
        answer: 1,
        why: { en: 'Two years, renewable for three more and then in five-year steps.', fa: 'دو سال، که سه سال تمدید می‌شود و بعد ۵ سال‌به‌۵ سال.' },
      },
      {
        key: 'fee',
        q: { en: 'What does the application fee cover?', fa: 'هزینهٔ درخواست شامل چه کسانی است؟' },
        options: [
          { en: 'EUR 350 per person', fa: '۳۵۰ یورو برای هر نفر' },
          { en: 'EUR 350 for the applicant and all nominated family', fa: '۳۵۰ یورو برای متقاضی و همهٔ اعضای خانوادهٔ معرفی‌شده' },
          { en: 'EUR 1,000 per family', fa: '۱٬۰۰۰ یورو برای هر خانواده' },
        ],
        answer: 1,
        why: { en: 'The EUR 350 fee covers the principal and all nominated family members and is not refunded.', fa: 'هزینهٔ ۳۵۰ یورویی متقاضی اصلی و همهٔ اعضای خانوادهٔ معرفی‌شده را پوشش می‌دهد و برگردانده نمی‌شود.' },
      },
    ],
    media: [
      { notebookId: NB, kind: 'slides', title: 'بلوپرینت کارآفرینی ایرلند' },
      { notebookId: NB, kind: 'infographic', title: 'برنامه کارآفرین نوپا ایرلند (STEP)' },
    ],
  },

  // ───────────────────────────── CRITICAL SKILLS ─────────────────────────────
  'ie-critical-skills': {
    funds: [
      { key: 'permit-fee', label: { en: 'Permit fee (90% refunded if refused)', fa: 'هزینهٔ مجوز (در صورت رد، ۹۰٪ برمی‌گردد)' }, amount: 1_000, currency: 'EUR', basis: 'once', per: 'person', kind: 'spend', source: CSEP },
      { key: 'irp', label: { en: 'Immigration registration (IRP), per person', fa: 'ثبت اقامت (IRP) برای هر نفر' }, amount: 300, currency: 'EUR', basis: 'once', per: 'person', kind: 'spend', source: GRAD },
    ],
    steps: [
      {
        key: 'offer',
        title: { en: 'Get a job offer of at least 2 years', fa: 'پیشنهاد کار دست‌کم ۲ ساله بگیرید' },
        detail: {
          en: 'EUR 40,904 or more for occupations on the Critical Skills Occupations List (with a relevant degree), EUR 68,911 for most others.',
          fa: '۴۰٬۹۰۴ یورو یا بیشتر برای مشاغل فهرست مهارت‌های حیاتی (با مدرک مرتبط) و ۶۸٬۹۱۱ یورو برای بیشتر مشاغل دیگر.',
        },
        link: CSEP,
      },
      {
        key: 'apply',
        title: { en: 'Apply for the permit 12 weeks before the start date', fa: '۱۲ هفته پیش از شروع کار برای مجوز درخواست دهید' },
        detail: {
          en: 'You or your employer apply; no labour market test is needed. Answer any requests within 28 days.',
          fa: 'شما یا کارفرما درخواست می‌دهید؛ آزمون بازار کار لازم نیست. به درخواست‌های اطلاعات ظرف ۲۸ روز پاسخ دهید.',
        },
        takes: { en: 'Processed in date order', fa: 'به ترتیب تاریخ بررسی می‌شود' },
        link: CSEP,
      },
      {
        key: 'visa',
        title: { en: 'Visa, if your nationality needs one', fa: 'ویزا، اگر ملیت شما ویزا لازم دارد' },
        detail: { en: 'Apply for an Irish employment visa with the permit.', fa: 'با مجوز کار برای ویزای کار ایرلند درخواست دهید.' },
      },
      {
        key: 'register',
        title: { en: 'Register your permission (Stamp 1)', fa: 'اقامت خود را ثبت کنید (Stamp 1)' },
        detail: { en: 'Pay the EUR 300 registration fee and get your IRP card.', fa: 'هزینهٔ ثبت ۳۰۰ یورویی را بپردازید و کارت IRP بگیرید.' },
        link: STAMPS,
      },
      {
        key: 'family',
        title: { en: 'Bring your family', fa: 'خانواده را بیاورید' },
        detail: {
          en: 'Immediate family can apply for family reunification; a spouse or partner can then work.',
          fa: 'اعضای درجه‌یک خانواده می‌توانند برای پیوستن درخواست دهند؛ همسر یا شریک زندگی پس از آن می‌تواند کار کند.',
        },
        link: CSEP,
      },
      {
        key: 'stamp4',
        title: { en: 'After 2 years: apply for Stamp 4', fa: 'پس از ۲ سال: برای Stamp 4 درخواست دهید' },
        detail: {
          en: 'Apply to the Department of Justice; with Stamp 4 you can work without a permit.',
          fa: 'به وزارت دادگستری درخواست دهید؛ با Stamp 4 بدون مجوز کار می‌توانید کار کنید.',
        },
        link: STAMPS,
      },
    ],
    documents: [
      { key: 'contract', label: { en: 'Job offer or contract of at least 2 years with the salary', fa: 'پیشنهاد کار یا قرارداد دست‌کم ۲ ساله با ذکر حقوق' }, stage: 'apply' },
      { key: 'degree', label: { en: 'Degree certificate (for the EUR 40,904 band)', fa: 'مدرک دانشگاهی (برای ردهٔ ۴۰٬۹۰۴ یورو)' }, stage: 'apply' },
      { key: 'cv', label: { en: 'CV and evidence of experience (for the EUR 68,911 band without a degree)', fa: 'رزومه و مدرک سابقهٔ کار (برای ردهٔ ۶۸٬۹۱۱ یورو بدون مدرک دانشگاهی)' }, stage: 'apply' },
      { key: 'passport', label: { en: 'Passport', fa: 'گذرنامه' }, stage: 'visa' },
      { key: 'registration', label: { en: 'Registration fee payment and permit', fa: 'رسید هزینهٔ ثبت و مجوز کار' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'stamp4',
        kind: 'tip',
        title: { en: 'The fastest employee path to open residence', fa: 'سریع‌ترین مسیر کارمندی به اقامت آزاد' },
        detail: {
          en: 'Stamp 4 after 2 years, compared with 5 years on a General Employment Permit.',
          fa: 'Stamp 4 پس از ۲ سال، در مقابل ۵ سال با مجوز کار عمومی (General Employment Permit).',
        },
        source: STAMPS,
      },
      {
        key: 'nine-months',
        kind: 'challenge',
        title: { en: 'Stay with the first employer 9 months', fa: '۹ ماه نزد کارفرمای اول بمانید' },
        detail: {
          en: 'The holder is expected to stay with the initial employer for at least 9 months.',
          fa: 'از دارندهٔ مجوز انتظار می‌رود دست‌کم ۹ ماه نزد کارفرمای اول بماند.',
        },
        source: CSEP,
      },
      {
        key: 'spouse',
        kind: 'tip',
        title: { en: 'Your partner can work', fa: 'همسرتان می‌تواند کار کند' },
        detail: {
          en: 'Spouses and partners of permit holders get Stamp 1G and can take any job once resident.',
          fa: 'همسر یا شریک زندگی دارندهٔ این مجوز Stamp 1G می‌گیرد و پس از اقامت می‌تواند هر شغلی بگیرد.',
        },
        source: STAMPS,
      },
      {
        key: 'high-bar',
        kind: 'challenge',
        title: { en: 'Off-list jobs need EUR 68,911', fa: 'مشاغل خارج از فهرست ۶۸٬۹۱۱ یورو لازم دارند' },
        detail: {
          en: 'If your occupation is not on the Critical Skills list, the salary floor is EUR 68,911.',
          fa: 'اگر شغل شما در فهرست مهارت‌های حیاتی نیست، حداقل حقوق ۶۸٬۹۱۱ یورو است.',
        },
        source: CSEP,
      },
    ],
    timeline: {
      prAfterYears: 2,
      citizenshipAfterYears: 5,
      dualCitizenship: 'allowed',
      note: {
        en: `Stamp 4 after 2 years; long-term residence after 60 months. Stamp 1 and Stamp 4 years are reckonable. ${CITIZENSHIP_NOTE.en}`,
        fa: `Stamp 4 پس از ۲ سال و اقامت بلندمدت پس از ۶۰ ماه. سال‌های Stamp 1 و Stamp 4 قابل‌احتساب‌اند. ${CITIZENSHIP_NOTE.fa}`,
      },
      source: CSEP,
    },
    quiz: [
      {
        key: 'min',
        q: { en: 'Minimum salary for a listed occupation with a degree?', fa: 'حداقل حقوق برای شغل داخل فهرست با مدرک دانشگاهی؟' },
        options: [{ en: 'EUR 34,000', fa: '۳۴٬۰۰۰ یورو' }, { en: 'EUR 40,904', fa: '۴۰٬۹۰۴ یورو' }, { en: 'EUR 68,911', fa: '۶۸٬۹۱۱ یورو' }],
        answer: 1,
        why: { en: 'EUR 40,904 for Critical Skills Occupations List roles with a relevant degree.', fa: '۴۰٬۹۰۴ یورو برای مشاغل فهرست مهارت‌های حیاتی با مدرک مرتبط.' },
      },
      {
        key: 'length',
        q: { en: 'How long must the job offer be?', fa: 'پیشنهاد کار باید حداقل چه مدتی باشد؟' },
        options: [{ en: '6 months', fa: '۶ ماه' }, { en: '1 year', fa: '۱ سال' }, { en: '2 years', fa: '۲ سال' }],
        answer: 2,
        why: { en: 'Offers must be for at least 2 years.', fa: 'پیشنهاد کار باید دست‌کم ۲ ساله باشد.' },
      },
      {
        key: 'stamp4',
        q: { en: 'When can you apply for Stamp 4?', fa: 'چه زمانی می‌توانید برای Stamp 4 درخواست دهید؟' },
        options: [{ en: 'After 1 year', fa: 'پس از ۱ سال' }, { en: 'After 2 years', fa: 'پس از ۲ سال' }, { en: 'After 5 years', fa: 'پس از ۵ سال' }],
        answer: 1,
        why: { en: 'At the end of the 2-year permit you can apply directly for Stamp 4.', fa: 'در پایان مجوز ۲ ساله می‌توانید مستقیم برای Stamp 4 درخواست دهید.' },
      },
      {
        key: 'lmt',
        q: { en: 'Does the employer have to run a labour market test?', fa: 'آیا کارفرما باید آزمون بازار کار انجام دهد؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No', fa: 'خیر' }],
        answer: 1,
        why: { en: 'No Labour Market Needs Test, because the occupations are in short supply.', fa: 'آزمون نیاز بازار کار لازم نیست، چون این مشاغل کمبود دارند.' },
      },
      {
        key: 'refund',
        q: { en: 'What happens to the EUR 1,000 fee if refused?', fa: 'اگر درخواست رد شود، هزینهٔ ۱٬۰۰۰ یورویی چه می‌شود؟' },
        options: [{ en: 'Nothing is refunded', fa: 'چیزی برنمی‌گردد' }, { en: '90% is refunded', fa: '۹۰٪ برمی‌گردد' }, { en: 'All is refunded', fa: 'همه‌اش برمی‌گردد' }],
        answer: 1,
        why: { en: 'If unsuccessful, 90% of the fee is refunded to the applicant.', fa: 'در صورت رد، ۹۰٪ هزینه به متقاضی برگردانده می‌شود.' },
      },
    ],
    media: [],
  },

  // ───────────────────────────── STUDY ─────────────────────────────
  'ie-study': {
    funds: [
      { key: 'living', label: { en: 'Living costs, each year of study', fa: 'هزینهٔ زندگی، هر سال تحصیل' }, amount: 10_000, currency: 'EUR', basis: 'perYear', per: 'person', kind: 'show', source: STUDY_FUNDS },
      { key: 'irp', label: { en: 'Immigration registration (IRP)', fa: 'ثبت اقامت (IRP)' }, amount: 300, currency: 'EUR', basis: 'once', per: 'person', kind: 'spend', source: GRAD },
    ],
    steps: [
      {
        key: 'course',
        title: { en: 'Choose a course on the ILEP', fa: 'یک دوره از فهرست ILEP انتخاب کنید' },
        detail: { en: 'Check both the ILEP and the TrustEd Ireland list; only listed full-time programmes qualify.', fa: 'هم فهرست ILEP و هم فهرست TrustEd Ireland را ببینید؛ فقط برنامه‌های تمام‌وقتِ فهرست‌شده قبول‌اند.' },
        link: ILEP,
      },
      {
        key: 'offer',
        title: { en: 'Get the offer and pay fees', fa: 'پذیرش بگیرید و شهریه را بپردازید' },
        detail: { en: 'Colleges must hold fees in a separate account until the visa is decided.', fa: 'مؤسسه‌ها باید شهریه را تا روشن‌شدن نتیجهٔ ویزا در حساب جداگانه نگه دارند.' },
        link: STUDY,
      },
      {
        key: 'funds',
        title: { en: 'Show EUR 10,000 a year', fa: '۱۰٬۰۰۰ یورو برای هر سال نشان دهید' },
        detail: { en: 'Immediate access for the first year and ready access for each later year.', fa: 'دسترسی فوری برای سال اول و دسترسی آماده برای هر سال بعد.' },
        link: STUDY_FUNDS,
      },
      {
        key: 'visa',
        title: { en: 'Apply for a study visa if you need one', fa: 'اگر لازم است، برای ویزای تحصیلی درخواست دهید' },
        detail: { en: 'Visa-required nationals prove funds in the visa application.', fa: 'اتباع نیازمند ویزا تمکن را در درخواست ویزا ثابت می‌کنند.' },
      },
      {
        key: 'register',
        title: { en: 'Register Stamp 2 in Ireland', fa: 'در ایرلند Stamp 2 را ثبت کنید' },
        detail: { en: 'Pay EUR 300; work 20 hours a week in term and 40 in the holidays.', fa: '۳۰۰ یورو بپردازید؛ در ترم ۲۰ ساعت و در تعطیلات ۴۰ ساعت در هفته کار کنید.' },
        link: STAMPS,
      },
      {
        key: 'graduate',
        title: { en: 'After graduating: Stamp 1G', fa: 'پس از فارغ‌التحصیلی: Stamp 1G' },
        detail: { en: 'Apply within six months of your result: 12 months after level 8, up to 24 after level 9 or above.', fa: 'ظرف شش ماه پس از اعلام نتیجه درخواست دهید: ۱۲ ماه پس از سطح ۸ و تا ۲۴ ماه پس از سطح ۹ یا بالاتر.' },
        link: GRAD,
      },
    ],
    documents: [
      { key: 'offer', label: { en: 'Letter of acceptance on an ILEP course', fa: 'نامهٔ پذیرش در دورهٔ ILEP' }, stage: 'visa' },
      { key: 'fees', label: { en: 'Proof of fees paid', fa: 'رسید پرداخت شهریه' }, stage: 'visa' },
      { key: 'funds', label: { en: 'Evidence of access to EUR 10,000 for the year', fa: 'مدرک دسترسی به ۱۰٬۰۰۰ یورو برای سال تحصیلی' }, stage: 'visa' },
      { key: 'insurance', label: { en: 'Medical insurance', fa: 'بیمهٔ درمانی' }, stage: 'permit' },
      { key: 'passport', label: { en: 'Passport', fa: 'گذرنامه' }, stage: 'visa' },
    ],
    realities: [
      {
        key: 'not-reckonable',
        kind: 'challenge',
        title: { en: 'Study years do not count toward citizenship', fa: 'سال‌های تحصیل در شهروندی حساب نمی‌شوند' },
        detail: {
          en: 'Stamp 2 is not reckonable residence; Stamp 1G time on the Graduate Programme is.',
          fa: 'Stamp 2 اقامت قابل‌احتساب نیست؛ اما مدت Stamp 1G در برنامهٔ فارغ‌التحصیلان حساب می‌شود.',
        },
        source: RECKONABLE,
      },
      {
        key: 'seven-years',
        kind: 'challenge',
        title: { en: 'Seven-year cap on student permission', fa: 'سقف هفت سال برای اقامت دانشجویی' },
        detail: {
          en: 'Students may stay at most 7 years and must progress to a higher level each year.',
          fa: 'دانشجو حداکثر ۷ سال می‌تواند بماند و باید هر سال به سطح بالاتری برود.',
        },
        source: STAMPS,
      },
      {
        key: 'no-business',
        kind: 'myth',
        title: { en: 'Myth: you can freelance on Stamp 1G', fa: 'باور نادرست: با Stamp 1G می‌توان فریلنس کار کرد' },
        detail: {
          en: 'Stamp 1G allows full-time work but not running a business or self-employment.',
          fa: 'Stamp 1G کار تمام‌وقت را مجاز می‌کند اما راه‌اندازی کسب‌وکار یا خوداشتغالی را نه.',
        },
        source: STAMPS,
      },
      {
        key: 'work-hours',
        kind: 'tip',
        title: { en: '40 hours a week in the holidays', fa: '۴۰ ساعت در هفته در تعطیلات' },
        detail: {
          en: 'June to September and 15 December to 15 January.',
          fa: 'از ژوئن تا سپتامبر و از ۱۵ دسامبر تا ۱۵ ژانویه.',
        },
        source: STUDY,
      },
    ],
    timeline: {
      dualCitizenship: 'allowed',
      note: {
        en: `Stamp 2 does not count; the path runs through Stamp 1G, an employment permit and Stamp 4. ${CITIZENSHIP_NOTE.en}`,
        fa: `Stamp 2 حساب نمی‌شود؛ مسیر از Stamp 1G، مجوز کار و Stamp 4 می‌گذرد. ${CITIZENSHIP_NOTE.fa}`,
      },
      source: RECKONABLE,
    },
    quiz: [
      {
        key: 'funds',
        q: { en: 'How much must you show for a one-year course?', fa: 'برای دورهٔ یک‌ساله چقدر باید نشان دهید؟' },
        options: [{ en: 'EUR 7,000', fa: '۷٬۰۰۰ یورو' }, { en: 'EUR 10,000', fa: '۱۰٬۰۰۰ یورو' }, { en: 'EUR 15,000', fa: '۱۵٬۰۰۰ یورو' }],
        answer: 1,
        why: { en: 'Since 30 June 2025 the figure is EUR 10,000 for every student.', fa: 'از ۳۰ ژوئن ۲۰۲۵ این رقم برای همهٔ دانشجویان ۱۰٬۰۰۰ یوروست.' },
      },
      {
        key: 'hours',
        q: { en: 'How many hours a week can you work in term?', fa: 'در طول ترم هفته‌ای چند ساعت می‌توانید کار کنید؟' },
        options: [{ en: '10', fa: '۱۰' }, { en: '20', fa: '۲۰' }, { en: '40', fa: '۴۰' }],
        answer: 1,
        why: { en: 'Stamp 2 allows 20 hours a week in term and 40 in holiday periods.', fa: 'Stamp 2 در ترم ۲۰ ساعت و در تعطیلات ۴۰ ساعت کار در هفته را مجاز می‌کند.' },
      },
      {
        key: 'reckonable',
        q: { en: 'Does Stamp 2 time count toward citizenship?', fa: 'آیا مدت Stamp 2 در شهروندی حساب می‌شود؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No', fa: 'خیر' }, { en: 'Half of it', fa: 'نصف آن' }],
        answer: 1,
        why: { en: 'Stamp 2 is not reckonable as residence for naturalisation.', fa: 'Stamp 2 برای شهروندی اقامت قابل‌احتساب نیست.' },
      },
      {
        key: '1g',
        q: { en: 'How long is Stamp 1G after a master’s?', fa: 'Stamp 1G پس از کارشناسی ارشد چقدر است؟' },
        options: [{ en: '6 months', fa: '۶ ماه' }, { en: '12 months', fa: '۱۲ ماه' }, { en: 'Up to 24 months', fa: 'تا ۲۴ ماه' }],
        answer: 2,
        why: { en: 'Level 9+ graduates get 12 months, renewable for 12 more.', fa: 'فارغ‌التحصیلان سطح ۹ و بالاتر ۱۲ ماه می‌گیرند که ۱۲ ماه دیگر تمدید می‌شود.' },
      },
      {
        key: 'list',
        q: { en: 'Which list must your course be on?', fa: 'دورهٔ شما باید در کدام فهرست باشد؟' },
        options: [{ en: 'CRICOS', fa: 'CRICOS' }, { en: 'ILEP (or TrustEd Ireland)', fa: 'ILEP (یا TrustEd Ireland)' }, { en: 'Any accredited course', fa: 'هر دورهٔ معتبری' }],
        answer: 1,
        why: { en: 'Courses longer than 90 days must be on the ILEP or the TrustEd Ireland list.', fa: 'دوره‌های بیش از ۹۰ روز باید در فهرست ILEP یا TrustEd Ireland باشند.' },
      },
    ],
    media: [],
  },

  // ───────────────────────────── IIP (CLOSED) ─────────────────────────────
  'ie-iip': {
    funds: [],
    steps: [
      {
        key: 'step',
        title: { en: 'Consider STEP instead', fa: 'به‌جای آن STEP را بررسی کنید' },
        detail: {
          en: 'The Government said STEP continues; it needs EUR 50,000 and an innovative start-up, not a passive investment.',
          fa: 'دولت اعلام کرد STEP ادامه دارد؛ این برنامه ۵۰٬۰۰۰ یورو و یک استارتاپ نوآور می‌خواهد، نه سرمایه‌گذاری منفعل.',
        },
        link: STEP,
      },
      {
        key: 'pending',
        title: { en: 'Already applied before 15 February 2023?', fa: 'پیش از ۱۵ فوریهٔ ۲۰۲۳ درخواست داده‌اید؟' },
        detail: {
          en: 'Applications on hand at closure continue to be considered.',
          fa: 'درخواست‌هایی که هنگام بسته‌شدن در جریان بودند همچنان بررسی می‌شوند.',
        },
        link: IIP,
      },
      {
        key: 'csep',
        title: { en: 'Or move through work: Critical Skills permit', fa: 'یا از مسیر کار: مجوز مهارت‌های حیاتی' },
        detail: {
          en: 'A 2-year job offer at EUR 40,904 or more in a listed occupation leads to Stamp 4 after 2 years.',
          fa: 'پیشنهاد کار ۲ ساله با حقوق ۴۰٬۹۰۴ یورو یا بیشتر در یکی از مشاغل فهرست، پس از ۲ سال به Stamp 4 می‌رسد.',
        },
        link: CSEP,
      },
      {
        key: 'plan',
        title: { en: 'Turn the investment into a STEP proposal', fa: 'سرمایه را به طرح STEP تبدیل کنید' },
        detail: {
          en: 'STEP funding can come from your own money, a loan, angels, VCs or a state grant, but the business must be a high-potential start-up you run full time.',
          fa: 'سرمایهٔ STEP می‌تواند از پول خودتان، وام، سرمایه‌گذار فرشته یا خطرپذیر یا کمک دولتی باشد، اما کسب‌وکار باید استارتاپی پرپتانسیل باشد که خودتان تمام‌وقت اداره‌اش کنید.',
        },
        link: STEP_GUIDE,
      },
    ],
    documents: [],
    realities: [
      {
        key: 'closed',
        kind: 'myth',
        title: { en: 'Myth: Ireland still sells residence for investment', fa: 'باور نادرست: ایرلند هنوز در ازای سرمایه‌گذاری اقامت می‌دهد' },
        detail: {
          en: 'The Immigrant Investor Programme closed to new applications on 15 February 2023.',
          fa: 'برنامهٔ سرمایه‌گذاری مهاجران از ۱۵ فوریهٔ ۲۰۲۳ درخواست تازه نمی‌پذیرد.',
        },
        source: IIP,
      },
      {
        key: 'why',
        kind: 'tip',
        title: { en: 'Why it closed', fa: 'چرا بسته شد' },
        detail: {
          en: 'The Minister cited internal and external reviews and reports from the EU Commission, the Council of Europe and the OECD on such programmes.',
          fa: 'وزیر به بازبینی‌های داخلی و خارجی و گزارش‌های کمیسیون اروپا، شورای اروپا و OECD دربارهٔ این‌گونه برنامه‌ها اشاره کرد.',
        },
        source: IIP,
      },
      {
        key: 'approved',
        kind: 'tip',
        title: { en: 'Approved investors keep their status', fa: 'سرمایه‌گذاران تأییدشده وضعیت خود را حفظ می‌کنند' },
        detail: {
          en: 'The closure does not affect projects or individuals already approved; the Department keeps monitoring them.',
          fa: 'بسته‌شدن برنامه بر پروژه‌ها و افراد تأییدشده اثری ندارد؛ وزارتخانه همچنان آن‌ها را پایش می‌کند.',
        },
        source: IIP,
      },
    ],
    timeline: { dualCitizenship: 'allowed', note: { en: 'Closed route; see STEP or the Critical Skills permit.', fa: 'مسیر بسته است؛ STEP یا مجوز مهارت‌های حیاتی را ببینید.' }, source: DUAL },
    quiz: [
      {
        key: 'date',
        q: { en: 'When did the IIP close to new applications?', fa: 'IIP از چه زمانی درخواست تازه نمی‌پذیرد؟' },
        options: [{ en: '15 February 2023', fa: '۱۵ فوریهٔ ۲۰۲۳' }, { en: '31 July 2024', fa: '۳۱ ژوئیهٔ ۲۰۲۴' }, { en: '1 January 2026', fa: '۱ ژانویهٔ ۲۰۲۶' }],
        answer: 0,
        why: { en: 'It closed at close of business on 15 February 2023.', fa: 'از پایان وقت اداری ۱۵ فوریهٔ ۲۰۲۳ بسته شد.' },
      },
      {
        key: 'step',
        q: { en: 'Was STEP closed at the same time?', fa: 'آیا STEP هم‌زمان بسته شد؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No, it continues', fa: 'خیر، ادامه دارد' }],
        answer: 1,
        why: { en: 'The announcement said STEP will continue.', fa: 'در اطلاعیه آمده بود که STEP ادامه می‌یابد.' },
      },
      {
        key: 'pending',
        q: { en: 'What happened to applications on hand?', fa: 'درخواست‌های در جریان چه شدند؟' },
        options: [{ en: 'Refused', fa: 'رد شدند' }, { en: 'Still considered', fa: 'همچنان بررسی می‌شوند' }, { en: 'Moved to STEP', fa: 'به STEP منتقل شدند' }],
        answer: 1,
        why: { en: 'Current applications on hand at closure continue to be considered.', fa: 'درخواست‌هایی که هنگام بسته‌شدن در جریان بودند همچنان بررسی می‌شوند.' },
      },
      {
        key: 'approved',
        q: { en: 'Did the closure cancel approved investors’ status?', fa: 'آیا بسته‌شدن برنامه وضعیت سرمایه‌گذاران تأییدشده را لغو کرد؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No', fa: 'خیر' }],
        answer: 1,
        why: { en: 'Existing approved projects and individuals are not affected.', fa: 'پروژه‌ها و افراد تأییدشده تحت تأثیر قرار نگرفتند.' },
      },
      {
        key: 'start',
        q: { en: 'When was the IIP introduced?', fa: 'IIP از چه سالی راه‌اندازی شده بود؟' },
        options: [{ en: '2008', fa: '۲۰۰۸' }, { en: '2012', fa: '۲۰۱۲' }, { en: '2018', fa: '۲۰۱۸' }],
        answer: 1,
        why: { en: 'The Government introduced it in 2012 to encourage inward investment.', fa: 'دولت آن را در ۲۰۱۲ برای جذب سرمایهٔ خارجی راه‌اندازی کرد.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_IE: CountryProfile = {
  strengths: [
    {
      en: 'English-speaking EU member: Irish citizenship opens the whole EU, and dual citizenship is allowed.',
      fa: 'کشوری انگلیسی‌زبان و عضو اتحادیهٔ اروپا: شهروندی ایرلند درِ کل اتحادیه را باز می‌کند و تابعیت دوگانه مجاز است.',
    },
    {
      en: 'Critical Skills permit holders can move to Stamp 4 after 2 years, and their partners can work.',
      fa: 'دارندگان مجوز مهارت‌های حیاتی پس از ۲ سال به Stamp 4 می‌رسند و همسرشان هم اجازهٔ کار دارد.',
    },
    {
      en: 'STEP needs only EUR 50,000 and no language test, with the family included in one EUR 350 fee.',
      fa: 'STEP فقط ۵۰٬۰۰۰ یورو می‌خواهد و آزمون زبان ندارد، و خانواده با یک هزینهٔ ۳۵۰ یورویی همراه می‌شود.',
    },
    {
      en: 'Among the most peaceful countries (GPI rank 5) with very high human development (HDI rank 11).',
      fa: 'از صلح‌آمیزترین کشورها (رتبهٔ ۵ شاخص صلح جهانی) با توسعهٔ انسانی بسیار بالا (رتبهٔ ۱۱ در HDI).',
    },
  ],
  weaknesses: [
    {
      en: 'STEP is judged against a high-potential start-up bar (10 jobs, EUR 1m sales in 3 years) with no appeal.',
      fa: 'STEP با معیار استارتاپ پرپتانسیل (۱۰ شغل و یک میلیون یورو فروش در ۳ سال) سنجیده می‌شود و اعتراض ندارد.',
    },
    {
      en: 'Study years on Stamp 2 do not count toward citizenship.',
      fa: 'سال‌های تحصیل با Stamp 2 در شهروندی حساب نمی‌شوند.',
    },
    {
      en: 'The investor route closed in 2023; there is no passive-investment residence.',
      fa: 'مسیر سرمایه‌گذاری در ۲۰۲۳ بسته شد و اقامت از راه سرمایه‌گذاری منفعل وجود ندارد.',
    },
    {
      en: 'Outside the Critical Skills list, an employer must pay at least EUR 68,911 for the fast permit.',
      fa: 'برای شغل‌های خارج از فهرست مهارت‌های حیاتی، کارفرما باید دست‌کم ۶۸٬۹۱۱ یورو بپردازد تا مجوز سریع صادر شود.',
    },
  ],
  indicators: [
    { key: 'hdi', rank: 11, of: 193, value: 0.949, year: 2023, source: { url: 'https://hdr.undp.org/data-center/human-development-index', checked: '2026-10-27', label: 'UNDP HDR 2025, Table 1 (2023 data)' } },
    { key: 'happiness', rank: 13, year: 2025, source: { url: 'https://data.worldhappiness.report/table', checked: '2026-10-27', label: 'World Happiness Report dashboard, year 2025' } },
    { key: 'peace', rank: 5, of: 163, value: 1.371, year: 2026, source: { url: 'https://www.visionofhumanity.org/wp-content/uploads/2026/06/Global-Peace-Index-2026-A3-map-poster.pdf', checked: '2026-10-27', label: 'Global Peace Index 2026' } },
    { key: 'innovation', rank: 19, of: 139, year: 2026, source: { url: 'https://www.wipo.int/gii-ranking/en/rank', checked: '2026-10-27', label: 'WIPO Global Innovation Index 2026' } },
    { key: 'gdp-per-capita', value: 131_592, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/IRL/indicator/NY.GDP.PCAP.CD?format=json&mrnev=1', checked: '2026-10-27', label: 'World Bank, GDP per capita (current US$)' } },
    { key: 'unemployment', value: 4.63, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/IRL/indicator/SL.UEM.TOTL.ZS?format=json&mrnev=1', checked: '2026-10-27', label: 'World Bank, unemployment (modelled ILO)' } },
  ],
};
