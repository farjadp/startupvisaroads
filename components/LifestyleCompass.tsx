"use client";

import React, { useState } from 'react';
import { RefreshCw, ArrowRight, Globe, Fingerprint } from 'lucide-react';
import Link from 'next/link';

// ==========================================
// 1. DATA & LOGIC (Same as before)
// ==========================================

type CountryID = 'usa' | 'canada' | 'uae' | 'australia' | 'nordics' | 'uk';

type ResultProfile = {
  id: CountryID;
  title: string;
  tagline: string;
  desc: string;
  link: string;
};

type ScoreMap = Record<CountryID, number>;
type Points = Partial<Record<CountryID, number>>;

const RESULTS: Record<CountryID, ResultProfile> = {
  usa: {
    id: 'usa',
    title: 'The Empire Builder',
    tagline: 'United States',
    desc: 'You thrive on high stakes. You want a market with infinite ceilings, where merit dictates your net worth. You prioritize speed and scale over safety.',
    link: '/usa'
  },
  uae: {
    id: 'uae',
    title: 'The Modern Monarch',
    tagline: 'U.A.E.',
    desc: 'You value luxury, efficiency, and zero taxation. You want a city that operates like a 5-star hotel, ensuring your capital is preserved and your lifestyle is elevated.',
    link: '/uae'
  },
  nordics: {
    id: 'nordics',
    title: 'The Functionalist',
    tagline: 'Scandinavia',
    desc: 'You value societal trust, silence, and flat hierarchies. You are willing to trade lower net income for a perfectly functioning society and work-life harmony.',
    link: '/denmark'
  },
  australia: {
    id: 'australia',
    title: 'The Sun Seeker',
    tagline: 'Australia',
    desc: 'You refuse to choose between career and lifestyle. You want a Tier-1 economy that allows you to surf before work. High quality of life is your non-negotiable.',
    link: '/australia'
  },
  canada: {
    id: 'canada',
    title: 'The Global Citizen',
    tagline: 'Canada',
    desc: 'You seek stability and tolerance. You want access to the North American market but prefer a safer, more multicultural environment for your family.',
    link: '/canada'
  },
  uk: {
    id: 'uk',
    title: 'The Traditionalist',
    tagline: 'United Kingdom',
    desc: 'You appreciate prestige, history, and global connectivity. You want to be positioned in a time-zone that bridges the gap between East and West.',
    link: '/country'
  }
};

const QUESTIONS = [
  {
    id: 1,
    question: "Pick your ideal morning routine.",
    options: [
      { label: "5 AM gym, double espresso, market check.", points: { usa: 3, uae: 2 } },
      { label: "Slow coffee, silence, walk in nature.", points: { nordics: 3, canada: 2 } },
      { label: "Sunrise swim or run by the ocean.", points: { australia: 3, uae: 1 } },
      { label: "Tea, news, commute to the city.", points: { uk: 3, canada: 1 } }
    ]
  },
  {
    id: 2,
    question: "Your view on taxation?",
    options: [
      { label: "Taxation is theft. I want 0%.", points: { uae: 5, usa: 1 } },
      { label: "I pay high taxes for high social services.", points: { nordics: 5, canada: 2 } },
      { label: "Reasonable taxes for a stable society.", points: { australia: 2, uk: 2 } },
      { label: "Low corporate tax is what matters.", points: { usa: 3 } }
    ]
  },
  {
    id: 3,
    question: "Choose your environment.",
    options: [
      { label: "Futuristic skyline, heat, luxury.", points: { uae: 5 } },
      { label: "Dense metropolis, energy, grit.", points: { usa: 4, uk: 2 } },
      { label: "Mountains, lakes, four seasons.", points: { canada: 4, nordics: 2 } },
      { label: "Coastal vibes, endless summer.", points: { australia: 5 } }
    ]
  },
  {
    id: 4,
    question: "What defines success?",
    options: [
      { label: "Being the absolute richest in the room.", points: { usa: 5, uae: 2 } },
      { label: "Work-life balance and family time.", points: { nordics: 5, australia: 3 } },
      { label: "Building a legacy in a safe place.", points: { canada: 3, uk: 2 } },
      { label: "Freedom to travel globally.", points: { uae: 3 } }
    ]
  }
];

// ==========================================
// 2. COMPONENT
// ==========================================

export default function LifestyleCompass() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<ScoreMap>({
    usa: 0, canada: 0, uae: 0, australia: 0, nordics: 0, uk: 0
  });
  const [finished, setFinished] = useState(false);

  const handleAnswer = (points: Points) => {
    const newScores = { ...scores };
    Object.keys(points).forEach((key) => {
      const country = key as CountryID;
      const value = points[country];
      if (typeof value === 'number') newScores[country] += value;
    });
    setScores(newScores);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const getWinner = (): ResultProfile => {
    const sorted = Object.entries(scores).sort(([,a], [,b]) => b - a);
    return RESULTS[sorted[0][0] as CountryID];
  };

  const reset = () => {
    setStep(0);
    setScores({ usa: 0, canada: 0, uae: 0, australia: 0, nordics: 0, uk: 0 });
    setFinished(false);
  };

  const winner = finished ? getWinner() : null;

  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a] py-24 px-6 md:px-12 border-y border-[#1a1a1a]/10">
      <div className="max-w-6xl mx-auto">
        
        {!finished ? (
          /* ================= QUESTION VIEW ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Left: Big Number */}
             <div className="lg:col-span-4 flex flex-col justify-between h-full min-h-[300px] border-l-2 border-[#1a1a1a] pl-8">
                <div>
                   <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">
                      The Compass
                   </span>
                   <h2 className="font-serif text-[8rem] leading-[0.8] text-[#1a1a1a]">
                      0{step + 1}
                   </h2>
                </div>
                <div className="hidden lg:block">
                   <p className="font-sans text-sm opacity-60 max-w-xs">
                      Select the option that instinctively feels right. Do not overthink it.
                   </p>
                </div>
             </div>

             {/* Right: Question & Options */}
             <div className="lg:col-span-8">
                <h3 className="font-serif text-3xl md:text-5xl mb-12 leading-tight">
                   {QUESTIONS[step].question}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                   {QUESTIONS[step].options.map((opt, i) => (
                      <button
                         key={i}
                         onClick={() => handleAnswer(opt.points)}
                         className="group flex items-center justify-between w-full p-6 bg-white border border-[#1a1a1a]/10 hover:border-[#1a1a1a] transition-all duration-300 text-left hover:shadow-lg"
                      >
                         <span className="font-sans text-lg md:text-xl group-hover:translate-x-2 transition-transform duration-300">
                            {opt.label}
                         </span>
                         <span className="w-2 h-2 bg-[#CCFF00] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      </button>
                   ))}
                </div>
             </div>

          </div>
        ) : (
          /* ================= RESULT VIEW (PASSPORT STYLE) ================= */
          <div className="animate-in zoom-in-95 duration-700 flex justify-center">
             
             <div className="bg-white border border-[#1a1a1a] p-8 md:p-16 max-w-2xl w-full shadow-[20px_20px_0px_0px_rgba(26,26,26,1)] relative overflow-hidden">
                
                {/* Fingerprint decoration */}
                <Fingerprint className="absolute top-[-20px] right-[-20px] w-64 h-64 text-[#1a1a1a]/5 -rotate-12" />

                <div className="relative z-10 text-center">
                   <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] border border-[#1a1a1a] px-3 py-1 inline-block mb-8">
                      Archetype Match
                   </span>

                   <h2 className="font-serif text-5xl md:text-7xl mb-4 leading-[0.9]">
                      {winner?.tagline}
                   </h2>
                   
                   <p className="font-sans text-sm font-bold uppercase tracking-widest text-[#CCFF00] bg-[#1a1a1a] px-2 inline-block mb-10">
                      {winner?.title}
                   </p>

                   <div className="border-t border-b border-[#1a1a1a]/10 py-8 mb-10">
                      <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#1a1a1a]/80">
                         {winner?.desc}
                      </p>
                   </div>

                   <div className="flex flex-col gap-4">
                      <Link 
                         href={winner?.link || '/'} 
                         className="flex items-center justify-center gap-3 w-full bg-[#1a1a1a] text-[#F2F0E9] py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all"
                      >
                         View Strategy <ArrowRight size={18} />
                      </Link>
                      
                      <button 
                         onClick={reset}
                         className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                      >
                         <RefreshCw size={12} /> Recalibrate
                      </button>
                   </div>
                </div>

             </div>

          </div>
        )}

      </div>
    </div>
  );
}
