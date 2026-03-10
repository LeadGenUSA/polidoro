

## Dynamic Sitemap via Edge Function

### Overview
Create a `generate-sitemap` edge function that dynamically builds and serves `sitemap.xml` by querying published blog posts and merging with static pages. Submit this URL directly to Google Search Console. Keep the static `public/sitemap.xml` as-is for direct visitors.

### Changes

| File | Change |
|------|--------|
| `supabase/functions/generate-sitemap/index.ts` | **New** — public endpoint returning XML sitemap |
| `public/robots.txt` | Update `Sitemap:` to point to edge function URL |
| `src/pages/Sitemap.tsx` | Add dynamic "Blog Posts" category |

### Edge Function Logic
- Uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to query `blog_posts` where `status = 'published'`, ordered by `published_at` desc
- Hardcodes the same 16 static page URLs currently in `public/sitemap.xml`
- For each blog post, generates a `<url>` entry using `/blog/{slug}` with `published_at` as `<lastmod>`
- Returns `Content-Type: application/xml` with CORS headers
- No JWT required — public endpoint

### robots.txt Update
```
Sitemap: https://wjaulyvqzywcnkegnzoh.supabase.co/functions/v1/generate-sitemap
```

### HTML Sitemap Update
- Fetch published blog posts on mount using the existing public Supabase client
- Render them as a new "Blog Posts" card in the grid alongside existing categories

### What Stays
- `public/sitemap.xml` remains untouched as a static fallback
- No database changes needed

