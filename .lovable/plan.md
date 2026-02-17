

# Fix Sitemap Page Title Overlapping Navbar

## Problem
The "Sitemap" heading in the hero section sits too high, causing it to underlap the fixed/sticky navbar logo.

## Solution
Add top padding to the hero section in `src/pages/Sitemap.tsx` to push the content below the navbar, matching the pattern used on other pages.

## Change
**File: `src/pages/Sitemap.tsx`** (line ~62)
- Change `py-16 md:py-20` to `pt-28 md:pt-32 pb-16 md:pb-20` on the hero section to account for the navbar height.

