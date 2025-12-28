// ============================================================================
// Page: app/uae/page.tsx
// Style: Modernist Editorial + "Desert Gold & Future" Theme
// Context: UAE Country Profile & Golden/Blue/Green Visa Advisory
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Crown, 
  Zap, 
  Droplets, 
  Building2, 
  Gem, 
  Briefcase,
  TrendingUp,
  MapPin,
  Check
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UAE | The Future Capital',
  description: 'Golden, Green, and Blue Visas. Strategic residency in Dubai and Abu Dhabi for global founders.',
};

export default function UAEPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE MIRAGE BECAME REAL
      ========================================= */}
      <section className="min-h-[85vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10 relative overflow-hidden">
        
        {/* Background Abstract (Golden Dunes) */}
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-gradient-to-t from-[#D4AF37] to-transparent opacity-10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

        <div className="flex items-center gap-4 mb-8 relative z-10">
           <span className="w-3 h-3 bg-[#D4AF37] border border-[#1a1a1a]"></span> {/* Desert Gold */}
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Destination: United Arab Emirates</span>
        </div>

        <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter mb-12 relative z-10">
           FUTURE <br/>
           <span className="pl-[10vw] italic text-[#D4AF37]">CAPITAL.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end relative z-10">
           <div className="lg:col-span-7">
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                 Zero Personal Tax. <br/>
                 100% Foreign Ownership. <br/>
                 <span className="bg-[#1a1a1a] text-[#F2F0E9] px-2 italic">The new center of the world.</span>
              </p>
           </div>
           <div className="lg:col-span-5">
              <p className="font-sans text-sm text-[#1a1a1a]/70 leading-relaxed text-justify border-l-2 border-[#D4AF37] pl-6">
                 The UAE has evolved beyond oil. It is now the global HQ for Web3, AI, and Family Offices. 
                 With the introduction of the <strong>Blue Visa (2025)</strong> alongside the Golden and Green tiers, it offers the most diversified residency portfolio in the world.
              </p>
           </div>
        </div>
      </section>


      {/* =========================================
          2. MARKET INTEL (Dubai vs Abu Dhabi)
      ========================================= */}
      <section className="py-24 border-b border-[#1a1a1a]/10">
         <div className="mb-16">
            <h2 className="font-serif text-5xl mb-6">Choose Your Arena</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg">
               Two cities, two distinct strategies. Where does your business belong?
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#1a1a1a]/10">
            
            {/* DUBAI */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a]/10 hover:bg-white transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                  <Building2 className="w-24 h-24 text-[#D4AF37]" />
               </div>
               <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4 block">The Commercial Hub</span>
               <h3 className="font-serif text-4xl mb-6">Dubai</h3>
               <p className="font-sans text-sm text-[#1a1a1a]/70 mb-8 leading-relaxed max-w-sm">
                  Optimized for Speed, Fintech, Crypto, and E-commerce. Home to DIFC and DMCC. 
                  Fast setup, high visibility, cosmopolitan lifestyle.
               </p>
               <div className="flex gap-2">
                  <span className="bg-[#1a1a1a] text-white px-3 py-1 text-xs font-bold uppercase">DIFC</span>
                  <span className="bg-[#1a1a1a] text-white px-3 py-1 text-xs font-bold uppercase">DMCC</span>
                  <span className="bg-[#1a1a1a] text-white px-3 py-1 text-xs font-bold uppercase">DWTC</span>
               </div>
            </div>

            {/* ABU DHABI */}
            <div className="p-12 hover:bg-white transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                  <Gem className="w-24 h-24 text-[#1a1a1a]" />
               </div>
               <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4 block">The Capital</span>
               <h3 className="font-serif text-4xl mb-6">Abu Dhabi</h3>
               <p className="font-sans text-sm text-[#1a1a1a]/70 mb-8 leading-relaxed max-w-sm">
                  Optimized for Deep Tech, AI, Healthcare, and Clean Energy. 
                  Backed by massive sovereign wealth funds (ADGM, Hub71). Slower pace, higher capital support.
               </p>
               <div className="flex gap-2">
                  <span className="border border-[#1a1a1a] text-[#1a1a1a] px-3 py-1 text-xs font-bold uppercase">ADGM</span>
                  <span className="border border-[#1a1a1a] text-[#1a1a1a] px-3 py-1 text-xs font-bold uppercase">Hub71</span>
                  <span className="border border-[#1a1a1a] text-[#1a1a1a] px-3 py-1 text-xs font-bold uppercase">Masdar</span>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          3. THE TRINITY: GOLDEN, GREEN, BLUE
      ========================================= */}
      <section className="py-24">
         <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-5xl mb-6">The Visa Portfolio</h2>
            <p className="font-sans text-[#1a1a1a]/60 text-lg">
               Residency is no longer "one size fits all". Select the tier that matches your asset class.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* GOLDEN VISA */}
            <div className="bg-[#1a1a1a] text-[#F2F0E9] p-8 md:p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-bl-full opacity-20"></div>
               <Crown className="w-10 h-10 text-[#D4AF37] mb-6" />
               <h3 className="font-serif text-3xl mb-2 text-[#D4AF37]">Golden Visa</h3>
               <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-6">10-Year Residency</p>
               
               <ul className="space-y-4 font-sans text-sm mb-8">
                  <li className="flex gap-3"><Check className="w-4 h-4 text-[#D4AF37]"/> Property Investment (AED 2M+)</li>
                  <li className="flex gap-3"><Check className="w-4 h-4 text-[#D4AF37]"/> Bank Deposit (AED 2M)</li>
                  <li className="flex gap-3"><Check className="w-4 h-4 text-[#D4AF37]"/> Entrepreneur (AED 500k Project)</li>
               </ul>
               <Link href="/contact" className="inline-block border-b border-[#D4AF37] pb-1 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                  Check Eligibility
               </Link>
            </div>

            {/* GREEN VISA */}
            <div className="border border-[#1a1a1a]/10 bg-white p-8 md:p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
               <Zap className="w-10 h-10 text-[#1a1a1a] mb-6" />
               <h3 className="font-serif text-3xl mb-2">Green Visa</h3>
               <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6">5-Year Residency</p>
               
               <ul className="space-y-4 font-sans text-sm mb-8 text-[#1a1a1a]/70">
                  <li className="flex gap-3"><Check className="w-4 h-4 text-[#1a1a1a]"/> Freelancers / Self-Employed</li>
                  <li className="flex gap-3"><Check className="w-4 h-4 text-[#1a1a1a]"/> Skilled Employees (No Sponsor)</li>
                  <li className="flex gap-3"><Check className="w-4 h-4 text-[#1a1a1a]"/> Investors (AED 1M)</li>
               </ul>
               <Link href="/contact" className="inline-block border-b border-[#1a1a1a] pb-1 text-[#1a1a1a] text-xs font-bold uppercase tracking-widest">
                  Start Process
               </Link>
            </div>

            {/* BLUE VISA (NEW) */}
            <div className="bg-[#F2F0E9] border border-[#1a1a1a]/10 p-8 md:p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
               <div className="absolute inset-0 bg-blue-500/5"></div>
               <Droplets className="w-10 h-10 text-blue-600 mb-6 relative z-10" />
               <h3 className="font-serif text-3xl mb-2 text-blue-900 relative z-10">Blue Visa</h3>
               <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 relative z-10 text-blue-800">10-Year Sustainability</p>
               
               <ul className="space-y-4 font-sans text-sm mb-8 text-blue-900/70 relative z-10">
                  <li className="flex gap-3"><Check className="w-4 h-4 text-blue-600"/> Environmental Champions</li>
                  <li className="flex gap-3"><Check className="w-4 h-4 text-blue-600"/> Sustainability Tech Founders</li>
                  <li className="flex gap-3"><Check className="w-4 h-4 text-blue-600"/> International NGO Members</li>
               </ul>
               <Link href="/contact" className="relative z-10 inline-block border-b border-blue-900 pb-1 text-blue-900 text-xs font-bold uppercase tracking-widest">
                  View Criteria
               </Link>
            </div>

         </div>
      </section>


      {/* =========================================
          4. THE STRATEGY: SETUP & BANKING
      ========================================= */}
      <section className="py-24 border-t border-[#1a1a1a]/10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
               <h2 className="font-serif text-4xl mb-6">Beyond the Visa</h2>
               <div className="w-12 h-1 bg-[#D4AF37] mb-6"></div>
               <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed mb-6">
                  Getting the residency is the easy part. The challenge is the infrastructure. 
                  Setting up a corporate bank account in the UAE can take 3-6 months if structured incorrectly.
               </p>
               <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed">
                  We handle the "Mainland vs Free Zone" selection to ensure your business entity is compliant with Economic Substance Regulations (ESR) and bankable from Day 1.
               </p>
            </div>

            <div className="lg:col-span-7">
               <div className="bg-[#1a1a1a] p-10 text-[#F2F0E9]">
                  <h4 className="font-serif text-2xl mb-8">SVR Corporate Services</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans text-sm">
                     <div className="border-l border-[#D4AF37] pl-4">
                        <span className="font-bold block mb-1 text-[#D4AF37]">Structure</span>
                        <p className="opacity-60">LLC vs Free Zone Entity selection based on target market.</p>
                     </div>
                     <div className="border-l border-[#D4AF37] pl-4">
                        <span className="font-bold block mb-1 text-[#D4AF37]">Banking</span>
                        <p className="opacity-60">Direct intro to Wio, ENBD, and Mashreq relationship managers.</p>
                     </div>
                     <div className="border-l border-[#D4AF37] pl-4">
                        <span className="font-bold block mb-1 text-[#D4AF37]">Tax</span>
                        <p className="opacity-60">Corporate Tax (9%) registration and exemption planning.</p>
                     </div>
                     <div className="border-l border-[#D4AF37] pl-4">
                        <span className="font-bold block mb-1 text-[#D4AF37]">Concierge</span>
                        <p className="opacity-60">Emirates ID VIP processing and Medical biometrics fast-track.</p>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </section>


      {/* =========================================
          5. CTA
      ========================================= */}
      <section className="py-32 text-center border-t border-[#1a1a1a]/10">
         <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Habibi, Welcome Home.
         </h2>
         <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            The Golden Visa is the ultimate asset protection strategy. 
            Let's determine if you qualify via Real Estate or Entrepreneurship.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#D4AF37] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#D4AF37] transition-colors">
               Start Golden Visa Audit
            </Link>
            <Link href="/" className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors">
               Compare Jurisdictions
            </Link>
         </div>
      </section>

    </div>
  );
}