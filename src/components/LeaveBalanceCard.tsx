import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { LeaveRequest, Employee } from '@/lib/types';
import { getTotalLeaveDays, getTotalOffsetDays } from '@/lib/leave-utils';

interface LeaveBalanceCardProps {
  employee: Employee;
  requests: LeaveRequest[];
}

export function LeaveBalanceCard({ employee, requests }: LeaveBalanceCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Annual Leave Entitlement
  const annualLeaveEntitlement = employee.annualLeaveEntitlement || employee.leaveBalance;
  
  // Leave carried over from last year
  const leaveCarriedOver = employee.openingBalanceFromPreviousYear || 0;
  
  // Offset balance
  const offsetBalance = employee.offsetBalance || 0;
  
  // Used days from requests
  const usedDays = getTotalLeaveDays(requests);
  const usedOffsetDays = getTotalOffsetDays(requests);
  
  // Current leave balance = Entitlement + Carried Over - Used
  const currentLeaveBalance = annualLeaveEntitlement + leaveCarriedOver - usedDays;
  const currentOffsetBalance = offsetBalance - usedOffsetDays;
  
  const getStatusColor = () => {
    const percentage = (currentLeaveBalance / annualLeaveEntitlement) * 100;
    if (percentage >= 50) return 'text-primary';
    if (percentage >= 20) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <Card className="h-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Leave Summary</CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                {isOpen ? (
                  <>
                    <CaretUp size={16} weight="bold" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <CaretDown size={16} weight="bold" />
                    Show Details
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          {/* Summary always visible */}
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-muted-foreground">Current Balance:</span>
            <span className={`font-bold text-lg ${getStatusColor()}`}>{currentLeaveBalance} days</span>
            {offsetBalance > 0 && (
              <>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">Offset:</span>
                <span className="font-bold text-lg text-accent">{currentOffsetBalance} days</span>
              </>
            )}
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="flex flex-col w-full">
              <div className="space-y-4">
                {/* Annual Leave Entitlement */}
                <div className="p-4 bg-[#38b6ff]/10 rounded-lg border border-[#38b6ff]/20">
                  <p className="text-sm text-muted-foreground mb-1">Annual Leave Entitlement</p>
                  <p className="text-2xl font-bold text-[#0f025d]">{annualLeaveEntitlement} days</p>
                </div>
                
                {/* Leave Carried Over */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Leave Carried Over from Last Year</p>
                  <p className="text-xl font-semibold">{leaveCarriedOver} days</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Used/Pending</p>
                    <p className="text-xl font-semibold">{usedDays} days</p>
                  </div>
                  <div className="p-4 bg-[#38b6ff]/20 rounded-lg border border-[#38b6ff]/30">
                    <p className="text-sm text-muted-foreground mb-1">Current Leave Balance</p>
                    <p className={`text-xl font-semibold ${getStatusColor()}`}>
                      {currentLeaveBalance} days
                    </p>
                  </div>
                </div>

                {offsetBalance > 0 && (
                  <div className="p-4 bg-secondary/30 rounded-lg border border-accent/20">
                    <p className="text-sm text-muted-foreground mb-2">Offset Days</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-semibold text-accent">{offsetBalance} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="text-lg font-semibold text-accent">{currentOffsetBalance} days</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
