// Denmark: route depth (v3) and country profile. Research 2026-10-27, see
// docs/research/app-v3/dk.md. Every figure was read on the official page cited
// next to it on 2026-10-27. The Start-up Denmark notebook (c1bff953-…) was
// used for leads only. startupdenmarkprogramme.dk fails TLS verification for
// fetch tools, so it was read in the browser pane on the same date.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const CHECKED = '2026-10-27';

const SIRI_SUD = 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark'; // last updated 29-06-2026
const SUD_GUIDE = 'https://startupdenmarkprogramme.dk/application-guide-startups';
const SUD_ABOUT = 'https://startupdenmarkprogramme.dk/about-startup-denmark-programme';
const SUD_EXT = 'https://startupdenmarkprogramme.dk/application-guide-extension';
const VIRK_FORM = 'https://blanket.virk.dk/blanketafvikler/orbeon/fr/public_v/6_ff03709db78b9ce30d8ef83c5a212f5dfdf8949d/new';
const FAMILY_FUNDS = 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Family/Accompanying-family-members/Accompanying-family---work'; // last updated 24-08-2026
const SIRI_STUDY = 'https://nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-Education'; // last updated 01-10-2026
const PR = 'https://nyidanmark.dk/en-GB/Applying/Permanent%20residence%20permit/Permanent%20residence'; // last updated 17-09-2026
const CITIZEN = 'https://lifeindenmark.borger.dk/settle-in-denmark/danish-citizenship/conditions-for-foreign-citizens--acquisition-of-danish-citizenship'; // last updated 11-06-2026
const DUAL = 'https://um.dk/usa/en/travel-and-residence/consular-matters/citizenship';
const SUD_NOTEBOOK = 'c1bff953-7ba8-4bf0-8f14-dc9bfcbf2b2f';

const DK_TIMELINE: Timeline = {
  prAfterYears: 8,
  citizenshipAfterYears: 9,
  dualCitizenship: 'allowed',
  language: {
    en: 'Permanent residence: Danish test 2 (Prøve i Dansk 2). Citizenship: Danish test 3 and the 2021 naturalisation test.',
    fa: 'اقامت دائم: آزمون زبان دانمارکی سطح ۲ (Prøve i Dansk 2). تابعیت: آزمون زبان سطح ۳ و آزمون تابعیت ۲۰۲۱.',
  },
  note: {
    en: 'Permanent residence after 8 years of uninterrupted legal residence, with 3.5 years of full-time work or self-employment in the last 4 and at least 2 of 4 supplementary requirements; after 4 years if all 4 are met. Citizenship needs 9 years of residence and a permanent permit held for at least 2 years. Since 1 September 2015 you do not have to give up your old nationality.',
    fa: 'اقامت دائم پس از ۸ سال اقامت قانونی بی‌وقفه، با ۳٫۵ سال کار تمام‌وقت یا خوداشتغالی در ۴ سال اخیر و دست‌کم ۲ شرط از ۴ شرط تکمیلی؛ اگر هر ۴ شرط برقرار باشد، پس از ۴ سال. تابعیت ۹ سال اقامت می‌خواهد و اقامت دائمی که دست‌کم ۲ سال از آن گذشته باشد. از ۱ سپتامبر ۲۰۱۵ لازم نیست تابعیت قبلی را کنار بگذارید.',
  },
  source: PR,
};

export const EXTRAS_DK: Record<string, RouteExtras> = {
  // ───────────────────────────── START-UP DENMARK ─────────────────────────────
  'dk-startup': {
    funds: [
      {
        key: 'founder',
        label: { en: 'Each founder, for the first year (no family)', fa: 'هر بنیان‌گذار، برای سال اول (بدون خانواده)' },
        amount: 153_240,
        currency: 'DKK',
        basis: 'year',
        per: 'founder',
        kind: 'show',
        source: SIRI_SUD,
      },
      {
        key: 'spouse',
        label: { en: 'Add for a spouse or partner (306,480 in total)', fa: 'افزوده برای همسر یا شریک زندگی (در مجموع ۳۰۶٬۴۸۰)' },
        amount: 153_240,
        currency: 'DKK',
        basis: 'year',
        per: 'spouse',
        kind: 'show',
        source: SIRI_SUD,
      },
      {
        key: 'children',
        label: {
          en: 'Add for children, one amount however many (356,904 with a spouse, 203,664 without)',
          fa: 'افزوده برای فرزندان، یک مبلغ برای هر تعداد فرزند (با همسر ۳۵۶٬۹۰۴ و بدون همسر ۲۰۳٬۶۶۴)',
        },
        amount: 50_424,
        currency: 'DKK',
        basis: 'year',
        per: 'family',
        kind: 'show',
        source: FAMILY_FUNDS,
      },
      {
        key: 'siri-fee',
        label: { en: 'SIRI application fee, each founder', fa: 'هزینه‌ی درخواست SIRI، برای هر بنیان‌گذار' },
        amount: 3_060,
        currency: 'DKK',
        basis: 'once',
        per: 'founder',
        kind: 'spend',
        source: SIRI_SUD,
      },
    ],
    steps: [
      {
        key: 'eligibility',
        title: { en: 'Check you qualify', fa: 'بررسی شرایط' },
        detail: {
          en: 'Non-EU/EEA, non-Swiss founders, alone or up to 3 in a team. Each must own a significant share and run the company. Restaurants, retail and small import/export firms are screened out.',
          fa: 'بنیان‌گذار غیراروپایی (خارج از EU/EEA و سوئیس)، تنها یا در تیمی حداکثر سه‌نفره. هر نفر باید سهم قابل‌توجهی از شرکت داشته باشد و در اداره‌ی آن فعال باشد. رستوران، خرده‌فروشی و واردات و صادرات کوچک در غربالگری کنار گذاشته می‌شوند.',
        },
        link: SUD_GUIDE,
      },
      {
        key: 'pitch',
        title: { en: 'Make the pitch deck and video pitch', fa: 'تهیه‌ی پیچ‌دک و ویدیوی معرفی' },
        detail: {
          en: 'Pitch deck: PDF, at most 15 pages, in English, with market analysis, go-to-market strategy, why Denmark and the start-up phase plan. Video: at most 5 minutes, you presenting in your own words, not a reading of the deck.',
          fa: 'پیچ‌دک: فایل PDF، حداکثر ۱۵ صفحه و به انگلیسی، شامل تحلیل بازار، استراتژی ورود به بازار، دلیل انتخاب دانمارک و برنامه‌ی فاز راه‌اندازی. ویدیو: حداکثر ۵ دقیقه، خودتان ایده را با زبان خودتان معرفی کنید، نه اینکه پیچ‌دک را بخوانید.',
        },
        link: SUD_GUIDE,
      },
      {
        key: 'virk',
        title: { en: 'Submit the online form on Virk', fa: 'ثبت فرم آنلاین در Virk' },
        detail: {
          en: 'The Secretariat screens the file first; an incomplete or ineligible file is rejected before the panel sees it.',
          fa: 'دبیرخانه ابتدا پرونده را غربال می‌کند؛ پرونده‌ی ناقص یا نامشمول پیش از رسیدن به پنل رد می‌شود.',
        },
        link: VIRK_FORM,
      },
      {
        key: 'panel',
        title: { en: 'Expert panel evaluation', fa: 'ارزیابی پنل کارشناسان' },
        detail: {
          en: 'Three panel members grade innovation, market, scalability and team from 1 to 5. You need an average of at least 3.5 across all four. A rejection can be appealed once to the Danish Business Authority, or you can reapply with a substantially improved plan.',
          fa: 'سه عضو پنل نوآوری، بازار، مقیاس‌پذیری و تیم را از ۱ تا ۵ نمره می‌دهند. میانگین هر چهار معیار باید دست‌کم ۳٫۵ باشد. به رد پرونده می‌توان یک‌بار نزد اداره‌ی کسب‌وکار دانمارک (Danish Business Authority) اعتراض کرد، یا با طرحی که به‌طور جدی بهتر شده دوباره درخواست داد.',
        },
        takes: { en: 'Usually up to 6 weeks; longer in holidays or busy periods', fa: 'معمولاً تا ۶ هفته؛ در تعطیلات یا دوره‌های شلوغ بیشتر' },
        link: SUD_GUIDE,
      },
      {
        key: 'siri',
        title: { en: 'Apply to SIRI for the residence and work permit', fa: 'درخواست اقامت و کار از SIRI' },
        detail: {
          en: 'Create a case order ID, pay DKK 3,060, upload the documents and complete the form with MitID or a hand-signed sworn declaration. Each founder applies separately. You cannot apply before panel approval.',
          fa: 'شناسه‌ی پرونده (case order ID) بسازید، ۳٬۰۶۰ کرون بپردازید، مدارک را بارگذاری کنید و فرم را با MitID یا اظهارنامه‌ی سوگندنامه‌ای امضاشده کامل کنید. هر بنیان‌گذار جداگانه درخواست می‌دهد. پیش از تأیید پنل نمی‌توانید درخواست بدهید.',
        },
        takes: { en: 'Normally 2 months; up to 4 if more information is needed', fa: 'معمولاً ۲ ماه؛ اگر اطلاعات بیشتری لازم باشد تا ۴ ماه' },
        link: SIRI_SUD,
      },
      {
        key: 'biometrics',
        title: { en: 'Record biometrics within 14 days', fa: 'ثبت بیومتریک ظرف ۱۴ روز' },
        detail: {
          en: 'Facial photo and fingerprints no later than 14 days after submitting. If no appointment is free in time, email SIRI the booked time so the application is not rejected.',
          fa: 'عکس چهره و اثر انگشت حداکثر ۱۴ روز پس از ثبت درخواست. اگر وقت خالی در این مهلت نبود، زمان رزروشده را به SIRI ایمیل کنید تا درخواست رد نشود.',
        },
        link: SIRI_SUD,
      },
      {
        key: 'launch',
        title: { en: 'Move and register the company', fa: 'ورود به دانمارک و ثبت شرکت' },
        detail: {
          en: 'Get a CPR number, a MitID login, and register the company for a CVR number on virk.dk. The residence card is sent to your CPR address.',
          fa: 'شماره‌ی CPR و ورود MitID بگیرید و شرکت را برای شماره‌ی CVR در virk.dk ثبت کنید. کارت اقامت به نشانی ثبت‌شده در CPR فرستاده می‌شود.',
        },
        link: 'https://virk.dk',
      },
      {
        key: 'extension',
        title: { en: 'Extend after 2 years', fa: 'تمدید پس از ۲ سال' },
        detail: {
          en: 'Send a progress report to the panel, then apply to SIRI, no earlier than 3 months before the permit expires. The company must have a CVR number and not be in bankruptcy. Extensions run up to 3 years at a time.',
          fa: 'گزارش پیشرفت را برای پنل بفرستید و سپس از SIRI تمدید بخواهید، زودتر از ۳ ماه پیش از پایان اعتبار نه. شرکت باید شماره‌ی CVR داشته باشد و در حال ورشکستگی نباشد. هر تمدید تا ۳ سال است.',
        },
        link: SUD_EXT,
      },
    ],
    documents: [
      { key: 'pitch-deck', label: { en: 'Pitch deck (PDF, max 15 pages, English)', fa: 'پیچ‌دک (PDF، حداکثر ۱۵ صفحه، انگلیسی)' }, stage: 'apply' },
      { key: 'video-pitch', label: { en: 'Video pitch (max 5 minutes, English)', fa: 'ویدیوی معرفی (حداکثر ۵ دقیقه، انگلیسی)' }, stage: 'apply' },
      {
        key: 'supporting',
        label: { en: 'Patents, funding or partnership letters, if you have them (inside the deck)', fa: 'پتنت، سند جذب سرمایه یا نامه‌ی همکاری، اگر دارید (داخل پیچ‌دک)' },
        stage: 'apply',
      },
      { key: 'fee-receipt', label: { en: 'Receipt for the paid SIRI fee', fa: 'رسید پرداخت هزینه‌ی SIRI' }, stage: 'permit' },
      { key: 'passport', label: { en: 'Copy of all passport pages, including blank pages and covers', fa: 'کپی همه‌ی صفحه‌های گذرنامه، با صفحه‌های خالی و جلدها' }, stage: 'permit' },
      { key: 'panel-approval', label: { en: 'Approval from the Danish Business Authority’s expert panel', fa: 'تأییدیه‌ی پنل کارشناسان اداره‌ی کسب‌وکار دانمارک' }, stage: 'permit' },
      {
        key: 'funds',
        label: { en: 'Proof of self-support (bank statement)', fa: 'مدرک تمکن مالی (صورت‌حساب بانکی)' },
        note: { en: 'In your name, showing currency, date and account holder.', fa: 'به نام خودتان، با ارز، تاریخ و نام صاحب حساب.' },
        stage: 'permit',
      },
      { key: 'ownership', label: { en: 'Proof of company ownership', fa: 'مدرک مالکیت شرکت' }, stage: 'permit' },
      { key: 'progress-report', label: { en: 'Progress report with financial statement, staff, customers, investment', fa: 'گزارش پیشرفت با صورت مالی، کارکنان، مشتریان و سرمایه‌گذاری' }, stage: 'renewal' },
    ],
    realities: [
      {
        key: 'quota-per-person',
        kind: 'challenge',
        title: { en: '75 permits a year, counted per person', fa: '۷۵ اقامت در سال، بر اساس نفر' },
        detail: {
          en: 'The yearly cap runs 1 January to 31 December and counts people, not teams. A team of three uses three places.',
          fa: 'سقف سالانه از ۱ ژانویه تا ۳۱ دسامبر حساب می‌شود و نفر را می‌شمارد، نه تیم را. تیم سه‌نفره سه جای سهمیه را می‌گیرد.',
        },
        source: SUD_ABOUT,
      },
      {
        key: 'screened-out',
        kind: 'tip',
        title: { en: 'Most rejections happen before the panel', fa: 'بسیاری از پرونده‌ها پیش از پنل رد می‌شوند' },
        detail: {
          en: 'A deck over 15 pages, a video over 5 minutes, a missing go-to-market strategy, an EU citizen listed as applicant or a founder without a significant share are all listed reasons for screening out.',
          fa: 'پیچ‌دک بیش از ۱۵ صفحه، ویدیوی بیش از ۵ دقیقه، نبودن استراتژی ورود به بازار، ثبت شهروند اتحادیه‌ی اروپا به‌عنوان متقاضی یا بنیان‌گذاری بدون سهم قابل‌توجه، همه از دلایل رسمی ردشدن در غربالگری‌اند.',
        },
        source: SUD_GUIDE,
      },
      {
        key: 'closed-work',
        kind: 'challenge',
        title: { en: 'You may work only in your own company', fa: 'فقط در شرکت خودتان اجازه‌ی کار دارید' },
        detail: {
          en: 'A salaried job, a new business or a sideline job needs a new or separate permit. Benefits under the Active Social Policy Act can cost you the permit.',
          fa: 'کار حقوق‌بگیری، کسب‌وکار تازه یا کار جانبی اجازه‌ی جدید یا جداگانه می‌خواهد. گرفتن کمک‌هزینه طبق قانون سیاست اجتماعی فعال (Active Social Policy Act) ممکن است اقامت را از بین ببرد.',
        },
        source: SIRI_SUD,
      },
      {
        key: 'six-months-abroad',
        kind: 'challenge',
        title: { en: 'More than 6 months abroad and the permit lapses', fa: 'بیش از ۶ ماه بیرون از دانمارک یعنی ازدست‌رفتن اقامت' },
        detail: {
          en: 'Giving up your Danish address or staying abroad for more than 6 months in a row ends the permit, unless you got a dispensation first.',
          fa: 'لغو نشانی در دانمارک یا ماندن بیش از ۶ ماه پیاپی بیرون از کشور اقامت را باطل می‌کند، مگر اینکه از پیش معافیت گرفته باشید.',
        },
        source: SIRI_SUD,
      },
      {
        key: 'myth-pr-5',
        kind: 'myth',
        title: { en: 'Myth: permanent residence after 5 years', fa: 'باور نادرست: اقامت دائم پس از ۵ سال' },
        detail: {
          en: 'The rule is 8 years of legal residence, or 4 if all four supplementary requirements are met, plus Danish test 2 and 3.5 years of full-time work or self-employment in the last 4.',
          fa: 'قاعده ۸ سال اقامت قانونی است، یا ۴ سال اگر هر چهار شرط تکمیلی برقرار باشد، به‌علاوه‌ی آزمون زبان دانمارکی سطح ۲ و ۳٫۵ سال کار تمام‌وقت یا خوداشتغالی در ۴ سال اخیر.',
        },
        source: PR,
      },
      {
        key: 'why-denmark',
        kind: 'tip',
        title: { en: 'Answer “why Denmark” in the deck', fa: 'به «چرا دانمارک» در پیچ‌دک پاسخ دهید' },
        detail: {
          en: 'The guide makes it a required part of the deck: opportunities Denmark offers you, business relations there, or other reasons it is the right country.',
          fa: 'راهنمای رسمی آن را بخش الزامی پیچ‌دک می‌داند: فرصت‌هایی که دانمارک به شما می‌دهد، روابط کاری در آنجا یا هر دلیل دیگری که دانمارک را کشور درست می‌کند.',
        },
        source: SUD_GUIDE,
      },
    ],
    timeline: DK_TIMELINE,
    quiz: [
      {
        key: 'team',
        q: { en: 'How many founders can share one Start-up Denmark business plan?', fa: 'حداکثر چند بنیان‌گذار می‌توانند یک طرح Start-up Denmark مشترک داشته باشند؟' },
        options: [
          { en: '2', fa: '۲' },
          { en: '3', fa: '۳' },
          { en: '5', fa: '۵' },
        ],
        answer: 1,
        why: { en: 'Individuals or teams of up to 3 people with a shared plan can apply.', fa: 'فرد یا تیمی حداکثر سه‌نفره با طرح مشترک می‌تواند درخواست بدهد.' },
      },
      {
        key: 'score',
        q: { en: 'What average panel score do you need?', fa: 'چه میانگین نمره‌ای از پنل لازم است؟' },
        options: [
          { en: '3.0 out of 5', fa: '۳ از ۵' },
          { en: '3.5 out of 5', fa: '۳٫۵ از ۵' },
          { en: '4.0 out of 5', fa: '۴ از ۵' },
        ],
        answer: 1,
        why: { en: 'Three judges grade four criteria from 1 to 5; the average must be at least 3.5.', fa: 'سه داور چهار معیار را از ۱ تا ۵ نمره می‌دهند و میانگین باید دست‌کم ۳٫۵ باشد.' },
      },
      {
        key: 'funds',
        q: { en: 'How much must a single founder show for the first year?', fa: 'بنیان‌گذار مجرد برای سال اول چقدر باید نشان دهد؟' },
        options: [
          { en: 'DKK 89,112', fa: '۸۹٬۱۱۲ کرون' },
          { en: 'DKK 153,240', fa: '۱۵۳٬۲۴۰ کرون' },
          { en: 'DKK 306,480', fa: '۳۰۶٬۴۸۰ کرون' },
        ],
        answer: 1,
        why: { en: 'DKK 153,240 (2025 level) without family; 306,480 is the figure with a spouse.', fa: '۱۵۳٬۲۴۰ کرون (سطح ۲۰۲۵) بدون خانواده؛ ۳۰۶٬۴۸۰ رقم همراه با همسر است.' },
      },
      {
        key: 'video',
        q: { en: 'What is the maximum length of the video pitch?', fa: 'ویدیوی معرفی حداکثر چقدر می‌تواند باشد؟' },
        options: [
          { en: '3 minutes', fa: '۳ دقیقه' },
          { en: '5 minutes', fa: '۵ دقیقه' },
          { en: '10 minutes', fa: '۱۰ دقیقه' },
        ],
        answer: 1,
        why: { en: 'Longer than 5 minutes is a listed reason for screening out.', fa: 'ویدیوی بیش از ۵ دقیقه از دلایل رسمی ردشدن در غربالگری است.' },
      },
      {
        key: 'appeal',
        q: { en: 'The panel rejects your plan. What can you do?', fa: 'پنل طرح شما را رد کرد. چه می‌توانید بکنید؟' },
        options: [
          { en: 'Nothing; the decision is final', fa: 'هیچ؛ تصمیم قطعی است' },
          { en: 'Appeal once, or reapply with a substantially improved plan', fa: 'یک‌بار اعتراض کنید، یا با طرحی که جدی بهتر شده دوباره درخواست دهید' },
          { en: 'Apply to SIRI anyway', fa: 'در هر حال از SIRI درخواست اقامت کنید' },
        ],
        answer: 1,
        why: { en: 'One appeal goes to the Danish Business Authority; SIRI needs panel approval first.', fa: 'یک اعتراض نزد اداره‌ی کسب‌وکار دانمارک ممکن است؛ SIRI بدون تأیید پنل درخواست را نمی‌پذیرد.' },
      },
    ],
    media: [
      { notebookId: SUD_NOTEBOOK, kind: 'infographic', title: 'Danish Startup Program Financial Requirements' },
      { notebookId: SUD_NOTEBOOK, kind: 'infographic', title: 'هزینه‌های ویزای استارتاپ دانمارک ۲۰۲۶-۲۰۲۵' },
      { notebookId: SUD_NOTEBOOK, kind: 'infographic', title: 'نقشه راه ویزای استارتاپ دانمارک' },
      { notebookId: SUD_NOTEBOOK, kind: 'infographic', title: 'راهنمای ویزای استارتاپ دانمارک ۲۰۲۵' },
      { notebookId: SUD_NOTEBOOK, kind: 'infographic', title: 'مسیر طلایی اقامت استارتاپی دانمارک' },
      { notebookId: SUD_NOTEBOOK, kind: 'slides', title: 'Startup Denmark Blueprint' },
      { notebookId: SUD_NOTEBOOK, kind: 'slides', title: 'Denmark Startup Blueprint' },
      { notebookId: SUD_NOTEBOOK, kind: 'slides', title: 'Denmark Startup Blueprint (2)' },
    ],
  },

  // ───────────────────────────── HIGHER EDUCATION ─────────────────────────────
  'dk-study': {
    funds: [
      {
        key: 'per-month',
        label: { en: 'Living costs per month of study (2026 level)', fa: 'هزینه‌ی زندگی برای هر ماه تحصیل (سطح ۲۰۲۶)' },
        amount: 7_426,
        currency: 'DKK',
        basis: 'month',
        per: 'person',
        kind: 'show',
        source: SIRI_STUDY,
      },
      {
        key: 'cap',
        label: { en: 'Maximum for a stay of more than a year', fa: 'سقف برای اقامت بیش از یک سال' },
        amount: 89_112,
        currency: 'DKK',
        basis: 'once',
        per: 'person',
        kind: 'show',
        source: SIRI_STUDY,
      },
      {
        key: 'fee',
        label: { en: 'SIRI processing fee', fa: 'هزینه‌ی رسیدگی SIRI' },
        amount: 3_060,
        currency: 'DKK',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: SIRI_STUDY,
      },
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get admitted to a full-time programme', fa: 'پذیرش در یک برنامه‌ی تمام‌وقت' },
        detail: {
          en: 'Part-time study does not qualify. Only state-approved programmes give a post-study job-seeking period.',
          fa: 'تحصیل پاره‌وقت پذیرفته نیست. فقط برنامه‌های مورد تأیید دولت دوره‌ی جست‌وجوی کار پس از تحصیل دارند.',
        },
        link: SIRI_STUDY,
      },
      {
        key: 'case-id',
        title: { en: 'Create a case order ID and pay the fee', fa: 'ساخت شناسه‌ی پرونده و پرداخت هزینه' },
        detail: {
          en: 'DKK 3,060. Keep the receipt: a payment status screen from the website is not accepted.',
          fa: '۳٬۰۶۰ کرون. رسید را نگه دارید؛ صفحه‌ی وضعیت پرداخت در سایت پذیرفته نمی‌شود.',
        },
        link: SIRI_STUDY,
      },
      {
        key: 'documents',
        title: { en: 'Gather documents and proof of funds', fa: 'جمع‌آوری مدارک و تمکن مالی' },
        detail: {
          en: 'DKK 7,426 for each month of study, up to DKK 89,112. Proof of paid first-semester tuition can count if it is accepted as proof of sufficient funds.',
          fa: '۷٬۴۲۶ کرون برای هر ماه تحصیل، حداکثر ۸۹٬۱۱۲ کرون. اگر رسید شهریه‌ی ترم اول به‌عنوان مدرک تمکن کافی پذیرفته شود، کافی است.',
        },
        link: SIRI_STUDY,
      },
      {
        key: 'form',
        title: { en: 'Complete the form with your institution', fa: 'تکمیل فرم همراه با دانشگاه' },
        detail: {
          en: 'The institution completes one part, you complete the other, then you submit online or on paper.',
          fa: 'یک بخش را مؤسسه‌ی آموزشی پر می‌کند و بخش دیگر را شما، سپس درخواست را آنلاین یا کاغذی ثبت می‌کنید.',
        },
        link: SIRI_STUDY,
      },
      {
        key: 'biometrics',
        title: { en: 'Record biometrics', fa: 'ثبت بیومتریک' },
        detail: {
          en: 'Photo and fingerprints; for online applications within 14 days of submitting.',
          fa: 'عکس و اثر انگشت؛ برای درخواست آنلاین ظرف ۱۴ روز پس از ثبت.',
        },
        link: SIRI_STUDY,
      },
      {
        key: 'decision',
        title: { en: 'Receive the decision', fa: 'دریافت تصمیم' },
        detail: {
          en: 'The residence card is sent to your registered address in Denmark.',
          fa: 'کارت اقامت به نشانی ثبت‌شده‌ی شما در دانمارک فرستاده می‌شود.',
        },
        takes: { en: 'Normally 2 months, up to 3', fa: 'معمولاً ۲ ماه، حداکثر ۳ ماه' },
        link: SIRI_STUDY,
      },
    ],
    documents: [
      { key: 'fee-receipt', label: { en: 'Receipt for the case fee', fa: 'رسید پرداخت هزینه‌ی پرونده' }, stage: 'apply' },
      { key: 'passport', label: { en: 'Copy of all passport pages, including blank pages and covers', fa: 'کپی همه‌ی صفحه‌های گذرنامه، با صفحه‌های خالی و جلدها' }, stage: 'apply' },
      {
        key: 'funds',
        label: { en: 'Proof of self-support: bank statement, scholarship or student loan', fa: 'مدرک تمکن: صورت‌حساب بانکی، بورسیه یا وام دانشجویی' },
        stage: 'apply',
      },
      { key: 'home-enrolment', label: { en: 'Exchange or guest students: proof of enrolment at the home institution', fa: 'دانشجوی تبادلی یا مهمان: گواهی ثبت‌نام در دانشگاه مبدأ' }, stage: 'apply' },
      {
        key: 'under-18',
        label: { en: 'Under 18: consent of both parents, birth certificate, parents’ passport page, school declaration', fa: 'زیر ۱۸ سال: رضایت هر دو والد، شناسنامه، صفحه‌ی مشخصات گذرنامه‌ی والدین و اقرارنامه‌ی مدرسه' },
        stage: 'apply',
      },
      { key: 'sworn', label: { en: 'Signed sworn declaration, if you apply without MitID', fa: 'اظهارنامه‌ی سوگندنامه‌ای امضاشده، اگر بدون MitID درخواست می‌دهید' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'family-cut',
        kind: 'challenge',
        title: { en: 'Family generally cannot come with you from 1 Oct 2026', fa: 'از ۱ اکتبر ۲۰۲۶ معمولاً خانواده نمی‌تواند همراهتان بیاید' },
        detail: {
          en: 'For state-approved programmes applied for on or after 1 October 2026, a spouse, partner or children generally cannot be included. Before that date they generally could.',
          fa: 'برای برنامه‌های مورد تأیید دولت که درخواستشان از ۱ اکتبر ۲۰۲۶ به بعد ثبت شود، همسر، شریک زندگی و فرزندان معمولاً نمی‌توانند همراه باشند. پیش از این تاریخ معمولاً می‌توانستند.',
        },
        source: SIRI_STUDY,
      },
      {
        key: 'job-seeking',
        kind: 'challenge',
        title: { en: 'Shorter job-seeking period after graduation', fa: 'مهلت کوتاه‌تر جست‌وجوی کار پس از فارغ‌التحصیلی' },
        detail: {
          en: 'From 1 October 2026: generally 6 months or 1 year for bachelor’s and master’s, 3 years for a PhD. Non-state-approved programmes applied for since 2 May 2025 give none.',
          fa: 'از ۱ اکتبر ۲۰۲۶: معمولاً ۶ ماه یا ۱ سال برای کارشناسی و کارشناسی ارشد و ۳ سال برای دکتری. برنامه‌های غیردولتی که از ۲ مه ۲۰۲۵ به بعد درخواست شده‌اند، این مهلت را ندارند.',
        },
        source: SIRI_STUDY,
      },
      {
        key: 'work-hours',
        kind: 'tip',
        title: { en: 'Work 90 hours a month, full-time in summer', fa: '۹۰ ساعت کار در ماه، تابستان تمام‌وقت' },
        detail: {
          en: 'Up to 90 hours a month from September to May, full-time in June, July and August. A mandatory internship is full-time for its length.',
          fa: 'از سپتامبر تا مه حداکثر ۹۰ ساعت در ماه، و در ژوئن، ژوئیه و اوت تمام‌وقت. کارآموزی اجباری در طول خودش تمام‌وقت حساب می‌شود.',
        },
        source: SIRI_STUDY,
      },
      {
        key: 'tuition-as-funds',
        kind: 'tip',
        title: { en: 'Paid tuition may replace the bank statement', fa: 'شهریه‌ی پرداخت‌شده ممکن است جای صورت‌حساب را بگیرد' },
        detail: {
          en: 'If proof of paid first-semester tuition is accepted as showing sufficient funds, no further funds proof is needed.',
          fa: 'اگر رسید شهریه‌ی ترم اول به‌عنوان مدرک تمکن کافی پذیرفته شود، مدرک مالی دیگری لازم نیست.',
        },
        source: SIRI_STUDY,
      },
    ],
    timeline: {
      ...DK_TIMELINE,
      note: {
        en: 'Permanent residence needs 8 years of uninterrupted legal residence and 3.5 years of full-time work or self-employment in the last 4, so study years alone are not enough. Citizenship: 9 years and a permanent permit held for 2. Dual citizenship is allowed.',
        fa: 'اقامت دائم ۸ سال اقامت قانونی بی‌وقفه و ۳٫۵ سال کار تمام‌وقت یا خوداشتغالی در ۴ سال اخیر می‌خواهد؛ پس سال‌های تحصیل به‌تنهایی کافی نیست. تابعیت: ۹ سال اقامت و ۲ سال داشتن اقامت دائم. دوتابعیتی مجاز است.',
      },
    },
    quiz: [
      {
        key: 'monthly',
        q: { en: 'How much must you show per month of study (2026)?', fa: 'برای هر ماه تحصیل چقدر باید نشان دهید (۲۰۲۶)؟' },
        options: [
          { en: 'DKK 5,000', fa: '۵٬۰۰۰ کرون' },
          { en: 'DKK 7,426', fa: '۷٬۴۲۶ کرون' },
          { en: 'DKK 12,770', fa: '۱۲٬۷۷۰ کرون' },
        ],
        answer: 1,
        why: { en: 'DKK 7,426 a month, capped at DKK 89,112.', fa: '۷٬۴۲۶ کرون در ماه و حداکثر ۸۹٬۱۱۲ کرون.' },
      },
      {
        key: 'hours',
        q: { en: 'How much may you work during the semester?', fa: 'در طول ترم چقدر اجازه‌ی کار دارید؟' },
        options: [
          { en: '20 hours a week', fa: '۲۰ ساعت در هفته' },
          { en: '90 hours a month', fa: '۹۰ ساعت در ماه' },
          { en: 'No work allowed', fa: 'اجازه‌ی کار ندارید' },
        ],
        answer: 1,
        why: { en: '90 hours a month September to May, full-time June to August.', fa: 'از سپتامبر تا مه ۹۰ ساعت در ماه و از ژوئن تا اوت تمام‌وقت.' },
      },
      {
        key: 'job-seeking',
        q: { en: 'Master’s applicants from 1 Oct 2026 get how long to look for work after graduating?', fa: 'متقاضیان کارشناسی ارشد از ۱ اکتبر ۲۰۲۶ پس از فارغ‌التحصیلی چه مدت برای جست‌وجوی کار دارند؟' },
        options: [
          { en: 'Generally 6 months or 1 year', fa: 'معمولاً ۶ ماه یا ۱ سال' },
          { en: '3 years', fa: '۳ سال' },
          { en: 'None', fa: 'هیچ' },
        ],
        answer: 0,
        why: { en: 'The 3-year period now applies to PhDs only.', fa: 'مهلت ۳ ساله اکنون فقط برای دکتری است.' },
      },
      {
        key: 'family',
        q: { en: 'Can a spouse join a student on a state-approved programme applied for after 1 Oct 2026?', fa: 'آیا همسر دانشجوی برنامه‌ی دولتی که پس از ۱ اکتبر ۲۰۲۶ درخواست داده، می‌تواند همراه شود؟' },
        options: [
          { en: 'Yes, always', fa: 'بله، همیشه' },
          { en: 'Generally no', fa: 'معمولاً نه' },
          { en: 'Only with DKK 50,000 more', fa: 'فقط با ۵۰٬۰۰۰ کرون بیشتر' },
        ],
        answer: 1,
        why: { en: 'SIRI says family generally cannot be included for those applications.', fa: 'به گفته‌ی SIRI برای این درخواست‌ها معمولاً خانواده پذیرفته نمی‌شود.' },
      },
      {
        key: 'biometrics',
        q: { en: 'Within how many days of applying online must you record biometrics?', fa: 'پس از ثبت آنلاین، ظرف چند روز باید بیومتریک بدهید؟' },
        options: [
          { en: '7', fa: '۷' },
          { en: '14', fa: '۱۴' },
          { en: '30', fa: '۳۰' },
        ],
        answer: 1,
        why: { en: 'SIRI sets 14 days for online applications.', fa: 'SIRI برای درخواست آنلاین ۱۴ روز تعیین کرده است.' },
      },
    ],
    media: [],
  },
};

const HDR = 'https://hdr.undp.org/data-center/specific-country-data#/countries/DNK';

export const PROFILE_DK: CountryProfile = {
  strengths: [
    {
      en: 'Dual citizenship allowed since 2015: you keep your current passport.',
      fa: 'دوتابعیتی از ۲۰۱۵ مجاز است و گذرنامه‌ی فعلی‌تان را نگه می‌دارید.',
    },
    {
      en: 'Start-up Denmark has published, checkable rules: a 15-page deck, a 5-minute video, three judges and a 3.5 average.',
      fa: 'قواعد Start-up Denmark روشن و منتشرشده است: پیچ‌دک ۱۵ صفحه‌ای، ویدیوی ۵ دقیقه‌ای، سه داور و میانگین ۳٫۵.',
    },
    {
      en: 'Very high human development (UNDP rank 4) and among the happiest countries (World Happiness Report rank 3).',
      fa: 'توسعه‌ی انسانی بسیار بالا (رتبه‌ی ۴ UNDP) و از شادترین کشورها (رتبه‌ی ۳ گزارش جهانی شادی).',
    },
    {
      en: 'English is widely spoken (EF rank 7 of 123), so a founder can start in English.',
      fa: 'انگلیسی رایج است (رتبه‌ی ۷ از ۱۲۳ در EF) و بنیان‌گذار می‌تواند کار را به انگلیسی شروع کند.',
    },
  ],
  weaknesses: [
    {
      en: 'Only 75 start-up permits a year, counted per person.',
      fa: 'فقط ۷۵ اقامت استارتاپی در سال، بر اساس تعداد نفرات.',
    },
    {
      en: 'Founders may work only in their own company; a job or side job needs a new permit.',
      fa: 'بنیان‌گذار فقط در شرکت خودش اجازه‌ی کار دارد؛ شغل یا کار جانبی اجازه‌ی جدید می‌خواهد.',
    },
    {
      en: 'Slow path to settle: 8 years to permanent residence (4 at best) and 9 to citizenship, with Danish language tests.',
      fa: 'مسیر ماندگاری طولانی است: ۸ سال تا اقامت دائم (در بهترین حالت ۴ سال) و ۹ سال تا تابعیت، با آزمون زبان دانمارکی.',
    },
    {
      en: 'Students applying from 1 Oct 2026 generally cannot bring family and get a shorter job-seeking period.',
      fa: 'دانشجویانی که از ۱ اکتبر ۲۰۲۶ درخواست می‌دهند معمولاً نمی‌توانند خانواده را بیاورند و مهلت جست‌وجوی کارشان کوتاه‌تر است.',
    },
  ],
  indicators: [
    { key: 'hdi', rank: 4, of: 193, value: 0.962, year: 2023, source: { url: HDR, checked: CHECKED, label: 'UNDP HDR 2025, data for 2023' } },
    { key: 'happiness', rank: 3, year: 2026, source: { url: 'https://data.worldhappiness.report/table', checked: CHECKED, label: 'World Happiness Report 2026 (2023–2025 average), score 7.539' } },
    { key: 'peace', rank: 11, of: 163, value: 1.504, year: 2026, source: { url: 'https://www.visionofhumanity.org/maps/', checked: CHECKED, label: 'Global Peace Index 2026' } },
    {
      key: 'gdp-per-capita',
      value: 76_970,
      unit: 'USD',
      year: 2025,
      source: { url: 'https://api.worldbank.org/v2/country/DNK/indicator/NY.GDP.PCAP.CD?format=json&mrv=1', checked: CHECKED, label: 'World Bank, current US$' },
    },
    {
      key: 'unemployment',
      value: 5.5,
      unit: '%',
      year: 2025,
      source: { url: 'https://api.worldbank.org/v2/country/DNK/indicator/SL.UEM.TOTL.ZS?format=json&mrv=1', checked: CHECKED, label: 'World Bank, modeled ILO estimate' },
    },
    { key: 'innovation', rank: 9, of: 139, year: 2026, source: { url: 'https://www.wipo.int/pressroom/en/articles/2026/article_0014.html', checked: CHECKED, label: 'WIPO Global Innovation Index 2026' } },
    { key: 'english', rank: 7, of: 123, year: 2025, source: { url: 'https://www.ef.com/wwen/epi/', checked: CHECKED, label: 'EF EPI 2025' } },
    {
      key: 'passport',
      rank: 4,
      value: 186,
      unit: 'destinations visa-free',
      year: 2026,
      source: { url: 'https://www.henleyglobal.com/passport-index/ranking', checked: CHECKED, label: 'Henley Passport Index 2026' },
    },
  ],
};

// Pages behind DK_TIMELINE's citizenship and dual-citizenship note (the
// Timeline type holds one source, the permanent-residence page).
export const DK_TIMELINE_SOURCES = [PR, CITIZEN, DUAL] as const;
