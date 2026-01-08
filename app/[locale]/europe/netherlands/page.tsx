// ============================================================================
// Page: app/europe/netherlands/page.tsx
// Style: Editorial / Art Gallery
// Concept: "Dutch Modernism"
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Handshake, 
  Lightbulb, 
  Map, 
  Euro,
  Building2,
  ShieldCheck
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Netherlands Startup Visa | The Orange Carpet',
  description: 'Advisory for securing a recognized Facilitator. RVO criteria assessment.',
};

export default function NetherlandsPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: THE ORANGE CARPET
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#f97316]"></span> {/* Dutch Orange */}
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Western Europe</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            DUTCH <br/>
            <span className="pl-[10vw] italic text-[#1a1a1a]/40">MODERNISM.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
             <div className="lg:col-span-7">
                <p className="font-serif text-3xl md:text-5xl leading-tight">
                   Launch your startup in the <span className="bg-[#f97316] text-[#F2F0E9] px-2">Gateway to Europe</span>.
                </p>
             </div>
             <div className="lg:col-span-5 flex flex-col gap-8">
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify border-l-2 border-[#f97316] pl-6">
                   The Netherlands offers a 1-year residency for ambitious founders. 
                   The core requirement is a partnership with a recognized <span className="font-bold">Facilitator</span>. 
                   We help you craft the pitch that secures this crucial mentorship agreement.
                </p>
                <div className="flex gap-4">
                   <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#f97316] transition-colors">
                      Facilitator Match
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. THE CORE MECHANISM (Facilitator)
      ========================================= */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               
               <div>
                  <span className="font-sans text-xs font-bold text-[#f97316] mb-8 block uppercase tracking-widest">The Partnership</span>
                  <h2 className="font-serif text-5xl mb-8">
                     The Facilitator.
                  </h2>
                  <p className="font-sans text-lg opacity-60 mb-12 leading-relaxed">
                     You cannot apply alone. The Dutch Immigration Service (IND) requires a signed agreement 
                     with an experienced mentor (Facilitator) recognized by the RVO.
                  </p>

                  <div className="space-y-8">
                     <div className="flex gap-6 items-start group">
                        <Handshake className="w-8 h-8 text-[#f97316]" />
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">Mentorship Agreement</h4>
                           <p className="text-sm opacity-60 font-sans">A legally binding contract proving the facilitator will guide you for 1 year.</p>
                        </div>
                     </div>
                     <div className="flex gap-6 items-start group">
                        <Lightbulb className="w-8 h-8 text-[#f97316]" />
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">Innovation Test</h4>
                           <p className="text-sm opacity-60 font-sans">Your product must be new to the Netherlands. Copycats are rejected.</p>
                        </div>
                     </div>
                     <div className="flex gap-6 items-start group">
                        <Euro className="w-8 h-8 text-[#f97316]" />
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">Financial Solvency</h4>
                           <p className="text-sm opacity-60 font-sans">Proof of approx €16,000 to support yourself, or funding from the facilitator.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="relative">
                  <div className="aspect-[4/5] relative grayscale hover:grayscale-0 transition-all duration-700 border border-[#F2F0E9]/20">
                     <Image 
                        src="https://images.unsplash.com/photo-1512470876302-972faa2aa9a2?q=80&w=2070&auto=format&fit=crop"
                        alt="Amsterdam Canals"
                        fill
                        className="object-cover"
                     />
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          3. THE STATS (Dutch Grid)
      ========================================= */}
      <section className="py-0 border-b border-[#1a1a1a]">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            
            <div className="group border-b lg:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <Map className="w-12 h-12 mb-8 text-[#f97316] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">#1</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  English Proficiency (Non-native speakers). No language barrier.
               </p>
            </div>

            <div className="group border-b lg:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <Building2 className="w-12 h-12 mb-8 text-[#f97316] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">500M</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  Consumers accessible within 24 hours via road/rail.
               </p>
            </div>

            <div className="group border-b md:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <Euro className="w-12 h-12 mb-8 text-[#f97316] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">30%</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  Ruling: Tax-free allowance for skilled foreign employees.
               </p>
            </div>

            <div className="group p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <ShieldCheck className="w-12 h-12 mb-8 text-[#f97316] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">99%</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  Digital Infrastructure. Highest broadband penetration in EU.
               </p>
            </div>

         </div>
      </section>

      {/* =========================================
          4. LEGAL DISCLAIMER
      ========================================= */}
      <section className="py-12 px-6 bg-[#F9F9F9]">
         <div className="container mx-auto max-w-4xl">
            <div className="flex gap-4 items-start">
               <ShieldCheck className="shrink-0 w-6 h-6 text-[#1a1a1a]/40" />
               <p className="font-sans text-xs text-[#1a1a1a]/60 leading-relaxed text-justify">
                  <strong>Non-Legal Service Notice:</strong> Startup Visa Roads assists with business modeling and facilitator introductions. 
                  We are <span className="underline">NOT</span> an immigration law firm. 
                  Final decisions are made by the IND (Immigration and Naturalisation Service) based on advice from the RVO.
               </p>
            </div>
         </div>
      </section>

      {/* =========================================
          5. CTA
      ========================================= */}
      <section className="py-32 px-6 text-center">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl md:text-7xl mb-8">
               Scale in Amsterdam.
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
               Find your Facilitator and validate your concept for the Dutch market.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#f97316] transition-colors">
                  Start Assessment
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}