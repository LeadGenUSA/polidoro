

## Problem

The HowToVideos schema fix is correct in code, but Google Search Console is still showing the OLD broken schema (e.g., `"uploadDate":"2022-01-01"` with no `description`, titles matching old fallback videos like "Brownstone in East New York"). Two things are happening:

1. **Deployment lag** — Google has cached the pre-fix HTML. The fix exists in code but Google hasn't re-crawled.
2. **SSR gap** — This is a client-side React SPA. The initial `index.html` Google receives has NO video schema at all. The schema only appears after JS executes and Supabase data loads. Google's renderer usually executes JS, but the validator tool sometimes captures the pre-render snapshot, which can leave stale fallback data showing.

The fallback videos (`fallbackVideos` array in `HowToVideos.tsx`) are now redundant — the database has 27 real videos with proper ISO 8601 timestamps. The fallback only existed as a safety net but is the source of the bad data Google saw.

## Fix

Make 2 changes to `src/pages/HowToVideos.tsx`:

### 1. Remove the `fallbackVideos` array entirely
The DB has 27 active videos with valid `published_at` timestamps in proper ISO format (e.g., `2023-10-10 01:37:38+00`). Remove the fallback so the schema is only ever built from real data. If the DB ever returns empty, the page renders no videos and no `VideoObject` schema — which is correct behavior (no false data emitted).

### 2. Only emit the schema when videos are loaded AND non-empty
Wrap the `<SEO schemaJson={...} />` so it only passes the schema when `videos.length > 0`. This prevents emitting an empty `ItemList` while loading.

### After deploy

1. **Publish the site** so the fix actually goes live.
2. In Google Search Console, use **"Validate Fix"** on the video issues report. Google will re-crawl `/how-to-videos` and see the corrected schema with full ISO timestamps + descriptions on all 27 real videos.
3. Optionally use the **URL Inspection Tool** → "Test Live URL" on `https://www.bigcityplumbing.com/how-to-videos` to confirm the new schema is detected before requesting validation.

### File changed (1)
- `src/pages/HowToVideos.tsx` — remove fallback array; only render schema when videos load

