"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Briefcase, 
  DollarSign, 
  User,
  BarChart3,
  Calendar,
  Send,
  Loader2,
  ShieldAlert,
  Globe2,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { sendTelegramNotification } from '@/app/actions';

// ==========================================
// 1. CONSTANTS & OPTIONS
// ==========================================
const STEPS = [
  { id: 1, title: "Profile", subtitle: "Human Capital", icon: <User size={20} /> },
  { id: 2, title: "Capital", subtitle: "Financial Power", icon: <DollarSign size={20} /> },
  { id: 3, title: "Business", subtitle: "Operations", icon: <Briefcase size={20} /> },
  { id: 4, title: "Strategy", subtitle: "Viability Matrix", icon: <BarChart3 size={20} /> },
];

const SECTORS = [
  "Software / IT / AI",
  "Manufacturing",
  "Construction / Trades",
  "Healthcare / MedTech",
  "Agriculture / Agri-Food",
  "Retail / Service (High Risk)",
  "Real Estate (Passive)",
  "Other"
];

// ==========================================
// 2. COMPONENT
// ==========================================
export default function StrategicAssessment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // State Management
  const [formData, setFormData] = useState({
    // Step 1
    age: "",
    education: "",
    english: "",
    country: "",
    // Step 2
    netWorth: "",
    investment: "",
    // Step 3
    role: "", 
    activeManagement: "", // New Critical Field
    sector: "",           // New Critical Field
    experience: "",
    // Step 4
    fullName: "",
    email: "",
    phone: ""
  });

  // --- LOGIC ENGINE (Weighted Scoring) ---
  const calculateViability = () => {
    // Base scores (out of 100)
    let scores = {
      ontario: 40,
      bc: 40,
      alberta: 50,
      sask: 60
    };

    // 1. Capital Impact (Ontario cares about money)
    if (formData.netWorth === '>1m') {
      scores.ontario += 20;
      scores.bc += 10;
    } else if (formData.netWorth === '<500k') {
      scores.ontario -= 30; // Disqualified for GTA essentially
      scores.bc -= 20;
    }

    // 2. Sector Impact (Tech boosts BC/Ontario)
    if (formData.sector === "Software / IT / AI") {
      scores.ontario += 15; // Tech Draws
      scores.bc += 20;      // Tech Pilot
      scores.alberta += 10; // Accelerated Tech
    }

    // 3. Language Impact (BC/Ontario need high English)
    if (formData.english === 'fluent') {
      scores.ontario += 10;
      scores.bc += 15;
    } else if (formData.english === 'basic') {
      scores.ontario -= 10;
      scores.bc -= 20;
      // Sask/Alberta are more forgiving
    }

    // 4. Deal Breakers (Passive Investment)
    if (formData.activeManagement === 'no') {
      return { ontario: 0, bc: 0, alberta: 0, sask: 0 }; // Fail all
    }

    // Cap scores at 98% (Nothing is 100%)
    return {
      ontario: Math.min(Math.max(scores.ontario, 0), 90),
      bc: Math.min(Math.max(scores.bc, 0), 92),
      alberta: Math.min(Math.max(scores.alberta, 0), 95),
      sask: Math.min(Math.max(scores.sask, 0), 95),
    };
  };

  const results = calculateViability();

  // --- HANDLERS ---
  const handleSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]); // Clear errors on interaction
  };

  const validateStep = (step: number) => {
    const errs = [];
    if (step === 1) {
      if (!formData.age) errs.push("Age group is required.");
      if (!formData.english) errs.push("Language level is required.");
      if (!formData.education) errs.push("Education is required.");
      if (!formData.country) errs.push("Current country is required.");
    }
    if (step === 2) {
      if (!formData.netWorth) errs.push("Net worth is required.");
      if (!formData.investment) errs.push("Liquid capital is required.");
    }
    if (step === 3) {
      if (!formData.role) errs.push("Business role is required.");
      if (!formData.sector) errs.push("Business sector is required.");
      if (!formData.activeManagement) errs.push("Management style is required.");
    }
    return errs;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    setErrors([]);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setErrors(["All contact fields are required."]);
      return;
    }
    
    setIsProcessing(true);
    await sendTelegramNotification(formData, results);
    setIsProcessing(false);
    setIsSent(true);
  };

  // --- UI COMPONENTS ---
  const OptionCard = ({ field, value, label, sub }: { field: string, value: string, label: string, sub?: string }) => {
    // @ts-ignore
    const isSelected = formData[field] === value;
    return (
      <button
        type="button"
        onClick={() => handleSelect(field, value)}
        className={`w-full text-left p-4 border-2 transition-all duration-200 flex justify-between items-center group
          ${isSelected 
            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#CCFF00]' 
            : 'border-[#1a1a1a]/10 bg-white text-[#1a1a1a] hover:border-[#1a1a1a]'}`}
      >
        <div>
          <span className="block font-serif text-lg leading-none mb-1">{label}</span>
          {sub && <span className={`text-[10px] font-sans uppercase tracking-widest ${isSelected ? 'opacity-80' : 'opacity-50'}`}>{sub}</span>}
        </div>
        {isSelected && <Check size={16} />}
      </button>
    );
  };

  const ViabilityBar = ({ label, score, color }: { label: string, score: number, color: string }) => {
    let rating = "Low";
    if (score > 50) rating = "Medium";
    if (score > 75) rating = "Strong";
    if (score === 0) rating = "Not Eligible";

    return (
      <div className="mb-5">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1 text-[#1a1a1a]">
          <span>{label}</span>
          <span className={score === 0 ? "text-red-600" : "opacity-60"}>{rating}</span>
        </div>
        <div className="w-full h-3 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-full overflow-hidden">
          <div 
             className={`h-full ${score === 0 ? 'bg-red-500' : color} transition-all duration-1000`} 
             style={{ width: `${Math.max(score, 5)}%` }} // Always show at least 5% for visibility
          ></div>
        </div>
      </div>
    );
  };

  // --- SUCCESS STATE ---
  if (isSent) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white border-2 border-[#1a1a1a] p-12 text-center shadow-[10px_10px_0px_0px_rgba(26,26,26,1)]">
         <div className="w-20 h-20 bg-[#CCFF00] rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={40} className="text-[#1a1a1a]" />
         </div>
         <h2 className="font-serif text-4xl mb-4 text-[#1a1a1a]">Strategy Profile Logged.</h2>
         <p className="font-sans text-[#1a1a1a]/70 max-w-lg mx-auto mb-8 text-lg">
            We have not spammed you with a fake PDF. Your profile is now under review by our lead strategist.
            <br/><br/>
            If we see a viable path, we will contact you within 24h.
         </p>
         <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <a 
               href="/book-meeting" 
               className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors text-center"
            >
               Book Strategy Call
            </a>
            <button onClick={() => window.location.reload()} className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 border-b border-black pb-1">
               Start New Assessment
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto border-2 border-[#1a1a1a] bg-[#F2F0E9] flex flex-col lg:flex-row min-h-[750px] shadow-[10px_10px_0px_0px_rgba(26,26,26,1)]">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="lg:w-1/3 bg-[#1a1a1a] text-[#F2F0E9] p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1a1a1a]">
         <div>
            <span className="text-[#CCFF00] font-sans text-xs font-bold uppercase tracking-widest mb-4 block">
               DIAGNOSTIC PROTOCOL
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-none">
               {currentStep === 4 ? "Initial Verdict" : STEPS[currentStep - 1].title}
            </h2>
            
            <p className="font-sans text-sm opacity-60 leading-relaxed border-l-2 border-[#CCFF00] pl-4 mb-8">
               {currentStep === 1 && "We assess 'Adaptability' first. Your age, language skills, and education determine which doors are open or closed legally."}
               {currentStep === 2 && "Provincial streams are capital intensive. We differentiate between 'Paper Net Worth' and 'Deployable Capital'."}
               {currentStep === 3 && "Crucial Step. Active management is the #1 reason for refusal. Passive investors do not qualify for Entrepreneur streams."}
               {currentStep === 4 && "This is a preliminary feasibility check based on current program matrices. It is not a guarantee of visa issuance."}
            </p>

            {/* Steps List */}
            <div className="space-y-3">
               {STEPS.map((step) => (
                  <div key={step.id} className={`flex items-center gap-4 py-2 ${currentStep === step.id ? 'opacity-100 text-[#CCFF00]' : 'opacity-30'}`}>
                     <span className="font-mono text-xs">0{step.id}</span>
                     <span className="font-sans text-xs uppercase tracking-widest">{step.subtitle}</span>
                  </div>
               ))}
            </div>
         </div>
         
         <div className="mt-8 pt-6 border-t border-[#F2F0E9]/10 text-[10px] text-[#F2F0E9]/40 leading-relaxed text-justify">
            <p className="mb-2 font-bold text-[#b91c1c]">DISCLAIMER:</p>
            We are a strategic business consultancy, not a law firm. This tool provides an educational assessment based on public criteria. It does not constitute legal immigration advice.
         </div>
      </div>

      {/* ================= RIGHT CONTENT ================= */}
      <div className="lg:w-2/3 bg-[#F2F0E9] p-6 md:p-12 flex flex-col">
         
         <div className="flex-grow flex flex-col justify-center max-w-2xl mx-auto w-full">
            
            {/* ERROR MESSAGE */}
            {errors.length > 0 && (
               <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertTriangle className="text-red-500 w-5 h-5" />
                  <div className="text-sm text-red-700 font-bold">
                     {errors.map((e, i) => <span key={i} className="block">{e}</span>)}
                  </div>
               </div>
            )}

            {/* STEP 1: PROFILE */}
            {currentStep === 1 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-2">Age</label>
                        <div className="grid grid-cols-4 gap-2">
                           {['18-29', '30-39', '40-49', '50+'].map(age => (
                              <OptionCard key={age} field="age" value={age} label={age} />
                           ))}
                        </div>
                     </div>
                     <div className="col-span-2 md:col-span-1">
                        <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-2">Education</label>
                        <select 
                           className="w-full p-4 bg-white border-2 border-[#1a1a1a]/10 focus:border-[#1a1a1a] outline-none font-serif text-lg appearance-none cursor-pointer text-[#1a1a1a]"
                           onChange={(e) => handleSelect("education", e.target.value)}
                           value={formData.education}
                        >
                           <option value="">Select Level...</option>
                           <option value="highschool">High School</option>
                           <option value="bachelor">Bachelor's Degree</option>
                           <option value="master">Master's / PhD</option>
                        </select>
                     </div>
                     <div className="col-span-2 md:col-span-1">
                        <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-2">English (IELTS)</label>
                        <select 
                           className="w-full p-4 bg-white border-2 border-[#1a1a1a]/10 focus:border-[#1a1a1a] outline-none font-serif text-lg appearance-none cursor-pointer text-[#1a1a1a]"
                           onChange={(e) => handleSelect("english", e.target.value)}
                           value={formData.english}
                        >
                           <option value="">Select Level...</option>
                           <option value="none">None / Very Basic</option>
                           <option value="basic">Basic (CLB 4)</option>
                           <option value="moderate">Moderate (CLB 5)</option>
                           <option value="fluent">Fluent (CLB 7+)</option>
                        </select>
                     </div>
                     <div className="col-span-2">
                        <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-2">Current Residence</label>
                        <input 
                           type="text" placeholder="e.g. UAE, Iran, India..."
                           className="w-full p-4 bg-white border-b-2 border-[#1a1a1a] focus:bg-[#CCFF00]/10 outline-none font-serif text-xl placeholder:text-[#1a1a1a]/20 text-[#1a1a1a]"
                           value={formData.country}
                           onChange={(e) => handleSelect("country", e.target.value)}
                        />
                     </div>
                  </div>
               </div>
            )}

            {/* STEP 2: CAPITAL */}
            {currentStep === 2 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div>
                     <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-3">Total Net Worth (CAD)</label>
                     <p className="text-[10px] text-gray-500 mb-2">Everything you own minus debts. Must be verifiable.</p>
                     <div className="grid grid-cols-1 gap-2">
                        <OptionCard field="netWorth" value="<500k" label="Under $500k" sub="Disqualified for most streams" />
                        <OptionCard field="netWorth" value="500k-1m" label="$500k — $1M" sub="Standard Eligibility" />
                        <OptionCard field="netWorth" value=">1m" label="$1M +" sub="Strong Profile" />
                     </div>
                  </div>
                  <div>
                     <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-3">Liquid Investment Budget</label>
                     <div className="grid grid-cols-2 gap-2">
                        <OptionCard field="investment" value="<150k" label="< $150k" />
                        <OptionCard field="investment" value=">200k" label="$200k +" />
                     </div>
                  </div>
               </div>
            )}

            {/* STEP 3: BUSINESS */}
            {currentStep === 3 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div>
                     <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-3">Business Sector</label>
                     <select 
                        className="w-full p-4 bg-white border-2 border-[#1a1a1a]/10 focus:border-[#1a1a1a] outline-none font-serif text-lg appearance-none cursor-pointer text-[#1a1a1a]"
                        onChange={(e) => handleSelect("sector", e.target.value)}
                        value={formData.sector}
                     >
                        <option value="">Select Industry...</option>
                        {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>
                  
                  <div>
                     <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-3">Your Role</label>
                     <div className="grid grid-cols-1 gap-2">
                        <OptionCard field="role" value="owner" label="Business Owner" sub=">33% Equity Holder" />
                        <OptionCard field="role" value="manager" label="Senior Manager" sub="No equity, but high-level control" />
                     </div>
                  </div>

                  <div className="bg-white border-l-4 border-[#1a1a1a] p-4">
                     <label className="block font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a] mb-2">Active Management</label>
                     <p className="text-xs text-gray-500 mb-3">Are you willing to move to Canada and run the business daily?</p>
                     <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                           <input type="radio" name="active" value="yes" onChange={() => handleSelect("activeManagement", "yes")} checked={formData.activeManagement === 'yes'} className="accent-[#1a1a1a] w-4 h-4"/>
                           <span className="font-bold text-sm">Yes, I will operate it.</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                           <input type="radio" name="active" value="no" onChange={() => handleSelect("activeManagement", "no")} checked={formData.activeManagement === 'no'} className="accent-[#1a1a1a] w-4 h-4"/>
                           <span className="text-sm">No, I want passive income.</span>
                        </label>
                     </div>
                  </div>
               </div>
            )}

            {/* STEP 4: ANALYSIS & CAPTURE */}
            {currentStep === 4 && (
               <div className="animate-in fade-in zoom-in-95">
                  <div className="bg-white border-2 border-[#1a1a1a] p-6 mb-8 relative">
                     <div className="absolute top-0 right-0 bg-[#1a1a1a] text-[#CCFF00] text-[10px] font-bold px-3 py-1 uppercase">
                        Prelim Result
                     </div>
                     
                     <div className="mb-6">
                        <p className="font-serif text-lg leading-relaxed">
                           {formData.activeManagement === 'no' ? (
                              <span className="text-red-600 font-bold">Ineligible for Entrepreneur Streams. PNP requires active residency.</span>
                           ) : (
                              <span>Based on <strong>{formData.sector}</strong> background and <strong>${formData.investment}</strong> liquidity:</span>
                           )}
                        </p>
                     </div>

                     <ViabilityBar label="Alberta (Rural)" score={results.alberta} color="bg-green-500" />
                     <ViabilityBar label="Saskatchewan" score={results.sask} color="bg-green-500" />
                     <ViabilityBar label="British Columbia" score={results.bc} color="bg-yellow-500" />
                     <ViabilityBar label="Ontario (GTA)" score={results.ontario} color="bg-red-500" />
                  </div>

                  {/* CAPTURE FORM */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">
                        <ShieldCheck size={14}/> Secure Submission
                     </div>
                     <form onSubmit={handleFinalSubmit} className="grid grid-cols-1 gap-4">
                        <input 
                           type="text" placeholder="Full Name" 
                           className="p-4 bg-white border-2 border-[#1a1a1a]/10 outline-none focus:border-[#1a1a1a] text-[#1a1a1a] font-serif"
                           onChange={e => handleSelect('fullName', e.target.value)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <input 
                              type="email" placeholder="Email Address" 
                              className="p-4 bg-white border-2 border-[#1a1a1a]/10 outline-none focus:border-[#1a1a1a] text-[#1a1a1a] font-serif"
                              onChange={e => handleSelect('email', e.target.value)}
                           />
                           <input 
                              type="tel" placeholder="Phone / WhatsApp" 
                              className="p-4 bg-white border-2 border-[#1a1a1a]/10 outline-none focus:border-[#1a1a1a] text-[#1a1a1a] font-serif"
                              onChange={e => handleSelect('phone', e.target.value)}
                           />
                        </div>
                        
                        <div className="text-[10px] text-gray-500 leading-tight">
                           Your data is processed securely. We are not a law firm. We'll tell you if you're not a fit. No spam.
                        </div>

                        <button disabled={isProcessing} className="bg-[#1a1a1a] text-[#F2F0E9] py-4 font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors flex justify-center gap-3 items-center disabled:opacity-70 shadow-lg">
                           {isProcessing ? 'Analyzing...' : 'Get Final Verdict'} {isProcessing ? <Loader2 className="animate-spin"/> : <Send size={18}/>}
                        </button>
                     </form>
                  </div>
               </div>
            )}
            
         </div>

         {/* NAV BUTTONS */}
         <div className="mt-8 flex justify-between pt-6 border-t border-[#1a1a1a]/10">
            {currentStep > 1 && currentStep < 4 && (
               <button onClick={prevStep} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#1a1a1a]">
                  <ChevronLeft size={14} /> Back
               </button>
            )}
            {currentStep < 4 && (
               <button onClick={nextStep} className="ml-auto bg-[#1a1a1a] text-[#F2F0E9] px-10 py-3 font-bold uppercase text-xs hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors flex items-center gap-2">
                  Next <ChevronRight size={14} />
               </button>
            )}
         </div>

      </div>
    </div>
  );
}