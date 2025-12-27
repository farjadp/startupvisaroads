/* 
   PATH: src/components/HeroSection.tsx
   DATE: 2025-12-25 15:30 EST
   VERSION: v1.0.0 - New Component
   REASON: Separating Hero from HomePage for better maintainability and cleaner page code.
   design: Grid-based, heavy typography, International Style.
*/

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="w-full min-h-[85vh] flex flex-col justify-center border-b border-[#111111] bg-[#F2F2F2]">
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-between py-12">
        
        {/* Top Meta: Location Coordinates style */}
        <div className="flex justify-between items-start text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#666666] mb-20 animate-reveal">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF3B30] rounded-full animate-pulse"></span>
            <span>System Operational</span>
          </div>
          <div className="text-right">
             43.6532° N, 79.3832° W (TOR)<br/>
             51.5072° N, 0.1276° W (LDN)
          </div>
        </div>

        {/* Main Typography */}
        <div className="max-w-5xl">
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-[#111111] mb-8 animate-reveal" style={{ animationDelay: '0.1s' }}>
            Boundaries <br/>
            <span className="italic font-light text-[#666666]">are optional.</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-12 items-start mt-12 animate-reveal" style={{ animationDelay: '0.2s' }}>
             <p className="font-sans text-lg md:text-xl leading-relaxed max-w-xl text-[#333333]">
               We architect the legal and financial structures required for high-impact founders to scale globally. 
               <span className="block mt-4 font-bold text-[#111111]">Canada • UK • USA • Europe</span>
             </p>

             <div className="flex flex-col gap-4">
                <Link href="/contact" className="group flex items-center justify-between gap-6 bg-[#111111] text-white px-8 py-5 min-w-[240px] hover:bg-[#FF3B30] transition-colors duration-300">
                   <span className="text-sm font-bold uppercase tracking-widest">Start Assessment</span>
                   <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-[10px] uppercase tracking-widest text-[#666666] text-center">
                   Est. Time: 3 Minutes
                </span>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}