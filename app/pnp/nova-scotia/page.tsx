// ============================================================================
// Page: app/pnp/nova-scotia/page.tsx
// Style: Modernist Editorial (SVR Identity)
// Context: Nova Scotia Nominee Program (NSNP) - Entrepreneur & Graduate
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Anchor, 
  GraduationCap, 
  MapPin, 
  Ban, 
  Compass,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nova Scotia (NSNP) | The Atlantic Strategy',
  description: 'Business immigration for Halifax and coastal communities. Entrepreneur & Graduate streams.',
};

export default function NovaScotiaPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: ATLANTIC STRATEGY
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Jurisdiction: Nova Scotia</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12">
           ATLANTIC <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">STRATEGY.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 The Ocean Playground. <br/>
                 Where lower capital meets <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">higher quality of life.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 Nova Scotia is the gateway to the Atlantic. Its Provincial Nominee Program (NSNP) is aggressive in attracting talent to offset an aging population. 
                 It offers one of the lowest investment thresholds in Canada for businesses outside Halifax.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. THE TWO PATHWAYS (General vs Graduate)
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#1a1a1a]">
            
            {/* LEFT: ENTREPRENEUR STREAM */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-500 group">
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <span className="font-sans text-xs font-bold uppercase tracking-widest bg-[#CCFF00] text-[#1a1a1a] px-2 py-1 mb-2 inline-block">Primary Route</span>
                     <h3 className="font-serif text-4xl mt-2">Entrepreneur</h3>
                  </div>
                  <Compass className="w-10 h-10 group-hover:text-[#CCFF00] transition-colors" />
               </div>
               
               <p className="font-sans text-sm opacity-70 mb-8 leading-relaxed">
                  For experienced business owners and senior managers. 
                  You must start or buy a business and actively manage it for 1 year before nomination.
               </p>

               <ul className="space-y-4 font-sans text-sm">
                  <li className="flex justify-between border-b border-current/20 pb-2">
                     <span>Experience</span>
                     <span className="font-bold">3 Years Owner / 5 Years Mgr</span>
                  </li>
                  <li className="flex justify-between border-b border-current/20 pb-2">
                     <span>Ownership</span>
                     <span className="font-bold">Min 33.33%</span>
                  </li>
                  <li className="flex justify-between border-b border-current/20 pb-2">
                     <span>Status</span>
                     <span className="font-bold">Work Permit First</span>
                  </li>
               </ul>
            </div>

            {/* RIGHT: INTERNATIONAL GRADUATE */}
            <div className="p-12 bg-[#1a1a1a] text-[#F2F0E9] relative overflow-hidden">
               {/* Decorative Circle */}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 border-2 border-[#CCFF00] rounded-full opacity-20"></div>
               
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <span className="font-sans text-xs font-bold uppercase tracking-widest border border-[#F2F0E9] px-2 py-1 mb-2 inline-block">Student Route</span>
                     <h3 className="font-serif text-4xl mt-2 text-[#CCFF00]">Graduate Entrepreneur</h3>
                  </div>
                  <GraduationCap className="w-10 h-10 text-[#CCFF00]" />
               </div>

               <p className="font-sans text-sm opacity-70 mb-8 leading-relaxed">
                  Exclusive to graduates of NS universities (Dalhousie, Saint Mary's, NSCC). 
                  If you start a business post-graduation, you can bypass the Net Worth requirement entirely.
               </p>

               <div className="bg-[#F2F0E9] text-[#1a1a1a] p-6">
                  <div className="flex items-center gap-4 mb-2">
                     <DollarSign className="w-5 h-5" />
                     <span className="font-bold text-lg">NO Minimum Investment</span>
                  </div>
                  <p className="text-xs opacity-60">You just need to prove the business is viable and pays you a salary.</p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          3. THE HALIFAX SPLIT (HRM vs Rural)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <h2 className="font-serif text-4xl mb-6">The Halifax <br/> Divide</h2>
               <div className="w-12 h-1 bg-[#CCFF00] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  Like Ontario, Nova Scotia incentivizes investment outside its capital. 
                  Leaving Halifax Regional Municipality (HRM) lowers your entry cost significantly.
               </p>
            </div>

            <div className="lg:col-span-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* INSIDE HRM */}
                  <div className="border border-[#1a1a1a]/20 p-8 flex flex-col items-center text-center hover:border-[#1a1a1a] transition-colors">
                     <MapPin className="w-8 h-8 mb-4 text-[#1a1a1a]" />
                     <h4 className="font-serif text-2xl mb-2">Inside HRM</h4>
                     <p className="text-xs uppercase tracking-widest opacity-50 mb-6">Halifax, Dartmouth, Bedford</p>
                     
                     <div className="w-full space-y-4">
                        <div className="bg-[#1a1a1a] text-white py-3 px-6">
                           <span className="block text-xs opacity-60 uppercase">Net Worth</span>
                           <span className="font-serif text-xl">$600,000 CAD</span>
                        </div>
                        <div className="bg-[#F2F0E9] border border-[#1a1a1a] py-3 px-6">
                           <span className="block text-xs opacity-60 uppercase">Investment</span>
                           <span className="font-serif text-xl">$150,000 CAD</span>
                        </div>
                     </div>
                  </div>

                  {/* OUTSIDE HRM */}
                  <div className="border border-[#1a1a1a]/20 p-8 flex flex-col items-center text-center hover:border-[#CCFF00] transition-colors relative overflow-hidden">
                     <div className="absolute top-0 right-0 bg-[#CCFF00] text-[#1a1a1a] text-[10px] font-bold px-2 py-1 uppercase">Best Value</div>
                     <Anchor className="w-8 h-8 mb-4 text-[#1a1a1a]" />
                     <h4 className="font-serif text-2xl mb-2">Outside HRM</h4>
                     <p className="text-xs uppercase tracking-widest opacity-50 mb-6">Sydney, Truro, Wolfville</p>
                     
                     <div className="w-full space-y-4">
                        <div className="bg-[#1a1a1a] text-white py-3 px-6">
                           <span className="block text-xs opacity-60 uppercase">Net Worth</span>
                           <span className="font-serif text-xl">$400,000 CAD</span>
                        </div>
                        <div className="bg-[#CCFF00] text-[#1a1a1a] py-3 px-6">
                           <span className="block text-xs opacity-60 uppercase">Investment</span>
                           <span className="font-serif text-xl">$100,000 CAD</span>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          4. THE "RED ZONE" (Ineligible Businesses)
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <h2 className="font-serif text-4xl text-[#CCFF00]">Restricted Sectors</h2>
               <p className="font-sans text-sm opacity-60 max-w-md text-right">
                  NSNP is strict. The following business models are automatically disqualified 
                  as they do not provide "significant economic benefit".
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
               {[
                  "Remote Businesses (Must be physical)",
                  "Property Rental / Investment",
                  "Real Estate Development (Passive)",
                  "Payday Loan / Cheque Cashing",
                  "Pawnbrokers",
                  "Home-Based Businesses",
                  "Co-operatives",
                  "Passive Investment Income"
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-[#F2F0E9]/20 pb-4 group">
                     <Ban className="w-5 h-5 text-[#b91c1c] group-hover:scale-110 transition-transform" />
                     <span className="font-sans text-lg opacity-80 group-hover:opacity-100 transition-opacity">{item}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          5. POINTS & EOI
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="flex flex-col md:flex-row gap-12 items-center">
            
            <div className="md:w-1/2">
               <div className="bg-white border border-[#1a1a1a] p-12 shadow-[10px_10px_0px_0px_rgba(26,26,26,1)]">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4 block">The Score</span>
                  <h3 className="font-serif text-6xl mb-4">67 / 100</h3>
                  <p className="font-sans text-sm opacity-70 mb-8">
                     Minimum eligibility score. However, meeting this does not guarantee an invitation. 
                     You are ranked against other candidates in the pool.
                  </p>
                  <div className="h-2 w-full bg-[#1a1a1a]/10 rounded-full overflow-hidden">
                     <div className="h-full bg-[#CCFF00] w-[67%]"></div>
                  </div>
               </div>
            </div>

            <div className="md:w-1/2">
               <h2 className="font-serif text-4xl mb-6">Invitation Only</h2>
               <p className="font-sans text-lg text-[#1a1a1a]/70 leading-relaxed mb-8">
                  Nova Scotia does not accept direct applications. You must submit an Expression of Interest (EOI). 
                  Draws happen periodically based on the province's economic needs.
               </p>
               <ul className="space-y-4 font-sans text-sm">
                  <li className="flex items-center gap-3">
                     <TrendingUp className="w-5 h-5 text-[#CCFF00]" />
                     <span>Priority given to Export-oriented businesses</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <TrendingUp className="w-5 h-5 text-[#CCFF00]" />
                     <span>High points for Business Succession (buying existing)</span>
                  </li>
               </ul>
            </div>

         </div>
      </section>


      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 text-center">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Chart your course.
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            Whether you are targeting Halifax or the scenic Annapolis Valley, 
            we structure your entry to maximize your EOI score.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               Calculate NSNP Score
            </Link>
            <Link href="/pnp" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               View Other Provinces
            </Link>
         </div>
      </section>

    </div>
  );
}