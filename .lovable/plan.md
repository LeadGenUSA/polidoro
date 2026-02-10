
## Update Email Recipients Across All Forms

### Changes

Update the recipient email in **all 5 edge functions** from `mike@bigcityph.com` to `mike@bigcityplumbing.com`. Additionally, the **Work Order form** will send to three recipients: `mike@bigcityplumbing.com`, `diane@bigcityplumbing.com`, and `info@bigcityplumbing.com`.

### Files to Modify

| File | Current Recipient | New Recipient(s) |
|------|------------------|-------------------|
| `supabase/functions/send-contact-form/index.ts` | `mike@bigcityph.com` | `mike@bigcityplumbing.com` |
| `supabase/functions/send-estimate-form/index.ts` | `mike@bigcityph.com` | `mike@bigcityplumbing.com` |
| `supabase/functions/send-customer-survey/index.ts` | `mike@bigcityph.com` | `mike@bigcityplumbing.com` |
| `supabase/functions/submit-review/index.ts` | `mike@bigcityph.com` | `mike@bigcityplumbing.com` |
| `supabase/functions/send-work-order/index.ts` | `mike@bigcityph.com` | `mike@bigcityplumbing.com`, `diane@bigcityplumbing.com`, `info@bigcityplumbing.com` |

### Technical Detail

For the Work Order function, the recipients array on line 171 will change from:
```typescript
const recipients = ['mike@bigcityph.com'];
```
to:
```typescript
const recipients = [
  'mike@bigcityplumbing.com',
  'diane@bigcityplumbing.com',
  'info@bigcityplumbing.com',
];
```
The existing logic that appends an optional user-provided "Email To" address will remain unchanged.

All other functions are a simple find-and-replace of the email string.
