// ============================================================================
// Express Entry — Progress Bar Component
// /components/express-entry/ui/ProgressBar.tsx
// RTL-aware. Step labels from i18n dictionary.
// ============================================================================
'use client';

import React from 'react';

interface ProgressBarProps {
  currentStep: number; // 1-indexed
  totalSteps: number;
  stepLabels: string[];
  isRtl?: boolean;
}

export default function ProgressBar({ currentStep, totalSteps, stepLabels, isRtl = false }: ProgressBarProps) {
  const progressPct = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Step dots + connecting line */}
      <div className="relative flex items-center justify-between">
        {/* Progress track */}
        <div className="absolute top-1/2 -translate-y-1/2 h-px w-full bg-ink/10" />
        {/* Filled portion */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-px bg-ink transition-all duration-500 ease-out"
          style={isRtl ? { right: 0, width: `${progressPct}%` } : { left: 0, width: `${progressPct}%` }}
        />

        {/* Step dots */}
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                  isDone
                    ? 'bg-ink border-ink text-paper'
                    : isActive
                    ? 'bg-acid border-ink text-ink scale-110'
                    : 'bg-paper border-ink/20 text-ink/30'
                }`}
              >
                {isDone ? (
                  <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                ) : stepNum}
              </div>
              {/* Step label */}
              <span
                className={`absolute top-10 text-[10px] font-sans whitespace-nowrap tracking-wide uppercase transition-colors duration-300 ${
                  isActive ? 'text-ink font-semibold' : 'text-ink/40'
                }`}
              >
                {stepLabels[i]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-8" /> {/* spacer for labels */}
    </div>
  );
}
