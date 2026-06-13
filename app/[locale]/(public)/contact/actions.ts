'use server';

export async function sendContactForm(formData: FormData) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error('Telegram credentials missing');
        return { success: false, message: 'System configuration error.' };
    }

    const name = (formData.get('name') as string || '').trim().slice(0, 200);
    const company = (formData.get('company') as string || '').trim().slice(0, 200);
    const email = (formData.get('email') as string || '').trim().slice(0, 200);
    const phone = (formData.get('phone') as string || '').trim().slice(0, 50);
    const objective = (formData.get('objective') as string || '').trim().slice(0, 200);
    const brief = (formData.get('brief') as string || '').trim().slice(0, 4000);

    // Basic validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk) {
        return { success: false, message: 'Please provide a valid name and email.' };
    }

    // Plain text (no parse_mode) so user input can never inject Telegram markup.
    const text = `📩 New Contact Form Submission
----------------------------
👤 Name: ${name}
🏢 Company: ${company}
📧 Email: ${email}
📱 Phone: ${phone}
🎯 Objective: ${objective}
📝 Brief:
${brief}`;

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
            return { success: false, message: 'Failed to notify via Telegram.' };
        }

        return { success: true, message: 'Inquiry received.' };
    } catch (error) {
        console.error('Network Error:', error);
        return { success: false, message: 'Network error occurred.' };
    }
}
