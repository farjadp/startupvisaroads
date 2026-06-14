// ============================================================================
// Page: app/pnp/ontario/page.tsx
// Style: Modernist Editorial (SVR Identity)
// Context: Ontario Immigrant Nominee Program (OINP) - Entrepreneur & Tech
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Building2, 
  MapPin, 
  Wallet, 
  Users, 
  Laptop2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import type { Metadata } from 'next';

import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/pnp/ontario', locale);
}

export default function OntarioPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE ENGINE
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Jurisdiction: Ontario</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12">
           THE ECONOMIC <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">ENGINE.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 Home to Toronto, Waterloo, and 40% of Canada's GDP. 
                 <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">High stakes, high reward.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 The Ontario Immigrant Nominee Program (OINP) is the most competitive provincial stream in the country. 
                 It operates a rigid "Expression of Interest" (EOI) system. Only the highest-scoring business concepts receive an invitation.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. ENTREPRENEUR STREAM: THE GEOGRAPHIC SPLIT
      ========================================= */}
      <section className="py-24">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">Entrepreneur Stream</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg max-w-2xl">
               Ontario strictly enforces a "Two-Tier" system based on geography. 
               The closer you are to Toronto (GTA), the higher the price of admission.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 border border-[#1a1a1a]">
            
            {/* TIER 1: INSIDE GTA */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9]">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00] mb-2">Zone A</span>
                     <h3 className="font-serif text-4xl">Inside GTA</h3>
                     <span className="text-xs opacity-50 mt-1">Toronto, Durham, Halton, York, Peel</span>
                  </div>
                  <Building2 className="w-12 h-12 text-[#CCFF00]" />
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Net Worth</span>
                     <span className="font-serif text-2xl">$800,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-2xl">$600,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Ownership</span>
                     <span className="font-serif text-2xl">33.3%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Job Creation</span>
                     <span className="font-serif text-2xl">2 Full-time</span>
                  </div>
               </div>
            </div>

            {/* TIER 2: OUTSIDE GTA */}
            <div className="p-12 bg-white text-[#1a1a1a]">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Zone B</span>
                     <h3 className="font-serif text-4xl">Outside GTA</h3>
                     <span className="text-xs opacity-50 mt-1">Waterloo, Hamilton, Ottawa, London, etc.</span>
                  </div>
                  <MapPin className="w-12 h-12 text-[#1a1a1a]" />
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Net Worth</span>
                     <span className="font-serif text-2xl">$400,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-2xl">$200,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Ownership</span>
                     <span className="font-serif text-2xl">33.3%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Job Creation</span>
                     <span className="font-serif text-2xl">1 Full-time</span>
                  </div>
               </div>
            </div>

         </div>

         {/* THE ICT EXCEPTION (Loophole) */}
         <div className="mt-8 border border-[#CCFF00] bg-[#CCFF00]/10 p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-[#CCFF00] p-4 rounded-full">
               <Laptop2 className="w-8 h-8 text-[#1a1a1a]" />
            </div>
            <div>
               <h4 className="font-serif text-2xl mb-2">The ICT Sector Exception</h4>
               <p className="font-sans text-sm text-[#1a1a1a]/80 leading-relaxed">
                  <strong>Strategic Advantage:</strong> If your proposed business is in the Information & Communications Technology (ICT) / Digital sector, 
                  you qualify for the <u>Outside GTA</u> requirements (Lower Investment/Net Worth) even if you set up your office inside Toronto.
               </p>
            </div>
         </div>
      </section>


      {/* =========================================
          3. EXECUTION ROADMAP
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 sticky top-24 h-fit">
               <h2 className="font-serif text-5xl mb-6">The <br/> Protocol</h2>
               <div className="w-12 h-1 bg-[#1a1a1a] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  OINP Entrepreneur is a performance-based stream. PR is not given; it is earned through execution.
               </p>
            </div>

            <div className="lg:col-span-8 space-y-0 border-l border-[#1a1a1a]/10">
               
               {[
                  { step: "01", title: "EOI Registration", desc: "We register an Expression of Interest. Points are awarded for Human Capital, Investment amount, and Business Concept quality." },
                  { step: "02", title: "Invitation to Apply", desc: "OINP conducts periodic draws. Only top-scoring candidates are invited to submit a full application and third-party Net Worth verification report." },
                  { step: "03", title: "Performance Agreement", desc: "If approved, you sign a binding contract with Ontario. You receive a Letter of Support for a 2-year Work Permit." },
                  { step: "04", title: "Execution Phase", desc: "You arrive in Ontario (min 75% physical presence required). You have 20 months to deploy capital and hire staff." },
                  { step: "05", title: "Nomination", desc: "Final Audit. If you met the terms of the Performance Agreement, Ontario issues the Nomination Certificate for PR." }
               ].map((item, i) => (
                  <div key={i} className="group pl-8 py-12 border-b border-[#1a1a1a]/10 hover:bg-white transition-all">
                     <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-4 inline-block">{item.step}</span>
                     <h3 className="font-serif text-3xl mb-4 group-hover:translate-x-2 transition-transform">{item.title}</h3>
                     <p className="font-sans text-[#1a1a1a]/60 max-w-xl leading-relaxed">
                        {item.desc}
                     </p>
                  </div>
               ))}

            </div>
         </div>
      </section>


      {/* =========================================
          4. INELIGIBLE BUSINESSES (Crucial)
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <h2 className="font-serif text-4xl text-[#CCFF00]">Restricted Sectors</h2>
               <p className="font-sans text-sm opacity-60 max-w-md text-right">
                  Ontario does not need more gas stations. <br/>
                  The following businesses are strictly ineligible in the GTA:
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                  "Car Washes",
                  "Scrap Metal Recycling",
                  "Laundromats",
                  "Pawnbrokers",
                  "Payday Loan Agencies",
                  "Gas Stations",
                  "Bed and Breakfasts",
                  "Existing Franchises (Specific rules apply)"
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-[#F2F0E9]/20 pb-4">
                     <AlertTriangle className="w-5 h-5 text-[#b91c1c]" />
                     <span className="font-serif text-xl">{item}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          5. ALTERNATE PATH: TECH DRAWS
      ========================================= */}
      <section className="py-24">
         <div className="border border-[#1a1a1a] p-12 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00] rounded-bl-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
               <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4 block">Alternative Route for Employees</span>
               <h2 className="font-serif text-5xl mb-6">OINP Tech Draws</h2>
               <p className="font-sans text-lg text-[#1a1a1a]/70 mb-8 max-w-3xl leading-relaxed">
                  Not an entrepreneur? If you have a job offer in Ontario in one of the priority tech occupations 
                  (Software Engineers, Web Designers, Data Scientists), you may qualify for the 
                  <strong> Human Capital Priorities Stream</strong> via Express Entry.
               </p>
               
               <div className="flex flex-wrap gap-4">
                  <span className="bg-[#1a1a1a] text-[#F2F0E9] px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest">NOC 21231</span>
                  <span className="bg-[#1a1a1a] text-[#F2F0E9] px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest">NOC 21232</span>
                  <span className="bg-[#1a1a1a] text-[#F2F0E9] px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest">NOC 21230</span>
                  <span className="bg-[#1a1a1a] text-[#F2F0E9] px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest">NOC 21211</span>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 text-center">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Are you GTA ready?
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            The competition is high, but so is the market potential. 
            Let's score your profile against the latest OINP draw cut-offs.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               Schedule OINP Audit
            </Link>
            <Link href="/pnp" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Compare Other Provinces
            </Link>
         </div>
      </section>

    </div>
  );
}