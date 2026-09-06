'use client';

// ============================================================================
// Component: components/fa/QuizEcho.tsx
// One line at the top of a guide, for a reader who has already taken the
// assessment: either "this is the route you were pointed at", or "you were
// pointed somewhere else — here it is".
//
// Renders nothing on the server and nothing on the first client paint, so it
// can never cause a hydration mismatch and never shifts the layout for a
// reader who has not taken the quiz.
// ============================================================================
import React, { useEffect, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Link } from '@/navigation';
import { recall, forget, echoFor, type Echo } from '@/lib/fa/quiz-memory';

export default function QuizEcho({ pagePath }: { pagePath: string }) {
  const [echo, setEcho] = useState<Echo | null>(null);

  useEffect(() => {
    setEcho(echoFor(recall(), pagePath));
  }, [pagePath]);

  if (!echo) return null;

  return (
    <aside className="mt-8 flex flex-wrap items-center gap-3 border-s-2 border-[#CCFF00] bg-[#1a1a1a]/[0.04] ps-5 pe-3 py-3 text-sm">
      {echo.kind === 'match' ? (
        <span>ارزیابی شما همین مسیر را پیشنهاد داده بود.</span>
      ) : (
        <>
          <span className="text-[#1a1a1a]/75">ارزیابی شما «{echo.title}» را پیشنهاد داده بود.</span>
          <Link href={echo.href} className="group inline-flex items-center gap-1.5 font-bold">
            رفتن به آن راهنما
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </>
      )}
      <button
        type="button"
        onClick={() => { forget(); setEcho(null); }}
        aria-label="حذف نتیجه‌ی ارزیابی ذخیره‌شده"
        className="ms-auto p-1 text-[#1a1a1a]/45 hover:text-[#1a1a1a] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
}
