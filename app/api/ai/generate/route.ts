import { NextRequest, NextResponse } from 'next/server';
import { generateArticlePayload } from '@/lib/ai';
import { createArticleFromPayload } from '@/lib/articles';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the request
    const session = await getSessionFromRequest(req);
    if (!session?.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mode, input, locale } = await req.json();

    if (!mode || !input) {
      return NextResponse.json({ error: 'Mode and input are required' }, { status: 400 });
    }

    const articleLocale = locale === 'fa' ? 'fa' : 'en';
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
