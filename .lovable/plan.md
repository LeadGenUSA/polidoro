
## Show "Call Us" Button Outside Hamburger Menu on Mobile/Tablet (Portrait Only)

### What Changes
The "Call Us! 631-361-9500" button will be visible in the navbar on mobile and tablet devices without needing to open the hamburger menu -- but only when the device is held vertically (portrait orientation).

### How It Works
- A new "Call Us" button will appear next to the hamburger menu icon on screens smaller than `lg` (the desktop breakpoint).
- A CSS `portrait:` media query (supported by Tailwind via a custom utility or inline style) ensures it only shows in portrait orientation.
- On landscape orientation, the button hides automatically.
- On desktop (`lg` and up), the existing CTA button in the main nav remains unchanged.

### Technical Details

**File: `src/components/Navbar.tsx`**

1. Add a new mobile CTA button right before the hamburger menu button (around line 225), visible only on small screens in portrait orientation:

```tsx
{/* Mobile CTA - portrait only */}
<div className="lg:hidden portrait:flex hidden items-center">
  <Button variant="navCta" size="sm" asChild>
    <a href="tel:631-361-9500" className="flex items-center gap-1">
      <Phone className="w-4 h-4" />
      CALL US!
    </a>
  </Button>
</div>
```

2. Add the `portrait` variant to `tailwind.config.ts` if not already present, using Tailwind's `addVariant` or the built-in `@media (orientation: portrait)` screen definition.

No new dependencies, components, or database changes needed.
