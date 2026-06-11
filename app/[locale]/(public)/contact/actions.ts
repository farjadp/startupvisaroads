'use server';

export async function sendContactForm(formData: FormData) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error('Telegram credentials missing');
        return { success: false, message: 'System configuration error.' };
    }

    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const objective = formData.get('objective') as string;
    const brief = formData.get('brief') as string;

    const text = `
📩 *New Contact Form Submission*
----------------------------
👤 *Name:* ${name}
cY *Company:* ${company}
📧 *Email:* ${email}
📱 *Phone:* ${phone}
🎯 *Objective:* ${objective}
📝 *Brief:*
${brief}
`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'Markdown',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram API Error:', errorData);
            return { success: false, message: 'Failed to notify via Telegram.' };
        }

        return { success: true, message: 'Inquiry received.' };
    } catch (error) {
        console.error('Network Error:', error);
        return { success: false, message: 'Network error occurred.' };
    }
}
