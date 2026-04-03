

## Fix Video Autoplay and Skipping in Slideshow

### Problem
Every `<video>` in the carousel has `autoPlay` set, so **all videos start playing simultaneously** when the page loads — even the off-screen ones. This causes:
1. The first (visible) video may not autoplay due to browser restrictions on multiple concurrent autoplay requests
2. Off-screen videos play in the background and fire `onEnded`, which calls `api?.scrollNext()` prematurely, causing slides to skip

### Solution
Control video playback based on the **currently active slide index**. Only the visible slide's video should play; all others should be paused and reset.

### Changes

#### `src/components/Hero.tsx`
- **Add refs** to track all video elements (e.g., a `Map<number, HTMLVideoElement>`)
- **Remove** the static `autoPlay` attribute from all `<video>` tags
- **Add a `useEffect`** that watches `current` (the active slide index):
  - For the active slide: call `.play()` and reset `currentTime = 0`
  - For all other slides: call `.pause()` and reset `currentTime = 0`
- **Attach `ref` callbacks** on each `<video>` to register/unregister elements in the map
- Keep `onEnded={() => api?.scrollNext()}` unchanged — it will now only fire for the visible video
- Apply to both the link-wrapped and non-link-wrapped video elements (lines 225 and 238)

This ensures only one video plays at a time, the first slide's video starts correctly on load, and no background video triggers premature slide advancement.

