

# Fix Hero Section Bottom Border Gap

## Summary
Remove the visible gap/border at the bottom of the hero section by ensuring the SVG wave element renders flush with the section edge.

## Problem
The SVG element uses inline display by default, which can cause a small gap at the bottom due to how browsers handle baseline alignment for inline elements. This creates a visible border or line between the hero section and the next section.

## Solution
Add `block` display class to the SVG element to eliminate the baseline gap.

## Implementation

### Update Hero.tsx (line 284)

**Current code:**
```tsx
<svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
```

**Updated code:**
```tsx
<svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
```

## Technical Notes
- SVG elements default to `display: inline` which causes browsers to reserve space for text descenders (baseline alignment)
- Adding `block` display removes this space, ensuring the SVG sits flush at the bottom
- This is a common fix for gaps appearing below images and SVGs in HTML layouts

