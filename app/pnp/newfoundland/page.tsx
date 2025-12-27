// ============================================================================
// Page: app/pnp/newfoundland/page.tsx
// Style: Modernist Editorial (SVR Identity)
// Context: Newfoundland & Labrador (NLPNP) - International Entrepreneur
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Ship, 
  Map, 
  GraduationCap, 
  CheckCircle2, 
  Ban,
  Anchor,
  Wind
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newfoundland (NLPNP) | The Eastern Edge',
  description: 'International Entrepreneur & Graduate streams. Low competition, high quality of life on the Atlantic.',
};

export default function NewfoundlandPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE EASTERN EDGE
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Jurisdiction: NL</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12">
           EASTERN <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">EDGE.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 North America's oldest city. <br/>
                 An economy pivoting from oil to <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">tech & tourism.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 Newfoundland & Labrador offers a distinct advantage: <strong>Low Competition.</strong> 
                 While thousands fight for spots in Ontario, NLPNP actively seeks entrepreneurs to revitalize its aging demographic.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. INTERNATIONAL ENTREPRENEUR (Core)
      ========================================= */}
      <section className="py-24">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">International Entrepreneur</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg max-w-2xl">
               The flagship pathway for experienced business owners. 
               It follows the standard "Work Permit Performance" model.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 border border-[#1a1a1a]">
            
            {/* LEFT: FINANCIALS */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00] mb-2">Investment</span>
                     <h3 className="font-serif text-4xl">The Capital</h3>
                  </div>
                  <Ship className="w-12 h-12 text-[#CCFF00]" />
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Net Worth</span>
                     <span className="font-serif text-2xl">$600,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-2xl">$200,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Job Creation</span>
                     <span className="font-serif text-2xl">1 Full-time</span>
                  </div>
               </div>
            </div>

            {/* RIGHT: REQUIREMENTS */}
            <div className="p-12 bg-white text-[#1a1a1a] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Eligibility</span>
                     <h3 className="font-serif text-4xl">The Profile</h3>
                  </div>
                  <Anchor className="w-12 h-12 text-[#1a1a1a]" />
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Age Limit</span>
                     <span className="font-serif text-2xl">21 - 59 Years</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Language</span>
                     <span className="font-serif text-2xl">CLB 5</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-sm opacity-60">Experience</span>
                     <span className="font-serif text-2xl">2y Owner / 5y Mgr</span>
                  </div>
                  <p className="text-xs opacity-50 mt-4 leading-relaxed border-l-2 border-[#1a1a1a] pl-2">
                     <strong>EOI System:</strong> Candidates are ranked out of 120 points. An exploratory visit adds significant weight to your application.
                  </p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          3. INTERNATIONAL GRADUATE (Student Path)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="bg-[#CCFF00] p-12 md:p-16 relative overflow-hidden text-[#1a1a1a]">
             {/* Background Visual */}
             <div className="absolute top-0 right-0 w-64 h-64 border-[20px] border-[#1a1a1a]/10 rounded-full opacity-50 -mr-20 -mt-20"></div>
             
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 relative z-10">
                <div>
                   <span className="font-sans text-xs font-bold uppercase tracking-widest border border-[#1a1a1a] px-2 py-1 mb-2 inline-block">Student Route</span>
                   <h2 className="font-serif text-5xl">International Graduate Entrepreneur</h2>
                </div>
                <GraduationCap className="w-16 h-16 text-[#1a1a1a] mt-6 md:mt-0" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div>
                   <p className="font-sans text-lg font-bold mb-4 leading-snug">
                      Did you graduate from Memorial University (MUN) or College of the North Atlantic (CNA)?
                   </p>
                   <p className="font-sans text-sm opacity-80 leading-relaxed">
                      If yes, you have a golden ticket. This stream allows you to launch a business without the $600k Net Worth requirement. 
                      You must run the business for 1 year on your PGWP before applying for nomination.
                   </p>
                </div>
                <div className="bg-[#1a1a1a] text-[#F2F0E9] p-8">
                   <h4 className="font-serif text-2xl mb-4">Key Benefits</h4>
                   <ul className="space-y-3 font-sans text-sm">
                      <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-[#CCFF00]"/> No Minimum Investment Amount</li>
                      <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-[#CCFF00]"/> No Net Worth Requirement</li>
                      <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-[#CCFF00]"/> Direct path from PGWP to PR</li>
                   </ul>
                </div>
             </div>
         </div>
      </section>


      {/* =========================================
          4. INELIGIBLE BUSINESSES
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <h2 className="font-serif text-4xl mb-6">Restricted <br/> Models</h2>
               <div className="w-12 h-1 bg-[#1a1a1a] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  NLPNP targets active economic contribution. Passive or "convenience" businesses are strictly disqualified.
               </p>
            </div>

            <div className="lg:col-span-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                     "Remote Businesses (Must be local)",
                     "Bed & Breakfasts",
                     "Real Estate Development",
                     "Property Rental / Leasing",
                     "Taxi Companies",
                     "Pawnbrokers",
                     "Home-based Businesses",
                     "Laundromats (Coin-operated)",
                     "Payday Loan Agencies"
                  ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 border-b border-[#1a1a1a]/10 pb-4 group hover:pl-2 transition-all">
                        <Ban className="w-4 h-4 text-[#b91c1c] group-hover:scale-110 transition-transform" />
                        <span className="font-serif text-lg opacity-80">{item}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          5. THE EXPLORATORY VISIT
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10 bg-white">
         <div className="flex flex-col md:flex-row gap-16 items-center">
            
            <div className="md:w-1/2">
               <div className="border border-[#1a1a1a] p-10 relative">
                  <Map className="w-12 h-12 text-[#1a1a1a] mb-6" />
                  <h3 className="font-serif text-3xl mb-4">Boots on the Ground</h3>
                  <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed mb-6">
                     While not strictly "mandatory" for EOI submission, in practice, it is nearly impossible to be selected without an Exploratory Visit.
                  </p>
                  <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">
                     You must visit NL, meet with local suppliers, realtors, and economic officers, and submit a "Trip Report" with your application.
                  </p>
               </div>
            </div>

            <div className="md:w-1/2">
               <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2 block">Strategic Tip</span>
               <h2 className="font-serif text-4xl mb-6">"St. John's is not the only option."</h2>
               <p className="font-sans text-lg text-[#1a1a1a]/70 leading-relaxed mb-8">
                  The province looks favorably upon applicants willing to settle in secondary hubs like 
                  <span className="font-bold text-black"> Corner Brook</span>, 
                  <span className="font-bold text-black"> Gander</span>, or 
                  <span className="font-bold text-black"> Grand Falls-Windsor</span>. 
                  Competition is lower, and community support is higher.
               </p>
               <div className="flex items-center gap-2 text-[#CCFF00] bg-black px-4 py-2 w-fit">
                  <Wind className="w-4 h-4" />
                  <span className="font-bold text-sm uppercase">Energy Capital of the East</span>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 text-center border-t border-[#1a1a1a]/10">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            The Atlantic Calling.
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            Ready to explore opportunities in Canada's youngest province? 
            Let's assess your net worth and business compatibility.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               Start Assessment
            </Link>
            <Link href="/pnp" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               View Other Provinces
            </Link>
         </div>
      </section>

    </div>
  );
}