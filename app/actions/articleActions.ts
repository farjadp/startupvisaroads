'use server';

import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sanitizeHtml } from '@/lib/sanitize';
import { shareToSocials } from '@/lib/socials';

const normalizeLocale = (v: FormDataEntryValue | null): string => (v === 'fa' ? 'fa' : 'en');

export async function createArticle(formData: FormData) {
  const title = formData.get('title') as string;
  const content = sanitizeHtml(formData.get('content') as string);
  const excerpt = formData.get('excerpt') as string;
  const coverImage = formData.get('coverImage') as string;
  const status = formData.get('status') as string || 'DRAFT';
  const rawTags = formData.get('tags') as string;
  const categoryId = formData.get('categoryId') as string || null;
  const locale = normalizeLocale(formData.get('locale'));

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const tagsList = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : [];
  
  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage: coverImage || null,
      status,
      locale,
      ...(categoryId && categoryId !== '' ? { category: { connect: { id: categoryId } } } : {}),
      tags: {
        connectOrCreate: tagsList.map(t => ({
          where: { name: t },
          create: { name: t },
        })),
      },
    },
  });

  if (article.status === 'PUBLISHED') {
    await shareToSocials(article.id);
  }

  revalidatePath('/en/admin/articles');
  revalidatePath('/fa/admin/articles');
  revalidatePath('/en/blog');
  revalidatePath('/fa/blog');
  redirect('/en/admin/articles');
}

export async function updateArticle(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const content = sanitizeHtml(formData.get('content') as string);
  const excerpt = formData.get('excerpt') as string;
  const coverImage = formData.get('coverImage') as string;
  const status = formData.get('status') as string || 'DRAFT';
  const rawTags = formData.get('tags') as string;
  const categoryId = formData.get('categoryId') as string || null;
  const customSlug = formData.get('slug') as string;
  const locale = normalizeLocale(formData.get('locale'));

  const tagsList = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : [];

  // Update slug only if provided, else keep existing
  let updateData: any = {
    title,
    content,
    excerpt,
    coverImage: coverImage || null,
    status,
    locale,
    ...(categoryId && categoryId !== '' ? { category: { connect: { id: categoryId } } } : { category: { disconnect: true } }),
    tags: {
      set: [], // clear existing
      connectOrCreate: tagsList.map(t => ({
        where: { name: t },
        create: { name: t },
      })),
    },
  };

  if (customSlug) {
    updateData.slug = slugify(customSlug, { lower: true, strict: true });
  }

  const updated = await prisma.article.update({
    where: { id },
    data: updateData
  });

  if (updated.status === 'PUBLISHED') {
    await shareToSocials(updated.id);
  }

  revalidatePath('/en/admin/articles');
  revalidatePath('/fa/admin/articles');
  revalidatePath('/en/blog');
  revalidatePath('/fa/blog');
  revalidatePath(`/${updated.locale}/blog/${updated.slug}`);
  redirect('/en/admin/articles');
}

export async function deleteArticle(id: string) {
  await prisma.article.delete({ where: { id } });
  revalidatePath('/en/admin/articles');
  revalidatePath('/fa/admin/articles');
  revalidatePath('/en/blog');
  revalidatePath('/fa/blog');
}
