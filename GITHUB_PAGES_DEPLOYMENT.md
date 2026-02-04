# GitHub Pages Deployment Guide

This guide explains how to deploy the Employee Leave Planner to GitHub Pages - the easiest and fastest deployment option with no costs.

## 🚀 Quick Start (5 Minutes Setup)

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/ismaelloveexcel/employee-leave-plann
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"
   - (Do not select "Deploy from a branch")
5. Click **Save**

### Step 2: Trigger Deployment

The deployment will start automatically on the next push to the `main` branch. To deploy immediately:

1. Go to **Actions** tab in your repository
2. Click **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → Select `main` branch → **Run workflow**

### Step 3: Access Your App

After 2-3 minutes, your app will be available at:

**Default URL**: https://ismaelloveexcel.github.io/employee-leave-plann/

## 🎭 Custom Domain (Optional - Hide GitHub URL)

To use a custom domain instead of github.io URL:

### Option 1: Use a Subdomain (Recommended)

1. **Buy a domain** (e.g., from Namecheap, GoDaddy) - or use an existing one
2. **Add DNS Record** in your domain provider:
   ```
   Type: CNAME
   Name: leave (or hr, or employee)
   Value: ismaelloveexcel.github.io
   TTL: 3600
   ```
3. **Configure GitHub Pages**:
   - Go to Settings → Pages
   - Under "Custom domain", enter: `leave.yourdomain.com`
   - Click Save
   - Check "Enforce HTTPS" (wait 10 minutes for SSL certificate)

4. **Update vite.config.ts** (if using custom domain):
   ```typescript
   base: '/', // Use root path for custom domain
   ```

### Option 2: Use Root Domain

1. **Add DNS Records** (A records):
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: A
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   ```

2. **Configure in GitHub Pages**:
   - Settings → Pages → Custom domain: `yourdomain.com`
   - Enable HTTPS

### Domain Examples That Don't Reveal External Hosting:

- ✅ `leave.baynunah.ae` (looks like company infrastructure)
- ✅ `hr.baynunah.ae` (looks internal)
- ✅ `employee.baynunah.ae` (professional)
- ✅ `planner.baynunah.ae` (neutral)
- ❌ `baynunah.github.io` (obviously external)

## 🔧 Troubleshooting

### Build Fails

**Check the Actions tab** for error details:
```bash
# Test build locally
npm ci
npm run build
```

### 404 Error After Deployment

1. Verify GitHub Pages is enabled in Settings → Pages
2. Ensure the workflow completed successfully in Actions tab
3. Wait 2-3 minutes for DNS propagation

### CSS/JS Not Loading

This is usually due to incorrect base path. Verify `vite.config.ts`:
- For GitHub Pages: `base: '/employee-leave-plann/'`
- For custom domain: `base: '/'`

### Custom Domain Not Working

1. **Verify DNS records** (use https://dnschecker.org)
2. **Wait 10-60 minutes** for DNS propagation
3. **Check HTTPS certificate** is issued (Settings → Pages)

## 📊 Monitoring & Updates

### Check Deployment Status

- Go to **Actions** tab to see deployment history
- Green checkmark ✅ = successful deployment
- Red X ❌ = failed (click for error details)

### Automatic Updates

Every push to `main` branch automatically:
1. Builds the application
2. Deploys to GitHub Pages
3. Updates live site in 2-3 minutes

### Manual Deployment

Trigger anytime via Actions tab → Deploy to GitHub Pages → Run workflow

## 💰 Costs

**Total Cost: $0/month**

GitHub Pages is completely free for public repositories:
- ✅ Unlimited bandwidth
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ 99.9% uptime
- ✅ No maintenance required

## 🔒 Security Considerations

### Data Storage

- Employee data is stored in browser localStorage
- No data is sent to external servers
- Data is private per device/browser

### HTTPS

- Automatic SSL/TLS encryption
- Forces HTTPS connections
- Secure by default

### Recommendations

1. **Add .env file** (if needed) to `.gitignore`
2. **Never commit** sensitive API keys
3. **Use environment variables** for sensitive config
4. **Review permissions** regularly

## 📱 Access Instructions for Employees

Share this with your team:

```
🎯 Access the Leave Planner:
👉 https://leave.yourcompany.com (or your GitHub Pages URL)

📝 Login Instructions:
1. Open the URL in your browser
2. Enter your Employee ID (e.g., BAYN00002)
3. Enter your Date of Birth (format: DDMMYYYY, e.g., 15031990)
4. Click "Login"

⚙️ First Time Setup:
1. After login, click "Settings" in the top right
2. Enter your manager's email address
3. Click "Save"
4. You're ready to submit leave requests!

📧 Support:
Contact HR via WhatsApp: +971564966546
```

## 🎨 Customization

### Change App Title

Edit `index.html`:
```html
<title>Leave Planner 2026 - Your Company Name</title>
```

### Update Branding

Edit theme colors in `src/index.css`:
```css
--primary: #0f025d;  /* Main brand color */
--secondary: #38b6ff; /* Accent color */
```

### Add Company Logo

1. Add logo to `/public/logo.png`
2. Update `src/components/EmployeeHeader.tsx` to display logo

## 🔄 Migration from Azure (if applicable)

If you're currently on Azure and want to migrate to GitHub Pages:

1. **Enable GitHub Pages** (as described above)
2. **Test the deployment** thoroughly
3. **Update any bookmarks/links** to new URL
4. **Notify employees** of the new URL
5. **Decommission Azure resources** to save costs

## 📞 Support

For deployment issues:
- Check the [GitHub Pages docs](https://docs.github.com/en/pages)
- Open an issue in this repository
- Contact HR: +971564966546

## 🚀 Advanced: Environment-Specific Config

For different configurations per environment:

```typescript
// vite.config.ts
const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  base: isGitHubPages ? '/employee-leave-plann/' : '/',
  // ... other config
});
```

## ✅ Deployment Checklist

Before going live:

- [ ] GitHub Pages enabled in repository settings
- [ ] Workflow completes successfully in Actions tab
- [ ] App loads correctly at GitHub Pages URL
- [ ] Login functionality works
- [ ] Leave request submission works
- [ ] Data persists across page refreshes
- [ ] Custom domain configured (if using)
- [ ] HTTPS enabled and working
- [ ] All employees have access credentials
- [ ] Manager emails configured
- [ ] Tested on mobile devices
- [ ] Instructions shared with team

---

**Last Updated**: February 2026
**Deployment Method**: GitHub Pages (Free, Zero Maintenance)
**Typical Deployment Time**: 2-3 minutes
