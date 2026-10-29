// Italy: route depth (v3) and country profile. Research 2026-10-27, see
// docs/research/app-v3/it.md. Every figure was read on the official page cited
// next to it on 2026-10-27. The Italia Startup Visa notebook (a17a116c-…) was
// used for leads only. italiastartupvisa.mise.gov.it and mimit.gov.it refused
// connections from every tool on that date, so the startup figures here come
// from consular pages (Chicago, Montreal, Maputo) instead of the MIMIT portal.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const CHECKED = '2026-10-27';

const ISV_PORTAL = 'https://italiastartupvisa.mise.gov.it/'; // unreachable 2026-10-27; linked as the place the step is done
const CHICAGO_ISV =
  'https://conschicago.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visa-categories-and-requirements/italia-start-up-visanational-long-term-visa/';
const MONTREAL_ISV = 'https://consmontreal.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/italia-startup-visa/';
const MAPUTO_ISV = 'https://ambmaputo.esteri.it/wp-content/uploads/2026/06/SELF-EMPLOYMENT-START-UP-1.pdf'; // updated 25/05/2026
const NY_SELF = 'https://consnewyork.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visas-to-enter-italy/independent-work/';
const DPCM_FLUSSI = 'https://prefettura.interno.gov.it/it/prefetture/macerata/comunicazioni/dpcm-2-ottobre-2025-programmazione-dei-flussi-dingresso-2026-2028';
const PARIS_STUDY = 'https://consparigi.esteri.it/fr/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visto-di-studio-study-visa-visa-etudiant/';
const POSTE_PERMIT = 'https://www.poste.it/prodotti/guida-rilascio-e-rinnovo-permesso-di-soggiorno.html';
const POLIZIA_PERMIT = 'https://www.poliziadistato.it/articolo/225';
const POLIZIA_LONG_TERM =
  'https://www.poliziadistato.it/articolo/permesso-di-soggiorno-ue-per-soggiornanti-di-lungo-periodo.--carta-di-soggiorno-per-cittadini-stranieri';
const CITIZENSHIP = 'https://prefettura.interno.gov.it/it/prefetture/treviso/cittadinanza-art-9';
const UNIVERSITALY = 'https://www.universitaly.it/';
const VISA_PORTAL = 'https://vistoperitalia.esteri.it/';
const REGISTRO_STARTUP = 'https://startup.registroimprese.it/';
const LAW_193 =
  'https://www.normattiva.it/atto/caricaDettaglioAtto?atto.dataPubblicazioneGazzetta=2024-12-17&atto.codiceRedazionale=24G00215&atto.articolo.numero=28&atto.articolo.sottoArticolo=1&atto.articolo.tipoArticolo=0';
const NB_ISV = 'a17a116c-47b9-461d-ab05-c394302820b3';

const IT_TIMELINE: Timeline = {
  prAfterYears: 5,
  citizenshipAfterYears: 10,
  dualCitizenship: 'allowed',
  language: {
    en: 'EU long-term permit: Italian A2. Citizenship: Italian B1 (holders of the EU long-term permit only give its details).',
    fa: 'اقامت بلندمدت اتحادیه‌ی اروپا: زبان ایتالیایی در سطح A2. تابعیت: ایتالیایی در سطح B1 (دارندگان اقامت بلندمدت فقط مشخصات آن را ارائه می‌دهند).',
  },
  note: {
    en: 'EU long-term permit after 5 years of a valid permit, with income at least the yearly assegno sociale; absences under 6 months in a row and 10 months in total do not break the five years. Citizenship by residence after 10 years of legal residence for non-EU nationals, with a EUR 250 contribution. Italy does not ask you to give up your old nationality; check whether your own country lets you keep it.',
    fa: 'اقامت بلندمدت اتحادیه‌ی اروپا پس از ۵ سال اقامت معتبر، با درآمدی دست‌کم برابر assegno sociale سالانه؛ غیبت‌های کمتر از ۶ ماه پیوسته و در مجموع کمتر از ۱۰ ماه این ۵ سال را قطع نمی‌کند. تابعیت از راه اقامت برای اتباع غیراروپایی پس از ۱۰ سال اقامت قانونی و با پرداخت ۲۵۰ یورو. ایتالیا کنار گذاشتن تابعیت قبلی را نمی‌خواهد؛ قانون کشور خودتان را هم بررسی کنید.',
  },
  source: POLIZIA_LONG_TERM,
};

/** Paid by every adult at the post office when the first permit is requested (poste.it). */
const PERMIT_FEES = [
  {
    key: 'permit-card',
    label: { en: 'Permit card production fee', fa: 'هزینه‌ی صدور کارت اقامت' },
    amount: 30.46,
    currency: 'EUR' as const,
    basis: 'once' as const,
    per: 'person' as const,
    kind: 'spend' as const,
    source: POSTE_PERMIT,
  },
  {
    key: 'permit-postal',
    label: { en: 'Post office filing fee', fa: 'هزینه‌ی ثبت درخواست در اداره‌ی پست' },
    amount: 30,
    currency: 'EUR' as const,
    basis: 'once' as const,
    per: 'person' as const,
    kind: 'spend' as const,
    source: POSTE_PERMIT,
  },
  {
    key: 'permit-stamp',
    label: { en: 'Revenue stamp (marca da bollo)', fa: 'تمبر مالیاتی (marca da bollo)' },
    amount: 16,
    currency: 'EUR' as const,
    basis: 'once' as const,
    per: 'person' as const,
    kind: 'spend' as const,
    source: POSTE_PERMIT,
  },
];

const ISV_MEDIA = [
  { notebookId: NB_ISV, kind: 'slides' as const, title: 'Italy Startup Visa Blueprint' },
  { notebookId: NB_ISV, kind: 'slides' as const, title: 'The Startup Innovation Blueprint' },
  { notebookId: NB_ISV, kind: 'slides' as const, title: 'Italy Startup Visa Blueprint (13 sources)' },
  { notebookId: NB_ISV, kind: 'slides' as const, title: 'Italia Startup Blueprint' },
  { notebookId: NB_ISV, kind: 'infographic' as const, title: 'راهنمای ویزای استارتاپ ایتالیا ۲۰۲۵' },
  { notebookId: NB_ISV, kind: 'infographic' as const, title: 'راهنمای ویزای استارتاپ ایتالیا' },
  { notebookId: NB_ISV, kind: 'infographic' as const, title: 'راهنمای قانون جدید استارتاپ‌های ایتالیا' },
  { notebookId: NB_ISV, kind: 'infographic' as const, title: 'راهنمای دریافت ویزای استارتاپ ایتالیا' },
  { notebookId: NB_ISV, kind: 'infographic' as const, title: 'راهنمای ویزای استارتاپ ایتالیا ۲۰۲۶' },
  { notebookId: NB_ISV, kind: 'infographic' as const, title: 'راهنمای مالی ویزای استارتاپ ایتالیا' },
  { notebookId: NB_ISV, kind: 'infographic' as const, title: 'راهنمای جامع ویزای استارتاپ ایتالیا' },
  { notebookId: NB_ISV, kind: 'infographic' as const, title: 'راهنمای جامع ویزای استارتاپ ایتالیا (نسخه‌ی دوم)' },
];

export const EXTRAS_IT: Record<string, RouteExtras> = {
  // ───────────────────────────── ITALIA STARTUP VISA ─────────────────────────────
  'it-startup': {
    funds: [
      {
        key: 'project-funds',
        label: { en: 'Funds dedicated to the startup, for the whole project (not per founder)', fa: 'سرمایه‌ی اختصاص‌یافته به استارتاپ، برای کل پروژه (نه برای هر بنیان‌گذار)' },
        amount: 50_000,
        currency: 'EUR',
        basis: 'once',
        per: 'team',
        kind: 'invest',
        source: MAPUTO_ISV,
      },
      {
        key: 'prev-year-income',
        label: { en: 'Previous-year income, each applicant (8,400 at the Chicago consulate)', fa: 'درآمد سال قبل، برای هر متقاضی (کنسولگری شیکاگو ۸٬۴۰۰ می‌گوید)' },
        amount: 8_500,
        currency: 'EUR',
        basis: 'prevYearIncome',
        per: 'founder',
        kind: 'show',
        approx: true,
        source: NY_SELF,
      },
      {
        key: 'visa-fee',
        label: { en: 'Type D visa fee, each applicant', fa: 'هزینه‌ی ویزای نوع D، برای هر متقاضی' },
        amount: 116,
        currency: 'EUR',
        basis: 'once',
        per: 'founder',
        kind: 'spend',
        source: MAPUTO_ISV,
      },
      ...PERMIT_FEES,
    ],
    steps: [
      {
        key: 'prepare',
        title: { en: 'Prepare the application file', fa: 'آماده کردن پرونده' },
        detail: {
          en: 'Application form, passport scan and proof of at least EUR 50,000 for the startup. A business plan and pitch deck help the Committee judge the project. English is accepted.',
          fa: 'فرم درخواست، اسکن گذرنامه و مدرک دست‌کم ۵۰٬۰۰۰ یورو برای استارتاپ. طرح کسب‌وکار و فایل ارائه به کمیته کمک می‌کند پروژه را بسنجد. پرونده به زبان انگلیسی پذیرفته می‌شود.',
        },
        link: ISV_PORTAL,
      },
      {
        key: 'submit',
        title: { en: 'Email it to the ISV secretariat', fa: 'ارسال ایمیلی به دبیرخانه‌ی ISV' },
        detail: {
          en: 'The whole procedure is digital: send the file to italiastartupvisa@mise.gov.it. The Committee assesses it and issues the nulla osta.',
          fa: 'کل روند دیجیتال است: پرونده را به italiastartupvisa@mise.gov.it بفرستید. کمیته آن را ارزیابی می‌کند و مجوز nulla osta را صادر می‌کند.',
        },
        takes: { en: 'Usually within 30 days', fa: 'معمولاً ظرف ۳۰ روز' },
        link: MONTREAL_ISV,
      },
      {
        key: 'visa',
        title: { en: 'Apply for the type D visa at your consulate', fa: 'درخواست ویزای نوع D در کنسولگری' },
        detail: {
          en: 'Bring the nulla osta, proof of funds, last year’s tax return, proof of lodging and a flight booking. The visa is valid for one year.',
          fa: 'مجوز nulla osta، مدرک تمکن، اظهارنامه‌ی مالیاتی سال قبل، مدرک محل اقامت و رزرو پرواز را همراه ببرید. ویزا یک‌ساله است.',
        },
        link: VISA_PORTAL,
      },
      {
        key: 'permit',
        title: { en: 'Request the residence permit within 8 working days of arrival', fa: 'درخواست اجازه‌ی اقامت ظرف ۸ روز کاری پس از ورود' },
        detail: {
          en: 'File at the post office kit desk for the Questura of the province where you will live: EUR 16 stamp, EUR 30 postal fee and EUR 30.46 card fee.',
          fa: 'درخواست را از باجه‌ی کیت اداره‌ی پست برای Questura استان محل زندگی‌تان ثبت کنید: تمبر ۱۶ یورویی، ۳۰ یورو هزینه‌ی پست و ۳۰٫۴۶ یورو هزینه‌ی کارت.',
        },
        takes: { en: 'About 60 days for the card', fa: 'صدور کارت حدود ۶۰ روز' },
        link: POLIZIA_PERMIT,
      },
      {
        key: 'register',
        title: { en: 'Register the company as an innovative startup', fa: 'ثبت شرکت به‌عنوان استارتاپ نوآور' },
        detail: {
          en: 'Set up the company and enter it in the special section of the Business Register for innovative startups. The ISV benefits depend on that registration.',
          fa: 'شرکت را تأسیس کنید و در بخش ویژه‌ی استارتاپ‌های نوآور در دفتر ثبت شرکت‌ها وارد کنید. مزایای ISV به همین ثبت بستگی دارد.',
        },
        link: REGISTRO_STARTUP,
      },
      {
        key: 'long-term',
        title: { en: 'After 5 years, apply for the EU long-term permit', fa: 'پس از ۵ سال، درخواست اقامت بلندمدت اتحادیه‌ی اروپا' },
        detail: {
          en: 'Needs income at least the yearly assegno sociale and Italian at A2.',
          fa: 'درآمدی دست‌کم برابر assegno sociale سالانه و زبان ایتالیایی در سطح A2 لازم است.',
        },
        link: POLIZIA_LONG_TERM,
      },
    ],
    documents: [
      { key: 'form', label: { en: 'ISV application form', fa: 'فرم درخواست ISV' }, stage: 'apply' },
      { key: 'passport-scan', label: { en: 'Passport scan', fa: 'اسکن گذرنامه' }, stage: 'apply' },
      {
        key: 'funds',
        label: { en: 'Proof of at least EUR 50,000 dedicated to the startup', fa: 'مدرک دست‌کم ۵۰٬۰۰۰ یورو اختصاص‌یافته به استارتاپ' },
        note: { en: 'Ascertained or certified, per the consular checklist.', fa: 'طبق چک‌لیست کنسولگری، باید احرازشده یا تأییدشده باشد.' },
        stage: 'apply',
      },
      { key: 'visa-form', label: { en: 'Type D visa application form, signed', fa: 'فرم درخواست ویزای نوع D، امضاشده' }, stage: 'visa' },
      { key: 'photo', label: { en: 'Recent passport photo', fa: 'عکس گذرنامه‌ای جدید' }, stage: 'visa' },
      {
        key: 'passport',
        label: { en: 'Passport valid 3 months beyond the visa, with 2 blank pages, plus a copy', fa: 'گذرنامه با دست‌کم ۳ ماه اعتبار پس از پایان ویزا و ۲ صفحه‌ی خالی، با یک نسخه کپی' },
        stage: 'visa',
      },
      { key: 'nulla-osta', label: { en: 'Copy of the nulla osta from the ISV Committee', fa: 'کپی مجوز nulla osta کمیته‌ی ISV' }, stage: 'visa' },
      { key: 'tax-return', label: { en: 'Previous year’s tax return showing the minimum income', fa: 'اظهارنامه‌ی مالیاتی سال قبل که حداقل درآمد را نشان دهد' }, stage: 'visa' },
      { key: 'lodging', label: { en: 'Proof of lodging in Italy', fa: 'مدرک محل اقامت در ایتالیا' }, stage: 'visa' },
      { key: 'flight', label: { en: 'Flight reservation', fa: 'رزرو پرواز' }, stage: 'visa' },
      { key: 'fee', label: { en: 'Visa fee payment', fa: 'رسید پرداخت هزینه‌ی ویزا' }, stage: 'visa' },
      { key: 'kit', label: { en: 'Post office permit kit, EUR 16 stamp and payment slip', fa: 'کیت پستی اقامت، تمبر ۱۶ یورویی و فیش پرداخت' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'income-not-savings',
        kind: 'myth',
        title: { en: 'Savings do not replace the income test', fa: 'پس‌انداز جای شرط درآمد را نمی‌گیرد' },
        detail: {
          en: 'Besides the EUR 50,000, the consulate asks for last year’s tax return showing income above the health-exemption minimum. Money in the bank does not prove income.',
          fa: 'کنسولگری علاوه بر ۵۰٬۰۰۰ یورو، اظهارنامه‌ی مالیاتی سال قبل را می‌خواهد که درآمدی بالاتر از حداقل معافیت درمانی نشان دهد. موجودی حساب بانکی درآمد را ثابت نمی‌کند.',
        },
        source: CHICAGO_ISV,
      },
      {
        key: 'income-figure',
        kind: 'tip',
        title: { en: 'Consulates quote different income figures', fa: 'رقم درآمد در کنسولگری‌ها یکسان نیست' },
        detail: {
          en: 'Chicago writes EUR 8,400 and New York EUR 8,500. Check the checklist of the consulate that will take your file.',
          fa: 'کنسولگری شیکاگو ۸٬۴۰۰ یورو و نیویورک ۸٬۵۰۰ یورو نوشته است. چک‌لیست همان کنسولگری‌ای را ببینید که پرونده‌تان را می‌گیرد.',
        },
        source: NY_SELF,
      },
      {
        key: 'funds-per-project',
        kind: 'myth',
        title: { en: 'The EUR 50,000 is for the startup, not per person', fa: '۵۰٬۰۰۰ یورو برای استارتاپ است، نه برای هر نفر' },
        detail: {
          en: 'The consular checklist asks for funds dedicated to the innovative startup. Each founder still needs their own income proof.',
          fa: 'چک‌لیست کنسولگری سرمایه‌ای می‌خواهد که به استارتاپ نوآور اختصاص یافته باشد. با این حال هر بنیان‌گذار مدرک درآمد خودش را لازم دارد.',
        },
        source: MAPUTO_ISV,
      },
      {
        key: 'eight-days',
        kind: 'challenge',
        title: { en: 'The visa is not the permit', fa: 'ویزا همان اجازه‌ی اقامت نیست' },
        detail: {
          en: 'You must request the residence permit within 8 working days of entering Italy. Missing the deadline can lead to expulsion.',
          fa: 'باید ظرف ۸ روز کاری پس از ورود به ایتالیا اجازه‌ی اقامت را درخواست کنید. از دست دادن این مهلت ممکن است به اخراج برسد.',
        },
        source: POLIZIA_PERMIT,
      },
      {
        key: 'no-consulting',
        kind: 'challenge',
        title: { en: 'Consulting and agency businesses no longer qualify', fa: 'کسب‌وکار مشاوره‌ای و واسطه‌گری دیگر پذیرفته نمی‌شود' },
        detail: {
          en: 'Since 18 December 2024 an innovative startup must be an EU SME and its main activity cannot be agency or consulting work.',
          fa: 'از ۱۸ دسامبر ۲۰۲۴ استارتاپ نوآور باید شرکت کوچک یا متوسط به تعریف اتحادیه‌ی اروپا باشد و فعالیت اصلی‌اش نمی‌تواند واسطه‌گری یا مشاوره باشد.',
        },
        source: LAW_193,
      },
      {
        key: 'citizenship-ten',
        kind: 'myth',
        title: { en: 'Five years leads to a permanent permit, not citizenship', fa: 'پنج سال به اقامت دائم می‌رسد، نه تابعیت' },
        detail: {
          en: 'The EU long-term permit comes after 5 years. Citizenship by residence needs 10 years and Italian at B1.',
          fa: 'اقامت بلندمدت اتحادیه‌ی اروپا پس از ۵ سال است. تابعیت از راه اقامت ۱۰ سال و زبان ایتالیایی در سطح B1 می‌خواهد.',
        },
        source: CITIZENSHIP,
      },
    ],
    timeline: IT_TIMELINE,
    quiz: [
      {
        key: 'funds',
        q: { en: 'How much must be available for the startup?', fa: 'چه مبلغی باید برای استارتاپ در دسترس باشد؟' },
        options: [
          { en: 'EUR 25,000', fa: '۲۵٬۰۰۰ یورو' },
          { en: 'EUR 50,000', fa: '۵۰٬۰۰۰ یورو' },
          { en: 'EUR 250,000', fa: '۲۵۰٬۰۰۰ یورو' },
        ],
        answer: 1,
        why: { en: 'The consular checklist asks for at least EUR 50,000 dedicated to the startup.', fa: 'چک‌لیست کنسولگری دست‌کم ۵۰٬۰۰۰ یورو اختصاص‌یافته به استارتاپ می‌خواهد.' },
      },
      {
        key: 'who',
        q: { en: 'Who issues the nulla osta?', fa: 'مجوز nulla osta را چه کسی صادر می‌کند؟' },
        options: [
          { en: 'The Italian consulate', fa: 'کنسولگری ایتالیا' },
          { en: 'The Italia Startup Visa Technical Committee', fa: 'کمیته‌ی فنی Italia Startup Visa' },
          { en: 'The local Questura', fa: 'Questura محلی' },
        ],
        answer: 1,
        why: { en: 'The consulate asks for the nulla osta issued by the Comitato Tecnico Italia Startup Visa.', fa: 'کنسولگری مجوز nulla osta صادرشده از کمیته‌ی فنی Italia Startup Visa را می‌خواهد.' },
      },
      {
        key: 'income',
        q: { en: 'What does the income condition look at?', fa: 'شرط درآمد به چه چیزی نگاه می‌کند؟' },
        options: [
          { en: 'Savings in your bank account', fa: 'پس‌انداز حساب بانکی' },
          { en: 'Your income in the previous year', fa: 'درآمد شما در سال قبل' },
          { en: 'Expected startup revenue', fa: 'درآمد پیش‌بینی‌شده‌ی استارتاپ' },
        ],
        answer: 1,
        why: { en: 'The consulate asks for last year’s tax return showing income above about EUR 8,500.', fa: 'کنسولگری اظهارنامه‌ی مالیاتی سال قبل با درآمدی بیش از حدود ۸٬۵۰۰ یورو را می‌خواهد.' },
      },
      {
        key: 'eight-days',
        q: { en: 'After arriving, how long do you have to request the residence permit?', fa: 'پس از ورود، چقدر برای درخواست اجازه‌ی اقامت وقت دارید؟' },
        options: [
          { en: '8 working days', fa: '۸ روز کاری' },
          { en: '30 days', fa: '۳۰ روز' },
          { en: '90 days', fa: '۹۰ روز' },
        ],
        answer: 0,
        why: { en: 'The Polizia di Stato sets 8 working days from entry.', fa: 'پلیس ایتالیا ۸ روز کاری از زمان ورود تعیین کرده است.' },
      },
      {
        key: 'long-term',
        q: { en: 'After how many years can you apply for the EU long-term permit?', fa: 'پس از چند سال می‌توانید اقامت بلندمدت اتحادیه‌ی اروپا را درخواست کنید؟' },
        options: [
          { en: '3', fa: '۳' },
          { en: '5', fa: '۵' },
          { en: '10', fa: '۱۰' },
        ],
        answer: 1,
        why: { en: 'It needs a valid permit held for at least 5 years.', fa: 'باید دست‌کم ۵ سال اجازه‌ی اقامت معتبر داشته باشید.' },
      },
    ],
    media: ISV_MEDIA,
  },

  // ───────────────────────────── SELF-EMPLOYMENT ─────────────────────────────
  'it-self-employed': {
    funds: [
      {
        key: 'prev-year-income',
        label: { en: 'Previous-year income', fa: 'درآمد سال قبل' },
        amount: 8_500,
        currency: 'EUR',
        basis: 'prevYearIncome',
        per: 'person',
        kind: 'show',
        approx: true,
        source: NY_SELF,
      },
      {
        key: 'activity-resources',
        label: { en: 'Resources for the activity (three times the yearly social minimum)', fa: 'منابع لازم برای فعالیت (سه برابر حداقل سالانه‌ی رفاه اجتماعی)' },
        amount: 14_000,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'show',
        source: NY_SELF,
      },
      {
        key: 'visa-fee',
        label: { en: 'Type D self-employment visa fee', fa: 'هزینه‌ی ویزای کار مستقل نوع D' },
        amount: 116,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: MAPUTO_ISV,
      },
      ...PERMIT_FEES,
    ],
    steps: [
      {
        key: 'quota',
        title: { en: 'Check that quota is left', fa: 'بررسی باقی بودن سهمیه' },
        detail: {
          en: 'The DPCM flussi allows 650 self-employment entries a year for 2026, 2027 and 2028.',
          fa: 'فرمان DPCM flussi برای هر یک از سال‌های ۲۰۲۶، ۲۰۲۷ و ۲۰۲۸ سالانه ۶۵۰ ورود برای کار مستقل در نظر گرفته است.',
        },
        link: DPCM_FLUSSI,
      },
      {
        key: 'declarations',
        title: { en: 'Get the licensing and resources declarations', fa: 'گرفتن گواهی مجوز فعالیت و گواهی منابع' },
        detail: {
          en: 'A declaration from the licensing office, issued within the last 3 months, and a declaration that your resources are at least EUR 14,000.',
          fa: 'گواهی اداره‌ی صدور مجوز که در ۳ ماه اخیر صادر شده باشد و گواهی اینکه منابع شما دست‌کم ۱۴٬۰۰۰ یورو است.',
        },
        link: NY_SELF,
      },
      {
        key: 'nulla-osta',
        title: { en: 'Obtain the nulla osta from the Questura', fa: 'گرفتن مجوز nulla osta از Questura' },
        detail: {
          en: 'Issued by the Questura of the province where you will work. It must be no more than 90 days old when you apply for the visa.',
          fa: 'Questura استانی که در آن کار خواهید کرد آن را صادر می‌کند. هنگام درخواست ویزا نباید بیش از ۹۰ روز از صدورش گذشته باشد.',
        },
        link: NY_SELF,
      },
      {
        key: 'visa',
        title: { en: 'Apply for the type D visa', fa: 'درخواست ویزای نوع D' },
        detail: {
          en: 'At the consulate for your place of residence, with the income proof, the nulla osta and proof of lodging.',
          fa: 'در کنسولگری محل سکونت‌تان، با مدرک درآمد، مجوز nulla osta و مدرک محل اقامت.',
        },
        link: VISA_PORTAL,
      },
      {
        key: 'permit',
        title: { en: 'Request the residence permit within 8 working days', fa: 'درخواست اجازه‌ی اقامت ظرف ۸ روز کاری' },
        detail: {
          en: 'Through the post office kit, for the Questura of your province.',
          fa: 'از راه کیت پستی، برای Questura استان محل زندگی.',
        },
        takes: { en: 'About 60 days for the card', fa: 'صدور کارت حدود ۶۰ روز' },
        link: POLIZIA_PERMIT,
      },
    ],
    documents: [
      { key: 'visa-form', label: { en: 'Type D visa application form', fa: 'فرم درخواست ویزای نوع D' }, stage: 'visa' },
      { key: 'photo', label: { en: 'Passport photo', fa: 'عکس گذرنامه‌ای' }, stage: 'visa' },
      { key: 'passport', label: { en: 'Passport valid 3 months beyond the visa', fa: 'گذرنامه با دست‌کم ۳ ماه اعتبار پس از پایان ویزا' }, stage: 'visa' },
      {
        key: 'licensing',
        label: { en: 'Declaration from the licensing office (no older than 3 months)', fa: 'گواهی اداره‌ی صدور مجوز (حداکثر ۳ ماه پیش)' },
        stage: 'visa',
      },
      {
        key: 'parameters',
        label: { en: 'Declaration of reference parameters: resources of at least EUR 14,000', fa: 'گواهی معیارهای مرجع: منابع دست‌کم ۱۴٬۰۰۰ یورو' },
        stage: 'visa',
      },
      { key: 'income', label: { en: 'Proof of previous-year income above EUR 8,500', fa: 'مدرک درآمد سال قبل بیش از ۸٬۵۰۰ یورو' }, stage: 'visa' },
      { key: 'nulla-osta', label: { en: 'Questura nulla osta (within 90 days)', fa: 'مجوز nulla osta از Questura (حداکثر ۹۰ روز پیش)' }, stage: 'visa' },
      { key: 'lodging', label: { en: 'Proof of suitable lodging', fa: 'مدرک محل اقامت مناسب' }, stage: 'visa' },
      { key: 'kit', label: { en: 'Post office permit kit and EUR 16 stamp', fa: 'کیت پستی اقامت و تمبر ۱۶ یورویی' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'quota',
        kind: 'challenge',
        title: { en: '650 places a year for all of Italy', fa: 'سالانه ۶۵۰ جا برای کل ایتالیا' },
        detail: {
          en: 'Self-employment entries are capped at 650 a year for 2026 to 2028, out of about 165,000 total entries.',
          fa: 'ورود برای کار مستقل در سال‌های ۲۰۲۶ تا ۲۰۲۸ به سالانه ۶۵۰ نفر محدود است، از حدود ۱۶۵ هزار ورود کل.',
        },
        source: DPCM_FLUSSI,
      },
      {
        key: 'conversion',
        kind: 'tip',
        title: { en: 'Students already in Italy can convert outside the quota', fa: 'دانشجویان مقیم ایتالیا می‌توانند خارج از سهمیه تبدیل کنند' },
        detail: {
          en: 'Study permits and the EU long-term permit can be converted to self-employment without a numerical cap.',
          fa: 'اجازه‌ی اقامت تحصیلی و اقامت بلندمدت اتحادیه‌ی اروپا را می‌توان بدون سقف عددی به کار مستقل تبدیل کرد.',
        },
        source: DPCM_FLUSSI,
      },
      {
        key: 'nulla-osta-age',
        kind: 'challenge',
        title: { en: 'The nulla osta expires for visa purposes', fa: 'مجوز nulla osta برای ویزا تاریخ مصرف دارد' },
        detail: {
          en: 'The consulate accepts a Questura nulla osta issued within the previous 90 days only.',
          fa: 'کنسولگری فقط مجوزی را می‌پذیرد که Questura در ۹۰ روز گذشته صادر کرده باشد.',
        },
        source: NY_SELF,
      },
      {
        key: 'updating',
        kind: 'tip',
        title: { en: 'Requirements are being updated', fa: 'شرایط در حال به‌روزرسانی است' },
        detail: {
          en: 'The New York consulate notes that the self-employment requirements are being updated. Confirm the list with your consulate before you collect documents.',
          fa: 'کنسولگری نیویورک نوشته است شرایط کار مستقل در حال به‌روزرسانی است. پیش از جمع کردن مدارک، فهرست را با کنسولگری خودتان تطبیق دهید.',
        },
        source: NY_SELF,
      },
    ],
    timeline: IT_TIMELINE,
    quiz: [
      {
        key: 'quota',
        q: { en: 'How many self-employment entries does Italy allow a year (2026–2028)?', fa: 'ایتالیا در سال‌های ۲۰۲۶ تا ۲۰۲۸ سالانه چند ورود برای کار مستقل می‌پذیرد؟' },
        options: [
          { en: '650', fa: '۶۵۰' },
          { en: '6,500', fa: '۶٬۵۰۰' },
          { en: 'No limit', fa: 'بدون سقف' },
        ],
        answer: 0,
        why: { en: 'The DPCM of 2 October 2025 sets 650 a year.', fa: 'فرمان DPCM مورخ ۲ اکتبر ۲۰۲۵ سالانه ۶۵۰ ورود تعیین کرده است.' },
      },
      {
        key: 'resources',
        q: { en: 'What is the minimum for resources for the activity?', fa: 'حداقل منابع لازم برای فعالیت چقدر است؟' },
        options: [
          { en: 'EUR 8,500', fa: '۸٬۵۰۰ یورو' },
          { en: 'EUR 14,000', fa: '۱۴٬۰۰۰ یورو' },
          { en: 'EUR 50,000', fa: '۵۰٬۰۰۰ یورو' },
        ],
        answer: 1,
        why: { en: 'Three times the minimum social welfare yearly income, stated as EUR 14,000.', fa: 'سه برابر حداقل سالانه‌ی رفاه اجتماعی، یعنی ۱۴٬۰۰۰ یورو.' },
      },
      {
        key: 'who',
        q: { en: 'Who issues the nulla osta for self-employment?', fa: 'مجوز nulla osta کار مستقل را چه کسی صادر می‌کند؟' },
        options: [
          { en: 'The Questura', fa: 'Questura' },
          { en: 'The ISV Committee', fa: 'کمیته‌ی ISV' },
          { en: 'The Chamber of Commerce', fa: 'اتاق بازرگانی' },
        ],
        answer: 0,
        why: { en: 'The consulate asks for a nulla osta from the competent Questura.', fa: 'کنسولگری مجوز nulla osta را از Questura صلاحیت‌دار می‌خواهد.' },
      },
      {
        key: 'age',
        q: { en: 'How old can the nulla osta be when you apply for the visa?', fa: 'هنگام درخواست ویزا، حداکثر چند روز می‌تواند از صدور nulla osta گذشته باشد؟' },
        options: [
          { en: '30 days', fa: '۳۰ روز' },
          { en: '90 days', fa: '۹۰ روز' },
          { en: '180 days', fa: '۱۸۰ روز' },
        ],
        answer: 1,
        why: { en: 'The consulate requires it to be issued within the previous 90 days.', fa: 'کنسولگری می‌خواهد در ۹۰ روز گذشته صادر شده باشد.' },
      },
      {
        key: 'income',
        q: { en: 'Which income must you show?', fa: 'کدام درآمد را باید نشان دهید؟' },
        options: [
          { en: 'Previous-year income above EUR 8,500', fa: 'درآمد سال قبل بیش از ۸٬۵۰۰ یورو' },
          { en: 'A bank guarantee', fa: 'ضمانت‌نامه‌ی بانکی' },
          { en: 'Expected Italian income', fa: 'درآمد پیش‌بینی‌شده در ایتالیا' },
        ],
        answer: 0,
        why: { en: 'The consulate asks for income from the preceding fiscal year above EUR 8,500.', fa: 'کنسولگری درآمد سال مالی قبل بیش از ۸٬۵۰۰ یورو را می‌خواهد.' },
      },
    ],
    media: [],
  },

  // ───────────────────────────── STUDY ─────────────────────────────
  'it-study': {
    funds: [
      {
        key: 'living',
        label: { en: 'Means of subsistence, per academic year (2026/27)', fa: 'هزینه‌ی زندگی، برای هر سال تحصیلی (۲۰۲۶/۲۷)' },
        amount: 10_179.85,
        currency: 'EUR',
        basis: 'perYear',
        per: 'person',
        kind: 'show',
        source: PARIS_STUDY,
      },
      {
        key: 'visa-fee',
        label: { en: 'Type D study visa fee (Paris consulate)', fa: 'هزینه‌ی ویزای تحصیلی نوع D (کنسولگری پاریس)' },
        amount: 50,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: PARIS_STUDY,
      },
      ...PERMIT_FEES,
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get admitted and pre-enrol on Universitaly', fa: 'گرفتن پذیرش و پیش‌ثبت‌نام در Universitaly' },
        detail: {
          en: 'The university must validate the pre-enrolment without reservation before you apply for the visa.',
          fa: 'دانشگاه باید پیش‌ثبت‌نام را بدون قید و شرط تأیید کند، پیش از آنکه ویزا را درخواست دهید.',
        },
        link: UNIVERSITALY,
      },
      {
        key: 'funds',
        title: { en: 'Gather proof of funds and insurance', fa: 'جمع کردن مدرک تمکن و بیمه' },
        detail: {
          en: 'EUR 10,179.85 for the year from lawful sources (a blocked account in your name is accepted), a return ticket or funds for it, and an Italian insurance policy for the whole stay.',
          fa: '۱۰٬۱۷۹٫۸۵ یورو برای یک سال از منابع قانونی (حساب مسدود به نام خودتان پذیرفته است)، بلیت بازگشت یا پول آن و بیمه‌نامه‌ای از یک بیمه‌گر ایتالیایی برای کل دوره‌ی اقامت.',
        },
        link: PARIS_STUDY,
      },
      {
        key: 'visa',
        title: { en: 'Apply for the type D study visa by 30 November 2026', fa: 'درخواست ویزای تحصیلی نوع D تا ۳۰ نوامبر ۲۰۲۶' },
        detail: {
          en: 'The deadline applies to bachelor’s and master’s programmes for 2026/27. The fee at the Paris consulate is EUR 50.',
          fa: 'این مهلت برای دوره‌های کارشناسی و کارشناسی ارشد سال ۲۰۲۶/۲۷ است. هزینه در کنسولگری پاریس ۵۰ یورو است.',
        },
        takes: { en: 'Up to 90 days', fa: 'تا ۹۰ روز' },
        link: VISA_PORTAL,
      },
      {
        key: 'permit',
        title: { en: 'Request the study permit within 8 working days of arrival', fa: 'درخواست اجازه‌ی اقامت تحصیلی ظرف ۸ روز کاری پس از ورود' },
        detail: {
          en: 'Through the post office kit, for the Questura of the province where you study.',
          fa: 'از راه کیت پستی، برای Questura استانی که در آن درس می‌خوانید.',
        },
        link: POLIZIA_PERMIT,
      },
    ],
    documents: [
      { key: 'form', label: { en: 'Signed visa application form', fa: 'فرم درخواست ویزای امضاشده' }, stage: 'visa' },
      {
        key: 'passport',
        label: { en: 'Passport valid 3 months beyond the visa, 2 blank pages, issued within 10 years', fa: 'گذرنامه با ۳ ماه اعتبار پس از پایان ویزا، ۲ صفحه‌ی خالی و صادرشده در ۱۰ سال اخیر' },
        stage: 'visa',
      },
      { key: 'photo', label: { en: 'Passport photo', fa: 'عکس گذرنامه‌ای' }, stage: 'visa' },
      { key: 'admission', label: { en: 'Admission letter', fa: 'نامه‌ی پذیرش' }, stage: 'visa' },
      { key: 'universitaly', label: { en: 'Universitaly pre-enrolment summary', fa: 'خلاصه‌ی پیش‌ثبت‌نام Universitaly' }, stage: 'visa' },
      {
        key: 'diplomas',
        label: { en: 'Translated diplomas with declaration of value or CIMEA statements', fa: 'مدارک تحصیلی ترجمه‌شده همراه با Declaration of Value یا گواهی CIMEA' },
        stage: 'visa',
      },
      { key: 'language', label: { en: 'Proof of language level (at least B2)', fa: 'مدرک سطح زبان (دست‌کم B2)' }, stage: 'visa' },
      { key: 'funds', label: { en: 'Proof of EUR 10,179.85 for the year', fa: 'مدرک ۱۰٬۱۷۹٫۸۵ یورو برای یک سال' }, stage: 'visa' },
      { key: 'return', label: { en: 'Return ticket or funds for repatriation', fa: 'بلیت بازگشت یا پول لازم برای بازگشت' }, stage: 'visa' },
      { key: 'lodging', label: { en: 'Proof of accommodation', fa: 'مدرک محل اقامت' }, stage: 'visa' },
      { key: 'insurance', label: { en: 'Insurance from an Italian insurer for the whole stay', fa: 'بیمه از یک بیمه‌گر ایتالیایی برای کل دوره‌ی اقامت' }, stage: 'visa' },
      { key: 'kit', label: { en: 'Post office permit kit and EUR 16 stamp', fa: 'کیت پستی اقامت و تمبر ۱۶ یورویی' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'balance',
        kind: 'myth',
        title: { en: 'A big balance alone is not enough', fa: 'موجودی بالا به‌تنهایی کافی نیست' },
        detail: {
          en: 'The consulate states that the current balance is not sufficient on its own; it wants funds from lawful, traceable sources.',
          fa: 'کنسولگری صریحاً گفته است موجودی فعلی حساب به‌تنهایی کافی نیست و پولی با منشأ قانونی و قابل ردیابی می‌خواهد.',
        },
        source: PARIS_STUDY,
      },
      {
        key: 'deadline',
        kind: 'challenge',
        title: { en: 'Apply by 30 November', fa: 'تا ۳۰ نوامبر درخواست دهید' },
        detail: {
          en: 'For bachelor’s and master’s programmes in 2026/27 the visa request must be filed by 30 November 2026. Processing can take up to 90 days.',
          fa: 'برای دوره‌های کارشناسی و کارشناسی ارشد سال ۲۰۲۶/۲۷، درخواست ویزا باید تا ۳۰ نوامبر ۲۰۲۶ ثبت شود. رسیدگی تا ۹۰ روز طول می‌کشد.',
        },
        source: PARIS_STUDY,
      },
      {
        key: 'convert',
        kind: 'tip',
        title: { en: 'Study can lead to self-employment without the quota', fa: 'تحصیل می‌تواند بدون سهمیه به کار مستقل برسد' },
        detail: {
          en: 'A study permit can be converted to self-employment outside the yearly quota.',
          fa: 'اجازه‌ی اقامت تحصیلی را می‌توان خارج از سهمیه‌ی سالانه به کار مستقل تبدیل کرد.',
        },
        source: DPCM_FLUSSI,
      },
      {
        key: 'funds-change',
        kind: 'tip',
        title: { en: 'The funds figure changes every academic year', fa: 'رقم تمکن هر سال تحصیلی تغییر می‌کند' },
        detail: {
          en: 'EUR 10,179.85 is the 2026/27 figure. Check the consulate page again for later years.',
          fa: '۱۰٬۱۷۹٫۸۵ یورو رقم سال ۲۰۲۶/۲۷ است. برای سال‌های بعد صفحه‌ی کنسولگری را دوباره ببینید.',
        },
        source: PARIS_STUDY,
      },
    ],
    timeline: IT_TIMELINE,
    quiz: [
      {
        key: 'funds',
        q: { en: 'How much must you show for 2026/27?', fa: 'برای سال ۲۰۲۶/۲۷ چه مبلغی باید نشان دهید؟' },
        options: [
          { en: 'EUR 6,079', fa: '۶٬۰۷۹ یورو' },
          { en: 'EUR 10,179.85', fa: '۱۰٬۱۷۹٫۸۵ یورو' },
          { en: 'EUR 14,000', fa: '۱۴٬۰۰۰ یورو' },
        ],
        answer: 1,
        why: { en: 'The consulate sets EUR 10,179.85 a year for 2026/27.', fa: 'کنسولگری برای سال ۲۰۲۶/۲۷ مبلغ ۱۰٬۱۷۹٫۸۵ یورو در سال تعیین کرده است.' },
      },
      {
        key: 'pre-enrolment',
        q: { en: 'Where do you pre-enrol before the visa?', fa: 'پیش از ویزا در کجا پیش‌ثبت‌نام می‌کنید؟' },
        options: [
          { en: 'Universitaly', fa: 'Universitaly' },
          { en: 'The Questura', fa: 'Questura' },
          { en: 'The Chamber of Commerce', fa: 'اتاق بازرگانی' },
        ],
        answer: 0,
        why: { en: 'Pre-enrolment on Universitaly, validated by the university, comes before the visa.', fa: 'پیش‌ثبت‌نام در Universitaly و تأیید آن از سوی دانشگاه پیش از ویزا انجام می‌شود.' },
      },
      {
        key: 'deadline',
        q: { en: 'What is the last day to apply for a 2026/27 degree visa?', fa: 'آخرین مهلت درخواست ویزای دوره‌ی دانشگاهی ۲۰۲۶/۲۷ چه روزی است؟' },
        options: [
          { en: '31 July 2026', fa: '۳۱ ژوئیه‌ی ۲۰۲۶' },
          { en: '30 November 2026', fa: '۳۰ نوامبر ۲۰۲۶' },
          { en: '31 December 2026', fa: '۳۱ دسامبر ۲۰۲۶' },
        ],
        answer: 1,
        why: { en: 'The consulate sets 30 November 2026 for bachelor’s and master’s programmes.', fa: 'کنسولگری برای دوره‌های کارشناسی و کارشناسی ارشد ۳۰ نوامبر ۲۰۲۶ را تعیین کرده است.' },
      },
      {
        key: 'insurance',
        q: { en: 'Which health insurance does the consulate accept?', fa: 'کنسولگری کدام بیمه‌ی درمانی را می‌پذیرد؟' },
        options: [
          { en: 'Any travel insurance', fa: 'هر بیمه‌ی مسافرتی' },
          { en: 'A policy from an Italian insurer for the whole stay', fa: 'بیمه‌نامه‌ی یک بیمه‌گر ایتالیایی برای کل اقامت' },
          { en: 'None is needed', fa: 'بیمه لازم نیست' },
        ],
        answer: 1,
        why: { en: 'The Paris consulate asks for an Italian insurer covering the whole stay.', fa: 'کنسولگری پاریس بیمه‌ای از بیمه‌گر ایتالیایی می‌خواهد که کل اقامت را پوشش دهد.' },
      },
      {
        key: 'processing',
        q: { en: 'How long can the study visa take?', fa: 'رسیدگی به ویزای تحصیلی چقدر ممکن است طول بکشد؟' },
        options: [
          { en: 'Up to 15 days', fa: 'تا ۱۵ روز' },
          { en: 'Up to 90 days', fa: 'تا ۹۰ روز' },
          { en: 'Up to 180 days', fa: 'تا ۱۸۰ روز' },
        ],
        answer: 1,
        why: { en: 'The consulate says type D study visas can take up to 90 days.', fa: 'کنسولگری گفته است بررسی ویزای تحصیلی نوع D تا ۹۰ روز طول می‌کشد.' },
      },
    ],
    media: [],
  },
};

const HDR = 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Table.xlsx';

export const PROFILE_IT: CountryProfile = {
  strengths: [
    {
      en: 'An EU residence with Schengen travel, and an EU long-term permit after 5 years.',
      fa: 'اقامت اتحادیه‌ی اروپا با امکان سفر در شنگن و اقامت بلندمدت اروپایی پس از ۵ سال.',
    },
    {
      en: 'The startup route is fully digital, in English, and the nulla osta usually comes within 30 days.',
      fa: 'مسیر استارتاپ کاملاً دیجیتال و به زبان انگلیسی است و مجوز nulla osta معمولاً ظرف ۳۰ روز صادر می‌شود.',
    },
    {
      en: 'Study funds are moderate for Western Europe: EUR 10,179.85 for 2026/27, and a study permit converts to self-employment outside the quota.',
      fa: 'تمکن تحصیلی برای اروپای غربی معقول است: ۱۰٬۱۷۹٫۸۵ یورو برای سال ۲۰۲۶/۲۷، و اقامت تحصیلی خارج از سهمیه به کار مستقل تبدیل می‌شود.',
    },
    {
      en: 'Italy does not ask new citizens to give up their old nationality.',
      fa: 'ایتالیا از تابعان جدید نمی‌خواهد تابعیت قبلی‌شان را کنار بگذارند.',
    },
  ],
  weaknesses: [
    {
      en: 'Citizenship takes 10 years of legal residence and Italian at B1.',
      fa: 'تابعیت ۱۰ سال اقامت قانونی و زبان ایتالیایی در سطح B1 می‌خواهد.',
    },
    {
      en: 'Ordinary self-employment is capped at 650 entries a year for the whole country.',
      fa: 'کار مستقل معمولی برای کل کشور به سالانه ۶۵۰ ورود محدود است.',
    },
    {
      en: 'Three authorities in a row (committee or Questura, consulate, Questura again) and figures that differ between consulates.',
      fa: 'سه مرجع پشت سر هم (کمیته یا Questura، کنسولگری و دوباره Questura) و ارقامی که در کنسولگری‌ها یکسان نیست.',
    },
    {
      en: 'English is less widely spoken than in Northern Europe: 59th of 123 in the EF index.',
      fa: 'انگلیسی کمتر از شمال اروپا رایج است: رتبه‌ی ۵۹ از ۱۲۳ در شاخص EF.',
    },
  ],
  indicators: [
    { key: 'hdi', rank: 29, of: 193, value: 0.915, year: 2023, source: { url: HDR, checked: CHECKED, label: 'UNDP HDR 2025, data for 2023' } },
    {
      key: 'peace',
      rank: 35,
      of: 163,
      value: 1.712,
      year: 2026,
      source: { url: 'https://www.visionofhumanity.org/wp-content/uploads/2026/06/Global-Peace-Index-2026-A3-map-poster.pdf', checked: CHECKED, label: 'Global Peace Index 2026' },
    },
    {
      key: 'gdp-per-capita',
      value: 43_309,
      unit: 'USD',
      year: 2025,
      source: { url: 'https://api.worldbank.org/v2/country/ITA/indicator/NY.GDP.PCAP.CD?format=json&mrnev=1', checked: CHECKED, label: 'World Bank, current US$' },
    },
    {
      key: 'unemployment',
      value: 6.4,
      unit: '%',
      year: 2025,
      source: { url: 'https://api.worldbank.org/v2/country/ITA/indicator/SL.UEM.TOTL.ZS?format=json&mrnev=1', checked: CHECKED, label: 'World Bank, modeled ILO estimate' },
    },
    { key: 'innovation', rank: 27, of: 139, year: 2026, source: { url: 'https://www.wipo.int/gii-ranking/en/italy', checked: CHECKED, label: 'WIPO Global Innovation Index 2026' } },
    { key: 'english', rank: 59, of: 123, value: 513, year: 2025, source: { url: 'https://www.ef.com/wwen/epi/regions/europe/italy/', checked: CHECKED, label: 'EF EPI 2025' } },
  ],
};
