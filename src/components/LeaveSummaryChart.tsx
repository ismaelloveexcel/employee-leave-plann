import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartPie } from '@phosphor-icons/react';
import { LeaveRequest, Employee } from '@/lib/types';
import { getTotalLeaveDays } from '@/lib/leave-utils';

interface LeaveSummaryChartProps {
  employee: Employee;
  requests: LeaveRequest[];
}

export function LeaveSummaryChart({ employee, requests }: LeaveSummaryChartProps) {
  // Use new field names
  const annualLeaveEntitlement = employee.annualLeaveEntitlement || employee.leaveBalance;
  const leaveCarriedOver = employee.openingBalanceFromPreviousYear || 0;
  const totalAvailable = annualLeaveEntitlement + leaveCarriedOver;
  
  const usedDays = getTotalLeaveDays(requests);
  const remainingDays = totalAvailable - usedDays;
  const pendingDays = requests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.totalDays, 0);
  const approvedDays = requests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.totalDays, 0);

  // Calculate percentages for the bar
  const approvedPercent = (approvedDays / totalAvailable) * 100;
  const pendingPercent = (pendingDays / totalAvailable) * 100;
  const remainingPercent = (remainingDays / totalAvailable) * 100;

  // Group leaves by month for 2026
  const leavesByMonth: Record<string, number> = {};
  requests.forEach(request => {
    const startDate = new Date(request.startDate);
    const monthKey = startDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    leavesByMonth[monthKey] = (leavesByMonth[monthKey] || 0) + request.totalDays;
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ChartPie size={20} weight="fill" className="text-[#38b6ff]" />
          <CardTitle className="text-lg">Leave Summary Dashboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Leave Balance Bar */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Leave Balance Overview</p>
          <div className="h-8 w-full bg-gray-100 rounded-full overflow-hidden flex">
            {approvedDays > 0 && (
              <div 
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${approvedPercent}%` }}
                title={`Approved: ${approvedDays} days`}
              />
            )}
            {pendingDays > 0 && (
              <div 
                className="bg-amber-400 h-full transition-all duration-500"
                style={{ width: `${pendingPercent}%` }}
                title={`Pending: ${pendingDays} days`}
              />
            )}
            <div 
              className="bg-[#38b6ff] h-full transition-all duration-500"
              style={{ width: `${remainingPercent}%` }}
              title={`Remaining: ${remainingDays} days`}
            />
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Approved ({approvedDays} days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span>Pending ({pendingDays} days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#38b6ff]" />
              <span>Remaining ({remainingDays} days)</span>
            </div>
          </div>
        </div>

        {/* Monthly Distribution */}
        {Object.keys(leavesByMonth).length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Planned Leave by Month</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Object.entries(leavesByMonth).map(([month, days]) => (
                <div key={month} className="text-center p-2 bg-[#38b6ff]/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">{month}</p>
                  <p className="font-bold text-[#0f025d]">{days}</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-[#38b6ff]/10 rounded-lg border border-[#38b6ff]/20">
            <p className="text-2xl font-bold text-[#0f025d]">{annualLeaveEntitlement}</p>
            <p className="text-xs text-muted-foreground">Annual Entitlement</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-[#0f025d]">{leaveCarriedOver}</p>
            <p className="text-xs text-muted-foreground">Carried Over</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{usedDays}</p>
            <p className="text-xs text-muted-foreground">Used/Planned</p>
          </div>
          <div className="text-center p-3 bg-[#38b6ff]/20 rounded-lg border border-[#38b6ff]/30">
            <p className="text-2xl font-bold text-[#38b6ff]">{remainingDays}</p>
            <p className="text-xs text-muted-foreground">Current Balance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
