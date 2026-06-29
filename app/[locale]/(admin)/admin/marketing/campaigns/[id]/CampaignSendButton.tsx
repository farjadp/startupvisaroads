'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader } from 'lucide-react';

export default function CampaignSendButton({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!confirm('Send this campaign to all contacts in the assigned groups?')) return;
    setSending(true);
    setError('');
    const res = await fetch(`/api/marketing/campaigns/${campaignId}/send`, { method: 'POST' });
    const data = await res.json();
    setSending(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError(data.error ?? 'Send failed');
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSend}
        disabled={sending}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/80 disabled:opacity-50 transition-colors"
      >
        {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {sending ? 'Sending…' : 'Send Campaign'}
      </button>
      {error && <p className="text-xs text-red-500 font-sans">{error}</p>}
    </div>
  );
}
