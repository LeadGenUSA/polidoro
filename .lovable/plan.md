
## Remove Background Image from Financing Hero Section

### What's Changing

The hero section currently has two layers:
1. An `<img>` tag with the Regions branded banner (`regions-hero-banner.jpg`) absolutely positioned to fill the full section
2. A gradient overlay (`bg-gradient-to-r from-primary/90...`) on top of it

### Fix

In `src/pages/Financing.tsx`:

1. **Remove** the `<img src={regionsBanner} .../>` element (lines 51–55)
2. **Replace** the transparent gradient overlay with a solid `hero-gradient` background (same class used on other hero sections in the site), so the section still has a branded look without the background photo
3. **Remove** the now-unused `regionsBanner` import at the top of the file
4. **Remove** `relative overflow-hidden` layout helpers that were only needed to contain the absolute-positioned image — simplify the section's className

### File Changed

- **`src/pages/Financing.tsx`** only
