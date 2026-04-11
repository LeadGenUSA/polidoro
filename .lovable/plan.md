## Unified SEO Meta Tags Across All Pages

### Task 1: Upgrade SEO component to SEOHead

Replace `src/components/SEO.tsx` with an enhanced `SEOHead` component that accepts: `title`, `description`, `canonical` (full URL or path), `ogImage`, `noIndex`, `schemaJson`. It will output `<title>`, `<meta description>`, `<link canonical>`, `<meta robots>` (when noIndex), all OG tags (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`), Twitter tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`), and optional JSON-LD script.

Default `ogImage` to `https://www.bigcityplumbing.com/favicon.png` (the existing logo).

### Task 2: Update all page imports

Replace `import SEO` with `import SEOHead` and update the component usage in all 18 pages. The prop mapping is straightforward (`path` becomes `canonical`, `jsonLd` becomes `schemaJson`).

### Task 3: Pages missing SEO — add SEOHead

These pages currently have **no SEO component** and need `<SEOHead noIndex />` added:


| Page                       | noIndex | Notes                                                                                  |
| -------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `CouponPage.tsx`           | Yes     | Promotional, should not be indexed                                                     |
| `SurveyThankYouCoupon.tsx` | Yes     | Already has manual noindex via useEffect — replace with SEOHead, should not be indexed |
| `NotFound.tsx`             | Yes     | 404 page, should not be indexed                                                        |
| `Admin.tsx`                | Yes     | Admin dashboard, should not be indexed                                                 |
| `AdminLogin.tsx`           | Yes     | Admin login, should not be indexed                                                     |


### Task 4: Clean up index.html

Remove from `<head>`:

- `<title>` tag (line 10)
- `<meta name="description">` (line 11)
- `<meta property="og:title">` (line 14)
- `<meta property="og:description">` (line 15)
- `<meta property="og:type">` (line 16)
- `<meta property="og:image">` (line 17)
- `<meta name="twitter:card">` (line 19)
- `<meta name="twitter:title">` (line 20)
- `<meta name="twitter:image">` (line 21)

**Keep**: `<meta charset>`, `<meta viewport>`, `<meta name="author">`, favicon `<link>` tags, GTM/Ads scripts, noscript iframe.

### Task 5: Remove manual meta manipulation

`SurveyThankYouCoupon.tsx` manually creates a `<meta name="robots">` via `useEffect` + DOM manipulation. This will be replaced by `<SEOHead noIndex />`.

### Files changed (22 total)

- `src/components/SEO.tsx` — rewritten as SEOHead
- `index.html` — remove title, description, OG, Twitter tags
- 15 existing pages — update import + component name + props
- 5 pages — add SEOHead (CouponPage)

### Warnings to include in summary

- `public/favicon.ico` (9.6 KB) — should be verified it contains the Big City logo, not the Lovable icon. Previously identified as potentially containing the Lovable icon.
- `public/favicon.png` (638 KB) — very large for an OG image; works but could be optimized.