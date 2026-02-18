
## Standardize Email Recipients Across All Forms

Currently, only the Work Order form sends to all three email addresses. The other four forms send only to `mike@bigcityplumbing.com`. This change updates them all to match.

### Current State

| Form | Current Recipients |
|---|---|
| Contact Form | mike@ only |
| Free Estimate | mike@ only |
| Customer Survey | mike@ only |
| Review Notification | mike@ only |
| Work Order | mike@, diane@, info@ (already correct) |

### Changes

**4 edge function files** will be updated to change the `to:` field from a single email string to an array of all three recipients:

```
["mike@bigcityplumbing.com", "diane@bigcityplumbing.com", "info@bigcityplumbing.com"]
```

The shared `send-email.ts` helper already supports arrays, so no changes needed there.

**Files to update:**
1. `supabase/functions/send-contact-form/index.ts` -- line 104
2. `supabase/functions/send-estimate-form/index.ts` -- line 181
3. `supabase/functions/send-customer-survey/index.ts` -- line 211
4. `supabase/functions/submit-review/index.ts` -- line 34

All four edge functions will be redeployed automatically after the changes.
