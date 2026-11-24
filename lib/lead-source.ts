// ============================================================================
// lib/lead-source.ts
// Which on-site link a lead came from, carried into the lead itself.
//
// Internal links (e.g. the pricing page's buttons) add `?from=<page>&route=<link>`
// to the URL. The quiz and contact forms copy those two values into the form
// (attachLeadSource, browser), and the server actions print them in the
// Telegram lead message (leadSourceLine). GA4 also records them on the page
// view (page_location) and on generate_lead.
//
// Deliberately NOT utm_*: a UTM on an internal link starts a new GA4 session
// and overwrites the visitor's real source (Google, Instagram, an email), so
// the campaign data would get worse, not better. UTMs stay for links that
// leave the site.
// ============================================================================

const SAFE = /^[a-z0-9-]{1,40}$/;

export type LeadSource = { from: string; route: string };

function clean(v: unknown): string {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
  return SAFE.test(s) ? s : '';
}

/** Builds an internal link that says where it was clicked. */
export function withLeadSource(path: string, from: string, route: string): string {
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}from=${encodeURIComponent(from)}&route=${encodeURIComponent(route)}`;
}

/** Browser: the source in the current URL, if any. */
export function readLeadSource(): LeadSource | null {
  if (typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  const from = clean(q.get('from'));
  return from ? { from, route: clean(q.get('route')) } : null;
}

/** Browser: copy the source from the URL into a form about to be submitted. */
export function attachLeadSource(form: FormData): LeadSource | null {
  const s = readLeadSource();
  if (s) {
    form.set('src_from', s.from);
    if (s.route) form.set('src_route', s.route);
  }
  return s;
}

/** Server: the line for the lead message, or '' when the lead has no on-site source. */
export function leadSourceLine(form: FormData): string {
  const from = clean(form.get('src_from'));
  if (!from) return '';
  const route = clean(form.get('src_route'));
  return `📍 Came from: ${from}${route ? ` · ${route}` : ''}`;
}
