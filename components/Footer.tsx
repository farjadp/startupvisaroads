// ============================================================================
// Component: components/Footer.tsx
// Style: Modernist Editorial (Dark Mode)
// Context: Global Navigation & Legal Disclaimer
// ============================================================================

import React from 'react';
import { Link } from '@/navigation';
import { 
  ArrowUpRight, 
  Linkedin, 
  Twitter, 
  Instagram,
  Globe
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-[#F2F0E9] pt-24 pb-8 relative overflow-hidden border-t border-[#CCFF00]">
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top Section: Brand & Strategy */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-24 gap-16">
           
           {/* Brand Column */}
           <div className="lg:w-1/3">
              <Link href="/" className="inline-block mb-8 group">
                 <h2 className="font-serif text-6xl md:text-8xl leading-none tracking-tighter group-hover:text-[#CCFF00] transition-colors duration-500">
                    Visa Roads
                 </h2>
              </Link>
              <p className="font-sans text-lg text-[#F2F0E9]/60 leading-relaxed max-w-sm">
                 We build the bridges for the ambitious to walk across. <br/>
                 Global mobility architecture for the 1%.
              </p>
              
              {/* Socials (Ashavid official profiles) */}
              <div className="flex gap-4 mt-12">
                 {[
                    { Icon: Linkedin, href: 'https://www.linkedin.com/company/ashavid/', label: 'LinkedIn' },
                    { Icon: Twitter, href: 'https://x.com/ashavidgroup', label: 'X (Twitter)' },
                    { Icon: Instagram, href: 'https://www.instagram.com/ashavidgroup/', label: 'Instagram' },
                 ].map(({ Icon, href, label }, i) => (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-12 h-12 rounded-full border border-[#F2F0E9]/20 flex items-center justify-center hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-all duration-300">
                       <Icon size={20} />
                    </a>
                 ))}
              </div>
           </div>

           {/* Navigation Grid */}
           <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Column 1: Global Access */}
              <div>
                 <h4 className="font-sans text-xs font-bold text-[#CCFF00] mb-8 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={12}/> Global Access
                 </h4>
                 <ul className="space-y-4 font-serif text-2xl text-[#F2F0E9]/80">
                    <li><Link href="/pnp" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Canada (PNP)</Link></li>
                    <li><Link href="/country/denmark" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Denmark (SUV)</Link></li>
                    <li><Link href="/europe/netherlands" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Netherlands (SUV)</Link></li>
                    <li><Link href="/europe/finland" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Finland (SUV)</Link></li>
                    <li><Link href="/usa/eb2-niw" className="hover:text-[#CCFF00] hover:pl-2 transition-all">USA (NIW)</Link></li>
                 </ul>
              </div>

              {/* Column 2: Strategy */}
              <div>
                 <h4 className="font-sans text-xs font-bold text-[#CCFF00] mb-8 uppercase tracking-widest">Strategy</h4>
                 <ul className="space-y-4 font-serif text-2xl text-[#F2F0E9]/80">
                    <li><Link href="/services" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Advisory</Link></li>
                    <li><Link href="/mentorship" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Mentorship</Link></li>
                    <li><Link href="/country" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Jurisdictions</Link></li>
                    <li><Link href="/blog" className="hover:text-[#CCFF00] hover:pl-2 transition-all">Blog</Link></li>
                    <li><Link href="/about" className="hover:text-[#CCFF00] hover:pl-2 transition-all">The Firm</Link></li>
                 </ul>
              </div>

              {/* Column 3: Headquarters */}
              <div>
                 <h4 className="font-sans text-xs font-bold text-[#CCFF00] mb-8 uppercase tracking-widest">Headquarters</h4>
                 <address className="not-italic font-sans text-[#F2F0E9]/60 space-y-2 mb-8 text-sm leading-relaxed">
                    <strong>Visa Roads Inc.</strong><br/>
                    Financial District<br/>
                    Toronto, ON, Canada<br/>
                    <a href="mailto:hello@ashavid.ca" className="hover:text-white transition-colors">hello@ashavid.ca</a>
                 </address>
                 
                 <Link href="/contact" className="inline-flex items-center gap-2 font-sans font-bold border-b border-[#CCFF00] pb-1 hover:text-[#CCFF00] transition-colors text-sm tracking-widest uppercase">
                    Schedule Audit <ArrowUpRight size={14} />
                 </Link>
                 
                 <div className="mt-8 pt-8 border-t border-[#F2F0E9]/10">
                    <Link href="/login" className="text-[10px] font-sans text-[#F2F0E9]/30 hover:text-[#CCFF00] transition-colors uppercase tracking-widest">
                       Client Portal Access
                    </Link>
                 </div>
              </div>

           </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-[#F2F0E9]/10 pt-10 pb-20">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-[#b91c1c] rounded-full"></div>
                    <h5 className="font-sans text-[10px] font-bold text-[#F2F0E9] uppercase tracking-widest">Disclaimer</h5>
                 </div>
                 <p className="font-sans text-[10px] text-[#F2F0E9]/40 text-justify leading-relaxed max-w-3xl">
                    Visa Roads Inc. is a strategic business advisory firm specializing in international expansion and startup consulting. 
                    <strong> We are NOT a law firm </strong> and do not provide legal advice or immigration representation. 
                    Our services are strictly limited to business plan development, market research, and corporate structuring. 
                    All legal filings, visa petitions, and government forms must be handled by licensed immigration attorneys or RCICs. 
                    We do not guarantee visa issuance, as such decisions remain the sole prerogative of the respective government authorities.
                 </p>
              </div>
              <div className="lg:col-span-4 flex flex-col md:flex-row justify-end items-end gap-6 text-[10px] text-[#F2F0E9]/40 font-sans uppercase tracking-widest">
                 <Link href="/privacy" className="hover:text-[#F2F0E9] transition-colors">Privacy Policy</Link>
                 <Link href="/terms" className="hover:text-[#F2F0E9] transition-colors">Terms of Service</Link>
                 <span>© {currentYear} Visa Roads Inc.</span>
              </div>
           </div>
        </div>

      </div>

      {/* Background Watermark (Subtle) */}
      <div className="absolute -bottom-[5vw] left-0 w-full text-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
         <span className="font-serif text-[25vw] text-[#F2F0E9] leading-none whitespace-nowrap">
            BORDERLESS
         </span>
      </div>

    </footer>
  );
}