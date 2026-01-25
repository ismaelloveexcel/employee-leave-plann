import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock, XCircle, CalendarBlank, CalendarCheck } from '@phosphor-icons/react';
import { LeaveRequest } from '@/lib/types';
import { formatDateRange } from '@/lib/leave-utils';
import { LEAVE_TYPES } from '@/lib/constants';

interface LeaveRequestListProps {
  requests: LeaveRequest[];
}

export function LeaveRequestList({ requests }: LeaveRequestListProps) {
  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} weight="fill" className="text-primary" />;
      case 'pending':
        return <Clock size={20} weight="fill" className="text-accent" />;
      case 'rejected':
        return <XCircle size={20} weight="fill" className="text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      approved: 'default',
      pending: 'secondary',
      rejected: 'destructive',
    };
    
    return (
      <Badge variant={variants[status] || 'default'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getLeaveTypeLabel = (type: string) => {
    return LEAVE_TYPES.find(lt => lt.value === type)?.label || type;
  };

  if (requests.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">My Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarBlank size={56} className="text-muted-foreground mb-4" weight="light" />
            <p className="text-base font-medium text-foreground mb-1">No leave requests yet</p>
            <p className="text-sm text-muted-foreground">
              Submit your first leave request to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarCheck size={20} weight="fill" className="text-primary" />
          <CardTitle className="text-lg">My Leave Requests</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {sortedRequests.map(request => (
              <div
                key={request.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-1 flex-shrink-0">{getStatusIcon(request.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <p className="font-semibold text-sm">
                          {formatDateRange(request.startDate, request.endDate)}
                        </p>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-1">
                        <span>{getLeaveTypeLabel(request.leaveType)}</span>
                        <span>•</span>
                        <span className="font-medium">{request.totalDays} {request.totalDays === 1 ? 'day' : 'days'}</span>
                        {request.offsetDays && request.offsetDays > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-accent font-medium">{request.offsetDays} offset {request.offsetDays === 1 ? 'day' : 'days'}</span>
                          </>
                        )}
                      </div>
                      {request.notes && (
                        <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded italic">
                          "{request.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
