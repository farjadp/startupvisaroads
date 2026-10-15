// ============================================================================
// content/app-page.ts
// Copy for /app — the page that introduces the VisaRoads mobile app.
//
// Every claim here must stay true of the app on main (checked against
// mobile/store/listing-v2.md, 15 Oct 2026). Route and country counts are not
// written here: the page computes them from lib/routes-v2 so they cannot
// drift. The funds figure on the phone comes from lib/funds.ts (official
// source, dated). The app is not in the stores yet, so the page says
// "coming soon" and never links to a store listing that does not exist.
// ============================================================================

export type AppLocale = 'en' | 'fa';

export type ScreenKey = 'start' | 'assess' | 'results' | 'route' | 'funds';

export type AppPageCopy = {
  eyebrow: string;
  title: [string, string];
  lede: string;
  soon: string;
  appStore: string;
  googlePlay: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  chips: { match: string; source: string; lang: string };
  stats: { routes: string; countries: string; families: string; languages: string; questions: string; signup: string };
  countries: string[];
  doors: {
    title: string;
    items: { kicker: string; title: string; body: string; steps: string[] }[];
  };
  features: {
    title: string;
    lede: string;
    match: { title: string; body: string; caption: string };
    close: { title: string; body: string; items: { label: string; state: 'met' | 'open' | 'judged' }[]; legend: Record<'met' | 'open' | 'judged', string> };
    funds: { title: string; body: string; label: string; source: string };
    sources: { title: string; body: string };
    languages: { title: string; body: string; hellos: string[] };
    news: { title: string; body: string };
    mentor: { title: string; body: string };
    home: { title: string; body: string };
  };
  story: {
    title: string;
    steps: { screen: ScreenKey; title: string; body: string }[];
  };
  honest: {
    title: string;
    items: { title: string; body: string }[];
  };
  privacy: { title: string; body: string; points: string[] };
  who: string;
  final: { title: string; body: string };
  screens: {
    exampleTag: string;
    start: { hello: string; choose: string; chooseSub: string; assess: string; assessSub: string };
    assess: { progress: string; question: string; options: string[]; skip: string };
    results: { title: string; basedOn: (n: number) => string; met: (a: number, b: number) => string; routes: { name: string; country: string; pct?: number; conds?: number; met?: [number, number] }[] };
    route: { name: string; country: string; met: string; open: string; judged: string; items: { label: string; state: 'met' | 'open' | 'judged' }[]; source: string };
    funds: { title: string; single: string; perYear: string; usd: string; eur: string };
    tabs: string[];
  };
};

const en: AppPageCopy = {
  eyebrow: 'The VisaRoads app · iOS & Android',
  title: ['Every road,', 'in your pocket.'],
  lede:
    'Ten questions, no sign-up. See how closely you match the published criteria of startup, entrepreneur, talent and study routes, what to close first, and where every rule comes from.',
  soon: 'Coming soon',
  appStore: 'App Store',
  googlePlay: 'Google Play',
  primaryCta: { label: 'Talk to a mentor', href: '/book-meeting' },
  secondaryCta: { label: 'See the features', href: '#features' },
  chips: { match: '82% match · 9 conditions', source: 'Source · nyidanmark.dk', lang: 'فارسی · RTL' },
  stats: { routes: 'routes', countries: 'countries', families: 'route families', languages: 'languages', questions: 'questions', signup: 'sign-ups needed' },
  countries: ['Canada', 'United States', 'Denmark', 'Finland', 'Estonia', 'Netherlands', 'Italy', 'Türkiye', 'Israel', 'UAE'],
  doors: {
    title: 'Two ways in.',
    items: [
      {
        kicker: 'Door 01',
        title: 'Choose a road',
        body: 'Pick a country, then a route. Read what it asks for, the funds it expects you to show, and where each rule comes from.',
        steps: ['Country', 'Route', 'Conditions & sources'],
      },
      {
        kicker: 'Door 02',
        title: 'Get assessed',
        body: 'Ten short questions, each one skippable. Your routes come back ranked by how closely you match their published criteria.',
        steps: ['10 questions', 'Ranked routes', 'What to close first'],
      },
    ],
  },
  features: {
    title: 'What’s inside.',
    lede: 'Built for founders, professionals and students who want the real criteria, not a sales pitch.',
    match: {
      title: 'A match you can read',
      body: 'Every percentage says how many conditions it rests on. When a route depends on someone’s judgement, you see the conditions you meet instead.',
      caption: 'based on 9 conditions',
    },
    close: {
      title: 'What to close first',
      body: 'For each route: what you already meet, what is still open, and what only the programme can judge.',
      items: [
        { label: 'Innovative business idea', state: 'met' },
        { label: 'Founders’ own funds', state: 'met' },
        { label: 'Full-time in the company', state: 'open' },
        { label: 'Expert panel endorsement', state: 'judged' },
      ],
      legend: { met: 'Met', open: 'Open', judged: 'Programme judges' },
    },
    funds: { title: 'Funds in three currencies', body: 'What you must show for your family size, in the official currency, US dollars, or your home currency.', label: 'Start-up Denmark · single applicant', source: 'nyidanmark.dk' },
    sources: { title: 'A source on every figure', body: 'Each number links to the official page and shows the date we checked it.' },
    languages: { title: 'Five languages', body: 'English, فارسی, Français, 中文 and العربية, with full right-to-left layout, light and dark.', hellos: ['Hello', 'سلام', 'Bonjour', '你好', 'مرحبا'] },
    news: { title: 'News by country', body: 'Guides and analysis from visaroads.com, filtered to the roads you follow.' },
    mentor: { title: 'A person, when you want one', body: 'Book a call with a VisaRoads mentor on our website.' },
    home: { title: 'Home', body: 'The roads you follow and the news about them, in one place.' },
  },
  story: {
    title: 'From question to plan in under five minutes.',
    steps: [
      { screen: 'start', title: 'Open the app. No account.', body: 'Pick your language and a door. Nothing to sign up for, nothing to verify.' },
      { screen: 'assess', title: 'Answer ten questions.', body: 'Education, experience, funds, family, the business you have or want. Skip any you like.' },
      { screen: 'results', title: 'See your routes, ranked.', body: 'Each one shows its match with published criteria and how many conditions that number rests on.' },
      { screen: 'route', title: 'Open a route.', body: 'Conditions met, still open, and judged by the programme, with the official source and the date it was checked.' },
      { screen: 'funds', title: 'Check the money.', body: 'The funds the route expects for your family, in three currencies.' },
    ],
  },
  honest: {
    title: 'Honest by design.',
    items: [
      { title: 'A match is not a chance of approval.', body: 'Programmes also judge things no app can check. We say so on every result.' },
      { title: 'Every figure has a source and a date.', body: 'Official government pages only. If we could not read a figure there, we show the link, not a number.' },
      { title: 'Paused means paused.', body: 'Programmes that are closed or paused are marked as such and never scored.' },
      { title: 'No guarantees, ever.', body: 'We prepare the business side of a case. We do not file applications and we are not affiliated with any government.' },
    ],
  },
  privacy: {
    title: 'Your answers stay on your phone.',
    body: 'There is no account and no tracking. Delete everything at any time in Me › Settings.',
    points: ['No account', 'No ads', 'No tracking', 'Delete in one tap'],
  },
  who: 'VisaRoads is a product of Ashavid Inc., based in Ontario, Canada. We are not immigration lawyers or licensed immigration consultants.',
  final: { title: 'Start on the road that fits.', body: 'The app is on its way to the App Store and Google Play. Until then, a mentor can walk you through your routes.' },
  screens: {
    exampleTag: 'Example',
    start: { hello: 'Where to?', choose: 'Choose a road', chooseSub: '10 countries', assess: 'Get assessed', assessSub: '10 questions · 3 min' },
    assess: { progress: 'Question 3 of 10', question: 'How much can you show in personal funds?', options: ['Under $15k', '$15k – $50k', '$50k – $150k', 'Over $150k'], skip: 'Skip' },
    results: {
      title: 'Your routes',
      basedOn: (n) => `${n} conditions`,
      met: (a, b) => `${a} of ${b} met`,
      routes: [
        { name: 'Start-up Denmark', country: 'DK', pct: 82, conds: 9 },
        { name: 'Netherlands startup visa', country: 'NL', pct: 74, conds: 8 },
        { name: 'EB-2 NIW', country: 'US', met: [3, 5] },
      ],
    },
    route: {
      name: 'Start-up Denmark',
      country: 'Denmark',
      met: 'Met',
      open: 'Open',
      judged: 'Panel judges',
      items: [
        { label: 'Innovative idea', state: 'met' },
        { label: 'Own funds', state: 'met' },
        { label: 'Full-time founder', state: 'open' },
        { label: 'Expert panel', state: 'judged' },
      ],
      source: 'nyidanmark.dk · checked',
    },
    funds: { title: 'Funds', single: 'Single applicant', perYear: 'per year', usd: 'about USD', eur: 'about EUR' },
    tabs: ['Home', 'Countries', 'Assess', 'News', 'Me'],
  },
};

const fa: AppPageCopy = {
  eyebrow: 'اپلیکیشن VisaRoads · iOS و اندروید',
  title: ['همه‌ی مسیرها،', 'توی جیب شما.'],
  lede:
    'ده سؤال، بدون ثبت‌نام. ببینید با شرایط منتشرشده‌ی مسیرهای استارتاپی، کارآفرینی، استعداد و تحصیلی چقدر تطابق دارید، اول سراغ کدام کمبود بروید و هر قاعده از کجا آمده است.',
  soon: 'به‌زودی',
  appStore: 'اپ استور',
  googlePlay: 'گوگل پلی',
  primaryCta: { label: 'ارزیابی رایگان روی سایت', href: '/which-path' },
  secondaryCta: { label: 'امکانات را ببینید', href: '#features' },
  chips: { match: '۸۲٪ تطابق · ۹ شرط', source: 'منبع · nyidanmark.dk', lang: 'English · LTR' },
  stats: { routes: 'مسیر', countries: 'کشور', families: 'خانواده‌ی مسیر', languages: 'زبان', questions: 'سؤال', signup: 'ثبت‌نام لازم' },
  countries: ['کانادا', 'آمریکا', 'دانمارک', 'فنلاند', 'استونی', 'هلند', 'ایتالیا', 'ترکیه', 'اسرائیل', 'امارات'],
  doors: {
    title: 'دو راه برای شروع.',
    items: [
      {
        kicker: 'راه ۰۱',
        title: 'انتخاب مسیر',
        body: 'کشور را انتخاب کنید، بعد مسیر را. ببینید چه می‌خواهد، چه مبلغی را باید به‌عنوان تمکن مالی نشان دهید و هر قاعده از کجا آمده است.',
        steps: ['کشور', 'مسیر', 'شرط‌ها و منبع‌ها'],
      },
      {
        kicker: 'راه ۰۲',
        title: 'ارزیابی',
        body: 'ده سؤال کوتاه که از هرکدام می‌توانید رد شوید. مسیرها به ترتیب میزان تطابق شما با شرایط منتشرشده‌شان مرتب می‌شوند.',
        steps: ['۱۰ سؤال', 'مسیرهای مرتب‌شده', 'اول چه چیزی را کامل کنید'],
      },
    ],
  },
  features: {
    title: 'در این اپلیکیشن.',
    lede: 'برای بنیان‌گذاران، متخصصان و دانشجوهایی که شرایط واقعی را می‌خواهند، نه حرف فروش.',
    match: {
      title: 'درصدی که می‌شود خواند',
      body: 'کنار هر درصد نوشته شده بر اساس چند شرط حساب شده است. اگر مسیری به نظر یک نهاد وابسته باشد، به‌جای درصد، شرط‌هایی را که دارید می‌بینید.',
      caption: 'بر اساس ۹ شرط',
    },
    close: {
      title: 'اول چه چیزی را کامل کنید',
      body: 'برای هر مسیر: شرط‌هایی که دارید، شرط‌هایی که هنوز باز است و شرط‌هایی که فقط خود برنامه درباره‌شان تصمیم می‌گیرد.',
      items: [
        { label: 'ایده‌ی نوآورانه', state: 'met' },
        { label: 'سرمایه‌ی شخصی بنیان‌گذار', state: 'met' },
        { label: 'کار تمام‌وقت در شرکت', state: 'open' },
        { label: 'تأیید پنل کارشناسی', state: 'judged' },
      ],
      legend: { met: 'دارید', open: 'باز', judged: 'تصمیم با برنامه' },
    },
    funds: { title: 'تمکن مالی به سه ارز', body: 'مبلغی که هر کشور برای تعداد اعضای خانواده‌ی شما می‌خواهد، به ارز رسمی، دلار آمریکا یا ارز کشور خودتان.', label: 'استارتاپ دانمارک · متقاضی مجرد', source: 'nyidanmark.dk' },
    sources: { title: 'منبع رسمی کنار هر عدد', body: 'هر عدد به صفحه‌ی رسمی‌اش لینک دارد و تاریخ آخرین بررسی را نشان می‌دهد.' },
    languages: { title: 'پنج زبان', body: 'فارسی، انگلیسی، فرانسوی، چینی و عربی، با چیدمان کامل راست‌به‌چپ؛ حالت روشن و تیره.', hellos: ['سلام', 'Hello', 'Bonjour', '你好', 'مرحبا'] },
    news: { title: 'اخبار به تفکیک کشور', body: 'راهنماها و تحلیل‌های visaroads.com، برای مسیرهایی که دنبال می‌کنید.' },
    mentor: { title: 'هر وقت خواستید، یک آدم', body: 'از سایت ما وقت گفت‌وگو با منتور VisaRoads بگیرید.' },
    home: { title: 'خانه', body: 'مسیرهایی که دنبال می‌کنید و خبرهایشان، یک‌جا.' },
  },
  story: {
    title: 'از سؤال تا برنامه، در کمتر از پنج دقیقه.',
    steps: [
      { screen: 'start', title: 'اپ را باز کنید. حساب کاربری لازم نیست.', body: 'زبان و راه ورود را انتخاب کنید. نه ثبت‌نامی، نه تأییدی.' },
      { screen: 'assess', title: 'به ده سؤال جواب بدهید.', body: 'تحصیلات، سابقه، سرمایه، خانواده و کسب‌وکاری که دارید یا می‌خواهید. از هر سؤالی خواستید رد شوید.' },
      { screen: 'results', title: 'مسیرهایتان را مرتب‌شده ببینید.', body: 'هر مسیر میزان تطابق با شرایط منتشرشده را نشان می‌دهد و اینکه این عدد بر اساس چند شرط است.' },
      { screen: 'route', title: 'یک مسیر را باز کنید.', body: 'شرط‌هایی که دارید، شرط‌های باز و شرط‌هایی که برنامه می‌سنجد؛ با منبع رسمی و تاریخ بررسی.' },
      { screen: 'funds', title: 'حساب پول را بکنید.', body: 'تمکن مالی‌ای که مسیر برای خانواده‌ی شما می‌خواهد، به سه ارز.' },
    ],
  },
  honest: {
    title: 'صادق از پایه.',
    items: [
      { title: 'درصد تطابق، شانس پذیرش نیست.', body: 'برنامه‌ها چیزهایی را هم می‌سنجند که هیچ اپلیکیشنی نمی‌تواند بررسی کند. این را کنار هر نتیجه می‌گوییم.' },
      { title: 'هر عدد منبع و تاریخ دارد.', body: 'فقط صفحه‌های رسمی دولتی. اگر عددی را آنجا نخوانده باشیم، لینک منبع را نشان می‌دهیم، نه عدد را.' },
      { title: 'متوقف یعنی متوقف.', body: 'برنامه‌های بسته یا متوقف‌شده علامت می‌خورند و هیچ‌وقت امتیاز نمی‌گیرند.' },
      { title: 'هیچ تضمینی نمی‌دهیم.', body: 'ما بخش کسب‌وکاری پرونده را آماده می‌کنیم. درخواست ثبت نمی‌کنیم و به هیچ دولتی وابسته نیستیم.' },
    ],
  },
  privacy: {
    title: 'پاسخ‌هایتان فقط روی گوشی خودتان می‌ماند.',
    body: 'حساب کاربری و ردیابی ندارد. هر وقت بخواهید از «من › تنظیمات» همه‌چیز را پاک کنید.',
    points: ['بدون حساب کاربری', 'بدون تبلیغ', 'بدون ردیابی', 'پاک‌کردن با یک لمس'],
  },
  who: 'VisaRoads محصولی از آشاوید است، مستقر در انتاریوی کانادا. ما وکیل مهاجرت یا مشاور رسمی مهاجرت نیستیم.',
  final: { title: 'از مسیری شروع کنید که به شما می‌خورد.', body: 'اپلیکیشن در راه اپ استور و گوگل پلی است. تا آن موقع، ارزیابی رایگان سایت یا یک منتور همراه‌تان است.' },
  screens: {
    exampleTag: 'نمونه',
    start: { hello: 'کجا می‌روید؟', choose: 'انتخاب مسیر', chooseSub: '۱۰ کشور', assess: 'ارزیابی', assessSub: '۱۰ سؤال · ۳ دقیقه' },
    assess: { progress: 'سؤال ۳ از ۱۰', question: 'چقدر سرمایه‌ی شخصی می‌توانید نشان دهید؟', options: ['کمتر از ۱۵ هزار دلار', '۱۵ تا ۵۰ هزار دلار', '۵۰ تا ۱۵۰ هزار دلار', 'بیشتر از ۱۵۰ هزار دلار'], skip: 'رد شدن' },
    results: {
      title: 'مسیرهای شما',
      basedOn: (n) => `${toFaDigits(n)} شرط`,
      met: (a, b) => `${toFaDigits(a)} از ${toFaDigits(b)} شرط`,
      routes: [
        { name: 'استارتاپ دانمارک', country: 'DK', pct: 82, conds: 9 },
        { name: 'استارتاپ ویزای هلند', country: 'NL', pct: 74, conds: 8 },
        { name: 'EB-2 NIW آمریکا', country: 'US', met: [3, 5] },
      ],
    },
    route: {
      name: 'استارتاپ دانمارک',
      country: 'دانمارک',
      met: 'دارید',
      open: 'باز',
      judged: 'تصمیم پنل',
      items: [
        { label: 'ایده‌ی نوآورانه', state: 'met' },
        { label: 'سرمایه‌ی شخصی', state: 'met' },
        { label: 'بنیان‌گذار تمام‌وقت', state: 'open' },
        { label: 'پنل کارشناسی', state: 'judged' },
      ],
      source: 'nyidanmark.dk · بررسی',
    },
    funds: { title: 'تمکن مالی', single: 'متقاضی مجرد', perYear: 'در سال', usd: 'حدود دلار', eur: 'حدود یورو' },
    tabs: ['خانه', 'کشورها', 'ارزیابی', 'اخبار', 'من'],
  },
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export function toFaDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function appPageCopy(locale: string): AppPageCopy {
  return locale === 'fa' ? fa : en;
}
