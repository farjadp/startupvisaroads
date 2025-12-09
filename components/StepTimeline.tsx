// ============================================================================
// Component Source: components/StepTimeline.tsx
// Version: 1.0.0 — Process Steps Timeline Component
// Why: Visualize multi-step processes in a clear, linear fashion
// Usage: Program pages (application processes), service pages (engagement flow)
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Props:
//   - steps: Array of step objects with title, description, and optional details
//   - variant: Visual style ('vertical' or 'horizontal')
// ============================================================================

import React from 'react';

interface Step {
  title: string;
  description: string;
  details?: string[];
}

interface StepTimelineProps {
  steps: Step[];
  variant?: 'vertical' | 'horizontal';
}

/**
 * StepTimeline Component
 *
 * Displays multi-step processes in a clear, visual timeline format.
 * Helps users understand the journey and requirements for visa programs
 * or mentorship engagement processes.
 *
 * Design Goals:
 * - Clear progression from step to step
 * - Easy to scan and understand
 * - Visual indicators for each stage
 * - Optional detailed information per step
 *
 * Use Cases:
 * - Startup visa application processes
 * - Mentorship engagement workflow
 * - Business readiness milestones
 * - Document preparation checklists
 *
 * Accessibility:
 * - Semantic HTML with ordered lists
 * - Clear visual hierarchy
 * - Screen reader friendly
 */
export default function StepTimeline({
  steps,
  variant = 'vertical',
}: StepTimelineProps) {
  if (variant === 'horizontal') {
    // Horizontal timeline (for wider screens, fewer steps)
    return (
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-primary/20 hidden md:block">
          <div className="h-full bg-gradient-to-r from-primary via-accent to-secondary w-full"></div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number Circle */}
              <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg mx-auto">
                {index + 1}
              </div>

              {/* Step Content */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-primary-dark/80 mb-3">
                  {step.description}
                </p>

                {/* Optional Details */}
                {step.details && step.details.length > 0 && (
                  <ul className="text-xs text-primary-dark/70 space-y-1 text-left bg-background/50 rounded-lg p-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-accent mr-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vertical timeline (default, works well for mobile and many steps)
  return (
    <div className="relative">
      {/* Vertical Progress Line */}
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-primary/20">
        <div className="h-full bg-gradient-to-b from-primary via-accent to-secondary"></div>
      </div>

      {/* Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-start gap-6">
            {/* Step Number Circle */}
            <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {index + 1}
            </div>

            {/* Step Content */}
            <div className="flex-grow card mt-2">
              <h3 className="text-xl font-bold text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-primary-dark/80 mb-3 leading-relaxed">
                {step.description}
              </p>

              {/* Optional Details */}
              {step.details && step.details.length > 0 && (
                <ul className="space-y-2 mt-4 pt-4 border-t border-primary/10">
                  {step.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-primary-dark/70"
                    >
                      <span className="text-secondary mr-2 mt-1">▸</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
