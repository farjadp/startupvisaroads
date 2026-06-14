// ============================================================================
// Page: app/pnp/alberta/page.tsx
// Style: Modernist Editorial (SVR Identity)
// Context: Alberta Advantage Immigration Program (AAIP)
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Map, 
  Tractor, 
  GraduationCap, 
  Landmark, 
  Check, 
  AlertOctagon,
  Percent
} from 'lucide-react';
import type { Metadata } from 'next';

import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/pnp/alberta', locale);
}

export default function AlbertaPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE TAX HAVEN
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Jurisdiction: Alberta</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12">
           ALBERTA <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">ADVANTAGE.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 Canada's economic powerhouse. <br/>
                 Zero PST. <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">8% Corporate Tax.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 The Alberta Advantage Immigration Program (AAIP) is unique. It decentralizes power. 
                 Instead of impressing a bureaucrat in Edmonton, you must impress the Mayor of a rural town. 
                 This is the most "human-centric" business immigration pathway.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. THE RURAL ENTREPRENEUR (Core Stream)
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 border border-[#1a1a1a]">
            
            {/* Left: The Logic */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9] flex flex-col justify-between">
               <div>
                  <div className="flex items-center gap-4 mb-8">
                     <Map className="w-12 h-12 text-[#CCFF00]" />
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00]">Flagship Stream</span>
                  </div>
                  <h2 className="font-serif text-5xl mb-6">Rural <br/> Entrepreneur</h2>
                  <p className="font-sans text-lg opacity-80 leading-relaxed mb-12">
                     You cannot apply directly to the province. You must first conduct an "Exploratory Visit" to a participating rural community (pop &lt; 100k) and secure a Community Support Letter.
                  </p>
               </div>
               
               <div className="space-y-4 font-sans text-sm opacity-60">
                  <p>• Step 1: Connect with Community</p>
                  <p>• Step 2: Pitch Business Concept</p>
                  <p>• Step 3: Receive Support Letter</p>
                  <p>• Step 4: Apply to AAIP</p>
               </div>
            </div>

            {/* Right: The Numbers */}
            <div className="p-12 bg-white text-[#1a1a1a]">
               <div className="mb-12">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2 block">Eligibility Criteria</span>
                  <h3 className="font-serif text-4xl">The Thresholds</h3>
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Net Worth</span>
                     <span className="font-serif text-2xl">$300,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-2xl">$100,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Ownership</span>
                     <span className="font-serif text-2xl">51% (New)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Experience</span>
                     <span className="font-serif text-2xl">3 Years Owner</span>
                  </div>
               </div>

               <div className="mt-12 p-6 bg-[#F2F0E9] border-l-4 border-[#CCFF00]">
                  <p className="font-sans text-xs font-bold uppercase tracking-widest mb-2">Success Tip</p>
                  <p className="font-serif text-lg leading-snug">
                     "Buy, Don't Build." Acquiring an existing business (Succession) often receives priority from communities looking to save local jobs.
                  </p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          3. SPECIALIZED STREAMS (Grads & Farmers)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="mb-16 px-4">
            <h2 className="font-serif text-4xl mb-6">Niche Pathways</h2>
            <div className="w-12 h-1 bg-[#CCFF00]"></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            
            {/* Foreign Graduate */}
            <div className="group border border-[#1a1a1a]/10 p-8 hover:border-[#1a1a1a] transition-all">
               <GraduationCap className="w-10 h-10 mb-6 text-[#1a1a1a]" />
               <h3 className="font-serif text-2xl mb-4 group-hover:text-[#CCFF00] bg-clip-text transition-colors">Foreign Graduate</h3>
               <p className="font-sans text-sm opacity-60 mb-6 leading-relaxed">
                  For graduates educated <u>outside</u> Canada. Extremely rare. Must have a letter of recommendation from a designated agency.
               </p>
               <div className="flex gap-2">
                  <span className="text-[10px] font-bold uppercase border border-[#1a1a1a]/20 px-2 py-1">No Min NW</span>
                  <span className="text-[10px] font-bold uppercase border border-[#1a1a1a]/20 px-2 py-1">$50k-100k Inv</span>
               </div>
            </div>

            {/* Graduate Entrepreneur */}
            <div className="group border border-[#1a1a1a]/10 p-8 hover:border-[#1a1a1a] transition-all">
               <div className="relative">
                  <GraduationCap className="w-10 h-10 mb-6 text-[#1a1a1a]" />
                  <span className="absolute top-0 right-0 text-[10px] font-bold bg-[#CCFF00] px-1">LOCAL</span>
               </div>
               <h3 className="font-serif text-2xl mb-4">Graduate Entrepreneur</h3>
               <p className="font-sans text-sm opacity-60 mb-6 leading-relaxed">
                  Strictly for international students who graduated from an <u>Alberta</u> institution (2+ years study) and hold a valid PGWP.
               </p>
               <ul className="space-y-1 text-xs font-bold opacity-80">
                  <li>• CLB 7 Language</li>
                  <li>• 34% Ownership</li>
               </ul>
            </div>

            {/* Farm Stream */}
            <div className="group border border-[#1a1a1a]/10 p-8 hover:border-[#1a1a1a] transition-all bg-[#1a1a1a] text-[#F2F0E9]">
               <Tractor className="w-10 h-10 mb-6 text-[#CCFF00]" />
               <h3 className="font-serif text-2xl mb-4">Farm Stream</h3>
               <p className="font-sans text-sm opacity-60 mb-6 leading-relaxed">
                  For experienced farm managers with capital. Must prove farm management skills and financial viability.
               </p>
               <div className="border-t border-[#F2F0E9]/20 pt-4 mt-4">
                  <p className="text-xl font-serif text-[#CCFF00]">$500,000 CAD</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-50">Min Equity Investment</p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          4. THE TAX ADVANTAGE (Visual Breakdown)
      ========================================= */}
      <section className="py-24 bg-[#F2F0E9] border-y border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4">
            
            <div>
               <span className="font-sans text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-1 mb-6 inline-block">FISCAL POLICY</span>
               <h2 className="font-serif text-5xl mb-8">Why Alberta?</h2>
               <p className="font-sans text-[#1a1a1a]/70 text-lg leading-relaxed mb-8">
                  It’s simple math. Alberta is the only province with no provincial sales tax (PST) and the lowest corporate tax rate in the country.
                  Your burn rate is simply lower here.
               </p>
               
               <ul className="space-y-4">
                  <li className="flex items-center gap-4">
                     <Percent className="w-6 h-6 text-[#CCFF00] bg-black p-1 rounded-full" />
                     <span className="font-bold text-xl">0% PST</span>
                     <span className="text-sm opacity-50">(vs 7-10% elsewhere)</span>
                  </li>
                  <li className="flex items-center gap-4">
                     <Landmark className="w-6 h-6 text-[#CCFF00] bg-black p-1 rounded-full" />
                     <span className="font-bold text-xl">8% Corp Tax</span>
                     <span className="text-sm opacity-50">(General Rate)</span>
                  </li>
                  <li className="flex items-center gap-4">
                     <Landmark className="w-6 h-6 text-[#CCFF00] bg-black p-1 rounded-full" />
                     <span className="font-bold text-xl">2% Small Biz</span>
                     <span className="text-sm opacity-50">(First $500k income)</span>
                  </li>
               </ul>
            </div>

            {/* Visual Chart/Card */}
            <div className="relative">
               <div className="border border-[#1a1a1a] p-8 bg-white rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex justify-between items-end border-b border-black pb-4 mb-4">
                     <h4 className="font-serif text-2xl">Cost of Living</h4>
                     <span className="text-xs font-bold uppercase">Index 2025</span>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <span className="w-24 text-xs font-bold text-right">Toronto</span>
                        <div className="h-4 bg-[#1a1a1a]/20 w-full rounded-sm overflow-hidden">
                           <div className="h-full bg-[#1a1a1a] w-[95%]"></div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="w-24 text-xs font-bold text-right">Vancouver</span>
                        <div className="h-4 bg-[#1a1a1a]/20 w-full rounded-sm overflow-hidden">
                           <div className="h-full bg-[#1a1a1a] w-[100%]"></div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="w-24 text-xs font-bold text-right">Calgary</span>
                        <div className="h-4 bg-[#1a1a1a]/20 w-full rounded-sm overflow-hidden">
                           <div className="h-full bg-[#CCFF00] w-[70%]"></div>
                        </div>
                     </div>
                  </div>
                  <p className="mt-6 text-xs text-center italic opacity-50">
                     *Housing affordability in Alberta remains significantly higher than BC or ON.
                  </p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          5. CTA
      ========================================= */}
      <section className="py-32 text-center">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Go Rural. Grow Global.
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            Ready to pitch your business to an Alberta community? 
            We organize the exploratory visit and handle the pitch deck.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               Plan Exploratory Visit
            </Link>
            <Link href="/pnp" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               View Other Provinces
            </Link>
         </div>
      </section>

    </div>
  );
}