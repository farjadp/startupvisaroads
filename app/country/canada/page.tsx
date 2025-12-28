// ============================================================================
// Page: app/canada/page.tsx
// Style: Modernist Editorial + "Northern Red" Theme
// Context: Canada Country Profile & Strategic Pivot (Post-2025 Changes)
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Leaf, 
  TrendingUp, 
  Building2, 
  Code2, 
  ShieldAlert, 
  Briefcase,
  Zap,
  Globe
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Canada | The Northern HQ',
  description: 'Strategic entry into the North American market. SUV, ICT, and C11 pathways for 2026.',
};

export default function CanadaPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE NORTH HAS CHANGED
      ========================================= */}
      <section className="min-h-[85vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10 relative overflow-hidden">
        
        {/* Background Abstract (The Maple) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D80027] rounded-full blur-[150px] opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

        <div className="flex items-center gap-4 mb-8 relative z-10">
           <span className="w-3 h-3 bg-[#D80027] border border-[#1a1a1a]"></span> {/* Canadian Red */}
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Destination: Canada</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12 relative z-10">
           TRUE <br/>
           <span className="pl-[10vw] italic text-[#D80027]">NORTH.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end relative z-10">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 #3 Global Tech Hub. <br/>
                 The gateway to <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">North America.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#D80027] pl-6">
                 Canada remains the primary destination for founders scaling into the US market. 
                 However, the landscape has shifted. With tighter caps on the Start-Up Visa in late 2025, 
                 smart founders are pivoting to <strong>Operational Visas (ICT & C11)</strong> to secure their foothold.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. MARKET INTEL (Toronto & Waterloo)
      ========================================= */}
      <section className="py-24 border-b border-[#1a1a1a]/10">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">Ecosystem Data</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg">
               Why Canada? It's not just about the passport. It's about the talent density.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#1a1a1a]/10">
            
            {/* Stat 1 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Tech Ranking</span>
                  <Code2 className="w-6 h-6 text-[#D80027]" />
               </div>
               <p className="font-serif text-5xl mb-2">#3</p>
               <p className="font-sans text-sm opacity-60">Toronto is the 3rd largest tech hub in North America, trailing only Silicon Valley and NYC.</p>
            </div>

            {/* Stat 2 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">AI Leadership</span>
                  <Zap className="w-6 h-6 text-[#D80027]" />
               </div>
               <p className="font-serif text-5xl mb-2">Godfathers</p>
               <p className="font-sans text-sm opacity-60">Home to Hinton & Bengio. Montreal and Toronto have the highest concentration of AI researchers per capita.</p>
            </div>

            {/* Stat 3 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Market Access</span>
                  <Globe className="w-6 h-6 text-[#D80027]" />
               </div>
               <p className="font-serif text-5xl mb-2">USMCA</p>
               <p className="font-sans text-sm opacity-60">Duty-free access to the US market. Launch in Toronto, sell in New York.</p>
            </div>

         </div>
      </section>


      {/* =========================================
          3. THE PATHWAYS (The Pivot)
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#1a1a1a]">
            
            {/* LEFT: THE LEGACY (SUV) */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#F2F0E9] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest mb-2 text-[#1a1a1a]/40">Permanent Residency</span>
                     <h3 className="font-serif text-4xl mb-2">Start-Up Visa</h3>
                     <span className="text-xs font-bold uppercase tracking-widest text-[#D80027] bg-[#D80027]/10 px-2 py-1 w-fit">Capped / Waitlist</span>
                  </div>
                  <Leaf className="w-12 h-12 text-[#1a1a1a]/20" />
               </div>

               <p className="font-sans text-sm opacity-70 mb-8 leading-relaxed">
                  The direct PR route. Due to high demand, processing times have increased (30+ months). 
                  We now reserve this for clients with <strong>significant traction</strong> or those willing to wait for the 2026 allocation.
               </p>

               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40">
                  <span className="w-2 h-2 bg-[#1a1a1a] rounded-full"></span>
                  Wait time: 2-3 Years
               </div>
            </div>

            {/* RIGHT: THE PIVOT (ICT / C11) */}
            <div className="p-12 bg-[#1a1a1a] text-[#F2F0E9] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-[#D80027] rounded-bl-full opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                     <div className="flex flex-col">
                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#D80027] mb-2">High Velocity</span>
                        <h3 className="font-serif text-4xl mb-2">ICT & C11</h3>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Operational Work Permits</span>
                     </div>
                     <Briefcase className="w-12 h-12 text-[#D80027]" />
                  </div>

                  <p className="font-sans text-sm opacity-80 mb-8 leading-relaxed">
                     The strategic alternative. Launch your Canadian branch and transfer yourself as an Executive (ICT) or Significant Benefit Entrepreneur (C11). 
                     <strong>Land in 3-6 months.</strong> Convert to PR later via Express Entry (additional points for Canadian job).
                  </p>
                  
                  <ul className="space-y-3 font-sans text-sm">
                     <li className="flex gap-3"><ArrowRight className="w-4 h-4 text-[#D80027]"/> No Letter of Support needed.</li>
                     <li className="flex gap-3"><ArrowRight className="w-4 h-4 text-[#D80027]"/> Full control of your equity (100% ownership).</li>
                     <li className="flex gap-3"><ArrowRight className="w-4 h-4 text-[#D80027]"/> Immediate work authorization for spouse.</li>
                  </ul>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          4. THE WARNING (Reality Check)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="bg-[#D80027]/5 border border-[#D80027] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-[#D80027] text-white p-4 rounded-full shrink-0">
               <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
               <h3 className="font-serif text-3xl mb-4 text-[#D80027]">"No More Passive Income."</h3>
               <p className="font-sans text-[#1a1a1a]/70 text-lg leading-relaxed mb-6">
                  Canada has cracked down on "Paper Businesses". Whether you choose SUV or ICT, 
                  you must have a physical office, active Canadian employees, and real revenue generation. 
                  Virtual offices and passive holding companies are automatically rejected.
               </p>
               <p className="font-sans text-xs font-bold uppercase tracking-widest">
                  Our service includes: Commercial Lease Negotiation & Canadian Hiring Strategy.
               </p>
            </div>
         </div>
      </section>


      {/* =========================================
          5. THE REGIONS (Toronto vs Others)
      ========================================= */}
      <section className="py-24">
         <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <h2 className="font-serif text-4xl text-[#1a1a1a]">Select HQ</h2>
               <p className="font-sans text-sm opacity-60 max-w-md text-right">
                  Most founders default to Toronto, but cost-efficiency lies elsewhere.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="border border-[#1a1a1a]/20 p-8 hover:border-[#1a1a1a] transition-colors">
                  <h3 className="font-serif text-2xl mb-2">Toronto (GTA)</h3>
                  <span className="text-xs font-bold uppercase bg-[#1a1a1a] text-white px-2 py-1 mb-4 inline-block">Finance & SaaS</span>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     Highest cost, highest density. Essential for Fintech and Enterprise SaaS. Access to 6M+ population.
                  </p>
               </div>
               <div className="border border-[#1a1a1a]/20 p-8 hover:border-[#1a1a1a] transition-colors">
                  <h3 className="font-serif text-2xl mb-2">Waterloo</h3>
                  <span className="text-xs font-bold uppercase bg-[#1a1a1a] text-white px-2 py-1 mb-4 inline-block">Deep Tech</span>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     "The Quantum Valley". Home to Google HQ Canada and top engineering talent from UWaterloo. Lower rent than Toronto.
                  </p>
               </div>
               <div className="border border-[#1a1a1a]/20 p-8 hover:border-[#1a1a1a] transition-colors">
                  <h3 className="font-serif text-2xl mb-2">Calgary</h3>
                  <span className="text-xs font-bold uppercase bg-[#1a1a1a] text-white px-2 py-1 mb-4 inline-block">Energy & CleanTech</span>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     Highest GDP per capita. Aggressive provincial incentives for tech. Low corporate tax.
                  </p>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          6. SVR STRATEGY
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
               <h2 className="font-serif text-5xl mb-6">The Architect's <br/> Approach</h2>
               <div className="w-24 h-1 bg-[#D80027] mb-8"></div>
               <p className="font-sans text-lg opacity-70 leading-relaxed">
                  We don't just file forms. We build the <strong>Canadian Narrative</strong>. 
                  We structure your company as a "Significant Benefit" to Canada's economy, ensuring your work permit approval.
               </p>
            </div>
            <div className="md:w-1/2 space-y-6 font-sans">
               <div className="flex gap-4 items-start">
                  <span className="font-bold text-[#D80027] text-xl">01</span>
                  <p>Incorporation & Shareholder Agreement Structuring (Canadian vs Foreign entity).</p>
               </div>
               <div className="flex gap-4 items-start">
                  <span className="font-bold text-[#D80027] text-xl">02</span>
                  <p>Business Plan focused on "Knowledge Transfer" and "Job Creation".</p>
               </div>
               <div className="flex gap-4 items-start">
                  <span className="font-bold text-[#D80027] text-xl">03</span>
                  <p>Interview Prep for border officers (Point of Entry strategy).</p>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          7. CTA
      ========================================= */}
      <section className="py-32 text-center border-t border-[#1a1a1a]/10">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Northbound.
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            The market is open, but the doors are narrower. 
            Secure your strategy before the 2026 pilot changes everything.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#D80027] text-white px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors">
               Audit for Canada
            </Link>
            <Link href="/startup-visa-canada" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               View SUV Details
            </Link>
         </div>
      </section>

    </div>
  );
}