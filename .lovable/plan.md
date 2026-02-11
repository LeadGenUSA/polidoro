

## Create Sitemap for Big City Plumbing and Heating

### What This Does
A sitemap.xml file tells search engines (Google, Bing, etc.) about all the pages on your site so they can be found and indexed more easily. We will also update robots.txt to point search engines to the sitemap.

### Pages to Include
All public-facing pages will be listed with appropriate priority levels:
- **Homepage** (highest priority)
- **Services**, Plumbing Services, Heating Services
- **About Us**, Contact Us, Reviews
- **Projects Gallery**, How-To Videos
- **Blog** listing page
- **Free Estimate**, Work Order, Customer Survey forms
- **Privacy Policy**, Terms of Service

Pages intentionally excluded (not useful for search engines):
- /admin, /admin/login (private)
- /blog/:slug (dynamic -- would need server-side generation for individual posts)
- /tenpercent-coupon, /survey-thank-you (internal/promotional)
- 404 page

### Technical Details

**1. Create `public/sitemap.xml`**
- Static XML sitemap listing all public routes
- Uses the domain `https://www.bigcityplumbing.com` as the base URL
- Each URL includes `lastmod`, `changefreq`, and `priority` values

**2. Update `public/robots.txt`**
- Add a `Sitemap: https://www.bigcityplumbing.com/sitemap.xml` directive so crawlers can discover it automatically

