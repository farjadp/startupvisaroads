import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateArticlePayload } from '@/lib/ai';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verify cron secret token
  const authHeader = request.headers.get('Authorization');
  const querySecret = request.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('CRON_SECRET env variable not set');
    return NextResponse.json({ error: 'CRON_SECRET server configuration missing' }, { status: 500 });
  }

  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : querySecret;
  if (token !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    // Intelligent category creation and lookup
    let categoryId: string | null = null;
    if (payload.category) {
      const categoryName = payload.category.trim();
      const categorySlug = slugify(categoryName, { lower: true, strict: true }) || 'general';
      
      let category = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: categorySlug },
            { name: categoryName }
          ]
        }
      });
      
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
            slug: categorySlug
          }
        });
      }
      categoryId = category.id;
    }

    // Tags processing and association
    const tagNames: string[] = payload.tags || [];
    const tagConnections = [];
    
    for (const name of tagNames) {
      const cleanedName = name.trim();
      if (!cleanedName) continue;
      
      const tag = await prisma.tag.upsert({
        where: { name: cleanedName },
        update: {},
        create: { name: cleanedName }
      });
      
      tagConnections.push({ id: tag.id });
    }

    await prisma.article.create({
      data: {
        title: payload.title,
        slug,
        excerpt: payload.excerpt,
        content: payload.content,
        coverImage: payload.coverImage,
        status: 'PUBLISHED', // Instant publish
        ...(categoryId ? { categoryId } : {}),
        tags: {
          connect: tagConnections
        }
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
