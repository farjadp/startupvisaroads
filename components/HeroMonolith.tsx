/* 
   PATH: src/components/HeroMonolith.tsx
   DATE: 2025-12-25 16:00 EST
   VERSION: v2.0.0 - The Monolith
   REASON: Creating a hero section that feels like a 'Command Center'.
   DESIGN: High contrast, grid lines, massive typography.
*/

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function HeroMonolith() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-end pb-20 border-b border-[#262626]">
      
      {/* Background Grid - subtle technical lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Status Indicator */}
        <div className="flex items-center gap-3 mb-8">
           <div className="px-3 py-1 border border-[#333] bg-[#111] text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">
              System: Secure
           </div>
           <div className="h-[1px] w-24 bg-[#333]"></div>
        </div>

        {/* MASSIVE HEADLINE */}
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-extrabold uppercase leading-[0.8] tracking-tighter text-white mb-12 mix-blend-difference">
          Global <br/>
          <span className="text-[#333] text-stroke-white">Dominance.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#262626] pt-12">
           <div className="lg:col-span-5">
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-white">
                 Infrastructure for the 1%
              </h3>
              <p className="text-[#888] text-lg leading-relaxed">
                 We do not sell visas. We engineer jurisdictional freedom. 
                 Comprehensive structuring for founders moving capital and IP across borders.
              </p>
           </div>
           
           <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 justify-end items-end">
              <Link href="/contact" className="w-full md:w-auto bg-white text-black px-10 py-6 font-bold uppercase tracking-wider hover:bg-[#CCC] transition-colors flex items-center justify-between gap-8">
                 Initialize Protocol <ArrowRight className="w-5 h-5"/>
              </Link>
              <button className="w-full md:w-auto border border-[#333] text-[#888] px-10 py-6 font-bold uppercase tracking-wider hover:border-white hover:text-white transition-colors">
                 View Credentials
              </button>
           </div>
        </div>

      </div>
    </section>
  );
}