

## Fix Transparent Mobile Menu Background

### Problem
When users open the hamburger menu at the top of the page on iPhone/iPad, the navbar background is transparent (`bg-transparent`), making the mobile menu items nearly invisible against the page content behind them.

### Solution
When the mobile menu is open, force the navbar to have a solid background regardless of scroll position. This ensures the menu is always readable.

### Technical Change

In `src/components/Navbar.tsx`, update the navbar's background class logic (around line 80) to also apply the solid background when `isMobileMenuOpen` is true:

```
bg-card/95 backdrop-blur-md shadow-card
```

will apply when `isScrolled` OR `isMobileMenuOpen`, instead of only when `isScrolled`.

This is a single-line conditional change -- no new components or styles needed.

