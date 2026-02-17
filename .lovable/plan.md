

# Update "Financing Available" Floating Box

## Changes

**File: `src/components/Hero.tsx`**

1. Remove the NaviLend logo image from the "Financing Available" floating box
2. The box is already positioned to the right of the coupon badge, so no layout changes needed
3. Remove the unused `navilendLogo` import since it's no longer used anywhere

The box will keep the same styling (`bg-card`, `rounded-2xl`, `shadow-large`, `animate-float`) but only contain the "Financing Available" text.

