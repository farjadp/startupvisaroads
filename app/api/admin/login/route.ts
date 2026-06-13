import { NextRequest, NextResponse } from 'next/server';
import { signJWT, getJwtSecret, safeCompare, sha256Hex } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    // Brute-force protection: 5 attempts per IP per 5 minutes.
    const ip = getClientIp(req);
    const limit = rateLimit(`login:${ip}`, 5, 5 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const { username, password } = await req.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD;
    const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH; // SHA-256 hex (preferred)

    let jwtSecret: string;
    try {
      jwtSecret = getJwtSecret();
    } catch (e) {
      console.error('Auth misconfiguration:', e);
      return NextResponse.json(
        { success: false, error: 'Authentication is not configured on the server.' },
        { status: 500 }
      );
    }

    if (!expectedPassword && !expectedPasswordHash) {
      console.error('Neither ADMIN_PASSWORD nor ADMIN_PASSWORD_HASH is set');
      return NextResponse.json(
        { success: false, error: 'Authentication is not configured on the server.' },
        { status: 500 }
      );
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
    }

    // Prefer hashed comparison; fall back to constant-time plaintext compare.
    const passwordOk = expectedPasswordHash
      ? safeCompare(await sha256Hex(password), expectedPasswordHash.toLowerCase())
      : safeCompare(password, expectedPassword as string);
    const usernameOk = safeCompare(username, expectedUsername);

    if (usernameOk && passwordOk) {
      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1 day
      const iat = Math.floor(Date.now() / 1000);
      const token = await signJWT({ username, iat, exp }, jwtSecret);

      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
