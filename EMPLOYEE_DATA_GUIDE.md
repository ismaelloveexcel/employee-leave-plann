# Employee Data Storage Guide

## Where to Store Employee Information

This static website application supports **three ways** to store employee information, depending on your deployment and management needs.

---

## 📍 Storage Options Summary

| Storage Location | Best For | Persistent? | Shared Across Users? | Easy to Update? |
|------------------|----------|-------------|---------------------|-----------------|
| **Option 1: Public JSON File** | Production, Multiple Users | ✅ Yes | ✅ Yes | ✅ Easy |
| **Option 2: Browser LocalStorage** | Individual Users | ✅ Yes | ❌ No | 🟡 Moderate |
| **Option 3: Hardcoded in App.tsx** | Demo/Testing | ✅ Yes | ✅ Yes | ❌ Requires rebuild |

---

## ✅ Option 1: Public JSON File (Recommended for Production)

### Location
```
public/data/employees.json
```

### How It Works
1. The application automatically loads employee data from this file on startup
2. Data is cached in browser's localStorage for faster access
3. All users accessing the deployed site see the same employee list
4. File is included in the static build (`dist/data/employees.json`)

### When to Use
- ✅ Production deployment
- ✅ Multiple employees using the app
- ✅ HR needs to update employee data regularly
- ✅ Want centralized employee database

### Adding/Updating Employees

**Step 1: Edit the JSON file**

Open `public/data/employees.json` and add your employee data:

```json
[
  {
    "id": "BAYN00001",
    "employeeId": "BAYN00001",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "entity": "Your Company Name",
    "department": "Sales",
    "position": "Sales Manager",
    "location": "Head Office",
    "workSchedule": "5 days",
    "joiningDate": "01-Jan-24",
    "probationStatus": "Confirmed",
    "employmentStatus": "Active",
    "annualLeaveEntitlement": 30,
    "extraHoursCompensation": "N/A",
    "openingBalanceFromPreviousYear": 0,
    "leaveBalance": 30,
    "offsetBalance": 0,
    "monthlyLeaves": {},
    "totalAnnualLeavesAccrued": 30,
    "totalAnnualLeavesAvailed": 0,
    "totalOffsetDaysAccrued": 0,
    "totalOffsetDaysAvailed": 0,
    "leaveBalanceEOY": 30,
    "offsetBalanceEOY": 0,
    "managerEmail": "manager@company.com",
    "isManager": false,
    "dateOfBirth": "15031990"
  }
]
```

**Step 2: Rebuild and deploy**

```bash
# Build the application
npm run build

# The employees.json file is automatically copied to dist/data/

# Deploy (depending on your hosting)
# - GitHub Pages: git push (auto-deploys)
# - Netlify/Vercel: git push or re-upload dist/
# - Local: Use the new dist/ folder
```

**Step 3: Refresh the application**

Users will see the new employee data immediately on page refresh.

---

## 🔄 Option 2: Browser LocalStorage (Per-User Data)

### Location
Browser's localStorage database (automatic)

### How It Works
1. Application saves employee data to browser's localStorage
2. Each browser/device has its own separate data
3. Data persists across page refreshes and browser restarts
4. Not shared between different browsers or users

### When to Use
- ✅ Individual employee using their own device
- ✅ Testing employee-specific scenarios
- ✅ Personal leave tracking
- ❌ NOT for shared/company-wide deployment

### How Data Gets Into LocalStorage

**Automatic:**
- When app loads, it reads from `public/data/employees.json`
- Data is cached in localStorage for faster access
- Key: `leave_planner_employees`

**Manual (via HR Admin Panel):**
1. Login as admin (Employee ID: `ADMIN`, DOB: `01011990`)
2. Go to HR Admin Panel
3. Import Excel/CSV file with employee data
4. Data is saved to localStorage

**Programmatic (Browser Console):**
```javascript
// Add/update employees manually
const employees = [
  {
    id: "EMP001",
    employeeId: "EMP001",
    name: "Jane Smith",
    // ... other fields
  }
];

localStorage.setItem('leave_planner_employees', JSON.stringify(employees));
location.reload(); // Refresh to load new data
```

### Viewing LocalStorage Data

1. Open browser Developer Tools (F12)
2. Go to Application → Storage → Local Storage
3. Find key: `leave_planner_employees`
4. View/edit the JSON data

### Clearing LocalStorage

```javascript
// Clear all employee data
localStorage.removeItem('leave_planner_employees');
location.reload();
```

---

## 💻 Option 3: Hardcoded in App.tsx (Demo/Testing Only)

### Location
```
src/App.tsx
Lines 70-200 (approximately)
```

### How It Works
- Employee data is defined directly in the source code
- Used as fallback if no other data source available
- Baked into the application build

### When to Use
- ✅ Demo/testing purposes
- ✅ Development environment
- ❌ NOT for production (requires rebuild for every change)

### Adding Employees

**Step 1: Edit App.tsx**

Find the `SAMPLE_EMPLOYEES` constant around line 72:

```typescript
const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employeeId: 'BAYN00002',
    name: 'Syed Irfan Ali',
    // ... rest of fields
  },
  // Add new employee here
  {
    id: '4',
    employeeId: 'BAYN00004',
    name: 'Your New Employee',
    email: 'employee@company.com',
    entity: 'Your Company',
    department: 'IT',
    position: 'Developer',
    location: 'Head Office',
    workSchedule: '5 days',
    joiningDate: '01-Jan-26',
    probationStatus: 'Confirmed',
    employmentStatus: 'Active',
    annualLeaveEntitlement: 30,
    extraHoursCompensation: 'N/A',
    openingBalanceFromPreviousYear: 0,
    leaveBalance: 30,
    offsetBalance: 0,
    dateOfBirth: '01011990',
    isManager: false,
  },
];
```

**Step 2: Rebuild**

```bash
npm run build
npm run preview  # Test locally
```

**Note:** This method requires rebuilding and redeploying every time you add/update employees. Use Option 1 (JSON file) for production instead.

---

## 📊 Importing from Excel/CSV

The application supports importing employee data from Excel or CSV files.

### Excel Format

Your Excel file should have these columns:

| Required Columns | Example Value |
|------------------|---------------|
| Employee No | BAYN00001 |
| Employee Name | John Doe |
| Company Email Address | john@company.com |
| Entity | Baynunah Group |
| Department | Sales |
| Job Title | Sales Manager |
| Location | Head Office |
| Work Schedule | 5 days |
| Joining Date | 01-Jan-24 |
| Probation Status | Confirmed |
| Employment Status | Active |
| Annual Leave Entitlement | 30 |
| Leave Balance | 30 |
| Offset Balance | 0 |
| DOB | 15031990 |

Optional monthly leave columns:
- January Annual, January Offset
- February Annual, February Offset
- ... (for each month)

### How to Import

**Method 1: Via HR Admin Panel (In-Browser)**

1. Login as admin (Employee ID: `ADMIN`, DOB: `01011990`)
2. Navigate to HR Admin Panel
3. Click "Import Excel/CSV"
4. Select your file
5. Data is parsed and saved to browser localStorage

**Method 2: Convert Excel to JSON (For public/data/employees.json)**

Use the provided parser:

```typescript
// See src/lib/data-sync-service.ts
import { parseExcelRowToEmployee } from './lib/data-sync-service';

// Read Excel rows (use a library like xlsx or papaparse)
const rows = [...]; // Your Excel data as array of objects

// Convert to Employee objects
const employees = rows
  .map(row => parseExcelRowToEmployee(row))
  .filter(emp => emp !== null);

// Save to JSON
const json = JSON.stringify(employees, null, 2);
// Copy to public/data/employees.json
```

**Online Tools:**
- Use [Convertio](https://convertio.co/xlsx-json/) or similar to convert XLSX → JSON
- Or use [csvjson.com](https://www.csvjson.com/csv2json) for CSV → JSON

---

## 🔐 Security Considerations

### Date of Birth (Password)

- `dateOfBirth` field is used as the employee's password
- Format: `DDMMYYYY` (e.g., `15031990` for March 15, 1990)
- **Important:** This field is removed from localStorage for security
- Only stored in memory during session

### Where DOB is NOT Stored:
- ❌ Browser localStorage (removed before saving)
- ❌ Browser cache
- ❌ Console logs

### Where DOB IS Stored:
- ✅ `public/data/employees.json` (source of truth)
- ✅ Hardcoded in `App.tsx` (demo data)
- ⚠️ These files should not be public if using real employee data!

### For Production Security:

**Option A: Use Backend API (Recommended for Sensitive Data)**
- Store employees in Azure SQL/Cosmos DB
- Implement authentication API
- Remove DOB from public JSON
- See `AZURE_DEPLOYMENT.md` for backend integration

**Option B: Basic Security for Static Site**
- Deploy to private GitHub Pages (private repo)
- Use Netlify/Vercel password protection
- Restrict access to organization network only
- Educate employees not to share login credentials

---

## 🎯 Recommended Setup by Scenario

### Small Team (< 20 employees)
**Use:** Option 1 (Public JSON File)
- Easy to maintain
- Centralized data
- No backend needed
```
public/data/employees.json → Build → Deploy
```

### Individual Employee
**Use:** Option 2 (LocalStorage)
- Personal data only
- No sharing needed
```
Login → Use app → Data saved automatically
```

### Demo/Testing
**Use:** Option 3 (Hardcoded)
- Quick setup
- No file management
```
Edit App.tsx → Rebuild → Test
```

### Large Organization (> 50 employees)
**Use:** Backend API (See AZURE_DEPLOYMENT.md)
- Scalable
- Secure
- Proper authentication
```
Azure SQL → API → Static Site
```

---

## 📝 Field Reference

### Required Fields

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `id` | string | "BAYN00001" | Unique identifier |
| `employeeId` | string | "BAYN00001" | Login ID |
| `name` | string | "John Doe" | Full name |
| `employmentStatus` | string | "Active" | Active/Inactive |
| `annualLeaveEntitlement` | number | 30 | Annual leave days |
| `leaveBalance` | number | 30 | Current balance |
| `dateOfBirth` | string | "15031990" | DOB (password) |

### Optional But Recommended

| Field | Type | Example |
|-------|------|---------|
| `email` | string | "john@company.com" |
| `department` | string | "Sales" |
| `position` | string | "Manager" |
| `managerEmail` | string | "boss@company.com" |
| `isManager` | boolean | true/false |

See `src/lib/types.ts` for complete Employee interface.

---

## 🔄 Data Sync Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                     EMPLOYEE DATA FLOW                      │
└─────────────────────────────────────────────────────────────┘

1. INITIAL SETUP
   Excel/CSV → Convert to JSON → public/data/employees.json

2. APPLICATION STARTUP
   public/data/employees.json → localStorage (cache) → App

3. RUNTIME UPDATES
   User Actions → localStorage → Reflected in UI

4. DEPLOYMENT UPDATES
   Update employees.json → Rebuild → Deploy → Users refresh

5. EXPORT/BACKUP
   App → Export to JSON → Download → Store safely
```

---

## 🛠️ Troubleshooting

### Employees Not Showing Up

**Check 1: Is the JSON file valid?**
```bash
# Validate JSON syntax
cat public/data/employees.json | python -m json.tool
```

**Check 2: Is the file in the right location?**
```bash
# Should exist
ls -la public/data/employees.json
ls -la dist/data/employees.json  # After build
```

**Check 3: Clear browser cache**
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Changes Not Reflected

**Solution: Clear cache and rebuild**
```bash
# Clear build cache
rm -rf dist

# Rebuild
npm run build

# Redeploy
git push  # Or upload dist/ folder
```

### Login Not Working

**Check DOB format:**
- Must be exactly 8 digits: `DDMMYYYY`
- Example: March 15, 1990 = `15031990`
- Example: January 5, 1985 = `05011985`

---

## 📚 Related Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - How to deploy the static site
- **[STATIC_SITE_PROPOSAL.md](./STATIC_SITE_PROPOSAL.md)** - Technical architecture
- **[AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md)** - Backend integration (if needed)
- **[PRD.md](./PRD.md)** - Product requirements
- **`src/lib/types.ts`** - Employee data structure
- **`src/lib/data-sync-service.ts`** - Data management code

---

## 💡 Quick Examples

### Add One Employee (JSON File)

```json
{
  "id": "EMP001",
  "employeeId": "EMP001",
  "name": "Alice Johnson",
  "email": "alice@company.com",
  "entity": "ACME Corp",
  "department": "Engineering",
  "position": "Senior Developer",
  "employmentStatus": "Active",
  "annualLeaveEntitlement": 25,
  "leaveBalance": 25,
  "dateOfBirth": "20051990"
}
```

### Add Multiple Employees (Copy-Paste)

See the existing `public/data/employees.json` file for a complete example with multiple employees.

### Update Leave Balance

Edit the JSON file:
```json
{
  "id": "EMP001",
  "leaveBalance": 20,  // Changed from 25 to 20
  // ... rest stays same
}
```

Rebuild and deploy.

---

## ✅ Summary

**For Production:** Use `public/data/employees.json`
- ✅ Easy to update
- ✅ Shared across all users
- ✅ Centralized management
- ✅ No rebuild needed for data changes (just redeploy)

**For Testing:** Use hardcoded data in `App.tsx`
- ✅ Quick setup
- ❌ Requires rebuild for changes

**For Individual Use:** LocalStorage automatically managed
- ✅ Data persists automatically
- ✅ No configuration needed

---

**Need help?** See the troubleshooting section above or check the related documentation.
