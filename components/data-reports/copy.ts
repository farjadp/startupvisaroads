// ============================================================================
// components/data-reports/copy.ts
// Fixed strings of the Data reports index, en and fa. The Persian is written
// for Persian readers, not translated.
// ============================================================================
import { toPersianDigits } from '@/lib/fa/format';

export type Lang = 'en' | 'fa';

export const COPY = {
  en: {
    metaTitle: 'Data reports: immigration job markets in numbers',
    metaDescription:
      'Statistical reports built from public government data. First series: job postings, wages and designated employers in the 14 Rural Community Immigration Pilot communities, month by month.',
    kicker: 'Data reports · Canada',
    h1: 'Where the jobs are, counted from public data.',
    directAnswer:
      "Each report takes a public government dataset, cleans it, and says what it shows and what it cannot show. The first series compares the 14 Rural Community Immigration Pilot (RCIP) communities, using Job Bank open data and each community's own list of designated employers.",
    hubNote: 'Aggregate statistics only. No employer is named, and a posting counted here is not a job offer.',
    edition: 'Data for',
    undated: 'Other reports',
    part: (n: number) => `Part ${n}`,
    published: 'Published',
    count: (n: number) => (n === 1 ? '1 report' : `${n} reports`),
    empty: 'The first report is being prepared. It will appear here when it is published.',
    sourcesTitle: 'Where the numbers come from',
    sourcesBody:
      'Job postings come from Job Bank open data, published monthly by Employment and Social Development Canada. Contains information licensed under the Open Government Licence – Canada. Designated-employer counts come from the lists each community publishes; program rules come from Immigration, Refugees and Citizenship Canada.',
    jobBank: 'Job Bank open data',
    ircc: 'IRCC: Rural Community Immigration Pilot',
    casesLead: 'Looking for court decisions rather than statistics?',
    casesLink: 'Read the case studies',
    home: 'Home',
    title: 'Data reports',
  },
  fa: {
    metaTitle: 'گزارش‌های آماری: بازار کار مسیرهای مهاجرت',
    metaDescription:
      'گزارش‌های آماری بر پایه‌ی داده‌ی عمومی دولت. مجموعه‌ی اول: آگهی‌های شغلی، دستمزد و کارفرمایان تأییدشده در ۱۴ جامعه‌ی برنامه‌ی مهاجرتی روستایی کانادا (RCIP)، ماه‌به‌ماه.',
    kicker: 'گزارش‌های آماری · کانادا',
    h1: 'کار کجاست؟ از روی داده‌ی عمومی شمرده‌ایم.',
    directAnswer:
      'هر گزارش یک مجموعه‌داده‌ی عمومی دولتی را برمی‌دارد، پاک‌سازی می‌کند و می‌گوید از آن چه می‌شود فهمید و چه نمی‌شود. مجموعه‌ی اول ۱۴ جامعه‌ی برنامه‌ی مهاجرتی روستایی کانادا (RCIP) را با داده‌ی باز Job Bank و فهرست کارفرمایان تأییدشده‌ی هر جامعه کنار هم می‌گذارد.',
    hubNote: 'فقط آمار تجمیعی. نام هیچ کارفرمایی نمی‌آید و آگهی‌ای که این‌جا شمرده شده پیشنهاد کار نیست.',
    edition: 'داده‌ی',
    undated: 'گزارش‌های دیگر',
    part: (n: number) => `بخش ${toPersianDigits(n)}`,
    published: 'انتشار',
    count: (n: number) => `${toPersianDigits(n)} گزارش`,
    empty: 'اولین گزارش در دست آماده‌سازی است و پس از انتشار همین‌جا می‌آید.',
    sourcesTitle: 'عددها از کجا آمده‌اند',
    sourcesBody:
      'آگهی‌های شغلی از داده‌ی باز Job Bank است که وزارت اشتغال و توسعه‌ی اجتماعی کانادا هر ماه منتشر می‌کند (حاوی اطلاعاتی با مجوز Open Government Licence – Canada). شمار کارفرمایان تأییدشده از فهرستی است که هر جامعه خودش منتشر کرده، و قواعد برنامه از سایت اداره‌ی مهاجرت کانادا (IRCC).',
    jobBank: 'داده‌ی باز Job Bank',
    ircc: 'IRCC: برنامه‌ی مهاجرتی روستایی',
    casesLead: 'دنبال رأی دادگاه هستید، نه آمار؟',
    casesLink: 'پرونده‌ها را بخوانید',
    home: 'خانه',
    title: 'گزارش‌های آماری',
  },
} as const;
