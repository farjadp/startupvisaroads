// ============================================================================
// Component: components/CountryCard.tsx
// Style: Cinematic Luxury / Travel Editorial
// Focus: Visual Appeal, Clear Hierarchy
// ============================================================================

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

interface CountryCardProps {
  countryName: string;
  programName: string;
  flagEmoji?: string; // Kept for compatibility, but we rely on images mainly
  description: string;
  highlights: string[];
  link: string;
  imageSrc?: string; // Optional: specific image override
}

/**
 * Helper to get default luxury images if none provided
 */
const getCountryImage = (name: string) => {
  const map: Record<string, string> = {
    'Canada': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1965&auto=format&fit=crop',
    'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop',
    'Netherlands': 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a2?q=80&w=2070&auto=format&fit=crop',
    'Denmark': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070&auto=format&fit=crop',
    'UAE': 'https://images.unsplash.com/photo-1512453979798-5ea904acfb5b?q=80&w=2000&auto=format&fit=crop',
    'USA': 'https://images.unsplash.com/photo-1485871981535-75a6c71f9d66?q=80&w=2070&auto=format&fit=crop',
    'Finland': 'https://images.unsplash.com/photo-1548232979-6c557ee14752?q=80&w=2071&auto=format&fit=crop'
  };
  // Default fallback image (Abstract architecture)
  return map[name] || map[Object.keys(map).find(key => name.includes(key)) || ''] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop';
};

export default function CountryCard({
  countryName,
  programName,
  flagEmoji,
  description,
  highlights,
  link,
  imageSrc
}: CountryCardProps) {
  
  const finalImage = imageSrc || getCountryImage(countryName);

  return (
    <Link href={link} className="block h-full group">
      <div className="h-full bg-white border border-gray-100 hover:border-[#D4AF37]/50 rounded-sm overflow-hidden transition-all duration-500 hover:shadow-2xl flex flex-col">
        
        {/* 1. Image Header (Cinematic) */}
        <div className="relative h-56 overflow-hidden">
          <Image 
            src={finalImage} 
            alt={`${countryName} Skyline`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent opacity-90" />
          
          {/* Floating Label */}
          <div className="absolute bottom-4 left-6">
            <div className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
              {flagEmoji && <span className="text-sm">{flagEmoji}</span>}
              {programName}
            </div>
            <h3 className="text-white font-serif text-3xl tracking-wide">
              {countryName}
            </h3>
          </div>
        </div>

        {/* 2. Content Body */}
        <div className="p-8 flex flex-col flex-grow">
          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
            {description}
          </p>

          {/* Highlights Divider */}
          <div className="w-10 h-[1px] bg-[#D4AF37]/30 mb-6"></div>

          {/* Highlights List */}
          <div className="space-y-3 mb-8 flex-grow">
            {highlights.slice(0, 3).map((highlight, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 w-4 h-4 rounded-full border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37] transition-colors">
                  <Check className="w-2.5 h-2.5 text-[#D4AF37] group-hover:text-white" />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {highlight}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Footer */}
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[#0f172a] group-hover:text-[#D4AF37] transition-colors">
            <span className="text-xs font-bold uppercase tracking-widest">
              View Jurisdiction
            </span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}