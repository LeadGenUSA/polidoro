

## Fix Sender Domain to Verified Domain

The default "from" address in the shared email helper needs to be reverted to use `bigcityplumbing.com` (the verified Resend domain) instead of `bigcityplumber.com`.

### Change

In `supabase/functions/_shared/send-email.ts`, line 18:
- **From:** `"Big City Plumbing <noreply@bigcityplumber.com>"`
- **To:** `"Big City Plumbing <noreply@bigcityplumbing.com>"`

All five edge functions will be redeployed automatically after the change.

