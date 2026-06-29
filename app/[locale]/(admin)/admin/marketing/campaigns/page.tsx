'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Copy, CheckCircle, XCircle, Clock, Loader, Send, Eye } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  subject: string | null;
  sentAt: string | null;
  createdAt: string;
  _count: { logs: number };
  groups: Array<{ group: { id: string; name: string; color: string } }>;
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; cls: string }> = {
  DRAFT: { icon: <div className="w-3 h-3 rounded-full border-2 border-current" />, cls: 'bg-[#1a1a1a]/5 text-[#1a1a1a]/60' },
  SCHEDULED: { icon: <Clock className="w-3 h-3" />, cls: 'bg-yellow-100 text-yellow-700' },
  SENDING: { icon: <Loader className="w-3 h-3 animate-spin" />, cls: 'bg-blue-100 text-blue-700' },
  DONE: { icon: <CheckCircle className="w-3 h-3" />, cls: 'bg-green-100 text-green-700' },
  FAILED: { icon: <XCircle className="w-3 h-3" />, cls: 'bg-red-100 text-red-700' },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/marketing/campaigns');
    const data = await res.json();
    setCampaigns(data.campaigns ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete campaign "${name}"? This will also delete all send logs.`)) return;
    await fetch('/api/marketing/campaigns', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const handleDuplicate = async (c: Campaign) => {
    await fetch('/api/marketing/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${c.name} (Copy)`,
        type: c.type,
        subject: c.subject,
        groupIds: c.groups.map((cg) => cg.group.id),
      }),
    });
    load();
  };

  const sc = (status: string) => STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Campaigns</h1>
          <p className="font-sans text-[#1a1a1a]/60">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/en/admin/marketing/campaigns/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Campaign
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#1a1a1a]/5 p-6 h-24 animate-pulse" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-[#1a1a1a]/30" />
          </div>
          <p className="font-serif text-xl text-[#1a1a1a]/50">No campaigns yet</p>
          <p className="font-sans text-sm text-[#1a1a1a]/30 mt-1 mb-6">Create your first campaign to start marketing.</p>
          <Link href="/en/admin/marketing/campaigns/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/80 transition-colors">
            <Plus className="w-4 h-4" /> Create Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => {
            const s = sc(c.status);
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 flex items-center gap-6 hover:border-[#1a1a1a]/10 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Link href={`/en/admin/marketing/campaigns/${c.id}`}
                      className="font-bold font-sans text-[#1a1a1a] text-lg hover:underline truncate">
                      {c.name}
                    </Link>
                    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap ${s.cls}`}>
                      {s.icon} {c.status}
                    </span>
                    <span className="text-xs px-2 py-1 rounded font-bold bg-[#1a1a1a]/5 text-[#1a1a1a]/60 whitespace-nowrap">
                      {c.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#1a1a1a]/40 font-sans">
                    {c.subject && <span>Subject: {c.subject}</span>}
                    {c.groups.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        Groups:{' '}
                        {c.groups.map((cg) => (
                          <span key={cg.group.id} className="px-1.5 py-0.5 rounded-full text-white text-[10px] font-bold"
                            style={{ backgroundColor: cg.group.color }}>
                            {cg.group.name}
                          </span>
                        ))}
                      </span>
                    )}
                    {c.sentAt && <span>Sent {new Date(c.sentAt).toLocaleDateString()}</span>}
                    {!c.sentAt && <span>Created {new Date(c.createdAt).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="text-right mr-4">
                    <p className="text-2xl font-bold font-serif text-[#1a1a1a]">{c._count.logs}</p>
                    <p className="text-xs text-[#1a1a1a]/40 font-sans">sent</p>
                  </div>
                  <Link href={`/en/admin/marketing/campaigns/${c.id}`}
                    className="p-2 rounded-xl border border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 transition-colors" title="View Report">
                    <Eye className="w-4 h-4 text-[#1a1a1a]/60" />
                  </Link>
                  <button onClick={() => handleDuplicate(c)}
                    className="p-2 rounded-xl border border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 transition-colors" title="Duplicate">
                    <Copy className="w-4 h-4 text-[#1a1a1a]/60" />
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)}
                    className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
