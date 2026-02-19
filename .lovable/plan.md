
## Shorten CTA Button Text at lg Breakpoint

### The Problem

At 1024px (iPad landscape), the desktop CTA button shows "CALL US! 631-361-9500" in full, which takes up too much horizontal space and crowds the nav links.

### The Fix

The desktop CTA button (lines 217–224) currently shows the full number at all `lg:` and above sizes. The solution is to show:

- **lg (1024px — iPad landscape):** "CALL US!" only — no phone number
- **xl (1280px+ — desktop):** Full "CALL US! 631-361-9500"

This is achieved by using Tailwind's responsive `hidden/inline` span utilities inside the single button:

```tsx
{/* CTA Button */}
<div className="hidden lg:flex items-center">
  <Button variant="navCta" size="lg" asChild>
    <a href="tel:631-361-9500" className="flex items-center gap-2">
      <Phone className="w-4 h-4" />
      CALL US!
      <span className="hidden xl:inline">631-361-9500</span>
    </a>
  </Button>
</div>
```

The phone number is wrapped in a `<span className="hidden xl:inline">` — invisible at `lg` (1024px), visible at `xl` (1280px+).

### File Changed

- **`src/components/Navbar.tsx`** — lines 219–222 only (the desktop CTA button content)
