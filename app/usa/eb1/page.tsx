// ============================================================================
// Page: app/usa/eb1/page.tsx
// Style: Editorial / Art Gallery
// Concept: "The Top 1%" (Prestige & Excellence)
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Trophy, 
  Newspaper, 
  Gavel, 
  ArrowRight, 
  Star, 
  ShieldAlert,
  Mic2,
  TrendingUp
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'USA EB-1A | The Extraordinary Ability Visa',
  description: 'Advisory for the "Einstein Visa". Building the evidence profile for the top 1% of entrepreneurs.',
};

export default function EB1Page() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: THE 1 PERCENT
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#b91c1c]"></span> {/* Red for USA */}
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">First Preference</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            EXTRA <br/>
            <span className="pl-[10vw] italic text-[#1a1a1a]/40">ORDINARY.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
             <div className="lg:col-span-7">
                <p className="font-serif text-3xl md:text-5xl leading-tight">
                   The <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2">Einstein Visa</span>. Reserved for the small percentage who have risen to the very top of their field.
                </p>
             </div>
             <div className="lg:col-span-5 flex flex-col gap-8">
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify border-l-2 border-[#b91c1c] pl-6">
                   EB-1A is the gold standard of US immigration. No employer required. No investment required. 
                   Just pure, documented excellence. We help you build the portfolio that proves your acclaim.
                </p>
                <div className="flex gap-4">
                   <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#b91c1c] transition-colors">
                      Profile Assessment
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. THE CRITERIA (The 3 of 10 Rule)
      ========================================= */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="mb-20 flex flex-col md:flex-row justify-between items-end">
               <div>
                  <h2 className="font-serif text-5xl md:text-6xl mb-6">The Evidence</h2>
                  <p className="font-sans text-xs uppercase tracking-widest opacity-60">
                     Must satisfy at least 3 of 10 USCIS criteria
                  </p>
               </div>
               <div className="hidden md:block">
                  <Star className="w-12 h-12 text-[#CCFF00] animate-pulse-slow" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
               
               {/* Criterion 1 */}
               <div className="group border-t border-[#F2F0E9]/20 pt-8 hover:border-[#CCFF00] transition-colors">
                  <div className="flex justify-between items-start mb-6">
                     <h3 className="font-serif text-3xl">Prizes & Awards</h3>
                     <Trophy className="w-6 h-6 text-[#F2F0E9]/40 group-hover:text-[#CCFF00]" />
                  </div>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     Nationally or internationally recognized prizes or awards for excellence in your field (not student awards).
                  </p>
               </div>

               {/* Criterion 2 */}
               <div className="group border-t border-[#F2F0E9]/20 pt-8 hover:border-[#CCFF00] transition-colors">
                  <div className="flex justify-between items-start mb-6">
                     <h3 className="font-serif text-3xl">Media Coverage</h3>
                     <Newspaper className="w-6 h-6 text-[#F2F0E9]/40 group-hover:text-[#CCFF00]" />
                  </div>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     Published material about you in professional or major trade publications or major media.
                  </p>
               </div>

               {/* Criterion 3 */}
               <div className="group border-t border-[#F2F0E9]/20 pt-8 hover:border-[#CCFF00] transition-colors">
                  <div className="flex justify-between items-start mb-6">
                     <h3 className="font-serif text-3xl">Judging Others</h3>
                     <Gavel className="w-6 h-6 text-[#F2F0E9]/40 group-hover:text-[#CCFF00]" />
                  </div>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     Evidence of your participation, either individually or on a panel, as a judge of the work of others.
                  </p>
               </div>

               {/* Criterion 4 */}
               <div className="group border-t border-[#F2F0E9]/20 pt-8 hover:border-[#CCFF00] transition-colors">
                  <div className="flex justify-between items-start mb-6">
                     <h3 className="font-serif text-3xl">Critical Role</h3>
                     <TrendingUp className="w-6 h-6 text-[#F2F0E9]/40 group-hover:text-[#CCFF00]" />
                  </div>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     Performance in a leading or critical role for organizations that have a distinguished reputation.
                  </p>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          3. OUR STRATEGY: PROFILE BUILDING
      ========================================= */}
      <section className="py-24 px-6">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               
               <div className="relative">
                  <div className="aspect-[3/4] relative grayscale hover:grayscale-0 transition-all duration-700">
                     <Image 
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop"
                        alt="Executive Speaking"
                        fill
                        className="object-cover"
                     />
                     <div className="absolute -bottom-6 -right-6 bg-[#b91c1c] text-[#F2F0E9] p-8 max-w-xs hidden md:block">
                        <p className="font-serif text-xl italic">
                           "Acclaim is not accidental. It is engineered."
                        </p>
                     </div>
                  </div>
               </div>

               <div>
                  <span className="font-sans text-xs font-bold bg-[#1a1a1a] text-[#F2F0E9] px-2 py-1 mb-8 inline-block">THE PROCESS</span>
                  <h2 className="font-serif text-5xl mb-8">
                     We don't just file. <br/>
                     We <span className="underline decoration-[#b91c1c]">position.</span>
                  </h2>
                  <p className="font-sans text-lg text-[#1a1a1a]/60 mb-12 leading-relaxed">
                     Many founders have the ability but lack the paper trail. 
                     We work with you for 6-12 months before filing to close the gaps in your profile.
                  </p>

                  <div className="space-y-8">
                     <div className="flex gap-6 items-start">
                        <span className="font-serif text-3xl text-[#1a1a1a]/20">01</span>
                        <div>
                           <h4 className="font-bold text-xl mb-2">Press Strategy</h4>
                           <p className="text-sm opacity-60">Connecting you with specialized trade journalists to secure feature articles about your work.</p>
                        </div>
                     </div>
                     <div className="flex gap-6 items-start">
                        <span className="font-serif text-3xl text-[#1a1a1a]/20">02</span>
                        <div>
                           <h4 className="font-bold text-xl mb-2">Judging Opportunities</h4>
                           <p className="text-sm opacity-60">Placing you on judging panels for hackathons, startup competitions, and industry awards.</p>
                        </div>
                     </div>
                     <div className="flex gap-6 items-start">
                        <span className="font-serif text-3xl text-[#1a1a1a]/20">03</span>
                        <div>
                           <h4 className="font-bold text-xl mb-2">Expert Opinions</h4>
                           <p className="text-sm opacity-60">Drafting detailed letters of recommendation for industry leaders to sign on your behalf.</p>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          4. LEGAL DISCLAIMER (High Contrast)
      ========================================= */}
      <section className="py-12 px-6">
         <div className="container mx-auto max-w-4xl border border-[#b91c1c]/20 bg-white p-8 shadow-sm">
            <div className="flex gap-4 items-start">
               <ShieldAlert className="shrink-0 w-6 h-6 text-[#b91c1c]" />
               <div>
                  <h4 className="font-bold font-sans text-xs uppercase tracking-widest mb-2 text-[#b91c1c]">Scope of Service</h4>
                  <p className="font-serif text-sm leading-relaxed text-[#1a1a1a]/80">
                     <strong>Startup Visa Roads is a business advisory firm.</strong> We specialize in 
                     <span className="italic"> "Profile Enhancement"</span> and <span className="italic">"Evidence Gathering"</span>. 
                     The EB-1A petition involves complex legal arguments regarding the "totality of the evidence". 
                     We are NOT an immigration law firm. You must retain a licensed US attorney to prepare the legal brief and file the I-140 petition.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* =========================================
          5. CTA
      ========================================= */}
      <section className="py-32 px-6 text-center">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl md:text-7xl mb-8">
               Are you in the 1%?
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
               Let's audit your credentials against the USCIS criteria.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#b91c1c] transition-colors">
                  Schedule Audit
               </Link>
               <Link href="/usa/eb2-niw" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
                  Check EB-2 NIW Instead
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}