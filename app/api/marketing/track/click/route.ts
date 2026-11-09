import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { resolveClickTarget, siteHome } from '@/lib/signed-links';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const logId = searchParams.get('logId');
  const url = searchParams.get('url') || '/';
  // Only our own hosts, or a URL the campaign sender signed. Anything else
  // (an attacker-built ?url=https://evil.example) goes to the home page and
  // is not recorded.
  const target = resolveClickTarget(url, searchParams.get('sig'));

  if (logId && target) {
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

  return NextResponse.redirect(target ?? siteHome());
}
