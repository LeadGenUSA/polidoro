
# Show Entire Images in Hero Slideshow

## Summary
Update the slideshow to display complete images without cropping by changing the CSS object-fit property from `cover` to `contain`.

## Current Behavior
Images and videos use `object-cover` which:
- Fills the entire container
- Crops parts of the image to maintain aspect ratio
- May cut off important content on the edges

## Proposed Change
Change to `object-contain` which:
- Shows the entire image/video
- Maintains original aspect ratio
- May add letterboxing (bars on sides or top/bottom) with background color

## Technical Changes

**File:** `src/components/Hero.tsx`

| Location | Current | New |
|----------|---------|-----|
| Line 210 (linked slides) | `object-cover` | `object-contain` |
| Line 223 (regular slides) | `object-cover` | `object-contain` |

Additionally, I'll add a background color to the container so any letterboxing looks intentional (dark background to match the site theme).

### Code Changes

**Line 210** - Images/videos with clickable links:
```tsx
// From:
className="w-full h-auto object-cover aspect-video"
// To:
className="w-full h-auto object-contain aspect-video bg-primary/20"
```

**Line 223** - Images/videos without links:
```tsx
// From:
className="w-full h-auto object-cover aspect-video"
// To:
className="w-full h-auto object-contain aspect-video bg-primary/20"
```

## Visual Impact
- Images will now display in their entirety
- If an image doesn't match 16:9 aspect ratio, subtle dark bars will appear on sides/top/bottom
- The slideshow container size remains consistent
