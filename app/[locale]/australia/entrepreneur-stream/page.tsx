// ============================================================================
// Page: app/australia/entrepreneur-stream/page.tsx
// Style: Modernist Editorial (SVR Identity)
// Context: Australia National Innovation Visa (NIV) - Replaces Subclass 188
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Globe, 
  Zap, 
  Rocket, 
  AlertTriangle, 
  CheckCircle2,
  Anchor,
  TrendingUp
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Australia NIV | The National Innovation Visa',
  description: 'The new Subclass 858. Direct Permanent Residency for high-performing entrepreneurs. Replaces the legacy 188 stream.',
};

export default function AustraliaPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE SOUTHERN SHIFT
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Jurisdiction: Australia</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12">
           SOUTHERN <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">SHIFT.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 The 188 Era is over. <br/>
                 Welcome to the <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">National Innovation Visa.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 As of late 2024, Australia abolished the provisional Business Innovation (188) streams. 
                 They have been replaced by the <strong>National Innovation Visa (NIV)</strong>—a direct permanent residency pathway designed to compete with the UK's Global Talent and US O-1.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. THE PARADIGM SHIFT (188 vs NIV)
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#1a1a1a]">
            
            {/* LEFT: THE OLD WAY (Legacy) */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#F2F0E9] text-[#1a1a1a]/40 group cursor-not-allowed">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest mb-2 line-through">Legacy Stream</span>
                     <h3 className="font-serif text-4xl line-through decoration-2 decoration-[#b91c1c]">Subclass 188E</h3>
                     <span className="text-xs mt-2 text-[#b91c1c] font-bold uppercase tracking-widest">Discontinued July 2024</span>
                  </div>
                  <AlertTriangle className="w-12 h-12 text-[#b91c1c]" />
               </div>

               <ul className="space-y-4 font-sans text-sm">
                  <li className="flex justify-between border-b border-current pb-2">
                     <span>Status</span>
                     <span>Provisional (Temp)</span>
                  </li>
                  <li className="flex justify-between border-b border-current pb-2">
                     <span>Funding</span>
                     <span>$200k Required</span>
                  </li>
                  <li className="flex justify-between border-b border-current pb-2">
                     <span>PR Path</span>
                     <span>Wait 3-4 Years</span>
                  </li>
               </ul>
            </div>

            {/* RIGHT: THE NEW STANDARD (NIV) */}
            <div className="p-12 bg-[#1a1a1a] text-[#F2F0E9] relative overflow-hidden">
               {/* Animated Pulse */}
               <div className="absolute top-10 right-10 w-4 h-4 bg-[#CCFF00] rounded-full animate-ping"></div>
               
               <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00] mb-2">Current Standard</span>
                     <h3 className="font-serif text-4xl">Subclass 858 (NIV)</h3>
                     <span className="text-xs mt-2 opacity-60">Global Talent + Entrepreneur Merged</span>
                  </div>
                  <Rocket className="w-12 h-12 text-[#CCFF00]" />
               </div>

               <div className="space-y-8 relative z-10">
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Status</span>
                     <span className="font-serif text-xl text-[#CCFF00]">Direct Permanent Residency</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Funding</span>
                     <span className="font-serif text-xl">Merit Based (No Min)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Age Limit</span>
                     <span className="font-serif text-xl">Flexible (None strict)</span>
                  </div>
                  <p className="text-xs opacity-60 mt-4 leading-relaxed border-l-2 border-[#CCFF00] pl-2">
                     <strong>The Game Changer:</strong> You land in Australia as a Permanent Resident on Day 1. No provisional period. No anxiety.
                  </p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          3. ELIGIBILITY: THE "PROMINENCE" TEST
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <h2 className="font-serif text-4xl mb-6">The High <br/> Bar</h2>
               <div className="w-12 h-1 bg-[#CCFF00] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  The NIV is not for "aspiring" entrepreneurs. It is for those who have already arrived. 
                  You must prove you are "internationally recognized" in your field.
               </p>
            </div>

            <div className="lg:col-span-8 space-y-8">
               
               <div className="flex gap-6 border-b border-[#1a1a1a]/10 pb-8">
                  <div className="bg-[#1a1a1a] text-[#CCFF00] w-12 h-12 flex items-center justify-center font-bold shrink-0 text-xl">01</div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2">International Recognition</h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed max-w-xl">
                        You must show sustained achievement. Awards, patents, media coverage, or successful exits. 
                        Being "good" is not enough; you must be "prominent".
                     </p>
                  </div>
               </div>

               <div className="flex gap-6 border-b border-[#1a1a1a]/10 pb-8">
                  <div className="bg-[#1a1a1a] text-[#CCFF00] w-12 h-12 flex items-center justify-center font-bold shrink-0 text-xl">02</div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2">Asset to Australia</h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed max-w-xl">
                        Your presence must benefit the Australian community. This is usually proven by your ability to generate wealth, employment, or raise the standard of Australian innovation.
                     </p>
                  </div>
               </div>

               <div className="flex gap-6 border-b border-[#1a1a1a]/10 pb-8">
                  <div className="bg-[#1a1a1a] text-[#CCFF00] w-12 h-12 flex items-center justify-center font-bold shrink-0 text-xl">03</div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2">The Nominator</h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed max-w-xl">
                        Crucial Step. You must be nominated by an Australian citizen, PR, or organization with a "national reputation" in your field who can attest to your global standing.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          4. PRIORITY SECTORS
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <h2 className="font-serif text-4xl text-[#CCFF00]">Target Verticals</h2>
               <p className="font-sans text-sm opacity-60 max-w-md text-right">
                  The NIV is sector-agnostic but sector-biased. <br/>
                  Focus on these high-growth industries.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Clean Energy", desc: "Renewables, Net Zero Tech, Battery Systems." },
                  { title: "Health & Life Sciences", desc: "MedTech, Biotech, Clinical Trials." },
                  { title: "Digitech", desc: "Cyber Security, Quantum, AI, Fintech." },
                  { title: "Agri-Food", desc: "AgTech, Sustainable Farming systems." },
                  { title: "Advanced Mfg", desc: "Space, Defense, Robotics." },
                  { title: "Education", desc: "EdTech and Research Commercialization." },
               ].map((item, i) => (
                  <div key={i} className="border border-[#F2F0E9]/20 p-8 hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all duration-300 group cursor-default">
                     <TrendingUp className="w-6 h-6 text-[#CCFF00] group-hover:text-[#1a1a1a] mb-4" />
                     <h3 className="font-serif text-2xl mb-2">{item.title}</h3>
                     <p className="font-sans text-sm opacity-60 group-hover:opacity-100">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          5. THE NOMINATION STRATEGY
      ========================================= */}
      <section className="py-24 bg-[#F2F0E9] border-y border-[#1a1a1a]/10">
         <div className="flex flex-col md:flex-row gap-16 items-center">
            
            <div className="md:w-1/2">
               <div className="border border-[#1a1a1a] p-10 bg-white shadow-[10px_10px_0px_0px_rgba(26,26,26,1)]">
                  <Globe className="w-12 h-12 text-[#1a1a1a] mb-6" />
                  <h3 className="font-serif text-3xl mb-4">The Nomination Problem</h3>
                  <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed mb-6">
                     Finding a valid "Nominator" is the hardest part of the NIV. 
                     It cannot be just anyone. It must be a Peak Body, a leading University, or an industry titan.
                  </p>
                  <p className="font-sans text-sm font-bold border-l-2 border-[#CCFF00] pl-4">
                     SVR maintains relationships with Australian Incubators and Industry Bodies to facilitate this nomination for qualified founders.
                  </p>
               </div>
            </div>

            <div className="md:w-1/2">
               <span className="font-sans text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-1 mb-6 inline-block">STRATEGIC PARTNERS</span>
               <h2 className="font-serif text-4xl mb-6">Ecosystem Access</h2>
               <p className="font-sans text-lg text-[#1a1a1a]/70 leading-relaxed mb-8">
                  We don't just file visas. We plug you into the Australian startup ecosystem (Sydney/Melbourne) before you even land.
               </p>
               <ul className="space-y-4 font-sans text-sm">
                  <li className="flex items-center gap-3">
                     <Anchor className="w-5 h-5 text-[#1a1a1a]" />
                     <span>Stone & Chalk (Fintech Hub)</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <Anchor className="w-5 h-5 text-[#1a1a1a]" />
                     <span>Cicada Innovations (Deep Tech)</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <Anchor className="w-5 h-5 text-[#1a1a1a]" />
                     <span>Fishburners (General Tech)</span>
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
            Sydney or Melbourne?
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            The National Innovation Visa is competitive. Let's audit your achievements 
            to see if you meet the "Prominence" threshold.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               Assess NIV Eligibility
            </Link>
            <Link href="/pnp" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Compare with Canada
            </Link>
         </div>
      </section>

    </div>
  );
}