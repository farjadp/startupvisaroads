// ============================================================================
// content/fa/suv-status.ts
// The one place that says what state the Canada Start-up Visa is in. Every
// SUV page reads its banner from here, so a change in IRCC policy is one
// edit. Verified 2026-09-06 against IRCC notices and coverage; re-verify at
// every review — this is the most time-sensitive fact on the Persian site.
// ============================================================================
import type { FaStatus } from '@/lib/fa/content';

export const SUV_STATUS = {
  updated: '2026-09-06',
  /** PR applications: no new intake after this date. */
  prClosed: '2025-12-31',
  /** SUV open work permit: no new applications after this date. */
  workPermitClosed: '2025-12-19',
  /** Holders of a 2025 commitment certificate could still file until this date. */
  certificateDeadline: '2026-06-30',
  pilot: {
    name: 'پایلوت پرتأثیر ویزای استارتاپ',
    cap: 2000,
    targetMonths: 12,
    sectors: ['فناوری پاک', 'هوش مصنوعی', 'علوم زیستی'],
  },
};

/** Banner for the pillar page. */
export const suvPillarStatus: FaStatus = {
  tone: 'closed',
  title: 'ویزای استارتاپ کانادا به پرونده‌های جدید بسته است',
  body: 'IRCC از ۳۱ دسامبر ۲۰۲۵ پرونده‌ی جدید اقامت دائم ویزای استارتاپ نمی‌پذیرد و مجوز کار آن از ۱۹ دسامبر ۲۰۲۵ بسته شده. یک پایلوت جایگزین برای ۲۰۲۶ اعلام شده که هنوز تاریخ باز شدن رسمی ندارد. این صفحه وضعیت فعلی، پایلوت جدید و مسیرهای باز را توضیح می‌دهد.',
  cta: { label: 'مسیرهایی که امروز باز است', href: '/which-path' },
};

/** Shorter banner for the sub-pages, which keep their reference content. */
export const suvSubpageStatus: FaStatus = {
  tone: 'closed',
  title: 'این برنامه به پرونده‌های جدید بسته است',
  body: 'محتوای این صفحه به‌عنوان مرجع نگه داشته شده — برای کسانی که پرونده‌ی در جریان دارند و برای مقایسه با پایلوت ۲۰۲۶. وضعیت فعلی را در راهنمای اصلی ببینید.',
  cta: { label: 'وضعیت فعلی و پایلوت ۲۰۲۶', href: '/canada-startup-visa' },
};
