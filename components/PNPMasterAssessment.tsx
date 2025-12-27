"use client";

import React, { useState } from 'react';
import { 
  ArrowRight, 
  RefreshCw, 
  Calculator, 
  MapPin, 
  DollarSign, 
  AlertCircle, 
  User, 
  Languages, 
  GraduationCap,
  Briefcase,
  Cpu,
  Download
} from 'lucide-react';
import Link from 'next/link';

// ==========================================
// 1. DATA CONSTANTS
// ==========================================

const EDU_LEVELS = [
  { val: 1, label: "High School" },
  { val: 2, label: "College / Trade" },
  { val: 3, label: "Bachelor's" },
  { val: 4, label: "Master's / PhD" },
];

const SECTORS = [
  { id: 'general', label: 'General / Retail / Service' },
  { id: 'tech', label: 'Tech / ICT / Digital' },
  { id: 'agri', label: 'Agriculture / Farming' },
  { id: 'health', label: 'Healthcare / Medical' },
  { id: 'construction', label: 'Construction / Trades' },
];

type ProvinceRule = {
  id: string;
  name: string;
  link: string;
  minNetWorth: number;
  minInvestment: number;
  minExperience: number;
  minCLB: number;
  minEducation: number;
  maxAge: number;
  prioritySectors: string[]; // Sectors that get a boost or easier entry
  notes: string;
};

const PROVINCES: ProvinceRule[] = [
  { id: 'oinp-tech', name: 'Ontario (Tech Draw)', link: '/pnp/ontario', minNetWorth: 400000, minInvestment: 200000, minExperience: 3, minCLB: 6, minEducation: 3, maxAge: 99, prioritySectors: ['tech'], notes: 'Lower investment req for Tech' },
  { id: 'oinp-gta', name: 'Ontario (General GTA)', link: '/pnp/ontario', minNetWorth: 800000, minInvestment: 600000, minExperience: 3, minCLB: 4, minEducation: 1, maxAge: 99, prioritySectors: [], notes: 'Highly Competitive' },
  { id: 'bc-tech', name: 'BC PNP Tech', link: '/pnp/bc', minNetWorth: 600000, minInvestment: 200000, minExperience: 1, minCLB: 4, minEducation: 2, maxAge: 99, prioritySectors: ['tech'], notes: 'Weekly Draws, Fast Track' },
  { id: 'bc-base', name: 'BC (Base Category)', link: '/pnp/bc', minNetWorth: 600000, minInvestment: 200000, minExperience: 3, minCLB: 4, minEducation: 2, maxAge: 99, prioritySectors: [], notes: 'High SIRS Score Needed' },
  { id: 'alberta', name: 'Alberta (Rural)', link: '/pnp/alberta', minNetWorth: 300000, minInvestment: 100000, minExperience: 3, minCLB: 4, minEducation: 1, maxAge: 99, prioritySectors: ['agri', 'general'], notes: 'Community Support Required' },
  { id: 'sask-farm', name: 'Saskatchewan (Farm)', link: '/pnp/saskatchewan', minNetWorth: 500000, minInvestment: 300000, minExperience: 3, minCLB: 4, minEducation: 1, maxAge: 99, prioritySectors: ['agri'], notes: 'Young Farmer Stream avail.' },
  { id: 'manitoba', name: 'Manitoba (Rural)', link: '/pnp/manitoba', minNetWorth: 500000, minInvestment: 150000, minExperience: 3, minCLB: 5, minEducation: 1, maxAge: 55, prioritySectors: [], notes: 'Adaptability Points Key' },
  { id: 'nb', name: 'New Brunswick', link: '/pnp/new-brunswick', minNetWorth: 600000, minInvestment: 250000, minExperience: 3, minCLB: 5, minEducation: 2, maxAge: 59, prioritySectors: ['tech', 'construction'], notes: '$100k Deposit Required' },
  { id: 'pei', name: 'PEI', link: '/pnp/pei', minNetWorth: 600000, minInvestment: 150000, minExperience: 3, minCLB: 4, minEducation: 1, maxAge: 59, prioritySectors: [], notes: 'Interview Mandatory' },
];

export default function PNPMasterAssessment() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    netWorth: 600000,
    investment: 200000,
    experience: 3,
    age: 35,
    clb: 5,
    education: 2,
    sector: 'general'
  });

  // Calculate Logic
  const results = PROVINCES.map(prov => {
    // Check Basic Eligibility
    const isNetWorthOk = formData.netWorth >= prov.minNetWorth;
    const isInvestOk = formData.investment >= prov.minInvestment;
    const isExpOk = formData.experience >= prov.minExperience;
    const isLangOk = formData.clb >= prov.minCLB;
    const isEduOk = formData.education >= prov.minEducation;
    const isAgeOk = formData.age <= prov.maxAge;
    
    // Check Sector Priority (Bonus)
    const isPrioritySector = prov.prioritySectors.includes(formData.sector);
    
    // If it's a sector-specific stream (like BC Tech), user MUST be in that sector
    // If user is Tech, they qualify for BC Tech. If General, they don't.
    // If stream has NO priority sectors list (empty), everyone qualifies.
    const isSectorCompatible = prov.prioritySectors.length > 0 ? isPrioritySector : true;

    // Calculate Match Percentage (Fake Score for UX)
    let score = 0;
    if (isNetWorthOk) score += 20;
    if (isInvestOk) score += 20;
    if (isExpOk) score += 15;
    if (isLangOk) score += 15;
    if (isEduOk) score += 15;
    if (isAgeOk) score += 15;
    if (isPrioritySector) score += 10; // Bonus
    
    const finalScore = Math.min(score, 100);
    const eligible = isNetWorthOk && isInvestOk && isExpOk && isLangOk && isEduOk && isAgeOk && isSectorCompatible;

    return {
      ...prov,
      eligible,
      score: eligible ? finalScore : Math.min(finalScore, 40), // Cap score if ineligible
      isPrioritySector,
      reasons: [
        !isNetWorthOk && `Need $${(prov.minNetWorth - formData.netWorth)/1000}k more Net Worth`,
        !isInvestOk && `Need $${(prov.minInvestment - formData.investment)/1000}k more Capital`,
        !isExpOk && `Min ${prov.minExperience}y Experience`,
        !isLangOk && `Min CLB ${prov.minCLB}`,
        !isAgeOk && `Age limit is ${prov.maxAge}`,
        !isSectorCompatible && `Restricted to ${prov.prioritySectors.join('/')} sectors`
      ].filter(Boolean)
    };
  });

  const eligibleCount = results.filter(m => m.eligible).length;

  return (
    <div className="w-full max-w-6xl mx-auto bg-white border border-[#1a1a1a] shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] p-8 md:p-12 relative overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#1a1a1a]/10 pb-6">
         <div>
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-2 block">Algorithmic Matching v2.1</span>
            <h2 className="font-serif text-4xl md:text-5xl">The Jurisdiction Finder</h2>
         </div>
         <div className="hidden md:block text-right">
             <p className={`font-sans text-xs font-bold uppercase tracking-widest px-3 py-1 ${step === 1 ? 'bg-[#1a1a1a] text-[#CCFF00]' : 'bg-[#CCFF00] text-[#1a1a1a]'}`}>
                {step === 1 ? 'Phase 1: Input Data' : 'Phase 2: Feasibility Report'}
             </p>
         </div>
      </div>

      {step === 1 ? (
        /* ================= INPUT PHASE ================= */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* SECTION: FINANCIALS */}
              <div className="space-y-10">
                 <h3 className="font-sans text-sm font-bold uppercase tracking-widest border-b border-[#1a1a1a] pb-2 mb-6 text-[#1a1a1a]/60">Financial Capital</h3>
                 
                 {/* Net Worth */}
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <label className="font-serif text-2xl flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-[#1a1a1a]/40"/> Net Worth (CAD)
                       </label>
                       <span className="font-sans text-2xl font-bold text-[#1a1a1a]">
                          ${formData.netWorth.toLocaleString()}
                       </span>
                    </div>
                    <input 
                      type="range" min="100000" max="2000000" step="50000"
                      value={formData.netWorth}
                      onChange={(e) => setFormData({...formData, netWorth: Number(e.target.value)})}
                      className="w-full h-2 bg-[#1a1a1a]/10 rounded-lg appearance-none cursor-pointer accent-[#1a1a1a]"
                    />
                 </div>

                 {/* Investment */}
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <label className="font-serif text-2xl flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-[#1a1a1a]/40"/> Investment (CAD)
                       </label>
                       <span className="font-sans text-2xl font-bold text-[#CCFF00] bg-[#1a1a1a] px-2">
                          ${formData.investment.toLocaleString()}
                       </span>
                    </div>
                    <input 
                      type="range" min="50000" max="1000000" step="10000"
                      value={formData.investment}
                      onChange={(e) => setFormData({...formData, investment: Number(e.target.value)})}
                      className="w-full h-2 bg-[#1a1a1a]/10 rounded-lg appearance-none cursor-pointer accent-[#CCFF00]"
                    />
                 </div>

                 {/* SECTOR SELECTOR (NEW) */}
                 <div className="space-y-4 pt-4">
                    <label className="font-serif text-2xl flex items-center gap-2">
                       <Cpu className="w-5 h-5 text-[#1a1a1a]/40"/> Industry Sector
                    </label>
                    <select 
                       value={formData.sector}
                       onChange={(e) => setFormData({...formData, sector: e.target.value})}
                       className="w-full border-b-2 border-[#1a1a1a]/20 py-3 font-sans text-xl bg-transparent focus:outline-none focus:border-[#1a1a1a] cursor-pointer"
                    >
                       {SECTORS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                    <p className="text-xs text-[#1a1a1a]/50">Tech and Agri sectors often have lower entry barriers.</p>
                 </div>
              </div>

              {/* SECTION: HUMAN CAPITAL */}
              <div className="space-y-10">
                 <h3 className="font-sans text-sm font-bold uppercase tracking-widest border-b border-[#1a1a1a] pb-2 mb-6 text-[#1a1a1a]/60">Human Capital</h3>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="font-serif text-xl flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#1a1a1a]/40"/> Experience
                       </label>
                       <input 
                         type="number" min="0" max="30"
                         value={formData.experience}
                         onChange={(e) => setFormData({...formData, experience: Number(e.target.value)})}
                         className="w-full border-b border-[#1a1a1a]/20 py-2 font-sans text-2xl focus:outline-none focus:border-[#1a1a1a] bg-transparent"
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="font-serif text-xl flex items-center gap-2">
                          <User className="w-4 h-4 text-[#1a1a1a]/40"/> Age
                       </label>
                       <input 
                         type="number" min="18" max="75"
                         value={formData.age}
                         onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                         className="w-full border-b border-[#1a1a1a]/20 py-2 font-sans text-2xl focus:outline-none focus:border-[#1a1a1a] bg-transparent"
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <label className="font-serif text-xl flex items-center gap-2">
                          <Languages className="w-4 h-4 text-[#1a1a1a]/40"/> Language (CLB)
                       </label>
                       <span className="font-sans text-xl font-bold">{formData.clb} / 10</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1"
                      value={formData.clb}
                      onChange={(e) => setFormData({...formData, clb: Number(e.target.value)})}
                      className="w-full h-2 bg-[#1a1a1a]/10 rounded-lg appearance-none cursor-pointer accent-[#1a1a1a]"
                    />
                 </div>

                 <div className="space-y-4">
                    <label className="font-serif text-xl flex items-center gap-2">
                       <GraduationCap className="w-4 h-4 text-[#1a1a1a]/40"/> Education
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                       {EDU_LEVELS.map((level) => (
                          <button
                             key={level.val}
                             onClick={() => setFormData({...formData, education: level.val})}
                             className={`text-xs font-bold uppercase py-3 border transition-all ${
                                formData.education === level.val 
                                ? 'bg-[#1a1a1a] text-[#F2F0E9] border-[#1a1a1a]' 
                                : 'text-[#1a1a1a]/50 border-[#1a1a1a]/20 hover:border-[#1a1a1a]'
                             }`}
                          >
                             {level.label}
                          </button>
                       ))}
                    </div>
                 </div>

              </div>
           </div>

           <div className="pt-12 flex justify-center lg:justify-end">
              <button 
                onClick={() => setStep(2)}
                className="bg-[#1a1a1a] text-[#F2F0E9] px-12 py-6 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors flex items-center gap-4 text-xl w-full md:w-auto justify-center group shadow-lg"
              >
                 Generate Analysis <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
           </div>

        </div>
      ) : (
        /* ================= ANALYSIS PHASE ================= */
        <div className="animate-in zoom-in-95 duration-500">
           
           <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-[#1a1a1a]/10 pb-8">
              <div>
                 <h3 className="font-serif text-3xl mb-1">
                    System Identification
                 </h3>
                 <p className="font-sans text-sm text-[#1a1a1a]/60">
                    Found <span className="font-bold text-[#1a1a1a] border-b-2 border-[#CCFF00]">{eligibleCount}</span> compatible jurisdictions based on your profile.
                 </p>
              </div>
              <button onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b border-black pb-1 hover:text-[#1a1a1a]/60">
                 <RefreshCw size={14} /> Refine Inputs
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.sort((a,b) => Number(b.eligible) - Number(a.eligible) || b.score - a.score).map((prov, i) => (
                 <div key={i} className={`p-6 border relative group transition-all duration-300 flex flex-col justify-between ${prov.eligible ? 'border-[#1a1a1a] bg-white' : 'border-[#1a1a1a]/10 bg-[#F9F9F9] opacity-70 hover:opacity-100'}`}>
                    
                    <div>
                       <div className="flex justify-between items-start mb-4">
                          <MapPin className={`w-6 h-6 ${prov.eligible ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/20'}`} />
                          
                          {/* Match Score */}
                          <div className="flex flex-col items-end">
                             <span className={`text-[10px] font-bold uppercase px-2 py-1 ${prov.eligible ? 'bg-[#CCFF00] text-[#1a1a1a]' : 'bg-[#1a1a1a]/10 text-[#1a1a1a]'}`}>
                                {prov.eligible ? 'Viable' : 'Ineligible'}
                             </span>
                             <span className="text-[10px] font-bold mt-1 opacity-50">{prov.score}% Match</span>
                          </div>
                       </div>

                       <h4 className="font-serif text-2xl mb-2 leading-tight">{prov.name}</h4>
                       
                       {prov.isPrioritySector && (
                          <span className="inline-block mb-3 text-[10px] font-bold uppercase text-[#CCFF00] bg-[#1a1a1a] px-2 py-0.5">
                             Sector Priority
                          </span>
                       )}

                       <div className="font-sans text-xs text-[#1a1a1a]/60 mb-6 min-h-[60px]">
                          {prov.eligible ? (
                             <p className="italic">{prov.notes}</p>
                          ) : (
                             <div className="text-[#b91c1c] font-bold flex flex-col gap-1">
                                {prov.reasons.slice(0, 2).map((r, idx) => ( 
                                   <span key={idx} className="flex items-center gap-1"><AlertCircle size={10}/> {r}</span>
                                ))}
                                {prov.reasons.length > 2 && <span className="text-[10px] opacity-70">+ {prov.reasons.length - 2} more reasons</span>}
                             </div>
                          )}
                       </div>
                    </div>

                    <Link href={prov.link} className={`flex items-center justify-center gap-2 w-full py-3 text-xs font-bold uppercase tracking-widest border transition-colors ${prov.eligible ? 'bg-[#1a1a1a] text-[#F2F0E9] hover:bg-[#CCFF00] hover:text-[#1a1a1a] border-[#1a1a1a]' : 'border-[#1a1a1a]/20 text-[#1a1a1a]/40 hover:border-[#1a1a1a] hover:text-[#1a1a1a] cursor-not-allowed pointer-events-none'}`}>
                       View Protocol <ArrowRight size={14}/>
                    </Link>

                 </div>
              ))}
           </div>

           {/* LEAD CAPTURE BAR */}
           <div className="mt-12 bg-[#1a1a1a] text-[#F2F0E9] p-8 flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl">
              <div className="flex items-center gap-6">
                 <div className="bg-[#CCFF00] p-3 text-[#1a1a1a] hidden md:block">
                    <Download size={24} />
                 </div>
                 <div>
                    <p className="font-serif text-2xl mb-1">Export Full Report</p>
                    <p className="font-sans text-sm opacity-60">
                       Get a detailed PDF breakdown including EOI point simulations for all eligible provinces.
                    </p>
                 </div>
              </div>
              <button 
                 onClick={() => alert("This would open a lead capture modal (Name/Email) then download PDF.")}
                 className="whitespace-nowrap border border-[#F2F0E9] text-[#F2F0E9] px-8 py-4 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] hover:border-[#CCFF00] transition-colors"
              >
                 Email Me Report
              </button>
           </div>

        </div>
      )}
    </div>
  );
}