// ============================================================================
// Page: app/services/page.tsx
// Style: Editorial / Art Gallery
// Concept: "The Architect's Blueprint"
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowDownRight, 
  FileText, 
  Target, 
  TrendingUp, 
  ShieldAlert,
  Zap,
  Globe2,
  PieChart
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advisory Services | SVR',
  description: 'Business architecture for the global founder. Strategy, Financials, and Market Validation.',
};

export default function ServicesPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: THE ARCHITECT
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#CCFF00]"></span>
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Scope of Work</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            BUSINESS <br/>
            <span className="pl-[10vw] italic text-[#1a1a1a]/40">ARCHITECTURE.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
             <div className="lg:col-span-7">
                <p className="font-serif text-3xl md:text-5xl leading-tight">
                   We translate <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2">vision</span> into <span className="underline decoration-[#CCFF00]">documentation</span>.
                </p>
             </div>
             <div className="lg:col-span-5 flex flex-col gap-8">
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify">
                   Immigration officers are not visionaries; they are bureaucrats. 
                   We bridge the gap by converting your startup idea into the compliant, 
                   data-driven artifacts (Business Plans, Financial Models, IP Strategies) required for approval.
                </p>
                <div className="flex gap-4">
                   <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
                      Start Project
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>


      {/* =========================================
          2. THE CORE SERVICES (Grid System)
      ========================================= */}
      <section className="py-0 border-b border-[#1a1a1a]">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Service 01 */}
            <div className="group border-b lg:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <span className="font-sans text-xs font-bold uppercase tracking-widest mb-8 block opacity-50">Service 01</span>
               <PieChart className="w-12 h-12 mb-8 text-[#CCFF00]" />
               <h3 className="font-serif text-4xl mb-4 group-hover:italic">Business Modeling</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed mb-8">
                  Transforming abstract ideas into concrete revenue models. We stress-test your assumptions before the visa officer does.
               </p>
               <ul className="space-y-2 font-sans text-xs font-bold uppercase tracking-wider opacity-50">
                  <li>— Value Prop Design</li>
                  <li>— Revenue Streams</li>
                  <li>— Customer Segments</li>
               </ul>
            </div>

            {/* Service 02 */}
            <div className="group border-b lg:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <span className="font-sans text-xs font-bold uppercase tracking-widest mb-8 block opacity-50">Service 02</span>
               <FileText className="w-12 h-12 mb-8 text-[#CCFF00]" />
               <h3 className="font-serif text-4xl mb-4 group-hover:italic">The Plan</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed mb-8">
                  A 30-40 page comprehensive document written specifically for immigration intent, not just general investors.
               </p>
               <ul className="space-y-2 font-sans text-xs font-bold uppercase tracking-wider opacity-50">
                  <li>— Market Analysis</li>
                  <li>— Risk Mitigation</li>
                  <li>— Operational Roadmap</li>
               </ul>
            </div>

            {/* Service 03 */}
            <div className="group border-b lg:border-b-0 border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <span className="font-sans text-xs font-bold uppercase tracking-widest mb-8 block opacity-50">Service 03</span>
               <TrendingUp className="w-12 h-12 mb-8 text-[#CCFF00]" />
               <h3 className="font-serif text-4xl mb-4 group-hover:italic">Financials</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed mb-8">
                  5-year pro-forma projections (P&L, Cash Flow, Balance Sheet) that justify your hiring plan and capital needs.
               </p>
               <ul className="space-y-2 font-sans text-xs font-bold uppercase tracking-wider opacity-50">
                  <li>— Unit Economics</li>
                  <li>— Burn Rate Analysis</li>
                  <li>— Valuation Modeling</li>
               </ul>
            </div>

            {/* Service 04 */}
            <div className="group border-b lg:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <span className="font-sans text-xs font-bold uppercase tracking-widest mb-8 block opacity-50">Service 04</span>
               <Zap className="w-12 h-12 mb-8 text-[#CCFF00]" />
               <h3 className="font-serif text-4xl mb-4 group-hover:italic">Pitch Deck</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed mb-8">
                  Visual storytelling designed to secure the "Letter of Support" from Incubators and Angel Groups.
               </p>
               <ul className="space-y-2 font-sans text-xs font-bold uppercase tracking-wider opacity-50">
                  <li>— Narrative Arc</li>
                  <li>— Data Visualization</li>
                  <li>— Competitive Grid</li>
               </ul>
            </div>

            {/* Service 05 */}
            <div className="group border-b lg:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <span className="font-sans text-xs font-bold uppercase tracking-widest mb-8 block opacity-50">Service 05</span>
               <Target className="w-12 h-12 mb-8 text-[#CCFF00]" />
               <h3 className="font-serif text-4xl mb-4 group-hover:italic">Market Intel</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed mb-8">
                  Evidence-based research proving your concept has traction potential in the destination country (Canada/UK/EU).
               </p>
               <ul className="space-y-2 font-sans text-xs font-bold uppercase tracking-wider opacity-50">
                  <li>— TAM/SAM/SOM</li>
                  <li>— Competitor Deep Dive</li>
                  <li>— Entry Strategy</li>
               </ul>
            </div>

            {/* Service 06 */}
            <div className="group p-12 bg-[#1a1a1a] text-[#F2F0E9] hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all duration-300">
               <span className="font-sans text-xs font-bold uppercase tracking-widest mb-8 block opacity-50">Premium</span>
               <Globe2 className="w-12 h-12 mb-8 text-[#F2F0E9] group-hover:text-[#1a1a1a]" />
               <h3 className="font-serif text-4xl mb-4">Advisory Retainer</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed mb-8">
                  End-to-end strategic partner. We act as your temporary "Co-Founder" to navigate the entire ecosystem.
               </p>
               <Link href="/mentorship" className="inline-flex items-center gap-2 border-b border-current pb-1 font-bold uppercase tracking-widest text-xs">
                  View Mentorship <ArrowRight size={14}/>
               </Link>
            </div>

         </div>
      </section>


      {/* =========================================
          3. WHAT'S INCLUDED (Editorial List)
      ========================================= */}
      <section className="py-24 px-6 bg-[#F2F0E9]">
         <div className="container mx-auto max-w-5xl">
            <h2 className="font-serif text-5xl mb-16">Deliverables</h2>
            
            <div className="space-y-0 border-t border-[#1a1a1a]">
               {[
                  { title: "The Master Document", desc: "40+ page investor-grade business plan (PDF + Word)." },
                  { title: "Financial Engine", desc: "Dynamic Excel model with modifiable assumptions (Revenue, OpEx, CapEx)." },
                  { title: "Pitch Assets", desc: "15-slide presentation deck + 1-page executive summary teaser." },
                  { title: "Market Report", desc: "Detailed citation list and market validation data sources." },
                  { title: "Strategic Brief", desc: "Consultation notes on interview prep and Q&A defense strategy." }
               ].map((item, i) => (
                  <div key={i} className="group border-b border-[#1a1a1a] py-8 flex flex-col md:flex-row md:items-baseline justify-between hover:pl-4 transition-all duration-300 cursor-default">
                     <div className="flex items-baseline gap-6">
                        <span className="font-sans text-xs font-bold text-[#CCFF00] bg-[#1a1a1a] px-2 py-1">0{i+1}</span>
                        <h3 className="font-serif text-2xl md:text-3xl">{item.title}</h3>
                     </div>
                     <p className="mt-4 md:mt-0 font-sans text-sm text-[#1a1a1a]/60 max-w-sm text-right">
                        {item.desc}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          4. THE ANTI-PORTFOLIO (Boundaries)
      ========================================= */}
      <section className="py-24 px-6 bg-white border-y border-[#1a1a1a]/10">
         <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-start">
               
               <div className="md:w-1/3">
                  <div className="bg-[#1a1a1a] text-[#F2F0E9] p-8 inline-block">
                     <ShieldAlert className="w-12 h-12 text-[#CCFF00] mb-4" />
                     <h2 className="font-serif text-3xl mb-2">Scope Limits</h2>
                     <p className="font-sans text-xs uppercase tracking-widest opacity-60">What we do NOT do</p>
                  </div>
               </div>

               <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                     <h3 className="font-serif text-2xl mb-2 flex items-center gap-2">
                        <span className="text-[#1a1a1a]/20">01.</span> Legal Advice
                     </h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">
                        We are not attorneys. We do not provide legal counsel, interpretation of immigration law, or representation in court.
                     </p>
                  </div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2 flex items-center gap-2">
                        <span className="text-[#1a1a1a]/20">02.</span> Visa Guarantees
                     </h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">
                        No one can guarantee a government outcome. We guarantee the quality of the business documents, not the visa decision.
                     </p>
                  </div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2 flex items-center gap-2">
                        <span className="text-[#1a1a1a]/20">03.</span> Filing Forms
                     </h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">
                        We do not fill out government forms (IMM 0008, etc.). Your lawyer handles the bureaucratic submission.
                     </p>
                  </div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2 flex items-center gap-2">
                        <span className="text-[#1a1a1a]/20">04.</span> Finding Co-Founders
                     </h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">
                        We do not "matchmake" co-founders for the sole purpose of immigration. Your team must be organic and genuine.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          5. CTA
      ========================================= */}
      <section className="py-32 px-6 text-center">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl md:text-7xl mb-8">
               Build the foundation.
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
               Secure the expertise needed to turn your concept into a bankable business case.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
                  Request Proposal
               </Link>
               <Link href="/mentorship" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
                  Explore Mentorship
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}