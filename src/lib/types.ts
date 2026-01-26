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
  employeeId: string; // Employee ID for login (e.g., "EMP001")
  name: string;
  email?: string;
  department: string;
  leaveBalance: number;
  offsetBalance?: number;
  managerId?: string;
  managerEmail?: string;
  dateOfBirth: string; // DOB as password in format "DDMMYYYY"
}

export interface PublicHoliday {
  date: string;
  name: string;
  type: string;
}
