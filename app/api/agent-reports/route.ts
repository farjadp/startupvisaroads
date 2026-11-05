// ============================================================================
// POST /api/agent-reports[?telegram=0]
//
// Where the local Claude agents (market-intel, seo-strategist, fact-checker,
// ai-visibility-tracker) put their reports. The body is an AgentReportPayload
// (lib/agent-reports/report.ts). The report is stored, shown in
// /admin/reports, and sent to the admin Telegram chat.
//
// Auth: `Authorization: Bearer $AGENT_REPORTS_TOKEN` — a token of its own, so
// the agents on Farjad's Mac never hold the cron secret — or anything
// authorisedCron accepts (the cron secret, a signed-in admin).
//
// telegram=0 stores without sending, for re-posting or backfilling.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { safeCompare } from '@/lib/auth';
import { authorisedCron } from '@/lib/cron-auth';
import { SITE_URL } from '@/lib/seo';
import { parseReport, telegramMessage } from '@/lib/agent-reports/report';
import { sendAdminTelegram } from '@/lib/agent-reports/telegram';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MAX_BODY = 256_000;

async function authorised(req: NextRequest): Promise<boolean> {
  const token = process.env.AGENT_REPORTS_TOKEN;
  const header = req.headers.get('authorization') ?? '';
  if (token && header.startsWith('Bearer ') && safeCompare(header.slice(7), token)) return true;
  return authorisedCron(req);
}

export async function POST(req: NextRequest) {
  if (!(await authorised(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const raw = await req.text();
  if (raw.length > MAX_BODY) return NextResponse.json({ error: `body over ${MAX_BODY} bytes` }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'body is not JSON' }, { status: 400 });
  }

  const parsed = parseReport(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const r = parsed.report;

  const row = await prisma.agentReport.create({
    data: { agent: r.agent, job: r.job, title: r.title, locale: r.locale, summary: r.summary, payload: JSON.stringify(r) },
  });
  const adminUrl = `${SITE_URL}/en/admin/reports/${row.id}`;

  if (req.nextUrl.searchParams.get('telegram') === '0') {
    await prisma.agentReport.update({ where: { id: row.id }, data: { telegramStatus: 'skipped', telegramError: 'telegram=0' } });
    return NextResponse.json({ ok: true, id: row.id, url: adminUrl, telegram: 'skipped' });
  }

  const delivery = await sendAdminTelegram(telegramMessage(r, adminUrl));
  if (delivery.status !== 'sent') console.error(`agent-reports: ${row.id} not sent to Telegram — ${delivery.error}`);
  await prisma.agentReport
    .update({ where: { id: row.id }, data: { telegramStatus: delivery.status, telegramError: delivery.error ?? null } })
    .catch(() => {});
  return NextResponse.json({ ok: true, id: row.id, url: adminUrl, telegram: delivery.status, error: delivery.error });
}
