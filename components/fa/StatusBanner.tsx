// ============================================================================
// Component: components/fa/StatusBanner.tsx
// A programme-status notice. Sits directly under a page hero so a reader
// who lands from search learns the programme's state before the guide.
// ============================================================================
import React from 'react';
import { ArrowLeft, CircleOff, PauseCircle, RefreshCw } from 'lucide-react';
import { Link } from '@/navigation';
import type { FaStatus } from '@/lib/fa/content';

const ICON = { closed: CircleOff, paused: PauseCircle, changed: RefreshCw } as const;

export default function StatusBanner({ status }: { status: FaStatus }) {
  const Icon = ICON[status.tone];
  return (
    <aside role="status" className="my-10 bg-[#1a1a1a] text-[#F2F0E9] p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <div className="md:col-span-1 flex md:justify-center">
        <Icon className="w-8 h-8 text-[#CCFF00]" aria-hidden />
      </div>
      <div className="md:col-span-8">
        <h2 className="font-estedad font-black text-2xl md:text-3xl leading-tight mb-3">{status.title}</h2>
        <p className="text-[#F2F0E9]/80 leading-[1.9] max-w-3xl">{status.body}</p>
      </div>
      {status.cta && (
        <div className="md:col-span-3 md:justify-self-end">
          <Link
            href={status.cta.href}
            className="group inline-flex items-center gap-3 bg-[#CCFF00] text-black px-6 py-4 font-bold hover:bg-[#F2F0E9] transition-colors"
          >
            {status.cta.label}
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </aside>
  );
}
