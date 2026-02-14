"use client";

import React, { useState } from 'react';
import { Play, Maximize2 } from 'lucide-react';

interface VideoBriefingProps {
  videoId: string; // شناسه ویدیو یوتیوب (مثلاً: dQw4w9WgXcQ)
  title: string;
  coverImage?: string; // اختیاری
}

export default function VideoBriefing({ videoId, title, coverImage }: VideoBriefingProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full border-y border-[#1a1a1a]/10 py-12">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8 px-4 md:px-0">
           <div>
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2 block">
                 Visual Briefing
              </span>
              <h3 className="font-serif text-3xl md:text-4xl">{title}</h3>
           </div>
           <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              HD 4K Analysis
           </div>
        </div>

        {/* The Player Wrapper */}
        <div className="relative aspect-video w-full bg-[#1a1a1a] overflow-hidden group border border-[#1a1a1a]/10 shadow-2xl">
           
           {!isPlaying ? (
              <button 
                 onClick={() => setIsPlaying(true)}
                 className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/40 hover:bg-black/20 transition-all duration-500 z-20 group-hover:scale-105"
              >
                 {/* Custom Play Button */}
                 <div className="w-24 h-24 rounded-full bg-[#CCFF00] flex items-center justify-center text-[#1a1a1a] mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-[0_0_40px_rgba(204,255,0,0.4)]">
                    <Play fill="currentColor" className="w-8 h-8 ml-1" />
                 </div>
                 <span className="font-sans text-white text-sm font-bold uppercase tracking-[0.2em]">
                    Initialize Briefing
                 </span>
                 
                 {/* Optional Cover Image */}
                 {coverImage && (
                    <img src={coverImage} alt={title} className="absolute inset-0 w-full h-full object-cover -z-10 opacity-60" />
                 )}
              </button>
           ) : (
              <iframe
                 src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                 title={title}
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
                 className="absolute inset-0 w-full h-full"
              ></iframe>
           )}

           {/* Decor */}
           <div className="absolute top-6 left-6 z-10 pointer-events-none mix-blend-difference text-white">
              <Maximize2 className="w-6 h-6 opacity-50" />
           </div>

        </div>

      </div>
    </div>
  );
}