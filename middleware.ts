import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';
import { verifyJWT, getJwtSecret } from './lib/auth';

const intlMiddleware = createMiddleware(routing);

// Returns the verified admin payload, or null. Fails closed: if the JWT secret
// is misconfigured we treat the request as unauthenticated rather than crashing.
async function getAdminPayload(request: NextRequest): Promise<any | null> {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  if (!sessionCookie) return null;
  try {
    const payload = await verifyJWT(sessionCookie, getJwtSecret());
    return payload && payload.username ? payload : null;
  } catch {
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = /^\/(en|fa)\/admin(\/|$)/.test(pathname) || pathname === '/admin';
  const isLoginPage = /^\/(en|fa)\/admin\/login(\/|$)/.test(pathname) || pathname === '/admin/login';

  if (isAdminPath && !isLoginPage) {
    const payload = await getAdminPayload(request);
    if (!payload) {
      const localeMatch = pathname.match(/^\/(en|fa)/);
      const locale = localeMatch ? localeMatch[1] : 'en';

      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isLoginPage) {
    const payload = await getAdminPayload(request);
    if (payload) {
      const localeMatch = pathname.match(/^\/(en|fa)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for:
    // - /api routes
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - static files (paths with dots)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
