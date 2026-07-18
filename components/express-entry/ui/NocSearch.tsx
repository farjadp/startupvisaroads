// ============================================================================
// Express Entry — NOC Code Search Component
// /components/express-entry/ui/NocSearch.tsx
// Searchable combobox for NOC 2021 codes.
// ============================================================================
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import nocConfig from '../../../config/noc-codes.json';

type NocEntry = { code: string; title: string; titleFa?: string; teer: number; categories: string[] };

const ALL_NOCS: NocEntry[] = nocConfig.codes as NocEntry[];

interface NocSearchProps {
  value: string;
  onChange: (code: string) => void;
  locale: string;
  label: string;
  placeholder?: string;
  id: string;
}

export default function NocSearch({ value, onChange, locale, label, placeholder, id }: NocSearchProps) {
  const isRtl = locale === 'fa';
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = ALL_NOCS.find((n) => n.code === value);

  const filtered = query.length >= 1
    ? ALL_NOCS.filter((n) => {
        const q = query.toLowerCase();
        return (
          n.code.includes(q) ||
          n.title.toLowerCase().includes(q) ||
          (n.titleFa && n.titleFa.includes(query))
        );
      }).slice(0, 20)
    : ALL_NOCS.slice(0, 20);

  const selectNoc = useCallback((code: string) => {
    onChange(code);
    setQuery('');
    setOpen(false);
  }, [onChange]);

  const clear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
    setOpen(false);
  }, [onChange]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocused((f) => Math.min(f + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocused((f) => Math.max(f - 1, 0));
    } else if (e.key === 'Enter' && focused >= 0 && filtered[focused]) {
      e.preventDefault();
      selectNoc(filtered[focused].code);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (focused >= 0 && listRef.current) {
      const item = listRef.current.children[focused] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [focused]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = inputRef.current?.closest('[data-noc-search]');
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const teerBadge = (teer: number) => {
    const colors: Record<number, string> = {
      0: 'bg-acid text-ink',
      1: 'bg-ink/10 text-ink',
      2: 'bg-ink/10 text-ink',
      3: 'bg-ink/5 text-ink/60',
      4: 'bg-ink/5 text-ink/60',
      5: 'bg-ink/5 text-ink/60',
    };
    return (
      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${colors[teer] ?? 'bg-ink/5'}`}>
        TEER {teer}
      </span>
    );
  };

  return (
    <div className="space-y-1.5" data-noc-search="" dir={isRtl ? 'rtl' : 'ltr'}>
      <label htmlFor={id} className="block text-sm font-sans font-medium text-ink">
        {label}
      </label>

      <div className="relative">
        {/* Trigger / display */}
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="w-full flex items-center gap-2 px-4 py-3 border border-ink/20 bg-paper text-start hover:border-ink/40 transition-colors focus:outline-none focus:border-ink"
        >
          <Search size={14} className="text-ink/40 shrink-0" />
          <span className={`flex-1 text-sm truncate ${selected ? 'text-ink' : 'text-ink/40'}`}>
            {selected
              ? `${selected.code} — ${isRtl && selected.titleFa ? selected.titleFa : selected.title}`
              : (placeholder ?? (isRtl ? 'جستجوی کد NOC...' : 'Search NOC code or title...'))}
          </span>
          {selected ? (
            <button
              type="button"
              onClick={clear}
              className="text-ink/30 hover:text-ink transition-colors"
              aria-label={isRtl ? 'پاک کردن' : 'Clear selection'}
            >
              <X size={14} />
            </button>
          ) : (
            <ChevronDown size={14} className={`text-ink/40 transition-transform ${open ? 'rotate-180' : ''}`} />
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-30 top-full mt-1 w-full bg-paper border border-ink/20 shadow-xl max-h-72 flex flex-col">
            {/* Search input */}
            <div className="p-2 border-b border-ink/10">
              <div className="relative">
                <Search size={12} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setFocused(-1); }}
                  onKeyDown={handleKeyDown}
                  placeholder={isRtl ? 'جستجو...' : 'Search...'}
                  className="w-full ps-7 pe-3 py-1.5 text-sm bg-ink/5 border border-transparent focus:border-ink/20 focus:outline-none placeholder:text-ink/30 font-sans"
                  aria-label={isRtl ? 'جستجوی NOC' : 'Search NOC codes'}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Results */}
            <ul
              ref={listRef}
              role="listbox"
              className="overflow-y-auto flex-1"
              aria-label={isRtl ? 'نتایج جستجو' : 'Search results'}
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-ink/40 font-sans">
                  {isRtl ? 'نتیجه‌ای یافت نشد' : 'No results found'}
                </li>
              ) : (
                filtered.map((noc, i) => (
                  <li
                    key={noc.code}
                    role="option"
                    aria-selected={noc.code === value}
                    onClick={() => selectNoc(noc.code)}
                    className={`px-4 py-2.5 cursor-pointer flex items-start gap-3 transition-colors text-sm ${
                      i === focused ? 'bg-acid/30' : noc.code === value ? 'bg-ink/5' : 'hover:bg-ink/[0.03]'
                    }`}
                  >
                    <span className="font-mono text-xs text-ink/60 shrink-0 pt-0.5">{noc.code}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium text-ink truncate">
                        {isRtl && noc.titleFa ? noc.titleFa : noc.title}
                      </span>
                    </span>
                    {teerBadge(noc.teer)}
                  </li>
                ))
              )}
            </ul>

            {/* Footer note */}
            <div className="border-t border-ink/10 px-3 py-1.5">
              <p className="text-[10px] text-ink/30 font-sans">
                {isRtl
                  ? `نمایش ${filtered.length} از ${ALL_NOCS.length} کد NOC | NOC 2021`
                  : `Showing ${filtered.length} of ${ALL_NOCS.length} NOC codes | NOC 2021`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
