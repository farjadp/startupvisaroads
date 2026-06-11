import React from 'react';
import ArticleForm from '@/components/admin/ArticleForm';
import prisma from '@/lib/prisma';

export default async function NewArticlePage() {
  const categories = await prisma.category.findMany();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Create New Article</h1>
      </div>
      <ArticleForm categories={categories} />
    </div>
  );
}
