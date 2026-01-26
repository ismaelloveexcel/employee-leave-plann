import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarBlank, IdentificationCard, Lock, Warning } from '@phosphor-icons/react';
import { Employee } from '@/lib/types';

interface LoginFormProps {
  employees: Employee[];
  onLogin: (employee: Employee) => void;
}

export function LoginForm({ employees, onLogin }: LoginFormProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Normalize employee ID (case insensitive)
    const normalizedId = employeeId.trim().toUpperCase();
    
    // Normalize DOB to DDMMYYYY format (remove any separators)
    const normalizedDob = dob.replace(/[^0-9]/g, '');

    if (!normalizedId) {
      setError('Please enter your Employee ID');
      setIsLoading(false);
      return;
    }

    if (!normalizedDob || normalizedDob.length !== 8) {
      setError('Please enter your Date of Birth in DDMMYYYY format');
      setIsLoading(false);
      return;
    }

    // Find employee by ID
    const employee = employees.find(
      emp => emp.employeeId?.toUpperCase() === normalizedId
    );

    if (!employee) {
      setError('Employee ID not found. Please contact HR.');
      setIsLoading(false);
      return;
    }

    // Verify DOB (password)
    const employeeDob = employee.dateOfBirth?.replace(/[^0-9]/g, '');
    if (employeeDob !== normalizedDob) {
      setError('Incorrect Date of Birth. Please try again.');
      setIsLoading(false);
      return;
    }

    // Success - login the employee
    setTimeout(() => {
      onLogin(employee);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <CalendarBlank size={48} className="text-primary" weight="fill" />
          </div>
          <div>
            <CardTitle className="text-2xl">Leave Planner 2026</CardTitle>
            <CardDescription className="mt-2">
              Enter your Employee ID and Date of Birth to access your leave planner
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <Warning size={16} weight="fill" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <div className="relative">
                <IdentificationCard 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="e.g., EMP001"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth (Password)</Label>
              <div className="relative">
                <Lock 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  id="dob"
                  type="password"
                  placeholder="DDMMYYYY (e.g., 15031990)"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your date of birth in DDMMYYYY format
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Forgot your Employee ID? Contact HR for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
