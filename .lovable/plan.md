

# Show Call Button on iPad in Landscape Mode

## The Problem
On an iPad in landscape mode (1024px wide), the "CALL US!" button disappears because:
- The desktop CTA only appears at the `xl` breakpoint (1280px+), which iPads don't reach
- The mobile CTA is restricted to portrait orientation only (`portrait:flex`)

This creates a gap where no call button is visible on tablets in landscape.

## The Fix
Remove the portrait-only restriction from the mobile CTA button so it shows in both portrait and landscape orientations on devices below the `xl` breakpoint.

**File:** `src/components/Navbar.tsx` (line 226)

Change the class from:
```
xl:hidden portrait:flex hidden items-center
```
to:
```
xl:hidden flex items-center
```

This single class change ensures the call button appears on all sub-1280px screens regardless of orientation, including iPads in landscape mode.

## Technical Details
- Only one line changes in one file
- The desktop CTA (visible at `xl`+) remains unchanged
- No layout conflicts: the button sits between the nav links area and the hamburger menu, where there is adequate space in landscape

