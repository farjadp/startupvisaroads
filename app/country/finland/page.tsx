// ============================================================================
// Page: app/finland/page.tsx
// Style: Modernist Editorial + "Aurora Tech" Theme
// Context: Finland Country Profile & Startup Permit Advisory
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Snowflake, 
  Wifi, 
  Rocket, 
  FileCheck, 
  Clock, 
  Smile,
  Gamepad2
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finland | The Happiest Tech Hub',
  description: 'Finnish Startup Permit. Fast Track residence for founders in 14 days. Home of Slush and Supercell.',
};

export default function FinlandPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: SILENCE & SUCCESS
      ========================================= */}
      <section className="min-h-[85vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10 relative overflow-hidden">
        
        {/* Background Abstract (Aurora) */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-r from-[#002F6C]/10 via-[#00BFA5]/10 to-[#8E44AD]/10 blur-[100px] pointer-events-none opacity-50"></div>

        <div className="flex items-center gap-4 mb-8 relative z-10">
           <span className="w-3 h-3 bg-[#002F6C] border border-[#1a1a1a]"></span> {/* Finnish Flag Blue */}
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Destination: Finland</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12 relative z-10">
           SILENCE & <br/>
           <span className="pl-[10vw] italic text-[#002F6C]">SPEED.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end relative z-10">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 #1 Happiest Country (7 Years Running). <br/>
                 Home to <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">Slush</span> & Linux.
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#002F6C] pl-6">
                 Finland is a paradox. It is quiet, calm, and incredibly stable, yet it operates at a blistering pace when it comes to technology. 
                 The <strong>Finnish Startup Permit</strong> is designed for high-growth founders who want to build global scalable companies from a base of absolute stability.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. MARKET METRICS (The Foundation)
      ========================================= */}
      <section className="py-24 border-b border-[#1a1a1a]/10">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">Why Finland?</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg">
               An ecosystem built on trust, transparency, and extreme engineering.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#1a1a1a]/10">
            
            {/* Stat 1 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Lifestyle</span>
                  <Smile className="w-6 h-6 text-[#002F6C]" />
               </div>
               <p className="font-serif text-5xl mb-2">#1 Rank</p>
               <p className="font-sans text-sm opacity-60">UN World Happiness Report. Work-life balance is not a slogan; it's law.</p>
            </div>

            {/* Stat 2 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Connectivity</span>
                  <Wifi className="w-6 h-6 text-[#002F6C]" />
               </div>
               <p className="font-serif text-5xl mb-2">6G Pioneer</p>
               <p className="font-sans text-sm opacity-60">Oulu is the birthplace of 6G. Internet access is a legal right.</p>
            </div>

            {/* Stat 3 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">VC Activity</span>
                  <Rocket className="w-6 h-6 text-[#002F6C]" />
               </div>
               <p className="font-serif text-5xl mb-2">Highest</p>
               <p className="font-sans text-sm opacity-60">Highest amount of VC investment per capita in Europe (Slush Effect).</p>
            </div>

         </div>
      </section>


      {/* =========================================
          3. THE PROGRAM: STARTUP PERMIT
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#1a1a1a]">
            
            {/* THE GATEKEEPER */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#F2F0E9] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest mb-2 text-[#1a1a1a]/40">Phase 01</span>
                     <h3 className="font-serif text-4xl mb-2">Business Finland</h3>
                     <span className="text-xs font-bold uppercase tracking-widest text-[#002F6C] bg-[#002F6C]/10 px-2 py-1 w-fit">Eligibility Statement</span>
                  </div>
                  <FileCheck className="w-12 h-12 text-[#1a1a1a]/20" />
               </div>

               <p className="font-sans text-sm opacity-70 mb-8 leading-relaxed">
                  Before you can apply for a visa, you must pitch your team and business model to Business Finland. 
                  They are looking for <strong>Rapid Scalability</strong>. A local consulting firm or restaurant will be rejected immediately.
               </p>

               <ul className="space-y-3 font-sans text-sm opacity-60">
                  <li className="flex gap-3"><span className="text-[#002F6C] font-bold">✓</span> Must have at least 2 Founders</li>
                  <li className="flex gap-3"><span className="text-[#002F6C] font-bold">✓</span> Must own {'>'} 60% of company</li>
                  <li className="flex gap-3"><span className="text-[#002F6C] font-bold">✓</span> MVP or Prototype ready</li>
               </ul>
            </div>

            {/* THE FAST TRACK */}
            <div className="p-12 bg-[#002F6C] text-[#F2F0E9] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-[#00BFA5] rounded-bl-full opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                     <div className="flex flex-col">
                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#00BFA5] mb-2">Phase 02</span>
                        <h3 className="font-serif text-4xl mb-2">Fast Track</h3>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">14-Day Service</span>
                     </div>
                     <Clock className="w-12 h-12 text-[#00BFA5]" />
                  </div>

                  <p className="font-sans text-sm opacity-80 mb-8 leading-relaxed">
                     Finland offers a dedicated "Fast Track" lane for startup entrepreneurs and their families. 
                     If you get the Eligibility Statement, you can receive your residence permit in <strong>2 weeks</strong>.
                  </p>
                  
                  <div className="bg-[#1a1a1a]/30 p-6 backdrop-blur-sm border border-[#00BFA5]/20">
                     <p className="font-bold text-sm mb-2">Financial Means (2025)</p>
                     <div className="flex justify-between items-center">
                        <span className="text-xs opacity-70">Single Applicant</span>
                        <span className="font-serif text-xl">~€1,210 /mo</span>
                     </div>
                     <p className="text-[10px] mt-4 opacity-50 italic">*You must prove funds for 1 year (~€14,520).</p>
                  </div>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          4. STRATEGIC SECTORS
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <h2 className="font-serif text-4xl mb-6">Winning <br/> Verticals</h2>
               <div className="w-12 h-1 bg-[#002F6C] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  Business Finland has specific priorities. Aligning your pitch with these sectors increases your approval probability.
               </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="border border-[#1a1a1a]/10 p-8 hover:border-[#002F6C] transition-colors group bg-white">
                  <Gamepad2 className="w-8 h-8 text-[#002F6C] mb-4" />
                  <h3 className="font-serif text-2xl mb-2">Gaming</h3>
                  <p className="font-sans text-sm opacity-60">Home to Supercell, Rovio, Remedy. A massive ecosystem for game devs.</p>
               </div>
               <div className="border border-[#1a1a1a]/10 p-8 hover:border-[#002F6C] transition-colors group bg-white">
                  <Wifi className="w-8 h-8 text-[#002F6C] mb-4" />
                  <h3 className="font-serif text-2xl mb-2">Connectivity (6G)</h3>
                  <p className="font-sans text-sm opacity-60">Nokia's heritage lives on. Deep tech in telecom and quantum computing.</p>
               </div>
               <div className="border border-[#1a1a1a]/10 p-8 hover:border-[#002F6C] transition-colors group bg-white">
                  <Snowflake className="w-8 h-8 text-[#002F6C] mb-4" />
                  <h3 className="font-serif text-2xl mb-2">Clean Energy</h3>
                  <p className="font-sans text-sm opacity-60">Smart grids, bio-economy, and battery technology.</p>
               </div>
               <div className="border border-[#1a1a1a]/10 p-8 hover:border-[#002F6C] transition-colors group bg-white">
                  <Rocket className="w-8 h-8 text-[#002F6C] mb-4" />
                  <h3 className="font-serif text-2xl mb-2">Health Tech</h3>
                  <p className="font-sans text-sm opacity-60">Digital health records, genomics, and personalized medicine.</p>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          5. THE SVR STRATEGY
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
               <h2 className="font-serif text-5xl mb-6">The Pitch <br/> Deck</h2>
               <div className="w-24 h-1 bg-[#00BFA5] mb-8"></div>
               <p className="font-sans text-lg opacity-70 leading-relaxed">
                  The application to Business Finland is not a form; it is a pitch. 
                  We structure your Needs Assessment, Market Entry Plan, and 12-month Financial Projection to match Finnish expectations.
               </p>
            </div>
            <div className="md:w-1/2 space-y-6 font-sans">
               <div className="flex gap-4 items-center border-b border-[#F2F0E9]/10 pb-4">
                  <span className="text-[#00BFA5] font-bold">01</span>
                  <p>Validation of "Innovative" aspect vs existing Finnish competitors.</p>
               </div>
               <div className="flex gap-4 items-center border-b border-[#F2F0E9]/10 pb-4">
                  <span className="text-[#00BFA5] font-bold">02</span>
                  <p>Proof of global scalability (Target markets beyond Finland).</p>
               </div>
               <div className="flex gap-4 items-center border-b border-[#F2F0E9]/10 pb-4">
                  <span className="text-[#00BFA5] font-bold">03</span>
                  <p>Team composition audit (Must be a capable team, not just 1 person).</p>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 text-center border-t border-[#1a1a1a]/10">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Helsinki Calling.
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            Ready to launch in the world's most stable environment? 
            Let's prepare your Business Finland pitch.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#002F6C] text-white px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors">
               Validate Idea
            </Link>
            <Link href="/" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Compare Jurisdictions
            </Link>
         </div>
      </section>

    </div>
  );
}