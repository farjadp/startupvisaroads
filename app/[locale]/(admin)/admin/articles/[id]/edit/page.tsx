import React from 'react';
import ArticleForm from '@/components/admin/ArticleForm';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: { tags: true }
  });
  
  if (!article) return notFound();

  const categories = await prisma.category.findMany();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Edit Article</h1>
      </div>
      <ArticleForm article={article} categories={categories} />
    </div>
  );
}
