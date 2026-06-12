import React from 'react';
import prisma from '@/lib/prisma';
import CategoriesClient from './CategoriesClient';
import { ensureDefaultCategories } from '@/lib/categories';

export default async function CategoriesPage() {
  await ensureDefaultCategories();
  
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { articles: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Manage Categories</h1>
        <p className="font-sans text-sm text-[#1a1a1a]/60">Define, edit, and delete article categories for the content pipeline.</p>
      </div>
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
