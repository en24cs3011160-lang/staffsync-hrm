import React from 'react';
import { HRProvider, useHR } from './context/HRContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { EmployeeDirectoryView } from './components/EmployeeDirectoryView';
import { LeaveManagementView } from './components/LeaveManagementView';
import { AttendanceTrackerView } from './components/AttendanceTrackerView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { TrainingHubView } from './components/TrainingHubView';
import { KanbanProjectView } from './components/KanbanProjectView';
import { Toast } from './components/Toast';

const MainLayout: React.FC = () => {
  const { activeNav } = useHR();

  const renderActiveView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardView />;
      case 'employees':
        return <EmployeeDirectoryView />;
      case 'leaves':
        return <LeaveManagementView />;
      case 'attendance':
        return <AttendanceTrackerView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'training':
        return <TrainingHubView />;
      case 'kanban':
        return <KanbanProjectView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <HRProvider>
      <MainLayout />
    </HRProvider>
  );
}
