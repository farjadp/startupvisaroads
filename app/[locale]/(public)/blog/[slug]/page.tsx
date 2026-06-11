import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { category: true, tags: true }
  });

  if (!article || article.status !== 'PUBLISHED') {
    return notFound();
  }

  return (
    <div className="container mx-auto px-6 py-12 md:py-24 max-w-3xl">
      <div className="mb-12 text-center">
        {article.category && (
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#CCFF00] bg-[#1a1a1a] px-3 py-1 rounded-full mb-6">
            {article.category.name}
          </span>
        )}
        <h1 className="font-serif text-5xl md:text-7xl mb-6 text-[#1a1a1a] leading-tight">{article.title}</h1>
        <p className="font-sans text-[#1a1a1a]/50 text-sm">
          Published on {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {article.coverImage && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-16 shadow-xl">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Render HTML content safely */}
      <article 
        className="prose prose-lg md:prose-xl prose-headings:font-serif prose-headings:font-normal prose-a:text-[#1a1a1a] prose-a:underline max-w-none text-[#1a1a1a]/80" 
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
      
      {article.tags.length > 0 && (
        <div className="mt-16 pt-8 border-t border-[#1a1a1a]/10">
          <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-4">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag.id} className="bg-[#1a1a1a]/5 px-3 py-1 rounded-full font-sans text-xs text-[#1a1a1a]/70">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}