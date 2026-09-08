import React from 'react';
import { Settings, Database } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabase';

export const SettingsView: React.FC = () => {
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings & Environment</h2>
            <p className="text-xs text-slate-500">View database connectivity, environment variable configurations, and storage</p>
          </div>
        </div>
      </div>

      {/* Supabase Status Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900">Supabase Backend Status</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            supabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {supabaseConfigured ? 'Connected (Production)' : 'Local Persistence Engine'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans mb-1">Supabase URL</span>
            <span className="text-slate-800 truncate block">
              {import.meta.env.VITE_SUPABASE_URL || 'Not configured (Using Local Engine)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans mb-1">Supabase Anon Key</span>
            <span className="text-slate-800 truncate block">
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••••••••••' : 'Not configured'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2 font-sans">
          <h4 className="font-bold text-slate-900 text-sm">Environment Variables Guide</h4>
          <p>
            Create a <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-indigo-700">.env</code> file in your project root with the following keys:
          </p>
          <pre className="p-3 bg-slate-900 text-indigo-300 rounded-xl font-mono text-[11px] overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_META_APP_ID=your-meta-app-id
VITE_META_APP_SECRET=your-meta-app-secret
VITE_META_ACCESS_TOKEN=your-meta-access-token`}
          </pre>
        </div>
      </div>
    </div>
  );
};
