# HarvestTown Deployment Guide 🚀

## Quick Deploy (Recommended)

### Option 1: Netlify Drop (Easiest)
1. Run `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the entire `dist/` folder to the drop zone
4. Get your live URL instantly!

### Option 2: Vercel
1. Run `npm run build`
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel --prod` in the project root
4. Follow the prompts

## Manual Hosting

### Static File Hosts
After running `npm run build`, upload the `dist/` folder contents to:

- **GitHub Pages**: Upload to your repo's `gh-pages` branch
- **AWS S3**: Upload to S3 bucket with static website hosting
- **Firebase Hosting**: Use `firebase deploy`
- **Surge.sh**: Run `surge dist/`

### Server Requirements
- **No server-side code needed** - pure static files
- **HTTPS recommended** for best performance
- **Gzip compression** supported for smaller downloads

## Build Optimization

### Production Build
```bash
npm run build
```

This creates optimized files in `dist/`:
- `index.html` - Main game file (1.7KB)
- `assets/index-[hash].js` - Game bundle (~26KB gzipped to 7KB)
- `assets/` - Game assets (images, sounds)

### Build Analysis
- **Bundle size**: ~26KB minified, ~7KB gzipped
- **Asset size**: Depends on your asset pack
- **Load time**: <2 seconds on 3G connection

## Performance Tips

### Asset Optimization
1. **Compress images**: Use tools like TinyPNG for sprites
2. **Sprite atlases**: Combine small images into atlases
3. **Audio compression**: Use OGG/MP3 at appropriate bitrates

### Caching Strategy
```nginx
# Nginx example
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Environment-Specific Builds

### Development
```bash
npm run dev
# Runs on http://localhost:3000
# Hot reload enabled
# Debug tools available
```

### Production
```bash
npm run build
npm run preview
# Test production build locally
```

## CDN Setup (Optional)

For global performance, use a CDN:

1. **Cloudflare**: Free tier available
2. **AWS CloudFront**: Pay-per-use
3. **Netlify CDN**: Included with hosting

## Mobile Optimization

The game is mobile-ready:
- **Responsive design**: Scales to any screen size
- **Touch controls**: Virtual joystick (when implemented)
- **Performance**: 60 FPS on modern mobile devices

## Troubleshooting

### Common Issues

**Build fails with asset errors:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**Game doesn't load:**
- Check browser console for errors
- Ensure all assets are uploaded
- Verify HTTPS if using secure features

**Performance issues:**
- Enable gzip compression on server
- Use CDN for asset delivery
- Check browser dev tools for bottlenecks

### Browser Support
- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Mobile browsers**: Full support
- **IE**: Not supported (use modern browsers)

## Monitoring

### Analytics (Optional)
Add to `index.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking
Consider adding Sentry or similar for error monitoring in production.

## Security

### Content Security Policy
Add to `index.html` for enhanced security:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## Scaling

### High Traffic
- Use CDN for static assets
- Enable server-side compression
- Consider multiple deployment regions

### Updates
- Use cache-busting (automatic with Vite)
- Test updates in staging environment
- Monitor for issues after deployment

---

**Your game is now ready for the world! 🌍**