// ============================================================================
// GA4 conversion events. The tag itself is components/Analytics.tsx; when no
// measurement ID is configured, window.gtag never exists and every call here
// is a no-op.
// ============================================================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
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

/** Records a successful lead-form submission as GA4's recommended generate_lead event. */
export function trackLead(form: LeadForm, locale: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'generate_lead', { form_name: form, locale });
}
