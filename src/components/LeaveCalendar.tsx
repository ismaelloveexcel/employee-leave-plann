import { useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UAE_PUBLIC_HOLIDAYS_2026 } from '@/lib/constants';
import { isPublicHoliday, getPublicHolidayName, isWeekend } from '@/lib/leave-utils';
import { LeaveRequest } from '@/lib/types';
import 'react-day-picker/style.css';

interface LeaveCalendarProps {
  requests: LeaveRequest[];
  selectedRange?: DateRange;
  onSelectRange?: (range: DateRange | undefined) => void;
}

export function LeaveCalendar({ requests, selectedRange, onSelectRange }: LeaveCalendarProps) {
  const [month, setMonth] = useState(new Date(2026, 0));

  const approvedLeaveDates = requests
    .filter(req => req.status === 'approved')
    .flatMap(req => {
      const dates: Date[] = [];
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const current = new Date(start);
      
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      
      return dates;
    });

  const publicHolidayDates = UAE_PUBLIC_HOLIDAYS_2026.map(h => new Date(h.date));

  const disabledDays = [
    { before: new Date(2026, 0, 1) },
    { after: new Date(2026, 11, 31) },
    { before: new Date() },
  ];

  const modifiers = {
    publicHoliday: publicHolidayDates,
    approvedLeave: approvedLeaveDates,
    weekend: (date: Date) => isWeekend(date),
  };

  const modifiersClassNames = {
    publicHoliday: 'bg-accent/20 text-accent-foreground font-semibold',
    approvedLeave: 'bg-primary/10 text-primary font-medium',
    weekend: 'text-muted-foreground',
  };

  const DayContent = (date: Date) => {
    const holidayName = getPublicHolidayName(date);
    const day = date.getDate();

    if (holidayName) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative w-full h-full flex items-center justify-center">
                {day}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{holidayName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return day;
  };

  const upcomingHolidays = UAE_PUBLIC_HOLIDAYS_2026
    .filter(h => new Date(h.date) >= new Date())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">2026 Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-center">
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={onSelectRange}
              month={month}
              onMonthChange={setMonth}
              disabled={disabledDays}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              numberOfMonths={1}
              className="border-none"
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                day: 'h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground rounded-md',
                day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-secondary text-secondary-foreground',
                day_outside: 'text-muted-foreground opacity-50',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
              }}
              components={{
                Day: ({ day }) => <>{DayContent(day.date)}</>,
              }}
            />
          </div>

          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-semibold">Upcoming Public Holidays</h4>
            <div className="space-y-2">
              {upcomingHolidays.map(holiday => (
                <div key={holiday.date} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{holiday.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {new Date(holiday.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs border-t pt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-accent/20 border border-accent" />
              <span className="text-muted-foreground">Public Holiday</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary/10 border border-primary" />
              <span className="text-muted-foreground">Your Approved Leave</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
