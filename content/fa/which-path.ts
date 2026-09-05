// ============================================================================
// content/fa/which-path.ts
// Copy for the /fa/which-path assessment. Question ids and option values
// must match QuizAnswers in lib/fa/path-quiz.ts — the component maps them
// 1:1 and the compiler checks it.
// ============================================================================
import type { QuizAnswers } from '@/lib/fa/path-quiz';
import { TELEGRAM_URL } from './home';

export type Question<K extends keyof QuizAnswers = keyof QuizAnswers> = {
  id: K;
  title: string;
  hint?: string;
  options: { value: QuizAnswers[K]; label: string; detail?: string }[];
};

export const meta = {
  path: '/which-path',
  title: 'کدام مسیر مهاجرت برای من مناسب است؟ — ارزیابی رایگان ۳ دقیقه‌ای',
  description:
    'شش سؤال درباره‌ی هدف، کسب‌وکار، زبان، سرمایه، سابقه و زمان‌بندی شما. خروجی: مسیر پیشنهادی بین ویزای استارتاپ کانادا، برنامه‌های استانی و EB-2 NIW آمریکا — با دلیل، نه یک فرم بی‌جواب.',
  keywords: ['کدام مسیر مهاجرت', 'ارزیابی رایگان مهاجرت', 'تست واجد شرایط بودن مهاجرت', 'ویزای استارتاپ یا PNP', 'ارزیابی مهاجرت کارآفرینی'],
};

export const intro = {
  eyebrow: 'رایگان · ۶ سؤال · ۳ دقیقه',
  headline: 'کدام مسیر برای شما منطقی است؟',
  sub: 'این ارزیابی به شما نمی‌گوید «واجد شرایط هستید». به شما می‌گوید کدام یک از سه مسیر با وضعیت واقعی امروزتان می‌خواند، چرا، و چه چیزی هنوز کم است. گاهی پاسخ درست «هنوز زود است» است — و آن هم یک پاسخ است.',
  start: 'شروع ارزیابی',
  privacy: 'پاسخ‌ها فقط برای محاسبه‌ی نتیجه استفاده می‌شوند. تا وقتی خودتان نخواهید، هیچ چیزی ارسال نمی‌شود.',
};

export const questions: Question[] = [
  {
    id: 'goal',
    title: 'هدف اصلی شما از مهاجرت چیست؟',
    options: [
      { value: 'residency', label: 'اقامت دائم برای خودم و خانواده', detail: 'کسب‌وکار وسیله است، نه هدف' },
      { value: 'growth', label: 'رشد کسب‌وکارم در بازار جهانی', detail: 'اقامت نتیجه‌ی جانبی است' },
      { value: 'family', label: 'آینده‌ی تحصیلی و زندگی فرزندان', detail: 'زمان و ثبات مهم‌تر از سرعت' },
    ],
  },
  {
    id: 'business',
    title: 'وضعیت کسب‌وکار شما امروز چیست؟',
    hint: 'صادقانه — کمیته‌ی سازمان تأییدشده هم همین را می‌پرسد.',
    options: [
      { value: 'none', label: 'کسب‌وکاری ندارم', detail: 'کارمند، متخصص یا پژوهشگر هستم' },
      { value: 'idea', label: 'ایده دارم، هنوز محصولی نساخته‌ام' },
      { value: 'mvp', label: 'محصول اولیه (MVP) و اولین کاربران را دارم' },
      { value: 'revenue', label: 'کسب‌وکار فعال با درآمد دارم' },
    ],
  },
  {
    id: 'language',
    title: 'سطح انگلیسی شما در حال حاضر؟',
    hint: 'معادل تقریبی IELTS General در هر مهارت.',
    options: [
      { value: 'low', label: 'زیر ۵ — یا هنوز آزمون نداده‌ام و مطمئن نیستم', detail: 'زیر CLB 5' },
      { value: 'mid', label: 'بین ۵ تا ۶.۵', detail: 'CLB 5 تا 7' },
      { value: 'high', label: '۷ و بالاتر', detail: 'بالای CLB 7' },
    ],
  },
  {
    id: 'capital',
    title: 'سرمایه‌ی قابل انتقال شما — جدا از پول زندگی — چقدر است؟',
    hint: 'به دلار کانادا. «قابل انتقال» یعنی بتوانید منشأ آن را اثبات کنید و از مسیر قانونی منتقل کنید.',
    options: [
      { value: 'under50', label: 'زیر ۵۰ هزار' },
      { value: '50to200', label: '۵۰ تا ۲۰۰ هزار' },
      { value: '200to500', label: '۲۰۰ تا ۵۰۰ هزار' },
      { value: 'over500', label: 'بیش از ۵۰۰ هزار' },
    ],
  },
  {
    id: 'background',
    title: 'کدام توصیف به شما نزدیک‌تر است؟',
    options: [
      { value: 'research', label: 'پژوهشگر یا متخصص با مقاله، ثبت اختراع یا سابقه‌ی دانشگاهی', detail: 'کارشناسی ارشد یا دکتری' },
      { value: 'professional', label: 'متخصص یا مدیر با سابقه‌ی کاری مشخص', detail: 'دست‌کم ۳ سال در یک حوزه' },
      { value: 'none', label: 'هیچ‌کدام دقیقاً من نیست' },
    ],
  },
  {
    id: 'horizon',
    title: 'در چه بازه‌ای می‌خواهید در مقصد باشید؟',
    hint: 'واقع‌بینانه. مسیرهای واقعی همه چندساله‌اند.',
    options: [
      { value: 'urgent', label: 'کمتر از یک سال', detail: 'هر مسیری که سریع‌تر باشد' },
      { value: 'medium', label: 'یک تا سه سال' },
      { value: 'long', label: 'بیش از سه سال', detail: 'برنامه‌ریزی بلندمدت' },
    ],
  },
];

export const ui = {
  back: 'قبلی',
  next: 'بعدی',
  finish: 'نتیجه را ببینید',
  stepOf: (n: number, total: number) => `سؤال ${n} از ${total}`,
  resultLabel: 'مسیر پیشنهادی',
  readMore: 'راهنمای کامل این مسیر',
  restart: 'ارزیابی دوباره',
  disclaimer: 'این ارزیابی جایگزین مشاوره‌ی حقوقی نیست. تصمیم نهایی درباره‌ی هر پرونده با وکیل یا مشاور رسمی مهاجرت است.',
  lead: {
    heading: 'می‌خواهید نتیجه را با هم بررسی کنیم؟',
    body: 'ایمیل یا آیدی تلگرام‌تان را بگذارید. نتیجه و پاسخ‌هایتان برای ما ارسال می‌شود و ظرف دو روز کاری با یک نظر کوتاه و صادقانه برمی‌گردیم — بدون تماس فروش.',
    name: 'نام',
    email: 'ایمیل',
    telegram: 'آیدی تلگرام (اختیاری)',
    submit: 'ارسال برای بررسی',
    sending: 'در حال ارسال…',
    done: 'دریافت شد. ظرف دو روز کاری برمی‌گردیم.',
    error: 'ارسال نشد. می‌توانید مستقیم در تلگرام پیام بدهید.',
    telegramCta: 'یا همین حالا در تلگرام بپرسید',
    telegramUrl: TELEGRAM_URL,
  },
};
