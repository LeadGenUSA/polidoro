

# Redirect Old URLs to New Pages

## Overview
Add client-side redirects so visitors arriving from old URLs (bookmarks, search engine results, external links) are automatically sent to the correct new page.

## Redirect Mapping

| Old URL | New URL |
|---------|---------|
| `/authorized-navien-dealer/` | `/heating-services` |
| `/big-city-plumbing-heating/` | `/` |
| `/big-city-plumbing-heating/navien-group1/` | `/heating-services` |
| `/stay-warm-with-a-complete-boiler-checkup/boilers2/` | `/heating-services` |
| `/stay-warm-with-a-complete-boiler-checkup/` | `/heating-services` |
| `/plumbing-repair-service-and-installations/` | `/plumbing-services` |
| `/who-we-are/` | `/about-us` |
| `/estimate-form/` | `/free-estimate` |

## Implementation

**File:** `src/App.tsx`

- Import `Navigate` from `react-router-dom`
- Add 8 redirect routes above the catch-all `*` route, each using `<Navigate to="/new-path" replace />` for an instant client-side redirect

This approach keeps redirects in one place alongside all other routes, uses the existing router, and the `replace` prop ensures the old URL doesn't stay in browser history.

## Technical Details

```text
Route definition pattern:
<Route path="/old-url" element={<Navigate to="/new-url" replace />} />
```

- Trailing slashes are handled automatically by React Router
- No new files or dependencies needed
- No backend changes required

