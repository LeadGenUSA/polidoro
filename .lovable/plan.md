

# Add Navilend Logo to Hero Section

## Summary
Add the Navilend logo graphic to the bottom right corner of the hero section, positioned above the wave element.

## Implementation Steps

### 1. Copy the image asset
- Save the uploaded Navilend logo as `src/assets/navilend-logo.png`

### 2. Update Hero.tsx

**Add import** (around line 3):
```typescript
import navilendLogo from '@/assets/navilend-logo.png';
```

**Add logo element** (before the Bottom Wave section, around line 272):
```tsx
{/* Navilend Logo - Bottom Right */}
<div className="absolute bottom-24 right-8 z-20">
  <img 
    src={navilendLogo} 
    alt="Navilend" 
    className="h-8 md:h-10 w-auto opacity-90"
  />
</div>
```

## Technical Notes
- Using `absolute` positioning with `bottom-24` to place it above the wave
- `right-8` positions it at the right edge with some padding
- `z-20` ensures it appears above the gradient overlays but doesn't interfere with interactive elements
- Responsive sizing: `h-8` on mobile, `h-10` on desktop
- Slight opacity (`opacity-90`) to blend with the hero aesthetic

