# 🏖️ Employee Leave Planning System

A comprehensive leave management system for UAE-based organizations built with React, TypeScript, and Vite. Enables employees to plan and submit 2026 annual leave requests while viewing public holidays, remaining leave balances, and departmental leave calendars.

## 🚀 Quick Deploy (One-Click)

Deploy this application instantly to production:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ismaelloveexcel/employee-leave-plann)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ismaelloveexcel/employee-leave-plann)

**Deployment time: 2-3 minutes** | **No credit card required**

> 💡 **Need alternatives?** See [DEPLOYMENT-ALTERNATIVES.md](./DEPLOYMENT-ALTERNATIVES.md) for SaaS solutions like BambooHR, Zoho People, and other ready-made options.

## ✨ Features

- 🔐 **Secure Authentication** - Role-based access with UAE data protection compliance
- 📅 **2026 UAE Holiday Calendar** - All public holidays pre-configured
- 📝 **Leave Request Submission** - Annual, sick, and emergency leave types
- 💰 **Balance Tracking** - Real-time leave balance with offset days from previous year
- 📧 **Manager Notifications** - Automatic email alerts for approval workflows
- 📊 **Team Calendar View** - See team availability (confidential, no names shown)
- ⚙️ **Settings Management** - Configure manager email and preferences

## 🏃 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment Options

### Option 1: Vercel (Recommended)
1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Deploy automatically in 2-3 minutes
4. Your app is live! 🎉

### Option 2: Netlify
1. Click the "Deploy to Netlify" button above
2. Authorize Netlify
3. Deploy in 2-3 minutes
4. Done!

### Option 3: Azure Static Web Apps
This repository includes GitHub Actions workflows for Azure:
- Configured in `.github/workflows/deploy-swa.yml`
- Requires `AZURE_STATIC_WEB_APPS_API_TOKEN` secret
- Automatic preview deployments for PRs

### Option 4: Azure App Service
Full-featured deployment with staging/production slots:
- Configured in `.github/workflows/deploy-appservice.yml`
- Includes smoke tests and slot swapping
- Requires Azure credentials as secrets

See [DEPLOYMENT-ALTERNATIVES.md](./DEPLOYMENT-ALTERNATIVES.md) for detailed deployment guides and SaaS alternatives.

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI + Shadcn
- **Calendar**: react-day-picker
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Authentication**: GitHub Spark

## 📚 Documentation

- [Product Requirements](./PRD.md) - Full feature specifications
- [Deployment Alternatives](./DEPLOYMENT-ALTERNATIVES.md) - SaaS options and one-click deployments
- [Security Policy](./SECURITY.md) - Security guidelines

## 🆘 Urgent/Emergency Deployment

If you need this running **immediately**:

### 1. Instant Preview (5 minutes)
```bash
npm install && npm run build && npm run preview
```
Share the local URL with your team.

### 2. Netlify Drop (10 minutes)
1. Build: `npm run build`
2. Visit: https://app.netlify.com/drop
3. Drag the `dist` folder
4. Get instant public URL

### 3. Use SaaS Alternative (1 hour)
Don't want to deploy code? Consider ready-made solutions:
- **Timetastic** - £1-3/person/month, setup in hours
- **Calamari** - $2-4/person/month, setup in 1 day
- **Zoho People** - $1.50-4/person/month, setup in 1-2 days

See [DEPLOYMENT-ALTERNATIVES.md](./DEPLOYMENT-ALTERNATIVES.md) for complete comparison.

## 🤝 Contributing

This is a Spark template project. Feel free to:
- Fork and customize for your organization
- Submit issues for bugs
- Propose enhancements via PRs

## 🧹 Just Exploring?

No problem! If you were just checking things out:
- Simply delete your Spark
- Everything will be cleaned up — no traces left behind

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
