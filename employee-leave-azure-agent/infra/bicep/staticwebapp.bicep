
// infra/bicep/staticwebapp.bicep
// Creates an Azure Static Web App with free tier

param location string = 'eastus2' // SWA available regions
@description('Static Web App name')
param swaName string = 'employee-leave-swa'
@description('GitHub repository URL')
param repositoryUrl string = 'https://github.com/ismaelloveexcel/employee-leave-plann'
@description('GitHub branch to deploy from')
param branch string = 'main'
@allowed([ 'Free' 'Standard' ])
param sku string = 'Free'

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: swaName
  location: location
  sku: {
    name: sku
    tier: sku
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: branch
    buildProperties: {
      appLocation: '/'
      apiLocation: ''
      outputLocation: 'dist'
      appBuildCommand: 'npm run build'
      apiBuildCommand: ''
    }
  }
}

// Custom domain (optional)
resource customDomain 'Microsoft.Web/staticSites/customDomains@2023-12-01' = if (false) {
  parent: staticWebApp
  name: 'leave.example.com'
  properties: {}
}

output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppId string = staticWebApp.id
output deploymentToken string = staticWebApp.listSecrets().properties.apiKey
