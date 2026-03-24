

## Fix GTM Not Detected on Pages

### Problem
GTM is currently injected dynamically via React only after cookie consent. When GTM's site scanner crawls your pages, it doesn't execute JavaScript or accept cookies, so it never sees the GTM script. This is why it reports the tag is missing on all pages.

### Solution
Install GTM the standard way — directly in `index.html` — so the script is present in the raw HTML on every page load. Then use GTM's built-in **Consent Mode** to control whether tags actually fire before consent is granted, rather than blocking the entire GTM container.

### Changes

#### 1. `index.html`
Add the standard GTM snippets:
- **Head**: Add the GTM `<script>` block with default consent set to `denied` (so no tracking fires until consent is granted)
- **Body**: Add the `<noscript>` iframe fallback right after `<body>`

```html
<head>
  ...
  <!-- Google Tag Manager with default consent denied -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied'
    });
  </script>
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-T3JB92H5');</script>
</head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T3JB92H5"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <div id="root"></div>
  ...
</body>
```

#### 2. `src/components/GoogleTagManager.tsx`
Simplify to only handle consent updates and pageview tracking (no more script injection):
- Remove `loadGTM` / script injection logic (already in `index.html`)
- Remove noscript injection logic (already in `index.html`)
- On cookie consent accepted: call `gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' })`
- Continue pushing `pageview` events to `dataLayer` on route changes
- Keep admin route exclusion for pageview events only (GTM loads everywhere but admin pageviews aren't tracked)

#### 3. `src/components/CookieConsent.tsx`
No changes needed — it already dispatches the `cookie-consent-updated` event.

### How It Works
- GTM loads on every page immediately (scanner will detect it)
- Consent Mode starts with `denied` — no analytics or ad cookies fire
- When user accepts cookies, consent is updated to `granted` and tags begin firing
- This is Google's recommended approach and fully GDPR-compliant

### GTM Dashboard Action (no code)
In your GTM container, enable **Consent Mode** on your GA4 tag so it respects the consent signals. Most GA4 tags do this automatically when Consent Mode is active.

