import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: { category: true, tags: true }
  });

  return (
    <div className="container mx-auto px-6 py-12 md:py-24 max-w-5xl">
      <h1 className="font-serif text-5xl md:text-7xl mb-12 text-[#1a1a1a]">The Journal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {articles.map(article => (
          <Link key={article.id} href={`/en/blog/${article.slug}`} className="group block">
            <div className="aspect-video w-full bg-[#1a1a1a]/5 rounded-2xl overflow-hidden mb-6">
              {article.coverImage ? (
                <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-[#1a1a1a]/20 text-4xl">SVR.</div>
              )}
            </div>
            <div className="flex gap-2 mb-3">
              {article.category && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] bg-[#1a1a1a] px-2 py-1 rounded">
                  {article.category.name}
                </span>
              )}
            </div>
            <h2 className="font-serif text-3xl mb-3 group-hover:text-neutral-500 transition-colors">{article.title}</h2>
            <p className="font-sans text-[#1a1a1a]/60 line-clamp-3">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}