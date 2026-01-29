/**
 * Data Sync Service for Employee Leave Planner
 * 
 * This service provides automated data synchronization between:
 * - Excel/CSV files (HR uploads)
 * - SharePoint (optional cloud storage)
 * - Azure SQL/Cosmos DB (production backend)
 * 
 * For Azure deployment, replace the local storage with Azure services.
 */

import { Employee, MonthlyLeaveRecord, Leave2025Record, AuditRecord } from './types';

// API Configuration (set these for Azure deployment)
export const API_CONFIG = {
  // Azure Function URLs (replace with your actual endpoints)
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  employeesEndpoint: '/api/employees',
  leaveRequestsEndpoint: '/api/leave-requests',
  auditEndpoint: '/api/audit',
  syncEndpoint: '/api/sync',
  
  // SharePoint configuration (optional)
  sharePointSiteUrl: import.meta.env.VITE_SHAREPOINT_SITE_URL || '',
  sharePointListName: 'EmployeeLeaveData',
  
  // Sync settings
  autoSyncInterval: 5 * 60 * 1000, // 5 minutes
  enableAutoSync: true,
};

// Parse date from various formats
function parseDate(dateStr: string): string {
  if (!dateStr) return '';
  
  // Handle DD-MMM-YY format (e.g., "27-Feb-23")
  const dmy = dateStr.match(/(\d{1,2})-(\w{3})-(\d{2})/);
  if (dmy) {
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const year = parseInt(dmy[3]) > 50 ? `19${dmy[3]}` : `20${dmy[3]}`;
    return `${year}-${months[dmy[2]]}-${dmy[1].padStart(2, '0')}`;
  }
  
  return dateStr;
}

// Convert Excel row to Employee object
export function parseExcelRowToEmployee(row: Record<string, unknown>): Employee | null {
  try {
    const employeeId = String(row['Employee No'] || row['EmployeeNo'] || row['employee_no'] || '');
    if (!employeeId) return null;
    
    // Parse DOB for authentication
    const joiningDateStr = String(row['Joining Date'] || row['JoiningDate'] || '');
    const joiningDate = parseDate(joiningDateStr);
    
    // Read DOB from row (fallback to demo default if missing)
    const dob = String(row['DOB'] || row['DateOfBirth'] || row['date_of_birth'] || '01011990');
    
    // Parse monthly leave data
    const monthlyLeaves: Employee['monthlyLeaves'] = {};
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                    'july', 'august', 'september', 'october', 'november', 'december'];
    
    months.forEach(month => {
      const annualKey = `${month.charAt(0).toUpperCase() + month.slice(1)} Annual` as keyof typeof row;
      const offsetKey = `${month.charAt(0).toUpperCase() + month.slice(1)} Offset` as keyof typeof row;
      
      const annualLeaves = Number(row[annualKey]) || 0;
      const offsetDays = Number(row[offsetKey]) || 0;
      
      if (annualLeaves > 0 || offsetDays > 0) {
        (monthlyLeaves as Record<string, MonthlyLeaveRecord>)[month] = { annualLeaves, offsetDays };
      }
    });
    
    const employee: Employee = {
      id: employeeId,
      employeeId: employeeId,
      name: String(row['Employee Name'] || row['EmployeeName'] || row['Name'] || 'Unknown'),
      email: String(row['Company Email Address'] || row['Email'] || ''),
      
      entity: String(row['Entity'] || row['Company'] || ''),
      department: String(row['Department'] || ''),
      position: String(row['Job Title'] || row['Position'] || row['JobTitle'] || ''),
      location: String(row['Location'] || 'Head Office'),
      
      workSchedule: (String(row['Work Schedule'] || '5 days') as Employee['workSchedule']),
      joiningDate: joiningDate,
      sixMonthEvalDate: parseDate(String(row['6 Month Eval Date'] || '')),
      probationStatus: (String(row['Probation Status'] || 'Confirmed') as Employee['probationStatus']),
      employmentStatus: (String(row['Employment Status'] || 'Active') as Employee['employmentStatus']),
      
      annualLeaveEntitlement: Number(row['Annual Leave Entitlement']) || 22,
      extraHoursCompensation: (String(row['Extra Hours Compensation'] || 'N/A') as Employee['extraHoursCompensation']),
      openingBalanceFromPreviousYear: Number(row['Opening Balance from previous year']) || 0,
      leaveBalance: Number(row['Leave Balance'] || row['Current Balance']) || 22,
      offsetBalance: Number(row['Offset Balance']) || 0,
      
      monthlyLeaves,
      
      totalAnnualLeavesAccrued: Number(row['Total Accrual']) || 0,
      totalAnnualLeavesAvailed: Number(row['Total Availed']) || 0,
      totalOffsetDaysAccrued: Number(row['Offset Accrual']) || 0,
      totalOffsetDaysAvailed: Number(row['Offset Availed']) || 0,
      leaveBalanceEOY: Number(row['Leave Balance as of EOY']) || 0,
      offsetBalanceEOY: Number(row['Offset Balance EOY']) || 0,
      
      managerEmail: String(row['Manager Email'] || ''),
      isManager: String(row['Is Manager'] || '').toLowerCase() === 'yes',
      
      dateOfBirth: dob,
    };
    
    return employee;
  } catch (error) {
    console.error('Error parsing employee row:', error);
    return null;
  }
}

// Convert Employee to Leave2025Record array
export function generateLeave2025Records(employee: Employee): Leave2025Record[] {
  const months = [
    { key: 'january', label: 'Jan 25' },
    { key: 'february', label: 'Feb 25' },
    { key: 'march', label: 'Mar 25' },
    { key: 'april', label: 'Apr 25' },
    { key: 'may', label: 'May 25' },
    { key: 'june', label: 'Jun 25' },
    { key: 'july', label: 'Jul 25' },
    { key: 'august', label: 'Aug 25' },
    { key: 'september', label: 'Sep 25' },
    { key: 'october', label: 'Oct 25' },
    { key: 'november', label: 'Nov 25' },
    { key: 'december', label: 'Dec 25' },
  ];
  
  return months.map(({ key, label }) => {
    const monthData = employee.monthlyLeaves?.[key as keyof typeof employee.monthlyLeaves];
    return {
      month: label,
      leavesAvailed: monthData?.annualLeaves || 0,
    };
  });
}

// Local storage keys
const STORAGE_KEYS = {
  employees: 'leave_planner_employees',
  lastSync: 'leave_planner_last_sync',
  syncStatus: 'leave_planner_sync_status',
};

// Data Sync Service class
export class DataSyncService {
  private static instance: DataSyncService;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  
  private constructor() {}
  
  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService();
    }
    return DataSyncService.instance;
  }
  
  // Start auto-sync (only if base URL is configured)
  startAutoSync(): void {
    // Don't start auto-sync if no API is configured - avoids unnecessary timers
    if (API_CONFIG.enableAutoSync && API_CONFIG.baseUrl && !this.syncInterval) {
      this.syncInterval = setInterval(() => {
        this.syncFromRemote();
      }, API_CONFIG.autoSyncInterval);
    }
  }
  
  // Stop auto-sync
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
  
  // Sync from remote API (Azure/SharePoint)
  async syncFromRemote(): Promise<{ success: boolean; message: string }> {
    try {
      if (!API_CONFIG.baseUrl) {
        return { success: false, message: 'API not configured. Using local data.' };
      }
      
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.employeesEndpoint}`);
      if (!response.ok) throw new Error('Failed to fetch from API');
      
      const employees = await response.json();
      this.saveEmployeesToLocal(employees);
      this.updateSyncStatus('success', new Date().toISOString());
      
      return { success: true, message: `Synced ${employees.length} employees` };
    } catch {
      this.updateSyncStatus('error', new Date().toISOString());
      return { success: false, message: 'Sync failed. Using cached data.' };
    }
  }
  
  // Upload employees to remote API
  async uploadToRemote(employees: Employee[]): Promise<{ success: boolean; message: string }> {
    try {
      if (!API_CONFIG.baseUrl) {
        // Save locally only
        this.saveEmployeesToLocal(employees);
        return { success: true, message: 'Data saved locally (no API configured)' };
      }
      
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.syncEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employees }),
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      this.saveEmployeesToLocal(employees);
      this.updateSyncStatus('success', new Date().toISOString());
      
      return { success: true, message: `Uploaded ${employees.length} employees` };
    } catch {
      // Still save locally on error
      this.saveEmployeesToLocal(employees);
      return { success: false, message: 'Remote sync failed. Data saved locally.' };
    }
  }
  
  // Save employees to local storage (without sensitive dateOfBirth field)
  saveEmployeesToLocal(employees: Employee[]): void {
    // Remove dateOfBirth before persisting to localStorage to avoid storing PII
    const sanitizedEmployees = employees.map(emp => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { dateOfBirth, ...rest } = emp as Employee & { dateOfBirth?: string };
      return rest;
    });
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(sanitizedEmployees));
  }
  
  // Get employees from local storage, with fallback to initial data fetch
  async getEmployees(): Promise<Employee[]> {
    try {
      // 1. Try Local Storage
      const data = localStorage.getItem(STORAGE_KEYS.employees);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }

      // 2. Try Fetching Default Data (Seeding)
      console.log('No local data found. Fetching default data...');
      const response = await fetch('/data/employees.json');
      if (response.ok) {
        const defaultData = await response.json();
        this.saveEmployeesToLocal(defaultData); // Cache it
        return defaultData;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get employees:', error);
      return [];
    }
  }

  // Get employees from local storage (Synchronous version for direct access if needed)
  getEmployeesFromLocal(): Employee[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.employees);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If localStorage is corrupted, return empty array
      console.error('Failed to parse employees from localStorage');
      return [];
    }
  }
  
  // Update sync status
  private updateSyncStatus(status: 'success' | 'error', timestamp: string): void {
    localStorage.setItem(STORAGE_KEYS.lastSync, timestamp);
    localStorage.setItem(STORAGE_KEYS.syncStatus, status);
  }
  
  // Get sync status
  getSyncStatus(): { lastSync: string | null; status: string | null } {
    return {
      lastSync: localStorage.getItem(STORAGE_KEYS.lastSync),
      status: localStorage.getItem(STORAGE_KEYS.syncStatus),
    };
  }
  
  // Create audit record
  createAuditRecord(
    employeeId: string,
    action: AuditRecord['action'],
    performedBy: string,
    previousValue?: string,
    newValue?: string,
    notes?: string
  ): AuditRecord {
    // Use crypto.randomUUID() for better unique ID generation
    const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      ? crypto.randomUUID()
      : `AUDIT-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
    
    const record: AuditRecord = {
      id,
      employeeId,
      action,
      previousValue,
      newValue,
      notes,
      timestamp: new Date().toISOString(),
      performedBy,
    };
    
    // Save to local audit log
    const auditLog = this.getAuditLog();
    auditLog.push(record);
    localStorage.setItem('leave_planner_audit_log', JSON.stringify(auditLog));
    
    return record;
  }
  
  // Get audit log
  getAuditLog(): AuditRecord[] {
    try {
      const data = localStorage.getItem('leave_planner_audit_log');
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      console.error('Failed to parse audit log from localStorage');
      return [];
    }
  }
}

// Export singleton instance
export const dataSyncService = DataSyncService.getInstance();
