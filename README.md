# 🏢 Employee Leave Planning App

A modern, enterprise-ready leave management system built with React, TypeScript, and Vite. Designed for UAE-based organizations with comprehensive leave tracking, analytics, and management features.

## ✨ Features

- 📅 **Leave Management**: Request, approve, and track employee leave
- 📊 **Analytics Dashboard**: Visualize leave patterns and team availability
- 👥 **Team Calendar**: View team leave schedules at a glance
- 🔔 **Notifications**: Real-time updates on leave requests
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Modern UI**: Built with Radix UI and Tailwind CSS
- 🔒 **Secure**: Enterprise-grade security with Azure AD integration

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/ismaelloveexcel/employee-leave-plann.git
cd employee-leave-plann

# Install dependencies
npm ci

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploy to Azure (5 Minutes)

Deploy this application to Azure with **minimal manual intervention** using our automated setup:

### Option 1: Automated Setup (Recommended)

```bash
# Make the setup script executable
chmod +x setup-azure.sh

# Run the automated setup
./setup-azure.sh
```

The script will guide you through:
1. ✅ Creating Azure resources
2. ✅ Configuring GitHub Actions
3. ✅ Setting up automatic deployments
4. ✅ Deploying your application

### Option 2: Manual Setup

See our comprehensive guides:
- **[🚀 Quick Deployment Guide](DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[📋 Deployment Checklist](DEPLOYMENT-CHECKLIST.md)** - Complete checklist for deployment
- **[📚 Detailed Setup](employee-leave-azure-agent/docs/README-DEPLOYMENT.md)** - Advanced configuration options

### Recommended: Azure Static Web Apps

For this React SPA, we recommend **Azure Static Web Apps**:
- ✅ Free tier available
- ✅ Automatic CI/CD with GitHub Actions
- ✅ Global CDN included
- ✅ Zero server management
- ✅ Preview environments for PRs

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Radix UI + Shadcn/ui
- **State Management**: React Query (TanStack)
- **Form Handling**: React Hook Form + Zod
- **Visualization**: D3, Recharts
- **Deployment**: Azure Static Web Apps / Azure App Service

## 📂 Project Structure

```
employee-leave-plann/
├── src/                          # Source code
│   ├── components/              # React components
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utility functions
│   └── styles/                  # CSS styles
├── .github/workflows/           # CI/CD pipelines
│   ├── ci.yml                   # Build and test
│   ├── deploy-swa.yml           # Static Web Apps deployment
│   └── deploy-appservice.yml    # App Service deployment
├── employee-leave-azure-agent/  # Azure deployment infrastructure
│   ├── infra/bicep/            # Infrastructure as Code
│   ├── scripts/                # Deployment scripts
│   └── docs/                   # Deployment documentation
├── setup-azure.sh              # Automated setup script
├── DEPLOYMENT.md               # Deployment guide
└── DEPLOYMENT-CHECKLIST.md     # Deployment checklist
```

## 🔄 CI/CD Pipeline

The repository includes automated CI/CD pipelines:

### Automatic Deployments
- **Push to `main`**: Automatic deployment to production
- **Pull Requests**: Preview environments (Static Web Apps)
- **Staging Slots**: Blue-green deployments (App Service)

### Pipeline Stages
1. ✅ Lint code (`npm run lint`)
2. ✅ Build application (`npm run build`)
3. ✅ Deploy to staging (App Service only)
4. ✅ Run smoke tests
5. ✅ Deploy to production

## 🎮 IssueOps / ChatOps

Control deployments via GitHub comments:

- `/deploy` - Deploy to staging
- `/promote` - Promote staging to production
- `/rollback` - Rollback to previous version
- `/restart` - Restart the application

## 🧪 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## 📦 Dependencies

This project uses modern React ecosystem tools:
- React 19 with TypeScript
- Vite for blazing-fast builds
- Tailwind CSS for styling
- Radix UI for accessible components
- React Hook Form for form management
- Zod for validation
- React Query for data fetching

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Deployment Issues
- Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
- Review GitHub Actions logs in the Actions tab
- Verify Azure resources are created
- Check Azure Portal for errors

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [Deployment Checklist](DEPLOYMENT-CHECKLIST.md) - Pre and post-deployment tasks
- [Azure Agent Docs](employee-leave-azure-agent/docs/README-DEPLOYMENT.md) - Detailed setup guide
- [Infrastructure](employee-leave-azure-agent/infra/bicep/) - Bicep templates

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🆘 Support

- **Issues**: Open an issue in this repository
- **Deployment Help**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Azure Docs**: [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- **GitHub Actions**: [Actions Documentation](https://docs.github.com/actions)

## ⭐ Acknowledgments

Built with:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Azure Static Web Apps](https://azure.microsoft.com/services/app-service/static/)

---

**Ready to deploy?** Start with our [automated setup](setup-azure.sh) or follow the [deployment guide](DEPLOYMENT.md)!
