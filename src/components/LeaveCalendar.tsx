import { useState } from 'react';
import { DayPicker, DateRange, DayProps } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarBlank } from '@phosphor-icons/react';
import { UAE_PUBLIC_HOLIDAYS_2026 } from '@/lib/constants';
import { getPublicHolidayName, isWeekend } from '@/lib/leave-utils';
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
    publicHoliday: 'rdp-day_public-holiday bg-accent/20 text-accent-foreground font-semibold',
    approvedLeave: 'rdp-day_approved-leave bg-primary/10 text-primary font-medium',
    weekend: 'text-muted-foreground',
  };

  const upcomingHolidays = UAE_PUBLIC_HOLIDAYS_2026
    .filter(h => new Date(h.date) >= new Date())
    .slice(0, 3);

  const CustomDay = (props: DayProps) => {
    const { day } = props;
    const holidayName = getPublicHolidayName(day.date);
    
    if (holidayName) {
      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative w-full h-full flex items-center justify-center">
                {day.date.getDate()}
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{holidayName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return <>{day.date.getDate()}</>;
  };

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
                month_grid: 'w-full border-collapse space-y-1',
                weekdays: 'flex',
                weekday: 'text-muted-foreground rounded-md w-10 font-medium text-sm',
                week: 'flex w-full mt-2',
                day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-10 w-10',
                day_button: 'h-10 w-10 p-0 font-normal hover:bg-accent/20 hover:text-accent-foreground rounded-md transition-colors',
                selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold',
                today: 'bg-secondary/80 text-secondary-foreground font-semibold',
                outside: 'text-muted-foreground opacity-50',
                disabled: 'text-muted-foreground opacity-50',
                range_middle: 'aria-selected:bg-accent/20 aria-selected:text-accent-foreground',
                hidden: 'invisible',
              }}
              components={{
                Day: CustomDay,
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
