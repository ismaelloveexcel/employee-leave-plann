import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Buildings, User } from '@phosphor-icons/react';
import { Employee } from '@/lib/types';

interface EmployeeHeaderProps {
  employee: Employee;
}

export function EmployeeHeader({ employee }: EmployeeHeaderProps) {
  const initials = employee.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="bg-primary text-primary-foreground border-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary-foreground/20">
            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight mb-1">{employee.name}</h1>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-1.5">
                <Buildings size={16} weight="fill" />
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={16} weight="fill" />
                <span>{employee.email}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
