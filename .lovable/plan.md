

## Install Google Tag Manager and Migrate GA4 Into It

### What Changes
Replace the direct GA4 (`gtag.js`) script with Google Tag Manager (GTM). GA4 will then be configured as a tag *inside* GTM's web dashboard, not in code. This also lets you add Meta Pixel, Google Ads conversions, remarketing tags, and any other tracking from the GTM dashboard without future code changes.

### Prerequisites
You need a GTM Container ID (format: `GTM-XXXXXXX`). Create one at [tagmanager.google.com](https://tagmanager.google.com) if you don't have one yet. Inside GTM, add a "Google Analytics: GA4 Configuration" tag with your measurement ID `G-KXRSCVDJY5` and set it to fire on "All Pages".

### File Changes

**Rename `src/components/GoogleAnalytics.tsx` → `src/components/GoogleTagManager.tsx`**
- Replace the gtag.js script injection with the standard GTM snippet (`googletagmanager.com/gtm.js?id=GTM_ID`)
- Keep the same consent-first logic: only inject the GTM script when `cookie-consent` is `accepted`
- Keep admin route exclusion
- Push a `pageview` event to `dataLayer` on each route change so GTM can pick it up
- Add a `<noscript>` iframe fallback via a portal to `document.body`

**Update `src/App.tsx`**
- Change the import from `GoogleAnalytics` to `GoogleTagManager`

**Update `index.html`**
- No changes needed — the script is injected dynamically

### GTM Container ID
The GTM container ID will be stored as a constant in the component. Since it's a public/publishable ID (visible in page source on any site using GTM), it's safe to keep in code.

### What You Configure in GTM Dashboard (no code needed)
- GA4 Configuration tag with `G-KXRSCVDJY5`
- Any future tags: Meta Pixel, Google Ads, Hotjar, etc.
- Consent mode integration if desired

