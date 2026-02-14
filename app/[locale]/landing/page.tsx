// ============================================================================
// Page: app/campaigns/canada-fast-track/page.tsx
// Style: High-Contrast "Direct Response"
// Context: Ad Landing Page for "ICT/C11 vs SUV"
// ============================================================================

"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, ShieldAlert, Clock } from 'lucide-react';

export default function CanadaFastTrackPage() {
  return (
    <div className="w-full bg-white text-[#1a1a1a] min-h-screen font-sans selection:bg-[#CCFF00]">
      
      {/* 1. SLIM HEADER (No Navigation Links) */}
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-[#1a1a1a]/10 z-50 py-4 px-6 flex justify-between items-center">
         <span className="font-serif text-2xl font-bold">ASHAVID</span>
         <a href="#audit" className="bg-[#1a1a1a] text-[#F2F0E9] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a]">
            Book Free Audit
         </a>
      </header>

      {/* 2. THE HOOK (Hero) */}
      <section className="pt-40 pb-20 px-4 text-center max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-2 bg-[#b91c1c]/10 text-[#b91c1c] px-3 py-1 mb-6 rounded-sm border border-[#b91c1c]/20">
            <ShieldAlert size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">SUV Processing Alert: 32+ Months</span>
         </div>
         
         <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-[1.1]">
            Stop waiting for the <br/>
            <span className="line-through decoration-[#b91c1c] text-[#1a1a1a]/40">Start-Up Visa.</span>
         </h1>
         
         <p className="text-xl md:text-2xl text-[#1a1a1a]/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            The queue is stuck. Smart founders are pivoting to <strong>Operational Work Permits (C11 / ICT)</strong> to land in Canada in <span className="bg-[#CCFF00] px-1 font-bold">3-6 months</span>, not 3 years.
         </p>

         <a href="#audit" className="inline-flex items-center gap-4 bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 text-lg font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
            Check Your Eligibility <ArrowRight />
         </a>
         <p className="mt-4 text-xs opacity-50 uppercase tracking-widest">No Letter of Support Required</p>
      </section>


      {/* 3. THE COMPARISON (Why Switch?) */}
      <section className="py-20 bg-[#F2F0E9] border-y border-[#1a1a1a]/10 px-4">
         <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The Old Way */}
            <div className="bg-white p-8 border border-[#1a1a1a]/10 opacity-70">
               <h3 className="font-serif text-2xl mb-6 text-[#1a1a1a]/50">Start-Up Visa (SUV)</h3>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-[#b91c1c]">
                     <XCircle size={20} /> <span>30-40 Month Wait</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#b91c1c]">
                     <XCircle size={20} /> <span>Dependent on Angel/Incubator</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#b91c1c]">
                     <XCircle size={20} /> <span>High Rejection Risk (2025)</span>
                  </li>
               </ul>
            </div>

            {/* The New Way */}
            <div className="bg-[#1a1a1a] text-[#F2F0E9] p-8 border border-[#1a1a1a] shadow-2xl relative overflow-hidden transform md:-translate-y-4">
               <div className="absolute top-0 right-0 bg-[#CCFF00] text-[#1a1a1a] text-xs font-bold px-3 py-1 uppercase">Recommended</div>
               <h3 className="font-serif text-2xl mb-6 text-[#CCFF00]">ICT / C11 Strategy</h3>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-[#F2F0E9]">
                     <CheckCircle2 size={20} className="text-[#CCFF00]" /> <span>Arrival in 3-6 Months</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#F2F0E9]">
                     <CheckCircle2 size={20} className="text-[#CCFF00]" /> <span>Full Ownership (No Investors needed)</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#F2F0E9]">
                     <CheckCircle2 size={20} className="text-[#CCFF00]" /> <span>Convert to PR via Express Entry</span>
                  </li>
               </ul>
            </div>

         </div>
      </section>


      {/* 4. THE AUTHORITY (Trust) */}
      <section className="py-20 px-4 text-center">
         <div className="max-w-2xl mx-auto">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4 block">The Firm</span>
            <h2 className="font-serif text-3xl mb-6">Engineered by Ashavid.</h2>
            <p className="font-sans text-lg text-[#1a1a1a]/70 leading-relaxed mb-8">
               We don't sell forms; we build corporate infrastructure. 
               Our team specializes in structuring international transfers specifically for high-net-worth founders.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-[#1a1a1a]/10 pt-8">
               <div>
                  <span className="block font-serif text-3xl font-bold">98%</span>
                  <span className="text-[10px] uppercase tracking-widest">Approval Rate</span>
               </div>
               <div>
                  <span className="block font-serif text-3xl font-bold">$200k+</span>
                  <span className="text-[10px] uppercase tracking-widest">Min Liquidity</span>
               </div>
               <div>
                  <span className="block font-serif text-3xl font-bold">14</span>
                  <span className="text-[10px] uppercase tracking-widest">Days to File</span>
               </div>
            </div>
         </div>
      </section>


      {/* 5. THE OFFER (Embedded Form) */}
      <section id="audit" className="py-20 bg-[#1a1a1a] text-[#F2F0E9] px-4">
         <div className="max-w-xl mx-auto border border-[#CCFF00]/20 p-8 md:p-12 bg-[#222]">
            <h3 className="font-serif text-3xl mb-2 text-center">Priority Audit</h3>
            <p className="text-center text-sm opacity-60 mb-8">
               Verify if you qualify for the C11 or ICT stream. 
               <br/><span className="text-[#CCFF00]">24h Turnaround time.</span>
            </p>

            <form className="space-y-4">
               <input type="text" placeholder="Full Name" className="w-full bg-[#1a1a1a] border border-[#F2F0E9]/20 p-4 text-sm focus:border-[#CCFF00] outline-none" />
               <input type="email" placeholder="Work Email" className="w-full bg-[#1a1a1a] border border-[#F2F0E9]/20 p-4 text-sm focus:border-[#CCFF00] outline-none" />
               <input type="tel" placeholder="WhatsApp Number" className="w-full bg-[#1a1a1a] border border-[#F2F0E9]/20 p-4 text-sm focus:border-[#CCFF00] outline-none" />
               
               <select className="w-full bg-[#1a1a1a] border border-[#F2F0E9]/20 p-4 text-sm focus:border-[#CCFF00] outline-none cursor-pointer">
                  <option>Available Capital: $50k - $100k</option>
                  <option>Available Capital: $100k - $250k</option>
                  <option>Available Capital: $250k+</option>
               </select>

               <button className="w-full bg-[#CCFF00] text-[#1a1a1a] font-bold uppercase tracking-widest py-4 mt-4 hover:bg-white transition-colors">
                  Get Strategy Plan
               </button>
               
               <p className="text-[10px] text-center opacity-40 mt-4">
                  Zero spam policy. Your data is encrypted.
               </p>
            </form>
         </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-8 text-center text-[10px] uppercase tracking-widest opacity-40">
         Ashavid Inc. © 2025 • Toronto • Dubai
      </footer>

    </div>
  );
}