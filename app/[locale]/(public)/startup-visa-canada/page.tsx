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

import { metaFor } from '@/lib/pageMeta';
import BookingCTA from '@/components/BookingCTA';
import {
  SUV_ORGS,
  SUV_RULES,
  SUV_SOURCES,
  SUV_STATE,
  SUV_UNOFFICIAL,
  SUV_SETTLEMENT_FUNDS,
  SUV_SETTLEMENT_FUNDS_UPDATED,
  SUV_VERIFIED,
} from '@/lib/canada-suv';

const cad = (n: number) => `$${n.toLocaleString('en-CA')}`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/startup-visa-canada', locale);
}

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
            unoptimized
            className="object-cover grayscale hover:grayscale-0 transition-all duration-[2s] ease-in-out"
            priority
          />
          <div className="absolute inset-0 bg-[#1a1a1a]/70" /> {/* Dark Overlay */}
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
           <div className="flex items-center gap-2 mb-6">
              <span className="bg-[#b91c1c] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                 <ShieldAlert size={14}/> Program Paused
              </span>
              <span className="text-[#F2F0E9] text-xs font-bold uppercase tracking-widest border border-[#F2F0E9]/30 px-3 py-1">No new applications</span>
           </div>
           
           <h1 className="font-serif text-6xl md:text-8xl text-[#F2F0E9] leading-[1] mb-8">
              Canada <br/>
              Start-Up Visa.
           </h1>
           
           <p className="text-xl text-[#F2F0E9]/80 font-sans max-w-2xl mb-12 leading-relaxed border-l-4 border-[#b91c1c] pl-6">
              IRCC paused the Start-up Visa Program on 30 June 2026 and is not accepting new applications. Applications filed before that date are still being processed, and if you are eligible you can still apply for an <span className="text-[#CCFF00]">open work permit</span> while yours is assessed. There is no way to start a new Start-up Visa application today.{' '}
              <a href={SUV_SOURCES.program} target="_blank" rel="noreferrer" className="underline decoration-[#F2F0E9]/40 hover:text-[#CCFF00]">IRCC, Start-up Visa Program</a>.
           </p>

           <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="bg-[#CCFF00] text-[#1a1a1a] px-8 py-4 font-sans text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2">
                See routes open today <ArrowRight className="w-4 h-4"/>
              </Link>
              <a href="#streams" className="border border-[#F2F0E9] text-[#F2F0E9] px-8 py-4 font-sans text-sm font-bold uppercase tracking-widest hover:bg-[#F2F0E9] hover:text-[#1a1a1a] transition-colors flex items-center justify-center">
                How the program worked
              </a>
           </div>
        </div>

        {/* Floating Stats Strip */}
        <div className="absolute bottom-0 left-0 w-full border-t border-[#F2F0E9]/10 bg-[#1a1a1a]/90 backdrop-blur-md py-6 hidden md:block">
           <div className="container mx-auto px-6 flex justify-between text-[#F2F0E9]">
              <div className="flex items-center gap-4">
                 <Globe2 className="w-8 h-8 text-[#CCFF00]" />
                 <div>
                    <p className="text-2xl font-serif">Paused</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Since 30 Jun 2026</p>
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
                    <p className="text-2xl font-serif">CLB {SUV_RULES.language.benchmark}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">All four abilities</p>
                 </div>
              </div>
           </div>
        </div>
      </section>


      {/* =========================================
          1b. REFERENCE NOTICE
          Everything below describes the programme as it stood before the
          pause. Without this band the page reads as a live application
          guide for a programme that cannot be applied to.
      ========================================= */}
      <section className="bg-[#1a1a1a] text-[#F2F0E9] py-8 px-6">
         <div className="container mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <ShieldAlert className="w-8 h-8 text-[#CCFF00] shrink-0" />
            <p className="font-sans text-sm text-[#F2F0E9]/70 leading-relaxed">
               <span className="font-bold text-[#F2F0E9]">Everything below describes how the Start-up Visa worked before it was paused.</span>{' '}
               We keep it for two readers: anyone with an application already in progress, and anyone comparing it with the entrepreneur pilot IRCC says will replace it. The requirements below do not apply to that pilot, which IRCC has not published yet.
            </p>
            <Link href="/which-path" className="shrink-0 bg-[#CCFF00] text-[#1a1a1a] px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors text-center">
               Routes open today
            </Link>
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
                 You could never apply directly to the government. You first needed a <span className="font-bold text-[#1a1a1a]">Letter of Support</span> from an organisation on IRCC&rsquo;s list, which then sent a commitment certificate to IRCC directly. Taking on new founders is <span className="font-bold text-[#1a1a1a]">paused</span> for these organisations too.
              </p>
              <p className="font-sans text-[#1a1a1a]/50 text-sm mt-4">
                 Two rules that decided more applications than the investment amounts: since {new Date(SUV_ORGS.capInForceSince).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric' })} IRCC considered only {SUV_ORGS.groupApplicationsPerOrganisationPerYear} complete group applications per organisation per year, returning later ones and reimbursing the fees; and a group counted against that cap even when one member failed the completeness check.{' '}
                 <a href={SUV_SOURCES.eligibility} target="_blank" rel="noreferrer" className="underline hover:text-[#1a1a1a]">IRCC, who can apply</a>.
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
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> Acceptance into the program</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> No investment required of you</li>
                    <li className="flex items-start gap-2"><X className="w-4 h-4 text-[#b91c1c] shrink-0 mt-0.5"/> <span>IRCC prioritised incubators holding {cad(SUV_ORGS.incubatorPriorityCommittedCapital)} committed capital, so the rest were a slower lane</span></li>
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
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> {cad(SUV_ORGS.angelMinimum)} CAD confirmed investment</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> Group must be on IRCC&rsquo;s list</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> Eligible for priority processing</li>
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
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> {cad(SUV_ORGS.ventureCapitalMinimum)} CAD confirmed investment</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> Intense due diligence</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1a1a1a]"/> Eligible for priority processing</li>
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
                        unoptimized
                        className="object-cover rounded-sm grayscale contrast-125"
                     />
                     {/* Overlay Graphic */}
                     <div className="absolute -bottom-10 -right-10 bg-[#CCFF00] p-8 rounded-sm text-[#1a1a1a] hidden md:block">
                        <p className="font-serif text-5xl font-bold mb-1">&gt;{SUV_RULES.minCombinedVotingRights}%</p>
                        <p className="font-sans text-xs font-bold uppercase tracking-widest max-w-[10rem] leading-snug">Voting rights applicants and the organisation had to hold together</p>
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
                           <p className="font-sans text-sm text-[#F2F0E9]/60">Approval came with obligations: incorporate in Canada, manage the business from inside Canada, and keep an essential part of operations there. We build the paper trail that shows it.</p>
                        </div>
                     </div>
                     <div className="flex gap-4 p-4 border border-[#F2F0E9]/10 bg-[#F2F0E9]/5">
                        <FileCheck className="w-8 h-8 text-[#CCFF00] shrink-0" />
                        <div>
                           <h4 className="font-serif text-xl mb-2">IP Ownership Structure</h4>
                           <p className="font-sans text-sm text-[#F2F0E9]/60">We structure the cap table so it clears the voting-rights rules &mdash; {SUV_RULES.minVotingRightsPerApplicant}% each, more than {SUV_RULES.minCombinedVotingRights}% together with the organisation &mdash; and still survives an investor&rsquo;s diligence.</p>
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
               <h2 className="font-serif text-4xl text-[#1a1a1a] mb-4">What the program required</h2>
               <p className="font-sans text-[#1a1a1a]/60 max-w-2xl mx-auto">
                  Figures below are IRCC&rsquo;s own, read from canada.ca on {new Date(SUV_VERIFIED).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric' })}.
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                  { title: "Voting Rights", text: `Each applicant had to hold at least ${SUV_RULES.minVotingRightsPerApplicant}% of the total voting rights, and the applicants together with the designated organisation more than ${SUV_RULES.minCombinedVotingRights}%. Up to ${SUV_RULES.maxOwnersPerBusiness} owners could apply on one business.` },
                  { title: "Language Test", text: `Canadian Language Benchmark ${SUV_RULES.language.benchmark} in all four abilities — listening, reading, writing and speaking — in English or French, from an approved test.` },
                  { title: "Settlement Funds", text: `Proof of funds you did not borrow: ${cad(SUV_SETTLEMENT_FUNDS[1])} for one person, ${cad(SUV_SETTLEMENT_FUNDS[4])} for a family of four. IRCC's table, updated ${new Date(SUV_SETTLEMENT_FUNDS_UPDATED).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric' })}, and revised yearly.` },
                  { title: "Letter of Support", text: "A designated organisation had to support the business and send a commitment certificate to IRCC directly. Outside Quebec only — Quebec runs its own programmes." },
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
               <h2 className="font-serif text-5xl">How an application was built</h2>
               <Link href="/contact" className="hidden md:flex items-center gap-2 font-bold hover:text-[#CCFF00] transition-colors">
                  Ask us about your file <ArrowRight size={16}/>
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
                  {
                     q: "Can I apply for the Start-up Visa today?",
                     a: `No. IRCC paused the program on 30 June 2026 and is not accepting new applications. The last route in required a valid ${SUV_STATE.lastIntake.certificateYear} commitment certificate and a filing by that date. Anyone offering to register you for the Start-up Visa, or to reserve you a place in the program that replaces it, is selling something that does not exist.`,
                  },
                  {
                     q: "I already applied. What happens to my file?",
                     a: "IRCC says it will keep processing applications it accepted before 30 June 2026. A pause is not a refusal. It does not shorten the queue either, and IRCC's own processing-time figure for this program is not being published at the moment, so we will not quote one.",
                  },
                  {
                     q: "Can I still get a work permit?",
                     a: "IRCC's pages say that if you are eligible you can still apply for an open work permit so you can work while your application is processed — an open permit, not one tied to a single employer. Extending an existing Start-up Visa work permit is a separate route and is marked closed to new applicants, so it is for people who already hold one. Check both against IRCC before acting.",
                  },
                  {
                     q: "What is the pilot that replaces it?",
                     a: `IRCC has said the pause is a transition to ${SUV_UNOFFICIAL.replacementName}, with details to be announced. It has not published a cap, a processing target, eligibility criteria or an opening date. Figures in circulation — a cap of around ${SUV_UNOFFICIAL.reportedOnly.annualCap.toLocaleString('en-CA')} a year, a ${SUV_UNOFFICIAL.reportedOnly.processingTargetMonths}-month target — come from ${SUV_UNOFFICIAL.reportedOnly.attribution}, not from IRCC. You cannot plan on them.`,
                  },
                  {
                     q: "Could I live anywhere in Canada?",
                     a: "Anywhere except Quebec, which selects its own economic immigrants under its own programs.",
                  },
                  {
                     q: "What if the startup failed after approval?",
                     a: "Permanent residence granted under this program was not conditional on the business succeeding. That is not the same as nothing being asked of you: approval came with obligations to incorporate in Canada, manage the business from inside Canada and keep an essential part of operations there. A file that misstated any of it is a different question, and one for a lawyer rather than for us.",
                  },
                  {
                     q: "How much does your service cost?",
                     a: "On a retainer, and it depends on whether you need the business built from scratch or only interview preparation. Book a call and we will quote your case rather than a range that fits nobody.",
                  },
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
          6b. SOURCES
      ========================================= */}
      <section className="py-16 px-6 bg-white border-t border-[#1a1a1a]/10">
         <div className="container mx-auto max-w-3xl">
            <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-6">Sources</h2>
            <p className="font-sans text-sm text-[#1a1a1a]/60 mb-4">
               Every status, rule and figure on this page is Immigration, Refugees and Citizenship Canada&rsquo;s own, read on {new Date(SUV_VERIFIED).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric' })}. Where we state an opinion we say so. Verify before you act &mdash; IRCC revises these pages without notice.
            </p>
            <ul className="font-sans text-sm space-y-2">
               {[
                  { label: 'Start-up Visa Program — status', href: SUV_SOURCES.program },
                  { label: 'Who can apply — eligibility and settlement funds', href: SUV_SOURCES.eligibility },
                  { label: 'List of designated organizations and priority processing', href: SUV_SOURCES.designatedOrganizations },
                  { label: 'How to apply', href: SUV_SOURCES.apply },
               ].map((src) => (
                  <li key={src.href}>
                     <a href={src.href} target="_blank" rel="noreferrer" className="text-[#1a1a1a] underline decoration-[#1a1a1a]/30 hover:decoration-[#1a1a1a] break-words">
                        {src.label}
                     </a>
                  </li>
               ))}
            </ul>
         </div>
      </section>

      <BookingCTA />

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
                unoptimized
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
               <Link href="/book-meeting" className="bg-[#CCFF00] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-white transition-colors">
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