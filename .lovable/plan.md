## Problem

In `src/hooks/useYouTubeVideos.tsx`, the public `useYouTubeVideos()` hook queries `youtube_videos` with no `is_active` filter. The RLS policy hides inactive rows from anonymous visitors, but when an admin is signed in (the "Admins can manage videos" policy applies), every row is returned — so toggling a video off in /admin still shows it on the public HowToVideos page for that admin session.

## Fix

Add `.eq('is_active', true)` to the query inside the public `useYouTubeVideos` hook (leave the admin hook untouched so admins can still see and manage hidden videos in /admin).

```ts
// useYouTubeVideos – public hook only
.from('youtube_videos')
.select('*')
.eq('is_active', true)
.order('published_at', { ascending: false });
```

No DB or admin changes needed.