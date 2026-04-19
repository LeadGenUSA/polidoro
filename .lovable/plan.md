
Google Search Console flagged 3 issues on the VideoObject schema in the How-To Videos page (`HowToVideos.tsx`):

1. **Missing `description`** — schema doesn't include it
2. **`uploadDate` missing timezone** — uses bare `2024-01-01` 
3. **Invalid `uploadDate` value** — fallback dates are placeholders, not real upload dates

## Root Cause

In `src/pages/HowToVideos.tsx`, `videosSchema` is built from the static `fallbackVideos` array (placeholder dates like `'2024-01-01'`) and never includes `description`. It also never reflects real DB videos because schema is computed at module load, before the hook fetches data.

## Fix

Rewrite the schema generation in `src/pages/HowToVideos.tsx`:

1. **Move schema inside the component** so it uses live `videos` from the `useYouTubeVideos` hook (which has real `published_at` timestamps from YouTube API in proper ISO 8601 format with timezone, e.g. `2024-03-15T18:30:00Z`).

2. **Add `description` field** to each VideoObject — use `video.description` when available, otherwise fall back to a generated string like `` `${video.title} - Plumbing and heating video by Big City Plumbing & Heating Inc.` ``.

3. **Fix `uploadDate`** with a safe helper:
   - If `published_at` is a valid date → `new Date(published_at).toISOString()` (gives full ISO 8601 with `Z` UTC timezone)
   - If invalid/missing → omit the field entirely (better than emitting bad data)

4. **Update fallback data** so the placeholder dates use full ISO format with timezone (`2024-01-01T00:00:00Z`) — this only matters until DB sync runs, but prevents bad data if fallback ever ships.

5. Pass the dynamically-built schema to `<SEO schemaJson={videosSchema} />`.

### File changed (1)
- `src/pages/HowToVideos.tsx`

After deploy, request re-validation in Search Console — the 4 video items should turn green.
