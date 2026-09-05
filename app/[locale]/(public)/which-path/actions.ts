'use server';

// ============================================================================
// /fa/which-path lead capture. Same pattern as contact/actions.ts: plain-text
// Telegram message (no parse_mode, so user input cannot inject markup),
// env-var credentials, fail closed. Sends the quiz answers and the computed
// recommendation so the reply can be specific.
// ============================================================================
import { recommendPath, type QuizAnswers } from '@/lib/fa/path-quiz';

const KEYS: (keyof QuizAnswers)[] = ['goal', 'team', 'business', 'language', 'capital', 'background', 'horizon'];

export async function sendWhichPathLead(formData: FormData): Promise<{ success: boolean; message: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('Telegram credentials missing');
    return { success: false, message: 'config' };
  }

  const name = String(formData.get('name') ?? '').trim().slice(0, 200);
  const email = String(formData.get('email') ?? '').trim().slice(0, 200);
  const telegram = String(formData.get('telegram') ?? '').trim().slice(0, 100);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || (!emailOk && !telegram)) {
    return { success: false, message: 'validation' };
  }

  const answers: Partial<QuizAnswers> = {};
  for (const k of KEYS) {
    const v = String(formData.get(k) ?? '').slice(0, 20);
    if (v) (answers as Record<string, string>)[k] = v;
  }
  if (KEYS.some((k) => !answers[k])) {
    return { success: false, message: 'validation' };
  }
  const rec = recommendPath(answers as QuizAnswers);

  const text = `🧭 New Persian assessment lead (/fa/which-path)
----------------------------
👤 Name: ${name}
📧 Email: ${email || '-'}
✈️ Telegram: ${telegram || '-'}
----------------------------
Recommended: ${rec.path} → ${rec.href}
----------------------------
goal=${answers.goal}
team=${answers.team}
business=${answers.business}
language=${answers.language}
capital=${answers.capital}
background=${answers.background}
horizon=${answers.horizon}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      console.error('Telegram API error', await res.text());
      return { success: false, message: 'telegram' };
    }
    return { success: true, message: 'ok' };
  } catch (e) {
    console.error('Telegram network error', e);
    return { success: false, message: 'network' };
  }
}
