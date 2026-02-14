"use client";

import React, { useState } from 'react';
import {
    ShieldCheck,
    UploadCloud,
    FileText,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Building2,
    Users,
    Briefcase,
    ChevronDown
} from 'lucide-react';
import { submitStartupRecoveryForm } from './actions';

export default function StartupRecoveryForm() {
    // مدیریت استیت‌های فرم
    const [formData, setFormData] = useState({
        fullName: '',
        teamName: '',
        phoneNumber: '',
        email: '',
        isOurClient: 'yes', // 'yes' | 'no'
        otherProviderDesc: '',
        designatedOrg: '',
        prSubmitDate: '',
        wpSubmitDate: '',
        wpRejectionDate: '',
        hasOfficerNotes: 'no', // 'yes' | 'no'
        officerNotesDesc: '',
        consent: false
    });

    const [file, setFile] = useState<File | null>(null);

    // هندلر تغییرات اینپوت‌ها
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // هندلر تغییر چک‌باکس
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, consent: e.target.checked }));
    };

    // هندلر آپلود فایل
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData for server action
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                // Convert boolean to string to ensure it's sent
                data.append(key, String(value));
            }
        });

        if (file) {
            data.append('file', file);
        }

        try {
            const result = await submitStartupRecoveryForm(data);
            if (result.success) {
                alert("اطلاعات با موفقیت برای تیم حقوقی ارسال شد.");
            } else {
                alert("خطا در ارسال اطلاعات. لطفا دوباره تلاش کنید.");
            }
        } catch (err) {
            console.error(err);
            alert("خطا در ارتباط با سرور.");
        }
    };

    return (
        <div className="min-h-screen bg-[#Fdfbf7] text-[#0F172A] font-iransans py-20 px-4 md:px-8" dir="rtl">

            <div className="max-w-3xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] px-4 py-1 mb-4 rounded-full bg-[#1E3A8A]/5">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">محرمانه / Legal Privileged</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-[#1E3A8A] mb-4">
                        فرم تحلیل و بازیابی پرونده
                    </h1>
                    <p className="text-[#64748B] text-lg max-w-xl mx-auto">
                        این فرم جهت بررسی تکنیکال پرونده‌های استارتاپ ویزا که با چالش روبرو شده‌اند طراحی شده است.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow-[0_20px_50px_rgba(30,58,138,0.1)] border-t-8 border-[#1E3A8A] p-8 md:p-12 rounded-sm space-y-10">

                    {/* SECTION 1: IDENTITY */}
                    <div className="space-y-6">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-[#1E3A8A] border-b border-[#1E3A8A]/10 pb-2">
                            <Users className="w-5 h-5 text-[#D4AF37]" />
                            مشخصات متقاضی و تیم
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#475569]">نام و نام خانوادگی (لاتین)</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    className="w-full p-4 bg-[#Fdfbf7] border border-[#E2E8F0] focus:border-[#1E3A8A] outline-none transition-colors rounded-sm"
                                    placeholder="John Doe"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#475569]">نام تیم استارتاپ</label>
                                <input
                                    type="text"
                                    name="teamName"
                                    required
                                    className="w-full p-4 bg-[#Fdfbf7] border border-[#E2E8F0] focus:border-[#1E3A8A] outline-none transition-colors rounded-sm"
                                    placeholder="e.g. NextGen AI"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Phone & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#475569]">شماره تماس (واتس‌اپ)</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    required
                                    className="w-full p-4 bg-[#Fdfbf7] border border-[#E2E8F0] focus:border-[#1E3A8A] outline-none transition-colors rounded-sm text-left ltr"
                                    placeholder="+98 912 ..."
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#475569]">ایمیل</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full p-4 bg-[#Fdfbf7] border border-[#E2E8F0] focus:border-[#1E3A8A] outline-none transition-colors rounded-sm text-left ltr"
                                    placeholder="email@example.com"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: THE ORIGIN (LOS) */}
                    <div className="space-y-6">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-[#1E3A8A] border-b border-[#1E3A8A]/10 pb-2">
                            <Building2 className="w-5 h-5 text-[#D4AF37]" />
                            منشاء نامه حمایتی (LOS)
                        </h3>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-[#475569]">آیا نامه حمایتی (LOS) توسط مجموعه ما دریافت شده است؟</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-4 border cursor-pointer text-center transition-all ${formData.isOurClient === 'yes' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white border-[#E2E8F0] text-[#64748B]'}`}>
                                    <input type="radio" name="isOurClient" value="yes" checked={formData.isOurClient === 'yes'} onChange={handleChange} className="hidden" />
                                    بله، کلاینت شما هستم
                                </label>
                                <label className={`flex-1 p-4 border cursor-pointer text-center transition-all ${formData.isOurClient === 'no' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white border-[#E2E8F0] text-[#64748B]'}`}>
                                    <input type="radio" name="isOurClient" value="no" checked={formData.isOurClient === 'no'} onChange={handleChange} className="hidden" />
                                    خیر، توسط شرکت دیگر
                                </label>
                            </div>
                        </div>

                        {/* CONDITIONAL: If NO */}
                        {formData.isOurClient === 'no' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <label className="text-sm font-bold text-[#475569] mb-2 block">توضیحات کوتاه درباره پرووایدر قبلی و نحوه دریافت نامه</label>
                                <textarea
                                    name="otherProviderDesc"
                                    className="w-full p-4 bg-[#FEF2F2] border border-red-100 focus:border-red-300 outline-none transition-colors rounded-sm min-h-[100px]"
                                    placeholder="نام شرکت یا وکیل قبلی، و مشکلی که پیش آمده را ذکر کنید..."
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#475569]">سازمان حامی صادرکننده نامه (Designated Organization)</label>
                            <div className="relative">
                                <select
                                    name="designatedOrg"
                                    onChange={handleChange}
                                    className="w-full p-4 bg-[#Fdfbf7] border border-[#E2E8F0] focus:border-[#1E3A8A] outline-none appearance-none rounded-sm"
                                >
                                    <option value="">انتخاب کنید...</option>
                                    <option value="Alberta IoT Association">Alberta IoT Association</option>
                                    <option value="Highline BETA Inc.">Highline BETA Inc.</option>
                                    <option value="Interactive Niagara">Interactive Niagara</option>
                                    <option value="Intrinsic Innovations">Intrinsic Innovations</option>
                                    <option value="NEXT Canada">NEXT Canada</option>
                                    <option value="Toronto Business Development Centre (TBDC)">Toronto Business Development Centre (TBDC)</option>
                                    <option value="Treefrog">Treefrog</option>
                                    <option value="TSRV Canada Inc.">TSRV Canada Inc. (operating as Techstars Canada)</option>
                                    <option value="University of Toronto Entrepreneurship Hatchery">University of Toronto Entrepreneurship Hatchery</option>
                                    <option value="YSpace (York University)">YSpace (York University)</option>
                                </select>
                                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: TIMELINE */}
                    <div className="space-y-6">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-[#1E3A8A] border-b border-[#1E3A8A]/10 pb-2">
                            <Calendar className="w-5 h-5 text-[#D4AF37]" />
                            گاه‌شمار پرونده
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#475569]">تاریخ سابمیت ورک پرمیت</label>
                                <input type="date" name="wpSubmitDate" onChange={handleChange} className="w-full p-4 bg-[#Fdfbf7] border border-[#E2E8F0] rounded-sm text-left ltr" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#475569]">تاریخ سابمیت اقامت دائم (PR)</label>
                                <input type="date" name="prSubmitDate" onChange={handleChange} className="w-full p-4 bg-[#Fdfbf7] border border-[#E2E8F0] rounded-sm text-left ltr" />
                            </div>
                        </div>

                        <div className="bg-red-50 p-6 border border-red-100 rounded-sm">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#991B1B]">تاریخ ریجکتی ورک پرمیت (در صورت وجود)</label>
                                <input type="date" name="wpRejectionDate" onChange={handleChange} className="w-full p-4 bg-white border border-red-200 rounded-sm text-left ltr focus:border-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: OFFICER NOTES */}
                    <div className="space-y-6">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-[#1E3A8A] border-b border-[#1E3A8A]/10 pb-2">
                            <FileText className="w-5 h-5 text-[#D4AF37]" />
                            نت آفیسر (ATIP / GCMS)
                        </h3>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-[#475569]">آیا نت آفیسر (دلیل دقیق ریجکتی) را دریافت کرده‌اید؟</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-4 border cursor-pointer text-center transition-all ${formData.hasOfficerNotes === 'yes' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white border-[#E2E8F0] text-[#64748B]'}`}>
                                    <input type="radio" name="hasOfficerNotes" value="yes" checked={formData.hasOfficerNotes === 'yes'} onChange={handleChange} className="hidden" />
                                    بله، موجود است
                                </label>
                                <label className={`flex-1 p-4 border cursor-pointer text-center transition-all ${formData.hasOfficerNotes === 'no' ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white border-[#E2E8F0] text-[#64748B]'}`}>
                                    <input type="radio" name="hasOfficerNotes" value="no" checked={formData.hasOfficerNotes === 'no'} onChange={handleChange} className="hidden" />
                                    خیر / اقدام نکرده‌ام
                                </label>
                            </div>
                        </div>

                        {/* CONDITIONAL: If YES */}
                        {formData.hasOfficerNotes === 'yes' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-6 bg-[#F8FAFC] p-6 border border-[#E2E8F0]">

                                {/* Option A: Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#1E3A8A] flex items-center gap-2">
                                        <UploadCloud size={16} />
                                        آپلود فایل نت (PDF)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.png"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1E3A8A] file:text-white hover:file:bg-[#D4AF37] transition-all"
                                    />
                                </div>

                                <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink px-4 text-gray-400 text-xs">یا توضیح متنی</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Option B: Text Area */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#1E3A8A]">تایپ یا کپی متن نت آفیسر</label>
                                    <textarea
                                        name="officerNotesDesc"
                                        className="w-full p-4 bg-white border border-[#E2E8F0] focus:border-[#1E3A8A] outline-none transition-colors rounded-sm min-h-[120px] text-left ltr"
                                        placeholder="The applicant failed to demonstrate that..."
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 5: LEGAL DISCLAIMER & CONSENT */}
                    <div className="bg-[#F1F5F9] border-l-4 border-[#64748B] p-6 space-y-4 rounded-r-sm mt-8">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-[#64748B] shrink-0 mt-1" />
                            <div className="space-y-4">
                                <h4 className="font-bold text-[#0F172A]">سلب مسئولیت و شفاف‌سازی جریان اطلاعات</h4>
                                <p className="text-xs text-[#475569] leading-relaxed text-justify">
                                    کاربر گرامی، تکمیل این فرم به منزله عقد قرارداد وکالت نیست.
                                    <br className="mb-2 block" />
                                    ما (پلتفرم VisaRoads) هیچ‌گونه اطلاعات حساس شما را در سرورهای عمومی ذخیره نمی‌کنیم. این اطلاعات صرفاً جهت ارزیابی اولیه و با رعایت پروتکل‌های امنیتی، مستقیماً به <strong>وکیل رسمی مهاجرت (RCIC)</strong> یا <strong>نماینده قانونی سازمان حامی</strong> جهت بررسی امکان بازیابی پرونده منتقل می‌شود. ما هیچ مسئولیتی در قبال تصمیمات آفیسرهای اداره مهاجرت نداریم.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[#CBD5E1]">
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        required
                                        checked={formData.consent}
                                        onChange={handleCheckboxChange}
                                        className="peer h-6 w-6 cursor-pointer appearance-none rounded border border-slate-300 bg-white checked:border-[#1E3A8A] checked:bg-[#1E3A8A] transition-all"
                                    />
                                    <CheckCircle2 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" size={16} />
                                </div>
                                <span className="text-sm font-bold text-[#1E3A8A] group-hover:text-[#D4AF37] transition-colors pt-0.5 select-none">
                                    من با آگاهی کامل، اجازه می‌دهم این اطلاعات و مدارک جهت بررسی فنی در اختیار وکیل رسمی، نماینده اداره مهاجرت (Authorized Rep) یا سازمان حامی مربوطه قرار گیرد.
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#1E3A8A] hover:bg-[#D4AF37] text-white hover:text-[#0F172A] font-bold text-xl py-5 rounded-sm shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                        >
                            <Briefcase className="group-hover:rotate-12 transition-transform" />
                            ارسال جهت بررسی حقوقی
                        </button>
                        <p className="text-center text-[10px] text-[#94A3B8] mt-4">
                            تیم حقوقی ما ظرف ۴۸ ساعت کاری با شما تماس خواهند گرفت.
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
}