// ============================================================================
// Page: app/europe/finland/page.tsx
// Style: Editorial / Art Gallery
// Concept: "Nordic Intelligence"
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Snowflake, 
  Cpu, 
  Zap, 
  Globe,
  ShieldCheck,
  Award
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finland Startup Permit | Nordic Tech Hub',
  description: 'Fast-track to the happiest country. Business Finland eligibility advisory.',
};

export default function FinlandPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: 60 DEGREES NORTH
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#0ea5e9]"></span> {/* Ice Blue */}
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Nordic Region</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            FINLAND <br/>
            <span className="pl-[10vw] italic text-[#1a1a1a]/40">INTELLIGENCE.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
             <div className="lg:col-span-7">
                <p className="font-serif text-3xl md:text-5xl leading-tight">
                   The <span className="bg-[#0ea5e9] text-white px-2">Fast Track</span> to Europe's most advanced digital ecosystem.
                </p>
             </div>
             <div className="lg:col-span-5 flex flex-col gap-8">
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify border-l-2 border-[#0ea5e9] pl-6">
                   Finland offers a streamlined Startup Permit for high-growth founders. 
                   The key is securing an Eligibility Statement from <span className="font-bold">Business Finland</span>. 
                   We structure your team and business model to meet their rigorous criteria.
                </p>
                <div className="flex gap-4">
                   <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#0ea5e9] transition-colors">
                      Eligibility Check
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. THE GATEKEEPER (Business Finland)
      ========================================= */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               
               <div>
                  <span className="font-sans text-xs font-bold text-[#0ea5e9] mb-8 block uppercase tracking-widest">Mandatory Step</span>
                  <h2 className="font-serif text-5xl mb-8">
                     The Eligibility Statement.
                  </h2>
                  <p className="font-sans text-lg opacity-60 mb-12 leading-relaxed">
                     You cannot apply for a visa without it. Business Finland evaluates your potential for 
                     <span className="text-[#0ea5e9]"> rapid international growth</span>. They do not accept lifestyle businesses.
                  </p>

                  <div className="space-y-8">
                     <div className="flex gap-6 items-start group">
                        <Snowflake className="w-8 h-8 text-[#0ea5e9]" />
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">Versatile Team</h4>
                           <p className="text-sm opacity-60 font-sans">You need at least 2 founders with complementary skills holding  60% &gt; of the company.</p>
                        </div>
                     </div>
                     <div className="flex gap-6 items-start group">
                        <Globe className="w-8 h-8 text-[#0ea5e9]" />
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">Global Ambition</h4>
                           <p className="text-sm opacity-60 font-sans">Your business plan must explicitly target markets outside of Finland.</p>
                        </div>
                     </div>
                     <div className="flex gap-6 items-start group">
                        <ShieldCheck className="w-8 h-8 text-[#0ea5e9]" />
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">Secure Runway</h4>
                           <p className="text-sm opacity-60 font-sans">Proof of funds (approx €30k) to sustain operations during the initial phase.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="relative">
                  <div className="aspect-[4/5] relative grayscale hover:grayscale-0 transition-all duration-700 border border-[#F2F0E9]/20">
                     <Image 
                        src="https://images.unsplash.com/photo-1548232979-6c557ee14752?q=80&w=2071&auto=format&fit=crop"
                        alt="Helsinki Oodi Library"
                        fill
                        className="object-cover"
                     />
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          3. THE STATS (Minimal Grid)
      ========================================= */}
      <section className="py-0 border-b border-[#1a1a1a]">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            
            <div className="group border-b lg:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <Award className="w-12 h-12 mb-8 text-[#0ea5e9] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">#1</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  Happiest Country in the World (7 years running).
               </p>
            </div>

            <div className="group border-b lg:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <Cpu className="w-12 h-12 mb-8 text-[#0ea5e9] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">#1</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  Digital Skills in Europe. Advanced tech workforce.
               </p>
            </div>

            <div className="group border-b md:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <Zap className="w-12 h-12 mb-8 text-[#0ea5e9] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">14 Days</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  Fast Track processing time for startup permits.
               </p>
            </div>

            <div className="group p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300">
               <Globe className="w-12 h-12 mb-8 text-[#0ea5e9] group-hover:text-[#F2F0E9]" />
               <h3 className="font-serif text-3xl mb-4">20%</h3>
               <p className="font-sans text-sm opacity-70 leading-relaxed">
                  Corporate Tax Rate. One of the lowest in the EU.
               </p>
            </div>

         </div>
      </section>

      {/* =========================================
          4. LEGAL DISCLAIMER
      ========================================= */}
      <section className="py-12 px-6 bg-[#F9F9F9]">
         <div className="container mx-auto max-w-4xl">
            <div className="flex gap-4 items-start">
               <ShieldCheck className="shrink-0 w-6 h-6 text-[#1a1a1a]/40" />
               <p className="font-sans text-xs text-[#1a1a1a]/60 leading-relaxed text-justify">
                  <strong>Non-Legal Service Notice:</strong> Startup Visa Roads specializes in business model preparation for the Business Finland evaluation. 
                  We are <span className="underline">NOT</span> an immigration law firm. 
                  The Eligibility Statement is a prerequisite, but the final residence permit decision is made by the Finnish Immigration Service (Migri).
               </p>
            </div>
         </div>
      </section>

      {/* =========================================
          5. CTA
      ========================================= */}
      <section className="py-32 px-6 text-center">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl md:text-7xl mb-8">
               Launch in Helsinki.
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
               Secure your Eligibility Statement with a compliant growth plan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#0ea5e9] transition-colors">
                  Start Assessment
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}