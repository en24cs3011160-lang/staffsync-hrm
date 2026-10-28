import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Employee, 
  LeaveRequest, 
  AttendanceRecord, 
  Announcement, 
  TrainingProgram, 
  EpicItem,
  LeaveType,
  LeaveStatus,
  UserRole
} from '../types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_LEAVES, 
  INITIAL_ATTENDANCE, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_TRAININGS,
  PROJECT_EPICS
} from '../data/mockData';

interface HRContextType {
  currentUser: Employee;
  setCurrentUser: (emp: Employee) => void;
  switchUserById: (id: string) => void;
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  leaves: LeaveRequest[];
  applyLeave: (leave: { type: LeaveType; startDate: string; endDate: string; reason: string; days: number }) => void;
  reviewLeave: (leaveId: string, status: LeaveStatus, comment?: string) => void;
  attendance: AttendanceRecord[];
  isClockedIn: boolean;
  activeClockInTime: string | null;
  clockInSeconds: number;
  handleClockIn: (location?: string) => void;
  handleClockOut: () => void;
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'date' | 'acknowledgements'>) => void;
  togglePinAnnouncement: (id: string) => void;
  acknowledgeAnnouncement: (id: string) => void;
  trainings: TrainingProgram[];
  updateTrainingProgress: (trainingId: string, employeeId: string, progress: number) => void;
  addTrainingProgram: (training: Omit<TrainingProgram, 'id' | 'progressByEmployee'>) => void;
  epics: EpicItem[];
  activeNav: string;
  setActiveNav: (nav: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
  resetAllData: () => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EMPLOYEES: 'staffsync_employees_v1',
  LEAVES: 'staffsync_leaves_v1',
  ATTENDANCE: 'staffsync_attendance_v1',
  ANNOUNCEMENTS: 'staffsync_announcements_v1',
  TRAININGS: 'staffsync_trainings_v1',
  CURRENT_USER_ID: 'staffsync_user_id_v1',
  CLOCK_IN_DATA: 'staffsync_clock_in_v1',
};

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return saved || 'emp-101'; // Default to Priya Sharma (HR)
    } catch {
      return 'emp-101';
    }
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
      return saved ? JSON.parse(saved) : INITIAL_LEAVES;
    } catch {
      return INITIAL_LEAVES;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [trainings, setTrainings] = useState<TrainingProgram[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRAININGS);
      return saved ? JSON.parse(saved) : INITIAL_TRAININGS;
    } catch {
      return INITIAL_TRAININGS;
    }
  });

  const [epics] = useState<EpicItem[]>(PROJECT_EPICS);
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clock in state for the active user
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [activeClockInTime, setActiveClockInTime] = useState<string | null>(null);
  const [clockInSeconds, setClockInSeconds] = useState<number>(0);

  // Derive current user object
  const currentUser = employees.find(e => e.id === currentUserId) || employees[0];

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  // Load clock-in status for currentUser
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.CLOCK_IN_DATA}_${currentUserId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isClockedIn && parsed.startTime) {
          setIsClockedIn(true);
          setActiveClockInTime(parsed.formattedTime);
          const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
          setClockInSeconds(Math.max(0, elapsed));
        } else {
          setIsClockedIn(false);
          setActiveClockInTime(null);
          setClockInSeconds(0);
        }
      } else {
        // Check if there's today's record in attendance
        const todayStr = new Date().toISOString().split('T')[0];
        const userAtt = attendance.find(a => a.employeeId === currentUserId && a.date === todayStr);
        if (userAtt && !userAtt.clockOut && userAtt.clockIn !== '-') {
          setIsClockedIn(true);
          setActiveClockInTime(userAtt.clockIn);
          setClockInSeconds(3600 * 2.5); // approximate default for demo
        } else {
          setIsClockedIn(false);
          setActiveClockInTime(null);
          setClockInSeconds(0);
        }
      }
    } catch {
      setIsClockedIn(false);
    }
  }, [currentUserId, attendance]);

  // Clock in timer tick
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isClockedIn) {
      timer = setInterval(() => {
        setClockInSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isClockedIn]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const clearToast = () => setToastMessage(null);

  const switchUserById = (id: string) => {
    const target = employees.find(e => e.id === id);
    if (target) {
      setCurrentUserId(id);
      showToast(`Switched workspace role to ${target.name} (${target.role.toUpperCase()} - ${target.designation})`);
    }
  };

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
    };
    setEmployees(prev => [newEmp, ...prev]);
    showToast(`Successfully onboarded employee ${newEmp.name} (${newEmp.empCode})`);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    showToast('Employee profile updated successfully.');
  };

  const applyLeave = (leave: { type: LeaveType; startDate: string; endDate: string; reason: string; days: number }) => {
    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      department: currentUser.department,
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      days: leave.days,
      reason: leave.reason,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    };

    setLeaves(prev => [newReq, ...prev]);
    showToast(`Leave application (${leave.days} day${leave.days > 1 ? 's' : ''}) submitted for review.`);
  };

  const reviewLeave = (leaveId: string, status: LeaveStatus, comment?: string) => {
    setLeaves(prev => prev.map(l => {
      if (l.id === leaveId) {
        return {
          ...l,
          status,
          reviewedBy: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
          reviewedAt: new Date().toISOString(),
          reviewerComment: comment || (status === 'Approved' ? 'Approved by supervisor.' : 'Request declined.'),
        };
      }
      return l;
    }));

    // Deduct leave balance if approved
    if (status === 'Approved') {
      const targetLeave = leaves.find(l => l.id === leaveId);
      if (targetLeave) {
        setEmployees(prev => prev.map(e => {
          if (e.id === targetLeave.employeeId) {
            const key = targetLeave.type.toLowerCase().includes('annual') ? 'annual'
              : targetLeave.type.toLowerCase().includes('sick') ? 'sick'
              : targetLeave.type.toLowerCase().includes('casual') ? 'casual'
              : 'maternityPaternity';
            const currentBal = e.leaveBalance[key as keyof typeof e.leaveBalance] || 0;
            return {
              ...e,
              leaveBalance: {
                ...e.leaveBalance,
                [key]: Math.max(0, currentBal - targetLeave.days),
              },
            };
          }
          return e;
        }));
      }
    }

    showToast(`Leave request ${status.toLowerCase()} successfully.`);
  };

  const handleClockIn = (location = 'Office Workstation') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const todayStr = now.toISOString().split('T')[0];

    setIsClockedIn(true);
    setActiveClockInTime(timeStr);
    setClockInSeconds(0);

    localStorage.setItem(`${STORAGE_KEYS.CLOCK_IN_DATA}_${currentUser.id}`, JSON.stringify({
      isClockedIn: true,
      startTime: Date.now(),
      formattedTime: timeStr,
    }));

    // Upsert today's attendance record
    setAttendance(prev => {
      const existingIdx = prev.findIndex(a => a.employeeId === currentUser.id && a.date === todayStr);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          clockIn: timeStr,
          status: 'Present',
          location,
        };
        return copy;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${Date.now()}`,
          employeeId: currentUser.id,
          employeeName: currentUser.name,
          date: todayStr,
          clockIn: timeStr,
          status: 'Present',
          location,
        };
        return [newRecord, ...prev];
      }
    });

    showToast(`Clocked in at ${timeStr}. Have a productive day!`);
  };

  const handleClockOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const todayStr = now.toISOString().split('T')[0];
    const hours = Number((clockInSeconds / 3600).toFixed(2));

    setIsClockedIn(false);
    setActiveClockInTime(null);
    localStorage.removeItem(`${STORAGE_KEYS.CLOCK_IN_DATA}_${currentUser.id}`);

    setAttendance(prev => {
      return prev.map(a => {
        if (a.employeeId === currentUser.id && a.date === todayStr) {
          return {
            ...a,
            clockOut: timeStr,
            totalHours: hours > 0 ? hours : 8.0,
          };
        }
        return a;
      });
    });

    showToast(`Clocked out at ${timeStr}. Logged ${hours || 8} hours.`);
  };

  const addAnnouncement = (data: Omit<Announcement, 'id' | 'date' | 'acknowledgements'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      acknowledgements: [],
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    showToast('New announcement published to the company board.');
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  };

  const acknowledgeAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === id) {
        const hasAck = a.acknowledgements.includes(currentUser.id);
        const acks = hasAck 
          ? a.acknowledgements.filter(uid => uid !== currentUser.id)
          : [...a.acknowledgements, currentUser.id];
        return { ...a, acknowledgements: acks };
      }
      return a;
    }));
  };

  const updateTrainingProgress = (trainingId: string, employeeId: string, progress: number) => {
    setTrainings(prev => prev.map(t => {
      if (t.id === trainingId) {
        return {
          ...t,
          progressByEmployee: {
            ...t.progressByEmployee,
            [employeeId]: Math.min(100, Math.max(0, progress)),
          },
        };
      }
      return t;
    }));
    showToast(`Training progress updated to ${progress}%.`);
  };

  const addTrainingProgram = (data: Omit<TrainingProgram, 'id' | 'progressByEmployee'>) => {
    const newProg: TrainingProgram = {
      ...data,
      id: `train-${Date.now()}`,
      progressByEmployee: {},
    };
    setTrainings(prev => [newProg, ...prev]);
    showToast(`Training program "${newProg.title}" created.`);
  };

  const resetAllData = () => {
    localStorage.clear();
    setEmployees(INITIAL_EMPLOYEES);
    setLeaves(INITIAL_LEAVES);
    setAttendance(INITIAL_ATTENDANCE);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setTrainings(INITIAL_TRAININGS);
    setCurrentUserId('emp-101');
    setIsClockedIn(false);
    setActiveClockInTime(null);
    setClockInSeconds(0);
    showToast('All StaffSync sample data restored to fresh state.');
  };

  return (
    <HRContext.Provider
      value={{
        currentUser,
        setCurrentUser: (emp) => setCurrentUserId(emp.id),
        switchUserById,
        employees,
        addEmployee,
        updateEmployee,
        leaves,
        applyLeave,
        reviewLeave,
        attendance,
        isClockedIn,
        activeClockInTime,
        clockInSeconds,
        handleClockIn,
        handleClockOut,
        announcements,
        addAnnouncement,
        togglePinAnnouncement,
        acknowledgeAnnouncement,
        trainings,
        updateTrainingProgress,
        addTrainingProgram,
        epics,
        activeNav,
        setActiveNav,
        toastMessage,
        showToast,
        clearToast,
        resetAllData,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
};
