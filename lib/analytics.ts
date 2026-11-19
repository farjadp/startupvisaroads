// ============================================================================
// Lead conversion events for GA4 and the OpenAI Ads pixel. The tags are
// components/Analytics.tsx and components/OpenAIPixel.tsx; when either is not
// configured its global never exists and that half is a no-op.
// ============================================================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    oaiq?: (...args: unknown[]) => void;
  }
}

/** The forms whose successful submission counts as a lead. */
export type LeadForm =
  | 'contact'
  | 'webinar'
  | 'path_quiz'
  | 'usa_assessment'
  | 'startup_work_permit'
  | 'pnp_assessment';

/**
 * Records a successful lead-form submission: GA4's generate_lead, and OpenAI's
 * lead_created with the event id the server action already sent through the
 * Conversions API (lib/openaiAds.ts), so OpenAI counts it once.
 */
export function trackLead(form: LeadForm, locale: string, eventId?: string): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', { form_name: form, locale });
  }
  if (typeof window.oaiq === 'function' && eventId) {
    window.oaiq('measure', 'lead_created', { type: 'customer_action' }, { event_id: eventId });
  }
}

export type AppPromptEvent = 'app_prompt_shown' | 'app_prompt_click' | 'app_prompt_dismiss';

/** The phone "get the app" prompts: the article card and the bottom bar (lib/app-prompt.ts). */
export function trackAppPrompt(
  event: AppPromptEvent,
  params: { platform: 'ios' | 'android'; locale: string; browser: 'in_app' | 'standard'; placement?: 'article' | 'bar' },
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, { placement: 'article', ...params });
}

/**
 * The partner page (/partners). Google's booking iframe is cross-origin, so a
 * completed booking cannot be seen from here: these events measure intent
 * (CTA clicks, the calendar opened, the fallbacks used), not bookings.
 */
export type PartnerEvent =
  | 'partner_cta_click'
  | 'partner_calendar_open'
  | 'partner_calendar_new_tab'
  | 'partner_contact_click';

/** Where the click happened. 'cta' = the calendar was opened by a Book button elsewhere on the page. */
export type PartnerPlacement = 'hero' | 'sticky' | 'final' | 'booking' | 'cta';

export function trackPartner(
  event: PartnerEvent,
  params: { locale: string; placement: PartnerPlacement; channel?: 'email' | 'telegram' },
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, { ...params, page_type: 'partners' });
}
