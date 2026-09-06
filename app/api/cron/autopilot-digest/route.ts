// ============================================================================
// GET /api/cron/autopilot-digest[?hours=26&dry=1]
//
// Reads the last day of AutopilotRun rows, decides whether each locale's lane
// is working, and sends one Telegram message. Runs once a day, after the last
// writing job.
//
// This endpoint exists because the pipeline could already tell us it was
// failing and had nowhere to say it. `decidePlannedPublication` returns a
// warning, the writers now log it, and Cloud Scheduler discards the response
// body — so a lane can produce nothing for six weeks while every component
// reports success to something nobody reads.
//
// dry=1 returns the message instead of sending it, so the format can be
// checked without spending a Telegram send.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authorisedCron } from '@/lib/cron-auth';
import { summarise, buildDigest, DEFAULT_WINDOW_HOURS } from '@/lib/autopilot/digest';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function sendTelegram(text: string): Promise<{ sent: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  // Fail closed and say so, the same way the site's forms do.
  if (!token || !chatId) return { sent: false, error: 'Telegram credentials missing' };
  try {
    // No parse_mode: reasons carry model and feed output, and plain text
    // cannot be made to render as markup.
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    if (!res.ok) return { sent: false, error: `telegram ${res.status}` };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const q = req.nextUrl.searchParams;
  const hours = Math.min(168, Math.max(1, Number(q.get('hours') ?? DEFAULT_WINDOW_HOURS) || DEFAULT_WINDOW_HOURS));
  const dryRun = q.get('dry') === '1';
  const now = new Date();

  const runs = await prisma.autopilotRun.findMany({
    where: { startedAt: { gte: new Date(now.getTime() - hours * 3_600_000) } },
    orderBy: { startedAt: 'desc' },
    take: 200,
  });

  const lanes = summarise(runs, now, { windowHours: hours });
  const message = buildDigest(lanes, now);

  // Log it too. If Telegram is down or misconfigured, the digest must still
  // exist somewhere — this endpoint's whole purpose is defeated by a silent
  // failure of its own.
  console.log(`autopilot/digest:\n${message}`);

  if (dryRun) return NextResponse.json({ ok: true, dryRun: true, hours, lanes, message });

  const delivery = await sendTelegram(message);
  if (!delivery.sent) console.error(`autopilot/digest: not delivered — ${delivery.error}`);
  return NextResponse.json({ ok: true, hours, lanes, delivered: delivery.sent, error: delivery.error });
}
