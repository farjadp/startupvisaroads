// ============================================================================
// Page: app/contact/page.tsx
// Style: Modernist Editorial / "The Legal Ledger"
// Context: Ashavid Inc. Contact & Application Protocol (Expanded)
// ============================================================================

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowDownLeft,
  Copy,
  Check,
  Send,
  FileSearch,
  PenTool,
  Rocket
} from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@ashavid.ca");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Application Received. Reference ID: #ASH-2025-X9");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a] min-h-screen pt-32 pb-0 px-4 md:px-8 max-w-[1600px] mx-auto">
      
      {/* =========================================
          1. HEADER: THE DECLARATION
      ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 border-b border-[#1a1a1a] pb-12">
         <div className="lg:col-span-8">
            <h1 className="font-serif text-[10vw] leading-[0.8] tracking-tighter mb-8">
               MAKE <br/>
               <span className="italic text-[#1a1a1a]/40 ml-[8vw]">CONTACT.</span>
            </h1>
         </div>
         <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end text-left lg:text-right">
            <p className="font-sans text-sm md:text-base max-w-xs leading-relaxed mb-8">
               We operate by appointment only. 
               Our focus is on high-impact founders building the next generation of digital infrastructure.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#1a1a1a] text-[#F2F0E9] px-3 py-1">
               <span className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></span>
               Accepting Q1 2026 Cohort
            </div>
         </div>
      </div>


      {/* =========================================
          2. THE INTERFACE (Form & Sidebar)
      ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-[#1a1a1a] border border-[#1a1a1a]">
         
         {/* LEFT COLUMN: STATIC DATA */}
         <div className="lg:col-span-4 bg-[#1a1a1a] text-[#F2F0E9] flex flex-col justify-between">
            
            {/* Email Block */}
            <div className="p-12 border-b border-[#F2F0E9]/20 group hover:bg-[#222] transition-colors">
               <span className="font-sans text-xs font-bold text-[#CCFF00] mb-4 block uppercase tracking-widest">Digital Channel</span>
               <div className="flex items-center justify-between cursor-pointer" onClick={copyEmail}>
                  <h3 className="font-serif text-3xl md:text-4xl hover:text-[#CCFF00] transition-colors">
                     hello@ashavid.ca
                  </h3>
                  <button className="text-[#F2F0E9]/40 hover:text-[#CCFF00]">
                     {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
               </div>
            </div>

            {/* Address Block */}
            <div className="p-12 border-b border-[#F2F0E9]/20">
               <span className="font-sans text-xs font-bold text-[#CCFF00] mb-4 block uppercase tracking-widest">Global HQ</span>
               <div className="flex gap-4 items-start">
                  <MapPin className="w-6 h-6 text-[#CCFF00] shrink-0 mt-1" />
                  <address className="not-italic font-sans text-lg opacity-80 leading-relaxed">
                     Ashavid Inc.<br/>
                     Financial District<br/>
                     Toronto, ON, Canada
                  </address>
               </div>
            </div>

            {/* Hours & Socials */}
            <div className="p-12">
               <span className="font-sans text-xs font-bold text-[#CCFF00] mb-4 block uppercase tracking-widest">Operations</span>
               <div className="flex gap-4 items-center mb-8">
                  <Clock className="w-5 h-5 text-[#CCFF00]" />
                  <span className="font-sans text-sm opacity-60">Mon-Fri: 09:00 - 17:00 EST</span>
               </div>
               
               <div className="grid grid-cols-2 gap-4 pt-8 border-t border-[#F2F0E9]/20">
                  <a href="#" className="flex items-center gap-2 hover:text-[#CCFF00] transition-colors font-sans text-sm uppercase tracking-widest">
                     <ArrowDownLeft className="w-4 h-4" /> LinkedIn
                  </a>
                  <a href="#" className="flex items-center gap-2 hover:text-[#CCFF00] transition-colors font-sans text-sm uppercase tracking-widest">
                     <ArrowDownLeft className="w-4 h-4" /> Instagram
                  </a>
               </div>
            </div>
         </div>


         {/* RIGHT COLUMN: THE APPLICATION FORM */}
         <div className="lg:col-span-8 bg-white p-12 lg:p-20">
            
            <div className="mb-16">
               <h2 className="font-serif text-5xl mb-6">Initialize Strategy</h2>
               <p className="font-sans text-[#1a1a1a]/60 text-lg">
                  This form is the first step in our due diligence process. 
                  <span className="bg-[#CCFF00] text-black px-1 mx-1">Privacy is guaranteed.</span>
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-0">
               
               {/* Identity */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-r border-[#1a1a1a]/10">
                  <div className="group border-b border-[#1a1a1a]/10 p-6 focus-within:bg-[#F9F9F9] transition-colors relative">
                     <label className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2 group-focus-within:text-[#1a1a1a]">Full Name</label>
                     <input required type="text" className="w-full bg-transparent font-serif text-2xl focus:outline-none placeholder:text-[#1a1a1a]/10" placeholder="Your Name" />
                  </div>
                  <div className="group border-b border-[#1a1a1a]/10 p-6 focus-within:bg-[#F9F9F9] transition-colors relative">
                     <label className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2 group-focus-within:text-[#1a1a1a]">Company / Startup</label>
                     <input type="text" className="w-full bg-transparent font-serif text-2xl focus:outline-none placeholder:text-[#1a1a1a]/10" placeholder="Current Venture" />
                  </div>
               </div>

               {/* Contact */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-[#1a1a1a]/10">
                  <div className="group border-b border-[#1a1a1a]/10 p-6 focus-within:bg-[#F9F9F9] transition-colors relative">
                     <label className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2 group-focus-within:text-[#1a1a1a]">Email Address</label>
                     <input required type="email" className="w-full bg-transparent font-serif text-2xl focus:outline-none placeholder:text-[#1a1a1a]/10" placeholder="email@domain.com" />
                  </div>
                  <div className="group border-b border-[#1a1a1a]/10 p-6 focus-within:bg-[#F9F9F9] transition-colors relative">
                     <label className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2 group-focus-within:text-[#1a1a1a]">Phone / WhatsApp</label>
                     <input required type="tel" className="w-full bg-transparent font-serif text-2xl focus:outline-none placeholder:text-[#1a1a1a]/10" placeholder="+1 ..." />
                  </div>
               </div>

               {/* Selectors */}
               <div className="group border-x border-b border-[#1a1a1a]/10 p-6 focus-within:bg-[#F9F9F9] transition-colors relative">
                  <label className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2 group-focus-within:text-[#1a1a1a]">Primary Objective</label>
                  <select className="w-full bg-transparent font-serif text-2xl focus:outline-none cursor-pointer appearance-none">
                     <option value="" disabled selected>Select Pathway...</option>
                     <option value="ca">Canada (SUV / ICT / PNP)</option>
                     <option value="au">Australia (NIV Innovation)</option>
                     <option value="uk">UK (Innovator Founder)</option>
                     <option value="eu">Europe (Denmark / Finland)</option>
                     <option value="uae">UAE (Golden Visa)</option>
                     <option value="other">Global Strategy Audit</option>
                  </select>
                  <ArrowDownLeft className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a1a]/20 pointer-events-none" />
               </div>

               {/* Vision */}
               <div className="group border-x border-b border-[#1a1a1a]/10 p-6 focus-within:bg-[#F9F9F9] transition-colors relative h-64">
                  <label className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4 group-focus-within:text-[#1a1a1a]">The Brief</label>
                  <textarea required className="w-full h-full bg-transparent font-serif text-xl focus:outline-none resize-none placeholder:text-[#1a1a1a]/10 leading-relaxed" placeholder="Describe your business model, current traction, and capital availability..."></textarea>
               </div>

               {/* Action */}
               <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#1a1a1a] text-[#F2F0E9] py-8 text-xl font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all flex items-center justify-center gap-4 group mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {isSubmitting ? "Transmitting..." : "Submit Inquiry"}
                  {!isSubmitting && <Send className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
               </button>

            </form>
         </div>
      </div>


      {/* =========================================
          3. WHAT HAPPENS NEXT (The Protocol)
      ========================================= */}
      <section className="py-32 border-b border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar Title */}
            <div className="lg:col-span-4">
               <h2 className="font-serif text-5xl mb-6">The <br/> Protocol</h2>
               <div className="w-12 h-1 bg-[#CCFF00] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60 max-w-xs">
                  We don't sell visas; we engineer outcomes. Here is how our engagement unfolds after you press submit.
               </p>
            </div>

            {/* Steps */}
            <div className="lg:col-span-8 space-y-12">
               
               <div className="flex gap-8 items-start group">
                  <div className="w-16 h-16 border border-[#1a1a1a] flex items-center justify-center shrink-0 group-hover:bg-[#1a1a1a] group-hover:text-[#CCFF00] transition-colors">
                     <FileSearch className="w-6 h-6" />
                  </div>
                  <div>
                     <span className="font-sans text-xs font-bold text-[#1a1a1a]/40 mb-2 block uppercase tracking-widest">Phase 01</span>
                     <h3 className="font-serif text-3xl mb-2">Forensic Audit</h3>
                     <p className="font-sans text-lg text-[#1a1a1a]/60 leading-relaxed max-w-xl">
                        Our strategists review your profile against federal and provincial mandates. We identify "Red Flags" (Risk) and "Green Zones" (Opportunity) before we even speak.
                     </p>
                  </div>
               </div>

               <div className="flex gap-8 items-start group">
                  <div className="w-16 h-16 border border-[#1a1a1a] flex items-center justify-center shrink-0 group-hover:bg-[#1a1a1a] group-hover:text-[#CCFF00] transition-colors">
                     <PenTool className="w-6 h-6" />
                  </div>
                  <div>
                     <span className="font-sans text-xs font-bold text-[#1a1a1a]/40 mb-2 block uppercase tracking-widest">Phase 02</span>
                     <h3 className="font-serif text-3xl mb-2">Strategy Session</h3>
                     <p className="font-sans text-lg text-[#1a1a1a]/60 leading-relaxed max-w-xl">
                        A 45-minute deep dive. We construct your narrative. Is this a "National Interest" case? Is it a "Significant Benefit" play? We define the legal argument.
                     </p>
                  </div>
               </div>

               <div className="flex gap-8 items-start group">
                  <div className="w-16 h-16 border border-[#1a1a1a] flex items-center justify-center shrink-0 group-hover:bg-[#1a1a1a] group-hover:text-[#CCFF00] transition-colors">
                     <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                     <span className="font-sans text-xs font-bold text-[#1a1a1a]/40 mb-2 block uppercase tracking-widest">Phase 03</span>
                     <h3 className="font-serif text-3xl mb-2">Deployment</h3>
                     <p className="font-sans text-lg text-[#1a1a1a]/60 leading-relaxed max-w-xl">
                        Execution. Business Plan drafting, Financial Modeling, and Legal Submission via our partner law firms. We manage the architecture until you land.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          4. PRE-SUBMISSION FAQ
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div>
               <span className="font-sans text-xs font-bold text-[#CCFF00] mb-4 block uppercase tracking-widest">Clarifications</span>
               <h2 className="font-serif text-5xl mb-8">Before you <br/> apply.</h2>
               <p className="font-sans text-lg opacity-60 leading-relaxed max-w-md">
                  We value clarity over sales. Read this to understand our engagement model.
               </p>
            </div>

            <div className="space-y-8">
               <div className="border-b border-[#F2F0E9]/20 pb-8">
                  <h4 className="font-serif text-2xl mb-2 text-[#CCFF00]">Do you guarantee visas?</h4>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     No. Anyone who does is lying or engaging in fraud. We guarantee the highest standard of documentation and strategy, maximizing your probability of success.
                  </p>
               </div>
               <div className="border-b border-[#F2F0E9]/20 pb-8">
                  <h4 className="font-serif text-2xl mb-2 text-[#CCFF00]">What are the fees?</h4>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     We operate on a retainer basis. Fees vary by jurisdiction and complexity (e.g., SUV vs PNP). A detailed quote is provided after the initial Strategy Session.
                  </p>
               </div>
               <div className="border-b border-[#F2F0E9]/20 pb-8">
                  <h4 className="font-serif text-2xl mb-2 text-[#CCFF00]">Can I bring my co-founders?</h4>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     Yes. Most startup visa programs (Canada, UK, Australia) allow teams of up to 5 founders. We structure the cap table to ensure everyone remains eligible.
                  </p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          5. THE FOOTER MANIFESTO
      ========================================= */}
      <section className="py-32 text-center">
         <p className="font-serif text-3xl md:text-5xl max-w-4xl mx-auto leading-tight">
            "We build the bridges for the <span className="underline decoration-[#CCFF00] underline-offset-8">ambitious</span> to walk across."
         </p>
         <div className="mt-12 flex justify-center">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] opacity-40">
               Ashavid Inc. • Est. 2024
            </span>
         </div>
      </section>

    </div>
  );
}