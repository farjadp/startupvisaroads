'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Mail, MessageSquare, Layers, ArrowLeft, Send, TestTube, Calendar, Users, ChevronDown } from 'lucide-react';

const MarketingEditor = dynamic(() => import('@/components/admin/marketing/MarketingEditor'), { ssr: false });

interface Group {
  id: string;
  name: string;
  color: string;
  _count: { contacts: number };
}

// Email templates
const EMAIL_TEMPLATES = [
  {
    label: 'Blank',
    body: '<p>Write your email content here...</p>',
  },
  {
    label: 'Newsletter',
    body: `<h1>Monthly Newsletter</h1>
<p>Hello,</p>
<p>Here are the latest updates from <strong>Startup Visa Roads</strong>:</p>
<h2>🚀 This Month's Highlights</h2>
<ul>
<li>Update 1</li>
<li>Update 2</li>
<li>Update 3</li>
</ul>
<p>Stay tuned for more updates!</p>
<p>Best regards,<br/>The SVR Team</p>`,
  },
  {
    label: 'Promotional',
    body: `<h1 style="text-align:center">🎉 Special Offer</h1>
<p style="text-align:center">We have an exclusive offer just for you!</p>
<h2>What's included:</h2>
<ul>
<li>✅ Feature 1</li>
<li>✅ Feature 2</li>
<li>✅ Feature 3</li>
</ul>
<p><a href="#">Claim Your Offer →</a></p>`,
  },
  {
    label: 'Webinar Invite',
    body: `<h1>You're Invited! 🎙️</h1>
<p>Join us for an exclusive webinar on startup visa programs.</p>
<p><strong>Date:</strong> [DATE]<br/>
<strong>Time:</strong> [TIME]<br/>
<strong>Location:</strong> Online (Zoom)</p>
<p><a href="#">Register Now →</a></p>
<p>Limited spots available.</p>`,
  },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [type, setType] = useState<'EMAIL' | 'SMS' | 'BOTH'>('EMAIL');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState(EMAIL_TEMPLATES[0].body);
  const [smsBody, setSmsBody] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    fetch('/api/marketing/groups').then((r) => r.json()).then((d) => setGroups(d.groups ?? []));
  }, []);

  const applyTemplate = (idx: number) => {
    setSelectedTemplate(idx);
    setEmailBody(EMAIL_TEMPLATES[idx].body);
  };

  const toggleGroup = (id: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const handleSave = async (sendNow = false) => {
    if (!name) return;
    setSaving(true);
    const res = await fetch('/api/marketing/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        type,
        subject,
        body: emailBody,
        smsBody,
        groupIds: selectedGroupIds,
        scheduledAt: scheduledAt || null,
      }),
    });
    const data = await res.json();
    const id = data.campaign?.id;

    if (sendNow && id) {
      await fetch(`/api/marketing/campaigns/${id}/send`, { method: 'POST' });
    }

    setSaving(false);
    router.push('/en/admin/marketing/campaigns');
  };

  const handleTest = async () => {
    if ((type === 'EMAIL' || type === 'BOTH') && !testEmail) {
      setTestStatus('❌ Please enter a test email.');
      return;
    }
    if ((type === 'SMS' || type === 'BOTH') && !testPhone) {
      setTestStatus('❌ Please enter a test phone.');
      return;
    }

    setTestStatus('Saving and sending test…');

    const draftName = name || 'Test Campaign Draft';
    const draftSubject = subject || draftName;

    // First save draft
    const res = await fetch('/api/marketing/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: `${draftName} [TEST DRAFT]`, 
        type, 
        subject: draftSubject, 
        body: emailBody, 
        smsBody 
      }),
    });
    const data = await res.json();
    const id = data.campaign?.id;
    if (!id) { setTestStatus('❌ Failed to create draft.'); return; }

    const sendRes = await fetch(`/api/marketing/campaigns/${id}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testEmail: testEmail || undefined, testPhone: testPhone || undefined }),
    });
    const sendData = await sendRes.json();

    // Clean up draft
    await fetch('/api/marketing/campaigns', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (sendRes.ok) {
      setTestStatus('✅ Test sent successfully!');
    } else {
      setTestStatus(`❌ ${sendData.error || 'Unknown error'}`);
    }
  };

  const totalContacts = groups
    .filter((g) => selectedGroupIds.includes(g.id))
    .reduce((sum, g) => sum + g._count.contacts, 0);

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl border border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-serif text-4xl text-[#1a1a1a]">New Campaign</h1>
          <p className="font-sans text-[#1a1a1a]/60 text-sm mt-1">Create an email or SMS campaign to send to your contacts.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main editor area */}
        <div className="col-span-2 space-y-6">
          {/* Campaign name */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <label className="block font-sans text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-2">Campaign Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. June Newsletter 2025"
              className="w-full border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 font-bold"
            />
          </div>

          {/* Type selector */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <label className="block font-sans text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-4">Campaign Type</label>
            <div className="grid grid-cols-3 gap-3">
              {([['EMAIL', Mail, 'Send rich HTML emails via Resend'], ['SMS', MessageSquare, 'Send text messages via Twilio'], ['BOTH', Layers, 'Send both email and SMS']] as const).map(([t, Icon, desc]) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${type === t ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' : 'border-[#1a1a1a]/10 hover:border-[#1a1a1a]/20 text-[#1a1a1a]'}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-bold font-sans text-sm">{t}</span>
                  <span className={`text-xs font-sans leading-tight ${type === t ? 'text-white/60' : 'text-[#1a1a1a]/40'}`}>{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email section */}
          {(type === 'EMAIL' || type === 'BOTH') && (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
              <h3 className="font-serif text-xl text-[#1a1a1a]">Email Content</h3>

              {/* Template selector */}
              <div>
                <label className="block font-sans text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-2">Template</label>
                <div className="flex gap-2 flex-wrap">
                  {EMAIL_TEMPLATES.map((t, i) => (
                    <button key={i} type="button" onClick={() => applyTemplate(i)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${selectedTemplate === i ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' : 'border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 text-[#1a1a1a]/70'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-sans text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-2">Subject Line</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)}
                  placeholder="Your email subject…"
                  className="w-full border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20" />
              </div>

              {/* Editor */}
              <div>
                <label className="block font-sans text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-2">Body</label>
                <MarketingEditor content={emailBody} onChange={setEmailBody} minHeight={400} />
              </div>
            </div>
          )}

          {/* SMS section */}
          {(type === 'SMS' || type === 'BOTH') && (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
              <h3 className="font-serif text-xl text-[#1a1a1a]">SMS Content</h3>
              <div>
                <label className="block font-sans text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-2">
                  Message <span className="text-[#1a1a1a]/30 normal-case font-normal">({smsBody.length}/160 chars)</span>
                </label>
                <textarea
                  value={smsBody}
                  onChange={(e) => setSmsBody(e.target.value)}
                  maxLength={320}
                  rows={4}
                  placeholder="Your SMS message text (160 chars = 1 SMS credit)…"
                  className="w-full border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 resize-none"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-[#1a1a1a]/30 font-sans">{Math.ceil(smsBody.length / 160)} SMS credit{Math.ceil(smsBody.length / 160) !== 1 ? 's' : ''}</p>
                  <p className={`text-xs font-sans ${smsBody.length > 160 ? 'text-orange-500' : 'text-[#1a1a1a]/30'}`}>{smsBody.length} / 160</p>
                </div>
              </div>
            </div>
          )}

          {/* Test send */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
            <h3 className="font-serif text-xl text-[#1a1a1a] flex items-center gap-2">
              <TestTube className="w-5 h-5 text-[#1a1a1a]/40" /> Test Send
            </h3>
            <p className="font-sans text-sm text-[#1a1a1a]/50">Send a test to verify everything looks correct before the real send.</p>
            <div className="grid grid-cols-2 gap-4">
              {(type === 'EMAIL' || type === 'BOTH') && (
                <input value={testEmail} onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Test email address"
                  className="border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20" />
              )}
              {(type === 'SMS' || type === 'BOTH') && (
                <input value={testPhone} onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="Test phone (e.g. +14155552671)"
                  className="border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleTest} className="flex items-center gap-2 px-4 py-2.5 border border-[#1a1a1a]/10 bg-white font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/5 transition-colors">
                <TestTube className="w-4 h-4" /> Send Test
              </button>
              {testStatus && <p className="text-sm font-sans text-[#1a1a1a]/70">{testStatus}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Groups */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1a1a1a]/40" /> Target Groups
            </h3>
            {groups.length === 0 ? (
              <p className="text-sm text-[#1a1a1a]/40 font-sans italic">No groups yet. <a href="/en/admin/marketing/groups" className="underline">Create groups →</a></p>
            ) : (
              <div className="space-y-2">
                {groups.map((g) => (
                  <label key={g.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#1a1a1a]/[0.02]">
                    <input type="checkbox" checked={selectedGroupIds.includes(g.id)} onChange={() => toggleGroup(g.id)} className="rounded" />
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                    <span className="font-sans text-sm font-bold text-[#1a1a1a] flex-1">{g.name}</span>
                    <span className="text-xs text-[#1a1a1a]/40">{g._count.contacts}</span>
                  </label>
                ))}
              </div>
            )}
            {totalContacts > 0 && (
              <div className="mt-4 pt-4 border-t border-[#1a1a1a]/5 text-center">
                <p className="text-2xl font-bold font-serif text-[#1a1a1a]">{totalContacts}</p>
                <p className="text-xs text-[#1a1a1a]/40 font-sans">recipients</p>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <button type="button" onClick={() => setShowSchedule(!showSchedule)}
              className="w-full flex items-center justify-between font-serif text-lg">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#1a1a1a]/40" /> Schedule</span>
              <ChevronDown className={`w-4 h-4 text-[#1a1a1a]/40 transition-transform ${showSchedule ? 'rotate-180' : ''}`} />
            </button>
            {showSchedule && (
              <div className="mt-4">
                <label className="block font-sans text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-2">Send at</label>
                <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20" />
                <p className="text-xs text-[#1a1a1a]/30 mt-1 font-sans">Leave empty to send immediately.</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !name}
              className="w-full py-3 border border-[#1a1a1a]/10 bg-white font-bold font-sans text-sm rounded-xl hover:bg-[#1a1a1a]/5 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save as Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !name || selectedGroupIds.length === 0}
              className="w-full py-3 bg-[#1a1a1a] text-white font-bold font-sans text-sm rounded-xl hover:bg-[#1a1a1a]/80 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {saving ? 'Sending…' : `Send to ${totalContacts || '…'} contacts`}
            </button>
            {selectedGroupIds.length === 0 && (
              <p className="text-xs text-center text-[#1a1a1a]/40 font-sans">Select at least one group to send.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
