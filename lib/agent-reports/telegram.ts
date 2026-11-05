// ============================================================================
// lib/agent-reports/telegram.ts
// Send an agent report to the admin chat — the same bot and chat the
// autopilot digest uses (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID), not the
// public channel. Never throws: a report that cannot be delivered is still
// stored and still shown in the admin.
// ============================================================================

export type Delivery = { status: 'sent' | 'failed' | 'skipped'; error?: string };

export async function sendAdminTelegram(text: string): Promise<Delivery> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { status: 'skipped', error: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set' };
  try {
    // No parse_mode: report text is agent output, and plain text cannot be
    // made to render as markup.
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    const json = (await res.json().catch(() => null)) as { ok?: boolean; description?: string } | null;
    if (!res.ok || !json?.ok) return { status: 'failed', error: `telegram ${res.status}${json?.description ? `: ${json.description}` : ''}` };
    return { status: 'sent' };
  } catch (e) {
    return { status: 'failed', error: e instanceof Error ? e.message : String(e) };
  }
}
