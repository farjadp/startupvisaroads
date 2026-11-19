// ============================================================================
// content/partners.ts
// Copy for the B2B partner page, /en/partners and /fa/partners.
//
// Who reads it: immigration practitioners with entrepreneur clients. In
// English that is RCICs and immigration lawyers (the 18 Nov 2026 partner
// email lands here). In Persian it is Persian-speaking RCICs, lawyers and
// immigration agencies, wherever they practise. The Persian copy is written
// for that reader, not translated from the English.
//
// Rules this file follows (see the memory notes behind them):
//   - No VisaRoads price, total or range. Instalment structure only.
//   - Every immigration fact carries the official page it came from.
//   - VisaRoads is not an immigration representative, gives no immigration
//     advice and files nothing. The partner keeps the client and the file.
//   - No invented logos, testimonials, partner counts or success rates.
//   - "VisaRoads Inc." is one word and "an Ashavid company".
// ============================================================================

import { MAIN_CONTACT } from '@/content/contact';
import { SUV_SOURCES } from '@/lib/canada-suv';

export type PartnerLocale = 'en' | 'fa';

/**
 * The partner booking schedule (Google Calendar appointment schedule), as
 * Farjad gave it on 19 Nov 2026. `?gv=true` is the embeddable view; the same
 * URL without it is the full-page booking view, used as the new-tab fallback.
 */
export const PARTNER_BOOKING_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1QOiZA7wlubfysDMP7SW2Fg55EyKABjCW_5RBgGAcAffeq-bKw1yNs5-zMtcbZiecoF0MQlqrK';

export const PARTNER_BOOKING_EMBED_URL = `${PARTNER_BOOKING_URL}?gv=true`;

/** Height of the booking frame and of its placeholder, so loading it shifts nothing. */
export const BOOKING_FRAME_HEIGHT = 600;

export interface PartnerRoute {
  key: 'nl' | 'fi' | 'dk' | 'be';
  name: string;
  permit: string;
  /** What the evaluating body checks first: the reason a partner needs a plan written to it. */
  gate: string;
  sourceLabel: string;
  sourceUrl: string;
  /** The site's own guide for the route, locale-relative. */
  href: string;
  image: string;
  imageAlt: string;
}

export interface PartnerStep {
  /** Whose desk the step sits on; drives the two-lane diagram. */
  lane: 'partner' | 'us' | 'both';
  title: string;
  body: string;
}

export interface PartnerPerson {
  name: string;
  role: string;
  line: string;
}

export interface PartnerCopy {
  eyebrow: string;
  h1a: string;
  h1b: string;
  lede: string;
  ctaBook: string;
  ctaHow: string;
  heroImageAlt: string;
  keep: { title: string; items: string[] };
  build: { title: string; items: string[] };
  booking: {
    label: string;
    title: string;
    note: string;
    open: string;
    newTab: string;
    fallback: string;
    email: string;
    telegram: string;
    frameTitle: string;
  };
  handoff: { title: string; intro: string; partnerLane: string; usLane: string; steps: PartnerStep[] };
  routes: {
    title: string;
    intro: string;
    items: PartnerRoute[];
    guide: string;
    source: string;
    canada: { text: string; sourceLabel: string; sourceUrl: string };
  };
  scope: { title: string; do: { title: string; items: string[] }; dont: { title: string; items: string[] } };
  who: { title: string; body: string; people: PartnerPerson[]; teamLink: string; entity: string };
  /** Formal line under the scope lists (legal review, 19 Nov 2026). */
  disclaimer: string;
  faq: { title: string; items: { q: string; a: string }[] };
  final: { title: string; body: string };
  sticky: string;
}

const SOURCES = {
  nl: 'https://ind.nl/en/residence-permits/work/start-up',
  fi: 'https://migri.fi/en/start-up-entrepreneur',
  dk: 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark',
  be: 'https://www.vlaanderen.be/en/working-enterprise-and-investment/working/professional-card-for-foreign-entrepreneurs',
} as const;

const en: PartnerCopy = {
  eyebrow: 'Partner programme for RCICs and immigration lawyers',
  h1a: 'Your entrepreneur client.',
  h1b: 'Our business plan.',
  lede:
    'You keep the client and the legal file. We build the startup side of the case: the startup assessment, business plan, financial model, pitch deck and founder mentorship, for startup routes in the Netherlands, Finland, Denmark and Flanders.',
  ctaBook: 'Book a 20-minute partner call',
  ctaHow: 'How it works',
  heroImageAlt: 'Two empty chairs facing each other across an oak table by a window, set for a working meeting',
  keep: {
    title: 'You keep',
    items: ['The client relationship', 'The legal file and every filing', 'Immigration advice and strategy'],
  },
  build: {
    title: 'We build',
    items: ['Startup assessment and business plan', 'Financial model and pitch deck', 'Founder preparation for the evaluation'],
  },
  booking: {
    label: 'Partner call',
    title: 'Pick a time with Farjad',
    note: 'The calendar is Google’s. It loads only when you open it, so Google sets nothing before you ask.',
    open: 'Open the calendar',
    newTab: 'Open the booking page in a new tab',
    fallback: 'Calendar blocked by your browser or network? Write to us instead:',
    email: 'Email',
    telegram: 'Telegram',
    frameTitle: 'Book a partner call with VisaRoads (Google Calendar)',
  },
  handoff: {
    title: 'How the collaboration works',
    intro: 'Two desks, one file. Each step sits on one of them, and the legal side never leaves yours.',
    partnerLane: 'Your desk',
    usLane: 'VisaRoads',
    steps: [
      { lane: 'both', title: 'Intro call', body: '20 minutes on the client profile and the route you have in mind.' },
      { lane: 'partner', title: 'You introduce the founder', body: 'With the client’s consent, you connect us. We collect only what the business documents need, under our privacy policy. The client stays yours.' },
      { lane: 'us', title: 'Startup assessment', body: 'We test the idea and the team. If it will not carry a plan, we say so before anything is built.' },
      { lane: 'us', title: 'We build', body: 'Plan, model and deck written to what the evaluating body checks, and the founder prepared for it.' },
      { lane: 'partner', title: 'You file', body: 'The documents come back to you. You file, and you keep the case to the end.' },
    ],
  },
  routes: {
    title: 'Routes we prepare files for',
    intro: 'Each of these routes has a gate before the residence permit, and that gate reads the business case.',
    guide: 'Read our guide',
    source: 'Official source',
    items: [
      {
        key: 'nl', name: 'Netherlands', permit: 'Start-up residence permit',
        gate: 'Needs a signed contract with a qualifying facilitator and positive advice from RVO on the business plan. The permit lasts 1 year.',
        sourceLabel: 'ind.nl', sourceUrl: SOURCES.nl, href: '/europe/netherlands', image: '/fa/img/netherlands.webp',
        imageAlt: 'An Amsterdam canal on a sunny day: narrow brick houses with stepped gables, moored boats and bicycles on a bridge',
      },
      {
        key: 'fi', name: 'Finland', permit: 'Startup permit',
        gate: 'Business Finland must first give the business a positive assessment (the Eligibility Statement) before Migri takes the application.',
        sourceLabel: 'migri.fi', sourceUrl: SOURCES.fi, href: '/country/finland', image: '/fa/img/finland.webp',
        imageAlt: 'Helsinki Cathedral: a white neoclassical church with a green dome above stone steps under a clear sky',
      },
      {
        key: 'dk', name: 'Denmark', permit: 'Start-up Denmark',
        gate: 'A panel of experts must approve the business idea before SIRI will take the residence application.',
        sourceLabel: 'nyidanmark.dk', sourceUrl: SOURCES.dk, href: '/country/denmark', image: '/fa/img/denmark.webp',
        imageAlt: 'Nyhavn in Copenhagen: coloured historic houses with red tiled roofs along a canal, wooden boats and café umbrellas',
      },
      {
        key: 'be', name: 'Flanders, Belgium', permit: 'Innovation & Startup Permit',
        gate: 'A fast-track professional card. The file needs a signed letter from a Flemish innovator, incubator or knowledge institution.',
        sourceLabel: 'vlaanderen.be', sourceUrl: SOURCES.be, href: '/europe/belgium', image: '/fa/img/belgium.webp',
        imageAlt: 'The Antwerp skyline on a sunny day, with the cathedral tower rising above the houses along the Scheldt',
      },
    ],
    canada: {
      text: 'Canada’s Start-up Visa was paused on 30 June 2026 and takes no new applications, so we take no new Start-up Visa files. For founders who need a road Canada cannot offer right now, these four are the ones we work on.',
      sourceLabel: 'canada.ca',
      sourceUrl: SUV_SOURCES.program,
    },
  },
  scope: {
    title: 'What we do, and what we do not',
    do: {
      title: 'We do',
      items: [
        'Assess the startup idea, the team and the fit with the route you chose',
        'Write the business plan, financial model and pitch deck',
        'Mentor the founder and prepare them for the evaluating body',
        'Deliver every finished document to you; we submit nothing ourselves',
      ],
    },
    dont: {
      title: 'We do not',
      items: [
        'Act as an immigration representative, or hold ourselves out as one',
        'Give immigration advice to your client',
        'File anything with any government, embassy or evaluating body',
        'Discuss immigration matters with your client; every such question goes back to you',
      ],
    },
  },
  disclaimer:
    'VisaRoads Inc. is not a licensed immigration consultant or lawyer, is not authorized to represent anyone under section 91 of the Immigration and Refugee Protection Act, gives no immigration advice and guarantees no immigration outcome.',
  who: {
    title: 'Who is behind it',
    body: 'VisaRoads Inc. is an Ontario company and an Ashavid company. The partner programme is run by the people below; the full team is on the team page.',
    people: [
      { name: 'Farjad Pourmohammad', role: 'Founder, startup mentor', line: 'Takes the intro calls and leads the startup assessment.' },
      { name: 'Mohsen', role: 'COO and account manager', line: 'Your day-to-day contact once a file is open.' },
      { name: 'Hamid', role: 'Partnership management, startup mentor', line: 'Looks after the partner relationship.' },
    ],
    teamLink: 'Meet the team',
    entity: 'VisaRoads Inc., an Ashavid company. Based in Ontario, Canada.',
  },
  faq: {
    title: 'Questions partners ask',
    items: [
      {
        q: 'Do you give immigration advice or represent clients?',
        a: 'No. VisaRoads is not an immigration representative, gives no immigration advice and files nothing with any government. Immigration advice, the legal file and every filing stay with you. Any immigration question the founder raises with us goes back to you.',
      },
      {
        q: 'Who owns the client relationship?',
        a: 'You do. We work with the founder on the business side of the case, with your knowledge, and the finished documents come back to you.',
      },
      {
        q: 'Which documents do you prepare?',
        a: 'A startup assessment, the business plan, a financial model and a pitch deck, written to what the evaluating body for the route checks, plus mentoring sessions that prepare the founder for that evaluation.',
      },
      {
        q: 'Which routes do you work on?',
        a: 'The Netherlands start-up residence permit, Finland’s startup permit, Start-up Denmark and the Flemish Innovation & Startup Permit in Belgium. Canada’s Start-up Visa has been paused since 30 June 2026, so we take no new files for it.',
      },
      {
        q: 'What if the founder’s idea is not strong enough?',
        a: 'We say so after the assessment and before any document is written. We would rather turn a file down than build a plan we do not believe in.',
      },
      {
        q: 'How are fees handled?',
        a: 'We do not publish prices. Each file has its own written contract, and payment follows three instalments: on signing, when the evaluating body approves, and when the residence permit is issued.',
      },
      {
        q: 'What can I do if Google Calendar will not load?',
        a: `Open the booking page in a new tab, or write to ${MAIN_CONTACT.b2bEmail} or ${MAIN_CONTACT.telegramHandle} on Telegram, and we will find a time with you.`,
      },
    ],
  },
  final: {
    title: 'Have a founder in mind?',
    body: 'Twenty minutes is enough to see whether one of these routes fits your client and how we would work together.',
  },
  sticky: 'Book a partner call',
};

const fa: PartnerCopy = {
  eyebrow: 'همکاری با مشاوران رسمی، وکلا و مؤسسات مهاجرت',
  h1a: 'پرونده‌ی حقوقی با شما،',
  h1b: 'بخش استارتاپی با ما.',
  lede:
    'موکل و پرونده‌ی حقوقی دست خودتان می‌ماند. ما بخش استارتاپی پرونده را می‌سازیم: ارزیابی ایده، بیزینس‌پلن، مدل مالی، پیچ‌دک و منتورشیپ بنیان‌گذار، برای مسیرهای استارتاپی هلند، فنلاند، دانمارک و فلاندرِ بلژیک.',
  ctaBook: 'رزرو تماس ۲۰ دقیقه‌ای همکاری',
  ctaHow: 'همکاری چطور پیش می‌رود',
  heroImageAlt: 'دو صندلی روبه‌روی هم کنار میز بلوط و پنجره، آماده‌ی یک جلسه‌ی کاری',
  keep: {
    title: 'سهم شما',
    items: ['ارتباط با موکل', 'پرونده‌ی حقوقی و ثبت درخواست‌ها', 'مشاوره‌ی مهاجرتی و انتخاب مسیر'],
  },
  build: {
    title: 'سهم ما',
    items: ['ارزیابی استارتاپ و بیزینس‌پلن', 'مدل مالی و پیچ‌دک', 'آماده‌کردن بنیان‌گذار برای ارزیابی'],
  },
  booking: {
    label: 'تماس همکاری',
    title: 'زمان گفت‌وگو با فرجاد را انتخاب کنید',
    note: 'این تقویم مال گوگل است و فقط وقتی بازش کنید بارگذاری می‌شود؛ پیش از آن گوگل چیزی در مرورگرتان ذخیره نمی‌کند.',
    open: 'باز کردن تقویم',
    newTab: 'صفحه‌ی رزرو را در زبانه‌ی تازه باز کنید',
    fallback: 'مرورگر یا شبکه‌تان تقویم گوگل را باز نمی‌کند؟ از این راه‌ها پیام بدهید:',
    email: 'ایمیل',
    telegram: 'تلگرام',
    frameTitle: 'رزرو تماس همکاری با ویزارودز (تقویم گوگل)',
  },
  handoff: {
    title: 'همکاری قدم‌به‌قدم',
    intro: 'دو میز کار و یک پرونده. هر قدم روی یکی از این دو میز است و بخش حقوقی هیچ‌وقت از میز شما بیرون نمی‌رود.',
    partnerLane: 'میز شما',
    usLane: 'ویزارودز',
    steps: [
      { lane: 'both', title: 'تماس آشنایی', body: '۲۰ دقیقه درباره‌ی پروفایل موکل و مسیری که در نظر دارید.' },
      { lane: 'partner', title: 'معرفی بنیان‌گذار', body: 'با رضایت موکل، او را به ما معرفی می‌کنید. ما طبق سیاست حریم خصوصی فقط اطلاعاتی را می‌گیریم که اسناد کسب‌وکار لازم دارد. موکل همچنان موکل شماست.' },
      { lane: 'us', title: 'ارزیابی استارتاپ', body: 'ایده و تیم را می‌سنجیم. اگر بار یک بیزینس‌پلن را نکشد، پیش از نوشتن هر سندی صریح می‌گوییم.' },
      { lane: 'us', title: 'ساخت اسناد', body: 'پلن، مدل مالی و پیچ‌دک مطابق معیارهای نهاد ارزیاب نوشته می‌شود و بنیان‌گذار برای ارزیابی آماده می‌شود. جلسه‌های منتورشیپ به فارسی است و اسناد به انگلیسی، مگر مسیر زبان دیگری بخواهد.' },
      { lane: 'partner', title: 'ثبت با شما', body: 'اسناد به شما تحویل می‌شود. ثبت درخواست و پیگیری پرونده تا آخر با شماست.' },
    ],
  },
  routes: {
    title: 'مسیرهایی که برایشان پرونده آماده می‌کنیم',
    intro: 'در هر چهار مسیر، پیش از اجازه‌ی اقامت یک مرحله‌ی ارزیابی هست و آن مرحله بیزینس‌پلن را می‌خواند.',
    guide: 'راهنمای کامل',
    source: 'منبع رسمی',
    items: [
      {
        key: 'nl', name: 'هلند', permit: 'اقامت استارتاپ',
        gate: 'قرارداد امضاشده با یک تسهیل‌گر واجد شرایط و نظر مثبت RVO درباره‌ی طرح کسب‌وکار لازم است. این اقامت ۱ ساله است.',
        sourceLabel: 'ind.nl', sourceUrl: SOURCES.nl, href: '/europe/netherlands', image: '/fa/img/netherlands.webp',
        imageAlt: 'کانال آمستردام در روزی آفتابی: خانه‌های باریک آجری با نمای پلکانی، قایق‌های پارک‌شده و دوچرخه‌ها روی پل',
      },
      {
        key: 'fi', name: 'فنلاند', permit: 'اقامت استارتاپ',
        gate: 'پیش از درخواست اقامت از Migri، باید Business Finland نظر مثبت خود (Eligibility Statement) را درباره‌ی کسب‌وکار صادر کند.',
        sourceLabel: 'migri.fi', sourceUrl: SOURCES.fi, href: '/europe/finland', image: '/fa/img/finland.webp',
        imageAlt: 'کلیسای جامع هلسینکی: بنای نئوکلاسیک سفید با گنبد سبز و ستون‌های بلند، بر فراز پله‌های سنگی، زیر آسمان صاف',
      },
      {
        key: 'dk', name: 'دانمارک', permit: 'استارتاپ دانمارک',
        gate: 'پیش از آنکه SIRI درخواست اقامت را بپذیرد، یک پنل کارشناسی باید ایده‌ی کسب‌وکار را تأیید کند.',
        sourceLabel: 'nyidanmark.dk', sourceUrl: SOURCES.dk, href: '/europe/denmark', image: '/fa/img/denmark.webp',
        imageAlt: 'نمای نیهاون کپنهاگ: ردیف خانه‌های تاریخی رنگی با سقف سفالی قرمز در کنار کانال، قایق‌های چوبی و چترهای کافه در هوای ابری',
      },
      {
        key: 'be', name: 'فلاندرِ بلژیک', permit: 'Innovation & Startup Permit',
        gate: 'نسخه‌ی سریع کارت حرفه‌ای. پرونده به نامه‌ی امضاشده‌ی یک نوآور، انکوباتور یا مؤسسه‌ی دانشی در فلاندر نیاز دارد.',
        sourceLabel: 'vlaanderen.be', sourceUrl: SOURCES.be, href: '/europe/belgium', image: '/fa/img/belgium.webp',
        imageAlt: 'افق شهر آنتورپ در روزی آفتابی با برج کلیسای جامع بانوی ما بالاتر از خانه‌های کنار رود شلده',
      },
    ],
    canada: {
      text: 'استارتاپ ویزای کانادا از ۳۰ ژوئن ۲۰۲۶ متوقف است و درخواست تازه نمی‌پذیرد، پس ما هم پرونده‌ی تازه‌ی استارتاپ ویزا نمی‌گیریم. برای بنیان‌گذاری که مسیر استارتاپی دیگری می‌خواهد، این چهار مسیر همان‌هایی است که رویشان کار می‌کنیم.',
      sourceLabel: 'canada.ca',
      sourceUrl: SUV_SOURCES.program,
    },
  },
  scope: {
    title: 'چه می‌کنیم و چه نمی‌کنیم',
    do: {
      title: 'کار ما',
      items: [
        'سنجیدن ایده، تیم و تناسبشان با مسیری که انتخاب کرده‌اید',
        'نوشتن بیزینس‌پلن، مدل مالی و پیچ‌دک',
        'منتورشیپ بنیان‌گذار و آماده‌کردنش برای نهاد ارزیاب',
        'تحویل همه‌ی اسناد نهایی به شما؛ خودمان چیزی ثبت نمی‌کنیم',
      ],
    },
    dont: {
      title: 'کار ما نیست',
      items: [
        'نمایندگی مهاجرتی، یا معرفی خودمان به این عنوان',
        'مشاوره‌ی مهاجرتی به موکل شما',
        'ثبت هر نوع درخواست نزد دولت، سفارت یا نهاد ارزیاب',
        'گفت‌وگو با موکل درباره‌ی مسائل مهاجرتی؛ هر پرسش مهاجرتی را به شما برمی‌گردانیم',
      ],
    },
  },
  disclaimer:
    'شرکت VisaRoads Inc. مشاور رسمی مهاجرت یا وکیل نیست، طبق ماده‌ی ۹۱ قانون مهاجرت و حمایت از پناهندگان کانادا (IRPA) اجازه‌ی نمایندگی هیچ‌کس را ندارد، مشاوره‌ی مهاجرتی نمی‌دهد و هیچ نتیجه‌ی مهاجرتی را تضمین نمی‌کند.',
  who: {
    title: 'چه کسانی پشت این همکاری‌اند',
    body: 'شرکت VisaRoads Inc. در انتاریوی کانادا ثبت شده و زیرمجموعه‌ی آشاوید است. برنامه‌ی همکاری را این افراد پیش می‌برند؛ معرفی کامل تیم در صفحه‌ی تیم آمده است.',
    people: [
      { name: 'فرجاد پورمحمد', role: 'بنیان‌گذار و منتور استارتاپ', line: 'تماس‌های آشنایی و ارزیابی استارتاپ با اوست.' },
      { name: 'محسن', role: 'مدیر عملیات و اکانت منیجر', line: 'وقتی پرونده باز شد، طرف حساب روزانه‌ی شماست.' },
      { name: 'حمید', role: 'مدیریت همکاری‌ها و منتور استارتاپ', line: 'رابطه‌ی همکاری با مؤسسه‌ها را دنبال می‌کند.' },
    ],
    teamLink: 'آشنایی با تیم',
    entity: 'شرکت VisaRoads Inc. زیرمجموعه‌ی آشاوید و مستقر در انتاریوی کانادا است.',
  },
  faq: {
    title: 'پرسش‌های همکاران',
    items: [
      {
        q: 'ویزارودز مشاوره‌ی مهاجرتی می‌دهد یا نماینده‌ی موکل می‌شود؟',
        a: 'نه. ویزارودز نماینده‌ی مهاجرتی نیست، مشاوره‌ی مهاجرتی نمی‌دهد و هیچ درخواستی را نزد هیچ دولتی ثبت نمی‌کند. مشاوره، پرونده‌ی حقوقی و ثبت درخواست‌ها با شماست و هر پرسش مهاجرتی بنیان‌گذار را به شما برمی‌گردانیم.',
      },
      {
        q: 'ارتباط با موکل دست کیست؟',
        a: 'دست شما. ما با اطلاع شما روی بخش کسب‌وکاری پرونده با بنیان‌گذار کار می‌کنیم و اسناد نهایی به خود شما تحویل می‌شود.',
      },
      {
        q: 'دقیقاً چه اسنادی آماده می‌کنید؟',
        a: 'ارزیابی استارتاپ، بیزینس‌پلن، مدل مالی و پیچ‌دک، مطابق آنچه نهاد ارزیاب هر مسیر بررسی می‌کند، به‌اضافه‌ی جلسه‌های منتورشیپ برای آماده‌کردن بنیان‌گذار. جلسه‌ها به فارسی برگزار می‌شود و اسناد به انگلیسی نوشته می‌شود، مگر مسیر زبان دیگری بخواهد.',
      },
      {
        q: 'روی کدام مسیرها کار می‌کنید؟',
        a: 'اقامت استارتاپ هلند، اقامت استارتاپ فنلاند، استارتاپ دانمارک و Innovation & Startup Permit فلاندرِ بلژیک. استارتاپ ویزای کانادا از ۳۰ ژوئن ۲۰۲۶ متوقف است و برایش پرونده‌ی تازه نمی‌گیریم.',
      },
      {
        q: 'اگر ایده‌ی موکل به‌اندازه‌ی کافی قوی نباشد چه می‌شود؟',
        a: 'بعد از ارزیابی و پیش از نوشتن هر سندی صریح می‌گوییم. ترجیح می‌دهیم پرونده‌ای را نگیریم تا اینکه پلنی بنویسیم که خودمان به آن باور نداریم.',
      },
      {
        q: 'هزینه‌ها چطور تنظیم می‌شود؟',
        a: 'قیمت منتشر نمی‌کنیم. هر پرونده قرارداد کتبی خودش را دارد و پرداخت در سه قسط است: هنگام امضای قرارداد، هنگام تأیید نهاد ارزیاب و هنگام صدور اجازه‌ی اقامت.',
      },
      {
        q: 'تقویم گوگل برایم باز نمی‌شود؛ چه کنم؟',
        a: `صفحه‌ی رزرو را در زبانه‌ی تازه باز کنید، یا به ${MAIN_CONTACT.b2bEmail} ایمیل بزنید یا در تلگرام به ${MAIN_CONTACT.telegramHandle} پیام بدهید تا زمانی هماهنگ کنیم.`,
      },
    ],
  },
  final: {
    title: 'موکلی در نظر دارید؟',
    body: 'بیست دقیقه کافی است تا ببینیم کدام مسیر به کار موکلتان می‌آید و همکاری‌مان چطور پیش می‌رود.',
  },
  sticky: 'رزرو تماس همکاری',
};

export const PARTNER_COPY: Record<PartnerLocale, PartnerCopy> = { en, fa };

export function partnerCopy(locale: string): PartnerCopy {
  return locale === 'fa' ? fa : en;
}
