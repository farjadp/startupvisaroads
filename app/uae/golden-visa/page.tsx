// ============================================================================
// Page: app/uae/golden-visa/page.tsx
// Style: "Dubai Minimal" (Editorial Black & Gold)
// Vibe: Tax-Free, Ultra-Modern, Prestige
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Check, 
  Minus,
  Diamond,
  Building2,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UAE Golden Visa | The 10-Year Residency',
  description: 'Strategic advisory for the UAE Golden Visa (Entrepreneur Category).',
};

export default function UAEGoldenVisaPage() {
  return (
    <div className="w-full bg-[#0a0a0a] text-[#F2F0E9]">

      {/* =========================================
          1. HERO: NIGHT MODE LUXURY
      ========================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-center px-6 pt-32 pb-20 border-b border-[#D4AF37]/20">
        
        {/* Abstract Gold Background Effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto relative z-10">
          
          <div className="flex items-center gap-4 mb-12">
             <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
             <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Middle East HQ</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12 text-white">
            DUBAI <br/>
            <span className="pl-[5vw] italic text-[#D4AF37]">GOLDEN.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
             <div className="lg:col-span-6">
                <p className="font-serif text-3xl md:text-5xl leading-tight text-[#F2F0E9]">
                   10-Year Residency. <br/>
                   <span className="text-[#D4AF37]">0% Personal Tax.</span> <br/>
                   100% Ownership.
                </p>
             </div>
             <div className="lg:col-span-6 flex flex-col gap-8">
                <p className="font-sans text-sm text-[#F2F0E9]/60 leading-relaxed text-justify border-l border-[#D4AF37]/30 pl-6">
                   The UAE Golden Visa is not just a residency permit; it is a declaration of status. 
                   Designed for investors, entrepreneurs, and exceptional talents who wish to make Dubai their global headquarters.
                   We handle the corporate structuring and nomination process.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                   <Link href="/contact" className="bg-[#D4AF37] text-black px-10 py-5 font-sans text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors text-center">
                      Verify Eligibility
                   </Link>
                   <div className="flex items-center gap-4 px-6 text-[#D4AF37]">
                      <Diamond size={20} />
                      <span className="font-sans text-xs uppercase tracking-widest">Premium Processing</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>


      {/* =========================================
          2. THE LIFESTYLE GRID (Visuals)
      ========================================= */}
      <section className="py-0">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-auto md:h-[400px]">
            
            {/* Stat 1 */}
            <div className="bg-[#111] p-10 border-r border-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black transition-all duration-500 group flex flex-col justify-between">
               <Building2 className="w-8 h-8 text-[#D4AF37] group-hover:text-black mb-4" />
               <div>
                  <h3 className="font-serif text-4xl mb-2">10 Years</h3>
                  <p className="font-sans text-xs uppercase tracking-widest opacity-60">Renewable Residency</p>
               </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-[#0a0a0a] p-10 border-r border-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black transition-all duration-500 group flex flex-col justify-between">
               <Landmark className="w-8 h-8 text-[#D4AF37] group-hover:text-black mb-4" />
               <div>
                  <h3 className="font-serif text-4xl mb-2">0% Tax</h3>
                  <p className="font-sans text-xs uppercase tracking-widest opacity-60">Personal Income</p>
               </div>
            </div>

            {/* Image 1 */}
            <div className="relative h-[300px] md:h-auto group overflow-hidden">
               <Image 
                  src="https://images.unsplash.com/photo-1518684079-3c830dcef6c5?q=80&w=2000&auto=format&fit=crop"
                  alt="Dubai Architecture"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
               />
               <div className="absolute inset-0 bg-[#0a0a0a]/20 group-hover:bg-transparent transition-colors"></div>
            </div>

            {/* Image 2 */}
            <div className="relative h-[300px] md:h-auto group overflow-hidden">
               <Image 
                  src="https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=1974&auto=format&fit=crop"
                  alt="Luxury Business"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
               />
               <div className="absolute inset-0 bg-[#0a0a0a]/20 group-hover:bg-transparent transition-colors"></div>
            </div>

         </div>
      </section>


      {/* =========================================
          3. ELIGIBILITY CRITERIA (Editorial List)
      ========================================= */}
      <section className="py-32 px-6">
         <div className="container mx-auto max-w-5xl">
            <div className="mb-20">
               <h2 className="font-serif text-5xl mb-6">The Requirements</h2>
               <p className="font-sans text-[#F2F0E9]/60 text-lg">
                  The "Entrepreneur" category is distinct from real estate investment. 
                  You must prove innovation and economic contribution.
               </p>
            </div>

            <div className="space-y-0 border-t border-[#D4AF37]/20">
               {[
                  { title: "Technical Project", desc: "Must own an economic project of a technical or future nature based on risk & innovation." },
                  { title: "Auditor Approval", desc: "Capital valuation of min AED 500,000 confirmed by an accredited auditor in the UAE." },
                  { title: "Incubator Nomination", desc: "Must secure an approval letter from a certified business incubator in Dubai or Abu Dhabi." },
                  { title: "Ownership", desc: "The applicant must be the owner or a partner in the startup." }
               ].map((item, i) => (
                  <div key={i} className="group border-b border-[#D4AF37]/20 py-10 flex flex-col md:flex-row md:items-start gap-8 hover:bg-[#D4AF37]/5 transition-colors">
                     <span className="font-sans text-xs font-bold text-[#D4AF37] border border-[#D4AF37] px-2 py-1 h-fit whitespace-nowrap">CRITERIA 0{i+1}</span>
                     <div>
                        <h3 className="font-serif text-3xl mb-3 group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                        <p className="font-sans text-sm text-[#F2F0E9]/60 leading-relaxed max-w-2xl">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>


      {/* =========================================
          4. OUR STRATEGY: "The Setup"
      ========================================= */}
      <section className="py-24 bg-[#F2F0E9] text-[#0a0a0a]">
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-20">
               
               <div className="lg:w-1/2">
                  <h2 className="font-serif text-5xl mb-8">
                     Corporate <br/> Architecture.
                  </h2>
                  <p className="font-sans text-lg text-[#0a0a0a]/70 leading-relaxed mb-8">
                     Getting the visa is the easy part. Setting up the company correctly is where most fail. 
                     Mainland vs. Free Zone? Corporate Tax implications? Banking access?
                  </p>
                  <p className="font-sans text-lg text-[#0a0a0a]/70 leading-relaxed mb-8">
                     We don't just process a visa application. We set up your entire UAE operational infrastructure.
                  </p>
                  <Link href="/contact" className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs border-b border-[#0a0a0a] pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                     View Setup Packages <ArrowRight size={16}/>
                  </Link>
               </div>

               <div className="lg:w-1/2 grid grid-cols-1 gap-6">
                  <div className="bg-white p-8 shadow-sm">
                     <ShieldCheck className="w-8 h-8 text-[#D4AF37] mb-4" />
                     <h4 className="font-serif text-2xl mb-2">Free Zone Setup</h4>
                     <p className="font-sans text-sm text-[#0a0a0a]/60">Optimization for international trade. 100% foreign ownership. No customs duties.</p>
                  </div>
                  <div className="bg-white p-8 shadow-sm">
                     <Building2 className="w-8 h-8 text-[#D4AF37] mb-4" />
                     <h4 className="font-serif text-2xl mb-2">Mainland Setup</h4>
                     <p className="font-sans text-sm text-[#0a0a0a]/60">Direct access to local UAE market. Ability to bid on government contracts.</p>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          5. CTA: GOLDEN TICKET
      ========================================= */}
      <section className="py-32 px-6 text-center">
         <div className="container mx-auto max-w-4xl border border-[#D4AF37]/30 p-12 relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D4AF37]/10 blur-[100px]"></div>

            <div className="relative z-10">
               <h2 className="font-serif text-4xl md:text-6xl mb-8">
                  The Gateway to the Middle East.
               </h2>
               <p className="font-sans text-[#F2F0E9]/60 mb-10 text-lg">
                  Stop paying taxes on your global income. Secure your legacy today.
               </p>
               <Link href="/contact" className="bg-[#D4AF37] text-black px-12 py-5 font-sans font-bold uppercase tracking-widest hover:bg-white transition-colors">
                  Apply for Nomination
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}