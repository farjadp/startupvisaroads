// ============================================================================
// Page: app/australia/entrepreneur-stream/page.tsx
// Style: Modernist Editorial + "Ocean & Ochre" Theme
// Context: Australia Country Profile & National Innovation Visa Service
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sun, 
  TrendingUp, 
  Anchor, 
  Award, 
  Globe2, 
  Briefcase,
  Map,
  CheckCircle2
} from 'lucide-react';
import type { Metadata } from 'next';

import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/australia', locale);
}

export default function AustraliaPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE CONTINENT
      ========================================= */}
      <section className="min-h-[85vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10 relative overflow-hidden">
        
        {/* Background Abstract (The Sun) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700] rounded-full blur-[120px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

        <div className="flex items-center gap-4 mb-8 relative z-10">
           <span className="w-3 h-3 bg-[#005555] border border-[#1a1a1a]"></span> {/* Teal for Australia */}
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Destination: Australia</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12 relative z-10">
           SOUTHERN <br/>
           <span className="pl-[10vw] italic text-[#005555]">GIANT.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end relative z-10">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 The only nation that is also a continent. <br/>
                 An economy that hasn't seen a recession in <span className="bg-[#1a1a1a] text-[#FFD700] px-2 italic ml-2">28 years.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#005555] pl-6">
                 Australia is pivoting. Once reliant on mining and tourism, it is now aggressively recruiting global founders to build the next generation of Tech, Green Energy, and Agri-Food unicorns. 
                 The gate is open, but the bar is high.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. COUNTRY STATS (Why Move?)
      ========================================= */}
      <section className="py-24 border-b border-[#1a1a1a]/10">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">Market Metrics</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg">
               Before we talk about visas, let's talk about the market.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#1a1a1a]/10">
            
            {/* Stat 1 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">GDP Per Capita</span>
                  <TrendingUp className="w-6 h-6 text-[#005555]" />
               </div>
               <p className="font-serif text-5xl mb-2">$64,000+</p>
               <p className="font-sans text-sm opacity-60">One of the highest disposable incomes globally.</p>
            </div>

            {/* Stat 2 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Tech Ecosystem</span>
                  <Globe2 className="w-6 h-6 text-[#005555]" />
               </div>
               <p className="font-serif text-5xl mb-2">#5 Global</p>
               <p className="font-sans text-sm opacity-60">Ranked for Fintech and Biotech innovation.</p>
            </div>

            {/* Stat 3 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Lifestyle</span>
                  <Sun className="w-6 h-6 text-[#005555]" />
               </div>
               <p className="font-serif text-5xl mb-2">Top 10</p>
               <p className="font-sans text-sm opacity-60">Melbourne & Sydney consistently rank in "Most Liveable Cities".</p>
            </div>

         </div>
      </section>


      {/* =========================================
          3. THE MIGRATION PATHWAY (The Solution)
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#1a1a1a]">
            
            {/* The Old Way (Context) */}
            <div className="p-12 bg-[#F2F0E9] text-[#1a1a1a]/50 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1a1a1a]">
               <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest mb-4 block line-through">Legacy Pathway</span>
                  <h3 className="font-serif text-4xl mb-6 text-[#1a1a1a]/40 decoration-double line-through">
                     Subclass 188
                  </h3>
                  <p className="font-sans text-sm leading-relaxed mb-8">
                     For years, the "Business Innovation" visa was the standard. It required personal investment ($200k-$5M), operated on a points system, and only granted <strong>Temporary Residence</strong> initially.
                  </p>
               </div>
               <div className="border-t border-[#1a1a1a]/10 pt-4">
                  <span className="font-bold text-xs uppercase tracking-widest text-[#b91c1c]">Discontinued (July 2024)</span>
               </div>
            </div>

            {/* The New Way (The Product) */}
            <div className="p-12 bg-[#005555] text-[#F2F0E9] relative overflow-hidden group">
               {/* Visual Effect */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700] rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
               
               <div className="relative z-10">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#FFD700] mb-4 block">The New Standard</span>
                  <h3 className="font-serif text-4xl mb-6">
                     National Innovation Visa (NIV)
                  </h3>
                  <p className="font-sans text-sm leading-relaxed mb-8 opacity-80">
                     Subclass 858. Australia's answer to the UK Global Talent. 
                     It is designed for "High Performing" founders. It removes the investment minimums and replaces them with <strong>Merit</strong>.
                  </p>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#FFD700]" />
                        <span className="font-bold">Direct Permanent Residency (Day 1)</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#FFD700]" />
                        <span className="font-bold">No Age Limit (Flexible)</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#FFD700]" />
                        <span className="font-bold">No Asset Requirement</span>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          4. WHO IS THIS FOR? (Target Audience)
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 sticky top-24 h-fit">
               <h2 className="font-serif text-4xl mb-6">Ideal <br/> Candidate</h2>
               <div className="w-12 h-1 bg-[#005555] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  The NIV is not for small business owners. It is for "Distinguished Talent". 
                  You must prove you are an asset to the Australian Commonwealth.
               </p>
            </div>

            <div className="lg:col-span-8 space-y-12">
               
               <div className="flex gap-6 items-start">
                  <div className="bg-[#1a1a1a] text-white w-12 h-12 flex items-center justify-center font-serif text-xl shrink-0">01</div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2">Established Founders</h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/70 max-w-xl">
                        You have successfully scaled a startup before. You have exited, or raised significant VC capital (Series A+). 
                        Your name appears in industry press.
                     </p>
                  </div>
               </div>

               <div className="flex gap-6 items-start">
                  <div className="bg-[#1a1a1a] text-white w-12 h-12 flex items-center justify-center font-serif text-xl shrink-0">02</div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2">Sector Specialists</h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/70 max-w-xl">
                        Your expertise aligns with Australia's priority sectors: 
                        <span className="font-bold"> Clean Energy, Defense, AgTech, Health, or Digitech.</span>
                     </p>
                  </div>
               </div>

               <div className="flex gap-6 items-start">
                  <div className="bg-[#1a1a1a] text-white w-12 h-12 flex items-center justify-center font-serif text-xl shrink-0">03</div>
                  <div>
                     <h3 className="font-serif text-2xl mb-2">High Earners</h3>
                     <p className="font-sans text-sm text-[#1a1a1a]/70 max-w-xl">
                        You have the ability to earn at least the "Fair Work High Income Threshold" (approx. $175k AUD/year) in Australia quickly.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          5. THE ECOSYSTEM (Visual)
      ========================================= */}
      <section className="py-24 bg-[#005555] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <h2 className="font-serif text-4xl text-[#FFD700]">The Hubs</h2>
               <p className="font-sans text-sm opacity-60 max-w-md text-right">
                  Australia is federal, but the startup scene is concentrated. <br/>
                  Choose your headquarters.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="border border-[#F2F0E9]/20 p-8 hover:border-[#FFD700] transition-colors group">
                  <Anchor className="w-8 h-8 mb-6 text-[#FFD700]" />
                  <h3 className="font-serif text-2xl mb-2">Sydney (NSW)</h3>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     The financial capital. Home to Canva, Atlassian, and the biggest VC funds. High cost, high density, high reward.
                  </p>
               </div>
               <div className="border border-[#F2F0E9]/20 p-8 hover:border-[#FFD700] transition-colors group">
                  <Briefcase className="w-8 h-8 mb-6 text-[#FFD700]" />
                  <h3 className="font-serif text-2xl mb-2">Melbourne (VIC)</h3>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     The cultural heart. Strong in Biotech, EdTech, and Gaming. A more European vibe with a massive talent pool.
                  </p>
               </div>
               <div className="border border-[#F2F0E9]/20 p-8 hover:border-[#FFD700] transition-colors group">
                  <Sun className="w-8 h-8 mb-6 text-[#FFD700]" />
                  <h3 className="font-serif text-2xl mb-2">Brisbane (QLD)</h3>
                  <p className="font-sans text-sm opacity-60 leading-relaxed">
                     The growth frontier. Hosting the 2032 Olympics. Massive investment in infrastructure and Climate Tech.
                  </p>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          6. SVR SERVICE: THE NOMINATION
      ========================================= */}
      <section className="py-24">
         <div className="flex flex-col md:flex-row gap-12 items-center">
            
            <div className="md:w-1/2">
               <div className="bg-white border border-[#1a1a1a] p-12 shadow-[10px_10px_0px_0px_rgba(0,85,85,1)]">
                  <Award className="w-12 h-12 text-[#005555] mb-6" />
                  <h3 className="font-serif text-3xl mb-4">The Nominator Problem</h3>
                  <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed mb-6">
                     You cannot self-apply. You need a <strong>Nominator</strong>—an Australian citizen, PR, or peak body with a "National Reputation" in your field to attest to your achievements.
                  </p>
                  <div className="bg-[#005555] text-white p-4 text-sm font-bold">
                     SVR Strategy: We connect qualified founders with Australian Incubators and Industry Bodies to secure this nomination.
                  </div>
               </div>
            </div>

            <div className="md:w-1/2">
               <h2 className="font-serif text-4xl mb-6">Our Role</h2>
               <p className="font-sans text-lg text-[#1a1a1a]/70 leading-relaxed mb-8">
                  We are not migration agents; we are business architects. For Australia, we:
               </p>
               <ul className="space-y-4 font-sans text-sm">
                  <li className="flex items-center gap-3">
                     <ArrowRight className="w-4 h-4 text-[#005555]" />
                     <span>Draft the "Asset to Australia" statement.</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <ArrowRight className="w-4 h-4 text-[#005555]" />
                     <span>Build the Portfolio of Achievement (Press/Awards).</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <ArrowRight className="w-4 h-4 text-[#005555]" />
                     <span>Facilitate the Nominator connection.</span>
                  </li>
               </ul>
            </div>

         </div>
      </section>


      {/* =========================================
          7. CTA
      ========================================= */}
      <section className="py-32 text-center border-t border-[#1a1a1a]/10">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            G'day, Future.
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            The National Innovation Visa is the most prestigious visa in the Southern Hemisphere. 
            Do you have the profile to claim it?
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#005555] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors">
               Assess NIV Eligibility
            </Link>
            <Link href="/" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Explore Other Countries
            </Link>
         </div>
      </section>

    </div>
  );
}