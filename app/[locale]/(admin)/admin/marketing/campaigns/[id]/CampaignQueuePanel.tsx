'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Loader, Pause, Pencil, Play, Send } from 'lucide-react';

export interface QueuePanelSummary {
  state: string;
  sent: number;
  failed: number;
  unconfirmed: number;
  remaining: number;
  nextSendAt: string | null;
  estimatedFinish: string | null;
  pausedReason: string | null;
  contentVersion: number;
  onEarlierVersions: number;
  sender: string;
  senderIsFallback: boolean;
  settings: {
    dailyLimit: number | null;
    sendDays: number[];
    windowStart: string | null;
    windowEnd: string | null;
  };
}

interface Preview {
  remaining: number;
  dailyLimit: number;
  sendDays: number[];
  windowStart: string | null;
  windowEnd: string | null;
  firstSendAt: string | null;
  estimatedFinish: string | null;
  sender: string;
  senderIsFallback: boolean;
  highVolume: boolean;
}

const DAYS = [
  [1, 'Mon'],
  [2, 'Tue'],
  [3, 'Wed'],
  [4, 'Thu'],
  [5, 'Fri'],
  [6, 'Sat'],
  [7, 'Sun'],
] as const;

const STATE_COPY: Record<string, { title: string; body: string; cls: string }> = {
  DRAFT: { title: 'Not sent', body: 'Set a daily limit to put this campaign in the queue.', cls: 'bg-[#1a1a1a]/5 text-[#1a1a1a]/60' },
  SCHEDULED: { title: 'Not sent', body: 'Set a daily limit to put this campaign in the queue.', cls: 'bg-yellow-100 text-yellow-700' },
  QUEUED: { title: 'Queued', body: 'Sending in small batches on the schedule below.', cls: 'bg-blue-100 text-blue-700' },
  PAUSED: { title: 'Paused', body: 'Nothing is being sent. Resume to continue with the people left.', cls: 'bg-orange-100 text-orange-700' },
  INTERRUPTED: {
    title: 'Interrupted',
    body: 'This send stopped when the server restarted. Nothing more goes out until you set a daily limit and resume. People who already have a log are skipped.',
    cls: 'bg-red-100 text-red-700',
  },
  DONE: { title: 'Done', body: 'Everyone in the audience has been handled.', cls: 'bg-green-100 text-green-700' },
  FAILED: { title: 'Failed', body: 'The earlier send failed.', cls: 'bg-red-100 text-red-700' },
};

const inputCls =
  'w-full border border-[#1a1a1a]/10 rounded-xl px-4 py-2.5 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20';
const labelCls = 'block font-sans text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-2';
const primaryCls =
  'flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/80 disabled:opacity-50 transition-colors';
const secondaryCls =
  'flex items-center justify-center gap-2 px-5 py-2.5 border border-[#1a1a1a]/10 bg-white font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/5 disabled:opacity-50 transition-colors';

const formatMoment = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Toronto',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).format(new Date(iso))
    : '—';

const formatDay = (day: string | null) =>
  day
    ? new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(
        new Date(`${day}T12:00:00Z`),
      )
    : '—';

const dayNames = (days: number[]) => DAYS.filter(([d]) => days.includes(d)).map(([, name]) => name).join(', ');

export default function CampaignQueuePanel({ campaignId, summary }: { campaignId: string; summary: QueuePanelSummary }) {
  const router = useRouter();
  const saved = summary.settings;
  const [dailyLimit, setDailyLimit] = useState(saved.dailyLimit ? String(saved.dailyLimit) : '');
  const [sendDays, setSendDays] = useState<number[]>(saved.sendDays.length ? saved.sendDays : [1, 2, 3, 4]);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [useWindow, setUseWindow] = useState(summary.state === 'DRAFT' || summary.state === 'SCHEDULED' || !!saved.windowStart || saved.dailyLimit === null);
  const [windowStart, setWindowStart] = useState(saved.windowStart ?? '09:00');
  const [windowEnd, setWindowEnd] = useState(saved.windowEnd ?? '17:00');
  const [acknowledged, setAcknowledged] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const copy = STATE_COPY[summary.state] ?? STATE_COPY.DRAFT;
  const canQueue = ['DRAFT', 'SCHEDULED', 'PAUSED', 'INTERRUPTED'].includes(summary.state);
  const isResume = summary.state === 'PAUSED' || summary.state === 'INTERRUPTED';
  const limitNumber = Number(dailyLimit);
  const overWarmLimit = limitNumber > 50;

  const call = async (body: Record<string, unknown>) => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/marketing/campaigns/${campaignId}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'The request failed.');
        return null;
      }
      return data;
    } catch {
      setError('Could not reach the server.');
      return null;
    } finally {
      setBusy(false);
    }
  };

  const settingsBody = () => ({
    dailyLimit: dailyLimit.trim() === '' ? undefined : limitNumber,
    sendDays,
    startDate: startDate || null,
    startTime: startTime || null,
    windowStart: useWindow ? windowStart : null,
    windowEnd: useWindow ? windowEnd : null,
  });

  const review = async () => {
    const data = await call({ action: 'preview', ...settingsBody() });
    if (data) setPreview(data.preview);
  };

  const confirm = async () => {
    if (!preview) return;
    const data = await call({
      action: 'queue',
      ...settingsBody(),
      confirm: true,
      expectedRemaining: preview.remaining,
      acknowledgeHighVolume: acknowledged,
    });
    if (data) {
      setPreview(null);
      router.refresh();
    } else {
      setPreview(null);
    }
  };

  const pause = async () => {
    if (await call({ action: 'pause' })) router.refresh();
  };

  const toggleDay = (day: number) =>
    setSendDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)));

  const stats: Array<[string, string | number]> = [
    ['Sent', summary.sent.toLocaleString('en-CA')],
    ['Remaining', summary.remaining.toLocaleString('en-CA')],
    ['Failed', summary.failed.toLocaleString('en-CA')],
    ...(summary.unconfirmed > 0 ? ([['Unconfirmed', summary.unconfirmed.toLocaleString('en-CA')]] as Array<[string, string]>) : []),
    ...(summary.state === 'QUEUED'
      ? ([
          ['Next send', formatMoment(summary.nextSendAt)],
          ['Estimated finish', formatDay(summary.estimatedFinish)],
        ] as Array<[string, string]>)
      : []),
  ];

  return (
    <section className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 mb-8" aria-label="Sending">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-serif text-xl text-[#1a1a1a]">Sending</h2>
            <span className={`text-xs px-2 py-1 rounded-full font-bold ${copy.cls}`}>{copy.title}</span>
          </div>
          <p className="font-sans text-sm text-[#1a1a1a]/60">{copy.body}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {canQueue && (
            <Link href={`/en/admin/marketing/campaigns/${campaignId}/edit`} className={secondaryCls}>
              <Pencil className="w-4 h-4" /> Edit email
            </Link>
          )}
          {summary.state === 'QUEUED' && (
            <button type="button" onClick={pause} disabled={busy} className={secondaryCls}>
              {busy ? <Loader className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4" />} Pause
            </button>
          )}
        </div>
      </div>

      {summary.state === 'QUEUED' && (
        <p className="font-sans text-xs text-[#1a1a1a]/50 mt-2">To change the email for the people left, pause first.</p>
      )}
      {summary.contentVersion > 1 && (
        <p className="font-sans text-sm text-[#1a1a1a]/70 mt-2">
          Version {summary.contentVersion} goes to everyone still in the queue. {summary.onEarlierVersions.toLocaleString('en-CA')} people have an earlier version.
        </p>
      )}

      <dl className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-5">
        {stats.map(([label, value]) => (
          <div key={label}>
            <dt className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40">{label}</dt>
            <dd className="font-sans text-lg font-bold text-[#1a1a1a] mt-0.5">{value}</dd>
          </div>
        ))}
      </dl>

      {summary.unconfirmed > 0 && (
        <p className="font-sans text-xs text-[#1a1a1a]/50 mt-3">
          Unconfirmed means the worker stopped between claiming and finishing a send. These people are not sent to again.
        </p>
      )}

      {summary.state === 'PAUSED' && summary.pausedReason && (
        <p className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-red-50 text-red-700 font-sans text-sm" role="alert">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {summary.pausedReason}
        </p>
      )}

      {canQueue && !preview && (
        <div className="mt-6 pt-6 border-t border-[#1a1a1a]/5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="queue-limit" className={labelCls}>Sends per day</label>
              <input
                id="queue-limit"
                type="number"
                min={1}
                max={500}
                required
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                placeholder="20"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="queue-date" className={labelCls}>Start date</label>
              <input id="queue-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="queue-time" className={labelCls}>Start time</label>
              <input id="queue-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputCls} />
            </div>
          </div>

          <fieldset>
            <legend className={labelCls}>Send days</legend>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(([day, name]) => (
                <button
                  key={day}
                  type="button"
                  aria-pressed={sendDays.includes(day)}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    sendDays.includes(day)
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                      : 'border-[#1a1a1a]/10 text-[#1a1a1a]/70 hover:bg-[#1a1a1a]/5'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="flex items-center gap-2 font-sans text-sm font-bold text-[#1a1a1a] mb-3">
              <input type="checkbox" checked={useWindow} onChange={(e) => setUseWindow(e.target.checked)} className="rounded" />
              Only send between these hours
            </label>
            {useWindow && (
              <div className="grid grid-cols-2 gap-5 md:max-w-sm">
                <div>
                  <label htmlFor="queue-from" className={labelCls}>From</label>
                  <input id="queue-from" type="time" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="queue-to" className={labelCls}>To</label>
                  <input id="queue-to" type="time" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} className={inputCls} />
                </div>
              </div>
            )}
            <p className="font-sans text-xs text-[#1a1a1a]/40 mt-2">All dates and times are Toronto time.</p>
          </div>

          {overWarmLimit && (
            <label className="flex items-start gap-2 p-3 rounded-xl bg-orange-50 text-orange-800 font-sans text-sm">
              <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-0.5 rounded" />
              More than 50 a day on a domain that is not warmed up can land the whole campaign in spam. Send this many anyway.
            </label>
          )}

          <button
            type="button"
            onClick={review}
            disabled={busy || dailyLimit.trim() === '' || sendDays.length === 0 || (overWarmLimit && !acknowledged)}
            className={primaryCls}
          >
            {busy ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Review before sending
          </button>
        </div>
      )}

      {canQueue && preview && (
        <div className="mt-6 pt-6 border-t border-[#1a1a1a]/5">
          <h3 className="font-serif text-lg text-[#1a1a1a] mb-3">{isResume ? 'Confirm resume' : 'Confirm send'}</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 font-sans text-sm mb-5">
            {[
              ['Recipients remaining', preview.remaining.toLocaleString('en-CA')],
              ['Per day', preview.dailyLimit.toLocaleString('en-CA')],
              ['Send days', dayNames(preview.sendDays)],
              ['Hours (Toronto)', preview.windowStart ? `${preview.windowStart} to ${preview.windowEnd}` : 'All day'],
              ['First send', formatMoment(preview.firstSendAt)],
              ['Estimated finish', formatDay(preview.estimatedFinish)],
              ['Sender', preview.sender],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-1 border-b border-[#1a1a1a]/5">
                <dt className="text-[#1a1a1a]/50">{label}</dt>
                <dd className="font-bold text-[#1a1a1a] text-right break-all">{value}</dd>
              </div>
            ))}
          </dl>
          {preview.senderIsFallback && (
            <p className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-orange-50 text-orange-800 font-sans text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              No sender address is set in Marketing Settings, so this fallback address would be used.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={confirm} disabled={busy} className={primaryCls}>
              {busy ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {preview.remaining === 0 ? 'Close campaign' : isResume ? 'Resume sending' : 'Start sending'}
            </button>
            <button type="button" onClick={() => setPreview(null)} disabled={busy} className={secondaryCls}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>
      )}

      {error && <p className="font-sans text-sm text-red-600 mt-4" role="alert">{error}</p>}
    </section>
  );
}
