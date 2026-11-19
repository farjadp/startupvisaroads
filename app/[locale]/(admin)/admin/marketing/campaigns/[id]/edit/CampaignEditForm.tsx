'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Loader, Save, TestTube } from 'lucide-react';

const MarketingEditor = dynamic(() => import('@/components/admin/marketing/MarketingEditor'), { ssr: false });

interface EditableCampaign {
  id: string;
  name: string;
  type: string;
  subject: string;
  body: string;
  smsBody: string;
  contentVersion: number;
}

const cardCls = 'bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6';
const labelCls = 'block font-sans text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-2';
const inputCls = 'w-full border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20';

export default function CampaignEditForm({
  campaign,
  alreadyLogged,
  backHref,
}: {
  campaign: EditableCampaign;
  alreadyLogged: number;
  backHref: string;
}) {
  const hasEmail = campaign.type === 'EMAIL' || campaign.type === 'BOTH';
  const hasSms = campaign.type === 'SMS' || campaign.type === 'BOTH';

  const [saved, setSaved] = useState(campaign);
  const [name, setName] = useState(campaign.name);
  const [subject, setSubject] = useState(campaign.subject);
  const [body, setBody] = useState(campaign.body);
  const [smsBody, setSmsBody] = useState(campaign.smsBody);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [testTo, setTestTo] = useState('');
  const [testStatus, setTestStatus] = useState('');

  const dirty = name !== saved.name || subject !== saved.subject || body !== saved.body || smsBody !== saved.smsBody;

  const save = async () => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch(`/api/marketing/campaigns/${campaign.id}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, body, smsBody, expectedVersion: saved.contentVersion }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Could not save.');
        return;
      }
      setSaved({ ...saved, name, subject, body, smsBody, contentVersion: data.contentVersion });
      setNotice(data.versioned ? `Saved as version ${data.contentVersion}.` : 'Saved.');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  };

  const sendTest = async () => {
    setTestStatus('Sending…');
    try {
      const res = await fetch(`/api/marketing/campaigns/${campaign.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hasEmail ? { testEmail: testTo.trim() } : { testPhone: testTo.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      setTestStatus(res.ok ? 'Test sent.' : data.error ?? 'The test failed.');
    } catch {
      setTestStatus('Could not reach the server.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {alreadyLogged > 0 && (
        <p className="p-4 rounded-xl bg-blue-50 text-blue-900 font-sans text-sm">
          {alreadyLogged.toLocaleString('en-CA')} people already have a send record and keep the version they received. Your changes go only to the people still in the queue.
        </p>
      )}

      <div className={cardCls}>
        <label htmlFor="edit-name" className={labelCls}>Campaign name</label>
        <input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      </div>

      {hasEmail && (
        <div className={`${cardCls} space-y-4`}>
          <div>
            <label htmlFor="edit-subject" className={labelCls}>Subject line</label>
            <input id="edit-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} />
          </div>
          <div>
            <p className={labelCls}>Body</p>
            <MarketingEditor content={body} onChange={setBody} minHeight={400} />
          </div>
        </div>
      )}

      {hasSms && (
        <div className={cardCls}>
          <label htmlFor="edit-sms" className={labelCls}>SMS message</label>
          <textarea id="edit-sms" value={smsBody} onChange={(e) => setSmsBody(e.target.value)} maxLength={320} rows={4} className={`${inputCls} resize-none`} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy || !dirty}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/80 disabled:opacity-50 transition-colors"
        >
          {busy ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save changes
        </button>
        <Link href={backHref} className="px-5 py-2.5 border border-[#1a1a1a]/10 bg-white font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/5 transition-colors">
          Back to campaign
        </Link>
        {notice && <p className="font-sans text-sm text-green-700" role="status">{notice}</p>}
        {error && <p className="font-sans text-sm text-red-600" role="alert">{error}</p>}
      </div>

      <div className={`${cardCls} space-y-3`}>
        <h2 className="font-serif text-lg text-[#1a1a1a] flex items-center gap-2">
          <TestTube className="w-4 h-4 text-[#1a1a1a]/40" /> Send a test of the saved version
        </h2>
        <div className="flex flex-wrap gap-3">
          <label htmlFor="edit-test" className="sr-only">Test recipient</label>
          <input
            id="edit-test"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            placeholder={hasEmail ? 'Test email address' : 'Test phone number'}
            className={`${inputCls} flex-1 min-w-56`}
          />
          <button
            type="button"
            onClick={sendTest}
            disabled={dirty || !testTo.trim()}
            className="px-5 py-2.5 border border-[#1a1a1a]/10 bg-white font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/5 disabled:opacity-50 transition-colors"
          >
            Send test
          </button>
        </div>
        {dirty && <p className="font-sans text-xs text-[#1a1a1a]/50">Save your changes first.</p>}
        {testStatus && <p className="font-sans text-sm text-[#1a1a1a]/70" role="status">{testStatus}</p>}
      </div>
    </div>
  );
}
