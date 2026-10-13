// ============================================================================
// content/fa/pnp.ts
// «برنامه‌های استانی کانادا» — the Persian product page for Entrepreneur PNP,
// rendered by components/fa/FaPnpHub.tsx. It is a hub, not a guide: it says
// what we do, shows every province at a glance and sends the reader on.
//
// The province figures repeat the province guides (content/fa/pnp-*.ts,
// content/en/pnp-pei.ts) and components/pnp/EntrepreneurComparison.tsx, all
// checked against official pages on CHECKED. Change them together.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';
import { TELEGRAM_URL } from './home';

export const CHECKED = '2026-10-12';

export type PnpProvince = {
  name: string;
  /** Official stream name, Latin. */
  stream: string;
  /** Locale-agnostic Persian path, or an explicit /en/ path when there is no Persian guide. */
  href: string;
  /** Persian guide or English guide — drives the link label. */
  guide: 'fa' | 'en';
  status: string;
  /** Whether the stream is actually taking entrepreneurs now. */
  open: boolean;
  netWorth: string;
  investment: string;
  language: string;
  beforeNomination: string;
};

export const provinces: PnpProvince[] = [
  {
    name: 'آلبرتا',
    stream: 'AAIP Rural Entrepreneur',
    href: '/pnp/alberta',
    guide: 'fa',
    status: 'باز؛ ۲۴ نامزدی از سهمیه‌ی ۶۰تایی ۲۰۲۶ باقی مانده',
    open: true,
    netWorth: '۳۰۰٬۰۰۰ دلار',
    investment: '۱۰۰٬۰۰۰ دلار',
    language: 'CLB 4',
    beforeNomination: '۱۲ ماه اداره‌ی کسب‌وکار',
  },
  {
    name: 'منیتوبا',
    stream: 'MPNP Business Investor — Entrepreneur',
    href: '/pnp/manitoba',
    guide: 'fa',
    status: 'EOI با ایمیل، بررسی ظرف ۴ هفته؛ بدون دور دعوت',
    open: true,
    netWorth: '۵۰۰٬۰۰۰ دلار',
    investment: '۲۵۰٬۰۰۰ دلار (۱۵۰٬۰۰۰ بیرون از وینیپگ)',
    language: 'CLB 5',
    beforeNomination: '۶ ماه اداره‌ی کسب‌وکار',
  },
  {
    name: 'نوااسکوشیا',
    stream: 'NSNP Entrepreneur',
    href: '/pnp/nova-scotia',
    guide: 'fa',
    status: 'با دعوت؛ ۴ دور در ۲۰۲۶، کمترین امتیاز آخرین دور ۱۰۱',
    open: true,
    netWorth: '۶۰۰٬۰۰۰ دلار (۴۰۰٬۰۰۰ بیرون از هلیفکس)',
    investment: '۱۵۰٬۰۰۰ دلار (۱۰۰٬۰۰۰ بیرون از هلیفکس)',
    language: 'CLB 5',
    beforeNomination: '۱۲ ماه اداره‌ی کسب‌وکار',
  },
  {
    name: 'نیوبرانزویک',
    stream: 'NB Business Immigration Stream (NBBIS)',
    href: '/pnp/new-brunswick',
    guide: 'fa',
    status: 'فعال؛ دور دعوت کسب‌وکار منتشر نشده',
    open: true,
    netWorth: '۵۰۰٬۰۰۰ دلار (۳۰۰٬۰۰۰ کشاورزی)',
    investment: '۱۵۰٬۰۰۰ دلار',
    language: 'CLB 4',
    beforeNomination: '۶ ماه پیاپی اداره‌ی کسب‌وکار',
  },
  {
    name: 'جزیره‌ی پرنس ادوارد',
    stream: 'PEI PNP Business Work Permit',
    href: '/en/pnp/pei',
    guide: 'en',
    status: 'در فهرست هست، اما در ۲۰۲۶ هیچ کارآفرینی دعوت نشده',
    open: false,
    netWorth: '۶۰۰٬۰۰۰ دلار',
    investment: '۱۵۰٬۰۰۰ دلار',
    language: 'CLB 4',
    beforeNomination: '۱۲ ماه پیاپی اداره‌ی کسب‌وکار',
  },
];

/** Provinces we do not specialise in — English guides only, said plainly. */
export const otherProvinces: { name: string; href: string | null; note: string }[] = [
  { name: 'بریتیش کلمبیا', href: '/en/pnp/bc', note: 'مسیرهای مهارتی قوی در فناوری؛ راهنمای انگلیسی' },
  { name: 'انتاریو', href: '/en/pnp/ontario', note: 'مسیرهای مهارتی وابسته به دعوت؛ راهنمای انگلیسی' },
  { name: 'ساسکاچوان', href: '/en/pnp/saskatchewan', note: 'مسیرهای مهارتی با فهرست مشاغل؛ راهنمای انگلیسی' },
  { name: 'نیوفاندلند و لابرادور', href: '/en/pnp/newfoundland', note: 'مسیرهای کوچک آتلانتیک؛ راهنمای انگلیسی' },
  { name: 'کبک', href: null, note: 'برنامه‌ی نامزدی استانی ندارد و مهاجر اقتصادی را با سیستم خودش انتخاب می‌کند' },
];

/** The route in order. Province detail differs; each guide has its own. */
export const route: { title: string; body: string }[] = [
  { title: 'انتخاب استان و مسیر', body: 'دارایی خالص، سرمایه‌ی قابل انتقال، سابقه‌ی مدیریت و زبان شما با آستانه‌های هر استان سنجیده می‌شود.' },
  { title: 'طرح کسب‌وکار', body: 'کسب‌وکاری که می‌سازید یا می‌خرید انتخاب می‌شود. در آلبرتا یک جامعه‌ی روستایی باید پیش از EOI کتباً از طرح حمایت کند.' },
  { title: 'ثبت EOI و دعوت', body: 'پروفایل امتیازی در سامانه‌ی استان ثبت می‌شود و استان از میان آن‌ها دعوت می‌کند. منیتوبا فعلاً EOI را با ایمیل می‌گیرد.' },
  { title: 'درخواست کامل، تأیید دارایی و مصاحبه', body: 'بیزینس‌پلن، مدل مالی و مدارک دارایی بررسی می‌شود و در مصاحبه از آن دفاع می‌کنید.' },
  { title: 'قرارداد عملکرد و مجوز کار', body: 'با استان قرارداد عملکرد امضا می‌کنید و با نامه‌ی حمایت استان مجوز کار موقت می‌گیرید.' },
  { title: 'اداره‌ی کسب‌وکار، نامزدی و اقامت دائم', body: 'پس از ۶ تا ۱۲ ماه اداره‌ی واقعی کسب‌وکار، استان شما را نامزد می‌کند و پرونده‌ی اقامت دائم را IRCC بررسی می‌کند.' },
];

/** What we actually do — the product. */
export const service: { title: string; body: string }[] = [
  { title: 'انتخاب', body: 'کدام استان و کدام مسیر با دارایی، سابقه، زبان و نوع کسب‌وکار شما می‌خواند، و کدام آستانه‌ای دارد که از آن رد نمی‌شوید. این تصمیم بیشتر از هر چیز دیگری پول و سال نجات می‌دهد.' },
  { title: 'ساختن', body: 'بیزینس‌پلن و مدل مالی به استاندارد همان استان، ارزیابی کسب‌وکاری که می‌خواهید بخرید یا بسازید، و ارائه به جامعه‌ی محلی در جایی که لازم است.' },
  { title: 'آمادگی', body: 'تمرین مصاحبه‌ی استانی و برنامه‌ریزی مستندسازی دارایی و انتقال پول. برای متقاضی ایرانی این طولانی‌ترین بخش کار است.' },
];

export const related: { label: string; note: string; href: string }[] = [
  { label: 'وضعیت استارتاپ ویزای کانادا', note: 'متوقف از ۳۰ ژوئن ۲۰۲۶؛ چه کسانی هنوز در صف‌اند', href: '/canada-startup-visa' },
  { label: 'کدام مسیر برای شما؟', note: 'ارزیابی رایگان: PNP، کشورهای اروپایی یا آمریکا', href: '/which-path' },
  { label: 'منتورشیپ ویزارودز', note: 'برنامه‌ی همراهی ما، قدم به قدم', href: '/mentorship' },
  { label: 'مقاله‌های برنامه‌های استانی', note: 'تحلیل دعوت‌ها، تغییر قوانین و تجربه‌ها', href: '/blog/category/canada-pnp' },
  { label: 'سؤالات متداول', note: 'هزینه، زمان، نقش ما و نقش وکیل', href: '/faq' },
  { label: 'ابزار تشخیص مسیر اکسپرس انتری', note: 'برای متخصصانی که مسیر مهارتی استانی می‌خواهند (انگلیسی)', href: '/en/tools/express-entry' },
];

export const page: FaPage = {
  path: '/pnp',
  title: 'برنامه‌های استانی کانادا (PNP) برای کارآفرینان — مقایسه‌ی استان‌ها',
  description:
    'مهاجرت کارآفرینی استانی کانادا: وضعیت و شرایط آلبرتا، منیتوبا، نوااسکوشیا، نیوبرانزویک و جزیره‌ی پرنس ادوارد در ۲۰۲۶، مراحل از EOI تا اقامت دائم، و کاری که ویزارودز در این مسیر برای شما انجام می‌دهد.',
  keywords: ['برنامه استانی کانادا', 'PNP کانادا', 'مهاجرت کارآفرینی استانی کانادا', 'برنامه کارآفرینی آلبرتا', 'PNP یا استارتاپ ویزا'],
  updated: CHECKED,

  image: 'pnp',
  imageAlt: 'ردیف صندلی‌های چوبی خالی کنار پنجره‌ی بلند در سالنی ساده، نماد برنامه‌های استانی کانادا',
  entity: { name: 'Provincial Nominee Program (PNP) — Entrepreneur streams', provider: 'Provinces of Canada', country: 'Canada' },
  facts: [
    { label: 'استان‌های تخصص ما', value: 'آلبرتا، منیتوبا، نوااسکوشیا، نیوبرانزویک، جزیره‌ی پرنس ادوارد' },
    { label: 'کمترین دارایی خالص', value: '۳۰۰٬۰۰۰ دلار کانادا', note: 'آلبرتا، مسیر روستایی' },
    { label: 'کمترین سرمایه‌گذاری', value: '۱۰۰٬۰۰۰ دلار کانادا', note: 'آلبرتا؛ نوااسکوشیا بیرون از هلیفکس' },
    { label: 'ترتیب مراحل', value: 'مجوز کار، اداره‌ی کسب‌وکار، نامزدی، اقامت دائم' },
    { label: 'استارتاپ ویزای فدرال', value: 'متوقف از ۳۰ ژوئن ۲۰۲۶' },
  ],
  hero: {
    eyebrow: 'کانادا · برنامه‌های کارآفرینی استانی (PNP)',
    headline: 'مهاجرت کارآفرینی به کانادا، از راه استان‌ها',
    sub: 'استارتاپ ویزای کانادا از ۳۰ ژوئن ۲۰۲۶ متوقف است. برای کارآفرینی که سرمایه و سابقه‌ی مدیریت دارد، راه ورود حالا مسیرهای کارآفرینی استانی است: کسب‌وکاری را در یک استان می‌سازید یا می‌خرید، با مجوز کار اداره‌اش می‌کنید و استان شما را برای اقامت دائم نامزد می‌کند. ما استان درست را با شما انتخاب می‌کنیم و بیزینس‌پلن، مدل مالی و آمادگی مصاحبه را می‌سازیم.',
    cta: { label: 'کدام استان برای شما منطقی است؟', href: '/which-path' },
  },

  // Not rendered by the hub; kept so the module stays a valid FaPage.
  sections: [],

  faqs: [
    {
      q: 'PNP کارآفرینی با استارتاپ ویزا چه فرقی دارد؟',
      a: 'استارتاپ ویزا سرمایه‌گذاری الزامی نداشت و به نامه‌ی حمایت یک سازمان تأییدشده تکیه می‌کرد؛ اکنون متوقف است. مسیرهای کارآفرینی استانی حداقل دارایی خالص و سرمایه‌گذاری مشخص دارند، کسب‌وکار سنتی و سودآور را هم می‌پذیرند، و از شما می‌خواهند در همان استان زندگی و کار کنید.',
    },
    {
      q: 'حداقل سرمایه برای مسیر کارآفرینی استانی چقدر است؟',
      a: 'در پنج استانی که با آن‌ها کار می‌کنیم، حداقل دارایی خالص از ۳۰۰ هزار دلار کانادا (آلبرتا) تا ۶۰۰ هزار دلار (نوااسکوشیا در هلیفکس و جزیره‌ی پرنس ادوارد) و حداقل سرمایه‌گذاری از ۱۰۰ هزار تا ۲۵۰ هزار دلار است. ارقام را استان‌ها تغییر می‌دهند؛ هر راهنما منبع رسمی‌اش را دارد.',
    },
    {
      q: 'از درخواست تا اقامت دائم چقدر طول می‌کشد؟',
      a: 'بسته به استان، پیش از نامزدی باید ۶ تا ۱۲ ماه کسب‌وکار را با مجوز کار اداره کنید. با زمان دعوت، بررسی درخواست و پرونده‌ی فدرال، کل مسیر معمولاً چند سال است. زمان دقیق به دورهای دعوت و صف هر استان بستگی دارد.',
    },
    {
      q: 'باید حتماً در همان استان بمانم؟',
      a: 'استان شما را نامزد می‌کند چون قصد اقامت در آن را اعلام کرده‌اید. پس از اقامت دائم آزادی رفت‌وآمد دارید، اما نقل مکان سریع می‌تواند اظهار نادرست تلقی شود. قصد واقعی اقامت در استان را داشته باشید.',
    },
    {
      q: 'شما پرونده را ثبت می‌کنید؟',
      a: 'خیر. ما وکیل یا مشاور رسمی مهاجرت نیستیم و پرونده‌ی استانی یا فدرال ثبت نمی‌کنیم. کار ما پیش از آن است: انتخاب استان، ساختن بیزینس‌پلن و مدل مالی، و آمادگی مصاحبه. ثبت پرونده را خودتان یا مشاور رسمی دارای مجوز انجام می‌دهد.',
    },
  ],

  closing: [
    { label: 'کدام استان؟ ارزیابی رایگان', href: '/which-path' },
    { label: 'گفت‌وگو در تلگرام', href: TELEGRAM_URL },
  ],
};
