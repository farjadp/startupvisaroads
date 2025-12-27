// ============================================================================
// Page: app/pnp/page.tsx
// Style: Modernist Editorial (SVR Brand Identity)
// Context: Provincial Nominee Program Overview
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowDownRight, 
  Map, 
  Check, 
  Zap, 
  FileText 
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Provincial Nominee Programs | SVR',
  description: 'Regional immigration architecture. The strategic pathway to Permanent Residency via provincial nomination.',
};

export default function PNPPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: REGIONAL SOVEREIGNTY
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Canada • Regional Streams</span>
        </div>

        <h1 className="font-serif text-[11vw] leading-[0.85] tracking-tighter mb-12">
           PROVINCIAL <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">NOMINATION.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 You don't just move to Canada. <br/>
                 You move to an <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic">economy.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 The Provincial Nominee Program (PNP) allows Canadian provinces to hand-pick individuals who match their specific economic needs. 
                 It is the most targeted architectural route to Permanent Residency.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. THE TWO ARCHITECTURES (Base vs Enhanced)
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#1a1a1a]/10">
            
            {/* Left: Enhanced (Express Entry) */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a]/10 hover:bg-white transition-colors duration-500 group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <Zap className="w-24 h-24 text-[#CCFF00]" />
               </div>
               
               <span className="font-sans text-xs font-bold uppercase tracking-widest bg-[#1a1a1a] text-[#CCFF00] px-2 py-1 mb-6 inline-block">
                  Enhanced Stream
               </span>
               <h3 className="font-serif text-4xl mb-6">Express Entry Linked</h3>
               <p className="font-sans text-sm text-[#1a1a1a]/60 mb-8 leading-relaxed max-w-md">
                  The "Digital Highway". You apply online through the Express Entry system. If a province nominates you, the reward is substantial.
               </p>
               
               <div className="bg-[#F2F0E9] border border-[#1a1a1a]/20 p-6 mb-8">
                  <p className="font-serif text-5xl mb-2 text-[#1a1a1a]">+600</p>
                  <p className="font-sans text-xs font-bold uppercase tracking-widest">CRS Points Guaranteed</p>
               </div>

               <ul className="space-y-3 font-sans text-sm text-[#1a1a1a]/80">
                  <li className="flex gap-3"><Check className="w-4 h-4 text-[#CCFF00] bg-black rounded-full p-0.5"/> Faster processing (approx. 6 months)</li>
                  <li className="flex gap-3"><Check className="w-4 h-4 text-[#CCFF00] bg-black rounded-full p-0.5"/> 100% Guarantee of ITA in next draw</li>
               </ul>
            </div>

            {/* Right: Base (Paper Based) */}
            <div className="p-12 hover:bg-white transition-colors duration-500 group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <FileText className="w-24 h-24 text-[#1a1a1a]" />
               </div>

               <span className="font-sans text-xs font-bold uppercase tracking-widest border border-[#1a1a1a] text-[#1a1a1a] px-2 py-1 mb-6 inline-block">
                  Base Stream
               </span>
               <h3 className="font-serif text-4xl mb-6">Non-Express Entry</h3>
               <p className="font-sans text-sm text-[#1a1a1a]/60 mb-8 leading-relaxed max-w-md">
                  The "Legacy Route". You apply directly to the province first. Once nominated, you apply to the federal government via the paper-based portal.
               </p>

               <div className="bg-[#1a1a1a] text-[#F2F0E9] p-6 mb-8">
                  <p className="font-serif text-5xl mb-2">Flexible</p>
                  <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00]">Lower Eligibility Criteria</p>
               </div>

               <ul className="space-y-3 font-sans text-sm text-[#1a1a1a]/80">
                  <li className="flex gap-3"><Check className="w-4 h-4 text-[#1a1a1a] border border-[#1a1a1a] rounded-full p-0.5"/> Ideal for intermediate language scores</li>
                  <li className="flex gap-3"><Check className="w-4 h-4 text-[#1a1a1a] border border-[#1a1a1a] rounded-full p-0.5"/> Slower processing (12-20 months)</li>
               </ul>
            </div>

         </div>
      </section>


      {/* =========================================
          3. THE JURISDICTIONS (Directory)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4">
            <div>
               <h2 className="font-serif text-5xl md:text-6xl mb-4">The Territories</h2>
               <p className="font-sans text-[#1a1a1a]/60 max-w-xl">
                  Each province operates like a separate entity with unique labor market needs. Select a jurisdiction to analyze its streams.
               </p>
            </div>
            <Map className="w-12 h-12 text-[#1a1a1a]/20" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-[#1a1a1a]/10">
            
            {[
               { name: "Ontario", code: "OINP", focus: "Tech, Finance, Trades", link: "/pnp/ontario" },
               { name: "British Columbia", code: "BC PNP", focus: "Tech, Health, Management", link: "/pnp/bc" },
               { name: "Alberta", code: "AAIP", focus: "Agri, Tech, Hospitality", link: "/pnp/alberta" },
               { name: "Saskatchewan", code: "SINP", focus: "Hard-to-fill Skills", link: "/pnp/saskatchewan" },
               { name: "Manitoba", code: "MPNP", focus: "Strong Family Ties", link: "/pnp/manitoba" },
               { name: "Nova Scotia", code: "NSNP", focus: "Doctors, Labour Market", link: "/pnp/nova-scotia" },
               { name: "New Brunswick", code: "NBPNP", focus: "Trucking, IT, French", link: "/pnp/new-brunswick" },
               { name: "PEI", code: "PEI PNP", focus: "Business Impact", link: "/pnp/pei" },
               { name: "Newfoundland", code: "NLPNP", focus: "Priority Skills", link: "/pnp/newfoundland" },
            ].map((prov, i) => (
               <Link href={prov.link} key={i} className="group border-b border-r border-[#1a1a1a]/10 p-10 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300 relative">
                  <div className="flex justify-between items-start mb-8">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-40 group-hover:text-[#CCFF00] group-hover:opacity-100">{prov.code}</span>
                     <ArrowDownRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-[#CCFF00]" />
                  </div>
                  <h3 className="font-serif text-3xl mb-2">{prov.name}</h3>
                  <p className="font-sans text-xs uppercase tracking-wider opacity-60 group-hover:opacity-80">
                     Target: {prov.focus}
                  </p>
               </Link>
            ))}

            {/* Quebec Special Note */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 border-b border-[#1a1a1a]/10 p-10 bg-[#1a1a1a] text-[#F2F0E9] flex flex-col md:flex-row items-center justify-between gap-8">
               <div>
                  <h3 className="font-serif text-3xl mb-2 text-[#CCFF00]">Quebec (Arrima)</h3>
                  <p className="font-sans text-sm opacity-70 max-w-2xl">
                     Note: The province of Quebec does not have a PNP. It operates its own independent immigration system requiring a "Certificat de sélection du Québec" (CSQ).
                  </p>
               </div>
               <button className="border border-[#F2F0E9] px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] hover:border-[#CCFF00] transition-colors">
                  View Quebec Programs
               </button>
            </div>

         </div>
      </section>


      {/* =========================================
          4. THE PROCESS (Step-by-Step)
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             <div className="lg:col-span-4">
                <h2 className="font-serif text-5xl mb-6">Execution <br/> Protocol</h2>
                <div className="w-12 h-1 bg-[#CCFF00]"></div>
             </div>
             <div className="lg:col-span-8 space-y-12">
                
                <div className="flex gap-6 items-start group">
                   <span className="font-sans text-4xl font-bold text-[#1a1a1a]/20 group-hover:text-[#CCFF00] transition-colors">01</span>
                   <div>
                      <h3 className="font-serif text-2xl mb-2">Consultation & Audit</h3>
                      <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed max-w-lg">
                         We analyze your NOC code, CRS score, and ties to specific provinces to identify which PNP stream offers the highest probability of nomination.
                      </p>
                   </div>
                </div>

                <div className="flex gap-6 items-start group">
                   <span className="font-sans text-4xl font-bold text-[#1a1a1a]/20 group-hover:text-[#CCFF00] transition-colors">02</span>
                   <div>
                      <h3 className="font-serif text-2xl mb-2">Expression of Interest (EOI)</h3>
                      <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed max-w-lg">
                         We submit your profile to the province's pool. This is separate from your federal Express Entry profile.
                      </p>
                   </div>
                </div>

                <div className="flex gap-6 items-start group">
                   <span className="font-sans text-4xl font-bold text-[#1a1a1a]/20 group-hover:text-[#CCFF00] transition-colors">03</span>
                   <div>
                      <h3 className="font-serif text-2xl mb-2">Nomination & PR</h3>
                      <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed max-w-lg">
                         Upon receiving the "Notification of Interest", we submit the full application. Once nominated, you receive +600 points (Enhanced) or apply via portal (Base).
                      </p>
                   </div>
                </div>

             </div>
         </div>
      </section>





{/* =========================================
          SECTION: COMPARATIVE MATRIX
          Source: Internal Analysis PDF (2025 Data)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10 bg-white">
        <div className="container mx-auto px-4 md:px-8">
           
           {/* Section Header */}
           <div className="mb-16 max-w-3xl">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4 block">
                 Quantitative Analysis
              </span>
              <h2 className="font-serif text-5xl md:text-6xl mb-6 text-[#1a1a1a]">
                 The Investment <br/> Matrix
              </h2>
              <p className="font-sans text-[#1a1a1a]/60 text-lg leading-relaxed border-l-4 border-[#CCFF00] pl-6">
                 Warning: These numbers represent the <span className="font-bold text-black">minimum eligibility</span>, not the competitive reality. 
                 Most streams operate on an EOI (Expression of Interest) points system where higher net worth and investment verify higher scores.
              </p>
           </div>

           {/* The Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-[#1a1a1a]/10">

              {/* 1. BRITISH COLUMBIA */}
              <div className="group border-b border-r border-[#1a1a1a]/10 p-10 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
                 <div className="flex justify-between items-start mb-8">
                    <h3 className="font-serif text-3xl">British Columbia</h3>
                    <span className="font-sans text-xs font-bold bg-[#CCFF00] text-[#1a1a1a] px-2 py-1">High Competition</span>
                 </div>
                 
                 <div className="space-y-6 font-sans text-sm">
                    <div className="flex justify-between border-b border-current/20 pb-2">
                       <span className="opacity-60">Min Net Worth</span>
                       <span className="font-bold">$600,000 CAD</span>
                    </div>
                    <div className="flex justify-between border-b border-current/20 pb-2">
                       <span className="opacity-60">Investment</span>
                       <span className="font-bold">$200,000 CAD</span>
                    </div>
                    <div className="flex justify-between border-b border-current/20 pb-2">
                       <span className="opacity-60">Ownership</span>
                       <span className="font-bold">33.3% +</span>
                    </div>
                 </div>
                 <p className="mt-6 text-xs opacity-50 leading-relaxed">
                    Process: EOI → Work Permit → Execute Business → Nomination.
                 </p>
              </div>

              {/* 2. MANITOBA */}
              <div className="group border-b border-r border-[#1a1a1a]/10 p-10 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
                 <div className="flex justify-between items-start mb-8">
                    <h3 className="font-serif text-3xl">Manitoba</h3>
                    <span className="font-sans text-xs font-bold border border-current px-2 py-1">Tiered</span>
                 </div>
                 
                 <div className="space-y-6 font-sans text-sm">
                    <div className="flex justify-between border-b border-current/20 pb-2">
                       <span className="opacity-60">Min Net Worth</span>
                       <span className="font-bold">$500,000 CAD</span>
                    </div>
                    <div className="flex justify-between border-b border-current/20 pb-2">
                       <span className="opacity-60">Investment</span>
                       <div className="text-right">
                          <span className="block font-bold">$250k (Capital)</span>
                          <span className="block font-bold text-[#CCFF00]">$150k (Rural)</span>
                       </div>
                    </div>
                 </div>
                 <p className="mt-6 text-xs opacity-50 leading-relaxed">
                    Requires 33% ownership or senior management role. Strong focus on "Active Management".
                 </p>
              </div>

              {/* 3. SASKATCHEWAN */}
              <div className="group border-b lg:border-r-0 border-[#1a1a1a]/10 p-10 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
                 <div className="flex justify-between items-start mb-8">
                    <h3 className="font-serif text-3xl">Saskatchewan</h3>
                    <span className="font-sans text-xs font-bold border border-current px-2 py-1">SINP</span>
                 </div>
                 
                 <div className="space-y-6 font-sans text-sm">
                    <div className="flex justify-between border-b border-current/20 pb-2">
                       <span className="opacity-60">Min Net Worth</span>
                       <span className="font-bold">$500,000 CAD</span>
                    </div>
                    <div className="flex justify-between border-b border-current/20 pb-2">
                       <span className="opacity-60">Investment</span>
                       <div className="text-right">
                          <span className="block font-bold">$300k (City)</span>
                          <span className="block font-bold text-[#CCFF00]">$200k (Rural)</span>
                       </div>
                    </div>
                 </div>
                 <p className="mt-6 text-xs opacity-50 leading-relaxed">
                    Specific requirement: Must create 2 jobs if establishing in Regina or Saskatoon.
                 </p>
              </div>

              {/* 4. NOVA SCOTIA */}
              <div className="group border-b lg:border-b-0 border-r border-[#1a1a1a]/10 p-10 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
                 <div className="flex justify-between items-start mb-8">
                    <h3 className="font-serif text-3xl">Nova Scotia</h3>
                    <span className="font-sans text-xs font-bold border border-current px-2 py-1">Atlantic</span>
                 </div>
                 
                 <div className="space-y-6 font-sans text-sm">
                    <div className="flex justify-between border-b border-current/20 pb-2">
                       <span className="opacity-60">Min Net Worth</span>
                       <span className="font-bold">$600,000 CAD</span>
                    </div>
                    <div className="flex justify-between border-b border-current/20 pb-2">
                       <span className="opacity-60">Investment</span>
                       <div className="text-right">
                          <span className="block font-bold">$150k (Halifax)</span>
                          <span className="block font-bold text-[#CCFF00]">$100k (Outside)</span>
                       </div>
                    </div>
                 </div>
                 <p className="mt-6 text-xs opacity-50 leading-relaxed">
                    Invitation only. Requires substantial business experience.
                 </p>
              </div>

              {/* 5. ALBERTA (Special Case) */}
              <div className="group border-r border-[#1a1a1a]/10 p-10 bg-[#1a1a1a] text-[#F2F0E9] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-[#CCFF00] opacity-10 rounded-bl-full"></div>
                 <div className="flex justify-between items-start mb-8">
                    <h3 className="font-serif text-3xl text-[#CCFF00]">Alberta</h3>
                    <span className="font-sans text-xs font-bold border border-[#CCFF00] text-[#CCFF00] px-2 py-1">Rural Stream</span>
                 </div>
                 
                 <div className="space-y-6 font-sans text-sm">
                    <div className="flex justify-between border-b border-[#F2F0E9]/20 pb-2">
                       <span className="opacity-60">Net Worth</span>
                       <span className="font-bold italic">Community Driven</span>
                    </div>
                    <div className="flex justify-between border-b border-[#F2F0E9]/20 pb-2">
                       <span className="opacity-60">Investment</span>
                       <span className="font-bold italic">See Guide</span>
                    </div>
                 </div>
                 <p className="mt-6 text-xs opacity-70 leading-relaxed border-l-2 border-[#CCFF00] pl-3">
                    <strong>Unique Mechanism:</strong> You must first connect with a participating rural community and secure a "Community Support Letter" before applying.
                 </p>
              </div>

              {/* 6. ATLANTIC & NORTH (Grouped) */}
              <div className="group p-10 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
                 <div className="flex justify-between items-start mb-8">
                    <h3 className="font-serif text-3xl">Other Regions</h3>
                    <span className="font-sans text-xs font-bold border border-current px-2 py-1">PEI / NL / Yukon</span>
                 </div>
                 
                 <ul className="space-y-4 font-sans text-sm">
                    <li className="flex justify-between items-center">
                       <span>PEI (Work Permit)</span>
                       <span className="font-bold">$600k NW</span>
                    </li>
                    <li className="flex justify-between items-center">
                       <span>Newfoundland</span>
                       <span className="font-bold">$200k Inv</span>
                    </li>
                    <li className="flex justify-between items-center">
                       <span>Yukon</span>
                       <span className="font-bold">$300k Inv</span>
                    </li>
                 </ul>
                 <p className="mt-8 text-xs font-bold uppercase tracking-widest text-[#CCFF00] bg-black inline-block px-2">
                    Performance Agreement Required
                 </p>
              </div>

           </div>
           
           {/* CRITICAL NOTE: The "Trap" mentioned in PDF */}
           <div className="mt-12 bg-[#F2F0E9] border border-[#1a1a1a] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 bg-[#b91c1c] text-white p-3">
                 <span className="font-bold text-xl">!</span>
              </div>
              <div>
                 <h4 className="font-serif text-2xl mb-4">The "Active Management" Reality</h4>
                 <p className="font-sans text-[#1a1a1a]/70 text-sm leading-relaxed mb-4">
                    Unlike the SUV program which leads to direct PR, most PNP streams are "Work Permit Performance" streams. 
                    <strong>This is a risk.</strong> You must arrive, launch the business, and run it daily for 12-24 months. 
                    If the business fails or audits show you were not actively managing it, you do <u>not</u> get the nomination for PR.
                 </p>
                 <p className="font-sans text-xs font-bold uppercase tracking-widest">
                    Conclusion: Do not treat this as a passive investment.
                 </p>
              </div>
           </div>

        </div>
      </section>



      {/* =========================================
          5. CTA
      ========================================= */}
      <section className="py-20 border-t border-[#1a1a1a]/10 text-center">
         <h2 className="font-serif text-4xl md:text-5xl mb-8">
            Find your jurisdiction.
         </h2>
         <Link href="/contact" className="inline-block bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
            Start Assessment
         </Link>
      </section>



      {/* =========================================
          SECTION: THE INTERROGATION (FAQ)
          Style: High Contrast Editorial
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Sidebar Title */}
           <div className="lg:col-span-4">
              <span className="font-sans text-xs font-bold bg-[#1a1a1a] text-[#CCFF00] px-2 py-1 mb-6 inline-block">THE REALITY CHECK</span>
              <h2 className="font-serif text-5xl mb-6">Critical <br/> Queries</h2>
              <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed max-w-xs">
                 The glossy brochures won't tell you the failure rates. We do. 
                 Here are the most common misconceptions about Provincial Nominee Programs.
              </p>
           </div>

           {/* FAQ List */}
           <div className="lg:col-span-8">
              <div className="space-y-0 divide-y divide-[#1a1a1a]/10 border-t border-b border-[#1a1a1a]/10">
                 
                 {/* Q1: Active Management */}
                 <details className="group py-8 cursor-pointer">
                    <summary className="flex justify-between items-center list-none">
                       <h3 className="font-serif text-2xl md:text-3xl group-hover:italic transition-all pr-8">
                          Can I just invest money and wait for PR?
                       </h3>
                       <span className="font-sans text-xl font-bold text-[#1a1a1a]/20 group-hover:text-[#CCFF00] transition-colors group-open:rotate-45 transform duration-300">+</span>
                    </summary>
                    <div className="pt-6 animate-in slide-in-from-top-2">
                       <p className="font-sans text-[#1a1a1a]/70 leading-relaxed max-w-2xl border-l-2 border-[#CCFF00] pl-6">
                          <strong>Absolutely not.</strong> This is the most common reason for rejection. 
                          PNP Entrepreneur streams require "Active Management". This means you must be physically present 
                          at the business premises, making day-to-day operational decisions. You cannot simply be a board member or a passive investor living in another city.
                       </p>
                    </div>
                 </details>

                 {/* Q2: Buying Business */}
                 <details className="group py-8 cursor-pointer">
                    <summary className="flex justify-between items-center list-none">
                       <h3 className="font-serif text-2xl md:text-3xl group-hover:italic transition-all pr-8">
                          Is it safer to buy an existing business?
                       </h3>
                       <span className="font-sans text-xl font-bold text-[#1a1a1a]/20 group-hover:text-[#CCFF00] transition-colors group-open:rotate-45 transform duration-300">+</span>
                    </summary>
                    <div className="pt-6 animate-in slide-in-from-top-2">
                       <p className="font-sans text-[#1a1a1a]/70 leading-relaxed max-w-2xl border-l-2 border-[#CCFF00] pl-6">
                          It can be, but it comes with strict "Succession Rules". 
                          Usually, you must keep all existing staff employed. You cannot buy a business from a family member. 
                          Also, the business must have been in operation by the same owner for at least 3-5 years (depending on the province) to be eligible for purchase.
                       </p>
                    </div>
                 </details>

                 {/* Q3: Start-up Visa vs PNP */}
                 <details className="group py-8 cursor-pointer">
                    <summary className="flex justify-between items-center list-none">
                       <h3 className="font-serif text-2xl md:text-3xl group-hover:italic transition-all pr-8">
                          Why choose PNP over the Start-Up Visa?
                       </h3>
                       <span className="font-sans text-xl font-bold text-[#1a1a1a]/20 group-hover:text-[#CCFF00] transition-colors group-open:rotate-45 transform duration-300">+</span>
                    </summary>
                    <div className="pt-6 animate-in slide-in-from-top-2">
                       <p className="font-sans text-[#1a1a1a]/70 leading-relaxed max-w-2xl border-l-2 border-[#CCFF00] pl-6">
                          Suitability. The <Link href="/startup-visa-canada" className="underline decoration-[#CCFF00] font-bold text-black">Start-Up Visa</Link> is for innovative, scalable tech/IP companies. 
                          If your business is a traditional model (e.g., manufacturing, construction, hospitality, retail) 
                          that serves the local economy, PNP is your only viable entrepreneur pathway.
                       </p>
                    </div>
                 </details>

                 {/* Q4: Net Worth Verification */}
                 <details className="group py-8 cursor-pointer">
                    <summary className="flex justify-between items-center list-none">
                       <h3 className="font-serif text-2xl md:text-3xl group-hover:italic transition-all pr-8">
                          How strict is the Net Worth audit?
                       </h3>
                       <span className="font-sans text-xl font-bold text-[#1a1a1a]/20 group-hover:text-[#CCFF00] transition-colors group-open:rotate-45 transform duration-300">+</span>
                    </summary>
                    <div className="pt-6 animate-in slide-in-from-top-2">
                       <p className="font-sans text-[#1a1a1a]/70 leading-relaxed max-w-2xl border-l-2 border-[#CCFF00] pl-6">
                          Extremely strict. You must hire a designated third-party forensic accountant (like KPMG or MNP) 
                          to verify the source of funds for 100% of your declared assets. 
                          Crypto assets are often difficult to verify unless there is a clear fiat-to-crypto paper trail.
                       </p>
                    </div>
                 </details>

                 {/* Q5: Refund Policy */}
                 <details className="group py-8 cursor-pointer">
                    <summary className="flex justify-between items-center list-none">
                       <h3 className="font-serif text-2xl md:text-3xl group-hover:italic transition-all pr-8">
                          What happens if I fail to meet the performance agreement?
                       </h3>
                       <span className="font-sans text-xl font-bold text-[#1a1a1a]/20 group-hover:text-[#CCFF00] transition-colors group-open:rotate-45 transform duration-300">+</span>
                    </summary>
                    <div className="pt-6 animate-in slide-in-from-top-2">
                       <p className="font-sans text-[#1a1a1a]/70 leading-relaxed max-w-2xl border-l-2 border-[#b91c1c] pl-6">
                          <span className="text-[#b91c1c] font-bold block mb-2">The Danger Zone.</span>
                          If you do not meet the terms of your Performance Agreement (investment amount, job creation, etc.) 
                          within the specified timeframe (usually 2 years), you will NOT receive the provincial nomination. 
                          Your path to PR ends, and you may have to leave Canada when your work permit expires.
                       </p>
                    </div>
                 </details>

              </div>
           </div>
        </div>
      </section>

    </div>
  );
}