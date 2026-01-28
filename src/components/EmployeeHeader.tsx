import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Buildings, Briefcase, IdentificationCard, SignOut, UserCircle, Clock } from '@phosphor-icons/react';
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
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            {/* Employee Name */}
            <h1 className="text-2xl font-bold tracking-tight mb-3">{employee.name}</h1>
            
            {/* Employee Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
              {/* Employee No */}
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <IdentificationCard size={16} weight="fill" className="flex-shrink-0" />
                <span className="text-primary-foreground/70">Employee No:</span>
                <span className="font-medium">{employee.employeeId}</span>
              </div>
              
              {/* Position */}
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Briefcase size={16} weight="fill" className="flex-shrink-0" />
                <span className="text-primary-foreground/70">Position:</span>
                <span className="font-medium truncate">{employee.position || 'N/A'}</span>
              </div>
              
              {/* Entity */}
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Buildings size={16} weight="fill" className="flex-shrink-0" />
                <span className="text-primary-foreground/70">Entity:</span>
                <span className="font-medium truncate">{employee.entity || employee.department}</span>
              </div>
              
              {/* Employment Status */}
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <UserCircle size={16} weight="fill" className="flex-shrink-0" />
                <span className="text-primary-foreground/70">Status:</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs border-primary-foreground/30 ${
                    employee.employmentStatus === 'Active' 
                      ? 'bg-green-500/20 text-green-100' 
                      : 'bg-yellow-500/20 text-yellow-100'
                  }`}
                >
                  {employee.employmentStatus || 'Active'}
                </Badge>
              </div>
              
              {/* Extra Hours Compensation */}
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Clock size={16} weight="fill" className="flex-shrink-0" />
                <span className="text-primary-foreground/70">Extra Hours:</span>
                <span className="font-medium">{employee.extraHoursCompensation || 'N/A'}</span>
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
