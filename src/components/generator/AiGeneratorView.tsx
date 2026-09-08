import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar, Clock, Wand2, Edit3, RefreshCw } from 'lucide-react';
import { HashtagGeneratorModal } from '../tools/HashtagGeneratorModal';

export const AiGeneratorView: React.FC = () => {
  const { posts, business, generateNew7DayPlan, setEditingPost, approvePost, schedulePost, setCurrentView } = useApp();
  const [focusTopic, setFocusTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showHashtagTool, setShowHashtagTool] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      generateNew7DayPlan(focusTopic);
      setGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Generator Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Content Generator v2.0
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Generate 7-Day Social Media Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Tailored specifically for <strong>{business?.business_name}</strong> ({business?.business_category}). Non-repetitive, authentic, and platform-compliant.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Optional topic focus (e.g. Summer Special)"
            value={focusTopic}
            onChange={e => setFocusTopic(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>Generate 7-Day Plan</span>
          </button>

          <button
            onClick={() => setShowHashtagTool(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Hashtag Generator Tool
          </button>
        </div>
      </div>

      {/* Generated 7-Day Grid View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            7-Day Content Roadmap
          </h3>
          <button
            onClick={() => setCurrentView('calendar')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Open Full Calendar Grid →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold font-mono text-indigo-700 uppercase tracking-wider">
                    Day {post.day_number} • {post.scheduled_date}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800">
                    {post.content_type}
                  </span>
                </div>

                {/* Media Banner Thumbnail */}
                <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden mb-3 border border-slate-200 relative group">
                  <img
                    src={post.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=400&q=80'}
                    alt="Post media"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/70 text-white font-semibold text-[10px]">
                    {post.required_media_type}
                  </div>
                </div>

                {/* Headline & Caption */}
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-1">
                  {post.headline}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                  {post.caption}
                </p>

                {/* Hashtags */}
                <div className="text-[11px] text-indigo-600 font-mono line-clamp-1 mb-3">
                  {(post.hashtags || []).join(' ')}
                </div>

                {/* Posting Time Recommendation */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Optimal Time:
                  </span>
                  <strong className="text-slate-900">{post.suggested_posting_time}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setEditingPost(post)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  Edit
                </button>

                <div className="flex items-center gap-2">
                  {post.status !== 'Approved' && post.status !== 'Scheduled' && (
                    <button
                      onClick={() => approvePost(post.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                  {post.status !== 'Scheduled' && (
                    <button
                      onClick={() => schedulePost(post.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs transition-all cursor-pointer"
                    >
                      Schedule
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showHashtagTool && (
        <HashtagGeneratorModal
          isOpen={showHashtagTool}
          onClose={() => setShowHashtagTool(false)}
        />
      )}
    </div>
  );
};
