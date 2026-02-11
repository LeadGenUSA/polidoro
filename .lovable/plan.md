

## Add Per-Page SEO Meta Tags with React Helmet

### What This Does
Right now, every page on the site shares the same generic title and description from `index.html`. Search engines see the same metadata for every page, which hurts rankings. By adding React Helmet, each page will have its own unique title, description, and canonical URL -- making Google and other search engines treat each page as distinct, relevant content.

### Overview of Changes

**1. Install `react-helmet-async`** (the modern, maintained version of React Helmet)

**2. Wrap the app in a Helmet provider** (`src/App.tsx`)
- Add `HelmetProvider` around the app so all pages can set their own meta tags

**3. Update `index.html`**
- Fix the generic placeholders (description, og:title, og:description, author) to use Big City Plumbing defaults
- These serve as fallbacks when a page doesn't set its own tags

**4. Create a reusable `SEO` component** (`src/components/SEO.tsx`)
- Accepts `title`, `description`, and `path` props
- Renders `<Helmet>` with title, meta description, canonical URL, Open Graph, and Twitter tags
- Base domain: `https://www.bigcityplumbing.com`

**5. Add the SEO component to every public page** (15 pages total)

| Page | Title | Description (summary) |
|------|-------|-----------------------|
| **Home** | Big City Plumbing and Heating - Licensed Plumbers, Long Island and NYC | Licensed plumbing and heating services... |
| **Services** | Our Services - Big City Plumbing and Heating | Full range of plumbing and heating services... |
| **Plumbing Services** | Plumbing Services - Big City Plumbing and Heating | Expert residential and commercial plumbing... |
| **Heating Services** | Heating Services - Big City Plumbing and Heating | Boiler repair, radiant heat, oil to gas conversions... |
| **About Us** | About Us - Big City Plumbing and Heating | Family-owned plumbing and heating company... |
| **Contact Us** | Contact Us - Big City Plumbing and Heating | Get in touch for plumbing and heating services... |
| **Reviews** | Customer Reviews - Big City Plumbing and Heating | Read reviews from satisfied customers... |
| **Projects Gallery** | Projects Gallery - Big City Plumbing and Heating | View our completed plumbing and heating projects... |
| **How-To Videos** | How-To Videos - Big City Plumbing and Heating | Helpful plumbing and heating video guides... |
| **Blog** | Blog - Big City Plumbing and Heating | Expert plumbing and heating tips and advice... |
| **Blog Post** (dynamic) | [Post Title] - Big City Plumbing and Heating | Uses post's meta_description |
| **Free Estimate** | Free Estimate - Big City Plumbing and Heating | Request a free plumbing or heating estimate... |
| **Work Order** | Work Order - Big City Plumbing and Heating | Submit a work order for service... |
| **Customer Survey** | Customer Survey - Big City Plumbing and Heating | Share your feedback about our service... |
| **Privacy Policy** | Privacy Policy - Big City Plumbing and Heating | How we collect and protect your information... |
| **Terms of Service** | Terms of Service - Big City Plumbing and Heating | Terms and conditions for our services... |

Pages **not** receiving SEO tags (internal/admin): Admin, AdminLogin, CouponPage, SurveyThankYouCoupon, NotFound.

### Technical Details

**SEO component pattern:**
```tsx
// src/components/SEO.tsx
<Helmet>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={`https://www.bigcityplumbing.com${path}`} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={`https://www.bigcityplumbing.com${path}`} />
  <meta property="og:type" content="website" />
</Helmet>
```

**Usage in each page:**
```tsx
<SEO
  title="Heating Services - Big City Plumbing and Heating"
  description="Boiler repair, radiant heat installation, oil to gas conversions..."
  path="/heating-services"
/>
```

**Files modified:** `index.html`, `src/App.tsx`, + 15 page files
**Files created:** `src/components/SEO.tsx`
**New dependency:** `react-helmet-async`
