

## Fix First Video Not Auto-Playing

### Problem
On initial page load, the video playback `useEffect` runs when `current = 0`, but at that point the video element hasn't been registered in the `videoRefs` map yet (the carousel/video haven't mounted). When the video ref callback later fires and registers the element, nothing triggers the playback effect again because `current` is still `0`.

### Solution
Add a small trigger mechanism so the first video starts playing once it's actually registered in the ref map.

### Changes — `src/components/Hero.tsx`

1. **Track video ref registration with a counter state** — add a `videoRefsReady` state counter that increments each time a video ref is registered via the callback. Include it as a dependency in the playback `useEffect`.

2. **Update video ref callbacks** — when a video element is registered in the map, increment the counter to re-trigger the playback effect.

3. **Playback effect** — add `videoRefsReady` to the dependency array of the existing coordination `useEffect` so it re-runs when new video elements mount:

```tsx
const [videoRefsReady, setVideoRefsReady] = useState(0);

// ref callback becomes:
ref={(el) => {
  if (el) {
    videoRefs.current.set(index, el);
    setVideoRefsReady(c => c + 1);
  } else {
    videoRefs.current.delete(index);
  }
}}

// playback effect adds videoRefsReady:
useEffect(() => {
  videoRefs.current.forEach((video, idx) => {
    if (idx === current) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
}, [current, slides, videoRefsReady]);
```

This ensures that when the first video element mounts and registers its ref, the playback effect fires and starts playing it.

