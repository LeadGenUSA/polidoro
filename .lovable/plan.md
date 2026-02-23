

## Change Review Source Labels for Website vs Admin Submissions

### What Changes

When a customer submits a review through the public Reviews page, it should be labeled **"Website Review"** in the Admin area. When an admin submits one using a known admin email, it should be labeled **"Manual"** and auto-approved as it does today.

### Steps

**1. Add "website" to the `review_source` database enum**

Run a migration to add `'website'` as a new allowed value:

```sql
ALTER TYPE review_source ADD VALUE 'website';
```

This keeps existing `manual`, `google`, and `imported` values intact.

**2. Update `supabase/functions/submit-review/index.ts`**

Change the `source` field logic on line 186:

- If admin email --> `source: 'manual'` (unchanged)
- If regular customer --> `source: 'website'` (was `'manual'`)

```
source: isAdminSubmission ? 'manual' : 'website',
```

**3. Update `src/components/admin/ReviewCard.tsx`**

Add the new source label to the `sourceLabels` map:

```
website: 'Website Review',
```

**4. Update `src/hooks/useReviews.tsx`**

Add `'website'` to the `Review` interface's `source` union type:

```
source: 'google' | 'manual' | 'imported' | 'website';
```

### Summary

| Submitter | Source Label in Admin | Status |
|---|---|---|
| Customer via /reviews page | Website Review | Pending (needs approval) |
| Admin email via /reviews page | Manual | Auto-approved |
| Google import | Google | Per existing logic |
| Bulk import | Imported | Per existing logic |

No other files need changes. Existing reviews already labeled `manual` will remain as-is.

