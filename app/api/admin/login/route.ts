import { NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-1234';

    if (!expectedPassword) {
      console.error('ADMIN_PASSWORD not set in environment variables');
      return NextResponse.json(
        { success: false, error: 'Authentication is not configured on the server.' },
        { status: 500 }
      );
    }

    if (username === expectedUsername && password === expectedPassword) {
      // 1 day expiration
      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; 
      const token = await signJWT({ username, exp }, jwtSecret);

      const response = NextResponse.json({ success: true });
      
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
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
