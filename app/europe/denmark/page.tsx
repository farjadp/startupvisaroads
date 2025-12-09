// ============================================================================
// Page: app/europe/denmark/page.tsx
// Style: "Scandi-Minimal Luxury" (Cool Tones + Gold)
// Focus: Innovation, Expert Panel, Nordic Lifestyle
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Lightbulb, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  FileCheck,
  ShieldAlert
} from 'lucide-react';
import type { Metadata } from 'next';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Denmark Start-Up Visa | Nordic Business Advisory',
  description: 'Guidance for the "Start-up Denmark" expert panel evaluation. innovative business modeling for the Nordic market.',
};

export default function DenmarkStartupPage() {
  return (
    <div className="w-full bg-white">

      {/* =========================================
          1. HERO: Nordic Innovation
      ========================================= */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background - Copenhagen Modern Architecture */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070&auto=format&fit=crop"
            alt="Copenhagen Architecture"
            fill
            className="object-cover"
            priority
          />
          {/* Cool Blue/Navy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/60 to-[#0f172a]/30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
           <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-md mb-8">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">Start-up Denmark</span>
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl text-white leading-[1.1] mb-8">
                 Innovate in the <br/>
                 <span className="italic font-light text-[#D4AF37]">Happiest Nation.</span>
              </h1>
              
              <p className="text-lg text-gray-200 font-light max-w-xl mb-12 leading-relaxed border-l-2 border-[#D4AF37] pl-6">
                 Denmark's visa program is unique: it requires approval from an independent <strong>Expert Panel</strong>. 
                 We refine your business model to meet their high standards for innovation and scalability.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/contact" className="bg-white text-[#0f172a] px-8 py-4 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-300">
                    Validate Concept
                  </Link>
                  <Link href="#expert-panel" className="flex items-center gap-2 text-white px-4 py-4 font-bold text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors">
                    View Requirements <ArrowRight className="w-4 h-4" />
                  </Link>
              </div>
           </div>
        </div>
      </section>

      {/* =========================================
          2. THE HURDLE: The Expert Panel
      ========================================= */}
      <section id="expert-panel" className="py-24 bg-[#F8F9FA]">
        <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <div className="max-w-2xl">
                  <h2 className="font-serif text-4xl text-[#0f172a] mb-4">The Expert Panel Review</h2>
                  <p className="text-gray-500 leading-relaxed">
                     Unlike other countries where immigration officers decide, Denmark uses a panel of industry leaders. 
                     Your business plan must read like a VC pitch, not a visa application.
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Criterion 1 */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-[#0f172a] text-white flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#D4AF37] transition-colors">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-xl text-[#0f172a] mb-3">Genuine Innovation</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Are you introducing a new product, service, or process? The panel rejects generic consulting, retail, or import/export businesses.
                    </p>
                </div>

                {/* Criterion 2 */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-[#0f172a] text-white flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#D4AF37] transition-colors">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-xl text-[#0f172a] mb-3">High Scalability</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Does your business have the potential for rapid growth and job creation in Denmark? It must go beyond a "lifestyle business."
                    </p>
                </div>

                {/* Criterion 3 */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-[#0f172a] text-white flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#D4AF37] transition-colors">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-xl text-[#0f172a] mb-3">Team Capability</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Does the founding team possess the technical and commercial skills to execute? The panel evaluates the founders as much as the idea.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* =========================================
          3. OUR SERVICES: Nordic Strategy
      ========================================= */}
      <section className="py-24 bg-[#0f172a] text-white relative overflow-hidden">
         {/* Minimalist Grid Pattern */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
         
         <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="font-serif text-4xl text-white mb-4">Nordic Market Advisory</h2>
               <p className="text-gray-400">
                  We prepare your startup for the Danish ecosystem.
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               {/* Service List */}
               <div className="space-y-6">
                  {[
                     { title: "Business Plan Optimization", desc: "Refining your value proposition for the Danish market context." },
                     { title: "Financial Forecasting", desc: "Demonstrating 12-month runway capability (approx. 140,000 DKK)." },
                     { title: "Pitch Deck Creation", desc: "Visualizing your data for the 5-week expert panel review." },
                     { title: "Digitization Strategy", desc: "Aligning your operations with Denmark's digital-first economy." }
                  ].map((item, i) => (
                     <div key={i} className="flex gap-6 p-6 border border-white/10 hover:bg-white/5 transition-colors rounded-sm group cursor-pointer">
                        <div className="mt-1 text-[#D4AF37]">
                           <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                           <h4 className="font-bold text-lg mb-2 text-white">{item.title}</h4>
                           <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Visual Feature */}
               <div className="relative h-full min-h-[400px] bg-gradient-to-br from-[#1a2c4e] to-[#0f172a] border border-white/10 p-8 flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                     <FileCheck className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-serif text-3xl mb-2">96%</h3>
                  <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-6">Document Acceptance Rate</p>
                  <p className="text-gray-400 text-sm max-w-xs">
                     Our clients' business plans consistently meet the strict formatting and content requirements of the Danish Business Authority.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* =========================================
          4. WHY DENMARK? (Lifestyle)
      ========================================= */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <div className="relative h-[500px] w-full">
                  <Image 
                     src="https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1974&auto=format&fit=crop" 
                     alt="Danish Design & Lifestyle"
                     fill
                     className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#F8F9FA] border border-gray-100 p-6 flex flex-col justify-center z-10 shadow-lg">
                     <span className="text-4xl font-serif text-[#0f172a] mb-2">#1</span>
                     <span className="text-xs text-gray-500 uppercase tracking-wider">Ease of Business <br/> (Europe)</span>
                  </div>
               </div>
               
               <div>
                  <h2 className="font-serif text-4xl text-[#0f172a] mb-6">
                     Gateway to <br/>
                     <span className="text-[#D4AF37]">Scandinavia.</span>
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                     Denmark isn't just about Hygge. It's a digital powerhouse. 
                     With a flat corporate hierarchy, English as the business language, 
                     and access to the entire EU market, it is the ideal launchpad for tech and design startups.
                  </p>
                  <ul className="space-y-4">
                     {[
                        "2 Years Residency (Extendable)",
                        "Family Members Included",
                        "Access to Free Healthcare & Education",
                        "No Minimum Investment Amount"
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-[#0f172a] font-medium">
                           <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* =========================================
          5. DISCLAIMER
      ========================================= */}
      <section className="py-12 bg-[#F8F9FA] border-t border-gray-200">
         <div className="container mx-auto px-6 lg:px-12">
            <div className="flex gap-4 items-start max-w-4xl mx-auto opacity-70 hover:opacity-100 transition-opacity">
               <ShieldAlert className="w-6 h-6 text-[#0f172a] shrink-0 mt-1" />
               <p className="text-xs text-gray-500 leading-relaxed text-justify">
                  <strong>Regulatory Notice:</strong> Startup Visa Roads assists with business model innovation, market research, and panel presentation. 
                  We are <span className="underline">NOT</span> an immigration law firm or a recruitment agency. 
                  Approval by the expert panel does not guarantee a visa; final residency decisions are made by SIRI (Danish Agency for International Recruitment and Integration).
                  Legal filings must be handled by qualified professionals.
               </p>
            </div>
         </div>
      </section>

      {/* =========================================
          6. CTA
      ========================================= */}
      <CTASection
        title="Ready to Scale in Copenhagen?"
        description="Schedule a consultation to assess your innovation against Expert Panel criteria."
        primaryCTA={{ text: 'Book Assessment', link: '/contact' }}
        variant="gradient"
      />
    </div>
  );
}