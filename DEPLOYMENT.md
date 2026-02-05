# Deployment Guide for Employee Leave Planner

## Overview

This application is built as a client-side React application that can be deployed as static files to any web hosting service or run entirely on your local machine without any server infrastructure.

> **📝 Managing Employee Data:** See **[EMPLOYEE_DATA_GUIDE.md](./EMPLOYEE_DATA_GUIDE.md)** for detailed instructions on where to store employee information and **[EMPLOYEE_TEMPLATE.md](./EMPLOYEE_TEMPLATE.md)** for ready-to-use templates.

## Quick Start - Local Development

```bash
# Install dependencies (one-time)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Test production build
npm run preview
```

## Running Locally Without Installation

After building the application:

1. Navigate to the `dist` folder
2. Start any HTTP server in that directory

Using Python:
```bash
cd dist
python3 -m http.server 3000
```

Using Node.js:
```bash
npx http-server dist -p 3000
```

Then open `http://localhost:3000` in your browser.

## GitHub Pages Deployment

### Automated Deployment

Create `.github/workflows/static-deploy.yml`:

```yaml
name: Deploy Static Site

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages-deploy'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Save and wait for deployment

## Netlify Deployment

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

Then either:
- Connect your GitHub repository to Netlify
- Or drag the `dist` folder to Netlify's deploy page

## Vercel Deployment

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

Connect repository or use Vercel CLI:
```bash
npx vercel --prod
```

## Data Management

All employee data is stored in the browser's local storage:
- Employee profiles
- Leave requests
- Email notifications
- Settings

### Backup Data

Export your data regularly using the "Export" feature in the application.

### Transfer Data

1. Export data from source browser
2. Import data in target browser
3. Or share the exported JSON file with team members

## Security Notes

- All data remains in the user's browser
- No external database or API calls for data storage
- Use HTTPS when hosting (free with GitHub Pages, Netlify, Vercel)
- Regular browser data backups recommended

## Troubleshooting

**Issue**: Blank page after deployment
**Solution**: Check browser console for errors. Ensure base path is set correctly in Vite config.

**Issue**: Features not working
**Solution**: Must be served via HTTP/HTTPS protocol, not file:// protocol.

**Issue**: Data lost after browser clear
**Solution**: Use Export feature regularly to backup your data.

## Custom Domain Setup

### GitHub Pages
1. Add CNAME file to `public/` folder with your domain
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repository settings

### Netlify/Vercel
1. Add domain in dashboard
2. Update DNS records as instructed
3. HTTPS configured automatically

## Performance Optimization

The build process automatically:
- Minifies JavaScript and CSS
- Optimizes images
- Splits code for faster loading
- Generates cache-friendly filenames

Expected load times:
- First visit: < 2 seconds
- Subsequent visits: < 500ms (cached)

## Support

For issues or questions:
1. Check the application's README
2. Review browser console for errors
3. Ensure using a modern browser (Chrome, Firefox, Safari, Edge)
