'use client';

import React, { useState } from 'react';
import { addAiKeywords, clearCompletedKeywords, importKeywordStrategy } from '@/app/actions/aiActions';
import { Sparkles, Link as LinkIcon, FileText, Calendar, RefreshCw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AiWriterUI({ queuedKeywords }: any) {
  const [activeTab, setActiveTab] = useState<'KEYWORD' | 'AUTO' | 'URL' | 'TEXT'>('KEYWORD');
  const [language, setLanguage] = useState<'en' | 'fa'>('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    const formData = new FormData(e.currentTarget);
    const input = formData.get('input') as string;

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: activeTab, input, locale: language })
      });
      const data = await res.json();
      if (data.success) {
        alert('Article generated and published successfully!');
        router.push(`/en/admin/articles/${data.articleId}/edit`);
      } else {
        alert('Generation failed: ' + data.error);
      }
    } catch (error) {
      alert('An error occurred during generation.');
    }
    setIsGenerating(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row border-b border-[#1a1a1a]/5">
        <button onClick={() => setActiveTab('KEYWORD')} className={`flex-1 py-4 px-6 font-sans text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === 'KEYWORD' ? 'bg-[#CCFF00] text-[#1a1a1a]' : 'text-[#1a1a1a]/40 hover:bg-[#1a1a1a]/[0.02]'}`}>
          <Sparkles className="w-4 h-4" /> Instant Keyword
        </button>
        <button onClick={() => setActiveTab('AUTO')} className={`flex-1 py-4 px-6 font-sans text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === 'AUTO' ? 'bg-[#CCFF00] text-[#1a1a1a]' : 'text-[#1a1a1a]/40 hover:bg-[#1a1a1a]/[0.02]'}`}>
          <Calendar className="w-4 h-4" /> Auto-Pilot (Queue)
        </button>
        <button onClick={() => setActiveTab('URL')} className={`flex-1 py-4 px-6 font-sans text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === 'URL' ? 'bg-[#CCFF00] text-[#1a1a1a]' : 'text-[#1a1a1a]/40 hover:bg-[#1a1a1a]/[0.02]'}`}>
          <LinkIcon className="w-4 h-4" /> Rewrite URL
        </button>
        <button onClick={() => setActiveTab('TEXT')} className={`flex-1 py-4 px-6 font-sans text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === 'TEXT' ? 'bg-[#CCFF00] text-[#1a1a1a]' : 'text-[#1a1a1a]/40 hover:bg-[#1a1a1a]/[0.02]'}`}>
          <FileText className="w-4 h-4" /> Rewrite Text
        </button>
      </div>

      <div className="p-6 md:p-8">
        {activeTab === 'AUTO' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-serif text-2xl mb-4 text-[#1a1a1a]">Schedule Articles</h3>
              <p className="font-sans text-[#1a1a1a]/60 text-sm mb-6">Enter a list of keywords (one per line). The system will automatically pick one up every time the cron job runs and write a full SEO optimized article with Fal.ai images.</p>
              <form action={addAiKeywords}>
                <textarea name="keywords" rows={8} placeholder="Startup Visa Netherlands&#10;Canada SUV Process&#10;UAE Golden Visa benefits" className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] mb-4"></textarea>
                <div className="flex gap-4">
                  <button type="submit" className="bg-[#1a1a1a] text-[#F2F0E9] px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors rounded-xl flex items-center gap-2 cursor-pointer">
                    <Sparkles className="w-4 h-4" /> Add to Queue
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await importKeywordStrategy();
                      if (res.success) {
                        alert(`Imported ${res.count} new keywords into the queue!`);
                      } else {
                        alert('Import failed: ' + res.error);
                      }
                    }}
                    className="border border-[#1a1a1a]/20 text-[#1a1a1a] px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-colors rounded-xl flex items-center gap-2 cursor-pointer text-center"
                  >
                    Import Strategy List (98)
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-[#1a1a1a]/[0.02] p-6 rounded-xl border border-[#1a1a1a]/5">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-sans font-bold uppercase tracking-widest text-[#1a1a1a]/60 text-sm">Queue Status</h4>
                <button onClick={() => clearCompletedKeywords()} className="text-xs text-red-500 hover:underline">Clear Completed</button>
              </div>
              <ul className="space-y-3 max-h-[300px] overflow-y-auto">
                {queuedKeywords.map((job: any) => (
                  <li key={job.id} className="flex items-center justify-between font-sans text-sm p-3 bg-white rounded-lg border border-[#1a1a1a]/5">
                    <span className="font-bold text-[#1a1a1a] truncate pr-4">{job.keyword}</span>
                    {job.status === 'PENDING' && <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                    {job.status === 'PROCESSING' && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />}
                    {job.status === 'COMPLETED' && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    {job.status === 'ERROR' && <span title={job.error ?? 'Error'}><AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" /></span>}
                  </li>
                ))}
                {queuedKeywords.length === 0 && (
                  <li className="text-[#1a1a1a]/40 italic text-center py-4">Queue is empty.</li>
                )}
              </ul>
              <div className="mt-6 pt-4 border-t border-[#1a1a1a]/5">
                <p className="text-xs text-[#1a1a1a]/40 font-sans">
                  <strong>Cron URL:</strong> <code className="bg-[#1a1a1a]/10 px-1 rounded">http://localhost:3000/api/cron/generate</code><br/>
                  Set this up in cron-job.org to hit periodically!
                </p>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'KEYWORD' || activeTab === 'URL' || activeTab === 'TEXT') && (
          <form onSubmit={handleGenerate}>
            <h3 className="font-serif text-2xl mb-4 text-[#1a1a1a]">
              {activeTab === 'KEYWORD' && 'Instant Keyword Writer'}
              {activeTab === 'URL' && 'Rewrite from URL'}
              {activeTab === 'TEXT' && 'Rewrite from Raw Text'}
            </h3>
            <p className="font-sans text-[#1a1a1a]/60 text-sm mb-6">
              {activeTab === 'KEYWORD' && 'Enter a keyword or article title. GPT-4o will write a full, SEO-optimized article and Fal.ai will generate the images instantly.'}
              {activeTab === 'URL' && 'Paste a link to any article. We will scrape it and rewrite it completely using GPT-4o, generating a brand new Fal.ai cover image.'}
              {activeTab === 'TEXT' && 'Paste raw text below. We will expand and optimize it into a full article with SEO structure and images.'}
            </p>
            
            {activeTab === 'KEYWORD' && (
              <input name="input" type="text" required placeholder="e.g., Canada Startup Visa requirements 2026" className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] mb-6" />
            )}
            {activeTab === 'URL' && (
              <input name="input" type="url" required placeholder="https://example.com/article" className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] mb-6" />
            )}
            {activeTab === 'TEXT' && (
              <textarea name="input" required rows={8} placeholder="Paste raw content here..." className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] mb-6"></textarea>
            )}

            <div className="flex items-center gap-3 mb-6">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40">Output Language:</span>
              <div className="flex rounded-lg overflow-hidden border border-[#1a1a1a]/10">
                <button type="button" onClick={() => setLanguage('en')} className={`px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest transition-colors ${language === 'en' ? 'bg-[#1a1a1a] text-[#CCFF00]' : 'bg-transparent text-[#1a1a1a]/50 hover:bg-[#1a1a1a]/[0.04]'}`}>English</button>
                <button type="button" onClick={() => setLanguage('fa')} className={`px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest transition-colors ${language === 'fa' ? 'bg-[#1a1a1a] text-[#CCFF00]' : 'bg-transparent text-[#1a1a1a]/50 hover:bg-[#1a1a1a]/[0.04]'}`}>فارسی</button>
              </div>
            </div>

            <button disabled={isGenerating} type="submit" className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans text-sm font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors rounded-xl flex items-center justify-center gap-2 w-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {isGenerating ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Generating Magic...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Article Now</>
              )}
            </button>
            {isGenerating && <p className="text-center mt-4 text-sm text-[#1a1a1a]/40 font-sans italic animate-pulse">This might take 30-60 seconds. Please do not close this window...</p>}
          </form>
        )}
      </div>
    </div>
  );
}
