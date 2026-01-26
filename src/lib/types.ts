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

// 2025 Leave History for balance confirmation
export interface Leave2025Record {
  month: string; // "Jan 25", "Feb 25", etc.
  leavesAvailed: number;
}

export type ConfirmationStatus = 'pending' | 'confirmed' | 'change_requested';

export interface Leave2025Confirmation {
  employeeId: string;
  status: ConfirmationStatus;
  confirmedAt?: string;
  changeRequestedAt?: string;
  changeRequestNotes?: string;
  records: Leave2025Record[];
}

// Audit record for tracking changes
export interface AuditRecord {
  id: string;
  employeeId: string;
  action: 'confirm_balance' | 'request_change' | 'edit_leave' | 'admin_update';
  previousValue?: string;
  newValue?: string;
  notes?: string;
  timestamp: string;
  performedBy: string;
}

export interface Employee {
  id: string;
  employeeId: string; // Employee ID for login (e.g., "EMP001")
  name: string;
  email?: string;
  department: string;
  position?: string; // Job title/position
  entity?: string; // Company/entity name
  leaveBalance: number;
  offsetBalance?: number;
  managerId?: string;
  managerEmail?: string;
  dateOfBirth: string; // DOB as password in format "DDMMYYYY"
  leave2025Confirmation?: Leave2025Confirmation;
  isManager?: boolean; // Flag to identify managers
}

export interface PublicHoliday {
  date: string;
  name: string;
  type: string;
}
