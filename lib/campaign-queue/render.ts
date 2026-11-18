// ============================================================================
// lib/campaign-queue/render.ts
// Builds the email a recipient gets: signed unsubscribe link, tracked links
// and the open pixel. Shared by the queue worker and the test send.
// ============================================================================
import * as cheerio from 'cheerio';
import { applyUnsubscribe } from '@/lib/unsubscribe-footer';
import { buildUnsubscribeUrl, clickSignature } from '@/lib/signed-links';

type MarketingSettings = Record<string, string | undefined>;

export function senderFrom(settings: MarketingSettings) {
  return {
    name: settings.marketing_sender_name || 'Startup Visa Roads',
    email: settings.marketing_sender_email || 'noreply@farjadp.info',
    isFallback: !settings.marketing_sender_email,
  };
}

/** The configured unsubscribe page, ignoring anything that is not a web URL. */
export function unsubscribeBase(settings: MarketingSettings, siteUrl: string): string {
  const configured = settings.marketing_unsubscribe_url?.trim();
  if (configured) {
    try {
      const { protocol } = new URL(configured);
      if (protocol === 'https:' || protocol === 'http:') return configured;
    } catch {
      // Not a URL: fall through to our own page.
    }
  }
  return `${siteUrl}/unsubscribe`;
}

export function trackifyHtml(html: string, logId: string, siteUrl: string): string {
  if (!html) return html;
  const $ = cheerio.load(html);

  $('a').each((_, elem) => {
    const href = $(elem).attr('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      if (!href.includes('/unsubscribe') && !href.includes('/track/')) {
        const trackingUrl = `${siteUrl}/api/marketing/track/click?logId=${logId}&url=${encodeURIComponent(href)}&sig=${clickSignature(href)}`;
        $(elem).attr('href', trackingUrl);
      }
    }
  });

  const pixelHtml = `<img src="${siteUrl}/api/marketing/track/open?logId=${logId}" width="1" height="1" alt="" style="display:none;" />`;
  if ($('body').length > 0) {
    $('body').append(pixelHtml);
  } else {
    $.root().append(pixelHtml);
  }
  return $.html();
}

export function renderCampaignEmail(opts: {
  body: string;
  to: string;
  logId: string;
  siteUrl: string;
  settings: MarketingSettings;
}): string {
  const unsubUrl = buildUnsubscribeUrl(unsubscribeBase(opts.settings, opts.siteUrl), opts.to);
  return trackifyHtml(applyUnsubscribe(opts.body, unsubUrl), opts.logId, opts.siteUrl);
}
