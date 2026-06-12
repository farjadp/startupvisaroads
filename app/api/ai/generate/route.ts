import { NextRequest, NextResponse } from 'next/server';
import { generateArticlePayload } from '@/lib/ai';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { verifyJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the request
    const sessionCookie = req.cookies.get('admin_session')?.value;
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-1234';
    let isAuthenticated = false;
    
    if (sessionCookie) {
      const payload = await verifyJWT(sessionCookie, jwtSecret);
      if (payload && payload.username) {
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Intelligent category lookup (restrict to existing categories)
    let categoryId: string | null = null;
    if (payload.category) {
      const categoryName = payload.category.trim();
      const categorySlug = slugify(categoryName, { lower: true, strict: true });
      
      let category = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: categorySlug },
            { name: categoryName }
          ]
        }
      });
      
      if (category) {
        categoryId = category.id;
      } else {
        // Fallback: Use the first category in the database
        const firstCategory = await prisma.category.findFirst();
        if (firstCategory) {
          categoryId = firstCategory.id;
        }
      }
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

    const article = await prisma.article.create({
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

    return NextResponse.json({ success: true, articleId: article.id });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
