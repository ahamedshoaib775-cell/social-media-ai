import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar, Clock, CheckCircle2, Play, ArrowRight, Edit, AlertTriangle, Send } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabase';

export const DashboardOverview: React.FC = () => {
  const { posts, business, setCurrentView, setEditingPost, generateNew7DayPlan, runSchedulerManual, approvePost, publishPostNow } = useApp();

  const totalPosts = posts.length;
  const scheduledCount = posts.filter(p => p.status === 'Scheduled').length;
  const publishedCount = posts.filter(p => p.status === 'Published').length;
  const approvedCount = posts.filter(p => p.status === 'Approved').length;
  const draftCount = posts.filter(p => p.status === 'Draft').length;

  const todayPost = posts[0] || null;
  const upcomingPosts = posts.slice(1, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              AI Social Media Automation Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {business?.business_name || 'Business Owner'} 👋
            </h1>
            <p className="text-sm text-indigo-200/90 mt-1 max-w-xl">
              Your 7-day content plan is active. You have <strong className="text-white">{scheduledCount} scheduled</strong> posts ready for automatic publishing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => generateNew7DayPlan()}
              className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate Fresh 7-Day Plan
            </button>
            <button
              onClick={runSchedulerManual}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-200" />
              Run Scheduler Now
            </button>
          </div>
        </div>
      </div>

      {/* Database & Scheduler System Status Banner */}
      {!isSupabaseConfigured() && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Demo Environment Active:</strong> Running with local persistent state. To enable production Supabase Auth & Storage, add your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> credentials.
            </span>
          </div>
          <button
            onClick={() => setCurrentView('settings')}
            className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs shrink-0 cursor-pointer"
          >
            Configure Keys
          </button>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Scheduled Posts</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{scheduledCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Queued for publishing</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Posts Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{publishedCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Live on connected channels</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Approved / Drafts</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{approvedCount + draftCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">{approvedCount} approved • {draftCount} drafts</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Content Plan</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalPosts}</div>
          <p className="text-[11px] text-slate-400 mt-1">7-Day AI Cycle</p>
        </div>
      </div>

      {/* Main Content Layout: Today's Post Focus + Upcoming List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Today's Post Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Today's Focus Content</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Day {todayPost?.day_number || 1}: {todayPost?.headline || 'Welcome Post'}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                todayPost?.status === 'Published'
                  ? 'bg-emerald-100 text-emerald-800'
                  : todayPost?.status === 'Scheduled'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {todayPost?.status || 'Draft'}
              </span>
            </div>

            {todayPost ? (
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={todayPost.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=400&q=80'}
                      alt="Today Media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                      {todayPost.caption}
                    </p>
                    <div className="mt-2 text-[11px] text-indigo-600 font-mono truncate">
                      {(todayPost.hashtags || []).slice(0, 4).join(' ')}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between items-center text-slate-600 font-medium">
                  <span>Suggested Time: <strong>{todayPost.suggested_posting_time}</strong></span>
                  <span>CTA: <strong>{todayPost.cta}</strong></span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No posts generated yet. Click "Generate Fresh 7-Day Plan" above!</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            {todayPost && (
              <>
                <button
                  onClick={() => setEditingPost(todayPost)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Post
                </button>

                <div className="flex items-center gap-2">
                  {todayPost.status !== 'Approved' && todayPost.status !== 'Scheduled' && todayPost.status !== 'Published' && (
                    <button
                      onClick={() => approvePost(todayPost.id)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      Approve Post
                    </button>
                  )}
                  <button
                    onClick={() => publishPostNow(todayPost.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    Publish Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Upcoming Posts Sidebar */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Upcoming Posts</h3>
              <button
                onClick={() => setCurrentView('calendar')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                View Full Calendar
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setEditingPost(post)}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">Day {post.day_number}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        {post.content_type}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {post.headline}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    post.status === 'Scheduled' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setCurrentView('calendar')}
              className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              See all 7 days of scheduled content →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
