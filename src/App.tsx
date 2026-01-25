import { useEffect, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ShieldCheck, Sparkle } from '@phosphor-icons/react';
import { EmployeeHeader } from '@/components/EmployeeHeader';
import { LeaveBalanceCard } from '@/components/LeaveBalanceCard';
import { LeaveRequestList } from '@/components/LeaveRequestList';
import { LeaveRequestDialog } from '@/components/LeaveRequestDialog';
import { LeaveCalendar } from '@/components/LeaveCalendar';
import { EmailNotificationCard } from '@/components/EmailNotificationCard';
import { Employee, LeaveRequest } from '@/lib/types';
import { getTotalLeaveDays, getTotalOffsetDays } from '@/lib/leave-utils';
import { sendManagerNotification, EmailNotification } from '@/lib/email-service';

function App() {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [employees] = useKV<Employee[]>('employees', []);
  const [leaveRequests, setLeaveRequests] = useKV<LeaveRequest[]>('leave-requests', []);
  const [emailNotifications, setEmailNotifications] = useKV<EmailNotification[]>('email-notifications', []);
  const [lastNotification, setLastNotification] = useState<EmailNotification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmployee() {
      try {
        const user = await window.spark.user();
        
        if (!user) {
          throw new Error('User not found');
        }
        
        const employee = employees?.find(emp => emp.email === user.email);
        
        if (employee) {
          setCurrentEmployee(employee);
        } else {
          setCurrentEmployee({
            id: String(user.id),
            name: user.login || 'Unknown User',
            email: user.email || 'unknown@company.ae',
            department: 'General',
            leaveBalance: 30,
            offsetBalance: 5,
          });
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        setCurrentEmployee({
          id: 'demo-user',
          name: 'Demo User',
          email: 'demo@company.ae',
          department: 'General',
          leaveBalance: 30,
          offsetBalance: 5,
        });
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [employees]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!currentEmployee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Alert>
          <AlertDescription>
            Unable to load employee profile. Please contact HR.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const myRequests = (leaveRequests || []).filter(req => req.employeeId === currentEmployee.id);
  const usedDays = getTotalLeaveDays(myRequests);
  const usedOffsetDays = getTotalOffsetDays(myRequests);
  const remainingBalance = currentEmployee.leaveBalance - usedDays;
  const remainingOffsetBalance = (currentEmployee.offsetBalance || 0) - usedOffsetDays;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <EmployeeHeader employee={currentEmployee} onUpdateEmployee={handleUpdateEmployee} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Alert className="bg-secondary/50 border-primary/20">
            <ShieldCheck size={20} className="text-primary" weight="fill" />
            <AlertDescription className="text-sm">
              <span className="font-semibold">Confidentiality Notice:</span> Your leave data is private and visible only to you and HR. 
              Department calendars show leave counts without identifying individuals, ensuring full compliance with UAE data protection regulations.
            </AlertDescription>
          </Alert>
        </motion.div>

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

            {myRequests.length === 0 && (
              <Alert className="bg-primary/5 border-primary/20">
                <Sparkle size={20} weight="fill" className="text-primary" />
                <AlertDescription className="text-sm">
                  <span className="font-semibold">Welcome to Leave Planner 2026! 👋</span>
                  <p className="mt-1 text-muted-foreground">
                    Plan your annual leave by clicking "Request Leave" below. Select your dates on the calendar and submit for approval.
                    {!currentEmployee.managerEmail && " Note: Configure your manager's email in Settings to enable notifications."}
                  </p>
                </AlertDescription>
              </Alert>
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
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <LeaveCalendar requests={myRequests} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <LeaveRequestList requests={myRequests} />
        </motion.div>
      </div>
    </div>
  );
}

export default App