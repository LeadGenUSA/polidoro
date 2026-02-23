

## Video Modal Playback

### What changes
When a user clicks the play button on a video thumbnail, instead of replacing the thumbnail with an inline iframe, a centered modal (dialog) will open with a large embedded YouTube player. Closing the modal stops playback.

### How it works
- Replace the current inline `playingVideo` iframe behavior with a Dialog modal
- Clicking a video's play button sets `playingVideo` to that video's `youtube_id`, which opens the Dialog
- The Dialog contains a responsive 16:9 iframe with the YouTube embed (autoplay enabled)
- Closing the Dialog (X button, overlay click, or Escape) sets `playingVideo` back to `null`, which stops the video
- Thumbnails always show as thumbnails in the grid (never replaced by iframes)

### Technical details

**File: `src/pages/HowToVideos.tsx`**
- Import `Dialog`, `DialogContent` from `@/components/ui/dialog`
- Remove the inline iframe branch from the thumbnail area (lines 118-125) so thumbnails always render
- The play button `onClick` stays the same: `setPlayingVideo(video.youtube_id)`
- Add a `Dialog` at the bottom of the component, controlled by `open={!!playingVideo}` and `onOpenChange` to clear `playingVideo`
- Inside `DialogContent`, render a responsive 16:9 iframe pointing to the selected video with `?autoplay=1`
- Use `max-w-4xl` on `DialogContent` for a large player area
- Find the selected video's title for the iframe `title` attribute

Only one file needs to change: `src/pages/HowToVideos.tsx`.
