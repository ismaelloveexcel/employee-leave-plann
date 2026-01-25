import { useEffect, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ShieldCheck } from '@phosphor-icons/react';
import { EmployeeHeader } from '@/components/EmployeeHeader';
import { LeaveBalanceCard } from '@/components/LeaveBalanceCard';
import { LeaveRequestList } from '@/components/LeaveRequestList';
import { LeaveRequestDialog } from '@/components/LeaveRequestDialog';
import { LeaveCalendar } from '@/components/LeaveCalendar';
import { Employee, LeaveRequest } from '@/lib/types';
import { getTotalLeaveDays } from '@/lib/leave-utils';

function App() {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [employees] = useKV<Employee[]>('employees', []);
  const [leaveRequests, setLeaveRequests] = useKV<LeaveRequest[]>('leave-requests', []);
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
        });
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [employees]);

  const handleLeaveRequestSubmit = (request: Omit<LeaveRequest, 'id' | 'submittedAt'>) => {
    if (!currentEmployee) return;

    const newRequest: LeaveRequest = {
      ...request,
      id: `LR-${Date.now()}`,
      employeeId: currentEmployee.id,
      submittedAt: new Date().toISOString(),
    };

    setLeaveRequests(current => [...(current || []), newRequest]);
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
  const remainingBalance = currentEmployee.leaveBalance - usedDays;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <EmployeeHeader employee={currentEmployee} />
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
            <LeaveBalanceCard totalBalance={currentEmployee.leaveBalance} requests={myRequests} />
            
            <div className="flex justify-center">
              <LeaveRequestDialog
                requests={myRequests}
                remainingBalance={remainingBalance}
                onSubmit={handleLeaveRequestSubmit}
              />
            </div>

            {remainingBalance < 5 && remainingBalance > 0 && (
              <Alert variant="destructive">
                <Info size={20} weight="fill" />
                <AlertDescription>
                  Your leave balance is running low. Only {remainingBalance} days remaining.
                </AlertDescription>
              </Alert>
            )}

            {remainingBalance <= 0 && (
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