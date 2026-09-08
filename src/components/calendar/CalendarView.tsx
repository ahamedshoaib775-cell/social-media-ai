import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { PostStatus } from '../../types';
import { Calendar as CalendarIcon, Filter, Plus, Edit3, Trash2, Copy, Clock, LayoutGrid, List } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { posts, setEditingPost, deletePost, duplicatePost, approvePost, schedulePost, setCurrentView } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredPosts = posts.filter(p => {
    if (statusFilter === 'All') return true;
    return p.status === statusFilter;
  });

  const getStatusBadgeClass = (status: PostStatus) => {
    switch (status) {
      case 'Published': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Scheduled': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Approved': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Failed': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Calendar Bar & Filters */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Content Calendar</h2>
            <p className="text-xs text-slate-500">View and manage scheduled social posts across 7 days</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses ({posts.length})</option>
              <option value="Draft">Draft ({posts.filter(p => p.status === 'Draft').length})</option>
              <option value="Approved">Approved ({posts.filter(p => p.status === 'Approved').length})</option>
              <option value="Scheduled">Scheduled ({posts.filter(p => p.status === 'Scheduled').length})</option>
              <option value="Published">Published ({posts.filter(p => p.status === 'Published').length})</option>
            </select>
          </div>

          {/* Toggle Grid vs List */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setCurrentView('generator')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Post
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Media Image Header */}
                <div className="aspect-video bg-slate-100 relative overflow-hidden group">
                  <img
                    src={post.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=400&q=80'}
                    alt="Post Thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                    Day {post.day_number}
                  </div>
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getStatusBadgeClass(post.status)}`}>
                    {post.status}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-indigo-600">{post.content_type}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.scheduled_time || '09:30 AM'}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{post.headline}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-snug">{post.caption}</p>

                  <div className="text-[10px] text-indigo-600 font-mono truncate pt-1">
                    {(post.hashtags || []).slice(0, 3).join(' ')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingPost(post)}
                    title="Edit Post"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicatePost(post.id)}
                    title="Duplicate Post"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    title="Delete Post"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {post.status !== 'Approved' && post.status !== 'Scheduled' && (
                    <button
                      onClick={() => approvePost(post.id)}
                      className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                  {post.status !== 'Scheduled' && (
                    <button
                      onClick={() => schedulePost(post.id)}
                      className="px-2.5 py-1 rounded-md bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-700 shadow-2xs transition-all cursor-pointer"
                    >
                      Schedule
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Day & Date</th>
                  <th className="p-4">Content Type</th>
                  <th className="p-4">Headline & Caption</th>
                  <th className="p-4">Scheduled Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-extrabold font-mono text-indigo-700">
                      Day {post.day_number} <br />
                      <span className="text-[10px] text-slate-400 font-normal">{post.scheduled_date}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-800 font-semibold text-[11px]">
                        {post.content_type}
                      </span>
                    </td>
                    <td className="p-4 max-w-sm">
                      <div className="font-bold text-slate-900 truncate">{post.headline}</div>
                      <div className="text-slate-500 truncate text-[11px]">{post.caption}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      {post.scheduled_time || '09:30 AM'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadgeClass(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => duplicatePost(post.id)}
                        className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100"
                      >
                        Duplicate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
