'use server';

export async function registerWebinar(formData: FormData) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error('Telegram credentials missing');
        return { success: false, message: 'پیکربندی سیستم با خطا مواجه شده است. لطفا بعدا تلاش کنید.' };
    }

    const name = (formData.get('name') as string || '').trim().slice(0, 200);
    const phone = (formData.get('phone') as string || '').trim().slice(0, 50);
    const email = (formData.get('email') as string || '').trim().slice(0, 200);
    const startupIdea = (formData.get('startupIdea') as string || '').trim().slice(0, 1000);

    // Basic validation
    if (!name || !phone || !email) {
        return { success: false, message: 'لطفاً نام، شماره تماس و ایمیل خود را به درستی وارد کنید.' };
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
        return { success: false, message: 'نشانی ایمیل وارد شده معتبر نیست.' };
    }

    // Format the message for Telegram
    const text = `📅 ثبت‌نام جدید در وبینار استارتاپ ویزا
----------------------------------
👤 نام و نام خانوادگی: ${name}
📱 تلفن / واتس‌اپ: ${phone}
📧 ایمیل: ${email}
💡 ایده / حوزه کاری: ${startupIdea || 'ذکر نشده'}
----------------------------------
⏰ زمان وبینار: چهارشنبه ۱۰ تیر ۱۴۰۵ (ساعت ۲۰:۰۰)`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram API Error:', errorData);
            return { success: false, message: 'ارسال اطلاعات با خطا مواجه شد. لطفاً دوباره تلاش کنید.' };
        }

        return { success: true, message: 'ثبت‌نام شما با موفقیت انجام شد. جزییات به زودی برای شما ارسال خواهد شد.' };
    } catch (error) {
        console.error('Network Error:', error);
        return { success: false, message: 'خطای شبکه رخ داده است. لطفاً اتصال خود را بررسی کنید.' };
    }
}
