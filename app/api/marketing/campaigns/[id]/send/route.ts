// ============================================================================
// GET  /api/marketing/campaigns/:id/send   campaign with true send counts
// POST /api/marketing/campaigns/:id/send   test send only
//
// Real sends no longer start here. The old in-process loop died with the
// revision on 18 Nov 2026; campaigns now go through ./queue and the worker in
// lib/campaign-queue/worker.ts.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { getMarketingSettings, sendEmail, sendSms } from '@/lib/marketing';
import { assertLinkSigningConfigured } from '@/lib/signed-links';
import { classifyFailure } from '@/lib/campaign-queue/failures';
import { renderCampaignEmail, senderFrom } from '@/lib/campaign-queue/render';

async function checkAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  return !!session?.username;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      groups: { include: { group: { include: { _count: { select: { contacts: true } } } } } },
      logs: { orderBy: { sentAt: 'desc' }, take: 200 },
    },
  });

  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [sent, failed, total] = await Promise.all([
    prisma.campaignLog.count({ where: { campaignId: id, status: 'SENT' } }),
    prisma.campaignLog.count({ where: { campaignId: id, status: 'FAILED' } }),
    prisma.campaignLog.count({ where: { campaignId: id } }),
  ]);

  return NextResponse.json({ campaign, stats: { sent, failed, total } });
}

function getSiteUrl(req: NextRequest): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  return new URL(req.url).origin;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { testEmail, testPhone } = await req.json().catch(() => ({}));

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (!testEmail && !testPhone) {
    return NextResponse.json(
      { error: 'Campaigns are sent through the daily queue. Set it up on the campaign page.' },
      { status: 410 },
    );
  }

  const settings = await getMarketingSettings();
  const resendKey = settings['marketing_resend_api_key'];
  const twilioSid = settings['marketing_twilio_sid'];
  const twilioToken = settings['marketing_twilio_token'];
  const twilioFrom = settings['marketing_twilio_from'];

  // Unsubscribe and external click links are HMAC-signed; without a key the
  // recipient could not unsubscribe, so refuse to send at all.
  try {
    assertLinkSigningConfigured();
  } catch (e) {
    console.error('Campaign send blocked:', e);
    return NextResponse.json({ error: 'Link signing secret not configured' }, { status: 500 });
  }

  let emailResult = null;
  let smsResult = null;

  if (testEmail && (campaign.type === 'EMAIL' || campaign.type === 'BOTH')) {
    if (!resendKey) return NextResponse.json({ error: 'Resend API Key not configured' }, { status: 422 });

    const sender = senderFrom(settings);
    const html = renderCampaignEmail({
      body: campaign.body,
      to: testEmail,
      logId: 'test-log-id',
      siteUrl: getSiteUrl(req),
      settings,
    });

    try {
      emailResult = await sendEmail({
        to: testEmail,
        subject: campaign.subject ?? campaign.name,
        html,
        fromName: sender.name,
        fromEmail: sender.email,
        apiKey: resendKey,
      });
    } catch (e: unknown) {
      return NextResponse.json({ error: `Email failed: ${String(e)}` }, { status: 500 });
    }
    // Resend reports refusals in the result rather than by throwing.
    if (emailResult?.error) {
      return NextResponse.json({ error: `Email failed: ${classifyFailure(emailResult.error).message}` }, { status: 500 });
    }
  }

  if (testPhone && (campaign.type === 'SMS' || campaign.type === 'BOTH')) {
    if (!twilioSid || !twilioToken || !twilioFrom) {
      return NextResponse.json({ error: 'Twilio not configured' }, { status: 422 });
    }
    try {
      smsResult = await sendSms({
        to: testPhone,
        body: campaign.smsBody ?? '',
        accountSid: twilioSid,
        authToken: twilioToken,
        from: twilioFrom,
      });
    } catch (e: unknown) {
      return NextResponse.json({ error: `SMS failed: ${String(e)}` }, { status: 500 });
    }
  }

  return NextResponse.json({ test: true, emailResult, smsResult });
}
