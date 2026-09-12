import React from 'react';
import SourcesConsole from '@/components/admin/SourcesConsole';
import { listSources } from '@/lib/knowledge/admin';
import { EN_KEYWORDS, FA_KEYWORDS } from '@/content/keywords';
import { storageConfigured } from '@/lib/knowledge/storage';

export const dynamic = 'force-dynamic';

export default async function SourcesPage() {
  const sources = await listSources();
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Knowledge Sources</h1>
        <p className="font-sans text-[#1a1a1a]/60">What the writers may draw evidence from. Nothing here is ever published; it is read, chunked and cited.</p>
      </div>
      <SourcesConsole initialSources={sources} keywordPool={[...EN_KEYWORDS, ...FA_KEYWORDS]} retainsFiles={storageConfigured()} />
    </div>
  );
}
