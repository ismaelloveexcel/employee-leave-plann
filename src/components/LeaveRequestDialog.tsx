import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Info } from '@phosphor-icons/react';
import { LeaveType, LeaveRequest } from '@/lib/types';
import { LEAVE_TYPES } from '@/lib/constants';
import { calculateBusinessDays, hasOverlappingDates } from '@/lib/leave-utils';
import { LeaveCalendar } from './LeaveCalendar';
import { toast } from 'sonner';

interface LeaveRequestDialogProps {
  requests: LeaveRequest[];
  remainingBalance: number;
  onSubmit: (request: Omit<LeaveRequest, 'id' | 'submittedAt'>) => void;
}

export function LeaveRequestDialog({ requests, remainingBalance, onSubmit }: LeaveRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);

    if (!selectedRange?.from || !selectedRange?.to) {
      setError('Please select start and end dates for your leave');
      return;
    }

    const startDate = selectedRange.from;
    const endDate = selectedRange.to;

    const businessDays = calculateBusinessDays(startDate, endDate);

    if (businessDays > remainingBalance) {
      setError(`Insufficient leave balance. You have ${remainingBalance} days remaining.`);
      return;
    }

    if (hasOverlappingDates(startDate, endDate, requests)) {
      setError('These dates overlap with an existing leave request');
      return;
    }

    const newRequest: Omit<LeaveRequest, 'id' | 'submittedAt'> = {
      employeeId: '',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      leaveType,
      status: 'pending',
      notes: notes.trim() || undefined,
      totalDays: businessDays,
    };

    onSubmit(newRequest);
    
    setOpen(false);
    setSelectedRange(undefined);
    setLeaveType('annual');
    setNotes('');
    setError(null);
    
    toast.success('Leave request submitted successfully', {
      description: `Your request for ${businessDays} ${businessDays === 1 ? 'day' : 'days'} has been submitted for approval.`,
    });
  };

  const selectedDays = selectedRange?.from && selectedRange?.to 
    ? calculateBusinessDays(selectedRange.from, selectedRange.to)
    : 0;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedRange(undefined);
      setLeaveType('annual');
      setNotes('');
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="gap-2"
          disabled={remainingBalance <= 0}
        >
          <Plus size={20} weight="bold" />
          Request Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Leave Request</DialogTitle>
          <DialogDescription>
            Select your leave dates and provide details for your request. 
            Available balance: <span className="font-semibold">{remainingBalance} days</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Select Dates</Label>
            <LeaveCalendar 
              requests={requests}
              selectedRange={selectedRange}
              onSelectRange={setSelectedRange}
            />
            {selectedDays > 0 && (
              <div className="flex items-start gap-2 p-3 bg-secondary/60 rounded-lg border border-border">
                <Info size={20} className="text-primary flex-shrink-0 mt-0.5" weight="fill" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground mb-1">
                    {selectedDays} business {selectedDays === 1 ? 'day' : 'days'} selected
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Weekends and public holidays are automatically excluded from your leave count.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="leave-type">Leave Type</Label>
            <Select value={leaveType} onValueChange={(value) => setLeaveType(value as LeaveType)}>
              <SelectTrigger id="leave-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leave-notes">Notes (Optional)</Label>
            <Textarea
              id="leave-notes"
              placeholder="Add any additional information about your leave request..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {notes.length}/500 characters
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedRange?.from || !selectedRange?.to || selectedDays === 0}
            >
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
