

## Fix Duplicate Google Reviews on Import

### Problem
When importing Google reviews, duplicates appear because:
1. There is no unique constraint on the `google_review_id` column, so the database allows duplicate entries even with the same ID.
2. The dedup check relies on an in-memory Set comparison that can fail if timestamps differ slightly between API calls.

### Fix (2 changes)

**1. Database migration: Add a unique partial index on `google_review_id`**

```sql
CREATE UNIQUE INDEX IF NOT EXISTS reviews_google_review_id_unique
ON public.reviews (google_review_id)
WHERE google_review_id IS NOT NULL;
```

This prevents duplicate `google_review_id` values at the database level while allowing multiple NULL values (for website/manual reviews that don't have one).

**2. Update `supabase/functions/fetch-google-reviews/index.ts`**

Change the insert call to use upsert with `ignoreDuplicates: true` so that even if the in-memory filter misses a duplicate, the database silently skips it instead of creating a second row:

```typescript
const { error: insertError } = await supabaseAdmin
  .from('reviews')
  .upsert(newReviews, { onConflict: 'google_review_id', ignoreDuplicates: true });
```

### What This Achieves
- The unique index is the real safety net -- duplicates become impossible at the database level.
- The upsert with `ignoreDuplicates` prevents insert errors when a duplicate is encountered.
- Existing duplicate rows in the database will need to be cleaned up manually (the migration only prevents future duplicates; if there are current dupes, I can delete them as a separate step).

### Files Changed
- New migration SQL file (unique index)
- `supabase/functions/fetch-google-reviews/index.ts` (upsert instead of insert)

