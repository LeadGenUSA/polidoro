

## Hero Section Slideshow with Video

This plan transforms the current static hero image into an auto-playing slideshow that starts with your uploaded video and cycles through images.

### What You'll Get

The right side of the hero section (currently showing a single plumbing image) will become a slideshow that:
- **Starts with the video** playing automatically (muted, looping)
- **Cycles through images** after the video
- **Auto-advances** every 5 seconds (configurable)
- **Shows navigation dots** at the bottom so visitors can click to specific slides
- **Includes arrow controls** for manual navigation

### Slideshow Content Order

| Slide | Type | Content |
|-------|------|---------|
| 1 | Video | Big City Plumbing promo video (auto-plays muted) |
| 2 | Image | Hero plumbing image (existing) |
| 3+ | Images | Additional images can be added later |

### Implementation Steps

**1. Add the video file to the project**
- Copy `user-uploads://big_city_plumbing_and_heating_compressed.mp4` to `src/assets/`

**2. Update `src/components/Hero.tsx`**
- Import the Embla Carousel components and Autoplay plugin
- Import the video file
- Replace the static image container with a carousel component
- Configure the carousel with:
  - Autoplay with 5-second delay
  - Loop enabled for continuous cycling
  - Dot indicators for slide position
  - Previous/Next arrow controls
- Add video element with `autoPlay`, `muted`, `loop`, and `playsInline` attributes for mobile compatibility

**3. Install Embla Carousel Autoplay plugin**
- Add `embla-carousel-autoplay` package for automatic slide transitions

### Visual Layout

```text
┌─────────────────────────────────────────────────────────┐
│                    HERO SECTION                          │
├────────────────────────┬────────────────────────────────┤
│                        │   ┌────────────────────────┐   │
│   Expert Plumbing &    │   │                        │   │
│   Heating Solutions    │   │   [SLIDESHOW AREA]     │   │
│                        │   │                        │   │
│   "Serving Nassau..."  │   │   Slide 1: VIDEO       │   │
│                        │   │   Slide 2: Image       │   │
│   [Get Free Estimate]  │   │   ...                  │   │
│   [View Our Services]  │   │                        │   │
│                        │   │   ← ● ○ ○ →            │   │
│   Trust Badges...      │   └────────────────────────┘   │
│                        │                                 │
│                        │   [Floating 5★ Card]           │
└────────────────────────┴────────────────────────────────┘
```

### Technical Details

| Aspect | Implementation |
|--------|----------------|
| Video file | `src/assets/big-city-plumbing-and-heating.mp4` |
| Carousel library | Embla Carousel (already installed) |
| Autoplay plugin | `embla-carousel-autoplay` (new dependency) |
| Slide interval | 5 seconds between slides |
| Video playback | Auto-play, muted, looping, inline |
| Navigation | Dot indicators + arrow buttons |
| Responsive | Full-width slides that scale on all devices |

### Files to Modify

- **Copy**: Video file to `src/assets/big-city-plumbing-and-heating.mp4`
- **Edit**: `src/components/Hero.tsx` - Replace static image with carousel
- **Add**: `embla-carousel-autoplay` package dependency

