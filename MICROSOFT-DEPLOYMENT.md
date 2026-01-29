# 🔵 Microsoft Ecosystem Deployment Guide

Complete guide for deploying the Employee Leave Planning System within the Microsoft ecosystem using Azure, Azure DevOps, Power Platform, and Microsoft 365 integrations.

## 🎯 Overview

This application can be deployed using multiple Microsoft Azure services, each suited for different scenarios:

| Service | Best For | Complexity | Cost (Est.) | Setup Time |
|---------|----------|------------|-------------|------------|
| **Azure Static Web Apps** | Frontend-only, global CDN | Low | $0-10/mo | 10 min |
| **Azure App Service** | Full-stack with backend | Medium | $15-75/mo | 15 min |
| **Azure Container Apps** | Microservices, auto-scaling | Medium | $20-100/mo | 20 min |
| **Azure Kubernetes Service** | Enterprise, complex workloads | High | $100+/mo | 60+ min |

---

## 🚀 Quick Start Options

### Option 1: Azure Static Web Apps (Recommended for This App)

**Best for:** Static frontend applications with optional API functions

**Features:**
- ✅ Free tier available (100GB bandwidth/mo)
- ✅ Global CDN built-in
- ✅ Automatic HTTPS
- ✅ GitHub Actions integration
- ✅ Preview deployments for PRs
- ✅ Custom domains
- ✅ Authentication providers (Azure AD, GitHub, Twitter, Google)

**Setup Steps:**

1. **Create Static Web App in Azure Portal:**
   ```bash
   # Using Azure CLI
   az staticwebapp create \
     --name employee-leave-swa \
     --resource-group rg-employee-leave \
     --location eastus2 \
     --source https://github.com/YOUR_ORG/employee-leave-plann \
     --branch main \
     --app-location "/" \
     --output-location "dist"
   ```

2. **Configure GitHub Secret:**
   - Get deployment token from Azure Portal → Static Web App → Deployment token
   - Add to GitHub: Settings → Secrets → `AZURE_STATIC_WEB_APPS_API_TOKEN`

3. **Deploy:**
   - Push to main branch
   - GitHub Actions workflow (`.github/workflows/deploy-swa.yml`) runs automatically
   - App live in 2-3 minutes

**Configuration File:** See `.github/workflows/deploy-swa.yml` (already configured)

---

### Option 2: Azure App Service

**Best for:** Server-rendered applications, APIs, or when you need more control

**Features:**
- ✅ Blue/green deployments via staging slots
- ✅ Supports Node.js, .NET, Python, Java, PHP
- ✅ Easy scaling (vertical/horizontal)
- ✅ Built-in authentication
- ✅ Application Insights integration
- ✅ Hybrid connections to on-premises resources

**Setup Steps:**

1. **Deploy Infrastructure with Bicep:**
   ```bash
   # Create resource group
   az group create -n rg-employee-leave -l eastus
   
   # Deploy infrastructure
   az deployment group create \
     -g rg-employee-leave \
     -f employee-leave-azure-agent/infra/bicep/appservice.bicep \
     -p webAppName=employee-leave-web \
        planName=plan-employee-leave \
        sku=B1
   ```

2. **Configure GitHub Secrets for OIDC:**
   
   Create Service Principal:
   ```bash
   az ad sp create-for-rbac \
     --name "gh-employee-leave" \
     --role contributor \
     --scopes /subscriptions/{subscription-id}/resourceGroups/rg-employee-leave
   ```
   
   Add secrets to GitHub:
   - `AZURE_CLIENT_ID`
   - `AZURE_TENANT_ID`
   - `AZURE_SUBSCRIPTION_ID`

3. **Configure Federated Credentials:**
   ```bash
   az ad app federated-credential create \
     --id <app-object-id> \
     --parameters '{
       "name": "github-deploy",
       "issuer": "https://token.actions.githubusercontent.com",
       "subject": "repo:YOUR_ORG/employee-leave-plann:ref:refs/heads/main",
       "audiences": ["api://AzureADTokenExchange"]
     }'
   ```

4. **Deploy:**
   - Push to main branch
   - Workflow deploys to staging → runs smoke tests → swaps to production

**Configuration File:** See `.github/workflows/deploy-appservice.yml` (already configured)

---

### Option 3: Azure Container Apps

**Best for:** Containerized applications, microservices, event-driven workloads

**Features:**
- ✅ Kubernetes-based (without K8s complexity)
- ✅ Auto-scaling to zero
- ✅ KEDA event triggers
- ✅ Multiple revisions (traffic splitting)
- ✅ Built-in ingress and service discovery

**Setup Steps:**

1. **Create Container Registry:**
   ```bash
   az acr create \
     --resource-group rg-employee-leave \
     --name employeeleaveacr \
     --sku Basic \
     --admin-enabled true
   ```

2. **Create Container Apps Environment:**
   ```bash
   az containerapp env create \
     --name employee-leave-env \
     --resource-group rg-employee-leave \
     --location eastus
   ```

3. **Deploy Container App:**
   ```bash
   # Build and push image
   az acr build \
     --registry employeeleaveacr \
     --image employee-leave:latest \
     --file Dockerfile .
   
   # Create container app
   az containerapp create \
     --name employee-leave-app \
     --resource-group rg-employee-leave \
     --environment employee-leave-env \
     --image employeeleaveacr.azurecr.io/employee-leave:latest \
     --target-port 80 \
     --ingress external \
     --registry-server employeeleaveacr.azurecr.io \
     --min-replicas 0 \
     --max-replicas 10
   ```

**Configuration File:** See `azure-pipelines-container-apps.yml` (to be created)

---

## 🔄 Azure DevOps Pipelines

Alternative to GitHub Actions for organizations using Azure DevOps.

**Setup Steps:**

1. **Create Azure DevOps Project:**
   - Go to https://dev.azure.com
   - Create new project: "Employee Leave Planning"

2. **Connect Repository:**
   - Project Settings → Service connections → New → Azure Resource Manager (OIDC)
   - Connect GitHub repository

3. **Create Pipeline:**
   - Pipelines → New → Use existing Azure Pipelines YAML
   - Select `azure-pipelines.yml` from repository

4. **Run Pipeline:**
   - Pipeline runs automatically on push to main
   - Manual trigger available for specific branches

**Configuration File:** See `azure-pipelines.yml` (will be created)

---

## 💡 Power Platform Integration

Deploy as a Power Apps component or use Power Automate for workflows.

### Power Apps Portal

**Option A: Embed in Power Apps Portal**

1. Create Power Apps Portal
2. Add custom page with iframe:
   ```html
   <iframe src="https://your-app.azurestaticapps.net" 
           width="100%" height="800px"></iframe>
   ```

**Option B: Power Apps Custom Connector**

1. Create custom connector to your API
2. Build canvas app using connector
3. Publish to Microsoft Teams or SharePoint

### Power Automate Integration

**Workflow: Leave Request Approval**

1. Create flow: "When leave request submitted"
2. Actions:
   - Send approval request to manager (via Teams/Outlook)
   - Update leave balance in SharePoint list
   - Send confirmation email
   - Create calendar event in Outlook

**Template Flow:**
```
Trigger: HTTP Request (from your app)
↓
Condition: Check leave balance
↓
Send approval request (Approvals connector)
↓
Wait for approval
↓
If approved:
  - Update SharePoint list
  - Create Outlook calendar event
  - Send Teams notification
If rejected:
  - Send rejection email
  - Log in audit list
```

---

## 🔗 Microsoft 365 Integration

### Azure Active Directory Authentication

**Setup Entra ID (Azure AD) Authentication:**

1. **Register Application in Entra ID:**
   ```bash
   az ad app create \
     --display-name "Employee Leave Planning" \
     --sign-in-audience AzureADMyOrg \
     --web-redirect-uris "https://your-app.azurewebsites.net/auth/callback"
   ```

2. **Configure in Static Web App:**
   
   Add to `staticwebapp.config.json`:
   ```json
   {
     "auth": {
       "identityProviders": {
         "azureActiveDirectory": {
           "registration": {
             "openIdIssuer": "https://login.microsoftonline.com/{tenant-id}/v2.0",
             "clientIdSettingName": "AAD_CLIENT_ID",
             "clientSecretSettingName": "AAD_CLIENT_SECRET"
           }
         }
       }
     }
   }
   ```

3. **Role-based Access:**
   ```json
   {
     "routes": [
       {
         "route": "/admin/*",
         "allowedRoles": ["admin"]
       },
       {
         "route": "/api/*",
         "allowedRoles": ["authenticated"]
       }
     ]
   }
   ```

### Microsoft Graph API Integration

**Read user profile and calendar:**

```javascript
// Example: Get user's calendar events
const getCalendarEvents = async (accessToken) => {
  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/calendar/events',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  return response.json();
};

// Example: Create calendar event for approved leave
const createLeaveEvent = async (accessToken, leaveRequest) => {
  await fetch('https://graph.microsoft.com/v1.0/me/calendar/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subject: `Leave: ${leaveRequest.type}`,
      start: { dateTime: leaveRequest.startDate, timeZone: 'UTC' },
      end: { dateTime: leaveRequest.endDate, timeZone: 'UTC' },
      isAllDay: true
    })
  });
};
```

### Microsoft Teams Integration

**Option 1: Teams Tab App**

1. Create Teams app manifest:
   ```json
   {
     "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.16/MicrosoftTeams.schema.json",
     "manifestVersion": "1.16",
     "id": "unique-app-id",
     "version": "1.0.0",
     "name": {
       "short": "Leave Planning",
       "full": "Employee Leave Planning System"
     },
     "staticTabs": [
       {
         "entityId": "leaveApp",
         "name": "My Leave",
         "contentUrl": "https://your-app.azurestaticapps.net",
         "scopes": ["personal"]
       }
     ]
   }
   ```

2. Upload to Teams App Store (internal)

**Option 2: Adaptive Cards for Notifications**

Send leave approval requests via Teams:
```javascript
const card = {
  "type": "AdaptiveCard",
  "body": [
    {
      "type": "TextBlock",
      "text": "Leave Request",
      "weight": "Bolder",
      "size": "Medium"
    },
    {
      "type": "FactSet",
      "facts": [
        { "title": "Employee:", "value": "John Doe" },
        { "title": "Dates:", "value": "Jan 15-20, 2026" },
        { "title": "Days:", "value": "5" }
      ]
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Approve",
      "data": { "action": "approve" }
    },
    {
      "type": "Action.Submit",
      "title": "Reject",
      "data": { "action": "reject" }
    }
  ]
};
```

### SharePoint Integration

**Store leave data in SharePoint:**

1. Create SharePoint list: "Leave Requests"
2. Use Microsoft Graph API to read/write:
   ```javascript
   // Create leave request in SharePoint
   const createListItem = async (accessToken, listId, data) => {
     await fetch(
       `https://graph.microsoft.com/v1.0/sites/{site-id}/lists/${listId}/items`,
       {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${accessToken}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           fields: {
             Title: data.employeeName,
             StartDate: data.startDate,
             EndDate: data.endDate,
             Status: 'Pending'
           }
         })
       }
     );
   };
   ```

---

## 📊 Monitoring & Observability

### Application Insights

**Setup:**

1. **Create Application Insights:**
   ```bash
   az monitor app-insights component create \
     --app employee-leave-insights \
     --location eastus \
     --resource-group rg-employee-leave \
     --application-type web
   ```

2. **Get Instrumentation Key:**
   ```bash
   az monitor app-insights component show \
     --app employee-leave-insights \
     --resource-group rg-employee-leave \
     --query instrumentationKey -o tsv
   ```

3. **Add to App Service Settings:**
   ```bash
   az webapp config appsettings set \
     --name employee-leave-web \
     --resource-group rg-employee-leave \
     --settings APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=xxx"
   ```

**Features:**
- Real-time metrics dashboard
- Request tracking and performance
- Exception monitoring
- Custom events and metrics
- User analytics
- Availability tests

### Azure Monitor Alerts

**Create alert for high error rate:**
```bash
az monitor metrics alert create \
  --name high-error-rate \
  --resource-group rg-employee-leave \
  --scopes /subscriptions/{sub-id}/resourceGroups/rg-employee-leave/providers/Microsoft.Web/sites/employee-leave-web \
  --condition "avg requests/failed > 10" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action-group /subscriptions/{sub-id}/resourceGroups/rg-employee-leave/providers/microsoft.insights/actionGroups/ops-team
```

---

## 🔐 Security Best Practices

### Azure Key Vault Integration

**Store secrets in Key Vault:**

1. **Create Key Vault:**
   ```bash
   az keyvault create \
     --name employee-leave-kv \
     --resource-group rg-employee-leave \
     --location eastus
   ```

2. **Add secrets:**
   ```bash
   az keyvault secret set \
     --vault-name employee-leave-kv \
     --name DatabaseConnectionString \
     --value "your-connection-string"
   ```

3. **Grant App Service access:**
   ```bash
   # Enable managed identity
   az webapp identity assign \
     --name employee-leave-web \
     --resource-group rg-employee-leave
   
   # Grant access to Key Vault
   az keyvault set-policy \
     --name employee-leave-kv \
     --object-id <managed-identity-object-id> \
     --secret-permissions get list
   ```

4. **Reference in App Settings:**
   ```bash
   az webapp config appsettings set \
     --name employee-leave-web \
     --resource-group rg-employee-leave \
     --settings DB_CONNECTION="@Microsoft.KeyVault(SecretUri=https://employee-leave-kv.vault.azure.net/secrets/DatabaseConnectionString/)"
   ```

### Azure Front Door (CDN + WAF)

**Add WAF and global CDN:**

```bash
az afd profile create \
  --profile-name employee-leave-fd \
  --resource-group rg-employee-leave \
  --sku Premium_AzureFrontDoor

az afd endpoint create \
  --resource-group rg-employee-leave \
  --profile-name employee-leave-fd \
  --endpoint-name employee-leave-ep

# Add origin
az afd origin-group create \
  --resource-group rg-employee-leave \
  --profile-name employee-leave-fd \
  --origin-group-name default-origin-group

az afd origin create \
  --resource-group rg-employee-leave \
  --profile-name employee-leave-fd \
  --origin-group-name default-origin-group \
  --origin-name app-service-origin \
  --host-name employee-leave-web.azurewebsites.net \
  --origin-host-header employee-leave-web.azurewebsites.net
```

---

## 💰 Cost Estimation

### Azure Static Web Apps (Recommended for this app)

| Tier | Cost | Bandwidth | Custom Domains | Authentication |
|------|------|-----------|----------------|----------------|
| Free | $0/mo | 100GB/mo | 2 | ✅ |
| Standard | $9/mo | 100GB + $0.20/GB | Unlimited | ✅ |

**Estimated for 100 users:** $0-9/month

### Azure App Service

| SKU | Cost/Month | RAM | Storage | Staging Slots |
|-----|-----------|-----|---------|---------------|
| B1 (Basic) | ~$13 | 1.75GB | 10GB | 0 |
| B2 (Basic) | ~$26 | 3.5GB | 10GB | 0 |
| S1 (Standard) | ~$69 | 1.75GB | 50GB | 5 |
| P1v3 (Premium) | ~$150 | 8GB | 250GB | 20 |

**Estimated for 100 users:** $13-69/month (B1-S1 sufficient)

### Additional Services

- **Application Insights:** $0-5/month (5GB free ingestion)
- **Azure Key Vault:** $0.03/10k operations (~$1/month)
- **Azure Front Door:** $35/month + bandwidth
- **Azure Container Registry:** $5/month (Basic)
- **Azure Container Apps:** $0.0001/vCPU-second + $0.00001/GiB-second

**Total Estimated Monthly Cost (100 users):**
- **Minimal:** $0-10/mo (Static Web Apps Free + App Insights)
- **Standard:** $20-30/mo (Static Web Apps Standard or App Service B1)
- **Enterprise:** $100-200/mo (App Service S1/P1v3 + Front Door + Container Registry)

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Choose deployment target (Static Web Apps / App Service / Container Apps)
- [ ] Create Azure subscription (or use existing)
- [ ] Install Azure CLI: `az login`
- [ ] Set up GitHub repository secrets/variables
- [ ] Review cost estimates

### Infrastructure Setup
- [ ] Create resource group
- [ ] Deploy Bicep/ARM templates
- [ ] Configure managed identity or service principal
- [ ] Set up federated credentials for OIDC
- [ ] Create Key Vault (optional)
- [ ] Set up Application Insights (optional)

### Application Configuration
- [ ] Review and update workflow files
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificates
- [ ] Set up authentication (Azure AD)

### Post-Deployment
- [ ] Verify deployment successful
- [ ] Test application functionality
- [ ] Configure monitoring alerts
- [ ] Set up backup strategy
- [ ] Document runbook procedures
- [ ] Train operations team

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Deployment fails with "Resource not found"**
- Verify resource group exists
- Check service principal has Contributor role
- Ensure all secrets are configured correctly

**Issue: App loads but shows 404**
- Check routing configuration in `staticwebapp.config.json` or `web.config`
- Verify output directory is correct (`dist`)
- Check build logs for errors

**Issue: Authentication not working**
- Verify Azure AD app registration redirect URIs
- Check client ID and secret in Key Vault/App Settings
- Ensure user has proper roles assigned

**Issue: Slow performance**
- Enable Application Insights to identify bottlenecks
- Consider upgrading SKU (App Service) or scaling rules (Container Apps)
- Add Azure Front Door for CDN caching
- Review database query performance

**Issue: High costs**
- Check Application Insights data ingestion
- Review scaling rules (may be over-provisioned)
- Enable auto-pause/scale-to-zero for Container Apps
- Use cost analysis in Azure Portal

---

## 📚 Additional Resources

### Official Documentation
- [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure App Service](https://docs.microsoft.com/azure/app-service/)
- [Azure Container Apps](https://docs.microsoft.com/azure/container-apps/)
- [Azure DevOps](https://docs.microsoft.com/azure/devops/)
- [Microsoft Graph API](https://docs.microsoft.com/graph/)
- [Power Platform](https://docs.microsoft.com/power-platform/)

### Related Files
- [Azure Agent README](./employee-leave-azure-agent/README.md)
- [Deployment Guide](./employee-leave-azure-agent/docs/README-DEPLOYMENT.md)
- [App Service Bicep](./employee-leave-azure-agent/infra/bicep/appservice.bicep)
- [GitHub Actions Workflows](./.github/workflows/)

### Support
- Azure Support: https://portal.azure.com → Help + support
- GitHub Issues: https://github.com/ismaelloveexcel/employee-leave-plann/issues
- Azure DevOps Support: https://developercommunity.visualstudio.com/

---

*Last Updated: January 28, 2026*
