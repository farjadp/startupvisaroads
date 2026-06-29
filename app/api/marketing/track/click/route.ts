import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const logId = searchParams.get('logId');
  const url = searchParams.get('url') || '/';

  if (logId) {
    try {
      const log = await prisma.campaignLog.findUnique({
        where: { id: logId },
      });

      if (log) {
        let urls: string[] = [];
        try {
          urls = JSON.parse(log.clickedUrls || '[]');
        } catch (e) {
          urls = [];
        }
        
        if (!urls.includes(url)) {
          urls.push(url);
        }

        await prisma.campaignLog.update({
          where: { id: logId },
          data: {
            clickCount: { increment: 1 },
            clickedAt: log.clickedAt ? undefined : new Date(),
            clickedUrls: JSON.stringify(urls),
          },
        });
      }
    } catch (error) {
      console.error('Error tracking link click:', error);
    }
  }

  // Redirect the browser to the destination URL
  return NextResponse.redirect(new URL(url, req.url));
}
