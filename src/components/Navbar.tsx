import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { 
  Users, 
  RotateCcw, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  Briefcase, 
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, employees, switchUserById, activeNav, resetAllData } = useHR();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const navLabels: Record<string, string> = {
    dashboard: 'Workspace Overview',
    employees: 'Employee Directory & Records',
    leaves: 'Leave Management & Approvals',
    attendance: 'Daily Attendance & Timesheets',
    announcements: 'Company Announcements & Feed',
    training: 'Training & Development Programs',
    kanban: 'Project Architecture & Syllabus Roadmap',
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'hr':
        return <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />;
      case 'manager':
        return <Briefcase className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-6 sticky top-0 z-30">
      {/* Zone 1: Wordmark & Context Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            S
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            StaffSync
          </span>
        </div>

        <span className="text-slate-300 hidden sm:inline" aria-hidden="true">/</span>

        <span className="text-sm font-medium text-slate-600 truncate hidden sm:inline">
          {navLabels[activeNav] || 'Dashboard'}
        </span>
      </div>

      {/* Zone 2: Role Switcher & Persona Indicator */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
            title="Switch demo persona to test HR, Manager, or Employee views"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-500 hidden md:inline">Viewing as:</span>
            <span className="font-semibold text-slate-900">{currentUser.name}</span>
            <span className="text-xs uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
              {currentUser.role}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setIsRoleDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Persona (Role-Based Access)
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {employees.map(emp => {
                  const isSelected = emp.id === currentUser.id;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => {
                        switchUserById(emp.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-800 truncate">{emp.name}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            {getRoleIcon(emp.role)}
                            <span className="capitalize">{emp.role}</span>
                            <span>·</span>
                            <span className="truncate">{emp.department}</span>
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={resetAllData}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset sample data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Current User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
            <p className="text-[11px] text-slate-500 leading-tight truncate">{currentUser.designation}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
