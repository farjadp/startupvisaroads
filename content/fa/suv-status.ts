// ============================================================================
// content/fa/suv-status.ts
// The Persian wording of the Canada Start-up Visa's state. Every Persian SUV
// page reads its banner from here.
//
// The DATES AND FIGURES are no longer written here: they come from
// lib/canada-suv.ts, which is quoted from canada.ca. This file used to carry
// its own set, and the two drifted apart — it said the work permit closed on
// 19 December 2025, while IRCC's own pages say an open work permit is still
// available to someone whose application was filed before the pause. A reader
// with a file in progress was being told to give up on the one thing still
// open to them. One source of truth, in Persian prose here.
//
// Verified 2026-09-12 against IRCC. Re-verify at every review — this is the
// most time-sensitive fact on the Persian site.
// ============================================================================
import type { FaStatus } from '@/lib/fa/content';
import { SUV_STATE, SUV_UNOFFICIAL, SUV_VERIFIED } from '@/lib/canada-suv';

export const SUV_STATUS = {
  updated: SUV_VERIFIED,
  /**
   * IRCC's own word is «Paused» — متوقف. We do not write «بسته» for the
   * programme as a whole: someone with a pending file would read it as «رد
   * شده», and their application is still being processed.
   */
  pausedOn: SUV_STATE.pausedOn, // ۳۰ ژوئن ۲۰۲۶
  /** Certificates had to reach IRCC before this date, so new entrants ended with 2025. */
  certificateCutoff: SUV_STATE.certificateCutoff, // ۱ ژانویه ۲۰۲۶
  /** Holders of a 2025 commitment certificate had until this date to file. */
  filingDeadline: SUV_STATE.lastIntake.filingDeadline, // ۳۰ ژوئن ۲۰۲۶
  /** The one thing still open, and the reason this file was rewritten. */
  openWorkPermitStillAvailable: SUV_STATE.openWorkPermit.availableWhileProcessing,
  extensionClosedToNewApplicants: SUV_STATE.openWorkPermit.extensionClosedToNewApplicants,
  /**
   * The replacement. IRCC has announced a targeted entrepreneur pilot and
   * published nothing else — no cap, no processing target, no criteria, no
   * opening date. The numbers that circulate in Persian channels (سقف ۲٬۰۰۰
   * نفر، هدف ۱۲ ماه) are trade-press reporting from December 2025. Pages may
   * mention them ONLY with that attribution attached.
   */
  pilot: {
    announced: SUV_UNOFFICIAL.replacementAnnounced,
    officialDetailsPublished: SUV_UNOFFICIAL.officialDetailsPublished,
    reported: {
      cap: SUV_UNOFFICIAL.reportedOnly.annualCap,
      targetMonths: SUV_UNOFFICIAL.reportedOnly.processingTargetMonths,
      sectors: ['فناوری پاک', 'هوش مصنوعی', 'علوم زیستی'],
      attribution: 'گزارش رسانه‌های تخصصی مهاجرت، دسامبر ۲۰۲۵؛ IRCC این ارقام را منتشر نکرده است',
    },
  },
};

/** Banner for the pillar page. */
export const suvPillarStatus: FaStatus = {
  tone: 'paused',
  title: 'ویزای استارتاپ کانادا متوقف است و پرونده‌ی جدید نمی‌پذیرد',
  body: 'IRCC این برنامه را از ۳۰ ژوئن ۲۰۲۶ متوقف کرده. پرونده‌هایی که پیش از آن تاریخ ثبت شده‌اند بررسی می‌شوند و اگر شرایطش را دارید هنوز می‌توانید برای مجوز کار باز درخواست بدهید تا در زمان بررسی پرونده کار کنید. IRCC گفته یک پایلوت هدفمند جایگزینش می‌شود، اما هنوز نه شرایطش را منتشر کرده و نه تاریخ باز شدنش را.',
  cta: { label: 'مسیرهایی که امروز باز است', href: '/which-path' },
};

/** Shorter banner for the sub-pages, which keep their reference content. */
export const suvSubpageStatus: FaStatus = {
  tone: 'paused',
  title: 'این برنامه متوقف است و پرونده‌ی جدید نمی‌پذیرد',
  body: 'محتوای این صفحه مرجع است: برای کسانی که پرونده‌ی در جریان دارند و برای مقایسه با پایلوتی که جایگزین می‌شود. شرایط زیر مربوط به برنامه‌ی متوقف‌شده است و برای پایلوت جدید اعتبار ندارد.',
  cta: { label: 'وضعیت فعلی برنامه', href: '/canada-startup-visa' },
};
