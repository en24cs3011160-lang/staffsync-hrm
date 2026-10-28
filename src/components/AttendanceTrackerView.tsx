import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { ClockWidget } from './ClockWidget';
import { 
  Clock, 
  Calendar, 
  Download, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Filter, 
  MapPin, 
  UserCheck 
} from 'lucide-react';

export const AttendanceTrackerView: React.FC = () => {
  const { attendance, employees, currentUser } = useHR();

  const [dateFilter, setDateFilter] = useState('2026-10-28');
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate high-level stats
  const totalEmployees = employees.length;
  const presentRecords = attendance.filter(a => a.status === 'Present' || a.status === 'Late');
  const presentCount = presentRecords.length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;
  const onTimeCount = attendance.filter(a => a.status === 'Present').length;
  const onTimePercentage = presentCount > 0 ? Math.round((onTimeCount / presentCount) * 100) : 100;

  // Filter attendance records
  const filteredAttendance = attendance.filter(rec => {
    const emp = employees.find(e => e.id === rec.employeeId);
    const matchesSearch = 
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp && emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = deptFilter === 'All' || (emp && emp.department === deptFilter);
    return matchesSearch && matchesDept;
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Employee Name', 'Clock In', 'Clock Out', 'Total Hours', 'Status', 'Location'];
    const rows = filteredAttendance.map(a => [
      a.date,
      `"${a.employeeName}"`,
      a.clockIn,
      a.clockOut || 'Active',
      a.totalHours || 'In Progress',
      a.status,
      `"${a.location || 'Office'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `staffsync_attendance_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Daily Attendance & Timesheets</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time employee check-ins, punctuality metrics, and work duration
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          Export Timesheet CSV
        </button>
      </div>

      {/* Top Split: Live Clock in Card + Key KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ClockWidget />
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <span className="text-xs text-slate-500">Present Today</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {presentCount} <span className="text-xs font-normal text-slate-400">/ {totalEmployees}</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {Math.round((presentCount / totalEmployees) * 100)}% of workforce
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <span className="text-xs text-slate-500">Punctuality Rate</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {onTimePercentage}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {onTimeCount} on-time arrivals
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-500">Late Check-ins</span>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
              {lateCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Punched after 09:15 AM
            </p>
          </div>

          <div className="col-span-2 sm:col-span-3 bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-900 flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="font-semibold">Shift Timing Policy: 09:00 AM – 06:00 PM (Flexible Grace Period: 15 min)</p>
              <p className="text-indigo-700 text-[11px] mt-0.5">Employees check in upon arrival at physical terminals or via browser workstation with location verification.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-lg text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent font-mono focus:outline-none text-slate-700"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Product Design">Product Design</option>
            <option value="Marketing & Comms">Marketing & Comms</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee attendance..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Clock In</th>
                <th className="py-3 px-4">Clock Out</th>
                <th className="py-3 px-4">Logged Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAttendance.map((rec) => {
                const emp = employees.find(e => e.id === rec.employeeId);
                return (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {emp && (
                          <img
                            src={emp.avatar}
                            alt={rec.employeeName}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{rec.employeeName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{emp?.empCode} · {emp?.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {rec.date}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-800 font-semibold">
                      {rec.clockIn}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {rec.clockOut || <span className="text-emerald-600 font-sans italic text-[11px]">Active</span>}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {rec.totalHours ? `${rec.totalHours} hrs` : <span className="text-slate-400">-</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        rec.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rec.status === 'Late'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : rec.status === 'On Leave'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {rec.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px] flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{rec.location || 'Office Station'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
