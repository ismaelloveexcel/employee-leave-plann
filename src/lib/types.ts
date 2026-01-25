export type LeaveType = 'annual' | 'sick' | 'emergency';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  status: LeaveStatus;
  notes?: string;
  submittedAt: string;
  totalDays: number;
  offsetDays?: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  leaveBalance: number;
  offsetBalance?: number;
  managerId?: string;
  managerEmail?: string;
}

export interface PublicHoliday {
  date: string;
  name: string;
  type: string;
}
