import React from 'react';
import { useApp } from '../../context/AppContext';
import type { AppView } from '../../context/AppContext';
import { Sparkles, Menu, Play, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const { currentView, setCurrentView, generateNew7DayPlan, runSchedulerManual, business } = useApp();

  const viewTitles: Record<AppView, { title: string; subtitle: string }> = {
    landing: { title: 'SocialPilot AI', subtitle: 'AI Social Media Manager' },
    onboarding: { title: 'Business Onboarding', subtitle: 'Setup your business profile' },
    dashboard: { title: 'Dashboard Overview', subtitle: "Monitor today's content and weekly plan performance" },
    calendar: { title: 'Content Calendar', subtitle: 'Manage, edit and approve scheduled social posts' },
    generator: { title: 'AI 7-Day Content Generator', subtitle: 'Create automated tailored social posts' },
    media: { title: 'Media Library', subtitle: 'Manage product images, logos and brand assets' },
    scheduled: { title: 'Scheduled Posts Queue', subtitle: 'View scheduler engine logs and background jobs' },
    analytics: { title: 'Analytics Dashboard', subtitle: 'Track performance metrics and audience engagement' },
    profile: { title: 'Business Profile', subtitle: 'Manage brand identity, tone and audience' },
    social: { title: 'Social Accounts', subtitle: 'Connect Meta Graph API (Instagram & Facebook)' },
    settings: { title: 'Settings', subtitle: 'Environment variables and system configurations' }
  };

  const info = viewTitles[currentView] || { title: 'Dashboard', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            {info.title}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block">
            {info.subtitle}
          </p>
        </div>
      </div>

      {/* Header Quick Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={runSchedulerManual}
          title="Trigger immediate post queue processing"
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-slate-700" />
          <span className="hidden sm:inline">Run Scheduler</span>
        </button>

        <button
          onClick={() => {
            generateNew7DayPlan();
            setCurrentView('generator');
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate 7-Day Plan</span>
        </button>

        {business?.website_url && (
          <a
            href={business.website_url}
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Visit Business Website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </header>
  );
};
