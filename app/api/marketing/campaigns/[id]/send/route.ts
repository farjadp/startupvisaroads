import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { getMarketingSettings, sendEmail, sendSms, getTodaySentCount } from '@/lib/marketing';
import * as cheerio from 'cheerio';

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

  const sent = campaign.logs.filter((l) => l.status === 'SENT').length;
  const failed = campaign.logs.filter((l) => l.status === 'FAILED').length;

  return NextResponse.json({ campaign, stats: { sent, failed, total: campaign.logs.length } });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const bodyData = await req.json().catch(() => ({}));
  const { testEmail, testPhone } = bodyData;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { groups: { include: { group: { include: { contacts: true } } } } },
  });

  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (campaign.status === 'SENDING') {
    return NextResponse.json({ error: 'Already sending' }, { status: 409 });
  }

  const settings = await getMarketingSettings();
  const resendKey = settings['marketing_resend_api_key'];
  const twilioSid = settings['marketing_twilio_sid'];
  const twilioToken = settings['marketing_twilio_token'];
  const twilioFrom = settings['marketing_twilio_from'];
  const senderName = settings['marketing_sender_name'] || 'Startup Visa Roads';
  const senderEmail = settings['marketing_sender_email'] || 'noreply@farjadp.info';
  const maxEmailsPerDay = parseInt(settings['marketing_max_emails_per_day'] || '500');
  const maxSmsPerDay = parseInt(settings['marketing_max_sms_per_day'] || '100');
  const unsubscribeUrl = settings['marketing_unsubscribe_url'] || '';

  // ── Test send mode ──────────────────────────────────────────────────────────
  if (testEmail || testPhone) {
    let emailResult = null;
    let smsResult = null;

    if (testEmail && (campaign.type === 'EMAIL' || campaign.type === 'BOTH')) {
      if (!resendKey) return NextResponse.json({ error: 'Resend API Key not configured' }, { status: 422 });
      
      const unsubBase = unsubscribeUrl || `${process.env.SITE_URL || new URL(req.url).origin}/unsubscribe`;
      const unsubUrl = unsubBase
        ? (unsubBase.includes('?') 
            ? `${unsubBase}&email=${encodeURIComponent(testEmail)}` 
            : `${unsubBase}?email=${encodeURIComponent(testEmail)}`)
        : '';
      let html = appendUnsubscribeFooter(campaign.body, unsubUrl);
      
      const siteUrl = process.env.SITE_URL || new URL(req.url).origin;
      html = trackifyHtml(html, 'test-log-id', siteUrl);
      
      try {
        emailResult = await sendEmail({
          to: testEmail,
          subject: campaign.subject ?? campaign.name,
          html,
          fromName: senderName,
          fromEmail: senderEmail,
          apiKey: resendKey,
        });
      } catch (e: unknown) {
        return NextResponse.json({ error: `Email failed: ${String(e)}` }, { status: 500 });
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

  // ── Full send ───────────────────────────────────────────────────────────────
  const contactMap = new Map<string, { id: string; email: string | null; phone: string | null }>();
  for (const cg of campaign.groups) {
    for (const contact of cg.group.contacts) {
      contactMap.set(contact.id, contact);
    }
  }
  const contacts = Array.from(contactMap.values());

  if (campaign.type === 'EMAIL' || campaign.type === 'BOTH') {
    const todayEmails = await getTodaySentCount('EMAIL');
    if (todayEmails + contacts.length > maxEmailsPerDay) {
      return NextResponse.json({ error: `Daily email limit (${maxEmailsPerDay}) would be exceeded` }, { status: 429 });
    }
  }
  if (campaign.type === 'SMS' || campaign.type === 'BOTH') {
    const todaySms = await getTodaySentCount('SMS');
    if (todaySms + contacts.length > maxSmsPerDay) {
      return NextResponse.json({ error: `Daily SMS limit (${maxSmsPerDay}) would be exceeded` }, { status: 429 });
    }
  }

  await prisma.campaign.update({ where: { id }, data: { status: 'SENDING' } });

  let sentCount = 0;
  let failedCount = 0;

  for (const contact of contacts) {
    if ((campaign.type === 'EMAIL' || campaign.type === 'BOTH') && contact.email) {
      if (!resendKey) {
        await logResult(id, contact.id, 'EMAIL', 'FAILED', 'Resend API Key not configured');
        failedCount++;
      } else {
        let logId = '';
        try {
          // Pre-create the log to get a unique CUID for tracking
          const logRecord = await prisma.campaignLog.create({
            data: {
              campaignId: id,
              contactId: contact.id,
              channel: 'EMAIL',
              status: 'SENT',
            },
          });
          logId = logRecord.id;

          const unsubBase = unsubscribeUrl || `${process.env.SITE_URL || new URL(req.url).origin}/unsubscribe`;
          const unsubUrl = unsubBase
            ? (unsubBase.includes('?') 
                ? `${unsubBase}&email=${encodeURIComponent(contact.email)}` 
                : `${unsubBase}?email=${encodeURIComponent(contact.email)}`)
            : '';
          let html = appendUnsubscribeFooter(campaign.body, unsubUrl);
          
          const siteUrl = process.env.SITE_URL || new URL(req.url).origin;
          html = trackifyHtml(html, logId, siteUrl);

          await sendEmail({
            to: contact.email,
            subject: campaign.subject ?? campaign.name,
            html,
            fromName: senderName,
            fromEmail: senderEmail,
            apiKey: resendKey,
          });
          
          sentCount++;
        } catch (e: unknown) {
          if (logId) {
            await prisma.campaignLog.update({
              where: { id: logId },
              data: {
                status: 'FAILED',
                error: String(e),
              },
            });
          } else {
            await logResult(id, contact.id, 'EMAIL', 'FAILED', String(e));
          }
          failedCount++;
        }
      }
    }

    if ((campaign.type === 'SMS' || campaign.type === 'BOTH') && contact.phone) {
      if (!twilioSid || !twilioToken || !twilioFrom) {
        await logResult(id, contact.id, 'SMS', 'FAILED', 'Twilio not configured');
        failedCount++;
      } else {
        try {
          await sendSms({
            to: contact.phone,
            body: campaign.smsBody ?? '',
            accountSid: twilioSid,
            authToken: twilioToken,
            from: twilioFrom,
          });
          await logResult(id, contact.id, 'SMS', 'SENT', null);
          sentCount++;
        } catch (e: unknown) {
          await logResult(id, contact.id, 'SMS', 'FAILED', String(e));
          failedCount++;
        }
      }
    }
  }

  const finalStatus = contacts.length === 0 ? 'DONE' : (failedCount === contacts.length ? 'FAILED' : 'DONE');
  await prisma.campaign.update({
    where: { id },
    data: { status: finalStatus, sentAt: new Date() },
  });

  return NextResponse.json({ sent: sentCount, failed: failedCount });
}

async function logResult(
  campaignId: string,
  contactId: string,
  channel: string,
  status: string,
  error: string | null,
) {
  await prisma.campaignLog.create({
    data: { campaignId, contactId, channel, status, error: error ?? undefined },
  });
}

function trackifyHtml(html: string, logId: string, siteUrl: string): string {
  if (!html) return html;
  
  const $ = cheerio.load(html);
  
  // 1. Rewrite all link hrefs (excluding anchors, mailto/tel, and unsubscribe)
  $('a').each((_, elem) => {
    const href = $(elem).attr('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      if (!href.includes('/unsubscribe') && !href.includes('/track/')) {
        const trackingUrl = `${siteUrl}/api/marketing/track/click?logId=${logId}&url=${encodeURIComponent(href)}`;
        $(elem).attr('href', trackingUrl);
      }
    }
  });

  // 2. Append the tracking pixel at the end of body
  const pixelHtml = `<img src="${siteUrl}/api/marketing/track/open?logId=${logId}" width="1" height="1" alt="" style="display:none;" />`;
  if ($('body').length > 0) {
    $('body').append(pixelHtml);
  } else {
    $.root().append(pixelHtml);
  }

  return $.html();
}

function appendUnsubscribeFooter(html: string, url: string): string {
  if (!url) return html;
  return (
    html +
    `<div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center;font-family:sans-serif;" dir="auto">
      <a href="${url}" style="color:#999;text-decoration:underline;">لغو عضویت / Unsubscribe</a>
    </div>`
  );
}
