# Let Google index bigcityplumbing.com (except Admin Login)

## Problem
The site tells search engines "don't index me" whenever the address isn't exactly `www.bigcityplumbing.com`. Visitors and Google reaching `bigcityplumbing.com` (without www) see that block on every page.

## Change
- Treat both `bigcityplumbing.com` and `www.bigcityplumbing.com` as the real site, so no block is added there.
- Keep the block on Lovable preview/staging addresses (unchanged rule).
- Admin Login and Admin Dashboard keep their block, so they stay out of Google.
- Canonical links still point to `https://www.bigcityplumbing.com/...`, so Google treats both addresses as one site.

## Technical details
- `src/components/SEO.tsx`: replace the single `CANONICAL_HOSTNAME` check with an allowed list `['www.bigcityplumbing.com', 'bigcityplumbing.com']`.
- `AdminLogin.tsx` / `Admin.tsx` already pass `noIndex`; no change.
- Takes effect on the live site after the next publish; then use Rescan in the SEO tab.
