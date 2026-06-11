import React from 'react';
import AiWriterUI from '@/components/admin/AiWriterUI';
import prisma from '@/lib/prisma';

export default async function AiWriterPage() {
  const queuedKeywords = await prisma.aiKeyword.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">AI Writer</h1>
        <p className="font-sans text-[#1a1a1a]/60">Automate your content pipeline with AEO/SEO optimized generation.</p>
      </div>

      <AiWriterUI queuedKeywords={queuedKeywords} />
    </div>
  );
}
