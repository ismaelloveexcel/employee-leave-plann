import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LeaveRequest } from '@/lib/types';
import { getTotalLeaveDays } from '@/lib/leave-utils';

interface LeaveBalanceCardProps {
  totalBalance: number;
  requests: LeaveRequest[];
}

export function LeaveBalanceCard({ totalBalance, requests }: LeaveBalanceCardProps) {
  const usedDays = getTotalLeaveDays(requests);
  const remainingDays = totalBalance - usedDays;
  const percentage = (remainingDays / totalBalance) * 100;
  
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getStatusColor = () => {
    if (percentage >= 50) return 'text-primary';
    if (percentage >= 20) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Leave Balance</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex-1">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Allocation</p>
              <p className="text-2xl font-bold">{totalBalance} days</p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Used/Pending</p>
                <p className="text-lg font-semibold">{usedDays} days</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`text-lg font-semibold ${getStatusColor()}`}>
                  {remainingDays} days
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-32 w-32">
          <svg className="transform -rotate-90 h-32 w-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
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
            <span className={`text-3xl font-bold ${getStatusColor()}`}>
              {Math.round(percentage)}%
            </span>
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
