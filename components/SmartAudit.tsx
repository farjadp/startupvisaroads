// components/SmartAudit.tsx
"use client";

import React, { useState } from 'react';
import { ArrowRight, Check, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type Question = {
  id: number;
  text: string;
  options: { label: string; score: number }[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "How much liquid capital do you have available for this expansion?",
    options: [
      { label: "Under $50k", score: 0 },
      { label: "$50k - $150k", score: 10 },
      { label: "$150k - $300k", score: 20 },
      { label: "$300k+", score: 30 },
    ]
  },
  {
    id: 2,
    text: "What represents your current business stage?",
    options: [
      { label: "Idea Phase", score: 5 },
      { label: "MVP / Prototype", score: 15 },
      { label: "Generating Revenue", score: 25 },
      { label: "Scaling (Series A+)", score: 30 },
    ]
  },
  {
    id: 3,
    text: "Do you hold intellectual property (IP) rights?",
    options: [
      { label: "No / Not Applicable", score: 0 },
      { label: "Pending", score: 10 },
      { label: "Yes, fully owned", score: 20 },
    ]
  },
  {
    id: 4,
    text: "What is your English proficiency level?",
    options: [
      { label: "Basic", score: 0 },
      { label: "Intermediate (CLB 5)", score: 10 },
      { label: "Fluent / Native", score: 20 },
    ]
  }
];

export default function SmartAudit() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (points: number) => {
    setScore(score + points);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setStep(0);
    setScore(0);
    setFinished(false);
  };

  // Logic for result
  const getResult = () => {
    if (score >= 80) return { title: "Exceptional Candidate", desc: "Your profile strongly matches the criteria for EB-1A or SUV Direct Stream.", color: "bg-[#CCFF00]" };
    if (score >= 50) return { title: "Strong Potential", desc: "You qualify for standard SUV or UK Innovator paths. Strategy is needed.", color: "bg-white" };
    return { title: "Development Needed", desc: "You may need to bolster your financials or IP before applying.", color: "bg-[#b91c1c] text-white" };
  };

  const result = getResult();

  return (
    <div className="w-full max-w-2xl mx-auto border border-[#1a1a1a] bg-[#F2F0E9] p-8 md:p-12 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-[#1a1a1a]/10 pb-4">
        <h3 className="font-serif text-3xl">Eligibility Audit</h3>
        <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-50">
          {!finished ? `Step 0${step + 1} / 0${questions.length}` : "Analysis Complete"}
        </span>
      </div>

      {!finished ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h4 className="font-serif text-2xl md:text-4xl mb-8 min-h-[100px]">
            {questions[step].text}
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            {questions[step].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.score)}
                className="group flex justify-between items-center p-6 border border-[#1a1a1a]/20 hover:bg-[#1a1a1a] hover:text-[#CCFF00] hover:border-[#1a1a1a] transition-all text-left"
              >
                <span className="font-sans text-sm uppercase tracking-widest font-bold">
                  {opt.label}
                </span>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center animate-in zoom-in-95 duration-500">
           <div className={`inline-block p-4 mb-6 border border-[#1a1a1a] ${result.color === 'bg-[#b91c1c] text-white' ? 'bg-[#b91c1c] text-white' : 'bg-[#CCFF00] text-[#1a1a1a]'}`}>
              {score >= 50 ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
           </div>
           
           <h2 className="font-serif text-4xl md:text-5xl mb-4">{result.title}</h2>
           <p className="font-sans text-[#1a1a1a]/70 mb-10 max-w-md mx-auto leading-relaxed">
             {result.desc}
           </p>

           <div className="flex flex-col gap-4">
             <Link href="/contact" className="bg-[#1a1a1a] text-[#CCFF00] py-4 px-8 font-bold uppercase tracking-widest hover:bg-white hover:text-[#1a1a1a] hover:border-[#1a1a1a] border border-transparent transition-all">
               Book Strategic Consultation
             </Link>
             <button onClick={reset} className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest opacity-50 hover:opacity-100">
               <RefreshCw size={14} /> Restart Audit
             </button>
           </div>
        </div>
      )}
    </div>
  );
}