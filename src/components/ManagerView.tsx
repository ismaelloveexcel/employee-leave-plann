import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UsersThree, CaretDown, CaretUp, CalendarBlank } from '@phosphor-icons/react';
import { Employee, LeaveRequest } from '@/lib/types';

interface ManagerViewProps {
  currentEmployee: Employee;
  allEmployees: Employee[];
  allRequests: LeaveRequest[];
}

export function ManagerView({ currentEmployee, allEmployees, allRequests }: ManagerViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only show if user is a manager
  if (!currentEmployee.isManager) {
    return null;
  }

  // Get team members (in production, this would filter by managerId)
  const teamMembers = allEmployees.filter(emp => emp.id !== currentEmployee.id);

  // Get team leave requests
  const teamRequests = allRequests.filter(req => 
    teamMembers.some(emp => emp.id === req.employeeId)
  );

  // Calculate upcoming leaves (next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const upcomingLeaves = teamRequests.filter(req => {
    const startDate = new Date(req.startDate);
    return startDate >= today && startDate <= thirtyDaysFromNow && req.status !== 'rejected';
  });

  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const emp = allEmployees.find(e => e.id === employeeId);
    return emp?.name || 'Unknown';
  };

  return (
    <Card className="border-[#38b6ff]/30">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersThree size={20} weight="fill" className="text-[#38b6ff]" />
              <CardTitle className="text-lg">Manager View - Team Overview</CardTitle>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                {isOpen ? (
                  <>
                    <CaretUp size={16} weight="bold" />
                    Hide
                  </>
                ) : (
                  <>
                    <CaretDown size={16} weight="bold" />
                    Show Team
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          {/* Summary always visible */}
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-muted-foreground">Team Size:</span>
            <span className="font-bold">{teamMembers.length}</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">Upcoming Leaves (30 days):</span>
            <span className="font-bold text-[#38b6ff]">{upcomingLeaves.length}</span>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Team Leave Balances */}
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <CalendarBlank size={16} />
                Team Leave Balances
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#38b6ff]/10">
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Used</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map(emp => {
                      const empRequests = allRequests.filter(r => r.employeeId === emp.id);
                      const usedDays = empRequests.reduce((sum, r) => sum + r.totalDays, 0);
                      return (
                        <TableRow key={emp.id}>
                          <TableCell className="font-medium">{emp.name}</TableCell>
                          <TableCell>{emp.department}</TableCell>
                          <TableCell className="text-right">{emp.leaveBalance}</TableCell>
                          <TableCell className="text-right">{usedDays}</TableCell>
                          <TableCell className="text-right font-semibold text-[#38b6ff]">
                            {emp.leaveBalance - usedDays}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Upcoming Team Leaves */}
            {upcomingLeaves.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  Upcoming Team Leaves (Next 30 Days)
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-amber-50">
                        <TableHead>Employee</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingLeaves.map(req => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">
                            {getEmployeeName(req.employeeId)}
                          </TableCell>
                          <TableCell>
                            {new Date(req.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - 
                            {new Date(req.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </TableCell>
                          <TableCell>{req.totalDays}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={req.status === 'approved' ? 'default' : 'secondary'}
                              className={req.status === 'approved' ? 'bg-green-600' : 'bg-amber-500'}
                            >
                              {req.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {teamMembers.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No team members assigned.
              </p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
