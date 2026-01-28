// Azure Cosmos DB Module (Free tier)

@description('Name of the application')
param appName string

@description('Location for the resource')
param location string

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-11-15' = {
  name: 'cosmos-${appName}'
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    enableFreeTier: true
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    // NOTE: EnableServerless removed - not compatible with free tier
    // Free tier uses provisioned throughput (400-1000 RU/s free)
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-11-15' = {
  parent: cosmosAccount
  name: 'LeavePlannerDB'
  properties: {
    resource: {
      id: 'LeavePlannerDB'
    }
  }
}

resource employeesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-11-15' = {
  parent: database
  name: 'Employees'
  properties: {
    resource: {
      id: 'Employees'
      partitionKey: {
        paths: ['/employeeId']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
      }
    }
  }
}

resource leaveRequestsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-11-15' = {
  parent: database
  name: 'LeaveRequests'
  properties: {
    resource: {
      id: 'LeaveRequests'
      partitionKey: {
        paths: ['/employeeId']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
      }
    }
  }
}

resource auditLogsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-11-15' = {
  parent: database
  name: 'AuditLogs'
  properties: {
    resource: {
      id: 'AuditLogs'
      partitionKey: {
        paths: ['/employeeId']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
      }
    }
  }
}

resource leave2025ConfirmationsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-11-15' = {
  parent: database
  name: 'Leave2025Confirmations'
  properties: {
    resource: {
      id: 'Leave2025Confirmations'
      partitionKey: {
        paths: ['/employeeId']
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
      }
    }
  }
}

output endpoint string = cosmosAccount.properties.documentEndpoint
output accountName string = cosmosAccount.name
output databaseName string = database.name
