

## Auto-Import YouTube Videos

### Overview
Replace the hardcoded video list with live data fetched from the YouTube Data API v3, cached in the database to avoid hitting API quotas on every page load.

### Prerequisites
- A **YouTube Data API v3 key** is needed. The existing `GOOGLE_PLACES_API_KEY` may work if the YouTube Data API is enabled on the same Google Cloud project, but it's safer to add a dedicated secret. You'll need to provide a Google API key with YouTube Data API v3 enabled.

### Architecture

1. **New database table: `youtube_videos`** -- caches video data so the page loads instantly without calling YouTube every time
   - `id` (uuid, PK)
   - `youtube_id` (text, unique) -- the YouTube video ID
   - `title` (text)
   - `description` (text)
   - `thumbnail_url` (text)
   - `duration` (text) -- formatted like "1:23"
   - `view_count` (text)
   - `published_at` (timestamptz)
   - `is_active` (boolean, default true) -- allows hiding specific videos
   - `category` (text, nullable) -- optional admin-assigned category
   - `created_at` / `updated_at` (timestamptz)
   - RLS: anyone can SELECT active videos; admins can manage all

2. **New edge function: `fetch-youtube-videos`** (admin-only)
   - Calls YouTube Data API `search.list` for channel `UC8fcDyolqilmFXHt8pg377Q` to get all video IDs
   - Then calls `videos.list` to get duration, view count, and other details
   - Upserts results into `youtube_videos` table (updating view counts, etc.)
   - Uses `YOUTUBE_API_KEY` secret (will prompt you to add it)
   - Deduplicates by `youtube_id` unique constraint

3. **Update `src/pages/HowToVideos.tsx`**
   - Fetch videos from `youtube_videos` table instead of using the hardcoded array
   - Keep the category filter UI (categories will come from the data)
   - Show a loading spinner while fetching
   - Fall back to the current hardcoded list if the table is empty (first-time safety net)

4. **Add "Sync Videos" button to Admin dashboard**
   - New admin section tab or button within an existing section
   - Calls the `fetch-youtube-videos` edge function
   - Shows success/error feedback
   - Optionally allows toggling `is_active` and setting categories per video

### Technical Details

**Database migration:**
```sql
CREATE TABLE public.youtube_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  duration text,
  view_count text,
  published_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  category text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active videos"
  ON public.youtube_videos FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage videos"
  ON public.youtube_videos FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

**Edge function (`fetch-youtube-videos/index.ts`):**
- Authenticates admin user via JWT
- Fetches channel videos using YouTube Data API v3 `search.list` (type=video, channelId, maxResults=50, order=date)
- Fetches video details (duration, viewCount) via `videos.list` with `contentDetails,statistics` parts
- Parses ISO 8601 duration (PT1M23S) into human-readable format (1:23)
- Upserts all results into `youtube_videos` with `onConflict: 'youtube_id'`

**Frontend changes:**
- Query `youtube_videos` table ordered by `published_at DESC`
- Remove hardcoded `videos` array
- Derive category filter options dynamically from the data
- Add loading state with spinner

### Files Changed
- New migration SQL (create `youtube_videos` table + RLS)
- New `supabase/functions/fetch-youtube-videos/index.ts`
- Update `supabase/config.toml` (add `verify_jwt = false` for new function)
- Update `src/pages/HowToVideos.tsx` (fetch from DB)
- Update `src/pages/Admin.tsx` (add Sync Videos button)
- New secret: `YOUTUBE_API_KEY`

