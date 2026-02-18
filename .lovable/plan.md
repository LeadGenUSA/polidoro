

## Remove "Call Us" Button from Hamburger Menu

The "CALL US! 631-361-9500" button currently appears inside the mobile hamburger menu, but a dedicated "CALL US!" button is already visible in the navbar bar itself for all viewports below 1280px. This makes the in-menu version redundant.

### Change

**File: `src/components/Navbar.tsx`**

Remove the `Button` element at the bottom of the mobile menu (the one wrapped in `<Button variant="navCta" size="lg" className="mt-2" asChild>` with the full phone number). This is located after the "Contact" link inside the mobile menu's `div`.

No other changes needed -- the always-visible mobile CTA button outside the hamburger menu already provides click-to-call access.
