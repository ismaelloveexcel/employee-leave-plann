import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gear, EnvelopeSimple, User, Check, X } from '@phosphor-icons/react';
import { Employee } from '@/lib/types';
import { toast } from 'sonner';

interface EmployeeSettingsProps {
  employee: Employee;
  onUpdateEmployee: (updatedEmployee: Employee) => void;
}

export function EmployeeSettings({ employee, onUpdateEmployee }: EmployeeSettingsProps) {
  const [open, setOpen] = useState(false);
  const [managerEmail, setManagerEmail] = useState(employee.managerEmail || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    if (managerEmail && !isValidEmail(managerEmail)) {
      toast.error('Invalid email address', {
        description: 'Please enter a valid manager email address.',
      });
      setIsSaving(false);
      return;
    }

    const updatedEmployee: Employee = {
      ...employee,
      managerEmail: managerEmail.trim() || undefined,
    };

    onUpdateEmployee(updatedEmployee);

    toast.success('Settings updated', {
      description: managerEmail 
        ? 'Your manager will now receive email notifications for leave requests.'
        : 'Email notifications have been disabled.',
    });

    setIsSaving(false);
    setOpen(false);
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground"
        >
          <Gear size={16} weight="fill" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Employee Settings</DialogTitle>
          <DialogDescription>
            Configure your leave management preferences and notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <User size={20} className="text-primary" weight="fill" />
                </div>
                <div>
                  <CardTitle className="text-base">Employee Information</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Your profile details from HR records
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{employee.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{employee.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{employee.department}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-accent/10 p-2">
                  <EnvelopeSimple size={20} className="text-accent" weight="fill" />
                </div>
                <div>
                  <CardTitle className="text-base">Email Notifications</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Configure manager notifications for leave requests
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manager-email" className="text-sm">
                  Manager Email Address
                </Label>
                <Input
                  id="manager-email"
                  type="email"
                  placeholder="manager@company.ae"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Your manager will receive an email notification when you submit a leave request.
                </p>
              </div>

              {employee.managerEmail && (
                <div className="flex items-center gap-2 text-xs bg-primary/5 text-primary p-3 rounded-md">
                  <Check size={14} weight="bold" />
                  <span>Email notifications are enabled</span>
                </div>
              )}

              {!employee.managerEmail && (
                <div className="flex items-center gap-2 text-xs bg-muted/50 text-muted-foreground p-3 rounded-md">
                  <X size={14} weight="bold" />
                  <span>Email notifications are disabled</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
