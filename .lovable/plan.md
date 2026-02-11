

## Move Coupons Badge Next to Happy Customers Card

### Change

Move the coupon badge image from its current position (right side, separated from the Happy Customers card) to sit directly beside the Happy Customers card in the same row. This eliminates the overlap issue with the Navilend logo on iPad by keeping both elements grouped together on the left/center.

### File: `src/components/Hero.tsx` (lines 258-274)

The floating card container currently uses `justify-between` which pushes the coupon badge to the far right. The change:

1. Replace `justify-between` with `justify-start` so both items sit together
2. Wrap the coupon image inside the same card-style container for visual consistency, or simply keep it adjacent with a small gap
3. Also hide the Navilend logo on screens below `xl` (line 280) to prevent any remaining overlap

**Before:**
```
<div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
  <!-- Happy Customers card -->
  <!-- Coupon badge (pushed to far right) -->
</div>
```

**After:**
```
<div className="mt-6 flex items-center gap-4 flex-wrap">
  <!-- Happy Customers card -->
  <!-- Coupon badge (now sits right next to it) -->
</div>
```

Additionally, the Navilend logo container on line 280 gets `hidden xl:block` added to prevent overlap on tablets.

