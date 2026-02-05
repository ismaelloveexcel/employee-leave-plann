# Employee Data Template

Use this template to add new employees to `public/data/employees.json`

## Minimal Employee Template

```json
{
  "id": "UNIQUE_ID",
  "employeeId": "UNIQUE_ID",
  "name": "Employee Full Name",
  "email": "employee@company.com",
  "entity": "Company Name",
  "department": "Department Name",
  "position": "Job Title",
  "location": "Office Location",
  "employmentStatus": "Active",
  "annualLeaveEntitlement": 30,
  "leaveBalance": 30,
  "offsetBalance": 0,
  "dateOfBirth": "DDMMYYYY",
  "isManager": false
}
```

## Complete Employee Template (All Fields)

```json
{
  "id": "BAYN00001",
  "employeeId": "BAYN00001",
  "name": "John Doe",
  "email": "john.doe@company.com",
  "entity": "Your Company Name LLC",
  "department": "Sales",
  "position": "Sales Manager",
  "location": "Head Office",
  "workSchedule": "5 days",
  "joiningDate": "01-Jan-24",
  "sixMonthEvalDate": "01-Jul-24",
  "probationStatus": "Confirmed",
  "employmentStatus": "Active",
  "annualLeaveEntitlement": 30,
  "extraHoursCompensation": "N/A",
  "openingBalanceFromPreviousYear": 5,
  "leaveBalance": 35,
  "offsetBalance": 0,
  "monthlyLeaves": {
    "january": {
      "annualLeaves": 2,
      "offsetDays": 0
    },
    "february": {
      "annualLeaves": 0,
      "offsetDays": 0
    }
  },
  "totalAnnualLeavesAccrued": 30,
  "totalAnnualLeavesAvailed": 0,
  "totalOffsetDaysAccrued": 0,
  "totalOffsetDaysAvailed": 0,
  "leaveBalanceEOY": 35,
  "offsetBalanceEOY": 0,
  "managerEmail": "manager@company.com",
  "isManager": false,
  "dateOfBirth": "15031990"
}
```

## Field Explanations

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique identifier | `"BAYN00001"` |
| `employeeId` | Login ID (same as id) | `"BAYN00001"` |
| `name` | Full name | `"John Doe"` |
| `employmentStatus` | Status | `"Active"`, `"Inactive"`, `"On Leave"`, `"Terminated"` |
| `annualLeaveEntitlement` | Annual leave days entitled | `30` |
| `leaveBalance` | Current leave balance | `30` |
| `dateOfBirth` | DOB as password (DDMMYYYY) | `"15031990"` |

### Common Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| `email` | Work email | `"john@company.com"` |
| `department` | Department | `"Sales"`, `"IT"`, `"HR"` |
| `position` | Job title | `"Manager"`, `"Developer"` |
| `location` | Office location | `"Head Office"`, `"Branch"` |
| `workSchedule` | Work days | `"5 days"`, `"6 days"`, `"Shift"` |
| `joiningDate` | Date joined (DD-MMM-YY) | `"15-Mar-24"` |
| `probationStatus` | Probation status | `"Confirmed"`, `"Probation"` |
| `offsetBalance` | Offset days balance | `0` |
| `managerEmail` | Manager's email | `"boss@company.com"` |
| `isManager` | Is this person a manager? | `true`, `false` |

### Advanced Fields (Optional)

| Field | Description |
|-------|-------------|
| `sixMonthEvalDate` | 6-month evaluation date |
| `extraHoursCompensation` | `"N/A"`, `"Offset"`, `"Overtime Pay"` |
| `openingBalanceFromPreviousYear` | Leave carried from last year |
| `monthlyLeaves` | Month-by-month leave tracking |
| `totalAnnualLeavesAccrued` | Total annual leaves earned |
| `totalAnnualLeavesAvailed` | Total annual leaves used |
| `totalOffsetDaysAccrued` | Total offset days earned |
| `totalOffsetDaysAvailed` | Total offset days used |
| `leaveBalanceEOY` | Balance at end of year |
| `offsetBalanceEOY` | Offset balance at end of year |

## Date of Birth (Password) Format

The `dateOfBirth` field is used as the employee's login password.

**Format:** `DDMMYYYY` (exactly 8 digits)

**Examples:**
- March 15, 1990 → `"15031990"`
- January 5, 1985 → `"05011985"`
- December 25, 2000 → `"25122000"`

**Important:**
- Must include leading zeros (January = `01`, not `1`)
- No spaces, dashes, or slashes
- Year must be 4 digits

## Work Schedule Options

- `"5 days"` - Monday to Friday
- `"6 days"` - Monday to Saturday  
- `"Shift"` - Shift-based schedule

## Probation Status Options

- `"Confirmed"` - Employee confirmed after probation
- `"Probation"` - Currently on probation
- `"Extended Probation"` - Probation period extended

## Employment Status Options

- `"Active"` - Currently working
- `"Inactive"` - Temporarily inactive
- `"On Leave"` - Currently on extended leave
- `"Terminated"` - Employment ended

## Extra Hours Compensation Options

- `"N/A"` - Not applicable
- `"Offset"` - Compensated with offset days
- `"Overtime Pay"` - Paid overtime

## Monthly Leaves Structure

If you need to track monthly leave usage:

```json
"monthlyLeaves": {
  "january": {
    "annualLeaves": 2,
    "offsetDays": 0
  },
  "february": {
    "annualLeaves": 1,
    "offsetDays": 1
  },
  "march": {
    "annualLeaves": 0,
    "offsetDays": 0
  }
}
```

Months must be lowercase: `january`, `february`, `march`, `april`, `may`, `june`, `july`, `august`, `september`, `october`, `november`, `december`

## Example: Multiple Employees

```json
[
  {
    "id": "EMP001",
    "employeeId": "EMP001",
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "department": "Sales",
    "position": "Sales Manager",
    "employmentStatus": "Active",
    "annualLeaveEntitlement": 30,
    "leaveBalance": 30,
    "dateOfBirth": "15031990",
    "isManager": true
  },
  {
    "id": "EMP002",
    "employeeId": "EMP002",
    "name": "Bob Smith",
    "email": "bob@company.com",
    "department": "IT",
    "position": "Developer",
    "employmentStatus": "Active",
    "annualLeaveEntitlement": 25,
    "leaveBalance": 25,
    "dateOfBirth": "20051985",
    "isManager": false,
    "managerEmail": "alice@company.com"
  },
  {
    "id": "EMP003",
    "employeeId": "EMP003",
    "name": "Carol White",
    "email": "carol@company.com",
    "department": "HR",
    "position": "HR Manager",
    "employmentStatus": "Active",
    "annualLeaveEntitlement": 28,
    "leaveBalance": 28,
    "dateOfBirth": "10121992",
    "isManager": true
  }
]
```

## Special Employee: HR Admin

For HR access, add an admin employee:

```json
{
  "id": "ADMIN001",
  "employeeId": "ADMIN",
  "name": "HR Admin",
  "email": "hr@company.com",
  "entity": "Your Company",
  "department": "HR",
  "position": "HR Manager",
  "employmentStatus": "Active",
  "annualLeaveEntitlement": 0,
  "leaveBalance": 0,
  "offsetBalance": 0,
  "dateOfBirth": "01011990",
  "isManager": true
}
```

**Login:** Employee ID: `ADMIN`, DOB: `01011990`

## How to Use This Template

1. **Copy the minimal or complete template** above
2. **Fill in your employee's information**
3. **Paste into `public/data/employees.json`**
4. **Rebuild and deploy:**
   ```bash
   npm run build
   # Then deploy to your hosting (GitHub Pages, Netlify, etc.)
   ```

## Validation Checklist

Before deploying, check:

- [ ] All employee IDs are unique
- [ ] All `dateOfBirth` fields are exactly 8 digits (DDMMYYYY)
- [ ] All emails are valid (if provided)
- [ ] `employmentStatus` is one of: Active, Inactive, On Leave, Terminated
- [ ] `annualLeaveEntitlement` and `leaveBalance` are numbers
- [ ] JSON syntax is valid (use a validator: https://jsonlint.com)
- [ ] At least one employee has `isManager: true` (for approvals)

## Testing

After adding employees:

1. Build: `npm run build`
2. Preview: `npm run preview`
3. Open: `http://localhost:4173`
4. Try logging in with Employee ID and DOB
5. Verify employee data appears correctly

## Need Help?

See **[EMPLOYEE_DATA_GUIDE.md](./EMPLOYEE_DATA_GUIDE.md)** for comprehensive documentation.
