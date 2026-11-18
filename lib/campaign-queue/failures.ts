// ============================================================================
// lib/campaign-queue/failures.ts
// Reads a provider failure. "Systemic" means the next send would fail the same
// way, so the campaign pauses instead of burning through the list.
//
// Resend's SDK does not throw: it resolves with { data: null, error }. The old
// sender only caught exceptions, so refused emails were logged as SENT.
// ============================================================================

export interface SendFailure {
  message: string;
  systemic: boolean;
  /** The provider refused the request, so the recipient can safely be retried. */
  definitelyNotSent: boolean;
}

const SYSTEMIC_NAMES = new Set([
  'missing_api_key',
  'invalid_api_key',
  'restricted_api_key',
  'invalid_access',
  'invalid_from_address',
  'rate_limit_exceeded',
  'daily_quota_exceeded',
  'monthly_quota_exceeded',
  'security_error',
]);
const SYSTEMIC_STATUS = new Set([401, 403, 429]);
const DOMAIN_NOT_VERIFIED = /domain.*not verified|not verified.*domain/i;

const clean = (text: string) => text.replace(/\bre_[A-Za-z0-9_]+/g, '[key]').slice(0, 300);

export function classifyFailure(error: unknown): SendFailure {
  const e = (error ?? {}) as { name?: unknown; message?: unknown; statusCode?: unknown; status?: unknown };
  const message = typeof e.message === 'string' && e.message ? e.message : String(error);
  const name = typeof e.name === 'string' ? e.name : '';
  const status = typeof e.statusCode === 'number' ? e.statusCode : typeof e.status === 'number' ? e.status : null;
  const systemic =
    SYSTEMIC_NAMES.has(name) || (status !== null && SYSTEMIC_STATUS.has(status)) || DOMAIN_NOT_VERIFIED.test(message);
  return {
    message: clean(name && name !== 'Error' ? `${name}: ${message}` : message),
    systemic,
    definitelyNotSent: systemic,
  };
}
