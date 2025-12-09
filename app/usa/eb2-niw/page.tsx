// ============================================================================
// Page: app/usa/eb2-niw/page.tsx
// Style: "Ivy League" (Academic, prestigious, navy & cream)
// Focus: Merit-based immigration, Technical Writing
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Scale, 
  ScrollText, 
  ArrowRight, 
  Landmark, 
  BookOpen, 
  ShieldAlert,
  GraduationCap,
  Award,
  FileText
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'USA EB-2 NIW | National Interest Waiver',
  description: 'Expert endeavor crafting for professionals bypassing the PERM process.',
};

export default function EB2NIWPage() {
  return (
    <div className="w-full bg-[#FCFBF9] text-[#0f172a]">

      {/* =========================================
          1. HERO: THE AMERICAN MERITOCRACY
      ========================================= */}
      <section className="relative min-h-[80vh] flex items-center pt-32 pb-20 px-6 border-b border-[#0f172a]/10">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           
           {/* Text Content */}
           <div>
              <div className="flex items-center gap-3 mb-6">
                 <span className="w-8 h-[2px] bg-[#b91c1c]"></span> {/* Red accent for USA */}
                 <span className="font-serif text-sm font-bold uppercase tracking-widest text-[#b91c1c]">United States</span>
              </div>
              
              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.9] mb-8 text-[#0f172a]">
                 NATIONAL <br/>
                 INTEREST <br/>
                 <span className="italic text-[#0f172a]/60">WAIVER.</span>
              </h1>
              
              <p className="font-serif text-xl md:text-2xl text-[#0f172a]/70 leading-relaxed mb-10 max-w-lg">
                 The EB-2 NIW allows exceptional professionals to bypass employer sponsorship by proving their work is of "National Importance" to the USA.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                 <Link href="/contact" className="bg-[#0f172a] text-white px-8 py-4 font-serif text-lg hover:bg-[#b91c1c] transition-colors flex items-center justify-center gap-2">
                    Evaluation <ArrowRight size={18}/>
                 </Link>
                 <a href="#dhanasar" className="border border-[#0f172a] text-[#0f172a] px-8 py-4 font-serif text-lg hover:bg-[#0f172a] hover:text-white transition-colors text-center">
                    The 3 Prongs
                 </a>
              </div>
           </div>

           {/* Hero Image (Academic/Statuesque) */}
           <div className="relative h-[600px] w-full hidden lg:block">
              <div className="absolute inset-0 bg-[#0f172a] clip-path-hero z-0"></div>
              <Image 
                 src="https://images.unsplash.com/photo-1555431189-0fabf2667795?q=80&w=1974&auto=format&fit=crop"
                 alt="Library of Congress Architecture"
                 fill
                 className="object-cover mix-blend-overlay opacity-60 grayscale contrast-125"
                 priority
              />
              <div className="absolute bottom-12 left-12 z-10 bg-[#FCFBF9] p-6 max-w-xs border-l-4 border-[#b91c1c] shadow-xl">
                 <p className="font-serif text-lg italic text-[#0f172a]">
                    "Self-sponsorship based on merit, not employment."
                 </p>
              </div>
           </div>

        </div>
      </section>


      {/* =========================================
          2. THE LEGAL FRAMEWORK (DHANASAR)
      ========================================= */}
      <section className="py-24 px-6 bg-white" id="dhanasar">
         <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-20">
               <Scale className="w-12 h-12 mx-auto mb-6 text-[#0f172a]" />
               <h2 className="font-serif text-5xl mb-6">Matter of Dhanasar</h2>
               <p className="font-serif text-xl text-[#0f172a]/60 leading-relaxed">
                  To win an NIW case, your petition must satisfy the three prongs established by the AAO decision in 2016. 
                  We structure your entire business plan around this legal framework.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-[#0f172a]/10 pt-12">
               
               {/* Prong 1 */}
               <div className="group">
                  <span className="font-sans text-xs font-bold text-[#b91c1c] uppercase tracking-widest mb-4 block">Prong I</span>
                  <h3 className="font-serif text-3xl mb-4 group-hover:underline decoration-[#b91c1c] underline-offset-4 decoration-2">Substantial Merit & National Importance</h3>
                  <p className="font-serif text-lg text-[#0f172a]/70">
                     Does your endeavor have broader implications? We connect your work to critical US fields like healthcare, clean energy, or AI safety.
                  </p>
               </div>

               {/* Prong 2 */}
               <div className="group">
                  <span className="font-sans text-xs font-bold text-[#b91c1c] uppercase tracking-widest mb-4 block">Prong II</span>
                  <h3 className="font-serif text-3xl mb-4 group-hover:underline decoration-[#b91c1c] underline-offset-4 decoration-2">Well Positioned to Advance</h3>
                  <p className="font-serif text-lg text-[#0f172a]/70">
                     Are you the right person? We highlight your degrees, citations, patents, and track record to prove you are irreplaceable.
                  </p>
               </div>

               {/* Prong 3 */}
               <div className="group">
                  <span className="font-sans text-xs font-bold text-[#b91c1c] uppercase tracking-widest mb-4 block">Prong III</span>
                  <h3 className="font-serif text-3xl mb-4 group-hover:underline decoration-[#b91c1c] underline-offset-4 decoration-2">Balance of Waiver</h3>
                  <p className="font-serif text-lg text-[#0f172a]/70">
                     Why skip the labor market test? We argue that your contribution is too urgent to wait for a standard PERM process.
                  </p>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          3. WHO QUALIFIES (Academic Grid)
      ========================================= */}
      <section className="py-24 px-6 bg-[#0f172a] text-[#FCFBF9]">
         <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#FCFBF9]/20 pb-8">
               <h2 className="font-serif text-4xl md:text-5xl">Eligible Profiles</h2>
               <p className="font-serif italic opacity-60 text-lg">Advanced Degree or Exceptional Ability</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#FCFBF9]/20 border border-[#FCFBF9]/20">
               {[
                  { icon: <GraduationCap/>, title: "STEM PhDs", desc: "Researchers in critical fields." },
                  { icon: <Award/>, title: "Entrepreneurs", desc: "Founders with US interest." },
                  { icon: <Landmark/>, title: "Pilots", desc: "Addressing national shortage." },
                  { icon: <BookOpen/>, title: "Physicians", desc: "Working in underserved areas." }
               ].map((item, i) => (
                  <div key={i} className="bg-[#0f172a] p-10 hover:bg-[#1e293b] transition-colors group">
                     <div className="mb-6 opacity-50 group-hover:opacity-100 group-hover:text-[#b91c1c] transition-all">
                        {React.cloneElement(item.icon as React.ReactElement, { size: 32 })}
                     </div>
                     <h4 className="font-serif text-2xl mb-2">{item.title}</h4>
                     <p className="font-serif text-sm opacity-60">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          4. THE SERVICE: TECHNICAL WRITING
      ========================================= */}
      <section className="py-24 px-6 bg-[#FCFBF9]">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               
               {/* Visual Document */}
               <div className="relative order-2 lg:order-1">
                  <div className="bg-white p-8 md:p-12 shadow-2xl border border-[#0f172a]/10 relative z-10">
                     <div className="flex justify-between items-center mb-8 border-b border-[#0f172a]/10 pb-4">
                        <div className="flex items-center gap-3">
                           <FileText className="text-[#b91c1c]" />
                           <span className="font-serif font-bold text-xl">Proposed Endeavor</span>
                        </div>
                        <span className="font-mono text-xs text-gray-400">EXHIBIT B</span>
                     </div>
                     <div className="space-y-4 font-serif text-[#0f172a]/80 leading-relaxed">
                        <p className="bg-[#f3f4f6] p-4 border-l-2 border-[#0f172a]">
                           "...the petitioner's research in <span className="font-bold">Generative AI Safety</span> aligns directly with the <span className="italic">Executive Order on Safe, Secure, and Trustworthy AI</span> issued by the White House..."
                        </p>
                        <div className="h-2 bg-gray-100 w-full rounded"></div>
                        <div className="h-2 bg-gray-100 w-5/6 rounded"></div>
                        <div className="h-2 bg-gray-100 w-full rounded"></div>
                     </div>
                  </div>
                  {/* Backdrop */}
                  <div className="absolute top-6 left-6 w-full h-full border-2 border-[#0f172a] z-0"></div>
               </div>

               {/* Content */}
               <div className="order-1 lg:order-2">
                  <h2 className="font-serif text-4xl md:text-5xl mb-6 text-[#0f172a]">
                     We Write for <br/>
                     <span className="text-[#b91c1c]">USCIS Officers.</span>
                  </h2>
                  <p className="font-serif text-xl text-[#0f172a]/70 mb-8 leading-relaxed">
                     An NIW business plan is not a pitch deck. It is a technical legal argument disguised as a business plan.
                  </p>
                  <ul className="space-y-4 font-serif text-lg text-[#0f172a]">
                     <li className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-[#b91c1c] rounded-full"></span>
                        Executive Order Alignment
                     </li>
                     <li className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-[#b91c1c] rounded-full"></span>
                        Industry Citation Analysis
                     </li>
                     <li className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-[#b91c1c] rounded-full"></span>
                        Expert Opinion Drafting
                     </li>
                  </ul>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          5. LEGAL DISCLAIMER (Red Box)
      ========================================= */}
      <section className="py-12 px-6">
         <div className="container mx-auto max-w-4xl">
            <div className="border border-red-200 bg-red-50 p-6 flex gap-4 items-start">
               <ShieldAlert className="shrink-0 text-red-800 w-6 h-6 mt-1" />
               <div className="text-red-900">
                  <h4 className="font-bold font-sans text-xs uppercase tracking-widest mb-2">Non-Legal Service Notice</h4>
                  <p className="font-serif text-sm leading-relaxed">
                     Startup Visa Roads provides <span className="font-bold">technical writing and business consulting</span> services. 
                     The EB-2 NIW petition involves complex legal arguments. We are not a law firm. 
                     We work alongside your retained immigration attorney to ensure the business documentation supports their legal strategy.
                  </p>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-24 px-6 bg-[#0f172a] text-center">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl md:text-6xl text-[#FCFBF9] mb-8">
               Merit. Excellence. <br/> <span className="italic text-[#b91c1c]">Freedom.</span>
            </h2>
            <p className="font-serif text-[#FCFBF9]/60 text-xl mb-12 max-w-2xl mx-auto">
               Evaluate your profile for the National Interest Waiver today.
            </p>
            <Link href="/contact" className="inline-block bg-[#FCFBF9] text-[#0f172a] px-10 py-5 font-serif text-lg font-bold hover:bg-[#b91c1c] hover:text-white transition-colors">
               Schedule Evaluation
            </Link>
         </div>
      </section>

    </div>
  );
}