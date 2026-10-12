'use server'

import { reportLead } from '@/lib/openaiAds';

export async function sendTelegramNotification(formData: any, analysisResults: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram Env Variables Missing");
    return { success: false };
  }

  // Plain text (no parse_mode) so user input can never inject Telegram markup.
  const message = `🚀 New Lead Generated (SVR Assessment)
----------------------------------
👤 Name: ${formData.fullName}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}
----------------------------------
💰 Net Worth: ${formData.netWorth}
💵 Liquidity: ${formData.investment}
🎓 Education: ${formData.education}
🗣 English: ${formData.english}
----------------------------------
📊 Auto-Analysis Results:
🇨🇦 Ontario: ${analysisResults.ontario}%
🇨🇦 BC Tech: ${analysisResults.bc}%
🇨🇦 Alberta: ${analysisResults.alberta}%
🇨🇦 Sask: ${analysisResults.sask}%`;

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
    const eventId = await reportLead({ email: formData.email, phone: formData.phone, name: formData.fullName });
    return { success: true, eventId };
  } catch (error) {
    console.error("Telegram Error:", error);
    return { success: false };
  }
}