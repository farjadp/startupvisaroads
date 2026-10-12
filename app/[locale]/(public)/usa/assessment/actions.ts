'use server';

// ============================================================================
// Server action for /usa/assessment. Re-scores on the server (the client's
// verdict is never trusted) and sends the lead to the same Telegram chat as
// the contact form, as plain text so input cannot inject markup.
// ============================================================================
import { reportLead } from '@/lib/openaiAds';
import { assess, O1_CRITERIA, PASSPORTS, type Degree, type O1Criterion, type Passport } from '@/lib/usa/assessment';

const DEGREES: readonly Degree[] = ['masters', 'bachelor5', 'none'];

const field = (fd: FormData, key: string, max: number) => ((fd.get(key) as string) || '').trim().slice(0, max);

export async function sendUsaAssessment(fd: FormData): Promise<{ success: boolean; eventId?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.error('usa-assessment: Telegram credentials missing');
    return { success: false };
  }

  const name = field(fd, 'name', 200);
  const email = field(fd, 'email', 200);
  const phone = field(fd, 'phone', 50);
  const startup = field(fd, 'startup', 1000);
  const locale = field(fd, 'locale', 4) === 'fa' ? 'fa' : 'en';
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false };

  const criteria = fd.getAll('criteria').map(String).filter((c): c is O1Criterion => (O1_CRITERIA as readonly string[]).includes(c));
  const passports = fd.getAll('passports').map(String).filter((p): p is Passport => (PASSPORTS as readonly string[]).includes(p));
  const degreeRaw = field(fd, 'degree', 20) as Degree;
  const degree: Degree = DEGREES.includes(degreeRaw) ? degreeRaw : 'none';
  const nationalImportance = fd.get('nationalImportance') === 'on';
  const plan = fd.get('plan') === 'on';

  const r = assess({ criteria, degree, nationalImportance, plan, passports });

  const text = `🇺🇸 US readiness assessment (${locale})
----------------------------
👤 ${name}
📧 ${email}
📱 ${phone}
🚀 ${startup}
----------------------------
Passports: ${passports.join(', ') || '—'} → gate: ${r.gate}
O-1A criteria: ${criteria.join(', ') || '—'} → ${r.o1} (${r.strongCount} excl. salary)
Degree: ${degree} · national importance: ${nationalImportance} · plan: ${plan} → NIW: ${r.niw}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text }),
    });
    if (!res.ok) {
      console.error('usa-assessment: Telegram API error', await res.text());
      return { success: false };
    }
    return { success: true, eventId: await reportLead({ email, phone, name }) };
  } catch (err) {
    console.error('usa-assessment: network error', err);
    return { success: false };
  }
}
