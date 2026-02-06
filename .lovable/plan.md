

# Add Outer Glow to Navilend Logo

## Summary
Add a glowing effect to the Navilend logo in the Hero section to improve visibility against the dark background.

## Implementation

### Update Hero.tsx

**Current code** (lines 273-278):
```tsx
<img 
  src={navilendLogo} 
  alt="Navilend" 
  className="h-8 md:h-10 w-auto opacity-90"
/>
```

**Updated code**:
```tsx
<img 
  src={navilendLogo} 
  alt="Navilend" 
  className="h-8 md:h-10 w-auto opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all"
/>
```

## Technical Notes
- Using Tailwind's arbitrary `drop-shadow` utility which applies a CSS filter that follows the image's actual shape (not the bounding box)
- White glow (`rgba(255,255,255,0.6)`) provides good contrast against the dark navy hero background
- `8px` blur radius creates a subtle but visible glow
- Added a slightly stronger glow on hover for interactivity
- `transition-all` smoothly animates the hover effect
- This approach works better than `box-shadow` for images with transparency

