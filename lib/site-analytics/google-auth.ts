// ============================================================================
// Access tokens for the Search Console and GA4 Data APIs, with no Google SDK.
//
// On Cloud Run the runtime service account answers through the metadata
// server, so production needs no key file: Farjad grants that account's email
// access in Search Console and GA4 and nothing secret is stored. Anywhere else
// (local dev) a service-account JSON key in GOOGLE_SERVICE_ACCOUNT_KEY is used
// if present. With neither, there are no credentials and callers fail closed.
// ============================================================================
import { createSign } from 'crypto';

export const ANALYTICS_SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
];

const METADATA = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export type CredentialSource = 'metadata' | 'key' | null;

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
}

function readKey(): ServiceAccountKey | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    // Accept the JSON itself or base64 of it (easier to paste into an env var).
    const text = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
    const key = JSON.parse(text);
    return key.client_email && key.private_key ? key : null;
  } catch {
    return null;
  }
}

/** Where credentials would come from. K_SERVICE is set by Cloud Run on every instance. */
export function credentialSource(): CredentialSource {
  if (readKey()) return 'key';
  if (process.env.K_SERVICE) return 'metadata';
  return null;
}

let cached: { token: string; expiresAt: number } | null = null;

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function tokenFromKey(key: ServiceAccountKey): Promise<{ token: string; expiresIn: number }> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({ iss: key.client_email, scope: ANALYTICS_SCOPES.join(' '), aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const assertion = `${header}.${claims}.${base64url(signer.sign(key.private_key))}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Google token exchange failed (${res.status})`);
  const body = await res.json();
  return { token: body.access_token, expiresIn: body.expires_in ?? 3600 };
}

async function tokenFromMetadata(): Promise<{ token: string; expiresIn: number }> {
  const url = `${METADATA}/token?scopes=${encodeURIComponent(ANALYTICS_SCOPES.join(','))}`;
  const res = await fetch(url, { headers: { 'Metadata-Flavor': 'Google' }, signal: AbortSignal.timeout(5_000) });
  if (!res.ok) throw new Error(`Metadata server token request failed (${res.status})`);
  const body = await res.json();
  return { token: body.access_token, expiresIn: body.expires_in ?? 3600 };
}

/** A bearer token carrying both read-only scopes, reused until a minute before it expires. */
export async function getAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
  const source = credentialSource();
  if (!source) throw new Error('No Google credentials configured');
  const key = readKey();
  const { token, expiresIn } = key ? await tokenFromKey(key) : await tokenFromMetadata();
  cached = { token, expiresAt: Date.now() + expiresIn * 1000 };
  return token;
}

/** The email Search Console and GA4 must grant access to, for the setup hint. */
export async function serviceAccountEmail(): Promise<string | null> {
  const key = readKey();
  if (key) return key.client_email;
  if (!process.env.K_SERVICE) return null;
  try {
    const res = await fetch(`${METADATA}/email`, { headers: { 'Metadata-Flavor': 'Google' }, signal: AbortSignal.timeout(3_000) });
    return res.ok ? (await res.text()).trim() : null;
  } catch {
    return null;
  }
}
