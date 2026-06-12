'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, AlertTriangle, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  locale: string;
  redirectUrl: string;
}

export default function LoginForm({ locale, redirectUrl }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isRtl = locale === 'fa';

  const t = isRtl ? {
    title: 'کنسول مدیریت',
    badge: 'ورود مجاز',
    usernameLabel: 'نام کاربری ادمین',
    passwordLabel: 'کلمه عبور سیستم',
    usernamePlaceholder: 'نام کاربری را وارد کنید',
    passwordPlaceholder: '••••••••',
    btnEnter: 'احراز هویت و ورود',
    btnAuthenticating: 'در حال احراز هویت...',
    errorInvalid: 'نام کاربری یا کلمه عبور نامعتبر است.',
    errorServer: 'ارتباط با سرور برقرار نشد.',
  } : {
    title: 'ADMIN SIGN IN',
    badge: 'Authorized Entry',
    usernameLabel: 'Admin ID / Username',
    passwordLabel: 'System Passkey',
    usernamePlaceholder: 'Enter username',
    passwordPlaceholder: '••••••••',
    btnEnter: 'Authenticate & Enter',
    btnAuthenticating: 'Authenticating...',
    errorInvalid: 'Invalid username or password.',
    errorServer: 'Could not connect to authentication server.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to target URL
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(data.error || t.errorInvalid);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError(t.errorServer);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 text-start" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <span className="font-sans text-xs font-bold bg-[#CCFF00] text-[#1a1a1a] px-3 py-1 uppercase tracking-widest">
          {t.badge}
        </span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 flex items-start gap-3 rounded-none font-sans text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Username Field */}
      <div className="group">
        <label className="block font-sans text-[10px] font-bold uppercase tracking-widest mb-3 text-[#F2F0E9]/45 group-focus-within:text-[#CCFF00] transition-colors">
          {t.usernameLabel}
        </label>
        <input
          type="text"
          required
          disabled={loading}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-transparent border-b border-[#F2F0E9]/15 py-3 focus:outline-none focus:border-[#CCFF00] transition-colors font-serif text-2xl placeholder:text-[#F2F0E9]/10 text-[#F2F0E9]"
          placeholder={t.usernamePlaceholder}
        />
      </div>

      {/* Password Field */}
      <div className="group">
        <label className="block font-sans text-[10px] font-bold uppercase tracking-widest mb-3 text-[#F2F0E9]/45 group-focus-within:text-[#CCFF00] transition-colors">
          {t.passwordLabel}
        </label>
        <input
          type="password"
          required
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-[#F2F0E9]/15 py-3 focus:outline-none focus:border-[#CCFF00] transition-colors font-serif text-2xl placeholder:text-[#F2F0E9]/10 text-[#F2F0E9]"
          placeholder={t.passwordPlaceholder}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#CCFF00] text-[#1a1a1a] py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#F2F0E9] hover:text-[#1a1a1a] disabled:opacity-50 transition-all flex items-center justify-center gap-3 group cursor-pointer"
      >
        <Lock className="w-4 h-4" />
        <span>{loading ? t.btnAuthenticating : t.btnEnter}</span>
        {!loading && <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />}
      </button>
    </form>
  );
}
