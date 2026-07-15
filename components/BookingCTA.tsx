import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export default function BookingCTA() {
  return (
    <section className="w-full bg-[#1a1a1a] text-[#F2F0E9] py-24 px-6 border-t border-[#CCFF00]">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl">
           <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 bg-[#CCFF00] block animate-pulse rounded-full"></span>
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00]">Strategy Session</span>
           </div>
           <h2 className="font-serif text-5xl md:text-7xl leading-[0.9] mb-8">
             STOP GUESSING. <br/>
             <span className="italic text-[#F2F0E9]/50">START BUILDING.</span>
           </h2>
           <p className="font-sans text-lg md:text-xl opacity-80 leading-relaxed max-w-xl">
             Get a clear, actionable roadmap for your startup visa or immigration journey. Book a strategic 1-on-1 consultation directly via Google Meet.
           </p>
        </div>
        <div>
           <Link href="/book-meeting" className="group relative flex items-center justify-center gap-4 bg-[#CCFF00] text-[#1a1a1a] px-10 py-6 md:px-12 md:py-8 font-bold uppercase tracking-widest hover:bg-white transition-all duration-500 overflow-hidden shadow-[10px_10px_0px_0px_rgba(242,240,233,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
             <Calendar className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
             <span className="relative z-10 text-sm md:text-base">Book a Google Meet</span>
             <ArrowRight className="w-5 h-5 relative z-10 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
           </Link>
        </div>
      </div>
    </section>
  );
}
