
# Fix Review Notification Email Encoding

## Problem
The review submission notification email arrives garbled because the `submit-review` edge function does not apply HTML minification before sending. All other email functions (`send-contact-form`, `send-work-order`, `send-customer-survey`, `send-estimate-form`) use a `compactEmailHtml()` helper to strip whitespace and newlines, preventing quoted-printable encoding artifacts like `=e2=94=81` and `=3d20`.

Additionally, the plain-text version uses Unicode box-drawing characters (`━`) and star symbols (`★☆`) that also get mangled. These should be replaced with ASCII equivalents.

## Changes

**File:** `supabase/functions/submit-review/index.ts`

1. Add the `compactEmailHtml` helper function (same as other edge functions)
2. Replace Unicode characters in the plain-text `content`:
   - Use `*` instead of `★` and `-` instead of `☆` for star ratings
   - Use `---` dashes instead of `━━━` box-drawing characters
3. Wrap the HTML email body with `compactEmailHtml()` before passing to `client.send()`
4. Also apply the same ASCII star replacement in the email subject line

## Technical Details
- The `compactEmailHtml` function strips all newlines and excess whitespace so the SMTP transport does not trigger quoted-printable line-wrapping on the HTML
- ASCII-safe characters in the subject and plain-text body prevent encoding issues in non-HTML parts
- This matches the pattern already established across all four other email edge functions
