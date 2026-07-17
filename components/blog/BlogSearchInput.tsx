'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BlogSearchInput({ placeholder, isRtl }: { placeholder: string; isRtl: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams?.get('q') || '');

  useEffect(() => {
    setQuery(searchParams?.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    params.delete('page'); // reset page on new search
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full md:w-auto md:min-w-[300px] shrink-0">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full py-2 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} border-2 border-[#1a1a1a] bg-transparent rounded-full font-sans text-sm outline-none focus:bg-[#1a1a1a] focus:text-[#F2F0E9] transition-colors`}
      />
      <button type="submit" className={`absolute top-1/2 -translate-y-1/2 text-[#1a1a1a] focus:text-[#CCFF00] ${isRtl ? 'right-3' : 'left-3'}`}>
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
