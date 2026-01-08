// ============================================================================
// Page: app/startup-visa-canada/page.tsx
// Style: Rich Editorial (Photography + Icons + Typography)
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Check, 
  X,
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Building2, 
  FileCheck,
  Globe2,
  Clock,
  ShieldAlert
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Canada Start-Up Visa Program | The Complete Guide',
  description: 'Secure your Letter of Support and Permanent Residency with Canada’s leading business architects.',
};

export default function CanadaSUVPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: IMMERSIVE PHOTOGRAPHY
      ========================================= */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1506443350257-252d065f4265?q=80&w=2070&auto=format&fit=crop"
            alt="Toronto Financial District"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-[2s] ease-in-out"
            priority
          />
          <div className="absolute inset-0 bg-[#1a1a1a]/70" /> {/* Dark Overlay */}
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
           <div className="flex items-center gap-2 mb-6">
              <span className="bg-[#CCFF00] text-[#1a1a1a] px-3 py-1 text-xs font-bold uppercase tracking-widest">Open for 2025</span>
              <span className="text-[#F2F0E9] text-xs font-bold uppercase tracking-widest border border-[#F2F0E9]/30 px-3 py-1">Direct PR Pathway</span>
           </div>
           
           <h1 className="font-serif text-6xl md:text-8xl text-[#F2F0E9] leading-[1] mb-8">
              Canada <br/>
              Start-Up Visa.
           </h1>
           
           <p className="text-xl text-[#F2F0E9]/80 font-sans max-w-2xl mb-12 leading-relaxed border-l-4 border-[#CCFF00] pl-6">
              Build your legacy in the North. The only federal program offering direct Permanent Residency to 5 co-founders and their families.
           </p>

           <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="bg-[#CCFF00] text-[#1a1a1a] px-8 py-4 font-sans text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2">
                Check Eligibility <ArrowRight className="w-4 h-4"/>
              </Link>
              <a href="#streams" className="border border-[#F2F0E9] text-[#F2F0E9] px-8 py-4 font-sans text-sm font-bold uppercase tracking-widest hover:bg-[#F2F0E9] hover:text-[#1a1a1a] transition-colors flex items-center justify-center">
                Explore Streams
              </a>
           </div>
        </div>

        {/* Floating Stats Strip */}
        <div className="absolute bottom-0 left-0 w-full border-t border-[#F2F0E9]/10 bg-[#1a1a1a]/90 backdrop-blur-md py-6 hidden md:block">
           <div className="container mx-auto px-6 flex justify-between text-[#F2F0E9]">
              <div className="flex items-center gap-4">
                 <Globe2 className="w-8 h-8 text-[#CCFF00]" />
                 <div>
                    <p className="text-2xl font-serif">Top 3</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Global Tech Hubs</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <Users className="w-8 h-8 text-[#CCFF00]" />
                 <div>
                    <p className="text-2xl font-serif">Up to 5</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Founders per Team</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <Clock className="w-8 h-8 text-[#CCFF00]" />
                 <div>
                    <p className="text-2xl font-serif">12-18 Mo</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Avg. Processing</p>
                 </div>
              </div>
           </div>
        </div>
      </section>


      {/* =========================================
          2. THE 3 STREAMS (Visual Cards)
      ========================================= */}
      <section className="py-24 px-6 bg-white" id="streams">
        <div className="container mx-auto">
           <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="font-serif text-5xl mb-6 text-[#1a1a1a]">Designated Organizations</h2>
              <p className="font-sans text-[#1a1a1a]/60 text-lg">
                 You cannot apply directly to the government. You must first secure a <span className="font-bold text-[#1a1a1a]">Letter of Support (LOS)</span> from one of these three regulated groups.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1: Incubator */}
              <div className="group border border-[#1a1a1a]/10 p-8 hover:shadow-2xl hover:border-[#CCFF00] transition-all duration-300 bg-[#F2F0E9]">
                 <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#CCFF00] transition-colors">
                    <Building2 className="w-8 h-8 text-[#CCFF00] group-hover:text-[#1a1a1a]" />
                 </div>
                 <h3 className="font-serif text-3xl mb-4">Incubators</h3>
                 <span className="inline-block bg-[#1a1a1a] text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest px-2 py-1 mb-6">Most Popular</span>
                 <ul className="space-y-3 font-sans text-sm text-[#1a1a1a]/70 mb-8">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> Acceptance into program</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> No minimum investment</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> Focus on early-stage</li>
                 </ul>
              </div>

              {/* Card 2: Angel Investors */}
              <div className="group border border-[#1a1a1a]/10 p-8 hover:shadow-2xl hover:border-[#CCFF00] transition-all duration-300 bg-white relative top-0 md:-top-8">
                 <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#CCFF00] transition-colors">
                    <Users className="w-8 h-8 text-[#CCFF00] group-hover:text-[#1a1a1a]" />
                 </div>
                 <h3 className="font-serif text-3xl mb-4">Angel Groups</h3>
                 <span className="inline-block border border-[#1a1a1a] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest px-2 py-1 mb-6">High Traction</span>
                 <ul className="space-y-3 font-sans text-sm text-[#1a1a1a]/70 mb-8">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> $75,000 CAD Investment</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> Syndication required</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> 10% Equity Exchange</li>
                 </ul>
              </div>

              {/* Card 3: Venture Capital */}
              <div className="group border border-[#1a1a1a]/10 p-8 hover:shadow-2xl hover:border-[#CCFF00] transition-all duration-300 bg-[#F2F0E9]">
                 <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#CCFF00] transition-colors">
                    <TrendingUp className="w-8 h-8 text-[#CCFF00] group-hover:text-[#1a1a1a]" />
                 </div>
                 <h3 className="font-serif text-3xl mb-4">Venture Capital</h3>
                 <span className="inline-block border border-[#1a1a1a] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest px-2 py-1 mb-6">Elite Tier</span>
                 <ul className="space-y-3 font-sans text-sm text-[#1a1a1a]/70 mb-8">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> $200,000 CAD Investment</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> Intense Due Diligence</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> Series A+ Ready</li>
                 </ul>
              </div>

           </div>
        </div>
      </section>


      {/* =========================================
          3. VISUAL STORY: Why Use Us?
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               
               {/* Image Composition */}
               <div className="relative">
                  <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
                     <Image 
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
                        alt="Business Strategy Meeting"
                        fill
                        className="object-cover rounded-sm grayscale contrast-125"
                     />
                     {/* Overlay Graphic */}
                     <div className="absolute -bottom-10 -right-10 bg-[#CCFF00] p-8 rounded-sm text-[#1a1a1a] hidden md:block">
                        <p className="font-serif text-5xl font-bold mb-1">98%</p>
                        <p className="font-sans text-xs font-bold uppercase tracking-widest">Success Rate</p>
                     </div>
                  </div>
               </div>

               {/* Content */}
               <div>
                  <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-tight">
                     Most applications fail before they start.
                  </h2>
                  <p className="font-sans text-lg text-[#F2F0E9]/60 mb-10 leading-relaxed">
                     The #1 reason for rejection is not a bad idea—it's a 
                     <span className="text-[#CCFF00]"> "non-genuine business intent"</span>. 
                     Immigration officers are trained to spot founders who just want a visa.
                  </p>
                  
                  <div className="space-y-6">
                     <div className="flex gap-4 p-4 border border-[#F2F0E9]/10 bg-[#F2F0E9]/5">
                        <ShieldAlert className="w-8 h-8 text-[#CCFF00] shrink-0" />
                        <div>
                           <h4 className="font-serif text-xl mb-2">The "Active Management" Trap</h4>
                           <p className="font-sans text-sm text-[#F2F0E9]/60">We ensure you have the paper trail to prove you are actively managing the business from day one.</p>
                        </div>
                     </div>
                     <div className="flex gap-4 p-4 border border-[#F2F0E9]/10 bg-[#F2F0E9]/5">
                        <FileCheck className="w-8 h-8 text-[#CCFF00] shrink-0" />
                        <div>
                           <h4 className="font-serif text-xl mb-2">IP Ownership Structure</h4>
                           <p className="font-sans text-sm text-[#F2F0E9]/60">We structure your cap table so it satisfies both the investors and the immigration officers.</p>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          4. DETAILED ELIGIBILITY CHECKLIST
      ========================================= */}
      <section className="py-24 px-6 bg-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="text-center mb-16">
               <h2 className="font-serif text-4xl text-[#1a1a1a]">Do you qualify?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                  { title: "Voting Rights", text: "Each applicant must hold at least 10% of voting rights. Total applicants + Org must hold > 50%." },
                  { title: "Language Test", text: "Minimum CLB 5 in English (IELTS) or French. This is a moderate intermediate level." },
                  { title: "Settlement Funds", text: "Proof of funds to support yourself (approx. $13k CAD for 1 person, $25k for family of 4)." },
                  { title: "Letter of Support", text: "Must receive a Commitment Certificate from a designated entity (Our core service)." },
               ].map((item, i) => (
                  <div key={i} className="bg-white p-8 border-t-4 border-[#1a1a1a] hover:border-[#CCFF00] transition-colors shadow-sm">
                     <div className="font-sans text-xs font-bold text-[#1a1a1a]/40 mb-4 uppercase tracking-widest">Requirement 0{i+1}</div>
                     <h3 className="font-serif text-2xl mb-4">{item.title}</h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">{item.text}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          5. THE ROADMAP (Horizontal Scroll/Steps)
      ========================================= */}
      <section className="py-24 bg-white border-y border-[#1a1a1a]/10">
         <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <h2 className="font-serif text-5xl">Execution Roadmap</h2>
               <Link href="/contact" className="hidden md:flex items-center gap-2 font-bold hover:text-[#CCFF00] transition-colors">
                  Download Full PDF <ArrowRight size={16}/>
               </Link>
            </div>

            <div className="relative">
               {/* Connecting Line */}
               <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-[#1a1a1a]/10 z-0"></div>

               <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                  {[
                     { step: "01", label: "Vet", desc: "Viability Audit" },
                     { step: "02", label: "Build", desc: "Docs & Financials" },
                     { step: "03", label: "Pitch", desc: "Interview Prep" },
                     { step: "04", label: "Win", desc: "Letter of Support" },
                     { step: "05", label: "Land", desc: "PR Application" },
                  ].map((item, i) => (
                     <div key={i} className="group">
                        <div className="w-24 h-24 bg-white border border-[#1a1a1a]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1a1a1a] group-hover:border-[#1a1a1a] transition-all">
                           <span className="font-serif text-3xl group-hover:text-[#CCFF00] transition-colors">{item.step}</span>
                        </div>
                        <h4 className="font-bold text-lg mb-2">{item.label}</h4>
                        <p className="text-sm text-[#1a1a1a]/60">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          6. FAQ ACCORDION
      ========================================= */}
      <section className="py-24 px-6 bg-[#F2F0E9]">
         <div className="container mx-auto max-w-3xl">
            <h2 className="font-serif text-4xl mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-2">
               {[
                  { q: "Can I live anywhere in Canada?", a: "Yes, anywhere except the province of Quebec. Quebec has its own immigration programs." },
                  { q: "What happens if my startup fails?", a: "Your Permanent Residency is NOT conditional on the success of the business. As long as you made a genuine effort, your status is safe." },
                  { q: "Do I need a work permit first?", a: "It is optional. You can apply for a closed Work Permit to arrive sooner (3-6 months) while waiting for your PR (12-18 months)." },
                  { q: "How much does your service cost?", a: "We operate on a retainer basis. Costs vary depending on whether you need a full business build-out or just interview prep. Book a call for a quote." }
               ].map((item, i) => (
                  <details key={i} className="group bg-white p-6 border border-[#1a1a1a]/5 open:border-[#1a1a1a] cursor-pointer transition-all">
                     <summary className="flex justify-between items-center font-serif text-xl list-none">
                        {item.q}
                        <span className="text-[#CCFF00] font-bold text-2xl group-open:rotate-45 transition-transform">+</span>
                     </summary>
                     <p className="mt-4 font-sans text-sm text-[#1a1a1a]/70 leading-relaxed">
                        {item.a}
                     </p>
                  </details>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          7. FINAL CTA: BIG IMAGE BACKGROUND
      ========================================= */}
      <section className="relative py-32 flex items-center justify-center">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                alt="Modern Office"
                fill
                className="object-cover brightness-[0.3]"
             />
         </div>

         <div className="relative z-10 text-center container mx-auto px-6">
            <h2 className="font-serif text-5xl md:text-7xl text-white mb-8">
               Your journey begins with <br/>
               <span className="text-[#CCFF00] italic">strategy.</span>
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-10 text-lg">
               Don't leave your legacy to chance. Partner with the architects of global mobility.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#CCFF00] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-white transition-colors">
                  Book Consultation
               </Link>
               <a href="tel:+14376611674" className="border border-white text-white px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-white hover:text-[#1a1a1a] transition-colors">
                  +1 (437) 661 16 74 
               </a>
            </div>
         </div>
      </section>

    </div>
  );
}