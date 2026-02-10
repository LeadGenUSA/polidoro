

## Fix Navilend Logo Overlapping Coupon Badge on iPad Portrait

### The Problem
The Navilend logo uses `absolute bottom-24 right-8` positioning, placing it in a fixed spot relative to the hero section. On iPad portrait (768-834px wide), the grid stacks into a single column, and the coupon badge (in the normal document flow below the slideshow) ends up in the same visual space as the absolutely-positioned Navilend logo.

### The Fix
Hide the Navilend logo on screens narrower than the `xl` breakpoint (1280px) since these devices use the stacked mobile layout where the absolute positioning causes overlap. The logo will only display on wide desktop viewports where the two-column grid layout provides enough separation.

### Technical Details

**Modified file: `src/components/Hero.tsx`**

Change the Navilend logo container's class from:
```
className="absolute bottom-24 right-8 z-20"
```
to:
```
className="absolute bottom-24 right-8 z-20 hidden xl:block"
```

This is a single class addition -- no structural changes needed.

