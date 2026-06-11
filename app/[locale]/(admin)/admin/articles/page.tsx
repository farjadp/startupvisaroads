import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import prisma from '@/lib/prisma';
import { deleteArticle } from '@/app/actions/articleActions';

export default async function AdminArticles() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Articles</h1>
          <p className="font-sans text-[#1a1a1a]/60">Manage your blog posts and publications.</p>
        </div>
        <Link href="/en/admin/articles/new" className="bg-[#1a1a1a] text-[#F2F0E9] px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#1a1a1a]/5 text-[#1a1a1a]/60 uppercase tracking-widest text-[10px]">
            <tr>
              <th className="px-6 py-4 font-bold">Title</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]/5">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-[#1a1a1a]/[0.02] transition-colors">
                <td className="px-6 py-4 font-bold text-[#1a1a1a]">{article.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${article.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#1a1a1a]/70">{article.category?.name || '-'}</td>
                <td className="px-6 py-4 text-[#1a1a1a]/50">{new Date(article.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex justify-end gap-3 items-center">
                  <Link href={`/en/admin/articles/${article.id}/edit`} className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <form action={deleteArticle.bind(null, article.id)}>
                    <button type="submit" className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#1a1a1a]/40 italic">No articles found. Click "New Article" to create one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
