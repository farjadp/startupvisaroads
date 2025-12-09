// ============================================================================
// Page: app/europe/netherlands/page.tsx
// Style: "Dutch Modernism" (Clean, Structural, Open)
// Focus: Innovation, Facilitators, RVO Criteria
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Lightbulb, 
  Handshake, 
  Rocket, 
  ArrowRight, 
  CheckCircle2, 
  Map, 
  Euro,
  ShieldAlert
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Netherlands Startup Visa | Strategic Advisory',
  description: 'Guidance for the Dutch Startup Visa. We bridge the gap between foreign founders and RVO-recognized facilitators.',
};

export default function NetherlandsPage() {
  return (
    <div className="w-full bg-white">

      {/* =========================================
          1. HERO: The Gateway to Europe
      ========================================= */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background - Amsterdam Canals at Twilight */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1512470876302-972faa2aa9a2?q=80&w=2070&auto=format&fit=crop"
            alt="Amsterdam Architecture"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay: Navy with a hint of warm orange gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/70 to-[#ea580c]/10" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
           <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-md mb-8">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">The Orange Carpet</span>
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl text-white leading-[1.1] mb-8">
                 Launch in the <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fb923c]">Trade Capital.</span>
              </h1>
              
              <p className="text-lg text-gray-200 font-light max-w-xl mb-12 leading-relaxed border-l-2 border-[#D4AF37] pl-6">
                 The Netherlands offers a strategic 1-year residency for founders. 
                 The key? Partnering with an experienced <strong>Facilitator</strong> recognized by the RVO.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/contact" className="bg-white text-[#0f172a] px-8 py-4 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-300">
                    Find Facilitators
                  </Link>
                  <Link href="#requirements" className="flex items-center gap-2 text-white px-4 py-4 font-bold text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors">
                    View RVO Criteria <ArrowRight className="w-4 h-4" />
                  </Link>
              </div>
           </div>
        </div>
      </section>

      {/* =========================================
          2. THE CORE MECHANISM: The Facilitator
      ========================================= */}
      <section id="requirements" className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               
               {/* Visual Side */}
               <div className="relative h-[600px] w-full bg-gray-100 rounded-sm overflow-hidden group">
                  <Image 
                     src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                     alt="Business Collaboration"
                     fill
                     className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#0f172a]/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  
                  {/* Floating Card */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur p-6 border-l-4 border-[#D4AF37] shadow-xl">
                     <div className="flex items-center gap-4 mb-2">
                        <Handshake className="w-6 h-6 text-[#D4AF37]" />
                        <h3 className="font-serif text-xl text-[#0f172a]">The Mentorship Model</h3>
                     </div>
                     <p className="text-sm text-gray-600">
                        You cannot apply alone. You must have a signed agreement with a Dutch facilitator who believes in your potential.
                     </p>
                  </div>
               </div>

               {/* Content Side */}
               <div>
                  <h2 className="font-serif text-4xl text-[#0f172a] mb-6">
                     More than a Visa. <br/>
                     A <span className="text-[#D4AF37]">Partnership.</span>
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                     The Dutch Immigration and Naturalisation Service (IND) relies on the 
                     <strong> Netherlands Enterprise Agency (RVO)</strong> to assess your startup. 
                     However, the RVO relies on recognized Facilitators to vet you first.
                  </p>

                  <div className="space-y-6">
                     {[
                        { title: "Innovative Product", desc: "Must be new to the Netherlands market." },
                        { title: "Step-by-Step Plan", desc: "A concrete roadmap for converting idea to business." },
                        { title: "Financial Resources", desc: "Proof of approx. €15,000 to support yourself." }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4 group cursor-default">
                           <div className="mt-1 w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center group-hover:bg-[#0f172a] transition-colors duration-300">
                              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg text-[#0f172a]">{item.title}</h4>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>
        </div>
      </section>

      {/* =========================================
          3. OUR SERVICES: RVO & Facilitator Alignment
      ========================================= */}
      <section className="py-24 bg-[#0f172a] text-white relative overflow-hidden">
         {/* Background Map Effect */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         
         <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="font-serif text-4xl text-white mb-4">Strategic Alignment</h2>
               <p className="text-gray-400">
                  We prepare your startup to be irresistible to Facilitators and compliant with the RVO.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Card 1 */}
               <div className="group bg-white/5 border border-white/10 p-8 hover:bg-white hover:text-[#0f172a] transition-all duration-500 rounded-sm">
                  <div className="mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform">
                     <Lightbulb className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-[#0f172a]">Innovation Narrative</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-600 leading-relaxed">
                     We craft the narrative that proves your "Innovation" status to the RVO, distinguishing you from standard SMEs.
                  </p>
               </div>

               {/* Card 2 */}
               <div className="group bg-white/5 border border-white/10 p-8 hover:bg-white hover:text-[#0f172a] transition-all duration-500 rounded-sm">
                  <div className="mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform">
                     <Map className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-[#0f172a]">Facilitator Matching</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-600 leading-relaxed">
                     We analyze your sector and match you with the right accelerators or mentors in Amsterdam, Rotterdam, or Eindhoven.
                  </p>
               </div>

               {/* Card 3 */}
               <div className="group bg-white/5 border border-white/10 p-8 hover:bg-white hover:text-[#0f172a] transition-all duration-500 rounded-sm">
                  <div className="mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform">
                     <Euro className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl mb-4 group-hover:text-[#0f172a]">Financial Runway</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-600 leading-relaxed">
                     Structuring your financials to prove solvency without needing immediate revenue, a key requirement for approval.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* =========================================
          4. THE DUTCH ADVANTAGE (Lifestyle)
      ========================================= */}
      <section className="py-24 bg-[#F8F9FA]">
         <div className="container mx-auto px-6 lg:px-12">
            <h2 className="font-serif text-4xl text-[#0f172a] text-center mb-16">Why the Netherlands?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "English Proficiency", val: "#1", desc: "Highest English proficiency in the world (non-native)." },
                    { title: "Digital Infrastructure", val: "99%", desc: "Household broadband penetration." },
                    { title: "EU Gateway", val: "500M", desc: "Consumers accessible within 24 hours." },
                    { title: "30% Ruling", val: "Tax", desc: "Tax-free allowance for skilled expats." }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 border-t-4 border-[#D4AF37] shadow-sm hover:shadow-lg transition-shadow">
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2 font-serif">{stat.val}</div>
                        <h4 className="font-bold text-[#0f172a] text-lg mb-2">{stat.title}</h4>
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
            <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-sm flex flex-col md:flex-row gap-6 items-start">
               <ShieldAlert className="w-6 h-6 text-orange-800 shrink-0 mt-1" />
               <div className="text-xs text-orange-900/80 leading-relaxed text-justify">
                  <strong>Important Notice:</strong> Startup Visa Roads assists in business modeling and facilitator introductions. 
                  We are <span className="underline">NOT</span> an immigration law firm. 
                  Final decisions are made by the IND (Immigration and Naturalisation Service) based on advice from the RVO. 
                  The role of the facilitator is mentorship, not legal sponsorship.
               </div>
            </div>
         </div>
      </section>

      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-24 bg-[#0f172a] text-center">
         <div className="container mx-auto px-6">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
               Your Innovation. <br/>
               <span className="text-[#D4AF37]">European Scale.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
               Book a strategy session to evaluate your startup's eligibility for the Dutch ecosystem.
            </p>
            <Link 
               href="/contact" 
               className="inline-block bg-white text-[#0f172a] px-12 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-colors duration-300"
            >
               Start Assessment
            </Link>
         </div>
      </section>

    </div>
  );
}