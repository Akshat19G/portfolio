# Deployment Guide

This guide covers deploying your AI Engineer Portfolio to various platforms.

## Pre-Deployment Checklist

Before deploying, ensure you've completed:

- ✅ EmailJS configuration (see EMAILJS_SETUP.md)
- ✅ All personal information updated (see CUSTOMIZATION_CHECKLIST.md)
- ✅ Resume PDF added to /public directory
- ✅ All external links tested
- ✅ Contact form tested locally
- ✅ No console errors in browser

## Platform-Specific Guides

### 1. Vercel (Recommended)

Vercel offers the best experience for React/Vite projects.

#### Steps:

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy via GitHub** (recommended)
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration
   - Click "Deploy"

3. **Deploy via CLI**
   ```bash
   vercel
   ```

#### Configuration:
No additional configuration needed. Vercel automatically detects Vite.

#### Custom Domain:
- Go to your project settings in Vercel
- Navigate to "Domains"
- Add your custom domain
- Update DNS records as instructed

---

### 2. Netlify

Another excellent option for static sites.

#### Steps:

1. **Deploy via GitHub**
   - Push code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your repository
   - Build settings (auto-detected):
     - Build command: Leave empty (uses package.json)
     - Publish directory: `dist`
   - Click "Deploy"

2. **Deploy via Drag & Drop**
   - Build locally: `vite build` (if you have local vite, otherwise skip)
   - Drag the `dist` folder to Netlify

#### Configuration (netlify.toml):
Create `netlify.toml` in root:
```toml
[build]
  command = "pnpm install && pnpm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. GitHub Pages

Free hosting directly from your GitHub repository.

#### Steps:

1. **Install gh-pages**
   ```bash
   pnpm add -D gh-pages
   ```

2. **Update package.json**
   Add to scripts:
   ```json
   {
     "scripts": {
       "predeploy": "pnpm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

   Add homepage field:
   ```json
   {
     "homepage": "https://your-username.github.io/repository-name"
   }
   ```

3. **Deploy**
   ```bash
   pnpm run deploy
   ```

4. **Configure GitHub**
   - Go to repository Settings → Pages
   - Source: gh-pages branch
   - Save

#### Note for Vite:
Update `vite.config.ts` to include base path:
```typescript
export default defineConfig({
  base: '/repository-name/',
  // ... other config
});
```

---

### 4. AWS Amplify

Enterprise-grade hosting with AWS infrastructure.

#### Steps:

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: Auto-detected
   - Output directory: `dist`
5. Deploy

---

### 5. Firebase Hosting

Google's hosting platform with global CDN.

#### Steps:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```
   - Choose existing project or create new
   - Public directory: `dist`
   - Single-page app: Yes
   - GitHub integration: Optional

4. **Build and Deploy**
   ```bash
   pnpm run build
   firebase deploy
   ```

---

## Environment Variables

If you're using environment variables for EmailJS (recommended):

1. **Create `.env` file** (local only, don't commit):
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

2. **Update Contact.tsx** to use env variables:
   ```typescript
   await emailjs.send(
     import.meta.env.VITE_EMAILJS_SERVICE_ID,
     import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
     templateParams,
     import.meta.env.VITE_EMAILJS_PUBLIC_KEY
   );
   ```

3. **Add to platform**:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Environment Variables
   - **Others**: Check platform documentation

---

## Performance Optimization

Before deploying:

1. **Optimize Images**
   - Compress images using tools like TinyPNG
   - Use WebP format where possible
   - Add loading="lazy" to images

2. **Code Splitting**
   - Already implemented via dynamic imports
   - Vite handles this automatically

3. **Build for Production**
   - Minification enabled by default
   - Tree-shaking enabled
   - CSS optimization included

---

## Post-Deployment

After deploying:

1. **Test Everything**
   - Navigate through all sections
   - Test contact form
   - Test all external links
   - Check mobile responsiveness
   - Test in different browsers

2. **Performance Audit**
   - Run Google Lighthouse
   - Check Core Web Vitals
   - Optimize based on results

3. **SEO Setup**
   - Add sitemap.xml
   - Add robots.txt
   - Submit to Google Search Console
   - Add analytics (Google Analytics, etc.)

4. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor EmailJS quota usage
   - Set up uptime monitoring

---

## Custom Domain

### Vercel:
1. Project Settings → Domains
2. Add domain
3. Update DNS records at your registrar:
   - Type: A, Value: 76.76.21.21
   - Type: CNAME, Value: cname.vercel-dns.com

### Netlify:
1. Site Settings → Domain Management
2. Add custom domain
3. Update DNS records at your registrar:
   - Type: A, Value: 75.2.60.5
   - Type: CNAME, Value: your-site.netlify.app

---

## SSL Certificate

All major platforms (Vercel, Netlify, AWS Amplify) provide free SSL certificates automatically via Let's Encrypt.

---

## Troubleshooting

### Build Fails
- Check Node.js version (use v18+ recommended)
- Clear cache: `pnpm store prune`
- Delete node_modules and reinstall: `rm -rf node_modules && pnpm install`

### Contact Form Not Working
- Verify EmailJS credentials
- Check CORS settings in EmailJS dashboard
- Test EmailJS independently
- Check browser console for errors

### Routing Issues
- Ensure proper redirects for SPA
- Check platform-specific SPA configuration
- Verify base path in vite.config.ts

### Assets Not Loading
- Check file paths (use relative paths)
- Verify assets are in /public directory
- Check base URL configuration

---

## Analytics Integration

### Google Analytics

1. Create GA4 property
2. Add tracking code to `index.html`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

---

## Best Practices

1. **Always test locally before deploying**
2. **Use environment variables for sensitive data**
3. **Enable HTTPS (handled automatically by platforms)**
4. **Set up custom domain for professional appearance**
5. **Monitor performance and errors**
6. **Keep dependencies updated**
7. **Implement CI/CD for automatic deployments**

---

## Support

For platform-specific issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- GitHub Pages: [pages.github.com](https://pages.github.com)

For portfolio issues:
- Check README.md
- Review CUSTOMIZATION_CHECKLIST.md
- Contact: srivastavaakshat1909@gmail.com
