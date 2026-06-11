import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateArticlePayload } from '@/lib/ai';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

export async function GET() {
  let keywordJobId: string | null = null;
  
  try {
    const keywordJob = await prisma.aiKeyword.findFirst({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' }
    });

    if (!keywordJob) {
      return NextResponse.json({ success: true, message: 'No pending keywords found' });
    }

    keywordJobId = keywordJob.id;

    await prisma.aiKeyword.update({
      where: { id: keywordJob.id },
      data: { status: 'PROCESSING' }
    });

    const payload = await generateArticlePayload('KEYWORD', keywordJob.keyword);

    const baseSlug = slugify(payload.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.article.create({
      data: {
        title: payload.title,
        slug,
        excerpt: payload.excerpt,
        content: payload.content,
        coverImage: payload.coverImage,
        status: 'DRAFT',
      }
    });

    await prisma.aiKeyword.update({
      where: { id: keywordJob.id },
      data: { status: 'COMPLETED' }
    });

    return NextResponse.json({ success: true, keyword: keywordJob.keyword });
  } catch (error: any) {
    console.error('Cron AI Generation Error:', error);
    
    if (keywordJobId) {
      await prisma.aiKeyword.update({
        where: { id: keywordJobId },
        data: { status: 'ERROR', error: error.message }
      });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
