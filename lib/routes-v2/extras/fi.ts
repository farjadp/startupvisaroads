// Finland: route depth and country profile (spec 2026-10-27).
// Research: docs/research/app-v3/fi.md. Read 2026-10-27.
// migri.fi, intermin.fi and valtioneuvosto.fi answer automated readers with a
// Cloudflare challenge, so no Migri figure (income requirement, fees other than
// the start-up e-application, student funds) is used here. Law comes from
// Finlex (Ulkomaalaislaki 301/2004, Kansalaisuuslaki 359/2003), the pending
// reform from HE 216/2026 vp.
import type { CountryProfile, RouteExtras } from '../extras-types';

const CHECKED = '2026-10-27';

const URL = {
  bf: 'https://www.startupinfinland.com/applying',
  aliensAct: 'https://www.finlex.fi/fi/lainsaadanto/2004/301',
  citizenshipAct: 'https://www.finlex.fi/fi/lainsaadanto/2003/359',
  he216: 'https://www.edilex.fi/he/20260216',
  he216Status: 'https://www.eduskunta.fi/valtiopaivaasiat/HE+216/2026',
  enterFinland: 'https://enterfinland.fi',
  ytj: 'https://www.ytj.fi/en',
  dvv: 'https://dvv.fi/en',
} as const;

const NB_STARTUP = '3d61899e-0abf-4dda-b7c0-70edb2b00a1a';
const NB_REFORM = '84fd9670-ad3a-4ae7-9905-eed75a9af13c';

/** Same for every Finnish route: Finlex 359/2003 §§ 13, 18 a and the 2026 amendment 552/2026. */
const CITIZENSHIP_NOTE = {
  en: 'Citizenship after 8 years of residence, or 5 if you prove Finnish or Swedish. From 1 Jan 2027 the law adds knowledge of Finnish society, shown by passing a citizenship test. Finland does not ask you to give up your other citizenship.',
  fa: 'تابعیت پس از ۸ سال اقامت، یا ۵ سال اگر زبان فنلاندی یا سوئدی را ثابت کنید. از ۱ ژانویه‌ی ۲۰۲۷ شرط تازه‌ای هم به قانون اضافه می‌شود: شناخت جامعه‌ی فنلاند که با قبولی در آزمون تابعیت ثابت می‌شود. فنلاند از شما نمی‌خواهد تابعیت قبلی‌تان را کنار بگذارید.',
};

export const EXTRAS_FI: Record<string, RouteExtras> = {
  'fi-startup': {
    funds: [
      {
        key: 'application-fee',
        label: { en: 'Residence permit application, online (each founder applies separately)', fa: 'هزینه‌ی درخواست اقامت، آنلاین (هر بنیان‌گذار جداگانه درخواست می‌دهد)' },
        amount: 650,
        currency: 'EUR',
        basis: 'once',
        per: 'founder',
        kind: 'spend',
        source: URL.he216,
      },
    ],
    steps: [
      {
        key: 'team',
        title: { en: 'Form the team', fa: 'تیم را تشکیل دهید' },
        detail: {
          en: 'At least two founders who will move to Finland and work full-time in the company, holding at least 60% of it together.',
          fa: 'دست‌کم دو بنیان‌گذار که به فنلاند نقل مکان کنند و تمام‌وقت در شرکت کار کنند و روی هم دست‌کم ۶۰ درصد آن را در اختیار داشته باشند.',
        },
        link: URL.bf,
      },
      {
        key: 'eligibility-statement',
        title: { en: 'Apply for Business Finland’s Eligibility Statement', fa: 'درخواست Eligibility Statement از Business Finland' },
        detail: {
          en: 'One team member applies in Enter Finland for the whole team, as the main contact, attaching passport copies and CVs of every member.',
          fa: 'یکی از اعضای تیم به‌عنوان رابط اصلی، برای کل تیم در Enter Finland درخواست می‌دهد و کپی گذرنامه و رزومه‌ی همه‌ی اعضا را پیوست می‌کند.',
        },
        link: URL.enterFinland,
      },
      {
        key: 'permit-application',
        title: { en: 'Each founder applies to Migri within 4 months', fa: 'هر بنیان‌گذار ظرف ۴ ماه به Migri درخواست می‌دهد' },
        detail: {
          en: 'After a positive statement, each member applies for the start-up permit in Enter Finland. The statement must be no more than 4 months old when the application is filed.',
          fa: 'پس از نظر مثبت، هر عضو جداگانه در Enter Finland برای اقامت استارتاپی درخواست می‌دهد. هنگام ثبت درخواست نباید بیش از ۴ ماه از صدور نظر Business Finland گذشته باشد.',
        },
        takes: { en: 'About 2 weeks on the fast track; at most 2 months by law', fa: 'حدود ۲ هفته در مسیر سریع؛ طبق قانون حداکثر ۲ ماه' },
        link: URL.enterFinland,
      },
      {
        key: 'identify',
        title: { en: 'Prove your identity at a Finnish mission', fa: 'احراز هویت در نمایندگی فنلاند' },
        detail: {
          en: 'Visit a Finnish embassy or its service provider to show your passport and give fingerprints. The application is processed only after this visit.',
          fa: 'برای نشان دادن گذرنامه و ثبت اثر انگشت به سفارت فنلاند یا شرکت خدماتی طرف قرارداد آن مراجعه کنید. رسیدگی به پرونده پس از همین مراجعه آغاز می‌شود.',
        },
      },
      {
        key: 'move-register',
        title: { en: 'Move and register as a resident', fa: 'نقل مکان و ثبت اقامتگاه' },
        detail: {
          en: 'After the permit, move to Finland and register your address with the Digital and Population Data Services Agency (DVV).',
          fa: 'پس از گرفتن اقامت، به فنلاند بروید و نشانی خود را در اداره‌ی ثبت جمعیت و خدمات دیجیتال (DVV) ثبت کنید.',
        },
        link: URL.dvv,
      },
      {
        key: 'company',
        title: { en: 'Establish the company', fa: 'شرکت را ثبت کنید' },
        detail: {
          en: 'Business Finland expects you to set up the company after you arrive. The law allows a company that is "registered or to be registered" in Finland.',
          fa: 'Business Finland انتظار دارد شرکت را پس از رسیدن به فنلاند ثبت کنید. قانون هم شرکتی را می‌پذیرد که در فنلاند «ثبت شده یا در حال ثبت» باشد.',
        },
        link: URL.ytj,
      },
      {
        key: 'extension',
        title: { en: 'Apply for an extension before the permit ends', fa: 'پیش از پایان اعتبار، برای تمدید اقدام کنید' },
        detail: {
          en: 'The first permit lasts up to 2 years. An extension is granted for the same or similar business if it is profitable or still meets Business Finland’s start-up funding criteria; Migri may ask Business Finland.',
          fa: 'اقامت اول حداکثر ۲ ساله است. تمدید برای ادامه‌ی همان کسب‌وکار یا کسب‌وکاری مشابه داده می‌شود، به شرط آنکه سودآور باشد یا همچنان معیارهای Business Finland برای تأمین مالی استارتاپ‌ها را داشته باشد؛ Migri می‌تواند نظر Business Finland را بپرسد.',
        },
        link: URL.enterFinland,
      },
    ],
    documents: [
      {
        key: 'passports-cvs',
        label: { en: 'Passport copies and CVs of all team members', fa: 'کپی گذرنامه و رزومه‌ی همه‌ی اعضای تیم' },
        note: { en: 'For the Eligibility Statement application.', fa: 'برای درخواست Eligibility Statement.' },
        stage: 'apply',
      },
      {
        key: 'business-plan',
        label: { en: 'A concrete business plan for an innovative, scalable company', fa: 'طرح کسب‌وکار مشخص برای شرکتی نوآور و مقیاس‌پذیر' },
        note: {
          en: 'Business Finland’s own instructions document lists the full contents.',
          fa: 'فهرست کامل محتوا در راهنمای خود Business Finland آمده است.',
        },
        stage: 'apply',
      },
      {
        key: 'statement',
        label: { en: 'Positive Eligibility Statement, no more than 4 months old', fa: 'Eligibility Statement مثبت که بیش از ۴ ماه از صدورش نگذشته باشد' },
        stage: 'permit',
      },
      {
        key: 'means',
        label: { en: 'Proof that your living costs are covered', fa: 'مدرک تأمین هزینه‌ی زندگی' },
        note: {
          en: 'Required by the Aliens Act. Migri sets the amount; its checklist could not be read for this release, so check migri.fi before you apply.',
          fa: 'قانون اتباع خارجی این مدرک را لازم می‌داند. مبلغ را Migri تعیین می‌کند؛ فهرست مدارک Migri برای این نسخه خوانده نشد، پس پیش از درخواست سایت migri.fi را ببینید.',
        },
        stage: 'permit',
      },
      { key: 'passport', label: { en: 'Valid passport, shown in person', fa: 'گذرنامه‌ی معتبر که حضوری نشان داده می‌شود' }, stage: 'permit' },
      {
        key: 'extension-proof',
        label: { en: 'Proof the business is profitable or still meets the start-up criteria', fa: 'مدرک سودآوری کسب‌وکار یا حفظ معیارهای استارتاپی' },
        stage: 'renewal',
      },
    ],
    realities: [
      {
        key: 'reform-pending',
        kind: 'challenge',
        title: { en: 'A reform is in Parliament, not yet in force', fa: 'اصلاحیه در مجلس است و هنوز اجرا نشده' },
        detail: {
          en: 'Government proposal HE 216/2026 would make Business Finland’s assessment part of the paid permit application, decided inside Migri’s system. It is meant to take effect on 12 Jan 2028. Until then the free, separate Eligibility Statement stays.',
          fa: 'لایحه‌ی دولت با شماره‌ی HE 216/2026 ارزیابی Business Finland را بخشی از درخواست اقامتِ پولی می‌کند که در سامانه‌ی Migri انجام می‌شود. قرار است از ۱۲ ژانویه‌ی ۲۰۲۸ اجرا شود. تا آن زمان، Eligibility Statement جداگانه و رایگان سر جایش می‌ماند.',
        },
        source: URL.he216,
      },
      {
        key: 'volume',
        kind: 'challenge',
        title: { en: 'Many teams apply, many apply again', fa: 'تیم‌های زیادی درخواست می‌دهند و بسیاری دوباره' },
        detail: {
          en: 'Business Finland received 1,068 statement applications in 2024 and 746 in 2025; over 40% were repeat applications.',
          fa: 'Business Finland در سال ۲۰۲۴ تعداد ۱٬۰۶۸ و در سال ۲۰۲۵ تعداد ۷۴۶ درخواست ارزیابی دریافت کرد؛ بیش از ۴۰ درصد آن‌ها درخواست تکراری بودند.',
        },
        source: URL.he216,
      },
      {
        key: 'not-every-business',
        kind: 'challenge',
        title: { en: 'Restaurants and consultancies do not qualify', fa: 'رستوران و مشاوره پذیرفته نمی‌شود' },
        detail: {
          en: 'Business Finland excludes businesses without an innovative edge (restaurants, consultancies, import and distribution), Finnish subsidiaries of foreign companies and companies aimed only at the Finnish market.',
          fa: 'Business Finland کسب‌وکارهای بدون مزیت نوآورانه (رستوران، مشاوره، واردات و توزیع)، شعبه‌ی فنلاندی شرکت‌های خارجی و شرکت‌هایی را که فقط بازار فنلاند را هدف گرفته‌اند نمی‌پذیرد.',
        },
        source: URL.bf,
      },
      {
        key: 'register-first',
        kind: 'myth',
        title: { en: 'Myth: you must register the company before applying', fa: 'باور نادرست: باید پیش از درخواست شرکت ثبت کنید' },
        detail: {
          en: 'The law accepts a company that is registered or to be registered in Finland, and Business Finland tells teams to establish it after they arrive.',
          fa: 'قانون شرکتی را که در فنلاند ثبت شده یا در حال ثبت است می‌پذیرد و Business Finland هم به تیم‌ها می‌گوید شرکت را پس از رسیدن ثبت کنند.',
        },
        source: URL.aliensAct,
      },
      {
        key: 'continuous',
        kind: 'tip',
        title: { en: 'Your years count from day one', fa: 'سال‌های اقامت از روز اول حساب می‌شود' },
        detail: {
          en: 'The start-up permit is a continuous permit by law, so time on it counts toward permanent residence and citizenship.',
          fa: 'اقامت استارتاپی طبق قانون از نوع پیوسته (continuous) است؛ پس مدتی که با آن در فنلاند هستید برای اقامت دائم و تابعیت حساب می‌شود.',
        },
        source: URL.aliensAct,
      },
      {
        key: 'remote',
        kind: 'myth',
        title: { en: 'Myth: you can run the start-up from abroad', fa: 'باور نادرست: می‌توان استارتاپ را از خارج اداره کرد' },
        detail: {
          en: 'The permit is for working full-time in a responsible role in the Finnish company, and Business Finland requires the founders to move to Finland.',
          fa: 'این اقامت برای کار تمام‌وقت در جایگاه مسئول در شرکت فنلاندی است و Business Finland نقل مکان بنیان‌گذاران به فنلاند را شرط می‌داند.',
        },
        source: URL.bf,
      },
    ],
    timeline: {
      prAfterYears: 4,
      citizenshipAfterYears: 8,
      dualCitizenship: 'allowed',
      language: {
        en: 'Permanent residence: after 6 years with Finnish or Swedish at YKI level 3 and 2 years’ work history, or after 4 years with EUR 40,000 taxable income in the last tax year. Citizenship: 5 years instead of 8 with Finnish or Swedish.',
        fa: 'اقامت دائم: پس از ۶ سال با زبان فنلاندی یا سوئدی در سطح ۳ آزمون YKI و ۲ سال سابقه‌ی کار، یا پس از ۴ سال با دست‌کم ۴۰٬۰۰۰ یورو درآمد مشمول مالیات در آخرین سال مالیاتی. تابعیت: با زبان فنلاندی یا سوئدی ۵ سال به‌جای ۸ سال.',
      },
      note: CITIZENSHIP_NOTE,
      source: URL.aliensAct,
    },
    quiz: [
      {
        key: 'founders',
        q: { en: 'How many founders does a start-up team need at least?', fa: 'تیم استارتاپ دست‌کم چند بنیان‌گذار لازم دارد؟' },
        options: [
          { en: '1', fa: '۱' },
          { en: '2', fa: '۲' },
          { en: '3', fa: '۳' },
        ],
        answer: 1,
        why: { en: 'Business Finland asks for at least two founders who move to Finland.', fa: 'Business Finland دست‌کم دو بنیان‌گذار می‌خواهد که به فنلاند نقل مکان کنند.' },
      },
      {
        key: 'ownership',
        q: { en: 'What share of the company must the team hold?', fa: 'تیم دست‌کم چند درصد شرکت را باید در اختیار داشته باشد؟' },
        options: [
          { en: 'At least 51%', fa: 'دست‌کم ۵۱ درصد' },
          { en: 'At least 60%', fa: 'دست‌کم ۶۰ درصد' },
          { en: 'At least 75%', fa: 'دست‌کم ۷۵ درصد' },
        ],
        answer: 1,
        why: { en: 'Business Finland states the team must hold at least 60%.', fa: 'Business Finland شرط دست‌کم ۶۰ درصد مالکیت تیم را اعلام کرده است.' },
      },
      {
        key: 'statement-age',
        q: { en: 'How old can the Eligibility Statement be when you file the permit application?', fa: 'هنگام ثبت درخواست اقامت، Eligibility Statement حداکثر چقدر می‌تواند قدیمی باشد؟' },
        options: [
          { en: '1 month', fa: '۱ ماه' },
          { en: '4 months', fa: '۴ ماه' },
          { en: '12 months', fa: '۱۲ ماه' },
        ],
        answer: 1,
        why: { en: 'Section 80 of the Aliens Act sets a maximum of four months.', fa: 'ماده‌ی ۸۰ قانون اتباع خارجی سقف را چهار ماه تعیین کرده است.' },
      },
      {
        key: 'permit-type',
        q: { en: 'What kind of permit is the start-up permit?', fa: 'اقامت استارتاپی از چه نوعی است؟' },
        options: [
          { en: 'Temporary, so the years do not count', fa: 'موقت، پس سال‌هایش حساب نمی‌شود' },
          { en: 'Continuous, so the years count toward permanent residence', fa: 'پیوسته، پس سال‌هایش برای اقامت دائم حساب می‌شود' },
          { en: 'Permanent from the start', fa: 'از ابتدا دائم' },
        ],
        answer: 1,
        why: { en: 'The Aliens Act grants it as a continuous permit.', fa: 'قانون اتباع خارجی آن را به‌صورت اقامت پیوسته صادر می‌کند.' },
      },
      {
        key: 'fast-pr',
        q: { en: 'Which is a 4-year route to permanent residence?', fa: 'کدام گزینه مسیر ۴ ساله به اقامت دائم است؟' },
        options: [
          { en: 'EUR 40,000 taxable income in the last tax year', fa: '۴۰٬۰۰۰ یورو درآمد مشمول مالیات در آخرین سال مالیاتی' },
          { en: 'Owning a company for 4 years', fa: '۴ سال مالکیت شرکت' },
          { en: 'Any Business Finland grant', fa: 'هر نوع کمک مالی Business Finland' },
        ],
        answer: 0,
        why: { en: 'Section 56 a allows permanent residence after 4 years with at least EUR 40,000 income.', fa: 'ماده‌ی ۵۶ الف پس از ۴ سال با دست‌کم ۴۰٬۰۰۰ یورو درآمد اقامت دائم می‌دهد.' },
      },
    ],
    media: [
      { notebookId: NB_STARTUP, kind: 'video', title: "The Finnish Founder's Fork: Startup vs. Entrepreneur Permit" },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'Finnish Business Residency Financial Requirements' },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'Finland Business Permit 2026 Guide' },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'راهنمای هزینه‌های کارآفرینی فنلاند ۲۰۲۶' },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'نقشه راه ویزای استارتاپ فنلاند' },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'راهنمای دریافت ویزای استارتاپ فنلاند' },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'Finnish Startup Visa Process Guide' },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'راهنمای ویزای استارتاپ فنلاند ۲۰۲۶' },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'ویزای استارتاپ فنلاند: نقشه راه ۲۰۲۶' },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'Finland Startup Permit 2026 Roadmap' },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'Finland Startup Permit 2026 Guide' },
      { notebookId: NB_STARTUP, kind: 'infographic', title: 'راهنمای اقامت استارتاپ فنلاند' },
      { notebookId: NB_STARTUP, kind: 'slides', title: 'Finland Startup Visa Roadmap' },
      { notebookId: NB_STARTUP, kind: 'slides', title: 'Finland Startup Blueprint' },
      { notebookId: NB_STARTUP, kind: 'slides', title: 'Nordic Startup Blueprint' },
      { notebookId: NB_STARTUP, kind: 'slides', title: 'The Finland Startup Blueprint' },
      { notebookId: NB_STARTUP, kind: 'slides', title: '2026 Finland Startup Blueprint' },
      { notebookId: NB_STARTUP, kind: 'slides', title: 'Finland Startup Permit Playbook' },
      { notebookId: NB_STARTUP, kind: 'slides', title: 'The Finland Blueprint' },
      { notebookId: NB_REFORM, kind: 'infographic', title: 'معیارهای ویزای استارتاپ فنلاند' },
      { notebookId: NB_REFORM, kind: 'infographic', title: 'آمار و چالش‌های استارتاپ فنلاند' },
      { notebookId: NB_REFORM, kind: 'infographic', title: 'آمار تقاضاهای استارتاپی در فنلاند' },
      { notebookId: NB_REFORM, kind: 'infographic', title: 'نقشه راه اصلاحات اقامت کارآفرینی' },
      { notebookId: NB_REFORM, kind: 'slides', title: 'Finnish Business Residency Redesign' },
    ],
  },

  'fi-self-employed': {
    steps: [
      {
        key: 'register',
        title: { en: 'Register the company in Finland', fa: 'شرکت را در فنلاند ثبت کنید' },
        detail: {
          en: 'Under current law the business must run in a company registered in Finland when you apply.',
          fa: 'طبق قانون فعلی، هنگام درخواست، کسب‌وکار باید در قالب شرکتی ثبت‌شده در فنلاند فعالیت کند.',
        },
        link: URL.ytj,
      },
      {
        key: 'apply',
        title: { en: 'Apply for the entrepreneur permit', fa: 'برای اقامت کارآفرینی درخواست دهید' },
        detail: {
          en: 'Apply in Enter Finland with information on the company, its prospects of profitable business, its resources and its tax and payment record.',
          fa: 'در Enter Finland درخواست دهید و اطلاعات شرکت، چشم‌انداز سودآوری، منابع و وضعیت پرداخت مالیات و عوارض آن را ارائه کنید.',
        },
        link: URL.enterFinland,
      },
      {
        key: 'identify',
        title: { en: 'Prove your identity at a Finnish mission', fa: 'احراز هویت در نمایندگی فنلاند' },
        detail: {
          en: 'If you apply from abroad, visit a Finnish embassy or its service provider with your passport.',
          fa: 'اگر از خارج درخواست می‌دهید، با گذرنامه به سفارت فنلاند یا شرکت خدماتی طرف قرارداد آن مراجعه کنید.',
        },
      },
      {
        key: 'partial-decision',
        title: { en: 'The elinvoimakeskus makes a partial decision', fa: 'تصمیم اولیه‌ی elinvoimakeskus' },
        detail: {
          en: 'The regional elinvoimakeskus (which replaced the ELY Centre) checks the four conditions and whether your living is covered, and sets the permit length and whether it is temporary or continuous.',
          fa: 'مرکز منطقه‌ای elinvoimakeskus (جانشین مرکز ELY) چهار شرط قانونی و تأمین هزینه‌ی زندگی شما را بررسی می‌کند و مدت اقامت و موقت یا پیوسته بودن آن را تعیین می‌کند.',
        },
      },
      {
        key: 'migri',
        title: { en: 'Migri decides', fa: 'تصمیم نهایی Migri' },
        detail: {
          en: 'Migri grants the permit only after a positive partial decision.',
          fa: 'Migri فقط پس از تصمیم اولیه‌ی مثبت، اقامت را صادر می‌کند.',
        },
        link: URL.enterFinland,
      },
      {
        key: 'register-resident',
        title: { en: 'Register as a resident', fa: 'ثبت اقامتگاه' },
        detail: {
          en: 'Register your address in Finland with DVV once you have moved.',
          fa: 'پس از نقل مکان، نشانی خود را در DVV ثبت کنید.',
        },
        link: URL.dvv,
      },
    ],
    documents: [
      {
        key: 'registration',
        label: { en: 'Proof the company is registered in Finland', fa: 'مدرک ثبت شرکت در فنلاند' },
        stage: 'apply',
      },
      {
        key: 'profitability',
        label: { en: 'Information showing the company can run a profitable business', fa: 'اطلاعاتی که توان سودآوری شرکت را نشان دهد' },
        stage: 'apply',
      },
      {
        key: 'resources',
        label: { en: 'Information on the resources to carry out the business', fa: 'اطلاعات منابع لازم برای اجرای کسب‌وکار' },
        stage: 'apply',
      },
      {
        key: 'taxes',
        label: { en: 'Information that taxes and statutory payments are paid', fa: 'اطلاعات پرداخت مالیات و عوارض قانونی' },
        stage: 'apply',
      },
      {
        key: 'means',
        label: { en: 'Proof of how your living is covered', fa: 'مدرک تأمین هزینه‌ی زندگی' },
        note: {
          en: 'Business income; at the start also earned income, start-up funding available to the company or your own funds. Migri’s checklist could not be read for this release.',
          fa: 'درآمد کسب‌وکار؛ در مرحله‌ی آغاز کار، درآمد حاصل از کار، سرمایه‌ی اولیه‌ی در اختیار شرکت یا پول خودتان هم پذیرفته می‌شود. فهرست مدارک Migri برای این نسخه خوانده نشد.',
        },
        stage: 'apply',
      },
    ],
    realities: [
      {
        key: 'refusals',
        kind: 'challenge',
        title: { en: 'Most first applications are refused', fa: 'بیشتر درخواست‌های اول رد می‌شود' },
        detail: {
          en: 'The government’s bill states that over 70% of first entrepreneur permit applications end in a negative decision, and about 40% of those are appealed.',
          fa: 'به گفته‌ی لایحه‌ی دولت، بیش از ۷۰ درصد درخواست‌های اول اقامت کارآفرینی به تصمیم منفی می‌رسد و حدود ۴۰ درصد این تصمیم‌ها به دادگاه اعتراض می‌شود.',
        },
        source: URL.he216,
      },
      {
        key: 'leading-role',
        kind: 'myth',
        title: { en: 'Myth: owning shares is enough', fa: 'باور نادرست: داشتن سهام کافی است' },
        detail: {
          en: 'The permit is for someone who runs the business in a leading position, not a passive owner.',
          fa: 'این اقامت برای کسی است که کسب‌وکار را در جایگاه مدیریتی اداره می‌کند، نه مالکی که فقط سهم دارد.',
        },
        source: URL.aliensAct,
      },
      {
        key: 'taxes',
        kind: 'challenge',
        title: { en: 'Unpaid taxes block the permit', fa: 'بدهی مالیاتی مانع اقامت می‌شود' },
        detail: {
          en: 'The partial decision checks that the business has not seriously neglected its taxes or statutory payments.',
          fa: 'در تصمیم اولیه بررسی می‌شود که کسب‌وکار در پرداخت مالیات و عوارض قانونی کوتاهی جدی نکرده باشد.',
        },
        source: URL.aliensAct,
      },
      {
        key: 'continuous',
        kind: 'tip',
        title: { en: 'Check whether you got a temporary or continuous permit', fa: 'ببینید اقامتتان موقت است یا پیوسته' },
        detail: {
          en: 'The partial decision states which one you get. Permanent residence counts time on a continuous permit.',
          fa: 'تصمیم اولیه نوع اقامت را مشخص می‌کند. برای اقامت دائم، مدت اقامت پیوسته حساب می‌شود.',
        },
        source: URL.aliensAct,
      },
      {
        key: 'reform',
        kind: 'tip',
        title: { en: 'A proposed change: register after the permit', fa: 'تغییر پیشنهادی: ثبت شرکت پس از اقامت' },
        detail: {
          en: 'Under HE 216/2026, a first applicant whose business has not yet started in Finland would not need a registered company to apply, and would register right after the permit. Proposed to take effect on 12 Jan 2028.',
          fa: 'طبق لایحه‌ی HE 216/2026، متقاضی اقامت اولی که هنوز کسب‌وکارش را در فنلاند شروع نکرده، برای درخواست به شرکت ثبت‌شده نیاز ندارد و باید بلافاصله پس از گرفتن اقامت شرکت را ثبت کند. اجرای آن برای ۱۲ ژانویه‌ی ۲۰۲۸ پیشنهاد شده است.',
        },
        source: URL.he216,
      },
    ],
    timeline: {
      prAfterYears: 4,
      citizenshipAfterYears: 8,
      dualCitizenship: 'allowed',
      language: {
        en: 'Permanent residence: after 6 years with Finnish or Swedish at YKI level 3 and 2 years’ work history, or after 4 years with EUR 40,000 taxable income. Only time on a continuous permit counts.',
        fa: 'اقامت دائم: پس از ۶ سال با زبان فنلاندی یا سوئدی در سطح ۳ آزمون YKI و ۲ سال سابقه‌ی کار، یا پس از ۴ سال با ۴۰٬۰۰۰ یورو درآمد مشمول مالیات. فقط مدت اقامت پیوسته حساب می‌شود.',
      },
      note: CITIZENSHIP_NOTE,
      source: URL.aliensAct,
    },
    quiz: [
      {
        key: 'who-decides',
        q: { en: 'Who makes the partial decision on an entrepreneur permit?', fa: 'تصمیم اولیه درباره‌ی اقامت کارآفرینی را چه نهادی می‌گیرد؟' },
        options: [
          { en: 'Business Finland', fa: 'Business Finland' },
          { en: 'The regional elinvoimakeskus', fa: 'مرکز منطقه‌ای elinvoimakeskus' },
          { en: 'The Finnish embassy', fa: 'سفارت فنلاند' },
        ],
        answer: 1,
        why: { en: 'Section 79 a of the Aliens Act gives the partial decision to the elinvoimakeskus.', fa: 'ماده‌ی ۷۹ الف قانون اتباع خارجی تصمیم اولیه را به elinvoimakeskus سپرده است.' },
      },
      {
        key: 'registered',
        q: { en: 'Under current law, must the company be registered in Finland when you apply?', fa: 'طبق قانون فعلی، هنگام درخواست، شرکت باید در فنلاند ثبت شده باشد؟' },
        options: [
          { en: 'Yes', fa: 'بله' },
          { en: 'No, only after arrival', fa: 'نه، فقط پس از رسیدن' },
          { en: 'Only for companies with staff', fa: 'فقط برای شرکت‌های دارای کارمند' },
        ],
        answer: 0,
        why: { en: 'The first condition in section 79 a is a company registered in Finland.', fa: 'نخستین شرط ماده‌ی ۷۹ الف، شرکتِ ثبت‌شده در فنلاند است.' },
      },
      {
        key: 'early-means',
        q: { en: 'At the start, what can cover your living besides business income?', fa: 'در آغاز کار، جز درآمد کسب‌وکار چه چیزی هزینه‌ی زندگی را پوشش می‌دهد؟' },
        options: [
          { en: 'Only a relative’s written promise', fa: 'فقط تعهد کتبی یکی از بستگان' },
          { en: 'Earned income, start-up funding or your own funds', fa: 'درآمد حاصل از کار، سرمایه‌ی اولیه یا پول خودتان' },
          { en: 'Nothing else is accepted', fa: 'هیچ چیز دیگری پذیرفته نمی‌شود' },
        ],
        answer: 1,
        why: { en: 'Section 79 a lists these three for the early stage of the business.', fa: 'ماده‌ی ۷۹ الف همین سه منبع را برای مرحله‌ی آغاز کسب‌وکار نام می‌برد.' },
      },
      {
        key: 'refusal-rate',
        q: { en: 'What share of first entrepreneur permit applications end negative, according to the 2026 bill?', fa: 'به گفته‌ی لایحه‌ی ۲۰۲۶، چه سهمی از درخواست‌های اول اقامت کارآفرینی منفی می‌شود؟' },
        options: [
          { en: 'About 20%', fa: 'حدود ۲۰ درصد' },
          { en: 'About 50%', fa: 'حدود ۵۰ درصد' },
          { en: 'Over 70%', fa: 'بیش از ۷۰ درصد' },
        ],
        answer: 2,
        why: { en: 'HE 216/2026 states that over 70% end in a negative decision.', fa: 'لایحه‌ی HE 216/2026 می‌گوید بیش از ۷۰ درصد به تصمیم منفی می‌رسد.' },
      },
      {
        key: 'reform-date',
        q: { en: 'When is the proposed reform meant to take effect?', fa: 'اصلاحیه‌ی پیشنهادی قرار است از چه تاریخی اجرا شود؟' },
        options: [
          { en: '1 Jan 2027', fa: '۱ ژانویه‌ی ۲۰۲۷' },
          { en: '12 Jan 2028', fa: '۱۲ ژانویه‌ی ۲۰۲۸' },
          { en: 'It is already in force', fa: 'هم‌اکنون اجرا می‌شود' },
        ],
        answer: 1,
        why: { en: 'HE 216/2026 proposes 12 Jan 2028; the bill is still in Parliament.', fa: 'لایحه‌ی HE 216/2026 تاریخ ۱۲ ژانویه‌ی ۲۰۲۸ را پیشنهاد کرده و هنوز در مجلس است.' },
      },
    ],
    media: [
      { notebookId: NB_STARTUP, kind: 'video', title: "The Finnish Founder's Fork: Startup vs. Entrepreneur Permit" },
      { notebookId: NB_STARTUP, kind: 'slides', title: 'The Finnish Business Blueprint' },
      { notebookId: NB_REFORM, kind: 'infographic', title: 'اصلاحات اقامت کارآفرینی فنلاند ۲۰۲۵' },
      { notebookId: NB_REFORM, kind: 'slides', title: 'Finland Entrepreneurial Reform Blueprint' },
    ],
  },

  'fi-study': {
    steps: [
      {
        key: 'admission',
        title: { en: 'Get admitted to a degree programme', fa: 'پذیرش در یک برنامه‌ی تحصیلی بگیرید' },
        detail: {
          en: 'A degree from a Finnish university, or a master’s from a university of applied sciences, is what later opens the degree route to permanent residence.',
          fa: 'مدرک دانشگاهی فنلاند، یا کارشناسی ارشد از دانشگاه علوم کاربردی، همان چیزی است که بعدها مسیر مدرک به اقامت دائم را باز می‌کند.',
        },
      },
      {
        key: 'apply',
        title: { en: 'Apply for the student permit online', fa: 'درخواست اقامت تحصیلی را آنلاین ثبت کنید' },
        detail: { en: 'Apply in Enter Finland and pay the fee there.', fa: 'در Enter Finland درخواست دهید و هزینه را همان‌جا بپردازید.' },
        link: URL.enterFinland,
      },
      {
        key: 'identify',
        title: { en: 'Prove your identity at a Finnish mission', fa: 'احراز هویت در نمایندگی فنلاند' },
        detail: {
          en: 'Visit a Finnish embassy or its service provider with your passport.',
          fa: 'با گذرنامه به سفارت فنلاند یا شرکت خدماتی طرف قرارداد آن مراجعه کنید.',
        },
      },
      {
        key: 'register',
        title: { en: 'Register your address', fa: 'نشانی خود را ثبت کنید' },
        detail: { en: 'Register with DVV after you arrive.', fa: 'پس از رسیدن، در DVV ثبت‌نام کنید.' },
        link: URL.dvv,
      },
      {
        key: 'keep-permit',
        title: { en: 'Keep a permit valid until you graduate', fa: 'تا فارغ‌التحصیلی اقامت معتبر داشته باشید' },
        detail: {
          en: 'The degree route to permanent residence requires a residence permit throughout the degree.',
          fa: 'مسیر مدرک به اقامت دائم شرط می‌کند که در تمام مدت تحصیل اقامت معتبر داشته باشید.',
        },
        link: URL.aliensAct,
      },
    ],
    documents: [
      { key: 'admission', label: { en: 'Letter of admission', fa: 'نامه‌ی پذیرش' }, stage: 'apply' },
      { key: 'passport', label: { en: 'Valid passport, shown in person', fa: 'گذرنامه‌ی معتبر که حضوری نشان داده می‌شود' }, stage: 'apply' },
      {
        key: 'means',
        label: { en: 'Proof of funds in your own account', fa: 'مدرک تمکن مالی در حساب خودتان' },
        note: {
          en: 'Migri sets the amount; its page could not be read for this release, so check migri.fi before you apply.',
          fa: 'مبلغ را Migri تعیین می‌کند؛ صفحه‌ی آن برای این نسخه خوانده نشد، پس پیش از درخواست سایت migri.fi را ببینید.',
        },
        stage: 'apply',
      },
    ],
    realities: [
      {
        key: 'degree-pr',
        kind: 'tip',
        title: { en: 'A Finnish degree can lead straight to permanent residence', fa: 'مدرک فنلاندی می‌تواند مستقیم به اقامت دائم برسد' },
        detail: {
          en: 'With a Finnish university degree (or a master’s from a university of applied sciences) and developing Finnish or Swedish (YKI level 2, or 15 credits of language study), there is no minimum residence period.',
          fa: 'با مدرک دانشگاهی فنلاند (یا کارشناسی ارشد دانشگاه علوم کاربردی) و زبان فنلاندی یا سوئدی در سطح «در حال پیشرفت» (سطح ۲ آزمون YKI یا ۱۵ واحد درس زبان)، حداقل مدت اقامت لازم نیست.',
        },
        source: URL.aliensAct,
      },
      {
        key: 'finish-degree',
        kind: 'challenge',
        title: { en: 'Study years count only if you graduate', fa: 'سال‌های تحصیل فقط با فارغ‌التحصیلی حساب می‌شود' },
        detail: {
          en: 'Time on a student permit counts toward the general permanent residence rule only if you complete the degree it was granted for.',
          fa: 'مدت اقامت تحصیلی فقط وقتی برای قاعده‌ی عمومی اقامت دائم حساب می‌شود که مدرکی را که اقامت برایش صادر شده تمام کنید.',
        },
        source: URL.aliensAct,
      },
      {
        key: 'leaving',
        kind: 'challenge',
        title: { en: 'Long stays abroad after graduation cost you the degree route', fa: 'اقامت طولانی در خارج پس از فارغ‌التحصیلی مسیر مدرک را می‌بندد' },
        detail: {
          en: 'The degree route is refused if, after graduating, you lived outside Finland other than for short periods.',
          fa: 'اگر پس از فارغ‌التحصیلی جز برای مدت‌های کوتاه بیرون از فنلاند زندگی کرده باشید، مسیر مدرک پذیرفته نمی‌شود.',
        },
        source: URL.aliensAct,
      },
    ],
    timeline: {
      prAfterYears: 0,
      citizenshipAfterYears: 8,
      dualCitizenship: 'allowed',
      language: {
        en: 'Degree route to permanent residence: developing Finnish or Swedish (YKI level 2, or 15 credits of language study). Citizenship: 5 years instead of 8 with Finnish or Swedish.',
        fa: 'مسیر مدرک به اقامت دائم: زبان فنلاندی یا سوئدی در سطح «در حال پیشرفت» (سطح ۲ آزمون YKI یا ۱۵ واحد درس زبان). تابعیت: با زبان فنلاندی یا سوئدی ۵ سال به‌جای ۸ سال.',
      },
      note: CITIZENSHIP_NOTE,
      source: URL.aliensAct,
    },
    quiz: [
      {
        key: 'degree-pr-years',
        q: { en: 'With a Finnish master’s, how long must you have lived in Finland to get permanent residence?', fa: 'با کارشناسی ارشد فنلاند، برای اقامت دائم چند سال باید در فنلاند زندگی کرده باشید؟' },
        options: [
          { en: 'No minimum period', fa: 'حداقل مدتی لازم نیست' },
          { en: '4 years', fa: '۴ سال' },
          { en: '6 years', fa: '۶ سال' },
        ],
        answer: 0,
        why: { en: 'Section 56 c sets no residence period, only the degree, language and a valid permit during the degree.', fa: 'ماده‌ی ۵۶ ج مدت اقامت نمی‌خواهد؛ فقط مدرک، زبان و اقامت معتبر در دوره‌ی تحصیل.' },
      },
      {
        key: 'degree-language',
        q: { en: 'Which language level does that route need?', fa: 'این مسیر چه سطحی از زبان می‌خواهد؟' },
        options: [
          { en: 'None', fa: 'هیچ' },
          { en: 'YKI level 2 or 15 credits of Finnish or Swedish', fa: 'سطح ۲ آزمون YKI یا ۱۵ واحد فنلاندی یا سوئدی' },
          { en: 'YKI level 5', fa: 'سطح ۵ آزمون YKI' },
        ],
        answer: 1,
        why: { en: 'Section 56 f defines "developing" skill this way.', fa: 'ماده‌ی ۵۶ و سطح «در حال پیشرفت» را این‌گونه تعریف می‌کند.' },
      },
      {
        key: 'drop-out',
        q: { en: 'Do student years count toward the 6-year rule if you do not graduate?', fa: 'اگر فارغ‌التحصیل نشوید، سال‌های تحصیل برای قاعده‌ی ۶ ساله حساب می‌شود؟' },
        options: [
          { en: 'Yes, in full', fa: 'بله، کامل' },
          { en: 'Half of them', fa: 'نیمی از آن' },
          { en: 'No', fa: 'نه' },
        ],
        answer: 2,
        why: { en: 'Section 56 counts student years only once the degree is completed.', fa: 'ماده‌ی ۵۶ سال‌های تحصیل را فقط پس از تمام کردن مدرک حساب می‌کند.' },
      },
      {
        key: 'citizenship-years',
        q: { en: 'How many years of residence does citizenship need if you prove Finnish or Swedish?', fa: 'اگر زبان فنلاندی یا سوئدی را ثابت کنید، تابعیت چند سال اقامت می‌خواهد؟' },
        options: [
          { en: '3', fa: '۳' },
          { en: '5', fa: '۵' },
          { en: '8', fa: '۸' },
        ],
        answer: 1,
        why: { en: 'Section 18 a of the Citizenship Act shortens 8 years to 5 with the language requirement met.', fa: 'ماده‌ی ۱۸ الف قانون تابعیت با داشتن شرط زبان، ۸ سال را به ۵ سال کاهش می‌دهد.' },
      },
      {
        key: 'test',
        q: { en: 'What does the citizenship law add from 1 Jan 2027?', fa: 'قانون تابعیت از ۱ ژانویه‌ی ۲۰۲۷ چه شرطی اضافه می‌کند؟' },
        options: [
          { en: 'Knowledge of Finnish society, shown by a citizenship test', fa: 'شناخت جامعه‌ی فنلاند با آزمون تابعیت' },
          { en: 'Giving up your other citizenship', fa: 'کنار گذاشتن تابعیت قبلی' },
          { en: 'A Finnish degree', fa: 'مدرک فنلاندی' },
        ],
        answer: 0,
        why: { en: 'Amendment 552/2026 adds the society-knowledge requirement and the citizenship test.', fa: 'اصلاحیه‌ی ۵۵۲/۲۰۲۶ شرط شناخت جامعه و آزمون تابعیت را اضافه می‌کند.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_FI: CountryProfile = {
  strengths: [
    {
      en: 'Ranked happiest country in the World Happiness Report 2026, and 9th most peaceful in the Global Peace Index 2026.',
      fa: 'در گزارش جهانی شادی ۲۰۲۶ شادترین کشور و در شاخص جهانی صلح ۲۰۲۶ نهمین کشور آرام جهان.',
    },
    {
      en: 'The start-up permit is continuous, so time on it counts toward permanent residence and citizenship.',
      fa: 'اقامت استارتاپی از نوع پیوسته است و مدتش برای اقامت دائم و تابعیت حساب می‌شود.',
    },
    {
      en: 'Permanent residence after 4 years with EUR 40,000 income, or right after a Finnish degree.',
      fa: 'اقامت دائم پس از ۴ سال با ۴۰٬۰۰۰ یورو درآمد، یا بلافاصله پس از مدرک دانشگاهی فنلاند.',
    },
    {
      en: 'Dual citizenship is allowed.',
      fa: 'تابعیت دوگانه مجاز است.',
    },
    {
      en: 'Strong English: 12th of 123 in the EF English Proficiency Index 2025.',
      fa: 'سطح بالای انگلیسی: رتبه‌ی ۱۲ از ۱۲۳ در شاخص مهارت انگلیسی EF ۲۰۲۵.',
    },
  ],
  weaknesses: [
    {
      en: 'High unemployment: about 9.5% in 2025 (World Bank).',
      fa: 'بیکاری بالا: حدود ۹٫۵ درصد در سال ۲۰۲۵ (بانک جهانی).',
    },
    {
      en: 'The usual 6-year route to permanent residence and the 5-year route to citizenship both need Finnish or Swedish.',
      fa: 'مسیر معمول ۶ ساله‌ی اقامت دائم و مسیر ۵ ساله‌ی تابعیت هر دو زبان فنلاندی یا سوئدی می‌خواهند.',
    },
    {
      en: 'Entrepreneur permits are hard: over 70% of first applications are refused.',
      fa: 'اقامت کارآفرینی دشوار است: بیش از ۷۰ درصد درخواست‌های اول رد می‌شود.',
    },
    {
      en: 'Start-up rules are being rewritten (HE 216/2026, proposed for 2028), so the process will change.',
      fa: 'قواعد اقامت استارتاپی در حال بازنویسی است (لایحه‌ی HE 216/2026، پیشنهادشده برای ۲۰۲۸) و روند تغییر خواهد کرد.',
    },
  ],
  indicators: [
    { key: 'hdi', rank: 12, of: 193, value: 0.948, year: 2025, source: { url: 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Composite_indices_complete_time_series.csv', checked: CHECKED, label: 'UNDP HDR 2025 (2023 data)' } },
    { key: 'happiness', rank: 1, of: 147, year: 2026, source: { url: 'https://data.worldhappiness.report/table', checked: CHECKED, label: 'World Happiness Report 2026' } },
    { key: 'peace', rank: 9, of: 163, year: 2026, source: { url: 'https://www.visionofhumanity.org/maps/', checked: CHECKED, label: 'Global Peace Index 2026' } },
    { key: 'gdp-per-capita', value: 56149, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/FIN/indicator/NY.GDP.PCAP.CD?format=json&mrnev=1', checked: CHECKED, label: 'World Bank' } },
    { key: 'unemployment', value: 9.5, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/FIN/indicator/SL.UEM.TOTL.ZS?format=json&mrnev=1', checked: CHECKED, label: 'World Bank (ILO modelled estimate)' } },
    { key: 'english', rank: 12, of: 123, year: 2025, source: { url: 'https://www.ef.com/wwen/epi/', checked: CHECKED, label: 'EF EPI 2025' } },
    { key: 'passport', rank: 4, year: 2026, source: { url: 'https://www.henleyglobal.com/passport-index/ranking', checked: CHECKED, label: 'Henley Passport Index 2026 (186 destinations)' } },
  ],
};
