// Israel — route extras and country profile (content v3, spec 2026-10-27).
// Every figure was read on the official page cited next to it on 2026-10-27.
// Farjad's notebooks (e2622cd0…, 6081e2a5…) were used as leads only; see
// docs/research/app-v3/il.md for what they claim and what the official pages say.
//
// Iranian passport holders: no official Israeli page read for this file says
// whether they can apply for any of these routes. The text says exactly that
// and points to PIBA; it does not guess.
import type { CountryProfile, MediaLead, Reality, RouteExtras, Timeline } from '../extras-types';

const CHECKED = '2026-10-27';

const IIA_VISA = 'https://innovationisrael.org.il/en/programs/tech-innovation-visa/';
const IIA_PROCEDURE =
  'https://innovationisrael.org.il/wp-content/uploads/2026/05/%D7%A0%D7%95%D7%94%D7%9C-%D7%95%D7%99%D7%96%D7%AA-%D7%99%D7%96%D7%9D-%D7%96%D7%A8-%D7%98%D7%9B%D7%A0%D7%95%D7%9C%D7%95%D7%92%D7%99.pdf';
const IIA_EXPERT = 'https://innovationisrael.org.il/en/programs/visas-for-foreign-high-tech-experts-incentive-program/';
const IIA_TNUFA = 'https://innovationisrael.org.il/en/programs/ideation-tnufa-incentive-program/';
const PIBA_EXPERT_FEES = 'https://www.gov.il/he/service/working-permit-for-foreign-workers-calculator';
const PIBA_VISA_TYPES = 'https://israel-entry.piba.gov.il/visa-option';
const PIBA_HELP = 'https://israel-entry.piba.gov.il/get-help';
const PIBA_STUDENT = 'https://www.gov.il/en/service/student_visa_application_type';
const PIBA_NATURALISATION = 'https://www.gov.il/en/service/request_for_citizenship_of_a_person_who_holds_pemanent_residency';
const MFA_VISA_TABLE = 'https://www.gov.il/en/departments/dynamiccollectors/ashrotzarim?skip=0';

const NB_ENTREPRENEUR = 'e2622cd0-7508-4e14-82e2-eebf9277c37d';
const NB_PROGRAMMES = '6081e2a5-deb1-4a37-9c7d-663e0e4cc9f9';

/** Same rule for all three routes: none of them leads to permanent residence. */
const TIMELINE_TEMPORARY: Timeline = {
  dualCitizenship: 'restricted',
  language: {
    en: 'Hebrew "at some level" is a condition of naturalisation; the visas themselves set no language test.',
    fa: 'برای تابعیت از راه اقامت، دانستن عبری «در حدی» شرط است؛ خود این ویزاها آزمون زبان ندارند.',
  },
  note: {
    en: 'These are temporary permits with no route to permanent residence. Naturalisation is open only to permanent residents who have lived in Israel 3 of the last 5 years, and they must give up their other citizenship or show they will lose it.',
    fa: 'این‌ها مجوزهای موقت‌اند و به اقامت دائم نمی‌رسند. تابعیت از راه اقامت فقط برای مقیم دائمی است که ۳ سال از ۵ سال گذشته را در اسرائیل زندگی کرده باشد، و او باید تابعیت دیگرش را کنار بگذارد یا نشان دهد که آن را از دست خواهد داد.',
  },
  source: PIBA_NATURALISATION,
};

/** Shown on every Israeli route, because every user (Iranian nationals included) sees Israel. */
const IRANIAN_PASSPORT: Reality = {
  key: 'iranian-passport',
  kind: 'challenge',
  title: {
    en: 'Iranian passport: not addressed on the official pages',
    fa: 'گذرنامه‌ی ایرانی: صفحه‌های رسمی چیزی نگفته‌اند',
  },
  detail: {
    en: "None of the official Israeli pages we read (Innovation Authority, Population and Immigration Authority, Foreign Ministry visa table) says whether Iranian passport holders can apply. Ask the Population and Immigration Authority (PIBA) in writing before you spend time or money; do not rely on agents' claims either way.",
    fa: 'هیچ‌کدام از صفحه‌های رسمی اسرائیل که خواندیم (سازمان نوآوری، سازمان جمعیت و مهاجرت و جدول ویزای وزارت خارجه) نمی‌گوید دارندگان گذرنامه‌ی ایرانی می‌توانند درخواست بدهند یا نه. پیش از هر هزینه‌ای، پاسخ کتبی را از سازمان جمعیت و مهاجرت (PIBA) بگیرید و به ادعای هیچ واسطه‌ای، چه مثبت چه منفی، تکیه نکنید.',
  },
  source: MFA_VISA_TABLE,
};

const MEDIA_INNOVATION: MediaLead[] = [
  { notebookId: NB_ENTREPRENEUR, kind: 'video', title: "Are You the Right Founder for Israel's Innovation Visa?" },
  { notebookId: NB_ENTREPRENEUR, kind: 'infographic', title: 'چشم‌انداز نوآوری اسرائیل ۲۰۲۶' },
  { notebookId: NB_ENTREPRENEUR, kind: 'infographic', title: 'اینفوگرافیک پیشران‌های اقتصاد دانش‌بنیان' },
  { notebookId: NB_ENTREPRENEUR, kind: 'slides', title: 'Israel Innovation 2026 Strategic Architecture' },
  { notebookId: NB_ENTREPRENEUR, kind: 'slides', title: 'Israel Startup Funding Blueprint' },
  { notebookId: NB_ENTREPRENEUR, kind: 'slides', title: 'The Israel Innovation Blueprint' },
  { notebookId: NB_PROGRAMMES, kind: 'infographic', title: 'راهنمای جامع ویزای نوآوری اسرائیل' },
  { notebookId: NB_PROGRAMMES, kind: 'slides', title: 'Israel Innovation Blueprint' },
];

export const EXTRAS_IL: Record<string, RouteExtras> = {
  // ───────────────────────── Innovation Visa (B/2) ─────────────────────────
  'il-innovation-visa': {
    // No amount is published: the founder only declares where living costs
    // for the whole stay come from (IIA). No fee was found on an official page.
    funds: [],
    steps: [
      {
        key: 'framework',
        title: { en: 'Find a supporting framework', fa: 'یک چارچوب پشتیبان پیدا کنید' },
        detail: {
          en: 'An Israeli body that works with early-stage tech companies: a fund, incubator, R&D lab, innovation hub or accelerator under an Innovation Authority benefit track, or a private accelerator with at least three years of experience. You need a signed agreement with it.',
          fa: 'نهادی اسرائیلی که با شرکت‌های فناوری نوپا کار می‌کند: صندوق، مرکز رشد، آزمایشگاه نوآوری، هاب یا شتاب‌دهنده‌ای که زیر یکی از مسیرهای حمایتی سازمان نوآوری فعال است، یا شتاب‌دهنده‌ی خصوصی با دست‌کم سه سال سابقه. باید با آن قرارداد امضاشده داشته باشید.',
        },
        link: IIA_PROCEDURE,
      },
      {
        key: 'file',
        title: { en: 'Prepare the application', fa: 'پرونده را آماده کنید' },
        detail: {
          en: 'Name the framework, attach its declaration that it will support you during your stay, declare how you will pay your living costs for the whole stay, and describe the R&D you will do in Israel.',
          fa: 'نام چارچوب پشتیبان را بیاورید، اعلامیه‌ی حمایت آن در دوره‌ی اقامت را پیوست کنید، اعلام کنید هزینه‌ی زندگی کل دوره را از کجا می‌پردازید و تحقیق و توسعه‌ای را که در اسرائیل انجام می‌دهید شرح دهید.',
        },
        link: IIA_VISA,
      },
      {
        key: 'submit-iia',
        title: { en: 'Submit to the Israel Innovation Authority', fa: 'درخواست را به سازمان نوآوری اسرائیل بدهید' },
        detail: {
          en: 'Applications are reviewed in the order they arrive (FIFO). A professional examiner appointed by the Authority assesses you, the framework and the R&D plan.',
          fa: 'درخواست‌ها به ترتیب رسیدن (FIFO) بررسی می‌شوند. کارشناسی که سازمان تعیین می‌کند شما، چارچوب پشتیبان و برنامه‌ی تحقیق و توسعه را ارزیابی می‌کند.',
        },
        link: IIA_VISA,
      },
      {
        key: 'ceo-decision',
        title: { en: 'Receive the written decision', fa: 'تصمیم کتبی را دریافت کنید' },
        detail: {
          en: "The examiner's opinion goes to the Authority's CEO, who decides and sends the decision in writing. It is a recommendation, not the visa.",
          fa: 'نظر کارشناس به مدیرعامل سازمان می‌رسد و او تصمیم را کتبی اعلام می‌کند. این توصیه‌نامه است، نه خود ویزا.',
        },
        link: IIA_VISA,
      },
      {
        key: 'apply-piba',
        title: { en: 'Apply to PIBA for the visa', fa: 'از PIBA ویزا بگیرید' },
        detail: {
          en: 'With the approval, apply to the Population and Immigration Authority for the Innovation Visa, a B/2 stay permit, for the length of the venture in the framework: up to two years.',
          fa: 'با این تأییدیه از سازمان جمعیت و مهاجرت (PIBA) ویزای نوآوری را درخواست کنید؛ مجوز اقامت B/2 برای مدت پروژه در چارچوب پشتیبان، حداکثر دو سال.',
        },
        link: IIA_VISA,
      },
      {
        key: 'next-visa',
        title: { en: 'Plan the next visa early', fa: 'ویزای بعدی را زود برنامه‌ریزی کنید' },
        detail: {
          en: 'The Innovation Visa ends after two years at most. To stay and be paid, you need another basis, such as the B/1 high-tech expert visa through an Innovation Authority-authorised employer.',
          fa: 'ویزای نوآوری حداکثر پس از دو سال تمام می‌شود. برای ماندن و حقوق گرفتن مبنای دیگری لازم است، مثلاً ویزای متخصص فناوری B/1 از راه کارفرمایی که سازمان نوآوری تأیید کرده است.',
        },
        link: IIA_EXPERT,
      },
    ],
    documents: [
      {
        key: 'framework-statement',
        label: { en: 'Statement naming your supporting framework', fa: 'بیانیه‌ای که چارچوب پشتیبان را نام می‌برد' },
        stage: 'apply',
      },
      {
        key: 'framework-declaration',
        label: { en: "The framework's declaration of support for your stay", fa: 'اعلامیه‌ی حمایت چارچوب پشتیبان در دوره‌ی اقامت' },
        stage: 'apply',
      },
      {
        key: 'agreement',
        label: { en: 'Your agreement with the framework', fa: 'قرارداد شما با چارچوب پشتیبان' },
        note: {
          en: 'The procedure defines a supporting framework as one that has an agreement with the entrepreneur.',
          fa: 'دستورالعمل، چارچوب پشتیبان را نهادی تعریف می‌کند که با کارآفرین قرارداد دارد.',
        },
        stage: 'apply',
      },
      {
        key: 'living-funds',
        label: { en: 'Your declaration of how living costs are funded for the whole stay', fa: 'اظهارنامه‌ی شما درباره‌ی منبع هزینه‌ی زندگی در کل دوره' },
        note: { en: 'No minimum amount is published.', fa: 'حداقل مبلغی منتشر نشده است.' },
        stage: 'apply',
      },
      {
        key: 'rnd-plan',
        label: { en: 'Description of the R&D you will carry out in Israel', fa: 'شرح تحقیق و توسعه‌ای که در اسرائیل انجام می‌دهید' },
        stage: 'apply',
      },
      {
        key: 'iia-approval',
        label: { en: "The Innovation Authority CEO's written approval", fa: 'تأییدیه‌ی کتبی مدیرعامل سازمان نوآوری' },
        stage: 'visa',
      },
    ],
    realities: [
      {
        key: 'no-grant',
        kind: 'myth',
        title: { en: '"The visa comes with funding"', fa: '«ویزا با بودجه همراه است»' },
        detail: {
          en: 'It does not. The Authority states that approval gives no right to any grant and that it bears no responsibility for your dealings with the framework.',
          fa: 'این‌طور نیست. سازمان نوآوری صریحاً می‌گوید تأیید درخواست هیچ حقی برای دریافت کمک مالی ایجاد نمی‌کند و مسئولیتی در رابطه‌ی شما با چارچوب پشتیبان ندارد.',
        },
        source: IIA_VISA,
      },
      {
        key: 'landing-pads',
        kind: 'myth',
        title: { en: '"Only 12 landing pads can sponsor you"', fa: '«فقط ۱۲ مرکز میزبان می‌توانند حمایت کنند»' },
        detail: {
          en: 'Guides repeat a list of 12. The procedure itself defines the framework by type: bodies under several Innovation Authority benefit tracks, plus private accelerators with three years of experience. Check the current procedure, not a list.',
          fa: 'راهنماهای غیررسمی فهرستی ۱۲‌تایی را تکرار می‌کنند. خود دستورالعمل، چارچوب پشتیبان را با نوعش تعریف می‌کند: نهادهای زیر چند مسیر حمایتی سازمان نوآوری و شتاب‌دهنده‌های خصوصی با سه سال سابقه. به دستورالعمل فعلی نگاه کنید، نه به یک فهرست.',
        },
        source: IIA_PROCEDURE,
      },
      {
        key: 'tnufa-separate',
        kind: 'tip',
        title: { en: 'Tnufa is a separate application', fa: 'برنامه‌ی تنوفا درخواست جداگانه دارد' },
        detail: {
          en: 'The Ideation (Tnufa) programme offers a conditional grant of up to NIS 200,000 over 12 months (80% of the approved budget), repaid through royalties if the product sells. It is not part of the visa and has its own rules on the Authority\'s Hebrew site.',
          fa: 'برنامه‌ی ایده‌پردازی (Tnufa) تا ۲۰۰٬۰۰۰ شِکِل کمک مشروط در ۱۲ ماه می‌دهد (۸۰ درصد بودجه‌ی تأییدشده) که اگر محصول فروش داشته باشد از محل حق امتیاز بازپرداخت می‌شود. این بخشی از ویزا نیست و قواعدش در سایت عبری سازمان آمده است.',
        },
        source: IIA_TNUFA,
      },
      {
        key: 'recommend-only',
        kind: 'challenge',
        title: { en: 'Two authorities, two decisions', fa: 'دو نهاد، دو تصمیم' },
        detail: {
          en: 'The Innovation Authority only recommends; the power to grant the visa rests with the Population and Immigration Authority alone.',
          fa: 'سازمان نوآوری فقط توصیه می‌کند؛ اختیار صدور ویزا تنها با سازمان جمعیت و مهاجرت است.',
        },
        source: IIA_VISA,
      },
      IRANIAN_PASSPORT,
    ],
    timeline: TIMELINE_TEMPORARY,
    quiz: [
      {
        key: 'who-grants',
        q: { en: 'Who grants the Innovation Visa?', fa: 'ویزای نوآوری را چه نهادی صادر می‌کند؟' },
        options: [
          { en: 'The Israel Innovation Authority', fa: 'سازمان نوآوری اسرائیل' },
          { en: 'The Population and Immigration Authority (PIBA)', fa: 'سازمان جمعیت و مهاجرت (PIBA)' },
          { en: 'The supporting framework', fa: 'چارچوب پشتیبان' },
        ],
        answer: 1,
        why: {
          en: 'The Innovation Authority only recommends; PIBA alone grants the visa.',
          fa: 'سازمان نوآوری فقط توصیه می‌کند و صدور ویزا تنها با PIBA است.',
        },
      },
      {
        key: 'length',
        q: { en: 'How long can the Innovation Visa last?', fa: 'ویزای نوآوری حداکثر چقدر اعتبار دارد؟' },
        options: [
          { en: 'Six months', fa: 'شش ماه' },
          { en: 'Up to two years', fa: 'تا دو سال' },
          { en: 'Five years', fa: 'پنج سال' },
        ],
        answer: 1,
        why: {
          en: 'PIBA grants it for the length of the venture in the framework, up to two years.',
          fa: 'PIBA آن را برای مدت پروژه در چارچوب پشتیبان و حداکثر دو سال می‌دهد.',
        },
      },
      {
        key: 'grant',
        q: { en: 'Does approval include a grant?', fa: 'آیا تأیید درخواست کمک مالی هم دارد؟' },
        options: [
          { en: 'Yes, NIS 200,000', fa: 'بله، ۲۰۰٬۰۰۰ شِکِل' },
          { en: 'Yes, half the budget', fa: 'بله، نیمی از بودجه' },
          { en: 'No', fa: 'خیر' },
        ],
        answer: 2,
        why: {
          en: 'The Authority states that approval gives no right to any monetary grant.',
          fa: 'سازمان نوآوری می‌گوید تأیید درخواست هیچ حقی برای کمک مالی ایجاد نمی‌کند.',
        },
      },
      {
        key: 'permit-type',
        q: { en: 'What kind of permit is the Innovation Visa?', fa: 'ویزای نوآوری چه نوع مجوزی است؟' },
        options: [
          { en: 'A/2 student visa', fa: 'ویزای دانشجویی A/2' },
          { en: 'B/2 stay permit', fa: 'مجوز اقامت B/2' },
          { en: 'B/1 work visa', fa: 'ویزای کار B/1' },
        ],
        answer: 1,
        why: {
          en: 'The Authority lists the benefit as a B/2 stay permit issued by PIBA.',
          fa: 'سازمان نوآوری مزیت این برنامه را مجوز اقامت B/2 از سوی PIBA معرفی می‌کند.',
        },
      },
      {
        key: 'order',
        q: { en: 'In what order are applications reviewed?', fa: 'درخواست‌ها به چه ترتیبی بررسی می‌شوند؟' },
        options: [
          { en: 'By lottery', fa: 'با قرعه‌کشی' },
          { en: 'In the order they arrive', fa: 'به ترتیب رسیدن' },
          { en: 'Highest score first', fa: 'اول امتیاز بالاتر' },
        ],
        answer: 1,
        why: {
          en: 'The Authority reviews applications first in, first out (FIFO).',
          fa: 'سازمان نوآوری درخواست‌ها را به ترتیب رسیدن (FIFO) بررسی می‌کند.',
        },
      },
    ],
    media: MEDIA_INNOVATION,
  },

  // ───────────────────────── B/1 high-tech expert ─────────────────────────
  'il-expert-b1': {
    funds: [
      {
        key: 'application-fee',
        label: { en: 'Application fee per expert (paid by the employer)', fa: 'هزینه‌ی درخواست برای هر متخصص (کارفرما می‌پردازد)' },
        amount: 1340,
        currency: 'ILS',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: PIBA_EXPERT_FEES,
      },
      {
        key: 'annual-fee',
        label: {
          en: 'Annual fee for a foreign expert, full year (paid by the employer)',
          fa: 'هزینه‌ی سالانه‌ی متخصص خارجی برای یک سال کامل (کارفرما می‌پردازد)',
        },
        amount: 10680,
        currency: 'ILS',
        basis: 'perYear',
        per: 'person',
        kind: 'spend',
        source: PIBA_EXPERT_FEES,
      },
      {
        key: 'b1-licence',
        label: { en: 'B/1 licence fee', fa: 'هزینه‌ی مجوز B/1' },
        amount: 195,
        currency: 'ILS',
        basis: 'perYear',
        per: 'person',
        kind: 'spend',
        source: PIBA_EXPERT_FEES,
      },
    ],
    steps: [
      {
        key: 'citizenship',
        title: { en: 'Check your passport', fa: 'گذرنامه‌تان را بررسی کنید' },
        detail: {
          en: "This track is only for citizens of countries exempt from Israel's tourist visa. Look your nationality up in the Foreign Ministry's visa table.",
          fa: 'این مسیر فقط برای شهروندان کشورهایی است که از ویزای توریستی اسرائیل معاف‌اند. ملیت خود را در جدول ویزای وزارت خارجه پیدا کنید.',
        },
        link: MFA_VISA_TABLE,
      },
      {
        key: 'offer',
        title: { en: 'Get an offer from an authorised company', fa: 'از شرکت تأییدشده پیشنهاد کار بگیرید' },
        detail: {
          en: 'The employer must be a high-tech company authorised by the Innovation Authority and pay a base gross salary of at least twice the average wage in the economy.',
          fa: 'کارفرما باید شرکت فناوری پیشرفته‌ی تأییدشده‌ی سازمان نوآوری باشد و حقوق پایه‌ی ناخالصی دست‌کم دو برابر میانگین دستمزد کشور بپردازد.',
        },
        link: IIA_EXPERT,
      },
      {
        key: 'employer-files',
        title: { en: 'The employer files with PIBA', fa: 'کارفرما درخواست را به PIBA می‌دهد' },
        detail: {
          en: 'The request is submitted in Israel by the employer, who pays the application fee and the annual fee.',
          fa: 'درخواست را کارفرما در اسرائیل ثبت می‌کند و هزینه‌ی درخواست و هزینه‌ی سالانه را می‌پردازد.',
        },
        link: PIBA_EXPERT_FEES,
      },
      {
        key: 'processing',
        title: { en: 'Expedited review', fa: 'بررسی سریع' },
        detail: {
          en: 'Requests on this track are processed in 6 to 10 business days.',
          fa: 'درخواست‌های این مسیر در ۶ تا ۱۰ روز کاری بررسی می‌شوند.',
        },
        takes: { en: '6–10 business days', fa: '۶ تا ۱۰ روز کاری' },
        link: IIA_EXPERT,
      },
      {
        key: 'consulate',
        title: { en: 'Collect the visa', fa: 'ویزا را دریافت کنید' },
        detail: {
          en: 'The approval is sent to the Israeli consulate, which issues the B/1 foreign expert visa.',
          fa: 'تأییدیه به کنسولگری اسرائیل فرستاده می‌شود و کنسولگری ویزای متخصص خارجی B/1 را صادر می‌کند.',
        },
        link: PIBA_VISA_TYPES,
      },
      {
        key: 'renew',
        title: { en: 'Renew each year', fa: 'هر سال تمدید کنید' },
        detail: {
          en: 'The work visa is for up to one year and can be extended each year, up to five years. Your spouse receives a work visa too.',
          fa: 'ویزای کار حداکثر یک‌ساله است و هر سال تا پنج سال تمدید می‌شود. همسرتان هم ویزای کار می‌گیرد.',
        },
        link: IIA_EXPERT,
      },
    ],
    documents: [
      {
        key: 'passport',
        label: { en: 'Passport of a visa-exempt country', fa: 'گذرنامه‌ی کشوری که از ویزا معاف است' },
        stage: 'apply',
      },
      {
        key: 'contract',
        label: { en: 'Employment contract showing the salary', fa: 'قرارداد کار با ذکر حقوق' },
        note: {
          en: 'Base gross salary of at least twice the average wage. PIBA does not publish the amount; we calculate about NIS 27,132 a month from the National Insurance average wage.',
          fa: 'حقوق پایه‌ی ناخالص دست‌کم دو برابر میانگین دستمزد. PIBA مبلغ را منتشر نمی‌کند؛ ما از میانگین دستمزد بیمه‌ی ملی حدود ۲۷٬۱۳۲ شِکِل در ماه حساب کرده‌ایم.',
        },
        stage: 'apply',
      },
      {
        key: 'employer-authorisation',
        label: { en: "The employer's Innovation Authority authorisation", fa: 'تأییدیه‌ی سازمان نوآوری برای کارفرما' },
        stage: 'apply',
      },
      {
        key: 'employer-details',
        label: {
          en: 'Expert category, profession and requested period (prepared by the employer)',
          fa: 'دسته‌ی متخصص، حرفه و مدت درخواستی (کارفرما آماده می‌کند)',
        },
        note: {
          en: "PIBA's full checklist sits in procedure 5.3.0041, which we could not open; ask the employer for it.",
          fa: 'فهرست کامل مدارک PIBA در دستورالعمل 5.3.0041 آمده که نتوانستیم بازش کنیم؛ آن را از کارفرما بخواهید.',
        },
        stage: 'apply',
      },
    ],
    realities: [
      {
        key: 'visa-exempt-only',
        kind: 'challenge',
        title: { en: 'Only for visa-exempt passports', fa: 'فقط برای گذرنامه‌های معاف از ویزا' },
        detail: {
          en: "The Innovation Authority lists citizenship of a country exempt from Israel's tourist visa as a condition for processing the request, not as a bonus.",
          fa: 'سازمان نوآوری تابعیت کشوری را که از ویزای توریستی اسرائیل معاف است شرط رسیدگی به درخواست می‌داند، نه امتیاز اضافه.',
        },
        source: IIA_EXPERT,
      },
      {
        key: 'own-startup',
        kind: 'myth',
        title: { en: '"I can sponsor myself through my startup"', fa: '«با استارتاپ خودم برای خودم ویزا می‌گیرم»' },
        detail: {
          en: 'Only a high-tech company authorised by the Innovation Authority can file. A new company of your own would first need that authorisation.',
          fa: 'فقط شرکت فناوری پیشرفته‌ای که سازمان نوآوری تأیید کرده می‌تواند درخواست بدهد. شرکت تازه‌تأسیس شما اول باید همین تأیید را بگیرد.',
        },
        source: IIA_EXPERT,
      },
      {
        key: 'spouse-works',
        kind: 'tip',
        title: { en: 'Your spouse can work', fa: 'همسرتان هم اجازه‌ی کار دارد' },
        detail: {
          en: 'A work visa for the spouse is issued once the expert visa is granted.',
          fa: 'با صدور ویزای متخصص، برای همسر هم ویزای کار صادر می‌شود.',
        },
        source: IIA_EXPERT,
      },
      {
        key: 'employer-cost',
        kind: 'tip',
        title: { en: 'Fees fall on the employer', fa: 'هزینه‌ها با کارفرماست' },
        detail: {
          en: 'NIS 1,340 per request and NIS 10,680 a year for a full year; amounts are updated every 1 January. Knowing this helps in salary talks.',
          fa: 'هر درخواست ۱٬۳۴۰ شِکِل و برای یک سال کامل ۱۰٬۶۸۰ شِکِل؛ این مبالغ هر ۱ ژانویه به‌روز می‌شوند. دانستن آن در مذاکره‌ی حقوق به کارتان می‌آید.',
        },
        source: PIBA_EXPERT_FEES,
      },
      IRANIAN_PASSPORT,
    ],
    timeline: TIMELINE_TEMPORARY,
    quiz: [
      {
        key: 'who-applies',
        q: { en: 'Who submits the B/1 expert request?', fa: 'درخواست ویزای متخصص B/1 را چه کسی ثبت می‌کند؟' },
        options: [
          { en: 'The expert', fa: 'خود متخصص' },
          { en: 'The employer', fa: 'کارفرما' },
          { en: 'The Innovation Authority', fa: 'سازمان نوآوری' },
        ],
        answer: 1,
        why: {
          en: 'The employer submits the request to PIBA in Israel.',
          fa: 'کارفرما درخواست را در اسرائیل به PIBA می‌دهد.',
        },
      },
      {
        key: 'salary',
        q: { en: 'What is the minimum salary?', fa: 'حداقل حقوق چقدر است؟' },
        options: [
          { en: 'The average wage', fa: 'میانگین دستمزد' },
          { en: '1.5 times the average wage', fa: '۱٫۵ برابر میانگین دستمزد' },
          { en: 'Twice the average wage', fa: 'دو برابر میانگین دستمزد' },
        ],
        answer: 2,
        why: {
          en: 'The Innovation Authority and PIBA both require at least twice the average wage.',
          fa: 'هم سازمان نوآوری و هم PIBA دست‌کم دو برابر میانگین دستمزد را شرط کرده‌اند.',
        },
      },
      {
        key: 'speed',
        q: { en: 'How fast is the expedited track?', fa: 'مسیر سریع چقدر طول می‌کشد؟' },
        options: [
          { en: '6–10 business days', fa: '۶ تا ۱۰ روز کاری' },
          { en: '3 months', fa: '۳ ماه' },
          { en: 'One year', fa: 'یک سال' },
        ],
        answer: 0,
        why: {
          en: 'The Innovation Authority states 6–10 business days.',
          fa: 'سازمان نوآوری ۶ تا ۱۰ روز کاری اعلام کرده است.',
        },
      },
      {
        key: 'max-years',
        q: { en: 'How long can the visa be extended in total?', fa: 'این ویزا در مجموع تا چند سال تمدید می‌شود؟' },
        options: [
          { en: 'One year', fa: 'یک سال' },
          { en: 'Three years', fa: 'سه سال' },
          { en: 'Five years', fa: 'پنج سال' },
        ],
        answer: 2,
        why: {
          en: 'It is issued for up to a year and can be extended yearly up to five years.',
          fa: 'حداکثر یک‌ساله صادر می‌شود و هر سال تا پنج سال تمدید می‌شود.',
        },
      },
      {
        key: 'spouse',
        q: { en: "What does the expert's spouse receive?", fa: 'همسر متخصص چه ویزایی می‌گیرد؟' },
        options: [
          { en: 'Nothing', fa: 'هیچ' },
          { en: 'A tourist visa only', fa: 'فقط ویزای توریستی' },
          { en: 'A work visa', fa: 'ویزای کار' },
        ],
        answer: 2,
        why: {
          en: 'The Innovation Authority lists a work visa for the spouse as a benefit.',
          fa: 'سازمان نوآوری ویزای کار برای همسر را از مزایای این مسیر می‌داند.',
        },
      },
    ],
    media: [
      { notebookId: NB_PROGRAMMES, kind: 'infographic', title: 'راهنمای جامع ویزای نوآوری اسرائیل' },
      { notebookId: NB_PROGRAMMES, kind: 'slides', title: 'Israel Innovation Blueprint' },
    ],
  },

  // ───────────────────────── Student (A/2) ─────────────────────────
  'il-student': {
    funds: [
      {
        key: 'service-fee',
        label: { en: 'Visa service fee', fa: 'هزینه‌ی خدمت ویزا' },
        amount: 195,
        currency: 'ILS',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: PIBA_STUDENT,
      },
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get admitted', fa: 'پذیرش بگیرید' },
        detail: {
          en: 'From an institution recognised by the Council for Higher Education (or a yeshiva). Student visas are tied to such institutions.',
          fa: 'از مؤسسه‌ای که شورای آموزش عالی اسرائیل به رسمیت شناخته (یا یشیوا). ویزای دانشجویی به همین مؤسسه‌ها بسته است.',
        },
        link: PIBA_VISA_TYPES,
      },
      {
        key: 'tuition',
        title: { en: 'Pay tuition', fa: 'شهریه را بپردازید' },
        detail: {
          en: 'You need confirmation that tuition has been paid.',
          fa: 'به رسید پرداخت شهریه نیاز دارید.',
        },
        link: PIBA_STUDENT,
      },
      {
        key: 'form',
        title: { en: 'Fill in the form', fa: 'فرم را پر کنید' },
        detail: {
          en: 'Download and complete the visa application form and gather the documents on the checklist.',
          fa: 'فرم درخواست ویزا را دانلود و پر کنید و مدارک فهرست را آماده کنید.',
        },
        link: PIBA_STUDENT,
      },
      {
        key: 'submit',
        title: { en: 'Submit in person', fa: 'حضوری تحویل دهید' },
        detail: {
          en: 'At your local Population and Immigration office or your local Israeli mission. Pay NIS 195 there in cash or by card.',
          fa: 'در دفتر محلی سازمان جمعیت و مهاجرت یا نمایندگی اسرائیل در کشور خودتان. ۱۹۵ شِکِل را همان‌جا نقدی یا با کارت بپردازید.',
        },
        link: PIBA_STUDENT,
      },
      {
        key: 'permit',
        title: { en: 'Receive the A/2 permit', fa: 'مجوز A/2 را بگیرید' },
        detail: {
          en: 'A temporary stay permit for up to one year, with an entry permit for the same period.',
          fa: 'مجوز اقامت موقت تا یک سال، همراه با اجازه‌ی ورود برای همان مدت.',
        },
        link: PIBA_STUDENT,
      },
      {
        key: 'renew',
        title: { en: 'Renew every year', fa: 'هر سال تمدید کنید' },
        detail: {
          en: 'Each yearly extension needs your grade sheet.',
          fa: 'هر تمدید سالانه به کارنامه‌ی شما نیاز دارد.',
        },
        link: PIBA_STUDENT,
      },
    ],
    documents: [
      { key: 'admission', label: { en: 'Letter of admission', fa: 'نامه‌ی پذیرش' }, stage: 'apply' },
      { key: 'tuition', label: { en: 'Confirmation that tuition is paid', fa: 'تأییدیه‌ی پرداخت شهریه' }, stage: 'apply' },
      {
        key: 'means',
        label: { en: 'Proof of means of living', fa: 'مدرک تأمین هزینه‌ی زندگی' },
        note: { en: 'No amount is set on the page.', fa: 'صفحه‌ی رسمی مبلغی تعیین نکرده است.' },
        stage: 'apply',
      },
      {
        key: 'passport',
        label: { en: 'Passport valid for the whole visa period', fa: 'گذرنامه‌ی معتبر برای کل مدت ویزا' },
        stage: 'apply',
      },
      { key: 'photo', label: { en: 'Current photo', fa: 'عکس جدید' }, stage: 'apply' },
      { key: 'birth', label: { en: 'Original birth certificate', fa: 'اصل شناسنامه' }, stage: 'apply' },
      { key: 'grades', label: { en: 'Grade sheet', fa: 'کارنامه' }, stage: 'renewal' },
    ],
    realities: [
      {
        key: 'card',
        kind: 'tip',
        title: { en: 'Pay at the office', fa: 'هزینه را حضوری بپردازید' },
        detail: {
          en: 'Online payment only accepts a card owned by an Israeli citizen or resident; at the office you can pay cash or card.',
          fa: 'پرداخت آنلاین فقط با کارت متعلق به شهروند یا مقیم اسرائیل ممکن است؛ در دفتر می‌توانید نقدی یا با کارت بپردازید.',
        },
        source: PIBA_STUDENT,
      },
      {
        key: 'eta-not-enough',
        kind: 'myth',
        title: { en: '"An ETA-IL is enough to study"', fa: '«با ETA-IL می‌شود درس خواند»' },
        detail: {
          en: 'PIBA says that to come to Israel to study you need a student visa, even from a visa-exempt country.',
          fa: 'PIBA می‌گوید برای تحصیل در اسرائیل، حتی از کشور معاف از ویزا، ویزای دانشجویی لازم است.',
        },
        source: PIBA_HELP,
      },
      {
        key: 'no-pr',
        kind: 'challenge',
        title: { en: 'Study does not lead to residence', fa: 'تحصیل به اقامت نمی‌رسد' },
        detail: {
          en: 'The A/2 permit is renewed year by year and does not lead to permanent residence.',
          fa: 'مجوز A/2 سال‌به‌سال تمدید می‌شود و به اقامت دائم ختم نمی‌شود.',
        },
        source: PIBA_STUDENT,
      },
      IRANIAN_PASSPORT,
    ],
    timeline: TIMELINE_TEMPORARY,
    quiz: [
      {
        key: 'fee',
        q: { en: 'What is the student visa service fee?', fa: 'هزینه‌ی خدمت ویزای دانشجویی چقدر است؟' },
        options: [
          { en: 'NIS 95', fa: '۹۵ شِکِل' },
          { en: 'NIS 195', fa: '۱۹۵ شِکِل' },
          { en: 'NIS 500', fa: '۵۰۰ شِکِل' },
        ],
        answer: 1,
        why: { en: 'PIBA lists a service fee of NIS 195.', fa: 'PIBA هزینه‌ی خدمت را ۱۹۵ شِکِل اعلام کرده است.' },
      },
      {
        key: 'type',
        q: { en: 'Which permit do students receive?', fa: 'دانشجو چه مجوزی می‌گیرد؟' },
        options: [
          { en: 'A/2', fa: 'A/2' },
          { en: 'B/1', fa: 'B/1' },
          { en: 'B/2', fa: 'B/2' },
        ],
        answer: 0,
        why: { en: 'Students receive a temporary stay permit type A/2.', fa: 'دانشجو مجوز اقامت موقت نوع A/2 می‌گیرد.' },
      },
      {
        key: 'length',
        q: { en: 'How long is each student visa?', fa: 'هر ویزای دانشجویی چه مدت اعتبار دارد؟' },
        options: [
          { en: 'Up to one year', fa: 'تا یک سال' },
          { en: 'The whole degree', fa: 'کل دوره‌ی تحصیل' },
          { en: 'Three months', fa: 'سه ماه' },
        ],
        answer: 0,
        why: { en: 'PIBA issues it for up to a year at a time.', fa: 'PIBA آن را هر بار حداکثر برای یک سال صادر می‌کند.' },
      },
      {
        key: 'renewal',
        q: { en: 'What extra document does a yearly renewal need?', fa: 'تمدید سالانه چه مدرک اضافه‌ای می‌خواهد؟' },
        options: [
          { en: 'A bank guarantee', fa: 'ضمانت‌نامه‌ی بانکی' },
          { en: 'Your grade sheet', fa: 'کارنامه' },
          { en: 'A job offer', fa: 'پیشنهاد کار' },
        ],
        answer: 1,
        why: { en: 'PIBA asks for the grade sheet when extending for another year.', fa: 'PIBA برای تمدید یک سال دیگر کارنامه می‌خواهد.' },
      },
      {
        key: 'where',
        q: { en: 'Where do you submit the application?', fa: 'درخواست را کجا تحویل می‌دهید؟' },
        options: [
          { en: 'Online only', fa: 'فقط آنلاین' },
          { en: 'At the university', fa: 'در دانشگاه' },
          { en: 'In person at a PIBA office or an Israeli mission', fa: 'حضوری در دفتر PIBA یا نمایندگی اسرائیل' },
        ],
        answer: 2,
        why: {
          en: 'The form and documents are submitted in person at a local PIBA office or Israeli mission.',
          fa: 'فرم و مدارک حضوری در دفتر محلی PIBA یا نمایندگی اسرائیل تحویل داده می‌شود.',
        },
      },
    ],
    media: [],
  },
};

export const PROFILE_IL: CountryProfile = {
  strengths: [
    {
      en: 'One of the most innovative economies: 15th of 139 in the Global Innovation Index 2026, first in its region.',
      fa: 'از نوآورترین اقتصادهای جهان: رتبه‌ی ۱۵ از ۱۳۹ در شاخص جهانی نوآوری ۲۰۲۶ و نخست در منطقه‌ی خود.',
    },
    {
      en: 'A state agency, the Innovation Authority, runs dedicated visa tracks for tech founders and experts, plus grant programmes such as Tnufa.',
      fa: 'نهادی دولتی به نام سازمان نوآوری، مسیرهای ویژه‌ی ویزا برای بنیان‌گذاران و متخصصان فناوری و برنامه‌های کمک مالی مثل تنوفا را اداره می‌کند.',
    },
    {
      en: 'High incomes and low unemployment: GDP per capita about US$60,300 (2025) and unemployment about 3.5% (2025).',
      fa: 'درآمد بالا و بیکاری کم: تولید ناخالص سرانه حدود ۶۰٬۳۰۰ دلار (۲۰۲۵) و نرخ بیکاری حدود ۳٫۵ درصد (۲۰۲۵).',
    },
    {
      en: "The expert visa is fast (6–10 business days) and gives the spouse a work visa.",
      fa: 'ویزای متخصص سریع است (۶ تا ۱۰ روز کاری) و به همسر هم ویزای کار می‌دهد.',
    },
  ],
  weaknesses: [
    {
      en: 'Security: ranked 159th of 163 in the Global Peace Index 2026.',
      fa: 'امنیت: رتبه‌ی ۱۵۹ از ۱۶۳ در شاخص جهانی صلح ۲۰۲۶.',
    },
    {
      en: 'None of these visas leads to permanent residence; naturalisation requires permanent residency, Hebrew and giving up other citizenships.',
      fa: 'هیچ‌کدام از این ویزاها به اقامت دائم نمی‌رسد؛ تابعیت به اقامت دائم، زبان عبری و کنار گذاشتن تابعیت‌های دیگر نیاز دارد.',
    },
    {
      en: 'The B/1 expert track is closed to passports that need an Israeli tourist visa.',
      fa: 'مسیر متخصص B/1 به روی گذرنامه‌هایی که برای اسرائیل ویزای توریستی لازم دارند بسته است.',
    },
    {
      en: 'Official pages do not say whether Iranian passport holders can apply; confirm with PIBA first.',
      fa: 'صفحه‌های رسمی نمی‌گویند دارندگان گذرنامه‌ی ایرانی می‌توانند درخواست بدهند یا نه؛ اول از PIBA بپرسید.',
    },
  ],
  indicators: [
    {
      key: 'hdi',
      rank: 27,
      of: 193,
      value: 0.919,
      year: 2023,
      source: {
        url: 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Table.xlsx',
        checked: CHECKED,
        label: 'UNDP Human Development Report 2025, statistical annex table 1 (2023 data)',
      },
    },
    {
      key: 'happiness',
      rank: 8,
      value: 7.187,
      year: 2025,
      source: {
        url: 'https://data.worldhappiness.report/table',
        checked: CHECKED,
        label: 'World Happiness Report dashboard, rankings, year 2025 (life evaluation 7.187)',
      },
    },
    {
      key: 'peace',
      rank: 159,
      of: 163,
      value: 3.124,
      year: 2026,
      source: { url: 'https://www.visionofhumanity.org/maps/', checked: CHECKED, label: 'Global Peace Index 2026 (lower score = more peaceful)' },
    },
    {
      key: 'gdp-per-capita',
      value: 60337,
      unit: 'USD',
      year: 2025,
      source: {
        url: 'https://api.worldbank.org/v2/country/ISR/indicator/NY.GDP.PCAP.CD?format=json&mrnev=1',
        checked: CHECKED,
        label: 'World Bank, GDP per capita (current US$)',
      },
    },
    {
      key: 'unemployment',
      value: 3.5,
      unit: '%',
      year: 2025,
      source: {
        url: 'https://api.worldbank.org/v2/country/ISR/indicator/SL.UEM.TOTL.ZS?format=json&mrnev=1',
        checked: CHECKED,
        label: 'World Bank, unemployment, modeled ILO estimate (3.489%)',
      },
    },
    {
      key: 'innovation',
      rank: 15,
      of: 139,
      year: 2026,
      source: { url: 'https://www.wipo.int/gii-ranking/en/israel', checked: CHECKED, label: 'WIPO Global Innovation Index 2026' },
    },
    {
      key: 'passport',
      rank: 17,
      value: 167,
      unit: 'destinations',
      year: 2026,
      source: { url: 'https://www.henleyglobal.com/passport-index/ranking', checked: CHECKED, label: 'Henley Passport Index 2026' },
    },
  ],
};
