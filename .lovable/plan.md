
## Reduce Nav Link Gap at lg Breakpoint

### What's Changing

Line 91 of `src/components/Navbar.tsx` has the desktop nav container:

```tsx
<div className="hidden lg:flex items-center gap-8">
```

`gap-8` (32px) applies at all sizes from 1024px up. The fix is to use a responsive gap so:

- **lg (1024px — iPad landscape):** `gap-5` (20px) — tighter, prevents bunching
- **xl (1280px+ — desktop):** `gap-8` (32px) — spacious, as before

### Change

```tsx
// Before
<div className="hidden lg:flex items-center gap-8">

// After
<div className="hidden lg:flex items-center gap-5 xl:gap-8">
```

### File Changed

- **`src/components/Navbar.tsx`** — line 91 only
