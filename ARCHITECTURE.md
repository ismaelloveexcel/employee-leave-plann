# 🏗️ Azure Deployment Architecture

## Overview

This document describes the deployment architecture for the Employee Leave Planning application on Azure within the Microsoft ecosystem.

## Architecture Diagram

### Azure Static Web Apps Deployment (Recommended)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                           │
│                  github.com/ismaelloveexcel/employee-leave-plann    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Source Code (React + TypeScript + Vite)                   │    │
│  │  - src/                                                     │    │
│  │  - package.json                                             │    │
│  │  - vite.config.ts                                           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  GitHub Actions Workflows                                   │    │
│  │  - .github/workflows/ci.yml (Lint + Build + Test)          │    │
│  │  - .github/workflows/deploy-swa.yml (Deploy to Azure)      │    │
│  └────────────────────────────────────────────────────────────┘    │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       │ git push / PR
                       │
                       ▼
        ┌──────────────────────────────┐
        │   GitHub Actions Runner      │
        │                              │
        │  1. Checkout code            │
        │  2. Install dependencies     │
        │  3. Run linting              │
        │  4. Build (npm run build)    │
        │  5. Deploy to Azure          │
        └──────────────┬───────────────┘
                       │
                       │ Azure Static Web Apps Deploy Action
                       │
                       ▼
        ┌──────────────────────────────────────────────┐
        │        Azure Static Web Apps                 │
        │                                              │
        │  ┌────────────────────────────────────────┐ │
        │  │  Global CDN (Edge Locations)           │ │
        │  │  - Automatic HTTPS                     │ │
        │  │  - SSL/TLS certificates                │ │
        │  │  - DDoS protection                     │ │
        │  └────────────────────────────────────────┘ │
        │                                              │
        │  ┌────────────────────────────────────────┐ │
        │  │  Production Environment                │ │
        │  │  - Static files (HTML, CSS, JS)       │ │
        │  │  - Single Page App routing            │ │
        │  │  - Environment variables              │ │
        │  └────────────────────────────────────────┘ │
        │                                              │
        │  ┌────────────────────────────────────────┐ │
        │  │  Preview Environments (PR-based)       │ │
        │  │  - Automatic per-PR deployment        │ │
        │  │  - Unique URL per PR                  │ │
        │  │  - Auto-cleanup on PR close           │ │
        │  └────────────────────────────────────────┘ │
        │                                              │
        │  📊 Built-in Features:                      │
        │  ✅ Custom domains                          │
        │  ✅ Authentication (Azure AD, GitHub, etc.) │
        │  ✅ API integration (Azure Functions)       │
        │  ✅ Automatic scaling                       │
        │  ✅ Zero downtime deployments              │
        └──────────────────┬───────────────────────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │   End Users      │
                 │  🌍 Worldwide    │
                 └──────────────────┘
```

### Azure App Service Deployment (Alternative)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                           │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       │ git push
                       │
                       ▼
        ┌──────────────────────────────┐
        │   GitHub Actions Runner      │
        │  + Azure OIDC Authentication │
        │                              │
        │  1. Checkout code            │
        │  2. Install & build          │
        │  3. Login to Azure (OIDC)    │
        │  4. Deploy to staging slot   │
        │  5. Run smoke tests          │
        │  6. Swap to production       │
        └──────────────┬───────────────┘
                       │
                       │ Azure Web Apps Deploy
                       │
                       ▼
        ┌──────────────────────────────────────────────┐
        │        Azure App Service (Linux)             │
        │                                              │
        │  ┌────────────────────────────────────────┐ │
        │  │  Production Slot                       │ │
        │  │  - Node.js 20 LTS runtime             │ │
        │  │  - Runs built static files            │ │
        │  │  - Always available                   │ │
        │  │  URL: [name].azurewebsites.net       │ │
        │  └────────────────────────────────────────┘ │
        │                 ▲                            │
        │                 │ Slot Swap                 │
        │                 │ (Zero Downtime)           │
        │  ┌────────────────────────────────────────┐ │
        │  │  Staging Slot                          │ │
        │  │  - Pre-production testing              │ │
        │  │  - Smoke tests before swap             │ │
        │  │  - Rollback capability                 │ │
        │  │  URL: [name]-staging.azurewebsites.net│ │
        │  └────────────────────────────────────────┘ │
        │                                              │
        │  📊 Built-in Features:                      │
        │  ✅ Auto-scaling                            │
        │  ✅ Application Insights                    │
        │  ✅ Deployment slots                        │
        │  ✅ Custom domains                          │
        │  ✅ SSL certificates                        │
        │  ✅ Continuous deployment                   │
        └──────────────────┬───────────────────────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │   End Users      │
                 └──────────────────┘
```

## Deployment Flow

### Continuous Integration (CI)

```
Developer → git push → GitHub Actions
                            │
                            ├─→ ESLint (Code Quality)
                            ├─→ TypeScript (Type Checking)
                            ├─→ Vite Build (Production Bundle)
                            └─→ Upload Artifacts
```

### Continuous Deployment (CD) - Static Web Apps

```
CI Success → Deploy Action
                 │
                 ├─→ Deploy to Production (main branch)
                 ├─→ Deploy to Preview (PR)
                 └─→ Cleanup (PR closed)
```

### Continuous Deployment (CD) - App Service

```
CI Success → Deploy to Staging
                 │
                 ├─→ Smoke Test
                 │      │
                 │      ├─→ Pass: Swap to Production
                 │      └─→ Fail: Stop (Manual Review)
                 │
                 └─→ Production Live
```

## Security Architecture

### Authentication Flow (OIDC for App Service)

```
GitHub Actions → Request OIDC Token
                      │
                      ▼
              Azure AD Verifies
                      │
                      ├─→ Valid: Grant Access
                      └─→ Invalid: Deny
                      │
                      ▼
              Deploy to Azure
```

**No Secrets Needed!**
- Uses federated identity credentials
- Short-lived tokens
- Automatic rotation
- Audit trail in Azure AD

### Static Web Apps Authentication

```
User → Static Web App
         │
         ├─→ Public Routes (No Auth)
         │
         └─→ Protected Routes
                │
                ├─→ Azure AD
                ├─→ GitHub OAuth
                ├─→ Twitter OAuth
                └─→ Custom Providers
```

## Infrastructure Components

### Azure Static Web Apps Stack

| Component | Purpose | Cost |
|-----------|---------|------|
| Static Web App | Host React SPA | Free tier available |
| Azure CDN | Global content delivery | Included |
| SSL/TLS | HTTPS encryption | Included |
| Custom Domains | Branding | Included |
| Preview Environments | PR testing | Included |

### Azure App Service Stack

| Component | Purpose | Cost |
|-----------|---------|------|
| App Service Plan | Compute resources | ~$13/month (B1) |
| Web App | Host application | Included in plan |
| Deployment Slots | Staging environment | Included (Standard+) |
| Application Insights | Monitoring (optional) | Pay-per-use |
| Custom Domains | Branding | Included |

## Network Architecture

### Static Web Apps

```
Internet → Azure Front Door → Edge Locations → Origin
                                    │
                                    └─→ Cached globally
                                        (Low latency worldwide)
```

### App Service

```
Internet → Azure Traffic Manager (optional) → App Service
                                                    │
                                                    └─→ VNet Integration (optional)
                                                        Database, APIs, etc.
```

## Monitoring & Observability

### Built-in Monitoring

```
Application Logs → Azure Monitor
                        │
                        ├─→ Log Analytics
                        ├─→ Application Insights
                        ├─→ Alerts & Notifications
                        └─→ Dashboards
```

### GitHub Actions Monitoring

```
Workflow Runs → GitHub Actions Dashboard
                        │
                        ├─→ Job Logs
                        ├─→ Artifact Downloads
                        ├─→ Deployment Status
                        └─→ Notifications
```

## Disaster Recovery

### Static Web Apps

- **RPO (Recovery Point Objective)**: Last successful deployment
- **RTO (Recovery Time Objective)**: Minutes (redeploy from Git)
- **Backup**: Git repository is source of truth
- **Rollback**: Redeploy previous commit

### App Service

- **RPO**: Near zero with deployment slots
- **RTO**: Seconds (slot swap)
- **Backup**: Git + Azure App Service backup
- **Rollback**: Instant slot swap back

## Scaling Strategy

### Static Web Apps

- **Automatic**: Scales globally via CDN
- **No configuration needed**
- **Unlimited concurrent users**
- **Consistent performance worldwide**

### App Service

- **Vertical**: Upgrade to larger SKU (B1 → B2 → S1 → P1v3)
- **Horizontal**: Auto-scale rules based on:
  - CPU percentage
  - Memory percentage
  - Request count
  - Custom metrics

## Cost Optimization

### Static Web Apps

✅ **Free tier includes:**
- 100 GB bandwidth/month
- 0.5 GB storage
- 2 custom domains
- Preview environments
- SSL certificates

💡 **Upgrade to Standard when:**
- Need >100 GB bandwidth
- Require SLA
- Need advanced auth

### App Service

💰 **Start small:**
- B1 Basic: Development/testing
- S1 Standard: Small production
- P1v3 Premium: High traffic

💡 **Save costs:**
- Use deployment slots (Standard+)
- Enable auto-scale down
- Use Azure Reserved Instances
- Monitor with Azure Cost Management

## Best Practices

### 1. Use Static Web Apps for React SPAs ✅
- Optimized for frontend frameworks
- Better performance (global CDN)
- Lower cost (free tier)
- Easier management

### 2. Use App Service When You Need:
- Server-side rendering
- Backend API in same deployment
- WebSockets
- Custom runtime/environment

### 3. Implement CI/CD
- Automatic deployments on push
- PR preview environments
- Smoke tests before production
- Easy rollback

### 4. Monitor Everything
- Enable Application Insights
- Set up alerts
- Track key metrics
- Review logs regularly

### 5. Secure Properly
- Use OIDC (no secrets)
- Enable HTTPS only
- Implement authentication
- Follow least privilege

## Summary

**Recommended Architecture: Azure Static Web Apps**

✅ Best for this React SPA application
✅ Minimal manual intervention (automated script provided)
✅ Free tier available
✅ Global performance
✅ Easy to maintain

**Deployment Time**: 5-10 minutes with automated script
**Ongoing Maintenance**: Minimal (automatic updates)
**Cost**: Free to start, scales as needed

---

For implementation details, see [DEPLOYMENT.md](DEPLOYMENT.md)
