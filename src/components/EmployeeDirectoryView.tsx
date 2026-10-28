import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Employee, UserRole } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  ShieldCheck, 
  UserCheck, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const EmployeeDirectoryView: React.FC = () => {
  const { employees, addEmployee, updateEmployee, currentUser } = useHR();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // New employee form state
  const [formData, setFormData] = useState({
    empCode: `EMP-0${employees.length + 10}`,
    name: '',
    email: '',
    role: 'employee' as UserRole,
    department: 'Engineering',
    designation: '',
    phone: '+1 (555) 000-0000',
    salaryGrade: 'L4 - Mid Level',
    annualLeave: 15,
    sickLeave: 10,
    casualLeave: 5,
    emergencyName: '',
    emergencyRelationship: 'Spouse',
    emergencyPhone: '',
  });

  const departments = ['All', 'Engineering', 'Human Resources', 'Product Design', 'Marketing & Comms'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesRole = selectedRole === 'All' || emp.role === selectedRole;

    return matchesSearch && matchesDept && matchesRole;
  });

  const handleExportCSV = () => {
    const headers = ['Employee Code', 'Full Name', 'Email', 'Role', 'Department', 'Designation', 'Status', 'Join Date', 'Phone'];
    const rows = filteredEmployees.map(e => [
      e.empCode,
      `"${e.name}"`,
      e.email,
      e.role,
      `"${e.department}"`,
      `"${e.designation}"`,
      e.status,
      e.joinDate,
      `"${e.phone}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `staffsync_employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.designation) {
      alert('Please fill all required fields');
      return;
    }

    addEmployee({
      empCode: formData.empCode,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      designation: formData.designation,
      phone: formData.phone,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      salaryGrade: formData.salaryGrade,
      leaveBalance: {
        annual: Number(formData.annualLeave),
        sick: Number(formData.sickLeave),
        casual: Number(formData.casualLeave),
        maternityPaternity: 30,
      },
      emergencyContact: {
        name: formData.emergencyName || 'Emergency Contact',
        relationship: formData.emergencyRelationship,
        phone: formData.emergencyPhone || formData.phone,
      },
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Employee Directory & Records</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage enterprise personnel profiles, designations, and leave quotas
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          {(currentUser.role === 'hr' || currentUser.role === 'manager') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Onboard Employee
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, code, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employee List Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Role & Dept</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Leave Balances</th>
                <th className="py-3 px-4">Salary Band</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEmployees.map((emp) => (
                <tr 
                  key={emp.id} 
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  onClick={() => setSelectedEmployee(emp)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{emp.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{emp.empCode} · {emp.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{emp.designation}</p>
                    <p className="text-[11px] text-slate-500">{emp.department}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                      emp.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : emp.status === 'On Leave'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {emp.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600">
                      <span>Annual: <strong className="text-slate-900">{emp.leaveBalance.annual}d</strong></span>
                      <span>·</span>
                      <span>Sick: <strong className="text-slate-900">{emp.leaveBalance.sick}d</strong></span>
                      <span>·</span>
                      <span>Casual: <strong className="text-slate-900">{emp.leaveBalance.casual}d</strong></span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                    {emp.salaryGrade}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployee(emp);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Details Modal / Drawer */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedEmployee.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedEmployee.empCode} · {selectedEmployee.designation}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">Department</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedEmployee.department}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">System Access Role</span>
                  <p className="font-semibold text-slate-900 uppercase font-mono mt-0.5">{selectedEmployee.role}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">Work Email</span>
                  <p className="font-semibold text-slate-900 mt-0.5 truncate">{selectedEmployee.email}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">Phone</span>
                  <p className="font-semibold text-slate-900 mt-0.5 font-mono">{selectedEmployee.phone}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">Join Date</span>
                  <p className="font-semibold text-slate-900 mt-0.5 font-mono">{selectedEmployee.joinDate}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">Salary Grade</span>
                  <p className="font-semibold text-slate-900 mt-0.5 font-mono">{selectedEmployee.salaryGrade}</p>
                </div>
              </div>

              {/* Leave Balances Grid */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-900 text-xs mb-2">Leave Entitlement Quotas</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="border border-slate-200 rounded p-2">
                    <p className="text-[10px] text-slate-500">Annual</p>
                    <p className="text-base font-bold font-mono text-slate-900">{selectedEmployee.leaveBalance.annual}d</p>
                  </div>
                  <div className="border border-slate-200 rounded p-2">
                    <p className="text-[10px] text-slate-500">Sick</p>
                    <p className="text-base font-bold font-mono text-slate-900">{selectedEmployee.leaveBalance.sick}d</p>
                  </div>
                  <div className="border border-slate-200 rounded p-2">
                    <p className="text-[10px] text-slate-500">Casual</p>
                    <p className="text-base font-bold font-mono text-slate-900">{selectedEmployee.leaveBalance.casual}d</p>
                  </div>
                  <div className="border border-slate-200 rounded p-2">
                    <p className="text-[10px] text-slate-500">Mat/Pat</p>
                    <p className="text-base font-bold font-mono text-slate-900">{selectedEmployee.leaveBalance.maternityPaternity}d</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">Emergency Contact</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {selectedEmployee.emergencyContact.name} ({selectedEmployee.emergencyContact.relationship}) · <span className="font-mono">{selectedEmployee.emergencyContact.phone}</span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-slate-900">Onboard New Employee</h3>
                <p className="text-xs text-slate-500">Register employee record in StaffSync database</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.empCode}
                    onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@staffsync.corp"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Backend Engineer"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Marketing & Comms">Marketing & Comms</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Access Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase font-mono"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR Administrator</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Leave Entitlement Allocation (Days/Year)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Annual Leave</label>
                    <input
                      type="number"
                      value={formData.annualLeave}
                      onChange={(e) => setFormData({ ...formData, annualLeave: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Sick Leave</label>
                    <input
                      type="number"
                      value={formData.sickLeave}
                      onChange={(e) => setFormData({ ...formData, sickLeave: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Casual Leave</label>
                    <input
                      type="number"
                      value={formData.casualLeave}
                      onChange={(e) => setFormData({ ...formData, casualLeave: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Emergency Contact</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Contact Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={formData.emergencyName}
                      onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g. Spouse / Parent"
                      value={formData.emergencyRelationship}
                      onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors"
                >
                  Save Employee Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
