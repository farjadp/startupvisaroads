// ============================================================================
// Page: app/fa/pnp/page.tsx
// Style: "Digital Persepolis" (Persian Heritage + Modern Business)
// Context: Canada PNP Guide for Iranian Investors & Founders
// Font Strategy: Doran (Headings) + Peyman/Vazir (Body)
// ============================================================================

"use client";

import React from 'react';
import { 
  ArrowLeft, 
  Map, 
  ShieldCheck, 
  Coins, 
  Briefcase, 
  Cpu, 
  Users,
  AlertTriangle,
  CheckCircle2,
  Link,
  FileText
} from 'lucide-react';

// فرض بر این است که فونت‌ها را در layout اصلی کانفیگ کرده‌اید
// ولی برای این صفحه از کلاس‌های فرضی استفاده می‌کنیم

export default function PersianPNPPage() {
  return (
    <div className="min-h-screen bg-[#Fdfbf7] text-[#0F172A] font-iransans" dir="rtl">
        
      
      {/* 1. HERO: THE ROYAL DECREE */}
      <section className="relative pt-36 pb-24 px-6 border-b-8 border-[#D4AF37] overflow-hidden">
        
        {/* Background Texture (Abstract Persian Geometric) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(#1E3A8A 1px, transparent 1px)`,
               backgroundSize: '30px 30px'
             }}>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-8 text-[#1E3A8A]">
             <span className="h-3 w-3 bg-[#D4AF37] rotate-45 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></span>
             <span className="text-sm font-bold tracking-widest uppercase">استراتژی خروج از بن‌بست فدرال</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black leading-[1.0] text-[#1E3A8A] mb-10 tracking-tighter">
            قدرتِ انتخابِ <br/>
            <span className="text-[#D4AF37] inline-block border-b-4 border-[#D4AF37] pb-2">اسـتانی.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
             <div className="lg:col-span-7">
                <p className="text-xl md:text-3xl leading-relaxed text-[#334155] font-medium border-r-4 border-[#1E3A8A] pr-8 text-justify">
                   سیستم فدرال (Express Entry) برای اکثر ایرانیان قفل شده است. 
                   <br/>
                   کلید ورود، در دستان استان‌هاست. PNP مسیر هوشمندانه‌ای است که به جای رقابت با دنیا، شما را با <span className="text-[#1E3A8A] font-bold">نیازهای محلی</span> کانادا همسو می‌کند.
                </p>
             </div>
             <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-[#1E3A8A] p-6 text-[#Fdfbf7] shadow-2xl relative">
                   <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] -mt-2 -ml-2"></div>
                   <span className="text-[#D4AF37] font-bold text-xs mb-2 block">واقعیت آماری ۲۰۲۵</span>
                   <p className="text-lg font-bold leading-snug">
                      یک نامینیشن استانی (PNP) دقیقاً ۶۰۰ امتیاز به پروفایل شما اضافه می‌کند. یعنی تضمین دعوت‌نامه (ITA) در دراو بعدی.
                   </p>
                </div>
                <a href="#audit" className="flex items-center justify-between bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] py-4 px-6 font-bold hover:bg-[#1E3A8A] hover:text-[#D4AF37] transition-all">
                   شروع ارزیابی استانی
                   <ArrowLeft className="w-5 h-5" />
                </a>
             </div>
          </div>
        </div>
      </section>



{/* =========================================
          1.5. WHAT IS PNP? (The Royal Definition)
      ========================================= */}
      <section className="py-24 bg-[#1E3A8A] text-[#Fdfbf7] relative overflow-hidden">
         
         {/* Decorative Border Line */}
         <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#Fdfbf7] to-[#D4AF37] opacity-50"></div>

         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               
               {/* Right: The Definition (Text) */}
               <div>
                  <div className="inline-flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] px-4 py-2 mb-8 rounded-sm">
                     <Map className="w-5 h-5" />
                     <span className="text-sm font-bold tracking-widest uppercase">Provincial Nominee Program</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black leading-tight mb-8">
                     کانادا یک کشور نیست، <br/>
                     <span className="text-[#D4AF37]">ده اقتصاد</span> متفاوت است.
                  </h2>
                  
                  <div className="space-y-6 text-lg opacity-90 leading-relaxed text-justify pl-4">
                     <p>
                        سیستم مهاجرتی فدرال (Express Entry) یک رقابت کور است. اما <strong>PNP (برنامه نامزدی استانی)</strong> یک "توافق‌نامه اقتصادی" است.
                     </p>
                     <p>
                        در این سیستم، دولت فدرال به استان‌ها (مثل انتاریو یا بریتیش کلمبیا) قدرت داده است تا مهاجرانی را که دقیقاً با <span className="text-[#D4AF37] font-bold border-b border-[#D4AF37]">نیازهای بازار محلی</span> آنها همخوانی دارند، "دست‌چین" کنند.
                     </p>
                     <p className="font-bold text-[#Fdfbf7]">
                        وقتی یک استان شما را انتخاب می‌کند (Nomination)، شما عملاً کارت دعوت VIP برای اقامت دائم را دریافت کرده‌اید.
                     </p>
                  </div>
               </div>

               {/* Left: The Process Visualization (Golden Cards) */}
               <div className="relative">
                  {/* Card 1: The Deal */}
                  <div className="bg-[#Fdfbf7] text-[#0F172A] p-8 border-l-8 border-[#D4AF37] shadow-2xl relative z-20 mb-6 transform translate-x-4">
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-[#1E3A8A]">مرحله اول: انتخاب</h3>
                        <span className="text-xs font-bold text-[#64748B] bg-gray-200 px-2 py-1">توسط استان</span>
                     </div>
                     <p className="text-sm leading-relaxed text-[#475569]">
                        شما ثابت می‌کنید که بیزینس یا تخصص شما باعث رشد اقتصاد آن استان خاص می‌شود. 
                        <br/>
                        <span className="text-[#1E3A8A] font-bold mt-2 block">← خروجی: گواهی نامینیشن (Nomination Certificate)</span>
                     </p>
                  </div>

                  {/* Card 2: The Reward */}
                  <div className="bg-[#0F172A] text-[#Fdfbf7] p-8 border-l-8 border-[#1E3A8A] shadow-2xl relative z-10 transform -translate-x-4">
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-[#D4AF37]">مرحله دوم: ویزا</h3>
                        <span className="text-xs font-bold text-gray-400 border border-gray-600 px-2 py-1">توسط فدرال</span>
                     </div>
                     <p className="text-sm leading-relaxed text-gray-400">
                        با در دست داشتن گواهی نامینیشن، دولت فدرال (IRCC) تقریباً بدون قید و شرط (فقط چک امنیتی و پزشکی) به شما و خانواده‌تان اقامت دائم می‌دهد.
                        <br/>
                        <span className="text-[#D4AF37] font-bold mt-2 block">← خروجی: کارت اقامت دائم (PR Card)</span>
                     </p>
                  </div>
                  
                  {/* Connecting Line Graphic */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-gradient-to-b from-[#D4AF37] to-transparent opacity-30 z-0"></div>
               </div>

            </div>
         </div>
      </section>



      {/* 2. THE DUAL ENGINES (Investor vs Talent) */}
      <section className="py-28 px-6">
         <div className="container mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-20">
               <h2 className="text-4xl md:text-5xl font-black text-[#1E3A8A] mb-6">
                  کدام مسیر متعلق به شماست؟
               </h2>
               <p className="text-[#64748B] text-lg">
                  برنامه‌های استانی به دو دسته کاملاً مجزا تقسیم می‌شوند. انتخاب اشتباه، به معنی از دست دادن زمان و سرمایه است.
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* OPTION A: ENTREPRENEUR */}
               <div className="group bg-white border border-[#1E3A8A]/10 p-10 hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(30,58,138,0.1)] transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-[#D4AF37] w-24 h-1"></div>
                  <div className="flex justify-between items-start mb-8">
                     <Coins className="w-16 h-16 text-[#1E3A8A] opacity-80" />
                     <span className="text-xs font-bold bg-[#1E3A8A]/10 text-[#1E3A8A] px-3 py-1 rounded-full">مسیر کارآفرینی (Entrepreneur)</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-[#0F172A]">مدیران و سرمایه‌گذاران</h3>
                  <p className="text-[#64748B] leading-relaxed mb-8 text-justify">
                     اگر نقدینگی بالای ۲۰۰ هزار دلار دارید و حاضر هستید بیزینسی را در کانادا راه‌اندازی یا خریداری کنید. این مسیر نیازی به نمره زبان بالا ندارد.
                  </p>
                  <ul className="space-y-4 text-sm font-bold text-[#1E3A8A] border-t border-[#1E3A8A]/10 pt-6">
                     <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> ویزای کار (Work Permit) در ۶ ماه</li>
                     <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> امکان خرید بیزینس‌های فعال</li>
                     <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> مناسب برای نمره آیلتس ۵</li>
                  </ul>
               </div>

               {/* OPTION B: SKILLED */}
               <div className="group bg-[#0F172A] text-[#Fdfbf7] p-10 relative overflow-hidden">
                  {/* Decorative Pattern */}
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 border border-[#D4AF37]/20 rounded-full"></div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <Cpu className="w-16 h-16 text-[#D4AF37]" />
                     <span className="text-xs font-bold border border-[#D4AF37] text-[#D4AF37] px-3 py-1 rounded-full">مسیر تخصص (Skilled)</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-[#Fdfbf7] relative z-10">متخصصین و مهندسان</h3>
                  <p className="text-gray-400 leading-relaxed mb-8 text-justify relative z-10">
                     اگر در حوزه‌های تکنولوژی، سلامت یا مهندسی تخصص دارید و نمره زبان بالایی (CLB 7+) دارید. این مسیر مستقیماً به اکسپرس انتری وصل می‌شود.
                  </p>
                  <ul className="space-y-4 text-sm font-bold text-white border-t border-white/10 pt-6 relative z-10">
                     <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> دریافت ۶۰۰ امتیاز CRS</li>
                     <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> هزینه بسیار پایین</li>
                     <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> رقابت بسیار بالا (Tech Draw)</li>
                  </ul>
               </div>

            </div>
         </div>
      </section>


{/* 3. THE TERRITORIES (Strategic Map - Expanded) */}
      <section className="py-28 bg-gradient-to-b from-[#Fdfbf7] to-[#E2E8F0]/40 border-y border-[#1E3A8A]/10">
         <div className="container mx-auto px-6">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-20">
               <div className="flex items-center justify-center gap-2 text-[#D4AF37] mb-4">
                  <Map className="w-6 h-6" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase">نقشه قلمروها</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-[#1E3A8A] mb-6">
                  کدام استان شما را می‌خواهد؟
               </h2>
               <p className="text-[#64748B] text-lg leading-relaxed">
                  کانادا یک بازار واحد نیست. هر استان قوانین، مالیات و نیازهای خاص خود را دارد. 
                  انتخاب استان اشتباه، مساوی با ریجکت شدن پرونده است.
               </p>
            </div>

            {/* The Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               
               {/* 1. ONTARIO */}
               <div className="group bg-white p-8 border-t-4 border-[#1E3A8A] shadow-sm hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute top-0 left-0 bg-[#1E3A8A] text-white text-[10px] font-bold px-3 py-1 rounded-br-lg">
                     Tech & Finance
                  </div>
                  <div className="mb-6 flex justify-between items-start">
                     <div className="p-3 bg-[#1E3A8A]/5 rounded-xl">
                        <Briefcase className="w-10 h-10 text-[#1E3A8A]" />
                     </div>
                     <span className="text-4xl font-black text-[#1E3A8A]/10">ON</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">انتاریو (OINP)</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6 text-justify min-h-[60px]">
                     مناسب برای نخبگان. رقابتی‌ترین استان. اگر در حوزه ICT (کامپیوتر) فعال هستید، حتی بدون جاب‌آفر شانس بالایی دارید.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[#1E3A8A]">
                     <span className="bg-[#1E3A8A]/10 px-2 py-1 rounded">سرمایه: ۴۰۰k$</span>
                     <span className="bg-[#1E3A8A]/10 px-2 py-1 rounded">زبان: CLB 7</span>
                  </div>
               </div>

               {/* 2. BRITISH COLUMBIA */}
               <div className="group bg-white p-8 border-t-4 border-[#1E3A8A] shadow-sm hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute top-0 left-0 bg-[#1E3A8A] text-white text-[10px] font-bold px-3 py-1 rounded-br-lg">
                     Fastest Speed
                  </div>
                  <div className="mb-6 flex justify-between items-start">
                     <div className="p-3 bg-[#1E3A8A]/5 rounded-xl">
                        <Cpu className="w-10 h-10 text-[#1E3A8A]" />
                     </div>
                     <span className="text-4xl font-black text-[#1E3A8A]/10">BC</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">بریتیش کلمبیا</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6 text-justify min-h-[60px]">
                     سیلیکون ولی کانادا. دارای سیستم قرعه‌کشی هفتگی (Tech Pilot). گران‌ترین اما سریع‌ترین مسیر برای متخصصین نرم‌افزار.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[#1E3A8A]">
                     <span className="bg-[#1E3A8A]/10 px-2 py-1 rounded">هفته‌ای ۱ دراو</span>
                     <span className="bg-[#1E3A8A]/10 px-2 py-1 rounded">نیاز به جاب‌آفر</span>
                  </div>
               </div>

               {/* 3. ALBERTA */}
               <div className="group bg-white p-8 border-t-4 border-[#D4AF37] shadow-sm hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute top-0 left-0 bg-[#D4AF37] text-[#0F172A] text-[10px] font-bold px-3 py-1 rounded-br-lg">
                     Lowest Tax
                  </div>
                  <div className="mb-6 flex justify-between items-start">
                     <div className="p-3 bg-[#D4AF37]/10 rounded-xl">
                        <Coins className="w-10 h-10 text-[#b45309]" />
                     </div>
                     <span className="text-4xl font-black text-[#D4AF37]/20">AB</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">آلبرتا (AAIP)</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6 text-justify min-h-[60px]">
                     بهشت مالیاتی (بدون PST). برنامه "کارآفرینی روستایی" با سرمایه ۱۰۰ هزار دلار، در دسترس‌ترین گزینه برای بیزینس‌های کوچک است.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[#b45309]">
                     <span className="bg-[#D4AF37]/10 px-2 py-1 rounded">سرمایه: ۱۰۰k$</span>
                     <span className="bg-[#D4AF37]/10 px-2 py-1 rounded">نامه حمایتی شهر</span>
                  </div>
               </div>

               {/* 4. SASKATCHEWAN */}
               <div className="group bg-white p-8 border-t-4 border-[#D4AF37] shadow-sm hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute top-0 left-0 bg-[#D4AF37] text-[#0F172A] text-[10px] font-bold px-3 py-1 rounded-br-lg">
                     Easiest Entry
                  </div>
                  <div className="mb-6 flex justify-between items-start">
                     <div className="p-3 bg-[#D4AF37]/10 rounded-xl">
                        <CheckCircle2 className="w-10 h-10 text-[#b45309]" />
                     </div>
                     <span className="text-4xl font-black text-[#D4AF37]/20">SK</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">ساسکاچوان</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6 text-justify min-h-[60px]">
                     تنها استانی که نمره زبان بسیار پایین (CLB 4) را می‌پذیرد. ایده‌آل برای کسانی که سابقه مدیریت دارند اما مدرک تحصیلی ندارند.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[#b45309]">
                     <span className="bg-[#D4AF37]/10 px-2 py-1 rounded">زبان: CLB 4</span>
                     <span className="bg-[#D4AF37]/10 px-2 py-1 rounded">بدون مدرک</span>
                  </div>
               </div>

               {/* 5. MANITOBA (New) */}
               <div className="group bg-white p-8 border-t-4 border-[#1E3A8A] shadow-sm hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute top-0 left-0 bg-[#1E3A8A] text-white text-[10px] font-bold px-3 py-1 rounded-br-lg">
                     Connection Based
                  </div>
                  <div className="mb-6 flex justify-between items-start">
                     <div className="p-3 bg-[#1E3A8A]/5 rounded-xl">
                        <Users className="w-10 h-10 text-[#1E3A8A]" />
                     </div>
                     <span className="text-4xl font-black text-[#1E3A8A]/10">MB</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">منیتوبا (MPNP)</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6 text-justify min-h-[60px]">
                     قدرت "دوست و فامیل". اگر در این استان آشنایی دارید، شانس شما برای دریافت نامینیشن چند برابر می‌شود. سیستم امتیازدهی شفاف.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[#1E3A8A]">
                     <span className="bg-[#1E3A8A]/10 px-2 py-1 rounded">امتیاز فامیل</span>
                     <span className="bg-[#1E3A8A]/10 px-2 py-1 rounded">بیزینس و کار</span>
                  </div>
               </div>

               {/* 6. NEW BRUNSWICK (Corrected: Deposit Model) */}
               <div className="group bg-white p-8 border-t-4 border-[#D4AF37] shadow-sm hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute top-0 left-0 bg-[#D4AF37] text-[#0F172A] text-[10px] font-bold px-3 py-1 rounded-br-lg">
                     Deposit System
                  </div>
                  <div className="mb-6 flex justify-between items-start">
                     <div className="p-3 bg-[#D4AF37]/10 rounded-xl">
                        <ShieldCheck className="w-10 h-10 text-[#b45309]" />
                     </div>
                     <span className="text-4xl font-black text-[#D4AF37]/20">NB</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">نیوبرانزویک</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6 text-justify min-h-[60px]">
                     تنها استانی که مدل "توافق‌نامه ودیعه" دارد. با پرداخت ۱۰۰ هزار دلار ودیعه (قابل بازگشت)، تعهد خود را ثابت می‌کنید. مناسب برای مدیران باتجربه که نقدینگی بالایی دارند.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[#b45309]">
                     <span className="bg-[#D4AF37]/10 px-2 py-1 rounded">ودیعه: ۱۰۰k$</span>
                     <span className="bg-[#D4AF37]/10 px-2 py-1 rounded">سرمایه: ۲۵۰k$</span>
                  </div>
               </div>

            </div>
         </div>
      </section>





      {/* 4. THE TRUTH (The Ashavid Standard) */}
      <section className="py-24 px-6 bg-[#0F172A] text-[#Fdfbf7] relative">
         <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5">
               <div className="inline-flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] px-4 py-2 mb-6">
                  <AlertTriangle size={18} />
                  <span className="text-sm font-bold uppercase tracking-widest">هشدار استراتژیک</span>
               </div>
               <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8">
                  پول، ویزا نمی‌خرد.
               </h2>
               <p className="text-lg opacity-80 leading-relaxed text-justify pl-4 border-r-2 border-[#D4AF37]">
                  بزرگترین اشتباه ایرانیان: تصور می‌کنند PNP یعنی "پرداخت پول و دریافت ویزا". 
                  این تفکر در سال ۲۰۲۵ منسوخ شده است.
               </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
               <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                  <h4 className="text-xl font-bold text-[#D4AF37] mb-2">۱. مدیریت فعال (Active Management)</h4>
                  <p className="text-sm opacity-70 text-justify">
                     شما نمی‌توانید بیزینس را بخرید و به ایران برگردید. باید ۷۵٪ زمان خود را فیزیکی در محل بیزینس حضور داشته باشید.
                  </p>
               </div>
               <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                  <h4 className="text-xl font-bold text-[#D4AF37] mb-2">۲. منبع دارایی (Source of Funds)</h4>
                  <p className="text-sm opacity-70 text-justify">
                     داشتن ملک کافی نیست. باید توسط موسسات حسابرسی (KPMG/MNP) ثابت کنید که این پول از راه قانونی به دست آمده و قابل انتقال (Liquid) است. تتر و کریپتو بدون سابقه، رد می‌شوند.
                  </p>
               </div>
               <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                  <h4 className="text-xl font-bold text-[#D4AF37] mb-2">۳. بیزینس پلن کپی/پیست</h4>
                  <p className="text-sm opacity-70 text-justify">
                     آفیسرهای استانی بیزینس‌پلن‌های تمپلیتی را سریع تشخیص می‌دهند. بیزینس شما باید "منفعت اقتصادی قابل اثبات" برای آن شهر خاص داشته باشد.
                  </p>
               </div>
            </div>

         </div>
      </section>



{/* 4.5. OUR VALUE PROPOSITION (The Execution Protocol) */}
      <section className="py-24 bg-[#0F172A] text-[#Fdfbf7] relative overflow-hidden">
         
         {/* Decorative Sidebar Line */}
         <div className="absolute top-0 right-10 h-full w-1 bg-[#D4AF37]/20 hidden lg:block"></div>

         <div className="container mx-auto px-6 relative z-10">
            
            <div className="flex flex-col lg:flex-row gap-16 items-start">
               
               {/* Title Column */}
               <div className="lg:w-1/3 sticky top-24">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="w-12 h-1 bg-[#D4AF37]"></span>
                     <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">شرح خدمات</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                     ما معمارِ <br/>
                     بیزینس شما <br/>
                     هستیم.
                  </h2>
                  <p className="text-[#94A3B8] text-lg leading-relaxed text-justify pl-4">
                     وکیل مهاجرت، پرونده حقوقی شما را مدیریت می‌کند. ما <span className="text-[#Fdfbf7] font-bold">واقعیت اقتصادی</span> پرونده را می‌سازیم. 
                     آفیسرهای استانی به دنبال "سودآوری" و "دقت" هستند، نه فقط مدارک هویتی.
                  </p>
               </div>

               {/* Grid Column */}
               <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Service 1: Business Plan */}
                  <div className="bg-[#1E293B] p-8 border-r-4 border-[#D4AF37] hover:bg-[#1e3a8a] transition-colors group">
                     <FileText className="w-10 h-10 text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
                     <h3 className="text-xl font-bold mb-3 text-white">۱. طراحی کانسپت تجاری</h3>
                     <p className="text-sm text-gray-400 leading-relaxed text-justify group-hover:text-gray-200">
                        ما یک "بیزینس پلن" معمولی نمی‌نویسیم. ما یک <span className="font-bold">سند استراتژیک</span> خلق می‌کنیم که با آمارهای دقیق بازار محلی (مثلاً نرخ بیکاری در وینیپگ یا قیمت اجاره در هلیفکس) همخوانی داشته باشد. ما ثابت می‌کنیم که بیزینس شما "نیاز" آن استان است.
                     </p>
                  </div>

                  {/* Service 2: Financial Engineering */}
                  <div className="bg-[#1E293B] p-8 border-r-4 border-[#64748B] hover:border-[#D4AF37] hover:bg-[#1e3a8a] transition-colors group">
                     <Coins className="w-10 h-10 text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
                     <h3 className="text-xl font-bold mb-3 text-white">۲. مهندسی منبع وجوه (SOF)</h3>
                     <p className="text-sm text-gray-400 leading-relaxed text-justify group-hover:text-gray-200">
                        بزرگترین چالش ایرانیان. ما با کمک حسابرسان رسمی کانادایی، مسیر دارایی‌های شما (ملک، طلا، ارز) را شفاف‌سازی می‌کنیم تا در برابر سخت‌گیرانه‌ترین ممیزی‌های مالی (Audit) دوام بیاورد.
                     </p>
                  </div>

                  {/* Service 3: Exploratory Visit */}
                  <div className="bg-[#1E293B] p-8 border-r-4 border-[#64748B] hover:border-[#D4AF37] hover:bg-[#1e3a8a] transition-colors group">
                     <Map className="w-10 h-10 text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
                     <h3 className="text-xl font-bold mb-3 text-white">۳. مدیریت سفر اکتشافی</h3>
                     <p className="text-sm text-gray-400 leading-relaxed text-justify group-hover:text-gray-200">
                        قبل از ارسال پرونده، شما باید استان را ببینید. ما جلسات شما را با مشاوران املاک تجاری، تامین‌کنندگان کالا و حتی رقبای محلی تنظیم می‌کنیم تا "گزارش سفر" (Trip Report) شما بی‌نقص باشد.
                     </p>
                  </div>

                  {/* Service 4: Interview Prep */}
                  <div className="bg-[#1E293B] p-8 border-r-4 border-[#64748B] hover:border-[#D4AF37] hover:bg-[#1e3a8a] transition-colors group">
                     <Users className="w-10 h-10 text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
                     <h3 className="text-xl font-bold mb-3 text-white">۴. شبیه‌سازی مصاحبه</h3>
                     <p className="text-sm text-gray-400 leading-relaxed text-justify group-hover:text-gray-200">
                        در استان‌هایی مثل PEI یا نیوبرانزویک، مصاحبه سرنوشت‌ساز است. ما با شما جلسات "Mock Interview" برگزار می‌کنیم تا بتوانید با اعتماد به نفس کامل از اعداد و ارقام بیزینس خود دفاع کنید.
                     </p>
                  </div>

               </div>
            </div>
         </div>
      </section>



      {/* 5. LEAD CAPTURE (Persian Form) */}
      <section id="audit" className="py-32 px-6">
         <div className="container mx-auto max-w-3xl bg-white shadow-[0_30px_60px_rgba(0,0,0,0.1)] p-8 md:p-16 border-t-8 border-[#1E3A8A] relative">
            
            <div className="absolute top-0 left-0 bg-[#D4AF37] text-[#1E3A8A] px-4 py-2 font-bold text-xs uppercase">
               ظرفیت محدود ۲۰۲۵
            </div>

            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-black text-[#1E3A8A] mb-4">
                  بررسی شایستگی استانی
               </h2>
               <p className="text-[#64748B]">
                  تحلیل هوشمند شرایط شما برای انتاریو، بریتیش کلمبیا و ۳ استان دیگر.
               </p>
            </div>

            <form className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-[#1E3A8A]">نام کامل</label>
                     <input type="text" className="w-full p-4 bg-[#Fdfbf7] border-b-2 border-[#1E3A8A]/20 focus:border-[#D4AF37] outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-[#1E3A8A]">شماره تماس (واتس‌اپ)</label>
                     <input type="tel" className="w-full p-4 bg-[#Fdfbf7] border-b-2 border-[#1E3A8A]/20 focus:border-[#D4AF37] outline-none transition-colors text-left" placeholder="+98..." />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-[#1E3A8A]">سطح زبان (واقع‌بینانه)</label>
                     <select className="w-full p-4 bg-[#Fdfbf7] border-b-2 border-[#1E3A8A]/20 focus:border-[#D4AF37] outline-none cursor-pointer">
                        <option>بدون مدرک / مبتدی</option>
                        <option>آیلتس ۵ (مکالمه دست‌وپاشکسته)</option>
                        <option>آیلتس ۶ (خوب)</option>
                        <option>آیلتس ۷ به بالا (عالی)</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-[#1E3A8A]">بودجه سرمایه‌گذاری (نقد)</label>
                     <select className="w-full p-4 bg-[#Fdfbf7] border-b-2 border-[#1E3A8A]/20 focus:border-[#D4AF37] outline-none cursor-pointer">
                        <option>زیر ۱۵۰ هزار دلار کانادا</option>
                        <option>۱۵۰ تا ۳۰۰ هزار دلار کانادا</option>
                        <option>بالای ۳۰۰ هزار دلار کانادا</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1E3A8A]">وضعیت فعلی شما</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <label className="flex items-center gap-3 p-4 border border-[#1E3A8A]/10 cursor-pointer hover:bg-[#Fdfbf7]">
                        <input type="radio" name="role" className="accent-[#1E3A8A] w-5 h-5" />
                        <span className="text-sm">صاحب کسب‌وکار (جواز کسب/روزنامه رسمی)</span>
                     </label>
                     <label className="flex items-center gap-3 p-4 border border-[#1E3A8A]/10 cursor-pointer hover:bg-[#Fdfbf7]">
                        <input type="radio" name="role" className="accent-[#1E3A8A] w-5 h-5" />
                        <span className="text-sm">مدیر ارشد / کارمند متخصص</span>
                     </label>
                  </div>
               </div>

               <div className="pt-8 text-center">
                  <button className="w-full md:w-auto bg-[#1E3A8A] text-white font-bold text-xl py-4 px-12 hover:bg-[#D4AF37] hover:text-[#0F172A] transition-all shadow-xl rounded-sm">
                     دریافت آنالیز اولیه
                  </button>
                  <p className="text-[10px] text-[#64748B] mt-4 opacity-70">
                     ما وکیل نیستیم. ما استراتژیست بیزینس هستیم. اطلاعات شما محرمانه است.
                  </p>
               </div>
            </form>
         </div>
      </section>

      {/* 5. FAQ SECTION (Strategic Clarity) */}
      <section className="py-24 px-6 bg-white border-t border-[#1E3A8A]/10">
         <div className="container mx-auto max-w-4xl">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-12">
               <div className="bg-[#1E3A8A] text-[#D4AF37] p-3 rounded-lg">
                  <span className="font-black text-xl">?</span>
               </div>
               <h2 className="text-3xl md:text-4xl font-black text-[#0F172A]">
                  سوالاتِ سخت، پاسخ‌های شفاف.
               </h2>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
               {[
                  {
                     q: "آیا می‌توانم با خرید ملک مسکونی در کانادا، از طریق PNP اقدام کنم؟",
                     a: "خیر. تمام برنامه‌های کارآفرینی استانی (PNP) نیازمند «سرمایه‌گذاری فعال» هستند. خرید خانه، زمین یا ملک اجاره‌ای (Passive Investment) هیچ امتیازی ندارد. شما باید بیزینسی داشته باشید که کالا تولید کند، خدمات ارائه دهد و نیروی کار کانادایی استخدام کند."
                  },
                  {
                     q: "تفاوت اصلی این مسیر با ویزای استارتاپ (SUV) چیست؟",
                     a: "در ویزای استارتاپ، شما باید یک ایده «نوآورانه و مقیاس‌پذیر» داشته باشید و حمایت یک انکوباتور را بگیرید (که الان بسیار زمان‌بر و پرریسک شده است). اما در PNP، شما می‌توانید یک بیزینس سنتی (مثل رستوران، شرکت ساختمانی، یا کلینیک) راه‌اندازی کنید. PNP برای کسانی است که سرمایه دارند اما لزوماً ایده استارتاپی ندارند."
                  },
                  {
                     q: "چالش انتقال پول از ایران را چطور حل می‌کنید؟",
                     a: "این مهم‌ترین بخش پرونده شماست. استان‌های کانادا و آفیسرهای فدرال روی «منبع وجوه» (Source of Funds) بسیار حساس هستند. ما با همکاری صرافی‌های معتبر و وکلای مالی، مسیر قانونی انتقال پول (از طریق سیستم بانکی کشورهای واسط) را مستندسازی می‌کنیم تا در مرحله حسابرسی (Audit) مشکلی پیش نیاید."
                  },
                  {
                     q: "آیا حتماً باید مدرک زبان (آیلتس) داشته باشم؟",
                     a: "بله، اما نمره مورد نیاز متفاوت است. برای استانی مثل ساسکاچوان، نمره CLB 4 (در حد مکالمات روزمره) کافیست. اما برای بریتیش کلمبیا یا انتاریو، رقابت بالاست و نمره CLB 5 یا 6 شانس شما را بیشتر می‌کند. هیچ برنامه کارآفرینی بدون مدرک زبان وجود ندارد."
                  },
                  {
                     q: "اگر بیزینس شکست بخورد، اقامت من باطل می‌شود؟",
                     a: "بستگی به مرحله پرونده دارد. اگر قبل از دریافت «نامینیشن نهایی» بیزینس را تعطیل کنید، بله، پرونده بسته می‌شود. اما اگر طبق قرارداد (Performance Agreement) تلاش خود را کرده باشید، پول را سرمایه‌گذاری کرده باشید اما به سوددهی نرسیده باشید، در بسیاری از استان‌ها همچنان شانس دریافت نامینیشن را دارید. شرط اصلی «اجرای تعهدات» است، نه لزوماً سوددهی بالا."
                  }
               ].map((item, i) => (
                  <details key={i} className="group bg-[#Fdfbf7] border border-[#1E3A8A]/10 rounded-lg open:border-[#D4AF37] open:shadow-lg transition-all duration-300">
                     <summary className="flex justify-between items-center p-6 cursor-pointer list-none select-none">
                        <h3 className="font-bold text-lg text-[#1E3A8A] group-hover:text-[#D4AF37] transition-colors">
                           {item.q}
                        </h3>
                        <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#1E3A8A]">
                           ▼
                        </span>
                     </summary>
                     <div className="px-6 pb-6 pt-0 text-[#64748B] text-sm leading-relaxed text-justify border-t border-[#1E3A8A]/5 mt-2 pt-4">
                        {item.a}
                     </div>
                  </details>
               ))}
            </div>

         </div>
      </section>


{/* =========================================
          6. LEGAL DISCLAIMER & CONSENT (The Shield)
      ========================================= */}
      <section className="py-16 px-6 bg-[#E2E8F0]/30 border-t border-[#1E3A8A]/10">
         <div className="container mx-auto max-w-5xl">
            
            <div className="flex items-center gap-3 mb-8 text-[#64748B]">
               <ShieldCheck className="w-5 h-5" />
               <span className="text-xs font-bold tracking-widest uppercase">سلب مسئولیت و حریم خصوصی</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-[#475569] text-justify">
               
               {/* Column 1: Non-Legal Status */}
               <div className="space-y-4">
                  <p>
                     <strong className="text-[#1E3A8A] block mb-1">۱. ماهیت خدمات:</strong>
                     «آشاوید» (VisaRoads) یک شرکت مشاوره مدیریت کسب‌وکار و توسعه استراتژی است. ما <strong>دفتر وکالت (Law Firm)</strong> یا موسسه کاریابی نیستیم. خدمات ما محدود به طراحی بیزینس‌پلن، تحقیقات بازار و مهندسی ساختار شرکت است. تمامی امور حقوقی و ثبت پرونده‌های مهاجرتی باید توسط وکیل رسمی دادگستری کانادا یا مشاورین رسمی مهاجرت (RCIC) انجام شود.
                  </p>
                  <p>
                     <strong className="text-[#1E3A8A] block mb-1">۲. عدم تضمین:</strong>
                     صدور ویزا، نامینیشن استانی (PNP) یا اقامت دائم، صرفاً در صلاحیت اداره مهاجرت کانادا (IRCC) و دولت‌های استانی است. هیچ شخص یا شرکتی نمی‌تواند نتیجه پرونده را تضمین کند. آمارهای موفقیت ما مربوط به گذشته است و تضمینی برای آینده نیست.
                  </p>
               </div>

               {/* Column 2: Volatility & Consent */}
               <div className="space-y-4">
                  <p>
                     <strong className="text-[#1E3A8A] block mb-1">۳. تغییرات قوانین:</strong>
                     قوانین مهاجرتی، ظرفیت استان‌ها (Quotas) و نمرات قبولی (Cut-off Scores) دائماً و بدون اطلاع قبلی تغییر می‌کنند. تحلیل‌های ارائه شده در این صفحه بر اساس قوانین جاری در تاریخ انتشار است.
                  </p>
                  <div className="bg-white border border-[#1E3A8A]/20 p-4 rounded-sm">
                     <strong className="text-[#1E3A8A] block mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" /> رضایت‌نامه تماس (Consent)
                     </strong>
                     <p className="opacity-90">
                        با تکمیل و ارسال فرم ارزیابی، شما صراحتاً موافقت می‌کنید که تیم استراتژی آشاوید از طریق <strong>واتس‌اپ، ایمیل یا تلفن</strong> جهت بررسی پرونده با شما تماس بگیرد. اطلاعات شما طبق 
                        <Link href="/privacy" className="text-[#1E3A8A] font-bold mx-1 border-b border-[#1E3A8A]/30">سیاست حریم خصوصی</Link> 
                        ما محرمانه باقی می‌ماند و به شخص ثالث فروخته نمی‌شود.
                     </p>
                  </div>
               </div>

            </div>

            {/* Links */}
            <div className="mt-8 flex flex-wrap gap-6 justify-center md:justify-start text-[10px] font-bold text-[#1E3A8A] uppercase tracking-wider">
               <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">شرایط استفاده (Terms)</Link>
               <span>•</span>
               <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">حریم خصوصی (Privacy)</Link>
               <span>•</span>
               <span className="opacity-50 text-[#64748B] cursor-default">Registered in Ontario, Canada</span>
            </div>

         </div>
      </section>




      {/* FOOTER MINI */}
      <footer className="py-10 bg-[#1E3A8A] text-[#Fdfbf7] text-center border-t border-[#D4AF37]">
         <div className="flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
             <Map className="w-4 h-4" />
             <span className="text-xs font-bold tracking-widest uppercase">طراحی شده در تورنتو، برای مدیران ایران</span>
         </div>
      </footer>

    </div>
  );
}