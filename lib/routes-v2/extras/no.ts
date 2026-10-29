// Norway: route depth and country profile (spec 2026-10-27). Figures read on
// udi.no (pages personalised for Iranian citizens) on 27 Oct 2026. Notebook
// 729a206e (Norway business and work migration) was a lead only.
// Research: docs/research/app-v3/no.md.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const NB = '729a206e-518e-4ce9-9862-69312af6649e';

const SKILLED = 'https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/?c=irn';
const SELF_HOW = 'https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/self-employed-persons-with-a-company-in-norway/how-to-apply-self-employed-persons-with-a-company-in-norway/?c=irn';
const SKILLED_HOW = 'https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/skilled-worker-with-a-norwegian-employer/how-to-apply-skilled-worker-with-a-norwegian-employer/?c=irn';
const SELF_CHECK = 'https://www.udi.no/en/checklists-container/work/checklist-for-self-employed-with-company-in-norway/';
const STUDY = 'https://www.udi.no/en/want-to-apply/studies/studietillatelse/?c=irn';
const STUDY_CHECK = 'https://www.udi.no/en/checklists-container/studies-au-pair/checklist-student/?c=irn';
const FEES = 'https://www.udi.no/en/word-definitions/fees/';
const PR = 'https://www.udi.no/en/want-to-apply/permanent-residence/permanent-residence-permit/adult/';
const PR_LANG = 'https://www.udi.no/en/important-messages/changes-to-the-requirements-for-a-permanent-residence-permit/';
const PR_TIMING = 'https://www.udi.no/en/important-messages/change-to-when-you-are-eligible-for-a-permanent-residence-permit/';
const CIT = 'https://www.udi.no/en/want-to-apply/citizenship/citizenship-for-people-who-hold-a-residence-permit-in-norway/?c=irn';
const BOOKING = 'https://www.udi.no/en/word-definitions/booking-of-an-appointment/';
const BRREG = 'https://www.brreg.no/en/';

const TIMELINE: Timeline = {
  prAfterYears: 3,
  citizenshipAfterYears: 8,
  dualCitizenship: 'allowed',
  language: {
    en: 'Permanent residence: oral Norwegian at A2 and a social studies test. Citizenship: oral Norwegian at B1 and the citizenship test.',
    fa: 'اقامت دائم: آزمون شفاهی نروژی سطح A2 و آزمون مطالعات اجتماعی. تابعیت: آزمون شفاهی نروژی سطح B1 و آزمون تابعیت.',
  },
  note: {
    en: 'Citizenship needs eight of the past eleven years (six of ten with sufficient income) and permanent residence. Since 1 January 2020 you do not have to give up your current citizenship, but your home country may still take it away.',
    fa: 'تابعیت به هشت سال از یازده سال گذشته (با درآمد کافی شش سال از ده سال) و اقامت دائم نیاز دارد. از ۱ ژانویه‌ی ۲۰۲۰ لازم نیست تابعیت فعلی را کنار بگذارید، اما ممکن است کشور خودتان آن را لغو کند.',
  },
  source: CIT,
};

const SHARED_DOCS = [
  { key: 'passport', label: { en: 'Passport and copies of all used pages', fa: 'گذرنامه و کپی همه‌ی صفحه‌های استفاده‌شده' }, stage: 'apply' as const },
  { key: 'signature', label: { en: 'Signed signature form from the application portal', fa: 'فرم امضاشده‌ی خروجی از پرتال درخواست' }, stage: 'apply' as const },
  { key: 'photo', label: { en: 'One recent passport photo, white background (if applying abroad)', fa: 'یک عکس پرسنلی تازه با زمینه‌ی سفید (برای درخواست از خارج)' }, stage: 'apply' as const },
  { key: 'cv', label: { en: 'CV', fa: 'رزومه' }, stage: 'apply' as const },
  { key: 'checklist', label: { en: 'UDI’s checklist, filled in and signed', fa: 'چک‌لیست UDI، تکمیل و امضاشده' }, stage: 'apply' as const },
  {
    key: 'residence-6m',
    label: { en: 'Proof of six months’ legal residence, if you apply from a country that is not your own', fa: 'مدرک شش ماه اقامت قانونی، اگر از کشوری غیر از کشور خودتان درخواست می‌دهید' },
    stage: 'apply' as const,
  },
  {
    key: 'translations',
    label: { en: 'Authorised translations into Norwegian or English, with translator and date', fa: 'ترجمه‌ی رسمی به نروژی یا انگلیسی با نام مترجم و تاریخ' },
    stage: 'apply' as const,
  },
];

const SKILLED_DOCS = [
  { key: 'education', label: { en: 'Diplomas and transcripts showing length, level and content', fa: 'مدارک و ریزنمرات با مدت، مقطع و محتوای دوره' }, stage: 'apply' as const },
  {
    key: 'work-certs',
    label: { en: 'Detailed work certificates (if experience is part of your qualification)', fa: 'گواهی‌های کاری دقیق (اگر سابقه‌ی کار بخشی از صلاحیت شماست)' },
    note: { en: 'Dates, training received, tasks and skills; course papers with hours and content.', fa: 'تاریخ‌ها، آموزش‌های دریافتی، وظایف و مهارت‌ها؛ مدارک دوره‌ها با ساعت و محتوا.' },
    stage: 'apply' as const,
  },
];

export const EXTRAS_NO: Record<string, RouteExtras> = {
  'no-self-employed': {
    funds: [
      { key: 'profit', label: { en: 'Expected yearly profit before tax (not savings)', fa: 'سود سالانه‌ی پیش‌بینی‌شده پیش از مالیات (نه پس‌انداز)' }, amount: 341_373, currency: 'NOK', basis: 'perYear', per: 'person', kind: 'show', source: SKILLED },
      { key: 'fee', label: { en: 'Application fee (work permit, over 18)', fa: 'هزینه‌ی درخواست (اقامت کاری، بالای ۱۸ سال)' }, amount: 6_300, currency: 'NOK', basis: 'once', per: 'person', kind: 'spend', source: FEES },
      { key: 'spouse-fee', label: { en: 'Family immigration, first application, adult', fa: 'پیوست خانواده، درخواست اول، بزرگسال' }, amount: 11_900, currency: 'NOK', basis: 'once', per: 'spouse', kind: 'spend', source: FEES },
      { key: 'child-fee', label: { en: 'Family immigration, first application, child under 18', fa: 'پیوست خانواده، درخواست اول، فرزند زیر ۱۸ سال' }, amount: 5_950, currency: 'NOK', basis: 'once', per: 'child', kind: 'spend', source: FEES },
    ],
    steps: [
      {
        key: 'qualify',
        title: { en: 'Check that you count as a skilled worker', fa: 'مطمئن شوید نیروی ماهر حساب می‌شوید' },
        detail: { en: 'A degree, 3-year upper-secondary vocational training, or special qualifications from long experience (usually six years or more).', fa: 'مدرک دانشگاهی، آموزش فنی‌وحرفه‌ای سه‌ساله در سطح دبیرستان، یا صلاحیت ویژه از سابقه‌ی طولانی (معمولاً شش سال یا بیشتر).' },
        link: SKILLED,
      },
      {
        key: 'plan',
        title: { en: 'Plan a sole proprietorship that earns NOK 341,373', fa: 'شرکت انفرادی‌ای طراحی کنید که ۳۴۱٬۳۷۳ کرون سود بدهد' },
        detail: { en: 'Write the business description, market and sales assessment and a first-year budget showing the profit before tax. Find premises and a business name.', fa: 'شرح کسب‌وکار، ارزیابی بازار و فروش و بودجه‌ی سال اول با سود پیش از مالیات را بنویسید. محل کار و نام تجاری را مشخص کنید.' },
        link: SELF_CHECK,
      },
      {
        key: 'register',
        title: { en: 'Register the business and get any licences', fa: 'کسب‌وکار را ثبت کنید و مجوزهای لازم را بگیرید' },
        detail: { en: 'Sole proprietorships are registered with the Brønnøysund Register Centre. If your trade needs a public permit, get it or a written promise of it.', fa: 'شرکت انفرادی در مرکز ثبت Brønnøysund ثبت می‌شود. اگر فعالیت‌تان مجوز دولتی لازم دارد، خود مجوز یا تعهد کتبی صدور آن را بگیرید.' },
        link: BRREG,
      },
      {
        key: 'apply',
        title: { en: 'Apply online and pay the fee', fa: 'آنلاین درخواست بدهید و هزینه را بپردازید' },
        detail: { en: 'Fill in the application in UDI’s portal, pay, and print the signature form.', fa: 'درخواست را در پرتال UDI پر کنید، هزینه را بپردازید و فرم امضا را چاپ کنید.' },
        link: SELF_HOW,
      },
      {
        key: 'hand-in',
        title: { en: 'Hand in documents', fa: 'مدارک را تحویل بدهید' },
        detail: { en: 'At the embassy or its service centre in the country where you live, or with the police if you are legally in Norway.', fa: 'در سفارت یا مرکز خدمات آن در کشور محل اقامت، یا اگر قانونی در نروژ هستید، در اداره‌ی پلیس.' },
        link: BOOKING,
      },
      {
        key: 'renew',
        title: { en: 'Renew every year', fa: 'هر سال تمدید کنید' },
        detail: { en: 'The permit is granted one year at a time; after three years you can apply for permanent residence.', fa: 'اقامت هر بار یک‌ساله صادر می‌شود؛ پس از سه سال می‌توانید برای اقامت دائم درخواست بدهید.' },
        link: SKILLED,
      },
    ],
    documents: [
      ...SHARED_DOCS,
      ...SKILLED_DOCS,
      { key: 'housing', label: { en: 'Proof of housing in Norway (rental contract approved by the owner)', fa: 'مدرک محل سکونت در نروژ (قرارداد اجاره‌ی تأییدشده‌ی مالک)' }, stage: 'apply' },
      { key: 'business', label: { en: 'Detailed business description with market and sales assessment and your role', fa: 'شرح دقیق کسب‌وکار با ارزیابی بازار و فروش و نقش شما' }, stage: 'apply' },
      { key: 'premises', label: { en: 'Business premises and business name', fa: 'محل کسب‌وکار و نام تجاری' }, stage: 'apply' },
      { key: 'budget', label: { en: 'First-year budget with profit before tax (new business)', fa: 'بودجه‌ی سال اول با سود پیش از مالیات (کسب‌وکار تازه)' }, stage: 'apply' },
      { key: 'accounts', label: { en: '12 months of accounts and business bank statements (existing business)', fa: 'حساب‌ها و صورت‌حساب بانکی کسب‌وکار در ۱۲ ماه گذشته (کسب‌وکار فعال)' }, stage: 'apply' },
      { key: 'permits', label: { en: 'Public permits the business needs, if any', fa: 'مجوزهای دولتی لازم برای کسب‌وکار، در صورت وجود' }, stage: 'apply' },
      { key: 'contracts', label: { en: 'Client contracts, if you have them', fa: 'قرارداد با مشتریان، اگر دارید' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'no-startup-visa',
        kind: 'myth',
        title: { en: '“Norway has a start-up visa”', fa: '«نروژ ویزای استارتاپ دارد»' },
        detail: { en: 'UDI lists no start-up permit. Founders use this self-employed permit (sole proprietorship) or set up an AS and apply as its skilled-worker employee.', fa: 'UDI مجوزی به نام استارتاپ ندارد. بنیان‌گذاران از همین اقامت خوداشتغالی (شرکت انفرادی) استفاده می‌کنند یا شرکت AS ثبت می‌کنند و به‌عنوان کارمند ماهر آن درخواست می‌دهند.' },
        source: SKILLED,
      },
      {
        key: 'as-company',
        kind: 'challenge',
        title: { en: 'A limited company (AS) does not qualify', fa: 'شرکت با مسئولیت محدود (AS) قبول نیست' },
        detail: { en: 'The business must normally be your own sole proprietorship, and you may not take any other work, including remote work.', fa: 'کسب‌وکار معمولاً باید شرکت انفرادی خودتان باشد و هیچ کار دیگری، حتی دورکاری، مجاز نیست.' },
        source: SKILLED,
      },
      {
        key: 'experience-route',
        kind: 'challenge',
        title: { en: 'Experience-only applications are often refused', fa: 'درخواست‌های مبتنی بر سابقه‌ی کار اغلب رد می‌شوند' },
        detail: { en: 'UDI says many applications based on special qualifications are rejected; documents from Iran for trades such as chef, car mechanic and carpenter get extra scrutiny because of fraud.', fa: 'UDI می‌گوید بسیاری از درخواست‌های مبتنی بر صلاحیت ویژه رد می‌شوند؛ مدارک ایرانی برای مشاغلی مثل آشپزی، مکانیکی خودرو و نجاری به دلیل سابقه‌ی جعل با دقت بیشتری بررسی می‌شود.' },
        source: SKILLED,
      },
      {
        key: 'profit-not-savings',
        kind: 'tip',
        title: { en: 'The NOK 341,373 is profit, not a bank balance', fa: '۳۴۱٬۳۷۳ کرون سود است، نه موجودی بانکی' },
        detail: { en: 'UDI asks for a budget showing that profit before tax, or 12 months of accounts if the business already runs. Client contracts strengthen it.', fa: 'UDI بودجه‌ای می‌خواهد که این سود پیش از مالیات را نشان دهد، یا اگر کسب‌وکار فعال است حساب‌های ۱۲ ماه گذشته. قرارداد با مشتری پرونده را قوی‌تر می‌کند.' },
        source: SELF_CHECK,
      },
      {
        key: 'pr-decision',
        kind: 'challenge',
        title: { en: 'PR rules are checked on the decision day', fa: 'شرایط اقامت دائم در روز تصمیم بررسی می‌شود' },
        detail: { en: 'For applications after 1 September 2025, all requirements must still be met when UDI or the police decide.', fa: 'برای درخواست‌های پس از ۱ سپتامبر ۲۰۲۵، همه‌ی شرایط باید در روز تصمیم UDI یا پلیس هم برقرار باشد.' },
        source: PR_TIMING,
      },
    ],
    timeline: TIMELINE,
    quiz: [
      {
        key: 'company',
        q: { en: 'What kind of company does the permit normally require?', fa: 'این اقامت معمولاً چه نوع شرکتی لازم دارد؟' },
        options: [{ en: 'A limited company (AS)', fa: 'شرکت با مسئولیت محدود (AS)' }, { en: 'Your own sole proprietorship', fa: 'شرکت انفرادی خودتان' }, { en: 'Any company abroad', fa: 'هر شرکتی در خارج' }],
        answer: 1,
        why: { en: 'The business must normally be your own sole proprietorship.', fa: 'کسب‌وکار معمولاً باید شرکت انفرادی خودتان باشد.' },
      },
      {
        key: 'profit',
        q: { en: 'What yearly profit must the business be likely to make?', fa: 'کسب‌وکار باید احتمالاً چه سود سالانه‌ای بدهد؟' },
        options: [{ en: 'NOK 265,998', fa: '۲۶۵٬۹۹۸ کرون' }, { en: 'NOK 341,373', fa: '۳۴۱٬۳۷۳ کرون' }, { en: 'NOK 500,000', fa: '۵۰۰٬۰۰۰ کرون' }],
        answer: 1,
        why: { en: 'At least NOK 341,373 a year before tax.', fa: 'دست‌کم ۳۴۱٬۳۷۳ کرون در سال پیش از مالیات.' },
      },
      {
        key: 'other-work',
        q: { en: 'Can you also work remotely for a foreign client as an employee?', fa: 'آیا می‌توانید هم‌زمان برای کارفرمای خارجی دورکاری کنید؟' },
        options: [{ en: 'Yes, freely', fa: 'بله، آزادانه' }, { en: 'No, only in your own business', fa: 'نه، فقط در کسب‌وکار خودتان' }],
        answer: 1,
        why: { en: 'You cannot take other work, remote work included.', fa: 'هیچ کار دیگری، حتی دورکاری، مجاز نیست.' },
      },
      {
        key: 'length',
        q: { en: 'How long is each permit?', fa: 'هر اقامت چه مدت اعتبار دارد؟' },
        options: [{ en: 'One year', fa: 'یک سال' }, { en: 'Two years', fa: 'دو سال' }, { en: 'Three years', fa: 'سه سال' }],
        answer: 0,
        why: { en: 'Granted one year at a time.', fa: 'هر بار یک‌ساله صادر می‌شود.' },
      },
      {
        key: 'pr',
        q: { en: 'Which Norwegian level is needed for permanent residence?', fa: 'برای اقامت دائم چه سطحی از نروژی لازم است؟' },
        options: [{ en: 'None', fa: 'هیچ' }, { en: 'Oral A2', fa: 'شفاهی A2' }, { en: 'B2', fa: 'B2' }],
        answer: 1,
        why: { en: 'An oral test at A2 or higher, plus social studies.', fa: 'آزمون شفاهی A2 یا بالاتر به‌علاوه‌ی مطالعات اجتماعی.' },
      },
    ],
    media: [
      { notebookId: NB, kind: 'video', title: 'The "Day One" Profit Paradox: Navigating Norway’s Startup Visa' },
      { notebookId: NB, kind: 'video', title: 'Norway’s Self-Employed Visa: Promise vs. Practice' },
      { notebookId: NB, kind: 'slides', title: 'Norway Business Blueprint' },
      { notebookId: NB, kind: 'slides', title: 'Norway Self-Employment Residency BlueprintOLD-' },
      { notebookId: NB, kind: 'infographic', title: 'راهنمای اقامت خوداشتغالی نروژ' },
      { notebookId: NB, kind: 'infographic', title: 'مزایا و معایب خوداشتغالی نروژ' },
      { notebookId: NB, kind: 'infographic', title: 'راهنمای راه‌اندازی شرکت در نروژ' },
      { notebookId: NB, kind: 'infographic', title: 'راهنمای راه‌اندازی شرکت انفرادی نروژ' },
    ],
  },

  'no-skilled-worker': {
    funds: [
      { key: 'fee', label: { en: 'Application fee (work permit, over 18)', fa: 'هزینه‌ی درخواست (اقامت کاری، بالای ۱۸ سال)' }, amount: 6_300, currency: 'NOK', basis: 'once', per: 'person', kind: 'spend', source: FEES },
      { key: 'spouse-fee', label: { en: 'Family immigration, first application, adult', fa: 'پیوست خانواده، درخواست اول، بزرگسال' }, amount: 11_900, currency: 'NOK', basis: 'once', per: 'spouse', kind: 'spend', source: FEES },
      { key: 'child-fee', label: { en: 'Family immigration, first application, child under 18', fa: 'پیوست خانواده، درخواست اول، فرزند زیر ۱۸ سال' }, amount: 5_950, currency: 'NOK', basis: 'once', per: 'child', kind: 'spend', source: FEES },
    ],
    steps: [
      {
        key: 'offer',
        title: { en: 'Get a concrete job offer', fa: 'پیشنهاد کاری مشخص بگیرید' },
        detail: { en: 'From one employer in Norway, normally full-time (80% is accepted), with pay and conditions normal for Norway.', fa: 'از یک کارفرمای نروژی، معمولاً تمام‌وقت (۸۰ درصد هم پذیرفته است)، با حقوق و شرایط مطابق عرف نروژ.' },
        link: SKILLED,
      },
      {
        key: 'confirmation',
        title: { en: 'Employer confirms the offer', fa: 'کارفرما پیشنهاد را تأیید می‌کند' },
        detail: { en: 'If you apply from abroad, the employer submits a confirmation and gives you a code to enter in your application.', fa: 'اگر از خارج درخواست می‌دهید، کارفرما تأییدیه ثبت می‌کند و کدی به شما می‌دهد که در فرم وارد می‌کنید.' },
        link: SKILLED,
      },
      {
        key: 'apply',
        title: { en: 'Apply online and pay', fa: 'آنلاین درخواست بدهید و هزینه را بپردازید' },
        detail: { en: 'Fill in the application portal and print the signature form.', fa: 'فرم پرتال درخواست را پر کنید و فرم امضا را چاپ کنید.' },
        link: SKILLED_HOW,
      },
      {
        key: 'hand-in',
        title: { en: 'Hand in documents', fa: 'مدارک را تحویل بدهید' },
        detail: { en: 'At the embassy or service centre where you live, or with the police if you are legally in Norway.', fa: 'در سفارت یا مرکز خدمات در کشور محل اقامت، یا در صورت حضور قانونی در نروژ، در اداره‌ی پلیس.' },
        link: BOOKING,
      },
      {
        key: 'pr',
        title: { en: 'Permanent residence after three years', fa: 'اقامت دائم پس از سه سال' },
        detail: { en: 'With an oral Norwegian test at A2, a social studies test and own income of at least NOK 341,373 in the past year.', fa: 'با آزمون شفاهی نروژی A2، آزمون مطالعات اجتماعی و درآمد شخصی دست‌کم ۳۴۱٬۳۷۳ کرون در سال گذشته.' },
        link: PR,
      },
    ],
    documents: [
      ...SHARED_DOCS,
      ...SKILLED_DOCS,
      { key: 'offer-form', label: { en: 'UDI Offer of employment form', fa: 'فرم پیشنهاد کاری UDI' }, stage: 'apply' },
      { key: 'pay', label: { en: 'Proof the pay meets requirements (collective agreement pay page, if any)', fa: 'مدرک اینکه حقوق با شرایط می‌خواند (صفحه‌ی نرخ دستمزد قرارداد جمعی، در صورت وجود)' }, stage: 'apply' },
      { key: 'housing', label: { en: 'Proof of accommodation, or a note on your plans', fa: 'مدرک محل سکونت، یا توضیح برنامه‌تان' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'founder-as',
        kind: 'tip',
        title: { en: 'Founders with an AS use this route', fa: 'بنیان‌گذار با شرکت AS از این مسیر می‌آید' },
        detail: { en: 'Your own limited company can be the Norwegian employer, if the job and pay meet the skilled-worker rules.', fa: 'شرکت با مسئولیت محدود خودتان می‌تواند کارفرمای نروژی باشد، به شرطی که شغل و حقوق با شرایط نیروی ماهر بخواند.' },
        source: SKILLED,
      },
      {
        key: 'no-salary-floor',
        kind: 'myth',
        title: { en: '“There is a fixed minimum salary”', fa: '«حداقل حقوق ثابتی وجود دارد»' },
        detail: { en: 'For ordinary employees UDI sets no NOK figure: pay must not be poorer than normal in Norway for that job.', fa: 'برای کارمند عادی UDI عدد ثابتی تعیین نکرده است؛ حقوق نباید از عرف نروژ برای همان شغل کمتر باشد.' },
        source: SKILLED,
      },
      {
        key: 'job-loss',
        kind: 'tip',
        title: { en: 'Six months if you lose the job', fa: 'شش ماه فرصت در صورت از دست دادن کار' },
        detail: { en: 'You can stay up to six months to find another job while the permit is valid; tell the police within seven days.', fa: 'تا وقتی اقامت معتبر است، تا شش ماه برای پیدا کردن کار تازه می‌توانید بمانید؛ ظرف هفت روز به پلیس اطلاع دهید.' },
        source: SKILLED,
      },
      {
        key: 'a2',
        kind: 'challenge',
        title: { en: 'Norwegian A2 for permanent residence', fa: 'نروژی A2 برای اقامت دائم' },
        detail: { en: 'Since 1 September 2025 the oral test must be passed at A2 (it was A1), and the course-hours rule was dropped.', fa: 'از ۱ سپتامبر ۲۰۲۵ آزمون شفاهی باید در سطح A2 قبول شود (پیش‌تر A1 بود) و شرط ساعت کلاس حذف شد.' },
        source: PR_LANG,
      },
      {
        key: 'vocational-wait',
        kind: 'challenge',
        title: { en: 'Vocational-level cases take longer', fa: 'پرونده‌های سطح فنی‌وحرفه‌ای طولانی‌ترند' },
        detail: { en: 'UDI says applications for jobs like cook, car mechanic, carpenter or hairdresser may take longer.', fa: 'UDI می‌گوید درخواست برای مشاغلی مثل آشپز، مکانیک خودرو، نجار یا آرایشگر ممکن است بیشتر طول بکشد.' },
        source: SKILLED,
      },
    ],
    timeline: TIMELINE,
    quiz: [
      {
        key: 'part-time',
        q: { en: 'What is the lowest position size UDI accepts?', fa: 'UDI کمترین درصد اشتغال را چقدر می‌پذیرد؟' },
        options: [{ en: '50%', fa: '۵۰ درصد' }, { en: '80%', fa: '۸۰ درصد' }, { en: '100% only', fa: 'فقط ۱۰۰ درصد' }],
        answer: 1,
        why: { en: 'At least an 80% position is accepted.', fa: 'موقعیت دست‌کم ۸۰ درصد پذیرفته می‌شود.' },
      },
      {
        key: 'experience',
        q: { en: 'Without a degree or vocational training, how much experience is usually needed?', fa: 'بدون مدرک دانشگاهی یا فنی‌وحرفه‌ای معمولاً چند سال سابقه لازم است؟' },
        options: [{ en: '3 years', fa: '۳ سال' }, { en: '6 years', fa: '۶ سال' }, { en: '10 years', fa: '۱۰ سال' }],
        answer: 1,
        why: { en: 'Special qualifications generally mean six years of work or more.', fa: 'صلاحیت ویژه معمولاً یعنی دست‌کم شش سال کار.' },
      },
      {
        key: 'length',
        q: { en: 'How long is a permit for a university-level job normally?', fa: 'اقامت برای شغل در سطح دانشگاهی معمولاً چه مدت است؟' },
        options: [{ en: 'Up to 1 year', fa: 'تا ۱ سال' }, { en: 'Up to 3 years', fa: 'تا ۳ سال' }, { en: '5 years', fa: '۵ سال' }],
        answer: 1,
        why: { en: 'Normally up to three years (one year through a staffing agency).', fa: 'معمولاً تا سه سال (از طریق شرکت کاریابی یک سال).' },
      },
      {
        key: 'fee',
        q: { en: 'What is the application fee for an adult?', fa: 'هزینه‌ی درخواست برای بزرگسال چقدر است؟' },
        options: [{ en: 'NOK 5,400', fa: '۵٬۴۰۰ کرون' }, { en: 'NOK 6,300', fa: '۶٬۳۰۰ کرون' }, { en: 'NOK 11,900', fa: '۱۱٬۹۰۰ کرون' }],
        answer: 1,
        why: { en: 'Work permits for applicants over 18 cost NOK 6,300.', fa: 'اقامت کاری برای بالای ۱۸ سال ۶٬۳۰۰ کرون است.' },
      },
      {
        key: 'dual',
        q: { en: 'Must you give up your citizenship to become Norwegian?', fa: 'برای گرفتن تابعیت نروژ باید تابعیت فعلی را کنار بگذارید؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No, not since 2020', fa: 'نه، از ۲۰۲۰ دیگر لازم نیست' }],
        answer: 1,
        why: { en: 'Since 1 January 2020 Norway does not require it.', fa: 'از ۱ ژانویه‌ی ۲۰۲۰ نروژ چنین شرطی ندارد.' },
      },
    ],
    media: [],
  },

  'no-study': {
    funds: [
      { key: 'year', label: { en: 'Living costs for the academic year', fa: 'هزینه‌ی زندگی برای سال تحصیلی' }, amount: 170_368, currency: 'NOK', basis: 'year', per: 'person', kind: 'show', source: STUDY },
      { key: 'fee', label: { en: 'Application fee (over 18)', fa: 'هزینه‌ی درخواست (بالای ۱۸ سال)' }, amount: 5_400, currency: 'NOK', basis: 'once', per: 'person', kind: 'spend', source: FEES },
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get full-time admission', fa: 'پذیرش تمام‌وقت بگیرید' },
        detail: { en: 'From an institution on NOKUT’s approved list.', fa: 'از مؤسسه‌ای در فهرست تأییدشده‌ی NOKUT.' },
        link: 'https://www.nokut.no/',
      },
      {
        key: 'funds',
        title: { en: 'Put the funds in place', fa: 'تمکن را آماده کنید' },
        detail: { en: 'NOK 170,368 for the year in a Norwegian account or the institution’s deposit account, plus proof you can pay tuition.', fa: '۱۷۰٬۳۶۸ کرون برای سال در حساب نروژی یا حساب سپرده‌ی دانشگاه، به‌علاوه‌ی مدرک توان پرداخت شهریه.' },
        link: STUDY,
      },
      {
        key: 'legalise',
        title: { en: 'Legalise your diploma', fa: 'مدرک تحصیلی را تأیید کنید' },
        detail: { en: 'A certified copy of your university diploma legalised by Iran’s Ministry of Foreign Affairs.', fa: 'رونوشت مصدق مدرک دانشگاهی با تأیید وزارت امور خارجه‌ی ایران.' },
        link: STUDY_CHECK,
      },
      {
        key: 'apply',
        title: { en: 'Apply online, then hand in documents', fa: 'آنلاین درخواست بدهید و مدارک را تحویل دهید' },
        detail: { en: 'Pay NOK 5,400 and hand in at the embassy or service centre. You normally cannot enter Norway before the decision.', fa: '۵٬۴۰۰ کرون بپردازید و مدارک را در سفارت یا مرکز خدمات تحویل دهید. معمولاً پیش از تصمیم نمی‌توانید وارد نروژ شوید.' },
        link: BOOKING,
      },
    ],
    documents: [
      ...SHARED_DOCS,
      { key: 'diploma', label: { en: 'Certified copy of your university diploma, legalised by Iran’s Ministry of Foreign Affairs', fa: 'رونوشت مصدق مدرک دانشگاهی با تأیید وزارت امور خارجه‌ی ایران' }, stage: 'apply' },
      { key: 'admission', label: { en: 'Letter of full-time admission (name, programme, level, length)', fa: 'نامه‌ی پذیرش تمام‌وقت (نام، رشته، مقطع، مدت)' }, stage: 'apply' },
      { key: 'funds', label: { en: 'Proof of NOK 15,488 a month or NOK 170,368 a year', fa: 'مدرک ۱۵٬۴۸۸ کرون در ماه یا ۱۷۰٬۳۶۸ کرون در سال' }, stage: 'apply' },
      { key: 'tuition', label: { en: 'Proof you can pay tuition, if charged', fa: 'مدرک توان پرداخت شهریه، اگر شهریه دارد' }, stage: 'apply' },
      { key: 'housing', label: { en: 'Proof of housing (or admission letter if the institution arranges it)', fa: 'مدرک محل سکونت (یا نامه‌ی پذیرش اگر دانشگاه خوابگاه می‌دهد)' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'no-pr',
        kind: 'challenge',
        title: { en: 'Study years do not count toward PR', fa: 'سال‌های تحصیل در اقامت دائم حساب نمی‌شوند' },
        detail: { en: 'UDI states the study-permit period does not count if you later apply for permanent residence.', fa: 'UDI صریحاً می‌گوید مدت اقامت تحصیلی برای اقامت دائم بعدی حساب نمی‌شود.' },
        source: STUDY,
      },
      {
        key: 'below-master',
        kind: 'challenge',
        title: { en: 'Below master level is hard for Iranian citizens', fa: 'مقاطع پایین‌تر از ارشد برای شهروندان ایران دشوار است' },
        detail: { en: 'Because of conditions in Iran, UDI says permits for study below master level may be hard to get, though each case is assessed.', fa: 'UDI به دلیل شرایط ایران می‌گوید گرفتن اقامت برای مقاطع پایین‌تر از ارشد ممکن است دشوار باشد، هرچند هر پرونده جداگانه بررسی می‌شود.' },
        source: STUDY,
      },
      {
        key: 'work',
        kind: 'tip',
        title: { en: '20 hours a week, full-time in holidays', fa: '۲۰ ساعت در هفته و تمام‌وقت در تعطیلات' },
        detail: { en: 'Work is allowed once the permit is granted, but not self-employment.', fa: 'پس از صدور اقامت کار مجاز است، اما خوداشتغالی نه.' },
        source: STUDY,
      },
      {
        key: 'family',
        kind: 'challenge',
        title: { en: 'Family applications are not processed with yours', fa: 'درخواست خانواده هم‌زمان با شما بررسی نمی‌شود' },
        detail: { en: 'A spouse and children can usually apply, but UDI currently cannot process them at the same time as the student.', fa: 'همسر و فرزندان معمولاً می‌توانند درخواست بدهند، اما UDI فعلاً نمی‌تواند هم‌زمان با دانشجو رسیدگی کند.' },
        source: STUDY,
      },
    ],
    timeline: {
      ...TIMELINE,
      note: {
        en: 'Study time does not count. The three years for permanent residence start once you hold a qualifying permit such as a skilled-worker permit.',
        fa: 'مدت تحصیل حساب نمی‌شود. سه سال لازم برای اقامت دائم از زمانی شروع می‌شود که اقامت واجد شرایط، مثلاً اقامت نیروی ماهر، داشته باشید.',
      },
      source: STUDY,
    },
    quiz: [
      {
        key: 'funds',
        q: { en: 'How much must you show for a full academic year?', fa: 'برای یک سال تحصیلی کامل چه مبلغی باید نشان دهید؟' },
        options: [{ en: 'NOK 128,887', fa: '۱۲۸٬۸۸۷ کرون' }, { en: 'NOK 170,368', fa: '۱۷۰٬۳۶۸ کرون' }, { en: 'NOK 341,373', fa: '۳۴۱٬۳۷۳ کرون' }],
        answer: 1,
        why: { en: 'NOK 170,368 for the year, NOK 15,488 a month.', fa: '۱۷۰٬۳۶۸ کرون برای سال، ماهانه ۱۵٬۴۸۸ کرون.' },
      },
      {
        key: 'hours',
        q: { en: 'How many hours a week can you work during term?', fa: 'در طول ترم چند ساعت در هفته می‌توانید کار کنید؟' },
        options: [{ en: '15', fa: '۱۵' }, { en: '20', fa: '۲۰' }, { en: '30', fa: '۳۰' }],
        answer: 1,
        why: { en: 'Up to 20 hours, full-time in holidays.', fa: 'تا ۲۰ ساعت و در تعطیلات تمام‌وقت.' },
      },
      {
        key: 'pr',
        q: { en: 'Does study time count toward permanent residence?', fa: 'مدت تحصیل در اقامت دائم حساب می‌شود؟' },
        options: [{ en: 'Yes, fully', fa: 'بله، کامل' }, { en: 'Half', fa: 'نصف' }, { en: 'No', fa: 'نه' }],
        answer: 2,
        why: { en: 'UDI says it does not count.', fa: 'UDI می‌گوید حساب نمی‌شود.' },
      },
      {
        key: 'nokut',
        q: { en: 'Whose list must your institution be on?', fa: 'مؤسسه‌ی شما باید در فهرست کدام نهاد باشد؟' },
        options: [{ en: 'NAV', fa: 'NAV' }, { en: 'NOKUT', fa: 'NOKUT' }, { en: 'Innovation Norway', fa: 'Innovation Norway' }],
        answer: 1,
        why: { en: 'NOKUT’s list of approved institutions.', fa: 'فهرست مؤسسات تأییدشده‌ی NOKUT.' },
      },
      {
        key: 'fee',
        q: { en: 'What is the study-permit fee for an adult?', fa: 'هزینه‌ی اقامت تحصیلی برای بزرگسال چقدر است؟' },
        options: [{ en: 'NOK 5,400', fa: '۵٬۴۰۰ کرون' }, { en: 'NOK 6,300', fa: '۶٬۳۰۰ کرون' }, { en: 'Free', fa: 'رایگان' }],
        answer: 0,
        why: { en: 'NOK 5,400 for applicants over 18.', fa: '۵٬۴۰۰ کرون برای بالای ۱۸ سال.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_NO: CountryProfile = {
  strengths: [
    { en: 'Permanent residence after three years on a qualifying permit.', fa: 'اقامت دائم پس از سه سال با اقامت واجد شرایط.' },
    { en: 'Dual citizenship allowed since 2020.', fa: 'تابعیت دوگانه از ۲۰۲۰ مجاز است.' },
    { en: 'Second in the world on the UN Human Development Index, with high wages.', fa: 'رتبه‌ی دوم جهان در شاخص توسعه‌ی انسانی سازمان ملل و دستمزد بالا.' },
    { en: 'Very high English proficiency; daily life works in English.', fa: 'سطح بسیار بالای انگلیسی؛ زندگی روزمره به انگلیسی ممکن است.' },
  ],
  weaknesses: [
    { en: 'No start-up visa; a self-employed founder must run a sole proprietorship that earns NOK 341,373 from the start.', fa: 'ویزای استارتاپ ندارد؛ بنیان‌گذار خوداشتغال باید شرکت انفرادی‌ای داشته باشد که از ابتدا ۳۴۱٬۳۷۳ کرون سود بدهد.' },
    { en: 'Self-employed and vocational permits run one year at a time.', fa: 'اقامت خوداشتغالی و فنی‌وحرفه‌ای هر بار فقط یک‌ساله است.' },
    { en: 'Extra scrutiny for some Iranian documents and for study below master level.', fa: 'بررسی سخت‌گیرانه‌تر برخی مدارک ایرانی و تحصیل در مقاطع پایین‌تر از ارشد.' },
    { en: 'Study years do not count toward permanent residence.', fa: 'سال‌های تحصیل در اقامت دائم حساب نمی‌شوند.' },
  ],
  indicators: [
    { key: 'hdi', rank: 2, of: 193, value: 0.97, year: 2023, source: { url: 'https://hdr.undp.org/data-center/specific-country-data#/countries/NOR', checked: '2026-10-27', label: 'UNDP HDR 2025 (2023 data)' } },
    { key: 'happiness', rank: 6, year: 2026, source: { url: 'https://data.worldhappiness.report/table', checked: '2026-10-27', label: 'World Happiness Report 2026' } },
    { key: 'gdp-per-capita', value: 94_594, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/NOR/indicator/NY.GDP.PCAP.CD?format=json', checked: '2026-10-27', label: 'World Bank' } },
    { key: 'unemployment', value: 4.6, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/NOR/indicator/SL.UEM.TOTL.ZS?format=json', checked: '2026-10-27', label: 'World Bank (ILO estimate)' } },
    { key: 'english', rank: 5, of: 123, year: 2025, source: { url: 'https://www.ef.com/wwen/epi/', checked: '2026-10-27', label: 'EF EPI 2025' } },
  ],
};
