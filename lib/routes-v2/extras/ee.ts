// Estonia: route depth and country profile (spec 2026-10-27).
// Research: docs/research/app-v3/ee.md. Read 2026-10-27.
// Income thresholds are multiples of the subsistence level, EUR 220 a month
// in the 2026 State Budget Act (§ 5 p 5): 4 × = 880, 6 × = 1,320. Re-check
// with the 2027 Budget Act.
import type { CountryProfile, RouteExtras } from '../extras-types';

const CHECKED = '2026-10-27';

const URL = {
  ppaStartup: 'https://www.politsei.ee/en/instructions/residence-permit-for-business/for-start-up-entrepreneurs',
  ppaBusiness: 'https://www.politsei.ee/en/instructions/residence-permit-for-business',
  ppaSole: 'https://www.politsei.ee/en/instructions/residence-permit-for-business/for-sole-proprietors',
  ppaStudy: 'https://www.politsei.ee/en/instructions/residence-permit-for-study',
  ppaStudentGuide: 'https://www.politsei.ee/files/2026-07/student-guide.pdf',
  ppaFees: 'https://www.politsei.ee/en/instructions/state-fee-amounts/residence-permit-and-rights-of-residence',
  ppaVisaFees: 'https://www.politsei.ee/en/instructions/state-fee-amounts/visa-application-and-extending-period-of-stay',
  ppaLongTerm: 'https://www.politsei.ee/en/instructions/residence-permit-for-a-permanent-resident/long-term-resident-s-residence-permit',
  ppaCitizenship: 'https://www.politsei.ee/en/instructions/estonian-citizenship-for-an-adult',
  ppaCitizenshipDocs: 'https://www.politsei.ee/en/instructions/estonian-citizenship-for-an-adult/application',
  vmDVisa: 'https://vm.ee/en/consular-visa-and-travel-information/visa-information/application-long-stay-d-visa',
  vmRestrictions: 'https://vm.ee/en/consular-visa-and-travel-information/visa-information/restrictions-accepting-visa-applications',
  seVisa: 'https://startupestonia.ee/startup-visa/',
  seFounder: 'https://startupestonia.ee/startup-visa/foreign-founder/',
  budget2026: 'https://www.riigiteataja.ee/akt/118122025022',
  businessRegister: 'https://ariregister.rik.ee/eng',
  booking: 'https://broneering.politsei.ee/',
} as const;

const NB_EE = '1ca216ae-6ed6-4492-af71-5752a2a3a2b8';

const CITIZENSHIP_NOTE = {
  en: 'Citizenship after 8 years on a residence permit, the last 5 on a permanent basis, with Estonian B1 and an exam on the Constitution and the Citizenship Act. You must give up your other citizenship.',
  fa: 'تابعیت پس از ۸ سال اقامت که ۵ سال آخرش بلندمدت (دائم) باشد، با زبان استونیایی در سطح B1 و قبولی در آزمون قانون اساسی و قانون تابعیت. باید از تابعیت قبلی خود خارج شوید.',
};

const LONG_TERM = {
  en: 'Long-term resident’s permit after 5 years on a temporary permit, with stable legal income, Estonian health insurance and Estonian at B1.',
  fa: 'اقامت بلندمدت پس از ۵ سال اقامت موقت، با درآمد قانونی پایدار، بیمه‌ی درمانی استونی و زبان استونیایی در سطح B1.',
};

export const EXTRAS_EE: Record<string, RouteExtras> = {
  'ee-startup': {
    funds: [
      {
        key: 'income-founder',
        label: { en: 'Legal income, each founder (4 × subsistence level)', fa: 'درآمد قانونی، هر بنیان‌گذار (۴ برابر حداقل معیشت)' },
        amount: 880,
        currency: 'EUR',
        basis: 'month',
        per: 'founder',
        kind: 'show',
        source: URL.vmDVisa,
      },
      {
        key: 'income-spouse',
        label: { en: 'Spouse, at the D-visa stage', fa: 'همسر، در مرحله‌ی ویزای D' },
        amount: 704,
        currency: 'EUR',
        basis: 'month',
        per: 'spouse',
        kind: 'show',
        source: URL.vmDVisa,
      },
      {
        key: 'd-visa',
        label: { en: 'Long-stay D visa fee', fa: 'هزینه‌ی ویزای بلندمدت D' },
        amount: 120,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: URL.ppaVisaFees,
      },
      {
        key: 'trp-abroad',
        label: { en: 'Residence permit fee, applied for at an embassy', fa: 'هزینه‌ی اقامت، اگر در سفارت درخواست شود' },
        amount: 380,
        currency: 'EUR',
        basis: 'once',
        per: 'founder',
        kind: 'spend',
        source: URL.ppaFees,
      },
      {
        key: 'trp-estonia',
        label: { en: 'Residence permit fee, applied for in Estonia', fa: 'هزینه‌ی اقامت، اگر در استونی درخواست شود' },
        amount: 350,
        currency: 'EUR',
        basis: 'once',
        per: 'founder',
        kind: 'spend',
        source: URL.ppaFees,
      },
    ],
    steps: [
      {
        key: 'self-check',
        title: { en: 'Check that you are a start-up', fa: 'ببینید استارتاپ به حساب می‌آیید یا نه' },
        detail: {
          en: 'Startup Estonia expects a technology-based, innovative, scalable business with an MVP and first traction, owned by an Estonian company no more than 10 years old. Its online eligibility test helps.',
          fa: 'Startup Estonia کسب‌وکاری فناورانه، نوآور و مقیاس‌پذیر می‌خواهد که محصول اولیه (MVP) و نخستین نشانه‌های استقبال بازار را داشته باشد و متعلق به شرکتی استونیایی با عمر حداکثر ۱۰ سال باشد. آزمون آنلاین آن‌ها کمک می‌کند.',
        },
        link: URL.seVisa,
      },
      {
        key: 'committee',
        title: { en: 'Apply to the Startup Committee', fa: 'درخواست به کمیته‌ی استارتاپ' },
        detail: {
          en: 'Fill out the start-up code application. The committee, made up of people from the Estonian start-up community, decides within 10 working days and sends a letter with a unique code.',
          fa: 'فرم درخواست کد استارتاپی را پر کنید. کمیته که از فعالان جامعه‌ی استارتاپی استونی تشکیل شده، ظرف ۱۰ روز کاری تصمیم می‌گیرد و نامه‌ای با یک کد اختصاصی می‌فرستد.',
        },
        takes: { en: 'Up to 10 working days', fa: 'تا ۱۰ روز کاری' },
        link: URL.seFounder,
      },
      {
        key: 'd-visa',
        title: { en: 'Apply for a D visa if you need one', fa: 'اگر لازم است، ویزای D بگیرید' },
        detail: {
          en: 'With the code, apply for a long-stay D visa at an Estonian embassy (up to 365 days). Fee EUR 120.',
          fa: 'با همین کد، در سفارت استونی برای ویزای بلندمدت D (تا ۳۶۵ روز) درخواست دهید. هزینه ۱۲۰ یورو است.',
        },
        link: URL.vmDVisa,
      },
      {
        key: 'company',
        title: { en: 'Register the company and hold shares', fa: 'شرکت را ثبت کنید و سهام‌دار باشید' },
        detail: {
          en: 'The residence permit needs a shareholding in a company in the Estonian Business Register.',
          fa: 'اقامت شرط می‌کند که در شرکتی ثبت‌شده در دفتر ثبت تجاری استونی سهم داشته باشید.',
        },
        link: URL.businessRegister,
      },
      {
        key: 'trp',
        title: { en: 'Apply for the temporary residence permit', fa: 'برای اقامت موقت درخواست دهید' },
        detail: {
          en: 'Submit the application with the committee’s decision and pay the state fee. The PPA decides within 90 days; the card follows within 30 days.',
          fa: 'درخواست را همراه تصمیم کمیته ثبت کنید و هزینه‌ی دولتی را بپردازید. PPA ظرف ۹۰ روز تصمیم می‌گیرد و کارت ظرف ۳۰ روز پس از آن صادر می‌شود.',
        },
        takes: { en: 'Up to 90 days, plus 30 for the card', fa: 'تا ۹۰ روز، به‌علاوه‌ی ۳۰ روز برای کارت' },
        link: URL.booking,
      },
      {
        key: 'settle',
        title: { en: 'Settle and register your residence', fa: 'ساکن شوید و اقامتگاه را ثبت کنید' },
        detail: {
          en: 'After the permit, settle in Estonia and register your address in the Population Register.',
          fa: 'پس از گرفتن اقامت، در استونی ساکن شوید و نشانی خود را در ثبت جمعیت ثبت کنید.',
        },
        link: URL.ppaStartup,
      },
    ],
    documents: [
      {
        key: 'code-application',
        label: { en: 'Start-up evaluation application: personal and company details, business model', fa: 'درخواست ارزیابی استارتاپ: مشخصات فردی و شرکت، مدل کسب‌وکار' },
        stage: 'apply',
      },
      {
        key: 'visa-form',
        label: { en: 'D visa form, photo, passport and travel medical insurance', fa: 'فرم ویزای D، عکس، گذرنامه و بیمه‌ی درمانی سفر' },
        stage: 'visa',
      },
      {
        key: 'visa-funds',
        label: { en: 'Proof of funds for the planned stay', fa: 'مدرک تمکن مالی برای مدت اقامت برنامه‌ریزی‌شده' },
        stage: 'visa',
      },
      {
        key: 'visa-forms-extra',
        label: { en: 'Family and biographical data forms, travel booking', fa: 'فرم‌های اطلاعات خانواده و زندگی‌نامه، رزرو سفر' },
        stage: 'visa',
      },
      {
        key: 'committee-decision',
        label: { en: 'The Startup Committee’s positive decision', fa: 'تصمیم مثبت کمیته‌ی استارتاپ' },
        stage: 'permit',
      },
      {
        key: 'fee-proof',
        label: { en: 'Proof of the state fee payment', fa: 'رسید پرداخت هزینه‌ی دولتی' },
        stage: 'permit',
      },
      {
        key: 'declarations',
        label: { en: 'Signed application confirming income and health insurance', fa: 'فرم درخواست امضاشده که درآمد و بیمه‌ی درمانی را تأیید می‌کند' },
        stage: 'permit',
      },
    ],
    realities: [
      {
        key: 'old-800',
        kind: 'myth',
        title: { en: 'Myth: EUR 800 a month is enough', fa: 'باور نادرست: ماهی ۸۰۰ یورو کافی است' },
        detail: {
          en: 'Startup Estonia’s page still says EUR 800, the old level. In 2026 the legal minimum is EUR 880 (4 × 220), as the PPA and the Foreign Ministry state.',
          fa: 'صفحه‌ی Startup Estonia هنوز ۸۰۰ یورو را می‌گوید که رقم قدیمی است. در سال ۲۰۲۶ حداقل قانونی ۸۸۰ یورو (۴ برابر ۲۲۰) است، همان‌طور که PPA و وزارت خارجه اعلام کرده‌اند.',
        },
        source: URL.vmDVisa,
      },
      {
        key: 'traditional',
        kind: 'challenge',
        title: { en: 'Traditional businesses are filtered out', fa: 'کسب‌وکارهای سنتی کنار گذاشته می‌شوند' },
        detail: {
          en: 'Startup Estonia says restaurants and one-person consultancies will not pass; the committee looks for global growth potential.',
          fa: 'Startup Estonia می‌گوید رستوران و مشاوره‌ی یک‌نفره پذیرفته نمی‌شود؛ کمیته دنبال توان رشد جهانی است.',
        },
        source: URL.seFounder,
      },
      {
        key: 'restricted',
        kind: 'challenge',
        title: { en: 'Closed to Belarusian and most Russian citizens', fa: 'بسته برای شهروندان بلاروس و بیشتر شهروندان روسیه' },
        detail: {
          en: 'Belarusian citizens are not issued visas for business, including start-up business; for Russian citizens the restrictions cover all visa types, with narrow exceptions.',
          fa: 'به شهروندان بلاروس برای کسب‌وکار، از جمله استارتاپ، ویزا داده نمی‌شود؛ برای شهروندان روسیه محدودیت‌ها همه‌ی انواع ویزا را در بر می‌گیرد و استثناها محدود است.',
        },
        source: URL.vmRestrictions,
      },
      {
        key: 'long-permit',
        kind: 'tip',
        title: { en: 'Up to 5 years on the first permit', fa: 'تا ۵ سال با اقامت اول' },
        detail: {
          en: 'The first permit can last up to 5 years, and extensions up to 10 years at a time.',
          fa: 'اقامت اول می‌تواند تا ۵ سال باشد و هر تمدید تا ۱۰ سال.',
        },
        source: URL.ppaStartup,
      },
      {
        key: 'company-first',
        kind: 'tip',
        title: { en: 'Enter on a D visa, then register the company', fa: 'با ویزای D وارد شوید، سپس شرکت را ثبت کنید' },
        detail: {
          en: 'Startup Estonia’s path: get the code, enter on a D visa if you need one, register the company, then apply for the residence permit for business.',
          fa: 'مسیر پیشنهادی Startup Estonia: کد را بگیرید، اگر لازم است با ویزای D وارد شوید، شرکت را ثبت کنید و بعد برای اقامت کسب‌وکار درخواست دهید.',
        },
        source: URL.seFounder,
      },
    ],
    timeline: {
      prAfterYears: 5,
      citizenshipAfterYears: 8,
      dualCitizenship: 'not-allowed',
      language: { en: 'Estonian B1 for the long-term permit and for citizenship.', fa: 'زبان استونیایی در سطح B1 برای اقامت بلندمدت و تابعیت.' },
      note: LONG_TERM,
      source: URL.ppaLongTerm,
    },
    quiz: [
      {
        key: 'committee-time',
        q: { en: 'How long does the Startup Committee take to decide?', fa: 'کمیته‌ی استارتاپ در چه مدتی تصمیم می‌گیرد؟' },
        options: [
          { en: 'Up to 10 working days', fa: 'تا ۱۰ روز کاری' },
          { en: 'Up to 90 days', fa: 'تا ۹۰ روز' },
          { en: 'Up to 6 months', fa: 'تا ۶ ماه' },
        ],
        answer: 0,
        why: { en: 'The PPA and Startup Estonia both give 10 working days.', fa: 'PPA و Startup Estonia هر دو ۱۰ روز کاری اعلام کرده‌اند.' },
      },
      {
        key: 'income',
        q: { en: 'What monthly legal income does each founder need in 2026?', fa: 'در سال ۲۰۲۶ هر بنیان‌گذار چه درآمد قانونی ماهانه‌ای لازم دارد؟' },
        options: [
          { en: 'EUR 800', fa: '۸۰۰ یورو' },
          { en: 'EUR 880', fa: '۸۸۰ یورو' },
          { en: 'EUR 1,320', fa: '۱٬۳۲۰ یورو' },
        ],
        answer: 1,
        why: { en: 'Four times the 2026 subsistence level of EUR 220.', fa: 'چهار برابر حداقل معیشت ۲۲۰ یورویی سال ۲۰۲۶.' },
      },
      {
        key: 'd-visa-fee',
        q: { en: 'What is the state fee for a long-stay D visa?', fa: 'هزینه‌ی دولتی ویزای بلندمدت D چقدر است؟' },
        options: [
          { en: 'EUR 80', fa: '۸۰ یورو' },
          { en: 'EUR 120', fa: '۱۲۰ یورو' },
          { en: 'EUR 380', fa: '۳۸۰ یورو' },
        ],
        answer: 1,
        why: { en: 'The PPA fee table and the Foreign Ministry both list EUR 120.', fa: 'جدول هزینه‌ی PPA و وزارت خارجه هر دو ۱۲۰ یورو را ذکر کرده‌اند.' },
      },
      {
        key: 'permit-length',
        q: { en: 'How long can the first start-up residence permit last?', fa: 'اقامت اول استارتاپی حداکثر چند سال اعتبار دارد؟' },
        options: [
          { en: '1 year', fa: '۱ سال' },
          { en: '2 years', fa: '۲ سال' },
          { en: 'Up to 5 years', fa: 'تا ۵ سال' },
        ],
        answer: 2,
        why: { en: 'The PPA issues the first permit for up to 5 years.', fa: 'PPA اقامت اول را تا ۵ سال صادر می‌کند.' },
      },
      {
        key: 'company-age',
        q: { en: 'How old can the company behind the start-up be?', fa: 'شرکتِ صاحب استارتاپ حداکثر چند سال عمر می‌تواند داشته باشد؟' },
        options: [
          { en: '3 years', fa: '۳ سال' },
          { en: '5 years', fa: '۵ سال' },
          { en: '10 years', fa: '۱۰ سال' },
        ],
        answer: 2,
        why: { en: 'Startup Estonia, citing the Aliens Act, sets no more than 10 years.', fa: 'Startup Estonia با استناد به قانون اتباع خارجی سقف ۱۰ سال را اعلام کرده است.' },
      },
    ],
    media: [
      { notebookId: NB_EE, kind: 'video', title: "A Founder's Guide to the Estonia Startup Visa" },
      { notebookId: NB_EE, kind: 'slides', title: 'Estonia Startup Visa Blueprint' },
      { notebookId: NB_EE, kind: 'slides', title: 'Estonia Digital Blueprint' },
      { notebookId: NB_EE, kind: 'slides', title: 'Estonia Digital OS' },
      { notebookId: NB_EE, kind: 'infographic', title: 'اقامت مجازی و استارتاپی استونی' },
      { notebookId: NB_EE, kind: 'infographic', title: 'نقشه راه کارآفرینی در استونی' },
      { notebookId: NB_EE, kind: 'infographic', title: 'راهنمای هزینه‌های مهاجرت به استونی' },
    ],
  },

  'ee-entrepreneur': {
    funds: [
      {
        key: 'invest-shareholder',
        label: { en: 'Investment in the company’s activities in Estonia (shareholder)', fa: 'سرمایه‌گذاری در فعالیت‌های شرکت در استونی (سهام‌دار)' },
        amount: 65_000,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'invest',
        source: URL.ppaBusiness,
      },
      {
        key: 'invest-sole',
        label: { en: 'Investment in the business in Estonia (sole proprietor, alternative)', fa: 'سرمایه‌گذاری در کسب‌وکار در استونی (مالک انفرادی، مسیر جایگزین)' },
        amount: 16_000,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'invest',
        source: URL.ppaSole,
      },
      {
        key: 'income',
        label: { en: 'Legal income (6 × subsistence level), shareholder or sole proprietor', fa: 'درآمد قانونی (۶ برابر حداقل معیشت)، سهام‌دار یا مالک انفرادی' },
        amount: 1_320,
        currency: 'EUR',
        basis: 'month',
        per: 'person',
        kind: 'show',
        source: URL.budget2026,
      },
      {
        key: 'fee-abroad',
        label: { en: 'Residence permit fee, at an embassy', fa: 'هزینه‌ی اقامت، در سفارت' },
        amount: 380,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: URL.ppaFees,
      },
      {
        key: 'fee-estonia',
        label: { en: 'Residence permit fee, in Estonia', fa: 'هزینه‌ی اقامت، در استونی' },
        amount: 350,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: URL.ppaFees,
      },
    ],
    steps: [
      {
        key: 'company',
        title: { en: 'Register the company or sole proprietorship', fa: 'شرکت یا کسب‌وکار انفرادی را ثبت کنید' },
        detail: { en: 'It must be in the Estonian Business Register.', fa: 'باید در دفتر ثبت تجاری استونی ثبت شده باشد.' },
        link: URL.businessRegister,
      },
      {
        key: 'invest',
        title: { en: 'Make the investment in Estonia', fa: 'سرمایه‌گذاری را در استونی انجام دهید' },
        detail: {
          en: 'At least EUR 65,000 invested in the company’s activities in Estonia as a shareholder, or EUR 16,000 in your business as a sole proprietor.',
          fa: 'به‌عنوان سهام‌دار دست‌کم ۶۵٬۰۰۰ یورو در فعالیت‌های شرکت در استونی، یا به‌عنوان مالک انفرادی ۱۶٬۰۰۰ یورو در کسب‌وکار خود سرمایه‌گذاری کنید.',
        },
        link: URL.ppaBusiness,
      },
      {
        key: 'plan',
        title: { en: 'Write the business plan', fa: 'طرح کسب‌وکار را بنویسید' },
        detail: {
          en: 'In Estonian or English: company details, the idea, forecasts for the next 2 financial years, CVs, and the business reason for settling in Estonia.',
          fa: 'به استونیایی یا انگلیسی: مشخصات شرکت، ایده، پیش‌بینی مالی ۲ سال مالی آینده، رزومه‌ها و دلیل کاری اقامت در استونی.',
        },
        link: URL.ppaBusiness,
      },
      {
        key: 'apply',
        title: { en: 'Apply and pay the state fee', fa: 'درخواست دهید و هزینه‌ی دولتی را بپردازید' },
        detail: {
          en: 'At a PPA service office (book ahead) or an Estonian embassy. Decision within 90 days, card within 30 more.',
          fa: 'در یکی از دفاتر خدمات PPA (با نوبت قبلی) یا سفارت استونی. تصمیم ظرف ۹۰ روز و کارت ظرف ۳۰ روز پس از آن.',
        },
        takes: { en: 'Up to 90 days, plus 30 for the card', fa: 'تا ۹۰ روز، به‌علاوه‌ی ۳۰ روز برای کارت' },
        link: URL.booking,
      },
      {
        key: 'settle',
        title: { en: 'Settle and register your residence', fa: 'ساکن شوید و اقامتگاه را ثبت کنید' },
        detail: { en: 'Register your address in the Population Register after the permit.', fa: 'پس از گرفتن اقامت، نشانی خود را در ثبت جمعیت ثبت کنید.' },
        link: URL.ppaBusiness,
      },
    ],
    documents: [
      {
        key: 'plan',
        label: { en: 'Business plan in Estonian or English', fa: 'طرح کسب‌وکار به استونیایی یا انگلیسی' },
        note: {
          en: 'Company details, business idea, 2-year financial forecast, CVs, reason for settling in Estonia.',
          fa: 'مشخصات شرکت، ایده‌ی کسب‌وکار، پیش‌بینی مالی ۲ ساله، رزومه‌ها و دلیل اقامت در استونی.',
        },
        stage: 'apply',
      },
      { key: 'investment', label: { en: 'Proof of the investment in Estonia', fa: 'مدرک سرمایه‌گذاری در استونی' }, stage: 'apply' },
      { key: 'fee', label: { en: 'Proof of the state fee payment', fa: 'رسید پرداخت هزینه‌ی دولتی' }, stage: 'apply' },
      {
        key: 'declarations',
        label: { en: 'Signed application confirming income and health insurance', fa: 'فرم درخواست امضاشده که درآمد و بیمه‌ی درمانی را تأیید می‌کند' },
        stage: 'apply',
      },
    ],
    realities: [
      {
        key: 'invested-not-held',
        kind: 'challenge',
        title: { en: 'The money must be invested, not just held', fa: 'پول باید سرمایه‌گذاری شود، نه فقط نگه داشته شود' },
        detail: {
          en: 'The PPA asks for EUR 65,000 invested in the company’s activities in Estonia.',
          fa: 'PPA شرط می‌کند ۶۵٬۰۰۰ یورو در فعالیت‌های شرکت در استونی سرمایه‌گذاری شده باشد.',
        },
        source: URL.ppaBusiness,
      },
      {
        key: 'sole',
        kind: 'tip',
        title: { en: 'Sole proprietors need far less capital', fa: 'مالک انفرادی سرمایه‌ی بسیار کمتری لازم دارد' },
        detail: {
          en: 'A sole proprietor needs EUR 16,000 invested, but the same income: 6 × the subsistence level.',
          fa: 'مالک انفرادی به ۱۶٬۰۰۰ یورو سرمایه‌گذاری نیاز دارد، اما شرط درآمد همان است: ۶ برابر حداقل معیشت.',
        },
        source: URL.ppaSole,
      },
      {
        key: 'income-moves',
        kind: 'challenge',
        title: { en: 'The income threshold changes every year', fa: 'آستانه‌ی درآمد هر سال تغییر می‌کند' },
        detail: {
          en: 'It is a multiple of the subsistence level set in each year’s State Budget Act: EUR 220 in 2026, so EUR 1,320 a month.',
          fa: 'این آستانه ضریبی از حداقل معیشت است که در قانون بودجه‌ی هر سال تعیین می‌شود: ۲۲۰ یورو در ۲۰۲۶، یعنی ماهی ۱٬۳۲۰ یورو.',
        },
        source: URL.budget2026,
      },
      {
        key: 'dual',
        kind: 'challenge',
        title: { en: 'Citizenship means giving up your passport', fa: 'تابعیت یعنی کنار گذاشتن گذرنامه‌ی قبلی' },
        detail: {
          en: 'Applicants must prove release from their other citizenship.',
          fa: 'متقاضی باید ثابت کند از تابعیت قبلی خود خارج شده است.',
        },
        source: URL.ppaCitizenshipDocs,
      },
    ],
    timeline: {
      prAfterYears: 5,
      citizenshipAfterYears: 8,
      dualCitizenship: 'not-allowed',
      language: { en: 'Estonian B1 for the long-term permit and for citizenship.', fa: 'زبان استونیایی در سطح B1 برای اقامت بلندمدت و تابعیت.' },
      note: LONG_TERM,
      source: URL.ppaLongTerm,
    },
    quiz: [
      {
        key: 'shareholder',
        q: { en: 'How much must a shareholder invest in Estonia?', fa: 'سهام‌دار چقدر باید در استونی سرمایه‌گذاری کند؟' },
        options: [
          { en: 'EUR 16,000', fa: '۱۶٬۰۰۰ یورو' },
          { en: 'EUR 65,000', fa: '۶۵٬۰۰۰ یورو' },
          { en: 'EUR 100,000', fa: '۱۰۰٬۰۰۰ یورو' },
        ],
        answer: 1,
        why: { en: 'The PPA sets at least EUR 65,000 in the company’s activities in Estonia.', fa: 'PPA دست‌کم ۶۵٬۰۰۰ یورو در فعالیت‌های شرکت در استونی تعیین کرده است.' },
      },
      {
        key: 'sole',
        q: { en: 'And a sole proprietor?', fa: 'و مالک انفرادی؟' },
        options: [
          { en: 'EUR 16,000', fa: '۱۶٬۰۰۰ یورو' },
          { en: 'EUR 35,000', fa: '۳۵٬۰۰۰ یورو' },
          { en: 'EUR 65,000', fa: '۶۵٬۰۰۰ یورو' },
        ],
        answer: 0,
        why: { en: 'The PPA sets at least EUR 16,000 for a sole proprietor.', fa: 'PPA برای مالک انفرادی دست‌کم ۱۶٬۰۰۰ یورو تعیین کرده است.' },
      },
      {
        key: 'income',
        q: { en: 'What monthly income is required in 2026?', fa: 'در سال ۲۰۲۶ چه درآمد ماهانه‌ای لازم است؟' },
        options: [
          { en: 'EUR 880', fa: '۸۸۰ یورو' },
          { en: 'EUR 1,320', fa: '۱٬۳۲۰ یورو' },
          { en: 'EUR 2,000', fa: '۲٬۰۰۰ یورو' },
        ],
        answer: 1,
        why: { en: 'Six times the 2026 subsistence level of EUR 220.', fa: 'شش برابر حداقل معیشت ۲۲۰ یورویی سال ۲۰۲۶.' },
      },
      {
        key: 'forecast',
        q: { en: 'How many years of financial forecast does the business plan need?', fa: 'طرح کسب‌وکار پیش‌بینی مالی چند سال را می‌خواهد؟' },
        options: [
          { en: '1', fa: '۱' },
          { en: '2', fa: '۲' },
          { en: '5', fa: '۵' },
        ],
        answer: 1,
        why: { en: 'The PPA asks for forecasts for the next 2 financial years.', fa: 'PPA پیش‌بینی ۲ سال مالی آینده را می‌خواهد.' },
      },
      {
        key: 'extension',
        q: { en: 'How long can an extension last?', fa: 'هر تمدید حداکثر چقدر است؟' },
        options: [
          { en: '1 year', fa: '۱ سال' },
          { en: '5 years', fa: '۵ سال' },
          { en: 'Up to 10 years', fa: 'تا ۱۰ سال' },
        ],
        answer: 2,
        why: { en: 'The PPA extends business permits up to 10 years at a time.', fa: 'PPA اقامت کسب‌وکار را هر بار تا ۱۰ سال تمدید می‌کند.' },
      },
    ],
    media: [
      { notebookId: NB_EE, kind: 'infographic', title: 'نقشه راه کارآفرینی در استونی' },
      { notebookId: NB_EE, kind: 'infographic', title: 'راهنمای هزینه‌های مهاجرت به استونی' },
    ],
  },

  'ee-study': {
    funds: [
      {
        key: 'income',
        label: { en: 'Legal income (4 × subsistence level)', fa: 'درآمد قانونی (۴ برابر حداقل معیشت)' },
        amount: 880,
        currency: 'EUR',
        basis: 'month',
        per: 'person',
        kind: 'show',
        source: URL.ppaStudentGuide,
      },
      {
        key: 'd-visa',
        label: { en: 'Long-stay D visa fee', fa: 'هزینه‌ی ویزای بلندمدت D' },
        amount: 120,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: URL.ppaStudentGuide,
      },
      {
        key: 'trp-estonia',
        label: { en: 'Residence permit fee, in Estonia', fa: 'هزینه‌ی اقامت، در استونی' },
        amount: 225,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: URL.ppaStudentGuide,
      },
      {
        key: 'trp-abroad',
        label: { en: 'Residence permit fee, at an embassy', fa: 'هزینه‌ی اقامت، در سفارت' },
        amount: 255,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: URL.ppaFees,
      },
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get admitted', fa: 'پذیرش بگیرید' },
        detail: { en: 'The school confirms your admission.', fa: 'مؤسسه‌ی آموزشی پذیرش شما را تأیید می‌کند.' },
        link: URL.ppaStudy,
      },
      {
        key: 'd-visa',
        title: { en: 'Apply for a D visa at an embassy', fa: 'در سفارت برای ویزای D درخواست دهید' },
        detail: {
          en: 'Book an appointment at an Estonian embassy and apply in person. Fee EUR 120. Processing can take up to 30 calendar days.',
          fa: 'در سفارت استونی نوبت بگیرید و حضوری درخواست دهید. هزینه ۱۲۰ یورو است و رسیدگی تا ۳۰ روز تقویمی طول می‌کشد.',
        },
        takes: { en: 'Up to 30 calendar days', fa: 'تا ۳۰ روز تقویمی' },
        link: URL.vmDVisa,
      },
      {
        key: 'book',
        title: { en: 'Book a PPA appointment for the residence permit', fa: 'برای اقامت در PPA نوبت بگیرید' },
        detail: {
          en: 'If your studies last over a year, apply for the residence permit for study. Appointments open up to 3 months ahead and fill quickly.',
          fa: 'اگر تحصیلتان بیش از یک سال طول می‌کشد، برای اقامت تحصیلی درخواست دهید. نوبت‌ها تا ۳ ماه جلوتر باز می‌شوند و زود پر می‌شوند.',
        },
        link: URL.booking,
      },
      {
        key: 'apply',
        title: { en: 'Submit at the service office and pay EUR 225', fa: 'در دفتر خدمات درخواست را ثبت کنید و ۲۲۵ یورو بپردازید' },
        detail: {
          en: 'Photo and fingerprints are taken at the office. Decision within 90 days, card within 30 more.',
          fa: 'عکس و اثر انگشت در همان دفتر گرفته می‌شود. تصمیم ظرف ۹۰ روز و کارت ظرف ۳۰ روز پس از آن.',
        },
        takes: { en: 'Up to 90 days, plus 30 for the card', fa: 'تا ۹۰ روز، به‌علاوه‌ی ۳۰ روز برای کارت' },
        link: URL.ppaStudentGuide,
      },
      {
        key: 'register',
        title: { en: 'Register your residence within a month', fa: 'ظرف یک ماه اقامتگاه را ثبت کنید' },
        detail: {
          en: 'Register your address in the Population Register within a month of the permit.',
          fa: 'ظرف یک ماه پس از صدور اقامت، نشانی خود را در ثبت جمعیت ثبت کنید.',
        },
        link: URL.ppaStudentGuide,
      },
    ],
    documents: [
      { key: 'acceptance', label: { en: 'Acceptance letter', fa: 'نامه‌ی پذیرش' }, stage: 'visa' },
      {
        key: 'visa-basics',
        label: { en: 'Signed visa form, colour photo, passport', fa: 'فرم ویزای امضاشده، عکس رنگی، گذرنامه' },
        stage: 'visa',
      },
      {
        key: 'insurance',
        label: { en: 'Medical insurance for the whole stay', fa: 'بیمه‌ی درمانی برای کل مدت اقامت' },
        stage: 'visa',
      },
      {
        key: 'bank',
        label: { en: 'Bank statements for the last 3 months, a sponsor letter or a scholarship letter', fa: 'صورت‌حساب بانکی ۳ ماه گذشته، نامه‌ی حامی مالی یا نامه‌ی بورسیه' },
        stage: 'visa',
      },
      {
        key: 'forms',
        label: { en: 'Family data, additional form, biographical data, travel booking', fa: 'فرم اطلاعات خانواده، فرم تکمیلی، اطلاعات زندگی‌نامه، رزرو سفر' },
        stage: 'visa',
      },
      {
        key: 'criminal-record',
        label: { en: 'Criminal record certificate from each country you lived in for 3+ months in the last 3 years', fa: 'گواهی عدم سوءپیشینه از هر کشوری که در ۳ سال گذشته دست‌کم ۳ ماه پیاپی در آن زندگی کرده‌اید' },
        note: { en: 'Issued within 6 months before arrival if you apply in Estonia.', fa: 'اگر در استونی درخواست می‌دهید، باید در ۶ ماه پیش از ورود صادر شده باشد.' },
        stage: 'permit',
      },
      {
        key: 'invitation',
        label: { en: 'Invitation from the school (usually sent by the school to the PPA)', fa: 'دعوت‌نامه‌ی مؤسسه (معمولاً خود مؤسسه آن را برای PPA می‌فرستد)' },
        stage: 'permit',
      },
    ],
    realities: [
      {
        key: 'work',
        kind: 'tip',
        title: { en: 'You can work while you study', fa: 'در دوران تحصیل می‌توانید کار کنید' },
        detail: {
          en: 'Allowed as long as the job does not interfere with your studies and you stay a full-time student.',
          fa: 'به شرط آنکه کار مانع تحصیل نشود و دانشجوی تمام‌وقت بمانید.',
        },
        source: URL.ppaStudy,
      },
      {
        key: 'thirty-days',
        kind: 'challenge',
        title: { en: 'Falling behind ends the permit', fa: 'عقب افتادن از درس اقامت را تمام می‌کند' },
        detail: {
          en: 'A study permit ends automatically 30 days after you fall behind or interrupt your studies.',
          fa: 'اقامت تحصیلی ۳۰ روز پس از عقب افتادن از درس یا وقفه در تحصیل خودبه‌خود پایان می‌یابد.',
        },
        source: URL.ppaStudentGuide,
      },
      {
        key: 'book-early',
        kind: 'tip',
        title: { en: 'Book the PPA appointment early', fa: 'نوبت PPA را زود بگیرید' },
        detail: {
          en: 'Thousands of students apply each year and the calendar fills quickly; slots open 3 months ahead.',
          fa: 'هر سال هزاران دانشجو درخواست می‌دهند و تقویم زود پر می‌شود؛ نوبت‌ها ۳ ماه جلوتر باز می‌شوند.',
        },
        source: URL.ppaStudentGuide,
      },
      {
        key: 'russia',
        kind: 'challenge',
        title: { en: 'Closed to most Russian citizens', fa: 'بسته برای بیشتر شهروندان روسیه' },
        detail: {
          en: 'Estonia’s visa restrictions for Russian citizens cover all visa types, with narrow exceptions.',
          fa: 'محدودیت‌های ویزای استونی برای شهروندان روسیه همه‌ی انواع ویزا را در بر می‌گیرد و استثناها محدود است.',
        },
        source: URL.vmRestrictions,
      },
    ],
    timeline: {
      prAfterYears: 5,
      citizenshipAfterYears: 8,
      dualCitizenship: 'not-allowed',
      language: { en: 'Estonian B1 for the long-term permit and for citizenship; not needed if you studied in Estonian.', fa: 'زبان استونیایی در سطح B1 برای اقامت بلندمدت و تابعیت؛ اگر به زبان استونیایی تحصیل کرده باشید لازم نیست.' },
      note: LONG_TERM,
      source: URL.ppaLongTerm,
    },
    quiz: [
      {
        key: 'income',
        q: { en: 'What monthly legal income must a student declare in 2026?', fa: 'در سال ۲۰۲۶ دانشجو چه درآمد قانونی ماهانه‌ای باید اعلام کند؟' },
        options: [
          { en: 'EUR 600', fa: '۶۰۰ یورو' },
          { en: 'EUR 800', fa: '۸۰۰ یورو' },
          { en: 'EUR 880', fa: '۸۸۰ یورو' },
        ],
        answer: 2,
        why: { en: 'The PPA student guide of July 2026 gives EUR 880 a month.', fa: 'راهنمای دانشجویی PPA (ژوئیه‌ی ۲۰۲۶) ماهی ۸۸۰ یورو را اعلام کرده است.' },
      },
      {
        key: 'fee',
        q: { en: 'What does the residence permit cost when you apply in Estonia?', fa: 'اگر در استونی درخواست دهید، هزینه‌ی اقامت چقدر است؟' },
        options: [
          { en: 'EUR 120', fa: '۱۲۰ یورو' },
          { en: 'EUR 225', fa: '۲۲۵ یورو' },
          { en: 'EUR 380', fa: '۳۸۰ یورو' },
        ],
        answer: 1,
        why: { en: 'The PPA charges EUR 225 for a temporary residence permit in Estonia; EUR 120 is the D visa.', fa: 'PPA برای اقامت موقت در استونی ۲۲۵ یورو می‌گیرد؛ ۱۲۰ یورو هزینه‌ی ویزای D است.' },
      },
      {
        key: 'when-trp',
        q: { en: 'When do you need a residence permit instead of only a D visa?', fa: 'چه زمانی به‌جای ویزای D به اقامت نیاز دارید؟' },
        options: [
          { en: 'When studies last longer than a year', fa: 'وقتی تحصیل بیش از یک سال طول بکشد' },
          { en: 'Only for PhD students', fa: 'فقط برای دانشجوی دکتری' },
          { en: 'Never', fa: 'هیچ‌وقت' },
        ],
        answer: 0,
        why: { en: 'The PPA student guide says so.', fa: 'راهنمای دانشجویی PPA همین را می‌گوید.' },
      },
      {
        key: 'interrupt',
        q: { en: 'What happens if you interrupt your studies?', fa: 'اگر تحصیل را متوقف کنید چه می‌شود؟' },
        options: [
          { en: 'Nothing until the card expires', fa: 'تا پایان اعتبار کارت اتفاقی نمی‌افتد' },
          { en: 'The permit ends 30 days later', fa: 'اقامت ۳۰ روز بعد پایان می‌یابد' },
          { en: 'You get 1 year to find work', fa: '۱ سال برای پیدا کردن کار فرصت دارید' },
        ],
        answer: 1,
        why: { en: 'By law the study permit ends 30 days after you interrupt or fall behind.', fa: 'طبق قانون، اقامت تحصیلی ۳۰ روز پس از توقف یا عقب افتادن از درس پایان می‌یابد.' },
      },
      {
        key: 'long-term',
        q: { en: 'What do you need for long-term residence?', fa: 'برای اقامت بلندمدت چه لازم است؟' },
        options: [
          { en: '3 years and English', fa: '۳ سال و زبان انگلیسی' },
          { en: '5 years on a temporary permit and Estonian B1', fa: '۵ سال اقامت موقت و استونیایی B1' },
          { en: '10 years and no language', fa: '۱۰ سال بدون شرط زبان' },
        ],
        answer: 1,
        why: { en: 'The PPA asks for 5 years on a temporary permit and Estonian at B1.', fa: 'PPA ۵ سال اقامت موقت و زبان استونیایی B1 می‌خواهد.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_EE: CountryProfile = {
  strengths: [
    {
      en: 'Low state fees and a low income bar: EUR 880 a month for founders and students in 2026.',
      fa: 'هزینه‌های دولتی کم و آستانه‌ی درآمدی پایین: ماهی ۸۸۰ یورو برای بنیان‌گذار و دانشجو در ۲۰۲۶.',
    },
    {
      en: 'Fast start-up screening: the Startup Committee decides within 10 working days.',
      fa: 'ارزیابی سریع استارتاپ: کمیته ظرف ۱۰ روز کاری تصمیم می‌گیرد.',
    },
    {
      en: 'Long permits: up to 5 years at first, up to 10 years per extension.',
      fa: 'اقامت‌های طولانی: اول تا ۵ سال و هر تمدید تا ۱۰ سال.',
    },
    {
      en: 'Safe: 25th of 163 in the Global Peace Index 2026.',
      fa: 'امن: رتبه‌ی ۲۵ از ۱۶۳ در شاخص جهانی صلح ۲۰۲۶.',
    },
  ],
  weaknesses: [
    {
      en: 'No dual citizenship: you must give up your other passport.',
      fa: 'تابعیت دوگانه ممنوع است: باید گذرنامه‌ی قبلی را کنار بگذارید.',
    },
    {
      en: 'Estonian B1 is required for long-term residence and citizenship.',
      fa: 'زبان استونیایی در سطح B1 برای اقامت بلندمدت و تابعیت لازم است.',
    },
    {
      en: 'Lower incomes than the Nordics: GDP per head about USD 34,400 in 2025, with unemployment about 8.3%.',
      fa: 'درآمد پایین‌تر از کشورهای شمال اروپا: تولید سرانه حدود ۳۴٬۴۰۰ دلار در ۲۰۲۵ و بیکاری حدود ۸٫۳ درصد.',
    },
    {
      en: 'Closed to Belarusian and most Russian applicants.',
      fa: 'بسته برای متقاضیان بلاروسی و بیشتر متقاضیان روسی.',
    },
  ],
  indicators: [
    { key: 'hdi', rank: 36, of: 193, value: 0.905, year: 2025, source: { url: 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Composite_indices_complete_time_series.csv', checked: CHECKED, label: 'UNDP HDR 2025 (2023 data)' } },
    { key: 'happiness', rank: 46, of: 147, year: 2026, source: { url: 'https://data.worldhappiness.report/table', checked: CHECKED, label: 'World Happiness Report 2026' } },
    { key: 'peace', rank: 25, of: 163, year: 2026, source: { url: 'https://www.visionofhumanity.org/maps/', checked: CHECKED, label: 'Global Peace Index 2026' } },
    { key: 'gdp-per-capita', value: 34418, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/EST/indicator/NY.GDP.PCAP.CD?format=json&mrnev=1', checked: CHECKED, label: 'World Bank' } },
    { key: 'unemployment', value: 8.3, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/EST/indicator/SL.UEM.TOTL.ZS?format=json&mrnev=1', checked: CHECKED, label: 'World Bank (ILO modelled estimate)' } },
    { key: 'english', rank: 31, of: 123, year: 2025, source: { url: 'https://www.ef.com/wwen/epi/regions/europe/estonia/', checked: CHECKED, label: 'EF EPI 2025' } },
    { key: 'passport', rank: 8, year: 2026, source: { url: 'https://www.henleyglobal.com/passport-index/ranking', checked: CHECKED, label: 'Henley Passport Index 2026 (182 destinations)' } },
  ],
};
