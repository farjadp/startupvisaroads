// ============================================================================
// Component: components/fa/DataTable.tsx
// A reference table inside a guide section: the thresholds of two streams
// side by side, a fee schedule, a point table. Server component, no state.
//
// Design: ink header on paper, hairline rows, the first column bold because
// it is the row's name. On a phone the table scrolls sideways inside its own
// frame rather than squeezing four columns into nothing; the frame's edge
// shows there is more. Numbers in the content are already Persian digits.
// ============================================================================
import React from 'react';
import type { FaTable } from '@/lib/fa/content';

export default function DataTable({ table }: { table: FaTable }) {
  const cols = table.head.length;
  return (
    <figure className="my-2 max-w-none">
      {table.caption && (
        <figcaption className="mb-3 flex items-center gap-3 text-sm font-bold text-[#1a1a1a]">
          <span className="h-2 w-2 bg-[var(--ra,#CCFF00)] border border-[#1a1a1a]" aria-hidden />
          {table.caption}
        </figcaption>
      )}
      <div className="overflow-x-auto rounded-2xl border border-[#1a1a1a]/15 bg-white [scrollbar-width:thin]">
        <table className="w-full min-w-[32rem] border-collapse text-base leading-[1.7]">
          <thead>
            <tr className="bg-[var(--rd,#1a1a1a)] text-white">
              {table.head.map((h, i) => (
                <th key={i} scope="col" className={`px-4 py-3 text-start font-estedad font-bold align-top ${i === 0 ? 'w-[30%]' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className="border-t border-[#1a1a1a]/20 odd:bg-white even:bg-[var(--rs,#F2F0E9)]/60 align-top">
                {Array.from({ length: cols }).map((_, j) => {
                  const cell = r[j] ?? '';
                  return j === 0 ? (
                    <th key={j} scope="row" className="px-4 py-3 text-start font-bold text-[#1a1a1a]">{cell}</th>
                  ) : (
                    <td key={j} className="px-4 py-3 text-[#1a1a1a]/85">{cell}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="mt-2 text-sm text-[#1a1a1a]/60 leading-relaxed">{table.note}</p>}
    </figure>
  );
}
