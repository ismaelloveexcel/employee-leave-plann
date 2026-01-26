// Azure Static Web Apps Module

@description('Name of the application')
param appName string

@description('Location for the resource')
param location string

@description('GitHub repository URL')
param repositoryUrl string = ''

@description('GitHub repository branch')
param repositoryBranch string = 'main'

resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: 'swa-${appName}'
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: repositoryUrl != '' ? repositoryUrl : null
    branch: repositoryUrl != '' ? repositoryBranch : null
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    buildProperties: {
      appLocation: '/'
      apiLocation: ''
      outputLocation: 'dist'
      appBuildCommand: 'npm run build'
    }
  }
}

// Custom configuration for the static web app
resource staticWebAppConfig 'Microsoft.Web/staticSites/config@2023-01-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    VITE_API_BASE_URL: ''
  }
}

output defaultHostname string = staticWebApp.properties.defaultHostname
output apiKey string = listSecrets(staticWebApp.id, '2023-01-01').properties.apiKey
output resourceId string = staticWebApp.id
