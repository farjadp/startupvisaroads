// ============================================================================
// Component: components/FAQAccordion.tsx
// Style: High-End Editorial (Interactive & Smooth)
// ============================================================================

'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first one? or null

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`
              group relative overflow-hidden transition-all duration-500
              bg-white border
              ${isOpen 
                ? 'border-[#D4AF37] shadow-[0_10px_40px_-10px_rgba(212,175,55,0.1)]' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            {/* Active Indicator Strip (Left side) */}
            <div 
              className={`absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37] transition-transform duration-300 ${
                isOpen ? 'scale-y-100' : 'scale-y-0'
              }`} 
            />

            {/* Question Button */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-8 py-6 flex justify-between items-center gap-6 focus:outline-none"
              aria-expanded={isOpen}
            >
              <h3 
                className={`
                  font-serif text-lg md:text-xl transition-colors duration-300 pr-8
                  ${isOpen ? 'text-[#0f172a]' : 'text-gray-600 group-hover:text-[#0f172a]'}
                `}
              >
                {faq.question}
              </h3>

              {/* Icon Container */}
              <span
                className={`
                  flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300
                  ${isOpen 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-white rotate-180' 
                    : 'bg-transparent border-gray-300 text-gray-400 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]'
                  }
                `}
              >
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>

            {/* Answer (Animated Height) */}
            <div
              className={`
                grid transition-all duration-500 ease-in-out
                ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
              `}
            >
              <div className="overflow-hidden">
                <div className="px-8 pb-8 pt-0">
                  <div className={`h-px w-full bg-gray-100 mb-6 transition-all duration-500 ${isOpen ? 'w-full' : 'w-0'}`} />
                  <p className="text-gray-500 leading-relaxed text-sm md:text-base font-light">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}