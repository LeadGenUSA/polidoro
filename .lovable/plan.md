## New Edge Function: `send-app-service-request`

Mobile-app-only endpoint that emails service requests to mike@bigcityplumbing.com via Resend (using the existing `_shared/send-email.ts` helper — same provider as the contact form). No Turnstile.

### Files
- **`supabase/functions/send-app-service-request/index.ts`** (new)
  - POST handler, CORS, OPTIONS preflight.
  - Parse `{ name, phone, email, address, serviceType, message, secret }`.
  - Compare `secret` to `Deno.env.get("APP_FORM_SECRET")` using constant-time compare; mismatch → `401 { error: "unauthorized" }`.
  - Basic validation (required fields, max lengths, valid email shape) → `400` on failure. `serviceType` optional.
  - Build branded HTML email (navy/orange styling matching contact form), HTML-escape all user fields.
    - Customer Information section: Name, Phone, Email, Address, **Service type** (own labeled line, shown when provided).
    - Message section.
  - Subject: `App Service Request (<serviceType>): <name>` when serviceType is present, else `App Service Request: <name>`.
  - Send via `sendEmail({ to: ["mike@bigcityplumbing.com"], subject, html, replyTo: email })`.
  - Return `{ ok: true }` on success, `{ ok: false, error }` on failure.

### Rate limiting (please confirm)
The backend has no standard rate-limiting primitive. I'll add an **ad-hoc in-memory limiter** inside the function: `Map<ip, timestamps[]>` keyed by `x-forwarded-for`, allowing **5 requests / minute / IP** (returns `429` when exceeded). Caveats: per-instance state, resets on cold start, IP can be spoofed. For durable cross-instance limiting we'd need a DB-backed counter — say the word.

### Secrets
- Auto-generate `APP_FORM_SECRET` (32-char random); I'll share the value back.
- Reuses existing `RESEND_API_KEY`.

### Config
- No `supabase/config.toml` change — Lovable-managed functions default to `verify_jwt = false`.

### Deliverables after build
1. Function URL: `https://wjaulyvqzywcnkegnzoh.supabase.co/functions/v1/send-app-service-request`
2. Anon key (already public)
3. Generated `APP_FORM_SECRET` value

### Open question
You mentioned "two more things" but only one came through (serviceType). What's the second addition?
