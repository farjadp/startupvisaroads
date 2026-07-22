export const maxDuration = 300; // Allow long execution time
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';

function getDiceCoefficient(str1: string, str2: string) {
  const getBigrams = (str: string) => {
    const s = (str || '').toLowerCase().replace(/\s+/g, '');
    const bigrams = [];
    for (let i = 0; i < s.length - 1; i++) {
      bigrams.push(s.substring(i, i + 2));
    }
    return bigrams;
  };

  const b1 = getBigrams(str1);
  const b2 = getBigrams(str2);
  if (b1.length === 0 || b2.length === 0) return 0;
  
  let intersection = 0;
  for (const bigram of b1) {
    const index = b2.indexOf(bigram);
    if (index !== -1) {
      intersection++;
      b2.splice(index, 1);
    }
  }
  
  return (2.0 * intersection) / (b1.length + b2.length);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the request
    const session = await getSessionFromRequest(req);
    if (!session?.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mode, input, locale, force } = await req.json();

    if (!mode || !input) {
      return NextResponse.json({ error: 'Mode and input are required' }, { status: 400 });
    }

    const articleLocale = locale === 'fa' ? 'fa' : 'en';

    if (!force && mode !== 'URL') {
      // ─── Duplicate detection ────────────────────────────────────────────────
      // Only fetch titles — never content. Loading full article HTML for every
      // article would transfer megabytes from the DB and make the bigram
      // comparison O(input_len × content_len × article_count), which caused
      // Cloudflare 524 timeouts on large TEXT mode inputs.
      //
      // We also cap the input used for comparison at 400 chars. Article titles
      // are ~60-100 chars, so the bigram check becomes trivially fast.
      const existingArticles = await prisma.article.findMany({
        select: { title: true },
        where: { locale: articleLocale },
      });

      const inputForCheck = input.trim().substring(0, 400);

      let maxSimilarity = 0;
      let matchedTitle = '';

      for (const article of existingArticles) {
        const similarity = getDiceCoefficient(inputForCheck, article.title);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          matchedTitle = article.title;
        }
      }

      if (maxSimilarity > 0.5) {
        return NextResponse.json({ 
          success: false, 
          duplicateDetected: true, 
          maxSimilarity: Math.round(maxSimilarity * 100), 
          matchedArticleTitle: matchedTitle 
        });
      }
    }

    // Queue the job using AiKeyword model with a special status to avoid cron pickup
    const payloadObj = { mode, input, locale: articleLocale };
    const job = await prisma.aiKeyword.create({
      data: {
        keyword: JSON.stringify(payloadObj),
        status: 'INTERACTIVE_PENDING',
      },
    });

    return NextResponse.json({ success: true, jobId: job.id });

  } catch (error: any) {
    console.error('AI Generation Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
