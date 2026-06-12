'use client';

import React, { useEffect, useState } from 'react';
import { Link2, Twitter, Linkedin, Check } from 'lucide-react';

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-1.5 bg-[#CCFF00] z-50 transition-all duration-100 ease-out" 
      style={{ width: `${scrollProgress}%` }}
    />
  );
}

interface ShareButtonsProps {
  title: string;
  labels: {
    share: string;
    copied: string;
  };
}

export function ShareButtons({ title, labels }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getTwitterUrl = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  };

  const getLinkedinUrl = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  };

  return (
    <div className="flex flex-col gap-3 font-sans">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40">
        {labels.share}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center w-10 h-10 border-2 border-[#1a1a1a] rounded-xl bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00] active:scale-95 transition-all duration-200 relative"
          aria-label="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-[#CCFF00] bg-[#1a1a1a] rounded p-0.5" /> : <Link2 className="w-4 h-4" />}
          {copied && (
            <span className="absolute -top-10 bg-[#1a1a1a] text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-[#1a1a1a] whitespace-nowrap shadow-[2px_2px_0px_0px_#1a1a1a]">
              {labels.copied}
            </span>
          )}
        </button>
        <a
          href={getTwitterUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 border-2 border-[#1a1a1a] rounded-xl bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00] active:scale-95 transition-all duration-200"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </a>
        <a
          href={getLinkedinUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 border-2 border-[#1a1a1a] rounded-xl bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00] active:scale-95 transition-all duration-200"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
