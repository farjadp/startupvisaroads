// ============================================================================
// Page: app/about/page.tsx
// Style: Editorial / Art Gallery
// Concept: "The Manifesto" (Philosophy & Team)
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Target, 
  Globe2, 
  ShieldCheck, 
  Award,
  Users
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Firm | About SVR',
  description: 'Our philosophy: Meritocracy, Precision, and Global Ambition.',
};

export default function AboutPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: PHILOSOPHY
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#1a1a1a]"></span>
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">The Philosophy</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            MERIT <br/>
            <span className="pl-[15vw] italic text-[#1a1a1a]/40">OVER BORDERS.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
             <div>
                <p className="font-serif text-3xl md:text-4xl leading-tight">
                   We believe that exceptional talent should be <span className="bg-[#CCFF00] px-2">geography-agnostic</span>.
                </p>
             </div>
             <div className="flex flex-col gap-6">
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify max-w-md ml-auto">
                   Startup Visa Roads was founded on a single premise: Immigration systems are designed to filter out the noise. 
                   To pass through, you must become the signal. We help founders amplify their signal through rigorous business architecture.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. THE ORIGIN STORY (Minimal Text)
      ========================================= */}
      <section className="py-24 px-6 border-b border-[#1a1a1a]/10">
         <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-5xl mb-12 text-center">The Origin</h2>
            <div className="space-y-8 font-serif text-xl md:text-2xl leading-relaxed text-[#1a1a1a]/80">
               <p>
                  In 2024, we noticed a flaw in the global mobility market. Immigration law firms were excellent at filing forms, 
                  but terrible at understanding <span className="italic">venture capital</span>.
               </p>
               <p>
                  Founders were being rejected not because of legal errors, but because their business models 
                  lacked the financial sophistication required by Designated Organizations.
               </p>
               <p className="border-l-4 border-[#CCFF00] pl-6">
                  We built SVR to bridge that gap. We are not lawyers. We are exited founders, investment bankers, 
                  and product strategists who speak the language of innovation.
               </p>
            </div>
         </div>
      </section>

      {/* =========================================
          3. CORE VALUES (Grid)
      ========================================= */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl mb-16">The Code</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               
               <div className="group border border-[#F2F0E9]/20 p-8 hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all duration-300">
                  <Target className="w-10 h-10 mb-6" />
                  <h3 className="font-serif text-2xl mb-4">Precision</h3>
                  <p className="font-sans text-xs opacity-60 leading-relaxed">
                     We do not guess. Every claim in your business plan is backed by verifiable market data and citations.
                  </p>
               </div>

               <div className="group border border-[#F2F0E9]/20 p-8 hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all duration-300">
                  <Globe2 className="w-10 h-10 mb-6" />
                  <h3 className="font-serif text-2xl mb-4">Access</h3>
                  <p className="font-sans text-xs opacity-60 leading-relaxed">
                     We open doors that are closed to the public. Direct lines to Incubator Directors and Angel Groups.
                  </p>
               </div>

               <div className="group border border-[#F2F0E9]/20 p-8 hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all duration-300">
                  <ShieldCheck className="w-10 h-10 mb-6" />
                  <h3 className="font-serif text-2xl mb-4">Integrity</h3>
                  <p className="font-sans text-xs opacity-60 leading-relaxed">
                     We turn down 40% of applicants. If we don't believe your case is winnable, we won't take your money.
                  </p>
               </div>

               <div className="group border border-[#F2F0E9]/20 p-8 hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all duration-300">
                  <Award className="w-10 h-10 mb-6" />
                  <h3 className="font-serif text-2xl mb-4">Excellence</h3>
                  <p className="font-sans text-xs opacity-60 leading-relaxed">
                     Good enough is not enough. We aim for the top 1% of applications that get approved without questions.
                  </p>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          4. THE TEAM (Link to Mentorship)
      ========================================= */}
      <section className="py-24 px-6 border-b border-[#1a1a1a]/10">
         <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-center">
               <div className="md:w-1/2">
                  <span className="font-sans text-xs font-bold bg-[#1a1a1a] text-[#F2F0E9] px-2 py-1 mb-6 inline-block uppercase tracking-widest">Leadership</span>
                  <h2 className="font-serif text-5xl mb-6">Built by Builders.</h2>
                  <p className="font-sans text-lg text-[#1a1a1a]/60 mb-8 leading-relaxed">
                     Our team is composed of individuals who have sat on both sides of the table: 
                     as founders seeking funding, and as committee members approving grants.
                  </p>
                  <Link href="/mentorship" className="inline-flex items-center gap-2 border-b-2 border-[#1a1a1a] pb-1 font-bold uppercase tracking-widest hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors">
                     Meet the Committee <ArrowRight size={16}/>
                  </Link>
               </div>
               <div className="md:w-1/2 grid grid-cols-2 gap-4 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="bg-[#1a1a1a] h-40 w-full rounded-sm"></div>
                  <div className="bg-[#CCFF00] h-40 w-full rounded-sm mt-8"></div>
                  <div className="bg-[#1a1a1a] h-40 w-full rounded-sm -mt-8"></div>
                  <div className="bg-[#1a1a1a] h-40 w-full rounded-sm"></div>
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
               Join the ranks.
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
               We accept new clients by application only. Tell us about your project.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
                  Submit Application
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}