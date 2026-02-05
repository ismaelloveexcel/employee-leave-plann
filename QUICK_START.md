# Quick Start Guide - Static Site Deployment

This guide will help you get the Employee Leave Planner running as a static website in under 5 minutes.

> **💡 Need to add employee data?** See **[EMPLOYEE_DATA_GUIDE.md](./EMPLOYEE_DATA_GUIDE.md)** for where and how to store employee information.

## Option 1: Run Locally (Fastest - 2 minutes)

### Prerequisites
- Node.js 20+ installed
- A modern web browser

### Steps

1. **Clone and install:**
   ```bash
   git clone <your-repo-url>
   cd employee-leave-plann
   npm install
   ```

2. **Build the static site:**
   ```bash
   npm run build
   ```
   This creates a `dist/` folder with all static files (HTML, CSS, JS).

3. **Preview locally:**
   ```bash
   npm run preview
   ```
   Opens at `http://localhost:4173`

**That's it!** The application is now running entirely as static files with no backend.

## Option 2: Deploy to GitHub Pages (Free - 5 minutes)

### Prerequisites
- GitHub account
- Repository pushed to GitHub

### Steps

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click `Settings` → `Pages`
   - Under "Source", select `GitHub Actions`
   - Click Save

2. **Trigger deployment:**
   - Push to `main` branch (workflow is already configured)
   - Or click `Actions` → `Deploy Employee Leave Planner` → `Run workflow`

3. **Access your site:**
   - After ~2 minutes, visit: `https://<username>.github.io/<repo-name>`
   - Example: `https://yourusername.github.io/employee-leave-plann`

**Done!** Your app is live on the internet for free.

## Option 3: Deploy to Netlify (Easiest - 3 minutes)

### Prerequisites
- Netlify account (free)
- Repository on GitHub

### Steps

1. **Connect repository:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository

2. **Configure (auto-detected):**
   - Build command: `npm run build` (already in netlify.toml)
   - Publish directory: `dist` (already in netlify.toml)
   - Click "Deploy site"

3. **Access your site:**
   - Netlify provides a URL like `https://random-name-12345.netlify.app`
   - Optional: Add custom domain in site settings

**Done!** Automatic deployments on every push.

## Option 4: Run with Simple HTTP Server

If you just want to test the build without npm:

### Using Python (installed on most systems):
```bash
cd dist
python3 -m http.server 8080
```
Open `http://localhost:8080`

### Using Node.js:
```bash
npx http-server dist -p 8080
```
Open `http://localhost:8080`

### Using PHP:
```bash
cd dist
php -S localhost:8080
```
Open `http://localhost:8080`

## What You Get

✅ **Fully functional leave management system**
- Employee dashboard
- Leave requests and approvals
- Calendar with UAE holidays
- Manager notifications
- Data export/import

✅ **No backend required**
- All data stored in browser
- No database to configure
- No API servers needed

✅ **Free hosting**
- GitHub Pages: 100GB bandwidth/month
- Netlify: 100GB bandwidth/month
- Vercel: 100GB bandwidth/month

✅ **Secure**
- HTTPS by default (on all platforms)
- No server to hack
- User data stays private

## Troubleshooting

### Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Preview shows blank page
- Check browser console (F12) for errors
- Ensure you're accessing via HTTP (not file://)
- Try: `npm run build && npm run preview`

### Features not working
- Verify browser has JavaScript enabled
- Check browser compatibility (needs ES2020+)
- Clear browser cache (Ctrl+Shift+R)

### Data not persisting
- Check browser allows localStorage
- Not in private/incognito mode
- Use Export feature to backup data

## Next Steps

1. **Customize**: Edit content in `src/` folder
2. **Rebuild**: Run `npm run build` after changes
3. **Redeploy**: Push to GitHub (auto-deploys) or re-upload `dist/` folder

## Need Help?

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides
- **Technical Details**: See [STATIC_SITE_PROPOSAL.md](./STATIC_SITE_PROPOSAL.md)
- **Features**: See [PRD.md](./PRD.md)

---

## Key Commands Cheat Sheet

```bash
# Development
npm run dev              # Start dev server (hot reload)

# Production
npm run build            # Build static files
npm run preview          # Test production build
npm run serve:local      # Serve with http-server

# Deployment
git push origin main     # Auto-deploy to GitHub Pages
npx vercel --prod       # Deploy to Vercel
# Or just upload dist/ folder anywhere!
```

---

**Remember**: This is a static website. After building, the `dist/` folder contains everything you need. You can copy it anywhere, and it will work!
