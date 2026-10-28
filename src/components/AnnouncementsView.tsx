import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Announcement } from '../types';
import { 
  Megaphone, 
  Plus, 
  Pin, 
  CheckCircle, 
  Search, 
  Filter, 
  X, 
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { 
    announcements, 
    addAnnouncement, 
    togglePinAnnouncement, 
    acknowledgeAnnouncement, 
    currentUser,
    employees
  } = useHR();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New announcement form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Company Update');
  const [priority, setPriority] = useState<Announcement['priority']>('Normal');
  const [targetDepartment, setTargetDepartment] = useState('All');
  const [isPinned, setIsPinned] = useState(false);

  const categories = ['All', 'Company Update', 'Policy', 'Event', 'Holiday', 'Training'];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill out the title and content.');
      return;
    }

    addAnnouncement({
      title,
      content,
      category,
      priority,
      targetDepartment,
      pinned: isPinned,
      authorName: currentUser.name,
      authorRole: currentUser.designation,
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setContent('');
    setIsPinned(false);
  };

  const filteredAnnouncements = announcements
    .filter(a => {
      const matchesCategory = categoryFilter === 'All' || a.category === categoryFilter;
      const matchesSearch = 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTarget = a.targetDepartment === 'All' || a.targetDepartment === currentUser.department;
      return matchesCategory && matchesSearch && matchesTarget;
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Company Announcements & News</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep employees aligned with official communications, policy updates, and milestones
          </p>
        </div>

        {(currentUser.role === 'hr' || currentUser.role === 'manager') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Post Announcement
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => {
          const hasAcknowledged = ann.acknowledgements.includes(currentUser.id);
          const ackEmployees = employees.filter(e => ann.acknowledgements.includes(e.id));

          return (
            <div 
              key={ann.id} 
              className={`bg-white border rounded-xl p-6 shadow-sm transition-all ${
                ann.pinned ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Clean unboxed metadata with separators (no pill sandwich) */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                    {ann.pinned && (
                      <span className="flex items-center gap-1 text-indigo-600 font-bold text-[11px] uppercase tracking-wider">
                        <Pin className="w-3 h-3 rotate-45" /> Pinned
                      </span>
                    )}
                    {ann.pinned && <span aria-hidden="true">·</span>}
                    <span className={`font-semibold ${
                      ann.priority === 'Urgent'
                        ? 'text-rose-600'
                        : ann.priority === 'Important'
                        ? 'text-amber-600'
                        : 'text-slate-600'
                    }`}>
                      {ann.priority} Priority
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">{ann.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Target: {ann.targetDepartment}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-400">{ann.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {ann.title}
                  </h3>

                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-1">
                    {ann.content}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                    <p className="text-[11px]">
                      Published by <strong className="text-slate-800">{ann.authorName}</strong> ({ann.authorRole})
                    </p>

                    <div className="flex items-center gap-3">
                      {currentUser.role === 'hr' && (
                        <button
                          onClick={() => togglePinAnnouncement(ann.id)}
                          className="text-[11px] text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
                        >
                          <Pin className="w-3 h-3" />
                          {ann.pinned ? 'Unpin' : 'Pin to Top'}
                        </button>
                      )}

                      <button
                        onClick={() => acknowledgeAnnouncement(ann.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-medium ${
                          hasAcknowledged
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{hasAcknowledged ? 'Acknowledged' : 'Acknowledge Notice'}</span>
                        <span className="ml-1 px-1.5 py-0.2 rounded bg-white border border-slate-200 text-[10px] font-mono">
                          {ann.acknowledgements.length}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Announcement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Publish New Announcement</h3>
                <p className="text-xs text-slate-500">Notice will appear on employee dashboards</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Town Hall Meeting & Product Strategy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Announcement['category'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Company Update">Company Update</option>
                    <option value="Policy">Policy / Compliance</option>
                    <option value="Event">Event / Celebration</option>
                    <option value="Holiday">Holiday Notice</option>
                    <option value="Training">Training & Upskilling</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Announcement['priority'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent / Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Department</label>
                  <select
                    value={targetDepartment}
                    onChange={(e) => setTargetDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Marketing & Comms">Marketing & Comms</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="pinned-checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="pinned-checkbox" className="font-semibold text-slate-700 cursor-pointer">
                    Pin notice to top
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Announcement Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Draft announcement details, dates, action items, or policy changes..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
