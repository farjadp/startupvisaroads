// ============================================================================
// Page: app/pnp/bc/page.tsx
// Style: Modernist Editorial (SVR Identity)
// Context: British Columbia Provincial Nominee Program (BC PNP)
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Mountain, 
  Cpu, 
  Anchor, 
  Map,
  Check,
  Timer
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BC PNP | The Pacific Gateway',
  description: 'Immigration strategy for Vancouver and British Columbia. Tech, Entrepreneur, and Regional Pilots.',
};

export default function BCPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE PACIFIC GATEWAY
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Jurisdiction: British Columbia</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12">
           PACIFIC <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">GATEWAY.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 Silicon Valley North. <br/>
                 Where lifestyle meets <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">velocity.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 British Columbia operates the most sophisticated points-based immigration system in Canada (SIRS). 
                 It is famous for its "Tech Stream" (weekly draws) and its strict dichotomy between Vancouver and the Regional Pilot.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. THE TECH ADVANTAGE (BC's Crown Jewel)
      ========================================= */}
      <section className="py-24">
         <div className="border border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9] p-12 relative overflow-hidden group">
            {/* Background Graphic */}
            <div className="absolute -right-20 -top-20 w-64 h-64 border border-[#CCFF00]/20 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute right-10 top-10">
               <Cpu className="w-16 h-16 text-[#CCFF00] animate-pulse" />
            </div>

            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <span className="bg-[#CCFF00] text-[#1a1a1a] px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest">Priority Pathway</span>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#F2F0E9]/60">29 Key Occupations</span>
               </div>
               
               <h2 className="font-serif text-5xl md:text-6xl mb-6">BC PNP Tech</h2>
               <p className="font-sans text-lg text-[#F2F0E9]/80 mb-12 max-w-3xl leading-relaxed">
                  The fastest route to Permanent Residency in Canada. Unlike other streams that draw monthly, 
                  BC PNP Tech conducts <strong>weekly draws</strong> with lower score requirements and priority processing.
                  Job offer required (min 1 year duration).
               </p>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-[#F2F0E9]/20 pt-8">
                  <div>
                     <span className="block font-serif text-3xl text-[#CCFF00] mb-1">Weekly</span>
                     <span className="text-xs font-sans uppercase tracking-widest opacity-60">Draw Frequency</span>
                  </div>
                  <div>
                     <span className="block font-serif text-3xl text-[#CCFF00] mb-1">1 Year</span>
                     <span className="text-xs font-sans uppercase tracking-widest opacity-60">Min Job Offer</span>
                  </div>
                  <div>
                     <span className="block font-serif text-3xl text-[#CCFF00] mb-1">2-3 Mo</span>
                     <span className="text-xs font-sans uppercase tracking-widest opacity-60">Processing Time</span>
                  </div>
                  <div>
                     <span className="block font-serif text-3xl text-[#CCFF00] mb-1">Low</span>
                     <span className="text-xs font-sans uppercase tracking-widest opacity-60">SIRS Cut-off</span>
                  </div>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          3. ENTREPRENEUR STREAMS (Split)
      ========================================= */}
      <section className="py-24">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">Business Immigration</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg max-w-2xl">
               Vancouver is expensive. The Regional Pilot is strategic. Choose your battlefield.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 border border-[#1a1a1a]/10">
            
            {/* BASE CATEGORY */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a]/10 hover:bg-white transition-colors duration-500">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2">Standard Path</span>
                     <h3 className="font-serif text-4xl">Base Category</h3>
                     <span className="text-xs opacity-50 mt-1">Vancouver, Burnaby, Richmond</span>
                  </div>
                  <Anchor className="w-10 h-10 text-[#1a1a1a]" />
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
                     <span className="font-sans text-sm opacity-60">Personal Net Worth</span>
                     <span className="font-serif text-xl">$600,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-xl">$200,000 CAD</span>
                  </div>
                  <p className="text-xs opacity-60 mt-4 leading-relaxed">
                     Designed for high-net-worth individuals establishing businesses in the Greater Vancouver Area. Very competitive.
                  </p>
               </div>
            </div>

            {/* REGIONAL PILOT */}
            <div className="p-12 hover:bg-white transition-colors duration-500 bg-[#F2F0E9] relative">
               <div className="absolute top-0 right-0 w-16 h-16 bg-[#CCFF00] rounded-bl-full opacity-20"></div>
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2">Strategic Path</span>
                     <h3 className="font-serif text-4xl">Regional Pilot</h3>
                     <span className="text-xs opacity-50 mt-1">Populations under 75,000</span>
                  </div>
                  <Mountain className="w-10 h-10 text-[#1a1a1a]" />
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
                     <span className="font-sans text-sm opacity-60">Personal Net Worth</span>
                     <span className="font-serif text-xl bg-[#CCFF00]/30 px-2">$300,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-xl bg-[#CCFF00]/30 px-2">$100,000 CAD</span>
                  </div>
                  <p className="text-xs opacity-60 mt-4 leading-relaxed">
                     <strong>Requirement:</strong> You must conduct an exploratory visit and receive a referral from the participating community before registering.
                  </p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          4. PRIORITY SECTORS (Care & Construction)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <h2 className="font-serif text-4xl mb-6">Targeted <br/> Draws</h2>
               <div className="w-12 h-1 bg-[#CCFF00] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  Apart from Tech, BC holds specific draws for sectors with critical labor shortages. If you work in these fields, the points threshold is significantly lower.
               </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                  { title: "Healthcare", desc: "Physicians, Nurses, Allied Health Professionals." },
                  { title: "Childcare", desc: "Early Childhood Educators (ECE)." },
                  { title: "Construction", desc: "25 defined construction occupations." },
                  { title: "Veterinary Care", desc: "Vets and Vet Technicians." },
               ].map((item, i) => (
                  <div key={i} className="border border-[#1a1a1a]/10 p-8 hover:border-[#1a1a1a] transition-colors group">
                     <Check className="w-6 h-6 text-[#CCFF00] bg-black rounded-full p-1 mb-4" />
                     <h3 className="font-serif text-2xl mb-2">{item.title}</h3>
                     <p className="font-sans text-sm opacity-60">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          5. THE SIRS POINTS SYSTEM
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <h2 className="font-serif text-4xl text-[#CCFF00]">SIRS System</h2>
               <p className="font-sans text-sm opacity-60 max-w-md text-right">
                  Skills Immigration Registration System. <br/>
                  Everything is scored.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
               <div className="border-t border-[#F2F0E9]/20 pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-50 block mb-2">Factor 01</span>
                  <h4 className="text-xl font-bold mb-2">Economic Factors</h4>
                  <p className="text-sm opacity-60">Wage of the job offer, location of employment (Regional &gt; Vancouver).</p>
               </div>
               <div className="border-t border-[#F2F0E9]/20 pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-50 block mb-2">Factor 02</span>
                  <h4 className="text-xl font-bold mb-2">Human Capital</h4>
                  <p className="text-sm opacity-60">Directly related work experience, level of education.</p>
               </div>
               <div className="border-t border-[#F2F0E9]/20 pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-50 block mb-2">Factor 03</span>
                  <h4 className="text-xl font-bold mb-2">Language</h4>
                  <p className="text-sm opacity-60">CLB Score in English or French. Higher scores = More points.</p>
               </div>
               <div className="border-t border-[#F2F0E9]/20 pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-50 block mb-2">The Goal</span>
                  <h4 className="text-xl font-bold mb-2 text-[#CCFF00]">The Invitation</h4>
                  <p className="text-sm opacity-60">Score above the cut-off to receive an ITA (Invitation to Apply).</p>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 text-center">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Vancouver or Victoria?
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            Whether you are a Series-A startup founder or a specialized engineer, 
            BC has a pathway for you. Let's calculate your SIRS score.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               Book Consultation
            </Link>
            <Link href="/pnp" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Back to Provinces
            </Link>
         </div>
      </section>

    </div>
  );
}
