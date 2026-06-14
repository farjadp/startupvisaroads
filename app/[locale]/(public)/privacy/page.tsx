// ============================================================================
// Page: app/privacy/page.tsx
// Style: Modernist Editorial / Legal Dossier
// Context: VisaRoads Inc. Privacy Protocol & Data Governance
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Globe, 
  Server,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import type { Metadata } from 'next';

import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/privacy', locale);
}

export default function PrivacyPage() {
  const lastUpdated = "December 27, 2025";

  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HEADER: THE STATEMENT
      ========================================= */}
      <section className="pt-32 pb-20 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-4 mb-8">
           <Shield className="w-4 h-4 text-[#1a1a1a]" />
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Data Governance</span>
        </div>

        <h1 className="font-serif text-[8vw] leading-[0.85] tracking-tighter mb-12">
           PRIVACY <br/>
           <span className="pl-[5vw] italic text-[#1a1a1a]/40">PROTOCOL.</span>
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
           <p className="font-sans text-lg md:text-xl leading-relaxed max-w-2xl">
              We deal in the currency of trust. Your intellectual property, financial data, and personal ambition are safeguarded by the highest standards of data sovereignty.
           </p>
           <div className="font-sans text-xs font-bold uppercase tracking-widest border border-[#1a1a1a] px-4 py-2">
              Last Updated: {lastUpdated}
           </div>
        </div>
      </section>


      {/* =========================================
          2. THE CONTENT (Two-Column Layout)
      ========================================= */}
      <section className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* SIDEBAR: NAVIGATION & CONTACT */}
            <div className="lg:col-span-4 space-y-12 h-fit lg:sticky lg:top-32">
               <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-widest mb-6 text-[#1a1a1a]/40">Table of Contents</h4>
                  <ul className="space-y-4 font-serif text-xl">
                     <li><a href="#collection" className="hover:text-[#CCFF00] hover:bg-[#1a1a1a] px-2 -ml-2 transition-all">1. Data Collection</a></li>
                     <li><a href="#usage" className="hover:text-[#CCFF00] hover:bg-[#1a1a1a] px-2 -ml-2 transition-all">2. Usage & Strategy</a></li>
                     <li><a href="#disclosure" className="hover:text-[#CCFF00] hover:bg-[#1a1a1a] px-2 -ml-2 transition-all">3. Third-Party Disclosure</a></li>
                     <li><a href="#security" className="hover:text-[#CCFF00] hover:bg-[#1a1a1a] px-2 -ml-2 transition-all">4. Security Measures</a></li>
                     <li><a href="#disclaimer" className="hover:text-[#CCFF00] hover:bg-[#1a1a1a] px-2 -ml-2 transition-all">5. Legal Disclaimer</a></li>
                  </ul>
               </div>

               <div className="bg-[#1a1a1a] text-[#F2F0E9] p-8">
                  <h4 className="font-serif text-2xl mb-4">Privacy Officer</h4>
                  <p className="font-sans text-sm opacity-60 mb-6 leading-relaxed">
                     For inquiries regarding data deletion or access requests, contact our legal compliance team.
                  </p>
                  <a href="mailto:privacy@visaroads.com" className="inline-block border-b border-[#CCFF00] pb-1 text-[#CCFF00] font-bold text-xs uppercase tracking-widest">
                     privacy@visaroads.com
                  </a>
               </div>
            </div>


            {/* MAIN CONTENT: LEGAL TEXT */}
            <div className="lg:col-span-8 space-y-20">
               
               {/* 1. COLLECTION */}
               <div id="collection" className="group">
                  <div className="flex items-center gap-4 mb-6">
                     <span className="font-sans text-xs font-bold bg-[#CCFF00] text-[#1a1a1a] px-2 py-1">01</span>
                     <h3 className="font-serif text-3xl">Information Collection</h3>
                  </div>
                  <div className="prose prose-lg font-sans text-[#1a1a1a]/80 leading-relaxed max-w-none">
                     <p>
                        VisaRoads Inc. ("we," "us," or "our") collects information necessary to assess your eligibility for global business immigration programs. This includes:
                     </p>
                     <ul className="list-disc pl-6 space-y-2 mt-4 text-sm">
                        <li><strong>Identity Data:</strong> Name, citizenship, date of birth, and passport details.</li>
                        <li><strong>Financial Data:</strong> Net worth statements, liquidity proof, and source of funds documentation (for audit purposes).</li>
                        <li><strong>Business Intelligence:</strong> Pitch decks, business plans, intellectual property details, and corporate structure.</li>
                        <li><strong>Technical Data:</strong> IP address, browser type, and interaction metrics via our digital platforms.</li>
                     </ul>
                  </div>
               </div>

               {/* 2. USAGE */}
               <div id="usage" className="group">
                  <div className="flex items-center gap-4 mb-6">
                     <span className="font-sans text-xs font-bold bg-[#CCFF00] text-[#1a1a1a] px-2 py-1">02</span>
                     <h3 className="font-serif text-3xl">Usage & Strategy</h3>
                  </div>
                  <p className="font-sans text-[#1a1a1a]/80 leading-relaxed text-lg">
                     We do not sell your data. We use your information strictly to:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                     <div className="border border-[#1a1a1a]/10 p-6 bg-white">
                        <FileText className="w-6 h-6 mb-4 text-[#1a1a1a]/40" />
                        <h4 className="font-bold text-sm uppercase mb-2">Assessment</h4>
                        <p className="text-xs opacity-60">To calculate eligibility scores (CRS, SIRS, EOI) and identify suitable jurisdictions.</p>
                     </div>
                     <div className="border border-[#1a1a1a]/10 p-6 bg-white">
                        <Briefcase className="w-6 h-6 mb-4 text-[#1a1a1a]/40" />
                        <h4 className="font-bold text-sm uppercase mb-2">Partnership</h4>
                        <p className="text-xs opacity-60">To present your business concept to designated organizations (Incubators, VCs) for endorsement purposes.</p>
                     </div>
                  </div>
               </div>

               {/* 3. DISCLOSURE */}
               <div id="disclosure" className="group">
                  <div className="flex items-center gap-4 mb-6">
                     <span className="font-sans text-xs font-bold bg-[#CCFF00] text-[#1a1a1a] px-2 py-1">03</span>
                     <h3 className="font-serif text-3xl">Third-Party Disclosure</h3>
                  </div>
                  <div className="bg-[#1a1a1a]/5 border-l-4 border-[#1a1a1a] p-6 mb-6">
                     <p className="font-serif text-lg italic text-[#1a1a1a]">
                        "We are architects, not attorneys. We bridge the gap."
                     </p>
                  </div>
                  <p className="font-sans text-[#1a1a1a]/80 leading-relaxed mb-4">
                     To execute your immigration strategy, we may share your data with trusted partners under strict Non-Disclosure Agreements (NDAs):
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-[#1a1a1a]/70">
                     <li><strong>Regulated Immigration Lawyers:</strong> For the final legal submission of visa petitions.</li>
                     <li><strong>Designated Organizations:</strong> Incubators, Angel Investor Groups, and Venture Capital funds in Canada, UK, or Australia.</li>
                     <li><strong>Forensic Accountants:</strong> For net worth verification reports (e.g., KPMG, MNP) required by provincial programs.</li>
                  </ul>
               </div>

               {/* 4. SECURITY */}
               <div id="security" className="group">
                  <div className="flex items-center gap-4 mb-6">
                     <span className="font-sans text-xs font-bold bg-[#CCFF00] text-[#1a1a1a] px-2 py-1">04</span>
                     <h3 className="font-serif text-3xl">Security Protocol</h3>
                  </div>
                  <p className="font-sans text-[#1a1a1a]/80 leading-relaxed mb-6">
                     We employ enterprise-grade security measures to protect your data, including AES-256 encryption for data at rest and TLS 1.3 for data in transit. 
                     Access to client files is restricted on a "need-to-know" basis within our firm.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40">
                     <Lock className="w-4 h-4" /> SSL Secured • Encrypted Database
                  </div>
               </div>

               {/* 5. DISCLAIMER (CRITICAL) */}
               <div id="disclaimer" className="group">
                  <div className="flex items-center gap-4 mb-6">
                     <span className="font-sans text-xs font-bold bg-[#b91c1c] text-white px-2 py-1">CRITICAL</span>
                     <h3 className="font-serif text-3xl text-[#b91c1c]">Legal Disclaimer</h3>
                  </div>
                  
                  <div className="border border-[#b91c1c]/20 bg-[#b91c1c]/5 p-8 text-[#1a1a1a]">
                     <div className="flex gap-4 items-start mb-6">
                        <AlertTriangle className="w-6 h-6 text-[#b91c1c] shrink-0" />
                        <div>
                           <h4 className="font-bold text-sm uppercase mb-2">No Legal Advice</h4>
                           <p className="text-sm opacity-80 leading-relaxed text-justify">
                              VisaRoads Inc. is a strategic business consultancy. <strong>We are NOT a law firm</strong>, and our employees are not acting as your attorneys. 
                              The information provided on this website and during consultations is for general informational and strategic purposes only. 
                              It does not constitute legal advice or an attorney-client relationship.
                           </p>
                        </div>
                     </div>

                     <div className="flex gap-4 items-start mb-6">
                        <AlertTriangle className="w-6 h-6 text-[#b91c1c] shrink-0" />
                        <div>
                           <h4 className="font-bold text-sm uppercase mb-2">No Guarantees</h4>
                           <p className="text-sm opacity-80 leading-relaxed text-justify">
                              Visa issuance is the sole prerogative of the respective government authorities (IRCC, USCIS, Home Office, etc.). 
                              VisaRoads Inc. cannot and does not guarantee the outcome of any application. 
                              Any mention of "Success Rates" refers to historical performance and does not predict future results.
                           </p>
                        </div>
                     </div>

                     <div className="flex gap-4 items-start">
                        <AlertTriangle className="w-6 h-6 text-[#b91c1c] shrink-0" />
                        <div>
                           <h4 className="font-bold text-sm uppercase mb-2">Limitation of Liability</h4>
                           <p className="text-sm opacity-80 leading-relaxed text-justify">
                              VisaRoads Inc. shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services or website. 
                              By using our platform, you acknowledge that immigration laws are subject to change without notice.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* =========================================
          3. FOOTER NOTE
      ========================================= */}
      <section className="py-20 border-t border-[#1a1a1a]/10 text-center">
         <p className="font-serif text-2xl md:text-3xl max-w-3xl mx-auto leading-tight mb-8">
            "Your data is the blueprint of your legacy. We treat it with the reverence it demands."
         </p>
         <Link href="/contact" className="inline-block bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors">
            Contact Compliance Team
         </Link>
      </section>

    </div>
  );
}