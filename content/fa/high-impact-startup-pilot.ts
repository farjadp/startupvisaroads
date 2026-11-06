// ============================================================================
// content/fa/high-impact-startup-pilot.ts
// «پایلوت High Impact Start-up» — برنامه‌ای که IRCC برای جایگزینی ویزای
// استارتاپ کانادا اعلام کرده. Written for the Iranian founder's search
// intent; it is the Persian twin of the English /high-impact-startup-pilot
// page and carries the same facts, with the same three-way key:
//   رسمی        — IRCC یا Canada Gazette گفته
//   گزارش‌شده   — رسانه یا اندیشکده گفته، نه IRCC
//   منتشر نشده  — هیچ‌کس نگفته
//
// Sources read on 2026-11-05:
//   - IRCC notice, 19 Dec 2025 ("immigration-measures-entrepreneurs"): SUV
//     work permit and SUV intake end; "a new, targeted pilot for immigrant
//     entrepreneurs"; more information "in 2026"; self-employed programme
//     paused "until further notice".
//   - IRCC Deputy Minister transition binder 2026, economic immigration:
//     "launch of a new High Impact Start-up Pilot to replace the Start-Up
//     Visa Program"; business-programs target 500 for 2026; no date, criteria
//     or targets for the pilot.
//   - IRCC Start-up Visa Program page: paused 30 June 2026; backlog reason.
//   - IRCC "assessing the application" (page dated 2026-03-12): $200,000 VC /
//     $75,000 angel minimums, CLB 5, commitment-certificate rules.
//   - Canada Gazette Part I, 20 Dec 2025: index entry for the new Ministerial
//     Instructions (title only; text not read).
//   - immigration.ca (24 Mar 2026), quoting the 2026-27 Departmental Plan:
//     "new high impact Start-Up Visa pilot", "elite entrepreneurs"; ~5,605
//     admissions in 2024 (reported, not IRCC's).
//   - RBC Thought Leadership, Sept 2026: suggests piloting a *temporary*
//     entrepreneurship pathway; a recommendation, not policy.
//
// THE 2027 CLAIM IS NOT IN ANY OF THESE. IRCC promised details "in 2026" and
// has published none. 2027 is VisaRoads' expectation and the page says so.
// The ~2,000-a-year cap and ~12-month target are trade-press (Dec 2025) and
// are labelled that way. No VisaRoads price, by rule; no country of departure.
// ============================================================================
import type { FaPage } from '@/lib/fa/content';
import { TELEGRAM_URL } from './home';
import type { Cell, FileRow, TimelineItem } from '@/app/[locale]/(public)/high-impact-startup-pilot/_motion';

export const page: FaPage = {
  path: '/high-impact-startup-pilot',
  title: 'پایلوت High Impact Start-up کانادا: چه می‌دانیم، چه نمی‌دانیم',
  description:
    'IRCC پایلوت High Impact Start-up را برای جایگزینی ویزای استارتاپ متوقف‌شده اعلام کرده. چه چیزی رسمی است، چه چیزی فقط گزارش شده و چه چیزی هنوز منتشر نشده؛ و چرا انتظار ما ۲۰۲۷ است.',
  keywords: [
    'پایلوت High Impact Start-up',
    'جایگزین ویزای استارتاپ کانادا',
    'ویزای استارتاپ کانادا ۲۰۲۷',
    'ویزای استارتاپ کانادا بعد از توقف',
    'پایلوت کارآفرینی کانادا',
    'ویزای استارتاپ کانادا باز می‌شود؟',
  ],
  updated: '2026-11-05',

  hero: {
    eyebrow: 'کانادا · High Impact Start-up Pilot',
    headline: 'پایلوت High Impact Start-up: جایگزین اعلام‌شده‌ی ویزای استارتاپ کانادا',
    sub: 'IRCC ویزای استارتاپ را متوقف کرده و گفته برنامه‌ای هدفمند برای «کارآفرینان نخبه» جایش می‌آید. شرایط، ظرفیت و تاریخ بازشدنش را هنوز منتشر نکرده است. انتظار ما بازشدن در ۲۰۲۷ است؛ این انتظار ماست، نه اعلام IRCC.',
    cta: { label: 'ببینیم امروز کدام مسیر باز است', href: '/which-path' },
  },

  status: {
    tone: 'paused',
    title: 'اعلام شده، هنوز باز نشده',
    body: 'پایلوت هنوز پرونده نمی‌پذیرد و چیزی برای ثبت‌نام وجود ندارد. ویزای استارتاپ هم از ۳۰ ژوئن ۲۰۲۶ متوقف است. هیچ‌کس نمی‌تواند برایتان جایی در پایلوت رزرو کند؛ اگر کسی چنین وعده‌ای داد، چیزی می‌فروشد که وجود ندارد.',
    cta: { label: 'وضعیت ویزای استارتاپ متوقف‌شده', href: '/canada-startup-visa' },
  },

  image: 'high-impact',
  imageAlt: 'برج صلح پارلمان کانادا در اتاوا، با پرچم کانادا بر فراز آن در آسمان آبی',
  gallery: [
    { src: 'high-impact-2', alt: 'خط آسمان تورنتو از روی دریاچه، با برج CN در میانه، در روزی صاف', caption: 'تورنتو. به‌همراه ونکوور، جایی که به شمارش رسانه‌ها بیشتر پذیرفته‌شدگان برنامه‌ی قدیمی در آن ساکن شدند.' },
    { src: 'high-impact-3', alt: 'برج‌های شیشه‌ای اداری مرکز ونکوور زیر آسمان ابری، با جرثقیلی در میانشان' },
  ],

  entity: { name: 'High Impact Start-up Pilot (Canada)', provider: 'IRCC', country: 'Canada' },

  facts: [
    { label: 'وضعیت', value: 'اعلام‌شده؛ هنوز باز نشده', note: 'IRCC، سند انتقال معاون وزیر ۲۰۲۶' },
    { label: 'تاریخ بازشدن', value: 'منتشر نشده', note: 'انتظار ما ۲۰۲۷ است؛ اعلام IRCC نیست' },
    { label: 'شرایط پذیرش', value: 'منتشر نشده' },
    { label: 'ظرفیت پایلوت', value: 'منتشر نشده', note: 'هدف ۲۰۲۶ برای همه‌ی برنامه‌های تجاری فدرال: ۵۰۰ نفر' },
    { label: 'سقف ۲٬۰۰۰ نفر در سال', value: 'گزارش رسانه‌ای', note: 'در canada.ca نیست' },
    { label: 'ویزای استارتاپ فعلی', value: 'متوقف از ۳۰ ژوئن ۲۰۲۶', note: 'به بیان خود IRCC' },
    { label: 'گروه هدف', value: '«کارآفرینان نخبه»', note: 'عبارت برنامه‌ی عملیاتی IRCC به نقل رسانه' },
  ],

  sections: [
    {
      heading: 'این پایلوت دقیقاً چیست؟',
      body: [
        'ویزای استارتاپ کانادا به بنیان‌گذارانی اقامت دائم می‌داد که یک سازمان تأییدشده (صندوق سرمایه‌گذاری، گروه فرشته یا انکوباتور) پشت کسب‌وکارشان ایستاده بود. IRCC آن را متوقف کرد و دلیلش را انباشت پرونده و انتظار طولانی گفت.',
        'پایلوت High Impact Start-up قرار است جای آن بنشیند. این نام در سند انتقال معاون وزیر IRCC برای ۲۰۲۶ آمده: «راه‌اندازی یک پایلوت جدید High Impact Start-up برای جایگزینی برنامه‌ی ویزای استارتاپ». اطلاعیه‌ی دسامبر ۲۰۲۵ هم قبلاً از «پایلوتی جدید و هدفمند برای کارآفرینان مهاجر» خبر داده بود.',
        'نام نهایی هنوز قطعی نیست. برنامه‌ی عملیاتی ۲۰۲۶–۲۷ IRCC، به نقل رسانه، از «پایلوت جدید ویزای استارتاپ با اثر بالا» حرف می‌زند. «High Impact» عنوانی است که هر دو سند به آن نزدیک‌اند، نه عنوان نهایی اعلام‌شده.',
      ],
    },
    {
      heading: 'چه چیزی رسمی است، چه چیزی گزارش شده و چه چیزی هنوز منتشر نشده',
      body: [
        'این صفحه هر ادعا را در یکی از سه گروه می‌گذارد: «رسمی» یعنی IRCC یا Canada Gazette گفته؛ «گزارش‌شده» یعنی رسانه یا اندیشکده گفته و IRCC نگفته؛ «منتشر نشده» یعنی هیچ‌کس نگفته و ما حدس نمی‌زنیم.',
      ],
      table: {
        caption: 'وضعیت هر ادعا',
        head: ['موضوع', 'وضعیت', 'آنچه می‌دانیم'],
        rows: [
          ['جایگزین در راه است؟', 'رسمی', 'بله. سند انتقال معاون وزیر و اطلاعیه‌ی دسامبر ۲۰۲۵'],
          ['تاریخ بازشدن', 'منتشر نشده', 'IRCC در دسامبر ۲۰۲۵ گفت اطلاعات بیشتر «در ۲۰۲۶» می‌آید؛ تا ۵ نوامبر ۲۰۲۶ چیزی منتشر نشده'],
          ['چه کسی واجد شرایط است', 'منتشر نشده', 'شرایط و روند درخواست منتشر نشده؛ فقط عبارت «کارآفرینان نخبه» در برنامه‌ی عملیاتی آمده'],
          ['ظرفیت پایلوت', 'منتشر نشده', 'هدف ۲۰۲۶ برای همه‌ی برنامه‌های تجاری فدرال روی هم ۵۰۰ نفر است'],
          ['سقف حدود ۲٬۰۰۰ نفر و پردازش ۱۲ ماهه', 'گزارش‌شده', 'از رسانه‌های مهاجرتی، دسامبر ۲۰۲۵. در canada.ca نیست'],
          ['نیاز به سازمان تأییدشده', 'منتشر نشده', 'نمی‌دانیم مدل گواهی تعهد می‌ماند، سخت‌تر می‌شود یا برمی‌افتد'],
          ['ثبت پرونده امروز', 'رسمی', 'ممکن نیست. ویزای استارتاپ متوقف است و برای پایلوت چیزی برای ثبت وجود ندارد'],
        ],
        note: 'منابع: IRCC (اطلاعیه‌ی دسامبر ۲۰۲۵؛ سند انتقال معاون وزیر ۲۰۲۶؛ صفحه‌ی برنامه‌ی ویزای استارتاپ) و immigration.ca. بررسی‌شده در ۵ نوامبر ۲۰۲۶.',
      },
    },
    {
      heading: 'چرا می‌گوییم ۲۰۲۷؟',
      body: [
        'هیچ سند رسمی‌ای تاریخ بازشدن نداده است. چیزی که داریم این است: IRCC در دسامبر ۲۰۲۵ گفت جزئیات «در ۲۰۲۶» اعلام می‌شود. ۲۰۲۶ تقریباً تمام شده و جزئیاتی منتشر نشده. برنامه‌ای که هنوز شرط پذیرش ندارد، معمولاً ابتدا باید قواعدش منتشر شود و بعد پرونده بپذیرد؛ پس بازشدن در ۲۰۲۶ بعید به نظر می‌رسد.',
        'انتظار ۲۰۲۷ از همین استدلال و از حرف‌های فضای مهاجرت می‌آید، نه از بیانیه‌ی IRCC. اگر IRCC تاریخ دیگری بدهد، این صفحه همان روز اصلاح می‌شود.',
      ],
      callout: 'برای تصمیم‌هایی که پول یا زمان واقعی می‌برند، ۲۰۲۷ را «احتمال» حساب کنید، نه برنامه‌ی قطعی.',
    },
    {
      heading: 'ویزای استارتاپ قدیمی و پایلوت جدید، کنار هم',
      body: ['ستون قدیمی از صفحه‌های رسمی IRCC است. ستون جدید جز یک سطر، «منتشر نشده» است؛ همین بخش اصلی خبر است.'],
      table: {
        caption: 'مقایسه',
        head: ['', 'ویزای استارتاپ (متوقف)', 'پایلوت High Impact Start-up'],
        rows: [
          ['وضعیت', 'متوقف از ۳۰ ژوئن ۲۰۲۶', 'اعلام‌شده، باز نشده'],
          ['پشتوانه‌ی بنیان‌گذار', 'سازمان تأییدشده: صندوق، فرشته یا انکوباتور', 'منتشر نشده'],
          ['حداقل سرمایه‌ی متعهدشده', '۲۰۰٬۰۰۰ دلار کانادا (صندوق) یا ۷۵٬۰۰۰ دلار کانادا (فرشته)', 'منتشر نشده'],
          ['زبان', 'CLB 5 در هر چهار مهارت', 'منتشر نشده'],
          ['گروه هدف', 'بنیان‌گذار با کسب‌وکار واجد شرایط و گواهی تعهد', '«کارآفرینان نخبه»، اثر اقتصادی قابل‌سنجش (گزارش‌شده)'],
          ['پذیرش سالانه', 'حدود ۵٬۶۰۵ نفر در ۲۰۲۴ (گزارش رسانه‌ای)', 'منتشر نشده'],
        ],
        note: 'ارقام ستون قدیمی: صفحه‌ی «assessing the application» در canada.ca. رقم پذیرش ۲۰۲۴ از immigration.ca است، نه IRCC.',
      },
    },
    {
      heading: 'چرا کانادا ویزای استارتاپ را عوض می‌کند؟',
      body: [
        'IRCC می‌گوید برنامه را برای رفع انباشت پرونده و انتظار طولانی متوقف کرده؛ ورودی پرونده از ظرفیت پذیرش بیشتر شده بود.',
        'گزارش سپتامبر ۲۰۲۶ بانک RBC انتقاد تندتری دارد: برنامه اقامت دائم را بر پایه‌ی سرمایه یا حمایت انکوباتور می‌داد، بی‌آنکه معلوم شود ایده واقعی بود یا موفق شد. این نظر RBC است، نه IRCC. RBC همچنین پیشنهاد می‌کند کانادا یک مسیر کارآفرینی «موقت» را برای بنیان‌گذاران با سابقه آزمایش کند. این پیشنهاد است، نه سیاست.',
        'رسانه‌های مهاجرتی از عبارت IRCC نتیجه می‌گیرند که پایلوت کوچک‌تر و گزینشی‌تر است و سازمان‌های تأییدشده را هم دقیق‌تر وارسی می‌کند. این برداشت نویسنده‌هاست، نه متن IRCC.',
      ],
    },
    {
      heading: 'تا باز شدن پایلوت چه کار می‌شود کرد؟',
      body: [
        'هیچ‌چیز را نمی‌شود رزرو کرد، اما چند کار در هر نسخه‌ای از قواعد به درد می‌خورد.',
      ],
      checklist: {
        title: 'آماده‌سازی که به قواعد نهایی بستگی ندارد',
        intro: 'هر مورد را همراه تاریخ و منبع نگه دارید.',
        items: [
          'شواهد اثرگذاری: درآمد، مشتریان قراردادی، کاربران فعال و نقاط عطف محصول، هر کدام با تاریخ. «اثر اقتصادی قابل‌سنجش» تنها معیاری است که IRCC به آن اشاره کرده.',
          'جدول سهامداری و شرکت واقعی: مالکیت روشن، توافق‌نامه‌ی بنیان‌گذاران، مالکیت فکری به نام شرکت، و منشأ قابل‌ردیابی پول.',
          'نتیجه‌ی آزمون زبان که منقضی نمی‌شود: ویزای استارتاپ CLB 5 در هر چهار مهارت می‌خواست، از آزمونی که کمتر از دو سال پیش از ثبت داده شده باشد. زمان آزمون را به بازشدن وصل کنید، نه زودتر.',
          'برنامه‌ای که به یک در بسته نباشد: اگر امسال باید حرکت کنید، مسیرهای باز امروز را مقایسه کنید و پایلوت را امتیاز اضافه بدانید.',
        ],
      },
      bullets: [
        'هر کس برای «ثبت‌نام زودهنگام» یا «رزرو جا در پایلوت» پول خواست، چیزی می‌فروشد که وجود ندارد.',
        'گواهی تعهد ویزای استارتاپ را برای پایلوت نگه‌دارید یا نه؟ IRCC نگفته؛ پس بر پایه‌اش خرج نکنید.',
      ],
    },
    {
      heading: 'مسیرهای بازِ امروز',
      body: [
        'اگر نمی‌توانید تا ۲۰۲۷ صبر کنید، سه جا را ببینید: مسیرهای کارآفرینی استانی کانادا (برنامه‌های PNP) که هنوز بنیان‌گذار می‌پذیرند، چند مسیر اروپایی مثل فنلاند و دانمارک، و ارزیابی رایگانی که شرایط شما را با شرایط منتشرشده می‌سنجد. ما نه وکیل مهاجرتیم و نه می‌توانیم جایی در پایلوت تضمین کنیم؛ تیم و استارتاپ شما را برای پذیرش آماده می‌کنیم.',
      ],
    },
  ],

  faqs: [
    {
      q: 'پایلوت High Impact Start-up چیست؟',
      a: 'پایلوتی است که IRCC برای جایگزینی ویزای استارتاپ کانادا اعلام کرده؛ ویزای استارتاپ در ۲۰۲۶ پرونده‌ی جدید نمی‌پذیرد. سند انتقال معاون وزیر IRCC برای ۲۰۲۶ آن را «High Impact Start-up Pilot» نامیده است. شرایط، ظرفیت و تاریخ بازشدنش هنوز منتشر نشده.',
    },
    {
      q: 'پایلوت High Impact Start-up کی باز می‌شود؟',
      a: 'IRCC تاریخی اعلام نکرده است. اطلاعیه‌ی دسامبر ۲۰۲۵ گفت اطلاعات بیشتر در ۲۰۲۶ می‌آید و تا ۵ نوامبر ۲۰۲۶ چیزی منتشر نشده. انتظار ما ۲۰۲۷ است؛ این برداشت ماست، نه اعلام IRCC.',
    },
    {
      q: 'این پایلوت همان ویزای استارتاپ است؟',
      a: 'نه. جایگزین اعلام‌شده‌ی آن است. IRCC می‌گوید پایلوت جای ویزای استارتاپ را می‌گیرد و مشکلات دیده‌شده‌ی آن را برطرف می‌کند. ویزای استارتاپ متوقف شده، نه اینکه تغییر نام داده باشد.',
    },
    {
      q: '«High Impact» نام رسمی است؟',
      a: 'در سند انتقال معاون وزیر IRCC برای ۲۰۲۶ به‌صورت «High Impact Start-up Pilot» آمده. برنامه‌ی عملیاتی ۲۰۲۶–۲۷، به نقل رسانه، «پایلوت جدید ویزای استارتاپ با اثر بالا» می‌گوید. نام نهایی هنوز اعلام نشده.',
    },
    {
      q: 'همین حالا می‌شود برای پایلوت اقدام کرد؟',
      a: 'نه. برای پایلوت چیزی برای ثبت وجود ندارد و ویزای استارتاپ هم متوقف است. جایی را نمی‌شود رزرو کرد؛ برای «جای پایلوت» پول ندهید.',
    },
    {
      q: 'گواهی تعهد ویزای استارتاپ در پایلوت به درد می‌خورد؟',
      a: 'نمی‌دانیم. IRCC نگفته گواهی تعهد یا هر بخش دیگری از روند قدیمی به پایلوت منتقل می‌شود یا نه.',
    },
    {
      q: 'پایلوت چند نفر را می‌پذیرد؟',
      a: 'IRCC رقمی برای پایلوت منتشر نکرده. هدف رسمی ۲۰۲۶ برای همه‌ی برنامه‌های تجاری فدرال روی هم ۵۰۰ نفر است. سقف حدود ۲٬۰۰۰ نفر در سال را رسانه‌ها گزارش کرده‌اند و رقم IRCC نیست.',
    },
    {
      q: 'تا باز شدن پایلوت چه کار کنم؟',
      a: 'شواهد اثرگذاری را با تاریخ نگه دارید، مالکیت و مالکیت فکری را مرتب کنید، آزمون زبان را به زمان بازشدن وصل کنید و مسیرهای باز امروز را مقایسه کنید. هیچ‌چیز را نمی‌شود از پیش رزرو کرد.',
    },
  ],

  closing: [
    { label: 'کدام مسیر امروز باز است؟ ارزیابی رایگان', href: '/which-path' },
    { label: 'وضعیت ویزای استارتاپ متوقف‌شده', href: '/canada-startup-visa' },
    { label: 'مسیرهای کارآفرینی استانی کانادا', href: '/pnp' },
    { label: 'گفت‌وگو در تلگرام', href: TELEGRAM_URL },
  ],

  sources: [
    { label: 'IRCC، اقدامات مربوط به کارآفرینان (دسامبر ۲۰۲۵)', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/immigration-measures-entrepreneurs.html' },
    { label: 'IRCC، سند انتقال معاون وزیر ۲۰۲۶: مهاجرت اقتصادی', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/transition-binders/deputy-minister-2026/economic-immigration.html' },
    { label: 'IRCC، برنامه‌ی ویزای استارتاپ', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/about.html' },
    { label: 'IRCC، Start-up Business Class: assessing the application', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/permanent-residence/economic-classes/start-business/assessing-application.html' },
    { label: 'Canada Gazette، بخش اول، ۲۰ دسامبر ۲۰۲۵', url: 'https://gazette.gc.ca/rp-pr/p1/2025/2025-12-20/html/index-eng.html' },
    { label: 'immigration.ca (رسانه، مارس ۲۰۲۶)', url: 'https://immigration.ca/canada-plans-high-impact-start-up-visa-pilot-after-pausing-existing-program/' },
    { label: 'RBC Thought Leadership، سپتامبر ۲۰۲۶', url: 'https://www.rbc.com/en/thought-leadership/wp-content/uploads/sites/27/2026/09/A-Smarter-Immigration-Strategy-Report-EN.pdf' },
  ],
};

// ============================================================================
// The dossier the Persian page is built from, mirroring the English twin:
// the three verbatim lines of the official record, the file field by field,
// the timeline, and the four preparations. The `page` object above still
// carries the metadata, facts, FAQ and sources for JSON-LD; its sections are
// the fallback text and the autopilot's reference, not what the page renders.
// ============================================================================

export const SOURCES_FA = {
  notice: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/immigration-measures-entrepreneurs.html',
  binder: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/transition-binders/deputy-minister-2026/economic-immigration.html',
  gazette: 'https://gazette.gc.ca/rp-pr/p1/2025/2025-12-20/html/index-eng.html',
  assessing:
    'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/permanent-residence/economic-classes/start-business/assessing-application.html',
  about: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/about.html',
  press: 'https://immigration.ca/canada-plans-high-impact-start-up-visa-pilot-after-pausing-existing-program/',
  rbc: 'https://www.rbc.com/en/thought-leadership/wp-content/uploads/sites/27/2026/09/A-Smarter-Immigration-Strategy-Report-EN.pdf',
} as const;

/** Verbatim, in English, because the quotation is the evidence; the Persian line under each says who and when. */
export const QUOTES_FA: { text: string; who: string; when: string; href: string; official: boolean }[] = [
  { text: 'a new, targeted pilot program for immigrant entrepreneurs', who: 'اطلاعیه‌ی IRCC، اقدامات مربوط به کارآفرینان', when: 'دسامبر ۲۰۲۵', href: SOURCES_FA.notice, official: true },
  { text: 'launch of a new High Impact Start-up Pilot to replace the Start-Up Visa Program', who: 'IRCC، سند انتقال معاون وزیر، مهاجرت اقتصادی', when: '۲۰۲۶', href: SOURCES_FA.binder, official: true },
  { text: 'elite entrepreneurs', who: 'برنامه‌ی عملیاتی ۲۰۲۶–۲۷ IRCC، به نقل immigration.ca', when: 'مارس ۲۰۲۶', href: SOURCES_FA.press, official: false },
];

const blank: Cell = { kind: 'blank' };

export const FILE_FA: FileRow[] = [
  { field: 'وضعیت', old: { kind: 'filled', text: 'متوقف از ۳۰ ژوئن ۲۰۲۶', href: SOURCES_FA.about }, pilot: { kind: 'filled', text: 'اعلام‌شده. باز نیست', href: SOURCES_FA.binder } },
  { field: 'تاریخ بازشدن', old: { kind: 'filled', text: 'بسته به روی پرونده‌ی جدید' }, pilot: blank },
  { field: 'چه کسی واجد شرایط است', old: { kind: 'filled', text: 'بنیان‌گذار با کسب‌وکار واجد شرایط و گواهی تعهد', href: SOURCES_FA.assessing }, pilot: blank },
  { field: 'پشتوانه‌ی بنیان‌گذار', old: { kind: 'filled', text: 'یک سازمان تأییدشده: صندوق سرمایه‌گذاری، گروه فرشته یا انکوباتور', href: SOURCES_FA.assessing }, pilot: blank },
  { field: 'حداقل سرمایه‌ی متعهدشده', old: { kind: 'filled', text: '۲۰۰٬۰۰۰ دلار کانادا از صندوق سرمایه‌گذاری، یا ۷۵٬۰۰۰ دلار کانادا از گروه فرشته', href: SOURCES_FA.assessing }, pilot: blank },
  { field: 'زبان', old: { kind: 'filled', text: 'CLB 5 در هر چهار مهارت', href: SOURCES_FA.assessing }, pilot: blank },
  { field: 'پذیرش سالانه', old: { kind: 'reported', text: 'حدود ۵٬۶۰۵ نفر در ۲۰۲۴', href: SOURCES_FA.press }, pilot: { kind: 'reported', text: 'حدود ۲٬۰۰۰ نفر در سال', href: SOURCES_FA.press } },
  { field: 'زمان پردازش', old: blank, pilot: { kind: 'reported', text: 'هدف ۱۲ ماه' } },
];

export const TIMELINE_FA: TimelineItem[] = [
  { when: 'دسامبر ۲۰۲۵', iso: '2025-12-19', what: 'IRCC پذیرش مجوز کار ویزای استارتاپ را متوقف می‌کند و از پایلوتی هدفمند برای کارآفرینان مهاجر خبر می‌دهد.' },
  { when: '۲۰ دسامبر ۲۰۲۵', iso: '2025-12-20', what: 'دستورالعمل وزارتی جدید برای Start-up Business Class و Self-employed Persons Class در Canada Gazette منتشر می‌شود.' },
  { when: '۳۱ دسامبر ۲۰۲۵', iso: '2025-12-31', what: 'سازمان‌های تأییدشده صدور گواهی تعهد برای پرونده‌ی جدید را متوقف می‌کنند.' },
  { when: '۳۰ ژوئن ۲۰۲۶', iso: '2026-06-30', what: 'تاریخ توقف به بیان IRCC: آخرین روز ثبت پرونده با گواهی معتبر ۲۰۲۵.' },
  { when: '۲۰۲۶', iso: '2026', what: 'سند انتقال معاون وزیر نام «High Impact Start-up Pilot» را می‌آورد؛ بی‌تاریخ و بی‌شرط.' },
  { when: '۲۰۲۷', iso: '2027', ours: true, what: 'انتظار ما برای بازشدن. تاریخ IRCC نیست.' },
];

export const BEFORE_FA: { title: string; body: string }[] = [
  { title: 'شواهد اثرگذاری، با تاریخ', body: 'درآمد، مشتریان قراردادی، کاربران فعال و نقاط عطف محصول، هر کدام با تاریخ و منبع. «اثر اقتصادی قابل‌سنجش» تنها معیاری است که IRCC به آن اشاره کرده و هر نسخه‌ای از آن مدرک می‌خواهد.' },
  { title: 'جدول سهامداری تمیز و شرکت واقعی', body: 'مالکیت روشن، توافق‌نامه‌ی بنیان‌گذاران، مالکیت فکری به نام شرکت و منشأ قابل‌ردیابی پول. برنامه‌ی قدیمی به اندازه‌ی ایده روی ساختار هم حساس بود.' },
  { title: 'نتیجه‌ی زبانی که منقضی نشود', body: 'ویزای استارتاپ CLB 5 در هر چهار مهارت می‌خواست، از آزمونی که کمتر از دو سال پیش از ثبت داده شده باشد. پایلوت دست‌کم همین را می‌خواهد؛ زمان آزمون را به بازشدن وصل کنید، نه زودتر.' },
  { title: 'برنامه‌ای که به یک در بسته نباشد', body: 'تا وقتی IRCC منتشر نکرده، هیچ‌چیز قطعی نیست. اگر امسال باید حرکت کنید، مسیرهای باز امروز را مقایسه کنید و پایلوت را امتیاز اضافه بدانید.' },
];

export const READINGS_FA: { who: string; tag?: string; lead: string; body: string; href: string; reported: boolean }[] = [
  { who: 'IRCC', lead: 'انباشت پرونده.', body: 'برنامه برای رفع انباشت پرونده و انتظار طولانی متوقف شد؛ ورودی از ظرفیت پذیرش بیشتر بود.', href: SOURCES_FA.about, reported: false },
  { who: 'RBC', tag: 'اندیشکده', lead: 'سرمایه به‌جای اثبات', body: 'گزارش سپتامبر ۲۰۲۶ RBC می‌گوید برنامه اقامت دائم را بر پایه‌ی سرمایه یا حمایت انکوباتور می‌داد، بی‌آنکه معلوم شود ایده واقعی بود یا موفق شد، و پیشنهاد می‌کند یک مسیر کارآفرینی «موقت» آزمایش شود. پیشنهاد است، نه سیاست.', href: SOURCES_FA.rbc, reported: true },
  { who: 'رسانه‌ها', tag: 'برداشت', lead: 'کوچک‌تر و سخت‌گیرتر', body: 'پایلوتی گزینشی‌تر با وارسی دقیق‌تر کسب‌وکار و سازمان‌های تأییدشده. از عبارت IRCC برداشت شده، نه نوشته‌ی IRCC.', href: SOURCES_FA.press, reported: true },
];
