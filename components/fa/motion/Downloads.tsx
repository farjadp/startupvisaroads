'use client';

// ============================================================================
// components/fa/motion/Downloads.tsx
// The take-away rail: the reports and infographics behind a guide, offered as
// real files.
//
// Two interactions, both earning their keep. The card itself is the download
// target and animates its arrow on hover, so the whole surface is clickable
// rather than a link buried in a paragraph. The second button copies a direct
// link — the request that actually shows up in Telegram is "send me the file",
// and a copyable URL answers it without a re-upload.
//
// Deliberately not a <details> or a filter: with a handful of files, anything
// that hides a title behind a click costs more than it saves.
// ============================================================================
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, Check, FileText, Image as ImageIcon, Link2 } from 'lucide-react';
import type { FaDownload } from '@/lib/fa/content';

const DIR = '/fa/downloads/';

const L = {
  fa: { heading: 'دانلود منابع', download: 'دانلود فایل', copy: 'کپی لینک', copied: 'لینک کپی شد', copyOf: (t: string) => `کپی لینک مستقیم ${t}` },
  en: { heading: 'Downloads', download: 'Download', copy: 'Copy link', copied: 'Link copied', copyOf: (t: string) => `Copy the direct link to ${t}` },
} as const;
type Lang = keyof typeof L;

function Card({ item, lang }: { item: FaDownload; lang: Lang }) {
  const l = L[lang];
  // A Persian file title on the English rail still gets the Persian face.
  const display = lang === 'fa' || /[\u0600-\u06FF]/.test(item.title) ? 'font-estedad' : 'font-serif';
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();
  const href = DIR + item.file;
  const Icon = item.kind === 'image' ? ImageIcon : FileText;

  // navigator.clipboard is absent on http origins and in older browsers; the
  // button just goes quiet rather than throwing at the reader.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(new URL(href, window.location.origin).toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* no clipboard permission — the download link still works */
    }
  };

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-[#F2F0E9] border border-[#1a1a1a]/20 hover:border-[#1a1a1a] transition-colors"
    >
      <a href={href} download className="flex flex-col gap-4 p-7 pb-5 flex-1">
        <div className="flex items-start justify-between gap-4">
          <span className="w-11 h-11 grid place-items-center border border-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-[#CCFF00] transition-colors shrink-0">
            <Icon className="w-5 h-5" aria-hidden />
          </span>
          <motion.span
            aria-hidden
            className="w-11 h-11 grid place-items-center bg-[#1a1a1a] text-[#CCFF00] shrink-0"
            animate={reduced ? undefined : { y: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.span>
        </div>
        <h3 dir="auto" className={`${display} font-bold text-xl leading-snug [text-wrap:balance]`}>{item.title}</h3>
        <p dir="auto" className={`text-[#1a1a1a]/70 flex-1 ${lang === 'fa' ? 'leading-[1.9]' : 'leading-relaxed'}`}>{item.description}</p>
        <ul className="flex flex-wrap gap-2 pt-1">
          {item.meta.map((m) => (
            <li key={m} className="text-sm border border-[#1a1a1a]/25 px-3 py-1 text-[#1a1a1a]/70">{m}</li>
          ))}
        </ul>
      </a>
      <div className="flex border-t border-[#1a1a1a]/20">
        <a href={href} download className={`flex-1 py-4 text-center ${lang === 'fa' ? 'font-estedad' : 'font-sans'} font-bold bg-[#1a1a1a] text-[#F2F0E9] hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors`}>
          {l.download}
        </a>
        <button
          type="button"
          onClick={copy}
          aria-label={l.copyOf(item.title)}
          className="w-16 grid place-items-center border-s border-[#1a1a1a]/20 hover:bg-[#1a1a1a] hover:text-[#CCFF00] transition-colors"
        >
          {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
          <span className="sr-only">{copied ? l.copied : l.copy}</span>
        </button>
      </div>
      <span aria-live="polite" className="sr-only">{copied ? l.copied : ''}</span>
    </motion.div>
  );
}

export default function Downloads({ items, intro, lang = 'fa' }: { items: FaDownload[]; intro?: string; lang?: Lang }) {
  if (items.length === 0) return null;
  return (
    <section id="downloads" className="scroll-mt-28">
      <h2 className={`${lang === 'fa' ? 'font-estedad font-black' : 'font-serif'} text-3xl md:text-4xl mb-4`}>{L[lang].heading}</h2>
      {intro && <p className={`text-lg text-[#1a1a1a]/70 max-w-[70ch] mb-10 ${lang === 'fa' ? 'leading-[1.9]' : 'leading-relaxed'}`}>{intro}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => <Card key={item.file} item={item} lang={lang} />)}
      </div>
    </section>
  );
}
