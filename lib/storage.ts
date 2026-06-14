// ============================================================================
// Pluggable image storage.
//
// If S3-compatible object storage is configured (Cloudflare R2, AWS S3,
// Backblaze B2, MinIO, DigitalOcean Spaces, GCS XML API, ...), images are
// uploaded there and a public CDN URL is stored in the DB — keeping rows tiny
// and letting the browser/CDN cache & optimize the assets (big Core Web Vitals
// win). If NOT configured, we transparently fall back to inlining a base64
// data URL (previous behaviour), so nothing breaks without credentials.
//
// SigV4 is implemented with Web Crypto (no extra dependency).
// ----------------------------------------------------------------------------
// Required env to enable object storage:
//   S3_ENDPOINT            e.g. https://<account>.r2.cloudflarestorage.com
//   S3_BUCKET              bucket name
//   S3_ACCESS_KEY_ID
//   S3_SECRET_ACCESS_KEY
// Optional:
//   S3_REGION              default "auto" (R2). For AWS use the real region.
//   S3_PUBLIC_BASE_URL     public/CDN base, e.g. https://cdn.example.com
//                          (defaults to `${S3_ENDPOINT}/${S3_BUCKET}`)
//   S3_KEY_PREFIX          default "uploads"
// ============================================================================

const enc = new TextEncoder();

function getConfig() {
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) return null;
  return {
    endpoint: endpoint.replace(/\/$/, ''),
    bucket,
    accessKeyId,
    secretAccessKey,
    region: process.env.S3_REGION || 'auto',
    publicBase: (process.env.S3_PUBLIC_BASE_URL || `${endpoint.replace(/\/$/, '')}/${bucket}`).replace(/\/$/, ''),
    keyPrefix: (process.env.S3_KEY_PREFIX || 'uploads').replace(/^\/|\/$/g, ''),
  };
}

export function isStorageConfigured(): boolean {
  return getConfig() !== null;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(data: Uint8Array | string): Promise<string> {
  const buf = typeof data === 'string' ? enc.encode(data) : data;
  const digest = await crypto.subtle.digest('SHA-256', buf as BufferSource);
  return toHex(new Uint8Array(digest));
}

async function hmac(key: ArrayBuffer | Uint8Array, msg: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey('raw', key as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', cryptoKey, enc.encode(msg));
}

async function signingKey(secret: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  let k: ArrayBuffer | Uint8Array = enc.encode(`AWS4${secret}`);
  k = await hmac(k, dateStamp);
  k = await hmac(k, region);
  k = await hmac(k, service);
  k = await hmac(k, 'aws4_request');
  return k as ArrayBuffer;
}

function extFor(contentType: string): string {
  switch (contentType) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    case 'image/gif': return 'gif';
    default: return 'bin';
  }
}

function randomHex(n: number): string {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

function dataUrl(buffer: Uint8Array, contentType: string): string {
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${contentType};base64,${base64}`;
}

/**
 * Store an image and return a URL to it.
 * - With S3 configured: uploads and returns a public CDN URL.
 * - Without: returns an inline base64 data URL (back-compat).
 */
export async function storeImage(buffer: Uint8Array, contentType: string): Promise<string> {
  const cfg = getConfig();
  if (!cfg) return dataUrl(buffer, contentType);

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);

  const date = `${dateStamp.slice(0, 4)}/${dateStamp.slice(4, 6)}`;
  const key = `${cfg.keyPrefix}/${date}/${randomHex(16)}.${extFor(contentType)}`;

  const url = new URL(`${cfg.endpoint}/${cfg.bucket}/${key.split('/').map(encodeURIComponent).join('/')}`);
  const host = url.host;
  const service = 's3';

  const payloadHash = await sha256Hex(buffer);
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = `PUT\n${url.pathname}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const scope = `${dateStamp}/${cfg.region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${scope}\n${await sha256Hex(canonicalRequest)}`;
  const sk = await signingKey(cfg.secretAccessKey, dateStamp, cfg.region, service);
  const signature = toHex(new Uint8Array(await hmac(sk, stringToSign)));
  const authorization = `AWS4-HMAC-SHA256 Credential=${cfg.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      Authorization: authorization,
    },
    body: buffer as BodyInit,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Object storage upload failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  return `${cfg.publicBase}/${key}`;
}
