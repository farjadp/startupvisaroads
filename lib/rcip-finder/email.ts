// ============================================================================
// lib/rcip-finder/email.ts
// The sign-in email: one link, in the visitor's language. Transactional, so
// it carries no marketing and no unsubscribe footer.
// ============================================================================
import { getMarketingSettings, sendEmail } from '@/lib/marketing';
import { SITE_URL } from '@/lib/seo';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function loginEmailHtml(link: string, locale: 'en' | 'fa'): { subject: string; html: string } {
  if (locale === 'fa') {
    return {
      subject: 'لینک ورود به جست‌وجوی کارفرمایان RCIP',
      html: `<div dir="rtl" style="font-family:Tahoma,sans-serif;line-height:1.9;color:#1a1a1a"><p>برای ورود روی لینک زیر بزنید. این لینک ۳۰ دقیقه اعتبار دارد.</p><p><a href="${esc(link)}" style="display:inline-block;padding:12px 20px;background:#1a1a1a;color:#F2F0E9;text-decoration:none">ورود به VisaRoads</a></p><p style="color:#555">اگر شما درخواست نکرده‌اید، این ایمیل را نادیده بگیرید.</p><p style="color:#555">VisaRoads Inc.، انتاریو، کانادا</p></div>`,
    };
  }
  return {
    subject: 'Your sign-in link for the RCIP employer finder',
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1a1a"><p>Use the link below to sign in. It works for 30 minutes.</p><p><a href="${esc(link)}" style="display:inline-block;padding:12px 20px;background:#1a1a1a;color:#F2F0E9;text-decoration:none">Sign in to VisaRoads</a></p><p style="color:#555">If you did not ask for this, ignore this email.</p><p style="color:#555">VisaRoads Inc., Ontario, Canada</p></div>`,
  };
}

export const verifyLink = (token: string) => `${SITE_URL}/api/finder/auth/verify?token=${encodeURIComponent(token)}`;

/** Send the link. Without an email provider in development, log it instead. */
export async function sendLoginEmail(to: string, token: string, locale: 'en' | 'fa'): Promise<'sent' | 'logged' | 'unavailable'> {
  const link = verifyLink(token);
  const s = await getMarketingSettings();
  const apiKey = process.env.RESEND_API_KEY || s.marketing_resend_api_key;
  const fromEmail = process.env.FINDER_FROM_EMAIL || s.marketing_sender_email;
  if (!apiKey || !fromEmail) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[rcip-finder] sign-in link (dev, no email provider):', link);
      return 'logged';
    }
    return 'unavailable';
  }
  const { subject, html } = loginEmailHtml(link, locale);
  await sendEmail({ to, subject, html, fromName: s.marketing_sender_name || 'VisaRoads', fromEmail, apiKey });
  return 'sent';
}
