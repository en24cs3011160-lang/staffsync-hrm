import React from 'react';
import { useHR } from '../context/HRContext';
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  Clock, 
  Megaphone, 
  GraduationCap, 
  KanbanSquare, 
  ShieldCheck, 
  Briefcase, 
  UserCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeNav, setActiveNav, currentUser, leaves } = useHR();

  // Calculate pending leaves count for badge
  const pendingLeavesCount = leaves.filter(l => {
    if (currentUser.role === 'hr') return l.status === 'Pending';
    if (currentUser.role === 'manager') return l.status === 'Pending' && l.department === currentUser.department;
    return false;
  }).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'System overview & metrics',
    },
    {
      id: 'employees',
      label: 'Employee Directory',
      icon: Users,
      description: 'Personnel records & profiles',
    },
    {
      id: 'leaves',
      label: 'Leave Management',
      icon: CalendarRange,
      description: 'Applications & approvals',
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
    },
    {
      id: 'attendance',
      label: 'Attendance & Time',
      icon: Clock,
      description: 'Clock in/out & daily logs',
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
      description: 'Company news & notices',
    },
    {
      id: 'training',
      label: 'Training & Skills',
      icon: GraduationCap,
      description: 'Learning paths & courses',
    },
    {
      id: 'kanban',
      label: 'Project Kanban & Epics',
      icon: KanbanSquare,
      description: 'SkillWallet course progress',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Role Banner */}
      <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2 mb-1">
          {currentUser.role === 'hr' ? (
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          ) : currentUser.role === 'manager' ? (
            <Briefcase className="w-4 h-4 text-amber-400" />
          ) : (
            <UserCheck className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {currentUser.role === 'hr' ? 'HR Administrator' : currentUser.role === 'manager' ? 'Team Manager Portal' : 'Employee Portal'}
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate">
          {currentUser.department}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 tabular-nums">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Course Context Card (SkillWallet Reference) */}
      <div className="p-4 m-3 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs">
        <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-1">
          MERN HRM Platform
        </p>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Full-stack role-based architecture with MongoDB, Express, React & Node.
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Epics: 6</span>
          <span className="text-emerald-400 font-semibold font-mono">100% Ready</span>
        </div>
      </div>
    </aside>
  );
};
