// ============================================================================
// lib/usa/travel-ban.ts
// The one place the US cluster states the entry restriction on Iranian
// nationals. Every US page that carries the notice reads it from here, so a
// change in the proclamation is a one-file edit — the same pattern as
// lib/canada-suv.ts.
//
// Verified 2026-10-12 against the Federal Register text:
//  - Proclamation 10998, signed 16 Dec 2025, effective 1 Jan 2026
//    (govinfo.gov/content/pkg/FR-2025-12-19/html/2025-23570.htm). Iran is
//    fully suspended: immigrant AND non-immigrant visas.
//  - Exceptions that exist: lawful permanent residents; dual nationals
//    travelling on a non-listed passport; visas issued before 1 Jan 2026
//    are not revoked; immigrant visas for persecuted ethnic and religious
//    minorities in Iran; case-by-case national-interest exceptions.
//  - The "immediate relatives with clear evidence" exception of
//    Proclamation 10949 was REMOVED by 10998. Do not claim it.
//  - Reviewed every 180 days (Sec. 7(a)). No amendment found to Oct 2026.
//  - The USCIS benefit-application hold (PM-602-0192 / PM-602-0194) was
//    vacated on 5 Jun 2026 (D.R.I.) and enjoined on 24 Aug 2026 (N.D. Cal.);
//    appeals pending. Say it is blocked by the courts, not that it is in force.
//
// RE-VERIFY at every review of a US page, and whenever a 180-day report lands.
// ============================================================================
import type { FaStatus } from '@/lib/fa/content';

export const USA_TRAVEL_BAN = {
  proclamation: '10998',
  signed: '2025-12-16',
  effective: '2026-01-01',
  source: 'https://www.govinfo.gov/content/pkg/FR-2025-12-19/html/2025-23570.htm',
  verified: '2026-10-12',
} as const;

export const USA_IRAN_STATUS_FA: FaStatus = {
  tone: 'closed',
  title: 'برای پاسپورت ایرانی: صدور ویزای آمریکا متوقف است',
  body: 'طبق فرمان ریاست‌جمهوری شماره‌ی ۱۰۹۹۸ که از ۱ ژانویه‌ی ۲۰۲۶ اجرا می‌شود، صدور ویزای مهاجرتی و غیرمهاجرتی برای اتباع ایران متوقف است. این شامل همه‌ی مسیرهای این صفحه می‌شود. استثنائات محدود است: دارندگان گرین‌کارت، دوتابعیتی‌هایی که با پاسپورت کشوری خارج از فهرست سفر می‌کنند، و ویزاهایی که پیش از این تاریخ صادر شده‌اند. این فرمان هر ۱۸۰ روز بازبینی می‌شود. اگر تابعیت دوم دارید، مثلاً کانادا، وضعیت شما متفاوت است و باید با وکیل آمریکایی بررسی شود.',
  cta: { label: 'ارزیابی آمادگی آمریکا', href: '/usa/assessment' },
};

export const USA_IRAN_STATUS_EN: FaStatus = {
  tone: 'closed',
  title: 'Iranian passport holders: US visa issuance is suspended',
  body: 'Presidential Proclamation 10998, in force since 1 January 2026, suspends both immigrant and non-immigrant visas for Iranian nationals — every route on this page included. The exceptions are narrow: lawful permanent residents, dual nationals travelling on a passport from a country not on the list, and visas issued before that date. The proclamation is reviewed every 180 days. If you hold a second citizenship, such as Canadian, your position is different and needs a US attorney\'s review.',
  cta: { label: 'US readiness assessment', href: '/usa/assessment' },
};
