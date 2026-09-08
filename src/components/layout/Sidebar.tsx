import React from 'react';
import { useApp } from '../../context/AppContext';
import type { AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Image,
  Clock,
  BarChart3,
  Building2,
  Share2,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabase';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, business, user, logout, isSchedulerActive } = useApp();

  const navItems: { view: AppView; label: string; icon: any }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'calendar', label: 'Content Calendar', icon: Calendar },
    { view: 'generator', label: 'Create Content', icon: Sparkles },
    { view: 'media', label: 'Media Library', icon: Image },
    { view: 'scheduled', label: 'Scheduled Posts', icon: Clock },
    { view: 'analytics', label: 'Analytics', icon: BarChart3 },
    { view: 'profile', label: 'Business Profile', icon: Building2 },
    { view: 'social', label: 'Social Accounts', icon: Share2 },
    { view: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (v: AppView) => {
    setCurrentView(v);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-all duration-300 ${
          mobileOpen ? 'left-0' : '-left-64 md:left-0'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                SocialPilot <span className="text-indigo-400">AI</span>
              </span>
            </div>

            {mobileOpen && (
              <button
                onClick={onCloseMobile}
                className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Business Profile Badge */}
          <div className="p-4 mx-3 my-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center gap-3">
            {business?.logo_url ? (
              <img src={business.logo_url} alt="Logo" className="w-9 h-9 rounded-lg object-cover bg-slate-700" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 font-bold flex items-center justify-center text-sm">
                {business?.business_name?.[0] || 'B'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{business?.business_name || 'My Business'}</h4>
              <p className="text-[11px] text-slate-400 truncate">{business?.business_category || 'General'}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Indicators & User Session */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* Status Badges */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/50 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className={`w-3 h-3 ${isSchedulerActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                Scheduler Engine
              </span>
              <span className={`font-bold ${isSchedulerActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isSchedulerActive ? 'Active' : 'Paused'}
              </span>
            </div>

            <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/50 text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                Backend Mode
              </span>
              <span className="font-semibold text-slate-300">
                {isSupabaseConfigured() ? 'Supabase DB' : 'Local + DB'}
              </span>
            </div>
          </div>

          {/* User logout */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-bold text-white truncate">{user?.full_name || 'Business Owner'}</div>
              <div className="text-[10px] text-slate-500 truncate">{user?.email || 'owner@demo.com'}</div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
