# Rotate `APP_FORM_SECRET` with a freshly generated random value

## Steps

1. **Delete** the existing `APP_FORM_SECRET` (required — `generate_secret` only creates new secrets, it won't overwrite an existing one).
2. **Generate** a new `APP_FORM_SECRET` as a cryptographically random 48-character alphanumeric string, stored encrypted as a backend env var.
3. The new value is immediately available to the `send-app-service-request` edge function — no code changes, no redeploy needed.

## How you get the value

Lovable Cloud secrets are write-only after creation, so I can't print the value in chat. After I generate it, open **Cloud → Secrets**, find `APP_FORM_SECRET`, and copy it from there. (Newly created secrets are revealable in the UI for a short window right after creation, which is the only way to retrieve a backend-generated value.)

If the reveal still doesn't work after generation, fallback is the manual route: I delete it again and you set your own value via the secure update form, where you keep the value as you type it.

## After rotation, you'll have

1. **Function URL** — `https://wjaulyvqzywcnkegnzoh.supabase.co/functions/v1/send-app-service-request`
2. **Anon key** — `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqYXVseXZxenl3Y25rZWduem9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTYzODUsImV4cCI6MjA4NTEzMjM4NX0.qlt8PJNz2KCp4d1-JyMP2eymvUy_hyBVpQDHfIZwfnI`
3. **APP_FORM_SECRET** — copy from Cloud → Secrets after I generate it

## Heads-up

Any mobile app build hard-coded with the old secret will stop authenticating until you ship an update with the new value.
