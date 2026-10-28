import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { LeaveType, LeaveStatus } from '../types';
import { 
  CalendarRange, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  X, 
  Check, 
  Info 
} from 'lucide-react';

export const LeaveManagementView: React.FC = () => {
  const { 
    currentUser, 
    leaves, 
    applyLeave, 
    reviewLeave,
    employees 
  } = useHR();

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'my'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});

  // Leave application form state
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState('2026-11-05');
  const [endDate, setEndDate] = useState('2026-11-06');
  const [reason, setReason] = useState('');

  // Calculate requested days
  const calculateDays = () => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const calculatedDays = calculateDays();

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please state the reason for your leave request.');
      return;
    }

    applyLeave({
      type: leaveType,
      startDate,
      endDate,
      reason,
      days: calculatedDays,
    });

    setIsApplyModalOpen(false);
    setReason('');
  };

  // Filter leaves based on selected tab and search
  const displayedLeaves = leaves.filter(l => {
    if (filterTab === 'pending') {
      if (l.status !== 'Pending') return false;
      if (currentUser.role === 'manager' && l.department !== currentUser.department) return false;
    }
    if (filterTab === 'my') {
      if (l.employeeId !== currentUser.id) return false;
    }
    if (statusFilter !== 'All' && l.status !== statusFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return l.employeeName.toLowerCase().includes(q) || 
             l.reason.toLowerCase().includes(q) || 
             l.type.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Leave Management & Approvals</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit leave requests, review employee requests, and track balances
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Apply for Leave
        </button>
      </div>

      {/* Leave Balances Strip for Current User */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Your Current Leave Entitlements ({currentUser.name})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500">Annual Paid Leave</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {currentUser.leaveBalance.annual} <span className="text-xs font-normal text-slate-500">days left</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500">Sick / Medical Leave</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {currentUser.leaveBalance.sick} <span className="text-xs font-normal text-slate-500">days left</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500">Casual Leave</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {currentUser.leaveBalance.casual} <span className="text-xs font-normal text-slate-500">days left</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500">Maternity / Paternity</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {currentUser.leaveBalance.maternityPaternity} <span className="text-xs font-normal text-slate-500">days left</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 w-full md:w-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Requests ({leaves.length})
          </button>

          {(currentUser.role === 'hr' || currentUser.role === 'manager') && (
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterTab === 'pending'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Approval Queue ({leaves.filter(l => l.status === 'Pending').length})
            </button>
          )}

          <button
            onClick={() => setFilterTab('my')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTab === 'my'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Submissions ({leaves.filter(l => l.employeeId === currentUser.id).length})
          </button>
        </div>

        {/* Status Filter & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <div className="relative flex-1 md:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leaves..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration & Dates</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status & Reviewer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {displayedLeaves.map((leave) => {
                const canReview = 
                  (currentUser.role === 'hr' || (currentUser.role === 'manager' && leave.department === currentUser.department)) && 
                  leave.status === 'Pending' && 
                  leave.employeeId !== currentUser.id;

                return (
                  <tr key={leave.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={leave.employeeAvatar}
                          alt={leave.employeeName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{leave.employeeName}</p>
                          <p className="text-[11px] text-slate-500">{leave.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{leave.type} Leave</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <p className="font-bold text-slate-900">{leave.days} Day{leave.days > 1 ? 's' : ''}</p>
                      <p className="text-slate-500">{leave.startDate} → {leave.endDate}</p>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-700 truncate" title={leave.reason}>
                        {leave.reason}
                      </p>
                      {leave.reviewerComment && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5">
                          Note: "{leave.reviewerComment}"
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : leave.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {leave.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                          {leave.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                          {leave.status === 'Pending' && <Clock className="w-3 h-3" />}
                          {leave.status}
                        </span>
                        {leave.reviewedBy && (
                          <p className="text-[10px] text-slate-400">By: {leave.reviewedBy}</p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {canReview ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => reviewLeave(leave.id, 'Approved', reviewNote[leave.id])}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reviewLeave(leave.id, 'Rejected', reviewNote[leave.id] || 'Schedule conflicts')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-semibold transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {leave.status === 'Pending' ? 'In Review' : 'Finalized'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Submit Leave Application</h3>
                <p className="text-xs text-slate-500">Applicant: {currentUser.name} ({currentUser.department})</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Annual">Annual Paid Leave (Bal: {currentUser.leaveBalance.annual}d)</option>
                  <option value="Sick">Sick / Medical Leave (Bal: {currentUser.leaveBalance.sick}d)</option>
                  <option value="Casual">Casual Leave (Bal: {currentUser.leaveBalance.casual}d)</option>
                  <option value="Emergency">Emergency Unplanned Leave</option>
                  <option value="Maternity/Paternity">Maternity/Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 flex items-center justify-between">
                <span className="text-slate-600">Calculated duration:</span>
                <span className="font-bold text-indigo-700 font-mono text-sm">
                  {calculatedDays} working day{calculatedDays > 1 ? 's' : ''}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Absence *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the purpose of your leave request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
