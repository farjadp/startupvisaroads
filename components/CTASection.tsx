// ============================================================================
// Component: components/CTASection.tsx
// Style: High-End Advisory / Cinematic
// Focus: Conversion, Trust, Authority
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CTAButton {
  text: string;
  link: string;
}

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA: CTAButton;
  secondaryCTA?: CTAButton;
  variant?: 'default' | 'gradient' | 'minimal';
}

export default function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = 'gradient',
}: CTASectionProps) {
  
  // 1. VARIANT STYLING CONFIGURATION
  const styles = {
    gradient: {
      wrapper: "relative bg-[#0f172a] text-white border-y border-[#D4AF37]/30 overflow-hidden",
      title: "text-white",
      desc: "text-gray-400",
      primaryBtn: "bg-[#D4AF37] text-white hover:bg-white hover:text-[#0f172a]",
      secondaryBtn: "border border-white/20 text-white hover:bg-white/10",
      disclaimer: "text-gray-500"
    },
    default: {
      wrapper: "bg-white text-[#0f172a] border border-gray-100 shadow-2xl",
      title: "text-[#0f172a]",
      desc: "text-gray-600",
      primaryBtn: "bg-[#0f172a] text-white hover:bg-[#D4AF37]",
      secondaryBtn: "border border-[#0f172a]/20 text-[#0f172a] hover:bg-gray-50",
      disclaimer: "text-gray-400"
    },
    minimal: {
      wrapper: "bg-[#F8F9FA] text-[#0f172a] border-t border-gray-200",
      title: "text-[#0f172a]",
      desc: "text-gray-500",
      primaryBtn: "bg-transparent border-b border-[#0f172a] text-[#0f172a] px-0 py-1 hover:text-[#D4AF37] hover:border-[#D4AF37] !rounded-none",
      secondaryBtn: "hidden", // Usually minimal doesn't need secondary
      disclaimer: "text-gray-400"
    }
  };

  const currentStyle = styles[variant];
  const isMinimal = variant === 'minimal';

  return (
    <section className={`py-20 md:py-28 px-6 lg:px-12 ${isMinimal ? 'py-16' : ''}`}>
      <div 
        className={`
          max-w-5xl mx-auto rounded-sm relative 
          ${variant !== 'minimal' ? 'p-10 md:p-16 text-center' : 'text-left max-w-7xl mx-auto'}
          ${currentStyle.wrapper}
        `}
      >
        {/* Decorative Background for Gradient Variant */}
        {variant === 'gradient' && (
          <>
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          </>
        )}

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Header */}
          <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl mb-6 ${currentStyle.title} ${isMinimal ? 'text-left w-full' : ''}`}>
            {title}
          </h2>

          {/* Description */}
          <p className={`text-lg leading-relaxed max-w-2xl mb-10 ${currentStyle.desc} ${isMinimal ? 'text-left w-full mb-6' : ''}`}>
            {description}
          </p>

          {/* Buttons */}
          <div className={`flex flex-col sm:flex-row gap-5 ${isMinimal ? 'w-full justify-start' : 'justify-center'}`}>
            
            {/* Primary CTA */}
            <Link
              href={primaryCTA.link}
              className={`
                ${currentStyle.primaryBtn} 
                ${isMinimal ? '' : 'px-10 py-4 rounded-sm shadow-lg'}
                font-bold text-sm uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 group
              `}
            >
              {primaryCTA.text}
              {!isMinimal && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              {isMinimal && <ArrowRight className="w-4 h-4 ml-2" />}
            </Link>

            {/* Secondary CTA */}
            {secondaryCTA && !isMinimal && (
              <Link
                href={secondaryCTA.link}
                className={`
                  ${currentStyle.secondaryBtn} 
                  px-10 py-4 rounded-sm font-bold text-sm uppercase tracking-[0.15em] transition-all duration-300
                `}
              >
                {secondaryCTA.text}
              </Link>
            )}
          </div>

          {/* Trust/Legal Indicator */}
          {!isMinimal && (
            <div className={`mt-10 pt-8 border-t border-current border-opacity-10 w-full max-w-lg flex items-center justify-center gap-2 ${currentStyle.disclaimer}`}>
              <CheckCircle2 className="w-4 h-4 opacity-70" />
              <p className="text-xs tracking-wide opacity-80">
                Business Advisory Services • Not a Law Firm
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}