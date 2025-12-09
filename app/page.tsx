// ============================================================================
// Page: Home
// Style: Typography-driven, Editorial, "Less is More"
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9]">
      
      {/* =========================================
          1. HERO: Big & Bold (No Images)
      ========================================= */}
      <section className="min-h-[80vh] flex flex-col justify-between pb-12">
        
        {/* Top Meta Data */}
        <div className="flex justify-between items-start border-t border-[#1a1a1a] pt-4">
           <span className="font-sans text-xs uppercase tracking-widest">( EST. 2024 )</span>
           <span className="font-sans text-xs uppercase tracking-widest text-right hidden md:block">
              London • Toronto • Amsterdam <br/>
              Dubai
           </span>
        </div>

        {/* Massive Headline */}
        <div className="mt-20">
           <h1 className="font-serif text-[15vw] leading-[0.8] tracking-tighter mix-blend-difference text-[#1a1a1a]">
              BORDER<br/>
              <span className="ml-[15vw] italic font-light text-[#1a1a1a]/60">LESS</span>
           </h1>
        </div>

        {/* Bottom Hero Interactions */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-10 mt-12">
           <div className="max-w-md">
              <p className="font-sans text-lg md:text-xl leading-relaxed">
                 We are the architects of your global expansion. A boutique advisory firm for founders who have outgrown their geography.
              </p>
           </div>
           
           <Link href="/contact" className="group flex items-center gap-4 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-6 rounded-none hover:bg-[#CCFF00] hover:text-black transition-colors duration-300">
              <span className="font-sans font-bold uppercase tracking-wider">Start The Process</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>
      </section>


      {/* =========================================
          2. THE TICKER (Minimal)
      ========================================= */}
      <div className="border-y border-[#1a1a1a] py-6 overflow-hidden">
         <div className="animate-marquee whitespace-nowrap flex gap-24">
            {["Strategy", "Legal", "Capital", "Mobility", "Growth"].map((item, i) => (
               <span key={i} className="font-serif text-4xl md:text-6xl italic text-[#1a1a1a]/20">
                  {item}
               </span>
            ))}
            {["Strategy", "Legal", "Capital", "Mobility", "Growth"].map((item, i) => (
               <span key={`dup-${i}`} className="font-serif text-4xl md:text-6xl italic text-[#1a1a1a]/20">
                  {item}
               </span>
            ))}
         </div>
      </div>


      {/* =========================================
          3. EDITORIAL CONTENT (Grid)
      ========================================= */}
      <section className="py-32">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar / Sticky Title */}
            <div className="lg:col-span-4">
               <div className="sticky top-12">
                  <h2 className="font-serif text-5xl mb-6">The <br/> Methodology</h2>
                  <div className="w-12 h-1 bg-[#CCFF00] mb-6"></div>
                  <p className="font-sans text-sm text-[#1a1a1a]/60 max-w-xs">
                     Our approach is clinical, not administrative. We diagnose your business model's compatibility with global markets before we draft a single document.
                  </p>
               </div>
            </div>

            {/* Content List */}
            <div className="lg:col-span-8 space-y-20">
               
               {/* Item 01 */}
               <div className="group border-b border-[#1a1a1a]/20 pb-12 cursor-pointer">
                  <div className="flex justify-between items-baseline mb-4">
                     <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1">01</span>
                     <ArrowDownRight className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-4xl md:text-6xl mb-4 group-hover:italic transition-all">Audit & Strategy</h3>
                  <p className="font-sans text-lg text-[#1a1a1a]/70 max-w-xl">
                     A ruthless evaluation of your startup's scalability. We identify the weak points in your IP strategy and financial projections before the immigration officer does.
                  </p>
               </div>

               {/* Item 02 */}
               <div className="group border-b border-[#1a1a1a]/20 pb-12 cursor-pointer">
                  <div className="flex justify-between items-baseline mb-4">
                     <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1">02</span>
                     <ArrowDownRight className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-4xl md:text-6xl mb-4 group-hover:italic transition-all">Endorsement</h3>
                  <p className="font-sans text-lg text-[#1a1a1a]/70 max-w-xl">
                     Securing the "Letter of Support". We leverage our deep relationships with Incubators and Angel Networks in Canada and the UK to get your foot in the door.
                  </p>
               </div>

               {/* Item 03 */}
               <div className="group border-b border-[#1a1a1a]/20 pb-12 cursor-pointer">
                  <div className="flex justify-between items-baseline mb-4">
                     <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1">03</span>
                     <ArrowDownRight className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-4xl md:text-6xl mb-4 group-hover:italic transition-all">Deployment</h3>
                  <p className="font-sans text-lg text-[#1a1a1a]/70 max-w-xl">
                     Landing is just the beginning. We handle incorporation, banking setup, and initial hiring to ensure you hit the ground running.
                  </p>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          4. IMAGE / STATEMENT SECTION
      ========================================= */}
      <section className="py-20">
         <div className="relative w-full h-[60vh] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
             {/* This would ideally be a high-grain Black & White photo of architecture */}
             <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125"></div>
             
             <div className="relative z-10 text-center p-8 border border-[#CCFF00]/50 backdrop-blur-sm max-w-3xl">
                <p className="font-serif text-3xl md:text-5xl text-[#F2F0E9] leading-tight italic">
                   "In a world of closed borders, <br/>
                   <span className="text-[#CCFF00] not-italic">audacity</span> is the only visa you need."
                </p>
             </div>
         </div>
      </section>



{/* =========================================
          ADDED SECTION: THE FOUNDER & FAQ
      ========================================= */}
      <section className="py-32 border-t border-[#1a1a1a]/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
           
           {/* Left: Founder Note */}
           <div>
              <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6 inline-block">THE PARTNER</span>
              <h3 className="font-serif text-4xl mb-8 leading-tight">
                 "Immigration is not paperwork. It is <span className="italic border-b-2 border-[#CCFF00]">architecture</span>."
              </h3>
              <div className="font-sans text-lg text-[#1a1a1a]/70 space-y-6 leading-relaxed">
                 <p>
                    Most agencies treat you like a case number. We treat you like a unicorn. 
                    The global market is ruthless, and you need a strategy that covers IP, tax residency, and capital structure.
                 </p>
                 <p>
                    I built SVR to be the firm I wish I had when I was scaling my first company.
                 </p>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                 {/* Placeholder for Signature or Photo */}
                 <div className="w-16 h-16 bg-[#1a1a1a] rounded-full grayscale overflow-hidden">
                    {/* <Image src="/founder.jpg" ... /> */}
                 </div>
                 <div>
                    <p className="font-serif text-xl font-bold">Kaveh R.</p>
                    <p className="font-sans text-xs uppercase tracking-widest text-[#1a1a1a]/50">Managing Partner</p>
                 </div>
              </div>
           </div>

           {/* Right: Minimal FAQ */}
           <div className="space-y-0">
              <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6 inline-block">QUERIES</span>
              
              {[
                 { q: "What is the minimum capital required?", a: "It varies by jurisdiction. For Canada/UK, usually between $50k to $150k in available liquid assets." },
                 { q: "Do you guarantee success?", a: "No one ethically can. However, we audit your case before applying. If we take you on, it's because we see a 95%+ probability." },
                 { q: "Can I bring my co-founders?", a: "Yes. Most programs allow up to 5 co-founders and their families on a single startup application." },
                 { q: "How long is the process?", a: "Expect 12-18 months for Permanent Residency tracks. Work permits can be issued in as little as 3 months." }
              ].map((item, i) => (
                 <div key={i} className="border-b border-[#1a1a1a]/20 py-8 group">
                    <details className="cursor-pointer">
                       <summary className="list-none flex justify-between items-center font-serif text-2xl hover:text-[#555] transition-colors">
                          {item.q}
                          <span className="font-sans text-sm text-[#CCFF00] bg-black px-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                       </summary>
                       <p className="mt-4 font-sans text-[#1a1a1a]/60 leading-relaxed max-w-md">
                          {item.a}
                       </p>
                    </details>
                 </div>
              ))}
           </div>

        </div>
      </section>



      {/* =========================================
          5. FOOTER CTA (Minimal)
      ========================================= */}
      <section className="py-32 flex flex-col items-center justify-center text-center">
         <p className="font-sans text-xs uppercase tracking-[0.3em] mb-6 text-[#1a1a1a]/50">Accepting New Applications</p>
         <Link href="/contact" className="relative group">
            <h2 className="font-serif text-6xl md:text-9xl hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-black hover:to-[#555] transition-all cursor-pointer">
               GET IN TOUCH
            </h2>
            <div className="h-2 w-0 bg-[#CCFF00] group-hover:w-full transition-all duration-500 ease-out mt-4"></div>
         </Link>
      </section>

    </div>
  );
}