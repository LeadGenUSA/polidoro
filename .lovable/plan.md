

## Update `public/sitemap.xml` with Published Blog Posts

### What Changes
Update the static `public/sitemap.xml` to include all 8 currently published blog posts alongside the existing static pages.

### Blog Posts to Add
Each as `https://www.bigcityplumbing.com/blog/:slug` with priority `0.6`, changefreq `monthly`, and `<lastmod>` from `published_at`:

1. `how-to-prevent-frozen-pipes-in-long-island-homes` (2026-02-09)
2. `authorized-navien-nss-dealer-installer-on-long-island` (2026-02-11)
3. `signs-your-boiler-needs-replacement-before-a-new-york-winter` (2026-02-12)
4. `emergency-heating-repair-cost-on-long-island` (2026-02-12)
5. `certified-rpz-backflow-installer-tester-in-long-island` (2026-02-12)
6. `regions-home-improvement-financing-a-complete-guide` (2026-02-25)
7. `why-is-my-boiler-not-heating-evenly-in-my-nassau-county-home` (2026-02-25)
8. `tankless-water-heater-installation-in-centereach-ny` (2026-03-07)

### Implementation
- **Single file edit**: Append 8 `<url>` entries to `public/sitemap.xml` before the closing `</urlset>` tag
- No other file changes needed

### Going Forward
Whenever you approve a new blog post, just ask me to update the sitemap and I'll add the new entry.

