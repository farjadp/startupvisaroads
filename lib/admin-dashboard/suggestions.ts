// ============================================================================
// "Do this next" for the admin home: explicit rules over real numbers, with no
// model and no outside benchmark. A rule fires only when its own data was read,
// so a failed section produces silence rather than a guess. Thresholds below
// are our own triggers for attention and the copy never presents them as
// industry norms. Text is Persian; the panel renders right to left.
// ============================================================================
import type { Opportunities } from '@/lib/site-analytics/shape';
import { DAY_MS, type ContentSummary, type EmailSummary, type Locale, type SystemsSummary, type TrafficSummary } from './metrics';

export type PanelState = 'ok' | 'not_configured' | 'error';
export type Severity = 'urgent' | 'important' | 'opportunity';

export interface Suggestion {
  id: string;
  severity: Severity;
  evidence: string;
  title: string;
  why: string;
  href: string;
  action: string;
}

export interface SuggestionInput {
  now: Date;
  /** e.g. /en/admin */
  adminBase: string;
  searchConsole: PanelState;
  ga4: PanelState;
  opportunities: Opportunities | null;
  ga4Sessions: number | null;
  ga4Leads: number | null;
  content: ContentSummary | null;
  traffic: TrafficSummary | null;
  email: EmailSummary | null;
  systems: SystemsSummary | null;
}

/** Forms that send to Telegram and store nothing: contact, webinar, which-path, USA assessment, start-up work permit, PNP assessment. */
export const LEAD_FORM_COUNT = 6;

export const RULES = {
  creditErrorDays: 3,
  campaignFailureRate: 0.05,
  campaignMinAttempts: 50,
  trafficDropRate: 0.3,
  trafficMinPrevious: 200,
  agentStaleDays: 8,
  minSessionsForLeadCheck: 100,
  maxShown: 8,
} as const;

const fa = (n: number) => Math.round(n).toLocaleString('fa-IR');
const faPct = (ratio: number) => `٪${fa(ratio * 100)}`;
const LOCALE_NAME: Record<Locale, string> = { en: 'انگلیسی', fa: 'فارسی' };
const SEVERITY_ORDER: Record<Severity, number> = { urgent: 0, important: 1, opportunity: 2 };

export function buildSuggestions(input: SuggestionInput): { items: Suggestion[]; hidden: number } {
  const { adminBase: base, content, traffic, email, systems, opportunities: gsc, now } = input;
  const out: Suggestion[] = [];
  const add = (s: Suggestion) => out.push(s);

  // Search and analytics come first: visibility is the goal and nothing else measures it.
  const googleOff = [input.searchConsole, input.ga4].filter((s) => s === 'not_configured').length;
  if (googleOff > 0) {
    add({
      id: 'google-not-connected',
      severity: 'urgent',
      evidence: `${fa(2 - googleOff)} از ${fa(2)}`,
      title: 'سرچ کنسول و گوگل آنالیتیکس را وصل کن',
      why: 'تا وصل نشوند، کلیک، نمایش و ورودی از دستیارهای هوش مصنوعی روی این صفحه دیده نمی‌شود.',
      href: '#google-setup',
      action: 'مراحل اتصال',
    });
  }
  const googleBroken = [input.searchConsole, input.ga4].filter((s) => s === 'error').length;
  if (googleBroken > 0) {
    add({
      id: 'google-error',
      severity: 'urgent',
      evidence: `${fa(googleBroken)} منبع`,
      title: 'خواندن داده از گوگل خطا می‌دهد',
      why: 'تنظیمات هست اما گوگل جواب نمی‌دهد. متن خطا در بخش جست‌وجو آمده است.',
      href: '#search',
      action: 'دیدن خطا',
    });
  }

  if (systems) {
    const { autopilot, ingest, social, reports, sources, openArticleReviews } = systems;
    if (autopilot.byKind.database.runs > 0) {
      add({
        id: 'autopilot-db',
        severity: 'urgent',
        evidence: `${fa(autopilot.byKind.database.runs)} اجرا`,
        title: 'اتوپایلوت به سقف اتصال دیتابیس خورده است',
        why: 'در ۷ روز گذشته این اجراها به‌خاطر پر بودن اتصال‌های دیتابیس متوقف شدند و همان فشار می‌تواند صفحه‌های سایت را هم از کار بیندازد.',
        href: `${base}/autopilot`,
        action: 'گزارش اجراها',
      });
    }
    const creditsAt = autopilot.byKind.credits.lastAt;
    if (creditsAt && now.getTime() - Date.parse(creditsAt) <= RULES.creditErrorDays * DAY_MS) {
      add({
        id: 'autopilot-credits',
        severity: 'urgent',
        evidence: `${fa(autopilot.byKind.credits.runs)} اجرا`,
        title: 'اعتبار سرویس هوش مصنوعی تمام شده است',
        why: 'تا اعتبار شارژ نشود، نویسنده‌ها مقاله‌ای نمی‌سازند.',
        href: `${base}/autopilot`,
        action: 'گزارش اجراها',
      });
    }
    if (autopilot.unfinished > 0) {
      add({
        id: 'autopilot-unfinished',
        severity: 'important',
        evidence: `${fa(autopilot.unfinished)} اجرا`,
        title: 'بعضی اجراهای اتوپایلوت تمام نشده‌اند',
        why: 'بیش از دو ساعت از شروعشان گذشته و نتیجه‌ای ثبت نشده است.',
        href: `${base}/autopilot`,
        action: 'گزارش اجراها',
      });
    }
    if (ingest.failed + ingest.stuck > 0) {
      add({
        id: 'ingest-failed',
        severity: 'important',
        evidence: `${fa(ingest.failed + ingest.stuck)} کار`,
        title: 'خواندن بعضی منبع‌ها شکست خورده یا گیر کرده است',
        why: 'منبعی که خوانده نشود، به شواهد نویسنده‌ها اضافه نمی‌شود.',
        href: `${base}/sources`,
        action: 'منبع‌ها',
      });
    }
    if (social.failed > 0) {
      add({
        id: 'social-failed',
        severity: 'important',
        evidence: `${fa(social.failed)} پست`,
        title: 'انتشار در شبکه‌های اجتماعی خطا داده است',
        why: `در ۷ روز گذشته این مقصدها خطا داشتند: ${social.failedDestinations.join('، ')}.`,
        href: `${base}/autopilot`,
        action: 'بررسی',
      });
    }
    if (reports.telegramFailed > 0) {
      add({
        id: 'reports-telegram',
        severity: 'important',
        evidence: `${fa(reports.telegramFailed)} گزارش`,
        title: 'گزارش ایجنت‌ها به تلگرام نرسیده است',
        why: 'این گزارش‌ها در پنل هستند ولی پیامشان فرستاده نشد.',
        href: `${base}/reports`,
        action: 'گزارش‌ها',
      });
    }
    const stale = reports.latestByAgent.filter((a) => a.ageDays > RULES.agentStaleDays);
    if (stale.length > 0) {
      add({
        id: 'agents-stale',
        severity: 'important',
        evidence: `${fa(stale.length)} ایجنت`,
        title: 'گزارش هفتگی بعضی ایجنت‌ها نیامده است',
        why: `بیش از ${fa(RULES.agentStaleDays)} روز از آخرین گزارش ${stale.map((a) => a.agent).join('، ')} گذشته است.`,
        href: `${base}/reports`,
        action: 'گزارش‌ها',
      });
    }
    if (openArticleReviews > 0) {
      add({
        id: 'article-reviews',
        severity: 'important',
        evidence: `${fa(openArticleReviews)} مقاله`,
        title: 'منبع رسمی این مقاله‌ها تغییر کرده است',
        why: 'متن منبع عوض شده و ممکن است عدد یا قاعده‌ای در مقاله دیگر درست نباشد.',
        href: `${base}/sources`,
        action: 'بازبینی',
      });
    }
    if (sources.errored > 0) {
      add({
        id: 'sources-errored',
        severity: 'important',
        evidence: `${fa(sources.errored)} منبع`,
        title: 'بعضی منبع‌های فعال خوانده نمی‌شوند',
        why: 'این منبع‌ها خطا دارند یا مسدود شده‌اند و دیگر به‌روز نمی‌شوند.',
        href: `${base}/sources`,
        action: 'منبع‌ها',
      });
    }
    if (sources.waiting > 0) {
      add({
        id: 'sources-waiting',
        severity: 'opportunity',
        evidence: `${fa(sources.waiting)} مورد`,
        title: 'خبرهای تازه منتظر تصمیم تو هستند',
        why: 'این موردها از غربال رد شده‌اند و می‌توانند مقاله شوند.',
        href: `${base}/sources`,
        action: 'صف منبع‌ها',
      });
    }
  }

  if (email) {
    for (const c of email.campaigns) {
      if (c.stuckHours !== null) {
        add({
          id: `campaign-stuck-${c.id}`,
          severity: 'urgent',
          evidence: `${fa(c.stuckHours)} ساعت`,
          title: `کمپین «${c.name}» متوقف مانده است`,
          why: `وضعیتش «در حال ارسال» است، ولی این مدت ایمیلی ثبت نشده. تا الان ${fa(c.sent)} ایمیل رفته است.`,
          href: `${base}/marketing/campaigns/${c.id}`,
          action: 'دیدن کمپین',
        });
      }
      const attempts = c.sent + c.failed;
      if (attempts >= RULES.campaignMinAttempts && c.failed / attempts >= RULES.campaignFailureRate) {
        add({
          id: `campaign-failures-${c.id}`,
          severity: 'urgent',
          evidence: faPct(c.failed / attempts),
          title: `ارسال‌های ناموفق کمپین «${c.name}» زیاد است`,
          why: `${fa(c.failed)} ارسال از ${fa(attempts)} ارسال شکست خورده است.`,
          href: `${base}/marketing/campaigns/${c.id}`,
          action: 'دیدن کمپین',
        });
      }
    }
  }

  if (content) {
    if (content.overdueScheduled > 0) {
      add({
        id: 'scheduled-overdue',
        severity: 'urgent',
        evidence: `${fa(content.overdueScheduled)} مقاله`,
        title: 'مقاله‌های زمان‌بندی‌شده سر وقت منتشر نشده‌اند',
        why: 'بیش از یک ساعت از زمانشان گذشته و هنوز منتشر نشده‌اند.',
        href: `${base}/articles`,
        action: 'مقاله‌ها',
      });
    }
    const inReview = content.caseStudies.IN_REVIEW ?? 0;
    if (inReview > 0) {
      add({
        id: 'case-studies-review',
        severity: 'important',
        evidence: `${fa(inReview)} پرونده`,
        title: 'پرونده‌ها منتظر تأیید تو هستند',
        why: 'هیچ پرونده‌ای بدون تأیید تو منتشر نمی‌شود.',
        href: `${base}/case-studies`,
        action: 'بازبینی',
      });
    }
    for (const locale of content.scheduleGaps) {
      add({
        id: `schedule-gap-${locale}`,
        severity: 'important',
        evidence: `${fa(0)} مقاله`,
        title: `برای ۷ روز آینده مقالهٔ ${LOCALE_NAME[locale]} زمان‌بندی نشده است`,
        why: 'در این هفته انتشار این زبان فقط به اجرای روزانهٔ اتوپایلوت بستگی دارد.',
        href: `${base}/articles`,
        action: 'مقاله‌ها',
      });
    }
    if (content.autopilotDrafts14d > 0) {
      const drafts = content.counts.en.draft + content.counts.fa.draft;
      add({
        id: 'drafts-waiting',
        severity: 'important',
        evidence: `${fa(drafts)} پیش‌نویس`,
        title: 'پیش‌نویس‌ها روی هم جمع شده‌اند',
        why: `${fa(content.autopilotDrafts14d)} مورد از آن‌ها را اتوپایلوت در ۱۴ روز گذشته ساخته است. تا تصمیم نگیری، خواننده آن‌ها را نمی‌بیند.`,
        href: `${base}/articles`,
        action: 'مقاله‌ها',
      });
    }
  }

  if (traffic && traffic.total.previous >= RULES.trafficMinPrevious) {
    const drop = (traffic.total.previous - traffic.total.current) / traffic.total.previous;
    if (drop >= RULES.trafficDropRate) {
      add({
        id: 'traffic-drop',
        severity: 'important',
        evidence: `−${faPct(drop)}`,
        title: 'بازدید ثبت‌شدهٔ سایت افت کرده است',
        why: `در ۲۸ روز اخیر ${fa(traffic.total.current)} بازدید ثبت شد و در ۲۸ روز قبل ${fa(traffic.total.previous)} بازدید.`,
        href: '#traffic',
        action: 'نمودار بازدید',
      });
    }
  }

  if (gsc) {
    const declining = gsc.decliningPages[0];
    if (declining) {
      add({
        id: 'gsc-declining',
        severity: 'important',
        evidence: `${fa(declining.previousClicks)} ← ${fa(declining.clicks)}`,
        title: 'کلیک این صفحه دست‌کم نصف شده است',
        why:
          gsc.decliningPages.length > 1
            ? `${declining.path} و ${fa(gsc.decliningPages.length - 1)} صفحهٔ دیگر در ۲۸ روز اخیر نسبت به ۲۸ روز قبل افت کرده‌اند.`
            : `${declining.path} در ۲۸ روز اخیر نسبت به ۲۸ روز قبل افت کرده است.`,
        href: '#search',
        action: 'صفحه‌های برتر',
      });
    }
    const lowCtr = gsc.lowCtrPages[0];
    if (lowCtr) {
      add({
        id: 'gsc-low-ctr',
        severity: 'opportunity',
        evidence: `${fa(lowCtr.impressions)} نمایش`,
        title: 'عنوان و توضیح این صفحه را بازنویسی کن',
        why: `${lowCtr.path} در صفحهٔ اول گوگل است ولی نرخ کلیکش ${faPct(lowCtr.ctr)} است، کمتر از نصف میانگین خود سایت (${faPct(gsc.siteCtr)}).`,
        href: '#search',
        action: 'صفحه‌های برتر',
      });
    }
    const striking = gsc.strikingQueries[0];
    if (striking) {
      add({
        id: 'gsc-striking',
        severity: 'opportunity',
        evidence: `رتبهٔ ${fa(striking.position)}`,
        title: `«${striking.query}» نزدیک صفحهٔ اول است`,
        why: `${fa(striking.impressions)} نمایش در ۲۸ روز. با تقویت صفحهٔ مربوط و لینک داخلی به آن می‌شود این عبارت را جلو برد.`,
        href: '#search',
        action: 'عبارت‌های برتر',
      });
    }
  }

  if (input.ga4Sessions !== null && input.ga4Leads === 0 && input.ga4Sessions >= RULES.minSessionsForLeadCheck) {
    add({
      id: 'ga4-no-leads',
      severity: 'important',
      evidence: `${fa(input.ga4Sessions)} نشست`,
      title: 'هیچ فرم موفقی در آنالیتیکس ثبت نشده است',
      why: 'یا فرم‌ها پر نشده‌اند یا رویداد ثبت فرم درست کار نمی‌کند. پیام‌های تلگرام را با این عدد مقایسه کن.',
      href: '#traffic',
      action: 'ترافیک',
    });
  }

  add({
    id: 'leads-not-stored',
    severity: 'important',
    evidence: `${fa(LEAD_FORM_COUNT)} فرم`,
    title: 'لیدها فقط به تلگرام می‌روند و جایی ذخیره نمی‌شوند',
    why: 'برای همین تعداد لید، منبعشان و نرخ تبدیل هر صفحه را نمی‌شود از روی داده گزارش کرد.',
    href: '#not-measured',
    action: 'جزئیات',
  });

  const sorted = out
    .map((s, i) => ({ s, i }))
    .sort((a, b) => SEVERITY_ORDER[a.s.severity] - SEVERITY_ORDER[b.s.severity] || a.i - b.i)
    .map(({ s }) => s);
  return { items: sorted.slice(0, RULES.maxShown), hidden: Math.max(0, sorted.length - RULES.maxShown) };
}
