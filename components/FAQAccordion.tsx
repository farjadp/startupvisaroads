// ============================================================================
// Component Source: components/FAQAccordion.tsx
// Version: 1.0.0 — FAQ Accordion Component
// Why: Display frequently asked questions with expandable answers
// Usage: All program pages, services pages, homepage
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Props:
//   - faqs: Array of FAQ objects with question and answer
// ============================================================================

'use client';

import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

/**
 * FAQAccordion Component
 *
 * Interactive accordion component for displaying FAQs in a space-efficient,
 * user-friendly manner. Helps address common questions and reduce friction
 * in the decision-making process.
 *
 * Features:
 * - Smooth expand/collapse animations
 * - Only one item open at a time (optional)
 * - Clear visual indicators for open/closed states
 * - SEO-friendly semantic HTML
 * - Accessible keyboard navigation
 *
 * Design Considerations:
 * - Clear question/answer hierarchy
 * - Sufficient padding for easy tap targets (mobile)
 * - Smooth transitions for better UX
 * - Brand-aligned styling
 *
 * Accessibility:
 * - Proper ARIA attributes
 * - Keyboard navigation support
 * - Focus indicators
 * - Screen reader friendly
 */
export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  // Track which FAQ item is currently open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /**
   * Toggle FAQ item open/closed
   * If clicking already-open item, close it
   * Otherwise, close any open item and open clicked item
   */
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="card overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            {/* Question Button */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left p-6 flex justify-between items-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              {/* Question Text */}
              <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors duration-300 flex-grow">
                {faq.question}
              </h3>

              {/* Expand/Collapse Icon */}
              <span
                className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-accent transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {/* Answer (Expandable) */}
            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 pt-0">
                <div className="pt-4 border-t border-primary/10">
                  <p className="text-primary-dark/80 leading-relaxed">
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
