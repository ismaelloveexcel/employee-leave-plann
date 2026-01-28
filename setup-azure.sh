#!/bin/bash
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="employee-leave-swa"
RESOURCE_GROUP="rg-employee-leave"
LOCATION="eastus2"
DEPLOYMENT_TYPE=""

echo -e "${BLUE}"
echo "═══════════════════════════════════════════════════════════════"
echo "   Azure Employee Leave App - Automated Deployment Setup"
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed.${NC}"
    echo "Please install it from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

echo -e "${GREEN}✅ Azure CLI found${NC}"

# Check if logged in to Azure
echo "Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Azure. Starting login...${NC}"
    az login
else
    echo -e "${GREEN}✅ Already logged in to Azure${NC}"
fi

# Get current subscription
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo -e "${GREEN}📋 Using subscription: ${SUBSCRIPTION_NAME}${NC}"

# Check if gh CLI is available for GitHub operations
GH_AVAILABLE=false
if command -v gh &> /dev/null; then
    if gh auth status &> /dev/null; then
        GH_AVAILABLE=true
        echo -e "${GREEN}✅ GitHub CLI authenticated${NC}"
    else
        echo -e "${YELLOW}⚠️  GitHub CLI found but not authenticated${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI not found (secrets will need to be set manually)${NC}"
fi

# Ask user which deployment method they prefer
echo ""
echo "Choose your deployment method:"
echo "1) Azure Static Web Apps (Recommended for React SPAs - Free tier available)"
echo "2) Azure App Service (For apps needing server-side logic)"
echo ""
read -p "Enter choice (1 or 2) [default: 1]: " choice
choice=${choice:-1}

if [ "$choice" = "1" ]; then
    DEPLOYMENT_TYPE="swa"
    echo -e "${GREEN}📦 Selected: Azure Static Web Apps${NC}"
elif [ "$choice" = "2" ]; then
    DEPLOYMENT_TYPE="appservice"
    echo -e "${GREEN}📦 Selected: Azure App Service${NC}"
else
    echo -e "${RED}❌ Invalid choice${NC}"
    exit 1
fi

# Ask for custom names (optional)
echo ""
read -p "Resource Group name [default: $RESOURCE_GROUP]: " custom_rg
RESOURCE_GROUP=${custom_rg:-$RESOURCE_GROUP}

read -p "App name [default: $APP_NAME]: " custom_app
APP_NAME=${custom_app:-$APP_NAME}

read -p "Azure location [default: $LOCATION]: " custom_location
LOCATION=${custom_location:-$LOCATION}

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo "Configuration Summary:"
echo "  Deployment Type: $DEPLOYMENT_TYPE"
echo "  Resource Group:  $RESOURCE_GROUP"
echo "  App Name:        $APP_NAME"
echo "  Location:        $LOCATION"
echo "  Subscription:    $SUBSCRIPTION_NAME"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
read -p "Continue with this configuration? (y/n) [default: y]: " confirm
confirm=${confirm:-y}

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Setup cancelled."
    exit 0
fi

# Create resource group
echo ""
echo -e "${YELLOW}📦 Creating resource group: $RESOURCE_GROUP...${NC}"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none
echo -e "${GREEN}✅ Resource group created${NC}"

if [ "$DEPLOYMENT_TYPE" = "swa" ]; then
    # Azure Static Web Apps deployment
    echo ""
    echo -e "${YELLOW}🌐 Creating Azure Static Web App...${NC}"
    
    # Get GitHub repo info
    if [ "$GH_AVAILABLE" = true ]; then
        REPO_URL=$(gh repo view --json url -q .url 2>/dev/null || echo "")
        if [ -z "$REPO_URL" ]; then
            read -p "Enter GitHub repository URL (e.g., https://github.com/user/repo): " REPO_URL
        else
            echo "Detected repository: $REPO_URL"
        fi
    else
        read -p "Enter GitHub repository URL (e.g., https://github.com/user/repo): " REPO_URL
    fi
    
    # Create Static Web App without GitHub integration first (to avoid token issues)
    echo "Creating Static Web App resource..."
    az staticwebapp create \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Free \
        --output none
    
    echo -e "${GREEN}✅ Static Web App created${NC}"
    
    # Get deployment token
    echo ""
    echo -e "${YELLOW}🔑 Retrieving deployment token...${NC}"
    DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query "properties.apiKey" -o tsv)
    
    if [ -z "$DEPLOYMENT_TOKEN" ]; then
        echo -e "${RED}❌ Failed to retrieve deployment token${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Deployment token retrieved${NC}"
    
    # Set GitHub secret
    if [ "$GH_AVAILABLE" = true ]; then
        echo ""
        echo -e "${YELLOW}🔐 Setting GitHub secret...${NC}"
        echo "$DEPLOYMENT_TOKEN" | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN
        echo -e "${GREEN}✅ GitHub secret configured${NC}"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Manual step required:${NC}"
        echo "Please add the following secret to your GitHub repository:"
        echo ""
        echo "  Name:  AZURE_STATIC_WEB_APPS_API_TOKEN"
        echo "  Value: $DEPLOYMENT_TOKEN"
        echo ""
        echo "Steps:"
        echo "  1. Go to your GitHub repository"
        echo "  2. Navigate to Settings → Secrets and variables → Actions"
        echo "  3. Click 'New repository secret'"
        echo "  4. Add the secret with the name and value above"
        echo ""
        read -p "Press Enter once you've added the secret..."
    fi
    
    # Get the Static Web App URL
    SWA_URL=$(az staticwebapp show \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query "defaultHostname" -o tsv)
    
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ Setup Complete!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Your app will be available at: https://$SWA_URL"
    echo ""
    echo "Next steps:"
    echo "  1. Push your code to the main branch"
    echo "  2. GitHub Actions will automatically build and deploy"
    echo "  3. Visit your app URL (will be live after first deployment)"
    echo ""
    echo "To trigger deployment now:"
    echo "  git push origin main"
    echo ""
    
elif [ "$DEPLOYMENT_TYPE" = "appservice" ]; then
    # Azure App Service deployment
    echo ""
    echo -e "${YELLOW}🌐 Creating Azure App Service infrastructure...${NC}"
    
    # Deploy Bicep template
    az deployment group create \
        --resource-group "$RESOURCE_GROUP" \
        --template-file employee-leave-azure-agent/infra/bicep/appservice.bicep \
        --parameters webAppName="$APP_NAME" planName="plan-$APP_NAME" sku=B1 \
        --output none
    
    echo -e "${GREEN}✅ App Service infrastructure created${NC}"
    
    # Create service principal for OIDC
    echo ""
    echo -e "${YELLOW}🔐 Setting up OIDC authentication...${NC}"
    
    # Get repository info
    if [ "$GH_AVAILABLE" = true ]; then
        REPO_FULL=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
        if [ -z "$REPO_FULL" ]; then
            read -p "Enter GitHub repository (format: owner/repo): " REPO_FULL
        else
            echo "Detected repository: $REPO_FULL"
        fi
    else
        read -p "Enter GitHub repository (format: owner/repo): " REPO_FULL
    fi
    
    # Create app registration
    APP_DISPLAY_NAME="gh-$APP_NAME"
    echo "Creating Azure AD app registration: $APP_DISPLAY_NAME..."
    
    APP_ID=$(az ad app create --display-name "$APP_DISPLAY_NAME" --query appId -o tsv)
    
    # Create service principal
    az ad sp create --id "$APP_ID" --output none
    
    # Assign contributor role
    SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP"
    az role assignment create \
        --assignee "$APP_ID" \
        --role contributor \
        --scope "$SCOPE" \
        --output none
    
    # Get tenant ID
    TENANT_ID=$(az account show --query tenantId -o tsv)
    
    # Create federated credential
    CREDENTIAL_JSON=$(cat <<EOF
{
  "name": "github-federated-main",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:$REPO_FULL:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}
EOF
)
    
    echo "$CREDENTIAL_JSON" | az ad app federated-credential create \
        --id "$APP_ID" \
        --parameters @- \
        --output none
    
    echo -e "${GREEN}✅ OIDC authentication configured${NC}"
    
    # Set GitHub secrets and variables
    if [ "$GH_AVAILABLE" = true ]; then
        echo ""
        echo -e "${YELLOW}🔐 Configuring GitHub secrets and variables...${NC}"
        echo "$APP_ID" | gh secret set AZURE_CLIENT_ID
        echo "$TENANT_ID" | gh secret set AZURE_TENANT_ID
        echo "$SUBSCRIPTION_ID" | gh secret set AZURE_SUBSCRIPTION_ID
        gh variable set AZURE_WEBAPP_NAME --body "$APP_NAME"
        gh variable set AZURE_RESOURCE_GROUP --body "$RESOURCE_GROUP"
        echo -e "${GREEN}✅ GitHub secrets and variables configured${NC}"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Manual step required:${NC}"
        echo "Please add the following secrets to your GitHub repository:"
        echo ""
        echo "  Secrets (Settings → Secrets and variables → Actions → New secret):"
        echo "    AZURE_CLIENT_ID: $APP_ID"
        echo "    AZURE_TENANT_ID: $TENANT_ID"
        echo "    AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
        echo ""
        echo "  Variables (Settings → Secrets and variables → Actions → Variables tab):"
        echo "    AZURE_WEBAPP_NAME: $APP_NAME"
        echo "    AZURE_RESOURCE_GROUP: $RESOURCE_GROUP"
        echo ""
        read -p "Press Enter once you've added the secrets and variables..."
    fi
    
    # Get App Service URLs
    PROD_URL=$(az webapp show \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query "defaultHostName" -o tsv)
    
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ Setup Complete!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Your app will be available at:"
    echo "  Production: https://$PROD_URL"
    echo "  Staging:    https://$APP_NAME-staging.azurewebsites.net"
    echo ""
    echo "Next steps:"
    echo "  1. Push your code to the main branch"
    echo "  2. GitHub Actions will automatically:"
    echo "     - Build the application"
    echo "     - Deploy to staging slot"
    echo "     - Run smoke tests"
    echo "     - Swap to production"
    echo ""
    echo "To trigger deployment now:"
    echo "  git push origin main"
    echo ""
fi

echo "For more information, see DEPLOYMENT.md"
echo ""
echo -e "${GREEN}🎉 Happy deploying!${NC}"
