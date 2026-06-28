'use client';

import React, { useState, useEffect } from 'react';
import { registerWebinar } from './actions';
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    Lightbulb,
    Send,
    CheckCircle,
    ArrowRight,
    MapPin,
    CalendarPlus,
    Youtube
} from 'lucide-react';

export default function WebinarPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [startupIdea, setStartupIdea] = useState('');
    const [ticketNumber, setTicketNumber] = useState('');

    // Countdown state
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false
    });

    useEffect(() => {
        // Target date: Wednesday July 1st, 2026 20:00:00 Iran time (Tehran is UTC+3:30)
        // 2026-07-01T20:00:00+03:30
        const targetDate = new Date('2026-07-01T20:00:00+03:30').getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                setTimeLeft(prev => ({ ...prev, isExpired: true }));
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        try {
            const result = await registerWebinar(formData);
            if (result.success) {
                const randomCode = 'SVR-' + Math.floor(100000 + Math.random() * 900000);
                setTicketNumber(randomCode);
                setIsSuccess(true);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert('خطایی رخ داد. لطفاً مجدداً تلاش کنید.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleCalendar = () => {
        const title = encodeURIComponent('دورهمی ۲۳ استارتاپ و استارتاپ ویزا - Startup Visa Roads');
        const details = encodeURIComponent('بیست و سومین دورهمی آنلاین استارتاپ و استارتاپ ویزا کانادا. لینک گوگل میت چند ساعت قبل به ایمیل شما ارسال می‌شود.');
        const location = encodeURIComponent('گوگل میت (Google Meet)');
        
        const dates = '20260701T163000Z/20260701T183000Z';
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
        window.open(url, '_blank');
    };

    const toPersianDigits = (num: number) => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(num).replace(/[0-9]/g, (w) => persianDigits[parseInt(w)]);
    };

    return (
        <div className="w-full min-h-screen bg-[#F2F0E9] text-[#1a1a1a] relative overflow-hidden font-iransans py-12 px-4 md:px-8" dir="rtl">
            {/* Soft Ambient Background Glows matching the light theme */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#CCFF00]/20 rounded-full blur-[180px] pointer-events-none opacity-60"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none opacity-60"></div>

            <div className="max-w-[1400px] mx-auto relative z-10">
                {/* Header Navbar-like segment */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1a1a1a]/10 pb-8 mb-16">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#1a1a1a] text-[#F2F0E9] text-xs font-black px-3 py-1.5 rounded-full shadow-sm">
                            LIVE MEETUP 🚀
                        </span>
                        <span className="text-xs font-bold text-[#1a1a1a]/60">
                            دورهمی بیست و سوم
                        </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-2 text-[#1a1a1a]/85">
                            <MapPin size={16} className="text-[#1a1a1a]/70" />
                            <span className="font-bold">برگزاری در گوگل میت (Google Meet) 💻</span>
                        </span>
                        <span className="w-2.5 h-2.5 bg-[#CCFF00] border border-[#1a1a1a]/40 rounded-full animate-pulse"></span>
                    </div>
                </div>

                {/* Main 2-Column Immersive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column: Visual Content & Information (lg:col-span-7) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                            <span className="text-[#1a1a1a]/50 text-xs font-bold tracking-widest uppercase block">STARTUP VISA ROADS PRESENTS</span>
                            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-[#1a1a1a]">
                                بیست و سومین دورهمی آنلاین <br/>
                                <span className="bg-[#CCFF00] text-black px-3 py-1 inline-block transform -rotate-1 mt-2">
                                    استارتاپ و استارتاپ ویزا کانادا 🇨🇦
                                </span>
                            </h1>
                            <p className="text-base md:text-lg text-[#1a1a1a]/75 max-w-2xl leading-relaxed">
                                یک گپ‌وگفت دوستانه، بدون تعارف و کاملاً تخصصی پیرامون قوانین جدید سال ۲۰۲۶ استارتاپ ویزا، اولویت‌های فعلی اداره مهاجرت و راه‌حل‌های جایگزین هوشمندانه.
                            </p>
                        </div>

                        {/* Banner & Topics Frame (No dark overlay to maximize readability) */}
                        <div className="overflow-hidden rounded-2xl border-2 border-[#1a1a1a] bg-white p-4 shadow-[8px_8px_0px_0px_#1a1a1a]">
                            <img 
                                src="/img/webinar_banner.png" 
                                alt="وبینار استارتاپ ویزا" 
                                className="w-full h-auto object-cover rounded-xl border border-[#1a1a1a]/10"
                            />
                            
                            {/* Topics Section (Fully Light and Readable) */}
                            <div className="mt-6 pt-6 border-t border-[#1a1a1a]/10 space-y-4">
                                <span className="text-xs font-bold text-[#1a1a1a] tracking-widest block uppercase">📋 موضوعات گفت‌وگو در این جلسه</span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#1a1a1a]/95">
                                    <div className="flex items-start gap-2.5">
                                        <span className="text-[#CCFF00] font-bold text-lg leading-none">▪</span>
                                        <span>بررسی آینده استارتاپ ویزای کانادا 🔮</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <span className="text-[#CCFF00] font-bold text-lg leading-none">▪</span>
                                        <span>اولویت‌های پذیرش در سال ۲۰۲۶ 🎯</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <span className="text-[#CCFF00] font-bold text-lg leading-none">▪</span>
                                        <span>مسیرهای موازی و استارتاپ ویزای جایگزین 🇨🇦</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <span className="text-[#CCFF00] font-bold text-lg leading-none">▪</span>
                                        <span>برنامه‌های استارتاپی جایگزین خارج از کانادا 🌍</span>
                                    </div>
                                    <div className="flex items-start gap-2.5 md:col-span-2">
                                        <span className="text-[#CCFF00] font-bold text-lg leading-none">▪</span>
                                        <span>پرسش و پاسخ کاملاً آزاد و زنده با بررسی پرونده‌ها 💬</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Archives / Youtube Redirect (Light Style) */}
                        <div className="flex flex-wrap items-center justify-between gap-6 bg-white border-2 border-[#1a1a1a] p-6 rounded-2xl shadow-[6px_6px_0px_0px_#1a1a1a]">
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm flex items-center gap-2 text-[#1a1a1a]">
                                    <Youtube className="w-5 h-5 text-red-600 animate-pulse" />
                                    <span>دسترسی به ویدیوهای جلسات قبلی</span>
                                </h4>
                                <p className="text-xs text-[#1a1a1a]/60">آرشیو تمام وبینارهای گذشته به صورت منظم در کانال یوتیوب ما آپلود می‌شود.</p>
                            </div>
                            <a 
                                href="https://youtube.com/@farjadtalks" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-md"
                            >
                                <span>کانال یوتیوب farjadtalks@ 📺</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Premium Light Card Form (lg:col-span-5) */}
                    <div className="lg:col-span-5">
                        {!isSuccess ? (
                            <div className="bg-white border-2 border-[#1a1a1a] p-8 md:p-10 rounded-3xl shadow-[8px_8px_0px_0px_#1a1a1a] relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] text-[#F2F0E9] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                                    REGISTRATION OPEN 🎟️
                                </div>

                                <div className="text-center mb-8 pt-4">
                                    <h3 className="text-2xl font-black text-[#1a1a1a]">رزرو صندلی دورهمی</h3>
                                    <p className="text-xs text-[#1a1a1a]/60 mt-2">
                                        پس از تکمیل اطلاعات، بلیت شما ثبت شده و لینک ورود چند ساعت قبل به ایمیل ارسال می‌شود.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-[#1a1a1a]/60 uppercase tracking-widest block">نام و نام خانوادگی</label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="مثال: آرش علوی"
                                            className="w-full p-4 bg-[#F2F0E9]/40 border border-[#1a1a1a]/15 rounded-xl focus:border-[#1a1a1a] focus:bg-white outline-none transition-all text-sm text-[#1a1a1a]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-[#1a1a1a]/60 uppercase tracking-widest block">تلفن همراه (ترجیحاً واتس‌اپ یا تلگرام)</label>
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="مثال: 09123456789"
                                            className="w-full p-4 bg-[#F2F0E9]/40 border border-[#1a1a1a]/15 rounded-xl focus:border-[#1a1a1a] focus:bg-white outline-none transition-all text-sm text-left ltr font-sans text-[#1a1a1a]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-[#1a1a1a]/60 uppercase tracking-widest block">نشانی ایمیل</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="مثال: arash@example.com"
                                            className="w-full p-4 bg-[#F2F0E9]/40 border border-[#1a1a1a]/15 rounded-xl focus:border-[#1a1a1a] focus:bg-white outline-none transition-all text-sm text-left ltr font-sans text-[#1a1a1a]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-[#1a1a1a]/60 uppercase tracking-widest block">حوزه تخصص یا ایده استارتاپی (اختیاری)</label>
                                        <textarea
                                            name="startupIdea"
                                            value={startupIdea}
                                            onChange={(e) => setStartupIdea(e.target.value)}
                                            placeholder="مثال: هوش مصنوعی، تجارت الکترونیک..."
                                            rows={2}
                                            className="w-full p-4 bg-[#F2F0E9]/40 border border-[#1a1a1a]/15 rounded-xl focus:border-[#1a1a1a] focus:bg-white outline-none transition-all text-sm resize-none text-[#1a1a1a]"
                                        />
                                    </div>

                                    {/* Timer pill */}
                                    {!timeLeft.isExpired && (
                                        <div className="bg-[#F2F0E9]/50 border border-[#1a1a1a]/10 p-4 rounded-xl flex items-center justify-between text-xs">
                                            <span className="text-[#1a1a1a]/50">شروع تا دورهمی:</span>
                                            <div className="flex items-center gap-1 font-sans text-[#1a1a1a] font-bold">
                                                <span>{toPersianDigits(timeLeft.days)} روز</span>
                                                <span className="opacity-40">•</span>
                                                <span>{toPersianDigits(timeLeft.hours)} ساعت</span>
                                                <span className="opacity-40">•</span>
                                                <span>{toPersianDigits(timeLeft.minutes)} د</span>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#1a1a1a] text-[#F2F0E9] hover:bg-[#CCFF00] hover:text-black font-black text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <span>در حال ارسال...</span>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                <span>ثبت‌نام و دریافت کارت ورود 🎟️</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            // SUCCESS STATE
                            <div className="bg-white border-2 border-[#1a1a1a] p-8 md:p-10 rounded-3xl shadow-[8px_8px_0px_0px_#CCFF00] space-y-6 text-center animate-in fade-in zoom-in-95 duration-300 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] text-[#F2F0E9] text-[10px] font-black px-4 py-1.5 rounded-full shadow-md">
                                    SUCCESSFULLY REGISTERED 🎉
                                </div>

                                <div className="flex flex-col items-center space-y-3 pt-4">
                                    <div className="w-16 h-16 bg-[#CCFF00]/20 border border-[#1a1a1a]/20 rounded-full flex items-center justify-center text-black shadow-inner">
                                        <CheckCircle size={32} className="stroke-[2.5]" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#1a1a1a]">ثبت‌نام شما انجام شد!</h3>
                                    <p className="text-xs text-[#1a1a1a]/70 leading-relaxed max-w-xs">
                                        لینک ورود به اتاق گوگل میت (Google Meet) چند ساعت قبل از شروع دورهمی به نشانی ایمیل شما ارسال خواهد شد. 📬
                                    </p>
                                </div>

                                <div className="border border-[#1a1a1a]/10 bg-[#F2F0E9]/30 p-4 rounded-2xl">
                                    <span className="text-[10px] font-bold text-[#1a1a1a]/40 block uppercase mb-1">کد رهگیری بلیت شما</span>
                                    <span className="font-mono text-xl font-bold tracking-wider text-[#1a1a1a]">{ticketNumber}</span>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleGoogleCalendar}
                                        className="w-full bg-[#1a1a1a] text-[#F2F0E9] hover:bg-[#CCFF00] hover:text-black font-bold py-3 text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <CalendarPlus size={16} />
                                        <span>افزودن به تقویم گوگل 📅</span>
                                    </button>

                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="w-full bg-transparent border border-[#1a1a1a]/15 text-[#1a1a1a]/60 hover:text-[#1a1a1a] font-bold py-3 text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowRight size={16} />
                                        <span>ثبت‌نام فرد جدید 🔄</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Support Card */}
                        <div className="mt-8 bg-white border-2 border-[#1a1a1a] p-6 rounded-3xl shadow-[6px_6px_0px_0px_#1a1a1a] space-y-4">
                            <div className="border-b border-[#1a1a1a]/10 pb-3">
                                <h4 className="font-bold text-sm text-[#1a1a1a] flex items-center gap-2">
                                    <span>💬 سوالی دارید یا نیاز به راهنمایی؟</span>
                                </h4>
                            </div>
                            <p className="text-xs text-[#1a1a1a]/60 leading-relaxed">
                                اگر سوالی درباره حضور در دورهمی دارید، از کانال‌های زیر با ما در ارتباط باشید:
                            </p>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center bg-[#F2F0E9]/50 p-2.5 rounded-xl border border-[#1a1a1a]/5">
                                    <span className="text-[#1a1a1a]/50">ایمیل پشتیبانی:</span>
                                    <a href="mailto:its@farjadp.com" className="font-sans font-bold hover:underline">its@farjadp.com</a>
                                </div>
                                <div className="flex justify-between items-center bg-[#F2F0E9]/50 p-2.5 rounded-xl border border-[#1a1a1a]/5">
                                    <span className="text-[#1a1a1a]/50">ارتباط تلگرام:</span>
                                    <a href="https://t.me/farjadtalks" target="_blank" rel="noopener noreferrer" className="font-sans font-bold text-blue-600 hover:underline">@farjadtalks</a>
                                </div>
                                <div className="flex justify-between items-center bg-[#F2F0E9]/50 p-2.5 rounded-xl border border-[#1a1a1a]/5">
                                    <span className="text-[#1a1a1a]/50">کانال تلگرام:</span>
                                    <a href="https://t.me/Heros_Journey" target="_blank" rel="noopener noreferrer" className="font-sans font-bold text-blue-600 hover:underline">@Heros_Journey</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
