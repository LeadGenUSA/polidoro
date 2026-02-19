
## Show Desktop Nav Links on iPad Landscape

### Background

The Navbar currently uses the `xl` breakpoint (1280px) to switch between the hamburger/mobile menu and the full desktop nav. This was intentionally set wide to prevent link crowding on iPad landscape. However, you now want the full nav links visible on iPad landscape (1024px wide), with the hamburger menu still used on iPad portrait (768px).

### The Fix

Change every `xl:` breakpoint reference in `src/components/Navbar.tsx` to `lg:` (1024px). This single change affects:

- Desktop nav bar: `hidden xl:flex` → `hidden lg:flex`
- Desktop CTA call button (large): `hidden xl:flex` → `hidden lg:flex`
- Mobile CTA call button (small): `xl:hidden` → `lg:hidden`
- Mobile hamburger menu button: `xl:hidden` → `lg:hidden`
- Mobile slide-down menu panel: `xl:hidden` → `lg:hidden`

After this change:
- **iPad portrait (768px)** — hamburger menu, as before
- **iPad landscape (1024px)** — full desktop nav links visible
- **Desktop (1280px+)** — full desktop nav links visible, as before

### Note on Link Spacing

At 1024px the nav bar will be tighter than at 1280px. The current `gap-8` between links may be slightly snug but should fit. If any links appear to wrap or overlap after the change, the gap or font size can be adjusted as a follow-up.

### File Changed

- **`src/components/Navbar.tsx`** — replace all 5 occurrences of `xl:` breakpoints with `lg:` (lines 91, 217, 227, 238, 247)
