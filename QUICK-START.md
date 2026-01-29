# 🚀 Quick Deployment Reference

**One-page reference for deploying to Azure**

## Prerequisites ✓

- [ ] Azure account (free tier available)
- [ ] Azure CLI installed (`az --version`)
- [ ] GitHub repository access
- [ ] Git installed locally

## Fastest Path: Automated Setup (5 minutes)

```bash
# Step 1: Make script executable
chmod +x setup-azure.sh

# Step 2: Run automated setup
./setup-azure.sh

# Step 3: Follow prompts and deploy!
```

**That's it!** The script handles everything:
- Creates Azure resources
- Configures GitHub secrets
- Sets up CI/CD
- Deploys your app

## Manual Azure Static Web Apps (10 minutes)

### 1. Login to Azure
```bash
az login
az account set --subscription "YOUR_SUBSCRIPTION"
```

### 2. Create Resources
```bash
# Create resource group
az group create --name rg-employee-leave --location eastus

# Create Static Web App (note: using eastus2 for better SWA availability)
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

### 3. Get Deployment Token
```bash
az staticwebapp secrets list \
  --name employee-leave-swa \
  --resource-group rg-employee-leave \
  --query "properties.apiKey" -o tsv
```

### 4. Add GitHub Secret
1. Go to repository Settings → Secrets → Actions
2. Add secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
3. Paste the token from step 3

### 5. Deploy
```bash
git push origin main
```

**Done!** Your app will be live at: `https://[app-name].azurestaticapps.net`

## Manual Azure App Service (15 minutes)

### 1. Deploy Infrastructure
```bash
az group create -n rg-employee-leave -l eastus
az deployment group create \
  -g rg-employee-leave \
  -f employee-leave-azure-agent/infra/bicep/appservice.bicep \
  -p webAppName=employee-leave-web planName=plan-employee-leave sku=B1
```

### 2. Create Service Principal
```bash
# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Create service principal
APP_ID=$(az ad sp create-for-rbac \
  --name "gh-employee-leave" \
  --role contributor \
  --scopes /subscriptions/${SUBSCRIPTION_ID}/resourceGroups/rg-employee-leave \
  --query appId -o tsv)

# Get tenant ID
TENANT_ID=$(az account show --query tenantId -o tsv)
```

### 3. Add Federated Credential
Replace YOUR_USERNAME and YOUR_REPO with your GitHub username and repository name:
```bash
# Create JSON file for federated credential
cat <<EOF > federated-cred.json
{
  "name": "github-main",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:YOUR_USERNAME/YOUR_REPO:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}
EOF

# Create federated credential
az ad app federated-credential create \
  --id ${APP_ID} \
  --parameters @federated-cred.json

# Clean up
rm federated-cred.json
```

### 4. Configure GitHub
Add these **Secrets**:
- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

Add these **Variables**:
- `AZURE_WEBAPP_NAME` = `employee-leave-web`
- `AZURE_RESOURCE_GROUP` = `rg-employee-leave`

### 5. Deploy
```bash
git push origin main
```

## Verification Checklist

After deployment:
- [ ] GitHub Actions workflow completed successfully
- [ ] Application URL is accessible
- [ ] No errors in browser console
- [ ] All pages load correctly
- [ ] HTTPS is working

## Troubleshooting

### Build Fails
```bash
# Test locally
npm ci
npm run build
```

### Deployment Fails
1. Check GitHub Actions logs (Actions tab)
2. Verify all secrets are set
3. Check Azure Portal for resource status

### App Not Loading
1. Check browser console (F12)
2. Verify deployment succeeded
3. Check Azure resource is running
4. Review application logs

## Common Commands

### Azure CLI
```bash
# Check Static Web App
az staticwebapp show --name [name] --resource-group [rg]

# Check App Service
az webapp show --name [name] --resource-group [rg]

# View logs
az webapp log tail --name [name] --resource-group [rg]
```

### GitHub CLI
```bash
# Set secret
gh secret set SECRET_NAME

# Trigger workflow
gh workflow run deploy-swa.yml
```

### Git
```bash
# Deploy
git push origin main

# Check status
git status
```

## Cost Estimate

| Service | Tier | Cost/Month |
|---------|------|------------|
| Static Web Apps | Free | $0 |
| Static Web Apps | Standard | ~$9 |
| App Service | B1 Basic | ~$13 |
| App Service | S1 Standard | ~$70 |

**Recommendation**: Start with Static Web Apps Free tier

## Next Steps

After successful deployment:
1. ✅ Configure custom domain (optional)
2. ✅ Set up monitoring/alerts
3. ✅ Enable Application Insights
4. ✅ Configure environment variables
5. ✅ Set up backups (App Service)

## Documentation Links

- **Full Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Checklist**: [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)
- **Detailed Setup**: [employee-leave-azure-agent/docs/](employee-leave-azure-agent/docs/)
- **Azure SWA Docs**: https://docs.microsoft.com/azure/static-web-apps/
- **Azure App Service**: https://docs.microsoft.com/azure/app-service/

## Support

- Open an issue in the repository
- Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
- Review Azure documentation

---

**Quick tip**: Use the automated script (`./setup-azure.sh`) for the easiest experience!
