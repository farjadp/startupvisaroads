import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateArticlePayload } from '@/lib/ai';
import { createArticleFromPayload } from '@/lib/articles';
import { safeCompare } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Detect article language from the keyword (presence of Persian/Arabic script).
function detectLocale(text: string): 'en' | 'fa' {
  return /[؀-ۿ]/.test(text) ? 'fa' : 'en';
}

export async function GET(request: NextRequest) {
  // Verify cron secret token (constant-time)
  const authHeader = request.headers.get('Authorization');
  const querySecret = request.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('CRON_SECRET env variable not set');
    return NextResponse.json({ error: 'CRON_SECRET server configuration missing' }, { status: 500 });
  }

  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (querySecret || '');
  if (!safeCompare(token, cronSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let keywordJobId: string | null = null;

  try {
    const keywordJob = await prisma.aiKeyword.findFirst({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
    });

    if (!keywordJob) {
      return NextResponse.json({ success: true, message: 'No pending keywords found' });
    }

    // Atomically claim the job: only succeeds if it is still PENDING. This
    // prevents two overlapping cron runs from processing the same keyword.
    const claim = await prisma.aiKeyword.updateMany({
      where: { id: keywordJob.id, status: 'PENDING' },
      data: { status: 'PROCESSING' },
    });
    if (claim.count === 0) {
      return NextResponse.json({ success: true, message: 'Keyword already claimed by another run' });
    }

    keywordJobId = keywordJob.id;
    
    let mode: 'KEYWORD' | 'URL' | 'TEXT' = 'KEYWORD';
    let input = keywordJob.keyword;
    let locale: 'en' | 'fa' = 'en';

    try {
      const parsed = JSON.parse(keywordJob.keyword);
      if (parsed.mode && parsed.input) {
        mode = parsed.mode as 'KEYWORD' | 'URL' | 'TEXT';
        input = parsed.input;
        locale = parsed.locale || 'en';
      }
    } catch (e) {
      // Not JSON, assume it's just a keyword
      locale = detectLocale(keywordJob.keyword);
    }

    const payload = await generateArticlePayload(mode, input, locale);
    await createArticleFromPayload(payload, { locale, status: 'PUBLISHED' });

    await prisma.aiKeyword.update({
      where: { id: keywordJob.id },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json({ success: true, keyword: keywordJob.keyword });
  } catch (error: any) {
    console.error('Cron AI Generation Error:', error);

    if (keywordJobId) {
      await prisma.aiKeyword.update({
        where: { id: keywordJobId },
        data: { status: 'ERROR', error: error.message },
      });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
