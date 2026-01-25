import { LeaveRequest } from './types';
import { UAE_PUBLIC_HOLIDAYS_2026 } from './constants';

export function calculateBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 5 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

export function isPublicHoliday(date: Date): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return UAE_PUBLIC_HOLIDAYS_2026.some(holiday => holiday.date === dateStr);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 5 || day === 6;
}

export function getPublicHolidayName(date: Date): string | null {
  const dateStr = date.toISOString().split('T')[0];
  const holiday = UAE_PUBLIC_HOLIDAYS_2026.find(h => h.date === dateStr);
  return holiday ? holiday.name : null;
}

export function hasOverlappingDates(
  newStart: Date,
  newEnd: Date,
  existingRequests: LeaveRequest[]
): boolean {
  return existingRequests.some(request => {
    if (request.status === 'rejected') return false;
    
    const reqStart = new Date(request.startDate);
    const reqEnd = new Date(request.endDate);
    
    return (
      (newStart >= reqStart && newStart <= reqEnd) ||
      (newEnd >= reqStart && newEnd <= reqEnd) ||
      (newStart <= reqStart && newEnd >= reqEnd)
    );
  });
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };
  
  if (startDate === endDate) {
    return start.toLocaleDateString('en-US', options);
  }
  
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

export function getTotalLeaveDays(requests: LeaveRequest[]): number {
  return requests
    .filter(req => req.status === 'approved' || req.status === 'pending')
    .reduce((sum, req) => sum + req.totalDays, 0);
}
