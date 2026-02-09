
# Add Coupon Graphic Next to "Excellent Service" Badge

## Overview
Add the uploaded "Click Here for Coupons" graphic as a floating, clickable element positioned to the right of the existing "Excellent Service" floating card beneath the hero slideshow. It will link to the `/tenpercent-coupon` page.

## Changes

### 1. Copy the uploaded image to project assets
- Copy `user-uploads://coupons_SRC.png` to `src/assets/coupons-badge.png`

### 2. Update `src/components/Hero.tsx`
- Import the new coupon badge image
- Modify the floating card area (currently a single `div` below the slideshow) to become a flex row containing:
  - The existing "Excellent Service" card (left)
  - The new coupon graphic wrapped in a `Link` to `/tenpercent-coupon` (right), styled with the same `animate-float` animation and shadow treatment for visual consistency
- The coupon image will be sized to approximately match the height of the "Excellent Service" card for a balanced layout

## Technical Details

The current floating card markup:
```text
<div className="mt-6 bg-card p-4 rounded-2xl shadow-large animate-float inline-block">
  ...Excellent Service content...
</div>
```

Will become a flex container:
```text
<div className="mt-6 flex items-center gap-4 flex-wrap">
  <div className="bg-card p-4 rounded-2xl shadow-large animate-float inline-block">
    ...Excellent Service content (unchanged)...
  </div>
  <Link to="/tenpercent-coupon">
    <img src={couponBadge} alt="Click here for coupons"
         className="h-20 w-auto animate-float animation-delay-200
                    hover:scale-105 transition-transform
                    drop-shadow-lg" />
  </Link>
</div>
```

This keeps the existing card intact while adding the coupon graphic beside it with a matching float animation (slightly delayed for visual interest).
