import { useEffect, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from 'sonner';
import { EmployeeDetailsForm } from '@/components/EmployeeDetailsForm';
import { Employee } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, CheckCircle, Info } from '@phosphor-icons/react';

interface EmployeeUpdatePageProps {
  employees: Employee[];
  onUpdateEmployee: (updatedEmployee: Employee) => void;
  embedded?: boolean;
}

export function EmployeeUpdatePage({ employees, onUpdateEmployee, embedded = false }: EmployeeUpdatePageProps) {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [employeeId, setEmployeeId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check URL parameters for pre-filled employee ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlEmployeeId = params.get('employeeId') || params.get('id');
    if (urlEmployeeId) {
      setEmployeeId(urlEmployeeId);
    }
  }, []);

  const handleAuthenticate = () => {
    setAuthError('');
    
    // Find employee by employee ID and verify DOB
    const employee = employees.find(
      emp => emp.employeeId.toLowerCase() === employeeId.toLowerCase()
    );

    if (!employee) {
      setAuthError('Employee ID not found');
      return;
    }

    if (employee.dateOfBirth !== dateOfBirth) {
      setAuthError('Invalid Date of Birth');
      return;
    }

    setCurrentEmployee(employee);
    setIsAuthenticated(true);
  };

  const handleUpdate = (updatedEmployee: Employee) => {
    onUpdateEmployee(updatedEmployee);
    setCurrentEmployee(updatedEmployee);
  };

  // Embedded mode - minimal layout
  if (embedded) {
    return (
      <div className="w-full p-4">
        <Toaster position="top-center" />
        
        {!isAuthenticated ? (
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Employee Verification</CardTitle>
              <CardDescription>
                Enter your credentials to update your details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emp-id">Employee ID</Label>
                <Input
                  id="emp-id"
                  type="text"
                  placeholder="e.g., BAYN00002"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth (DDMMYYYY)</Label>
                <Input
                  id="dob"
                  type="password"
                  placeholder="e.g., 15031990"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              {authError && (
                <Alert variant="destructive">
                  <Info size={16} weight="fill" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleAuthenticate} 
                className="w-full gap-2"
              >
                <Lock size={16} weight="fill" />
                Verify & Continue
              </Button>
            </CardContent>
          </Card>
        ) : (
          <EmployeeDetailsForm
            employee={currentEmployee!}
            onUpdate={handleUpdate}
            embedded={true}
          />
        )}
      </div>
    );
  }

  // Standard mode - full layout
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <div className="container max-w-4xl mx-auto p-6 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Update Employee Details</h1>
          <p className="text-muted-foreground">
            Keep your contact information up to date
          </p>
        </div>

        {!isAuthenticated ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Lock size={24} className="text-primary" weight="fill" />
                </div>
                <div>
                  <CardTitle>Secure Access</CardTitle>
                  <CardDescription>
                    Verify your identity to update details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <Info size={16} weight="fill" className="text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                  Your employee details are protected. Enter your credentials to access the update form.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="employee-id">Employee ID</Label>
                <Input
                  id="employee-id"
                  type="text"
                  placeholder="e.g., BAYN00002"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                  autoComplete="off"
                />
                <p className="text-xs text-muted-foreground">
                  Your unique employee identification number
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-of-birth">Date of Birth</Label>
                <Input
                  id="date-of-birth"
                  type="password"
                  placeholder="Format: DDMMYYYY (e.g., 15031990)"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  autoComplete="off"
                />
                <p className="text-xs text-muted-foreground">
                  Enter in DDMMYYYY format (e.g., 15031990 for March 15, 1990)
                </p>
              </div>

              {authError && (
                <Alert variant="destructive">
                  <Info size={16} weight="fill" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleAuthenticate} 
                className="w-full gap-2"
                size="lg"
              >
                <CheckCircle size={20} weight="fill" />
                Verify & Continue
              </Button>
            </CardContent>
          </Card>
        ) : (
          <EmployeeDetailsForm
            employee={currentEmployee!}
            onUpdate={handleUpdate}
            embedded={false}
          />
        )}
      </div>
    </div>
  );
}
