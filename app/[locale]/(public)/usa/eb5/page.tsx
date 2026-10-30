// ============================================================================
// Page: app/usa/eb5/page.tsx
// Style: Editorial / Art Gallery
// Concept: "The Capital Route" (High Finance & Investment)
//
// Figures checked 29 Oct 2026 against the USCIS Policy Manual, Vol. 6, Part G,
// Ch. 2 (current as of 27 Oct 2026): $1,050,000, or $800,000 in a TEA or an
// infrastructure project, for petitions filed on or after 15 Mar 2022; both
// rise with inflation on 1 Jan 2027. Re-check that day. Do not cite the main
// USCIS EB-5 page: it still shows the vacated 2019 amounts.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import { Link } from '@/routing';
import { 
  Building2, 
  Users, 
  ArrowRight, 
  Scale, 
  ShieldAlert,
  Briefcase,
  Landmark,
  PieChart
} from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { metaFor } from '@/lib/pageMeta';
import OfficialSources from '@/components/OfficialSources';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/usa/eb5', locale);
}

// setRequestLocale before the first <Link>: without it next-intl reads
// headers(), Next renders the route dynamically and streams <title> and
// the meta tags into <body> instead of <head>.
export default async function EB5Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: CAPITAL & RESIDENCY
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#1a1a1a]"></span>
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Fifth Preference</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            CAPITAL <br/>
            <span className="pl-[10vw] italic text-[#1a1a1a]/40">RESIDENCY.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
             <div>
                <p className="font-serif text-3xl md:text-5xl leading-tight">
                   The <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2">$800,000</span> bridge to the United States Green Card, until 31 December 2026.
                </p>
             </div>
             <div className="flex flex-col gap-8">
                <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify border-l-2 border-[#1a1a1a] pl-6">
                   The EB-5 program is the most direct path to permanent residency for investors. 
                   Whether you choose the <strong>Direct Investment</strong> route or a <strong>Regional Center</strong>, 
                   the core requirement is the same: Capital must create jobs.
                </p>
                <div className="flex gap-4">
                   <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
                      Investment Assessment
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. THE NUMBERS (Financial Factsheet)
      ========================================= */}
      <section className="py-0 border-b border-[#1a1a1a]">
         <div className="grid grid-cols-1 md:grid-cols-3">
            
            {/* Stat 1 */}
            <div className="group border-b md:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors duration-500">
               <span className="font-sans text-xs font-bold uppercase tracking-widest mb-4 block opacity-50">TEA Investment</span>
               <h3 className="font-serif text-6xl mb-2">$800k</h3>
               <p className="font-sans text-xs opacity-60">In a Targeted Employment Area (rural or high-unemployment) or an infrastructure project</p>
            </div>

            {/* Stat 2 */}
            <div className="group border-b md:border-b-0 md:border-r border-[#1a1a1a] p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors duration-500">
               <span className="font-sans text-xs font-bold uppercase tracking-widest mb-4 block opacity-50">Standard Investment</span>
               <h3 className="font-serif text-6xl mb-2">$1.05M</h3>
               <p className="font-sans text-xs opacity-60">Anywhere else. A city area can still be a TEA if unemployment there is high</p>
            </div>

            {/* Stat 3 */}
            <div className="group p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors duration-500">
               <span className="font-sans text-xs font-bold uppercase tracking-widest mb-4 block opacity-50">Job Creation</span>
               <h3 className="font-serif text-6xl mb-2 flex items-start gap-2">
                  10 <Users className="w-6 h-6 mt-2 opacity-50" />
               </h3>
               <p className="font-sans text-xs opacity-60">Full-time positions for qualifying employees (indirect jobs count for regional centers)</p>
            </div>

         </div>
      </section>

      <p className="px-6 py-6 font-sans text-sm text-[#1a1a1a]/70 max-w-4xl">
         <strong className="text-[#1a1a1a]">These amounts change on 1 January 2027.</strong> USCIS says the $1,050,000 and $800,000 minimums,
         which apply to petitions filed on or after 15 March 2022, &quot;will automatically increase January 1, 2027, and every 5 years
         thereafter&quot;. USCIS has not yet published the new figures. A petition filed by 31 December 2026 uses today&apos;s amounts.
      </p>

      {/* =========================================
          3. THE DICHOTOMY (Direct vs Regional)
      ========================================= */}
      <section className="py-24 px-6 bg-white">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl mb-16 text-center">Two Paths. One Goal.</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
               
               {/* Left: Direct */}
               <div className="bg-[#F2F0E9] p-12 hover:bg-white transition-colors group">
                  <div className="mb-8">
                     <Briefcase className="w-12 h-12 text-[#1a1a1a] mb-6 group-hover:scale-110 transition-transform" />
                     <span className="font-sans text-xs font-bold bg-[#1a1a1a] text-[#CCFF00] px-2 py-1 uppercase tracking-widest">Active Control</span>
                  </div>
                  <h3 className="font-serif text-4xl mb-6">Direct Investment</h3>
                  <p className="font-sans text-lg text-[#1a1a1a]/70 mb-8 leading-relaxed">
                     You start your own business. You hire the employees directly. You manage the operations. 
                     Ideal for entrepreneurs who want to expand their existing brand to the US.
                  </p>
                  <ul className="space-y-4 font-sans text-sm border-t border-[#1a1a1a]/10 pt-8">
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#1a1a1a]"></span> 100% Equity Ownership</li>
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#1a1a1a]"></span> Max Profit Potential</li>
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#1a1a1a]"></span> High Management Burden</li>
                  </ul>
               </div>

               {/* Right: Regional Center */}
               <div className="bg-[#F2F0E9] p-12 hover:bg-white transition-colors group">
                  <div className="mb-8">
                     <Landmark className="w-12 h-12 text-[#1a1a1a] mb-6 group-hover:scale-110 transition-transform" />
                     <span className="font-sans text-xs font-bold border border-[#1a1a1a] text-[#1a1a1a] px-2 py-1 uppercase tracking-widest">Passive Income</span>
                  </div>
                  <h3 className="font-serif text-4xl mb-6">Regional Center</h3>
                  <p className="font-sans text-lg text-[#1a1a1a]/70 mb-8 leading-relaxed">
                     You invest in a new commercial enterprise sponsored by a USCIS-designated regional center, which usually funds a large project (e.g., hotel, stadium). The project handles the job creation. 
                     Ideal for investors who want a "hands-off" Green Card.
                  </p>
                  <ul className="space-y-4 font-sans text-sm border-t border-[#1a1a1a]/10 pt-8">
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#1a1a1a]"></span> Limited Partner Role</li>
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#1a1a1a]"></span> Lower Returns (Usually)</li>
                     <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#1a1a1a]"></span> Indirect Job Count Allowed</li>
                  </ul>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          4. OUR ROLE: MATTER OF HO
      ========================================= */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-[#F2F0E9]">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               
               <div className="relative">
                  <div className="aspect-square relative grayscale hover:grayscale-0 transition-all duration-700 border border-[#F2F0E9]/20">
                     <Image 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                        alt="Skyscraper Construction"
                        fill
                        className="object-cover"
                     />
                  </div>
               </div>

               <div>
                  <span className="font-sans text-xs font-bold text-[#CCFF00] mb-8 block uppercase tracking-widest">Compliant Architecture</span>
                  <h2 className="font-serif text-5xl mb-8">
                     Matter of Ho.
                  </h2>
                  <p className="font-sans text-lg opacity-60 mb-12 leading-relaxed">
                     An EB-5 business plan is not a standard document. It must adhere to the precedent decision 
                     <em> Matter of Ho</em> to be accepted by USCIS. We specialize in drafting plans that meet these legal standards.
                  </p>

                  <div className="space-y-8">
                     <div className="flex gap-6 items-start group">
                        <PieChart className="w-8 h-8 text-[#CCFF00]" />
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">Verifiable Detail</h4>
                           <p className="text-sm opacity-60 font-sans">The plan must show more than a "mere hope". It requires permits, contracts, and detailed market data.</p>
                        </div>
                     </div>
                     <div className="flex gap-6 items-start group">
                        <Users className="w-8 h-8 text-[#CCFF00]" />
                        <div>
                           <h4 className="font-bold text-xl mb-2 font-serif">Personnel Timetable</h4>
                           <p className="text-sm opacity-60 font-sans">A precise hiring schedule showing exactly when the 10 jobs will be created over 2 years.</p>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* =========================================
          5. LEGAL DISCLAIMER (High Contrast)
      ========================================= */}
      <section className="py-12 px-6">
         <div className="container mx-auto max-w-4xl border border-[#1a1a1a]/10 bg-white p-8 shadow-sm">
            <div className="flex gap-4 items-start">
               <ShieldAlert className="shrink-0 w-6 h-6 text-[#1a1a1a]" />
               <div>
                  <h4 className="font-bold font-sans text-xs uppercase tracking-widest mb-2 text-[#1a1a1a]">Advisory Limitation</h4>
                  <p className="font-serif text-sm leading-relaxed text-[#1a1a1a]/80">
                     <strong>We provide Business Planning services only.</strong> EB-5 involves securities law and immigration law. 
                     We are not attorneys, broker-dealers, or financial advisors. We do not sell or recommend specific investments. 
                     For Regional Center selection, you should consult a licensed Investment Advisor. For the I-526 petition, you must retain an Immigration Attorney.
                  </p>
               </div>
            </div>
         </div>
      </section>

      <OfficialSources
         checked="29 October 2026"
         sources={[
            { label: 'USCIS Policy Manual, Vol. 6, Part G, Ch. 2 — Immigrant Investor Eligibility (current as of 27 Oct 2026)', url: 'https://www.uscis.gov/policy-manual/volume-6-part-g-chapter-2', what: 'The $1,050,000 and $800,000 minimums, the 1 January 2027 inflation increase, the definition of a TEA, the 10 full-time positions and the 2-year hiring window in the business plan.' },
         ]}
      />

      {/* =========================================
          6. CTA
      ========================================= */}
      <section className="py-32 px-6 text-center">
         <div className="container mx-auto">
            <h2 className="font-serif text-5xl md:text-7xl mb-8">
               Deploy Capital.
            </h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
               We architect "Matter of Ho" compliant business plans for Direct EB-5 investors.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
                  Structure Deal
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}