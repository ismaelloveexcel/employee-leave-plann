#!/bin/bash
# deploy-azure.sh
# Quick deployment script for Azure Static Web Apps or App Service

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Azure Deployment Script"
echo "Employee Leave Planning System"
echo "=========================================="
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI not found. Please install: https://docs.microsoft.com/cli/azure/install-azure-cli${NC}"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq not found. Please install jq for JSON parsing.${NC}"
    echo -e "${YELLOW}On Ubuntu/Debian: sudo apt-get install jq${NC}"
    echo -e "${YELLOW}On macOS: brew install jq${NC}"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Azure. Running 'az login'...${NC}"
    az login
fi

# Select deployment type
echo "Select deployment type:"
echo "1) Azure Static Web Apps (Recommended)"
echo "2) Azure App Service"
echo "3) Azure Container Apps"
read -p "Enter choice [1-3]: " DEPLOY_TYPE

# Get configuration
read -p "Resource Group name [rg-employee-leave]: " RESOURCE_GROUP
RESOURCE_GROUP=${RESOURCE_GROUP:-rg-employee-leave}

read -p "Azure region [eastus]: " LOCATION
LOCATION=${LOCATION:-eastus}

# Create resource group if it doesn't exist
echo -e "${YELLOW}Creating resource group...${NC}"
az group create --name $RESOURCE_GROUP --location $LOCATION --output none
echo -e "${GREEN}✓ Resource group ready${NC}"

case $DEPLOY_TYPE in
    1)
        # Static Web Apps deployment
        read -p "Static Web App name [employee-leave-swa]: " SWA_NAME
        SWA_NAME=${SWA_NAME:-employee-leave-swa}
        
        read -p "GitHub repository URL: " REPO_URL
        if [ -z "$REPO_URL" ]; then
            REPO_URL="https://github.com/ismaelloveexcel/employee-leave-plann"
        fi
        
        read -p "Branch [main]: " BRANCH
        BRANCH=${BRANCH:-main}
        
        echo -e "${YELLOW}Deploying Bicep template for Static Web Apps...${NC}"
        az deployment group create \
            --resource-group $RESOURCE_GROUP \
            --template-file employee-leave-azure-agent/infra/bicep/staticwebapp.bicep \
            --parameters swaName=$SWA_NAME repositoryUrl=$REPO_URL branch=$BRANCH \
            --output json > deployment-output.json
        
        # Extract deployment token
        DEPLOYMENT_TOKEN=$(cat deployment-output.json | jq -r '.properties.outputs.deploymentToken.value')
        SWA_URL=$(cat deployment-output.json | jq -r '.properties.outputs.staticWebAppUrl.value')
        
        echo -e "${GREEN}✓ Static Web App created!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Add this secret to GitHub repository:"
        echo "   Name: AZURE_STATIC_WEB_APPS_API_TOKEN"
        echo "   Value: $DEPLOYMENT_TOKEN"
        echo ""
        echo "2. Push to branch '$BRANCH' to trigger deployment"
        echo ""
        echo "Your app will be available at: $SWA_URL"
        ;;
    
    2)
        # App Service deployment
        read -p "App Service name [employee-leave-web]: " WEBAPP_NAME
        WEBAPP_NAME=${WEBAPP_NAME:-employee-leave-web}
        
        read -p "App Service Plan name [plan-employee-leave]: " PLAN_NAME
        PLAN_NAME=${PLAN_NAME:-plan-employee-leave}
        
        read -p "SKU [B1]: " SKU
        SKU=${SKU:-B1}
        
        echo -e "${YELLOW}Deploying Bicep template for App Service...${NC}"
        az deployment group create \
            --resource-group $RESOURCE_GROUP \
            --template-file employee-leave-azure-agent/infra/bicep/appservice.bicep \
            --parameters webAppName=$WEBAPP_NAME planName=$PLAN_NAME sku=$SKU \
            --output json > deployment-output.json
        
        WEBAPP_URL=$(cat deployment-output.json | jq -r '.properties.outputs.webAppUrl.value')
        STAGING_URL=$(cat deployment-output.json | jq -r '.properties.outputs.stagingUrl.value')
        
        echo -e "${GREEN}✓ App Service created!${NC}"
        echo ""
        echo "URLs:"
        echo "  Production: $WEBAPP_URL"
        echo "  Staging: $STAGING_URL"
        echo ""
        echo "Next steps:"
        echo "1. Configure GitHub secrets for OIDC authentication"
        echo "2. Push to main branch to trigger deployment"
        ;;
    
    3)
        # Container Apps deployment
        read -p "Container App name [employee-leave-app]: " APP_NAME
        APP_NAME=${APP_NAME:-employee-leave-app}
        
        read -p "Container Registry name [employeeleaveacr]: " ACR_NAME
        ACR_NAME=${ACR_NAME:-employeeleaveacr}
        
        read -p "Container Apps Environment name [employee-leave-env]: " ENV_NAME
        ENV_NAME=${ENV_NAME:-employee-leave-env}
        
        echo -e "${YELLOW}Deploying Bicep template for Container Apps...${NC}"
        az deployment group create \
            --resource-group $RESOURCE_GROUP \
            --template-file employee-leave-azure-agent/infra/bicep/container-apps.bicep \
            --parameters containerAppName=$APP_NAME acrName=$ACR_NAME environmentName=$ENV_NAME \
            --output json > deployment-output.json
        
        APP_URL=$(cat deployment-output.json | jq -r '.properties.outputs.containerAppUrl.value')
        ACR_SERVER=$(cat deployment-output.json | jq -r '.properties.outputs.acrLoginServer.value')
        
        echo -e "${GREEN}✓ Container Apps created!${NC}"
        echo ""
        echo "App URL: $APP_URL"
        echo "Container Registry: $ACR_SERVER"
        echo ""
        echo "Next steps:"
        echo "1. Build and push container image:"
        echo "   az acr build --registry $ACR_NAME --image employee-leave:latest --file Dockerfile ."
        echo "2. Configure GitHub secrets for container deployment"
        ;;
    
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Cleanup
rm -f deployment-output.json

echo ""
echo -e "${GREEN}Deployment complete!${NC}"
echo "=========================================="
