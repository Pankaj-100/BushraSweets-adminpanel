# Deployment Guide - Bano's Sweet Delights

This guide covers various deployment options for the static website.

## 🚀 Quick Deploy Options

### Netlify (Recommended)
1. Fork/clone the repository
2. Connect your GitHub account to Netlify
3. Create new site from Git
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy automatically on every push

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts to deploy
4. Automatic deployments on Git push

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to GitHub Actions
3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Traditional Web Hosting
1. Build the project: `npm run build`
2. Upload `dist/` folder contents to your web server
3. Configure server to serve `index.html` for all routes

## 🔧 Build Configuration

### Environment Variables
No environment variables required - fully static build.

### Build Output
- Build command: `npm run build`
- Output directory: `dist/`
- SPA routing: Ensure server redirects all routes to `index.html`

## 📱 Domain Setup

### Custom Domain (Netlify)
1. Add custom domain in site settings
2. Configure DNS:
   - A record: `185.199.108.153`
   - CNAME: `www` → `your-site.netlify.app`
3. Enable HTTPS (automatic)

### Custom Domain (Vercel)
1. Add domain in project settings
2. Configure DNS:
   - A record: `76.76.19.61`
   - CNAME: `www` → `cname.vercel-dns.com`

## 🔒 Security Headers

Add these headers for enhanced security:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com
```

## 📊 Performance Optimization

### Image Optimization
- All images are served from Unsplash CDN
- Consider implementing lazy loading for better performance
- Uploaded images are stored as base64 (consider external storage for production)

### Caching Strategy
- Static assets: Cache for 1 year
- HTML: Cache for 1 hour
- Service worker for offline functionality (optional)

## 🔍 SEO Setup

### Meta Tags
Update `index.html` with:
```html
<meta name="description" content="Authentic South Asian desserts by Chef Bano. Traditional sweets like Kheer, Sheer Khorma, and Kulfi made with love.">
<meta name="keywords" content="south asian desserts, traditional sweets, kheer, kulfi, sheer khorma">
<meta property="og:title" content="Bano's Sweet Delights - Authentic South Asian Desserts">
<meta property="og:description" content="Experience traditional flavors with our handcrafted desserts">
<meta property="og:image" content="https://your-domain.com/og-image.jpg">
```

### Sitemap
Generate sitemap.xml with main pages:
- /
- /desserts
- /about
- /serving-ideas
- /contact

## 📈 Analytics

### Google Analytics
Add tracking code to `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🛠 Monitoring

### Status Monitoring
- Uptime monitoring via Pingdom, UptimeRobot, or StatusCake
- Performance monitoring via Google PageSpeed Insights
- Error tracking via Sentry (optional)

## 🔄 Updates

### Content Updates
- Use admin panel to update content
- Data persists in localStorage
- No deployment needed for content changes

### Code Updates
1. Make changes to codebase
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Deploy via Git push (automatic) or manual upload

## 📞 Support

For deployment issues:
- Check build logs for errors
- Ensure all dependencies are installed
- Verify Node.js version compatibility (16+ recommended)
- Contact hosting provider support if needed

---

*Happy deploying! 🎉*