// A lightweight JWT implementation using Web Crypto API.
// Fully compatible with Edge Runtime (Next.js Middleware) and Node.js.

import type { NextRequest } from 'next/server';

/**
 * Returns the JWT signing secret, throwing if it is missing or too weak.
 * There is intentionally NO insecure fallback — a predictable secret would let
 * anyone forge an admin session.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('JWT_SECRET environment variable is not set or is too weak (minimum 16 characters).');
  }
  return secret;
}

/** SHA-256 hex digest (Edge-compatible) — used for hashed password comparison. */
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Constant-time string comparison to avoid leaking length/content via timing. */
export function safeCompare(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  const len = Math.max(ab.length, bb.length);
  let result = ab.length === bb.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    result |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return result === 0;
}

/** Verify the admin session cookie on a request; returns the payload or null. */
export async function getSessionFromRequest(req: NextRequest): Promise<any | null> {
  const token = req.cookies.get('admin_session')?.value;
  if (!token) return null;
  try {
    return await verifyJWT(token, getJwtSecret());
  } catch {
    return null;
  }
}

function base64urlEncode(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binString = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binString += String.fromCharCode(bytes[i]);
  }
  return btoa(binString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binString = atob(base64);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signJWT(payload: any, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const tokenInput = `${encodedHeader}.${encodedPayload}`;
  
  const key = await getCryptoKey(secret);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(tokenInput)
  );
  
  const signatureBytes = new Uint8Array(signature);
  let sigBinString = '';
  for (let i = 0; i < signatureBytes.byteLength; i++) {
    sigBinString += String.fromCharCode(signatureBytes[i]);
  }
  
  const encodedSignature = btoa(sigBinString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
    
  return `${tokenInput}.${encodedSignature}`;
}

export async function verifyJWT(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const tokenInput = `${encodedHeader}.${encodedPayload}`;
    
    const key = await getCryptoKey(secret);
    const encoder = new TextEncoder();
    
    // Decode base64url signature back to array buffer
    let sigBase64 = encodedSignature.replace(/-/g, '+').replace(/_/g, '/');
    while (sigBase64.length % 4) {
      sigBase64 += '=';
    }
    const sigBinaryString = atob(sigBase64);
    const sigBytes = new Uint8Array(sigBinaryString.length);
    for (let i = 0; i < sigBinaryString.length; i++) {
      sigBytes[i] = sigBinaryString.charCodeAt(i);
    }
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(tokenInput)
    );
    
    if (!isValid) return null;
    
    const decodedPayload = base64urlDecode(encodedPayload);
    const payload = JSON.parse(decodedPayload);
    
    // Check expiration (if exp exists)
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }
    
    return payload;
  } catch (e) {
    return null;
  }
}
