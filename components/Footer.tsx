// ============================================================================
// Component: components/Footer.tsx
// Style: Editorial / Art Gallery (Inverted Theme)
// Colors: Ink (#1a1a1a) & Acid Green (#CCFF00)
// Updated Links: Matches project file structure
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  Linkedin, 
  Twitter, 
  Instagram
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-[#F2F0E9] pt-24 pb-8 relative overflow-hidden">
      
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#CCFF00]"></div>

      <div className="container mx-auto px-6 md:px-12">
        
        {/* Top Section: Brand & Big Nav */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-24 gap-16">
           
           {/* Brand Column */}
           <div className="lg:w-1/3">
              <Link href="/" className="inline-block mb-8 group">
                 <h2 className="font-serif text-6xl md:text-8xl leading-none group-hover:text-[#CCFF00] transition-colors duration-300">
                    S V R
                 </h2>
              </Link>
              <p className="font-sans text-lg text-[#F2F0E9]/60 leading-relaxed max-w-sm">
                 Architecting global legacies. <br/>
                 We bridge the gap between ambition and residency through strategic design.
              </p>
              
              {/* Socials - Minimal Circles */}
              <div className="flex gap-4 mt-8">
                 {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-full border border-[#F2F0E9]/20 flex items-center justify-center hover:bg-[#CCFF00] hover:text-black hover:border-transparent transition-all duration-300">
                       <Icon size={20} />
                    </a>
                 ))}
              </div>
           </div>

           {/* Navigation Columns */}
           <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Column 1: Firm */}
              <div>
                 <h4 className="font-sans text-xs font-bold text-[#CCFF00] mb-8 uppercase tracking-widest">The Firm</h4>
                 <ul className="space-y-4 font-serif text-2xl">
                    <li><Link href="/services" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Advisory Services</Link></li>
                    <li><Link href="/mentorship" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Mentorship Program</Link></li>
                    <li><Link href="/about" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Our Story</Link></li>
                    <li><Link href="/blog" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Insights</Link></li>
                 </ul>
              </div>

              {/* Column 2: Jurisdictions (Matched to File Structure) */}
              <div>
                 <h4 className="font-sans text-xs font-bold text-[#CCFF00] mb-8 uppercase tracking-widest">Jurisdictions</h4>
                 <ul className="space-y-4 font-serif text-2xl">
                    <li><Link href="/startup-visa-canada" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Canada (SUV)</Link></li>
                    <li><Link href="/usa/eb2-niw" className="hover:text-[#CCFF00] hover:pl-2 transition-all">USA (NIW)</Link></li>
                    <li><Link href="/uae/golden-visa" className="hover:text-[#CCFF00] hover:pl-2 transition-all">UAE Golden</Link></li>
                    <li><Link href="/europe/netherlands" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Netherlands</Link></li>
                 </ul>
              </div>

              {/* Column 3: Contact */}
              <div>
                 <h4 className="font-sans text-xs font-bold text-[#CCFF00] mb-8 uppercase tracking-widest">Office</h4>
                 <address className="not-italic font-sans text-[#F2F0E9]/60 space-y-2 mb-8">
                    hello@startupvisaroads.com<br/>
                    +1 (416) 555-0192<br/>
                    Toronto, ON
                 </address>
                 <Link href="/contact" className="inline-flex items-center gap-2 font-sans font-bold border-b border-[#CCFF00] pb-1 hover:text-[#CCFF00] transition-colors">
                    BOOK CONSULTATION <ArrowUpRight size={16} />
                 </Link>
                 <div className="mt-6">
                    <Link href="/login" className="text-xs font-sans text-[#F2F0E9]/40 hover:text-[#CCFF00] transition-colors uppercase tracking-widest">
                       Client Portal Login
                    </Link>
                 </div>
              </div>

           </div>
        </div>

        {/* Legal Disclaimer - Editorial Style */}
        <div className="border-t border-[#F2F0E9]/10 pt-10 pb-20">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                 <h5 className="font-sans text-[10px] font-bold text-[#CCFF00] uppercase mb-2">Legal Disclaimer</h5>
                 <p className="font-sans text-xs text-[#F2F0E9]/40 text-justify leading-relaxed">
                    Startup Visa Roads is a strategic business advisory firm. We are NOT a law firm and do not provide legal advice or immigration representation. Our services are strictly limited to business model development, market research, and mentorship. All legal filings and immigration petitions must be handled by licensed attorneys. We do not guarantee visa issuance, as such decisions remain the sole prerogative of government authorities.
                 </p>
              </div>
              <div className="lg:col-span-4 flex flex-col md:flex-row justify-end items-end gap-6 text-xs text-[#F2F0E9]/40 font-sans uppercase tracking-wider">
                 <Link href="/privacy" className="hover:text-[#F2F0E9] transition-colors">Privacy</Link>
                 <Link href="/terms" className="hover:text-[#F2F0E9] transition-colors">Terms</Link>
                 <span>© {currentYear} SVR.</span>
              </div>
           </div>
        </div>

        {/* Huge Background Watermark */}
        <div className="absolute -bottom-10 left-0 w-full text-center pointer-events-none select-none overflow-hidden">
           <span className="font-serif text-[20vw] text-[#F2F0E9] opacity-[0.02] leading-none whitespace-nowrap">
              GLOBAL AMBITION
           </span>
        </div>

      </div>
    </footer>
  );
}
