# Replace Site Logo

## Goal
Swap the current `big-city-plumbing-and-heating-logo-2.png` used across the site with the newly uploaded circular "Big City Plumbing 631-361-9500" logo.

## Steps
1. Upload the new file (`user-uploads://big-city-plumbing-logo-2.png`) as a Lovable Asset, writing the pointer to `src/assets/big-city-plumbing-and-heating-logo-2.png.asset.json`.
2. Delete the existing binary `src/assets/big-city-plumbing-and-heating-logo-2.png`.
3. Update the 4 files that import the logo to import the `.asset.json` pointer and use `logo.url` as the `<img>` src:
   - `src/components/Navbar.tsx`
   - `src/components/Footer.tsx`
   - `src/pages/CouponPage.tsx`
   - `src/pages/SurveyThankYouCoupon.tsx`
4. Verify with `bun run build` and a visual spot-check.

## Notes
- Sizing/rounded styling stays the same (`rounded-full object-cover`) — the new logo is already circular so it will fit cleanly.
- No favicon changes (favicon uses the separate Layer_9-2 asset).
