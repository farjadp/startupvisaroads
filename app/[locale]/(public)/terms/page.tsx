// ============================================================================
// Page: app/terms/page.tsx
// Style: Modernist Editorial / "The Contract"
// Context: VisaRoads Inc. Terms of Service & Liability Shield
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  Scale, 
  FileSignature, 
  ShieldBan, 
  DollarSign, 
  GlobeLock, 
  AlertOctagon,
  Gavel
} from 'lucide-react';
import type { Metadata } from 'next';

import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/terms', locale);
}

export default function TermsPage() {
  const lastUpdated = "December 27, 2025";

  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HEADER: THE AGREEMENT
      ========================================= */}
      <section className="pt-32 pb-20 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-4 mb-8">
           <Scale className="w-4 h-4 text-[#1a1a1a]" />
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Legal Framework</span>
        </div>

        <h1 className="font-serif text-[8vw] leading-[0.85] tracking-tighter mb-12">
           TERMS OF <br/>
           <span className="pl-[5vw] italic text-[#1a1a1a]/40">ENGAGEMENT.</span>
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
           <p className="font-sans text-lg md:text-xl leading-relaxed max-w-2xl">
              Accessing our platform or engaging our services constitutes a binding agreement to the following terms. Read them carefully. They define the limits of our liability.
           </p>
           <div className="font-sans text-xs font-bold uppercase tracking-widest border border-[#1a1a1a] px-4 py-2">
              Effective Date: {lastUpdated}
           </div>
        </div>
      </section>


      {/* =========================================
          2. THE CLAUSES (Content)
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* SIDEBAR: NAVIGATION */}
            <div className="lg:col-span-4 h-fit lg:sticky lg:top-32">
               <h4 className="font-sans text-xs font-bold uppercase tracking-widest mb-6 text-[#1a1a1a]/40">Index</h4>
               <nav className="space-y-2 border-l-2 border-[#1a1a1a]/10">
                  {[
                     { id: "#acceptance", label: "1. Acceptance of Terms" },
                     { id: "#nature", label: "2. Nature of Service (Non-Legal)" },
                     { id: "#payments", label: "3. Fees & Refund Policy" },
                     { id: "#guarantees", label: "4. No Guarantee of Outcome" },
                     { id: "#ip", label: "5. Intellectual Property" },
                     { id: "#liability", label: "6. Limitation of Liability" },
                     { id: "#jurisdiction", label: "7. Governing Law" },
                  ].map((link, i) => (
                     <a 
                        key={i} 
                        href={link.id} 
                        className="block pl-4 py-2 font-serif text-lg text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:border-l-2 hover:border-[#CCFF00] hover:-ml-[2px] transition-all"
                     >
                        {link.label}
                     </a>
                  ))}
               </nav>
            </div>


            {/* MAIN CONTENT */}
            <div className="lg:col-span-8 space-y-24">
               
               {/* 1. ACCEPTANCE */}
               <div id="acceptance" className="group">
                  <div className="flex items-center gap-4 mb-6 border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-xs font-bold text-[#1a1a1a]/40">CLAUSE 01</span>
                     <h3 className="font-serif text-3xl">Acceptance of Terms</h3>
                  </div>
                  <p className="font-sans text-[#1a1a1a]/80 leading-relaxed">
                     By visiting <strong>VisaRoads.com</strong> (the "Site") or purchasing any advisory packages, you ("the Client") agree to be bound by these Terms of Service. 
                     If you do not agree, you must immediately discontinue use of our services. VisaRoads Inc. reserves the right to modify these terms at any time without prior notice.
                  </p>
               </div>

               {/* 2. NATURE OF SERVICE (CRITICAL) */}
               <div id="nature" className="group">
                  <div className="flex items-center gap-4 mb-6 border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-xs font-bold text-[#b91c1c]">CLAUSE 02</span>
                     <h3 className="font-serif text-3xl text-[#b91c1c]">Nature of Service (Disclaimer)</h3>
                  </div>
                  
                  <div className="bg-[#b91c1c]/5 border-l-4 border-[#b91c1c] p-8 space-y-4">
                     <div className="flex gap-4 items-start">
                        <AlertOctagon className="w-6 h-6 text-[#b91c1c] shrink-0 mt-1" />
                        <p className="font-sans text-sm font-bold text-[#1a1a1a]">
                           VisaRoads Inc. is a Management Consultancy, NOT a Law Firm.
                        </p>
                     </div>
                     <p className="font-sans text-sm text-[#1a1a1a]/80 leading-relaxed text-justify">
                        We provide business strategy, market research, and corporate structuring advice. 
                        <strong>We do not provide legal advice, immigration advice, or representation before any government body.</strong> 
                        Any information provided regarding visa programs is for strategic planning purposes only and should be verified by a licensed immigration lawyer or Regulated Canadian Immigration Consultant (RCIC).
                     </p>
                  </div>
               </div>

               {/* 3. FEES & REFUNDS */}
               <div id="payments" className="group">
                  <div className="flex items-center gap-4 mb-6 border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-xs font-bold text-[#1a1a1a]/40">CLAUSE 03</span>
                     <h3 className="font-serif text-3xl">Fees & Refund Policy</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <DollarSign className="w-8 h-8 mb-4 text-[#CCFF00] bg-black p-1 rounded-full" />
                        <h4 className="font-bold text-sm uppercase mb-2">Retainer Basis</h4>
                        <p className="font-sans text-sm opacity-60 leading-relaxed">
                           All services are provided on a retainer basis. Fees are charged for the <strong>time and expertise</strong> allocated to your file, not for the outcome.
                        </p>
                     </div>
                     <div>
                        <ShieldBan className="w-8 h-8 mb-4 text-[#CCFF00] bg-black p-1 rounded-full" />
                        <h4 className="font-bold text-sm uppercase mb-2">No Refunds</h4>
                        <p className="font-sans text-sm opacity-60 leading-relaxed">
                           Once strategic work has commenced (e.g., initial audit, market research, or document drafting), <strong>fees are strictly non-refundable</strong>, regardless of whether you proceed with a visa application or its outcome.
                        </p>
                     </div>
                  </div>
               </div>

               {/* 4. NO GUARANTEES */}
               <div id="guarantees" className="group">
                  <div className="flex items-center gap-4 mb-6 border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-xs font-bold text-[#1a1a1a]/40">CLAUSE 04</span>
                     <h3 className="font-serif text-3xl">No Guarantee of Outcome</h3>
                  </div>
                  <p className="font-sans text-[#1a1a1a]/80 leading-relaxed mb-6">
                     Visa issuance, Letter of Support (LOS) issuance, and Nomination Certificates are the sole prerogative of the respective third-party organizations (Incubators, Angel Groups) and Government Authorities (IRCC, USCIS, Home Office).
                  </p>
                  <ul className="space-y-3 font-sans text-sm text-[#1a1a1a]/70 list-disc pl-5">
                     <li>VisaRoads Inc. has no control over government processing times or policy changes.</li>
                     <li>We do not guarantee approval of any application.</li>
                     <li>Success rates mentioned in marketing materials refer to historical data and do not predict future results for your specific case.</li>
                  </ul>
               </div>

               {/* 5. IP */}
               <div id="ip" className="group">
                  <div className="flex items-center gap-4 mb-6 border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-xs font-bold text-[#1a1a1a]/40">CLAUSE 05</span>
                     <h3 className="font-serif text-3xl">Intellectual Property</h3>
                  </div>
                  <div className="flex gap-4 items-start">
                     <FileSignature className="w-6 h-6 text-[#1a1a1a]/40 shrink-0" />
                     <p className="font-sans text-[#1a1a1a]/80 leading-relaxed">
                        All methodologies, frameworks, business plan templates, and strategic roadmaps provided to you remain the exclusive intellectual property of VisaRoads Inc. 
                        You are granted a limited license to use these materials solely for your personal immigration application. You may not resell, distribute, or publish our proprietary materials.
                     </p>
                  </div>
               </div>

               {/* 6. LIMITATION OF LIABILITY */}
               <div id="liability" className="group">
                  <div className="flex items-center gap-4 mb-6 border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-xs font-bold text-[#1a1a1a]/40">CLAUSE 06</span>
                     <h3 className="font-serif text-3xl">Limitation of Liability</h3>
                  </div>
                  <p className="font-sans text-[#1a1a1a]/80 leading-relaxed text-justify mb-6">
                     To the maximum extent permitted by law, VisaRoads Inc., its directors, employees, and partners shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:
                  </p>
                  <div className="bg-white border border-[#1a1a1a]/10 p-6 text-sm opacity-70 space-y-2">
                     <p>1. Denial of any visa or immigration benefit.</p>
                     <p>2. Delays in government processing.</p>
                     <p>3. Loss of business revenue or profits during the application process.</p>
                     <p>4. Errors or omissions in third-party services (lawyers, accountants, translators).</p>
                  </div>
                  <p className="mt-6 font-sans text-xs font-bold uppercase tracking-widest">
                     Liability Cap: In no event shall our total liability exceed the actual amount paid by you to VisaRoads Inc.
                  </p>
               </div>

               {/* 7. JURISDICTION */}
               <div id="jurisdiction" className="group">
                  <div className="flex items-center gap-4 mb-6 border-b border-[#1a1a1a]/10 pb-4">
                     <span className="font-sans text-xs font-bold text-[#1a1a1a]/40">CLAUSE 07</span>
                     <h3 className="font-serif text-3xl">Governing Law</h3>
                  </div>
                  <div className="flex gap-4 items-center">
                     <GlobeLock className="w-6 h-6 text-[#1a1a1a]" />
                     <p className="font-sans text-[#1a1a1a]/80 leading-relaxed">
                        These Terms shall be governed by and construed in accordance with the laws of the <strong>Province of Ontario, Canada</strong>. 
                        Any disputes arising under this agreement shall be resolved exclusively in the courts located in Toronto, Ontario.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          3. FOOTER SIGNATURE
      ========================================= */}
      <section className="py-20 border-t border-[#1a1a1a]/10 text-center">
         <Gavel className="w-8 h-8 mx-auto mb-6 text-[#1a1a1a]/20" />
         <p className="font-serif text-2xl max-w-2xl mx-auto leading-tight mb-8">
            "Clarity allows for speed. These terms ensure we move forward with mutual understanding."
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
               I Agree, Proceed
            </Link>
            <Link href="/" className="border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Return Home
            </Link>
         </div>
      </section>

    </div>
  );
}