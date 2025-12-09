// ============================================================================
// Page: app/mentorship/page.tsx
// Style: Editorial / Art Gallery
// Concept: "The Vanguard" - Transfer of Wisdom
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowDownRight, 
  Check, 
  X,
  Target,
  TrendingUp,
  Lightbulb,
  BadgeDollarSign
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentorship | The Vanguard',
  description: 'One-on-one guidance from founders who have crossed the chasm.',
};

export default function MentorshipPage() {
  
  // Data: Mentors
  const mentors = [
    {
      name: 'Sarah Johnson',
      role: 'SaaS Growth',
      exits: '2 Exits',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
      bio: 'Scaled two SaaS companies to 7-figure ARR. Expert in B2B product-market fit.',
    },
    {
      name: 'Michael Chen',
      role: 'Fintech & VC',
      exits: '3 Exits',
      status: 'Waitlist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
      bio: 'Former VC partner. Specializes in financial modeling and exit strategy.',
    },
    {
      name: 'Priya Sharma',
      role: 'Deep Tech / AI',
      exits: '1 IPO',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
      bio: 'Built AI products for Fortune 500s. Focus on technical founders and R&D.',
    },
  ];

  // Data: Focus Areas
  const focusAreas = [
    {
      id: "01",
      icon: <Target className="w-6 h-6"/>,
      title: 'Business Architecture',
      desc: 'Refining the canvas. Revenue modeling. Market positioning.',
    },
    {
      id: "02",
      icon: <TrendingUp className="w-6 h-6"/>,
      title: 'Growth Engines',
      desc: 'CAC/LTV optimization. Channel strategy. Scaling operations.',
    },
    {
      id: "03",
      icon: <Lightbulb className="w-6 h-6"/>,
      title: 'Product Validation',
      desc: 'MVP scoping. User research loops. Feature prioritization.',
    },
    {
      id: "04",
      icon: <BadgeDollarSign className="w-6 h-6"/>,
      title: 'Capital Strategy',
      desc: 'Pitch deck narrative. Investor targeting. Cap table math.',
    },
  ];

  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: THE VANGUARD
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#1a1a1a]"></span>
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">One-on-One Advisory</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            THE <br/>
            <span className="pl-[10vw] italic text-[#1a1a1a]/40">VANGUARD.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
             <div>
                <p className="font-serif text-3xl md:text-4xl leading-tight">
                   Access the <span className="bg-[#CCFF00] px-2">tacit knowledge</span> of founders who have successfully navigated the visa gauntlet.
                </p>
             </div>
             <div className="flex flex-col gap-6">
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify max-w-md ml-auto">
                   Theory is cheap. Experience is expensive. Our mentorship program pairs you with 
                   exited founders and operators who don't just teach—they critique, refine, and open doors.
                </p>
                <div className="ml-auto">
                   <Link href="/contact" className="inline-flex items-center gap-2 border-b-2 border-[#1a1a1a] pb-1 font-bold uppercase tracking-widest hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors">
                      Apply for Access <ArrowRight size={16}/>
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. WHY IT MATTERS (The Triptych)
      ========================================= */}
      <section className="py-24 px-6 border-b border-[#1a1a1a]/10">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
               
               <div className="group">
                  <span className="font-sans text-xs font-bold bg-[#CCFF00] px-2 py-1 mb-6 inline-block">VELOCITY</span>
                  <h3 className="font-serif text-3xl mb-4">Accelerate</h3>
                  <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">
                     Collapse years of trial and error into months. Avoid the "fatal errors" that get applications rejected.
                  </p>
               </div>

               <div className="group">
                  <span className="font-sans text-xs font-bold bg-[#1a1a1a] text-[#F2F0E9] px-2 py-1 mb-6 inline-block">CLARITY</span>
                  <h3 className="font-serif text-3xl mb-4">Accountability</h3>
                  <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">
                     Weekly sprints and brutal honesty. We don't tell you what you want to hear; we tell you what is required to win.
                  </p>
               </div>

               <div className="group">
                  <span className="font-sans text-xs font-bold border border-[#1a1a1a] px-2 py-1 mb-6 inline-block">ACCESS</span>
                  <h3 className="font-serif text-3xl mb-4">Network</h3>
                  <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">
                     Warm introductions to the people who matter: Incubator directors, angel investors, and legal counsel.
                  </p>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          3. THE ROSTER (Mentors)
      ========================================= */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
               <h2 className="font-serif text-5xl md:text-6xl">The Roster</h2>
               <p className="font-sans text-xs uppercase tracking-widest opacity-60 mt-4 md:mt-0">
                  Select Availability Only
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {mentors.map((mentor, i) => (
                  <div key={i} className="group cursor-pointer">
                     {/* Image Container */}
                     <div className="relative aspect-[3/4] overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-700 ease-out">
                        <Image 
                           src={mentor.image} 
                           alt={mentor.name}
                           fill
                           className="object-cover"
                        />
                        {/* Status Tag */}
                        <div className="absolute top-4 right-4">
                           <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 ${
                              mentor.status === 'Available' ? 'bg-[#CCFF00] text-[#1a1a1a]' : 'bg-white text-black'
                           }`}>
                              {mentor.status}
                           </span>
                        </div>
                     </div>
                     
                     {/* Info */}
                     <div className="border-t border-[#F2F0E9]/20 pt-6 group-hover:border-[#CCFF00] transition-colors">
                        <div className="flex justify-between items-baseline mb-2">
                           <h3 className="font-serif text-2xl">{mentor.name}</h3>
                           <span className="font-sans text-xs font-bold text-[#CCFF00]">{mentor.exits}</span>
                        </div>
                        <p className="font-sans text-xs uppercase tracking-widest opacity-60 mb-4">{mentor.role}</p>
                        <p className="font-serif text-lg opacity-80 leading-relaxed">
                           {mentor.bio}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* =========================================
          4. CURRICULUM (Focus Areas)
      ========================================= */}
      <section className="py-0 border-b border-[#1a1a1a]">
         <div className="grid grid-cols-1 md:grid-cols-2">
            {focusAreas.map((area, i) => (
               <div key={i} className="group border-b md:border-b-0 border-[#1a1a1a] odd:border-r p-12 hover:bg-[#CCFF00] transition-colors duration-300">
                  <div className="flex justify-between items-start mb-8">
                     <span className="font-sans text-xs font-bold bg-[#1a1a1a] text-[#F2F0E9] px-2 py-1">{area.id}</span>
                     <div className="text-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowDownRight size={24}/>
                     </div>
                  </div>
                  <h3 className="font-serif text-3xl mb-4">{area.title}</h3>
                  <p className="font-sans text-sm text-[#1a1a1a]/60 group-hover:text-[#1a1a1a] leading-relaxed max-w-sm">
                     {area.desc}
                  </p>
               </div>
            ))}
         </div>
      </section>

      {/* =========================================
          5. STRUCTURE (Timeline)
      ========================================= */}
      <section className="py-24 px-6 bg-[#F2F0E9]">
         <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-4xl mb-16 text-center">Program Architecture</h2>
            
            <div className="relative border-l border-[#1a1a1a] ml-4 md:ml-0 space-y-12">
               {[
                  { title: "The Audit", desc: "Deep dive into your business, goals, and immigration timeline. Matching with the specific mentor." },
                  { title: "The Sprint", desc: "Bi-weekly 90-minute sessions. Structured agenda. Action items. No fluff." },
                  { title: "The Hotline", desc: "Async access via WhatsApp/Slack for urgent blockers between sessions." },
                  { title: "The Review", desc: "Monthly milestone tracking against the 'Letter of Support' requirements." }
               ].map((step, i) => (
                  <div key={i} className="relative pl-12">
                     {/* Dot */}
                     <div className="absolute -left-[5px] top-2 w-[9px] h-[9px] bg-[#1a1a1a] rounded-full ring-4 ring-[#F2F0E9]"></div>
                     
                     <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-2">
                        <span className="font-sans text-xs font-bold text-[#CCFF00] bg-[#1a1a1a] px-2 py-1 w-fit">PHASE 0{i+1}</span>
                        <h3 className="font-serif text-2xl">{step.title}</h3>
                     </div>
                     <p className="font-sans text-sm text-[#1a1a1a]/60 max-w-xl">
                        {step.desc}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* =========================================
          6. TESTIMONIALS (Pull Quotes)
      ========================================= */}
      <section className="py-24 px-6 bg-white border-y border-[#1a1a1a]/10">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
               
               <div className="relative">
                  <span className="text-9xl font-serif text-[#1a1a1a]/5 absolute -top-10 -left-6 leading-none">“</span>
                  <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-8 relative z-10">
                     The mentorship program was invaluable. Sarah helped me rewrite my entire financial model. 
                     The designated organization approved us in <span className="underline decoration-[#CCFF00]">3 weeks</span>.
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#CCFF00] font-bold">AK</div>
                     <div>
                        <p className="font-bold font-sans text-sm uppercase">Alex K.</p>
                        <p className="text-xs text-[#1a1a1a]/50">SaaS Founder • Canada SUV</p>
                     </div>
                  </div>
               </div>

               <div className="relative">
                  <span className="text-9xl font-serif text-[#1a1a1a]/5 absolute -top-10 -left-6 leading-none">“</span>
                  <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-8 relative z-10">
                     I didn't need a cheerleader; I needed a strategist. 
                     Michael tore apart my pitch deck and helped me rebuild it. 
                     It was brutal, and it was exactly what I needed.
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#CCFF00] font-bold">MP</div>
                     <div>
                        <p className="font-bold font-sans text-sm uppercase">Maria P.</p>
                        <p className="text-xs text-[#1a1a1a]/50">Fintech Founder • Netherlands</p>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          7. CTA
      ========================================= */}
      <section className="py-32 px-6 text-center">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl md:text-6xl mb-8">
               Ready to work?
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
               Our mentors accept a limited number of founders per quarter. Application required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
                  Apply for Mentorship
               </Link>
               <Link href="/services" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
                  View All Services
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}