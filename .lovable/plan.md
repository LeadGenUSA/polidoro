

## Update Sender Domain to bigcityplumbing.com

Now that `bigcityplumbing.com` is verified in Resend, update the default sender address back to use it.

### Change

In `supabase/functions/_shared/send-email.ts`, line 18:
- **From:** `"Big City Plumbing <noreply@bigcityplumber.com>"`
- **To:** `"Big City Plumbing <noreply@bigcityplumbing.com>"`

All five edge functions (`send-contact-form`, `send-work-order`, `send-estimate-form`, `send-customer-survey`, `submit-review`) will be redeployed automatically.

