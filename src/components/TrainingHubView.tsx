import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { TrainingProgram } from '../types';
import { 
  GraduationCap, 
  Plus, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Search, 
  UserCheck, 
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const TrainingHubView: React.FC = () => {
  const { 
    trainings, 
    updateTrainingProgress, 
    addTrainingProgram, 
    currentUser, 
    employees 
  } = useHR();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [celebratingCertificate, setCelebratingCertificate] = useState<TrainingProgram | null>(null);

  // New training form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TrainingProgram['category']>('Engineering');
  const [instructor, setInstructor] = useState('');
  const [durationHours, setDurationHours] = useState(16);
  const [level, setLevel] = useState<TrainingProgram['level']>('Intermediate');
  const [modulesCount, setModulesCount] = useState(6);
  const [deadline, setDeadline] = useState('2026-12-15');
  const [assignedEmpIds, setAssignedEmpIds] = useState<string[]>([]);

  const categories = ['All', 'Engineering', 'Design', 'Leadership', 'Compliance', 'HR & Culture'];

  const filteredTrainings = trainings.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructor.trim()) {
      alert('Please fill out the title and instructor name.');
      return;
    }

    addTrainingProgram({
      title,
      description,
      category,
      instructor,
      durationHours: Number(durationHours),
      level,
      modulesCount: Number(modulesCount),
      deadline,
      assignedEmployeeIds: assignedEmpIds.length > 0 ? assignedEmpIds : [currentUser.id],
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
    setAssignedEmpIds([]);
  };

  const toggleEmpAssignment = (id: string) => {
    setAssignedEmpIds(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Training & Talent Development Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upskill employees, assign technical tracks, and track enterprise certifications
          </p>
        </div>

        {(currentUser.role === 'hr' || currentUser.role === 'manager') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Training Program
          </button>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses or instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrainings.map((prog) => {
          const userProgress = prog.progressByEmployee[currentUser.id] || 0;
          const isAssignedToUser = prog.assignedEmployeeIds.includes(currentUser.id);
          const assignedTeamCount = prog.assignedEmployeeIds.length;

          return (
            <div key={prog.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-indigo-600">{prog.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{prog.durationHours} hrs</span>
                    <span>·</span>
                    <span className="capitalize">{prog.level}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {prog.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {prog.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p>Instructor: <strong className="text-slate-700">{prog.instructor}</strong></p>
                  <p>Curriculum: <strong className="text-slate-700 font-mono">{prog.modulesCount} modules</strong> · Target: <span className="font-mono">{prog.deadline}</span></p>
                </div>

                {/* Progress bar for the active user */}
                <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-700">
                      {isAssignedToUser ? `Your Progress (${currentUser.name})` : `Overall Team Enrolled (${assignedTeamCount})`}
                    </span>
                    <span className="font-bold font-mono text-indigo-600 tabular-nums">
                      {isAssignedToUser ? `${userProgress}%` : `${assignedTeamCount} enrolled`}
                    </span>
                  </div>
                  {isAssignedToUser && (
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${userProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                        style={{ width: `${userProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                {isAssignedToUser && userProgress === 100 ? (
                  <button
                    onClick={() => setCelebratingCertificate(prog)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    View Certificate
                  </button>
                ) : isAssignedToUser ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateTrainingProgress(prog.id, currentUser.id, Math.min(100, userProgress + 25))}
                      className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      + Complete Module
                    </button>
                    <button
                      onClick={() => updateTrainingProgress(prog.id, currentUser.id, 100)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      Finish Track (100%)
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">Available in catalog</span>
                )}

                {(currentUser.role === 'manager' || currentUser.role === 'hr') && (
                  <span className="text-[11px] font-mono text-slate-500">
                    Team status: {assignedTeamCount} assigned
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate Modal */}
      {celebratingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-amber-300 w-full max-w-lg p-8 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setCelebratingCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 mx-auto flex items-center justify-center text-amber-700 mb-4 shadow-sm">
              <Award className="w-8 h-8" />
            </div>

            <p className="text-xs uppercase tracking-widest font-bold text-amber-700">Certificate of Completion</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2 font-serif">StaffSync Enterprise Academy</h3>

            <div className="my-6 py-4 border-y border-amber-200/80">
              <p className="text-xs text-slate-500">This verifies that</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{currentUser.name}</p>
              <p className="text-xs text-slate-600 mt-2">has successfully completed all requirements for</p>
              <p className="text-sm font-semibold text-indigo-700 mt-1">{celebratingCertificate.title}</p>
              <p className="text-xs text-slate-500 font-mono mt-2">
                Issued on {new Date().toISOString().split('T')[0]} · Verification ID: CERT-{Date.now().toString().slice(-6)}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCelebratingCertificate(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Training Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Team Training Program</h3>
                <p className="text-xs text-slate-500">Curated by {currentUser.name} ({currentUser.role.toUpperCase()})</p>
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
                <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed System Design with MongoDB & Node.js"
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
                    onChange={(e) => setCategory(e.target.value as TrainingProgram['category'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Compliance">Compliance</option>
                    <option value="HR & Culture">HR & Culture</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Instructor *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arthur Vance"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Modules</label>
                  <input
                    type="number"
                    value={modulesCount}
                    onChange={(e) => setModulesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as TrainingProgram['level'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Syllabus Overview</label>
                <textarea
                  rows={3}
                  placeholder="Outline key learning outcomes, prerequisites, and evaluation benchmarks..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Assign to Team Members</label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 rounded-lg p-2 bg-slate-50">
                  {employees.map(emp => (
                    <label key={emp.id} className="flex items-center gap-2 text-xs p-1 hover:bg-white rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assignedEmpIds.includes(emp.id)}
                        onChange={() => toggleEmpAssignment(emp.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-slate-800">{emp.name}</span>
                      <span className="text-slate-400">({emp.department} · {emp.designation})</span>
                    </label>
                  ))}
                </div>
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
                  Publish & Assign Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
