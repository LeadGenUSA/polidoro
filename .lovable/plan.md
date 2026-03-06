

## Fix: Per-Slide Duration Not Respected in Autoplay

### Problem
The Embla `Autoplay` plugin is initialized once with a fixed `delay` (from the first slide's duration). When it advances, it always uses that same delay — it never reads the current slide's `duration_seconds`. So your 28-second video gets skipped after 15 seconds (or whatever the initial delay was).

### Solution
Use the Autoplay plugin's `delay` option as a per-slide function by hooking into the carousel's `select` event to dynamically update the autoplay timer. Specifically:

1. **In `Hero.tsx`**: After each slide transition (`api.on('select', ...)`), call `autoplayRef.current.stop()`, update the plugin's delay to match the current slide's `duration_seconds * 1000`, then call `autoplayRef.current.play()`. This resets the timer with the correct duration for each slide.

2. The initial `Autoplay({ delay: ... })` will keep a sensible default (e.g. 15000ms) — the per-slide override happens on each transition.

This is a small change isolated to the `useEffect` that handles the `api.on('select')` event (~10 lines modified).

