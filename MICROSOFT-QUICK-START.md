# 🔵 Microsoft Ecosystem - Quick Reference

**Fast deployment guide for Microsoft Azure**

## ⚡ Fastest Options

### 1. Azure Static Web Apps (Recommended)
```bash
# One command deployment
az staticwebapp create \
  --name employee-leave-swa \
  --resource-group rg-employee-leave \
  --source https://github.com/YOUR_ORG/employee-leave-plann \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```
**Time:** 5-10 minutes | **Cost:** $0-9/month

### 2. Using Deployment Scripts
```bash
# Interactive deployment (Linux/Mac)
./employee-leave-azure-agent/scripts/deploy-azure.sh

# Interactive deployment (Windows PowerShell)
./employee-leave-azure-agent/scripts/Deploy-Azure.ps1
```
**Time:** 10-15 minutes | **Cost:** $0-75/month (depends on service)

### 3. Using Bicep Templates
```bash
# Deploy Static Web Apps
az deployment group create \
  -g rg-employee-leave \
  -f employee-leave-azure-agent/infra/bicep/staticwebapp.bicep

# Deploy App Service
az deployment group create \
  -g rg-employee-leave \
  -f employee-leave-azure-agent/infra/bicep/appservice.bicep

# Deploy Container Apps
az deployment group create \
  -g rg-employee-leave \
  -f employee-leave-azure-agent/infra/bicep/container-apps.bicep
```

## 🔑 Prerequisites

1. **Azure Subscription** (free tier available)
2. **Azure CLI** installed: `az login`
3. **GitHub repository** (for CI/CD)

## 📊 Service Comparison

| Service | Best For | Cost/Month | Setup Time |
|---------|----------|------------|------------|
| **Static Web Apps** | This app (frontend) | $0-9 | 10 min |
| **App Service B1** | Full control | $13 | 15 min |
| **Container Apps** | Microservices | $20+ | 20 min |

## 🚀 GitHub Actions (Already Configured)

### Static Web Apps
- Workflow: `.github/workflows/deploy-swa.yml`
- Secret needed: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- Deploys on push to main

### App Service
- Workflow: `.github/workflows/deploy-appservice.yml`
- Secrets needed: 
  - `AZURE_CLIENT_ID`
  - `AZURE_TENANT_ID`
  - `AZURE_SUBSCRIPTION_ID`
- Blue/green deployment via staging slot

## 🔄 Azure DevOps Pipeline

1. **Create Project** at dev.azure.com
2. **Connect GitHub** repository
3. **Use existing** `azure-pipelines.yml`
4. **Run pipeline** - deploys automatically

## 🔗 Microsoft 365 Integration

### Azure AD Authentication
```json
// In staticwebapp.config.json (already configured)
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/{tenant-id}/v2.0"
        }
      }
    }
  }
}
```

### Teams Integration
- Deploy as Teams Tab App
- Use Adaptive Cards for notifications
- See MICROSOFT-DEPLOYMENT.md for details

### Power Automate
- Trigger: When leave request submitted
- Actions: Send approval, update calendar, notify via Teams

## 💰 Cost Estimates (100 users)

| Configuration | Monthly Cost | Services Included |
|--------------|-------------|-------------------|
| **Minimal** | $0 | Static Web Apps (Free) |
| **Standard** | $13-25 | App Service B1 + App Insights |
| **Enterprise** | $100+ | App Service S1 + Front Door + Container Registry |

## 🛠️ Monitoring

### Application Insights (Included)
```bash
# Create Application Insights
az monitor app-insights component create \
  --app employee-leave-insights \
  --location eastus \
  --resource-group rg-employee-leave
```

### View Metrics
- Azure Portal → Application Insights → Live Metrics
- Request rates, response times, exceptions
- Custom events and user analytics

## 🔐 Security

### Azure Key Vault
```bash
# Store secrets
az keyvault create --name employee-leave-kv -g rg-employee-leave
az keyvault secret set --vault-name employee-leave-kv --name DB_PASSWORD --value "xxx"
```

### Managed Identity
```bash
# Enable managed identity for App Service
az webapp identity assign --name employee-leave-web -g rg-employee-leave

# Grant Key Vault access
az keyvault set-policy --name employee-leave-kv \
  --object-id <managed-identity-id> \
  --secret-permissions get list
```

## 📚 Documentation

- **Complete Guide:** [MICROSOFT-DEPLOYMENT.md](./MICROSOFT-DEPLOYMENT.md)
- **Microsoft Quick Start:** [MICROSOFT-QUICK-START.md](./MICROSOFT-QUICK-START.md)
- **General Deployment:** [DEPLOYMENT-ALTERNATIVES.md](./DEPLOYMENT-ALTERNATIVES.md)

## 🆘 Troubleshooting

### "Resource not found"
→ Check resource group exists and you have permissions

### "Deployment failed"
→ Check Azure CLI version: `az --version` (need 2.50+)

### "Authentication failed"
→ Run `az login` again

### Build fails
→ Test locally first: `npm install && npm run build`

## ✅ Quick Checklist

- [ ] Azure subscription created/active
- [ ] Azure CLI installed and logged in
- [ ] Resource group created
- [ ] Deployment type selected
- [ ] Secrets configured (if using GitHub Actions)
- [ ] Infrastructure deployed
- [ ] Application deployed
- [ ] Monitoring configured
- [ ] Custom domain setup (optional)
- [ ] Team trained on management

---

**For detailed instructions, see [MICROSOFT-DEPLOYMENT.md](./MICROSOFT-DEPLOYMENT.md)**

*Last Updated: January 28, 2026*
