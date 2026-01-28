# Azure Deployment Guide

This guide explains how to deploy the Employee Leave Planner to Azure.

## Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- An Azure subscription (free tier works)
- GitHub repository access

## Quick Deployment Steps

### Option 1: Deploy via Azure Portal (Easiest)

1. **Create Azure Static Web App:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Click "Create a resource" → Search "Static Web App"
   - Click "Create"
   - Fill in:
     - **Subscription:** Your subscription
     - **Resource Group:** Create new → `rg-employee-leave-planner`
     - **Name:** `employee-leave-planner`
     - **Plan type:** Free
     - **Region:** Select nearest region
     - **Source:** GitHub
     - **Organization:** Your GitHub org
     - **Repository:** `employee-leave-plann`
     - **Branch:** `main`
   - Click "Review + create" → "Create"

2. **Configure GitHub Secret:**
   - After deployment, go to the Static Web App resource
   - Click "Manage deployment token" → Copy the token
   - In GitHub: Settings → Secrets → Actions → New repository secret
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Paste the token

3. **Done!** The app will auto-deploy on every push to `main`

### Option 2: Deploy via Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name rg-employee-leave-planner --location eastus

# Deploy Static Web App
az staticwebapp create \
  --name employee-leave-planner \
  --resource-group rg-employee-leave-planner \
  --source https://github.com/YOUR_USERNAME/employee-leave-plann \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

### Option 3: Deploy via Bicep (Infrastructure as Code)

```bash
# Login to Azure
az login

# Deploy infrastructure
az deployment sub create \
  --location eastus \
  --template-file infra/main.bicep \
  --parameters appName=employee-leave-planner \
               repositoryUrl=https://github.com/YOUR_USERNAME/employee-leave-plann

# Get the API token for GitHub Actions
az staticwebapp secrets list \
  --name swa-employee-leave-planner \
  --resource-group rg-employee-leave-planner \
  --query "properties.apiKey" -o tsv
```

## GitHub Actions Workflow

The workflow file `.github/workflows/azure-static-web-apps.yml` automatically:
- Builds the React app
- Deploys to Azure Static Web Apps on push to `main`
- Creates preview environments for pull requests

### Required Secrets

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Deployment token | Azure Portal → Static Web App → Manage deployment token |
| `VITE_API_BASE_URL` | (Optional) API URL | Your Azure Functions URL |

## Optional: Add Cosmos DB for Data Persistence

The Bicep templates include Cosmos DB configuration. To enable:

1. **Deploy with Cosmos DB:**
   ```bash
   az deployment sub create \
     --location eastus \
     --template-file infra/main.bicep \
     --parameters appName=employee-leave-planner
   ```

2. **Get connection string:**
   ```bash
   az cosmosdb keys list \
     --name cosmos-employee-leave-planner \
     --resource-group rg-employee-leave-planner \
     --type connection-strings
   ```

3. **Add to Static Web App config:**
   ```bash
   az staticwebapp appsettings set \
     --name swa-employee-leave-planner \
     --resource-group rg-employee-leave-planner \
     --setting-names COSMOS_CONNECTION_STRING=YOUR_CONNECTION_STRING
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | No (app works offline) |
| `COSMOS_CONNECTION_STRING` | Cosmos DB connection | No (uses local storage) |

## Costs

Using Azure Free Tier:
- **Static Web Apps Free:** 100 GB bandwidth/month, 2 custom domains
- **Cosmos DB Free:** 1000 RU/s, 25 GB storage

**Estimated monthly cost: $0** (for small organizations)

## Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Run `npm ci && npm run build` locally to test

### Deployment Token Invalid
- Regenerate token in Azure Portal
- Update `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in GitHub

### App Not Loading
- Check browser console for errors
- Verify the app URL in Azure Portal → Static Web App → URL

## Support

For issues, contact HR via WhatsApp: +971564966546
