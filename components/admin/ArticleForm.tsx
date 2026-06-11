'use client';

import React, { useState } from 'react';
import { createArticle, updateArticle } from '@/app/actions/articleActions';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Upload } from 'lucide-react';

export default function ArticleForm({ article = null, categories = [] }: any) {
  const [content, setContent] = useState(article?.content || '');
  const [coverImage, setCoverImage] = useState(article?.coverImage || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setCoverImage(data.url);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('content', content);
    formData.append('coverImage', coverImage);
    
    if (article) {
      await updateArticle(article.id, formData);
    } else {
      await createArticle(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
        <div>
          <label className="block font-sans text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Title</label>
          <input required type="text" name="title" defaultValue={article?.title} className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-serif text-2xl focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]" />
        </div>
        
        {article && (
          <div>
            <label className="block font-sans text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Custom Slug (Optional)</label>
            <input type="text" name="slug" defaultValue={article.slug} className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]" />
          </div>
        )}

        <div>
          <label className="block font-sans text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Excerpt</label>
          <textarea name="excerpt" defaultValue={article?.excerpt} rows={3} className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-sans text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Category</label>
            <select name="categoryId" defaultValue={article?.categoryId || ''} className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]">
              <option value="">No Category</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-sans text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Tags (Comma separated)</label>
            <input type="text" name="tags" defaultValue={article?.tags?.map((t:any) => t.name).join(', ')} className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]" placeholder="visa, startup, amsterdam" />
          </div>
          <div>
            <label className="block font-sans text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Status</label>
            <select name="status" defaultValue={article?.status || 'DRAFT'} className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-sans text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Cover Image</label>
          <div className="flex items-center gap-4">
            {coverImage && <img src={coverImage} alt="Cover" className="w-24 h-24 object-cover rounded-xl" />}
            <label className="cursor-pointer bg-[#1a1a1a]/[0.02] border border-dashed border-[#1a1a1a]/20 rounded-xl p-6 flex flex-col items-center justify-center flex-grow hover:bg-[#1a1a1a]/5 transition-colors">
              <Upload className="w-6 h-6 text-[#1a1a1a]/40 mb-2" />
              <span className="font-sans text-sm text-[#1a1a1a]/60">{isUploading ? 'Uploading...' : 'Click to upload cover image'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        <div>
          <label className="block font-sans text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Content</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans text-sm font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors rounded-xl shadow-lg">
          {article ? 'Update Article' : 'Publish Article'}
        </button>
      </div>
    </form>
  );
}
