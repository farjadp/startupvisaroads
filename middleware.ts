import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';
import { verifyJWT } from './lib/auth';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = /^\/(en|fa)\/admin(\/|$)/.test(pathname) || pathname === '/admin';
  const isLoginPage = /^\/(en|fa)\/admin\/login(\/|$)/.test(pathname) || pathname === '/admin/login';

  if (isAdminPath && !isLoginPage) {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-1234';

    let isAuthenticated = false;
    if (sessionCookie) {
      const payload = await verifyJWT(sessionCookie, jwtSecret);
      if (payload && payload.username) {
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      const localeMatch = pathname.match(/^\/(en|fa)/);
      const locale = localeMatch ? localeMatch[1] : 'en';

      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isLoginPage) {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-1234';

    if (sessionCookie) {
      const payload = await verifyJWT(sessionCookie, jwtSecret);
      if (payload && payload.username) {
        const localeMatch = pathname.match(/^\/(en|fa)/);
        const locale = localeMatch ? localeMatch[1] : 'en';
        return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
      }
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
