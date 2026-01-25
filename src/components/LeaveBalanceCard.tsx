import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LeaveRequest, Employee } from '@/lib/types';
import { getTotalLeaveDays, getTotalOffsetDays } from '@/lib/leave-utils';

interface LeaveBalanceCardProps {
  employee: Employee;
  requests: LeaveRequest[];
}

export function LeaveBalanceCard({ employee, requests }: LeaveBalanceCardProps) {
  const totalBalance = employee.leaveBalance;
  const offsetBalance = employee.offsetBalance || 0;
  
  const usedDays = getTotalLeaveDays(requests);
  const usedOffsetDays = getTotalOffsetDays(requests);
  
  const remainingDays = totalBalance - usedDays;
  const remainingOffsetDays = offsetBalance - usedOffsetDays;
  const percentage = (remainingDays / totalBalance) * 100;
  
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getStatusColor = () => {
    if (percentage >= 50) return 'text-primary';
    if (percentage >= 20) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Leave Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Annual Leave Allocation</p>
                <p className="text-2xl font-bold">{totalBalance} days</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Used/Pending</p>
                  <p className="text-xl font-semibold">{usedDays} days</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                  <p className={`text-xl font-semibold ${getStatusColor()}`}>
                    {remainingDays} days
                  </p>
                </div>
              </div>

              {offsetBalance > 0 && (
                <div className="p-4 bg-secondary/30 rounded-lg border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-2">Offset Days (Carried Over)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold text-accent">{offsetBalance} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className="text-lg font-semibold text-accent">{remainingOffsetDays} days</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative h-40 w-40 flex-shrink-0">
            <svg className="transform -rotate-90 h-40 w-40">
              <circle
                cx="80"
                cy="80"
                r="54"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-muted"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="54"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={getStatusColor()}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getStatusColor()}`}>
                {Math.round(percentage)}%
              </span>
              <span className="text-xs text-muted-foreground mt-1">Available</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
