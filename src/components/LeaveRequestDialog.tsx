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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  remainingOffsetBalance: number;
  onSubmit: (request: Omit<LeaveRequest, 'id' | 'submittedAt'>) => void;
}

export function LeaveRequestDialog({ requests, remainingBalance, remainingOffsetBalance, onSubmit }: LeaveRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [notes, setNotes] = useState('');
  const [useOffsetDays, setUseOffsetDays] = useState(false);
  const [offsetDaysToUse, setOffsetDaysToUse] = useState(0);
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

    if (useOffsetDays) {
      if (offsetDaysToUse <= 0) {
        setError('Please enter a valid number of offset days to use');
        return;
      }
      if (offsetDaysToUse > remainingOffsetBalance) {
        setError(`You only have ${remainingOffsetBalance} offset days available`);
        return;
      }
      if (offsetDaysToUse > businessDays) {
        setError(`Offset days cannot exceed the total leave days (${businessDays})`);
        return;
      }
    }

    const regularDaysUsed = useOffsetDays ? businessDays - offsetDaysToUse : businessDays;

    if (regularDaysUsed > remainingBalance) {
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
      totalDays: regularDaysUsed,
      offsetDays: useOffsetDays ? offsetDaysToUse : 0,
    };

    onSubmit(newRequest);
    
    setOpen(false);
    setSelectedRange(undefined);
    setLeaveType('annual');
    setNotes('');
    setUseOffsetDays(false);
    setOffsetDaysToUse(0);
    setError(null);
    
    toast.success('Leave request submitted successfully', {
      description: `Your request for ${businessDays} ${businessDays === 1 ? 'day' : 'days'} has been submitted for approval.${useOffsetDays ? ` (${offsetDaysToUse} offset days used)` : ''}`,
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
      setUseOffsetDays(false);
      setOffsetDaysToUse(0);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="gap-2 w-full sm:w-auto"
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
            {remainingOffsetBalance > 0 && (
              <> + <span className="font-semibold text-accent">{remainingOffsetBalance} offset days</span></>
            )}
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
              <div className="flex items-start gap-2 p-4 bg-secondary/60 rounded-lg border border-border">
                <Info size={20} className="text-primary flex-shrink-0 mt-0.5" weight="fill" />
                <div className="text-sm flex-1">
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

          {remainingOffsetBalance > 0 && selectedDays > 0 && (
            <div className="space-y-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="use-offset" 
                  checked={useOffsetDays}
                  onCheckedChange={(checked) => {
                    setUseOffsetDays(checked === true);
                    if (!checked) setOffsetDaysToUse(0);
                  }}
                />
                <label
                  htmlFor="use-offset"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use offset days (carried over from previous year)
                </label>
              </div>
              
              {useOffsetDays && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="offset-days" className="text-xs">
                    Number of offset days to use (max: {Math.min(remainingOffsetBalance, selectedDays)})
                  </Label>
                  <Input
                    id="offset-days"
                    type="number"
                    min="0"
                    max={Math.min(remainingOffsetBalance, selectedDays)}
                    value={offsetDaysToUse}
                    onChange={(e) => setOffsetDaysToUse(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-32"
                  />
                  {offsetDaysToUse > 0 && (
                    <p className="text-xs text-muted-foreground">
                      This leave will use {offsetDaysToUse} offset {offsetDaysToUse === 1 ? 'day' : 'days'} and {selectedDays - offsetDaysToUse} regular {selectedDays - offsetDaysToUse === 1 ? 'day' : 'days'}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

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

          <div className="flex justify-end gap-3 pt-4 border-t">
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
