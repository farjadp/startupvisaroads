// ============================================================================
// Consent record input (POST /api/admin/case-studies/consents).
//
// clientRef is an internal reference, never a name (spec §7). Enforced shape:
//   2–64 chars of letters, digits, '.', '_' or '-'; starts with a letter or
//   digit; contains at least one digit; no whitespace, no '@'.
// So "VR-2026-014" passes; "Jane Doe", "jane@example.com" and "JaneDoe" fail.
// scope: a JSON object (stored as a JSON string) or plain text (stored as
// {"text": "..."}). signedAt: ISO date, not in the future. documentUri:
// optional private-storage reference, no whitespace, at most 500 chars.
// ============================================================================

export type ConsentInput = { clientRef: string; scope: string; signedAt: Date; documentUri: string | null };
export type ParsedConsent = { ok: true; input: ConsentInput } | { ok: false; error: string };

const CLIENT_REF_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{1,63}$/;
const CLOCK_SKEW_MS = 5 * 60_000;

export function isValidClientRef(ref: string): boolean {
  return CLIENT_REF_RE.test(ref) && /\d/.test(ref);
}

export function parseConsentInput(body: Record<string, unknown>, now = new Date()): ParsedConsent {
  for (const k of Object.keys(body)) {
    if (!['clientRef', 'scope', 'signedAt', 'documentUri'].includes(k)) return { ok: false, error: `unknown key ${k}` };
  }
  const { clientRef, scope, signedAt, documentUri } = body;
  if (typeof clientRef !== 'string' || !isValidClientRef(clientRef.trim())) {
    return { ok: false, error: 'clientRef must be an internal reference like VR-2026-014 (no names, no emails, at least one digit)' };
  }
  let scopeJson: string;
  if (typeof scope === 'string' && scope.trim()) scopeJson = JSON.stringify({ text: scope.trim() });
  else if (typeof scope === 'object' && scope !== null && !Array.isArray(scope)) scopeJson = JSON.stringify(scope);
  else return { ok: false, error: 'scope is required (an object or text)' };
  if (scopeJson.length > 10_000) return { ok: false, error: 'scope is over 10000 characters' };

  if (typeof signedAt !== 'string') return { ok: false, error: 'signedAt is required (ISO date)' };
  const signed = new Date(signedAt);
  if (Number.isNaN(signed.getTime())) return { ok: false, error: 'signedAt is not an ISO date' };
  if (signed.getTime() > now.getTime() + CLOCK_SKEW_MS) return { ok: false, error: 'signedAt is in the future' };

  let uri: string | null = null;
  if (documentUri !== undefined && documentUri !== null) {
    if (typeof documentUri !== 'string' || documentUri.length > 500 || /\s/.test(documentUri)) {
      return { ok: false, error: 'documentUri must be a private storage reference without spaces' };
    }
    uri = documentUri || null;
  }
  return { ok: true, input: { clientRef: clientRef.trim(), scope: scopeJson, signedAt: signed, documentUri: uri } };
}
