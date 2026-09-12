import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Play, Pause, AlertCircle, CheckCircle2, Terminal, RefreshCw } from 'lucide-react';

export const ScheduledPostsView: React.FC = () => {
  const { posts, schedulerLogs, isSchedulerActive, socialAccounts, toggleScheduler, runSchedulerManual, publishPostNow } = useApp();

  const scheduledPosts = posts.filter(p => p.status === 'Scheduled');
  const publishedPosts = posts.filter(p => p.status === 'Published');
  const failedPosts = posts.filter(p => p.status === 'Failed');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Control */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isSchedulerActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isSchedulerActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
              {isSchedulerActive ? 'Background Scheduler Running' : 'Background Scheduler Paused'}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Scheduled Posts & Execution Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            SocialPilot AI continuously polls for posts ready to publish and dispatches them via official Meta Graph API endpoints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleScheduler}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              isSchedulerActive
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isSchedulerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            {isSchedulerActive ? 'Pause Auto Engine' : 'Start Auto Engine'}
          </button>

          <button
            onClick={runSchedulerManual}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Process Pending Posts Now
          </button>
        </div>
      </div>

      {/* Queue Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
            <span>Pending In Queue</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{scheduledPosts.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting target execution time</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
            <span>Successfully Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{publishedPosts.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Dispatched to channels</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
            <span>Execution Failures</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{failedPosts.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Missing tokens or API permissions</p>
        </div>
      </div>

      {/* Pending Scheduled Queue Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">Pending Scheduled Queue</h3>
          <span className="text-xs font-mono text-slate-500">{scheduledPosts.length} items queued</span>
        </div>

        {scheduledPosts.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {scheduledPosts.map((post) => {
              const igAccount = socialAccounts.find(a => a.platform === 'instagram');
              const igAvatar = igAccount?.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              const igHandle = igAccount?.account_handle || '@artisanbloomcoffee';

              const isReel = post.content_type === 'Reel' || post.required_media_type?.toLowerCase().includes('video');
              const isStory = post.content_type?.toLowerCase().includes('story');
              const formatLabel = isStory ? 'Instagram Story' : isReel ? 'Instagram Reel' : 'Instagram Post';

              return (
                <div key={post.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                        <img src={post.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490'} alt="Media" className="w-full h-full object-cover" />
                      </div>
                      <img
                        src={igAvatar}
                        alt="Instagram Avatar"
                        className="w-5 h-5 rounded-full object-cover absolute -bottom-1 -right-1 ring-2 ring-rose-500 shadow-xs"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          {formatLabel}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{igHandle}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{post.headline}</h4>
                      <div className="text-[11px] text-indigo-600 font-mono mt-0.5">
                        Target: {post.scheduled_date} at {post.scheduled_time || '09:30 AM'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => publishPostNow(post.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs shrink-0 cursor-pointer"
                  >
                    Publish Now
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No pending posts in queue. Approve or Schedule posts from your Content Calendar!
          </div>
        )}
      </div>

      {/* Scheduler Execution Log Terminal */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 text-slate-300 font-mono text-xs shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>Scheduler Engine Logs & Audit Trail</span>
          </div>
          <span className="text-[10px] text-slate-500">Live Logging Stream</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-[11px] leading-relaxed">
          {schedulerLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3">
              <span className="text-slate-500 shrink-0">{log.timestamp}</span>
              <span className={`font-bold uppercase shrink-0 ${
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'error' ? 'text-rose-400' :
                log.type === 'warning' ? 'text-amber-400' : 'text-indigo-400'
              }`}>
                [{log.type}]
              </span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
