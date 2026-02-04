# ✨ Employee Leave Planner 2026

A comprehensive leave management system for UAE-based organizations that enables employees to plan and submit their 2026 annual leave requests while viewing public holidays, remaining leave balances, and departmental leave calendars.

## 🚀 Quick Deploy (GitHub Pages - Free & Easy)

**Deployment Time:** 5 minutes | **Cost:** $0/month | **Maintenance:** Zero

### Deploy Now:

1. **Enable GitHub Pages** in repository Settings → Pages → Source: "GitHub Actions"
2. **Run the workflow**: Actions tab → "Deploy to GitHub Pages" → Run workflow
3. **Access your app** at: `https://yourusername.github.io/employee-leave-plann/`

📖 **[Full Deployment Guide](./GITHUB_PAGES_DEPLOYMENT.md)** - Custom domains, troubleshooting, and more

### Alternative Deployments:
- **Azure Static Web Apps**: See [Azure Deployment Guide](./AZURE_DEPLOYMENT.md)
- **Custom server**: Build with `npm run build` and serve the `dist` folder

---

## 🎯 Features

### Core Leave Management
- ✅ **Employee Authentication** - Secure login with Employee ID and Date of Birth
- ✅ **Leave Balance Tracking** - Real-time balance with offset days from 2025
- ✅ **2026 Calendar** - Interactive calendar with UAE public holidays
- ✅ **Leave Requests** - Submit and track annual, sick, and emergency leave
- ✅ **Manager Notifications** - Automatic email alerts (simulated for now)
- ✅ **2025 Balance Confirmation** - Review and confirm previous year's leave usage
- ✅ **PDF Export** - Download leave summary for records
- ✅ **Manager View** - Team leave overview for managers
- ✅ **HR Admin Panel** - Employee data management

### 🆕 Employee Self-Service Update
- ✅ **Update Contact Details** - Employees can update their own information
- ✅ **QR Code Access** - Scan to update (no URL typing needed)
- ✅ **Iframe Embedding** - Embed in company intranet (URL completely hidden)
- ✅ **Direct Links** - Share via email/WhatsApp with pre-filled employee ID

📖 **[How It Works](./HOW_IT_WORKS.md)** - Complete explanation of the update feature  
📖 **[URL Visibility Guide](./URL_VISIBILITY_EXPLAINED.md)** - Understand what employees see

---

## 💻 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── components/      # React components
│   ├── ui/         # Reusable UI components (shadcn/ui)
│   ├── LeaveCalendar.tsx
│   ├── LeaveRequestDialog.tsx
│   └── ...
├── lib/            # Utilities and helpers
│   ├── types.ts    # TypeScript types
│   ├── constants.ts # App constants
│   └── ...
└── App.tsx         # Main app component
```

---

## 📱 Usage Instructions

### For Employees:

1. **Login**: Use your Employee ID (e.g., BAYN00002) and Date of Birth (DDMMYYYY format)
2. **First-time setup**: Click Settings → Add your manager's email
3. **Request leave**: Click "Request Leave" → Select dates → Submit
4. **Track requests**: View all requests with status (Pending/Approved/Rejected)
5. **Confirm 2025 balance**: Review and confirm your 2025 leave records

### For Managers:

- View team leave calendar
- See all team members' leave requests
- Access HR Admin panel for data management

---

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Phosphor Icons
- **Animations**: Framer Motion
- **State**: React Hooks + Spark KV
- **Calendar**: react-day-picker

---

## 🔒 Security & Privacy

- All employee data stored in browser localStorage (client-side only)
- No data sent to external servers
- HTTPS encryption when deployed to GitHub Pages
- Each employee only sees their own data
- Manager view restricted to employees marked as managers

---

## 📞 Support

For issues or questions:
- **HR Support**: WhatsApp +971564966546
- **Technical Issues**: Open an issue in this repository

---

## 📄 License

MIT License - Copyright GitHub, Inc. (Spark Template)

---

## 🎨 Customization

### Update Company Branding

Edit `src/index.css` to change colors:
```css
--primary: #0f025d;  /* Main brand color */
--secondary: #38b6ff; /* Accent color */
```

### Update Public Holidays

Edit `src/lib/constants.ts` → `UAE_PUBLIC_HOLIDAYS_2026`

### Add/Edit Employees

Use the HR Admin Panel (managers only) or edit `src/App.tsx` → `SAMPLE_EMPLOYEES`

---

**Last Updated**: February 2026
