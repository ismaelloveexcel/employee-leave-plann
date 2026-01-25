import { useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarBlank } from '@phosphor-icons/react';
import { UAE_PUBLIC_HOLIDAYS_2026 } from '@/lib/constants';
import { isWeekend } from '@/lib/leave-utils';
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
    publicHoliday: 'bg-accent/30 text-accent-foreground font-semibold rounded-md',
    approvedLeave: 'bg-primary/20 text-primary font-medium rounded-md',
    weekend: 'text-muted-foreground',
  };

  const upcomingHolidays = UAE_PUBLIC_HOLIDAYS_2026
    .filter(h => new Date(h.date) >= new Date())
    .slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarBlank size={20} weight="fill" className="text-primary" />
          <CardTitle className="text-lg">2026 Calendar</CardTitle>
        </div>
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
                month_caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-base font-semibold',
                nav: 'space-x-1 flex items-center',
                button_previous: 'absolute left-1 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent/10 rounded-md transition-all',
                button_next: 'absolute right-1 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent/10 rounded-md transition-all',
                month_grid: 'w-full border-collapse',
                weekdays: 'flex justify-between',
                weekday: 'text-muted-foreground w-10 font-medium text-sm text-center',
                week: 'flex justify-between w-full mt-1',
                day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                day_button: 'h-10 w-10 p-0 font-normal hover:bg-accent/20 hover:text-accent-foreground rounded-md transition-colors flex items-center justify-center',
                selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold rounded-md',
                today: 'bg-secondary text-secondary-foreground font-semibold rounded-md',
                outside: 'text-muted-foreground opacity-50',
                disabled: 'text-muted-foreground opacity-30 cursor-not-allowed',
                range_middle: 'aria-selected:bg-accent/20 aria-selected:text-accent-foreground rounded-none',
                range_start: 'rounded-l-md',
                range_end: 'rounded-r-md',
                hidden: 'invisible',
              }}
            />
          </div>

          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <span>Upcoming Public Holidays</span>
            </h4>
            <div className="space-y-2">
              {upcomingHolidays.map(holiday => (
                <div key={holiday.date} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-sm text-foreground">{holiday.name}</span>
                  <Badge variant="outline" className="text-xs font-medium">
                    {new Date(holiday.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs border-t pt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent/20 border border-accent flex-shrink-0" />
              <span className="text-muted-foreground">Public Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/10 border border-primary flex-shrink-0" />
              <span className="text-muted-foreground">Your Approved Leave</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
