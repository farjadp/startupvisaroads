import { NextRequest, NextResponse } from 'next/server';
import { generateArticlePayload } from '@/lib/ai';
import prisma from '@/lib/prisma';
import slugify from 'slugify';

export async function POST(req: NextRequest) {
  try {
    const { mode, input } = await req.json();
    
    if (!mode || !input) {
      return NextResponse.json({ error: 'Mode and input are required' }, { status: 400 });
    }

    const payload = await generateArticlePayload(mode, input);

    const baseSlug = slugify(payload.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const article = await prisma.article.create({
      data: {
        title: payload.title,
        slug,
        excerpt: payload.excerpt,
        content: payload.content,
        coverImage: payload.coverImage,
        status: 'DRAFT', 
      }
    });

    return NextResponse.json({ success: true, articleId: article.id });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
