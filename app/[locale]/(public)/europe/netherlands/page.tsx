// ============================================================================
// Page: app/europe/netherlands/page.tsx
// Style: Editorial / Art Gallery
// Concept: "Dutch Modernism"
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Handshake, 
  Lightbulb, 
  Map, 
  Euro,
  Building2,
  ShieldCheck
} from 'lucide-react';
import type { Metadata } from 'next';

import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/europe/netherlands', locale);
}

export default function NetherlandsPage() {
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: THE ORANGE CARPET
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#f97316]"></span> {/* Dutch Orange */}
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Western Europe</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            DUTCH <br/>
            <span className="pl-[10vw] italic text-[#1a1a1a]/40">MODERNISM.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
             <div className="lg:col-span-7">
                <p className="font-serif text-3xl md:text-5xl leading-tight">
                   The <span className="bg-[#f97316] text-[#F2F0E9] px-2">Uncensored Truth</span> about the Netherlands Startup Visa.
                </p>
             </div>
             <div className="lg:col-span-5 flex flex-col gap-8">
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify border-l-2 border-[#f97316] pl-6">
                   It is not a golden ticket for anyone. It is a strict 1-year trial period for real entrepreneurs. We expose the agency myths and provide the exact roadmap from zero to Dutch citizenship.
                </p>
                <div className="flex gap-4">
                   <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#f97316] transition-colors">
                      Start Assessment
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. THE REALITY (What is it actually?)
      ========================================= */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               
               <div>
                  <span className="font-sans text-xs font-bold text-[#f97316] mb-8 block uppercase tracking-widest">The Truth</span>
                  <h2 className="font-serif text-4xl md:text-5xl mb-8">
                     Not a permanent pass. <br/> A 12-month trial.
                  </h2>
                  <p className="font-sans text-lg opacity-80 mb-6 leading-relaxed">
                     The Netherlands wants top-tier global talent, but they aren't looking for fake businesses just to grant Schengen access. This visa is a strict 1-year temporary residence permit.
                  </p>
                  <p className="font-sans text-lg opacity-80 mb-12 leading-relaxed">
                     You don't apply directly to the government initially. Your ticket in is a <strong>Facilitator</strong>—an approved Dutch business incubator. You must pitch to them and win their mentorship. They are the gatekeepers.
                  </p>
               </div>

               <div className="relative">
                  <div className="aspect-[4/5] relative grayscale hover:grayscale-0 transition-all duration-700 border border-[#F2F0E9]/20 overflow-hidden">
                     <img 
                        src="https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=2070&auto=format&fit=crop"
                        alt="Amsterdam Canals"
                        className="w-full h-full object-cover"
                     />
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          3. THE ROADMAP (Step-by-Step)
      ========================================= */}
      <section className="py-24 px-6 bg-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="mb-16 text-center">
               <span className="font-sans text-xs font-bold text-[#f97316] mb-4 block uppercase tracking-widest">The Timeline</span>
               <h2 className="font-serif text-5xl">Zero to Citizenship.</h2>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#1a1a1a]/20 before:to-transparent">
               
               {/* Step 1 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F2F0E9] bg-[#1a1a1a] text-[#f97316] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow font-bold text-sm">1</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 border border-[#1a1a1a]/10 bg-white hover:border-[#f97316] transition-colors">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-2xl font-bold">The Blueprint</h3>
                        <span className="font-sans text-xs text-[#1a1a1a]/50">Months 1-2</span>
                     </div>
                     <p className="text-[#1a1a1a]/70 font-sans text-sm leading-relaxed">It starts with you. Develop an innovative idea, build an MVP, and write a bulletproof Pitch Deck before contacting anyone.</p>
                  </div>
               </div>

               {/* Step 2 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F2F0E9] bg-[#1a1a1a] text-[#f97316] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow font-bold text-sm">2</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 border border-[#1a1a1a]/10 bg-white hover:border-[#f97316] transition-colors">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-2xl font-bold">The Matchmaking</h3>
                        <span className="font-sans text-xs text-[#1a1a1a]/50">Months 3-5</span>
                     </div>
                     <p className="text-[#1a1a1a]/70 font-sans text-sm leading-relaxed">Find approved Facilitators via the RVO. Pitch online, pass interviews, and sign the official mentorship agreement.</p>
                  </div>
               </div>

               {/* Step 3 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F2F0E9] bg-[#1a1a1a] text-[#f97316] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow font-bold text-sm">3</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 border border-[#1a1a1a]/10 bg-white hover:border-[#f97316] transition-colors">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-2xl font-bold">Legal Green Light</h3>
                        <span className="font-sans text-xs text-[#1a1a1a]/50">Months 6-8</span>
                     </div>
                     <p className="text-[#1a1a1a]/70 font-sans text-sm leading-relaxed">The facilitator submits your application to the IND and RVO. Pay the ~€400 fee, wait, and get your 1-year visa approved.</p>
                  </div>
               </div>

               {/* Step 4 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F2F0E9] bg-[#1a1a1a] text-[#f97316] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow font-bold text-sm">4</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 border border-[#1a1a1a]/10 bg-white hover:border-[#f97316] transition-colors">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-2xl font-bold">The Dutch Landing</h3>
                        <span className="font-sans text-xs text-[#1a1a1a]/50">Month 9</span>
                     </div>
                     <p className="text-[#1a1a1a]/70 font-sans text-sm leading-relaxed">Arrive in NL, register at the municipality for your BSN, and officially register your startup at the Dutch Chamber of Commerce (KvK).</p>
                  </div>
               </div>

               {/* Step 5 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F2F0E9] bg-[#1a1a1a] text-[#f97316] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow font-bold text-sm">5</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 border border-[#1a1a1a]/10 bg-white hover:border-[#f97316] transition-colors">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-2xl font-bold">The Trial Year</h3>
                        <span className="font-sans text-xs text-[#1a1a1a]/50">Year 2</span>
                     </div>
                     <p className="text-[#1a1a1a]/70 font-sans text-sm leading-relaxed">Build for 12 months. With your facilitator's recommendation, convert to a Self-Employed Residence Permit (valid 2 more years).</p>
                  </div>
               </div>

               {/* Step 6 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F2F0E9] bg-[#1a1a1a] text-[#f97316] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow font-bold text-sm">6</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 border border-[#1a1a1a]/10 bg-white hover:border-[#f97316] transition-colors">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-2xl font-bold">The Endgame</h3>
                        <span className="font-sans text-xs text-[#1a1a1a]/50">Year 5+</span>
                     </div>
                     <p className="text-[#1a1a1a]/70 font-sans text-sm leading-relaxed">Maintain the business, pay taxes, integrate. After 5 years of legal residence, apply for Permanent Residency or Citizenship.</p>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          4. RULES & AGENCY LIES
      ========================================= */}
      <section className="py-24 px-6 border-y border-[#1a1a1a]/10">
         <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* The 5 Rules */}
            <div>
               <h3 className="font-serif text-4xl mb-8 border-b-4 border-[#f97316] inline-block pb-2">5 Non-Negotiable Rules</h3>
               <ul className="space-y-6">
                  <li className="flex gap-4">
                     <ShieldCheck className="w-6 h-6 text-[#f97316] shrink-0" />
                     <div>
                        <strong className="font-serif text-xl block">The Facilitator Contract</strong>
                        <span className="font-sans text-sm text-[#1a1a1a]/70">An official agreement with an approved incubator is mandatory.</span>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <Lightbulb className="w-6 h-6 text-[#f97316] shrink-0" />
                     <div>
                        <strong className="font-serif text-xl block">True Innovation</strong>
                        <span className="font-sans text-sm text-[#1a1a1a]/70">No standard cafes or grocery stores. Must be new to the Dutch market (e.g. AI, Green-Tech).</span>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <Building2 className="w-6 h-6 text-[#f97316] shrink-0" />
                     <div>
                        <strong className="font-serif text-xl block">Flawless Business Plan</strong>
                        <span className="font-sans text-sm text-[#1a1a1a]/70">Clear problem, solution, and team. The Dutch invest in capable people.</span>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <Handshake className="w-6 h-6 text-[#f97316] shrink-0" />
                     <div>
                        <strong className="font-serif text-xl block">KvK Registration</strong>
                        <span className="font-sans text-sm text-[#1a1a1a]/70">Commitment to legally registering the company in the Netherlands.</span>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <Euro className="w-6 h-6 text-[#f97316] shrink-0" />
                     <div>
                        <strong className="font-serif text-xl block">Financial Solvency</strong>
                        <span className="font-sans text-sm text-[#1a1a1a]/70">Prove you have ~€20,000 (solo) or ~€30,000 (family) in a recognized bank to survive year one.</span>
                     </div>
                  </li>
               </ul>
            </div>

            {/* The 3 Lies */}
            <div className="bg-[#1a1a1a] text-[#F2F0E9] p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/20 blur-3xl rounded-full"></div>
               <h3 className="font-serif text-4xl mb-8 text-[#f97316]">The 3 Agency Lies</h3>
               <div className="space-y-8">
                  <div>
                     <strong className="font-sans text-lg block text-red-400 mb-1">Lie 1: "We'll write the idea for you."</strong>
                     <p className="font-sans text-sm opacity-80">This is Visa Fraud. You will face deep technical interviews with facilitators. If you didn't write it, you will freeze and face rejection.</p>
                  </div>
                  <div>
                     <strong className="font-sans text-lg block text-red-400 mb-1">Lie 2: "No English required."</strong>
                     <p className="font-sans text-sm opacity-80">IND doesn't need IELTS, but pitching to Dutch investors and clients requires fluent business English.</p>
                  </div>
                  <div>
                     <strong className="font-sans text-lg block text-red-400 mb-1">Lie 3: "It costs €20,000+."</strong>
                     <p className="font-sans text-sm opacity-80">The government fee is ~€400. Facilitators charge €500-€1000/mo. Agencies asking for €20k+ are charging massive hidden fees.</p>
                  </div>
               </div>
            </div>

         </div>
      </section>

      {/* =========================================
          5. POST-ARRIVAL & THE SPOUSE VISA
      ========================================= */}
      <section className="py-24 px-6 bg-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
               
               <div className="lg:col-span-6 relative aspect-square grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden border border-[#1a1a1a]/10">
                  <img 
                     src="https://images.unsplash.com/photo-1468436385273-8abca6dfd8d3?q=80&w=2070&auto=format&fit=crop"
                     alt="Dutch Bicycles"
                     className="w-full h-full object-cover"
                  />
               </div>

               <div className="lg:col-span-6 space-y-12 pl-0 lg:pl-12">
                  <div>
                     <h3 className="font-serif text-4xl mb-6">Arrival Survival Guide</h3>
                     <p className="font-sans text-[#1a1a1a]/70 mb-4"><strong>The BSN Monster:</strong> No BSN = you don't exist. You need a registered address to get it. A good facilitator lets you use their office temporarily.</p>
                     <p className="font-sans text-[#1a1a1a]/70 mb-4"><strong>The Housing Crisis:</strong> Finding an apartment is brutal. Beware of scammers—never send deposits without seeing the place.</p>
                     <p className="font-sans text-[#1a1a1a]/70"><strong>The Car Trap:</strong> Road tax and gas are insanely expensive. Buy a bicycle and a train card. In the Netherlands, the cyclist is king.</p>
                  </div>

                  <div className="bg-[#f97316]/10 border-l-4 border-[#f97316] p-6">
                     <h4 className="font-serif text-2xl mb-3 text-[#f97316]">The Golden Ticket: Spouse Visa</h4>
                     <p className="font-sans text-sm text-[#1a1a1a]/80 leading-relaxed">
                        While the main applicant works on the startup, the spouse gets <strong>full, unrestricted working rights!</strong> They can be hired immediately by any Dutch company without a visa sponsor. This is how smart couples survive the first year.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          6. THE 20 FACTS & FAQ
      ========================================= */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]/10 bg-[#F2F0E9]">
         <div className="container mx-auto max-w-7xl">
            <h2 className="font-serif text-5xl mb-4">20 Brutal Truths & Facts.</h2>
            <p className="font-sans text-[#1a1a1a]/60 mb-12">No-nonsense details every applicant must know before applying.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
               {[
                  { q: "Strictly a 1-Year Visa", a: "The Dutch Startup Visa is not a permanent or multi-year permit. It is strictly a 12-month trial period to establish your business." },
                  { q: "The Facilitator is Mandatory", a: "You cannot apply directly on your own. You must have a signed mentorship agreement with a government-approved Dutch facilitator (incubator)." },
                  { q: "Innovation is Required", a: "Your business cannot be a traditional shop or service. It must introduce new technology, a novel market approach, or an innovative social process." },
                  { q: "No State Funds Allowed", a: "You must prove you can financially sustain yourself. You are strictly prohibited from claiming Dutch social welfare benefits during your first year." },
                  { q: "Real IND Fees are Low", a: "The official application fee charged by the IND is around €400, not the tens of thousands of euros that immigration agencies claim." },
                  { q: "KvK Registration", a: "You and your facilitator must commit to registering your startup with the Dutch Chamber of Commerce (KvK) as soon as you arrive." },
                  { q: "Conversion to Self-Employed", a: "After one year, the visa does not auto-renew. It converts into a Self-Employed permit (ZZP), provided you can prove tangible progress." },
                  { q: "Profitability is Not Expected Immediately", a: "To secure your second-year visa, you don't need a million-euro profit, but you must show a working prototype (MVP), active networking, or initial clients." },
                  { q: "Heavy Solvency Requirements", a: "You must show roughly €20,000 (solo founder) or €30,000 (with family) in a recognized bank account to prove you can survive the first year." },
                  { q: "Sanctioned Bank Issues", a: "The IND frequently rejects financial statements from banks in sanctioned countries (like Iran). Funds usually need to be in a third-country account." },
                  { q: "Guarantors Often Fail", a: "Trying to use a third-party sponsor or guarantor to prove your financial solvency is highly risky and often leads to visa rejection." },
                  { q: "Monthly Facilitator Costs", a: "Expect to pay your facilitator between €500 and €1,000 monthly for desk space, mentoring, and administrative support." },
                  { q: "The BSN is Everything", a: "You cannot open a bank account or get health insurance without a Citizen Service Number (BSN), which requires you to register a physical address." },
                  { q: "The Temporary Address Hack", a: "A high-quality facilitator will allow you to use their official office address as your temporary postal address so you can get your BSN immediately." },
                  { q: "Housing Scams are Rampant", a: "The Netherlands has a severe housing crisis. Never pay a deposit for an apartment you haven't physically visited and verified." },
                  { q: "Mandatory Health Insurance", a: "You must purchase Dutch basic health insurance shortly after arriving. It is a legal requirement, not an option." },
                  { q: "The 6-Month Driving Limit", a: "Your non-EU driver's license is only valid for your first 185 days after municipal registration. After that, you must pass the expensive Dutch driving exams." },
                  { q: "The Spouse Golden Ticket", a: "Accompanying spouses or partners get unrestricted working rights. They can work full-time for any employer without needing a visa sponsor." },
                  { q: "Main Applicant Employment Ban", a: "The main visa holder is only allowed to work on their startup. You cannot take a side job as a regular employee to make extra cash." },
                  { q: "Fluent English is Unofficial but Vital", a: "While the IND does not ask for an IELTS score, you cannot pitch to facilitators, secure funding, or survive in the business ecosystem without fluent business English." },
               ].map((item, i) => (
                  <div key={i} className="border-b border-[#1a1a1a]/20 py-6 group">
                     <details className="cursor-pointer">
                        <summary className="list-none flex justify-between items-center font-serif text-xl md:text-2xl hover:text-[#f97316] transition-colors">
                           <span className="pr-8">{i + 1}. {item.q}</span>
                           <span className="font-sans text-sm text-[#F2F0E9] bg-[#1a1a1a] px-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0">+</span>
                        </summary>
                        <p className="mt-4 font-sans text-[#1a1a1a]/70 leading-relaxed pl-6 border-l-2 border-[#f97316]">
                           {item.a}
                        </p>
                     </details>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* =========================================
          7. LEGAL DISCLAIMER
      ========================================= */}
      <section className="py-12 px-6 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto max-w-4xl">
            <div className="flex gap-4 items-start">
               <ShieldCheck className="shrink-0 w-6 h-6 text-[#f97316]" />
               <p className="font-sans text-xs text-[#F2F0E9]/60 leading-relaxed text-justify">
                  <strong>Non-Legal Service Notice:</strong> Startup Visa Roads assists with business modeling and facilitator introductions. 
                  We are <span className="underline">NOT</span> an immigration law firm. 
                  Final decisions are made by the IND (Immigration and Naturalisation Service) based on advice from the RVO.
               </p>
            </div>
         </div>
      </section>

      {/* =========================================
          7. CTA
      ========================================= */}
      <section className="py-32 px-6 text-center">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl md:text-7xl mb-8">
               Scale in Amsterdam.
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
               Find your Facilitator and validate your concept for the Dutch market.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#f97316] transition-colors">
                  Start Assessment
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}