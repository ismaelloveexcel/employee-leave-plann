# Employee Leave Planner - App Review & Recommendations

This document provides a comprehensive review of the Employee Leave Planner application with recommendations for improvement across various categories.

---

## Executive Summary

The Employee Leave Planner is a well-structured React application for UAE-based organizations. It successfully implements core features including employee authentication, leave balance tracking, leave request submission, calendar visualization, and email notifications. However, there are opportunities for improvement in accessibility, UX, performance, and feature completeness.

**Current State Screenshot:**

![Current Application State](https://github.com/user-attachments/assets/52fb6eb8-50ab-4309-a9c0-07e85e42281b)

---

## 🔴 Critical Issues

### 1. Calendar Day Rendering Issue
**Location:** `src/components/LeaveCalendar.tsx`

**Issue:** The calendar days appear to be concatenated without proper spacing (e.g., "28293031" instead of individual clickable days). 

**Root Cause:** The custom `CustomDay` component (lines 61-84) returns JSX elements that don't properly integrate with react-day-picker v9's grid structure. The component returns a `<div>` wrapper when it should return the day content directly to be rendered inside the library's existing button structure. This causes the grid cells to lose their spacing and individual day styling.

**Technical Details:**
- react-day-picker expects the `Day` component to render content within its pre-existing cell structure
- The current implementation wraps content in additional containers that break the CSS grid layout
- The `rdp-day_button` class is applied but the structural changes prevent proper grid spacing

**Recommendation:**
```tsx
// Ensure the Day component returns properly styled buttons
const CustomDay = (props: DayProps) => {
  const { day, ...buttonProps } = props;
  const holidayName = getPublicHolidayName(day.date);
  
  if (holidayName) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rdp-day_button" {...buttonProps}>
              {day.date.getDate()}
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{holidayName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return <button className="rdp-day_button" {...buttonProps}>{day.date.getDate()}</button>;
};
```

### 2. Settings Button Not Fully Visible
**Location:** `src/components/EmployeeHeader.tsx`

**Issue:** In the screenshot, the Settings button appears cut off or hard to see against the teal background.

**Recommendation:** Ensure the button has proper contrast and visibility:
```tsx
<Button 
  variant="outline" 
  size="sm" 
  className="gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground"
>
  <Gear size={16} weight="fill" />
  Settings
</Button>
```

---

## 🟡 UX/UI Improvements

### 3. Add Request Status Filtering
**Location:** `src/components/LeaveRequestList.tsx`

**Issue:** The PRD mentions filtering by status, but this feature is not implemented.

**Recommendation:** Add a filter dropdown:
```tsx
const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'all'>('all');

const filteredRequests = sortedRequests.filter(
  req => statusFilter === 'all' || req.status === statusFilter
);

// Add filter UI above the list
<Select value={statusFilter} onValueChange={setStatusFilter}>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="Filter by status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Requests</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="approved">Approved</SelectItem>
    <SelectItem value="rejected">Rejected</SelectItem>
  </SelectContent>
</Select>
```

### 4. Add Welcome Message for First-Time Users
**Location:** `src/App.tsx`

**Issue:** PRD specifies showing a welcome message with brief instructions for first-time users.

**Recommendation:**
```tsx
{myRequests.length === 0 && !currentEmployee.managerEmail && (
  <Alert className="bg-primary/5 border-primary/20">
    <Info size={20} weight="fill" className="text-primary" />
    <AlertDescription>
      <p className="font-semibold mb-1">Welcome to Leave Planner 2026! 👋</p>
      <p className="text-sm text-muted-foreground">
        Get started by configuring your manager's email in Settings, 
        then use "Request Leave" to submit your first leave request.
      </p>
    </AlertDescription>
  </Alert>
)}
```

### 5. Department Leave Calendar (Optional Feature)
**Location:** New component needed

**Issue:** The PRD mentions a "Team Calendar" tab showing aggregated team leave without revealing identities. This feature is not implemented.

**Recommendation:** Create a new `TeamCalendar` component that shows leave density:
```tsx
// src/components/TeamCalendar.tsx
// Display: "2 people on leave" without names
// Only show approved leaves
// Filter by department
```

### 6. Add Loading States with Skeleton
**Location:** Multiple components

**Issue:** PRD recommends skeleton shimmer for loading states instead of spinners.

**Recommendation:** Replace the current spinner with skeleton components:
```tsx
// Replace current loading spinner
<div className="space-y-4">
  <Skeleton className="h-20 w-full" />
  <Skeleton className="h-40 w-full" />
  <Skeleton className="h-60 w-full" />
</div>
```

---

## 🟢 Code Quality Improvements

### 7. Add Input Validation for Manager Email
**Location:** `src/components/EmployeeSettings.tsx`

**Issue:** The email validation regex is basic. Consider using a more robust validation or Zod schema.

**Recommendation:**
```typescript
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');

const handleSave = () => {
  if (managerEmail) {
    const result = emailSchema.safeParse(managerEmail);
    if (!result.success) {
      toast.error('Invalid email address', {
        description: result.error.errors[0].message,
      });
      return;
    }
  }
  // ... rest of save logic
};
```

### 8. Add Error Boundary for Calendar Component
**Location:** `src/components/LeaveCalendar.tsx`

**Issue:** If the calendar fails to render, it could crash the entire app.

**Recommendation:** Wrap the calendar in an error boundary:
```tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary 
  fallback={
    <Card className="h-full">
      <CardContent className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Failed to load calendar. Please refresh.</p>
      </CardContent>
    </Card>
  }
>
  <LeaveCalendar requests={myRequests} />
</ErrorBoundary>
```

### 9. Improve Type Safety for Leave Types
**Location:** `src/lib/types.ts` and `src/lib/constants.ts`

**Issue:** The `LEAVE_TYPES` array could be better typed to prevent runtime errors.

**Recommendation:**
```typescript
// types.ts
export const LEAVE_TYPE_VALUES = ['annual', 'sick', 'emergency'] as const;
export type LeaveType = typeof LEAVE_TYPE_VALUES[number];

// constants.ts
export const LEAVE_TYPES: ReadonlyArray<{ value: LeaveType; label: string }> = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'emergency', label: 'Emergency Leave' },
];
```

### 10. Add Retry Logic for Network Errors
**Location:** `src/App.tsx`

**Issue:** PRD mentions handling network errors with retry option, but this isn't implemented.

**Recommendation:**
```tsx
const [retryCount, setRetryCount] = useState(0);

const handleRetry = () => {
  setRetryCount(prev => prev + 1);
  setLoading(true);
  loadEmployee();
};

// In error state UI:
<Button onClick={handleRetry} variant="outline">
  <RefreshCw size={16} className="mr-2" />
  Retry
</Button>
```

---

## 🔵 Accessibility Improvements

### 11. Add ARIA Labels to Interactive Elements
**Location:** Multiple components

**Issue:** Some interactive elements lack proper ARIA labels.

**Recommendations:**
```tsx
// Calendar navigation
<button aria-label="Go to previous month">...</button>
<button aria-label="Go to next month">...</button>

// Leave balance ring
<svg role="img" aria-label={`${percentage}% of leave balance remaining`}>

// Status badges
<Badge aria-label={`Status: ${status}`}>
```

### 12. Improve Keyboard Navigation
**Location:** `src/components/LeaveCalendar.tsx`

**Issue:** Ensure calendar is fully keyboard accessible.

**Recommendation:** The react-day-picker already supports keyboard navigation, but ensure focus styles are visible:
```css
.rdp-day_button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### 13. Add Skip Links for Main Content
**Location:** `src/App.tsx`

**Recommendation:**
```tsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
>
  Skip to main content
</a>
// ... later
<main id="main-content" className="container max-w-7xl mx-auto p-6 space-y-6">
```

---

## ⚡ Performance Improvements

### 14. Memoize Expensive Calculations
**Location:** `src/App.tsx`, `src/components/LeaveBalanceCard.tsx`

**Recommendation:**
```tsx
const usedDays = useMemo(() => getTotalLeaveDays(myRequests), [myRequests]);
const usedOffsetDays = useMemo(() => getTotalOffsetDays(myRequests), [myRequests]);
```

### 15. Lazy Load Dialog Components
**Location:** `src/components/LeaveRequestDialog.tsx`, `src/components/EmployeeSettings.tsx`

**Recommendation:**
```tsx
const LeaveRequestDialog = lazy(() => import('./LeaveRequestDialog'));

// Usage
<Suspense fallback={<Button disabled>Loading...</Button>}>
  <LeaveRequestDialog ... />
</Suspense>
```

### 16. Optimize Bundle Size
**Issue:** Build output shows large chunks (649KB JS, 359KB CSS).

**Recommendations:**
1. Use tree-shaking for Phosphor icons (import specific icons only)
2. Consider code-splitting for the calendar component
3. Analyze bundle with `vite-bundle-visualizer`

---

## 🔒 Security Considerations

### 17. Sanitize User Input
**Location:** `src/components/LeaveRequestDialog.tsx`

**Issue:** Notes field accepts user input that could be displayed elsewhere.

**Recommendation:**
```typescript
import DOMPurify from 'dompurify';

const sanitizedNotes = DOMPurify.sanitize(notes.trim());
```

### 18. Validate Date Ranges Server-Side
**Location:** `src/lib/leave-utils.ts`

**Issue:** Client-side validation only. The PRD mentions server-side balance validation.

**Recommendation:** Implement server-side validation when integrating with a backend.

---

## 📱 Mobile Responsiveness

### 19. Improve Mobile Calendar View
**Location:** `src/components/LeaveCalendar.tsx`

**Issue:** PRD specifies calendar should switch to single month view on mobile.

**Recommendation:** Already using `numberOfMonths={1}`, but ensure touch targets are 44px minimum:
```css
.rdp-day_button {
  min-height: 44px;
  min-width: 44px;
}
```

### 20. Add Mobile Navigation
**Location:** `src/App.tsx`

**Issue:** PRD mentions hamburger menu for mobile, but current implementation doesn't include navigation.

**Recommendation:** Consider adding a mobile-friendly navigation if more views are added.

---

## 📋 Feature Checklist (PRD Compliance)

| Feature | Status | Notes |
|---------|--------|-------|
| Employee Authentication | ✅ | Uses spark.user() |
| 2026 Calendar with Holidays | ⚠️ | Calendar rendering issue |
| Leave Request Submission | ✅ | Fully implemented |
| Leave Balance Tracking | ✅ | Including offset days |
| My Leave Requests Overview | ✅ | Needs filtering |
| Manager Email Notifications | ✅ | Simulated (logged) |
| Employee Settings | ✅ | Manager email config |
| Department Leave Calendar | ❌ | Not implemented |
| Welcome Message | ❌ | Not implemented |
| Network Error Retry | ❌ | Not implemented |

---

## Implementation Priority

1. **High Priority (Critical Issues)**
   - Fix calendar day rendering issue (#1)
   - Fix Settings button visibility (#2)

2. **Medium Priority (UX Improvements)**
   - Add request status filtering (#3)
   - Add welcome message (#4)
   - Add loading skeletons (#6)

3. **Lower Priority (Enhancements)**
   - Department Team Calendar (#5)
   - Performance optimizations (#14-16)
   - Accessibility improvements (#11-13)

---

## Conclusion

The Employee Leave Planner is a solid foundation with most core features implemented. The main areas requiring attention are:

1. **Calendar rendering bug** - Critical UX issue
2. **Missing filtering** - Important for usability with many requests
3. **Accessibility** - Important for compliance and inclusivity
4. **Performance** - Bundle size optimization for better load times

With these improvements, the application will better serve UAE-based organizations and provide an excellent employee experience for leave management.
