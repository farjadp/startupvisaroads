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

/** The phone "get the app" card in articles (components/blog/ArticleAppCard.tsx). */
export function trackAppPrompt(
  event: AppPromptEvent,
  params: { platform: 'ios' | 'android'; locale: string; browser: 'in_app' | 'standard' },
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, { ...params, placement: 'article' });
}
