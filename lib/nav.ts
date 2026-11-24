// ============================================================================
// lib/nav.ts
// One source for the header, the mobile drawer and the footer (option A,
// chosen 23 Nov 2026): five top items, a Destinations panel grouped by region,
// one CTA. /fa is its own site, so it has its own lists, not translations.
// lib/__tests__/nav.test.ts checks every href is a real page, that no Persian
// link hits a 301, and that the footer keeps every link the old menus had.
// ============================================================================

export type NavLocale = 'en' | 'fa';

export type NavLink = {
  href: string;
  label: string;
  /** A short status shown as a tag: paused, announced, closed. */
  status?: string;
  /** New in the menu; drawn in the accent colour. */
  isNew?: boolean;
};

export type NavRegion = { key: string; title: string; links: NavLink[] };

export type NavTop =
  | { kind: 'link'; href: string; label: string }
  | { kind: 'destinations'; label: string }
  | { kind: 'menu'; key: string; label: string; links: NavLink[] };

export type NavCopy = {
  top: NavTop[];
  regions: NavRegion[];
  /** The "Start here" column beside the regions. */
  start: {
    title: string;
    quiz: { href: string; title: string; body: string; action: string };
    links: NavLink[];
  };
  cta: { href: string; label: string };
  /** Secondary action shown under the CTA in the drawer. */
  secondary: { href: string; label: string } | null;
  login: { href: string; label: string } | null;
  ui: {
    menu: string;
    close: string;
    back: string;
    primaryNav: string;
    languageLabel: string;
    otherLanguage: string;
  };
};

const EN_REGIONS: NavRegion[] = [
  {
    key: 'canada',
    title: 'Canada',
    links: [
      { href: '/pnp', label: 'Entrepreneur PNP · compare provinces' },
      { href: '/pnp/bc', label: 'British Columbia' },
      { href: '/pnp/alberta', label: 'Alberta' },
      { href: '/pnp/manitoba', label: 'Manitoba' },
      { href: '/pnp/nova-scotia', label: 'Nova Scotia' },
      { href: '/pnp/new-brunswick', label: 'New Brunswick' },
      { href: '/pnp/pei', label: 'Prince Edward Island' },
      { href: '/c10-work-permit', label: 'C10 work permit', isNew: true },
      { href: '/high-impact-startup-pilot', label: 'High Impact Start-up Pilot', status: 'announced' },
      { href: '/startup-visa-canada', label: 'Start-Up Visa', status: 'paused' },
    ],
  },
  {
    key: 'europe',
    title: 'Europe & UK',
    links: [
      { href: '/country/denmark', label: 'Denmark' },
      { href: '/europe/netherlands', label: 'Netherlands' },
      { href: '/country/finland', label: 'Finland' },
      { href: '/country/italy', label: 'Italy' },
      { href: '/europe/spain', label: 'Spain' },
      { href: '/europe/bulgaria', label: 'Bulgaria' },
      { href: '/europe/belgium', label: 'Belgium' },
      { href: '/europe/estonia', label: 'Estonia' },
      { href: '/uk/innovator-founder', label: 'UK Innovator Founder' },
    ],
  },
  {
    key: 'usa',
    title: 'United States',
    links: [
      { href: '/country/usa', label: 'Founder routes overview' },
      { href: '/usa/o-1a', label: 'O-1A' },
      { href: '/usa/eb2-niw', label: 'EB-2 NIW' },
      { href: '/usa/eb1', label: 'EB-1A' },
    ],
  },
  {
    key: 'world',
    title: 'Rest of world',
    links: [
      { href: '/country/australia', label: 'Australia (NIV 858)' },
      { href: '/country/turkey', label: 'Türkiye Tech Visa' },
      { href: '/start-up-chile', label: 'Chile · Start-Up Chile' },
      { href: '/country/uae', label: 'UAE Golden Visa' },
      { href: '/country/israel', label: 'Israel Innovation Visa' },
    ],
  },
];

const FA_REGIONS: NavRegion[] = [
  {
    key: 'canada',
    title: 'کانادا',
    links: [
      { href: '/pnp', label: 'کارآفرینی استانی · مقایسه‌ی استان‌ها' },
      { href: '/pnp/bc', label: 'بریتیش کلمبیا' },
      { href: '/pnp/alberta', label: 'آلبرتا' },
      { href: '/pnp/manitoba', label: 'منیتوبا' },
      { href: '/pnp/nova-scotia', label: 'نوااسکوشیا' },
      { href: '/pnp/new-brunswick', label: 'نیوبرانزویک' },
      { href: '/pnp/pei', label: 'جزیره‌ی پرنس ادوارد' },
      { href: '/high-impact-startup-pilot', label: 'پایلوت High Impact', status: 'اعلام‌شده' },
      { href: '/canada-startup-visa', label: 'استارتاپ ویزا', status: 'متوقف' },
    ],
  },
  {
    key: 'europe',
    title: 'اروپا و انگلیس',
    links: [
      { href: '/europe/denmark', label: 'دانمارک' },
      { href: '/europe/netherlands', label: 'هلند' },
      { href: '/europe/finland', label: 'فنلاند' },
      { href: '/europe/italy', label: 'ایتالیا' },
      { href: '/europe/spain', label: 'اسپانیا' },
      { href: '/europe/bulgaria', label: 'بلغارستان' },
      { href: '/europe/belgium', label: 'بلژیک' },
      { href: '/europe/estonia', label: 'استونی' },
      { href: '/uk/innovator-founder', label: 'انگلیس' },
    ],
  },
  {
    key: 'usa',
    title: 'آمریکا',
    links: [
      { href: '/usa', label: 'مسیرهای فاندر' },
      { href: '/usa/o-1a', label: 'O-1A' },
      { href: '/usa-eb2-niw', label: 'EB-2 NIW' },
    ],
  },
  {
    key: 'world',
    title: 'مقصدهای دیگر',
    links: [
      { href: '/australia', label: 'استرالیا' },
      { href: '/turkey-tech-visa', label: 'ترکیه' },
      { href: '/start-up-chile', label: 'شیلی · استارتاپ شیلی' },
      { href: '/israel', label: 'اسرائیل', status: 'باز نیست' },
    ],
  },
];

export const NAV: Record<NavLocale, NavCopy> = {
  en: {
    top: [
      { kind: 'destinations', label: 'Destinations' },
      { kind: 'link', href: '/mentorship', label: 'Mentorship' },
      { kind: 'link', href: '/pricing', label: 'Pricing' },
      { kind: 'link', href: '/blog', label: 'Blog' },
      {
        kind: 'menu',
        key: 'about',
        label: 'About',
        links: [
          { href: '/about', label: 'Our story' },
          { href: '/team', label: 'Team' },
          { href: '/services', label: 'Advisory services' },
          { href: '/partners', label: 'For immigration firms' },
          { href: '/webinar', label: 'Webinar' },
          { href: '/faq', label: 'FAQ' },
          { href: '/contact', label: 'Contact' },
          { href: '/book-meeting', label: 'Book a call' },
        ],
      },
    ],
    regions: EN_REGIONS,
    start: {
      title: 'Start here',
      quiz: {
        href: '/which-path',
        title: 'Not sure where to start?',
        body: 'Seven questions on team, money and timing. You get a suggested route.',
        action: 'Find my route',
      },
      links: [
        { href: '/country', label: 'Compare all countries' },
        { href: '/tools', label: 'Self-assessment tools' },
        { href: '/app', label: 'The VisaRoads app' },
      ],
    },
    cta: { href: '/which-path', label: 'Find my route' },
    secondary: { href: '/book-meeting', label: 'Book a call' },
    login: { href: '/login', label: 'Client login' },
    ui: {
      menu: 'Open menu',
      close: 'Close menu',
      back: 'Back',
      primaryNav: 'Main',
      languageLabel: 'English',
      otherLanguage: 'فارسی',
    },
  },
  fa: {
    top: [
      { kind: 'destinations', label: 'مسیرها' },
      { kind: 'link', href: '/mentorship', label: 'منتورشیپ' },
      { kind: 'link', href: '/pricing', label: 'قیمت‌ها' },
      { kind: 'link', href: '/blog', label: 'مجله' },
      {
        kind: 'menu',
        key: 'about',
        label: 'درباره‌ی ما',
        links: [
          { href: '/about', label: 'درباره‌ی ما' },
          { href: '/partners', label: 'همکاری با مؤسسات مهاجرت' },
          { href: '/webinar', label: 'وبینار' },
          { href: '/faq', label: 'سؤالات متداول' },
          { href: '/contact', label: 'تماس و مشاوره' },
        ],
      },
    ],
    regions: FA_REGIONS,
    start: {
      title: 'از کجا شروع کنم',
      quiz: {
        href: '/which-path',
        title: 'نمی‌دانید از کجا شروع کنید؟',
        body: 'هفت سؤال درباره‌ی تیم، سرمایه و زمان‌بندی. خروجی: مسیر پیشنهادی.',
        action: 'مسیر من کدام است؟',
      },
      links: [{ href: '/app', label: 'اپلیکیشن VisaRoads' }],
    },
    cta: { href: '/which-path', label: 'مسیر من کدام است؟' },
    // Persian has no booking page; /book-meeting 301s out of /fa.
    secondary: { href: '/contact', label: 'تماس و مشاوره' },
    login: null,
    ui: {
      menu: 'باز کردن منو',
      close: 'بستن منو',
      back: 'بازگشت',
      primaryNav: 'منوی اصلی',
      languageLabel: 'فارسی',
      otherLanguage: 'English',
    },
  },
};

export type FooterColumn = { title: string; groups: { title?: string; links: NavLink[] }[] };

/**
 * The footer is a sitemap: every route, every money page, every company page.
 * It is the one link set present on every page, so it carries the crawl paths
 * the slimmer header no longer shows at the top level.
 */
export function footerColumns(locale: NavLocale): FooterColumn[] {
  const nav = NAV[locale];
  const [canada, europe, usa, world] = nav.regions;
  if (locale === 'en') {
    return [
      { title: canada.title, groups: [{ links: [{ href: '/country/canada', label: 'Canada overview' }, ...canada.links] }] },
      { title: europe.title, groups: [{ links: europe.links }] },
      { title: 'USA & world', groups: [{ title: usa.title, links: usa.links }, { title: world.title, links: world.links }] },
      {
        title: 'Start here',
        groups: [{
          links: [
            { href: '/which-path', label: 'Which route fits me?' },
            { href: '/country', label: 'Compare all countries' },
            { href: '/tools', label: 'Self-assessment tools' },
            { href: '/mentorship', label: 'Mentorship' },
            { href: '/services', label: 'Advisory services' },
            { href: '/pricing', label: 'Pricing' },
            { href: '/app', label: 'The app' },
            { href: '/faq', label: 'FAQ' },
            { href: '/webinar', label: 'Webinar' },
          ],
        }],
      },
      {
        title: 'Company',
        groups: [{
          links: [
            { href: '/about', label: 'Our story' },
            { href: '/team', label: 'Team' },
            { href: '/partners', label: 'For immigration firms' },
            { href: '/blog', label: 'Blog' },
            { href: '/data-reports', label: 'Data reports' },
            { href: '/case-studies', label: 'Case studies' },
            { href: '/contact', label: 'Contact' },
            { href: '/book-meeting', label: 'Book a call' },
            { href: '/login', label: 'Client login' },
          ],
        }],
      },
    ];
  }
  return [
    { title: canada.title, groups: [{ links: canada.links }] },
    { title: europe.title, groups: [{ links: europe.links }] },
    { title: 'آمریکا و دیگر مقصدها', groups: [{ title: usa.title, links: usa.links }, { title: world.title, links: world.links }] },
    {
      title: 'شروع',
      groups: [{
        links: [
          { href: '/which-path', label: 'کدام مسیر برای من؟' },
          { href: '/mentorship', label: 'منتورشیپ' },
          { href: '/pricing', label: 'قیمت‌ها' },
          { href: '/app', label: 'اپلیکیشن' },
          { href: '/faq', label: 'سؤالات متداول' },
          { href: '/webinar', label: 'وبینار' },
        ],
      }],
    },
    {
      title: 'ما',
      groups: [{
        links: [
          { href: '/about', label: 'درباره‌ی ما' },
          { href: '/team', label: 'تیم' },
          { href: '/partners', label: 'همکاری با مؤسسات مهاجرت' },
          { href: '/blog', label: 'مجله' },
          { href: '/data-reports', label: 'گزارش‌های آماری' },
          { href: '/case-studies', label: 'نمونه‌پرونده‌ها' },
          { href: '/contact', label: 'تماس و مشاوره' },
        ],
      }],
    },
  ];
}

/** Every href the header, drawer and footer render for a locale. */
export function allNavHrefs(locale: NavLocale): string[] {
  const nav = NAV[locale];
  const hrefs = [
    ...nav.top.flatMap((t) => (t.kind === 'link' ? [t.href] : t.kind === 'menu' ? t.links.map((l) => l.href) : [])),
    ...nav.regions.flatMap((r) => r.links.map((l) => l.href)),
    nav.start.quiz.href,
    ...nav.start.links.map((l) => l.href),
    nav.cta.href,
    ...(nav.secondary ? [nav.secondary.href] : []),
    ...(nav.login ? [nav.login.href] : []),
    ...footerColumns(locale).flatMap((c) => c.groups.flatMap((g) => g.links.map((l) => l.href))),
  ];
  return [...new Set(hrefs)];
}
