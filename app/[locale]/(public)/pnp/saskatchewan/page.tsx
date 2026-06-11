// ============================================================================
// Page: app/pnp/saskatchewan/page.tsx
// Style: Modernist Editorial (SVR Identity)
// Context: Saskatchewan Immigrant Nominee Program (SINP) - Entrepreneur & Farm
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Wheat, 
  Building2, 
  Tractor, 
  AlertTriangle, 
  CheckCircle2,
  Scale
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saskatchewan (SINP) | The Prairie Engine',
  description: 'Entrepreneur and Farm Owner pathways. Low investment thresholds for rural communities.',
};

export default function SaskatchewanPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE PRAIRIE ENGINE
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Jurisdiction: Saskatchewan</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12">
           PRAIRIE <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">ENGINE.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 World leader in Potash and Uranium. <br/>
                 Global breadbasket. <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">Lowest rural entry cost.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 The Saskatchewan Immigrant Nominee Program (SINP) is aggressively recruiting entrepreneurs. 
                 It offers two distinct streams: a general Entrepreneur Category and a specialized Farm Owner/Operator stream for agricultural experts.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. ENTREPRENEUR CATEGORY: THE URBAN/RURAL SPLIT
      ========================================= */}
      <section className="py-24">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">Entrepreneur Category</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg max-w-2xl">
               Saskatchewan clearly defines its "Urban" vs "Rural" investment tiers. 
               Venturing outside the two major cities significantly lowers your capital requirements.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 border border-[#1a1a1a]">
            
            {/* URBAN: REGINA / SASKATOON */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00] mb-2">Urban Center</span>
                     <h3 className="font-serif text-4xl">Regina & Saskatoon</h3>
                     <span className="text-xs opacity-50 mt-1">Major Cities</span>
                  </div>
                  <Building2 className="w-12 h-12 text-[#CCFF00]" />
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Net Worth</span>
                     <span className="font-serif text-2xl">$500,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-2xl">$300,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Job Creation</span>
                     <span className="font-serif text-2xl">2 Jobs</span>
                  </div>
                  <p className="text-xs opacity-50 mt-4 leading-relaxed">
                     <strong>Strict Requirement:</strong> You MUST create 2 new jobs for Canadians or Permanent Residents if establishing a new business.
                  </p>
               </div>
            </div>

            {/* RURAL: OTHER COMMUNITIES */}
            <div className="p-12 bg-white text-[#1a1a1a] group relative overflow-hidden">
               {/* Decorative Wheat */}
               <div className="absolute -right-10 bottom-0 opacity-5">
                  <Wheat className="w-64 h-64" />
               </div>

               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">High Value</span>
                     <h3 className="font-serif text-4xl">Rural Communities</h3>
                     <span className="text-xs opacity-50 mt-1">Moose Jaw, Prince Albert, Yorkton, etc.</span>
                  </div>
                  <Tractor className="w-12 h-12 text-[#1a1a1a]" />
               </div>

               <div className="space-y-8 relative z-10">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Net Worth</span>
                     <span className="font-serif text-2xl">$500,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-2xl text-[#CCFF00] bg-black px-2">$200,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Job Creation</span>
                     <span className="font-serif text-2xl">0 Jobs*</span>
                  </div>
                  <p className="text-xs opacity-60 mt-4 leading-relaxed">
                     *Creating jobs is <strong>NOT required</strong> for new businesses in rural areas. You only need to maintain existing staff if buying a business.
                  </p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          3. FARM OWNER & OPERATOR
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <h2 className="font-serif text-4xl mb-6">Agri-Business <br/> Pathways</h2>
               <div className="w-12 h-1 bg-[#CCFF00] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  Saskatchewan contains 40% of Canada's cultivated farmland. 
                  This stream is for experienced farmers who wish to purchase and operate a farm.
               </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* General Farm Stream */}
               <div className="border border-[#1a1a1a]/10 p-8 hover:border-[#1a1a1a] transition-all">
                  <h3 className="font-serif text-2xl mb-4">Farm Owner / Operator</h3>
                  <div className="space-y-3 font-sans text-sm mb-6">
                     <p className="flex justify-between"><span>Net Worth:</span> <span>$500,000 CAD</span></p>
                     <p className="flex justify-between"><span>Deposit:</span> <span>$75,000 CAD (Refundable)</span></p>
                     <p className="flex justify-between"><span>Visit:</span> <span>5 Days Exploratory</span></p>
                  </div>
                  <p className="text-xs opacity-60 leading-relaxed border-t border-[#1a1a1a]/10 pt-4">
                     Must demonstrate proven farm operation knowledge. Hobby farms are ineligible.
                  </p>
               </div>

               {/* Young Farmer Stream */}
               <div className="border border-[#1a1a1a]/10 p-8 hover:border-[#1a1a1a] transition-all bg-[#1a1a1a] text-[#F2F0E9]">
                  <div className="flex justify-between items-start">
                     <h3 className="font-serif text-2xl mb-4">Young Farmer</h3>
                     <span className="text-[10px] font-bold bg-[#CCFF00] text-[#1a1a1a] px-2 py-1 uppercase">Under 40</span>
                  </div>
                  <div className="space-y-3 font-sans text-sm mb-6">
                     <p className="flex justify-between"><span>Net Worth:</span> <span>$300,000 CAD</span></p>
                     <p className="flex justify-between"><span>Investment:</span> <span>$150,000 CAD</span></p>
                     <p className="flex justify-between"><span>Experience:</span> <span>3 Years</span></p>
                  </div>
                  <p className="text-xs opacity-60 leading-relaxed border-t border-[#F2F0E9]/20 pt-4">
                     Designed to attract the next generation of agricultural producers. Lower financial thresholds.
                  </p>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          4. THE PROCESS: BPA & EOI
      ========================================= */}
      <section className="py-24 bg-[#F2F0E9] border-y border-[#1a1a1a]/10">
         <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-4xl text-center mb-16">Execution Protocol</h2>
            
            <div className="relative border-l border-[#1a1a1a]/20 ml-6 md:ml-0 space-y-12">
               {[
                  { title: "Expression of Interest (EOI)", desc: "You are ranked on points (Age, Experience, Net Worth, Revenue, Innovation). Only top scorers are invited." },
                  { title: "Invitation to Apply (ITA)", desc: "Once invited, your Net Worth is verified by a third-party service provider (KPMG, MNP, etc.)." },
                  { title: "Business Performance Agreement (BPA)", desc: "You sign a contract with the province detailing your investment. This replaces the old deposit system for Entrepreneurs." },
                  { title: "Temporary Work Permit", desc: "You arrive in Saskatchewan and operate your business for at least 6 months (12 months recommended)." },
                  { title: "Nomination", desc: "Once you meet the BPA terms, you apply for nomination and then Permanent Residency." }
               ].map((item, i) => (
                  <div key={i} className="md:flex gap-8 items-start relative group">
                     <div className="hidden md:flex flex-col items-center w-16 shrink-0">
                        <div className="w-4 h-4 bg-[#1a1a1a] rounded-full group-hover:bg-[#CCFF00] transition-colors mb-full"></div>
                     </div>
                     <div className="pl-8 md:pl-0">
                        <span className="font-sans text-xs font-bold text-[#1a1a1a]/40 mb-1 block">Phase 0{i+1}</span>
                        <h3 className="font-serif text-2xl mb-2">{item.title}</h3>
                        <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          5. RESTRICTED SECTORS
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 md:px-0">
            <div className="bg-[#1a1a1a] text-[#F2F0E9] p-10 flex flex-col justify-center">
               <AlertTriangle className="w-12 h-12 text-[#b91c1c] mb-6" />
               <h2 className="font-serif text-4xl mb-4">The Red Zone</h2>
               <p className="font-sans text-sm opacity-70">
                  Saskatchewan prioritizes active economic contribution. Passive or saturated businesses are strictly ineligible.
               </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                  "Property Rental / Leasing",
                  "Real Estate Construction",
                  "Property Development",
                  "Insurance/Business Brokerage",
                  "Professional Services (requiring license)",
                  "Payday Loan / Cheque Cashing",
                  "Bed & Breakfasts / Home-based",
                  "Co-operatives"
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 border border-[#1a1a1a]/10 hover:border-[#b91c1c] transition-colors cursor-not-allowed opacity-60 hover:opacity-100">
                     <span className="w-1.5 h-1.5 bg-[#b91c1c] rounded-full shrink-0"></span>
                     <span className="font-serif text-sm">{item}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 text-center border-t border-[#1a1a1a]/10">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Saskatoon or Rural?
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            The EOI points grid rewards innovation and rural development. 
            Let's simulate your score and identify the optimal community.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               Start SINP Assessment
            </Link>
            <Link href="/pnp" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Back to Provinces
            </Link>
         </div>
      </section>

    </div>
  );
}