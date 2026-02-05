# Employee Leave Planner 2026

A modern, static website application for managing employee leave requests and tracking for UAE-based organizations. Built with React, TypeScript, and Vite as a fully client-side application that requires no backend infrastructure.

## 🌟 Features

- **Employee Dashboard**: View leave balance, submit requests, and track status
- **2026 Calendar**: Interactive calendar with UAE public holidays highlighted
- **Leave Management**: Track annual leave, sick leave, and emergency leave
- **Email Notifications**: Manager notification system for leave requests
- **Offline Support**: All data stored locally in browser
- **Export/Import**: Backup and restore your leave data
- **Manager View**: Review and manage team leave requests
- **HR Admin Panel**: Comprehensive leave management for HR teams

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Running as Static Site

After building, you can serve the static files:

```bash
# Using the built-in script
npm run serve:local

# Or manually with any HTTP server
cd dist && python3 -m http.server 3000
```

## 📦 Static Site Deployment

This application is built as a **static website** using Vite and can be deployed to any static hosting service without requiring a backend server or database.

### Deployment Options

#### 1. GitHub Pages (Recommended - Free)

**Automated Deployment:**
- Push to `main` branch
- GitHub Actions will automatically build and deploy
- Access at: `https://yourusername.github.io/employee-leave-plann`

**Enable in Settings:**
1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. The workflow file is already configured at `.github/workflows/static-deploy.yml`

#### 2. Netlify (One-Click)

Or manually:
1. Connect your GitHub repository to Netlify
2. Build settings are pre-configured in `netlify.toml`
3. Deploy!

#### 3. Vercel (Instant)

```bash
npx vercel --prod
```

Or connect your repository at vercel.com - configuration is in `vercel.json`

#### 4. Any Static Host

Upload the `dist/` folder to any web server:
- Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps  
- Firebase Hosting
- Any Apache/Nginx server

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📋 Why This is a Static Site Solution

This application uses **Vite** as a static site generator, which is listed in GitHub's Static Site Generators collection.

### Advantages:

✅ **No Deployment Infrastructure Needed**
- Runs entirely in the browser
- No backend servers required
- No database to manage

✅ **Zero Hosting Costs**
- Free hosting on GitHub Pages, Netlify, Vercel
- Or run completely locally

✅ **Maximum Security**
- No server-side code to exploit
- All data stays in user's browser
- HTTPS available on all hosting platforms

✅ **Perfect for Small Teams**
- Simple setup and maintenance
- No DevOps expertise required
- Easy to backup and restore

✅ **Fast Performance**
- Optimized static assets
- CDN-friendly
- Instant page loads after first visit

### How It Works:

1. **Build Process**: `npm run build` generates optimized static HTML, CSS, and JavaScript
2. **Data Storage**: Uses browser's LocalStorage and IndexedDB for all data
3. **No Backend**: All logic runs client-side in the browser
4. **Deploy Anywhere**: Copy the `dist/` folder to any web hosting service

## 🏗️ Architecture

```
employee-leave-plann/
├── src/                    # React application source
│   ├── components/         # UI components
│   ├── lib/               # Utilities and types
│   └── App.tsx            # Main application
├── public/                # Static assets
│   └── data/              # 📝 Employee data storage
│       └── employees.json # Put employee info here!
├── dist/                  # Build output (generated)
├── .github/workflows/     # GitHub Actions for deployment
├── vite.config.ts         # Vite configuration (static build)
├── netlify.toml          # Netlify deployment config
├── vercel.json           # Vercel deployment config
├── EMPLOYEE_DATA_GUIDE.md # 📝 Employee data documentation
├── EMPLOYEE_TEMPLATE.md   # Employee data templates
├── DEPLOYMENT.md         # Detailed deployment guide
└── STATIC_SITE_PROPOSAL.md  # Technical proposal document
```

## 🔒 Data Privacy & Security

- **Local Data Only**: All employee data stored in browser storage
- **No Cloud Database**: No external data transmission
- **User Control**: Each user owns their data
- **Export/Import**: Easy backup and data portability
- **HTTPS**: Secure when hosted (free with all hosting options)

> **📝 Where to Store Employee Info:** See **[EMPLOYEE_DATA_GUIDE.md](./EMPLOYEE_DATA_GUIDE.md)** for detailed instructions on managing employee data in the static site setup.

## 📚 Documentation

- **[EMPLOYEE_DATA_GUIDE.md](./EMPLOYEE_DATA_GUIDE.md)** - **NEW!** Where and how to store employee information
- **[EMPLOYEE_TEMPLATE.md](./EMPLOYEE_TEMPLATE.md)** - **NEW!** Ready-to-use employee data templates
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment guide
- [STATIC_SITE_PROPOSAL.md](./STATIC_SITE_PROPOSAL.md) - Technical proposal and rationale
- [QUICK_START.md](./QUICK_START.md) - 5-minute quick start
- [PRD.md](./PRD.md) - Product requirements and features
- [RECOMMENDATIONS.md](./RECOMMENDATIONS.md) - Code review and improvements

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7 (Static Site Generator)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Storage**: Browser LocalStorage + IndexedDB
- **Icons**: Phosphor Icons

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any modern browser with ES2020+ support

## 🤝 Contributing

This is a static site application. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test locally (`npm run build && npm run preview`)
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

The Spark Template files and resources from GitHub are licensed under the MIT license, Copyright GitHub, Inc.

---

**Built with ❤️ as a static website solution - no backend required!**
