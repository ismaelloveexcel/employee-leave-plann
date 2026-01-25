# Planning Guide

A comprehensive leave management system for UAE-based organizations that enables employees to plan and submit their 2026 annual leave requests while viewing public holidays, remaining leave balances, and departmental leave calendars with full confidentiality compliance.

**Experience Qualities**:
1. **Secure** - Every employee sees only their own data with role-based access ensuring privacy and compliance with UAE data protection standards
2. **Transparent** - Clear visibility of leave balances, public holidays, and approval status creates trust and reduces HR back-and-forth
3. **Intuitive** - Visual calendar interface makes leave planning effortless, showing conflicts and available dates at a glance

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused leave management tool with calendar visualization, form submission, and basic state management. It doesn't require complex workflows or multiple interconnected views, making it ideal as a lightweight HR utility.

## Essential Features

### 1. Employee Authentication & Profile
- **Functionality**: Identifies the logged-in user and displays their profile information
- **Purpose**: Ensures data confidentiality by showing only authorized information to each employee
- **Trigger**: Automatic on app load using spark.user()
- **Progression**: App loads → Fetch user profile → Display personalized dashboard with name, department, and leave balance
- **Success criteria**: User sees their own name, department, and current leave balance; cannot access other employees' data

### 2. 2026 Calendar with Public Holidays
- **Functionality**: Interactive calendar displaying all UAE public holidays for 2026
- **Purpose**: Helps employees plan leave around official holidays and long weekends
- **Trigger**: Displays automatically on main dashboard
- **Progression**: Calendar renders → UAE public holidays highlighted → User can navigate months → Hover shows holiday names
- **Success criteria**: All 11 UAE public holidays correctly marked; dates are non-interactive but clearly distinguished from regular days

### 3. Leave Request Submission
- **Functionality**: Form to submit leave requests with date range selection, leave type, and optional offset days usage
- **Purpose**: Allows employees to formally request time off with proper documentation and utilize carried-over days from previous year
- **Trigger**: User clicks "Request Leave" button
- **Progression**: Click button → Dialog opens → Select start/end dates → Choose leave type (Annual/Sick/Emergency) → Optionally select offset days to use → Add optional notes → Submit → Confirmation message
- **Success criteria**: Request saved with pending status; dates validated (no past dates, within 2026, doesn't exceed balance); offset days properly calculated; user receives confirmation showing breakdown of regular vs offset days used

### 4. Leave Balance Tracking
- **Functionality**: Real-time display of remaining leave days accounting for pending and approved requests, including offset days (carried over from previous year)
- **Purpose**: Prevents over-booking and helps employees plan their time off strategically, while making use of carried-over days
- **Trigger**: Updates automatically when viewing dashboard or after submitting requests
- **Progression**: Fetch employee data → Calculate: Total balance - (Approved + Pending) → Calculate offset balance → Display with visual indicator → Warn if balance low
- **Success criteria**: Accurate calculation shown for both regular and offset days; visual warning appears when balance drops below 5 days; prevents submission exceeding available days

### 5. My Leave Requests Overview
- **Functionality**: List view of all submitted leave requests with status indicators
- **Purpose**: Provides transparency on request status and history
- **Trigger**: Displays in sidebar or dedicated section
- **Progression**: User views dashboard → Requests listed by date → Status badges show Pending/Approved/Rejected → Can expand for details
- **Success criteria**: All requests visible; status clearly indicated; sorted by submission date (newest first); can be filtered by status

### 6. Department Leave Calendar (Optional View)
- **Functionality**: Aggregated view showing when team members are on leave (names hidden for confidentiality)
- **Purpose**: Helps employees coordinate leave to ensure adequate team coverage
- **Trigger**: User clicks "Team Calendar" tab
- **Progression**: Switch to team view → Calendar shows blocked dates (no names) → Hover shows "X people on leave" → User can plan around busy periods
- **Success criteria**: Shows count of absent team members per day without revealing identities; only displays approved leaves

## Edge Case Handling

- **No Leave Balance**: Disable leave request button and show warning message with contact HR instruction
- **Overlapping Requests**: Prevent submission if dates overlap with existing pending/approved requests
- **Weekend/Holiday Selection**: Allow but show warning that public holidays don't count against leave balance
- **Past Date Selection**: Disable all dates before today in calendar picker
- **2027 Dates**: Restrict calendar to 2026 only; show message for future year planning
- **First-Time User**: Show welcome message with brief instructions on how to submit leave requests
- **Network Errors**: Display friendly error message with retry option; don't lose form data
- **Concurrent Submissions**: Handle race conditions by validating balance server-side before confirming

## Design Direction

The design should evoke professionalism, clarity, and trust. This is an HR tool used by diverse employees, so it must feel official yet approachable. The interface should communicate reliability and security while maintaining visual warmth. Think clean corporate aesthetics with a human touch - structured layouts with friendly micro-interactions that make administrative tasks feel less bureaucratic.

## Color Selection

A professional teal-and-coral palette that balances corporate credibility with approachability:

- **Primary Color**: Deep Teal (oklch(0.45 0.08 210)) - Represents trust, professionalism, and stability; used for headers, primary buttons, and navigation
- **Secondary Colors**: 
  - Warm Coral (oklch(0.72 0.14 35)) - For accents, approved status, and positive actions
  - Soft Sage (oklch(0.88 0.04 160)) - For backgrounds and subtle highlights
  - Slate Gray (oklch(0.35 0.01 240)) - For secondary text and borders
- **Accent Color**: Bright Coral (oklch(0.68 0.16 30)) - For CTAs, active states, and attention-grabbing elements like "Submit Request"
- **Foreground/Background Pairings**:
  - Background (Cream #FAFAF8 oklch(0.98 0.005 85)): Dark slate text (oklch(0.25 0.01 240)) - Ratio 12.5:1 ✓
  - Primary (Deep Teal oklch(0.45 0.08 210)): White text (oklch(1 0 0)) - Ratio 6.8:1 ✓
  - Accent (Bright Coral oklch(0.68 0.16 30)): White text (oklch(1 0 0)) - Ratio 4.6:1 ✓
  - Card (White oklch(1 0 0)): Dark slate text (oklch(0.25 0.01 240)) - Ratio 14.2:1 ✓
  - Muted (Soft Sage oklch(0.88 0.04 160)): Medium slate text (oklch(0.45 0.01 240)) - Ratio 5.2:1 ✓

## Font Selection

Typography should feel professional yet warm - clean enough for corporate use but personable enough for daily interaction by all employee levels.

- **Primary Font**: Plus Jakarta Sans (headers and UI elements) - Modern geometric sans with friendly rounded terminals
- **Secondary Font**: Inter (body text and data display) - Excellent readability for forms and tables

**Typographic Hierarchy**:
- H1 (Page Title): Plus Jakarta Sans Bold / 32px / -0.02em letter spacing
- H2 (Section Headers): Plus Jakarta Sans Semibold / 24px / -0.01em letter spacing
- H3 (Card Titles): Plus Jakarta Sans Semibold / 18px / normal spacing
- Body (Forms, Lists): Inter Regular / 15px / 0.4px letter spacing / 1.6 line height
- Small (Helper Text): Inter Regular / 13px / 0.3px letter spacing / 1.5 line height
- Button Text: Plus Jakarta Sans Medium / 15px / 0.2px letter spacing

## Animations

Animations should feel professional and purposeful - subtle transitions that guide attention without feeling playful or distracting in a corporate context.

Use framer-motion for smooth, physics-based animations: page transitions (300ms ease-out), button hover states with scale (1.02) and slight shadow growth, calendar date selection with gentle bounce (spring preset), form field focus with subtle glow pulse, status badge changes with color fade (200ms), successful submission with checkmark draw animation (500ms), and loading states with skeleton shimmer instead of spinners.

## Component Selection

**Components**:
- **Calendar**: Custom built with react-day-picker - displays months with public holidays highlighted, supports date range selection, shows disabled dates
- **Dialog**: Shadcn Dialog - for leave request form modal
- **Card**: Shadcn Card - for leave balance display, request history items, and dashboard sections
- **Button**: Shadcn Button - primary variant for "Submit Request", outline for secondary actions
- **Input/Textarea**: Shadcn Input + Textarea - for notes/reason field in request form
- **Select**: Shadcn Select - for leave type dropdown (Annual, Sick, Emergency)
- **Badge**: Shadcn Badge - for status indicators (Pending/Approved/Rejected)
- **ScrollArea**: Shadcn ScrollArea - for leave request list
- **Avatar**: Shadcn Avatar - for user profile display
- **Separator**: Shadcn Separator - to divide sections
- **Alert**: Shadcn Alert - for warnings (low balance, overlapping dates)
- **Tooltip**: Shadcn Tooltip - for hover information on calendar dates

**Customizations**:
- Custom calendar day component that layers public holidays, leave requests, and current selection
- Custom leave balance progress ring showing percentage of remaining days
- Custom status timeline component showing request progression

**States**:
- Buttons: Default with teal bg → Hover with slight scale + darker shade → Active with pressed transform → Disabled with reduced opacity + no hover
- Inputs: Default with subtle border → Focus with teal ring + slight shadow → Error with coral border + shake animation → Success with green checkmark icon
- Calendar dates: Default state → Hover with background highlight → Selected with teal background → Disabled with reduced opacity → Public holiday with coral dot indicator

**Icon Selection**:
- CalendarBlank (main navigation)
- Plus (add leave request)
- CheckCircle (approved status)
- Clock (pending status)
- XCircle (rejected status)
- AirplaneTakeoff (leave request icon)
- User (profile)
- Buildings (department)
- Info (tooltips and help text)

**Spacing**:
- Page padding: p-6 (24px)
- Card padding: p-6 
- Card gap: gap-6
- Form field spacing: space-y-4 (16px)
- Section spacing: space-y-8 (32px)
- Button padding: px-6 py-3
- Tight content: gap-2 (8px)
- Generous sections: gap-10 (40px)

**Mobile**:
- Calendar switches to single month view (no side-by-side months)
- Leave request list becomes full-width with stacked content
- Balance cards stack vertically instead of grid
- Dialog/modal becomes full-screen sheet on mobile
- Navigation becomes hamburger menu
- Reduce text sizes: H1 to 24px, body to 14px
- Touch targets minimum 44px height for all interactive elements
