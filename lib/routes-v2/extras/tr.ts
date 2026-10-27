// Türkiye: route depth (v3) and country profile. Research 2026-10-27, see
// docs/research/app-v3/tr.md. Every figure was read on the official page cited
// next to it on 2026-10-27. Notebooks 17aeaa35-…, 3b63da68-… and d95f264d-…
// were used for leads only; their cost tables (technopark USD 100, notary,
// card and company fees) rest on consultants' meetings and are NOT used.
// turkiyetechvisa.gov.tr timed out and goc.gov.tr returned 500 on that date, so
// residence rules come from Law 6458 on mevzuat.gov.tr and the e-ikamet
// checklists, and capital rules from the ÇSGB work-permit criteria.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const CHECKED = '2026-10-27';

const TECH_VISA = 'https://turkiyetechvisa.gov.tr/en/start-up'; // timed out 2026-10-27; linked as the place the step is done
const INVEST_TECH_VISA = 'https://www.invest.gov.tr/en/news/news-from-turkey/pages/turkiye-launches-tech-visa-program-attract-global-talent-innovators.aspx'; // 24 Sep 2024
const INVEST_WORK_PERMIT = 'https://www.invest.gov.tr/en/investmentguide/pages/obtaining-a-work-permit.aspx';
const CSGB_CRITERIA = 'https://calismaizni.csgb.gov.tr/calisma-izni/-calisma-izni-degerlendirme-kriterleri/';
const E_IZIN = 'https://ecalismaizni.csgb.gov.tr/eizin';
const TURQUOISE = 'https://www.csgb.gov.tr/uigm/en/turkuaz-kart/';
const LAW_6458 = 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6458.pdf';
const LAW_5901 = 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5901.pdf';
const E_IKAMET = 'https://e-ikamet.goc.gov.tr/';
const E_IKAMET_SHORT = 'https://e-ikamet.goc.gov.tr/Ikamet/BasvuruIstenenBelgeler/BasvuruFormuIstenenBelgeler?tur=0';
const E_IKAMET_STUDENT = 'https://e-ikamet.goc.gov.tr/Ikamet/BasvuruIstenenBelgeler/BasvuruFormuIstenenBelgeler?tur=5';
const STUDY_IN = 'https://www.studyinturkiye.gov.tr/';
const SCHOLARSHIPS = 'https://www.turkiyeburslari.gov.tr/';
const NB_TR = '17aeaa35-bcea-4b07-b817-7639bfafb337';
const NB_SEMINAR = '3b63da68-2336-4e63-9ede-76709749bda6';
const NB_COSTS = 'd95f264d-3145-4330-895a-4adb87c59167';

const TR_TIMELINE: Timeline = {
  prAfterYears: 8,
  citizenshipAfterYears: 5,
  dualCitizenship: 'allowed',
  language: {
    en: 'Citizenship: enough Turkish to get by (no level is set in the law). No language test for long-term residence.',
    fa: 'تابعیت: ترکی در حد کافی برای گفت‌وگو (قانون سطح مشخصی تعیین نکرده است). برای اقامت بلندمدت آزمون زبان لازم نیست.',
  },
  note: {
    en: 'Long-term residence after 8 years of uninterrupted residence permits, with steady income and health insurance (Law 6458, Art. 42–43). Citizenship can be requested after 5 years of uninterrupted residence (Law 5901, Art. 11), so it can come before long-term residence. Student years count half. Türkiye records multiple citizenship (Art. 44).',
    fa: 'اقامت بلندمدت پس از ۸ سال اقامت پیوسته، با درآمد کافی و منظم و بیمه‌ی درمانی (قانون ۶۴۵۸، مواد ۴۲ و ۴۳). درخواست تابعیت پس از ۵ سال اقامت پیوسته ممکن است (قانون ۵۹۰۱، ماده‌ی ۱۱)، یعنی تابعیت می‌تواند زودتر از اقامت بلندمدت برسد. سال‌های تحصیل نصف حساب می‌شود. ترکیه چندتابعیتی را می‌پذیرد (ماده‌ی ۴۴).',
  },
  source: LAW_5901,
};

const PARTNER_FUNDS = [
  {
    key: 'partner-capital',
    label: { en: 'Capital contributed by each foreign partner', fa: 'سرمایه‌ی آورده‌ی هر شریک خارجی' },
    amount: 500_000,
    currency: 'TRY' as const,
    basis: 'once' as const,
    per: 'founder' as const,
    kind: 'invest' as const,
    source: CSGB_CRITERIA,
  },
  {
    key: 'usd-alternative',
    label: { en: 'Or a capital share of at least USD 100,000 each (waives the TRY, 20% and hiring rules)', fa: 'یا سهم سرمایه‌ی دست‌کم ۱۰۰٬۰۰۰ دلاری برای هر نفر (شرط لیر، سهم ۲۰ درصدی و استخدام را برمی‌دارد)' },
    amount: 100_000,
    currency: 'USD' as const,
    basis: 'once' as const,
    per: 'founder' as const,
    kind: 'invest' as const,
    source: CSGB_CRITERIA,
  },
];

const FAMILY_STEP = {
  key: 'family',
  title: { en: 'Bring your spouse and children', fa: 'آوردن همسر و فرزندان' },
  detail: {
    en: 'A family residence permit covers a spouse and minor or dependent children, up to 3 years at a time and never longer than your own permit.',
    fa: 'اقامت خانوادگی همسر و فرزندان زیر ۱۸ سال یا تحت تکفل را در بر می‌گیرد؛ هر بار حداکثر ۳ سال و هرگز بیشتر از مدت اقامت خودتان.',
  },
  link: E_IKAMET,
};

const RESIDENCE_DOCS = [
  { key: 'res-form', label: { en: 'Residence permit application form (first page, signed)', fa: 'فرم درخواست اجازه‌ی اقامت (صفحه‌ی اول، امضاشده)' }, stage: 'permit' as const },
  { key: 'res-passport', label: { en: 'Passport copy (identity page and visa)', fa: 'کپی گذرنامه (صفحه‌ی مشخصات و ویزا)' }, stage: 'permit' as const },
  { key: 'res-fee', label: { en: 'Receipt for the permit card fee', fa: 'رسید پرداخت هزینه‌ی کارت اقامت' }, stage: 'permit' as const },
  {
    key: 'res-address',
    label: { en: 'Proof of address (notarised lease, title deed, hotel or dorm letter)', fa: 'مدرک نشانی (اجاره‌نامه‌ی محضری، سند ملک، نامه‌ی هتل یا خوابگاه)' },
    stage: 'permit' as const,
  },
  { key: 'res-insurance', label: { en: 'Health insurance covering the whole permit period', fa: 'بیمه‌ی درمانی برای کل مدت اقامت' }, stage: 'permit' as const },
];

export const EXTRAS_TR: Record<string, RouteExtras> = {
  // ───────────────────────────── TECH VISA ─────────────────────────────
  'tr-tech-visa': {
    funds: PARTNER_FUNDS,
    steps: [
      {
        key: 'apply',
        title: { en: 'Apply on the Türkiye Tech Visa portal', fa: 'درخواست در سامانه‌ی Türkiye Tech Visa' },
        detail: {
          en: 'Upload your profile, CV and business plan. The programme targets founders with innovative, technology-based business models.',
          fa: 'مشخصات، رزومه و طرح کسب‌وکار را بارگذاری کنید. برنامه برای بنیان‌گذارانی است که مدل کسب‌وکار نوآورانه و مبتنی بر فناوری دارند.',
        },
        link: TECH_VISA,
      },
      {
        key: 'evaluation',
        title: { en: 'Technopark evaluation', fa: 'ارزیابی در تکنوپارک' },
        detail: {
          en: 'A technology development zone assesses the venture, usually with a pitch by the founders themselves. The Ministry of Industry and Technology then gives its opinion.',
          fa: 'یک منطقه‌ی توسعه‌ی فناوری طرح را ارزیابی می‌کند، معمولاً با ارائه‌ی خود بنیان‌گذاران. سپس وزارت صنعت و فناوری نظر خود را اعلام می‌کند.',
        },
        link: TECH_VISA,
      },
      {
        key: 'work-permit',
        title: { en: 'Work permit through e-İzin', fa: 'اجازه‌ی کار از سامانه‌ی e-İzin' },
        detail: {
          en: 'Participants receive a special 3-year work permit. From abroad you file at a Turkish consulate and get a 16-digit reference number.',
          fa: 'شرکت‌کنندگان اجازه‌ی کار ویژه‌ی ۳ ساله می‌گیرند. از خارج از ترکیه، درخواست را در کنسولگری ترکیه ثبت می‌کنید و یک کد پیگیری ۱۶ رقمی می‌گیرید.',
        },
        takes: { en: '30 days once the file is complete', fa: '۳۰ روز پس از کامل شدن پرونده' },
        link: E_IZIN,
      },
      {
        key: 'company',
        title: { en: 'Set up the company in the technopark', fa: 'تأسیس شرکت در تکنوپارک' },
        detail: {
          en: 'Each foreign partner holds at least 20% and brings TRY 500,000, or a share of USD 100,000 or more. Whether the technopark exemption (B.5.2) lifts these rules for founders is not stated.',
          fa: 'هر شریک خارجی دست‌کم ۲۰ درصد سهم دارد و ۵۰۰٬۰۰۰ لیر سرمایه می‌آورد، یا سهمی ۱۰۰٬۰۰۰ دلاری یا بیشتر. اینکه معافیت تکنوپارک (B.5.2) این شرط‌ها را از بنیان‌گذاران برمی‌دارد یا نه، روشن نشده است.',
        },
        link: CSGB_CRITERIA,
      },
      FAMILY_STEP,
    ],
    documents: [
      { key: 'cv', label: { en: 'CV and proof of technical expertise', fa: 'رزومه و مدرک تخصص فنی' }, stage: 'apply' },
      { key: 'plan', label: { en: 'Business plan for a technology-based venture', fa: 'طرح کسب‌وکار برای یک کسب‌وکار مبتنی بر فناوری' }, stage: 'apply' },
      { key: 'wp-passport', label: { en: 'Passport (for the work permit)', fa: 'گذرنامه (برای اجازه‌ی کار)' }, stage: 'visa' },
      { key: 'wp-photo', label: { en: 'Photo', fa: 'عکس' }, stage: 'visa' },
      { key: 'wp-contract', label: { en: 'Employment contract or the company role document', fa: 'قرارداد کار یا سند سمت در شرکت' }, stage: 'visa' },
      ...RESIDENCE_DOCS,
    ],
    realities: [
      {
        key: 'five-turks',
        kind: 'myth',
        title: { en: '“Tech Visa founders never have to hire five Turks”', fa: '«بنیان‌گذاران تک‌ویزا هیچ‌وقت لازم نیست پنج ترک استخدام کنند»' },
        detail: {
          en: 'The general rule asks for 5 Turkish employees per foreign partner from month 7. A separate rule exempts people working inside a technology development zone with a positive ministry opinion, but it does not name company partners. Treat the exemption as unconfirmed.',
          fa: 'قاعده‌ی عمومی از ماه هفتم پنج کارمند ترک به ازای هر شریک خارجی می‌خواهد. قاعده‌ی دیگری کسانی را که با نظر مثبت وزارتخانه در منطقه‌ی توسعه‌ی فناوری کار می‌کنند معاف می‌کند، اما از شرکای شرکت نامی نمی‌برد. این معافیت را تأییدنشده بدانید.',
        },
        source: CSGB_CRITERIA,
      },
      {
        key: 'share',
        kind: 'myth',
        title: { en: 'The share rule is 20%, not 25%', fa: 'حداقل سهم ۲۰ درصد است، نه ۲۵ درصد' },
        detail: {
          en: 'Seminar material speaks of 25% and at most 4 founders. The Ministry of Labour criteria ask each foreign partner for at least 20%. Shares do not have to be equal.',
          fa: 'در مطالب سمینارها از ۲۵ درصد و حداکثر ۴ بنیان‌گذار صحبت شده است. معیارهای وزارت کار از هر شریک خارجی دست‌کم ۲۰ درصد سهم می‌خواهد. لازم نیست سهم‌ها برابر باشد.',
        },
        source: CSGB_CRITERIA,
      },
      {
        key: 'lira',
        kind: 'challenge',
        title: { en: 'Lira thresholds move', fa: 'آستانه‌های لیری ثابت نمی‌ماند' },
        detail: {
          en: 'The partner capital rose to TRY 500,000 on 1 January 2025; until then TRY 40,000 was accepted. Check the current figure before you plan the money.',
          fa: 'سرمایه‌ی شریک از ۱ ژانویه‌ی ۲۰۲۵ به ۵۰۰٬۰۰۰ لیر رسید؛ تا پیش از آن ۴۰٬۰۰۰ لیر پذیرفته می‌شد. پیش از برنامه‌ریزی مالی، رقم روز را بررسی کنید.',
        },
        source: CSGB_CRITERIA,
      },
      {
        key: 'guidance',
        kind: 'tip',
        title: { en: 'Six months of guidance comes with the visa', fa: 'شش ماه راهنمایی همراه ویزا' },
        detail: {
          en: 'Accepted founders get expert help with legal, financial and technical questions for their first six months.',
          fa: 'بنیان‌گذاران پذیرفته‌شده در شش ماه نخست برای مسائل حقوقی، مالی و فنی راهنمایی کارشناسی می‌گیرند.',
        },
        source: INVEST_TECH_VISA,
      },
      {
        key: 'citizenship-five',
        kind: 'tip',
        title: { en: 'Citizenship can come before long-term residence', fa: 'تابعیت ممکن است زودتر از اقامت بلندمدت برسد' },
        detail: {
          en: 'Naturalisation needs 5 years of uninterrupted residence; long-term residence needs 8.',
          fa: 'تابعیت به ۵ سال اقامت پیوسته نیاز دارد و اقامت بلندمدت به ۸ سال.',
        },
        source: LAW_5901,
      },
      {
        key: 'free-appointments',
        kind: 'tip',
        title: { en: 'Residence appointments are free', fa: 'نوبت اقامت رایگان است' },
        detail: {
          en: 'The migration authority books appointments free of charge on e-ikamet and warns against anyone who asks for a fee.',
          fa: 'اداره‌ی مهاجرت نوبت‌ها را رایگان در e-ikamet می‌دهد و درباره‌ی کسانی که برای نوبت پول می‌خواهند هشدار داده است.',
        },
        source: E_IKAMET_SHORT,
      },
    ],
    timeline: TR_TIMELINE,
    quiz: [
      {
        key: 'permit-length',
        q: { en: 'How long is the Tech Visa work permit?', fa: 'اجازه‌ی کار تک‌ویزا چند ساله است؟' },
        options: [
          { en: '1 year', fa: '۱ سال' },
          { en: '3 years', fa: '۳ سال' },
          { en: '5 years', fa: '۵ سال' },
        ],
        answer: 1,
        why: { en: 'Participants receive a special three-year work permit.', fa: 'شرکت‌کنندگان اجازه‌ی کار ویژه‌ی سه‌ساله می‌گیرند.' },
      },
      {
        key: 'capital',
        q: { en: 'What capital does the general rule ask of each foreign partner?', fa: 'قاعده‌ی عمومی از هر شریک خارجی چه سرمایه‌ای می‌خواهد؟' },
        options: [
          { en: 'TRY 40,000', fa: '۴۰٬۰۰۰ لیر' },
          { en: 'TRY 500,000', fa: '۵۰۰٬۰۰۰ لیر' },
          { en: 'TRY 8,000,000', fa: '۸٬۰۰۰٬۰۰۰ لیر' },
        ],
        answer: 1,
        why: { en: 'ÇSGB criterion C.1.1 sets TRY 500,000 from 1 January 2025.', fa: 'معیار C.1.1 وزارت کار از ۱ ژانویه‌ی ۲۰۲۵ رقم ۵۰۰٬۰۰۰ لیر را تعیین کرده است.' },
      },
      {
        key: 'usd',
        q: { en: 'Which capital share waives the TRY and hiring rules?', fa: 'کدام سهم سرمایه شرط لیر و استخدام را برمی‌دارد؟' },
        options: [
          { en: 'USD 50,000', fa: '۵۰٬۰۰۰ دلار' },
          { en: 'USD 100,000', fa: '۱۰۰٬۰۰۰ دلار' },
          { en: 'USD 400,000', fa: '۴۰۰٬۰۰۰ دلار' },
        ],
        answer: 1,
        why: { en: 'Criterion C.1.2 exempts partners with a capital share of USD 100,000 or more.', fa: 'معیار C.1.2 شریکی را که سهم سرمایه‌اش ۱۰۰٬۰۰۰ دلار یا بیشتر است معاف می‌کند.' },
      },
      {
        key: 'share',
        q: { en: 'What minimum share must each foreign partner hold?', fa: 'هر شریک خارجی دست‌کم چه سهمی باید داشته باشد؟' },
        options: [
          { en: '10%', fa: '۱۰ درصد' },
          { en: '20%', fa: '۲۰ درصد' },
          { en: '25%', fa: '۲۵ درصد' },
          { en: '51%', fa: '۵۱ درصد' },
        ],
        answer: 1,
        why: { en: 'Criterion C.1.1 asks for at least a 20% share.', fa: 'معیار C.1.1 دست‌کم ۲۰ درصد سهم می‌خواهد.' },
      },
      {
        key: 'citizenship',
        q: { en: 'After how many years of residence can you apply for citizenship?', fa: 'پس از چند سال اقامت می‌توانید تابعیت را درخواست کنید؟' },
        options: [
          { en: '3', fa: '۳' },
          { en: '5', fa: '۵' },
          { en: '8', fa: '۸' },
        ],
        answer: 1,
        why: { en: 'Law 5901, Art. 11 asks for 5 years of uninterrupted residence.', fa: 'ماده‌ی ۱۱ قانون ۵۹۰۱ پنج سال اقامت پیوسته می‌خواهد.' },
      },
    ],
    media: [
      { notebookId: NB_SEMINAR, kind: 'video', title: 'The Red Tape Bypass: Unpacking the Turkey Tech Visa' },
      { notebookId: NB_SEMINAR, kind: 'slides', title: 'Turkey Tech Visa Strategic Blueprint' },
      { notebookId: NB_TR, kind: 'infographic', title: 'نقشه راه مالی ویزای استارتاپ ترکیه' },
      { notebookId: NB_TR, kind: 'infographic', title: 'نقشه راه ویزای تکنولوژی ترکیه' },
      { notebookId: NB_TR, kind: 'slides', title: 'Turkey Tech Visa Strategy' },
      { notebookId: NB_TR, kind: 'slides', title: 'Türkiye Tech Visa Blueprint (2)' },
      { notebookId: NB_TR, kind: 'slides', title: 'Türkiye Tech Visa Blueprint (6 sources)' },
      { notebookId: NB_TR, kind: 'slides', title: 'Türkiye Tech Visa Blueprint (5 sources)' },
      { notebookId: NB_COSTS, kind: 'slides', title: 'Turkish Technopark Strategic Atlas' },
      { notebookId: NB_COSTS, kind: 'slides', title: 'Turkey Startup Blueprint' },
      { notebookId: NB_COSTS, kind: 'slides', title: 'Turkey Strategic Bridge' },
      { notebookId: NB_COSTS, kind: 'infographic', title: 'راهنمای تکنوپارک‌های برتر برای استارتاپ‌ها' },
      { notebookId: NB_COSTS, kind: 'infographic', title: 'گزارش شفافیت مالی استارتاپ ترکیه' },
      { notebookId: NB_COSTS, kind: 'infographic', title: 'راهنمای جامع ویزای استارتاپ ترکیه' },
      { notebookId: NB_COSTS, kind: 'infographic', title: 'راهنمای هزینه‌های ویزای استارتاپ ترکیه' },
      { notebookId: NB_COSTS, kind: 'infographic', title: 'راهنمای ویزای استارتاپ ترکیه' },
    ],
  },

  // ───────────────────────────── TURQUOISE CARD ─────────────────────────────
  'tr-turquoise-card': {
    funds: [],
    steps: [
      {
        key: 'category',
        title: { en: 'Check which category fits you', fa: 'بررسی اینکه در کدام گروه قرار می‌گیرید' },
        detail: {
          en: 'Highly qualified worker or investor, scientist or researcher in a strategic field, internationally successful in culture, arts or sport, or someone who raises Türkiye’s profile.',
          fa: 'نیروی کار یا سرمایه‌گذار بسیار ماهر، دانشمند یا پژوهشگر در حوزه‌ای راهبردی، فرد موفق بین‌المللی در فرهنگ، هنر یا ورزش، یا کسی که به شناخته شدن ترکیه کمک می‌کند.',
        },
        link: TURQUOISE,
      },
      {
        key: 'apply',
        title: { en: 'Apply to the Ministry of Labour', fa: 'درخواست به وزارت کار' },
        detail: {
          en: 'The International Labour Force directorate assesses education, experience, wage, investment or exports and the effect on employment.',
          fa: 'اداره‌ی کل نیروی کار بین‌المللی تحصیلات، سابقه، حقوق، سرمایه‌گذاری یا صادرات و اثر آن بر اشتغال را ارزیابی می‌کند.',
        },
        link: TURQUOISE,
      },
      {
        key: 'transition',
        title: { en: 'Three-year transition period', fa: 'دوره‌ی گذار سه‌ساله' },
        detail: {
          en: 'The card is first issued with a 3-year transition period. The ministry may ask about your activities during it.',
          fa: 'کارت ابتدا با دوره‌ی گذار ۳ ساله صادر می‌شود. وزارتخانه ممکن است در این مدت درباره‌ی فعالیت‌هایتان اطلاعات بخواهد.',
        },
        link: TURQUOISE,
      },
      {
        key: 'indefinite',
        title: { en: 'Apply in the last 180 days to make it indefinite', fa: 'درخواست در ۱۸۰ روز پایانی برای دائمی شدن' },
        detail: {
          en: 'Apply within the 180 days before the transition period ends. Miss it and the card becomes invalid.',
          fa: 'در ۱۸۰ روز پیش از پایان دوره‌ی گذار درخواست دهید. اگر این مهلت بگذرد، کارت باطل می‌شود.',
        },
        link: TURQUOISE,
      },
      {
        key: 'citizenship',
        title: { en: 'Exceptional citizenship is possible', fa: 'امکان تابعیت استثنایی' },
        detail: {
          en: 'Turquoise Card holders, their spouse and minor children can be granted citizenship by Presidential decision.',
          fa: 'دارندگان کارت فیروزه‌ای، همسر و فرزندان زیر ۱۸ سالشان می‌توانند با تصمیم رئیس‌جمهور تابعیت بگیرند.',
        },
        link: LAW_5901,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport', fa: 'گذرنامه' }, stage: 'apply' },
      {
        key: 'evidence',
        label: { en: 'Evidence for your category: degrees, experience, wage, investment or exports, awards', fa: 'مدارک گروه شما: مدرک تحصیلی، سابقه، حقوق، سرمایه‌گذاری یا صادرات، جوایز' },
        note: { en: 'The ministry does not publish a fixed checklist or points table.', fa: 'وزارتخانه چک‌لیست ثابت یا جدول امتیاز منتشر نمی‌کند.' },
        stage: 'apply',
      },
      { key: 'renewal', label: { en: 'Application to lift the transition period (last 180 days)', fa: 'درخواست برداشتن دوره‌ی گذار (۱۸۰ روز پایانی)' }, stage: 'renewal' },
    ],
    realities: [
      {
        key: 'no-price',
        kind: 'myth',
        title: { en: 'There is no published price for the card', fa: 'برای این کارت قیمت اعلام‌شده‌ای وجود ندارد' },
        detail: {
          en: 'The ministry publishes categories, not investment or salary figures. Amounts you see online belong to other regimes such as citizenship by investment.',
          fa: 'وزارتخانه فقط گروه‌ها را منتشر می‌کند، نه رقم سرمایه‌گذاری یا حقوق. ارقامی که در اینترنت می‌بینید مربوط به مسیرهای دیگری مثل تابعیت از راه سرمایه‌گذاری است.',
        },
        source: TURQUOISE,
      },
      {
        key: 'discretion',
        kind: 'challenge',
        title: { en: 'The decision is discretionary', fa: 'تصمیم به صلاحدید وزارتخانه است' },
        detail: {
          en: 'Applications are judged on education, experience, contribution to science and technology and economic impact, with no published threshold.',
          fa: 'درخواست‌ها بر پایه‌ی تحصیلات، سابقه، سهم در علم و فناوری و اثر اقتصادی سنجیده می‌شود و آستانه‌ی منتشرشده‌ای ندارد.',
        },
        source: TURQUOISE,
      },
      {
        key: 'family',
        kind: 'tip',
        title: { en: 'Your family gets residence with you', fa: 'خانواده‌تان همراه شما اقامت می‌گیرد' },
        detail: {
          en: 'The spouse and dependent children receive a document that serves as their residence permit.',
          fa: 'همسر و فرزندان تحت تکفل سندی می‌گیرند که اجازه‌ی اقامت آن‌ها حساب می‌شود.',
        },
        source: TURQUOISE,
      },
      {
        key: 'deadline',
        kind: 'challenge',
        title: { en: 'Missing the 180-day window cancels the card', fa: 'از دست دادن مهلت ۱۸۰ روزه کارت را باطل می‌کند' },
        detail: {
          en: 'If you do not apply before the transition period ends, the application is refused and the card becomes invalid.',
          fa: 'اگر پیش از پایان دوره‌ی گذار درخواست ندهید، درخواست رد و کارت باطل می‌شود.',
        },
        source: TURQUOISE,
      },
    ],
    timeline: {
      prAfterYears: 3,
      citizenshipAfterYears: 5,
      dualCitizenship: 'allowed',
      language: TR_TIMELINE.language,
      note: {
        en: 'The card becomes indefinite after the 3-year transition period if you apply in time. Holders can also be granted exceptional citizenship by Presidential decision (Law 5901, Art. 12), outside the 5-year rule.',
        fa: 'اگر به‌موقع درخواست دهید، کارت پس از دوره‌ی گذار ۳ ساله دائمی می‌شود. دارندگان کارت ممکن است با تصمیم رئیس‌جمهور تابعیت استثنایی بگیرند (قانون ۵۹۰۱، ماده‌ی ۱۲)، بیرون از قاعده‌ی ۵ سال.',
      },
      source: TURQUOISE,
    },
    quiz: [
      {
        key: 'transition',
        q: { en: 'How long is the transition period?', fa: 'دوره‌ی گذار چقدر است؟' },
        options: [
          { en: '1 year', fa: '۱ سال' },
          { en: '3 years', fa: '۳ سال' },
          { en: '5 years', fa: '۵ سال' },
        ],
        answer: 1,
        why: { en: 'The card is granted with a provisional period of the first three years.', fa: 'کارت با دوره‌ی موقت سه سال نخست صادر می‌شود.' },
      },
      {
        key: 'window',
        q: { en: 'When must you apply to make the card indefinite?', fa: 'برای دائمی شدن کارت چه زمانی باید درخواست دهید؟' },
        options: [
          { en: 'Any time after year 1', fa: 'هر زمانی پس از سال اول' },
          { en: 'Within 180 days before the transition period ends', fa: 'در ۱۸۰ روز پیش از پایان دوره‌ی گذار' },
          { en: 'After the card expires', fa: 'پس از پایان اعتبار کارت' },
        ],
        answer: 1,
        why: { en: 'The ministry requires the application within the last 180 days.', fa: 'وزارتخانه درخواست را در ۱۸۰ روز پایانی می‌خواهد.' },
      },
      {
        key: 'excluded',
        q: { en: 'Who cannot get the card?', fa: 'چه کسی نمی‌تواند این کارت را بگیرد؟' },
        options: [
          { en: 'Researchers', fa: 'پژوهشگران' },
          { en: 'People under temporary protection', fa: 'افراد تحت حمایت موقت' },
          { en: 'Investors', fa: 'سرمایه‌گذاران' },
        ],
        answer: 1,
        why: { en: 'Foreigners under temporary protection are not eligible.', fa: 'خارجیان تحت حمایت موقت واجد شرایط نیستند.' },
      },
      {
        key: 'family',
        q: { en: 'Which family members get residence with the holder?', fa: 'کدام اعضای خانواده همراه دارنده‌ی کارت اقامت می‌گیرند؟' },
        options: [
          { en: 'Spouse and dependent children', fa: 'همسر و فرزندان تحت تکفل' },
          { en: 'Parents only', fa: 'فقط والدین' },
          { en: 'No one', fa: 'هیچ‌کس' },
        ],
        answer: 0,
        why: { en: 'The spouse and dependent children receive a document that serves as a residence permit.', fa: 'همسر و فرزندان تحت تکفل سندی می‌گیرند که اجازه‌ی اقامت حساب می‌شود.' },
      },
      {
        key: 'price',
        q: { en: 'What investment amount is published for the card?', fa: 'چه مبلغ سرمایه‌گذاری برای این کارت اعلام شده است؟' },
        options: [
          { en: 'USD 400,000', fa: '۴۰۰٬۰۰۰ دلار' },
          { en: 'USD 500,000', fa: '۵۰۰٬۰۰۰ دلار' },
          { en: 'None is published', fa: 'رقمی اعلام نشده است' },
        ],
        answer: 2,
        why: { en: 'The ministry lists categories and criteria but no amount.', fa: 'وزارتخانه گروه‌ها و معیارها را آورده، اما مبلغی اعلام نکرده است.' },
      },
    ],
    media: [],
  },

  // ───────────────────────────── COMPANY FORMATION ─────────────────────────────
  'tr-company-formation': {
    funds: [
      ...PARTNER_FUNDS,
      {
        key: 'company-capital',
        label: { en: 'Paid-in capital of the company (all partners together)', fa: 'سرمایه‌ی پرداخت‌شده‌ی شرکت (همه‌ی شرکا با هم)' },
        amount: 500_000,
        currency: 'TRY',
        basis: 'once',
        per: 'team',
        kind: 'invest',
        source: CSGB_CRITERIA,
      },
    ],
    steps: [
      {
        key: 'visa',
        title: { en: 'Enter on a visa that matches the purpose', fa: 'ورود با ویزای متناسب با هدف' },
        detail: {
          en: 'The residence checklist for people setting up a business asks for a visa obtained for that purpose from a Turkish mission.',
          fa: 'چک‌لیست اقامت برای کسانی که کسب‌وکار راه می‌اندازند ویزایی می‌خواهد که برای همین هدف از نمایندگی ترکیه گرفته شده باشد.',
        },
        link: E_IKAMET_SHORT,
      },
      {
        key: 'company',
        title: { en: 'Register the company and pay in the capital', fa: 'ثبت شرکت و واریز سرمایه' },
        detail: {
          en: 'At least TRY 500,000 paid-in capital, with each foreign partner holding 20% or more and TRY 500,000 of it, or a share of USD 100,000 or more.',
          fa: 'دست‌کم ۵۰۰٬۰۰۰ لیر سرمایه‌ی پرداخت‌شده، با سهم ۲۰ درصد یا بیشتر و ۵۰۰٬۰۰۰ لیر برای هر شریک خارجی، یا سهمی ۱۰۰٬۰۰۰ دلاری یا بیشتر.',
        },
        link: CSGB_CRITERIA,
      },
      {
        key: 'residence',
        title: { en: 'Short-term residence permit', fa: 'اجازه‌ی اقامت کوتاه‌مدت' },
        detail: {
          en: 'Apply on e-ikamet with notarised company documents. Short-term permits are issued for up to 2 years at a time and do not allow work.',
          fa: 'در e-ikamet با اسناد محضری شرکت درخواست دهید. اقامت کوتاه‌مدت هر بار حداکثر ۲ سال صادر می‌شود و اجازه‌ی کار نمی‌دهد.',
        },
        link: E_IKAMET,
      },
      {
        key: 'work-permit',
        title: { en: 'Work permit if you will manage the company', fa: 'اجازه‌ی کار اگر شرکت را اداره می‌کنید' },
        detail: {
          en: 'File through e-İzin. A complete file is reviewed within 30 days.',
          fa: 'درخواست را از e-İzin ثبت کنید. پرونده‌ی کامل ظرف ۳۰ روز بررسی می‌شود.',
        },
        takes: { en: '30 days', fa: '۳۰ روز' },
        link: E_IZIN,
      },
      {
        key: 'hiring',
        title: { en: 'Hire five Turkish citizens from month 7', fa: 'استخدام پنج شهروند ترک از ماه هفتم' },
        detail: {
          en: 'From the seventh month of the first permit, at least 5 Turkish citizens per foreign partner, unless your share is USD 100,000 or more.',
          fa: 'از ماه هفتم نخستین اجازه‌ی کار، دست‌کم ۵ شهروند ترک به ازای هر شریک خارجی، مگر آنکه سهم شما ۱۰۰٬۰۰۰ دلار یا بیشتر باشد.',
        },
        link: CSGB_CRITERIA,
      },
      FAMILY_STEP,
    ],
    documents: [
      ...RESIDENCE_DOCS,
      { key: 'visa', label: { en: 'Visa obtained for this purpose from a Turkish mission', fa: 'ویزای گرفته‌شده برای همین هدف از نمایندگی ترکیه' }, stage: 'permit' },
      { key: 'activity', label: { en: 'Notarised company activity certificate', fa: 'گواهی فعالیت شرکت، محضری' }, stage: 'permit' },
      { key: 'tax', label: { en: 'Notarised tax registration (vergi levhası)', fa: 'گواهی ثبت مالیاتی (vergi levhası)، محضری' }, stage: 'permit' },
      { key: 'gazette', label: { en: 'Notarised trade registry gazette', fa: 'روزنامه‌ی ثبت تجاری، محضری' }, stage: 'permit' },
      { key: 'signature', label: { en: 'Notarised signature circular', fa: 'نمونه‌امضای محضری' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'no-work',
        kind: 'myth',
        title: { en: 'A company does not give you the right to work', fa: 'داشتن شرکت حق کار نمی‌دهد' },
        detail: {
          en: 'The short-term residence permit for setting up a business is a residence permit only. Managing the company needs a separate work permit.',
          fa: 'اقامت کوتاه‌مدت برای راه‌اندازی کسب‌وکار فقط اجازه‌ی اقامت است. اداره‌ی شرکت اجازه‌ی کار جداگانه می‌خواهد.',
        },
        source: LAW_6458,
      },
      {
        key: 'hiring',
        kind: 'challenge',
        title: { en: 'Five employees per foreigner is a monthly test', fa: 'پنج کارمند به ازای هر خارجی، هر ماه بررسی می‌شود' },
        detail: {
          en: 'From month 7 the company must employ at least five Turkish citizens every month. A USD 100,000 share waives the rule.',
          fa: 'از ماه هفتم شرکت باید هر ماه دست‌کم پنج شهروند ترک در استخدام داشته باشد. سهم ۱۰۰٬۰۰۰ دلاری این شرط را برمی‌دارد.',
        },
        source: CSGB_CRITERIA,
      },
      {
        key: 'thirty-days',
        kind: 'tip',
        title: { en: 'The 30-day clock starts when the file is complete', fa: 'شمارش ۳۰ روزه از کامل شدن پرونده شروع می‌شود' },
        detail: {
          en: 'If the ministry asks for more documents, the 30 days run from the day you upload them.',
          fa: 'اگر وزارتخانه مدرک بیشتری بخواهد، ۳۰ روز از روزی که آن را بارگذاری می‌کنید شمرده می‌شود.',
        },
        source: INVEST_WORK_PERMIT,
      },
      {
        key: 'absence',
        kind: 'challenge',
        title: { en: 'Long absences reset the clock', fa: 'غیبت طولانی شمارش را از صفر شروع می‌کند' },
        detail: {
          en: 'More than 6 months abroad in one year, or more than 1 year in total over 5 years, breaks residence for the 8-year count.',
          fa: 'بیش از ۶ ماه خارج از ترکیه در یک سال، یا در مجموع بیش از ۱ سال در ۵ سال، پیوستگی اقامت را برای شمارش ۸ سال قطع می‌کند.',
        },
        source: LAW_6458,
      },
      {
        key: 'free-appointments',
        kind: 'tip',
        title: { en: 'Residence appointments are free', fa: 'نوبت اقامت رایگان است' },
        detail: {
          en: 'Appointments on e-ikamet cost nothing; the authority warns against third parties who charge for them.',
          fa: 'نوبت در e-ikamet هزینه‌ای ندارد و اداره‌ی مهاجرت درباره‌ی واسطه‌هایی که پول می‌گیرند هشدار داده است.',
        },
        source: E_IKAMET_SHORT,
      },
    ],
    timeline: TR_TIMELINE,
    quiz: [
      {
        key: 'max-length',
        q: { en: 'How long can one short-term residence permit run?', fa: 'هر اجازه‌ی اقامت کوتاه‌مدت حداکثر چقدر اعتبار دارد؟' },
        options: [
          { en: '6 months', fa: '۶ ماه' },
          { en: '2 years', fa: '۲ سال' },
          { en: '5 years', fa: '۵ سال' },
        ],
        answer: 1,
        why: { en: 'Law 6458, Art. 31(2): up to two years at a time.', fa: 'قانون ۶۴۵۸، ماده‌ی ۳۱ بند ۲: هر بار حداکثر دو سال.' },
      },
      {
        key: 'work',
        q: { en: 'Does the business residence permit let you work?', fa: 'آیا اقامت کسب‌وکار اجازه‌ی کار می‌دهد؟' },
        options: [
          { en: 'Yes', fa: 'بله' },
          { en: 'No, you need a work permit', fa: 'نه، اجازه‌ی کار لازم است' },
        ],
        answer: 1,
        why: { en: 'Managing the company needs a work permit from the Ministry of Labour.', fa: 'اداره‌ی شرکت به اجازه‌ی کار از وزارت کار نیاز دارد.' },
      },
      {
        key: 'hiring',
        q: { en: 'From which month must five Turkish citizens be employed?', fa: 'از کدام ماه باید پنج شهروند ترک استخدام شوند؟' },
        options: [
          { en: 'Month 1', fa: 'ماه اول' },
          { en: 'Month 7', fa: 'ماه هفتم' },
          { en: 'Month 24', fa: 'ماه بیست‌وچهارم' },
        ],
        answer: 1,
        why: { en: 'Criterion C.1.1(b) starts from the seventh month of the first permit.', fa: 'معیار C.1.1(b) از ماه هفتم نخستین اجازه‌ی کار شروع می‌شود.' },
      },
      {
        key: 'processing',
        q: { en: 'How long is the work-permit review for a complete file?', fa: 'بررسی پرونده‌ی کامل اجازه‌ی کار چقدر طول می‌کشد؟' },
        options: [
          { en: '7 days', fa: '۷ روز' },
          { en: '30 days', fa: '۳۰ روز' },
          { en: '90 days', fa: '۹۰ روز' },
        ],
        answer: 1,
        why: { en: 'The review is completed within 30 days if the file is complete.', fa: 'اگر پرونده کامل باشد، بررسی ظرف ۳۰ روز تمام می‌شود.' },
      },
      {
        key: 'long-term',
        q: { en: 'How many years of residence lead to long-term residence?', fa: 'چند سال اقامت به اقامت بلندمدت می‌رسد؟' },
        options: [
          { en: '5', fa: '۵' },
          { en: '8', fa: '۸' },
          { en: '10', fa: '۱۰' },
        ],
        answer: 1,
        why: { en: 'Law 6458, Art. 42: at least eight years of uninterrupted residence.', fa: 'قانون ۶۴۵۸، ماده‌ی ۴۲: دست‌کم هشت سال اقامت پیوسته.' },
      },
    ],
    media: [],
  },

  // ───────────────────────────── STUDENT ─────────────────────────────
  'tr-student': {
    funds: [],
    steps: [
      {
        key: 'choose',
        title: { en: 'Choose a programme', fa: 'انتخاب رشته و دانشگاه' },
        detail: {
          en: 'Each university sets its own admission rules for international students; some ask for TR-YÖS, a language score or a skills test.',
          fa: 'هر دانشگاه شرایط پذیرش دانشجوی خارجی را خودش تعیین می‌کند؛ برخی TR-YÖS، نمره‌ی زبان یا آزمون مهارت می‌خواهند.',
        },
        link: STUDY_IN,
      },
      {
        key: 'scholarship',
        title: { en: 'Optionally apply for Türkiye Scholarships', fa: 'در صورت تمایل، درخواست بورس Türkiye Burslari' },
        detail: {
          en: 'Applications are online and free. The scholarship also places you in a university.',
          fa: 'درخواست آنلاین و رایگان است. این بورس جایابی در دانشگاه را هم انجام می‌دهد.',
        },
        link: SCHOLARSHIPS,
      },
      {
        key: 'visa',
        title: { en: 'Get the student visa', fa: 'گرفتن ویزای تحصیلی' },
        detail: {
          en: 'Apply at the nearest Turkish consulate as soon as you are admitted.',
          fa: 'بلافاصله پس از پذیرش، در نزدیک‌ترین کنسولگری ترکیه درخواست دهید.',
        },
        link: STUDY_IN,
      },
      {
        key: 'permit',
        title: { en: 'Apply for the student residence permit', fa: 'درخواست اجازه‌ی اقامت تحصیلی' },
        detail: {
          en: 'On e-ikamet, with health insurance for the whole period. Applying within 3 months of the start of the academic year lets you join general health insurance.',
          fa: 'در e-ikamet و با بیمه‌ی درمانی برای کل مدت. اگر ظرف ۳ ماه از شروع سال تحصیلی درخواست دهید، می‌توانید زیر پوشش بیمه‌ی همگانی بروید.',
        },
        link: E_IKAMET,
      },
      {
        key: 'graduate',
        title: { en: 'After graduating, a one-off permit of up to a year', fa: 'پس از دانش‌آموختگی، اقامت یک‌باره تا یک سال' },
        detail: {
          en: 'Apply within 6 months of graduating for a short-term permit to look for work or start something.',
          fa: 'تا ۶ ماه پس از دانش‌آموختگی برای اقامت کوتاه‌مدت درخواست دهید تا کار پیدا کنید یا کاری را شروع کنید.',
        },
        link: LAW_6458,
      },
    ],
    documents: [
      { key: 'admission', label: { en: 'Admission or student certificate from the university', fa: 'پذیرش یا گواهی دانشجویی از دانشگاه' }, stage: 'visa' },
      ...RESIDENCE_DOCS,
    ],
    realities: [
      {
        key: 'language-course',
        kind: 'myth',
        title: { en: 'A Turkish course alone is not a student permit', fa: 'دوره‌ی زبان ترکی به‌تنهایی اقامت تحصیلی نمی‌دهد' },
        detail: {
          en: 'The student permit is for associate, bachelor’s, master’s and doctoral students. Language course students get a short-term permit instead.',
          fa: 'اقامت تحصیلی برای دانشجویان کاردانی، کارشناسی، کارشناسی ارشد و دکتری است. شرکت‌کنندگان دوره‌ی زبان اقامت کوتاه‌مدت می‌گیرند.',
        },
        source: LAW_6458,
      },
      {
        key: 'half',
        kind: 'challenge',
        title: { en: 'Student years count half', fa: 'سال‌های تحصیل نصف حساب می‌شود' },
        detail: {
          en: 'Only half of student-permit time counts toward the 8 years for long-term residence.',
          fa: 'فقط نیمی از مدت اقامت تحصیلی در ۸ سال لازم برای اقامت بلندمدت حساب می‌شود.',
        },
        source: LAW_6458,
      },
      {
        key: 'work',
        kind: 'tip',
        title: { en: 'Work after the first year, with a permit', fa: 'کار پس از سال اول، با اجازه‌ی کار' },
        detail: {
          en: 'Bachelor’s and associate students may work from their second year with a work permit; master’s and doctoral students from the start.',
          fa: 'دانشجویان کاردانی و کارشناسی از سال دوم با اجازه‌ی کار می‌توانند کار کنند؛ دانشجویان ارشد و دکتری از همان ابتدا.',
        },
        source: LAW_6458,
      },
      {
        key: 'insurance',
        kind: 'tip',
        title: { en: 'Insurance is compulsory', fa: 'بیمه اجباری است' },
        detail: {
          en: 'The student permit needs health insurance; it is verified online, so no extra paper is required.',
          fa: 'اقامت تحصیلی بیمه‌ی درمانی می‌خواهد که به‌صورت آنلاین بررسی می‌شود و مدرک کاغذی اضافه لازم نیست.',
        },
        source: E_IKAMET_STUDENT,
      },
    ],
    timeline: TR_TIMELINE,
    quiz: [
      {
        key: 'who',
        q: { en: 'Who can get a student residence permit?', fa: 'چه کسی اقامت تحصیلی می‌گیرد؟' },
        options: [
          { en: 'Anyone in a Turkish language course', fa: 'هر کسی در دوره‌ی زبان ترکی' },
          { en: 'Degree students at a Turkish higher-education institution', fa: 'دانشجویان دوره‌های دانشگاهی در مؤسسه‌ی آموزش عالی ترکیه' },
          { en: 'Online students abroad', fa: 'دانشجویان آنلاین خارج از ترکیه' },
        ],
        answer: 1,
        why: { en: 'Law 6458, Art. 38 covers associate to doctoral students.', fa: 'ماده‌ی ۳۸ قانون ۶۴۵۸ دانشجویان کاردانی تا دکتری را در بر می‌گیرد.' },
      },
      {
        key: 'count',
        q: { en: 'How much of student time counts toward long-term residence?', fa: 'چه بخشی از مدت تحصیل برای اقامت بلندمدت حساب می‌شود؟' },
        options: [
          { en: 'None', fa: 'هیچ' },
          { en: 'Half', fa: 'نصف' },
          { en: 'All of it', fa: 'همه‌ی آن' },
        ],
        answer: 1,
        why: { en: 'Art. 28(2): half of student permits count.', fa: 'ماده‌ی ۲۸ بند ۲: نیمی از مدت اقامت تحصیلی حساب می‌شود.' },
      },
      {
        key: 'work',
        q: { en: 'When can a bachelor’s student start working?', fa: 'دانشجوی کارشناسی از چه زمانی می‌تواند کار کند؟' },
        options: [
          { en: 'From day one, no permit', fa: 'از روز اول، بدون مجوز' },
          { en: 'After the first year, with a work permit', fa: 'پس از سال اول، با اجازه‌ی کار' },
          { en: 'Never during studies', fa: 'هیچ‌وقت در دوران تحصیل' },
        ],
        answer: 1,
        why: { en: 'Art. 41: for associate and bachelor’s students the right to work starts after the first year.', fa: 'ماده‌ی ۴۱: برای دانشجویان کاردانی و کارشناسی حق کار پس از سال اول شروع می‌شود.' },
      },
      {
        key: 'insurance',
        q: { en: 'Is health insurance required for the student permit?', fa: 'آیا اقامت تحصیلی بیمه‌ی درمانی می‌خواهد؟' },
        options: [
          { en: 'Yes, for the whole permit period', fa: 'بله، برای کل مدت اقامت' },
          { en: 'Only for doctoral students', fa: 'فقط برای دانشجویان دکتری' },
          { en: 'No', fa: 'نه' },
        ],
        answer: 0,
        why: { en: 'The e-ikamet checklist makes health insurance compulsory.', fa: 'چک‌لیست e-ikamet بیمه‌ی درمانی را اجباری کرده است.' },
      },
      {
        key: 'graduate',
        q: { en: 'Within how long after graduating can you request a short-term permit?', fa: 'تا چه مدت پس از دانش‌آموختگی می‌توانید اقامت کوتاه‌مدت بخواهید؟' },
        options: [
          { en: '1 month', fa: '۱ ماه' },
          { en: '6 months', fa: '۶ ماه' },
          { en: '2 years', fa: '۲ سال' },
        ],
        answer: 1,
        why: { en: 'Art. 31(1)(i): within six months of graduation.', fa: 'ماده‌ی ۳۱ بند ۱ (i): ظرف شش ماه از دانش‌آموختگی.' },
      },
    ],
    media: [],
  },
};

const HDR = 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Table.xlsx';

export const PROFILE_TR: CountryProfile = {
  strengths: [
    {
      en: 'Citizenship after 5 years of residence, and multiple citizenship is recognised.',
      fa: 'تابعیت پس از ۵ سال اقامت، و چندتابعیتی پذیرفته است.',
    },
    {
      en: 'The Tech Visa gives founders a 3-year work permit and six months of legal, financial and technical guidance.',
      fa: 'تک‌ویزا به بنیان‌گذاران اجازه‌ی کار ۳ ساله و شش ماه راهنمایی حقوقی، مالی و فنی می‌دهد.',
    },
    {
      en: 'People working inside technology development zones are exempt from the general hiring and capital criteria (with a ministry opinion).',
      fa: 'کسانی که در مناطق توسعه‌ی فناوری کار می‌کنند، با نظر وزارتخانه، از معیارهای عمومی استخدام و سرمایه معاف‌اند.',
    },
    {
      en: 'Residence appointments are free and most steps run online (e-ikamet, e-İzin).',
      fa: 'نوبت اقامت رایگان است و بیشتر مراحل آنلاین انجام می‌شود (e-ikamet و e-İzin).',
    },
  ],
  weaknesses: [
    {
      en: 'Thresholds are set in lira and change: partner capital went from TRY 40,000 to 500,000 in 2025.',
      fa: 'آستانه‌ها به لیر تعیین می‌شود و تغییر می‌کند: سرمایه‌ی شریک در ۲۰۲۵ از ۴۰٬۰۰۰ به ۵۰۰٬۰۰۰ لیر رسید.',
    },
    {
      en: 'Long-term residence takes 8 years, and student years count half.',
      fa: 'اقامت بلندمدت ۸ سال طول می‌کشد و سال‌های تحصیل نصف حساب می‌شود.',
    },
    {
      en: 'The Tech Visa site publishes no figures, and whether founders escape the five-employee rule is not stated anywhere official.',
      fa: 'سایت تک‌ویزا هیچ رقمی منتشر نمی‌کند و اینکه بنیان‌گذاران از شرط پنج کارمند معاف‌اند یا نه، در هیچ منبع رسمی روشن نشده است.',
    },
    {
      en: 'Low on the Global Peace Index (136th of 163) and low English proficiency (71st of 123).',
      fa: 'رتبه‌ی پایین در شاخص صلح جهانی (۱۳۶ از ۱۶۳) و سطح پایین انگلیسی (۷۱ از ۱۲۳).',
    },
  ],
  indicators: [
    { key: 'hdi', rank: 51, of: 193, value: 0.853, year: 2023, source: { url: HDR, checked: CHECKED, label: 'UNDP HDR 2025, data for 2023' } },
    {
      key: 'peace',
      rank: 136,
      of: 163,
      value: 2.605,
      year: 2026,
      source: { url: 'https://www.visionofhumanity.org/wp-content/uploads/2026/06/Global-Peace-Index-2026-A3-map-poster.pdf', checked: CHECKED, label: 'Global Peace Index 2026' },
    },
    {
      key: 'gdp-per-capita',
      value: 18_599,
      unit: 'USD',
      year: 2025,
      source: { url: 'https://api.worldbank.org/v2/country/TUR/indicator/NY.GDP.PCAP.CD?format=json&mrnev=1', checked: CHECKED, label: 'World Bank, current US$' },
    },
    {
      key: 'unemployment',
      value: 8.5,
      unit: '%',
      year: 2025,
      source: { url: 'https://api.worldbank.org/v2/country/TUR/indicator/SL.UEM.TOTL.ZS?format=json&mrnev=1', checked: CHECKED, label: 'World Bank, modeled ILO estimate' },
    },
    { key: 'innovation', rank: 45, of: 139, year: 2026, source: { url: 'https://www.wipo.int/gii-ranking/en/turkiye', checked: CHECKED, label: 'WIPO Global Innovation Index 2026' } },
    { key: 'english', rank: 71, of: 123, value: 488, year: 2025, source: { url: 'https://www.ef.com/wwen/epi/regions/europe/turkey/', checked: CHECKED, label: 'EF EPI 2025' } },
  ],
};
