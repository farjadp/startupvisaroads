// ============================================================================
// Page: app/pnp/manitoba/page.tsx
// Style: Modernist Editorial (SVR Identity)
// Context: Manitoba Provincial Nominee Program (MPNP) - BIS Stream
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Building2, 
  Tractor, 
  FileSignature, 
  AlertTriangle,
  Scale,
  Wheat
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manitoba (MPNP) | The Keystone Pathway',
  description: 'Business Investor Stream (BIS) for Winnipeg and rural Manitoba. Entrepreneur & Farm pathways.',
};

export default function ManitobaPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE KEYSTONE PROVINCE
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Jurisdiction: Manitoba</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12">
           THE CENTRAL <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">KEYSTONE.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 The heart of the continent. <br/>
                 Diverse economy, <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">agri-business giant.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 The Manitoba Provincial Nominee Program (MPNP) was the first of its kind in Canada. 
                 Its <strong>Business Investor Stream (BIS)</strong> is ruthlessly efficient, offering distinct pathways for urban entrepreneurs and rural farmers.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. ENTREPRENEUR PATHWAY: THE CAPITAL SPLIT
      ========================================= */}
      <section className="py-24">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">Entrepreneur Pathway</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg max-w-2xl">
               Manitoba incentivizes investment outside the perimeter highway. 
               The cost of entry drops significantly once you leave the capital.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 border border-[#1a1a1a]">
            
            {/* ZONE A: CAPITAL REGION (WINNIPEG) */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00] mb-2">Urban Center</span>
                     <h3 className="font-serif text-4xl">Winnipeg</h3>
                     <span className="text-xs opacity-50 mt-1">Capital Region</span>
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
                     <span className="font-serif text-2xl">$250,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Ownership</span>
                     <span className="font-serif text-2xl">33.3%</span>
                  </div>
                  <p className="text-xs opacity-50 mt-4 leading-relaxed">
                     Must create at least <strong>1 full-time job</strong> for a Canadian citizen or permanent resident.
                  </p>
               </div>
            </div>

            {/* ZONE B: RURAL MANITOBA */}
            <div className="p-12 bg-white text-[#1a1a1a] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Regional Growth</span>
                     <h3 className="font-serif text-4xl">Rural Manitoba</h3>
                     <span className="text-xs opacity-50 mt-1">Brandon, Steinbach, Thompson, etc.</span>
                  </div>
                  <Wheat className="w-12 h-12 text-[#1a1a1a]" />
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Net Worth</span>
                     <span className="font-serif text-2xl">$500,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-2xl text-[#CCFF00] bg-black px-2">$150,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Ownership</span>
                     <span className="font-serif text-2xl">33.3%</span>
                  </div>
                  <p className="text-xs opacity-50 mt-4 leading-relaxed">
                     Job creation is <strong>not required</strong> if the investment is strictly managed by the applicant, though recommended for higher EOI points.
                  </p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          3. FARM INVESTOR PATHWAY
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="bg-[#1a1a1a] text-[#F2F0E9] p-12 md:p-16 relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCFF00] opacity-5 rounded-bl-[100%] pointer-events-none"></div>
             
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 relative z-10">
                <div>
                   <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00] mb-2 block">Specialized Stream</span>
                   <h2 className="font-serif text-5xl">Farm Investor Pathway</h2>
                </div>
                <Tractor className="w-16 h-16 text-[#CCFF00] mt-6 md:mt-0" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                <div>
                   <h4 className="font-serif text-2xl mb-4 border-b border-[#CCFF00] pb-2 inline-block">The Profile</h4>
                   <p className="font-sans text-sm opacity-70 leading-relaxed">
                      Strictly for individuals with proven farm ownership and operation experience. 
                      You must produce primary products (crops/livestock). Hobby farms do not qualify.
                   </p>
                </div>
                <div>
                   <h4 className="font-serif text-2xl mb-4 border-b border-[#CCFF00] pb-2 inline-block">The Investment</h4>
                   <p className="font-sans text-sm opacity-70 leading-relaxed">
                      Minimum <strong>$300,000 CAD</strong> investment. <br/>
                      Minimum <strong>$500,000 CAD</strong> net worth. <br/>
                      Must reside on the farm in rural Manitoba.
                   </p>
                </div>
                <div>
                   <h4 className="font-serif text-2xl mb-4 border-b border-[#CCFF00] pb-2 inline-block">The Output</h4>
                   <p className="font-sans text-sm opacity-70 leading-relaxed">
                      You are not just buying land; you are buying a business. 
                      A comprehensive Farm Business Plan is mandatory.
                   </p>
                </div>
             </div>
         </div>
      </section>


      {/* =========================================
          4. THE PROTOCOL: BPA (The Contract)
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-4">
               <h2 className="font-serif text-5xl mb-6">The <br/> Contract</h2>
               <div className="w-12 h-1 bg-[#CCFF00] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  Manitoba uses a "Business Performance Agreement" (BPA). 
                  It is a legally binding document between you and the government.
               </p>
            </div>

            <div className="lg:col-span-8 space-y-8">
               
               <div className="flex gap-6 border-b border-[#1a1a1a]/10 pb-8">
                  <div className="bg-[#1a1a1a] text-[#CCFF00] w-12 h-12 flex items-center justify-center font-bold shrink-0">01</div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2">LAA (Letter of Advice to Apply)</h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/70">
                        After submitting your EOI, high-ranking candidates receive an LAA. 
                        This is your invitation to submit a full application and pay the $2,500 CAD fee.
                     </p>
                  </div>
               </div>

               <div className="flex gap-6 border-b border-[#1a1a1a]/10 pb-8">
                  <div className="bg-[#1a1a1a] text-[#CCFF00] w-12 h-12 flex items-center justify-center font-bold shrink-0">02</div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2">Signing the BPA</h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/70">
                        Before arriving, you sign the BPA. This details exactly how much you will invest and how many jobs you will create. 
                        This document dictates your future nomination.
                     </p>
                  </div>
               </div>

               <div className="flex gap-6 border-b border-[#1a1a1a]/10 pb-8">
                  <div className="bg-[#1a1a1a] text-[#CCFF00] w-12 h-12 flex items-center justify-center font-bold shrink-0">03</div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2">Work Permit Arrival</h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/70">
                        You arrive on a T-24 work permit. You are monitored. You have 24 months to fulfill the promises made in your BPA.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          5. RESTRICTED BUSINESSES
      ========================================= */}
      <section className="py-24 bg-[#F2F0E9] border-t border-[#1a1a1a]/10">
         <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
               <div className="bg-white border border-[#1a1a1a] p-8">
                  <AlertTriangle className="w-10 h-10 text-[#b91c1c] mb-4" />
                  <h3 className="font-serif text-3xl mb-4">Ineligible</h3>
                  <p className="font-sans text-sm opacity-60">
                     Manitoba rejects passive investment models. The following are strictly prohibited under the BIS.
                  </p>
               </div>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
               {[
                  "Home-based Businesses (Unless adding significant value)",
                  "Payday Loan / Cheque Cashing",
                  "Passive Real Estate Investment",
                  "Business Brokerage",
                  "Small Professional Practices",
                  "Coin-operated Laundromats",
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-[#1a1a1a]/10 pb-4">
                     <span className="w-1.5 h-1.5 bg-[#b91c1c] rounded-full"></span>
                     <span className="font-serif text-lg text-[#1a1a1a]">{item}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 text-center">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Winnipeg or Rural?
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            The Adaptability Matrix grants points for connections to Manitoba. 
            Let's calculate your EOI score for the Keystone province.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               Calculate MPNP Score
            </Link>
            <Link href="/pnp" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Compare Other Provinces
            </Link>
         </div>
      </section>

    </div>
  );
}