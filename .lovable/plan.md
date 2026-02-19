
## Fix: Align "PreQualify Now" Buttons Across All Financing Cards

### Root Cause

Each loan card is a flex column (`flex flex-col`). Inside the card body, the description `<p>` has `flex-1` applied, which is meant to push the button down. However, the **subtitle text wraps to different lengths** across the three cards (e.g., "No Payments or Interest for 12 Months" wraps to two lines on some screen sizes), causing the description block to start at different vertical offsets — and therefore the button lands at inconsistent heights.

### Fix

In `src/pages/Financing.tsx`, restructure the card body so:

1. A single `div` with `flex-1` contains the title, subtitle, and description — this block absorbs all the extra space.
2. The button and disclaimer sit **below** that block in a separate non-growing section, so they are always anchored to the bottom of the card.

**Before (simplified):**
```
card body (flex flex-col flex-1)
  ├─ h3 title
  ├─ p subtitle
  ├─ p description  ← flex-1 here
  ├─ Button         ← floats at different heights
  └─ p disclaimer
```

**After:**
```
card body (flex flex-col flex-1)
  ├─ div (flex-1)   ← grows to fill space
  │   ├─ h3 title
  │   ├─ p subtitle
  │   └─ p description
  ├─ Button         ← always at same vertical position
  └─ p disclaimer
```

### File Changed

- **`src/pages/Financing.tsx`** — Wrap the title/subtitle/description in a `<div className="flex-1">` and remove `flex-1` from the description `<p>`. Remove `mb-6 flex-1` from the description and use `mb-6` on the wrapper div instead. Remove `mt-auto` from the disclaimer since it's no longer needed.
