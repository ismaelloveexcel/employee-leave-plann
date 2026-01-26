import { useEffect, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, ShieldCheck, Sparkle, Warning, CalendarCheck } from '@phosphor-icons/react';
import { EmployeeHeader } from '@/components/EmployeeHeader';
import { LeaveBalanceCard } from '@/components/LeaveBalanceCard';
import { LeaveRequestList } from '@/components/LeaveRequestList';
import { LeaveRequestDialog } from '@/components/LeaveRequestDialog';
import { LeaveCalendar } from '@/components/LeaveCalendar';
import { EmailNotificationCard } from '@/components/EmailNotificationCard';
import { LoginForm } from '@/components/LoginForm';
import { Leave2025ConfirmationCard } from '@/components/Leave2025ConfirmationCard';
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
const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Ahmed Al Mansoori',
    email: 'ahmed@company.ae',
    department: 'Engineering',
    leaveBalance: 30,
    offsetBalance: 5,
    dateOfBirth: '15031990',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Fatima Hassan',
    email: 'fatima@company.ae',
    department: 'HR',
    leaveBalance: 30,
    offsetBalance: 3,
    dateOfBirth: '22071985',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Mohammed Ali',
    department: 'Operations',
    leaveBalance: 30,
    offsetBalance: 0,
    dateOfBirth: '10121988',
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
            {/* 2025 Balance Confirmation Notice */}
            <div className="flex gap-3">
              <Warning size={24} className="text-amber-600 flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <h3 className="font-semibold text-amber-800">
                  2025 Leave Balance Confirmation – Action Required
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  Please verify your leave balance as of 31 December 2025.
                  If no discrepancy is reported, the balance will be considered final.
                </p>
              </div>
            </div>
            
            <div className="border-t border-[#38b6ff]/20" />
            
            {/* 2026 Leave Planning Notice */}
            <div className="flex gap-3">
              <CalendarCheck size={24} className="text-[#38b6ff] flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <h3 className="font-semibold text-[#0f025d]">
                  2026 Leave Planning
                </h3>
                <p className="text-sm text-gray-700 mt-1">
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
            
            <div className="flex justify-center">
              <LeaveRequestDialog
                requests={myRequests}
                remainingBalance={remainingBalance}
                remainingOffsetBalance={remainingOffsetBalance}
                onSubmit={handleLeaveRequestSubmit}
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