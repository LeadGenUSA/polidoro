# Fix SEO issues found by Encited on bigcityplumbing.com

Encited checked 46 pages. Fixes in priority order:

## 1. Critical: every page is hidden from Google (46 pages)
Every page has a "do not index" tag on bigcityplumbing.com because the site only counts www.bigcityplumbing.com as the real address.
- Treat both `bigcityplumbing.com` and `www.bigcityplumbing.com` as the real site.
- Keep the block on Admin Login, Admin, and Lovable preview addresses.
- Canonical links stay on `https://www.bigcityplumbing.com/...`.

## 2. Duplicate title, description, and photo text: `/` and `/big-city-plumbing-heating`
The old address redirects to the home page in the browser, so Google sees a copy of the home page.
- Remove the old address from the sitemap if it's listed there.
- Fill in missing or weak alt text on home page images (logos, slideshow, certifications).

## 3. Skipped heading levels (9 pages: Blog, How-To Videos, Privacy Policy, Projects Gallery, Reviews, and others)
- Change headings so they go in order (H1, then H2, then H3) without changing how they look.

## 4. Pages with little text: Free Estimate and Work Order
- Add a short intro paragraph above each form. Admin Login is left as is.

## 5. Few internal links: Customer Survey and Work Order
- Add footer links to both pages.

## Technical details
- `src/components/SEO.tsx`: use an allowed-hostnames list instead of the single `CANONICAL_HOSTNAME`.
- `public/sitemap.xml`: remove `/big-city-plumbing-heating*` entries.
- Fix headings in the affected pages; fix alt text in Hero/slideshow/Certifications; add copy to the FreeEstimate/WorkOrder pages; add links in `Footer.tsx`.
- Once this is published, run a new Encited audit to check the fixes.
