'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, AlertTriangle, Send } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Autofill email from query parameters
  useEffect(() => {
    const emailParam = searchParams?.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
      } else {
        throw new Error(data.error || 'Failed to unsubscribe');
      }
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : String(err));
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-4 text-[#1a1a1a]">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold">
              عضویت شما با موفقیت لغو شد
            </h2>
            <p className="font-sans text-sm text-[#1a1a1a]/60 max-w-md mx-auto leading-relaxed">
              نشانی ایمیل شما از لیست خبرنامه حذف گردید و دیگر ایمیلی دریافت نخواهید کرد.
            </p>
          </div>
          <div className="border-t border-[#1a1a1a]/10 pt-4 space-y-1">
            <h2 className="font-sans text-xl font-bold">
              Unsubscribed Successfully
            </h2>
            <p className="font-sans text-sm text-[#1a1a1a]/60 max-w-md mx-auto leading-relaxed">
              Your email address has been removed from our list. You will no longer receive marketing emails from us.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#1a1a1a]">
      <div className="text-center space-y-4">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl font-bold">
            لغو عضویت از خبرنامه
          </h1>
          <p className="font-sans text-sm text-[#1a1a1a]/60 max-w-md mx-auto leading-relaxed">
            برای لغو عضویت و عدم دریافت ایمیل‌های بازاریابی آینده، لطفاً ایمیل خود را تایید کنید.
          </p>
        </div>
        <div className="border-t border-[#1a1a1a]/10 pt-4 space-y-1">
          <h1 className="font-sans text-xl font-bold">
            Unsubscribe from Newsletter
          </h1>
          <p className="font-sans text-sm text-[#1a1a1a]/60 max-w-md mx-auto leading-relaxed">
            To unsubscribe and stop receiving marketing emails, please confirm your email address below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div className="relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="نشانی ایمیل شما / Your email address"
            className="w-full border border-[#1a1a1a]/10 rounded-xl pl-12 pr-4 py-3.5 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 transition-all text-left"
          />
          <Mail className="absolute top-4 w-5 h-5 text-[#1a1a1a]/30 left-4" />
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-600 text-sm font-sans justify-center">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>خطایی رخ داد / An error occurred: {message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting' || !email}
          className="w-full bg-[#1a1a1a] text-white py-3.5 px-6 font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'submitting' ? (
            <span>در حال ثبت... / Processing...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>لغو عضویت / Unsubscribe</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div 
      className="w-full min-h-[60vh] flex items-center justify-center bg-[#F2F0E9] text-[#1a1a1a] px-4 py-12 relative overflow-hidden"
      dir="ltr"
    >
      {/* Glow effects matching the website theme */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#CCFF00]/10 rounded-full blur-[120px] pointer-events-none opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none opacity-60"></div>

      <div className="w-full max-w-xl bg-white border border-[#1a1a1a]/5 rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative z-10">
        <Suspense fallback={
          <div className="text-center py-12 text-[#1a1a1a]/40 font-sans">
            Loading...
          </div>
        }>
          <UnsubscribeContent />
        </Suspense>
      </div>
    </div>
  );
}
