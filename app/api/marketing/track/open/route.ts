import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const logId = searchParams.get('logId');

  if (logId) {
    try {
      // Find the log first to make sure it exists
      const log = await prisma.campaignLog.findUnique({
        where: { id: logId },
      });

      if (log) {
        await prisma.campaignLog.update({
          where: { id: logId },
          data: {
            openCount: { increment: 1 },
            openedAt: log.openedAt ? undefined : new Date(),
          },
        });
      }
    } catch (error) {
      console.error('Error tracking email open:', error);
    }
  }

  // Return a 1x1 transparent GIF
  const transparentGif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

  return new NextResponse(transparentGif, {
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': transparentGif.length.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
