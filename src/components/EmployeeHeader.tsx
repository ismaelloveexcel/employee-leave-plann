import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Buildings, User } from '@phosphor-icons/react';
import { Employee } from '@/lib/types';
import { EmployeeSettings } from './EmployeeSettings';

interface EmployeeHeaderProps {
  employee: Employee;
  onUpdateEmployee: (updatedEmployee: Employee) => void;
}

export function EmployeeHeader({ employee, onUpdateEmployee }: EmployeeHeaderProps) {
  const initials = employee.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="bg-primary text-primary-foreground border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <Avatar className="h-20 w-20 border-2 border-primary-foreground/20 flex-shrink-0">
              <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold tracking-tight mb-2">{employee.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/90">
                <div className="flex items-center gap-2">
                  <Buildings size={18} weight="fill" />
                  <span>{employee.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} weight="fill" />
                  <span className="truncate">{employee.email}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <EmployeeSettings employee={employee} onUpdateEmployee={onUpdateEmployee} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
