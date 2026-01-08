// ============================================================================
// Page: app/mentorship/page.tsx
// Style: Editorial / Art Gallery
// Content: Full Team Roster (12 Members)
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Target, 
  TrendingUp, 
  ShieldCheck,
  Users
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Board | SVR',
  description: 'Meet the evaluation committee and strategic advisors.',
};

export default function MentorshipPage() {
  
  // Data: The Full Team Roster
  const team = [
    {
      name: 'Arash Raeitian',
      role: 'Startup Evaluation',
      bio: 'Lead assessor for business viability and program eligibility. Ensures concepts meet the "Innovation" criteria.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop'
    },
    {
      name: 'Mohammad Bostanian',
      role: 'Technical Lead',
      bio: 'Oversees technical due diligence, product architecture reviews, and R&D feasibility analysis.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop'
    },
    {
      name: 'Hadi Rad',
      role: 'Entrepreneurship Committee',
      bio: 'Guiding founders on mindset, leadership, and the psychological resilience required for global expansion.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop'
    },
    {
      name: 'Erfan Nikbakht',
      role: 'Risk & Investment',
      bio: 'Specialist in risk mitigation strategies and structuring deals to meet investor compliance standards.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop'
    },
    {
      name: 'Yazdan Salehi',
      role: 'Business Development',
      bio: 'Architecting go-to-market strategies and strategic partnerships for North American market entry.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop'
    },
    {
      name: 'Farjad',
      role: 'Product Strategy (CSO)',
      bio: 'Defining product roadmaps and aligning MVP features with market demands and user needs.',
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop'
    },
    {
      name: 'Mohsen',
      role: 'Legal Advisor',
      bio: 'Ensuring corporate governance and regulatory compliance throughout the structuring process.',
      image: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=1887&auto=format&fit=crop'
    },
    {
      name: 'Mohammadreza',
      role: 'Financial Analyst',
      bio: 'Building robust 5-year financial models, cash flow projections, and valuation assessments.',
      image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=2080&auto=format&fit=crop'
    },
    {
      name: 'Mohammad Ali',
      role: 'Market Research',
      bio: 'Conducting deep-dive market analysis (TAM/SAM/SOM) and competitive landscape auditing.',
      image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop'
    },
    {
      name: 'Pouria',
      role: 'Operations Manager',
      bio: 'Streamlining execution, timeline management, and ensuring seamless delivery of client milestones.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop'
    },
    {
      name: 'Iman',
      role: 'VC Relations',
      bio: 'Managing relationships with Venture Capital firms and Angel Groups to facilitate introductions.',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=1887&auto=format&fit=crop'
    },
    {
      name: 'Meysam',
      role: 'Scale-Up Mentor',
      bio: 'Advising post-revenue startups on growth hacking, scaling teams, and international acquisition.',
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=2070&auto=format&fit=crop'
    },
  ];

  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: THE COLLECTIVE
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#1a1a1a]"></span>
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">The Committee</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            THE <br/>
            <span className="pl-[10vw] italic text-[#1a1a1a]/40">MASTHEAD.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
             <div>
                <p className="font-serif text-3xl md:text-4xl leading-tight">
                   A multidisciplinary council of <span className="bg-[#CCFF00] px-2">12 specialists</span> architecting your global entry.
                </p>
             </div>
             <div className="flex flex-col gap-6">
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify max-w-md ml-auto">
                   We don't rely on generalists. Each aspect of your startup—from Technical Feasibility to Financial Modeling—is scrutinized by a dedicated domain expert before it ever reaches a Designated Organization.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. THE ROSTER (Grid Layout)
      ========================================= */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="mb-20">
               <h2 className="font-serif text-5xl md:text-6xl mb-6">Executive Team</h2>
               <p className="font-sans text-xs uppercase tracking-widest opacity-60">
                  Leadership & Advisory Board
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
               {team.map((member, i) => (
                  <div key={i} className="group">
                     {/* Image (Grayscale to Color interaction) */}
                     <div className="relative aspect-[4/5] overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out border-b-4 border-[#CCFF00]/0 group-hover:border-[#CCFF00] group-hover:-translate-y-2">
                        <Image 
                           src={member.image} 
                           alt={member.name}
                           fill
                           className="object-cover"
                        />
                     </div>
                     
                     {/* Text Info */}
                     <div className="pr-4">
                        <h3 className="font-serif text-2xl mb-2 text-[#F2F0E9]">{member.name}</h3>
                        <p className="font-sans text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-4 border-b border-[#F2F0E9]/10 pb-4 inline-block">
                           {member.role}
                        </p>
                        <p className="font-serif text-sm opacity-60 leading-relaxed">
                           {member.bio}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* =========================================
          3. EXPERTISE BREAKDOWN (Why this team matters)
      ========================================= */}
      <section className="py-24 px-6 border-b border-[#1a1a1a]/10">
         <div className="container mx-auto">
            <h2 className="font-serif text-4xl mb-16 text-center">Comprehensive Coverage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               
               <div className="bg-white p-8 border border-[#1a1a1a]/5 hover:border-[#1a1a1a] transition-colors">
                  <Target className="w-8 h-8 text-[#CCFF00] mb-6 bg-[#1a1a1a] p-1 rounded-full" />
                  <h3 className="font-serif text-xl mb-3">Evaluation</h3>
                  <p className="font-sans text-xs text-[#1a1a1a]/60 leading-relaxed">
                     Led by Arash Raeitian. Ensuring your business concept passes the stringent "Innovation" & "Scalability" tests.
                  </p>
               </div>

               <div className="bg-white p-8 border border-[#1a1a1a]/5 hover:border-[#1a1a1a] transition-colors">
                  <TrendingUp className="w-8 h-8 text-[#CCFF00] mb-6 bg-[#1a1a1a] p-1 rounded-full" />
                  <h3 className="font-serif text-xl mb-3">Strategy</h3>
                  <p className="font-sans text-xs text-[#1a1a1a]/60 leading-relaxed">
                     Led by Farjad & Yazdan. Aligning product roadmap with North American market demands.
                  </p>
               </div>

               <div className="bg-white p-8 border border-[#1a1a1a]/5 hover:border-[#1a1a1a] transition-colors">
                  <ShieldCheck className="w-8 h-8 text-[#CCFF00] mb-6 bg-[#1a1a1a] p-1 rounded-full" />
                  <h3 className="font-serif text-xl mb-3">Compliance</h3>
                  <p className="font-sans text-xs text-[#1a1a1a]/60 leading-relaxed">
                     Led by Mohsen & Erfan. Structuring deals to minimize risk and ensure regulatory adherence.
                  </p>
               </div>

               <div className="bg-white p-8 border border-[#1a1a1a]/5 hover:border-[#1a1a1a] transition-colors">
                  <Users className="w-8 h-8 text-[#CCFF00] mb-6 bg-[#1a1a1a] p-1 rounded-full" />
                  <h3 className="font-serif text-xl mb-3">Execution</h3>
                  <p className="font-sans text-xs text-[#1a1a1a]/60 leading-relaxed">
                     Led by Pouria & Iman. Operational excellence and connecting you with the right VC partners.
                  </p>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          4. CTA
      ========================================= */}
      <section className="py-32 px-6 text-center">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl md:text-6xl mb-8">
               Work with the best.
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
               Our committee reviews applications on a rolling basis. Slots are limited.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
                  Schedule Evaluation
               </Link>
               <Link href="/services" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
                  View Services
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}