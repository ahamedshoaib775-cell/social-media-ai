import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, CheckCircle2, AlertTriangle, Key, ExternalLink, Save } from 'lucide-react';
import { getMetaCredentials, saveMetaCredentials, validateMetaConnection } from '../../services/metaApi';
import type { MetaConnectionState } from '../../services/metaApi';

export const SocialAccountsView: React.FC = () => {
  const { socialAccounts, updateSocialAccount, addToast } = useApp();
  const [creds, setCreds] = useState<MetaConnectionState>(getMetaCredentials());

  const validation = validateMetaConnection(creds);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedState = { ...creds, isConnected: true };
    saveMetaCredentials(updatedState);
    setCreds(updatedState);

    // Update social account statuses in app state
    socialAccounts.forEach(acc => {
      updateSocialAccount(acc.id, { is_connected: true });
    });

    addToast('success', 'Meta Graph API credentials saved successfully!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Social Accounts & Meta Graph API</h2>
            <p className="text-xs text-slate-500">Connect Instagram Business Accounts and Facebook Pages via Meta Developer App</p>
          </div>
        </div>

        <a
          href="https://developers.facebook.com/"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
        >
          <span>Meta Developer Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* API Connection Diagnostics Banner */}
      {!validation.valid ? (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col gap-3">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-extrabold text-amber-950 text-sm">Meta API Setup Guide for Live Automated Publishing</h4>
              <p className="leading-relaxed text-amber-900">
                {validation.reason}
              </p>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-amber-200/70 text-xs space-y-2">
            <p className="font-bold text-amber-950">How to get your Meta Access Token with required permissions:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-amber-900 font-medium pl-1">
              <li>Open <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer" className="underline font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1">Meta Graph API Explorer <ExternalLink className="w-3 h-3"/></a></li>
              <li>Select your Meta Developer App in the top dropdown</li>
              <li>Under <strong>Permissions</strong>, search and select:
                <div className="flex flex-wrap gap-1.5 my-1 font-mono text-[11px]">
                  <span className="bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-md font-bold">instagram_basic</span>
                  <span className="bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-md font-bold">instagram_content_publish</span>
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">pages_show_list</span>
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">pages_read_engagement</span>
                </div>
              </li>
              <li>Click <strong>Generate Access Token</strong> and authorize your Instagram Business Account</li>
              <li>Copy the token and paste it into the form below!</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-4 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            Meta Graph API Credentials Active! Instagram permissions <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">instagram_basic</code> & <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">instagram_content_publish</code> are authorized for automated publishing.
          </div>
        </div>
      )}

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instagram Account Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold">
                IG
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Instagram Business Account</h4>
                <p className="text-xs text-slate-500">Official Content Publishing API</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
              creds.instagramBusinessAccountId || creds.userAccessToken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {creds.instagramBusinessAccountId || creds.userAccessToken ? 'Connected' : 'Setup Required'}
            </span>
          </div>

          <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Account ID:</span>
              <span className="font-mono text-slate-800">{creds.instagramBusinessAccountId || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Permissions Required:</span>
              <span className="font-mono text-indigo-600 font-semibold">instagram_basic, instagram_content_publish</span>
            </div>
          </div>
        </div>

        {/* Facebook Page Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                FB
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Facebook Page</h4>
                <p className="text-xs text-slate-500">Page Feed & Media API</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
              creds.pageId || creds.userAccessToken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {creds.pageId || creds.userAccessToken ? 'Connected' : 'Setup Required'}
            </span>
          </div>

          <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Page ID:</span>
              <span className="font-mono text-slate-800">{creds.pageId || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Permissions Required:</span>
              <span className="font-mono text-blue-600 font-semibold">pages_manage_posts, pages_read_engagement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meta API Credentials Form */}
      <form onSubmit={handleSaveCredentials} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-4">
          <Key className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-extrabold">Meta Graph API Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Meta App ID
            </label>
            <input
              type="text"
              placeholder="e.g. 1029384756"
              value={creds.appId}
              onChange={e => setCreds({ ...creds, appId: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Meta App Secret
            </label>
            <input
              type="password"
              placeholder="••••••••••••••••"
              value={creds.appSecret}
              onChange={e => setCreds({ ...creds, appSecret: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Meta Graph User Access Token *
          </label>
          <input
            type="password"
            placeholder="EAABwz..."
            value={creds.userAccessToken}
            onChange={e => setCreds({ ...creds, userAccessToken: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Generate a Page Access Token with <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">instagram_content_publish</code> permission in Meta Graph API Explorer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Facebook Page ID
            </label>
            <input
              type="text"
              placeholder="e.g. 10492837482"
              value={creds.pageId}
              onChange={e => setCreds({ ...creds, pageId: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Instagram Business Account ID
            </label>
            <input
              type="text"
              placeholder="e.g. 178414001928"
              value={creds.instagramBusinessAccountId}
              onChange={e => setCreds({ ...creds, instagramBusinessAccountId: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Meta Credentials
          </button>
        </div>
      </form>
    </div>
  );
};
