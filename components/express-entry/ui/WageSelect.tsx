// ============================================================================
// Express Entry — wage-level picker for the Labour Market Integration factor
// /components/express-entry/ui/WageSelect.tsx
// ============================================================================
'use client';

import React from 'react';
import type { WageMultiple } from '../../../lib/express-entry/types';

export interface WageSelectLabels {
  wage_none: string;
  wage_1_3: string;
  wage_1_5: string;
  wage_2: string;
}

const OPTIONS: { value: WageMultiple; key: keyof WageSelectLabels }[] = [
  { value: 'none', key: 'wage_none' },
  { value: '1.3x', key: 'wage_1_3' },
  { value: '1.5x', key: 'wage_1_5' },
  { value: '2x', key: 'wage_2' },
];

export default function WageSelect({
  name,
  value,
  onChange,
  t,
  noneLabel,
}: {
  name: string;
  value: WageMultiple | undefined;
  onChange: (v: WageMultiple) => void;
  t: WageSelectLabels;
  /** Overrides the 'none' option label (e.g. 'No' instead of 'No offer'). */
  noneLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {OPTIONS.map(({ value: v, key }) => {
        const isSelected = (value ?? 'none') === v;
        return (
          <label
            key={v}
            className={`px-4 py-2.5 border cursor-pointer text-sm font-sans transition-all select-none ${
              isSelected ? 'border-ink bg-ink text-paper' : 'border-ink/20 hover:border-ink/50 text-ink'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={v}
              checked={isSelected}
              onChange={() => onChange(v)}
              className="sr-only"
            />
            {v === 'none' && noneLabel ? noneLabel : t[key]}
          </label>
        );
      })}
    </div>
  );
}
