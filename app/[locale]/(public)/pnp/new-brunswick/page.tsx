// ============================================================================
// Page: app/pnp/new-brunswick/page.tsx
// Style: Modernist Editorial (SVR Identity)
// Context: New Brunswick Provincial Nominee Program (NBPNP) - Entrepreneur Stream
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Truck, 
  Languages, 
  Coins, 
  Map, 
  FileCheck, 
  AlertOctagon,
  Anchor
} from 'lucide-react';
import type { Metadata } from 'next';

import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/pnp/new-brunswick', locale);
}

export default function NewBrunswickPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE LOGISTICS HUB
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Jurisdiction: New Brunswick</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12">
           ATLANTIC <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">GATEWAY.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 Bordering the USA. <br/>
                 Canada's only <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">Bilingual Province.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 New Brunswick operates differently. While other provinces track your performance with work permits, 
                 NBPNP utilizes a <strong>Deposit Agreement</strong> model. You put "skin in the game" ($100k) upfront to secure your nomination.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. THE ENTREPRENEURIAL STREAM
      ========================================= */}
      <section className="py-24">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">Entrepreneurial Stream</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg max-w-2xl">
               Designed for experienced business owners who want to live in Fredericton, Moncton, or Saint John.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 border border-[#1a1a1a]">
            
            {/* REQUIREMENTS */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00] mb-2">Eligibility</span>
                     <h3 className="font-serif text-4xl">The Profile</h3>
                  </div>
                  <FileCheck className="w-12 h-12 text-[#CCFF00]" />
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Net Worth</span>
                     <span className="font-serif text-2xl">$600,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Liquidity</span>
                     <span className="font-serif text-2xl">$300,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Experience</span>
                     <span className="font-serif text-2xl">3y Owner / 5y Mgr</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Language</span>
                     <span className="font-serif text-2xl">CLB 5</span>
                  </div>
               </div>
            </div>

            {/* INVESTMENT */}
            <div className="p-12 bg-white text-[#1a1a1a] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Commitment</span>
                     <h3 className="font-serif text-4xl">The Capital</h3>
                  </div>
                  <Coins className="w-12 h-12 text-[#1a1a1a]" />
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-2xl">$250,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Equity</span>
                     <span className="font-serif text-2xl">33.33% Min</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Deposit</span>
                     <span className="font-serif text-2xl bg-[#b91c1c] text-white px-2">$100,000 CAD</span>
                  </div>
                  <p className="text-xs opacity-50 mt-4 leading-relaxed border-l-2 border-[#b91c1c] pl-2">
                     <strong>Note:</strong> The $100k deposit is refundable <u>only</u> if you establish the business within 2 years. If you fail, the province keeps it.
                  </p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          3. THE DEPOSIT AGREEMENT (Unique Mechanism)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
               <h2 className="font-serif text-4xl mb-6">Skin in the <br/> Game.</h2>
               <div className="w-12 h-1 bg-[#CCFF00] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed mb-6">
                  Most provinces have moved to a pure "Performance Agreement" (no money down). 
                  New Brunswick retains the <strong>Deposit Agreement</strong>.
               </p>
               <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">
                  This creates a faster "Fast Track" for serious investors. 
                  By depositing $100,000 CAD, you signal absolute commitment, often resulting in quicker processing times than Ontario or BC.
               </p>
            </div>

            <div className="lg:col-span-7">
               <div className="bg-[#1a1a1a] p-10 text-[#F2F0E9] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00] rounded-full blur-[50px] opacity-20"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                     <div className="border-b md:border-b-0 md:border-r border-[#F2F0E9]/20 pb-8 md:pb-0 md:pr-8">
                        <span className="font-sans text-xs font-bold uppercase text-[#CCFF00] mb-2 block">Scenario A</span>
                        <h4 className="font-serif text-2xl mb-2">Success</h4>
                        <p className="font-sans text-xs opacity-60 mb-4">You land, launch the business, and run it for 1 year.</p>
                        <div className="flex items-center gap-2">
                           <ArrowRight className="w-4 h-4 text-[#CCFF00]" />
                           <span className="font-bold">Full $100k Refund</span>
                        </div>
                     </div>
                     <div className="pl-0 md:pl-8">
                        <span className="font-sans text-xs font-bold uppercase text-[#b91c1c] mb-2 block">Scenario B</span>
                        <h4 className="font-serif text-2xl mb-2">Default</h4>
                        <p className="font-sans text-xs opacity-60 mb-4">You land, but fail to invest or leave the province.</p>
                        <div className="flex items-center gap-2">
                           <ArrowRight className="w-4 h-4 text-[#b91c1c]" />
                           <span className="font-bold">Deposit Forfeited</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          4. EXPLORATORY VISIT (Mandatory?)
      ========================================= */}
      <section className="py-24 bg-[#F2F0E9] border-y border-[#1a1a1a]/10">
         <div className="flex flex-col md:flex-row gap-12 items-start">
            
            <div className="md:w-1/3">
               <div className="border border-[#1a1a1a] p-8 bg-white rotate-1 hover:rotate-0 transition-transform">
                  <Map className="w-10 h-10 text-[#1a1a1a] mb-4" />
                  <h3 className="font-serif text-3xl mb-4">Boots on the Ground</h3>
                  <p className="font-sans text-sm opacity-60">
                     While technically "optional" in some guides, in practice, an Exploratory Visit is <strong>essential</strong> to score high enough for an invitation.
                  </p>
               </div>
            </div>
            
            <div className="md:w-2/3">
               <h3 className="font-serif text-3xl mb-6">The 5-Day Business Trip</h3>
               <p className="font-sans text-lg text-[#1a1a1a]/70 mb-8 leading-relaxed">
                  You must visit New Brunswick for at least 5 business days. During this trip, you are not a tourist. 
                  You are a researcher.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                     "Meeting with Economic Development Officers",
                     "Scouting Commercial Real Estate",
                     "Interviewing Competitors/Suppliers",
                     "Connecting with Realtors",
                     "Documenting Trip Report (Boarding passes, receipts)"
                  ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 border-b border-[#1a1a1a]/10 pb-3">
                        <span className="w-1.5 h-1.5 bg-[#CCFF00] border border-black rounded-full shrink-0"></span>
                        <span className="font-sans text-sm text-[#1a1a1a]">{item}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          5. PRIORITY SECTORS & BILINGUALISM
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Sector Focus */}
            <div>
               <div className="flex items-center gap-4 mb-6">
                  <Truck className="w-8 h-8 text-[#1a1a1a]" />
                  <h3 className="font-serif text-3xl">Strategic Sectors</h3>
               </div>
               <p className="font-sans text-sm text-[#1a1a1a]/60 mb-6">
                  NB is a logistics hub. Businesses that facilitate trade or value-added manufacturing are prioritized.
               </p>
               <ul className="space-y-2 font-sans text-sm font-bold">
                  <li className="bg-[#1a1a1a]/5 p-2">• Information Technology / Cybersecurity</li>
                  <li className="bg-[#1a1a1a]/5 p-2">• Value-added Wood Processing</li>
                  <li className="bg-[#1a1a1a]/5 p-2">• Agriculture & Aquaculture</li>
                  <li className="bg-[#1a1a1a]/5 p-2">• Tourism Operators (Outside Peak Season)</li>
               </ul>
            </div>

            {/* Bilingual Advantage */}
            <div className="bg-[#CCFF00]/10 border border-[#CCFF00] p-8">
               <div className="flex items-center gap-4 mb-6">
                  <Languages className="w-8 h-8 text-[#1a1a1a]" />
                  <h3 className="font-serif text-3xl">French Connection</h3>
               </div>
               <p className="font-sans text-sm text-[#1a1a1a]/80 mb-6 leading-relaxed">
                  If you have intermediate proficiency in French (NCLC 5+), your probability of selection effectively doubles. 
                  New Brunswick aims to increase its Francophone immigration to 33% by 2025.
               </p>
               <div className="inline-block bg-[#1a1a1a] text-[#CCFF00] text-xs font-bold uppercase px-3 py-1">
                  Massive Points Boost
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          6. RESTRICTED LIST
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-12 items-center">
             <div className="md:w-1/3 text-center md:text-left">
                <AlertOctagon className="w-16 h-16 text-[#b91c1c] mb-6 mx-auto md:mx-0" />
                <h2 className="font-serif text-4xl mb-4">Ineligible</h2>
                <p className="font-sans text-sm opacity-60">
                   Do not apply if your business model falls into these categories.
                </p>
             </div>
             
             <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
                <div className="border-b border-[#F2F0E9]/20 pb-2">Adult Services / Sex Industry</div>
                <div className="border-b border-[#F2F0E9]/20 pb-2">Coin-operated businesses (Laundromat/Car wash)</div>
                <div className="border-b border-[#F2F0E9]/20 pb-2">Brokerage (Real Estate/Insurance)</div>
                <div className="border-b border-[#F2F0E9]/20 pb-2">Professional Services (Lawyers/Doctors)</div>
                <div className="border-b border-[#F2F0E9]/20 pb-2">Bed & Breakfasts / Short-term Rentals</div>
                <div className="border-b border-[#F2F0E9]/20 pb-2">Pawnbrokers</div>
             </div>
         </div>
      </section>


      {/* =========================================
          7. CTA
      ========================================= */}
      <section className="py-32 text-center">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Ready to Deposit?
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            The deposit model is high stakes, but it filters out the noise. 
            If you are liquid and ready to move, NB is your fast lane.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               Plan Exploratory Visit
            </Link>
            <Link href="/pnp" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Back to Provinces
            </Link>
         </div>
      </section>

    </div>
  );
}