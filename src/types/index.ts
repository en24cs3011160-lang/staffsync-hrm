export type UserRole = 'hr' | 'manager' | 'employee';

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  managerId?: string;
  managerName?: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Probation' | 'Inactive';
  phone: string;
  avatar: string;
  leaveBalance: {
    annual: number;
    sick: number;
    casual: number;
    maternityPaternity: number;
  };
  salaryGrade: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Emergency' | 'Maternity/Paternity';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerComment?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  status: 'Present' | 'Late' | 'Half Day' | 'Absent' | 'On Leave';
  location?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Company Update' | 'Policy' | 'Event' | 'Holiday' | 'Training';
  priority: 'Normal' | 'Important' | 'Urgent';
  authorName: string;
  authorRole: string;
  date: string;
  targetDepartment: string;
  pinned: boolean;
  acknowledgements: string[];
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  category: 'Engineering' | 'Design' | 'Leadership' | 'Compliance' | 'HR & Culture';
  instructor: string;
  durationHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  assignedEmployeeIds: string[];
  progressByEmployee: Record<string, number>; // employeeId -> percentage (0 - 100)
  modulesCount: number;
  deadline: string;
}

export interface EpicItem {
  id: string;
  title: string;
  description: string;
  storiesCount: number;
  progress: number;
  tasks: {
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'todo';
    component: string;
  }[];
}
