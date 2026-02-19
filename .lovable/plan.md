
## Shrink the Regions Logo Floating Card

### What's Changing

The Regions logo card currently uses `p-4` padding and the logo is `h-12`. The "Excellent Service" card uses `p-4` with a `w-12 h-12` inner icon, so the overall card heights are similar — but the logo card appears taller because the image itself is `h-12` plus two rounds of `p-4` (top and bottom).

To make the card sit comfortably inline with the others, two small tweaks:

1. **Reduce logo height** from `h-12` → `h-8`
2. **Reduce card padding** from `p-4` → `p-3`

### File Changed

- **`src/components/Hero.tsx`** — line 276–277 only
