
## Goal

Add the provided Tawk.to live chat script so it loads on every public page, but not on:

- `/blog`
- `/blog/:slug`
- `/admin`
- `/admin/login`

## Recommended implementation

### 1. Create a dedicated chat embed component
Add a small reusable component, e.g. `src/components/LiveChatEmbed.tsx`, that:

- uses `useLocation()` to read the current route
- returns `null` on excluded routes:
  - any path starting with `/blog`
  - any path starting with `/admin`
- injects the Tawk script with `react-helmet-async` so it ends up near the end of `<body>` rather than hardcoded in `index.html`
- includes a cleanup effect to remove the injected script when navigating from a public page to an excluded page

This keeps the integration route-aware and avoids putting the script on admin or blog pages.

### 2. Mount it once at the app shell level
Update `src/App.tsx` to render the new embed component inside `<BrowserRouter>` so it applies globally across the site.

Best placement:
- alongside other global components like `GoogleTagManager` and `CookieConsent`
- outside `<Routes>` so it evaluates on every route change

### 3. Route behavior
The component should load chat on all public pages except the excluded ones.

```text
Load chat:
/
services
plumbing-services
heating-services
how-to-videos
reviews
about-us
work-order
customer-survey
free-estimate
projects-gallery
privacy-policy
terms-of-service
tenpercent-coupon
survey-thank-you
contact-us
financing
sitemap
404/public unknown routes

Do not load chat:
/blog
/blog/:slug
/admin
/admin/login
/admin/*
```

Using `startsWith('/blog')` and `startsWith('/admin')` will cover the current routes and future nested routes safely.

### 4. Script handling details
Use your exact Tawk snippet, but inject it in a React-safe way:

- append the external script URL `https://embed.tawk.to/69e9175ecc1adc1c3390106b/1jmr86i45`
- preserve:
  - `async`
  - `charset="UTF-8"`
  - `crossorigin="*"`
- initialize `Tawk_API` and `Tawk_LoadStart`

To avoid duplicate embeds during client-side navigation:
- check whether the Tawk script is already present before adding it
- remove it and any Tawk widget container elements when leaving eligible routes

### 5. Consent/privacy consideration
The site memory says tracking/scripts follow a consent-first approach. Live chat is not analytics, but it is still a third-party embed.

Recommended handling:
- keep this chat separate from Google tracking logic
- if you want strict consent gating, a follow-up enhancement can make chat load only after cookie acceptance
- otherwise, load it immediately on eligible public pages as requested

### 6. Files to change
- `src/App.tsx` — mount the global live chat component
- `src/components/LiveChatEmbed.tsx` — new route-aware Tawk embed

## Technical details

### Component shape
The new component should roughly:

- import `useEffect` and `useLocation`
- compute:
  - `const isExcluded = location.pathname.startsWith('/blog') || location.pathname.startsWith('/admin')`
- if excluded:
  - remove existing Tawk script/widget if present
  - return `null`
- if allowed:
  - inject the script once
  - set up cleanup for route changes/unmount

### Why this approach
This is better than editing `index.html` directly because:

- `index.html` would load Tawk on every route with no route exceptions
- the app is a SPA, so route-aware logic belongs in React
- it matches the existing global-component pattern used for cookie consent and tag manager

## Expected outcome

After implementation:

- Tawk chat appears site-wide on public pages
- it does not appear on blog pages
- it does not appear anywhere in admin
- it survives normal SPA navigation without duplicate widget injection
