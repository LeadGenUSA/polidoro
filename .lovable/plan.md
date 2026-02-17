# Add "Financing Available" Floating Box to Hero

## Overview

Add a floating box next to the existing coupon badge below the hero slideshow, styled similarly to the "5-star" floating card, saying "Financing Available". It will use a placeholder link for now that you can update later.

## Change

**File: `src/components/Hero.tsx**`

In the "Floating Card - Below Slideshow" section (around line 271-273), add a new floating box after the coupon badge image:

- A styled card matching the existing floating card aesthetic (`bg-card`, `rounded-2xl`, `shadow-large`, `animate-float`)
- Contains  "Financing Available" text
- Wrapped in a link (`<a>`) with a placeholder `href="#"` so you can swap in the real URL later
- Uses the same `animate-float` animation with a staggered delay for visual appeal

The final floating row will show: **5-star card** | **Coupon badge** | **Financing Available box**

## Technical Details

- Add a new `<a href="#" ...>` element after the coupon badge `<Link>`, containing:
  - The NaviLend logo image (sized to ~40px)
  - Text: "Financing Available"
- Styled with `bg-card p-4 rounded-2xl shadow-large animate-float animation-delay-400 hover:scale-105 transition-transform`