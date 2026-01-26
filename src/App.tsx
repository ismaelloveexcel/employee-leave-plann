import { useEffect, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from '@phosphor-icons/react';
import { EmployeeHeader } from '@/components/EmployeeHeader';
import { LeaveBalanceCard } from '@/components/LeaveBalanceCard';
import { LeaveRequestList } from '@/components/LeaveRequestList';
import { LeaveRequestDialog } from '@/components/LeaveRequestDialog';
import { LeaveCalendar } from '@/components/LeaveCalendar';
import { EmailNotificationCard } from '@/components/EmailNotificationCard';
import { LoginForm } from '@/components/LoginForm';
import { Leave2025ConfirmationCard } from '@/components/Leave2025ConfirmationCard';
import { LeaveSummaryChart } from '@/components/LeaveSummaryChart';
import { ExportToPdf } from '@/components/ExportToPdf';
import { ManagerView } from '@/components/ManagerView';
import { Employee, LeaveRequest, Leave2025Record, ConfirmationStatus, AuditRecord } from '@/lib/types';
import { getTotalLeaveDays, getTotalOffsetDays } from '@/lib/leave-utils';
import { sendManagerNotification, EmailNotification } from '@/lib/email-service';

// Sample 2025 leave records - in production, this would come from backend
const SAMPLE_LEAVE_2025: Record<string, Leave2025Record[]> = {
  '1': [
    { month: 'Jan 25', leavesAvailed: 2 },
    { month: 'Feb 25', leavesAvailed: 0 },
    { month: 'Mar 25', leavesAvailed: 3 },
    { month: 'Apr 25', leavesAvailed: 1 },
    { month: 'May 25', leavesAvailed: 5 },
    { month: 'Jun 25', leavesAvailed: 0 },
    { month: 'Jul 25', leavesAvailed: 4 },
    { month: 'Aug 25', leavesAvailed: 2 },
    { month: 'Sep 25', leavesAvailed: 0 },
    { month: 'Oct 25', leavesAvailed: 1 },
    { month: 'Nov 25', leavesAvailed: 0 },
    { month: 'Dec 25', leavesAvailed: 3 },
  ],
  '2': [
    { month: 'Jan 25', leavesAvailed: 1 },
    { month: 'Feb 25', leavesAvailed: 2 },
    { month: 'Mar 25', leavesAvailed: 0 },
    { month: 'Apr 25', leavesAvailed: 0 },
    { month: 'May 25', leavesAvailed: 4 },
    { month: 'Jun 25', leavesAvailed: 3 },
    { month: 'Jul 25', leavesAvailed: 5 },
    { month: 'Aug 25', leavesAvailed: 0 },
    { month: 'Sep 25', leavesAvailed: 2 },
    { month: 'Oct 25', leavesAvailed: 0 },
    { month: 'Nov 25', leavesAvailed: 1 },
    { month: 'Dec 25', leavesAvailed: 2 },
  ],
  '3': [
    { month: 'Jan 25', leavesAvailed: 0 },
    { month: 'Feb 25', leavesAvailed: 1 },
    { month: 'Mar 25', leavesAvailed: 2 },
    { month: 'Apr 25', leavesAvailed: 0 },
    { month: 'May 25', leavesAvailed: 3 },
    { month: 'Jun 25', leavesAvailed: 2 },
    { month: 'Jul 25', leavesAvailed: 0 },
    { month: 'Aug 25', leavesAvailed: 4 },
    { month: 'Sep 25', leavesAvailed: 1 },
    { month: 'Oct 25', leavesAvailed: 0 },
    { month: 'Nov 25', leavesAvailed: 2 },
    { month: 'Dec 25', leavesAvailed: 0 },
  ],
};

// Sample employees data - in production, this would come from a database
// Based on the comprehensive HR data structure
const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employeeId: 'BAYN00002',
    name: 'Syed Irfan Ali',
    email: 'syed.irfan@baynunah.ae',
    entity: 'Baynunah Watergeneration Technologies SP LLC',
    department: 'Sales- Machines Sales & After Sales',
    position: 'Regional Director- Sales & Aftersales',
    location: 'Head Office',
    workSchedule: '5 days',
    joiningDate: '27-Feb-23',
    sixMonthEvalDate: '26-Aug-23',
    probationStatus: 'Confirmed',
    employmentStatus: 'Active',
    annualLeaveEntitlement: 27,
    extraHoursCompensation: 'N/A',
    openingBalanceFromPreviousYear: 5,
    leaveBalance: 27,
    offsetBalance: 0,
    dateOfBirth: '15031990',
    isManager: true,
  },
  {
    id: '2',
    employeeId: 'BAYN00003',
    name: 'Michael Rutman',
    email: 'Michael.Rutman@baynunah.ae',
    entity: 'Baynunah Watergeneration Technologies SP LLC',
    department: 'Management',
    position: 'CEO',
    location: 'Head Office',
    workSchedule: '5 days',
    joiningDate: '01-Apr-23',
    sixMonthEvalDate: '28-Sep-23',
    probationStatus: 'Confirmed',
    employmentStatus: 'Active',
    annualLeaveEntitlement: 35,
    extraHoursCompensation: 'N/A',
    openingBalanceFromPreviousYear: 10,
    leaveBalance: 35,
    offsetBalance: 0,
    dateOfBirth: '22071985',
    isManager: true,
  },
  {
    id: '3',
    employeeId: 'BAYN00004',
    name: 'Imelda Basco Marcelo',
    email: 'Imelda.Marcelo@baynunah.ae',
    entity: 'Baynunah Watergeneration Technologies SP LLC',
    department: 'Sales- Machines Sales & After Sales',
    position: 'Administrative Assistant',
    location: 'Head Office',
    workSchedule: '5 days',
    joiningDate: '01-Apr-23',
    sixMonthEvalDate: '28-Sep-23',
    probationStatus: 'Confirmed',
    employmentStatus: 'Active',
    annualLeaveEntitlement: 22,
    extraHoursCompensation: 'Offset',
    openingBalanceFromPreviousYear: 3,
    leaveBalance: 22,
    offsetBalance: 5,
    dateOfBirth: '10121988',
  },
  {
    id: '4',
    employeeId: 'BAYN00006',
    name: 'Amro Aly Asmael',
    email: 'amro@baynunah.ae',
    entity: 'Baynunah Watergeneration Technologies SP LLC',
    department: 'Marketing',
    position: 'Marketing Director',
    location: 'Head Office',
    workSchedule: '5 days',
    joiningDate: '15-May-23',
    sixMonthEvalDate: '14-Nov-23',
    probationStatus: 'Confirmed',
    employmentStatus: 'Active',
    annualLeaveEntitlement: 30,
    extraHoursCompensation: 'N/A',
    openingBalanceFromPreviousYear: 8,
    leaveBalance: 30,
    offsetBalance: 0,
    dateOfBirth: '05061982',
    isManager: true,
  },
];

function App() {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [employees] = useKV<Employee[]>('employees', SAMPLE_EMPLOYEES);
  const [leaveRequests, setLeaveRequests] = useKV<LeaveRequest[]>('leave-requests', []);
  const [emailNotifications, setEmailNotifications] = useKV<EmailNotification[]>('email-notifications', []);
  const [leave2025Records, setLeave2025Records] = useKV<Record<string, Leave2025Record[]>>('leave-2025-records', SAMPLE_LEAVE_2025);
  const [confirmationStatuses, setConfirmationStatuses] = useKV<Record<string, ConfirmationStatus>>('confirmation-statuses', {});
  const [auditRecords, setAuditRecords] = useKV<AuditRecord[]>('audit-records', []);
  const [lastNotification, setLastNotification] = useState<EmailNotification | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (session storage)
    const savedEmployeeId = sessionStorage.getItem('loggedInEmployeeId');
    if (savedEmployeeId && employees) {
      const employee = employees.find(emp => emp.id === savedEmployeeId);
      if (employee) {
        setCurrentEmployee(employee);
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, [employees]);

  const handleLogin = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsAuthenticated(true);
    // Save to session storage
    sessionStorage.setItem('loggedInEmployeeId', employee.id);
  };

  const handleLogout = () => {
    setCurrentEmployee(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('loggedInEmployeeId');
  };

  const handleLeaveRequestSubmit = async (request: Omit<LeaveRequest, 'id' | 'submittedAt'>) => {
    if (!currentEmployee) return;

    const newRequest: LeaveRequest = {
      ...request,
      id: `LR-${Date.now()}`,
      employeeId: currentEmployee.id,
      submittedAt: new Date().toISOString(),
    };

    setLeaveRequests(current => [...(current || []), newRequest]);

    const notification = await sendManagerNotification(
      currentEmployee,
      newRequest,
      currentEmployee.managerEmail
    );

    if (notification) {
      setEmailNotifications(current => [...(current || []), notification]);
      setLastNotification(notification);
      
      setTimeout(() => {
        setLastNotification(null);
      }, 10000);
    }
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setCurrentEmployee(updatedEmployee);
  };

  const handleConfirmBalance = () => {
    if (!currentEmployee) return;
    setConfirmationStatuses(current => ({
      ...current,
      [currentEmployee.id]: 'confirmed',
    }));
  };

  const handleRequestChange = (notes: string, updatedRecords: Leave2025Record[]) => {
    if (!currentEmployee) return;
    setConfirmationStatuses(current => ({
      ...current,
      [currentEmployee.id]: 'change_requested',
    }));
    // Store the proposed changes (in production, this would go to a review queue)
    setLeave2025Records(current => ({
      ...current,
      [`${currentEmployee.id}_proposed`]: updatedRecords,
    }));
  };

  const handleAddAuditRecord = (record: Omit<AuditRecord, 'id' | 'timestamp'>) => {
    const newRecord: AuditRecord = {
      ...record,
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditRecords(current => [...(current || []), newRecord]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated || !currentEmployee) {
    return (
      <LoginForm 
        employees={employees || SAMPLE_EMPLOYEES} 
        onLogin={handleLogin} 
      />
    );
  }

  const myRequests = (leaveRequests || []).filter(req => req.employeeId === currentEmployee.id);
  const usedDays = getTotalLeaveDays(myRequests);
  const usedOffsetDays = getTotalOffsetDays(myRequests);
  const remainingBalance = currentEmployee.leaveBalance - usedDays;
  const remainingOffsetBalance = (currentEmployee.offsetBalance || 0) - usedOffsetDays;
  const employeeLeave2025 = (leave2025Records || SAMPLE_LEAVE_2025)[currentEmployee.id] || [];
  const employeeConfirmationStatus = (confirmationStatuses || {})[currentEmployee.id] || 'pending';

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <EmployeeHeader employee={currentEmployee} onUpdateEmployee={handleUpdateEmployee} onLogout={handleLogout} />
        </motion.div>

        {/* Combined Notice Card - 2025 Confirmation & 2026 Planning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="bg-[#38b6ff]/10 border border-[#38b6ff]/30 rounded-lg p-4 space-y-4">
            {/* 1. 2025 Balance Confirmation Notice */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#38b6ff] text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold text-[#0f025d] text-base">
                  2025 Leave Balance Confirmation – Action Required
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Please verify your leave balance as of 31 December 2025.
                  If no discrepancy is reported, the balance will be considered final.
                </p>
              </div>
            </div>
            
            <div className="border-t border-[#38b6ff]/20" />
            
            {/* 2. 2026 Leave Planning Notice */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#38b6ff] text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold text-[#0f025d] text-base">
                  2026 Leave Planning
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Please submit your planned leave dates for forecasting purposes.
                  All annual leave requests remain subject to company policy and formal approval.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2026 Leave Planning Section - AT TOP */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            <LeaveBalanceCard employee={currentEmployee} requests={myRequests} />
            
            <div className="flex flex-wrap justify-center gap-3">
              <LeaveRequestDialog
                requests={myRequests}
                remainingBalance={remainingBalance}
                remainingOffsetBalance={remainingOffsetBalance}
                onSubmit={handleLeaveRequestSubmit}
              />
              <ExportToPdf 
                employee={currentEmployee} 
                requests={myRequests} 
                leave2025Records={employeeLeave2025}
              />
            </div>

            {lastNotification && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <EmailNotificationCard 
                  notification={lastNotification}
                  managerEmail={currentEmployee.managerEmail}
                />
              </motion.div>
            )}

            {remainingBalance < 5 && remainingBalance > 0 && (
              <Alert variant="destructive">
                <Info size={20} weight="fill" />
                <AlertDescription>
                  Your leave balance is running low. Only {remainingBalance} days remaining.
                </AlertDescription>
              </Alert>
            )}

            {remainingBalance <= 0 && remainingOffsetBalance <= 0 && (
              <Alert variant="destructive">
                <Info size={20} weight="fill" />
                <AlertDescription>
                  You have no remaining leave balance. Please contact HR for assistance.
                </AlertDescription>
              </Alert>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <LeaveCalendar requests={myRequests} />
          </motion.div>
        </div>

        {/* Leave Summary Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
        >
          <LeaveSummaryChart employee={currentEmployee} requests={myRequests} />
        </motion.div>

        {/* Manager View - only visible to managers */}
        {currentEmployee.isManager && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.29 }}
          >
            <ManagerView 
              currentEmployee={currentEmployee}
              allEmployees={employees || SAMPLE_EMPLOYEES}
              allRequests={leaveRequests || []}
            />
          </motion.div>
        )}

        {/* My Leave Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <LeaveRequestList requests={myRequests} />
        </motion.div>

        {/* 2025 Leave Confirmation Card - AT BOTTOM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Leave2025ConfirmationCard
            employee={currentEmployee}
            leave2025Records={employeeLeave2025}
            confirmationStatus={employeeConfirmationStatus}
            onConfirm={handleConfirmBalance}
            onRequestChange={handleRequestChange}
            onAddAuditRecord={handleAddAuditRecord}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default App