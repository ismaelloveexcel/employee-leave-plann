# Deploy-Azure.ps1
# PowerShell deployment script for Azure

[CmdletBinding()]
param(
    [Parameter()]
    [ValidateSet('StaticWebApp', 'AppService', 'ContainerApps')]
    [string]$DeploymentType,
    
    [Parameter()]
    [string]$ResourceGroup = 'rg-employee-leave',
    
    [Parameter()]
    [string]$Location = 'eastus'
)

# Check if Azure CLI is installed
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI not found. Please install from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
}

# Check if logged in to Azure
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Not logged in to Azure. Running 'az login'..." -ForegroundColor Yellow
    az login
    $account = az account show | ConvertFrom-Json
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Azure Deployment Script" -ForegroundColor Cyan
Write-Host "Employee Leave Planning System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Subscription: $($account.name)" -ForegroundColor Green
Write-Host "Tenant: $($account.tenantId)" -ForegroundColor Green
Write-Host ""

# Prompt for deployment type if not provided
if (-not $DeploymentType) {
    Write-Host "Select deployment type:"
    Write-Host "1) Azure Static Web Apps (Recommended)"
    Write-Host "2) Azure App Service"
    Write-Host "3) Azure Container Apps"
    $choice = Read-Host "Enter choice [1-3]"
    
    switch ($choice) {
        "1" { $DeploymentType = "StaticWebApp" }
        "2" { $DeploymentType = "AppService" }
        "3" { $DeploymentType = "ContainerApps" }
        default {
            Write-Error "Invalid choice"
            exit 1
        }
    }
}

# Create resource group
Write-Host "Creating resource group '$ResourceGroup'..." -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location --output none
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Resource group ready" -ForegroundColor Green
} else {
    Write-Error "Failed to create resource group"
    exit 1
}

switch ($DeploymentType) {
    "StaticWebApp" {
        $swaName = Read-Host "Static Web App name [employee-leave-swa]"
        if ([string]::IsNullOrWhiteSpace($swaName)) {
            $swaName = "employee-leave-swa"
        }
        
        $repoUrl = Read-Host "GitHub repository URL [https://github.com/ismaelloveexcel/employee-leave-plann]"
        if ([string]::IsNullOrWhiteSpace($repoUrl)) {
            $repoUrl = "https://github.com/ismaelloveexcel/employee-leave-plann"
        }
        
        $branch = Read-Host "Branch [main]"
        if ([string]::IsNullOrWhiteSpace($branch)) {
            $branch = "main"
        }
        
        Write-Host "Deploying Bicep template for Static Web Apps..." -ForegroundColor Yellow
        $deployment = az deployment group create `
            --resource-group $ResourceGroup `
            --template-file employee-leave-azure-agent/infra/bicep/staticwebapp.bicep `
            --parameters "swaName=$swaName" "repositoryUrl=$repoUrl" "branch=$branch" `
            --output json | ConvertFrom-Json
        
        if ($LASTEXITCODE -eq 0) {
            $deploymentToken = $deployment.properties.outputs.deploymentToken.value
            $swaUrl = $deployment.properties.outputs.staticWebAppUrl.value
            
            Write-Host "✓ Static Web App created!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Yellow
            Write-Host "1. Add this secret to GitHub repository:"
            Write-Host "   Name: AZURE_STATIC_WEB_APPS_API_TOKEN"
            Write-Host "   Value: $deploymentToken" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "2. Push to branch '$branch' to trigger deployment"
            Write-Host ""
            Write-Host "Your app will be available at: $swaUrl" -ForegroundColor Green
        } else {
            Write-Error "Deployment failed"
            exit 1
        }
    }
    
    "AppService" {
        $webAppName = Read-Host "App Service name [employee-leave-web]"
        if ([string]::IsNullOrWhiteSpace($webAppName)) {
            $webAppName = "employee-leave-web"
        }
        
        $planName = Read-Host "App Service Plan name [plan-employee-leave]"
        if ([string]::IsNullOrWhiteSpace($planName)) {
            $planName = "plan-employee-leave"
        }
        
        $sku = Read-Host "SKU [B1]"
        if ([string]::IsNullOrWhiteSpace($sku)) {
            $sku = "B1"
        }
        
        Write-Host "Deploying Bicep template for App Service..." -ForegroundColor Yellow
        $deployment = az deployment group create `
            --resource-group $ResourceGroup `
            --template-file employee-leave-azure-agent/infra/bicep/appservice.bicep `
            --parameters "webAppName=$webAppName" "planName=$planName" "sku=$sku" `
            --output json | ConvertFrom-Json
        
        if ($LASTEXITCODE -eq 0) {
            $webAppUrl = $deployment.properties.outputs.webAppUrl.value
            $stagingUrl = $deployment.properties.outputs.stagingUrl.value
            
            Write-Host "✓ App Service created!" -ForegroundColor Green
            Write-Host ""
            Write-Host "URLs:" -ForegroundColor Yellow
            Write-Host "  Production: $webAppUrl" -ForegroundColor Cyan
            Write-Host "  Staging: $stagingUrl" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Yellow
            Write-Host "1. Configure GitHub secrets for OIDC authentication"
            Write-Host "2. Push to main branch to trigger deployment"
        } else {
            Write-Error "Deployment failed"
            exit 1
        }
    }
    
    "ContainerApps" {
        $appName = Read-Host "Container App name [employee-leave-app]"
        if ([string]::IsNullOrWhiteSpace($appName)) {
            $appName = "employee-leave-app"
        }
        
        $acrName = Read-Host "Container Registry name [employeeleaveacr]"
        if ([string]::IsNullOrWhiteSpace($acrName)) {
            $acrName = "employeeleaveacr"
        }
        
        $envName = Read-Host "Container Apps Environment name [employee-leave-env]"
        if ([string]::IsNullOrWhiteSpace($envName)) {
            $envName = "employee-leave-env"
        }
        
        Write-Host "Deploying Bicep template for Container Apps..." -ForegroundColor Yellow
        Write-Host "This may take 5-10 minutes..." -ForegroundColor Yellow
        $deployment = az deployment group create `
            --resource-group $ResourceGroup `
            --template-file employee-leave-azure-agent/infra/bicep/container-apps.bicep `
            --parameters "containerAppName=$appName" "acrName=$acrName" "environmentName=$envName" `
            --output json | ConvertFrom-Json
        
        if ($LASTEXITCODE -eq 0) {
            $appUrl = $deployment.properties.outputs.containerAppUrl.value
            $acrServer = $deployment.properties.outputs.acrLoginServer.value
            
            Write-Host "✓ Container Apps created!" -ForegroundColor Green
            Write-Host ""
            Write-Host "App URL: $appUrl" -ForegroundColor Cyan
            Write-Host "Container Registry: $acrServer" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Yellow
            Write-Host "1. Build and push container image:"
            Write-Host "   az acr build --registry $acrName --image employee-leave:latest --file Dockerfile ." -ForegroundColor Cyan
            Write-Host "2. Configure GitHub secrets for container deployment"
        } else {
            Write-Error "Deployment failed"
            exit 1
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
