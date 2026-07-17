export const maxDuration = 300; // Allow long execution time
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateArticlePayload } from '@/lib/ai';
import { createArticleFromPayload } from '@/lib/articles';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session?.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    // Atomically claim the job
    const claim = await prisma.aiKeyword.updateMany({
      where: { id: jobId, status: 'INTERACTIVE_PENDING' },
      data: { status: 'PROCESSING' },
    });
    
    if (claim.count === 0) {
      return NextResponse.json({ error: 'Job not found or already processing' }, { status: 404 });
    }

    const job = await prisma.aiKeyword.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    let mode: 'KEYWORD' | 'URL' | 'TEXT' = 'KEYWORD';
    let input = job.keyword;
    let articleLocale: 'en' | 'fa' = 'en';

    try {
      const parsed = JSON.parse(job.keyword);
      mode = parsed.mode as 'KEYWORD' | 'URL' | 'TEXT';
      input = parsed.input;
      articleLocale = parsed.locale || 'en';
    } catch (e) {
      // Fallback if not JSON
    }

    try {
      const payload = await generateArticlePayload(mode, input, articleLocale);
      const article = await createArticleFromPayload(payload, {
        locale: articleLocale,
        status: 'PUBLISHED',
      });

      // Save the articleId in the error field temporarily to easily retrieve it in status route
      await prisma.aiKeyword.update({
        where: { id: jobId },
        data: { status: 'COMPLETED', error: article.id }, // Storing article.id in error field for easy retrieval
      });

      return NextResponse.json({ success: true, articleId: article.id });
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      await prisma.aiKeyword.update({
        where: { id: jobId },
        data: { status: 'ERROR', error: error.message },
      });
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error('AI Process Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
