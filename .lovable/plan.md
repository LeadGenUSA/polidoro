# Email the search results from Outlook 365

Add an "Email Results" button next to Export CSV in Admin → Form Submissions. It sends a message you write to every customer in the current search results, sent from your company Outlook 365 mailbox through Microsoft Graph.

## How it works

1. Search as you do today (for example `Boiler Type: NCB240 and Date Installed: 6/24/2021`).
2. Click **Email Results**. A dialog opens showing how many recipients were found in the results and lists their email addresses, with a note for any records that have no email (those are skipped).
3. You type a subject and a message. Optional placeholders you can use in either field:
   - `{{customer_name}}` — the customer's name on that record
   - `{{address}}` — their street address
   Each recipient gets their own copy with their own values filled in, so nobody sees the other addresses.
4. A confirmation step shows the recipient count before anything is sent.
5. Send. A progress result reports how many went out and lists any that failed with the reason.

Recipient addresses come from the record's email field; for imported records, any imported column whose heading looks like an email (for example "Email", "Customer Email") is used as well. Duplicate addresses are sent to once.

## Setup needed first

Connecting the Microsoft Outlook account is a one-time step: I'll open a connect card and you sign in with the company Outlook 365 mailbox that should appear as the sender. All admins then send from that same mailbox.

## Technical notes

- Link the `microsoft_outlook` standard connector (workspace-owned, shared mailbox) via `standard_connectors--connect`. All sends use that one account.
- New edge function `supabase/functions/send-outlook-bulk/index.ts`:
  - Admin-only: reuse `_shared/auth-guard.ts` `requireAdmin`; CORS from `npm:@supabase/supabase-js@2/cors`.
  - Zod validation of body: `subject` (1–255), `html` or `text` body (1–20000), `recipients` array (max 200) of `{ email, name?, address? }`; reject invalid emails and control characters.
  - Per-recipient `POST ${GATEWAY_URL}/me/sendMail` with `Authorization: Bearer ${LOVABLE_API_KEY}` and `X-Connection-Api-Key: ${MICROSOFT_OUTLOOK_API_KEY}`, body `{ message: { subject, body: { contentType: 'HTML', content }, toRecipients: [{ emailAddress: { address } }] } }`.
  - Escape user text with `_shared/escape-html.ts`, minify HTML and sanitize Unicode to ASCII per the project's email standards.
  - Sequential sends with a small delay; collect `{ email, ok, error }` per recipient; surface the gateway status and body on failure instead of a generic 500; return a summary with the same HTTP 200 unless the whole request is invalid.
  - Reuse `_shared/rate-limit.ts` to cap send bursts.
- New `src/components/admin/EmailResultsDialog.tsx`: recipient extraction (top-level `email` plus `extra_fields` headings normalising to contain "email"), dedupe, subject/body fields, placeholder substitution preview, confirm step, `supabase.functions.invoke('send-outlook-bulk')`, `FunctionsHttpError` context parsing for readable errors, result toast/summary list.
- `src/components/admin/SubmissionsManager.tsx`: add the button (Mail icon) next to Export CSV, passing `filteredSubmissions`; disabled when there are no recipients.
- No schema, table or policy changes.
