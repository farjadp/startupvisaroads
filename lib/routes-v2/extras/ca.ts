// Canada: route depth for the app's v3 content (spec 2026-10-27).
// Every figure was read on the official page cited next to it on 2026-10-27.
// Farjad's Gemini notebooks gave leads and structure only; conflicts are in
// docs/research/app-v3/ca.md. Not re-read today, so left out here: PEI
// investment and operating-expense minimums, PEI 2026 draw counts, the
// Manitoba investment figures (site returns 403; the guide PDF has blanks).
import type { CountryProfile, DocItem, FundLine, QuizItem, RouteExtras } from '../extras-types';

const D = '2026-10-27';

// ---------------------------------------------------------------- sources

const S = {
  fees: 'https://ircc.canada.ca/english/information/fees/fees.asp',
  eeFunds: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/proof-funds.html',
  eeWorks: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/works.html',
  eeProfile: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile.html',
  eeApply: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/apply-permanent-residence.html',
  eeCrs: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html',
  eeChanges: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/changes.html',
  suv: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html',
  suvAbout: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/about.html',
  suvElig: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/eligibility.html',
  citizenship: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/become-canadian-citizen/eligibility.html',
  prStatus: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/permanent-residents/status.html',
  ns: 'https://liveinnovascotia.com/entrepreneur',
  nsGuide: 'https://liveinnovascotia.com/sites/default/files/2026-02/Guide-NSNP-ENT-English.pdf',
  nsFees: 'https://liveinnovascotia.com/resources/nsnp-update-application-fees-effective-september-1-2026',
  nsPortal: 'https://novascotia.ca/ensnp',
  nb: 'https://www.gnb.ca/en/topic/family-home-community/immigration/provincial-nominee-program/business-immigration-stream.html',
  nbGuide: 'https://www.gnb.ca/content/dam/GNB3/t/fhc-fmc/immigration/docs/nb-business-immigration-stream-guide.pdf',
  ab: 'https://www.alberta.ca/aaip-rural-entrepreneur-stream-eligibility',
  abApply: 'https://www.alberta.ca/aaip-rural-entrepreneur-stream-how-to-apply',
  abAfter: 'https://www.alberta.ca/aaip-rural-entrepreneur-stream-after-you-are-nominated',
  abProcessing: 'https://www.alberta.ca/aaip-processing-information',
  mbGuide: 'https://immigratemanitoba.com/wp-content/uploads/2024/07/BIS-Entrepreneur-Stream-Guidelines-final-July-2024.pdf',
  mb: 'https://immigratemanitoba.com/mpnp/bis/ep/eligibility/',
  pei: 'https://www.princeedwardisland.ca/en/information/office-of-immigration/work-permit-stream',
  studyFunds: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html',
  pal: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html',
  pgwp: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html',
  offCampus: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html',
  studyApply: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html',
  dli: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html',
  workPermit: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit.html',
  pnpApply: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees/non-express-entry.html',
  iran2026: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/public-policies/iran-2026.html',
} as const;

// ---------------------------------------------------------------- shared money

/** IRCC permanent-residence and biometrics fees, economic class (fee list dated 2026-09-21). */
const PR_FEES: FundLine[] = [
  { key: 'pr-principal', label: { en: 'PR fee, principal applicant (processing + right of PR)', fa: 'هزینهٔ اقامت دائم، متقاضی اصلی (رسیدگی و حق اقامت دائم)' }, amount: 1_590, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.fees },
  { key: 'pr-spouse', label: { en: 'PR fee, spouse or partner', fa: 'هزینهٔ اقامت دائم، همسر یا شریک زندگی' }, amount: 1_590, currency: 'CAD', basis: 'once', per: 'spouse', kind: 'spend', source: S.fees },
  { key: 'pr-child', label: { en: 'PR fee, each dependent child', fa: 'هزینهٔ اقامت دائم، هر فرزند وابسته' }, amount: 270, currency: 'CAD', basis: 'once', per: 'child', kind: 'spend', source: S.fees },
  { key: 'biometrics', label: { en: 'Biometrics, per person (family maximum CAD 170)', fa: 'انگشت‌نگاری، هر نفر (سقف خانواده ۱۷۰ دلار کانادا)' }, amount: 85, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.fees },
];

const WORK_PERMIT_FEE: FundLine = {
  key: 'work-permit',
  label: { en: 'IRCC work permit, per person', fa: 'مجوز کار IRCC، هر نفر' },
  amount: 155,
  currency: 'CAD',
  basis: 'once',
  per: 'person',
  kind: 'spend',
  source: S.fees,
};

/** Express Entry settlement-funds table (updated 7 Jul 2025 on the proof-of-funds page). */
const SETTLEMENT = (for_: 'family' | 'founder'): FundLine[] => {
  // One row per household size; the app shows the row for the user's household (founder routes: each founder's own family).
  const per = 'household' as const;
  const who = for_ === 'founder' ? { en: ' (each founder, for his or her own family)', fa: ' (هر بنیان‌گذار، برای خانوادهٔ خودش)' } : { en: '', fa: '' };
  const rows: Array<[number, number, string]> = [
    [1, 15_263, '۱'],
    [2, 19_001, '۲'],
    [3, 23_360, '۳'],
    [4, 28_362, '۴'],
  ];
  const lines: FundLine[] = rows.map(([n, amount, faN]) => ({
    key: `settlement-${n}`,
    label: { en: `Settlement funds, family of ${n}${who.en}`, fa: `هزینهٔ استقرار، خانوادهٔ ${faN} نفره${who.fa}` },
    amount,
    currency: 'CAD',
    basis: 'once',
    per,
    householdSize: n,
    kind: 'show',
    source: S.eeFunds,
  }));
  lines.push({
    key: 'settlement-7',
    label: { en: `Settlement funds, family of 7${who.en}; add CAD 4,112 for each extra member`, fa: `هزینهٔ استقرار، خانوادهٔ ۷ نفره${who.fa}؛ به‌ازای هر عضو بیشتر ۴٬۱۱۲ دلار کانادا` },
    amount: 40_392,
    currency: 'CAD',
    basis: 'once',
    per,
    householdSize: 7,
    openEnded: true,
    kind: 'show',
    source: S.eeFunds,
  });
  return lines;
};

/** The documents IRCC's Express Entry page lists for a PR application; reused for the PNP paper application. */
const IRCC_PR_DOCS: DocItem[] = [
  { key: 'passport', label: { en: 'Passport or travel document', fa: 'گذرنامه یا سند سفر' }, stage: 'apply' },
  { key: 'police', label: { en: 'Police certificates', fa: 'گواهی عدم سوء پیشینه' }, note: { en: 'For each country where you lived as required on your checklist.', fa: 'برای هر کشوری که چک‌لیست شما می‌خواهد.' }, stage: 'apply' },
  { key: 'medical', label: { en: 'Medical exam (IME number or IMM 1017B)', fa: 'معاینهٔ پزشکی (شمارهٔ IME یا فرم IMM 1017B)' }, stage: 'apply' },
  { key: 'civil', label: { en: 'Marriage, divorce or common-law papers (IMM 5409) and children’s birth certificates', fa: 'سند ازدواج، طلاق یا اقرارنامهٔ زندگی مشترک (IMM 5409) و شناسنامهٔ فرزندان' }, stage: 'apply' },
  { key: 'rep', label: { en: 'IMM 5476 if you use a representative', fa: 'فرم IMM 5476 اگر وکیل یا مشاور دارید' }, stage: 'apply' },
];

// ---------------------------------------------------------------- timelines

const CITIZENSHIP_NOTE = {
  en: 'Citizenship needs 1,095 days in Canada in the last 5 years, at least 730 of them as a PR; each day before PR counts as half a day, up to 365. Keep PR by spending 730 days in Canada in every 5 years. Canada allows dual citizenship, but your other country may not.',
  fa: 'برای شهروندی باید در پنج سال اخیر ۱٬۰۹۵ روز در کانادا بوده باشید که دست‌کم ۷۳۰ روز آن با اقامت دائم باشد؛ هر روز پیش از اقامت دائم نیم روز حساب می‌شود، حداکثر ۳۶۵ روز. برای حفظ اقامت دائم باید در هر پنج سال ۷۳۰ روز در کانادا باشید. کانادا تابعیت دوگانه را می‌پذیرد، اما کشور دیگرتان شاید نپذیرد.',
};
const CITIZENSHIP_LANGUAGE = {
  en: 'Citizenship: CLB 4 in speaking and listening, and the citizenship test, for ages 18 to 54.',
  fa: 'شهروندی: CLB ۴ در گفتار و شنیدار و آزمون شهروندی، برای ۱۸ تا ۵۴ سال.',
};

const PNP_TIMELINE = (prYears: number, en: string, fa: string) => ({
  prAfterYears: prYears,
  citizenshipAfterYears: prYears + 2,
  dualCitizenship: 'allowed' as const,
  language: CITIZENSHIP_LANGUAGE,
  note: { en: `${en} ${CITIZENSHIP_NOTE.en}`, fa: `${fa} ${CITIZENSHIP_NOTE.fa}` },
  source: S.citizenship,
});

// ---------------------------------------------------------------- extras

export const EXTRAS_CA: Record<string, RouteExtras> = {
  // ---------------------------------------------------------------- SUV
  'ca-start-up-visa': {
    funds: [
      ...SETTLEMENT('founder'),
      ...PR_FEES,
    ],
    steps: [
      {
        key: 'check-accepted',
        title: { en: 'Check that your file was accepted before 30 June 2026', fa: 'مطمئن شوید پرونده‌تان پیش از ۳۰ ژوئن ۲۰۲۶ پذیرفته شده است' },
        detail: {
          en: 'The programme was paused on 30 June 2026. IRCC keeps processing applications it accepted before that date and takes no new ones.',
          fa: 'برنامه از ۳۰ ژوئن ۲۰۲۶ متوقف شده است. IRCC پرونده‌هایی را که پیش از این تاریخ پذیرفته بررسی می‌کند و درخواست تازه نمی‌گیرد.',
        },
        link: S.suvAbout,
      },
      {
        key: 'certificate',
        title: { en: 'Your commitment certificate must predate 1 January 2026', fa: 'گواهی تعهد شما باید پیش از ۱ ژانویهٔ ۲۰۲۶ صادر شده باشد' },
        detail: {
          en: 'A certificate IRCC received before 1 January 2026 gave you 6 months to apply. Later certificates cannot be used.',
          fa: 'اگر IRCC گواهی را پیش از ۱ ژانویهٔ ۲۰۲۶ دریافت کرده بود، شش ماه برای ثبت درخواست وقت داشتید. گواهی‌های بعدی قابل استفاده نیستند.',
        },
        link: S.suvElig,
      },
      {
        key: 'work-permit',
        title: { en: 'Extend your Start-up Visa work permit while PR is processed', fa: 'مجوز کار ویزای استارتاپ را تا پایان بررسی اقامت دائم تمدید کنید' },
        detail: {
          en: 'If you already hold a work permit under the programme, you may be able to extend it while IRCC processes your PR file. New work permits are closed.',
          fa: 'اگر از قبل با این برنامه مجوز کار دارید، شاید بتوانید آن را تا پایان بررسی پروندهٔ اقامت دائم تمدید کنید. صدور مجوز کار تازه بسته است.',
        },
        link: S.suv,
      },
      {
        key: 'keep-funds',
        title: { en: 'Keep your settlement funds and documents current', fa: 'هزینهٔ استقرار و مدارک را به‌روز نگه دارید' },
        detail: {
          en: 'Funds cannot be borrowed and must cover your family size on the current table. Send IRCC any change in family or address.',
          fa: 'این پول نباید قرضی باشد و باید با جدول فعلی برای تعداد اعضای خانواده‌تان جور باشد. هر تغییر در خانواده یا نشانی را به IRCC اطلاع دهید.',
        },
        link: S.suvElig,
      },
    ],
    documents: [
      { key: 'commitment', label: { en: 'Commitment certificate (received by IRCC before 1 Jan 2026)', fa: 'گواهی تعهد (دریافت‌شده در IRCC پیش از ۱ ژانویهٔ ۲۰۲۶)' }, stage: 'apply' },
      { key: 'language', label: { en: 'Language test: CLB 5 in all four abilities, from an approved agency', fa: 'آزمون زبان: CLB ۵ در هر چهار مهارت از مرکز مورد تأیید' }, stage: 'apply' },
      { key: 'funds', label: { en: 'Proof of settlement funds (not borrowed)', fa: 'اثبات هزینهٔ استقرار (غیرقرضی)' }, stage: 'apply' },
      ...IRCC_PR_DOCS,
    ],
    realities: [
      {
        key: 'paused',
        kind: 'challenge',
        title: { en: 'Paused on 30 June 2026, no successor named', fa: 'توقف از ۳۰ ژوئن ۲۰۲۶، بدون برنامهٔ جایگزین' },
        detail: {
          en: 'canada.ca marks the programme, the work-permit option and the "help an entrepreneur" section as paused or closed, and names no replacement.',
          fa: 'canada.ca خود برنامه، گزینهٔ مجوز کار و بخش «کمک به کارآفرین» را متوقف یا بسته اعلام کرده و جایگزینی معرفی نکرده است.',
        },
        source: S.suv,
      },
      {
        key: 'january-myth',
        kind: 'myth',
        title: { en: 'Myth: "it closed in January 2026"', fa: 'باور نادرست: «برنامه در ژانویهٔ ۲۰۲۶ بسته شد»' },
        detail: {
          en: 'January 2026 is the cut-off for commitment certificates. The programme itself was paused on 30 June 2026, and files accepted before then are still processed.',
          fa: 'ژانویهٔ ۲۰۲۶ مهلت گواهی تعهد بود. خود برنامه از ۳۰ ژوئن ۲۰۲۶ متوقف شد و پرونده‌های پذیرفته‌شده پیش از آن هنوز بررسی می‌شوند.',
        },
        source: S.suvElig,
      },
      {
        key: 'backlog',
        kind: 'challenge',
        title: { en: 'Long queues; IRCC publishes no processing time', fa: 'صف طولانی؛ IRCC زمان رسیدگی منتشر نمی‌کند' },
        detail: {
          en: 'The processing-time box on canada.ca shows no data. Figures such as "43,000 waiting" or "10 years" come from a parliamentary exchange and press, not from IRCC.',
          fa: 'کادر زمان رسیدگی در canada.ca داده‌ای نشان نمی‌دهد. رقم‌هایی مانند «۴۳ هزار نفر در صف» یا «ده سال انتظار» از بحث پارلمانی و رسانه‌ها آمده است، نه از IRCC.',
        },
        source: S.suvAbout,
      },
      {
        key: 'team',
        kind: 'tip',
        title: { en: 'Funds are counted per founder', fa: 'هزینهٔ استقرار برای هر بنیان‌گذار جداگانه حساب می‌شود' },
        detail: {
          en: 'A group may have up to 5 owners. Each applicant shows settlement funds for his or her own family; one founder’s money does not cover another.',
          fa: 'هر گروه حداکثر پنج مالک دارد. هر متقاضی هزینهٔ استقرار خانوادهٔ خودش را نشان می‌دهد و پول یک بنیان‌گذار جای دیگری را پر نمی‌کند.',
        },
        source: S.suvElig,
      },
    ],
    timeline: {
      prAfterYears: 0,
      citizenshipAfterYears: 3,
      dualCitizenship: 'allowed',
      language: CITIZENSHIP_LANGUAGE,
      note: { en: `PR is granted directly, so the clock starts at landing (earlier days on the Start-up Visa work permit count half). ${CITIZENSHIP_NOTE.en}`, fa: `اقامت دائم مستقیم است و شمارش از ورود با اقامت دائم شروع می‌شود (روزهای قبلی با مجوز کار نیم روز حساب می‌شود). ${CITIZENSHIP_NOTE.fa}` },
      source: S.citizenship,
    },
    quiz: [
      q('pause-date', 'When was the Start-up Visa Program paused?', 'برنامهٔ ویزای استارتاپ از چه تاریخی متوقف شد؟', [['1 January 2026', '۱ ژانویهٔ ۲۰۲۶'], ['30 June 2026', '۳۰ ژوئن ۲۰۲۶'], ['21 July 2026', '۲۱ ژوئیهٔ ۲۰۲۶'], ['It is still open', 'هنوز باز است']], 1, 'canada.ca says the programme was paused on 30 June 2026.', 'canada.ca می‌گوید برنامه در ۳۰ ژوئن ۲۰۲۶ متوقف شد.'),
      q('language', 'What language level did each applicant need?', 'هر متقاضی به چه سطح زبانی نیاز داشت؟', [['CLB 4', 'CLB ۴'], ['CLB 5 in all four abilities', 'CLB ۵ در هر چهار مهارت'], ['CLB 7', 'CLB ۷'], ['No test', 'آزمون لازم نبود']], 1, 'The eligibility page asks for CLB 5 in listening, reading, writing and speaking.', 'صفحهٔ شرایط CLB ۵ را در شنیدار، خواندن، نوشتن و گفتار می‌خواهد.'),
      q('owners', 'How many owners can one start-up group have?', 'یک گروه استارتاپی حداکثر چند مالک می‌تواند داشته باشد؟', [['2', '۲'], ['3', '۳'], ['5', '۵'], ['No limit', 'بدون محدودیت']], 2, 'IRCC allows up to 5 owners per group.', 'IRCC برای هر گروه حداکثر پنج مالک را می‌پذیرد.'),
      q('voting', 'What voting share did each applicant need?', 'هر متقاضی به چه سهمی از حق رأی نیاز داشت؟', [['At least 10%', 'دست‌کم ۱۰٪'], ['At least 25%', 'دست‌کم ۲۵٪'], ['At least 51%', 'دست‌کم ۵۱٪'], ['None', 'هیچ']], 0, 'Each applicant held at least 10%, and applicants plus the organisation more than 50%.', 'هر متقاضی دست‌کم ۱۰٪ و متقاضیان با سازمان تعیین‌شده روی هم بیش از ۵۰٪ داشتند.'),
      q('funds-single', 'Settlement funds for a single applicant are…', 'هزینهٔ استقرار برای یک متقاضی مجرد چقدر است؟', [['CAD 10,000', '۱۰٬۰۰۰ دلار کانادا'], ['CAD 15,263', '۱۵٬۲۶۳ دلار کانادا'], ['CAD 23,448', '۲۳٬۴۴۸ دلار کانادا'], ['None', 'لازم نیست']], 1, 'The IRCC table sets CAD 15,263 for one person.', 'جدول IRCC برای یک نفر ۱۵٬۲۶۳ دلار کانادا تعیین کرده است.'),
    ],
    media: [{ notebookId: '5e06c421-a625-4f35-a7be-0a77acf56559', kind: 'infographic', title: 'بحران ویزای استارتاپ کانادا' }],
  },

  // ---------------------------------------------------------------- Express Entry
  'ca-express-entry': {
    funds: [...SETTLEMENT('family'), ...PR_FEES],
    steps: [
      {
        key: 'eligibility',
        title: { en: 'Check which programme you fit', fa: 'ببینید با کدام برنامه جور هستید' },
        detail: {
          en: 'FSW: CLB 7, 1 year of continuous skilled work in the last 10 years, secondary education. CEC: 1 year of Canadian work in the last 3 years. FST: 2 years in a trade in the last 5 and a job offer or certificate.',
          fa: 'FSW: CLB ۷، یک سال کار ماهر پیوسته در ده سال اخیر و تحصیلات متوسطه. CEC: یک سال کار در کانادا در سه سال اخیر. FST: دو سال کار فنی در پنج سال اخیر و پیشنهاد کار یا گواهی صلاحیت.',
        },
        link: S.eeWorks,
      },
      {
        key: 'tests',
        title: { en: 'Take a language test and get an ECA', fa: 'آزمون زبان بدهید و ارزیابی مدرک (ECA) بگیرید' },
        detail: {
          en: 'Expired language or ECA results make a profile ineligible, so keep both valid until you apply.',
          fa: 'اگر نتیجهٔ آزمون زبان یا ECA منقضی شود، پروفایل واجد شرایط نمی‌ماند؛ هر دو را تا زمان درخواست معتبر نگه دارید.',
        },
        link: S.eeProfile,
      },
      {
        key: 'profile',
        title: { en: 'Create your profile in your IRCC account', fa: 'پروفایل را در حساب IRCC بسازید' },
        detail: {
          en: 'You have 60 days to complete and submit it, or you start over.',
          fa: 'برای تکمیل و ارسال آن ۶۰ روز وقت دارید؛ وگرنه باید از نو شروع کنید.',
        },
        takes: { en: '60 days to submit', fa: '۶۰ روز برای ارسال' },
        link: S.eeProfile,
      },
      {
        key: 'job-offer',
        title: { en: 'Add any job offer before 3 November 2026', fa: 'هر پیشنهاد کاری دارید پیش از ۳ نوامبر ۲۰۲۶ اضافه کنید' },
        detail: {
          en: 'From 3 Nov 2026 a qualifying job offer in a high-wage occupation earns 50, 70 or 100 points without an LMIA; Canadian work experience can earn up to 150. You get the higher of the two. Rounds pause up to two weeks while scores are recalculated.',
          fa: 'از ۳ نوامبر ۲۰۲۶ پیشنهاد کار واجد شرایط در شغل پردرآمد، بدون LMIA، ۵۰ یا ۷۰ یا ۱۰۰ امتیاز دارد و سابقهٔ کار در کانادا تا ۱۵۰ امتیاز. از این دو، هر کدام بیشتر باشد حساب می‌شود. تا دو هفته، هنگام محاسبهٔ دوبارهٔ امتیازها، قرعه برگزار نمی‌شود.',
        },
        link: S.eeChanges,
      },
      {
        key: 'ita',
        title: { en: 'Wait for an invitation in a round you are eligible for', fa: 'منتظر دعوت‌نامه در قرعه‌ای بمانید که واجد شرایط آن هستید' },
        detail: {
          en: 'A provincial nomination adds 600 CRS points; French at NCLC 7 adds up to 50.',
          fa: 'نامزدی استانی ۶۰۰ امتیاز CRS اضافه می‌کند و فرانسه در سطح NCLC ۷ تا ۵۰ امتیاز.',
        },
        link: S.eeCrs,
      },
      {
        key: 'apply',
        title: { en: 'Submit the PR application within 60 days', fa: 'درخواست اقامت دائم را ظرف ۶۰ روز بفرستید' },
        detail: {
          en: 'The invitation is valid for 60 days. Upload police certificates, proof of funds, a medical exam record and civil documents, and pay the fees.',
          fa: 'دعوت‌نامه ۶۰ روز اعتبار دارد. گواهی عدم سوء پیشینه، اثبات تمکن، سابقهٔ معاینهٔ پزشکی و مدارک سجلی را بارگذاری و هزینه‌ها را پرداخت کنید.',
        },
        takes: { en: '60 days from the invitation', fa: '۶۰ روز از تاریخ دعوت‌نامه' },
        link: S.eeApply,
      },
    ],
    documents: [
      { key: 'language', label: { en: 'Language test results (valid)', fa: 'نتیجهٔ آزمون زبان (معتبر)' }, stage: 'apply' },
      { key: 'eca', label: { en: 'Educational Credential Assessment (FSW, foreign degree)', fa: 'ارزیابی مدرک تحصیلی ECA (FSW، مدرک خارجی)' }, stage: 'apply' },
      { key: 'funds', label: { en: 'Proof of funds (FSW, FST; not CEC)', fa: 'اثبات تمکن مالی (FSW و FST؛ نه CEC)' }, note: { en: 'Exempt if you are authorised to work in Canada with a valid job offer; upload a letter explaining the exemption.', fa: 'اگر اجازهٔ کار در کانادا و پیشنهاد کار معتبر دارید معاف‌اید؛ نامه‌ای در توضیح معافیت بارگذاری کنید.' }, stage: 'apply' },
      { key: 'work-letters', label: { en: 'Reference letters for your work experience', fa: 'نامهٔ سابقهٔ کار از کارفرمایان' }, stage: 'apply' },
      ...IRCC_PR_DOCS,
    ],
    realities: [
      {
        key: 'nov-2026',
        kind: 'challenge',
        title: { en: 'Job-offer points return on 3 November 2026', fa: 'امتیاز پیشنهاد کار از ۳ نوامبر ۲۰۲۶ برمی‌گردد' },
        detail: {
          en: 'They were removed in March 2025. The new "labour market integration" factor gives up to 100 points for a job offer and up to 150 for Canadian work, but only in occupations whose national median wage is at least 1.3 times the average.',
          fa: 'این امتیاز در مارس ۲۰۲۵ حذف شده بود. عامل تازهٔ «ادغام در بازار کار» برای پیشنهاد کار تا ۱۰۰ و برای سابقهٔ کار در کانادا تا ۱۵۰ امتیاز می‌دهد، آن هم فقط در شغل‌هایی که میانهٔ دستمزد ملی‌شان دست‌کم ۱٫۳ برابر میانگین باشد.',
        },
        source: S.eeChanges,
      },
      {
        key: 'lmia-myth',
        kind: 'myth',
        title: { en: 'Myth: "buy an LMIA to get points"', fa: 'باور نادرست: «با خرید LMIA امتیاز بگیر»' },
        detail: {
          en: 'From 3 Nov 2026 an LMIA adds no points and no priority. Only the occupation’s wage level counts.',
          fa: 'از ۳ نوامبر ۲۰۲۶ داشتن LMIA هیچ امتیاز یا اولویتی اضافه نمی‌کند و فقط سطح دستمزد شغل مهم است.',
        },
        source: S.eeChanges,
      },
      {
        key: 'pnp',
        kind: 'tip',
        title: { en: 'A provincial nomination is worth 600 points', fa: 'نامزدی استانی ۶۰۰ امتیاز ارزش دارد' },
        detail: {
          en: 'It usually decides the draw by itself, so an Express Entry-linked provincial stream is often the realistic route for a profile below recent cut-offs.',
          fa: 'این امتیاز معمولاً به‌تنهایی نتیجهٔ قرعه را تعیین می‌کند؛ برای پروفایلی که زیر حد نصاب‌های اخیر است، مسیر استانیِ متصل به اکسپرس انتری اغلب راه واقع‌بینانه است.',
        },
        source: S.eeCrs,
      },
      {
        key: 'french',
        kind: 'tip',
        title: { en: 'French adds up to 50 points', fa: 'فرانسه تا ۵۰ امتیاز اضافه می‌کند' },
        detail: {
          en: 'NCLC 7 in all four French abilities with CLB 5 English gives 50; with weaker English, 25.',
          fa: 'NCLC ۷ در هر چهار مهارت فرانسه همراه با انگلیسی CLB ۵ پنجاه امتیاز دارد؛ با انگلیسی ضعیف‌تر ۲۵ امتیاز.',
        },
        source: S.eeCrs,
      },
      {
        key: 'funds-update',
        kind: 'challenge',
        title: { en: 'The funds table changes; your profile must follow', fa: 'جدول تمکن تغییر می‌کند و پروفایل باید به‌روز شود' },
        detail: {
          en: 'IRCC updated the table on 7 July 2025 and asked candidates to update their profiles within weeks. Funds must be available at application and at visa issuance.',
          fa: 'IRCC جدول را در ۷ ژوئیهٔ ۲۰۲۵ به‌روز کرد و از متقاضیان خواست ظرف چند هفته پروفایل را اصلاح کنند. این پول باید هم هنگام درخواست و هم هنگام صدور ویزا در دسترس باشد.',
        },
        source: S.eeFunds,
      },
    ],
    timeline: {
      prAfterYears: 0,
      citizenshipAfterYears: 3,
      dualCitizenship: 'allowed',
      language: CITIZENSHIP_LANGUAGE,
      note: { en: `PR is granted directly. CEC candidates already in Canada get half credit for their temporary days, up to one year. ${CITIZENSHIP_NOTE.en}`, fa: `اقامت دائم مستقیم است. متقاضیان CEC که در کانادا هستند برای روزهای اقامت موقت نیم امتیاز می‌گیرند، حداکثر یک سال. ${CITIZENSHIP_NOTE.fa}` },
      source: S.citizenship,
    },
    quiz: [
      q('ita-days', 'How long do you have to apply after an invitation?', 'پس از دعوت‌نامه چقدر برای ثبت درخواست وقت دارید؟', [['30 days', '۳۰ روز'], ['60 days', '۶۰ روز'], ['90 days', '۹۰ روز'], ['6 months', 'شش ماه']], 1, 'The invitation is valid for 60 days only.', 'دعوت‌نامه فقط ۶۰ روز اعتبار دارد.'),
      q('pnp-points', 'How many CRS points does a provincial nomination add?', 'نامزدی استانی چند امتیاز CRS اضافه می‌کند؟', [['50', '۵۰'], ['200', '۲۰۰'], ['600', '۶۰۰'], ['1,200', '۱٬۲۰۰']], 2, 'The CRS criteria page gives 600 points for a nomination.', 'صفحهٔ معیارهای CRS برای نامزدی ۶۰۰ امتیاز تعیین کرده است.'),
      q('cec-funds', 'Who does not need to show settlement funds?', 'چه کسی لازم نیست هزینهٔ استقرار نشان دهد؟', [['FSW applicants', 'متقاضیان FSW'], ['CEC applicants', 'متقاضیان CEC'], ['Everyone must', 'همه باید نشان دهند'], ['FST applicants', 'متقاضیان FST']], 1, 'CEC applicants, and anyone authorised to work in Canada with a valid job offer, are exempt.', 'متقاضیان CEC و هر کسی که اجازهٔ کار در کانادا و پیشنهاد کار معتبر دارد معاف‌اند.'),
      q('job-offer-max', 'From 3 Nov 2026, the most a job offer can earn is…', 'از ۳ نوامبر ۲۰۲۶ پیشنهاد کار حداکثر چند امتیاز دارد؟', [['50', '۵۰'], ['100', '۱۰۰'], ['200', '۲۰۰'], ['0, offers no longer count', 'صفر؛ دیگر حساب نمی‌شود']], 1, 'A job offer at twice the average median wage earns 100 points.', 'پیشنهاد کار با دستمزد دو برابر میانهٔ میانگین ۱۰۰ امتیاز دارد.'),
      q('fsw-language', 'Minimum language for the Federal Skilled Worker Program?', 'حداقل زبان برای برنامهٔ کارگران ماهر فدرال چیست؟', [['CLB 4', 'CLB ۴'], ['CLB 5', 'CLB ۵'], ['CLB 7', 'CLB ۷'], ['CLB 9', 'CLB ۹']], 2, 'IRCC lists CLB 7 for FSW.', 'IRCC برای FSW سطح CLB ۷ را تعیین کرده است.'),
    ],
    media: [
      { notebookId: '227698cc-6aeb-4afd-9847-20dfd8a0c6b9', kind: 'slides', title: 'Canada 2026 Immigration Reset' },
      { notebookId: '227698cc-6aeb-4afd-9847-20dfd8a0c6b9', kind: 'infographic', title: 'استراتژی مهاجرت ۲۰۲۶ کانادا' },
      { notebookId: '227698cc-6aeb-4afd-9847-20dfd8a0c6b9', kind: 'mindmap', title: "Architecting Canada's 2026 Immigration Reform Framework" },
      { notebookId: '6cf8523a-fb72-4d5b-8a33-a6bce07124e2', kind: 'slides', title: 'Canada 2026 Strategic Blueprint' },
      { notebookId: '6cf8523a-fb72-4d5b-8a33-a6bce07124e2', kind: 'infographic', title: 'راهنمای استراتژیک مهاجرت کانادا ۲۰۲۶' },
      { notebookId: '63c116d0-a1d0-4fc0-aa3f-faff6a05b839', kind: 'slides', title: "Canada's Smarter Immigration Strategy" },
      { notebookId: '63c116d0-a1d0-4fc0-aa3f-faff6a05b839', kind: 'infographic', title: 'استراتژی هوشمندانه مهاجرت کانادا' },
      { notebookId: '63c116d0-a1d0-4fc0-aa3f-faff6a05b839', kind: 'infographic', title: 'توازن مهاجرت و ظرفیت ملی' },
      { notebookId: '63c116d0-a1d0-4fc0-aa3f-faff6a05b839', kind: 'infographic', title: 'بازسازی هوشمندانه سیستم مهاجرت کانادا' },
      { notebookId: '63c116d0-a1d0-4fc0-aa3f-faff6a05b839', kind: 'quiz', title: 'آزمون مهاجرت' },
    ],
  },

  // ---------------------------------------------------------------- Nova Scotia
  'ca-pnp-nova-scotia': {
    funds: [
      { key: 'net-worth', label: { en: 'Net worth, business in Halifax (HRM)', fa: 'دارایی خالص، کسب‌وکار در هالیفاکس (HRM)' }, amount: 600_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'show', source: S.ns },
      { key: 'net-worth-outside', label: { en: 'Net worth, business outside HRM', fa: 'دارایی خالص، کسب‌وکار خارج از HRM' }, amount: 400_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'show', source: S.ns },
      { key: 'invest', label: { en: 'Your own money invested, in HRM', fa: 'سرمایه‌گذاری از پول خودتان، در HRM' }, amount: 150_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'invest', source: S.ns },
      { key: 'invest-outside', label: { en: 'Your own money invested, outside HRM', fa: 'سرمایه‌گذاری از پول خودتان، خارج از HRM' }, amount: 100_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'invest', source: S.ns },
      { key: 'nsnp-fee', label: { en: 'NSNP application fee (non-refundable; EOI free)', fa: 'هزینهٔ درخواست NSNP (غیرقابل‌استرداد؛ EOI رایگان)' }, amount: 2_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.nsFees },
      WORK_PERMIT_FEE,
      ...PR_FEES,
    ],
    steps: [
      { key: 'eoi', title: { en: 'Submit an Expression of Interest', fa: 'فرم ابراز تمایل (EOI) را ثبت کنید' }, detail: { en: 'Free. Points for language, age, experience, location and an export focus. Your EOI stays on file for one year.', fa: 'رایگان است. برای زبان، سن، سابقه، محل کسب‌وکار و تمرکز بر صادرات امتیاز می‌گیرید. EOI یک سال در سیستم می‌ماند.' }, link: S.ns },
      { key: 'verifier', title: { en: 'Choose a Net Worth Verifier', fa: 'ارزیاب دارایی خالص را انتخاب کنید' }, detail: { en: 'Within 20 calendar days of the Invitation to Apply, from the province’s list (Doane Grant Thornton, KPMG Toronto or MNP).', fa: 'ظرف ۲۰ روز تقویمی پس از دعوت‌نامه، از فهرست استان (Doane Grant Thornton، KPMG تورنتو یا MNP).' }, takes: { en: '20 days', fa: '۲۰ روز' }, link: S.ns },
      { key: 'apply', title: { en: 'Apply online and pay the CAD 2,000 fee', fa: 'درخواست آنلاین را بفرستید و ۲٬۰۰۰ دلار کانادا بپردازید' }, detail: { en: 'eNSNP 100 form, Business Establishment Plan and documents: within 90 days for a new business, 180 days if you buy one.', fa: 'فرم eNSNP 100، طرح استقرار کسب‌وکار و مدارک: برای کسب‌وکار تازه ظرف ۹۰ روز و برای خرید کسب‌وکار ظرف ۱۸۰ روز.' }, takes: { en: '90 or 180 days', fa: '۹۰ یا ۱۸۰ روز' }, link: S.nsPortal },
      { key: 'interview', title: { en: 'Interview, then sign the Business Performance Agreement', fa: 'مصاحبه، سپس امضای توافق‌نامهٔ عملکرد کسب‌وکار' }, detail: { en: 'Usually virtual, within 30 days of contact. Return the signed agreement within 15 business days.', fa: 'معمولاً مجازی و ظرف ۳۰ روز پس از تماس. توافق‌نامهٔ امضاشده را ظرف ۱۵ روز کاری برگردانید.' }, link: S.nsGuide },
      { key: 'work-permit', title: { en: 'Apply to IRCC for a work permit', fa: 'از IRCC مجوز کار بگیرید' }, detail: { en: 'After you register the business you get an Entrepreneur Approval Letter; apply within 60 calendar days.', fa: 'پس از ثبت شرکت، نامهٔ تأیید کارآفرینی می‌گیرید و باید ظرف ۶۰ روز تقویمی درخواست مجوز کار بدهید.' }, takes: { en: '60 days to apply', fa: '۶۰ روز برای درخواست' }, link: S.workPermit },
      { key: 'arrive', title: { en: 'Arrive, meet the province, open the business', fa: 'ورود، دیدار با ادارهٔ مهاجرت استان، شروع کسب‌وکار' }, detail: { en: 'Arrive within 6 months of the port-of-entry letter, attend the arrival meeting within 60 days, start operating within 6 months.', fa: 'ظرف شش ماه پس از نامهٔ ورود به کانادا برسید، ظرف ۶۰ روز در جلسهٔ ورود شرکت کنید و ظرف شش ماه کسب‌وکار را راه بیندازید.' }, link: S.nsGuide },
      { key: 'nomination', title: { en: 'Operate one full year, then ask for nomination', fa: 'یک سال کامل فعالیت، سپس درخواست نامزدی' }, detail: { en: 'Send the Nomination Request with a Review Engagement and Special Purpose Report from a designated provider.', fa: 'درخواست نامزدی را با گزارش بررسی صورت‌های مالی (Review Engagement and Special Purpose Report) از ارائه‌دهندهٔ تعیین‌شده بفرستید.' }, takes: { en: '12 months of operation', fa: '۱۲ ماه فعالیت' }, link: S.ns },
      { key: 'pr', title: { en: 'Apply to IRCC for PR', fa: 'درخواست اقامت دائم به IRCC' }, detail: { en: 'Within 12 months of the Letter of Nomination. Ask for a work-permit support letter at least 90 days before your permit expires.', fa: 'ظرف ۱۲ ماه پس از نامهٔ نامزدی. دست‌کم ۹۰ روز پیش از پایان اعتبار مجوز کار، نامهٔ حمایت برای تمدید بخواهید.' }, link: S.pnpApply },
    ],
    documents: [
      { key: 'ensnp-100', label: { en: 'eNSNP 100 application form', fa: 'فرم درخواست eNSNP 100' }, stage: 'apply' },
      { key: 'bep', label: { en: 'Business Establishment Plan', fa: 'طرح استقرار کسب‌وکار (Business Establishment Plan)' }, stage: 'apply' },
      { key: 'net-worth', label: { en: 'Net Worth Verification Report from a designated verifier', fa: 'گزارش تأیید دارایی خالص از ارزیاب تعیین‌شده' }, stage: 'apply' },
      { key: 'fee', label: { en: 'Proof of the CAD 2,000 fee payment', fa: 'رسید پرداخت ۲٬۰۰۰ دلار کانادا' }, stage: 'apply' },
      { key: 'experience', label: { en: 'Experience proof: CV, contracts, 12 months of pay records, reference letters (senior managers); ownership proof (owners)', fa: 'اثبات سابقه: رزومه، قراردادها، فیش حقوق ۱۲ ماه اخیر و توصیه‌نامه (مدیران ارشد)؛ اسناد مالکیت (مالکان)' }, stage: 'apply' },
      { key: 'language', label: { en: 'Language test: CLB 5 in all four abilities', fa: 'آزمون زبان: CLB ۵ در هر چهار مهارت' }, stage: 'apply' },
      { key: 'exploratory', label: { en: 'Exploratory Visit Report (only if buying a business)', fa: 'گزارش بازدید اکتشافی (فقط برای خرید کسب‌وکار)' }, stage: 'apply' },
      { key: 'nsnp-50', label: { en: 'NSNP 50 if you use a representative', fa: 'فرم NSNP 50 اگر نماینده دارید' }, stage: 'apply' },
      { key: 'bpa', label: { en: 'Signed Business Performance Agreement', fa: 'توافق‌نامهٔ عملکرد کسب‌وکار امضاشده' }, stage: 'permit' },
      { key: 'review-report', label: { en: 'Review Engagement and Special Purpose Report with the Nomination Request', fa: 'گزارش بررسی صورت‌های مالی همراه درخواست نامزدی' }, stage: 'renewal' },
    ],
    realities: [
      { key: 'outside-hrm', kind: 'tip', title: { en: 'Outside Halifax costs less', fa: 'خارج از هالیفاکس ارزان‌تر است' }, detail: { en: 'Net worth falls from CAD 600,000 to 400,000 and investment from 150,000 to 100,000.', fa: 'دارایی خالص لازم از ۶۰۰٬۰۰۰ به ۴۰۰٬۰۰۰ و سرمایه‌گذاری از ۱۵۰٬۰۰۰ به ۱۰۰٬۰۰۰ دلار کانادا کاهش می‌یابد.' }, source: S.ns },
      { key: 'hire', kind: 'challenge', title: { en: 'A new business must hire', fa: 'کسب‌وکار تازه باید استخدام کند' }, detail: { en: 'At least one permanent full-time job (1,560 hours a year, may be shared), filled by a citizen or PR who is not related to you, paid the local wage for the field.', fa: 'دست‌کم یک شغل دائم تمام‌وقت (۱٬۵۶۰ ساعت در سال، قابل تقسیم بین چند نفر) برای شهروند یا مقیم دائمی که با شما نسبتی ندارد، با دستمزد رایج همان حوزه و منطقه.' }, source: S.nsGuide },
      { key: 'buying', kind: 'tip', title: { en: 'Buying a business has its own rules', fa: 'خرید کسب‌وکار قواعد خودش را دارد' }, detail: { en: 'The same owner must have run it for the 5 years before the sale; you must visit it, agree a fair market value and keep staff on similar wages.', fa: 'همان مالک باید پنج سال پیش از فروش آن را اداره کرده باشد؛ باید از آن بازدید کنید، بر قیمت منصفانه توافق کنید و کارکنان را با دستمزد مشابه نگه دارید.' }, source: S.nsGuide },
      { key: 'conflict', kind: 'tip', title: { en: 'Two different accountants', fa: 'دو حسابدار جدا' }, detail: { en: 'A firm that helped write your plan cannot prepare your final review report; choose from the designated list.', fa: 'مؤسسه‌ای که در نوشتن طرح کسب‌وکار کمک کرده نمی‌تواند گزارش بررسی نهایی را تهیه کند؛ از فهرست تعیین‌شده انتخاب کنید.' }, source: S.nsGuide },
      { key: 'misrep', kind: 'challenge', title: { en: 'Five-year ban for false information', fa: 'ممنوعیت پنج‌ساله برای اطلاعات نادرست' }, detail: { en: 'Misrepresentation closes the file without appeal and bars any NSNP stream for 5 years; the fee is not refunded.', fa: 'اطلاعات خلاف واقع پرونده را بدون امکان اعتراض می‌بندد و تا پنج سال از همهٔ مسیرهای NSNP محروم می‌شوید؛ هزینه هم بازگردانده نمی‌شود.' }, source: S.nsGuide },
      { key: 'maintained', kind: 'challenge', title: { en: 'In Canada? Maintained status cannot file an EOI', fa: 'در کانادا هستید؟ با وضعیت تمدیدی نمی‌شود EOI داد' }, detail: { en: 'You need a valid, unexpired permit on the day you submit the EOI.', fa: 'روز ثبت EOI باید مجوز معتبر و منقضی‌نشده داشته باشید.' }, source: S.nsGuide },
    ],
    timeline: PNP_TIMELINE(2.5, 'Approximate: work permit, at least one year of operation, nomination, then IRCC’s paper PR processing.', 'تقریبی: مجوز کار، دست‌کم یک سال فعالیت، نامزدی، سپس بررسی کاغذی اقامت دائم در IRCC.'),
    quiz: [
      q('nw-outside', 'Net worth needed for a business outside Halifax?', 'دارایی خالص لازم برای کسب‌وکار خارج از هالیفاکس؟', [['CAD 300,000', '۳۰۰٬۰۰۰ دلار کانادا'], ['CAD 400,000', '۴۰۰٬۰۰۰ دلار کانادا'], ['CAD 600,000', '۶۰۰٬۰۰۰ دلار کانادا'], ['CAD 1,000,000', '۱٬۰۰۰٬۰۰۰ دلار کانادا']], 1, 'Outside HRM the threshold is CAD 400,000.', 'خارج از HRM حد لازم ۴۰۰٬۰۰۰ دلار کانادا است.'),
      q('verifier', 'After the invitation, how long to choose a Net Worth Verifier?', 'پس از دعوت‌نامه، چند روز برای انتخاب ارزیاب دارایی وقت دارید؟', [['10 days', '۱۰ روز'], ['20 days', '۲۰ روز'], ['60 days', '۶۰ روز'], ['90 days', '۹۰ روز']], 1, 'The guide sets 20 calendar days.', 'راهنما ۲۰ روز تقویمی تعیین کرده است.'),
      q('operate', 'How long must you operate before asking for nomination?', 'پیش از درخواست نامزدی چه مدت باید کسب‌وکار را اداره کنید؟', [['6 months', 'شش ماه'], ['One full year', 'یک سال کامل'], ['Two years', 'دو سال'], ['No minimum', 'حداقلی ندارد']], 1, 'You must operate the business for at least one full year.', 'دست‌کم یک سال کامل باید کسب‌وکار را اداره کنید.'),
      q('fee', 'The NSNP application fee from 1 Sep 2026 is…', 'هزینهٔ درخواست NSNP از ۱ سپتامبر ۲۰۲۶ چقدر است؟', [['Free', 'رایگان'], ['CAD 500', '۵۰۰ دلار کانادا'], ['CAD 2,000, non-refundable', '۲٬۰۰۰ دلار کانادا، غیرقابل‌استرداد'], ['CAD 10,000, refundable', '۱۰٬۰۰۰ دلار کانادا، قابل‌استرداد']], 2, 'NSNP charges CAD 2,000 from 1 Sep 2026; the EOI stays free.', 'NSNP از ۱ سپتامبر ۲۰۲۶ مبلغ ۲٬۰۰۰ دلار کانادا می‌گیرد و EOI همچنان رایگان است.'),
      q('language', 'Minimum language for the experienced-entrepreneur path?', 'حداقل زبان برای کارآفرینان باتجربه چیست؟', [['CLB 4', 'CLB ۴'], ['CLB 5', 'CLB ۵'], ['CLB 7', 'CLB ۷'], ['None', 'لازم نیست']], 1, 'CLB 5 in all four abilities; Nova Scotia graduates need CLB 7.', 'CLB ۵ در هر چهار مهارت؛ فارغ‌التحصیلان نوا اسکوشیا CLB ۷ لازم دارند.'),
    ],
    media: [
      { notebookId: 'd4b0f87b-309a-4817-af8e-dcd94729e71d', kind: 'slides', title: 'Nova Scotia Business Residency Blueprint' },
      { notebookId: 'd4b0f87b-309a-4817-af8e-dcd94729e71d', kind: 'infographic', title: 'Nova Scotia Entrepreneur Pathway Roadmap' },
      { notebookId: 'd4b0f87b-309a-4817-af8e-dcd94729e71d', kind: 'slides', title: 'Nova Scotia Entrepreneur Blueprint' },
      { notebookId: 'd4b0f87b-309a-4817-af8e-dcd94729e71d', kind: 'infographic', title: 'The Nova Scotia Entrepreneur Blueprint' },
      { notebookId: 'd4b0f87b-309a-4817-af8e-dcd94729e71d', kind: 'slides', title: 'Nova Scotia Strategic PR Blueprint' },
      { notebookId: 'd4b0f87b-309a-4817-af8e-dcd94729e71d', kind: 'infographic', title: 'راهنمای مهاجرت کارآفرینی نوا اسکوشیا' },
    ],
  },

  // ---------------------------------------------------------------- New Brunswick
  'ca-pnp-new-brunswick': {
    funds: [
      { key: 'net-worth', label: { en: 'Personal net worth', fa: 'دارایی خالص شخصی' }, amount: 500_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'show', source: S.nb },
      { key: 'net-worth-agri', label: { en: 'Personal net worth, agriculture', fa: 'دارایی خالص شخصی، بخش کشاورزی' }, amount: 300_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'show', source: S.nb },
      { key: 'invest', label: { en: 'Eligible investment in the business', fa: 'سرمایه‌گذاری واجد شرایط در کسب‌وکار' }, amount: 150_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'invest', source: S.nb },
      { key: 'nb-fee', label: { en: 'NB application fee (non-refundable; EOI free)', fa: 'هزینهٔ درخواست نیوبرانزویک (غیرقابل‌استرداد؛ EOI رایگان)' }, amount: 2_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.nb },
      WORK_PERMIT_FEE,
      ...PR_FEES,
    ],
    steps: [
      { key: 'eoi', title: { en: 'Submit an EOI in the INB portal', fa: 'EOI را در درگاه INB ثبت کنید' }, detail: { en: 'Free. Read the guide and the "important information for every candidate" first.', fa: 'رایگان است. پیش از آن راهنما و «اطلاعات مهم برای همهٔ متقاضیان» را بخوانید.' }, link: S.nb },
      { key: 'apply', title: { en: 'If invited, apply and pay CAD 2,000', fa: 'در صورت دعوت، درخواست کامل بدهید و ۲٬۰۰۰ دلار کانادا بپردازید' }, detail: { en: 'Business plan, net-worth statement and a report from a designated net-worth verifier (valid 12 months). You need 65 of 100 points.', fa: 'طرح کسب‌وکار، صورت دارایی و گزارش ارزیاب تعیین‌شده (۱۲ ماه اعتبار). باید دست‌کم ۶۵ امتیاز از ۱۰۰ بگیرید.' }, link: S.nb },
      { key: 'bpa', title: { en: 'Sign the Business Performance Agreement and apply for a work permit', fa: 'توافق‌نامهٔ عملکرد را امضا و درخواست مجوز کار کنید' }, detail: { en: 'After approval you receive a work permit support letter for your IRCC application.', fa: 'پس از تأیید، نامهٔ حمایت برای درخواست مجوز کار به IRCC دریافت می‌کنید.' }, link: S.workPermit },
      { key: 'arrive', title: { en: 'Report your arrival within one month', fa: 'ظرف یک ماه ورودتان را گزارش دهید' }, detail: { en: 'Form NBBIS-004. You may ask for a business plan change within 3 months (NBBIS-007).', fa: 'فرم NBBIS-004. ظرف سه ماه می‌توانید تغییر طرح کسب‌وکار را درخواست کنید (NBBIS-007).' }, takes: { en: '1 month', fa: 'یک ماه' }, link: S.nb },
      { key: 'open', title: { en: 'Open the business within 9 months', fa: 'ظرف نُه ماه کسب‌وکار را افتتاح کنید' }, detail: { en: 'Report the opening on NBBIS-005. The whole establishment period is 24 months from arrival.', fa: 'افتتاح را با فرم NBBIS-005 گزارش دهید. کل دورهٔ استقرار ۲۴ ماه از تاریخ ورود است.' }, takes: { en: '9 months', fa: 'نُه ماه' }, link: S.nbGuide },
      { key: 'nomination', title: { en: 'After 6 consecutive months of operation, request nomination', fa: 'پس از شش ماه فعالیت پیوسته، درخواست نامزدی بدهید' }, detail: { en: 'Form NBBIS-006, once the agreement’s conditions and investment are met.', fa: 'با فرم NBBIS-006، وقتی شرایط توافق‌نامه و سرمایه‌گذاری انجام شده باشد.' }, takes: { en: '6 months', fa: 'شش ماه' }, link: S.nbGuide },
      { key: 'pr', title: { en: 'Apply to IRCC for PR', fa: 'درخواست اقامت دائم به IRCC' }, detail: { en: 'With the nomination certificate, on the paper PNP application.', fa: 'با گواهی نامزدی، از طریق درخواست کاغذی PNP.' }, link: S.pnpApply },
    ],
    documents: [
      { key: 'nbbis-001', label: { en: 'NBBIS-001 Document Checklist', fa: 'چک‌لیست مدارک NBBIS-001' }, stage: 'apply' },
      { key: 'bp', label: { en: 'NBBIS-BP Business Plan', fa: 'طرح کسب‌وکار NBBIS-BP' }, stage: 'apply' },
      { key: 'nbbis-002', label: { en: 'NBBIS-002 Personal Net Worth Statement', fa: 'صورت دارایی خالص شخصی NBBIS-002' }, stage: 'apply' },
      { key: 'nbbis-003', label: { en: 'NBBIS-003 Narrative Statement of Accumulated Funds', fa: 'شرح چگونگی انباشت سرمایه NBBIS-003' }, stage: 'apply' },
      { key: 'nb-005', label: { en: 'NB-005 Consent and Declaration', fa: 'رضایت‌نامه و اقرارنامهٔ NB-005' }, stage: 'apply' },
      { key: 'language', label: { en: 'Language test: CLB 4 in all four abilities', fa: 'آزمون زبان: CLB ۴ در هر چهار مهارت' }, stage: 'apply' },
      { key: 'nbbis-004', label: { en: 'NBBIS-004 Report of Arrival', fa: 'گزارش ورود NBBIS-004' }, stage: 'permit' },
      { key: 'nbbis-005', label: { en: 'NBBIS-005 Report of Business Opening', fa: 'گزارش افتتاح کسب‌وکار NBBIS-005' }, stage: 'permit' },
      { key: 'nbbis-006', label: { en: 'NBBIS-006 Request for Nomination', fa: 'درخواست نامزدی NBBIS-006' }, stage: 'renewal' },
    ],
    realities: [
      { key: 'six-months', kind: 'myth', title: { en: 'Myth: "PR in 6 months"', fa: 'باور نادرست: «اقامت دائم در شش ماه»' }, detail: { en: 'Six consecutive months of operation only lets you ask for nomination. Before that you may take up to 9 months to open; after it, IRCC processes the PR file.', fa: 'شش ماه فعالیت پیوسته فقط اجازهٔ درخواست نامزدی می‌دهد. پیش از آن تا نُه ماه برای افتتاح وقت دارید و پس از آن IRCC پروندهٔ اقامت دائم را بررسی می‌کند.' }, source: S.nbGuide },
      { key: 'ineligible', kind: 'challenge', title: { en: 'Many business types are excluded', fa: 'بسیاری از انواع کسب‌وکار مستثنا هستند' }, detail: { en: 'Including property investment, consultancy, e-commerce or remotely run businesses, home-based businesses, small inns under 5 units or CAD 100,000 revenue, and not-for-profits.', fa: 'از جمله سرمایه‌گذاری ملکی، مشاوره، تجارت الکترونیک یا کسب‌وکاری که از راه دور اداره شود، کسب‌وکار خانگی، اقامتگاه‌های کوچک زیر پنج واحد یا زیر ۱۰۰٬۰۰۰ دلار درآمد، و سازمان‌های غیرانتفاعی.' }, source: S.nbGuide },
      { key: 'construction', kind: 'tip', title: { en: 'Construction is allowed only with signed contracts', fa: 'ساخت‌وساز فقط با قراردادهای امضاشده پذیرفته است' }, detail: { en: 'Building to sell or rent later counts as property investment. A contractor with multiple verifiable contracts is a different case.', fa: 'ساختن برای فروش یا اجارهٔ بعدی سرمایه‌گذاری ملکی حساب می‌شود. پیمانکاری که چند قرارداد قابل‌تأیید دارد وضع دیگری دارد.' }, source: S.nbGuide },
      { key: 'job', kind: 'challenge', title: { en: 'One full-time job, 30 hours a week', fa: 'یک شغل تمام‌وقت، ۳۰ ساعت در هفته' }, detail: { en: 'For a citizen or PR living in New Brunswick, not you or your family.', fa: 'برای شهروند یا مقیم دائم ساکن نیوبرانزویک، نه خودتان یا اعضای خانواده.' }, source: S.nbGuide },
      { key: 'gifts', kind: 'challenge', title: { en: 'Recent gifts do not count', fa: 'هدیه‌های اخیر حساب نمی‌شود' }, detail: { en: 'Gifts or inheritances received less than 6 months before the application are excluded from net worth.', fa: 'هدیه یا ارثی که کمتر از شش ماه پیش از درخواست رسیده باشد در دارایی خالص حساب نمی‌شود.' }, source: S.nbGuide },
    ],
    timeline: PNP_TIMELINE(2.5, 'Approximate: up to 9 months to open, 6 months of operation, nomination, then IRCC’s paper PR processing.', 'تقریبی: تا نُه ماه برای افتتاح، شش ماه فعالیت، نامزدی، سپس بررسی کاغذی اقامت دائم در IRCC.'),
    quiz: [
      q('points', 'What score must you reach on the NB selection grid?', 'در جدول امتیاز نیوبرانزویک چه امتیازی لازم است؟', [['50 of 100', '۵۰ از ۱۰۰'], ['65 of 100', '۶۵ از ۱۰۰'], ['67 of 100', '۶۷ از ۱۰۰'], ['No grid', 'جدولی ندارد']], 1, 'The page and guide set a minimum of 65 points.', 'صفحه و راهنما حداقل ۶۵ امتیاز را تعیین کرده‌اند.'),
      q('age', 'What age range does the stream accept?', 'این مسیر چه بازهٔ سنی را می‌پذیرد؟', [['18 to 55', '۱۸ تا ۵۵'], ['19 to 59', '۱۹ تا ۵۹'], ['21 to 59', '۲۱ تا ۵۹'], ['No limit', 'بدون محدودیت']], 1, 'Applicants must be 19 to 59.', 'متقاضی باید ۱۹ تا ۵۹ ساله باشد.'),
      q('open', 'How long after arrival can you take to open the business?', 'پس از ورود، حداکثر چقدر برای افتتاح کسب‌وکار وقت دارید؟', [['1 month', 'یک ماه'], ['3 months', 'سه ماه'], ['9 months', 'نُه ماه'], ['24 months', '۲۴ ماه']], 2, 'You report the opening within 9 months of arrival.', 'افتتاح را باید ظرف نُه ماه پس از ورود گزارش دهید.'),
      q('net-worth', 'Net worth outside agriculture?', 'دارایی خالص لازم در غیر کشاورزی؟', [['CAD 300,000', '۳۰۰٬۰۰۰ دلار کانادا'], ['CAD 500,000', '۵۰۰٬۰۰۰ دلار کانادا'], ['CAD 600,000', '۶۰۰٬۰۰۰ دلار کانادا'], ['CAD 150,000', '۱۵۰٬۰۰۰ دلار کانادا']], 1, 'CAD 500,000, or 300,000 in agriculture.', '۵۰۰٬۰۰۰ دلار کانادا؛ در کشاورزی ۳۰۰٬۰۰۰.'),
      q('ecommerce', 'Can an e-commerce business qualify?', 'آیا کسب‌وکار تجارت الکترونیک پذیرفته می‌شود؟', [['Yes', 'بله'], ['Only outside cities', 'فقط خارج از شهرها'], ['No, it is ineligible', 'نه، مستثناست'], ['Only with a partner', 'فقط با شریک']], 2, 'The guide lists e-commerce among ineligible businesses.', 'راهنما تجارت الکترونیک را در فهرست کسب‌وکارهای نامجاز آورده است.'),
    ],
    media: [
      { notebookId: 'bc648465-3695-4c7f-9669-0fa6da627c2b', kind: 'video', title: '6 Months to Canadian PR: The Hidden Costs of New Brunswick' },
      { notebookId: 'bc648465-3695-4c7f-9669-0fa6da627c2b', kind: 'slides', title: 'New Brunswick Business Residency Blueprint' },
      { notebookId: 'bc648465-3695-4c7f-9669-0fa6da627c2b', kind: 'infographic', title: 'New Brunswick Business Immigration Roadmap' },
      { notebookId: 'bc648465-3695-4c7f-9669-0fa6da627c2b', kind: 'infographic', title: 'نقشه راه اقامت نیوبرانزویک کانادا' },
      { notebookId: 'bc648465-3695-4c7f-9669-0fa6da627c2b', kind: 'infographic', title: 'New Brunswick Business Immigration Guide' },
      { notebookId: 'bc648465-3695-4c7f-9669-0fa6da627c2b', kind: 'slides', title: 'New Brunswick Business Blueprint' },
      { notebookId: 'bc648465-3695-4c7f-9669-0fa6da627c2b', kind: 'infographic', title: 'راهنمای مهاجرت تجاری نیوبرانزویک کانادا' },
      { notebookId: 'bc648465-3695-4c7f-9669-0fa6da627c2b', kind: 'slides', title: 'New Brunswick Entrepreneurial Blueprint' },
      { notebookId: 'bc648465-3695-4c7f-9669-0fa6da627c2b', kind: 'infographic', title: 'راهنمای مهاجرت تجاری به نیوبرانزویک' },
    ],
  },

  // ---------------------------------------------------------------- Alberta
  'ca-pnp-alberta': {
    funds: [
      { key: 'net-worth', label: { en: 'Net worth (you and your spouse’s personal holdings)', fa: 'دارایی خالص (دارایی شخصی شما و همسرتان)' }, amount: 300_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'show', source: S.ab },
      { key: 'invest', label: { en: 'Investment in the business', fa: 'سرمایه‌گذاری در کسب‌وکار' }, amount: 100_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'invest', source: S.ab },
      { key: 'eoi-fee', label: { en: 'AAIP EOI fee (non-refundable)', fa: 'هزینهٔ EOI در AAIP (غیرقابل‌استرداد)' }, amount: 200, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.abApply },
      { key: 'app-fee', label: { en: 'AAIP Business Application fee (non-refundable)', fa: 'هزینهٔ درخواست کسب‌وکار AAIP (غیرقابل‌استرداد)' }, amount: 3_500, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.abApply },
      WORK_PERMIT_FEE,
      ...PR_FEES,
    ],
    steps: [
      { key: 'visit', title: { en: 'Contact a participating community and visit', fa: 'با یک جامعهٔ روستایی شرکت‌کننده تماس بگیرید و بازدید کنید' }, detail: { en: 'Exploratory visit in person or by video; keep records of every meeting. The community must have under 100,000 people, outside the Calgary and Edmonton areas.', fa: 'بازدید اکتشافی حضوری یا تصویری؛ سابقهٔ همهٔ جلسه‌ها را نگه دارید. جمعیت این جامعه باید زیر ۱۰۰ هزار نفر و خارج از محدودهٔ کلگری و ادمونتون باشد.' }, link: S.ab },
      { key: 'support', title: { en: 'Get a Community Support Letter', fa: 'نامهٔ حمایت جامعه را بگیرید' }, detail: { en: 'Submit the Business Proposal Summary (AINP12666); the community endorses it if it sees a benefit.', fa: 'خلاصهٔ طرح کسب‌وکار (AINP12666) را بفرستید؛ اگر جامعه آن را سودمند بداند، تأییدش می‌کند.' }, link: S.ab },
      { key: 'eoi', title: { en: 'Submit an EOI and pay CAD 200 within 24 hours', fa: 'EOI را ثبت و ظرف ۲۴ ساعت ۲۰۰ دلار کانادا پرداخت کنید' }, detail: { en: 'Scored out of 175 points; EOIs stay in the pool 12 months.', fa: 'از ۱۷۵ امتیاز سنجیده می‌شود و ۱۲ ماه در استخر می‌ماند.' }, link: S.abApply },
      { key: 'application', title: { en: 'If invited, submit the Business Application within 90 days', fa: 'در صورت دعوت، ظرف ۹۰ روز درخواست کسب‌وکار را بفرستید' }, detail: { en: 'Pay CAD 3,500 within 24 hours. Include a Business Plan Evaluation Report (KPMG or MNP) and a Qualified Service Provider report (Grant Thornton, KPMG or MNP).', fa: 'ظرف ۲۴ ساعت ۳٬۵۰۰ دلار کانادا بپردازید. گزارش ارزیابی طرح (KPMG یا MNP) و گزارش ارائه‌دهندهٔ خدمات واجد شرایط (Grant Thornton، KPMG یا MNP) را ضمیمه کنید.' }, takes: { en: '90 days', fa: '۹۰ روز' }, link: S.abApply },
      { key: 'bpa', title: { en: 'Sign the Business Performance Agreement within 14 days', fa: 'ظرف ۱۴ روز توافق‌نامهٔ عملکرد را امضا کنید' }, detail: { en: 'You then get the approval letter and a 205(a) letter of support. Apply for the work permit within 3 months and arrive within 12 months.', fa: 'سپس نامهٔ تأیید و نامهٔ حمایت 205(a) را می‌گیرید. ظرف سه ماه درخواست مجوز کار بدهید و ظرف ۱۲ ماه وارد شوید.' }, link: S.workPermit },
      { key: 'operate', title: { en: 'Report arrival in 30 days, then operate 12 months', fa: 'ظرف ۳۰ روز ورود را گزارش دهید و ۱۲ ماه کسب‌وکار را اداره کنید' }, detail: { en: 'Business Progress Report every 6 months; live in the rural community; own at least 51% (100% for a succession).', fa: 'هر شش ماه گزارش پیشرفت؛ سکونت در همان جامعهٔ روستایی؛ مالکیت دست‌کم ۵۱٪ (برای جانشینی ۱۰۰٪).' }, takes: { en: '12 months', fa: '۱۲ ماه' }, link: S.abApply },
      { key: 'nomination', title: { en: 'Final Report, nomination, then PR within 6 months', fa: 'گزارش نهایی، نامزدی، سپس درخواست اقامت دائم ظرف شش ماه' }, detail: { en: 'The nomination is valid 6 months. A progress report is still due 6 months after nomination.', fa: 'نامزدی شش ماه اعتبار دارد. شش ماه پس از نامزدی هم باید گزارش پیشرفت بدهید.' }, takes: { en: '6 months to file', fa: 'شش ماه برای ثبت' }, link: S.abAfter },
    ],
    documents: [
      { key: 'support-letter', label: { en: 'Community Support Letter and endorsed Business Proposal Summary', fa: 'نامهٔ حمایت جامعه و خلاصهٔ طرح تأییدشده' }, stage: 'apply' },
      { key: 'net-worth-sheet', label: { en: 'Net Worth Worksheet', fa: 'کاربرگ دارایی خالص' }, stage: 'apply' },
      { key: 'visit-report', label: { en: 'Exploratory Visit Report', fa: 'گزارش بازدید اکتشافی' }, stage: 'apply' },
      { key: 'eca', label: { en: 'Educational Credential Assessment (high school equivalent)', fa: 'ارزیابی مدرک تحصیلی ECA (معادل دیپلم)' }, stage: 'apply' },
      { key: 'language', label: { en: 'Language test, CLB 4, under 2 years old at EOI', fa: 'آزمون زبان CLB ۴، کمتر از دو سال از تاریخ آن در زمان EOI' }, stage: 'apply' },
      { key: 'business-plan', label: { en: 'Business Plan and Business Plan Evaluation Report', fa: 'طرح کسب‌وکار و گزارش ارزیابی آن' }, stage: 'apply' },
      { key: 'qsp', label: { en: 'Qualified Service Provider report on net worth and investment', fa: 'گزارش ارائه‌دهندهٔ خدمات واجد شرایط دربارهٔ دارایی و سرمایه‌گذاری' }, stage: 'apply' },
      { key: 'reports', label: { en: 'Arrival Report, 6-monthly Business Progress Reports, Final Report for Nomination', fa: 'گزارش ورود، گزارش‌های پیشرفت شش‌ماهه و گزارش نهایی برای نامزدی' }, stage: 'permit' },
    ],
    realities: [
      { key: 'allocation', kind: 'challenge', title: { en: 'Only 60 entrepreneur nominations in 2026', fa: 'فقط ۶۰ نامزدی کارآفرینی در ۲۰۲۶' }, detail: { en: 'Across all AAIP entrepreneur streams: 37 issued and 213 applications in process at 21 Oct 2026.', fa: 'برای همهٔ مسیرهای کارآفرینی AAIP: تا ۲۱ اکتبر ۲۰۲۶، ۳۷ نامزدی صادر شده و ۲۱۳ پرونده در جریان است.' }, source: S.abProcessing },
      { key: 'community-first', kind: 'tip', title: { en: 'The community comes before the province', fa: 'اول جامعه، بعد استان' }, detail: { en: 'Without a Community Support Letter you cannot submit an EOI, and communities choose whom they meet.', fa: 'بدون نامهٔ حمایت جامعه نمی‌توانید EOI ثبت کنید و هر جامعه خودش انتخاب می‌کند با چه کسی دیدار کند.' }, source: S.ab },
      { key: 'remote', kind: 'myth', title: { en: 'Myth: "you can run it from abroad"', fa: 'باور نادرست: «می‌شود از خارج اداره‌اش کرد»' }, detail: { en: 'You must live in Alberta and manage day to day; remote management is not accepted.', fa: 'باید در آلبرتا زندگی و کسب‌وکار را روزانه اداره کنید؛ مدیریت از راه دور پذیرفته نیست.' }, source: S.ab },
      { key: 'fees-lost', kind: 'challenge', title: { en: 'Fees are non-refundable', fa: 'هزینه‌ها بازگردانده نمی‌شود' }, detail: { en: 'CAD 200 for the EOI and CAD 3,500 for the application, each due within 24 hours. A reconsideration costs CAD 250.', fa: '۲۰۰ دلار برای EOI و ۳٬۵۰۰ دلار برای درخواست، هر کدام ظرف ۲۴ ساعت. درخواست بازبینی ۲۵۰ دلار هزینه دارد.' }, source: S.abApply },
    ],
    timeline: PNP_TIMELINE(2.5, 'Approximate: up to 12 months to arrive, 12 months of operation, nomination, then IRCC’s paper PR processing.', 'تقریبی: تا ۱۲ ماه برای ورود، ۱۲ ماه فعالیت، نامزدی، سپس بررسی کاغذی اقامت دائم در IRCC.'),
    quiz: [
      q('first', 'What must you get before you can submit an EOI?', 'پیش از ثبت EOI چه چیزی لازم دارید؟', [['A job offer', 'پیشنهاد کار'], ['A Community Support Letter', 'نامهٔ حمایت جامعه'], ['A work permit', 'مجوز کار'], ['A nomination', 'نامزدی']], 1, 'The EOI is submitted with the Community Support Letter.', 'EOI همراه با نامهٔ حمایت جامعه ثبت می‌شود.'),
      q('net-worth', 'Minimum net worth?', 'حداقل دارایی خالص؟', [['CAD 100,000', '۱۰۰٬۰۰۰ دلار کانادا'], ['CAD 300,000', '۳۰۰٬۰۰۰ دلار کانادا'], ['CAD 500,000', '۵۰۰٬۰۰۰ دلار کانادا'], ['CAD 600,000', '۶۰۰٬۰۰۰ دلار کانادا']], 1, 'Alberta sets CAD 300,000.', 'آلبرتا ۳۰۰٬۰۰۰ دلار کانادا تعیین کرده است.'),
      q('population', 'The community must have a population under…', 'جمعیت جامعهٔ روستایی باید کمتر از … باشد.', [['10,000', '۱۰٬۰۰۰'], ['50,000', '۵۰٬۰۰۰'], ['100,000', '۱۰۰٬۰۰۰'], ['500,000', '۵۰۰٬۰۰۰']], 2, 'Under 100,000 and outside the Calgary and Edmonton areas.', 'زیر ۱۰۰ هزار نفر و خارج از محدودهٔ کلگری و ادمونتون.'),
      q('ownership', 'Ownership needed for a new business?', 'مالکیت لازم برای کسب‌وکار تازه؟', [['10%', '۱۰٪'], ['33%', '۳۳٪'], ['51%', '۵۱٪'], ['100%', '۱۰۰٪']], 2, '51% for a new business; 100% for a succession.', '۵۱٪ برای کسب‌وکار تازه و ۱۰۰٪ برای جانشینی.'),
      q('nom-valid', 'How long is an Alberta nomination valid?', 'نامزدی آلبرتا چه مدت اعتبار دارد؟', [['30 days', '۳۰ روز'], ['6 months', 'شش ماه'], ['12 months', '۱۲ ماه'], ['No limit', 'بدون محدودیت']], 1, 'You must apply to IRCC within 6 months.', 'باید ظرف شش ماه به IRCC درخواست بدهید.'),
    ],
  },

  // ---------------------------------------------------------------- Manitoba
  'ca-pnp-manitoba': {
    funds: [
      { key: 'net-worth', label: { en: 'Net worth', fa: 'دارایی خالص' }, amount: 500_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'show', source: S.mbGuide },
      { key: 'mpnp-fee', label: { en: 'MPNP processing fee (non-refundable)', fa: 'هزینهٔ رسیدگی MPNP (غیرقابل‌استرداد)' }, amount: 2_500, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.mbGuide },
      WORK_PERMIT_FEE,
      ...PR_FEES,
    ],
    steps: [
      { key: 'research', title: { en: 'Self-assess and visit Manitoba', fa: 'خودارزیابی کنید و به مانیتوبا سفر کنید' }, detail: { en: 'The guide calls an in-person exploratory visit essential for your business research.', fa: 'راهنما بازدید اکتشافی حضوری را برای تحقیق دربارهٔ کسب‌وکار ضروری می‌داند.' }, link: S.mbGuide },
      { key: 'eoi', title: { en: 'Email your EOI', fa: 'EOI را با ایمیل بفرستید' }, detail: { en: 'Business Concept Form, Self-Assessment Form and Code of Conduct to MPNP-BusinessStream@gov.mb.ca. MPNP replies within 4 weeks; after a "no" wait 2 months.', fa: 'فرم ایدهٔ کسب‌وکار، فرم خودارزیابی و آیین‌نامهٔ رفتاری را به MPNP-BusinessStream@gov.mb.ca بفرستید. پاسخ ظرف چهار هفته می‌آید؛ پس از پاسخ منفی باید دو ماه صبر کنید.' }, takes: { en: '4 weeks', fa: 'چهار هفته' }, link: S.mbGuide },
      { key: 'apply', title: { en: 'After a Letter of Advice to Apply, file within 120 days', fa: 'پس از نامهٔ توصیه به درخواست (LAA)، ظرف ۱۲۰ روز درخواست بدهید' }, detail: { en: 'Full application by mail or in person, CAD 2,500 fee, and a verification report from Grant Thornton or MNP (allow up to 60 days).', fa: 'درخواست کامل با پست یا حضوری، هزینهٔ ۲٬۵۰۰ دلار و گزارش تأیید از Grant Thornton یا MNP (تا ۶۰ روز زمان می‌برد).' }, takes: { en: '120 days', fa: '۱۲۰ روز' }, link: S.mbGuide },
      { key: 'bpa', title: { en: 'Approval in principle: sign the BPA within 60 days', fa: 'تأیید اولیه: ظرف ۶۰ روز توافق‌نامه را امضا کنید' }, detail: { en: 'MPNP targets 6 months or less from a complete application. Once the BPA is signed you cannot withdraw for 2 years.', fa: 'هدف MPNP رسیدگی در شش ماه یا کمتر پس از تکمیل پرونده است. پس از امضای توافق‌نامه تا دو سال نمی‌توانید انصراف دهید.' }, link: S.mbGuide },
      { key: 'work-permit', title: { en: 'Work permit, then arrive within 12 months', fa: 'مجوز کار، سپس ورود ظرف ۱۲ ماه' }, detail: { en: 'Support letters are valid 3 months. Arrive with a valid work permit within 12 months of the support letter.', fa: 'نامه‌های حمایت سه ماه اعتبار دارند. ظرف ۱۲ ماه پس از نامهٔ حمایت با مجوز کار معتبر وارد شوید.' }, link: S.workPermit },
      { key: 'establish', title: { en: 'Report in 30 days; final report by month 20', fa: 'ظرف ۳۰ روز اعلام حضور؛ گزارش نهایی تا ماه بیستم' }, detail: { en: 'First progress report within 6 months of arrival, final report no later than 20 months after arrival. Expect site visits.', fa: 'نخستین گزارش پیشرفت ظرف شش ماه پس از ورود و گزارش نهایی حداکثر ۲۰ ماه پس از ورود. بازدید از محل کسب‌وکار هم انجام می‌شود.' }, takes: { en: 'up to 20 months', fa: 'تا ۲۰ ماه' }, link: S.mbGuide },
      { key: 'pr', title: { en: 'Nomination, then PR with IRCC', fa: 'نامزدی، سپس اقامت دائم از IRCC' }, detail: { en: 'The director reviews the recommendation and emails a Confirmation of Nomination.', fa: 'مدیر برنامه توصیه را بررسی و تأییدیهٔ نامزدی را با ایمیل می‌فرستد.' }, link: S.pnpApply },
    ],
    documents: [
      { key: 'concept', label: { en: 'Business Concept Form', fa: 'فرم ایدهٔ کسب‌وکار' }, stage: 'apply' },
      { key: 'self-assessment', label: { en: 'Self-Assessment Form', fa: 'فرم خودارزیابی' }, stage: 'apply' },
      { key: 'code', label: { en: 'MPNP Code of Conduct', fa: 'آیین‌نامهٔ رفتاری MPNP' }, stage: 'apply' },
      { key: 'verification', label: { en: 'Verification Report on source of funds and net worth (Grant Thornton or MNP)', fa: 'گزارش تأیید منشأ وجوه و دارایی خالص (Grant Thornton یا MNP)' }, stage: 'apply' },
      { key: 'language', label: { en: 'Language test, CLB 5', fa: 'آزمون زبان CLB ۵' }, stage: 'apply' },
      { key: 'education', label: { en: 'Proof of at least Canadian high-school equivalent', fa: 'مدرک دست‌کم معادل دیپلم دبیرستان کانادا' }, stage: 'apply' },
      { key: 'bpa', label: { en: 'Signed Business Performance Agreement', fa: 'توافق‌نامهٔ عملکرد امضاشده' }, stage: 'visa' },
      { key: 'progress', label: { en: 'Progress Reports and Final Report', fa: 'گزارش‌های پیشرفت و گزارش نهایی' }, stage: 'permit' },
    ],
    realities: [
      { key: 'no-draws', kind: 'tip', title: { en: 'No draws: a reply in four weeks', fa: 'بدون قرعه؛ پاسخ ظرف چهار هفته' }, detail: { en: 'The EOI is reviewed on its merits and MPNP commits to answer within 4 weeks.', fa: 'EOI بر اساس محتوای خودش بررسی می‌شود و MPNP متعهد است ظرف چهار هفته پاسخ دهد.' }, source: S.mbGuide },
      { key: 'locked', kind: 'challenge', title: { en: 'A signed BPA locks you in for two years', fa: 'توافق‌نامهٔ امضاشده شما را دو سال متعهد می‌کند' }, detail: { en: 'After signing, a withdrawal request is not considered; the agreement stays in force for 2 years unless refused.', fa: 'پس از امضا، درخواست انصراف بررسی نمی‌شود و توافق‌نامه دو سال معتبر می‌ماند، مگر پرونده رد شود.' }, source: S.mbGuide },
      { key: 'ineligible', kind: 'challenge', title: { en: 'Passive and property businesses are out', fa: 'کسب‌وکارهای غیرفعال و ملکی پذیرفته نیستند' }, detail: { en: 'Home-based, property investment, seasonal, rental or leasing, pass-through import-export, B&B and taxi licences are among the exclusions.', fa: 'کسب‌وکار خانگی، سرمایه‌گذاری ملکی، فصلی، اجاره و لیزینگ، واردات و صادرات واسطه‌ای، اقامتگاه B&B و پروانهٔ تاکسی از جملهٔ موارد مستثناست.' }, source: S.mbGuide },
      { key: 'one-change', kind: 'tip', title: { en: 'One change of business, within 12 months', fa: 'فقط یک بار تغییر کسب‌وکار، ظرف ۱۲ ماه' }, detail: { en: 'MPNP considers only one change request, never one that lowers the investment, and none after 12 months from arrival.', fa: 'MPNP فقط یک درخواست تغییر را بررسی می‌کند، هرگز تغییری که سرمایه‌گذاری را کم کند، و هیچ درخواستی پس از ۱۲ ماه از ورود.' }, source: S.mbGuide },
    ],
    timeline: PNP_TIMELINE(3, 'Approximate: final report up to 20 months after arrival, nomination, then IRCC’s paper PR processing.', 'تقریبی: گزارش نهایی تا ۲۰ ماه پس از ورود، نامزدی، سپس بررسی کاغذی اقامت دائم در IRCC.'),
    quiz: [
      q('eoi-reply', 'How fast does MPNP commit to answer an EOI?', 'MPNP متعهد است ظرف چه مدت به EOI پاسخ دهد؟', [['1 week', 'یک هفته'], ['4 weeks', 'چهار هفته'], ['3 months', 'سه ماه'], ['At the next draw', 'در قرعهٔ بعدی']], 1, 'The guide commits to a reply within four weeks.', 'راهنما پاسخ ظرف چهار هفته را تعهد کرده است.'),
      q('laa', 'After a Letter of Advice to Apply you have…', 'پس از نامهٔ توصیه به درخواست چقدر وقت دارید؟', [['30 days', '۳۰ روز'], ['60 days', '۶۰ روز'], ['120 days', '۱۲۰ روز'], ['12 months', '۱۲ ماه']], 2, 'Application and verification report are due within 120 days.', 'درخواست و گزارش تأیید باید ظرف ۱۲۰ روز برسد.'),
      q('fee', 'The MPNP processing fee is…', 'هزینهٔ رسیدگی MPNP چقدر است؟', [['Free', 'رایگان'], ['CAD 500', '۵۰۰ دلار کانادا'], ['CAD 2,500, non-refundable', '۲٬۵۰۰ دلار کانادا، غیرقابل‌استرداد'], ['A CAD 100,000 deposit', 'سپردهٔ ۱۰۰٬۰۰۰ دلاری']], 2, 'CAD 2,500 by wire, not refundable.', '۲٬۵۰۰ دلار کانادا با حواله، غیرقابل‌استرداد.'),
      q('final-report', 'The final report is due no later than…', 'گزارش نهایی حداکثر تا چه زمانی باید برسد؟', [['6 months after arrival', 'شش ماه پس از ورود'], ['12 months after arrival', '۱۲ ماه پس از ورود'], ['20 months after arrival', '۲۰ ماه پس از ورود'], ['5 years after arrival', 'پنج سال پس از ورود']], 2, 'The guide sets 20 months from arrival.', 'راهنما ۲۰ ماه از تاریخ ورود را تعیین کرده است.'),
      q('language', 'Minimum language?', 'حداقل زبان؟', [['CLB 4', 'CLB ۴'], ['CLB 5', 'CLB ۵'], ['CLB 7', 'CLB ۷'], ['None', 'لازم نیست']], 1, 'CLB or NCLC 5.', 'CLB یا NCLC ۵.'),
    ],
  },

  // ---------------------------------------------------------------- PEI
  'ca-pnp-pei': {
    funds: [
      { key: 'net-worth', label: { en: 'Verifiable personal net worth', fa: 'دارایی خالص شخصی قابل‌تأیید' }, amount: 600_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'show', source: S.pei },
      { key: 'pei-fee', label: { en: 'PEI application fee (all refunded if not accepted; 7,500 refunded if declined before the interview; none after)', fa: 'هزینهٔ درخواست PEI (اگر پذیرفته نشود کامل بازمی‌گردد؛ رد پیش از مصاحبه ۷٬۵۰۰ بازمی‌گردد؛ پس از مصاحبه هیچ)' }, amount: 10_000, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.pei },
      WORK_PERMIT_FEE,
      ...PR_FEES,
    ],
    steps: [
      { key: 'eoi', title: { en: 'Create an EOI profile', fa: 'پروفایل EOI بسازید' }, detail: { en: 'Free; one active profile, valid 6 months. Read the Business Impact Category guide first.', fa: 'رایگان؛ فقط یک پروفایل فعال با اعتبار شش ماه. پیش از آن راهنمای Business Impact Category را بخوانید.' }, link: S.pei },
      { key: 'apply', title: { en: 'If invited, apply with the CAD 10,000 fee', fa: 'در صورت دعوت، با هزینهٔ ۱۰٬۰۰۰ دلاری درخواست بدهید' }, detail: { en: 'Forms B-3, B-5, B-6 and the federal nominee package; net worth verified by a designated verifier. Submit in person or by courier to the Office of Immigration.', fa: 'فرم‌های B-3، B-5 و B-6 و بستهٔ فدرال نامزدهای استانی؛ دارایی خالص با تأیید ارزیاب تعیین‌شده. حضوری یا با پست به دفتر مهاجرت تحویل دهید.' }, link: S.pei },
      { key: 'interview', title: { en: 'Interview with the Office of Immigration', fa: 'مصاحبه با دفتر مهاجرت' }, detail: { en: 'Without a representative the interview is held without an interpreter.', fa: 'اگر نماینده ندارید، مصاحبه بدون مترجم برگزار می‌شود.' }, link: S.pei },
      { key: 'work-permit', title: { en: 'Sign the Performance Agreement and apply for a work permit', fa: 'توافق‌نامهٔ عملکرد را امضا و درخواست مجوز کار کنید' }, detail: { en: 'The province sends a letter of support for your IRCC work-permit application.', fa: 'استان برای درخواست مجوز کار به IRCC نامهٔ حمایت می‌فرستد.' }, link: S.workPermit },
      { key: 'operate', title: { en: 'Move to PEI and run the business', fa: 'به PEI بروید و کسب‌وکار را اداره کنید' }, detail: { en: 'Provide day-to-day management until every term of the Performance Agreement is met.', fa: 'مدیریت روزانه را تا انجام همهٔ تعهدات توافق‌نامه به عهده بگیرید.' }, link: S.pei },
      { key: 'pr', title: { en: 'Nomination, then PR with IRCC', fa: 'نامزدی، سپس اقامت دائم از IRCC' }, detail: { en: 'PEI issues the nomination certificate after the agreement is fulfilled.', fa: 'PEI پس از اجرای کامل توافق‌نامه گواهی نامزدی صادر می‌کند.' }, link: S.pnpApply },
    ],
    documents: [
      { key: 'b3', label: { en: 'B-3 Application Form', fa: 'فرم درخواست B-3' }, stage: 'apply' },
      { key: 'b5', label: { en: 'B-5 Consent to Validate Information', fa: 'فرم B-5، رضایت به اعتبارسنجی اطلاعات' }, stage: 'apply' },
      { key: 'b6', label: { en: 'B-6 Information Release', fa: 'فرم B-6، اجازهٔ انتشار اطلاعات' }, stage: 'apply' },
      { key: 'federal', label: { en: 'Federal application package for provincial nominees', fa: 'بستهٔ درخواست فدرال برای نامزدهای استانی' }, stage: 'apply' },
      { key: 'net-worth', label: { en: 'Net worth verification by a designated verifier', fa: 'تأیید دارایی خالص از ارزیاب تعیین‌شده' }, stage: 'apply' },
      { key: 'fee', label: { en: 'CAD 10,000 bank draft, certified cheque or money order', fa: 'حوالهٔ بانکی، چک تضمینی یا حوالهٔ پولی ۱۰٬۰۰۰ دلاری' }, stage: 'apply' },
      { key: 'language', label: { en: 'Language test, CLB 4', fa: 'آزمون زبان CLB ۴' }, stage: 'apply' },
    ],
    realities: [
      { key: 'zero', kind: 'challenge', title: { en: 'No entrepreneur invitations in 2026 so far', fa: 'تاکنون در ۲۰۲۶ هیچ دعوت کارآفرینی صادر نشده' }, detail: { en: 'Our 12 Oct 2026 check of the draws page found zero entrepreneur invitations in ten draws; the page could not be re-read on 27 Oct.', fa: 'بررسی ۱۲ اکتبر ۲۰۲۶ صفحهٔ قرعه‌ها در ده قرعه هیچ دعوت کارآفرینی نشان نداد؛ این صفحه در ۲۷ اکتبر دوباره قابل خواندن نبود.' }, source: 'https://www.princeedwardisland.ca/en/information/office-of-immigration/expression-of-interest-draws' },
      { key: 'refund', kind: 'tip', title: { en: 'Know the refund rule before the interview', fa: 'قاعدهٔ بازپرداخت را پیش از مصاحبه بدانید' }, detail: { en: 'Declined or withdrawn before the interview: CAD 7,500 back. After the interview: nothing.', fa: 'رد یا انصراف پیش از مصاحبه: ۷٬۵۰۰ دلار بازمی‌گردد. پس از مصاحبه: هیچ.' }, source: S.pei },
      { key: 'misrep', kind: 'challenge', title: { en: 'Discrepancies with your EOI count against you', fa: 'هر ناهمخوانی با EOI به ضرر شماست' }, detail: { en: 'Files found to contain misrepresentation may be barred for 2 years.', fa: 'پرونده‌ای که اطلاعات خلاف واقع داشته باشد ممکن است تا دو سال محروم شود.' }, source: S.pei },
      { key: 'rep', kind: 'tip', title: { en: 'Any help must go through an approved representative', fa: 'هر کمکی باید از طریق نمایندهٔ تأییدشده باشد' }, detail: { en: 'If anyone helped prepare your file, it must be submitted by a representative on PEI’s approved list.', fa: 'اگر کسی در تهیهٔ پرونده کمک کرده، پرونده باید توسط نماینده‌ای از فهرست تأییدشدهٔ PEI ثبت شود.' }, source: S.pei },
    ],
    timeline: PNP_TIMELINE(2.5, 'Approximate: work permit, the Performance Agreement period, nomination, then IRCC’s paper PR processing.', 'تقریبی: مجوز کار، دورهٔ توافق‌نامهٔ عملکرد، نامزدی، سپس بررسی کاغذی اقامت دائم در IRCC.'),
    quiz: [
      q('fee', 'PEI’s application fee is…', 'هزینهٔ درخواست PEI چقدر است؟', [['CAD 2,000', '۲٬۰۰۰ دلار کانادا'], ['CAD 3,500', '۳٬۵۰۰ دلار کانادا'], ['CAD 10,000', '۱۰٬۰۰۰ دلار کانادا'], ['Free', 'رایگان']], 2, 'CAD 10,000, partly refundable before the interview.', '۱۰٬۰۰۰ دلار کانادا که پیش از مصاحبه بخشی از آن قابل‌استرداد است.'),
      q('age', 'Accepted age range?', 'بازهٔ سنی پذیرفته‌شده؟', [['19 to 59', '۱۹ تا ۵۹'], ['21 to 59', '۲۱ تا ۵۹'], ['21 to 55', '۲۱ تا ۵۵'], ['No limit', 'بدون محدودیت']], 1, 'Applicants must be 21 to 59 when they apply.', 'متقاضی هنگام درخواست باید ۲۱ تا ۵۹ ساله باشد.'),
      q('net-worth', 'Minimum net worth?', 'حداقل دارایی خالص؟', [['CAD 300,000', '۳۰۰٬۰۰۰ دلار کانادا'], ['CAD 500,000', '۵۰۰٬۰۰۰ دلار کانادا'], ['CAD 600,000', '۶۰۰٬۰۰۰ دلار کانادا'], ['CAD 1,000,000', '۱٬۰۰۰٬۰۰۰ دلار کانادا']], 2, 'PEI asks for CAD 600,000, accumulated legally.', 'PEI دارایی خالص ۶۰۰٬۰۰۰ دلاری می‌خواهد که از راه قانونی به دست آمده باشد.'),
      q('eoi-valid', 'How long does an EOI profile stay active?', 'پروفایل EOI چه مدت فعال می‌ماند؟', [['3 months', 'سه ماه'], ['6 months', 'شش ماه'], ['12 months', '۱۲ ماه'], ['Until invited', 'تا زمان دعوت']], 1, 'Profiles stay active for six months.', 'پروفایل شش ماه فعال می‌ماند.'),
      q('refund-after', 'Declined after the interview: how much is refunded?', 'اگر پس از مصاحبه رد شوید، چقدر بازگردانده می‌شود؟', [['All of it', 'همه‌اش'], ['CAD 7,500', '۷٬۵۰۰ دلار کانادا'], ['Half', 'نیمی از آن'], ['Nothing', 'هیچ']], 3, 'After the interview the whole fee is non-refundable.', 'پس از مصاحبه هیچ بخشی از هزینه بازگردانده نمی‌شود.'),
    ],
  },

  // ---------------------------------------------------------------- Study
  'ca-study-permit': {
    funds: [
      { key: 'living-1', label: { en: 'Living costs, student alone, per year (outside Quebec)', fa: 'هزینهٔ زندگی، دانشجوی تنها، سالانه (خارج از کبک)' }, amount: 23_448, currency: 'CAD', basis: 'year', per: 'person', kind: 'show', source: S.studyFunds },
      { key: 'living-spouse', label: { en: 'Added for a spouse (family of 2: CAD 29,192)', fa: 'افزایش برای همسر (خانوادهٔ دو نفره: ۲۹٬۱۹۲ دلار)' }, amount: 5_744, currency: 'CAD', basis: 'year', per: 'spouse', kind: 'show', source: S.studyFunds },
      { key: 'living-child', label: { en: 'Added for a first child (family of 3: CAD 35,888)', fa: 'افزایش برای فرزند اول (خانوادهٔ سه نفره: ۳۵٬۸۸۸ دلار)' }, amount: 6_696, currency: 'CAD', basis: 'year', per: 'child', kind: 'show', source: S.studyFunds },
      { key: 'study-fee', label: { en: 'Study permit fee', fa: 'هزینهٔ مجوز تحصیل' }, amount: 150, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.fees },
      { key: 'biometrics', label: { en: 'Biometrics', fa: 'انگشت‌نگاری' }, amount: 85, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.fees },
      { key: 'pgwp', label: { en: 'PGWP (work permit fee)', fa: 'PGWP (هزینهٔ مجوز کار)' }, amount: 155, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.fees },
      { key: 'owp', label: { en: 'Open work permit holder fee (PGWP)', fa: 'هزینهٔ دارندهٔ مجوز کار باز (PGWP)' }, amount: 100, currency: 'CAD', basis: 'once', per: 'person', kind: 'spend', source: S.fees },
    ],
    steps: [
      { key: 'admission', title: { en: 'Get an acceptance letter from a DLI', fa: 'از یک مؤسسهٔ آموزشی تعیین‌شده (DLI) پذیرش بگیرید' }, detail: { en: 'Check that the school and programme are PGWP-eligible if you plan to work after graduating.', fa: 'اگر می‌خواهید پس از تحصیل کار کنید، مطمئن شوید مؤسسه و رشته برای PGWP واجد شرایط‌اند.' }, link: S.dli },
      { key: 'pal', title: { en: 'Get a PAL/TAL unless you are exempt', fa: 'نامهٔ تأیید استانی (PAL/TAL) بگیرید، مگر معاف باشید' }, detail: { en: 'Master’s and doctoral students at a public DLI are exempt from 1 Jan 2026. A 2026 PAL is valid to 31 Dec 2026.', fa: 'از ۱ ژانویهٔ ۲۰۲۶ دانشجویان کارشناسی ارشد و دکتری در DLI دولتی معاف‌اند. PAL سال ۲۰۲۶ تا ۳۱ دسامبر ۲۰۲۶ اعتبار دارد.' }, link: S.pal },
      { key: 'funds', title: { en: 'Prepare proof of funds', fa: 'مدارک تمکن مالی را آماده کنید' }, detail: { en: 'First-year tuition plus CAD 23,448 a year for living costs (more for family), plus travel.', fa: 'شهریهٔ سال اول، به‌علاوهٔ ۲۳٬۴۴۸ دلار کانادا در سال برای هزینهٔ زندگی (برای خانواده بیشتر) و هزینهٔ سفر.' }, link: S.studyFunds },
      { key: 'apply', title: { en: 'Apply online for the study permit', fa: 'درخواست مجوز تحصیل را آنلاین ثبت کنید' }, detail: { en: 'Pay CAD 150 plus CAD 85 biometrics, then give biometrics.', fa: '۱۵۰ دلار به‌علاوهٔ ۸۵ دلار انگشت‌نگاری بپردازید و سپس انگشت‌نگاری کنید.' }, link: S.studyApply },
      { key: 'study', title: { en: 'Study full time; work up to 24 hours a week', fa: 'تمام‌وقت درس بخوانید؛ تا ۲۴ ساعت در هفته کار کنید' }, detail: { en: 'Off-campus work is capped at 24 hours a week in term and unlimited in scheduled breaks. Part-time is allowed only in the last semester.', fa: 'کار بیرون از دانشگاه در ترم حداکثر ۲۴ ساعت در هفته و در تعطیلات رسمی بدون محدودیت است. پاره‌وقت فقط در ترم آخر مجاز است.' }, link: S.offCampus },
      { key: 'pgwp', title: { en: 'Apply for the PGWP within 180 days', fa: 'ظرف ۱۸۰ روز برای PGWP درخواست دهید' }, detail: { en: 'CLB 7 for university degrees, CLB 5 for college; programme of at least 8 months.', fa: 'برای مدرک دانشگاهی CLB ۷ و برای کالج CLB ۵؛ دورهٔ دست‌کم هشت‌ماهه.' }, takes: { en: '180 days', fa: '۱۸۰ روز' }, link: S.pgwp },
      { key: 'pr', title: { en: 'Work one year, then Express Entry (CEC)', fa: 'یک سال کار کنید، سپس اکسپرس انتری (CEC)' }, detail: { en: 'One year of skilled Canadian work in the last 3 years qualifies you for the Canadian Experience Class.', fa: 'یک سال کار ماهر در کانادا در سه سال اخیر شما را واجد شرایط طبقهٔ تجربهٔ کانادایی می‌کند.' }, link: S.eeWorks },
    ],
    documents: [
      { key: 'loa', label: { en: 'Letter of acceptance from a DLI', fa: 'نامهٔ پذیرش از DLI' }, stage: 'apply' },
      { key: 'pal', label: { en: 'PAL/TAL, or proof of exemption', fa: 'نامهٔ PAL/TAL یا مدرک معافیت' }, stage: 'apply' },
      { key: 'passport', label: { en: 'Passport', fa: 'گذرنامه' }, stage: 'apply' },
      { key: 'tuition', label: { en: 'Receipt for first-year tuition and housing, or loan or scholarship proof', fa: 'رسید شهریه و خوابگاه سال اول، یا مدرک وام یا بورسیه' }, stage: 'apply' },
      { key: 'bank', label: { en: 'Six months of bank statements, or a Canadian GIC or account', fa: 'صورت‌حساب شش ماه بانک، یا GIC یا حساب بانکی در کانادا' }, stage: 'apply' },
      { key: 'sponsor', label: { en: 'Sponsor’s letter with job, relationship, dependants and amount, plus ID', fa: 'نامهٔ حامی مالی با شغل، نسبت، تعداد افراد تحت تکفل و مبلغ، همراه با مدرک شناسایی' }, note: { en: 'Only if someone else pays.', fa: 'فقط اگر شخص دیگری هزینه را می‌دهد.' }, stage: 'apply' },
      { key: 'pgwp-lang', label: { en: 'Language test for the PGWP (CLB 7 or 5)', fa: 'آزمون زبان برای PGWP (CLB ۷ یا ۵)' }, stage: 'renewal' },
    ],
    realities: [
      { key: 'grad-exempt', kind: 'tip', title: { en: 'Graduate students skip the PAL', fa: 'دانشجویان تحصیلات تکمیلی PAL لازم ندارند' }, detail: { en: 'A master’s or PhD at a public DLI needs no PAL/TAL from 1 Jan 2026; you still prove the exemption.', fa: 'از ۱ ژانویهٔ ۲۰۲۶ کارشناسی ارشد یا دکتری در DLI دولتی به PAL/TAL نیاز ندارد؛ فقط باید معافیت را ثابت کنید.' }, source: S.pal },
      { key: 'field', kind: 'challenge', title: { en: 'College diplomas must match a shortage field', fa: 'مدرک کالج باید در رشتهٔ کمبود باشد' }, detail: { en: 'For study permits applied for from 1 Nov 2024, non-degree programmes must be in a field linked to long-term shortage for the PGWP. Bachelor’s, master’s and PhD are exempt.', fa: 'برای مجوزهای تحصیلی که از ۱ نوامبر ۲۰۲۴ درخواست شده‌اند، دوره‌های غیرمدرک دانشگاهی برای PGWP باید در رشته‌ای مرتبط با کمبود بلندمدت باشند. کارشناسی، ارشد و دکتری معاف‌اند.' }, source: S.pgwp },
      { key: 'work-myth', kind: 'myth', title: { en: 'Myth: "you can work full time and pay as you go"', fa: 'باور نادرست: «می‌شود تمام‌وقت کار کرد و خرج را درآورد»' }, detail: { en: 'Off-campus work is capped at 24 hours a week in term, and the funds you show must cover the first year without work in Canada.', fa: 'کار بیرون از دانشگاه در ترم حداکثر ۲۴ ساعت در هفته است و تمکنی که نشان می‌دهید باید سال اول را بدون کار در کانادا پوشش دهد.' }, source: S.offCampus },
      { key: 'funds-rise', kind: 'challenge', title: { en: 'The living-cost figure rose on 1 Sep 2026', fa: 'رقم هزینهٔ زندگی از ۱ سپتامبر ۲۰۲۶ بالا رفت' }, detail: { en: 'CAD 23,448 for one person, excluding tuition and travel.', fa: '۲۳٬۴۴۸ دلار کانادا برای یک نفر، بدون شهریه و سفر.' }, source: S.studyFunds },
      { key: 'iran-policy', kind: 'tip', title: { en: 'Iranian nationals: in-Canada work-permit renewals', fa: 'اتباع ایران: تمدید مجوز کار از داخل کانادا' }, detail: { en: 'A public policy (1 Mar 2026 to 31 Mar 2027) lets Iranians whose work permit was issued by 28 Feb 2025 renew from inside Canada. It does not cover study permits.', fa: 'یک سیاست عمومی (۱ مارس ۲۰۲۶ تا ۳۱ مارس ۲۰۲۷) به ایرانیانی که مجوز کارشان تا ۲۸ فوریهٔ ۲۰۲۵ صادر شده اجازه می‌دهد از داخل کانادا تمدید کنند. این سیاست مجوز تحصیل را شامل نمی‌شود.' }, source: S.iran2026 },
    ],
    timeline: {
      prAfterYears: 3.5,
      citizenshipAfterYears: 5.5,
      dualCitizenship: 'allowed',
      language: CITIZENSHIP_LANGUAGE,
      note: {
        en: `Approximate, for a two-year programme: 2 years of study, 1 year of skilled work on the PGWP, then Express Entry. ${CITIZENSHIP_NOTE.en}`,
        fa: `تقریبی، برای دورهٔ دوساله: دو سال تحصیل، یک سال کار ماهر با PGWP، سپس اکسپرس انتری. ${CITIZENSHIP_NOTE.fa}`,
      },
      source: S.citizenship,
    },
    quiz: [
      q('living', 'Living-cost funds for one student from 1 Sep 2026?', 'هزینهٔ زندگی یک دانشجو از ۱ سپتامبر ۲۰۲۶؟', [['CAD 10,000', '۱۰٬۰۰۰ دلار کانادا'], ['CAD 20,635', '۲۰٬۶۳۵ دلار کانادا'], ['CAD 23,448', '۲۳٬۴۴۸ دلار کانادا'], ['CAD 29,192', '۲۹٬۱۹۲ دلار کانادا']], 2, 'IRCC sets CAD 23,448 a year outside Quebec, excluding tuition.', 'IRCC برای خارج از کبک سالانه ۲۳٬۴۴۸ دلار کانادا، بدون شهریه، تعیین کرده است.'),
      q('hours', 'Off-campus work during term is capped at…', 'سقف کار بیرون از دانشگاه در ترم چقدر است؟', [['20 hours a week', '۲۰ ساعت در هفته'], ['24 hours a week', '۲۴ ساعت در هفته'], ['40 hours a week', '۴۰ ساعت در هفته'], ['No cap', 'بدون سقف']], 1, 'IRCC allows up to 24 hours a week in term.', 'IRCC در ترم تا ۲۴ ساعت در هفته اجازه می‌دهد.'),
      q('pal-exempt', 'Who is exempt from the PAL from 1 Jan 2026?', 'از ۱ ژانویهٔ ۲۰۲۶ چه کسی از PAL معاف است؟', [['All college students', 'همهٔ دانشجویان کالج'], ['Master’s and PhD students at a public DLI', 'دانشجویان ارشد و دکتری در DLI دولتی'], ['Bachelor’s students', 'دانشجویان کارشناسی'], ['Nobody', 'هیچ‌کس']], 1, 'Graduate programmes at public DLIs are exempt.', 'دوره‌های تحصیلات تکمیلی در DLI دولتی معاف‌اند.'),
      q('pgwp-deadline', 'You must apply for the PGWP within…', 'برای PGWP باید ظرف چه مدت درخواست دهید؟', [['30 days', '۳۰ روز'], ['90 days', '۹۰ روز'], ['180 days', '۱۸۰ روز'], ['One year', 'یک سال']], 2, 'Within 180 days of confirmation that you completed the programme.', 'ظرف ۱۸۰ روز پس از تأیید پایان دوره.'),
      q('pgwp-lang', 'PGWP language for a university degree?', 'زبان لازم PGWP برای مدرک دانشگاهی؟', [['None', 'لازم نیست'], ['CLB 5', 'CLB ۵'], ['CLB 7', 'CLB ۷'], ['CLB 9', 'CLB ۹']], 2, 'CLB 7 for degrees, CLB 5 for college.', 'برای مدرک دانشگاهی CLB ۷ و برای کالج CLB ۵.'),
    ],
    media: [
      { notebookId: 'c1f8868c-6234-4944-8600-29053d43b745', kind: 'slides', title: '2025 Iranian Policy Blueprint' },
      { notebookId: 'c1f8868c-6234-4944-8600-29053d43b745', kind: 'slides', title: '2025 Iranian Special Measures Guide' },
      { notebookId: 'c1f8868c-6234-4944-8600-29053d43b745', kind: 'slides', title: '2025 Iranian Public Policy Guide' },
      { notebookId: 'c1f8868c-6234-4944-8600-29053d43b745', kind: 'slides', title: '2026-2027 Iranian Work Permit Roadmap' },
      { notebookId: 'c1f8868c-6234-4944-8600-29053d43b745', kind: 'slides', title: 'Iranian Work Permit Extension Roadmap' },
    ],
  },
};

// ---------------------------------------------------------------- profile

export const PROFILE_CA: CountryProfile = {
  strengths: [
    { en: 'Dual citizenship is allowed, and citizenship comes after 3 years in Canada, with half credit for up to a year spent there before PR.', fa: 'تابعیت دوگانه پذیرفته است و شهروندی پس از سه سال حضور در کانادا ممکن است؛ روزهای پیش از اقامت دائم تا یک سال با نیم امتیاز حساب می‌شود.' },
    { en: 'Many doors to PR: federal Express Entry plus provincial streams, several of which skip draws (New Brunswick, Manitoba).', fa: 'درهای زیادی به اقامت دائم: اکسپرس انتری فدرال و مسیرهای استانی که چندتایشان قرعه ندارند (نیوبرانزویک، مانیتوبا).' },
    { en: 'Study leads to work: up to 24 hours a week during term, then a post-graduation work permit and the Canadian Experience Class.', fa: 'تحصیل به کار می‌رسد: تا ۲۴ ساعت کار در هفته در ترم، سپس مجوز کار پس از تحصیل و طبقهٔ تجربهٔ کانادایی.' },
    { en: 'A strong passport (7th in the Henley index, 183 destinations) and a peaceful country (14th of 163 in the Global Peace Index 2026).', fa: 'گذرنامهٔ قوی (رتبهٔ ۷ شاخص Henley با ۱۸۳ مقصد) و کشوری آرام (رتبهٔ ۱۴ از ۱۶۳ در شاخص صلح جهانی ۲۰۲۶).' },
  ],
  weaknesses: [
    { en: 'No federal startup route: the Start-up Visa was paused on 30 June 2026 and no successor has been named.', fa: 'مسیر استارتاپی فدرال وجود ندارد: ویزای استارتاپ از ۳۰ ژوئن ۲۰۲۶ متوقف شده و جایگزینی معرفی نشده است.' },
    { en: 'Provincial entrepreneur streams are small and slow: Alberta has 60 entrepreneur nominations for all of 2026, and every PNP file then waits on IRCC’s paper processing.', fa: 'مسیرهای کارآفرینی استانی کوچک و کند هستند: آلبرتا برای کل ۲۰۲۶ فقط ۶۰ نامزدی کارآفرینی دارد و هر پروندهٔ PNP پس از آن منتظر بررسی کاغذی IRCC می‌ماند.' },
    { en: 'Study permits are capped and most students need a provincial attestation letter.', fa: 'مجوز تحصیل سقف دارد و بیشتر دانشجویان به نامهٔ تأیید استانی نیاز دارند.' },
    { en: 'Unemployment has risen three years running, from 5.4% in 2023 to 6.9% in 2025 (World Bank, ILO model).', fa: 'نرخ بیکاری سه سال پیاپی بالا رفته است: از ۵٫۴٪ در ۲۰۲۳ به ۶٫۹٪ در ۲۰۲۵ (بانک جهانی، مدل ILO).' },
    { en: 'Express Entry rules keep moving: job-offer points were removed in 2025 and return in a new form on 3 November 2026.', fa: 'قواعد اکسپرس انتری مدام تغییر می‌کند: امتیاز پیشنهاد کار در ۲۰۲۵ حذف شد و از ۳ نوامبر ۲۰۲۶ به شکلی تازه برمی‌گردد.' },
  ],
  indicators: [
    { key: 'hdi', rank: 16, of: 193, value: 0.939, year: 2023, source: { url: 'https://hdr.undp.org/data-center/specific-country-data#/countries/CAN', checked: D, label: 'UNDP Human Development Report 2025 (data 2023)' } },
    { key: 'happiness', rank: 25, of: 147, value: 6.741, year: 2026, source: { url: 'https://data.worldhappiness.report/table', checked: D, label: 'World Happiness Report 2026 dashboard (year filter 2025)' } },
    { key: 'peace', rank: 14, of: 163, value: 1.525, year: 2026, source: { url: 'https://www.visionofhumanity.org/maps/', checked: D, label: 'Global Peace Index 2026' } },
    { key: 'gdp-per-capita', value: 55_698, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/CAN/indicator/NY.GDP.PCAP.CD?format=json&mrv=3', checked: D, label: 'World Bank, GDP per capita (current US$)' } },
    { key: 'unemployment', value: 6.9, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/CAN/indicator/SL.UEM.TOTL.ZS?format=json&mrv=3', checked: D, label: 'World Bank, unemployment (modelled ILO estimate)' } },
    { key: 'innovation', rank: 17, of: 139, year: 2025, source: { url: 'https://www.wipo.int/web-publications/global-innovation-index-2025/en/gii-2025-results.html', checked: D, label: 'WIPO Global Innovation Index 2025' } },
    { key: 'passport', rank: 7, value: 183, unit: 'visa-free destinations', year: 2026, source: { url: 'https://www.henleyglobal.com/passport-index/ranking', checked: D, label: 'Henley Passport Index 2026' } },
  ],
};

// ---------------------------------------------------------------- helpers

function q(key: string, en: string, fa: string, options: Array<[string, string]>, answer: number, whyEn: string, whyFa: string): QuizItem {
  return {
    key,
    q: { en, fa },
    options: options.map(([oEn, oFa]) => ({ en: oEn, fa: oFa })),
    answer,
    why: { en: whyEn, fa: whyFa },
  };
}
