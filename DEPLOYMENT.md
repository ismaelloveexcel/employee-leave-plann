# 🚀 Quick Deployment Guide - Microsoft Ecosystem

This guide provides the **fastest way** to deploy the Employee Leave Planning app to Azure with **minimal manual intervention**.

## 🎯 Recommended: Azure Static Web Apps (Easiest Option)

Azure Static Web Apps is the **best choice** for this React SPA application because:
- ✅ **Zero server management** - fully managed service
- ✅ **Automatic CI/CD** - deploys on every push to main
- ✅ **Free tier available** - great for getting started
- ✅ **Global CDN** - fast performance worldwide
- ✅ **Preview environments** - automatic deployment for PRs
- ✅ **Custom domains** & automatic HTTPS
- ✅ **Built-in authentication** support (optional)

---

## ⚡ Quick Start (5 minutes)

### Prerequisites
- Azure account ([create free account](https://azure.microsoft.com/free/))
- GitHub repository access
- Azure CLI installed ([install guide](https://docs.microsoft.com/cli/azure/install-azure-cli))

### Option 1: Automated Setup (Recommended) 🎉

Run the automated setup script that handles everything for you:

```bash
# Clone the repository (if not already cloned)
git clone https://github.com/ismaelloveexcel/employee-leave-plann.git
cd employee-leave-plann

# Make the setup script executable
chmod +x setup-azure.sh

# Run the setup script
./setup-azure.sh
```

**The script will:**
1. ✅ Create Azure Static Web App
2. ✅ Configure GitHub Actions secrets automatically
3. ✅ Deploy the application
4. ✅ Provide you with the live URL

### Option 2: Manual Setup (10 minutes)

If you prefer to set up manually or the script doesn't work:

#### Step 1: Create Azure Static Web App

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account set --subscription "YOUR_SUBSCRIPTION_NAME"

# Create resource group
az group create \
  --name rg-employee-leave \
  --location eastus

# Create Static Web App
az staticwebapp create \
  --name employee-leave-swa \
  --resource-group rg-employee-leave \
  --source https://github.com/YOUR_USERNAME/employee-leave-plann \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

#### Step 2: Get Deployment Token

```bash
# Get the deployment token
az staticwebapp secrets list \
  --name employee-leave-swa \
  --resource-group rg-employee-leave \
  --query "properties.apiKey" -o tsv
```

#### Step 3: Configure GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Value: Paste the token from Step 2
6. Click **Add secret**

#### Step 4: Deploy

Simply push to the `main` branch or manually trigger the workflow:

```bash
# Push changes to trigger deployment
git push origin main
```

Or trigger manually:
1. Go to **Actions** tab in GitHub
2. Select "Deploy to Static Web Apps"
3. Click **Run workflow**

---

## 🔄 Alternative: Azure App Service

If you need server-side rendering or backend APIs, use Azure App Service instead:

### Quick Setup with Bicep

```bash
# Login to Azure
az login

# Deploy infrastructure
az group create -n rg-employee-leave -l eastus
az deployment group create \
  -g rg-employee-leave \
  -f employee-leave-azure-agent/infra/bicep/appservice.bicep \
  -p webAppName=employee-leave-web planName=plan-employee-leave sku=B1
```

### Configure OIDC Authentication (Recommended)

1. **Create Service Principal:**

```bash
az ad sp create-for-rbac \
  --name "gh-employee-leave" \
  --role contributor \
  --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/rg-employee-leave \
  --sdk-auth
```

2. **Add Federated Credential:**

```bash
az ad app federated-credential create \
  --id {APP_ID} \
  --parameters '{
    "name": "github-federated",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:YOUR_USERNAME/employee-leave-plann:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

3. **Add GitHub Secrets:**
   - `AZURE_CLIENT_ID` - Application (client) ID
   - `AZURE_TENANT_ID` - Directory (tenant) ID
   - `AZURE_SUBSCRIPTION_ID` - Subscription ID

4. **Set GitHub Variables:**
   - `AZURE_WEBAPP_NAME` - `employee-leave-web`
   - `AZURE_RESOURCE_GROUP` - `rg-employee-leave`

---

## 🎮 Using IssueOps (ChatOps Deployment)

Once configured, you can control deployments via GitHub issue/PR comments:

- `/deploy` - Deploy to staging
- `/promote` - Promote staging to production
- `/rollback` - Rollback to previous version
- `/restart` - Restart the application

---

## 📋 What Happens After Setup?

### Automatic Deployments
- **Every push to `main`** automatically deploys to production
- **Every PR** gets a preview environment
- **Staging slot testing** (App Service only) with smoke tests
- **Blue-green deployments** (App Service only) for zero downtime

### CI/CD Pipeline
1. ✅ Code pushed to GitHub
2. ✅ GitHub Actions runs linting
3. ✅ Application is built (`npm run build`)
4. ✅ Deployed to Azure (Static Web Apps or App Service)
5. ✅ Smoke tests run automatically
6. ✅ Production is updated (or slot swap for App Service)

---

## 🔍 Verifying Your Deployment

### Check Deployment Status
```bash
# For Static Web Apps
az staticwebapp show \
  --name employee-leave-swa \
  --resource-group rg-employee-leave

# For App Service
az webapp show \
  --name employee-leave-web \
  --resource-group rg-employee-leave
```

### View Logs
- **GitHub Actions**: Go to Actions tab in your repository
- **Azure Portal**: Navigate to your resource → Monitoring → Logs
- **Azure CLI**:
```bash
az webapp log tail --name employee-leave-web --resource-group rg-employee-leave
```

---

## 🐛 Troubleshooting

### Deployment Fails
1. Check GitHub Actions logs in the **Actions** tab
2. Verify all secrets/variables are set correctly
3. Ensure Azure resources are created successfully
4. Check Azure Portal for resource status

### Build Errors
```bash
# Test build locally first
npm ci
npm run build
```

### Authentication Issues
- Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` is correct
- For OIDC: Ensure federated credentials are properly configured
- Check Service Principal has appropriate permissions

### Application Not Loading
1. Check if `dist` folder is being created during build
2. Verify `app_location` and `output_location` in workflow
3. Check browser console for errors
4. Verify CORS settings if using APIs

---

## 💰 Cost Estimate

### Azure Static Web Apps
- **Free tier**: $0/month (includes 100GB bandwidth, 0.5GB storage)
- **Standard tier**: ~$9/month (unlimited bandwidth)

### Azure App Service
- **B1 (Basic)**: ~$13/month
- **S1 (Standard)**: ~$70/month (includes staging slots)
- **P1v3 (Premium)**: ~$100/month (production workloads)

**Recommendation**: Start with Azure Static Web Apps Free tier for development/testing.

---

## 📚 Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [GitHub Actions for Azure](https://docs.microsoft.com/azure/developer/github/github-actions)
- [Detailed Deployment Guide](employee-leave-azure-agent/docs/README-DEPLOYMENT.md)
- [Infrastructure as Code (Bicep)](employee-leave-azure-agent/infra/bicep/)

---

## ✨ Summary

**For this React SPA application, we recommend:**

1. **Use Azure Static Web Apps** (simplest, free tier available)
2. **Run the automated setup script** (`./setup-azure.sh`)
3. **Push to main branch** to deploy automatically
4. **Monitor via GitHub Actions** tab

Total setup time: **~5 minutes** with the automated script!

---

## 🆘 Need Help?

- Check the [troubleshooting section](#-troubleshooting) above
- Review [detailed deployment docs](employee-leave-azure-agent/docs/README-DEPLOYMENT.md)
- Open an issue in the GitHub repository
- Check Azure Static Web Apps [troubleshooting guide](https://docs.microsoft.com/azure/static-web-apps/troubleshooting)
