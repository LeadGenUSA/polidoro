

## Video Autoplay + No Loop in Slideshow

### Changes in `src/components/Hero.tsx`

1. **Remove `loop` from video elements** — Change `loop` to no loop on all 4 video tags (2 with link_url, 2 without). Videos play once then stop; the carousel autoplay timer handles advancing to the next slide.

2. **Keep `autoPlay`** — Videos already have `autoPlay`, so they start automatically even with controls visible.

3. **Add `onEnded` handler** — When a video finishes playing, call `api?.scrollNext()` to immediately advance to the next slide rather than waiting for the full duration timer. This gives a smoother experience when the video is shorter than the configured duration.

### Summary of video tag changes
- Remove `loop` attribute
- Add `onEnded={() => api?.scrollNext()}` to advance slideshow when video ends
- Keep `autoPlay`, `playsInline`, and existing `muted`/`controls` logic unchanged

