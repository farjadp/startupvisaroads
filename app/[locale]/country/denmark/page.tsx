// ============================================================================
// Page: app/denmark/page.tsx
// Style: Modernist Editorial + "Nordic Ice" Theme
// Context: Denmark Country Profile & Start-up Denmark Visa Advisory
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Wind, 
  Thermometer, 
  Building, 
  CheckCircle, 
  Users, 
  Lightbulb,
  Anchor
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Denmark | The Innovation Kingdom',
  description: 'Start-up Denmark Visa. Access the world’s most digitized economy and #1 ease of doing business.',
};

export default function DenmarkPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: NORDIC PRECISION
      ========================================= */}
      <section className="min-h-[85vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10 relative overflow-hidden">
        
        {/* Background Abstract (Ice Blue Glow) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#AEC6CF] rounded-full blur-[120px] opacity-30 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

        <div className="flex items-center gap-4 mb-8 relative z-10">
           <span className="w-3 h-3 bg-[#003D73] border border-[#1a1a1a]"></span> {/* Danish Deep Blue */}
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Destination: Denmark</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12 relative z-10">
           NORDIC <br/>
           <span className="pl-[10vw] italic text-[#003D73]">PRECISION.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end relative z-10">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 #1 in Europe for Ease of Doing Business. <br/>
                 Where design meets <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic ml-2">functionality.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#003D73] pl-6">
                 Denmark is not for everyone. It is for founders who value work-life balance as much as EBITDA. 
                 The <strong>Start-up Denmark</strong> visa is one of the few government-run programs that allows direct entry for non-EU entrepreneurs, provided your idea can pass the rigorous Expert Panel.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. MARKET METRICS (The Welfare State)
      ========================================= */}
      <section className="py-24 border-b border-[#1a1a1a]/10">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">The Ecosystem</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg">
               Small population, massive output. A test-bed for the world's greenest technologies.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#1a1a1a]/10">
            
            {/* Stat 1 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Digitization</span>
                  <Lightbulb className="w-6 h-6 text-[#003D73]" />
               </div>
               <p className="font-serif text-5xl mb-2">#1 Global</p>
               <p className="font-sans text-sm opacity-60">The world's most digital public sector. Open a company in minutes.</p>
            </div>

            {/* Stat 2 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Green Tech</span>
                  <Wind className="w-6 h-6 text-[#003D73]" />
               </div>
               <p className="font-serif text-5xl mb-2">50%+</p>
               <p className="font-sans text-sm opacity-60">Of electricity comes from wind and solar. Home to Vestas and Ørsted.</p>
            </div>

            {/* Stat 3 */}
            <div className="border-r border-b border-[#1a1a1a]/10 p-10 hover:bg-white transition-colors group">
               <div className="flex justify-between mb-6">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">Corporate Tax</span>
                  <Building className="w-6 h-6 text-[#003D73]" />
               </div>
               <p className="font-serif text-5xl mb-2">22%</p>
               <p className="font-sans text-sm opacity-60">Competitive within the EU, with extensive R&D tax incentives.</p>
            </div>

         </div>
      </section>


      {/* =========================================
          3. THE PROGRAM: START-UP DENMARK
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#1a1a1a]">
            
            {/* THE CHALLENGE (The Panel) */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#F2F0E9] group">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-col">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest mb-2 text-[#1a1a1a]/40">The Hurdle</span>
                     <h3 className="font-serif text-4xl mb-2">The Expert Panel</h3>
                     <span className="text-xs font-bold uppercase tracking-widest text-[#003D73] bg-[#003D73]/10 px-2 py-1 w-fit">Evaluation Mandatory</span>
                  </div>
                  <Users className="w-12 h-12 text-[#1a1a1a]/20" />
               </div>

               <p className="font-sans text-sm opacity-70 mb-8 leading-relaxed">
                  You cannot just "buy" your way in. Your business plan is reviewed by an independent panel of Danish business leaders. 
                  They look for <strong>Innovation</strong> (is it new?), <strong>Scalability</strong> (can it grow globally?), and <strong>Team</strong> (can you execute?).
               </p>

               <ul className="space-y-3 font-sans text-sm opacity-60">
                  <li className="flex gap-3"><span className="text-[#b91c1c] font-bold">X</span> No Restaurants or Retail</li>
                  <li className="flex gap-3"><span className="text-[#b91c1c] font-bold">X</span> No Import/Export Agencies</li>
                  <li className="flex gap-3"><span className="text-[#b91c1c] font-bold">X</span> No Consultancy Firms</li>
               </ul>
            </div>

            {/* THE REWARD (The Visa) */}
            <div className="p-12 bg-[#003D73] text-[#F2F0E9] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-[#AEC6CF] rounded-bl-full opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                     <div className="flex flex-col">
                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#AEC6CF] mb-2">The Permit</span>
                        <h3 className="font-serif text-4xl mb-2">Start-up Denmark</h3>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Residence & Work Permit</span>
                     </div>
                     <Anchor className="w-12 h-12 text-[#AEC6CF]" />
                  </div>

                  <p className="font-sans text-sm opacity-80 mb-8 leading-relaxed">
                     Once approved, you receive a 2-year renewable residence permit. 
                     You can bring your family. You get access to free healthcare and education immediately.
                  </p>
                  
                  <div className="bg-[#1a1a1a]/30 p-6 backdrop-blur-sm border border-[#AEC6CF]/20">
                     <p className="font-bold text-sm mb-2">Financial Requirement (2025)</p>
                     <div className="flex justify-between items-center">
                        <span className="text-xs opacity-70">Single Applicant</span>
                        <span className="font-serif text-xl">~153,240 DKK</span>
                     </div>
                     <div className="flex justify-between items-center mt-2">
                        <span className="text-xs opacity-70">Couple</span>
                        <span className="font-serif text-xl">~306,480 DKK</span>
                     </div>
                     <p className="text-[10px] mt-4 opacity-50 italic">*Must be held in bank account.</p>
                  </div>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          4. STRATEGIC SECTORS
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <h2 className="font-serif text-4xl mb-6">Priority <br/> Verticals</h2>
               <div className="w-12 h-1 bg-[#003D73] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60">
                  The Expert Panel favors businesses that align with Denmark's national strategy. 
                  Focus your pitch on these areas.
               </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="border border-[#1a1a1a]/10 p-8 hover:border-[#003D73] transition-colors group bg-white">
                  <Wind className="w-8 h-8 text-[#003D73] mb-4" />
                  <h3 className="font-serif text-2xl mb-2">Cleantech & Energy</h3>
                  <p className="font-sans text-sm opacity-60">Wind power, water management, waste-to-energy solutions.</p>
               </div>
               <div className="border border-[#1a1a1a]/10 p-8 hover:border-[#003D73] transition-colors group bg-white">
                  <Thermometer className="w-8 h-8 text-[#003D73] mb-4" />
                  <h3 className="font-serif text-2xl mb-2">Life Sciences</h3>
                  <p className="font-sans text-sm opacity-60">Biotech, MedTech, and digital health. (Home to Novo Nordisk).</p>
               </div>
               <div className="border border-[#1a1a1a]/10 p-8 hover:border-[#003D73] transition-colors group bg-white">
                  <Lightbulb className="w-8 h-8 text-[#003D73] mb-4" />
                  <h3 className="font-serif text-2xl mb-2">Design & Tech</h3>
                  <p className="font-sans text-sm opacity-60">Software, robotics, sound tech, and sustainable fashion/design.</p>
               </div>
               <div className="border border-[#1a1a1a]/10 p-8 hover:border-[#003D73] transition-colors group bg-white">
                  <Users className="w-8 h-8 text-[#003D73] mb-4" />
                  <h3 className="font-serif text-2xl mb-2">Food Tech</h3>
                  <p className="font-sans text-sm opacity-60">Alternative proteins, agricultural efficiency, food safety.</p>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          5. THE SVR DIFFERENCE (Business Plan)
      ========================================= */}
      <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
               <h2 className="font-serif text-5xl mb-6">The Narrative <br/> Architects</h2>
               <div className="w-24 h-1 bg-[#AEC6CF] mb-8"></div>
               <p className="font-sans text-lg opacity-70 leading-relaxed">
                  The panel rejects generic plans. They want to see <strong>Danish Context</strong>. 
                  We rewrite your business plan to demonstrate why Denmark specifically is the only logical place for your HQ.
               </p>
            </div>
            <div className="md:w-1/2 space-y-6 font-sans">
               <div className="flex gap-4 items-center border-b border-[#F2F0E9]/10 pb-4">
                  <CheckCircle className="text-[#AEC6CF] w-6 h-6" />
                  <p>Market validation with local Danish data.</p>
               </div>
               <div className="flex gap-4 items-center border-b border-[#F2F0E9]/10 pb-4">
                  <CheckCircle className="text-[#AEC6CF] w-6 h-6" />
                  <p>Scalability roadmap focused on EU expansion.</p>
               </div>
               <div className="flex gap-4 items-center border-b border-[#F2F0E9]/10 pb-4">
                  <CheckCircle className="text-[#AEC6CF] w-6 h-6" />
                  <p>Team competency matrix aligning with Danish labor gaps.</p>
               </div>
            </div>
         </div>
      </section>


      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 text-center border-t border-[#1a1a1a]/10">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Ready for Copenhagen?
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            The path is clear, but the standard is high. Let's audit your business concept 
            before submitting to the Danish Business Authority.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#003D73] text-white px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors">
               Validate Business Plan
            </Link>
            <Link href="/" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Compare Jurisdictions
            </Link>
         </div>
      </section>

    </div>
  );
}