

## Fix "Duplicate without user-selected canonical" in Google Search Console

### Problem
Google is finding pages at multiple URLs (likely the `polidoro.lovable.app` domain and `www.bigcityplumbing.com`) without a clear canonical signal on some of them.

### Changes

#### 1. Add canonical to all noIndex pages (4 files)
Even though these pages have `noIndex`, adding a canonical removes ambiguity for Google:

| File | Add canonical |
|------|--------------|
| `src/pages/CouponPage.tsx` | `canonical="/tenpercent-coupon"` |
| `src/pages/SurveyThankYouCoupon.tsx` | `canonical="/survey-thank-you"` |
| `src/pages/NotFound.tsx` | No canonical needed (dynamic URL) — already fine |
| `src/pages/AdminLogin.tsx` | `canonical="/admin/login"` |

#### 2. Add a `<meta name="robots" content="noindex">` to the Lovable subdomain
Since the `polidoro.lovable.app` domain serves the same content as `www.bigcityplumbing.com`, the SEOHead component should detect when it's running on a non-canonical domain and automatically inject `noindex`. This prevents Google from indexing the Lovable URL entirely.

**Change in `src/components/SEO.tsx`:**
- Add logic: if `window.location.hostname` does not match `www.bigcityplumbing.com`, force `noIndex = true` regardless of the prop value.
- This way, even if Google crawls `polidoro.lovable.app/services`, it gets a `noindex` directive plus a canonical pointing to the real domain.

#### 3. Ensure homepage canonical uses trailing-slash-free URL
Already correct (`canonical="/"`), no change needed.

### Files changed (4)
- `src/components/SEO.tsx` — add non-canonical domain detection
- `src/pages/CouponPage.tsx` — add canonical prop
- `src/pages/SurveyThankYouCoupon.tsx` — add canonical prop
- `src/pages/AdminLogin.tsx` — add canonical prop

### What to do after deployment
1. Wait for Google to re-crawl (or use "Request Indexing" in Search Console for key pages)
2. The `polidoro.lovable.app` pages will drop out of the index as Google sees `noindex` on them
3. The duplicate issue should resolve within 1-2 crawl cycles

