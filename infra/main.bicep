// Azure Static Web Apps + Cosmos DB Infrastructure
// Deploy with: az deployment sub create --location eastus --template-file main.bicep --parameters appName=employee-leave-planner

targetScope = 'subscription'

@description('Name of the application')
param appName string = 'employee-leave-planner'

@description('Location for all resources')
param location string = 'eastus'

@description('GitHub repository URL')
param repositoryUrl string = ''

@description('GitHub repository branch')
param repositoryBranch string = 'main'

// Resource Group
resource resourceGroup 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: 'rg-${appName}'
  location: location
}

// Deploy Static Web App
module staticWebApp 'modules/staticWebApp.bicep' = {
  name: 'staticWebApp'
  scope: resourceGroup
  params: {
    appName: appName
    location: location
    repositoryUrl: repositoryUrl
    repositoryBranch: repositoryBranch
  }
}

// Deploy Cosmos DB (optional - for data persistence)
module cosmosDb 'modules/cosmosDb.bicep' = {
  name: 'cosmosDb'
  scope: resourceGroup
  params: {
    appName: appName
    location: location
  }
}

// Outputs
output staticWebAppUrl string = staticWebApp.outputs.defaultHostname
output cosmosDbEndpoint string = cosmosDb.outputs.endpoint
output resourceGroupName string = resourceGroup.name
// NOTE: staticWebAppApiToken removed from outputs for security reasons
// Retrieve the deployment token directly from the Azure Portal or use Azure Key Vault
