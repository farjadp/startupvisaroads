import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    // Throttle to stop anyone from flooding the PageView table.
    const ip = getClientIp(req);
    const limit = rateLimit(`track:${ip}`, 60, 60 * 1000); // 60 / min
    if (!limit.ok) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { path } = await req.json();

    // Only accept sane, internal paths.
    if (typeof path !== 'string' || !path.startsWith('/') || path.length > 512) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    await prisma.pageView.create({ data: { path } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
