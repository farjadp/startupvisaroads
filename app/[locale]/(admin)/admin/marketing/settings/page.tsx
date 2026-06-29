'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, CheckCircle, Mail, MessageSquare, Shield, Zap } from 'lucide-react';

interface Settings {
  marketing_resend_api_key?: string;
  marketing_twilio_sid?: string;
  marketing_twilio_token?: string;
  marketing_twilio_from?: string;
  marketing_max_emails_per_day?: string;
  marketing_max_sms_per_day?: string;
  marketing_unsubscribe_url?: string;
  marketing_sender_name?: string;
  marketing_sender_email?: string;
}

export default function MarketingSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/marketing/settings')
      .then((r) => r.json())
      .then((d) => { setSettings(d.settings ?? {}); setLoading(false); });
  }, []);

  const set = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/marketing/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleShow = (key: string) => setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const Field = ({
    label, k, placeholder, type = 'text', hint,
  }: { label: string; k: keyof Settings; placeholder?: string; type?: string; hint?: string }) => {
    const isSecret = type === 'password';
    const shown = showKeys[k];
    return (
      <div>
        <label className="block font-sans text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-1.5">{label}</label>
        <div className="relative">
          <input
            type={isSecret && !shown ? 'password' : 'text'}
            value={settings[k] ?? ''}
            onChange={(e) => set(k, e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="w-full border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 disabled:opacity-50 pr-10"
          />
          {isSecret && (
            <button
              type="button"
              onClick={() => toggleShow(k)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 hover:text-[#1a1a1a]"
            >
              {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {hint && <p className="mt-1 text-xs text-[#1a1a1a]/30 font-sans">{hint}</p>}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Marketing Settings</h1>
          <p className="font-sans text-[#1a1a1a]/60">Configure API integrations and send limits.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] text-white font-bold font-sans text-sm rounded-xl hover:bg-[#1a1a1a]/80 disabled:opacity-50 transition-colors"
        >
          {saved
            ? <><CheckCircle className="w-4 h-4 text-[#CCFF00]" /> Saved!</>
            : saving
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
              : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </div>

      <div className="space-y-6">
        {/* Sender defaults */}
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
          <h3 className="font-serif text-xl flex items-center gap-2 text-[#1a1a1a]">
            <Mail className="w-5 h-5 text-[#1a1a1a]/40" /> Sender Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sender Name" k="marketing_sender_name" placeholder="Startup Visa Roads" />
            <Field label="Sender Email" k="marketing_sender_email" placeholder="hello@startupvisaroads.com"
              hint="Must be verified in your Resend domain settings." />
          </div>
          <Field label="Unsubscribe URL" k="marketing_unsubscribe_url" placeholder="https://yourdomain.com/unsubscribe"
            hint="Added automatically to the footer of every email." />
        </div>

        {/* Resend */}
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl flex items-center gap-2 text-[#1a1a1a]">
              <Mail className="w-5 h-5 text-blue-500" /> Resend (Email)
            </h3>
            <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline font-sans">Get API key →</a>
          </div>
          <Field
            label="Resend API Key"
            k="marketing_resend_api_key"
            placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            type="password"
            hint="Found in your Resend dashboard under API Keys."
          />
        </div>

        {/* Twilio */}
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl flex items-center gap-2 text-[#1a1a1a]">
              <MessageSquare className="w-5 h-5 text-red-500" /> Twilio (SMS)
            </h3>
            <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer"
              className="text-xs text-red-500 hover:underline font-sans">Twilio Console →</a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Account SID" k="marketing_twilio_sid" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" type="password" />
            <Field label="Auth Token" k="marketing_twilio_token" placeholder="your_auth_token" type="password" />
          </div>
          <Field
            label="From Number"
            k="marketing_twilio_from"
            placeholder="+14155552671"
            hint="Must be a Twilio phone number in E.164 format."
          />
        </div>

        {/* Rate Limits */}
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
          <h3 className="font-serif text-xl flex items-center gap-2 text-[#1a1a1a]">
            <Zap className="w-5 h-5 text-yellow-500" /> Rate Limits
          </h3>
          <p className="text-sm text-[#1a1a1a]/50 font-sans">
            These limits protect you from accidental over-sending and help stay within your API plan quotas.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Max Emails / Day"
              k="marketing_max_emails_per_day"
              placeholder="500"
              hint="Resend free plan: 100/day. Paid: up to 50,000/month."
            />
            <Field
              label="Max SMS / Day"
              k="marketing_max_sms_per_day"
              placeholder="100"
              hint="Based on your Twilio balance and plan."
            />
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="font-sans text-sm text-amber-800">
            <p className="font-bold mb-1">Security Notice</p>
            <p>API keys are stored in your database settings table and are only accessible to authenticated admins. For production, consider using environment variables instead.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
