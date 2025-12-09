// ============================================================================
// Page: app/europe/denmark/page.tsx
// Style: Editorial / Art Gallery
// Concept: "Scandi Innovation"
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Check,
  ShieldAlert,
  Snowflake,
  Euro
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Denmark Startup | The Nordic Gateway',
  description: 'Advisory for the Expert Panel review. Innovation and scalability assessment.',
};

export default function DenmarkStartupPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: THE NORDIC VISION
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#1a2c4e]"></span> {/* Nordic Navy */}
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Scandinavia</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            DENMARK <br/>
            <span className="pl-[10vw] italic text-[#1a1a1a]/40">INNOVATION.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
             <div className="lg:col-span-7">
                <p className="font-serif text-3xl md:text-5xl leading-tight">
                   The world's <span className="bg-[#1a2c4e] text-[#F2F0E9] px-2">#1 ranked</span> nation for ease of business.
                </p>
             </div>
             <div className="lg:col-span-5 flex flex-col gap-8">
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify border-l-2 border-[#1a2c4e] pl-6">
                   Start-up Denmark is a visa scheme for non-EU entrepreneurs who want to grow high-impact businesses. 
                   The gatekeeper is not an immigration officer, but an independent <span className="font-bold">Expert Panel</span> of industry leaders.
                </p>
                <div className="flex gap-4">
                   <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#1a2c4e] transition-colors">
                      Panel Assessment
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. THE CRITERIA (Clean Grid)
      ========================================= */}
      <section className="py-0 border-b border-[#1a1a1a]">
         <div className="grid grid-cols-1 md:grid-cols-3">
            
            {/* Box 1 */}
            <div className="group border-b md:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <Lightbulb className="w-12 h-12 mb-8 text-[#1a2c4e] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">Innovation</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  Your business must introduce a new product, service, or process. 
                  Standard consulting, retail, or import/export businesses are routinely rejected.
               </p>
            </div>

            {/* Box 2 */}
            <div className="group border-b md:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <TrendingUp className="w-12 h-12 mb-8 text-[#1a2c4e] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">Scalability</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  You must demonstrate high growth potential. The Expert Panel looks for businesses 
                  capable of creating jobs and expanding beyond the Danish border.
               </p>
            </div>

            {/* Box 3 */}
            <div className="group p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <Users className="w-12 h-12 mb-8 text-[#1a2c4e] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">Capability</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  The team must possess the technical and commercial skills to execute. 
                  The panel evaluates the founders as much as the idea.
               </p>
            </div>

         </div>
      </section>

      {/* =========================================
          3. OUR ROLE: PANEL PREP
      ========================================= */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               
               <div className="relative">
                  <div className="aspect-[4/5] relative grayscale hover:grayscale-0 transition-all duration-700 border border-[#F2F0E9]/20">
                     <Image 
                        src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070&auto=format&fit=crop"
                        alt="Danish Architecture"
                        fill
                        className="object-cover"
                     />
                  </div>
               </div>

               <div>
                  <span className="font-sans text-xs font-bold text-[#CCFF00] mb-8 block uppercase tracking-widest">Advisory</span>
                  <h2 className="font-serif text-5xl mb-8">
                     Passing the Panel.
                  </h2>
                  <p className="font-sans text-lg opacity-60 mb-12 leading-relaxed">
                     The Danish Business Authority (Erhvervsstyrelsen) demands a specific format and depth of analysis. 
                     We translate your business into the language of the Danish ecosystem.
                  </p>

                  <div className="space-y-8">
                     <div className="flex gap-6 items-start group">
                        <span className="font-serif text-3xl text-[#CCFF00]">01</span>
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">Runway Validation</h4>
                           <p className="text-sm opacity-60 font-sans">Proving you have sufficient funds (approx. 140,000 DKK) to support yourself for a year.</p>
                        </div>
                     </div>
                     <div className="flex gap-6 items-start group">
                        <span className="font-serif text-3xl text-[#CCFF00]">02</span>
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">Digital Integration</h4>
                           <p className="text-sm opacity-60 font-sans">Aligning your operations with Denmark's advanced digital infrastructure (NemID, e-Boks).</p>
                        </div>
                     </div>
                     <div className="flex gap-6 items-start group">
                        <span className="font-serif text-3xl text-[#CCFF00]">03</span>
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">The Pitch</h4>
                           <p className="text-sm opacity-60 font-sans">Creating a pitch deck that visually communicates your value prop to the panel in &lt; 5 minutes.</p>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          4. BENEFITS (List)
      ========================================= */}
      <section className="py-24 px-6 border-b border-[#1a1a1a]/10">
         <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl mb-16">The Nordic Advantage</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {[
                    "2-Year Residency (Renewable)",
                    "Family Inclusion",
                    "Free Healthcare",
                    "Free Education",
                    "No Minimum Investment",
                    "EU Market Access"
                ].map((tag, i) => (
                    <span key={i} className="font-sans text-sm font-bold border border-[#1a1a1a] px-6 py-3 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors cursor-default">
                        {tag}
                    </span>
                ))}
            </div>
         </div>
      </section>

      {/* =========================================
          5. LEGAL DISCLAIMER
      ========================================= */}
      <section className="py-12 px-6 bg-[#F9F9F9]">
         <div className="container mx-auto max-w-4xl">
            <div className="flex gap-4 items-start">
               <ShieldAlert className="shrink-0 w-6 h-6 text-[#1a1a1a]/40" />
               <p className="font-sans text-xs text-[#1a1a1a]/60 leading-relaxed text-justify">
                  <strong>Regulatory Notice:</strong> Startup Visa Roads assists with business model innovation and panel presentation. 
                  We are <span className="underline">NOT</span> an immigration law firm or a recruitment agency. 
                  Approval by the expert panel does not guarantee a visa; final residency decisions are made by SIRI (Danish Agency for International Recruitment and Integration).
               </p>
            </div>
         </div>
      </section>

      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 px-6 text-center">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl md:text-7xl mb-8">
               Scale in Copenhagen.
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
               Validate your startup concept against the Expert Panel criteria.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a2c4e] transition-colors">
                  Check Eligibility
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}