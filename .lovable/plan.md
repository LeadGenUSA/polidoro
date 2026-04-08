

## Fix Favicon Showing Lovable Icon in Search Results

### Root Cause
There are two issues:
1. **`public/favicon.ico` contains the Lovable icon** — browsers and crawlers fetch `/favicon.ico` automatically by default, ignoring the `<link>` tag pointing to `favicon.png`
2. **Missing icon declarations** — Google Search prefers icons declared via `apple-touch-icon` and/or a web manifest with 192×192px+ icons. Without these, it may pick up the wrong icon.

### Changes

#### 1. Replace `favicon.ico` with your actual logo
- Delete the existing `public/favicon.ico` (which has the Lovable icon)
- Generate a proper `.ico` from your `favicon.png` using an image conversion script
- This ensures any browser or crawler requesting `/favicon.ico` gets your logo

#### 2. Generate sized icon variants from `favicon.png`
- Create `apple-touch-icon.png` (180×180)
- Create `favicon-192.png` (192×192) — the minimum size Google requires
- Create `favicon-32.png` and `favicon-16.png` for browser tabs

#### 3. Update `index.html` with proper icon declarations
Add these tags to `<head>`:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
```

Remove the old single `<link rel="icon" href="/favicon.png">` line (638KB is far too large for a favicon).

#### 4. After publishing
Google caches favicons aggressively. After deploying, it may take days to weeks for the updated icon to appear in search results. You can request re-indexing via Google Search Console to speed this up.

