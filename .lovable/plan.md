

## Add Video Volume Controls Toggle

### Summary
Add a `show_volume_controls` boolean column to the `slideshow_items` table. Expose it as a checkbox in the admin SlideItem edit panel (visible only for video slides). On the frontend Hero, conditionally render videos with `controls` attribute and without `muted` when enabled.

### Database Migration
- Add column `show_volume_controls boolean not null default false` to `slideshow_items`

### File Changes

**`src/hooks/useSlideshow.tsx`**
- Add `show_volume_controls` to the `SlideshowItem` interface
- Include it in `updateItem` accepted fields
- Set default `false` in default slides

**`src/components/admin/SlideshowManager.tsx`**
- In the `SlideItem` edit panel, add a checkbox labeled "Show Volume Controls" (only visible when `item.type === 'video'`)
- Wire it to save via `onUpdate({ show_volume_controls: value })`
- Update `SlideItemProps.onUpdate` type to include `show_volume_controls`

**`src/components/Hero.tsx`**
- Add `show_volume_controls` to the `SlideItem` interface and fetch mapping
- For video elements: when `show_volume_controls` is true, add `controls` attribute and remove `muted`; otherwise keep current `muted` behavior

