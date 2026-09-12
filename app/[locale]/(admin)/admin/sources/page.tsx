import React from 'react';
import SourcesConsole from '@/components/admin/SourcesConsole';
import SourceQueue from '@/components/admin/SourceQueue';
import ArticleReviews from '@/components/admin/ArticleReviews';
import { listSources, suggestedDocuments } from '@/lib/knowledge/admin';
import { openReviews } from '@/lib/knowledge/review';
import { EN_KEYWORDS, FA_KEYWORDS } from '@/content/keywords';
import { storageConfigured } from '@/lib/knowledge/storage';

export const dynamic = 'force-dynamic';

export default async function SourcesPage() {
  const [sources, suggestions, reviews] = await Promise.all([listSources(), suggestedDocuments(), openReviews()]);
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Knowledge Sources</h1>
        <p className="font-sans text-[#1a1a1a]/60">What the writers may draw evidence from. Nothing here is ever published; it is read, chunked and cited.</p>
      </div>
      {/* The queue is slotted between the retrieval box and the sources
          table: it is the only thing on this page that needs a decision.
          Review sits above it — a published article whose source moved
          outranks a suggestion for a new one. */}
      <SourcesConsole initialSources={sources} keywordPool={[...EN_KEYWORDS, ...FA_KEYWORDS]} retainsFiles={storageConfigured()}>
        <ArticleReviews initialReviews={reviews} />
        <SourceQueue initialDocuments={suggestions} />
      </SourcesConsole>
    </div>
  );
}
