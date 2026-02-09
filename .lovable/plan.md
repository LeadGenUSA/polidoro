

# Add Google Analytics to All Public Pages

## Overview
Add the Google Analytics tracking snippet (G-KXRSCVDJY5) to the site, but exclude it from admin pages (`/admin` and `/admin/login`).

## Approach

Since this is a single-page app with one `index.html`, inserting the script there would track admin pages too. Instead, we'll use a React component approach:

### 1. Create `src/components/GoogleAnalytics.tsx`
- A component that injects the gtag.js scripts on mount
- Uses `useLocation()` from React Router to check the current path
- If the path starts with `/admin`, it does nothing (no scripts injected, no tracking)
- On route changes to non-admin pages, sends a `page_view` event

### 2. Update `src/App.tsx`
- Place the `<GoogleAnalytics />` component inside the `<BrowserRouter>` so it has access to the router context

## Technical Details

The component will:
- Load the gtag.js script dynamically via a `<script>` tag appended to `<head>` (only once, on first non-admin page visit)
- Call `gtag('config', 'G-KXRSCVDJY5', { page_path })` on each non-admin route change
- Skip all tracking logic when the path starts with `/admin`
- Clean up the script tag if unmounted

This keeps admin activity completely out of Google Analytics while tracking all public pages.

