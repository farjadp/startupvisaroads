// ============================================================================
// Page: app/europe/finland/page.tsx
// Style: "Nordic Intelligence" (Clean, Tech-Forward, Serene)
// Focus: Business Finland, Fast Track, Ecosystem
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Snowflake, 
  Cpu, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Clock,
  ShieldAlert,
  FileCheck
} from 'lucide-react';
import type { Metadata } from 'next';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Finland Startup Permit | Nordic Advisory',
  description: 'Secure your Business Finland Eligibility Statement. We structure high-growth startups for the Finnish ecosystem.',
};

export default function FinlandPage() {
  return (
    <div className="w-full bg-white">

      {/* =========================================
          1. HERO: The Happiest Tech Hub
      ========================================= */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background - Helsinki Modern Architecture (Oodi Library style) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1548232979-6c557ee14752?q=80&w=2071&auto=format&fit=crop"
            alt="Helsinki Architecture"
            fill
            className="object-cover"
            priority
          />
          {/* Cold Nordic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#0f172a]/60 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
           <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-md mb-8">
                  <Snowflake className="w-4 h-4 text-[#D4AF37] animate-spin-slow" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">The Startup Permit</span>
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl text-white leading-[1.1] mb-8">
                 Innovation at <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a5f3fc]">60° North.</span>
              </h1>
              
              <p className="text-lg text-gray-200 font-light max-w-xl mb-12 leading-relaxed border-l-2 border-[#D4AF37] pl-6">
                 Finland offers a fast-track residency for teams with high-growth potential. 
                 We navigate the <strong>Business Finland</strong> evaluation to secure your Eligibility Statement.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/contact" className="bg-[#D4AF37] text-white px-8 py-4 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-[#0f172a] transition-all duration-300">
                    Assess Eligibility
                  </Link>
                  <Link href="#business-finland" className="flex items-center gap-2 text-white px-4 py-4 font-bold text-sm uppercase tracking-widest hover:text-[#a5f3fc] transition-colors">
                    Requirements <ArrowRight className="w-4 h-4" />
                  </Link>
              </div>
           </div>
        </div>
      </section>

      {/* =========================================
          2. THE GATEKEEPER: Business Finland
      ========================================= */}
      <section id="business-finland" className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               
               {/* Content Side */}
               <div>
                  <h2 className="font-serif text-4xl text-[#0f172a] mb-6">
                     The <span className="text-[#D4AF37]">Eligibility Statement</span> <br/>
                     is Mandatory.
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                     Before you can apply for a residence permit (Migri), your business plan must be approved by <strong>Business Finland</strong>. 
                     They don't care about "small businesses" — they want rapid, international scalability.
                  </p>

                  <div className="space-y-6">
                     {[
                        { title: "Scalable Business Model", desc: "Cannot be a local restaurant or agency. Must target global markets." },
                        { title: "Versatile Team", desc: "Must have at least 2 founders with complementary skills holding >60% equity." },
                        { title: "Financial Runway", desc: "Proof of funds (approx €30k) to sustain the team for the initial phase." }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4 group cursor-default p-4 border border-transparent hover:border-gray-100 rounded-sm hover:shadow-sm transition-all">
                           <div className="mt-1 w-10 h-10 rounded-full bg-[#F0F9FF] flex items-center justify-center group-hover:bg-[#0f172a] transition-colors duration-300 shrink-0">
                              <CheckCircle2 className="w-5 h-5 text-[#0ea5e9] group-hover:text-[#D4AF37]" />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg text-[#0f172a]">{item.title}</h4>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Visual Side: The Document */}
               <div className="relative">
                  <div className="relative z-10 bg-[#0f172a] text-white p-8 rounded-sm shadow-2xl max-w-md mx-auto rotate-1 hover:rotate-0 transition-transform duration-500">
                     <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                           <FileCheck className="w-6 h-6 text-[#D4AF37]" />
                           <span className="font-serif font-bold text-lg">Eligibility Statement</span>
                        </div>
                        <span className="text-xs font-mono text-gray-400">ISSUER: GOV.FI</span>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                           <span className="text-gray-400">Status</span>
                           <span className="text-green-400 font-bold">APPROVED</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-gray-400">Validity</span>
                           <span className="text-white">2 Months</span>
                        </div>
                        <div className="h-px bg-white/10 my-4"></div>
                        <p className="text-sm text-gray-300 italic leading-relaxed">
                           "The team has demonstrated sufficient resources and a credible plan for rapid international growth..."
                        </p>
                     </div>
                  </div>
                  {/* Backdrop */}
                  <div className="absolute top-4 right-4 bottom-[-16px] left-4 border-2 border-[#D4AF37]/30 rounded-sm z-0"></div>
               </div>

            </div>
        </div>
      </section>

      {/* =========================================
          3. OUR SERVICES: The Nordic Strategy
      ========================================= */}
      <section className="py-24 bg-[#0f172a] text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
         
         <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="font-serif text-4xl text-white mb-4">Advisory Services</h2>
               <p className="text-gray-400">
                  We prepare your team for the rigorous standards of the Nordic ecosystem.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Card 1 */}
               <div className="group bg-white/5 border border-white/10 p-8 hover:bg-white hover:text-[#0f172a] transition-all duration-500 rounded-sm">
                  <div className="mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform">
                     <TrendingUp className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-[#0f172a]">Growth Modeling</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-600 leading-relaxed">
                     Business Finland requires proof that you aim for rapid expansion, not steady local income. We build the growth narrative.
                  </p>
               </div>

               {/* Card 2 */}
               <div className="group bg-white/5 border border-white/10 p-8 hover:bg-white hover:text-[#0f172a] transition-all duration-500 rounded-sm">
                  <div className="mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform">
                     <Clock className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-[#0f172a]">The "Fast Track"</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-600 leading-relaxed">
                     Finland offers a unique 2-week processing time (Fast Track) for startup founders. We ensure your documents are ready for this speed.
                  </p>
               </div>

               {/* Card 3 */}
               <div className="group bg-white/5 border border-white/10 p-8 hover:bg-white hover:text-[#0f172a] transition-all duration-500 rounded-sm">
                  <div className="mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform">
                     <Cpu className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-[#0f172a]">Tech Integration</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-600 leading-relaxed">
                     Connecting you with Helsinki's deep-tech hubs (Maria 01, Aalto Startup Center) to strengthen your application's credibility.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* =========================================
          4. WHY FINLAND? (Stats)
      ========================================= */}
      <section className="py-24 bg-[#F8F9FA]">
         <div className="container mx-auto px-6 lg:px-12">
            <h2 className="font-serif text-4xl text-[#0f172a] text-center mb-16">The Finnish Advantage</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
                {[
                    { title: "Happiness Index", val: "#1", desc: "Happiest country in the world for 7 years running." },
                    { title: "Digital Skills", val: "#1", desc: "Europe's most digitally advanced workforce." },
                    { title: "Corporate Tax", val: "20%", desc: "One of the lowest rates in the EU zone." },
                    { title: "Processing", val: "14 Days", desc: "Fast-track service for startup entrepreneurs." }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 hover:bg-blue-50 transition-colors group">
                        <div className="text-4xl font-bold text-[#0f172a] mb-2 font-serif group-hover:text-[#D4AF37] transition-colors">{stat.val}</div>
                        <h4 className="font-bold text-gray-600 text-sm uppercase tracking-wider mb-3">{stat.title}</h4>
                        <p className="text-xs text-gray-500">{stat.desc}</p>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* =========================================
          5. DISCLAIMER
      ========================================= */}
      <section className="py-12 bg-white border-t border-gray-100">
         <div className="container mx-auto px-6 lg:px-12">
            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-sm flex flex-col md:flex-row gap-6 items-start">
               <ShieldAlert className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
               <div className="text-xs text-blue-900/80 leading-relaxed text-justify">
                  <strong>Regulatory Notice:</strong> Startup Visa Roads assists with business model preparation for the Business Finland evaluation. 
                  We are <span className="underline">NOT</span> an immigration law firm. 
                  The Eligibility Statement is a prerequisite, but the final residence permit decision is made by the Finnish Immigration Service (Migri).
               </div>
            </div>
         </div>
      </section>

      {/* =========================================
          6. CTA
      ========================================= */}
      <CTASection
        title="Ready for the Nordic Market?"
        description="Schedule a consultation to evaluate your startup's potential for the Business Finland Eligibility Statement."
        primaryCTA={{ text: 'Book Assessment', link: '/contact' }}
        variant="gradient"
      />

    </div>
  );
}