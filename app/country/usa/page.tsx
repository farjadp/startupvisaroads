// ============================================================================
// Page: app/usa/page.tsx
// Style: Modernist Editorial + "Star-Spangled Future" Theme
// Context: USA Country Profile & NIW/EB-1A/IEP Advisory
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Flag, 
  Rocket, 
  Cpu, 
  ShieldCheck, 
  Scale, 
  Landmark,
  Zap,
  Lock
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'USA | The National Interest',
  description: 'EB-2 NIW, EB-1A, and Entrepreneur Parole. Strategic immigration for founders serving American critical technologies.',
};

export default function USAPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE AMERICAN STANDARD
      ========================================= */}
      <section className="min-h-[85vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10 relative overflow-hidden">
        
        {/* Background Abstract (The Eagle's Wing - Abstract Lines) */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,#0A3161_20px,#0A3161_22px)] opacity-5 pointer-events-none translate-x-1/3 -translate-y-1/3 rounded-full mask-image-radial"></div>

        <div className="flex items-center gap-4 mb-8 relative z-10">
           <span className="w-3 h-3 bg-[#B31942] border border-[#1a1a1a]"></span> {/* Patriot Red */}
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Destination: United States</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12 relative z-10">
           NATIONAL <br/>
           <span className="pl-[10vw] italic text-[#0A3161]">INTEREST.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end relative z-10">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 The largest economy in history. <br/>
                 Open only to those who advance its <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">supremacy.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#B31942] pl-6">
                 Immigrating to the US is no longer about just "creating jobs". In 2025, the White House prioritizes <strong>Critical & Emerging Technologies</strong>. 
                 If your startup advances AI, Quantum Computing, or Clean Energy, the red carpet (EB-2 NIW) is rolled out. If not, the door is shut.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. MARKET METRICS (The Capitalist Engine)
      ========================================= */}
      <section className="py-24 border-b border-[#1a1a1a]/10">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">The Stakes</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg">
               High risk, infinite reward. The ecosystem that minted 60% of the world's unicorns.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#1a1a1a]/10">
            
            {/* Stat 1 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">VC Liquidity</span>
                  <DollarSignIcon className="w-6 h-6 text-[#0A3161]" />
               </div>
               <p className="font-serif text-5xl mb-2">$170B+</p>
               <p className="font-sans text-sm opacity-60">Annual venture capital deployed. More than the rest of the world combined.</p>
            </div>

            {/* Stat 2 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Consumer Market</span>
                  <Zap className="w-6 h-6 text-[#0A3161]" />
               </div>
               <p className="font-serif text-5xl mb-2">340M</p>
               <p className="font-sans text-sm opacity-60">High-income consumers. The ultimate test for product-market fit.</p>
            </div>

            {/* Stat 3 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Exit Potential</span>
                  <Landmark className="w-6 h-6 text-[#0A3161]" />
               </div>
               <p className="font-serif text-5xl mb-2">NASDAQ</p>
               <p className="font-sans text-sm opacity-60">The primary goal. 85% of tech exits happen via US acquisition or IPO.</p>
            </div>

         </div>
      </section>


      {/* =========================================
          3. THE TRINITY: NIW, EB1A, IEP
      ========================================= */}
      <section className="py-24">
         <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-5xl mb-6">The Founder's Stack</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg">
               Three distinct legal instruments to penetrate the US market. 
               Select based on your current traction.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. EB-2 NIW (The Strategic Choice) */}
            <div className="bg-[#0A3161] text-[#F2F0E9] p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#B31942] rounded-bl-full opacity-20"></div>
               <Flag className="w-10 h-10 text-[#B31942] mb-6" />
               <h3 className="font-serif text-3xl mb-2">EB-2 NIW</h3>
               <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-6">National Interest Waiver</p>
               
               <p className="font-sans text-sm leading-relaxed mb-8 opacity-80">
                  The most versatile Green Card route. You waive the need for a specific job offer by proving your work is of "National Importance". 
                  Ideal for STEM founders and experts.
               </p>
               
               <ul className="space-y-3 font-sans text-xs mb-8 text-[#F2F0E9]/60">
                  <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-[#B31942]"/> Self-Petition (No Employer)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-[#B31942]"/> Premium Processing (45 Days)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-[#B31942]"/> Direct Green Card</li>
               </ul>

               <Link href="/usa/eb2-niw" className="inline-block border-b border-[#B31942] pb-1 text-[#B31942] text-xs font-bold uppercase tracking-widest">
                  Check STEM Eligibility
               </Link>
            </div>

            {/* 2. EB-1A (The Elite Choice) */}
            <div className="border border-[#1a1a1a]/10 bg-white p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
               <Crown className="w-10 h-10 text-[#1a1a1a] mb-6" />
               <h3 className="font-serif text-3xl mb-2">EB-1A</h3>
               <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6">Extraordinary Ability</p>
               
               <p className="font-sans text-sm leading-relaxed mb-8 text-[#1a1a1a]/70">
                  Reserved for the top 1%. You must prove sustained national or international acclaim. 
                  This is the "Einstein Visa". No backlog for most countries.
               </p>

               <ul className="space-y-3 font-sans text-xs mb-8 text-[#1a1a1a]/50">
                  <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-[#1a1a1a]"/> Current Priority Date</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-[#1a1a1a]"/> Premium Processing (15 Days)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-[#1a1a1a]"/> Requires 3/10 Criteria</li>
               </ul>

               <Link href="/usa/eb1" className="inline-block border-b border-[#1a1a1a] pb-1 text-[#1a1a1a] text-xs font-bold uppercase tracking-widest">
                  Audit Profile
               </Link>
            </div>

            {/* 3. IEP (The Investor Choice) */}
            <div className="bg-[#F2F0E9] border border-[#1a1a1a]/10 p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
               <div className="absolute inset-0 bg-[#B31942]/5"></div>
               <Rocket className="w-10 h-10 text-[#B31942] mb-6 relative z-10" />
               <h3 className="font-serif text-3xl mb-2 text-[#0A3161] relative z-10">Entrepreneur Parole</h3>
               <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 relative z-10 text-[#0A3161]">IEP (Program)</p>
               
               <p className="font-sans text-sm leading-relaxed mb-8 text-[#0A3161]/70 relative z-10">
                  Not a visa, but a "Parole" status. Designed for founders who have raised significant capital ($311k+) from qualified US investors 
                  but don't yet qualify for O-1 or EB-1.
               </p>

               <ul className="space-y-3 font-sans text-xs mb-8 text-[#0A3161]/50 relative z-10">
                  <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-[#B31942]"/> No Degree Required</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-[#B31942]"/> Fast Entry (Parole Status)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-[#B31942]"/> Spousal Work Permit</li>
               </ul>

               <Link href="/contact" className="relative z-10 inline-block border-b border-[#0A3161] pb-1 text-[#0A3161] text-xs font-bold uppercase tracking-widest">
                  View Investment Thresholds
               </Link>
            </div>

         </div>
      </section>


      {/* =========================================
          4. STRATEGIC SECTORS (USCIS Focus)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <h2 className="font-serif text-4xl mb-6">Critical <br/> Tech</h2>
               <div className="w-12 h-1 bg-[#B31942] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  The White House has issued a directive to attract talent in these specific fields. 
                  Aligning your narrative with this list is the key to NIW approval.
               </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="border border-[#1a1a1a]/10 p-6 flex gap-4 items-start bg-white">
                  <Cpu className="w-8 h-8 text-[#0A3161]" />
                  <div>
                     <h4 className="font-bold mb-2">Artificial Intelligence</h4>
                     <p className="text-xs opacity-60">Machine Learning, NLP, Computer Vision, Generative AI.</p>
                  </div>
               </div>
               <div className="border border-[#1a1a1a]/10 p-6 flex gap-4 items-start bg-white">
                  <ShieldCheck className="w-8 h-8 text-[#0A3161]" />
                  <div>
                     <h4 className="font-bold mb-2">Cybersecurity</h4>
                     <p className="text-xs opacity-60">Zero Trust Architecture, Quantum Encryption, Defense Tech.</p>
                  </div>
               </div>
               <div className="border border-[#1a1a1a]/10 p-6 flex gap-4 items-start bg-white">
                  <Zap className="w-8 h-8 text-[#0A3161]" />
                  <div>
                     <h4 className="font-bold mb-2">Clean Energy</h4>
                     <p className="text-xs opacity-60">Battery Storage, EV Infrastructure, Carbon Capture, Fusion.</p>
                  </div>
               </div>
               <div className="border border-[#1a1a1a]/10 p-6 flex gap-4 items-start bg-white">
                  <Scale className="w-8 h-8 text-[#0A3161]" />
                  <div>
                     <h4 className="font-bold mb-2">Biotech & Pharma</h4>
                     <p className="text-xs opacity-60">mRNA, Gene Therapy, Synthetic Biology, Pandemic Preparedness.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          5. THE REALITY CHECK (Political Risk)
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/3 text-center md:text-left">
               <Lock className="w-16 h-16 text-[#B31942] mb-6 mx-auto md:mx-0" />
               <h2 className="font-serif text-4xl mb-4">Political Volatility</h2>
               <p className="font-sans text-sm opacity-60">
                  US immigration is subject to Executive Orders. The landscape changes with every administration.
               </p>
            </div>
            
            <div className="md:w-2/3 border-l border-[#F2F0E9]/20 pl-8 md:pl-16 space-y-8">
               <div>
                  <h4 className="font-bold text-xl mb-2 text-[#F2F0E9]">The "Hire American" Doctrine</h4>
                  <p className="text-sm opacity-60 leading-relaxed">
                     Regardless of who is in power, the trend is towards stricter scrutiny of H-1B visas. 
                     This makes the <strong>NIW (Self-Petition)</strong> the safest harbor, as it does not depend on an employer's mood or policy shifts.
                  </p>
               </div>
               <div>
                  <h4 className="font-bold text-xl mb-2 text-[#F2F0E9]">2026 Outlook</h4>
                  <p className="text-sm opacity-60 leading-relaxed">
                     We anticipate higher evidentiary standards for "National Importance". 
                     General business arguments (e.g., "I will create 5 jobs") are no longer sufficient. 
                     You must prove "Broader Implications" for the US industry as a whole.
                  </p>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 text-center border-t border-[#1a1a1a]/10">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            The American Dream <br/>
            <span className="italic text-[#0A3161]">Re-Engineered.</span>
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            Do not leave your status to chance. We build "Audit-Proof" petitions 
            that align your work with the strategic interests of the United States.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#0A3161] text-white px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#B31942] transition-colors">
               Start NIW Assessment
            </Link>
            <Link href="/" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Compare Jurisdictions
            </Link>
         </div>
      </section>

    </div>
  );
}

// Icon helper
function DollarSignIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function Crown({ className }: { className?: string }) {
   return (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
   )
}

function CheckCircle2({ className }: { className?: string }) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
   )
}