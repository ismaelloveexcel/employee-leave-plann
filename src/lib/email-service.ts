import { Employee, LeaveRequest } from './types';
import { LEAVE_TYPES } from './constants';

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  timestamp: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function getLeaveTypeName(leaveType: string): string {
  return LEAVE_TYPES.find(t => t.value === leaveType)?.label || leaveType;
}

export async function sendManagerNotification(
  employee: Employee,
  leaveRequest: LeaveRequest,
  managerEmail?: string
): Promise<EmailNotification | null> {
  if (!managerEmail) {
    console.log('No manager email configured for employee:', employee.employeeId);
    return null;
  }

  const leaveTypeName = getLeaveTypeName(leaveRequest.leaveType);
  const startDate = formatDate(leaveRequest.startDate);
  const endDate = formatDate(leaveRequest.endDate);
  
  const offsetInfo = leaveRequest.offsetDays && leaveRequest.offsetDays > 0
    ? `\n- Offset Days Used: ${leaveRequest.offsetDays} day${leaveRequest.offsetDays > 1 ? 's' : ''}`
    : '';

  const subject = `Leave Request from ${employee.name} - ${leaveTypeName}`;
  
  const body = `Dear Manager,

${employee.name} (${employee.department}) has submitted a new leave request that requires your approval.

Leave Request Details:
- Employee: ${employee.name}
- Department: ${employee.department}
- Leave Type: ${leaveTypeName}
- Start Date: ${startDate}
- End Date: ${endDate}
- Total Days: ${leaveRequest.totalDays} business day${leaveRequest.totalDays > 1 ? 's' : ''}${offsetInfo}
${leaveRequest.notes ? `- Notes: ${leaveRequest.notes}` : ''}
- Request ID: ${leaveRequest.id}
- Submitted: ${formatDate(leaveRequest.submittedAt)}

Please review this request at your earliest convenience in the Leave Management System.

---
This is an automated notification from the Leave Planner 2026 system.`;

  const notification: EmailNotification = {
    to: managerEmail,
    subject,
    body,
    timestamp: new Date().toISOString(),
  };

  console.log('Email notification prepared:', notification);
  
  return notification;
}

export async function generateEmailPreview(
  employee: Employee,
  leaveRequest: Partial<LeaveRequest>
): Promise<string> {
  if (!leaveRequest.startDate || !leaveRequest.endDate || !leaveRequest.leaveType) {
    return '';
  }

  const leaveTypeName = getLeaveTypeName(leaveRequest.leaveType);
  const startDate = formatDate(leaveRequest.startDate);
  const endDate = formatDate(leaveRequest.endDate);
  
  return `Your manager will receive an email notification with the following details:

Subject: Leave Request from ${employee.name} - ${leaveTypeName}

Leave Request Details:
- Leave Type: ${leaveTypeName}
- Start Date: ${startDate}
- End Date: ${endDate}
- Total Days: ${leaveRequest.totalDays} business day${leaveRequest.totalDays === 1 ? '' : 's'}
${leaveRequest.offsetDays ? `- Offset Days Used: ${leaveRequest.offsetDays}` : ''}
${leaveRequest.notes ? `- Notes: ${leaveRequest.notes}` : ''}`;
}
