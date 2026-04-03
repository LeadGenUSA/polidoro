

## Install Google Ads Tag (AW-17977213592)

### Problem
The Google Ads tag is not installed anywhere in the codebase. Google Ads scanner (like GTM's scanner) needs to see the `gtag.js` snippet directly in the HTML to detect it.

### Recommended Approach
Since you already have GTM installed, the **best practice** is to add the Google Ads tag **inside your GTM container** (via the GTM dashboard) rather than hardcoding another script. However, Google Ads' tag detection scanner often doesn't recognize tags loaded through GTM — it specifically looks for the `gtag.js` snippet in the page source.

To satisfy the scanner **and** respect your existing Consent Mode setup, we'll add the Google Ads `gtag('config')` call directly in `index.html` alongside the existing consent defaults.

### Changes

#### `index.html`
After the existing consent default script block and before the GTM script, add:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17977213592"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('config', 'AW-17977213592');
</script>
```

This will:
- Be detected by the Google Ads scanner immediately
- Automatically respect the Consent Mode defaults (`denied`) already set above it
- Start firing conversion data once consent is granted via the cookie banner

No other files need changes — the existing `GoogleTagManager.tsx` consent update logic already calls `gtag('consent', 'update', ...)` which applies to all gtag-based tags on the page.

