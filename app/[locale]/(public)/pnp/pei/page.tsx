// ============================================================================
// Page: app/pnp/pei/page.tsx
// Style: Modernist Editorial (SVR Identity)
// Context: Prince Edward Island (PEI PNP) - Business Impact Category
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Anchor, 
  Fish, 
  Users, 
  Mic2, 
  AlertTriangle,
  Building,
  Briefcase
} from 'lucide-react';
import type { Metadata } from 'next';

import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/pnp/pei', locale);
}

export default function PEIPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE MICRO ECONOMY
      ========================================= */}
      <section className="min-h-[70vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="w-3 h-3 bg-[#CCFF00] border border-[#1a1a1a]"></span>
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Jurisdiction: Prince Edward Island</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12">
           THE MICRO <br/>
           <span className="pl-[10vw] italic text-[#1a1a1a]/40">ECONOMY.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 Canada's smallest province. <br/>
                 Where networking is not a skill, <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">it's survival.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#CCFF00] pl-6">
                 Prince Edward Island (PEI) operates the <strong>Work Permit Stream</strong>. 
                 Unlike larger provinces where you are a file number, in PEI you are a face. 
                 The process culminates in a mandatory interview with the Office of Immigration.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. WORK PERMIT STREAM (The Core)
      ========================================= */}
      <section className="py-24">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">Business Impact Category</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg max-w-2xl">
               The "100% Ownership" and "Partial Ownership" streams have merged into a single performance-based pathway.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 border border-[#1a1a1a]">
            
            {/* LEFT: THE METRICS */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00] mb-2">Requirements</span>
                     <h3 className="font-serif text-4xl">The Thresholds</h3>
                  </div>
                  <Building className="w-12 h-12 text-[#CCFF00]" />
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Net Worth</span>
                     <span className="font-serif text-2xl">$600,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Min Investment</span>
                     <span className="font-serif text-2xl">$150,000 CAD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Education</span>
                     <span className="font-serif text-2xl">High School</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#F2F0E9]/20 pb-4">
                     <span className="font-sans text-sm opacity-60">Age Limit</span>
                     <span className="font-serif text-2xl">21 - 59 Years</span>
                  </div>
               </div>
            </div>

            {/* RIGHT: THE DEAL */}
            <div className="p-12 bg-white text-[#1a1a1a] group relative overflow-hidden">
               <div className="absolute -right-10 top-10 opacity-10">
                  <Anchor className="w-64 h-64 rotate-12" />
               </div>

               <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Structure</span>
                     <h3 className="font-serif text-4xl">Performance</h3>
                  </div>
               </div>

               <div className="space-y-6 relative z-10">
                  <p className="font-sans text-lg leading-relaxed mb-6">
                     PEI no longer accepts deposits for immediate nomination. You sign a <strong>Performance Agreement</strong>.
                  </p>
                  
                  <ul className="space-y-4 font-sans text-sm">
                     <li className="flex gap-4 items-start">
                        <span className="font-bold text-[#CCFF00] bg-black px-2 shrink-0">Step 1</span>
                        <span>Receive Work Permit & Arrive in PEI.</span>
                     </li>
                     <li className="flex gap-4 items-start">
                        <span className="font-bold text-[#CCFF00] bg-black px-2 shrink-0">Step 2</span>
                        <span>Operate business for 12 consecutive months.</span>
                     </li>
                     <li className="flex gap-4 items-start">
                        <span className="font-bold text-[#CCFF00] bg-black px-2 shrink-0">Step 3</span>
                        <span>Submit operating statements (audit) to receive Nomination.</span>
                     </li>
                  </ul>

                  <div className="mt-8 p-4 bg-[#F2F0E9] border border-[#1a1a1a]/20">
                     <p className="text-xs font-bold uppercase mb-1">Key Advantage</p>
                     <p className="font-serif text-xl">Operating expenses count toward the $150k investment.</p>
                  </div>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          3. THE INTERVIEW (Unique to PEI)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="flex flex-col md:flex-row gap-12 items-center">
            
            <div className="md:w-1/2">
               <div className="relative">
                  <div className="aspect-[4/5] bg-[#1a1a1a] relative overflow-hidden">
                     {/* Abstract "Interview" Visual */}
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Mic2 className="w-32 h-32 text-[#CCFF00] opacity-20" />
                     </div>
                     <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black to-transparent">
                        <p className="text-[#F2F0E9] font-serif text-3xl">"Sell us your vision."</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="md:w-1/2">
               <span className="font-sans text-xs font-bold bg-[#CCFF00] text-[#1a1a1a] px-2 py-1 mb-6 inline-block">THE HURDLE</span>
               <h2 className="font-serif text-4xl mb-6">The Interview</h2>
               <p className="font-sans text-lg text-[#1a1a1a]/70 leading-relaxed mb-8">
                  PEI is unique. If your EOI is selected, you must submit a Business Plan and then attend an <strong>in-person interview</strong> with provincial officials.
               </p>
               <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed mb-8">
                  They don't just check your bank account; they check your character. 
                  They assess your language skills, your knowledge of the local market, and your genuine intent to settle on the island.
               </p>
               
               <div className="border-l-4 border-[#1a1a1a] pl-6 py-2">
                  <p className="font-serif text-xl italic">
                     This is not a paper application. It is a pitch meeting.
                  </p>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          4. SECTOR FOCUS (Island Economy)
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto">
            <div className="mb-16">
               <h2 className="font-serif text-4xl text-[#CCFF00] mb-4">Target Sectors</h2>
               <p className="font-sans text-sm opacity-60 max-w-xl">
                  The Island's economy is specialized. While general businesses are accepted, 
                  priority points are given to sectors that drive exports.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                  { title: "Bioscience", desc: "PEI is a hub for chemical & pharmaceutical manufacturing." },
                  { title: "Aerospace", desc: "Surprisingly, PEI's 2nd largest export sector." },
                  { title: "Agriculture", desc: "Potatoes and specialized crop processing." },
                  { title: "Tourism", desc: "Seasonal, but high-volume hospitality ventures." }
               ].map((item, i) => (
                  <div key={i} className="border border-[#F2F0E9]/20 p-8 hover:border-[#CCFF00] transition-colors group">
                     <div className="w-2 h-2 bg-[#CCFF00] rounded-full mb-6 group-hover:w-8 transition-all"></div>
                     <h3 className="font-serif text-2xl mb-4">{item.title}</h3>
                     <p className="font-sans text-sm opacity-60 leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          5. BUSINESS SUCCESSION (Buying a Business)
      ========================================= */}
      <section className="py-24">
         <div className="bg-white border border-[#1a1a1a]/10 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <Briefcase className="w-16 h-16 text-[#1a1a1a]/5" />
            </div>

            <div className="max-w-3xl">
               <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2 block">Priority Pathway</span>
               <h2 className="font-serif text-4xl mb-6">Business Succession</h2>
               <p className="font-sans text-lg text-[#1a1a1a]/70 leading-relaxed mb-8">
                  PEI has an aging population of business owners looking to retire. 
                  Buying an existing business (Succession) is highly favored over starting a new one. 
                  It demonstrates immediate economic stability.
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-[#1a1a1a] p-4 text-center">
                     <span className="block font-bold text-2xl mb-1">Higher</span>
                     <span className="text-xs uppercase opacity-60">EOI Points</span>
                  </div>
                  <div className="border border-[#1a1a1a] p-4 text-center">
                     <span className="block font-bold text-2xl mb-1">Faster</span>
                     <span className="text-xs uppercase opacity-60">Processing</span>
                  </div>
                  <div className="border border-[#1a1a1a] p-4 text-center">
                     <span className="block font-bold text-2xl mb-1">Lower</span>
                     <span className="text-xs uppercase opacity-60">Risk Profile</span>
                  </div>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          6. THE RED ZONE (Ineligible)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
               <div className="flex items-center gap-4 mb-4">
                  <AlertTriangle className="w-8 h-8 text-[#b91c1c]" />
                  <h3 className="font-serif text-3xl">Excluded</h3>
               </div>
               <p className="font-sans text-sm opacity-60">
                  PEI explicitly rejects businesses that do not add value or are strictly passive.
               </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                  "Bed & Breakfasts (unless >5 units & $3M+ revenue)",
                  "Investment Companies / Financial Services",
                  "Construction/Renovation (unless employing 3+ staff)",
                  "Professional Services (Consulting, etc.)",
                  "Real Estate Development",
                  "Payday Loans"
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-[#1a1a1a]/10 pb-3 opacity-60">
                     <span className="font-serif text-lg">{item}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          7. CTA
      ========================================= */}
      <section className="py-32 text-center">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Island Bound?
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            The interview is the hardest part. Our team prepares you for the "Pitch" 
            to ensure your concept aligns with PEI's economic goals.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               Prepare Interview Deck
            </Link>
            <Link href="/pnp" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Compare Other Provinces
            </Link>
         </div>
      </section>

    </div>
  );
}