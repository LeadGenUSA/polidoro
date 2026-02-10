

## Add Cookie Consent Banner

### What Changes
A cookie consent banner will appear at the bottom of the page on first visit. Google Analytics will **only** load after the user accepts cookies. The user's choice is saved to `localStorage` so the banner doesn't reappear.

### Behavior
- On first visit, a banner appears at the bottom with "Accept" and "Decline" buttons
- If accepted: Google Analytics loads and tracks normally; choice saved
- If declined: Google Analytics never loads; choice saved
- On return visits: no banner shown, saved preference is respected
- Admin pages: no banner or tracking (existing behavior preserved)

### Technical Details

**New file: `src/components/CookieConsent.tsx`**
- Renders a fixed bottom banner with brief text about cookies, a link to the Privacy Policy, and Accept/Decline buttons
- Reads/writes `cookie-consent` key in `localStorage` (`"accepted"`, `"declined"`, or absent)
- Styled with Tailwind to match the site's design (dark background, white text, secondary-colored Accept button)

**Modified file: `src/components/GoogleAnalytics.tsx`**
- Check `localStorage` for `cookie-consent` value
- Listen for a custom `window` event (`cookie-consent-updated`) so it reacts immediately when user clicks Accept
- Only load the gtag script and send page views if consent is `"accepted"`

**Modified file: `src/App.tsx`**
- Import and render `<CookieConsent />` alongside `<GoogleAnalytics />`

No new dependencies or database changes needed.

