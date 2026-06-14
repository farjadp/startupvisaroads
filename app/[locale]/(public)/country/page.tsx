// ============================================================================
// Page: src/app/country/page.tsx
// Style: Modernist Editorial (The Hub)
// Context: Main directory for all country profiles
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Map } from 'lucide-react';
import type { Metadata } from 'next';
import LifestyleCompass from '@/components/LifestyleCompass'; // Import


import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country', locale);
}

// Data for the grid
const COUNTRIES = [
  { 
    id: 'usa', 
    name: 'United States', 
    slug: 'usa',
    tag: 'National Interest', 
    desc: 'The global standard. EB-2 NIW & EB-1A for critical tech founders.',
    color: 'hover:border-[#B31942] hover:bg-[#B31942] hover:text-white',
    iconColor: 'text-[#B31942]'
  },
  { 
    id: 'canada', 
    name: 'Canada', 
    slug: 'canada',
    tag: 'The North', 
    desc: 'Strategic entry via SUV & ICT. The gateway to the North American market.',
    color: 'hover:border-[#D80027] hover:bg-[#D80027] hover:text-white',
    iconColor: 'text-[#D80027]'
  },
  { 
    id: 'uae', 
    name: 'U.A.E.', 
    slug: 'uae',
    tag: 'Future Capital', 
    desc: 'Zero tax. Golden Visa & Blue Visa. The new center of global wealth.',
    color: 'hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a1a1a]', // Gold needs dark text
    iconColor: 'text-[#D4AF37]'
  },
  { 
    id: 'australia', 
    name: 'Australia', 
    slug: 'australia',
    tag: 'Southern Giant', 
    desc: 'National Innovation Visa (NIV). Direct PR for distinguished talent.',
    color: 'hover:border-[#005555] hover:bg-[#005555] hover:text-[#F2F0E9]',
    iconColor: 'text-[#005555]'
  },
  { 
    id: 'finland', 
    name: 'Finland', 
    slug: 'finland',
    tag: 'Tech Speed', 
    desc: '14-Day Fast Track. The happiest tech ecosystem in the world.',
    color: 'hover:border-[#002F6C] hover:bg-[#002F6C] hover:text-white',
    iconColor: 'text-[#002F6C]'
  },
  { 
    id: 'denmark', 
    name: 'Denmark', 
    slug: 'denmark',
    tag: 'Nordic Precision', 
    desc: 'Start-up Denmark. For founders who value design and efficiency.',
    color: 'hover:border-[#003D73] hover:bg-[#003D73] hover:text-white',
    iconColor: 'text-[#003D73]'
  }
];

export default function CountryIndexPage() {
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          1. HERO: THE WORLD MAP
      ========================================= */}
      <section className="min-h-[60vh] flex flex-col justify-end pb-20 pt-32 border-b border-[#1a1a1a]/10">
        
        <div className="flex items-center gap-4 mb-8">
           <Globe className="w-4 h-4 text-[#1a1a1a]" />
           <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Global Presence</span>
        </div>

        <h1 className="font-serif text-[10vw] leading-[0.85] tracking-tighter mb-8">
           SELECT <br/>
           <span className="pl-[5vw] italic text-[#1a1a1a]/40">TERRITORY.</span>
        </h1>

        <div className="max-w-xl border-l-2 border-[#1a1a1a] pl-6">
           <p className="font-sans text-lg text-[#1a1a1a]/70 leading-relaxed">
              We operate in the world's most strategic economies. 
              Each jurisdiction offers a unique leverage: 
              <span className="text-[#1a1a1a] font-bold"> Tax, Talent, or Market Size.</span> 
              Choose your battlefield.
           </p>
        </div>
      </section>


      {/* =========================================
          2. THE GRID (Directory)
      ========================================= */}
      <section className="py-0">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-[#1a1a1a]/10">
            
            {COUNTRIES.map((country) => (
               <Link 
                  href={`/country/${country.slug}`} 
                  key={country.id}
                  className={`group border-r border-b border-[#1a1a1a]/10 p-12 min-h-[400px] flex flex-col justify-between transition-all duration-500 ${country.color}`}
               >
                  {/* Top: Meta */}
                  <div className="flex justify-between items-start">
                     <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                        {country.tag}
                     </span>
                     <ArrowRight className={`w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ${country.iconColor} group-hover:text-current`} />
                  </div>

                  {/* Middle: Title */}
                  <div>
                     <h2 className="font-serif text-5xl mb-4 group-hover:translate-x-2 transition-transform duration-500">
                        {country.name}
                     </h2>
                     <div className={`h-1 w-12 rounded-full mb-6 ${country.iconColor.replace('text-', 'bg-')} group-hover:bg-current`}></div>
                  </div>

                  {/* Bottom: Desc */}
                  <div>
                     <p className="font-sans text-sm opacity-60 group-hover:opacity-90 leading-relaxed max-w-xs">
                        {country.desc}
                     </p>
                  </div>
               </Link>
            ))}

         </div>
      </section>



      {/* =========================================
          4. LIFESTYLE COMPASS (New Section)
      ========================================= */}
      <section className="py-0 border-t border-[#1a1a1a]/10">
         <LifestyleCompass />
      </section>


      
      {/* =========================================
          3. STRATEGIC COMPARISON CTA
      ========================================= */}
      <section className="py-32 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8 mt-0">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 items-center">
            
            <div className="md:w-1/2">
               <div className="flex items-center gap-4 mb-6">
                  <Map className="w-12 h-12 text-[#CCFF00]" />
                  <h2 className="font-serif text-5xl">Undecided?</h2>
               </div>
               <p className="font-sans text-lg opacity-70 leading-relaxed mb-8">
                  Does your IP belong in Delaware or Dubai? <br/>
                  Is the Canadian SUV faster than the Australian NIV? <br/>
                  We use a proprietary matrix to score your profile against all 6 jurisdictions simultaneously.
               </p>
            </div>

            <div className="md:w-1/2 flex flex-col gap-4 w-full max-w-md">
               <Link href="/contact" className="bg-[#CCFF00] text-[#1a1a1a] px-8 py-6 font-sans font-bold uppercase tracking-widest text-center hover:bg-white transition-colors">
                  Run Global Matrix
               </Link>
               <div className="flex justify-between text-xs opacity-40 font-mono uppercase tracking-widest px-2">
                  <span>Cross-Border Tax</span>
                  <span>•</span>
                  <span>Residency Speed</span>
                  <span>•</span>
                  <span>Capital Access</span>
               </div>
            </div>

         </div>
      </section>

    </div>
  );
}