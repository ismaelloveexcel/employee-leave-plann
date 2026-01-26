import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Buildings, Briefcase, IdentificationCard, SignOut } from '@phosphor-icons/react';
import { Employee } from '@/lib/types';
import { EmployeeSettings } from './EmployeeSettings';

interface EmployeeHeaderProps {
  employee: Employee;
  onUpdateEmployee: (updatedEmployee: Employee) => void;
  onLogout?: () => void;
}

export function EmployeeHeader({ employee, onUpdateEmployee, onLogout }: EmployeeHeaderProps) {
  return (
    <Card className="bg-primary text-primary-foreground border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{employee.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/90">
              {employee.position && (
                <div className="flex items-center gap-2">
                  <Briefcase size={18} weight="fill" />
                  <span>{employee.position}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Buildings size={18} weight="fill" />
                <span>{employee.entity || employee.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <IdentificationCard size={18} weight="fill" />
                <span>{employee.employeeId}</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <EmployeeSettings employee={employee} onUpdateEmployee={onUpdateEmployee} />
            {onLogout && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground"
                onClick={onLogout}
              >
                <SignOut size={16} weight="fill" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
