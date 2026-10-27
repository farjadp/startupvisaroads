'use client';
// ============================================================================
// Component: components/guide/ChapterVideo.tsx
// A YouTube briefing with its chapter index beside the player. The poster is
// a plain image until someone presses play or a chapter, so the page does not
// pay for YouTube's player on load; a chapter starts the video at its mark.
// ============================================================================
import React, { useRef, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';

export interface Chapter {
  /** "mm:ss" as YouTube shows it. */
  at: string;
  label: string;
}

interface Props {
  id: string;
  title: string;
  /** "20:58" */
  length: string;
  /** Largest thumbnail YouTube actually serves for this video. */
  poster: string;
  chapters: Chapter[];
  eyebrow: string;
  heading: React.ReactNode;
  intro: string;
  /** Shown under the player — where the video and the page disagree. */
  note?: React.ReactNode;
  channel: { handle: string; url: string };
}

const seconds = (at: string) => at.split(':').reduce((t, part) => t * 60 + Number(part), 0);

export default function ChapterVideo({ id, title, length, poster, chapters, eyebrow, heading, intro, note, channel }: Props) {
  const [start, setStart] = useState<number | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const player = useRef<HTMLDivElement>(null);

  const play = (chapter?: Chapter) => {
    setStart(chapter ? seconds(chapter.at) : 0);
    setActive(chapter?.at ?? null);
    // Below lg the list sits under the player, so a chapter tapped near the
    // bottom would start the video off-screen.
    if (chapter && window.matchMedia('(max-width: 1023px)').matches) {
      player.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="py-28 px-6 bg-[#0a0e1a] text-white border-b border-white/10">
      {/* Phone: heading, player, chapters. Desktop: heading and chapters on the left, player sticky on the right. */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10 items-start">
        <div className="lg:col-span-5 lg:row-start-1">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] block mb-4">{eyebrow}</span>
          <h2 className="font-serif text-5xl md:text-6xl leading-[1.02] tracking-[-0.02em] mb-6">{heading}</h2>
          <p className="font-sans text-white/60 text-base leading-relaxed">{intro}</p>
        </div>

        <div ref={player} className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-28 scroll-mt-24">
          <div className="relative aspect-video overflow-hidden bg-black shadow-2xl shadow-black/50 ring-1 ring-white/10">
            {start === null ? (
              <button type="button" onClick={() => play()} aria-label={`Play video: ${title}`} className="group absolute inset-0 w-full h-full">
                {/* A plain img: YouTube's CDN already sizes it, and next/image would need ytimg in remotePatterns. */}
                <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/70 via-transparent to-transparent" />
                <span className="absolute left-4 bottom-4 md:left-6 md:bottom-6 flex items-center gap-4">
                  <span className="grid place-items-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#C8102E] ring-8 md:ring-[12px] ring-[#C8102E]/25 transition-transform duration-300 group-hover:scale-105">
                    <Play className="w-6 h-6 md:w-7 md:h-7 ml-1 fill-white text-white" />
                  </span>
                  <span className="hidden md:inline font-sans text-xs font-bold uppercase tracking-[0.15em] text-white">Play the briefing</span>
                </span>
                <span className="absolute right-4 bottom-4 bg-[#0a0e1a]/85 px-2.5 py-1 font-sans text-xs font-bold tabular-nums">{length}</span>
              </button>
            ) : (
              <iframe
                key={start}
                className="absolute inset-0 w-full h-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&start=${start}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
          {note && <p className="mt-5 font-sans text-xs text-white/50 leading-relaxed border-l-2 border-[#C8102E] pl-4">{note}</p>}
        </div>

        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2">
          <ol className="border-t border-white/10">
            {chapters.map((c) => (
              <li key={c.at} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => play(c)}
                  aria-label={`Play from ${c.at}: ${c.label}`}
                  className={`group w-full flex items-baseline gap-5 py-3 text-left font-sans text-sm transition-colors ${
                    active === c.at ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span className={`w-12 shrink-0 tabular-nums font-bold ${active === c.at ? 'text-white' : 'text-[#C8102E]'}`}>{c.at}</span>
                  <span className="flex-1">{c.label}</span>
                  <Play className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity text-[#C8102E]" />
                </button>
              </li>
            ))}
          </ol>

          <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#C8102E] hover:text-white transition-colors"
          >
            Watch on YouTube <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 ml-6 inline-flex font-sans text-xs font-bold uppercase tracking-[0.15em] text-white/45 hover:text-white transition-colors"
          >
            {channel.handle}
          </a>
        </div>

      </div>
    </section>
  );
}
