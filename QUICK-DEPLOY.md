# 🚀 Quick Deployment Guide

This guide helps you deploy the Employee Leave Planning System in minutes.

## ⚡ Fastest Options (Choose One)

### Option 1: Vercel (2-3 minutes) ⭐ RECOMMENDED

**Perfect for:** Production deployments with zero config

**Steps:**
1. Go to: https://vercel.com/new/clone?repository-url=https://github.com/ismaelloveexcel/employee-leave-plann
2. Click "Create" (may need to login/signup with GitHub)
3. Click "Deploy"
4. Wait 2 minutes
5. ✅ Done! Your app is live

**Result:** 
- Live URL: `https://your-project-name.vercel.app`
- Automatic HTTPS
- Global CDN
- Free tier available

---

### Option 2: Netlify (2-3 minutes)

**Perfect for:** Quick deployments with form handling

**Steps:**
1. Go to: https://app.netlify.com/start/deploy?repository=https://github.com/ismaelloveexcel/employee-leave-plann
2. Click "Connect to GitHub"
3. Click "Save & Deploy"
4. Wait 2-3 minutes
5. ✅ Done!

**Result:**
- Live URL: `https://your-site-name.netlify.app`
- Automatic HTTPS
- Free tier available

---

### Option 3: Netlify Drop (10 minutes)

**Perfect for:** No GitHub account needed, instant deployment

**Steps:**
1. Clone or download this repository
2. Run in terminal:
   ```bash
   npm install
   npm run build
   ```
3. Go to: https://app.netlify.com/drop
4. Drag the `dist` folder into the browser
5. ✅ Done! Instant URL

**Result:**
- Temporary URL (expires in 24 hours without account)
- Can claim and keep with free Netlify account

---

### Option 4: Local/Network Deployment (5 minutes)

**Perfect for:** Testing or internal network access

**Steps:**
1. Clone this repository
2. Run in terminal:
   ```bash
   npm install
   npm run build
   npm run preview
   ```
3. Note the URL (typically http://localhost:4173)
4. Share URL with team on same network
5. ✅ Running locally!

**Result:**
- Runs on your machine
- Accessible on local network
- No hosting costs

---

## 🔧 Post-Deployment Configuration

After deployment, you may need to configure:

### Environment Variables (Optional)

For Vercel:
1. Go to your project dashboard
2. Settings > Environment Variables
3. Add variables if needed
4. Redeploy

For Netlify:
1. Site settings > Environment variables
2. Add variables if needed
3. Trigger new deploy

### Common Variables:
- Authentication tokens (if using Spark auth)
- API endpoints (if backend added later)
- Feature flags

---

## 🔍 Verify Deployment

After deployment, test these:

1. ✅ Site loads without errors
2. ✅ Calendar displays correctly
3. ✅ Can navigate between pages
4. ✅ Forms are responsive
5. ✅ Mobile view works

---

## 🆘 Troubleshooting

### Build Fails

**Error:** "Build failed"
**Solution:** 
```bash
# Test locally first
npm install
npm run build
# If it works locally, check deployment logs
```

### Site Loads But Blank

**Error:** White screen or blank page
**Solution:** 
- Check browser console (F12) for errors
- Ensure `dist` folder has `index.html`
- Check deployment logs for warnings

### Routes Don't Work (404 on refresh)

**Error:** Page 404 when refreshing
**Solution:** 
- Check that `vercel.json` or `netlify.toml` is included
- Verify SPA routing rules are configured

### Assets Not Loading

**Error:** CSS/JS not loading
**Solution:**
- Check base path in `vite.config.ts`
- Verify assets are in `dist` folder
- Check CDN/cache settings

---

## 📊 Deployment Comparison

| Platform | Setup Time | Free Tier | HTTPS | Custom Domain | CDN |
|----------|-----------|-----------|-------|---------------|-----|
| **Vercel** | 2-3 min | ✅ 100GB bandwidth | ✅ Auto | ✅ Easy | ✅ Global |
| **Netlify** | 2-3 min | ✅ 100GB bandwidth | ✅ Auto | ✅ Easy | ✅ Global |
| **Netlify Drop** | 10 min | ✅ Temp/24h | ✅ Auto | ❌ No | ✅ Global |
| **Local** | 5 min | ✅ Free | ❌ No | ❌ No | ❌ No |

---

## 🎯 Recommended Path

### For Testing (Right Now):
→ Use **Option 4: Local Deployment** (5 minutes)

### For Demo/Presentation (Today):
→ Use **Option 3: Netlify Drop** (10 minutes)

### For Production (This Week):
→ Use **Option 1: Vercel** (2-3 minutes)

### For Enterprise (Long-term):
→ Consider **Azure Static Web Apps** (already configured)
→ Or evaluate **SaaS alternatives** in DEPLOYMENT-ALTERNATIVES.md

---

## 📞 Need More Options?

See [DEPLOYMENT-ALTERNATIVES.md](./DEPLOYMENT-ALTERNATIVES.md) for:
- SaaS alternatives (BambooHR, Zoho, etc.)
- Azure deployment (App Service, Static Web Apps)
- Railway deployment
- Docker containers
- Cost comparisons

---

## ✅ Success Checklist

After deployment, you should have:

- [ ] Live URL accessible from internet
- [ ] HTTPS enabled (shows lock icon)
- [ ] App loads without errors
- [ ] Can view calendar
- [ ] Can submit test form
- [ ] Mobile view works
- [ ] Shared URL with team

---

## 🔄 Updating After Deployment

### For Vercel/Netlify:
1. Push changes to GitHub
2. Automatic deployment triggers
3. New version live in 2-3 minutes

### For Netlify Drop:
1. Build: `npm run build`
2. Drag new `dist` folder
3. Get new URL

### For Local:
1. Run: `npm run build`
2. Run: `npm run preview`

---

*Last Updated: January 28, 2026*
*For urgent support, see DEPLOYMENT-ALTERNATIVES.md*
