
## Fix Mobile Menu Text Contrast

### Problem
The mobile menu text color still checks only `isScrolled` to decide between dark text (`text-foreground`) and white text (`text-primary-foreground`). Since the background fix now applies a solid white/card background when the menu is open, the white text becomes unreadable.

### Solution
Update all mobile menu text color conditionals to also consider `isMobileMenuOpen`, so text is always dark when the menu is open.

### Technical Changes

In `src/components/Navbar.tsx`, update every instance in the mobile menu section (and the hamburger button itself) where the pattern:

```
isScrolled ? 'text-foreground' : 'text-primary-foreground'
```

appears, changing it to:

```
(isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'
```

This affects approximately 10 occurrences:
- The hamburger/X button (line ~227)
- Mobile Home link (line ~242-243)
- Mobile About link (line ~253-254)
- Mobile "Services" label (line ~262)
- Mobile service sub-links (line ~271-272)
- Mobile Projects link (line ~283-284)
- Mobile Reviews link (line ~293-294)
- Mobile How-To Videos link (line ~303-304)
- Mobile "Links" label (line ~313)
- Mobile external/internal links (line ~325-326, ~333-334)
- Mobile Contact link (line ~345-346)

No new styles or components needed -- just adding `|| isMobileMenuOpen` to each existing conditional.
