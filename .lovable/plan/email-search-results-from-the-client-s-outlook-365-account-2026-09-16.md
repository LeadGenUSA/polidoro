# Email search results from the client's Outlook 365 account

Sending will use the client's Outlook 365 mailbox only. Your own Microsoft account is never used and is not involved in the setup.

## How the account gets used

One connect card is opened in chat. On that card, sign in with the client's Outlook 365 login (the one you have) — whichever account signs in there becomes the only sending account. Nothing is read from or sent through your account.

Once connected:
- Every message goes out from the client's mailbox and lands in their Outlook 365 Sent Items.
- Replies from customers come back to the client's mailbox.
- The connection can be swapped or removed later at any time.

## What gets built

An "Email Results" button next to Export CSV in Admin - Form Submissions.

1. Search as you do today (for example `Boiler Type: NCB240 and Date Installed: 6/24/2021`).
2. Click Email Results. A dialog shows how many recipients were found, lists their addresses, and notes any records with no email (those are skipped).
3. Type a subject and message. Optional placeholders `{{customer_name}}` and `{{address}}` fill in per person. Each recipient gets their own copy, so nobody sees the other addresses.
4. A confirmation step shows the recipient count before anything is sent.
5. A result summary reports how many went out and which failed, with the reason.

Addresses come from the record's email field plus, for imported records, any imported column whose heading looks like an email. Duplicates are sent to once.

## Technical notes

- Link the `microsoft_outlook` standard connector with the client's account (`standard_connectors--connect`). The signed-in account on that card is the sender; no builder account is used.
- New edge function `supabase/functions/send-outlook-bulk/index.ts` (already drafted):
  - Admin-only via `_shared/auth-guard.ts` `requireAdminOrService`; CORS from `npm:@supabase/supabase-js@2/cors`; burst cap via `_shared/rate-limit.ts`.
  - Validates subject (1-255), body (1-20000), recipients (max 200, valid addresses, no control characters or recipient-list injection).
  - Per recipient: `POST https://connector-gateway.lovable.dev/microsoft_outlook/me/sendMail` with `Authorization: Bearer ${LOVABLE_API_KEY}` and `X-Connection-Api-Key: ${MICROSOFT_OUTLOOK_API_KEY}`, `saveToSentItems: true`.
  - Escapes user text with `_shared/escape-html.ts`, sanitizes Unicode to ASCII; returns per-recipient `{ email, ok, error }` and surfaces the gateway status and body instead of a generic 500.
  - Returns a clear "not connected yet" message if the connector key is absent.
- New `src/components/admin/EmailResultsDialog.tsx`: recipient extraction (top-level `email` plus `extra_fields` headings containing "email"), dedupe, subject/body fields, placeholder preview, confirm step, `supabase.functions.invoke('send-outlook-bulk')`, `FunctionsHttpError` parsing, result summary.
- `src/components/admin/SubmissionsManager.tsx`: Mail-icon button next to Export CSV, passing `filteredSubmissions`; disabled when no recipients.
- Deploy `send-outlook-bulk` after the connection is linked. No schema, table or policy changes.
