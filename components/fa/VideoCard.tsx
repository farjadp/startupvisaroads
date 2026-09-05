'use client';

// ============================================================================
// Component: components/fa/VideoCard.tsx
// YouTube facade: renders the thumbnail and title, loads the (nocookie)
// iframe only when the reader clicks. No third-party script on page load.
// ============================================================================
import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { thumb, type Video } from '@/content/fa/videos';

export default function VideoCard({ video, priority = false }: { video: Video; priority?: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="group">
      <div className="relative aspect-video overflow-hidden bg-[#1a1a1a] border border-[#1a1a1a]">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&hl=fa`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`پخش: ${video.title}`}
            className="absolute inset-0 w-full h-full text-start"
          >
            <Image
              src={thumb(video.id)}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              priority={priority}
              className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/70 to-transparent" aria-hidden />
            <span className="absolute bottom-4 start-4 inline-flex items-center gap-2 bg-[#CCFF00] text-black px-3 py-2 text-sm font-bold">
              <Play className="w-4 h-4 fill-current" />
              پخش
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 font-estedad font-bold text-lg leading-snug">{video.title}</figcaption>
    </figure>
  );
}
