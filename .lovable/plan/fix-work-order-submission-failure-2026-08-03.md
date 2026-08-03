# Fix Work Order submission failure

## What's happening

The form now treats every text field as optional, but the backend still rejects any submission that is missing customer name, street address, phone, email, or job description. The most recent submission attempt hit the function and was rejected before any processing was logged, which matches this validation rejection.

The form also shows only a generic "There was an error submitting your work order" message, so the real reason is never visible.

## Changes

1. `supabase/functions/send-work-order/index.ts`
   - Drop the "Missing required fields" block so a work order can be submitted with any subset of fields filled in (matching the form).
   - Keep validating the email format only when an email was actually entered, and keep the strict allowlist for the optional additional recipient.
   - Fall back to a neutral subject line (e.g. "Work Order Submission") when no customer name or address is given.

2. `src/pages/WorkOrderForm.tsx`
   - Surface the actual error message returned by the backend in the failure toast instead of the generic text, so future issues are diagnosable.

Everything else stays as is: Turnstile bot check, email recipients, database record, and optional photos.
