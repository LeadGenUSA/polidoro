
## Clean Up Duplicate Reviews

### What happened
The Google Places API changed its timestamp format between imports (Unix epoch like `1671554996` vs ISO format like `2022-12-20T16:49:56.365586Z`). This caused different `google_review_id` values for the same review, bypassing the dedup logic.

### Fix (2 parts)

**1. Delete 5 duplicate rows from the database**

Remove the newer copies (created 2026-02-17) for these authors:
- Branko Yurisak
- Byron F. Morales
- Edd Hazell
- Krissy K
- Mike B

IDs to delete:
- `c92ecf08-4de4-4ebe-bd11-5dc44b3a1d0e`
- `a21e7b09-9c13-4c44-913c-158094460cfa`
- `3f5eece3-eed4-4fe9-9551-e29b2b835509`
- `de71a424-a188-49e4-b788-70da1cb5935b`
- `6aa57c1b-7a53-4dab-90d1-6bf02a1211c9`

**2. Update the Edge Function to normalize the `google_review_id`**

The root cause is that the `google_review_id` is built from `authorName_publishTime`, but the `publishTime` format changed between API versions. The fix is to normalize the ID by parsing the publish time to a consistent format (Unix timestamp) before creating the composite key, so future imports always match existing records regardless of API format changes.

### Files changed
- `supabase/functions/fetch-google-reviews/index.ts` (normalize google_review_id)
- Database: delete 5 duplicate rows
