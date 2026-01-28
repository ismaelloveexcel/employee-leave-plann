# 📋 Azure Deployment Checklist

Use this checklist to ensure a smooth deployment to Azure. Check off each item as you complete it.

## Pre-Deployment Checklist

### Prerequisites
- [ ] Azure account created ([Sign up for free](https://azure.microsoft.com/free/))
- [ ] Azure CLI installed ([Installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli))
- [ ] GitHub repository access
- [ ] Git installed locally
- [ ] Node.js 20+ installed (for local testing)

### Repository Setup
- [ ] Repository cloned locally
- [ ] Dependencies installed (`npm ci`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Linting passes (`npm run lint`)

---

## Deployment Option 1: Azure Static Web Apps (Recommended)

### Step 1: Azure Resources
- [ ] Logged in to Azure CLI (`az login`)
- [ ] Subscription selected (`az account set --subscription "..."`)
- [ ] Resource group created
- [ ] Azure Static Web App created
- [ ] Deployment token retrieved

### Step 2: GitHub Configuration
- [ ] GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN` added
- [ ] Workflow file `.github/workflows/deploy-swa.yml` exists
- [ ] Workflow enabled (not disabled)

### Step 3: Deployment
- [ ] Code pushed to `main` branch
- [ ] GitHub Actions workflow triggered
- [ ] Build job completed successfully
- [ ] Deploy job completed successfully
- [ ] Application URL accessible

### Step 4: Verification
- [ ] Production URL working (https://[app-name].azurestaticapps.net)
- [ ] Application loads without errors
- [ ] All pages/routes accessible
- [ ] Console errors checked (browser DevTools)
- [ ] Mobile responsiveness verified

### Step 5: Post-Deployment (Optional)
- [ ] Custom domain configured
- [ ] SSL certificate verified
- [ ] Environment variables configured (if needed)
- [ ] Authentication set up (if needed)
- [ ] Monitoring/alerts configured

---

## Deployment Option 2: Azure App Service

### Step 1: Azure Resources
- [ ] Logged in to Azure CLI (`az login`)
- [ ] Subscription selected
- [ ] Resource group created
- [ ] Bicep template deployed (`az deployment group create`)
- [ ] App Service created
- [ ] App Service Plan created
- [ ] Staging slot created

### Step 2: OIDC Authentication Setup
- [ ] Service Principal created
- [ ] Federated credential created for GitHub
- [ ] Contributor role assigned to Service Principal
- [ ] Tenant ID retrieved
- [ ] Client ID retrieved
- [ ] Subscription ID retrieved

### Step 3: GitHub Configuration
- [ ] GitHub secret `AZURE_CLIENT_ID` added
- [ ] GitHub secret `AZURE_TENANT_ID` added
- [ ] GitHub secret `AZURE_SUBSCRIPTION_ID` added
- [ ] GitHub variable `AZURE_WEBAPP_NAME` set
- [ ] GitHub variable `AZURE_RESOURCE_GROUP` set
- [ ] Workflow file `.github/workflows/deploy-appservice.yml` exists

### Step 4: Deployment
- [ ] Code pushed to `main` branch
- [ ] Build job completed
- [ ] Deploy to staging completed
- [ ] Smoke tests passed
- [ ] Slot swap to production completed

### Step 5: Verification
- [ ] Production URL working (https://[app-name].azurewebsites.net)
- [ ] Staging URL working (https://[app-name]-staging.azurewebsites.net)
- [ ] Application loads correctly
- [ ] All features working
- [ ] Logs accessible in Azure Portal

### Step 6: Post-Deployment (Optional)
- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] Scaling rules configured
- [ ] Application Insights enabled
- [ ] Backup configured
- [ ] Deployment slots configured

---

## Automated Setup (Fastest Method)

### Using setup-azure.sh Script
- [ ] Script downloaded/available (`setup-azure.sh`)
- [ ] Script made executable (`chmod +x setup-azure.sh`)
- [ ] Azure CLI installed and logged in
- [ ] GitHub CLI installed (optional, for auto-secret configuration)
- [ ] Script executed (`./setup-azure.sh`)
- [ ] Deployment type selected (SWA or App Service)
- [ ] Configuration reviewed and confirmed
- [ ] Setup completed successfully
- [ ] Manual secrets added (if GitHub CLI not available)
- [ ] Initial deployment triggered

---

## CI/CD Verification Checklist

### GitHub Actions
- [ ] Workflow runs visible in Actions tab
- [ ] CI workflow passing (lint + build)
- [ ] Deploy workflow passing
- [ ] No failed jobs
- [ ] Build artifacts created
- [ ] Deployment logs reviewed

### Deployment Pipeline
- [ ] Automatic deployment on push to main working
- [ ] PR preview environments working (Static Web Apps)
- [ ] Staging slot deployment working (App Service)
- [ ] Smoke tests executing
- [ ] Production deployment successful

---

## Testing Checklist

### Functional Testing
- [ ] Home page loads
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] Data displays properly
- [ ] User interactions work
- [ ] Error handling works

### Performance Testing
- [ ] Page load time acceptable (< 3 seconds)
- [ ] Images optimized
- [ ] No console errors
- [ ] Network requests efficient
- [ ] CDN delivering content (Static Web Apps)

### Browser Testing
- [ ] Chrome/Edge tested
- [ ] Firefox tested
- [ ] Safari tested (if available)
- [ ] Mobile browsers tested

### Security Testing
- [ ] HTTPS enforced
- [ ] No mixed content warnings
- [ ] Security headers present
- [ ] No exposed secrets in code
- [ ] CORS configured correctly (if using APIs)

---

## Troubleshooting Checklist

### If Deployment Fails
- [ ] Check GitHub Actions logs
- [ ] Verify all secrets/variables are set correctly
- [ ] Ensure Azure resources exist
- [ ] Check resource group permissions
- [ ] Verify subscription is active
- [ ] Check build logs for errors
- [ ] Validate package.json scripts

### If App Doesn't Load
- [ ] Check browser console for errors
- [ ] Verify deployment completed successfully
- [ ] Check Azure Portal resource status
- [ ] Verify `dist` folder is being deployed
- [ ] Check app configuration in Azure
- [ ] Review Application Insights (if enabled)
- [ ] Check for CORS issues (F12 Network tab)

### If Build Fails
- [ ] Test build locally (`npm run build`)
- [ ] Check Node.js version matches (20+)
- [ ] Verify all dependencies installed
- [ ] Check for TypeScript errors
- [ ] Review linting errors
- [ ] Check Vite configuration

---

## Maintenance Checklist

### Regular Tasks
- [ ] Monitor GitHub Actions for failures
- [ ] Review Azure costs monthly
- [ ] Check application logs weekly
- [ ] Update dependencies regularly
- [ ] Test backup/restore procedures
- [ ] Review security alerts

### Updates
- [ ] Plan for major updates
- [ ] Test in staging first
- [ ] Review breaking changes
- [ ] Update documentation
- [ ] Communicate downtime (if any)

---

## Quick Reference Commands

### Azure CLI
```bash
# Login
az login

# List subscriptions
az account list --output table

# Create resource group
az group create --name rg-employee-leave --location eastus

# Check Static Web App status
az staticwebapp show --name [app-name] --resource-group [rg-name]

# Check App Service status
az webapp show --name [app-name] --resource-group [rg-name]

# View logs (App Service)
az webapp log tail --name [app-name] --resource-group [rg-name]
```

### GitHub CLI
```bash
# Set secret
gh secret set SECRET_NAME

# Set variable
gh variable set VARIABLE_NAME --body "value"

# Trigger workflow
gh workflow run deploy-swa.yml
```

### Git
```bash
# Push to trigger deployment
git push origin main

# Check current branch
git branch --show-current

# View commit history
git log --oneline -5
```

---

## Success Criteria

Your deployment is successful when:
- ✅ Application is accessible via the provided URL
- ✅ GitHub Actions workflows are passing
- ✅ No errors in browser console
- ✅ All major features are working
- ✅ HTTPS is working
- ✅ PR previews are working (Static Web Apps)
- ✅ Staging/production slots working (App Service)

---

## Support Resources

- **Azure Documentation**: https://docs.microsoft.com/azure/
- **GitHub Actions**: https://docs.github.com/actions
- **Static Web Apps**: https://docs.microsoft.com/azure/static-web-apps/
- **App Service**: https://docs.microsoft.com/azure/app-service/
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Detailed Setup**: See [employee-leave-azure-agent/docs/README-DEPLOYMENT.md](employee-leave-azure-agent/docs/README-DEPLOYMENT.md)

---

## Notes
- Keep this checklist updated as you add new deployment requirements
- Share with team members for consistent deployments
- Use as a reference for troubleshooting
- Customize for your specific needs

**Last Updated**: 2026-01-28
