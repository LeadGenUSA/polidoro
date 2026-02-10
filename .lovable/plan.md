

## Fix Navbar Link Overlapping on iPad Landscape

### The Problem
An iPad in landscape mode has a viewport width of 1024px, which is exactly where Tailwind's `lg:` breakpoint kicks in. This forces the desktop navigation layout to display, but there isn't enough horizontal space for all 8 nav items, the logo, and the CTA button -- so links overlap.

### The Fix
Change the desktop/mobile breakpoint from `lg` (1024px) to `xl` (1280px). This means devices under 1280px wide (including iPad landscape) will use the hamburger mobile menu, which already works well.

### Technical Details

**Modified file: `src/components/Navbar.tsx`**

Replace all `lg:` responsive prefixes with `xl:` throughout the component:

- `hidden lg:flex` becomes `hidden xl:flex` (desktop nav and CTA)
- `lg:hidden` becomes `xl:hidden` (mobile CTA, hamburger button, mobile menu)
- `lg:px-8` becomes `xl:px-8` (container padding)

This is a straightforward find-and-replace of the breakpoint prefix -- no structural or logic changes needed.

