// ============================================================================
// Component: components/fa/VideoRail.tsx
// A page's related videos from @FarjadTalks, with VideoObject JSON-LD.
// ============================================================================
import React from 'react';
import { ArrowUpLeft } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import VideoCard from './VideoCard';
import { CHANNEL_URL, videoJsonLd, type Video } from '@/content/fa/videos';

export default function VideoRail({ videos, heading = 'از یوتیوب فرجاد', intro }: { videos: Video[]; heading?: string; intro?: string }) {
  if (videos.length === 0) return null;
  return (
    <section className="py-16 border-t border-[#1a1a1a]/10">
      <JsonLd data={videoJsonLd(videos)} />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="font-estedad font-black text-3xl md:text-4xl leading-tight">{heading}</h2>
          {intro && <p className="mt-3 text-[#1a1a1a]/70 max-w-2xl leading-relaxed">{intro}</p>}
        </div>
        <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] shrink-0">
          کانال @FarjadTalks
          <ArrowUpLeft className="w-4 h-4" />
        </a>
      </div>
      <div className={`grid gap-8 ${videos.length === 1 ? 'grid-cols-1 max-w-3xl' : videos.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {videos.map((v, i) => <VideoCard key={v.id} video={v} priority={i === 0} />)}
      </div>
    </section>
  );
}
