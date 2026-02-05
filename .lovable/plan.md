
# Add "Default First Slide" Setting to Slideshow Management

## Overview
Add a checkbox/toggle to the Slideshow Manager that allows marking one image or video as the "default first" slide. This slide will always appear first in the slideshow, regardless of the display order of other items.

## Database Changes

### Add new column to `slideshow_items` table
- Add `is_default_first` boolean column (default: `false`)
- Only one item can have `is_default_first = true` at a time (enforced in application logic)

**Migration SQL:**
```sql
ALTER TABLE slideshow_items 
ADD COLUMN is_default_first BOOLEAN NOT NULL DEFAULT false;
```

## Code Changes

### 1. Update `src/hooks/useSlideshow.tsx`

- Add `is_default_first` to the `SlideshowItem` interface
- Add `setDefaultFirst(id: string)` function that:
  - Clears `is_default_first` from all other items
  - Sets `is_default_first = true` for the selected item
- Modify `fetchItems` to sort slides so the default first slide always appears at index 0
- Add `is_default_first` to the `updateItem` allowed fields

### 2. Update `src/components/admin/SlideshowManager.tsx`

- Add a "Set as First" checkbox/radio button to each slide item
- Show a star or pin icon next to the slide marked as default first
- Only one slide can be marked at a time (radio button behavior)
- Display visual indicator (badge/icon) for the default first slide
- Add the setting to the `SlideItemProps` interface and `onUpdate` handler

### 3. Update `src/components/Hero.tsx`

- Modify the slide fetching logic to respect `is_default_first`
- Sort fetched slides so `is_default_first = true` appears first, then by `display_order`

## UI Design

Each slide item in the manager will show:
- A star/pin icon toggle (or checkbox labeled "Show First")
- When checked, slide moves to position #1 visually
- Visual badge: "First Slide" indicator
- Only one slide can have this enabled at a time

```text
┌─────────────────────────────────────────────────────────────┐
│ [Thumbnail] Video #1  [15s]  [⭐ First Slide]               │
│             Alt text here...                                 │
│                                                              │
│             [Settings] [☑ Active] [Set as First ●] [Delete] │
└─────────────────────────────────────────────────────────────┘
```

## Technical Details

### Sorting Logic
When fetching slides for display:
```typescript
// Sort so default first slide always appears at index 0
const sortedSlides = data.sort((a, b) => {
  if (a.is_default_first) return -1;
  if (b.is_default_first) return 1;
  return a.display_order - b.display_order;
});
```

### Mutual Exclusivity
When setting a slide as default first:
```typescript
const setDefaultFirst = async (id: string) => {
  // Clear all other defaults first
  await supabase
    .from('slideshow_items')
    .update({ is_default_first: false })
    .neq('id', id);
  
  // Set the selected one
  await supabase
    .from('slideshow_items')
    .update({ is_default_first: true })
    .eq('id', id);
};
```

## Files to Modify
1. **Database migration** - Add `is_default_first` column
2. **`src/hooks/useSlideshow.tsx`** - Add interface field, sorting logic, and `setDefaultFirst` function
3. **`src/components/admin/SlideshowManager.tsx`** - Add UI toggle for each slide
4. **`src/components/Hero.tsx`** - Update sorting when fetching slides

## Summary
| Change | Purpose |
|--------|---------|
| Database column | Store which slide is marked as first |
| Hook update | Handle setting/clearing default and sorting |
| Admin UI | Checkbox/toggle to mark a slide as first |
| Hero component | Ensure default first slide displays first |
