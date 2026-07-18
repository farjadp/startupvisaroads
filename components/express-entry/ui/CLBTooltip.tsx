// ============================================================================
// Express Entry — CLB Tooltip Component
// /components/express-entry/ui/CLBTooltip.tsx
// Shows IELTS/CELPIP/TEF conversion table on demand.
// ============================================================================
'use client';

import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface CLBTooltipProps {
  locale: string;
}

// Inline conversion data — based on language-conversion.json
const IELTS_TABLE = [
  { clb: 10, speaking: '7.5–9.0', listening: '8.5–9.0', reading: '8.0–9.0', writing: '7.5–9.0' },
  { clb: 9, speaking: '7.0', listening: '8.0', reading: '7.0', writing: '7.0' },
  { clb: 8, speaking: '6.5', listening: '7.5', reading: '6.5', writing: '6.5' },
  { clb: 7, speaking: '6.0', listening: '6.0', reading: '6.0', writing: '6.0' },
  { clb: 6, speaking: '5.5', listening: '5.5', reading: '5.0', writing: '5.5' },
  { clb: 5, speaking: '5.0', listening: '5.0', reading: '4.0', writing: '5.0' },
  { clb: 4, speaking: '4.5', listening: '4.5', reading: '3.5', writing: '4.0' },
];

const CELPIP_TABLE = [
  { clb: 10, score: '10' },
  { clb: 9, score: '9' },
  { clb: 8, score: '8' },
  { clb: 7, score: '7' },
  { clb: 6, score: '6' },
  { clb: 5, score: '5' },
  { clb: 4, score: '4' },
];

export default function CLBTooltip({ locale }: CLBTooltipProps) {
  const [open, setOpen] = useState(false);
  const isRtl = locale === 'fa';

  const labels = isRtl
    ? { title: 'تبدیل نمره به CLB', speaking: 'صحبت کردن', listening: 'شنیدن', reading: 'خواندن', writing: 'نوشتن', clb: 'CLB', ielts: 'IELTS (آیلتس)', celpip: 'CELPIP (سلپیپ)', close: 'بستن', source: 'منبع رسمی: canada.ca' }
    : { title: 'Test Score → CLB Conversion', speaking: 'Speaking', listening: 'Listening', reading: 'Reading', writing: 'Writing', clb: 'CLB', ielts: 'IELTS (General)', celpip: 'CELPIP (General)', close: 'Close', source: 'Official source: canada.ca' };

  return (
    <div className="inline-block relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs text-ink/50 hover:text-ink underline underline-offset-2 transition-colors cursor-pointer"
        aria-label={isRtl ? 'نمایش جدول تبدیل CLB' : 'Show CLB conversion table'}
        aria-expanded={open}
      >
        <Info size={12} />
        {isRtl ? 'CLB من چقدر است؟' : 'How do I know my CLB?'}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clb-tooltip-title"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="bg-paper border border-ink/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-start justify-between p-4 border-b border-ink/10">
                <h3 id="clb-tooltip-title" className="font-sans font-semibold text-sm text-ink">
                  {labels.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-ink/40 hover:text-ink transition-colors"
                  aria-label={labels.close}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* IELTS Table */}
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-ink/50 mb-2">{labels.ielts}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-ink/5">
                          <th className="p-2 text-start font-semibold border border-ink/10">{labels.clb}</th>
                          <th className="p-2 text-start font-semibold border border-ink/10">{labels.speaking}</th>
                          <th className="p-2 text-start font-semibold border border-ink/10">{labels.listening}</th>
                          <th className="p-2 text-start font-semibold border border-ink/10">{labels.reading}</th>
                          <th className="p-2 text-start font-semibold border border-ink/10">{labels.writing}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {IELTS_TABLE.map((row) => (
                          <tr key={row.clb} className="hover:bg-ink/[0.02]">
                            <td className="p-2 font-mono font-bold border border-ink/10 bg-acid/20">{row.clb}</td>
                            <td className="p-2 border border-ink/10">{row.speaking}</td>
                            <td className="p-2 border border-ink/10">{row.listening}</td>
                            <td className="p-2 border border-ink/10">{row.reading}</td>
                            <td className="p-2 border border-ink/10">{row.writing}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CELPIP Table */}
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-ink/50 mb-2">{labels.celpip}</h4>
                  <p className="text-xs text-ink/60 mb-2">
                    {isRtl
                      ? 'CELPIP به صورت ۱:۱ به CLB تبدیل می‌شود: نمره ۴ = CLB 4، نمره ۹ = CLB 9، نمره ۱۲ = CLB 12'
                      : 'CELPIP maps 1:1 to CLB: Score 4 = CLB 4, Score 9 = CLB 9, Score 12 = CLB 12'}
                  </p>
                </div>

                <p className="text-xs text-ink/40 border-t border-ink/10 pt-4">
                  {labels.source}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
