'use server';

// ============================================================================
// Meetup / webinar registration. Name and email are required; everything else
// is optional. A registration is delivered two ways, either is enough:
//   1. the registrant is added as a guest on the Google Calendar event
//      (lib/meetup-calendar.ts), so Google emails them the Meet link;
//   2. a summary goes to the team's Telegram chat.
// ============================================================================
import { headers } from 'next/headers';
import { reportLead } from '@/lib/openaiAds';
import { rateLimit } from '@/lib/rateLimit';
import { addMeetupGuest, type CalendarAddResult } from '@/lib/meetup-calendar';
import { WEBINAR_EVENT_ID } from '@/content/fa/webinar';

type Result = { success: boolean; message: string; eventId?: string; calendar?: CalendarAddResult };

const field = (formData: FormData, key: string, max: number) => String(formData.get(key) ?? '').trim().slice(0, max);

const CALENDAR_LABEL: Record<CalendarAddResult, string> = {
    added: '✅ به تقویم اضافه شد و دعوت‌نامه رفت',
    exists: '↩️ از قبل در تقویم بود',
    off: '⚪️ اتصال تقویم روشن نیست، دستی اضافه کنید',
    failed: '⚠️ افزودن به تقویم ناموفق بود، دستی اضافه کنید',
};

async function notifyTelegram(text: string): Promise<boolean> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
        console.error('Telegram credentials missing');
        return false;
    }
    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text }),
            signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) {
            console.error('Telegram API Error:', await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error('Telegram network error:', error);
        return false;
    }
}

export async function registerWebinar(formData: FormData): Promise<Result> {
    // Honeypot: a hidden field people never see. Bots fill it; pretend success.
    if (field(formData, 'website', 200)) return { success: true, message: 'ok' };

    const ip = ((await headers()).get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
    if (!rateLimit(`webinar:${ip}`, 5, 10 * 60 * 1000).ok) {
        return { success: false, message: 'تعداد درخواست‌ها زیاد است. چند دقیقه‌ی دیگر دوباره امتحان کنید.' };
    }

    const name = field(formData, 'name', 200);
    const email = field(formData, 'email', 200).toLowerCase();
    const phone = field(formData, 'phone', 50);
    const startupIdea = field(formData, 'startupIdea', 1000);
    const residence = field(formData, 'residence', 100);
    const interest = field(formData, 'interest', 100);
    const eventLabel = field(formData, 'event', 200) || 'وبینار استارتاپ ویزا';

    if (!name || !email) {
        return { success: false, message: 'نام و ایمیل را وارد کنید.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, message: 'نشانی ایمیل وارد شده معتبر نیست.' };
    }

    // Only the Persian meetup form sends `event`; the English page has no
    // calendar event behind it.
    const calendar = formData.has('event')
        ? await addMeetupGuest({ eventId: WEBINAR_EVENT_ID ?? '', email, name })
        : 'off';

    const text = `📅 ثبت‌نام جدید: ${eventLabel}
----------------------------------
👤 نام: ${name}
📧 ایمیل: ${email}
📱 تلفن / تلگرام: ${phone || 'ذکر نشده'}
🌍 کشور محل زندگی: ${residence || 'ذکر نشده'}
🧭 مسیر مورد علاقه: ${interest || 'ذکر نشده'}
💡 ایده / حوزه کاری: ${startupIdea || 'ذکر نشده'}
----------------------------------
📆 تقویم: ${CALENDAR_LABEL[calendar]}`;

    const told = await notifyTelegram(text);
    const onCalendar = calendar === 'added' || calendar === 'exists';

    if (!told && !onCalendar) {
        return { success: false, message: 'ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید یا در تلگرام پیام بدهید.' };
    }

    return {
        success: true,
        calendar,
        eventId: await reportLead({ email, phone, name }),
        message: onCalendar
            ? 'ثبت‌نام شد. دعوت‌نامه‌ی تقویم با لینک ورود به ایمیل شما فرستاده شد.'
            : 'ثبت‌نام شد. لینک ورود پیش از دورهمی به ایمیل شما فرستاده می‌شود.',
    };
}
