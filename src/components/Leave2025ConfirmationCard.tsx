import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, PencilSimple, Warning, ClockCounterClockwise } from '@phosphor-icons/react';
import { Employee, Leave2025Record, ConfirmationStatus, AuditRecord } from '@/lib/types';
import { toast } from 'sonner';

interface Leave2025ConfirmationCardProps {
  employee: Employee;
  leave2025Records: Leave2025Record[];
  confirmationStatus: ConfirmationStatus;
  onConfirm: () => void;
  onRequestChange: (notes: string, updatedRecords: Leave2025Record[]) => void;
  onAddAuditRecord: (record: Omit<AuditRecord, 'id' | 'timestamp'>) => void;
}

const MONTHS_2025 = [
  'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25',
  'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'
];

export function Leave2025ConfirmationCard({
  employee,
  leave2025Records,
  confirmationStatus,
  onConfirm,
  onRequestChange,
  onAddAuditRecord,
}: Leave2025ConfirmationCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editableRecords, setEditableRecords] = useState<Leave2025Record[]>(leave2025Records);
  const [changeNotes, setChangeNotes] = useState('');

  // Initialize records if empty
  const displayRecords = leave2025Records.length > 0 
    ? leave2025Records 
    : MONTHS_2025.map(month => ({ month, leavesAvailed: 0 }));

  const totalLeavesAvailed = displayRecords.reduce((sum, record) => sum + record.leavesAvailed, 0);

  const handleConfirm = () => {
    onConfirm();
    onAddAuditRecord({
      employeeId: employee.id,
      action: 'confirm_balance',
      newValue: JSON.stringify({ totalLeaves: totalLeavesAvailed, records: displayRecords }),
      notes: 'Employee confirmed 2025 leave balance as correct',
      performedBy: employee.employeeId,
    });
    toast.success('Leave balance confirmed', {
      description: 'Your 2025 leave balance has been confirmed as correct.',
    });
  };

  const handleRequestChange = () => {
    if (!changeNotes.trim()) {
      toast.error('Please provide details about the discrepancy');
      return;
    }
    
    const previousRecords = JSON.stringify(displayRecords);
    onRequestChange(changeNotes, editableRecords);
    onAddAuditRecord({
      employeeId: employee.id,
      action: 'request_change',
      previousValue: previousRecords,
      newValue: JSON.stringify(editableRecords),
      notes: changeNotes,
      performedBy: employee.employeeId,
    });
    
    setIsEditDialogOpen(false);
    setChangeNotes('');
    toast.success('Change request submitted', {
      description: 'HR will review your request and update your records.',
    });
  };

  const handleEditRecord = (index: number, value: number) => {
    const newRecords = [...editableRecords];
    newRecords[index] = { ...newRecords[index], leavesAvailed: value };
    setEditableRecords(newRecords);
  };

  const openEditDialog = () => {
    setEditableRecords(displayRecords.length > 0 
      ? [...displayRecords] 
      : MONTHS_2025.map(month => ({ month, leavesAvailed: 0 })));
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockCounterClockwise size={20} weight="fill" className="text-primary" />
            <CardTitle className="text-lg">Leaves for 2025</CardTitle>
          </div>
          <Badge 
            variant={
              confirmationStatus === 'confirmed' ? 'default' : 
              confirmationStatus === 'change_requested' ? 'secondary' : 
              'outline'
            }
            className={
              confirmationStatus === 'confirmed' ? 'bg-green-600' : 
              confirmationStatus === 'change_requested' ? 'bg-amber-500' : 
              ''
            }
          >
            {confirmationStatus === 'confirmed' && 'Confirmed'}
            {confirmationStatus === 'change_requested' && 'Change Requested'}
            {confirmationStatus === 'pending' && 'Pending Confirmation'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Month</TableHead>
                <TableHead className="font-semibold text-right">Leaves Availed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRecords.map((record, index) => (
                <TableRow key={record.month}>
                  <TableCell className="font-medium">{record.month}</TableCell>
                  <TableCell className="text-right">{record.leavesAvailed}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-primary/5 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totalLeavesAvailed} days</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {confirmationStatus === 'pending' && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              onClick={handleConfirm}
              className="flex-1 gap-2"
            >
              <CheckCircle size={18} weight="fill" />
              Confirm Balance is Correct
            </Button>
            
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={openEditDialog}
                >
                  <PencilSimple size={18} weight="fill" />
                  Request Change
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Warning size={20} className="text-amber-500" weight="fill" />
                    Request Leave Balance Change
                  </DialogTitle>
                  <DialogDescription>
                    Please update the leaves you believe are correct and provide details about the discrepancy.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Month</TableHead>
                          <TableHead className="font-semibold text-center">Current</TableHead>
                          <TableHead className="font-semibold text-center">Your Correction</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editableRecords.map((record, index) => (
                          <TableRow key={record.month}>
                            <TableCell className="font-medium">{record.month}</TableCell>
                            <TableCell className="text-center text-muted-foreground">
                              {displayRecords[index]?.leavesAvailed || 0}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="31"
                                value={record.leavesAvailed}
                                onChange={(e) => handleEditRecord(index, parseInt(e.target.value) || 0)}
                                className="w-20 mx-auto text-center"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Please explain the discrepancy <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Describe the reason for your change request..."
                      value={changeNotes}
                      onChange={(e) => setChangeNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRequestChange}>
                    Submit Change Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {confirmationStatus === 'confirmed' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg">
            <CheckCircle size={20} weight="fill" />
            <span className="text-sm">You have confirmed your 2025 leave balance as correct.</span>
          </div>
        )}

        {confirmationStatus === 'change_requested' && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg">
            <Warning size={20} weight="fill" />
            <span className="text-sm">Your change request is being reviewed by HR.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
