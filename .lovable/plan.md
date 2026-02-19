
## Increase Regions Financing Card Size

### What's Changing

The Regions logo card currently sits at `h-8` (logo) with `p-3` (card padding). The other floating items reach about `h-20` (coupon badge) and ~`h-20` total for the "Excellent Service" card (icon + text + padding). The Regions card needs to grow a bit to feel balanced without wrapping to a second line.

### Adjustment

In `src/components/Hero.tsx`, line 277:

- **Logo height**: `h-8` → `h-10`  
- **Card padding**: keep at `p-3` (no change needed — just the logo getting taller is enough to bring the card up to a comfortable size without overshooting)

This gives the card an overall height closer to the other two items while remaining safely inline on all screen sizes.

### File Changed

- **`src/components/Hero.tsx`** — one-line change on line 277
