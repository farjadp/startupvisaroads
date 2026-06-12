import React from 'react';
import LoginForm from './LoginForm';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminLoginPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const redirectUrl = (resolvedSearchParams.redirect as string) || `/${locale}/admin`;

  const isRtl = locale === 'fa';

  const t = isRtl ? {
    title: 'کنسول مدیریت',
    subtitle: 'کنترل پنل امنیتی',
    desc: 'ورود فقط برای پرسنل مجاز. کلیه تلاش‌ها برای ورود به سیستم ثبت و مانیتور می‌شوند.',
    backToSite: '← بازگشت به سایت اصلی',
  } : {
    title: 'ADMIN PORTAL',
    subtitle: 'Secure Command Center',
    desc: 'Authorized personnel only. All access attempts are logged and monitored.',
    backToSite: '← Back to main site',
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#1a1a1a] text-[#F2F0E9] font-sans selection:bg-[#CCFF00] selection:text-black">
      
      {/* Visual / Info Left Panel */}
      <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#F2F0E9]/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CCFF00]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <Link href={`/${locale}`} className="inline-block mb-12 font-serif text-3xl font-bold tracking-tight text-[#F2F0E9] hover:text-[#CCFF00] transition-colors">
            Visa Roads.
          </Link>
          <div className="mt-8">
            <span className="font-sans text-[10px] font-bold text-[#CCFF00] uppercase tracking-[0.2em] bg-[#CCFF00]/10 px-3 py-1.5 rounded-full">
              {t.subtitle}
            </span>
            <h1 className="font-serif text-6xl md:text-8xl leading-none mt-6 mb-6">
              SYSTEM <br/>
              <span className="text-[#CCFF00] italic font-light">ACCESS.</span>
            </h1>
            <p className="font-sans text-sm text-[#F2F0E9]/60 max-w-md leading-relaxed">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0">
          <Link href={`/${locale}`} className="font-sans text-xs uppercase tracking-widest text-[#F2F0E9]/50 hover:text-[#CCFF00] transition-colors">
            {t.backToSite}
          </Link>
        </div>
      </div>

      {/* Login Form Right Panel */}
      <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center bg-[#151515]">
        <div className="max-w-md w-full mx-auto">
          <LoginForm locale={locale} redirectUrl={redirectUrl} />
        </div>
      </div>

    </div>
  );
}
