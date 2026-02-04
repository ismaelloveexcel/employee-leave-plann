# 🚀 Quick Deployment Guide - Employee Leave Planner

## Ready to Deploy in 5 Minutes!

Your Employee Leave Planner is **production-ready** and can be deployed to GitHub Pages for **free** with **zero maintenance**.

---

## ⚡ Super Quick Start

### Step 1: Enable GitHub Pages (30 seconds)

1. Go to: https://github.com/ismaelloveexcel/employee-leave-plann/settings/pages
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions" (NOT "Deploy from a branch")
3. Click **Save**

### Step 2: Deploy (2 minutes)

1. Go to: https://github.com/ismaelloveexcel/employee-leave-plann/actions
2. Click on "**Deploy to GitHub Pages**" workflow
3. Click "**Run workflow**" button (top right)
4. Select branch: `main`
5. Click green "**Run workflow**" button

Wait 2-3 minutes. You'll see:
- 🟡 Yellow dot = In progress
- ✅ Green checkmark = Success!
- ❌ Red X = Failed (check logs)

### Step 3: Access Your App

Your app is now live at:

**https://ismaelloveexcel.github.io/employee-leave-plann/**

Test it immediately!

---

## 🎯 What You Get

✅ **Free hosting** - GitHub Pages is completely free
✅ **HTTPS enabled** - Secure SSL certificate included
✅ **Auto-deploy** - Updates automatically when you push code
✅ **Global CDN** - Fast loading worldwide
✅ **99.9% uptime** - Reliable hosting

---

## 🌐 Hide GitHub URL (Optional but Recommended)

Make it look professional: `leave.yourcompany.com` instead of GitHub URL

### Quick Steps:

1. **Buy/use existing domain** (e.g., from Namecheap, GoDaddy)

2. **Add DNS record** in your domain provider:
   ```
   Type: CNAME
   Name: leave (or hr, employee, planner)
   Value: ismaelloveexcel.github.io
   TTL: 3600
   ```

3. **Configure in GitHub**:
   - Settings → Pages → Custom domain
   - Enter: `leave.yourcompany.com`
   - Check "Enforce HTTPS"

4. **Update code** (only if using custom domain):
   - Edit `vite.config.ts`
   - Change `base: '/employee-leave-plann/'` to `base: '/'`
   - Commit and push

Wait 10-60 minutes for DNS propagation.

**Result**: Your app at `https://leave.yourcompany.com` ✨

---

## 📧 Share with Employees

### Login Instructions to Send:

```
🎯 Access the Leave Planner:
👉 https://leave.yourcompany.com (or your GitHub Pages URL)

📝 How to Login:
1. Employee ID: Your employee number (e.g., BAYN00002)
2. Date of Birth: Format DDMMYYYY (e.g., 15031990)
3. Click "Login"

⚙️ First Time Setup:
1. Click "Settings" (top right)
2. Enter your manager's email
3. Save

📚 Full User Guide: [Attach EMPLOYEE_USER_GUIDE.md]

📞 Support: WhatsApp +971564966546
```

---

## 🔄 How to Update the App

Any changes you make are automatically deployed:

1. Make code changes locally
2. Commit: `git commit -m "Your changes"`
3. Push: `git push`
4. Wait 2-3 minutes
5. Changes are live!

No manual deployment needed - it's automatic!

---

## 👥 Managing Employee Data

### Option 1: HR Admin Panel (Easiest)

1. Login as a manager (Employee marked as `isManager: true`)
2. Scroll to "HR Admin Panel"
3. Upload CSV or manually add employees
4. Save

### Option 2: Edit Code

Edit `src/App.tsx` → `SAMPLE_EMPLOYEES` array:

```typescript
{
  id: '5',
  employeeId: 'BAYN00005',
  name: 'New Employee',
  email: 'new.employee@baynunah.ae',
  department: 'Sales',
  position: 'Sales Executive',
  // ... other fields
}
```

Commit and push - data updates automatically!

---

## 🆘 Troubleshooting

### Build Failed ❌

**Check Actions Tab**: Click on failed run to see error logs

**Common fixes**:
```bash
# Test build locally
npm ci
npm run build

# If it works locally, push to trigger redeploy
git commit --allow-empty -m "Trigger redeploy"
git push
```

### App Not Loading

1. **Check URL is correct**: Should have `/employee-leave-plann/` at end
2. **Wait 5 minutes** after first deployment
3. **Clear browser cache**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
4. **Check deployment status**: Actions tab should show ✅

### Custom Domain Not Working

1. **Verify DNS**: Use https://dnschecker.org to check CNAME
2. **Wait 60 minutes** for DNS propagation
3. **Check HTTPS**: Settings → Pages → should show "Enforce HTTPS" ✅
4. **Verify config**: `vite.config.ts` should have `base: '/'` for custom domain

### CSS/Images Not Loading

**Issue**: Base path incorrect

**Fix**:
- For GitHub Pages: `base: '/employee-leave-plann/'` in vite.config.ts
- For custom domain: `base: '/'` in vite.config.ts

---

## 📊 Monitoring

### Check Deployment Status

- **Actions Tab**: https://github.com/ismaelloveexcel/employee-leave-plann/actions
- Green ✅ = Successful
- Yellow 🟡 = In progress
- Red ❌ = Failed

### View Deployment History

All deployments are logged in Actions tab with:
- Timestamp
- Commit message
- Build logs
- Deployment URL

---

## 🎓 Additional Resources

📖 **Full Deployment Guide**: [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md)
- Custom domain setup
- Detailed troubleshooting
- Advanced configurations

👥 **Employee User Guide**: [EMPLOYEE_USER_GUIDE.md](./EMPLOYEE_USER_GUIDE.md)
- How to login
- How to request leave
- FAQs and tips

📋 **Project README**: [README.md](./README.md)
- Features overview
- Development setup
- Tech stack

---

## ✅ Pre-Deployment Checklist

Before going live:

- [ ] GitHub Pages enabled in Settings
- [ ] Workflow runs successfully (check Actions tab)
- [ ] App loads at GitHub Pages URL
- [ ] Login works with test employee
- [ ] Leave request can be submitted
- [ ] Calendar displays correctly
- [ ] All employee data loaded
- [ ] Manager emails configured (optional)
- [ ] Custom domain configured (optional)
- [ ] Employee guide shared with team
- [ ] Support contact info updated

---

## 💰 Cost Breakdown

| Service | Cost | What You Get |
|---------|------|--------------|
| GitHub Pages | **$0/month** | Hosting, SSL, CDN |
| Domain (optional) | $10-15/year | Custom URL |
| **Total** | **$0-15/year** | Production app! |

Compare to:
- Azure App Service: $50-200/month
- AWS: $30-100/month
- Heroku: $7-25/month

**You're saving $360-2,400/year!** 💰

---

## 🎉 You're Done!

Your Leave Planner is now:
- ✅ Deployed and accessible
- ✅ Secure with HTTPS
- ✅ Fast with global CDN
- ✅ Auto-updating on changes
- ✅ Free to run
- ✅ Zero maintenance

**Share the URL with your team and start managing leaves efficiently!**

---

## 📞 Need Help?

- **Technical Issues**: Open issue at https://github.com/ismaelloveexcel/employee-leave-plann/issues
- **HR Support**: WhatsApp +971564966546
- **Documentation**: See guides in repository

---

**Last Updated**: February 2026
**Deployment Method**: GitHub Pages
**Estimated Setup Time**: 5 minutes
**Cost**: $0/month

---

*Congratulations on deploying your Leave Management System! 🎉*
