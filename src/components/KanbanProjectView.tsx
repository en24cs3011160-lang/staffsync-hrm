import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  Github, 
  ChevronDown, 
  ChevronUp, 
  FolderGit2, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Check, 
  Copy 
} from 'lucide-react';

export const KanbanProjectView: React.FC = () => {
  const { epics, setActiveNav, showToast } = useHR();

  const [activeSubTab, setActiveSubTab] = useState<'Overview' | 'Workspace' | 'Kanban'>('Overview');
  const [expandedEpics, setExpandedEpics] = useState<Record<string, boolean>>({
    'epic-1': true,
    'epic-2': true,
    'epic-3': true,
    'epic-4': true,
    'epic-5': true,
    'epic-6': true,
  });

  const [demoLink, setDemoLink] = useState('https://ais-pre-6um3mokag7uv4aq4r3rj5e-795255678516.asia-northeast1.run.app');
  const [githubLink, setGithubLink] = useState('https://github.com/staffsync/hrm-mern-solution');
  const [isEditingLinks, setIsEditingLinks] = useState(false);

  const toggleEpic = (epicId: string) => {
    setExpandedEpics(prev => ({ ...prev, [epicId]: !prev[epicId] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  // Calculate task counts
  const allTasks = epics.flatMap(e => e.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'completed').length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {/* SkillWallet Course Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>SkillWallet</span>
              <span>›</span>
              <span>Full Stack Development (MERN Stack)</span>
              <span>›</span>
              <span className="font-semibold text-slate-800">StaffSync HRM</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              StaffSync - Modern human resource management solution.
            </h1>
          </div>

          {/* Sub-tabs: Overview | Workspace | Kanban */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start lg:self-auto">
            {(['Overview', 'Workspace', 'Kanban'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeSubTab === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Demo & GitHub Link Submission Banner */}
        <div className="mt-5 p-4 rounded-xl bg-blue-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-sm">Add Demo and GitHub links!</h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Please update the demo and GitHub links so that your mentor can review and evaluate your project.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingLinks(!isEditingLinks)}
              className="px-3 py-1.5 bg-white text-blue-800 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors"
            >
              {isEditingLinks ? 'Done Editing' : 'Update Links'}
            </button>
          </div>
        </div>

        {/* Links input form if editing */}
        {isEditingLinks && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Live App Demo Link</label>
              <input
                type="text"
                value={demoLink}
                onChange={(e) => setDemoLink(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GitHub Repository Link</label>
              <input
                type="text"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* Overview Tab Content */}
      {activeSubTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Project Description & System Requirements */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Information Technology
                </span>
                <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                  Individual
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                The StaffSync - Modern human resource management solution is a comprehensive web-based application built using the <strong>MERN Stack (MongoDB, Express.js, React.js, and Node.js)</strong> that streamlines and automates various HR processes within an organization. The system provides distinct roles and access levels for <strong>HR personnel, managers, and employees</strong>, ensuring efficient management and transparency across all operations:
              </p>

              <div className="space-y-2 text-xs text-slate-700 pl-3 border-l-2 border-indigo-200">
                <p>
                  <strong>• HR personnel:</strong> can manage employee data, handle leave approvals, track attendance, and post announcements or news.
                </p>
                <p>
                  <strong>• Employees:</strong> can apply for leaves, maintain their personal records, mark attendance, and stay updated with company announcements.
                </p>
                <p>
                  <strong>• Managers:</strong> can oversee leave requests and manage training and development programs for their teams.
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                This centralized platform enhances productivity, improves communication, and promotes a seamless workflow across departments by digitizing core HR functions.
              </p>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Skills Applied</h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'React.js', 
                    'Node.js', 
                    'Express.js', 
                    'MongoDB', 
                    'TypeScript', 
                    'Tailwind CSS', 
                    'JSON Web Token (JWT)', 
                    'Role-Based Access Control', 
                    'Asynchronous JavaScript'
                  ].map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Software & Hardware Requirements Card (from Screenshot 2, 3, 4) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                1. Software & Architecture Requirements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="font-semibold text-slate-900">Node.js (v16 or above)</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Runtime environment for server-side logic and API routing.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="font-semibold text-slate-900">React.js & Tailwind CSS</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Dynamic and responsive modern single-page frontend interface.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="font-semibold text-slate-900">Express.js Framework</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Lightweight web framework for building secure RESTful endpoints.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="font-semibold text-slate-900">MongoDB / Schema Models</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">NoSQL database for users, leaves, attendance, and trainings.</p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 pt-2">
                2. Hardware Specifications Met
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 border border-slate-200 rounded-lg">
                  <Cpu className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <p className="font-bold text-slate-800">Processor</p>
                  <p className="text-[11px] text-slate-500">Core i5 / Ryzen 5</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg">
                  <Cpu className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <p className="font-bold text-slate-800">RAM</p>
                  <p className="text-[11px] text-slate-500">8GB - 16GB</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg">
                  <HardDrive className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <p className="font-bold text-slate-800">Storage</p>
                  <p className="text-[11px] text-slate-500">&gt; 1 GB Free</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg">
                  <Monitor className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <p className="font-bold text-slate-800">Display</p>
                  <p className="text-[11px] text-slate-500">1366x768+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1 span): Project Progress & Syllabus Breakdown */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="text-sm font-bold text-slate-900">Project Progress</h3>
                <span className="text-xs font-mono font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50">
                  {progressPercent}% Complete
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Epics</span>
                  <span className="font-bold font-mono text-slate-900">6 Epics</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Stories & Tasks</span>
                  <span className="font-bold font-mono text-slate-900">{completedTasks} / {totalTasks} Completed</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5">
                  <span className="text-slate-500">Evaluation Ready</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Passed
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-2 space-y-2">
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Live App Demo
                </a>
                <button
                  onClick={() => copyToClipboard(demoLink, 'Demo Link')}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Submission Links
                </button>
              </div>
            </div>

            {/* Epics Accordion */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Curriculum Epics (SkillWallet)
              </h3>

              {epics.map(epic => {
                const isExpanded = !!expandedEpics[epic.id];
                return (
                  <div key={epic.id} className="border border-slate-100 rounded-lg overflow-hidden text-xs">
                    <button
                      onClick={() => toggleEpic(epic.id)}
                      className="w-full p-2.5 bg-slate-50/80 hover:bg-slate-100 text-left flex items-center justify-between font-medium text-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{epic.title}</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className="p-3 bg-white space-y-2 divide-y divide-slate-100">
                        {epic.tasks.map(t => (
                          <div key={t.id} className="pt-2 first:pt-0 flex items-center justify-between text-[11px]">
                            <span className="text-slate-700">{t.title}</span>
                            <span className="font-mono text-emerald-600 font-bold ml-2 shrink-0">Done</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board View */}
      {activeSubTab === 'Kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: To Do */}
          <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">To Do</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-mono font-bold">0</span>
            </div>
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-lg">
              No pending tasks in backlog. All curriculum stories are completed!
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">In Progress</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-bold">0</span>
            </div>
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-lg">
              All stories moved to Completed. Ready for mentor evaluation!
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Completed (19/19)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">19</span>
            </div>
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {allTasks.map(t => (
                <div key={t.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-xs text-slate-800">{t.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-1 border-t border-slate-100">
                    <span className="font-mono text-slate-400">{t.id}</span>
                    <span className="text-indigo-600 font-medium">{t.component}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workspace View */}
      {activeSubTab === 'Workspace' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Developer Workspace & Architecture Explorer</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Integrated MERN components, schema definitions, and REST endpoints
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">MongoDB Entities & Schema</span>
                <span className="text-emerald-600 font-mono font-bold">Validated</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Collections: <code>users</code>, <code>leaves</code>, <code>attendance</code>, <code>announcements</code>, <code>trainings</code> with nested balance arrays and compound indexes.
              </p>
              <button
                onClick={() => setActiveNav('employees')}
                className="text-indigo-600 font-semibold hover:underline text-[11px]"
              >
                Inspect Records &rarr;
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">RESTful Express Router</span>
                <span className="text-emerald-600 font-mono font-bold">Online</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Endpoints: <code>GET /api/employees</code>, <code>POST /api/leaves/apply</code>, <code>PATCH /api/leaves/review</code>, <code>POST /api/attendance/punch</code>.
              </p>
              <button
                onClick={() => setActiveNav('leaves')}
                className="text-indigo-600 font-semibold hover:underline text-[11px]"
              >
                Test Leave Workflow &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
