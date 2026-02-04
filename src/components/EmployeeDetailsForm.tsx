import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, EnvelopeSimple, Buildings, Briefcase, CheckCircle, Info } from '@phosphor-icons/react';
import { Employee } from '@/lib/types';
import { sanitizeEmail, sanitizeText } from '@/lib/sanitize';
import { toast } from 'sonner';

interface EmployeeDetailsFormProps {
  employee: Employee;
  onUpdate: (updatedEmployee: Employee) => void;
  embedded?: boolean;
}

export function EmployeeDetailsForm({ employee, onUpdate, embedded = false }: EmployeeDetailsFormProps) {
  const [formData, setFormData] = useState({
    email: employee.email || '',
    managerEmail: employee.managerEmail || '',
    phoneNumber: employee.phoneNumber || '',
    emergencyContact: employee.emergencyContact || '',
    emergencyContactPhone: employee.emergencyContactPhone || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Check if any fields have changed
    const changed = 
      formData.email !== (employee.email || '') ||
      formData.managerEmail !== (employee.managerEmail || '') ||
      formData.phoneNumber !== (employee.phoneNumber || '') ||
      formData.emergencyContact !== (employee.emergencyContact || '') ||
      formData.emergencyContactPhone !== (employee.emergencyContactPhone || '');
    setHasChanges(changed);
  }, [formData, employee]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Email validation
    if (formData.email && !sanitizeEmail(formData.email)) {
      errors.push('Personal email address is invalid');
    }

    // Manager email validation
    if (formData.managerEmail && !sanitizeEmail(formData.managerEmail)) {
      errors.push('Manager email address is invalid');
    }

    // Phone validation (basic)
    if (formData.phoneNumber && !/^[\d\s\-\+\(\)]+$/.test(formData.phoneNumber)) {
      errors.push('Phone number contains invalid characters');
    }

    if (formData.emergencyContactPhone && !/^[\d\s\-\+\(\)]+$/.test(formData.emergencyContactPhone)) {
      errors.push('Emergency contact phone contains invalid characters');
    }

    return { valid: errors.length === 0, errors };
  };

  const handleSubmit = () => {
    const validation = validateForm();
    
    if (!validation.valid) {
      validation.errors.forEach(error => {
        toast.error('Validation Error', { description: error });
      });
      return;
    }

    setIsSaving(true);

    const updatedEmployee: Employee = {
      ...employee,
      email: sanitizeEmail(formData.email) || employee.email,
      managerEmail: sanitizeEmail(formData.managerEmail) || undefined,
      phoneNumber: sanitizeText(formData.phoneNumber) || undefined,
      emergencyContact: sanitizeText(formData.emergencyContact) || undefined,
      emergencyContactPhone: sanitizeText(formData.emergencyContactPhone) || undefined,
    };

    onUpdate(updatedEmployee);

    toast.success('Details Updated', {
      description: 'Your contact information has been updated successfully.',
    });

    setIsSaving(false);
    setHasChanges(false);
  };

  return (
    <div className={embedded ? 'w-full' : 'max-w-2xl mx-auto'}>
      <Card className={embedded ? 'border-0 shadow-none' : ''}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <User size={24} className="text-primary" weight="fill" />
            </div>
            <div>
              <CardTitle className="text-xl">Update Your Details</CardTitle>
              <CardDescription>
                Keep your contact information up to date for HR records
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Read-only employee info */}
          <Alert className="bg-muted/50">
            <Info size={16} weight="fill" />
            <AlertDescription>
              <div className="text-sm space-y-1">
                <p><strong>Name:</strong> {employee.name}</p>
                <p><strong>Employee ID:</strong> {employee.employeeId}</p>
                <p><strong>Department:</strong> {employee.department}</p>
                <p><strong>Position:</strong> {employee.position}</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Editable fields */}
          <div className="space-y-4">
            {/* Personal Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <EnvelopeSimple size={16} weight="fill" />
                Personal Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your personal email for important HR communications
              </p>
            </div>

            {/* Manager Email */}
            <div className="space-y-2">
              <Label htmlFor="managerEmail" className="flex items-center gap-2">
                <Briefcase size={16} weight="fill" />
                Manager Email Address
              </Label>
              <Input
                id="managerEmail"
                type="email"
                placeholder="manager@company.ae"
                value={formData.managerEmail}
                onChange={(e) => handleChange('managerEmail', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your direct manager will receive leave request notifications
              </p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <EnvelopeSimple size={16} weight="fill" />
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+971 50 123 4567"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your contact phone number
              </p>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">
                Emergency Contact Name
              </Label>
              <Input
                id="emergencyContact"
                type="text"
                placeholder="Contact person name"
                value={formData.emergencyContact}
                onChange={(e) => handleChange('emergencyContact', e.target.value)}
              />
            </div>

            {/* Emergency Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">
                Emergency Contact Phone
              </Label>
              <Input
                id="emergencyContactPhone"
                type="tel"
                placeholder="+971 50 987 6543"
                value={formData.emergencyContactPhone}
                onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Emergency contact number for urgent situations
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  email: employee.email || '',
                  managerEmail: employee.managerEmail || '',
                  phoneNumber: employee.phoneNumber || '',
                  emergencyContact: employee.emergencyContact || '',
                  emergencyContactPhone: employee.emergencyContactPhone || '',
                });
              }}
              disabled={!hasChanges}
            >
              Reset
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving || !hasChanges}
              className="gap-2"
            >
              {isSaving ? (
                'Saving...'
              ) : (
                <>
                  <CheckCircle size={16} weight="fill" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {hasChanges && (
            <Alert>
              <Info size={16} weight="fill" />
              <AlertDescription className="text-sm">
                You have unsaved changes. Click "Save Changes" to update your details.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
