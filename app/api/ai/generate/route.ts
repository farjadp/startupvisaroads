export const maxDuration = 300; // Allow long execution time

import { NextRequest, NextResponse } from 'next/server';
import { generateArticlePayload } from '@/lib/ai';
import { createArticleFromPayload } from '@/lib/articles';
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
      const existingArticles = await prisma.article.findMany({
        select: { title: true, content: true },
        where: { locale: articleLocale }
      });

      let maxSimilarity = 0;
      let matchedTitle = '';

      for (const article of existingArticles) {
        const targetString = mode === 'TEXT' ? article.content : article.title;
        const similarity = getDiceCoefficient(input, targetString);
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
    const payload = await generateArticlePayload(mode, input, articleLocale);

    const article = await createArticleFromPayload(payload, {
      locale: articleLocale,
      status: 'PUBLISHED',
    });

    return NextResponse.json({ success: true, articleId: article.id });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
