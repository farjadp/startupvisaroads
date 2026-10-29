// United Arab Emirates — route extras and country profile (content v3, spec 2026-10-27).
// No notebook exists for the UAE: everything here was read on ICP, GDRFA Dubai
// and u.ae pages on 2026-10-27 (see docs/research/app-v3/ae.md).
// GDRFA Dubai pages describe Dubai; other emirates apply through ICP.
import type { CountryProfile, FundLine, RouteExtras, Timeline } from '../extras-types';

const CHECKED = '2026-10-27';

const ICP_GOLDEN = 'https://icp.gov.ae/en/services/uae-golden-residency/';
const ICP_GREEN = 'https://icp.gov.ae/en/services/uae-green-residency/';
const ICP_ELIGIBILITY = 'https://smartservices.icp.gov.ae/echannels/web/client/guest/index.html#/checkEligibility';
const ICP_GOLDEN_SERVICES = 'https://smartservices.icp.gov.ae/echannels/web/client/guest/index.html#/goldenServicesDashboard';
const UAE_GOLDEN = 'https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa';
const UAE_NATIONALITY = 'https://u.ae/en/information-and-services/Passport-and-travel/The-UAE-Passport/emirati-nationality';
const GDRFAD_GOLDEN_SERVICES = 'https://www.gdrfad.gov.ae/en/services?id=71ea8dd6-56c3-11ea-0320-0050569629e8';
const GDRFAD_INVESTOR = 'https://www.gdrfad.gov.ae/en/services/8ea80da4-f43e-11eb-0320-0050569629e8';
const GDRFAD_ENTREPRENEUR = 'https://www.gdrfad.gov.ae/en/services/8ea80da7-f43e-11eb-0320-0050569629e8';
const GDRFAD_TALENT = 'https://www.gdrfad.gov.ae/en/services/2e7da546-f815-11eb-0320-0050569629e8';
const GDRFAD_FREELANCE = 'https://gdrfad.gov.ae/en/services/f52024d1-b812-11ed-5210-4cd98f768936';
const GDRFAD_STUDENT = 'https://www.gdrfad.gov.ae/en/services/f52024e0-b812-11ed-5210-4cd98f768936';
const GDRFAD_GOLDEN_STUDENT = 'https://www.gdrfad.gov.ae/en/services/8ea80dad-f43e-11eb-0320-0050569629e8';

/** GDRFA Dubai fee lines, identical across the services read; only the permit fee differs. */
function dubaiFees(permit: number, source: string): FundLine[] {
  return [
    {
      key: 'permit',
      label: { en: 'Residence permit fee', fa: 'هزینه‌ی صدور اقامت' },
      amount: permit,
      currency: 'AED',
      basis: 'once',
      per: 'person',
      kind: 'spend',
      source,
    },
    {
      key: 'dirhams',
      label: { en: 'Knowledge Dirham + Innovation Dirham', fa: 'درهم دانش و درهم نوآوری' },
      amount: 20,
      currency: 'AED',
      basis: 'once',
      per: 'person',
      kind: 'spend',
      source,
    },
    {
      key: 'in-country',
      label: { en: 'Fee when applying from inside the UAE', fa: 'هزینه‌ی درخواست از داخل امارات' },
      amount: 500,
      currency: 'AED',
      basis: 'once',
      per: 'person',
      kind: 'spend',
      source,
    },
    {
      key: 'delivery',
      label: { en: 'Delivery', fa: 'ارسال' },
      amount: 20,
      currency: 'AED',
      basis: 'once',
      per: 'person',
      kind: 'spend',
      source,
    },
  ];
}

const TIMELINE_UAE: Timeline = {
  dualCitizenship: 'restricted',
  note: {
    en: 'The UAE has no permanent residence: Golden and Green permits are renewable while you meet the conditions. Citizenship comes only by nomination from federal entities, for set categories (investors who own property, specialists, creatives); those naturalised may keep their original nationality.',
    fa: 'امارات اقامت دائم ندارد: اقامت طلایی و سبز تا وقتی شرایط را دارید تمدید می‌شوند. تابعیت فقط با معرفی نهادهای فدرال و برای گروه‌های مشخص (سرمایه‌گذار مالک ملک، متخصص، هنرمند) داده می‌شود و این افراد می‌توانند تابعیت قبلی خود را نگه دارند.',
  },
  source: UAE_NATIONALITY,
};

const NOT_CITIZENSHIP = {
  key: 'not-citizenship',
  kind: 'myth' as const,
  title: { en: '"Ten years here leads to a passport"', fa: '«ده سال اقامت یعنی گذرنامه‌ی اماراتی»' },
  detail: {
    en: 'No length of residence leads to citizenship. It is granted only by nomination through the Rulers\' Courts, Executive Councils or the Cabinet.',
    fa: 'هیچ مدت اقامتی به تابعیت نمی‌رسد. تابعیت فقط با معرفی از سوی دیوان حاکمان، شوراهای اجرایی یا هیئت وزیران داده می‌شود.',
  },
  source: UAE_NATIONALITY,
};

export const EXTRAS_AE: Record<string, RouteExtras> = {
  // ───────────────────────── Golden: investor ─────────────────────────
  'ae-golden-investor': {
    funds: [
      {
        key: 'asset',
        label: {
          en: 'One qualifying asset: bank deposit or fund, company capital or share, or property',
          fa: 'یک دارایی واجد شرایط: سپرده‌ی بانکی یا صندوق، سرمایه یا سهم شرکت، یا ملک',
        },
        amount: 2000000,
        currency: 'AED',
        basis: 'once',
        per: 'person',
        kind: 'invest',
        source: ICP_GOLDEN,
      },
      ...dubaiFees(1100, GDRFAD_INVESTOR),
    ],
    steps: [
      {
        key: 'eligibility',
        title: { en: 'Check eligibility with ICP', fa: 'شرایط را در سامانه‌ی ICP بسنجید' },
        detail: {
          en: 'ICP\'s online tool tells you which Golden category fits.',
          fa: 'ابزار آنلاین ICP نشان می‌دهد کدام دسته‌ی اقامت طلایی به شما می‌خورد.',
        },
        link: ICP_ELIGIBILITY,
      },
      {
        key: 'asset',
        title: { en: 'Put AED 2 million into one asset', fa: '۲ میلیون درهم را در یک دارایی بگذارید' },
        detail: {
          en: 'The money must be yours, not borrowed (a bank-financed property is the exception). In Dubai a deposit is frozen for at least two years, and a lien is placed on property.',
          fa: 'پول باید مال خودتان باشد، نه وام (ملکی که با وام بانکی خریده شده استثناست). در دبی سپرده دست‌کم دو سال مسدود می‌شود و روی ملک حق رهن ثبت می‌شود.',
        },
        link: GDRFAD_INVESTOR,
      },
      {
        key: 'insurance',
        title: { en: 'Get health insurance', fa: 'بیمه‌ی درمانی بگیرید' },
        detail: {
          en: 'You and every family member need valid health insurance.',
          fa: 'شما و همه‌ی اعضای خانواده باید بیمه‌ی درمانی معتبر داشته باشید.',
        },
        link: ICP_GOLDEN,
      },
      {
        key: 'apply',
        title: { en: 'Apply online', fa: 'آنلاین درخواست بدهید' },
        detail: {
          en: 'Through ICP smart services, or GDRFA Dubai if you live in Dubai (online with UAE Pass or at an Amer centre). Dubai property applications go through accredited centres.',
          fa: 'از راه خدمات هوشمند ICP، یا اگر ساکن دبی هستید از GDRFA دبی (آنلاین با UAE Pass یا در مرکز Amer). درخواست‌های ملکی دبی از مراکز معتمد ثبت می‌شوند.',
        },
        link: ICP_GOLDEN_SERVICES,
      },
      {
        key: 'decision',
        title: { en: 'Pay and wait for the decision', fa: 'هزینه را بپردازید و منتظر پاسخ بمانید' },
        detail: {
          en: 'GDRFA Dubai expects to finish in 5 days. Applying from abroad, ICP gives a six-month multiple-entry visa to complete the process.',
          fa: 'GDRFA دبی انجام کار را ۵ روزه پیش‌بینی می‌کند. اگر از خارج درخواست بدهید، ICP برای تکمیل مراحل ویزای ورود چندباره‌ی شش‌ماهه می‌دهد.',
        },
        takes: { en: '5 days (GDRFA Dubai)', fa: '۵ روز (GDRFA دبی)' },
        link: GDRFAD_INVESTOR,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport copy', fa: 'کپی گذرنامه' }, stage: 'apply' },
      {
        key: 'deposit',
        label: { en: 'Deposit: proof you own it, and proof of housing in Dubai', fa: 'سپرده: مدرک مالکیت سپرده و مدرک محل سکونت در دبی' },
        note: { en: 'Plus a bank certificate that it is frozen for two years.', fa: 'به‌علاوه‌ی گواهی بانک که سپرده دو سال مسدود است.' },
        stage: 'apply',
      },
      {
        key: 'property',
        label: { en: 'Property: proof of ownership (Dubai Land Department certificate)', fa: 'ملک: مدرک مالکیت (گواهی اداره‌ی اراضی دبی)' },
        stage: 'apply',
      },
      {
        key: 'company',
        label: {
          en: 'Company: certified financial report, trade licence with partners appendix, company bank statement, tax registration and receipts',
          fa: 'شرکت: گزارش مالی حسابرسی‌شده، مجوز تجاری با پیوست شرکا، صورت‌حساب بانکی شرکت، ثبت مالیاتی و رسیدها',
        },
        stage: 'apply',
      },
      {
        key: 'tax',
        label: { en: 'Tax option: Federal Tax Authority letter and trade licence', fa: 'گزینه‌ی مالیات: نامه‌ی سازمان مالیات فدرال و مجوز تجاری' },
        stage: 'apply',
      },
      { key: 'insurance', label: { en: 'Health insurance for you and your family', fa: 'بیمه‌ی درمانی برای خود و خانواده' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'locked',
        kind: 'challenge',
        title: { en: 'The money is locked in', fa: 'پول قفل می‌شود' },
        detail: {
          en: 'In Dubai the deposit cannot be refunded and the property cannot be sold during the 10 years.',
          fa: 'در دبی سپرده در طول ۱۰ سال پس داده نمی‌شود و ملک را نمی‌توان فروخت.',
        },
        source: GDRFAD_INVESTOR,
      },
      {
        key: 'own-money',
        kind: 'tip',
        title: { en: 'No borrowed capital', fa: 'سرمایه‌ی قرضی قبول نیست' },
        detail: {
          en: 'ICP requires the capital to be fully yours with proof of its source; only property bought with a loan from an approved local bank is allowed.',
          fa: 'ICP می‌خواهد سرمایه کاملاً مال شما باشد و منبعش را نشان دهید؛ فقط ملکی که با وام بانک محلی معتبر خریده شده پذیرفته است.',
        },
        source: ICP_GOLDEN,
      },
      {
        key: 'term',
        kind: 'challenge',
        title: { en: '5 or 10 years for property?', fa: 'ملک: ۵ سال یا ۱۰ سال؟' },
        detail: {
          en: 'ICP and GDRFA Dubai say 10 years for every investor; u.ae says 5 years for real-estate investors. Ask ICP which term your permit will carry.',
          fa: 'ICP و GDRFA دبی برای همه‌ی سرمایه‌گذاران ۱۰ سال می‌گویند؛ u.ae برای سرمایه‌گذار ملکی ۵ سال. از ICP بپرسید اقامت شما چند ساله صادر می‌شود.',
        },
        source: UAE_GOLDEN,
      },
      {
        key: 'abroad',
        kind: 'tip',
        title: { en: 'Long stays abroad are fine', fa: 'ماندن طولانی در خارج مشکلی ندارد' },
        detail: {
          en: 'Golden holders are exempt from the 180-day rule; the permit is void only if it expires while you are outside the UAE.',
          fa: 'دارندگان اقامت طلایی از قانون ۱۸۰ روز معاف‌اند؛ اقامت فقط وقتی باطل می‌شود که در خارج از امارات منقضی شود.',
        },
        source: GDRFAD_INVESTOR,
      },
      NOT_CITIZENSHIP,
    ],
    timeline: TIMELINE_UAE,
    quiz: [
      {
        key: 'minimum',
        q: { en: 'What is the minimum qualifying investment?', fa: 'حداقل سرمایه‌گذاری چقدر است؟' },
        options: [
          { en: 'AED 1 million', fa: '۱ میلیون درهم' },
          { en: 'AED 2 million', fa: '۲ میلیون درهم' },
          { en: 'AED 5 million', fa: '۵ میلیون درهم' },
        ],
        answer: 1,
        why: { en: 'ICP sets AED 2,000,000 for each investment option.', fa: 'ICP برای هر گزینه‌ی سرمایه‌گذاری ۲٬۰۰۰٬۰۰۰ درهم تعیین کرده است.' },
      },
      {
        key: 'frozen',
        q: { en: 'In Dubai, how long is a deposit frozen at least?', fa: 'در دبی سپرده دست‌کم چه مدت مسدود می‌شود؟' },
        options: [
          { en: 'Six months', fa: 'شش ماه' },
          { en: 'Two years', fa: 'دو سال' },
          { en: 'It is not frozen', fa: 'مسدود نمی‌شود' },
        ],
        answer: 1,
        why: { en: 'GDRFA Dubai requires a bank certificate showing at least two years frozen.', fa: 'GDRFA دبی گواهی بانکی مسدود بودن دست‌کم دوساله می‌خواهد.' },
      },
      {
        key: 'borrowed',
        q: { en: 'Can the qualifying capital be borrowed?', fa: 'آیا سرمایه می‌تواند وام باشد؟' },
        options: [
          { en: 'Yes, from any bank', fa: 'بله، از هر بانکی' },
          { en: 'No, except property financed by an approved local bank', fa: 'خیر، مگر ملکی که با وام بانک محلی معتبر خریده شده' },
          { en: 'Yes, up to half', fa: 'بله، تا نصف آن' },
        ],
        answer: 1,
        why: { en: 'ICP requires fully owned capital; only approved bank financing of property is allowed.', fa: 'ICP سرمایه‌ی کاملاً شخصی می‌خواهد و فقط وام ملکی بانک معتبر را می‌پذیرد.' },
      },
      {
        key: 'tax',
        q: { en: 'How much yearly federal tax qualifies a company owner?', fa: 'پرداخت سالانه‌ی چه مقدار مالیات فدرال صاحب شرکت را واجد شرایط می‌کند؟' },
        options: [
          { en: 'AED 100,000', fa: '۱۰۰٬۰۰۰ درهم' },
          { en: 'AED 250,000', fa: '۲۵۰٬۰۰۰ درهم' },
          { en: 'AED 1,000,000', fa: '۱٬۰۰۰٬۰۰۰ درهم' },
        ],
        answer: 1,
        why: { en: 'ICP and GDRFA Dubai both set AED 250,000 a year.', fa: 'ICP و GDRFA دبی هر دو ۲۵۰٬۰۰۰ درهم در سال تعیین کرده‌اند.' },
      },
      {
        key: 'speed',
        q: { en: 'How long does GDRFA Dubai expect to take?', fa: 'GDRFA دبی چند روزه پاسخ می‌دهد؟' },
        options: [
          { en: '48 hours', fa: '۴۸ ساعت' },
          { en: '5 days', fa: '۵ روز' },
          { en: '3 months', fa: '۳ ماه' },
        ],
        answer: 1,
        why: { en: 'The GDRFA Dubai investor service lists 5 days.', fa: 'خدمت سرمایه‌گذار GDRFA دبی ۵ روز اعلام کرده است.' },
      },
    ],
    media: [],
  },

  // ───────────────────────── Golden: entrepreneur ─────────────────────────
  'ae-golden-entrepreneur': {
    funds: dubaiFees(1100, GDRFAD_ENTREPRENEUR),
    steps: [
      {
        key: 'path',
        title: { en: 'Pick your path', fa: 'مسیرتان را انتخاب کنید' },
        detail: {
          en: 'One is enough: a UAE-registered SME in an approved field with AED 1 million yearly revenue; a business idea approved by an accredited incubator, the Ministry of Economy or a local authority; or past ventures sold for AED 7 million in total.',
          fa: 'یکی کافی است: شرکت کوچک یا متوسط ثبت‌شده در امارات در حوزه‌ی مجاز با درآمد سالانه‌ی ۱ میلیون درهم؛ ایده‌ی تجاری تأییدشده از سوی مرکز رشد معتبر، وزارت اقتصاد یا نهاد محلی؛ یا فروش کسب‌وکارهای قبلی در مجموع به ۷ میلیون درهم.',
        },
        link: ICP_GOLDEN,
      },
      {
        key: 'nomination',
        title: { en: 'In Dubai, get nominated', fa: 'در دبی معرفی‌نامه بگیرید' },
        detail: {
          en: 'Dubai requires a nomination letter from Dubai Future Foundation. A nomination is not an approval.',
          fa: 'دبی معرفی‌نامه‌ی بنیاد آینده‌ی دبی (Dubai Future Foundation) را می‌خواهد. معرفی‌نامه به معنای تأیید نیست.',
        },
        link: GDRFAD_ENTREPRENEUR,
      },
      {
        key: 'insurance',
        title: { en: 'Get health insurance', fa: 'بیمه‌ی درمانی بگیرید' },
        detail: { en: 'For you and your family.', fa: 'برای خود و خانواده.' },
        link: ICP_GOLDEN,
      },
      {
        key: 'apply',
        title: { en: 'Apply', fa: 'درخواست بدهید' },
        detail: {
          en: 'Online through ICP, or GDRFA Dubai (UAE Pass or an Amer centre) in Dubai.',
          fa: 'آنلاین از راه ICP، یا در دبی از GDRFA دبی (با UAE Pass یا در مرکز Amer).',
        },
        link: GDRFAD_GOLDEN_SERVICES,
      },
      {
        key: 'review',
        title: { en: 'Final review', fa: 'بررسی نهایی' },
        detail: {
          en: 'GDRFA Dubai checks every condition before approving; it expects to finish in 5 days.',
          fa: 'GDRFA دبی پیش از تأیید همه‌ی شرایط را بررسی می‌کند و انجام کار را ۵ روزه پیش‌بینی می‌کند.',
        },
        takes: { en: '5 days (GDRFA Dubai)', fa: '۵ روز (GDRFA دبی)' },
        link: GDRFAD_ENTREPRENEUR,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport copy', fa: 'کپی گذرنامه' }, stage: 'apply' },
      {
        key: 'nomination',
        label: { en: 'Nomination letter (Dubai)', fa: 'معرفی‌نامه (دبی)' },
        note: {
          en: 'GDRFA Dubai names the issuer as Dubai Future Foundation in its conditions and "Dubai Future Authority" in its document list.',
          fa: 'GDRFA دبی صادرکننده را در شرایط «بنیاد آینده‌ی دبی» و در فهرست مدارک «سازمان آینده‌ی دبی» نامیده است.',
        },
        stage: 'apply',
      },
      {
        key: 'evidence',
        label: {
          en: 'Proof of your path: audited revenue, incubator or ministry approval, or sale documents',
          fa: 'مدرک مسیرتان: درآمد حسابرسی‌شده، تأییدیه‌ی مرکز رشد یا وزارتخانه، یا اسناد فروش',
        },
        note: {
          en: 'ICP lists the conditions, not a document checklist.',
          fa: 'ICP شرایط را آورده، نه فهرست مدارک را.',
        },
        stage: 'apply',
      },
      { key: 'insurance', label: { en: 'Health insurance for you and your family', fa: 'بیمه‌ی درمانی برای خود و خانواده' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'incubator-conflict',
        kind: 'challenge',
        title: { en: 'Is incubator approval enough?', fa: 'آیا تأیید مرکز رشد کافی است؟' },
        detail: {
          en: 'ICP lists incubator or ministry approval as a path on its own. GDRFA Dubai attaches an income of AED 2 million to the incubator or Ministry of Economy project. In Dubai, expect to show that income.',
          fa: 'ICP تأیید مرکز رشد یا وزارتخانه را به‌تنهایی یک مسیر می‌داند. GDRFA دبی برای طرح مرکز رشد یا وزارت اقتصاد درآمد ۲ میلیون درهم را شرط می‌کند. در دبی آماده‌ی نشان دادن این درآمد باشید.',
        },
        source: GDRFAD_ENTREPRENEUR,
      },
      {
        key: 'nomination-myth',
        kind: 'myth',
        title: { en: '"The nomination is the visa"', fa: '«معرفی‌نامه یعنی ویزا»' },
        detail: {
          en: 'GDRFA Dubai states that a nomination does not guarantee approval; it reviews the file against every condition.',
          fa: 'GDRFA دبی می‌گوید معرفی‌نامه تضمین تأیید نیست و پرونده را با همه‌ی شرایط می‌سنجد.',
        },
        source: GDRFAD_ENTREPRENEUR,
      },
      {
        key: 'term',
        kind: 'challenge',
        title: { en: '5 or 10 years?', fa: '۵ سال یا ۱۰ سال؟' },
        detail: {
          en: 'ICP and GDRFA Dubai give 10 years; u.ae lists 5 years for entrepreneurs.',
          fa: 'ICP و GDRFA دبی ۱۰ سال می‌دهند؛ u.ae برای کارآفرینان ۵ سال نوشته است.',
        },
        source: UAE_GOLDEN,
      },
      {
        key: 'self-support',
        kind: 'tip',
        title: { en: 'Keep supporting yourself', fa: 'از پس هزینه‌هایتان برآیید' },
        detail: {
          en: 'To keep the permit you must support yourself and your family without government help.',
          fa: 'برای حفظ اقامت باید بدون کمک دولت هزینه‌ی خود و خانواده را تأمین کنید.',
        },
        source: GDRFAD_ENTREPRENEUR,
      },
      NOT_CITIZENSHIP,
    ],
    timeline: TIMELINE_UAE,
    quiz: [
      {
        key: 'revenue',
        q: { en: 'What yearly SME revenue qualifies?', fa: 'درآمد سالانه‌ی شرکت باید دست‌کم چقدر باشد؟' },
        options: [
          { en: 'AED 500,000', fa: '۵۰۰٬۰۰۰ درهم' },
          { en: 'AED 1,000,000', fa: '۱٬۰۰۰٬۰۰۰ درهم' },
          { en: 'AED 2,000,000', fa: '۲٬۰۰۰٬۰۰۰ درهم' },
        ],
        answer: 1,
        why: { en: 'ICP sets at least AED 1,000,000 in annual revenue.', fa: 'ICP دست‌کم ۱٬۰۰۰٬۰۰۰ درهم درآمد سالانه تعیین کرده است.' },
      },
      {
        key: 'exit',
        q: { en: 'What total value of sold ventures qualifies?', fa: 'ارزش مجموع کسب‌وکارهای فروخته‌شده باید چقدر باشد؟' },
        options: [
          { en: 'AED 2 million', fa: '۲ میلیون درهم' },
          { en: 'AED 7 million', fa: '۷ میلیون درهم' },
          { en: 'AED 10 million', fa: '۱۰ میلیون درهم' },
        ],
        answer: 1,
        why: { en: 'ICP and GDRFA Dubai both say AED 7 million.', fa: 'ICP و GDRFA دبی هر دو ۷ میلیون درهم گفته‌اند.' },
      },
      {
        key: 'dubai-nominator',
        q: { en: 'Who nominates entrepreneurs in Dubai?', fa: 'در دبی چه نهادی کارآفرین را معرفی می‌کند؟' },
        options: [
          { en: 'Dubai Future Foundation', fa: 'بنیاد آینده‌ی دبی' },
          { en: 'MOHRE', fa: 'MOHRE' },
          { en: 'The Chamber of Commerce', fa: 'اتاق بازرگانی' },
        ],
        answer: 0,
        why: { en: 'GDRFA Dubai requires a Dubai Future Foundation nomination.', fa: 'GDRFA دبی معرفی‌نامه‌ی بنیاد آینده‌ی دبی را می‌خواهد.' },
      },
      {
        key: 'nomination-final',
        q: { en: 'Is the nomination the final approval?', fa: 'آیا معرفی‌نامه تأیید نهایی است؟' },
        options: [
          { en: 'Yes', fa: 'بله' },
          { en: 'No, GDRFA reviews the file', fa: 'خیر، GDRFA پرونده را بررسی می‌کند' },
        ],
        answer: 1,
        why: { en: 'GDRFA Dubai says a nomination does not guarantee approval.', fa: 'GDRFA دبی می‌گوید معرفی‌نامه تضمین تأیید نیست.' },
      },
      {
        key: 'abroad',
        q: { en: 'What happens after 180 days outside the UAE?', fa: 'بعد از ۱۸۰ روز ماندن در خارج از امارات چه می‌شود؟' },
        options: [
          { en: 'The permit is cancelled', fa: 'اقامت باطل می‌شود' },
          { en: 'Nothing; Golden holders are exempt', fa: 'هیچ؛ دارنده‌ی اقامت طلایی معاف است' },
          { en: 'A fine is due', fa: 'جریمه دارد' },
        ],
        answer: 1,
        why: { en: 'GDRFA Dubai exempts Golden holders from the 180-day rule.', fa: 'GDRFA دبی دارندگان اقامت طلایی را از قانون ۱۸۰ روز معاف کرده است.' },
      },
    ],
    media: [],
  },

  // ───────────────────────── Golden: talent ─────────────────────────
  'ae-golden-talent': {
    funds: dubaiFees(1100, GDRFAD_TALENT),
    steps: [
      {
        key: 'category',
        title: { en: 'Find your category', fa: 'دسته‌ی خود را پیدا کنید' },
        detail: {
          en: "Specialised professional (a UAE job paying AED 30,000 a month, at least a bachelor's degree, MOHRE level 1 or 2), or a nominated talent: culture and arts, innovators, athletes, digital technology, scientists.",
          fa: 'متخصص (شغل در امارات با حقوق ماهانه‌ی ۳۰٬۰۰۰ درهم، دست‌کم کارشناسی، سطح ۱ یا ۲ MOHRE)، یا استعداد معرفی‌شده: فرهنگ و هنر، نوآوران، ورزشکاران، فناوری دیجیتال، دانشمندان.',
        },
        link: ICP_GOLDEN,
      },
      {
        key: 'nomination',
        title: { en: 'Get the recommendation or nomination', fa: 'توصیه‌نامه یا معرفی‌نامه بگیرید' },
        detail: {
          en: 'From the body for your field, for example the Ministry of Culture, the Ministry of Economy, the Ministry of Sports, the Emirates Council for AI and Digital Transactions, or the Emirates Scientists Council.',
          fa: 'از نهاد مربوط به رشته‌تان؛ مثلاً وزارت فرهنگ، وزارت اقتصاد، وزارت ورزش، شورای هوش مصنوعی و معاملات دیجیتال امارات یا شورای دانشمندان امارات.',
        },
        link: GDRFAD_TALENT,
      },
      {
        key: 'insurance',
        title: { en: 'Get health insurance', fa: 'بیمه‌ی درمانی بگیرید' },
        detail: {
          en: 'Required for specialised professionals and their families.',
          fa: 'برای متخصصان و خانواده‌شان الزامی است.',
        },
        link: ICP_GOLDEN,
      },
      {
        key: 'apply',
        title: { en: 'Apply', fa: 'درخواست بدهید' },
        detail: {
          en: 'Online with UAE Pass or at an Amer centre in Dubai, or through ICP elsewhere.',
          fa: 'در دبی آنلاین با UAE Pass یا در مرکز Amer، و در امارات دیگر از راه ICP.',
        },
        takes: { en: '5 days (GDRFA Dubai)', fa: '۵ روز (GDRFA دبی)' },
        link: GDRFAD_TALENT,
      },
      {
        key: 'renew',
        title: { en: 'Renew with a fresh nomination', fa: 'با معرفی‌نامه‌ی تازه تمدید کنید' },
        detail: {
          en: 'The permit lasts 10 years; renewal goes through renewing the nomination letter.',
          fa: 'اقامت ۱۰ ساله است و تمدید آن با تمدید معرفی‌نامه انجام می‌شود.',
        },
        link: GDRFAD_TALENT,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport copy', fa: 'کپی گذرنامه' }, stage: 'apply' },
      { key: 'nomination', label: { en: 'Nomination or recommendation letter', fa: 'معرفی‌نامه یا توصیه‌نامه' }, stage: 'apply' },
      {
        key: 'portfolio',
        label: { en: 'Culture and arts: portfolio of achievements', fa: 'فرهنگ و هنر: کارنامه‌ی دستاوردها' },
        stage: 'apply',
      },
      {
        key: 'contract',
        label: { en: 'Specialists: UAE work permit and employment contract', fa: 'متخصصان: اجازه‌ی کار امارات و قرارداد کار' },
        stage: 'apply',
      },
      { key: 'degree', label: { en: "Specialists: bachelor's degree or equivalent", fa: 'متخصصان: مدرک کارشناسی یا معادل' }, stage: 'apply' },
      { key: 'insurance', label: { en: 'Health insurance', fa: 'بیمه‌ی درمانی' }, stage: 'permit' },
    ],
    realities: [
      {
        key: 'job-first',
        kind: 'challenge',
        title: { en: 'The specialist route needs a UAE job first', fa: 'مسیر متخصص اول شغل در امارات می‌خواهد' },
        detail: {
          en: 'A valid UAE work permit and employment contract are conditions, so it is a way to upgrade, not a way in.',
          fa: 'اجازه‌ی کار و قرارداد کار معتبر در امارات شرط است؛ پس این مسیر برای ارتقای اقامت است، نه برای ورود.',
        },
        source: ICP_GOLDEN,
      },
      {
        key: 'phd-myth',
        kind: 'myth',
        title: { en: '"You need a PhD"', fa: '«دکترا لازم است»' },
        detail: {
          en: "Specialised professionals need a bachelor's degree and AED 30,000 a month; PhD holders are one talent group among many.",
          fa: 'متخصص به مدرک کارشناسی و حقوق ماهانه‌ی ۳۰٬۰۰۰ درهم نیاز دارد؛ دارندگان دکترا فقط یکی از گروه‌های استعداد هستند.',
        },
        source: ICP_GOLDEN,
      },
      {
        key: 'artists',
        kind: 'tip',
        title: { en: 'Artists: five years and recent work', fa: 'هنرمندان: پنج سال سابقه و کار تازه' },
        detail: {
          en: 'A distinguished practitioner shows at least five years of experience and works published or distributed in the last three years.',
          fa: 'هنرمند شاخص باید دست‌کم پنج سال سابقه و آثار منتشرشده در سه سال اخیر داشته باشد.',
        },
        source: GDRFAD_TALENT,
      },
      NOT_CITIZENSHIP,
    ],
    timeline: TIMELINE_UAE,
    quiz: [
      {
        key: 'salary',
        q: { en: 'What monthly salary does a specialised professional need?', fa: 'متخصص به چه حقوق ماهانه‌ای نیاز دارد؟' },
        options: [
          { en: 'AED 15,000', fa: '۱۵٬۰۰۰ درهم' },
          { en: 'AED 30,000', fa: '۳۰٬۰۰۰ درهم' },
          { en: 'AED 50,000', fa: '۵۰٬۰۰۰ درهم' },
        ],
        answer: 1,
        why: { en: 'ICP sets at least AED 30,000 a month or the foreign-currency equivalent.', fa: 'ICP دست‌کم ۳۰٬۰۰۰ درهم در ماه یا معادل ارزی آن را تعیین کرده است.' },
      },
      {
        key: 'degree',
        q: { en: 'What is the minimum degree for specialists?', fa: 'حداقل مدرک برای متخصص چیست؟' },
        options: [
          { en: 'A diploma', fa: 'دیپلم' },
          { en: "A bachelor's degree", fa: 'کارشناسی' },
          { en: 'A PhD', fa: 'دکترا' },
        ],
        answer: 1,
        why: { en: "ICP requires at least a bachelor's degree or equivalent.", fa: 'ICP دست‌کم کارشناسی یا معادل آن را می‌خواهد.' },
      },
      {
        key: 'levels',
        q: { en: 'Which MOHRE occupational levels count?', fa: 'کدام سطوح شغلی MOHRE پذیرفته است؟' },
        options: [
          { en: 'Levels 1 and 2', fa: 'سطح ۱ و ۲' },
          { en: 'Levels 1 to 3', fa: 'سطح ۱ تا ۳' },
          { en: 'Any level', fa: 'هر سطحی' },
        ],
        answer: 0,
        why: { en: 'ICP names level one (executives) and level two (specialists).', fa: 'ICP سطح یک (مدیران ارشد) و سطح دو (متخصصان) را نام برده است.' },
      },
      {
        key: 'digital',
        q: { en: 'Who nominates digital technology talent in Dubai?', fa: 'در دبی چه نهادی استعدادهای فناوری دیجیتال را معرفی می‌کند؟' },
        options: [
          { en: 'Ministry of Culture', fa: 'وزارت فرهنگ' },
          { en: 'Emirates Council for AI and Digital Transactions', fa: 'شورای هوش مصنوعی و معاملات دیجیتال امارات' },
          { en: 'Dubai Sports Council', fa: 'شورای ورزش دبی' },
        ],
        answer: 1,
        why: { en: 'GDRFA Dubai asks for a nomination letter from that council.', fa: 'GDRFA دبی معرفی‌نامه‌ی همین شورا را می‌خواهد.' },
      },
      {
        key: 'validity',
        q: { en: 'How long is the talent Golden permit?', fa: 'اقامت طلایی استعداد چند ساله است؟' },
        options: [
          { en: '2 years', fa: '۲ سال' },
          { en: '5 years', fa: '۵ سال' },
          { en: '10 years', fa: '۱۰ سال' },
        ],
        answer: 2,
        why: { en: 'GDRFA Dubai and ICP give 10 years, renewable while conditions are met.', fa: 'GDRFA دبی و ICP ده سال می‌دهند که با حفظ شرایط تمدید می‌شود.' },
      },
    ],
    media: [],
  },

  // ───────────────────────── Green: freelancer ─────────────────────────
  'ae-green-freelancer': {
    funds: [
      {
        key: 'income',
        label: {
          en: 'Freelance income in each of the previous two years',
          fa: 'درآمد آزاد در هر یک از دو سال گذشته',
        },
        amount: 360000,
        currency: 'AED',
        basis: 'perYear',
        per: 'person',
        kind: 'show',
        source: ICP_GREEN,
      },
      ...dubaiFees(200, GDRFAD_FREELANCE),
    ],
    steps: [
      {
        key: 'mohre',
        title: { en: 'Get a MOHRE freelance permit', fa: 'از MOHRE مجوز کار آزاد بگیرید' },
        detail: {
          en: 'A freelance or self-employment permit from the Ministry of Human Resources and Emiratisation comes first.',
          fa: 'اول باید مجوز کار آزاد یا خوداشتغالی از وزارت منابع انسانی و اماراتی‌سازی (MOHRE) بگیرید.',
        },
        link: ICP_GREEN,
      },
      {
        key: 'evidence',
        title: { en: 'Gather proof', fa: 'مدارک را جمع کنید' },
        detail: {
          en: "Your bachelor's degree or specialised diploma, and income of at least AED 360,000 in each of the past two years (or proof of solvency for the whole stay).",
          fa: 'مدرک کارشناسی یا دیپلم تخصصی، و درآمد دست‌کم ۳۶۰٬۰۰۰ درهم در هر یک از دو سال گذشته (یا مدرک توان مالی برای کل دوره‌ی اقامت).',
        },
        link: ICP_GREEN,
      },
      {
        key: 'apply',
        title: { en: 'Apply', fa: 'درخواست بدهید' },
        detail: {
          en: 'In Dubai online with UAE Pass, at a Customer Happiness Centre or at an Amer centre; elsewhere through ICP.',
          fa: 'در دبی آنلاین با UAE Pass، در مرکز Customer Happiness یا مرکز Amer؛ در امارات دیگر از راه ICP.',
        },
        takes: { en: '48 hours (GDRFA Dubai)', fa: '۴۸ ساعت (GDRFA دبی)' },
        link: GDRFAD_FREELANCE,
      },
      {
        key: 'family',
        title: { en: 'Sponsor your family', fa: 'خانواده را تحت پوشش بگیرید' },
        detail: {
          en: 'Green holders can sponsor a spouse and children under the approved requirements.',
          fa: 'دارنده‌ی اقامت سبز می‌تواند طبق شرایط مصوب، همسر و فرزندان را تحت پوشش بگیرد.',
        },
        link: ICP_GREEN,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport valid for at least 6 months', fa: 'گذرنامه با دست‌کم ۶ ماه اعتبار' }, stage: 'apply' },
      { key: 'mohre', label: { en: 'MOHRE freelance or self-employment permit', fa: 'مجوز کار آزاد یا خوداشتغالی MOHRE' }, stage: 'apply' },
      { key: 'degree', label: { en: "Bachelor's degree, specialised diploma or equivalent", fa: 'مدرک کارشناسی، دیپلم تخصصی یا معادل' }, stage: 'apply' },
      {
        key: 'income',
        label: { en: 'Proof of income for each of the past two years, or of solvency', fa: 'مدرک درآمد هر یک از دو سال گذشته یا مدرک توان مالی' },
        stage: 'apply',
      },
    ],
    realities: [
      {
        key: 'each-year',
        kind: 'tip',
        title: { en: 'AED 360,000 is per year', fa: '۳۶۰٬۰۰۰ درهم برای هر سال است' },
        detail: {
          en: 'ICP now says the income must reach AED 360,000 in each of the previous two years, not across both combined.',
          fa: 'ICP اکنون صریحاً می‌گوید درآمد باید در هر یک از دو سال گذشته به ۳۶۰٬۰۰۰ درهم برسد، نه در جمع دو سال.',
        },
        source: ICP_GREEN,
      },
      {
        key: 'solvency',
        kind: 'tip',
        title: { en: 'Solvency can replace income in Dubai', fa: 'در دبی توان مالی می‌تواند جای درآمد را بگیرد' },
        detail: {
          en: 'GDRFA Dubai accepts proof of financial solvency throughout the stay as an alternative to the income test.',
          fa: 'GDRFA دبی مدرک توان مالی در کل دوره‌ی اقامت را به‌جای شرط درآمد می‌پذیرد.',
        },
        source: GDRFAD_FREELANCE,
      },
      {
        key: 'no-sponsor',
        kind: 'myth',
        title: { en: '"You need a UAE employer"', fa: '«کارفرمای اماراتی لازم است»' },
        detail: {
          en: 'No sponsor, employer or employment contract is needed for the Green freelance permit.',
          fa: 'برای اقامت سبز کار آزاد به اسپانسر، کارفرما یا قرارداد کار نیازی نیست.',
        },
        source: GDRFAD_FREELANCE,
      },
      {
        key: 'grace',
        kind: 'tip',
        title: { en: '180-day grace period', fa: 'مهلت ۱۸۰ روزه' },
        detail: {
          en: 'After the permit expires or is cancelled you may stay 180 days to sort things out.',
          fa: 'پس از انقضا یا لغو اقامت، ۱۸۰ روز فرصت دارید کارهایتان را سامان دهید.',
        },
        source: GDRFAD_FREELANCE,
      },
      NOT_CITIZENSHIP,
    ],
    timeline: TIMELINE_UAE,
    quiz: [
      {
        key: 'length',
        q: { en: 'How long is the Green residence?', fa: 'اقامت سبز چند ساله است؟' },
        options: [
          { en: '2 years', fa: '۲ سال' },
          { en: '5 years', fa: '۵ سال' },
          { en: '10 years', fa: '۱۰ سال' },
        ],
        answer: 1,
        why: { en: 'ICP describes a five-year renewable residence.', fa: 'ICP آن را اقامت پنج‌ساله‌ی قابل تمدید معرفی می‌کند.' },
      },
      {
        key: 'income',
        q: { en: 'What income does ICP require?', fa: 'ICP چه درآمدی می‌خواهد؟' },
        options: [
          { en: 'AED 180,000 a year', fa: 'سالانه ۱۸۰٬۰۰۰ درهم' },
          { en: 'AED 360,000 in each of the past two years', fa: '۳۶۰٬۰۰۰ درهم در هر یک از دو سال گذشته' },
          { en: 'AED 1 million in total', fa: 'در مجموع ۱ میلیون درهم' },
        ],
        answer: 1,
        why: { en: 'ICP sets at least AED 360,000 in each of the previous two years.', fa: 'ICP دست‌کم ۳۶۰٬۰۰۰ درهم در هر یک از دو سال قبل را شرط کرده است.' },
      },
      {
        key: 'permit',
        q: { en: 'Which body issues the freelance permit you need first?', fa: 'مجوز کار آزاد را کدام نهاد صادر می‌کند؟' },
        options: [
          { en: 'ICP', fa: 'ICP' },
          { en: 'MOHRE', fa: 'MOHRE' },
          { en: 'Dubai Future Foundation', fa: 'بنیاد آینده‌ی دبی' },
        ],
        answer: 1,
        why: { en: 'Both ICP and GDRFA Dubai require a MOHRE permit.', fa: 'ICP و GDRFA دبی هر دو مجوز MOHRE را شرط کرده‌اند.' },
      },
      {
        key: 'speed',
        q: { en: 'How fast does GDRFA Dubai expect to process it?', fa: 'GDRFA دبی در چه مدتی رسیدگی می‌کند؟' },
        options: [
          { en: '48 hours', fa: '۴۸ ساعت' },
          { en: '5 days', fa: '۵ روز' },
          { en: '30 days', fa: '۳۰ روز' },
        ],
        answer: 0,
        why: { en: 'The GDRFA Dubai service lists 48 hours.', fa: 'خدمت GDRFA دبی ۴۸ ساعت اعلام کرده است.' },
      },
      {
        key: 'grace',
        q: { en: 'How long can you stay after the permit ends?', fa: 'پس از پایان اقامت تا چه مدت می‌توانید بمانید؟' },
        options: [
          { en: '30 days', fa: '۳۰ روز' },
          { en: '60 days', fa: '۶۰ روز' },
          { en: '180 days', fa: '۱۸۰ روز' },
        ],
        answer: 2,
        why: { en: 'GDRFA Dubai gives a 180-day grace period.', fa: 'GDRFA دبی مهلت ۱۸۰ روزه می‌دهد.' },
      },
    ],
    media: [],
  },

  // ───────────────────────── Study ─────────────────────────
  'ae-student': {
    funds: [
      ...dubaiFees(200, GDRFAD_STUDENT),
      {
        key: 'golden-permit',
        label: { en: 'Golden student permit fee (instead of AED 200)', fa: 'هزینه‌ی اقامت طلایی دانشجویی (به‌جای ۲۰۰ درهم)' },
        amount: 1100,
        currency: 'AED',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: GDRFAD_GOLDEN_STUDENT,
      },
    ],
    steps: [
      {
        key: 'enrol',
        title: { en: 'Enrol at an accredited institution', fa: 'در مؤسسه‌ی معتبر ثبت‌نام کنید' },
        detail: {
          en: 'It must be licensed in the UAE and approved by the Ministry of Education or the emirate\'s education authority.',
          fa: 'مؤسسه باید در امارات مجوز داشته باشد و وزارت آموزش یا نهاد آموزشی امارت آن را تأیید کرده باشد.',
        },
        link: GDRFAD_STUDENT,
      },
      {
        key: 'sponsor',
        title: { en: 'Your institution sponsors you', fa: 'مؤسسه اسپانسر شما می‌شود' },
        detail: {
          en: 'The institution acts as your host and guarantor for the residence permit.',
          fa: 'مؤسسه میزبان و ضامن شما برای اقامت است.',
        },
        link: GDRFAD_STUDENT,
      },
      {
        key: 'medical',
        title: { en: 'Medical test, ID and insurance', fa: 'آزمایش پزشکی، کارت شناسایی و بیمه' },
        detail: {
          en: 'You need an approved medical examination, the Emirates ID receipt and health insurance.',
          fa: 'به معاینه‌ی پزشکی تأییدشده، رسید کارت شناسایی امارات و بیمه‌ی درمانی نیاز دارید.',
        },
        link: GDRFAD_STUDENT,
      },
      {
        key: 'apply',
        title: { en: 'Apply', fa: 'درخواست بدهید' },
        detail: {
          en: 'Online with UAE Pass, at a Customer Happiness Centre or an Amer centre.',
          fa: 'آنلاین با UAE Pass، یا در مرکز Customer Happiness یا مرکز Amer.',
        },
        takes: { en: '48 hours (GDRFA Dubai)', fa: '۴۸ ساعت (GDRFA دبی)' },
        link: GDRFAD_STUDENT,
      },
      {
        key: 'golden',
        title: { en: 'Top students: Golden permit', fa: 'دانشجویان برتر: اقامت طلایی' },
        detail: {
          en: '95% at school, or GPA 3.5 from a world top-100 university, or 3.5 / 3.8 from a UAE Category A / B university, within two years of graduating. Needs Ministry attestation and ICP approval.',
          fa: 'معدل ۹۵ درصد در دبیرستان، یا معدل ۳٫۵ از دانشگاهی در میان ۱۰۰ دانشگاه برتر جهان، یا ۳٫۵ / ۳٫۸ از دانشگاه رده‌ی A / B امارات، تا دو سال پس از فارغ‌التحصیلی. تأیید وزارت آموزش و موافقت ICP لازم است.',
        },
        takes: { en: '5 days (GDRFA Dubai)', fa: '۵ روز (GDRFA دبی)' },
        link: GDRFAD_GOLDEN_STUDENT,
      },
    ],
    documents: [
      { key: 'photo', label: { en: 'Recent colour photo, white background', fa: 'عکس رنگی جدید با زمینه‌ی سفید' }, stage: 'permit' },
      { key: 'passport', label: { en: 'Passport copy', fa: 'کپی گذرنامه' }, stage: 'permit' },
      { key: 'medical', label: { en: 'Approved medical examination', fa: 'معاینه‌ی پزشکی تأییدشده' }, stage: 'permit' },
      { key: 'id-receipt', label: { en: 'Emirates ID application receipt', fa: 'رسید درخواست کارت شناسایی امارات' }, stage: 'permit' },
      { key: 'insurance', label: { en: 'Health insurance', fa: 'بیمه‌ی درمانی' }, stage: 'permit' },
      {
        key: 'golden-docs',
        label: { en: 'Golden: attested certificate and ICP approval', fa: 'طلایی: مدرک تأییدشده و موافقت ICP' },
        stage: 'apply',
      },
    ],
    realities: [
      {
        key: 'no-renewal',
        kind: 'challenge',
        title: { en: 'Golden student permits are one-off', fa: 'اقامت طلایی دانشجویی یک‌بار است' },
        detail: {
          en: 'GDRFA Dubai says the student Golden permit runs 10 years and is not renewed after it expires.',
          fa: 'GDRFA دبی می‌گوید اقامت طلایی دانشجویی ۱۰ ساله است و پس از انقضا تمدید نمی‌شود.',
        },
        source: GDRFAD_GOLDEN_STUDENT,
      },
      {
        key: 'term',
        kind: 'challenge',
        title: { en: '5 or 10 years for school leavers?', fa: 'دانش‌آموزان برتر: ۵ سال یا ۱۰ سال؟' },
        detail: {
          en: 'u.ae lists 5 years for high-school achievers and 10 for top university students; GDRFA Dubai says 10 years for all three groups.',
          fa: 'u.ae برای دانش‌آموزان برتر دبیرستان ۵ سال و برای دانشجویان برتر ۱۰ سال نوشته؛ GDRFA دبی برای هر سه گروه ۱۰ سال می‌گوید.',
        },
        source: UAE_GOLDEN,
      },
      {
        key: 'top100',
        kind: 'myth',
        title: { en: '"Good grades are enough"', fa: '«نمره‌ی خوب کافی است»' },
        detail: {
          en: 'Abroad, the university must rank in the world top 100 on the list the Ministry of Education accepts, and you must apply within two years of graduating.',
          fa: 'اگر در خارج درس خوانده‌اید، دانشگاه باید در فهرست مورد قبول وزارت آموزش جزو ۱۰۰ دانشگاه برتر جهان باشد و تا دو سال پس از فارغ‌التحصیلی درخواست بدهید.',
        },
        source: GDRFAD_GOLDEN_STUDENT,
      },
      {
        key: 'grace',
        kind: 'tip',
        title: { en: '60-day grace period', fa: 'مهلت ۶۰ روزه' },
        detail: {
          en: 'After a standard student permit expires or is cancelled you have 60 days to leave or change status.',
          fa: 'پس از انقضا یا لغو اقامت دانشجویی عادی، ۶۰ روز فرصت دارید خارج شوید یا وضعیت‌تان را تغییر دهید.',
        },
        source: GDRFAD_STUDENT,
      },
    ],
    timeline: TIMELINE_UAE,
    quiz: [
      {
        key: 'sponsor',
        q: { en: 'Who sponsors a standard student permit?', fa: 'اسپانسر اقامت دانشجویی عادی کیست؟' },
        options: [
          { en: 'A parent', fa: 'والدین' },
          { en: 'The educational institution', fa: 'مؤسسه‌ی آموزشی' },
          { en: 'MOHRE', fa: 'MOHRE' },
        ],
        answer: 1,
        why: { en: 'GDRFA Dubai names the institution as host and guarantor.', fa: 'GDRFA دبی مؤسسه را میزبان و ضامن دانشجو می‌داند.' },
      },
      {
        key: 'speed',
        q: { en: 'How long does GDRFA Dubai take for a student permit?', fa: 'GDRFA دبی برای اقامت دانشجویی چقدر وقت می‌گذارد؟' },
        options: [
          { en: '48 hours', fa: '۴۸ ساعت' },
          { en: '5 days', fa: '۵ روز' },
          { en: '2 weeks', fa: '۲ هفته' },
        ],
        answer: 0,
        why: { en: 'The GDRFA Dubai service lists 48 hours.', fa: 'خدمت GDRFA دبی ۴۸ ساعت اعلام کرده است.' },
      },
      {
        key: 'school',
        q: { en: 'What school result qualifies for the Golden route?', fa: 'برای مسیر طلایی چه معدل دبیرستانی لازم است؟' },
        options: [
          { en: '85%', fa: '۸۵ درصد' },
          { en: '90%', fa: '۹۰ درصد' },
          { en: '95%', fa: '۹۵ درصد' },
        ],
        answer: 2,
        why: { en: 'ICP and GDRFA Dubai both set at least 95%.', fa: 'ICP و GDRFA دبی هر دو دست‌کم ۹۵ درصد را شرط کرده‌اند.' },
      },
      {
        key: 'abroad-grad',
        q: { en: 'What must a graduate from abroad show?', fa: 'فارغ‌التحصیل دانشگاه خارجی چه باید نشان دهد؟' },
        options: [
          { en: 'Any degree and a job offer', fa: 'هر مدرکی با پیشنهاد کار' },
          { en: 'A top-100 university and GPA of at least 3.5', fa: 'دانشگاهی در میان ۱۰۰ برتر و معدل دست‌کم ۳٫۵' },
          { en: 'A master\'s degree', fa: 'مدرک کارشناسی ارشد' },
        ],
        answer: 1,
        why: { en: 'ICP requires a world top-100 university and a GPA of at least 3.5.', fa: 'ICP دانشگاهی در میان ۱۰۰ دانشگاه برتر جهان و معدل دست‌کم ۳٫۵ می‌خواهد.' },
      },
      {
        key: 'grace',
        q: { en: 'What grace period follows a standard student permit?', fa: 'پس از اقامت دانشجویی عادی چه مهلتی دارید؟' },
        options: [
          { en: '30 days', fa: '۳۰ روز' },
          { en: '60 days', fa: '۶۰ روز' },
          { en: '180 days', fa: '۱۸۰ روز' },
        ],
        answer: 1,
        why: { en: 'GDRFA Dubai gives 60 days after expiry or cancellation.', fa: 'GDRFA دبی پس از انقضا یا لغو ۶۰ روز مهلت می‌دهد.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_AE: CountryProfile = {
  strengths: [
    {
      en: 'Long residences without a sponsor: Golden (10 years for most groups) and Green (5 years), with family sponsorship.',
      fa: 'اقامت‌های بلندمدت بدون اسپانسر: طلایی (برای بیشتر گروه‌ها ۱۰ ساله) و سبز (۵ ساله)، با امکان آوردن خانواده.',
    },
    {
      en: 'Fast decisions: 48 hours to 5 days at GDRFA Dubai.',
      fa: 'پاسخ سریع: ۴۸ ساعت تا ۵ روز در GDRFA دبی.',
    },
    {
      en: 'A strong passport and high development: 2nd in the Henley Passport Index 2026 and 15th of 193 in the UNDP Human Development Index.',
      fa: 'گذرنامه‌ی قوی و توسعه‌ی بالا: رتبه‌ی ۲ در شاخص گذرنامه‌ی هنلی ۲۰۲۶ و رتبه‌ی ۱۵ از ۱۹۳ در شاخص توسعه‌ی انسانی UNDP.',
    },
    {
      en: 'Low unemployment, about 2.2% (2025), and 25th of 139 in the Global Innovation Index 2026.',
      fa: 'بیکاری پایین، حدود ۲٫۲ درصد (۲۰۲۵)، و رتبه‌ی ۲۵ از ۱۳۹ در شاخص جهانی نوآوری ۲۰۲۶.',
    },
  ],
  weaknesses: [
    {
      en: 'No permanent residence, and no time-based path to citizenship: it is by nomination only.',
      fa: 'اقامت دائم وجود ندارد و تابعیت با گذشت زمان به دست نمی‌آید؛ فقط با معرفی.',
    },
    {
      en: 'Residence lasts only while you keep the conditions (the investment, the salary, the income).',
      fa: 'اقامت تا وقتی برقرار است که شرایط (سرمایه، حقوق یا درآمد) را حفظ کنید.',
    },
    {
      en: 'Official sources disagree on terms (5 vs 10 years) and on the incubator route; ICP, GDRFA Dubai and u.ae must be read side by side.',
      fa: 'منابع رسمی درباره‌ی مدت (۵ یا ۱۰ سال) و مسیر مرکز رشد با هم اختلاف دارند؛ باید ICP، GDRFA دبی و u.ae را کنار هم خواند.',
    },
    {
      en: 'High thresholds for founders: AED 1 million revenue or AED 2 million invested.',
      fa: 'آستانه‌های بالا برای بنیان‌گذاران: ۱ میلیون درهم درآمد یا ۲ میلیون درهم سرمایه.',
    },
  ],
  indicators: [
    {
      key: 'hdi',
      rank: 15,
      of: 193,
      value: 0.94,
      year: 2023,
      source: {
        url: 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Table.xlsx',
        checked: CHECKED,
        label: 'UNDP Human Development Report 2025, statistical annex table 1 (2023 data)',
      },
    },
    {
      key: 'happiness',
      rank: 21,
      value: 6.821,
      year: 2025,
      source: {
        url: 'https://data.worldhappiness.report/country/ARE',
        checked: CHECKED,
        label: 'World Happiness Report dashboard, current rank (life evaluation 6.821)',
      },
    },
    {
      key: 'peace',
      rank: 73,
      of: 163,
      value: 1.927,
      year: 2026,
      source: { url: 'https://www.visionofhumanity.org/maps/', checked: CHECKED, label: 'Global Peace Index 2026 (lower score = more peaceful)' },
    },
    {
      key: 'gdp-per-capita',
      value: 50274,
      unit: 'USD',
      year: 2024,
      source: {
        url: 'https://api.worldbank.org/v2/country/ARE/indicator/NY.GDP.PCAP.CD?format=json&mrnev=1',
        checked: CHECKED,
        label: 'World Bank, GDP per capita (current US$)',
      },
    },
    {
      key: 'unemployment',
      value: 2.2,
      unit: '%',
      year: 2025,
      source: {
        url: 'https://api.worldbank.org/v2/country/ARE/indicator/SL.UEM.TOTL.ZS?format=json&mrnev=1',
        checked: CHECKED,
        label: 'World Bank, unemployment, modeled ILO estimate (2.174%)',
      },
    },
    {
      key: 'innovation',
      rank: 25,
      of: 139,
      year: 2026,
      source: { url: 'https://www.wipo.int/gii-ranking/en/united-arab-emirates', checked: CHECKED, label: 'WIPO Global Innovation Index 2026' },
    },
    {
      key: 'passport',
      rank: 2,
      value: 188,
      unit: 'destinations',
      year: 2026,
      source: { url: 'https://www.henleyglobal.com/passport-index/ranking', checked: CHECKED, label: 'Henley Passport Index 2026' },
    },
  ],
};
