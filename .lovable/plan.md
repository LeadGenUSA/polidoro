# Fix Work Order Submission Error

## Confirmed diagnosis

The live `send-work-order` function is returning HTTP 400, while its preflight request succeeds. The database columns previously made optional are nullable, so the current failure occurs before the database insert.

The deployed function has three HTTP 400 paths: an invalid customer email, an additional recipient outside `@bigcityplumbing.com`, or failed bot verification. The form currently describes the additional recipient as a general email address, but the function only accepts company addresses. The frontend also hides the function's JSON error because it reads the response incorrectly, leaving only the generic “non-2xx” message.

## Implementation

1. **Align additional-recipient validation**
   - Allow any properly formatted email address in “Email TO,” as the form promises.
   - Continue blocking header injection by rejecting whitespace/control characters and enforcing a strict single-address format.
   - Keep the three standard company recipients unchanged.

2. **Make bot verification recoverable**
   - Remove the client-side fake bypass token on widget errors.
   - Require a real verification token and reset/expire it after a rejected submission so the user can complete a fresh challenge.
   - Preserve server-side verification; do not weaken bot protection.

3. **Show the real backend error**
   - Parse the function error response correctly on the Work Order form.
   - Display a short actionable message for invalid email, invalid recipient, and bot-verification failures instead of “edge function returned a non-2xx error.”

4. **Deploy and verify**
   - Deploy `send-work-order`.
   - Test a minimal submission with no photos and optional fields blank, plus a submission containing a valid external “Email TO” address.
   - Confirm a 2xx response, email delivery, and a saved `work_order_submissions` row.

## Technical scope

- `src/pages/WorkOrderForm.tsx`
- `src/components/TurnstileWidget.tsx`
- `supabase/functions/send-work-order/index.ts`
- No additional schema migration is expected because the relevant database columns are already nullable.