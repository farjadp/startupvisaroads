import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { getSessionFromRequest } from '@/lib/auth';

async function checkAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  return !!session?.username;
}

export async function GET(req: NextRequest) {
  const isAuthenticated = await checkAuth(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuthenticated = await checkAuth(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const cleanName = name.trim();
    const slug = slugify(cleanName, { lower: true, strict: true }) || 'general';

    // Check if category slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name: cleanName, slug }
    });

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuthenticated = await checkAuth(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, name } = await req.json();
    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: 'ID and Category name are required' }, { status: 400 });
    }

    const cleanName = name.trim();
    const slug = slugify(cleanName, { lower: true, strict: true }) || 'general';

    // Check if another category has the same slug
    const existing = await prisma.category.findFirst({
      where: {
        id: { not: id },
        slug
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Another category has this name or slug' }, { status: 400 });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name: cleanName, slug }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuthenticated = await checkAuth(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // 1. Reassign all articles in this category to null to prevent foreign key violations
    await prisma.article.updateMany({
      where: { categoryId: id },
      data: { categoryId: null }
    });

    // 2. Delete the category
    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
