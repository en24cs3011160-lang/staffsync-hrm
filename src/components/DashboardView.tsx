import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { ClockWidget } from './ClockWidget';
import { 
  Users, 
  CalendarRange, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Megaphone, 
  GraduationCap, 
  ArrowRight,
  Plus,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Heart
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    employees, 
    leaves, 
    attendance, 
    announcements, 
    trainings, 
    setActiveNav,
    reviewLeave,
    acknowledgeAnnouncement
  } = useHR();

  const [approvalNote, setApprovalNote] = useState<Record<string, string>>({});

  // Calculations for HR & Manager
  const totalEmployees = employees.length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  
  // Pending leaves relevant to current role
  const pendingLeaves = leaves.filter(l => {
    if (currentUser.role === 'hr') return l.status === 'Pending';
    if (currentUser.role === 'manager') return l.status === 'Pending' && l.department === currentUser.department;
    return l.employeeId === currentUser.id && l.status === 'Pending';
  });

  // Direct reports for manager
  const teamMembers = employees.filter(e => e.managerId === currentUser.id || e.department === currentUser.department);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Welcome back, {currentUser.name}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700 capitalize">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.designation} · {currentUser.department} · Employee ID: <span className="font-mono">{currentUser.empCode}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveNav('leaves')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CalendarRange className="w-3.5 h-3.5" />
              Apply / Manage Leaves
            </button>

            {currentUser.role === 'hr' && (
              <button
                onClick={() => setActiveNav('employees')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Employee
              </button>
            )}

            {currentUser.role === 'manager' && (
              <button
                onClick={() => setActiveNav('training')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Assign Team Training
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stat Cards (Tailored per role) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentUser.role === 'hr' ? (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Total Headcount</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {totalEmployees}
              </div>
              <div className="text-xs text-slate-500 mt-1">Across 4 departments</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Logged Present Today</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {presentCount} / {totalEmployees}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                {Math.round((presentCount / totalEmployees) * 100)}% attendance rate
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">On Approved Leave</span>
                <CalendarRange className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {onLeaveCount}
              </div>
              <div className="text-xs text-slate-500 mt-1">Active leave records</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Pending Approvals</span>
                <ShieldCheck className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {pendingLeaves.length}
              </div>
              <div className="text-xs text-amber-600 font-medium mt-1">Requires HR action</div>
            </div>
          </>
        ) : currentUser.role === 'manager' ? (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Team Direct Reports</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {teamMembers.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">{currentUser.department} Department</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Team Pending Leaves</span>
                <CalendarRange className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {pendingLeaves.length}
              </div>
              <div className="text-xs text-amber-600 font-medium mt-1">Requires manager review</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Team Attendance Today</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {attendance.filter(a => teamMembers.some(tm => tm.id === a.employeeId && a.status === 'Present')).length} / {teamMembers.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">Checked in at stations</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Active Training Tracks</span>
                <GraduationCap className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {trainings.length}
              </div>
              <div className="text-xs text-indigo-600 font-medium mt-1">Assigned to team</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Annual Leave Balance</span>
                <CalendarRange className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {currentUser.leaveBalance.annual} <span className="text-sm font-normal text-slate-500">days</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Accrued paid leave</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Sick / Medical Leave</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {currentUser.leaveBalance.sick} <span className="text-sm font-normal text-slate-500">days</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Available balance</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Casual Leaves</span>
                <Users className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {currentUser.leaveBalance.casual} <span className="text-sm font-normal text-slate-500">days</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Short leave allowance</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Assigned Courses</span>
                <GraduationCap className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {trainings.filter(t => t.assignedEmployeeIds.includes(currentUser.id)).length}
              </div>
              <div className="text-xs text-indigo-600 font-medium mt-1">In progress</div>
            </div>
          </>
        )}
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Pending Approvals / Leave Queue + Announcements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Leave Requests Section (For HR and Managers) */}
          {(currentUser.role === 'hr' || currentUser.role === 'manager') && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {currentUser.role === 'hr' ? 'All Pending Leave Approvals' : 'Team Leave Requests Requiring Review'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {pendingLeaves.length} pending request{pendingLeaves.length === 1 ? '' : 's'} waiting for sign-off
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav('leaves')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View All Leaves <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {pendingLeaves.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-800">All leave requests are cleared</p>
                  <p className="text-xs text-slate-500 mt-1">No requests are currently awaiting approval.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingLeaves.map(leave => (
                    <div key={leave.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={leave.employeeAvatar}
                            alt={leave.employeeName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-slate-900">{leave.employeeName}</h4>
                              <span className="text-xs font-medium text-slate-500">· {leave.department}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                              Requested <span className="font-semibold text-slate-800">{leave.days} day{leave.days > 1 ? 's' : ''}</span> ({leave.type} Leave): <span className="font-mono text-slate-700">{leave.startDate}</span> to <span className="font-mono text-slate-700">{leave.endDate}</span>
                            </p>
                            <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                              "{leave.reason}"
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => reviewLeave(leave.id, 'Approved', approvalNote[leave.id])}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => reviewLeave(leave.id, 'Rejected', approvalNote[leave.id] || 'Requires rescheduling')}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Company Announcements Board */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Company Announcements & News</h3>
                <p className="text-xs text-slate-500 mt-0.5">Official memos, policies, and team updates</p>
              </div>
              <button
                onClick={() => setActiveNav('announcements')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Post / Browse <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {announcements.slice(0, 3).map(ann => {
                const hasAcknowledged = ann.acknowledgements.includes(currentUser.id);
                return (
                  <div key={ann.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {ann.pinned && (
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                              PINNED
                            </span>
                          )}
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            ann.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-700'
                              : ann.priority === 'Important'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {ann.priority}
                          </span>
                          <span className="text-xs text-slate-500">· {ann.category}</span>
                          <span className="text-xs text-slate-400 font-mono">· {ann.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1.5">{ann.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {ann.content}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-2">
                          Posted by <span className="font-semibold text-slate-600">{ann.authorName}</span> ({ann.authorRole})
                        </p>
                      </div>

                      <button
                        onClick={() => acknowledgeAnnouncement(ann.id)}
                        className={`shrink-0 text-xs px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                          hasAcknowledged
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                        title="Acknowledge reading this announcement"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{hasAcknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
                        <span className="font-mono text-[10px] bg-slate-100 px-1 rounded ml-1">
                          {ann.acknowledgements.length}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Clock Widget + Daily Attendance snapshot */}
        <div className="space-y-6">
          {/* Live Punch Clock Widget */}
          <ClockWidget />

          {/* Today's Attendance Snapshot */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900">Today's Attendance Feed</h3>
              <button
                onClick={() => setActiveNav('attendance')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Full Timesheet
              </button>
            </div>

            <div className="space-y-3">
              {attendance.slice(0, 5).map(att => (
                <div key={att.id} className="flex items-center justify-between text-xs py-1">
                  <div className="truncate mr-2">
                    <p className="font-medium text-slate-800 truncate">{att.employeeName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">In: {att.clockIn}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 ${
                    att.status === 'Present'
                      ? 'bg-emerald-50 text-emerald-700'
                      : att.status === 'Late'
                      ? 'bg-amber-50 text-amber-700'
                      : att.status === 'On Leave'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}>
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
