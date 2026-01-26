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

// Monthly leave tracking for both Annual Leaves and Offset Days
export interface MonthlyLeaveRecord {
  annualLeaves: number;
  offsetDays: number;
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

// Employment status type
export type EmploymentStatus = 'Active' | 'Inactive' | 'On Leave' | 'Terminated';

// Probation status type
export type ProbationStatus = 'Confirmed' | 'Probation' | 'Extended Probation';

// Extra hours compensation type
export type ExtraHoursCompensation = 'N/A' | 'Offset' | 'Overtime Pay';

// Work schedule type
export type WorkSchedule = '5 days' | '6 days' | 'Shift';

// Comprehensive Employee interface with all HR fields
export interface Employee {
  id: string;
  employeeId: string; // Employee ID for login (e.g., "BAYN00002")
  name: string;
  email?: string;
  
  // Organization details
  entity: string; // Company/entity name (e.g., "Baynunah Watergeneration Technologies SP LLC")
  department: string;
  position: string; // Job title/position
  location?: string; // Office location (e.g., "Head Office")
  
  // Employment details
  workSchedule?: WorkSchedule;
  joiningDate?: string; // Format: "DD-MMM-YY"
  sixMonthEvalDate?: string; // 6 Month Evaluation Date
  probationStatus?: ProbationStatus;
  employmentStatus: EmploymentStatus;
  
  // Leave entitlements
  annualLeaveEntitlement: number; // Annual leave entitlement days
  extraHoursCompensation: ExtraHoursCompensation;
  openingBalanceFromPreviousYear?: number; // Leave carried over from last year
  leaveBalance: number; // Current leave balance (for backward compatibility)
  offsetBalance?: number; // Offset days balance
  
  // Monthly leave tracking (Jan-Dec)
  monthlyLeaves?: {
    january?: MonthlyLeaveRecord;
    february?: MonthlyLeaveRecord;
    march?: MonthlyLeaveRecord;
    april?: MonthlyLeaveRecord;
    may?: MonthlyLeaveRecord;
    june?: MonthlyLeaveRecord;
    july?: MonthlyLeaveRecord;
    august?: MonthlyLeaveRecord;
    september?: MonthlyLeaveRecord;
    october?: MonthlyLeaveRecord;
    november?: MonthlyLeaveRecord;
    december?: MonthlyLeaveRecord;
  };
  
  // Leave totals
  totalAnnualLeavesAccrued?: number;
  totalAnnualLeavesAvailed?: number;
  totalOffsetDaysAccrued?: number;
  totalOffsetDaysAvailed?: number;
  leaveBalanceEOY?: number; // Leave balance as of End of Year (Annual Leaves)
  offsetBalanceEOY?: number; // Offset balance as of End of Year
  
  // Management
  managerId?: string;
  managerEmail?: string;
  isManager?: boolean; // Flag to identify managers
  
  // Authentication
  dateOfBirth: string; // DOB as password in format "DDMMYYYY"
  
  // Confirmation
  leave2025Confirmation?: Leave2025Confirmation;
}

export interface PublicHoliday {
  date: string;
  name: string;
  type: string;
}
