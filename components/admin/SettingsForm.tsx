'use client';

import React, { useState, useTransition } from 'react';
import { saveSettings } from '@/app/actions/settingActions';
import { Eye, EyeOff, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // States for toggling visibility of credentials
  const [showLinkedinToken, setShowLinkedinToken] = useState(false);
  const [showTwitterSecret, setShowTwitterSecret] = useState(false);
  const [showTwitterAccessSecret, setShowTwitterAccessSecret] = useState(false);
  const [showFacebookToken, setShowFacebookToken] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await saveSettings(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(null), 4000); // clear success msg after 4s
      } else {
        setError(res.error || 'Failed to save settings');
      }
    });
  };

  const hasValuePlaceholder = '●●●●●●●●●●●●●●●●';

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-sans text-sm animate-pulse">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Settings updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-sans text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* 1. LinkedIn Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-2xl mb-1 text-[#1a1a1a]">LinkedIn Settings</h3>
          <p className="font-sans text-xs text-[#1a1a1a]/50">Configure credentials for sharing to your personal profile or corporate organization page.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Access Token</label>
            <div className="relative">
              <input
                type={showLinkedinToken ? 'text' : 'password'}
                name="LINKEDIN_ACCESS_TOKEN"
                defaultValue={initialSettings.LINKEDIN_ACCESS_TOKEN ? hasValuePlaceholder : ''}
                placeholder={initialSettings.LINKEDIN_ACCESS_TOKEN ? 'Leave unchanged to keep saved token' : 'e.g. AQW...'}
                className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl pl-4 pr-12 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"
              />
              <button
                type="button"
                onClick={() => setShowLinkedinToken(!showLinkedinToken)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40 hover:text-[#1a1a1a] cursor-pointer"
              >
                {showLinkedinToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Author URN</label>
            <input
              type="text"
              name="LINKEDIN_AUTHOR_URN"
              defaultValue={initialSettings.LINKEDIN_AUTHOR_URN || ''}
              placeholder="e.g. urn:li:organization:12345 or urn:li:person:67890"
              className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"
            />
          </div>
        </div>
      </div>

      {/* 2. Twitter (X) Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-2xl mb-1 text-[#1a1a1a]">Twitter / X Settings</h3>
          <p className="font-sans text-xs text-[#1a1a1a]/50">Use OAuth 1.0a (User Context) keys to tweet from your account without token expiration issues.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">API Key (Consumer Key)</label>
            <input
              type="text"
              name="TWITTER_CONSUMER_KEY"
              defaultValue={initialSettings.TWITTER_CONSUMER_KEY || ''}
              placeholder="e.g. xY12A..."
              className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">API Secret (Consumer Secret)</label>
            <div className="relative">
              <input
                type={showTwitterSecret ? 'text' : 'password'}
                name="TWITTER_CONSUMER_SECRET"
                defaultValue={initialSettings.TWITTER_CONSUMER_SECRET ? hasValuePlaceholder : ''}
                placeholder={initialSettings.TWITTER_CONSUMER_SECRET ? 'Leave unchanged' : 'Secret key...'}
                className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl pl-4 pr-12 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"
              />
              <button
                type="button"
                onClick={() => setShowTwitterSecret(!showTwitterSecret)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40 hover:text-[#1a1a1a] cursor-pointer"
              >
                {showTwitterSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Access Token</label>
            <input
              type="text"
              name="TWITTER_ACCESS_TOKEN"
              defaultValue={initialSettings.TWITTER_ACCESS_TOKEN || ''}
              placeholder="e.g. 12345-abc..."
              className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Access Token Secret</label>
            <div className="relative">
              <input
                type={showTwitterAccessSecret ? 'text' : 'password'}
                name="TWITTER_ACCESS_SECRET"
                defaultValue={initialSettings.TWITTER_ACCESS_SECRET ? hasValuePlaceholder : ''}
                placeholder={initialSettings.TWITTER_ACCESS_SECRET ? 'Leave unchanged' : 'Secret key...'}
                className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl pl-4 pr-12 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"
              />
              <button
                type="button"
                onClick={() => setShowTwitterAccessSecret(!showTwitterAccessSecret)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40 hover:text-[#1a1a1a] cursor-pointer"
              >
                {showTwitterAccessSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Facebook Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-2xl mb-1 text-[#1a1a1a]">Facebook Settings</h3>
          <p className="font-sans text-xs text-[#1a1a1a]/50">Configure credentials for automatic posting to a Facebook Business/Brand Page.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Page Access Token</label>
            <div className="relative">
              <input
                type={showFacebookToken ? 'text' : 'password'}
                name="FACEBOOK_PAGE_ACCESS_TOKEN"
                defaultValue={initialSettings.FACEBOOK_PAGE_ACCESS_TOKEN ? hasValuePlaceholder : ''}
                placeholder={initialSettings.FACEBOOK_PAGE_ACCESS_TOKEN ? 'Leave unchanged' : 'Facebook Page access token...'}
                className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl pl-4 pr-12 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"
              />
              <button
                type="button"
                onClick={() => setShowFacebookToken(!showFacebookToken)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40 hover:text-[#1a1a1a] cursor-pointer"
              >
                {showFacebookToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">Page ID</label>
            <input
              type="text"
              name="FACEBOOK_PAGE_ID"
              defaultValue={initialSettings.FACEBOOK_PAGE_ID || ''}
              placeholder="e.g. 1029384756"
              className="w-full bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"
            />
          </div>
        </div>
      </div>

      {/* 4. Action Button */}
      <div className="flex justify-end">
        <button
          disabled={isPending}
          type="submit"
          className="bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-sans text-sm font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isPending ? 'Saving Settings...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
